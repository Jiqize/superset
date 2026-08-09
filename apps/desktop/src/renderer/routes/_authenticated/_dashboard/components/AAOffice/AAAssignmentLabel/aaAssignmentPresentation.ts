export type AAAssignmentPhase =
	| "idle"
	| "assigning"
	| "dispatched"
	| "assigned";

export interface AAAssignmentPresentation {
	detail: string;
	heading: "EMPLOYEE ROSTER" | "TASK FOLDER";
}

export function getAAAssignmentPresentation(
	phase: AAAssignmentPhase,
	employeeName?: string | null,
): AAAssignmentPresentation {
	const employee = normalizeEmployeeName(employeeName);

	switch (phase) {
		case "assigning":
			return { heading: "TASK FOLDER", detail: `HANDING TO ${employee}` };
		case "dispatched":
			return { heading: "TASK FOLDER", detail: `DISPATCHED TO ${employee}` };
		case "assigned":
			return { heading: "TASK FOLDER", detail: `ASSIGNED TO ${employee}` };
		case "idle":
			return { heading: "EMPLOYEE ROSTER", detail: "ASSIGN CURRENT WORK" };
	}
}

function normalizeEmployeeName(value: string | null | undefined): string {
	const normalized = value?.replace(/\s+/g, " ").trim().toUpperCase();
	if (!normalized) return "EMPLOYEE";
	const characters = Array.from(normalized);
	return characters.length <= 20
		? normalized
		: `${characters.slice(0, 19).join("")}…`;
}
