import { describe, expect, it } from "bun:test";
import { getAAAssignmentPresentation } from "./aaAssignmentPresentation";

describe("AA manual assignment presentation", () => {
	it("uses explicit assignment language while idle", () => {
		expect(getAAAssignmentPresentation("idle")).toEqual({
			heading: "EMPLOYEE ROSTER",
			detail: "ASSIGN CURRENT WORK",
		});
	});

	it("describes an in-flight manual handoff without claiming success", () => {
		expect(getAAAssignmentPresentation("assigning", "Codex").detail).toBe(
			"HANDING TO CODEX",
		);
	});

	it("shows confirmation only for the assigned phase", () => {
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
