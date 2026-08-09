import { describe, expect, it } from "bun:test";
import {
	mapLifecycleEventToAATaskFolderState,
	normalizeAATaskFolderTitleInput,
	resolveAATaskFolderRename,
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

	it("normalizes whitespace and limits saved titles to 48 Unicode characters", () => {
		expect(normalizeAATaskFolderTitleInput("  Fix   login\nstate  ")).toBe(
			"Fix login state",
		);
		const title = normalizeAATaskFolderTitleInput("办".repeat(60));
		expect(Array.from(title ?? "")).toHaveLength(48);
		expect(title?.endsWith("…")).toBe(true);
	});

	it("commits normalized titles and uses undefined for empty fallback", () => {
		expect(
			resolveAATaskFolderRename({
				action: "save",
				currentTitleOverride: "Old",
				draft: "  New   task  ",
			}),
		).toEqual({ committed: true, titleOverride: "New task" });
		expect(
			resolveAATaskFolderRename({
				action: "save",
				currentTitleOverride: "Old",
				draft: "  ",
			}),
		).toEqual({ committed: true, titleOverride: undefined });
	});

	it("cancels without changing the existing title", () => {
		expect(
			resolveAATaskFolderRename({
				action: "cancel",
				currentTitleOverride: "Original",
				draft: "Replacement",
			}),
		).toEqual({ committed: false, titleOverride: "Original" });
	});

	it.each([
		[undefined, "unassigned", "unassigned"],
		[undefined, "untracked", "untracked"],
		["Attached", "tracked", "idle"],
		["Start", "tracked", "working"],
		["UserPromptSubmit", "tracked", "working"],
		["PermissionRequest", "tracked", "waiting"],
		["Stop", "tracked", "turn-complete"],
		["Detached", "tracked", "session-ended"],
		["Failed", "tracked", "error"],
	] as const)("maps %s with tracking=%s to %s", (eventType, tracking, expected) => {
		expect(mapLifecycleEventToAATaskFolderState(eventType, tracking)).toBe(
			expected,
		);
	});
});
