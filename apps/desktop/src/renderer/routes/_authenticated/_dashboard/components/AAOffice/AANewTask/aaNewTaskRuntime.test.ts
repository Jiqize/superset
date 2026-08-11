import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { classifyAANewTaskRuntimeSnapshot } from "./aaNewTaskRuntime";

function snapshot(
	overrides: Partial<AARuntimeSessionSnapshot> = {},
): AARuntimeSessionSnapshot {
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
		capabilities: {
			...createAARuntimeCapabilities(),
			sessionIdentity: { support: "available", reason: null },
		},
		resume: { canResume: true, mechanism: "pi_session", lastConfirmedAt: 1 },
		epoch: "epoch-1",
		lastSequence: 1,
		observedAt: 1,
		...overrides,
	};
}

const expected = { workspaceId: "workspace-1", terminalId: "terminal-1" };

describe("classifyAANewTaskRuntimeSnapshot", () => {
	it("confirms only an authoritative matching Pi identity", () => {
		expect(
			classifyAANewTaskRuntimeSnapshot(snapshot(), expected),
		).toMatchObject({
			kind: "confirmed",
			state: "idle",
		});
	});

	it("ignores a wrong workspace, terminal, or runtime", () => {
		expect(
			classifyAANewTaskRuntimeSnapshot(
				snapshot({ workspaceId: "workspace-2" }),
				expected,
			),
		).toMatchObject({ kind: "ignored" });
		expect(
			classifyAANewTaskRuntimeSnapshot(
				snapshot({ transport: { kind: "terminal", terminalId: "terminal-2" } }),
				expected,
			),
		).toMatchObject({ kind: "ignored" });
		expect(
			classifyAANewTaskRuntimeSnapshot(snapshot({ runtime: "grok" }), expected),
		).toMatchObject({ kind: "ignored" });
	});

	it("does not treat a terminal snapshot without native identity as ready", () => {
		expect(
			classifyAANewTaskRuntimeSnapshot(
				snapshot({ nativeSessionId: null }),
				expected,
			),
		).toMatchObject({ kind: "pending", reason: "native-session-unconfirmed" });
	});

	it("requires the session identity capability", () => {
		const capabilities = {
			...createAARuntimeCapabilities(),
			sessionIdentity: { support: "unknown" as const, reason: "not reported" },
		};
		expect(
			classifyAANewTaskRuntimeSnapshot(snapshot({ capabilities }), expected),
		).toMatchObject({
			kind: "pending",
			reason: "session-identity-unavailable",
		});
	});

	it("shows error, ended, offline, and unknown states truthfully", () => {
		for (const state of ["error", "ended", "offline", "unknown"] as const) {
			expect(
				classifyAANewTaskRuntimeSnapshot(
					snapshot({ state, nativeSessionId: null }),
					expected,
				),
			).toMatchObject({ kind: "unavailable", state });
		}
	});

	it("accepts a later matching sequence without requiring sequence one", () => {
		expect(
			classifyAANewTaskRuntimeSnapshot(
				snapshot({ state: "working", lastSequence: 8 }),
				expected,
			),
		).toMatchObject({ kind: "confirmed", state: "working" });
	});
});
