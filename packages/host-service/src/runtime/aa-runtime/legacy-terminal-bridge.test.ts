import { describe, expect, it, mock } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeEventEnvelope,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import type { EventBus } from "../../events";
import { TerminalAgentStore } from "../../terminal-agents";
import { syncPiRuntimeChangeToLegacy } from "./legacy-terminal-bridge";

function snapshot(): AARuntimeSessionSnapshot {
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: "aa:pi:native-session",
		runtime: "pi",
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal", terminalId: "terminal-1" },
		nativeSessionId: "native-session",
		nativeTurnId: null,
		model: null,
		reasoning: null,
		state: "idle",
		stateReason: "session_attached",
		capabilities: createAARuntimeCapabilities(),
		resume: {
			canResume: true,
			mechanism: "pi_session",
			lastConfirmedAt: 100,
		},
		epoch: "epoch-1",
		lastSequence: 1,
		observedAt: 100,
	};
}

function event<K extends AARuntimeEventEnvelope["kind"]>(
	kind: K,
	sequence: number,
	payload: Extract<AARuntimeEventEnvelope, { kind: K }>["payload"],
): Extract<AARuntimeEventEnvelope, { kind: K }> {
	const current = snapshot();
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		eventId: `pi:epoch-1:${sequence}`,
		sessionKey: current.sessionKey,
		runtime: "pi",
		workspaceId: current.workspaceId,
		terminalId: "terminal-1",
		nativeSessionId: "native-session",
		nativeTurnId: null,
		epoch: "epoch-1",
		sequence,
		occurredAt: sequence * 100,
		kind,
		payload,
	} as Extract<AARuntimeEventEnvelope, { kind: K }>;
}

describe("syncPiRuntimeChangeToLegacy", () => {
	it("persists the native UUID and preserves legacy start/stop presentation", () => {
		const store = new TerminalAgentStore();
		const broadcastAgentLifecycle = mock((_event: unknown) => {});
		const eventBus = {
			broadcastAgentLifecycle,
		} as unknown as EventBus;
		const initial = event("snapshot", 1, { snapshot: snapshot() });

		syncPiRuntimeChangeToLegacy(
			{ event: initial, snapshot: snapshot() },
			{ eventBus, terminalAgentStore: store },
		);
		expect(store.get("terminal-1")).toMatchObject({
			agentId: "pi",
			agentSessionId: "native-session",
			lastEventType: "Attached",
		});

		const started = event("turn.started", 2, { correlationId: null });
		syncPiRuntimeChangeToLegacy(
			{ event: started, snapshot: { ...snapshot(), state: "working" } },
			{ eventBus, terminalAgentStore: store },
		);
		expect(store.get("terminal-1")?.lastEventType).toBe("Start");

		const toolFinished = event("tool.finished", 3, {
			toolCallId: "call-1",
			outcome: "completed",
		});
		syncPiRuntimeChangeToLegacy(
			{ event: toolFinished, snapshot: { ...snapshot(), state: "working" } },
			{ eventBus, terminalAgentStore: store },
		);
		expect(store.get("terminal-1")?.lastEventType).toBe("Start");

		const settled = event("turn.settled", 4, { stopReason: null });
		syncPiRuntimeChangeToLegacy(
			{ event: settled, snapshot: snapshot() },
			{ eventBus, terminalAgentStore: store },
		);
		expect(store.get("terminal-1")?.lastEventType).toBe("Stop");
		expect(broadcastAgentLifecycle.mock.calls.map((call) => call[0])).toEqual([
			expect.objectContaining({ eventType: "Attached" }),
			expect.objectContaining({ eventType: "Start" }),
			expect.objectContaining({ eventType: "Stop" }),
		]);
	});
});
