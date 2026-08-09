import { describe, expect, it } from "bun:test";
import { getAAReasoningPresentation } from "./aaReasoningPresentation";

describe("AA Pi reasoning presentation", () => {
	it.each([
		["off", "full"],
		["minimal", "full"],
		["low", "trimmed"],
		["medium", "receding"],
		["high", "sparse"],
		["xhigh", "bald"],
	] as const)("maps real Pi level %s to %s hair", (level, hairState) => {
		expect(getAAReasoningPresentation(level)).toEqual({
			hairState,
			label: level.toUpperCase(),
			level,
		});
	});

	it("normalizes safe casing and whitespace", () => {
		expect(getAAReasoningPresentation("  XHIGH ")?.level).toBe("xhigh");
	});

	it.each([
		undefined,
		null,
		"",
		"max",
		"very-high",
	])("does not invent a presentation for %s", (value) => {
		expect(getAAReasoningPresentation(value)).toBeNull();
	});
});
