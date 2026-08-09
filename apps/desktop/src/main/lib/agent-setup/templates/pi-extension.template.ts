{{MARKER}}
/**
 * Superset AA Runtime Bridge v2 for Pi.
 *
 * Observes Pi's structured extension events and forwards the minimum AA
 * runtime contract envelope through Superset's managed notify hook. It never
 * includes prompts, transcripts, tool arguments/results, environment dumps,
 * or credentials. The real Pi TUI and PTY transport remain untouched.
 */

import type {
	ExtensionAPI,
	ExtensionContext,
	ModelSelectEvent,
	SessionShutdownEvent,
	SessionStartEvent,
	ThinkingLevelSelectEvent,
	ToolExecutionEndEvent,
	ToolExecutionStartEvent,
	ToolExecutionUpdateEvent,
} from "@earendil-works/pi-coding-agent";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONTRACT_VERSION = "0.1" as const;

type CapabilitySupport =
	| "available"
	| "unavailable"
	| "conditional"
	| "unknown";

function capability(support: CapabilitySupport, reason: string | null = null) {
	return { support, reason };
}

function runtimeModel(model: ExtensionContext["model"]) {
	if (!model) return null;
	return {
		provider: typeof model.provider === "string" ? model.provider : null,
		id: model.id,
		displayName:
			typeof model.name === "string" && model.name.length > 0
				? model.name
				: null,
	};
}

function selectedModel(model: ModelSelectEvent["model"]) {
	return {
		provider: typeof model.provider === "string" ? model.provider : null,
		id: model.id,
		displayName:
			typeof model.name === "string" && model.name.length > 0
				? model.name
				: null,
	};
}

function runtimeReasoning(level: ExtensionContext["thinkingLevel"]) {
	return typeof level === "string"
		? { value: level, availableValues: null }
		: null;
}

