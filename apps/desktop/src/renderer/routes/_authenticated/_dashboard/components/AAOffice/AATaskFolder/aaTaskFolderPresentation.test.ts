import { describe, expect, it } from "bun:test";
import {
	mapLifecycleEventToAATaskFolderState,
	resolveAATaskFolderTitle,
} from "./aaTaskFolderPresentation";

describe("AA Task Folder presentation", () => {
	it("uses the highest-priority real title source", () => {
		expect(
			resolveAATaskFolderTitle({
				explicitTitle: "Fix login state",
				sessionLabel: "Pi",
				terminalLabel: "Terminal",
			}),
		).toBe("Fix login state");
	});

	it("falls through blank sources to the existing session label", () => {
		expect(
			resolveAATaskFolderTitle({
				explicitTitle: "  ",
				sessionLabel: "  Pi baseline session  ",
				terminalLabel: "Terminal",
			}),
		).toBe("Pi baseline session");
	});

	it("uses the honest generic fallback when no title exists", () => {
		expect(resolveAATaskFolderTitle({})).toBe("Current Work Session");
	});

	it("truncates real labels without parsing terminal history", () => {
		const title = resolveAATaskFolderTitle({ sessionLabel: "x".repeat(80) });
		expect(Array.from(title)).toHaveLength(48);
		expect(title.endsWith("…")).toBe(true);
	});

	it.each([
		[undefined, false, "unassigned"],
		["Attached", true, "idle"],
		["Start", true, "working"],
		["UserPromptSubmit", true, "working"],
		["PermissionRequest", true, "waiting"],
		["Stop", true, "done"],
		["Failed", true, "error"],
	] as const)("maps %s with assignment=%s to %s", (eventType, hasAssignment, expected) => {
		expect(mapLifecycleEventToAATaskFolderState(eventType, hasAssignment)).toBe(
			expected,
		);
	});
});
