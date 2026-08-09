import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { indexAARuntimeSnapshots } from "./useAARuntimeSnapshots";

describe("indexAARuntimeSnapshots", () => {
	it("keeps the latest authoritative snapshot for each terminal", () => {
		const base = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			sessionKey: "aa:pi:native-session",
			runtime: "pi" as const,
			agentId: "pi",
			workspaceId: "workspace-1",
			transport: { kind: "terminal" as const, terminalId: "terminal-1" },
			nativeSessionId: "native-session",
			nativeTurnId: null,
			model: null,
			reasoning: null,
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
		const indexed = indexAARuntimeSnapshots([
			base,
			{
				...base,
				state: "working",
				stateReason: "turn_started",
				lastSequence: 2,
				observedAt: 200,
			},
		]);

		expect(indexed.get("terminal-1")).toMatchObject({
			state: "working",
			lastSequence: 2,
		});
	});
});
