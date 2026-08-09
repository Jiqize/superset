import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	classifyAARuntimeEventOrder,
	createAARuntimeCapabilities,
	getAARuntimeEventDeduplicationKeys,
	parseAARuntimeEvent,
	parseAARuntimeSessionSnapshot,
} from "./runtime-contract";

describe("AA runtime contract", () => {
	it("defaults every capability to explicit unknown support", () => {
		expect(createAARuntimeCapabilities()).toEqual({
			sessionIdentity: { support: "unknown", reason: null },
			turnIdentity: { support: "unknown", reason: null },
			lifecycle: { support: "unknown", reason: null },
			toolLifecycle: { support: "unknown", reason: null },
			permissionRequests: { support: "unknown", reason: null },
			userQuestions: { support: "unknown", reason: null },
			modelRead: { support: "unknown", reason: null },
			modelWrite: { support: "unknown", reason: null },
			reasoningRead: { support: "unknown", reason: null },
			reasoningWrite: { support: "unknown", reason: null },
			structuredMessages: { support: "unknown", reason: null },
			cancellation: { support: "unknown", reason: null },
			resume: { support: "unknown", reason: null },
			processRecovery: { support: "unknown", reason: null },
		});
	});

	it("accepts a well-formed snapshot and rejects conflated terminal identity", () => {
		const snapshot = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			sessionKey: "aa:pi:019fe6c4-8216-74a7-a3e8-73027ac66f67",
			runtime: "pi" as const,
			agentId: "pi",
			workspaceId: "workspace-1",
			transport: { kind: "terminal" as const, terminalId: "terminal-1" },
			nativeSessionId: "019fe6c4-8216-74a7-a3e8-73027ac66f67",
			nativeTurnId: null,
			model: { provider: "google", id: "gemini-3.5-flash", displayName: null },
			reasoning: { value: "high", availableValues: null },
			state: "idle" as const,
			stateReason: "session_attached",
			capabilities: createAARuntimeCapabilities(),
			resume: {
				canResume: true,
				mechanism: "pi_session" as const,
				lastConfirmedAt: 1_700_000_000_000,
			},
			epoch: "epoch-1",
			lastSequence: 1,
			observedAt: 1_700_000_000_000,
		};

		expect(parseAARuntimeSessionSnapshot(snapshot)).toEqual(snapshot);
		expect(() =>
			parseAARuntimeSessionSnapshot({
				...snapshot,
				sessionKey: snapshot.transport.terminalId,
			}),
		).toThrow("sessionKey must not equal terminalId");

		const snapshotEvent = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			eventId: "pi:epoch-1:1",
			sessionKey: snapshot.sessionKey,
			runtime: snapshot.runtime,
			workspaceId: snapshot.workspaceId,
			terminalId: snapshot.transport.terminalId,
			nativeSessionId: snapshot.nativeSessionId,
			nativeTurnId: snapshot.nativeTurnId,
			epoch: snapshot.epoch,
			sequence: snapshot.lastSequence,
			occurredAt: snapshot.observedAt,
			kind: "snapshot" as const,
			payload: { snapshot },
		};
		expect(parseAARuntimeEvent(snapshotEvent)).toEqual(snapshotEvent);
		expect(() =>
			parseAARuntimeEvent({
				...snapshotEvent,
				nativeSessionId: "different-native-session",
			}),
		).toThrow("snapshot identity must match its event envelope");
	});

	it("validates runtime event identity and kind-specific payloads", () => {
		const event = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			eventId: "pi:epoch-1:3",
			sessionKey: "aa:pi:019fe6c4-8216-74a7-a3e8-73027ac66f67",
			runtime: "pi" as const,
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			nativeSessionId: "019fe6c4-8216-74a7-a3e8-73027ac66f67",
			nativeTurnId: null,
			epoch: "epoch-1",
			sequence: 3,
			occurredAt: 1_700_000_000_000,
			kind: "tool.started" as const,
			payload: { toolCallId: "call-1", name: "bash" },
		};

		expect(parseAARuntimeEvent(event)).toEqual(event);
		expect(() => parseAARuntimeEvent({ ...event, runtime: "codex" })).toThrow();
		expect(() =>
			parseAARuntimeEvent({ ...event, payload: { toolCallId: "call 1" } }),
		).toThrow();
	});

	it("provides stable deduplication keys and epoch-local sequence rules", () => {
		const event = parseAARuntimeEvent({
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			eventId: "pi:epoch-1:4",
			sessionKey: "aa:pi:session-1",
			runtime: "pi",
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			nativeSessionId: "session-1",
			nativeTurnId: null,
			epoch: "epoch-1",
			sequence: 4,
			occurredAt: 200,
			kind: "turn.started",
			payload: { correlationId: null },
		});
		const current = { epoch: "epoch-1", lastSequence: 3, observedAt: 100 };

		expect(getAARuntimeEventDeduplicationKeys(event)).toEqual([
			"event:pi:epoch-1:4",
			"position:aa:pi:session-1:epoch-1:4",
		]);
		expect(classifyAARuntimeEventOrder(current, event)).toBe("accept");
		expect(
			classifyAARuntimeEventOrder(current, { ...event, sequence: 3 }),
		).toBe("duplicate");
		expect(
			classifyAARuntimeEventOrder(current, { ...event, sequence: 2 }),
		).toBe("stale");
		expect(
			classifyAARuntimeEventOrder(current, { ...event, sequence: 5 }),
		).toBe("gap");
		expect(
			classifyAARuntimeEventOrder(current, {
				...event,
				epoch: "epoch-2",
				sequence: 1,
			}),
		).toBe("new_epoch");
	});
});
