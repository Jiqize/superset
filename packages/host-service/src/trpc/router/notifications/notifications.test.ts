import { describe, expect, it, mock } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import type { AgentIdentity } from "@superset/shared/agent-identity";
import type { AgentLifecycleEventType } from "../../../events";
import { AARuntimeRegistry } from "../../../runtime/aa-runtime";
import { TerminalAgentStore } from "../../../terminal-agents";
import type { HostServiceContext } from "../../../types";
import { notificationsRouter } from "./notifications";

interface BroadcastedAgentLifecycleEvent {
	workspaceId: string;
	eventType: AgentLifecycleEventType;
	terminalId: string;
	agent?: AgentIdentity;
	occurredAt: number;
}

function createContext(originWorkspaceId: string | null): {
	ctx: HostServiceContext;
	broadcastAgentLifecycle: ReturnType<
		typeof mock<(event: BroadcastedAgentLifecycleEvent) => void>
	>;
	findFirst: ReturnType<typeof mock>;
	terminalAgentStore: TerminalAgentStore;
} {
	const broadcastAgentLifecycle = mock(
		(_event: BroadcastedAgentLifecycleEvent) => {},
	);
	const findFirst = mock(() => ({
		sync: () =>
			originWorkspaceId === null
				? null
				: {
						originWorkspaceId,
					},
	}));
	const terminalAgentStore = new TerminalAgentStore();
	const aaRuntime = new AARuntimeRegistry();

	const ctx = {
		db: {
			query: {
				terminalSessions: {
					findFirst,
				},
			},
		},
		eventBus: {
			broadcastAgentLifecycle,
		},
		terminalAgentStore,
		runtime: { aaRuntime },
	} as unknown as HostServiceContext;

	return { ctx, broadcastAgentLifecycle, findFirst, terminalAgentStore };
}

