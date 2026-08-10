import { describe, expect, it } from "bun:test";
import { getAAAssignmentPresentation } from "./aaAssignmentPresentation";

describe("AA manual assignment presentation", () => {
	it("uses explicit manual Task Folder handoff language while idle", () => {
		expect(getAAAssignmentPresentation("idle")).toEqual({
			heading: "EMPLOYEE ROSTER",
			detail: "SEND TASK FOLDER",
		});
	});

	it("describes an in-flight manual handoff without claiming success", () => {
		expect(getAAAssignmentPresentation("assigning", "Codex").detail).toBe(
			"HANDING TO CODEX",
		);
	});

	it("describes a completed launch as dispatched, not assigned", () => {
		expect(getAAAssignmentPresentation("dispatched", "Codex").detail).toBe(
			"DISPATCHED TO CODEX",
		);
	});

	it("reserves assigned language for a binding-confirmed phase", () => {
		expect(getAAAssignmentPresentation("assigned", "Claude").detail).toBe(
			"ASSIGNED TO CLAUDE",
		);
	});

	it("uses a neutral fallback instead of inventing an employee", () => {
		expect(getAAAssignmentPresentation("assigned", " ").detail).toBe(
			"ASSIGNED TO EMPLOYEE",
		);
	});
});
