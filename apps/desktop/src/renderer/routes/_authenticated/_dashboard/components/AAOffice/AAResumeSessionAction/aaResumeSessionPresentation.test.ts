import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { resolveAAResumeSessionPresentation } from "./aaResumeSessionPresentation";

const candidate = {
	agent: "pi-config",
	agentId: "pi",
	agentLabel: "Pi",
	agentSessionId: "native-session",
	definitionId: "pi",
	endedAt: 100,
	resumeSupported: true,
	terminalId: "terminal-old",
};

function snapshot(
	overrides: Partial<AARuntimeSessionSnapshot> = {},
): AARuntimeSessionSnapshot {
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: "aa:pi:native-session",
		runtime: "pi",
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal", terminalId: "terminal-old" },
		nativeSessionId: "native-session",
		nativeTurnId: null,
		model: null,
		reasoning: null,
		state: "offline",
		stateReason: "terminal_process_lost",
		capabilities: createAARuntimeCapabilities(),
		resume: {
			canResume: true,
			mechanism: "pi_session",
			lastConfirmedAt: 90,
		},
		epoch: "epoch-old",
		lastSequence: 4,
		observedAt: 100,
		...overrides,
	};
}

describe("AA exact Pi resume presentation", () => {
	it("offers the durable exact candidate after a Host restart has no snapshot", () => {
		expect(
			resolveAAResumeSessionPresentation({ candidate, runtimeSnapshot: null }),
		).toMatchObject({
			availability: "available",
			actionLabel: "RESUME PI SESSION",
			contextLabel: "SAVED PI CONVERSATION",
		});
	});

	it("offers resume when the authoritative snapshot is offline and identity matches", () => {
		expect(
			resolveAAResumeSessionPresentation({
				candidate,
				runtimeSnapshot: snapshot(),
			}),
		).toMatchObject({ availability: "available" });
	});

	it.each([
		[snapshot({ state: "working" }), "runtime_not_offline"],
		[snapshot({ state: "unknown" }), "runtime_not_offline"],
		[snapshot({ nativeSessionId: "different-session" }), "identity_conflict"],
	] as const)("blocks resume when stronger runtime evidence conflicts", (runtime, reason) => {
		expect(
			resolveAAResumeSessionPresentation({
				candidate,
				runtimeSnapshot: runtime,
			}),
		).toMatchObject({ availability: "blocked", reason });
	});

	it("does not offer non-Pi or unsupported candidates", () => {
		expect(
			resolveAAResumeSessionPresentation({
				candidate: { ...candidate, agentId: "codex" },
				runtimeSnapshot: null,
			}),
		).toMatchObject({ availability: "hidden" });
		expect(
			resolveAAResumeSessionPresentation({
				candidate: { ...candidate, resumeSupported: false },
				runtimeSnapshot: null,
			}),
		).toMatchObject({ availability: "hidden" });
	});
});
