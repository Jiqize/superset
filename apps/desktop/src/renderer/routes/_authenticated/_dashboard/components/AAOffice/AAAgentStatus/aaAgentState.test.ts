import { describe, expect, it } from "bun:test";
import {
	mapLifecycleEventToAAState,
	selectLatestPiBinding,
} from "./aaAgentState";

describe("AA Pi worker state", () => {
	it.each([
		[undefined, "offline"],
		["Attached", "idle"],
		["Stop", "idle"],
		["UserPromptSubmit", "thinking"],
		["Start", "working"],
		["PermissionRequest", "waiting"],
		["PendingQuestion", "waiting"],
		["Failed", "error"],
	] as const)("maps %s to %s", (eventType, expected) => {
		expect(mapLifecycleEventToAAState(eventType)).toBe(expected);
	});

	it("selects only the newest live Pi binding", () => {
		const selected = selectLatestPiBinding([
			{
				agentId: "codex",
				lastEventAt: 30,
				lastEventType: "Start",
				terminalId: "codex-terminal",
			},
			{
				agentId: "pi",
				lastEventAt: 10,
				lastEventType: "Stop",
				terminalId: "old-pi-terminal",
			},
			{
				agentId: "pi",
				lastEventAt: 20,
				lastEventType: "Start",
				terminalId: "current-pi-terminal",
			},
		]);

		expect(selected?.terminalId).toBe("current-pi-terminal");
	});
});
