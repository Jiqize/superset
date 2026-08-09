import { describe, expect, it } from "bun:test";
import { resolveAARuntimeHealth } from "./aaRuntimeHealth";

describe("AA runtime health presentation", () => {
	it.each([
		["starting", null, false, "starting", "STARTING"],
		["working", "turn_started", true, "working", "WORKING"],
		["idle", "turn_settled", true, "idle", "IDLE"],
		["offline", "terminal_process_lost", false, "offline", "OFFLINE"],
		[
			"offline",
			"terminal_process_lost",
			true,
			"offline_resumable",
			"OFFLINE / RESUMABLE",
		],
		["unknown", "evidence_insufficient", true, "unknown", "UNKNOWN"],
		["error", "runtime_failed", true, "error", "ERROR"],
		[
			"error",
			"resume_identity_mismatch",
			false,
			"resume_identity_mismatch",
			"RESUME IDENTITY MISMATCH",
		],
		[
			"error",
			"resume_identity_not_confirmed",
			false,
			"resume_not_confirmed",
			"RESUME NOT CONFIRMED",
		],
	] as const)("maps %s / %s to stable health %s", (state, stateReason, canResume, code, label) => {
		expect(
			resolveAARuntimeHealth({ state, stateReason, canResume }),
		).toMatchObject({ code, label });
	});

	it("keeps a diagnostic reason without exposing transport identity", () => {
		expect(
			resolveAARuntimeHealth({
				state: "unknown",
				stateReason: "event_gap_quarantined",
				canResume: false,
			}).diagnostic,
		).toBe("Runtime evidence: event gap quarantined");
	});
});
