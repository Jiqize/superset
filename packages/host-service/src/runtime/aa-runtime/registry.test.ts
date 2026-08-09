import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeEventEnvelope,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { AARuntimeRegistry } from "./registry";

const SESSION_KEY = "aa:pi:session-1";

function makeSnapshot(
	overrides: Partial<AARuntimeSessionSnapshot> = {},
): AARuntimeSessionSnapshot {
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: SESSION_KEY,
		runtime: "pi",
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal", terminalId: "terminal-1" },
		nativeSessionId: "session-1",
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
		...overrides,
	};
}

function makeEvent(
	overrides: Partial<AARuntimeEventEnvelope> = {},
): AARuntimeEventEnvelope {
	const snapshot = makeSnapshot();
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		eventId: "pi:epoch-1:1",
		sessionKey: SESSION_KEY,
		runtime: "pi",
		workspaceId: "workspace-1",
		terminalId: "terminal-1",
		nativeSessionId: "session-1",
		nativeTurnId: null,
		epoch: "epoch-1",
		sequence: 1,
		occurredAt: 100,
		kind: "snapshot",
		payload: { snapshot },
		...overrides,
	} as AARuntimeEventEnvelope;
}

describe("AARuntimeRegistry", () => {
	it("ingests an initial validated snapshot and indexes it by workspace and terminal", () => {
		const registry = new AARuntimeRegistry();

		expect(registry.ingest(makeEvent())).toEqual({ status: "accepted" });
		expect(registry.get(SESSION_KEY)).toEqual(makeSnapshot());
		expect(registry.list({ workspaceId: "workspace-1" })).toEqual([
			makeSnapshot(),
		]);
		expect(registry.findByTerminal("terminal-1")).toEqual(makeSnapshot());
	});

	it("deduplicates events, quarantines gaps, and accepts a fresh epoch at sequence one", () => {
		const registry = new AARuntimeRegistry();
		const initial = makeEvent();
		expect(registry.ingest(initial)).toEqual({ status: "accepted" });
		expect(registry.ingest(initial)).toMatchObject({ status: "duplicate" });

		const turnStarted = makeEvent({
			eventId: "pi:epoch-1:2",
			sequence: 2,
			occurredAt: 200,
			kind: "turn.started",
			payload: { correlationId: null },
		});
		expect(
			registry.ingest({ ...turnStarted, eventId: "pi:epoch-1:3", sequence: 3 }),
		).toMatchObject({ status: "quarantined" });
		expect(registry.ingest(turnStarted)).toEqual({ status: "accepted" });
		expect(
			registry.ingest({ ...turnStarted, eventId: "late-event", sequence: 1 }),
		).toMatchObject({ status: "stale" });

		const restartedSnapshot = makeSnapshot({
			epoch: "epoch-2",
			lastSequence: 1,
			observedAt: 300,
		});
		expect(
			registry.ingest(
				makeEvent({
					eventId: "pi:epoch-2:1",
					epoch: "epoch-2",
					sequence: 1,
					occurredAt: 300,
					payload: { snapshot: restartedSnapshot },
				}),
			),
		).toEqual({ status: "accepted" });
		expect(registry.get(SESSION_KEY)?.epoch).toBe("epoch-2");
	});

	it("keeps Pi working through tool completion and idles only on turn settlement", () => {
		const registry = new AARuntimeRegistry();
		registry.ingest(makeEvent());

		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:2",
				sequence: 2,
				occurredAt: 200,
				kind: "turn.started",
				payload: { correlationId: null },
			}),
		);
		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:3",
				sequence: 3,
				occurredAt: 300,
				kind: "tool.started",
				payload: { toolCallId: "call-1", name: "bash" },
			}),
		);
		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:4",
				sequence: 4,
				occurredAt: 400,
				kind: "tool.finished",
				payload: { toolCallId: "call-1", outcome: "completed" },
			}),
		);

		expect(registry.get(SESSION_KEY)).toMatchObject({
			state: "working",
			lastSequence: 4,
		});
		expect(
			registry
				.listEvents(SESSION_KEY)
				.filter((event) => event.kind.startsWith("tool.")),
		).toMatchObject([
			{ kind: "tool.started", payload: { toolCallId: "call-1" } },
			{ kind: "tool.finished", payload: { toolCallId: "call-1" } },
		]);

		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:5",
				sequence: 5,
				occurredAt: 500,
				kind: "turn.settled",
				payload: { stopReason: null },
			}),
		);
		expect(registry.get(SESSION_KEY)).toMatchObject({
			state: "idle",
			stateReason: "turn_settled",
			lastSequence: 5,
		});
	});

	it("marks a known terminal runtime offline on process loss without inventing an adapter event", () => {
		const registry = new AARuntimeRegistry();
		const changes: Array<{ event: unknown; state: string }> = [];
		registry.subscribe((change) => {
			changes.push({ event: change.event, state: change.snapshot.state });
		});
		registry.ingest(makeEvent());

		expect(registry.markTerminalOffline("terminal-1", 250)).toBe(true);
		expect(registry.get(SESSION_KEY)).toMatchObject({
			state: "offline",
			stateReason: "terminal_process_lost",
			observedAt: 250,
			resume: { canResume: true },
		});
		expect(changes.at(-1)).toEqual({ event: null, state: "offline" });
		expect(registry.markTerminalOffline("missing-terminal", 300)).toBe(false);
	});

	it("marks model and reasoning reads available only after authoritative values arrive", () => {
		const registry = new AARuntimeRegistry();
		registry.ingest(makeEvent());

		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:2",
				sequence: 2,
				occurredAt: 200,
				kind: "model.changed",
				payload: {
					model: {
						provider: "anthropic",
						id: "claude-sonnet",
						displayName: null,
					},
				},
			}),
		);
		registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:3",
				sequence: 3,
				occurredAt: 300,
				kind: "reasoning.changed",
				payload: { reasoning: { value: "high", availableValues: null } },
			}),
		);

		expect(registry.get(SESSION_KEY)).toMatchObject({
			model: { provider: "anthropic", id: "claude-sonnet" },
			reasoning: { value: "high" },
			capabilities: {
				modelRead: { support: "available", reason: null },
				reasoningRead: { support: "available", reason: null },
			},
		});
	});

	it("drops structured message bodies before retention or publication", () => {
		const registry = new AARuntimeRegistry();
		const published: unknown[] = [];
		registry.subscribe((change) => published.push(change));
		registry.ingest(makeEvent());

		const result = registry.ingest(
			makeEvent({
				eventId: "pi:epoch-1:2",
				sequence: 2,
				occurredAt: 200,
				kind: "message.delta",
				payload: {
					channel: "assistant",
					content: {
						type: "text",
						text: "private transcript body",
						data: { toolArguments: "private tool arguments" },
					},
				},
			}),
		);

		expect(result).toEqual({ status: "accepted" });
		expect(registry.get(SESSION_KEY)?.lastSequence).toBe(2);
		const observable = JSON.stringify({
			events: registry.listEvents(SESSION_KEY),
			published,
		});
		expect(observable).not.toContain("private transcript body");
		expect(observable).not.toContain("private tool arguments");
	});

	it("requires an exact native Pi session match before accepting a resumed epoch", () => {
		const registry = new AARuntimeRegistry();
		registry.expectResume(
			{
				nativeSessionId: "session-expected",
				runtime: "pi",
				terminalId: "terminal-resume",
				workspaceId: "workspace-1",
			},
			50,
		);
		expect(registry.get("aa:pi:session-expected")).toMatchObject({
			state: "starting",
			stateReason: "resume_requested",
			resume: { canResume: false },
		});
		const mismatchSnapshot = makeSnapshot({
			sessionKey: "aa:pi:session-replacement",
			nativeSessionId: "session-replacement",
			transport: { kind: "terminal", terminalId: "terminal-resume" },
		});

		expect(
			registry.ingest(
				makeEvent({
					sessionKey: mismatchSnapshot.sessionKey,
					terminalId: "terminal-resume",
					nativeSessionId: "session-replacement",
					payload: { snapshot: mismatchSnapshot },
				}),
			),
		).toMatchObject({
			status: "quarantined",
			reason: "resume native session identity mismatch",
		});
		expect(registry.get("aa:pi:session-expected")).toMatchObject({
			nativeSessionId: "session-expected",
			state: "error",
			stateReason: "resume_identity_mismatch",
		});
		expect(registry.get("aa:pi:session-replacement")).toBeUndefined();

		const matching = new AARuntimeRegistry();
		matching.expectResume(
			{
				nativeSessionId: "session-1",
				runtime: "pi",
				terminalId: "terminal-1",
				workspaceId: "workspace-1",
			},
			50,
		);
		expect(matching.ingest(makeEvent())).toEqual({ status: "accepted" });
		expect(matching.get(SESSION_KEY)).toMatchObject({
			nativeSessionId: "session-1",
			epoch: "epoch-1",
			resume: { canResume: true, lastConfirmedAt: 100 },
		});
	});

	it("reports a resume failure when the process exits before confirming identity", () => {
		const registry = new AARuntimeRegistry();
		registry.expectResume(
			{
				nativeSessionId: "session-expected",
				runtime: "pi",
				terminalId: "terminal-resume",
				workspaceId: "workspace-1",
			},
			50,
		);

		expect(registry.markTerminalOffline("terminal-resume", 400)).toBe(true);
		expect(registry.get("aa:pi:session-expected")).toMatchObject({
			nativeSessionId: "session-expected",
			state: "error",
			stateReason: "resume_identity_not_confirmed",
			observedAt: 400,
		});
	});
});