describe("notificationsRouter.hook", () => {
	it("derives workspaceId from terminalId before broadcasting", async () => {
		const { ctx, broadcastAgentLifecycle, findFirst } =
			createContext("workspace-1");
		const caller = notificationsRouter.createCaller(ctx);

		const result = await caller.hook({
			terminalId: "terminal-1",
			eventType: "task_complete",
		});

		expect(result).toEqual({ success: true, ignored: false });
		expect(findFirst).toHaveBeenCalledTimes(1);
		expect(broadcastAgentLifecycle).toHaveBeenCalledTimes(1);
		expect(broadcastAgentLifecycle.mock.calls[0]?.[0]).toMatchObject({
			workspaceId: "workspace-1",
			eventType: "Stop",
			terminalId: "terminal-1",
		});
		expect(typeof broadcastAgentLifecycle.mock.calls[0]?.[0].occurredAt).toBe(
			"number",
		);
	});

	it("ignores missing or unknown terminal ids", async () => {
		const missingTerminal = createContext("workspace-1");
		const missingResult = await notificationsRouter
			.createCaller(missingTerminal.ctx)
			.hook({ eventType: "Stop" });

		expect(missingResult).toEqual({ success: true, ignored: true });
		expect(missingTerminal.findFirst).not.toHaveBeenCalled();
		expect(missingTerminal.broadcastAgentLifecycle).not.toHaveBeenCalled();

		const unknownTerminal = createContext(null);
		const unknownResult = await notificationsRouter
			.createCaller(unknownTerminal.ctx)
			.hook({ terminalId: "terminal-missing", eventType: "Stop" });

		expect(unknownResult).toEqual({ success: true, ignored: true });
		expect(unknownTerminal.findFirst).toHaveBeenCalledTimes(1);
		expect(unknownTerminal.broadcastAgentLifecycle).not.toHaveBeenCalled();
	});

	it("ignores unknown event types before looking up the terminal", async () => {
		const { ctx, broadcastAgentLifecycle, findFirst } =
			createContext("workspace-1");
		const caller = notificationsRouter.createCaller(ctx);

		const result = await caller.hook({
			terminalId: "terminal-1",
			eventType: "unknown-event",
		});

		expect(result).toEqual({ success: true, ignored: true });
		expect(findFirst).not.toHaveBeenCalled();
		expect(broadcastAgentLifecycle).not.toHaveBeenCalled();
	});

	it("forwards agent identity when the hook stamps it", async () => {
		const { ctx, broadcastAgentLifecycle } = createContext("workspace-1");

		await notificationsRouter.createCaller(ctx).hook({
			terminalId: "terminal-1",
			eventType: "Stop",
			agent: { agentId: "claude", sessionId: "session-abc" },
		});

		expect(broadcastAgentLifecycle).toHaveBeenCalledTimes(1);
		expect(broadcastAgentLifecycle.mock.calls[0]?.[0]).toMatchObject({
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			eventType: "Stop",
			agent: { agentId: "claude", sessionId: "session-abc" },
		});
	});

	it("normalizes empty-string identity fields to undefined", async () => {
		const { ctx, broadcastAgentLifecycle } = createContext("workspace-1");

		await notificationsRouter.createCaller(ctx).hook({
			terminalId: "terminal-1",
			eventType: "Stop",
			agent: { agentId: "claude", sessionId: "" },
		});

		const broadcast = broadcastAgentLifecycle.mock.calls[0]?.[0];
		expect(broadcast?.agent).toEqual({ agentId: "claude" });
	});

	it("records the event onto the terminal agent store", async () => {
		const { ctx, terminalAgentStore } = createContext("workspace-1");

		await notificationsRouter.createCaller(ctx).hook({
			terminalId: "terminal-1",
			eventType: "SessionStart",
			agent: { agentId: "claude", sessionId: "session-abc" },
		});

		const binding = terminalAgentStore.get("terminal-1");
		expect(binding?.agentId).toBe("claude");
		expect(binding?.agentSessionId).toBe("session-abc");
		expect(binding?.workspaceId).toBe("workspace-1");
		expect(binding?.lastEventType).toBe("Attached");
	});

	it("maps Claude Code's StopFailure API-error hook to a Failed event and records it", async () => {
		const { ctx, broadcastAgentLifecycle, terminalAgentStore } =
			createContext("workspace-1");
		const caller = notificationsRouter.createCaller(ctx);

		await caller.hook({
			terminalId: "terminal-1",
			eventType: "SessionStart",
			agent: { agentId: "claude", sessionId: "session-abc" },
		});
		const result = await caller.hook({
			terminalId: "terminal-1",
			eventType: "StopFailure",
			agent: { agentId: "claude", sessionId: "session-abc" },
		});

		expect(result).toEqual({ success: true, ignored: false });
		const failedBroadcast = broadcastAgentLifecycle.mock.calls.at(-1)?.[0];
		expect(failedBroadcast).toMatchObject({
			workspaceId: "workspace-1",
			eventType: "Failed",
			terminalId: "terminal-1",
			// Failed keeps the agent identifiable, unlike an exit that drops it.
			agent: { agentId: "claude", sessionId: "session-abc" },
		});
		const binding = terminalAgentStore.get("terminal-1");
		expect(binding?.lastEventType).toBe("Failed");
		expect(binding?.agentId).toBe("claude");
		expect(binding?.agentSessionId).toBe("session-abc");
	});

	it("drops agent identity entirely when agentId is missing", async () => {
		const { ctx, broadcastAgentLifecycle } = createContext("workspace-1");

		await notificationsRouter.createCaller(ctx).hook({
			terminalId: "terminal-1",
			eventType: "Stop",
			agent: { agentId: "" },
		});

		const broadcast = broadcastAgentLifecycle.mock.calls[0]?.[0];
		expect(broadcast?.agent).toBeUndefined();
	});

	it("validates and ingests a structured Pi runtime snapshot", async () => {
		const { ctx, broadcastAgentLifecycle } = createContext("workspace-1");
		const snapshot = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			sessionKey: "aa:pi:native-session",
			runtime: "pi" as const,
			agentId: "pi",
			workspaceId: "workspace-1",
			transport: { kind: "terminal" as const, terminalId: "terminal-1" },
			nativeSessionId: "native-session",
			nativeTurnId: null,
			model: { provider: "anthropic", id: "claude-sonnet", displayName: null },
			reasoning: { value: "high", availableValues: null },
			state: "idle" as const,
			stateReason: "session_attached",
			capabilities: createAARuntimeCapabilities(),
			resume: {
				canResume: true,
				mechanism: "pi_session" as const,
				lastConfirmedAt: 100,
			},
			epoch: "epoch-1",
			lastSequence: 1,
			observedAt: 100,
		};
		const result = await notificationsRouter.createCaller(ctx).hook({
			terminalId: "terminal-1",
			runtimeEvent: {
				contractVersion: AA_RUNTIME_CONTRACT_VERSION,
				eventId: "pi:epoch-1:1",
				sessionKey: snapshot.sessionKey,
				runtime: "pi",
				workspaceId: "workspace-1",
				terminalId: "terminal-1",
				nativeSessionId: "native-session",
				nativeTurnId: null,
				epoch: "epoch-1",
				sequence: 1,
				occurredAt: 100,
				kind: "snapshot",
				payload: { snapshot },
			},
		});

		expect(result).toMatchObject({
			success: true,
			ignored: false,
			runtimeStatus: "accepted",
		});
		expect(ctx.runtime.aaRuntime.get(snapshot.sessionKey)).toEqual(snapshot);
		expect(broadcastAgentLifecycle).not.toHaveBeenCalled();
	});

	it("rejects a structured event whose terminal or workspace identity differs", async () => {
		const { ctx } = createContext("workspace-1");
		const runtimeEvent = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			eventId: "pi:epoch-1:2",
			sessionKey: "aa:pi:native-session",
			runtime: "pi",
			workspaceId: "workspace-other",
			terminalId: "terminal-other",
			nativeSessionId: "native-session",
			nativeTurnId: null,
			epoch: "epoch-1",
			sequence: 2,
			occurredAt: 200,
			kind: "turn.started",
			payload: { correlationId: null },
		};

		await expect(
			notificationsRouter.createCaller(ctx).hook({
				terminalId: "terminal-1",
				runtimeEvent,
			}),
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
		expect(ctx.runtime.aaRuntime.list()).toEqual([]);
	});
});