export default function (pi: ExtensionAPI) {
	const terminalId = process.env.SUPERSET_TERMINAL_ID;
	const workspaceId = process.env.SUPERSET_WORKSPACE_ID;
	if (!terminalId || !workspaceId) return;

	const supersetHome =
		process.env.SUPERSET_HOME_DIR || join(homedir(), ".superset");
	const notifyScript = join(supersetHome, "hooks", "notify.sh");
	if (!existsSync(notifyScript)) return;

	// One epoch per extension/adapter incarnation. Pi tears down and recreates
	// the extension runtime on session replacement, producing a fresh epoch.
	const epoch = randomUUID();
	let sequence = 0;
	let deliveryQueue = Promise.resolve();

	const skip = (ctx: ExtensionContext) =>
		ctx.hasUI === false || ctx.mode === "print" || ctx.mode === "json";

	const dispatch = (observation: Record<string, unknown>) =>
		new Promise<void>((resolve) => {
			try {
				const child = spawn(notifyScript, [], {
					stdio: ["pipe", "ignore", "ignore"],
					detached: true,
					env: { ...process.env, SUPERSET_AGENT_ID: "pi" },
				});
				let finished = false;
				const finish = () => {
					if (finished) return;
					finished = true;
					resolve();
				};
				child.once("error", finish);
				child.once("exit", finish);
				child.stdin?.on("error", () => {
					// notify.sh may exit before stdin finishes; child exit resolves.
				});
				child.stdin?.end(JSON.stringify(observation));
				child.unref();
			} catch {
				resolve();
			}
		});

	const emit = (
		ctx: ExtensionContext,
		kind: string,
		payloadFactory: (
			position: { sequence: number; occurredAt: number },
		) => Record<string, unknown>,
	) => {
		if (skip(ctx)) return Promise.resolve();
		const nativeSessionId = ctx.sessionManager.getSessionId();
		if (!nativeSessionId) return Promise.resolve();
		const currentSequence = ++sequence;
		const occurredAt = Date.now();
		const observation = {
			hook_event_name: "AARuntime",
			contractVersion: CONTRACT_VERSION,
			eventId: `pi:${epoch}:${currentSequence}`,
			sessionKey: `aa:pi:${nativeSessionId}`,
			runtime: "pi",
			workspaceId,
			terminalId,
			nativeSessionId,
			nativeTurnId: null,
			epoch,
			sequence: currentSequence,
			occurredAt,
			kind,
			payload: payloadFactory({ sequence: currentSequence, occurredAt }),
		};

		// Each hook stays fire-and-forget from Pi's perspective, but delivery is
		// serialized so Host sees the gapless sequence in emission order.
		deliveryQueue = deliveryQueue
			.then(() => dispatch(observation))
			.catch(() => undefined);
		return deliveryQueue;
	};

	pi.on("session_start", (event: SessionStartEvent, ctx) => {
		if (skip(ctx)) return;
		const nativeSessionId = ctx.sessionManager.getSessionId();
		if (!nativeSessionId) return;
		const model = runtimeModel(ctx.model);
		const reasoning = runtimeReasoning(ctx.thinkingLevel);
		void emit(ctx, "snapshot", ({ sequence, occurredAt }) => ({
			snapshot: {
				contractVersion: CONTRACT_VERSION,
				sessionKey: `aa:pi:${nativeSessionId}`,
				runtime: "pi",
				agentId: "pi",
				workspaceId,
				transport: { kind: "terminal", terminalId },
				nativeSessionId,
				nativeTurnId: null,
				model,
				reasoning,
				state: "idle",
				stateReason: "session_attached",
				capabilities: {
					sessionIdentity: capability("available"),
					turnIdentity: capability(
						"unavailable",
						"pi_does_not_report_durable_turn_identity",
					),
					lifecycle: capability("available"),
					toolLifecycle: capability("available"),
					permissionRequests: capability(
						"conditional",
						"requires_optional_pi_extension_contract",
					),
					userQuestions: capability(
						"conditional",
						"requires_optional_pi_extension_contract",
					),
					modelRead: model
						? capability("available")
						: capability("unavailable", "pi_context_did_not_report_model"),
					modelWrite: capability(
						"unavailable",
						"observation_bridge_is_read_only",
					),
					reasoningRead: reasoning
						? capability("available")
						: capability(
								"unavailable",
								"pi_context_did_not_report_reasoning",
							),
					reasoningWrite: capability(
						"unavailable",
						"observation_bridge_is_read_only",
					),
					structuredMessages: capability(
						"unavailable",
						"phase_3b_minimum_bridge_omits_messages",
					),
					cancellation: capability(
						"unavailable",
						"observation_bridge_is_read_only",
					),
					resume: capability("available"),
					processRecovery: capability(
						"conditional",
						"requires_host_exact_session_resume",
					),
				},
				resume: {
					canResume: true,
					mechanism: "pi_session",
					lastConfirmedAt: occurredAt,
				},
				epoch,
				lastSequence: sequence,
				observedAt: occurredAt,
			},
		}));
		void emit(ctx, "session.started", () => ({
			reason:
				event.reason === "new"
					? "new"
					: event.reason === "resume" || event.reason === "fork"
						? "load"
						: "attach",
		}));
	});

	pi.on("agent_start", (_event, ctx) => {
		void emit(ctx, "turn.started", () => ({ correlationId: null }));
	});

	pi.on("tool_execution_start", (event: ToolExecutionStartEvent, ctx) => {
		void emit(ctx, "tool.started", () => ({
			toolCallId: event.toolCallId,
			name: event.toolName || null,
		}));
	});

	pi.on("tool_execution_update", (event: ToolExecutionUpdateEvent, ctx) => {
		void emit(ctx, "tool.progress", () => ({
			toolCallId: event.toolCallId,
		}));
	});

	pi.on("tool_execution_end", (event: ToolExecutionEndEvent, ctx) => {
		void emit(ctx, "tool.finished", () => ({
			toolCallId: event.toolCallId,
			outcome: event.isError ? "failed" : "completed",
		}));
	});

	pi.on("agent_settled", (_event, ctx) => {
		void emit(ctx, "turn.settled", () => ({ stopReason: null }));
	});

	pi.on("model_select", (event: ModelSelectEvent, ctx) => {
		void emit(ctx, "model.changed", () => ({
			model: selectedModel(event.model),
		}));
	});

	pi.on(
		"thinking_level_select",
		(event: ThinkingLevelSelectEvent, ctx) => {
			void emit(ctx, "reasoning.changed", () => ({
				reasoning: { value: event.level, availableValues: null },
			}));
		},
	);

	pi.on("session_shutdown", (_event: SessionShutdownEvent, ctx) => {
		// Pi's native session remains loadable after quit/reload/replacement, so
		// shutdown is offline/resumable rather than an authoritative end.
		return emit(ctx, "session.offline", () => ({ resumable: true }));
	});
}
