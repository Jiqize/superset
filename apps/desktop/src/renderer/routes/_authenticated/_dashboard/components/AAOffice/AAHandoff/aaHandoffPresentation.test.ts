import { describe, expect, it } from "bun:test";
import {
	resolveAAHandoffPanePresentation,
	resolveAAHandoffTaskTitle,
	resolveAAHandoffTaskTitleFromPaneCandidates,
} from "./aaHandoffPresentation";

describe("AA manual Task Folder handoff", () => {
	it("carries an explicit Task Folder title without replacing employee identity", () => {
		const taskFolderTitle = resolveAAHandoffTaskTitle({
			paneTitle: "  Build   login flow  ",
			taskTitleEdited: true,
		});

		expect(
			resolveAAHandoffPanePresentation({
				employeeTitle: "Codex",
				taskFolderTitle,
			}),
		).toEqual({
			launchLabel: "Codex",
			taskTitleEdited: true,
			titleOverride: "Build login flow",
		});
	});

	it("does not hand off an inferred preset title as task context", () => {
		expect(
			resolveAAHandoffTaskTitle({
				paneTitle: "Pi",
				taskTitleEdited: false,
			}),
		).toBeUndefined();
		expect(
			resolveAAHandoffPanePresentation({
				employeeTitle: "Codex",
			}),
		).toEqual({
			launchLabel: "Codex",
			titleOverride: "Codex",
		});
	});

	it("keeps an explicit Task Folder available after the user opens a diff pane", () => {
		expect(
			resolveAAHandoffTaskTitleFromPaneCandidates([
				{ paneTitle: "Changes", taskTitleEdited: false },
				{ paneTitle: "Review Phase 3E handoff", taskTitleEdited: true },
			]),
		).toBe("Review Phase 3E handoff");
	});

	it("preserves the explicit Task Folder when the same employee session resumes", () => {
		const taskFolderTitle = resolveAAHandoffTaskTitle({
			paneTitle: "Review Phase 3E handoff",
			taskTitleEdited: true,
		});

		expect(
			resolveAAHandoffPanePresentation({
				employeeTitle: "Pi",
				taskFolderTitle,
			}),
		).toEqual({
			launchLabel: "Pi",
			taskTitleEdited: true,
			titleOverride: "Review Phase 3E handoff",
		});
	});
});
