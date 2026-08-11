import { describe, expect, it } from "bun:test";
import { resolveTerminalResumeTaskTitle } from "./TerminalAgentResumeBanner.utils";

describe("resolveTerminalResumeTaskTitle", () => {
	it("carries an explicit task title from a single-pane tab into exact resume", () => {
		expect(
			resolveTerminalResumeTaskTitle({
				tabTitle: "Create harmless marker",
				taskTitleEdited: true,
			}),
		).toBe("Create harmless marker");
	});

	it("prefers a pane title and never promotes an unedited runtime label", () => {
		expect(
			resolveTerminalResumeTaskTitle({
				paneTitle: "Pane task",
				tabTitle: "Tab task",
				taskTitleEdited: true,
			}),
		).toBe("Pane task");
		expect(
			resolveTerminalResumeTaskTitle({
				tabTitle: "Pi",
				taskTitleEdited: false,
			}),
		).toBeUndefined();
	});
});
