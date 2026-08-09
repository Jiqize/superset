export const AA_TASK_FOLDER_STATES = [
	"unassigned",
	"idle",
	"working",
	"waiting",
	"done",
	"error",
] as const;

export type AATaskFolderState = (typeof AA_TASK_FOLDER_STATES)[number];

interface AATaskTitleSources {
	explicitTitle?: string | null;
	sessionLabel?: string | null;
	terminalLabel?: string | null;
}

const TASK_TITLE_LIMIT = 48;

export function resolveAATaskFolderTitle({
	explicitTitle,
	sessionLabel,
	terminalLabel,
}: AATaskTitleSources): string {
	for (const source of [explicitTitle, sessionLabel, terminalLabel]) {
		const normalized = source?.replace(/\s+/g, " ").trim();
		if (normalized) return truncateTaskTitle(normalized);
	}
	return "Current Work Session";
}

export function mapLifecycleEventToAATaskFolderState(
	eventType: string | undefined,
	hasAssignment: boolean,
): AATaskFolderState {
	if (!hasAssignment) return "unassigned";

	switch (eventType) {
		case "Start":
		case "PostToolUse":
		case "PostToolUseFailure":
		case "Thinking":
		case "UserPromptSubmit":
		case "BeforeAgent":
			return "working";
		case "PermissionRequest":
		case "PendingQuestion":
			return "waiting";
		case "Stop":
		case "Detached":
			return "done";
		case "Failed":
			return "error";
		default:
			return "idle";
	}
}

function truncateTaskTitle(value: string): string {
	const characters = Array.from(value);
	if (characters.length <= TASK_TITLE_LIMIT) return value;
	return `${characters.slice(0, TASK_TITLE_LIMIT - 1).join("")}…`;
}
