import type { AAWorkerTracking } from "../AAActiveWorkerCard";

export const AA_TASK_FOLDER_STATES = [
	"unassigned",
	"idle",
	"working",
	"waiting",
	"turn-complete",
	"session-ended",
	"error",
	"untracked",
] as const;

export type AATaskFolderState = (typeof AA_TASK_FOLDER_STATES)[number];

export interface AATaskFolderMetricPresentation {
	accessibleSummary: string;
	label: "LAST EVENT" | "LAST TURN" | "SESSION" | "STATUS" | "TRACKING";
	value: string;
}

interface AATaskTitleSources {
	explicitTitle?: string | null;
	sessionLabel?: string | null;
	terminalLabel?: string | null;
}

interface AATaskFolderRenameInput {
	action: "cancel" | "save";
	currentTitleOverride?: string;
	draft: string;
}

export interface AATaskFolderRenameResult {
	committed: boolean;
	titleOverride?: string;
}

const TASK_TITLE_LIMIT = 48;

export function resolveAATaskFolderTitle({
	explicitTitle,
	sessionLabel,
	terminalLabel,
}: AATaskTitleSources): string {
	for (const source of [explicitTitle, sessionLabel, terminalLabel]) {
		const normalized = normalizeAATaskFolderTitleInput(source);
		if (normalized) return normalized;
	}
	return "Current Work Session";
}

export function normalizeAATaskFolderTitleInput(
	value: string | null | undefined,
): string | undefined {
	const normalized = value?.replace(/\s+/g, " ").trim();
	if (!normalized) return undefined;
	return truncateTaskTitle(normalized);
}

export function resolveAATaskFolderRename({
	action,
	currentTitleOverride,
	draft,
}: AATaskFolderRenameInput): AATaskFolderRenameResult {
	if (action === "cancel") {
		return { committed: false, titleOverride: currentTitleOverride };
	}
	return {
		committed: true,
		titleOverride: normalizeAATaskFolderTitleInput(draft),
	};
}

export function mapLifecycleEventToAATaskFolderState(
	eventType: string | undefined,
	tracking: AAWorkerTracking,
): AATaskFolderState {
	if (tracking === "untracked") return "untracked";
	if (tracking === "unassigned") return "unassigned";

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
			return "turn-complete";
		case "Detached":
			return "session-ended";
		case "Failed":
			return "error";
		default:
			return "idle";
	}
}

export function formatAATaskFolderState(state: AATaskFolderState): string {
	return state.replaceAll("-", " ").toUpperCase();
}

export function getAATaskFolderMetricPresentation(
	state: AATaskFolderState,
): AATaskFolderMetricPresentation {
	switch (state) {
		case "turn-complete":
			return {
				accessibleSummary: "last turn: complete",
				label: "LAST TURN",
				value: "COMPLETE",
			};
		case "session-ended":
			return {
				accessibleSummary: "session: ended",
				label: "SESSION",
				value: "ENDED",
			};
		case "untracked":
			return {
				accessibleSummary: "tracking: untracked",
				label: "TRACKING",
				value: "UNTRACKED",
			};
		case "error":
			return {
				accessibleSummary: "last event: error",
				label: "LAST EVENT",
				value: "ERROR",
			};
		case "idle":
		case "unassigned":
		case "waiting":
		case "working": {
			const value = formatAATaskFolderState(state);
			return {
				accessibleSummary: `status: ${value.toLowerCase()}`,
				label: "STATUS",
				value,
			};
		}
	}
}

function truncateTaskTitle(value: string): string {
	const characters = Array.from(value);
	if (characters.length <= TASK_TITLE_LIMIT) return value;
	return `${characters.slice(0, TASK_TITLE_LIMIT - 1).join("")}…`;
}
