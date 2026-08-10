import type { AARuntimeState } from "@superset/session-protocol";
import type {
	AAActiveWorkerPresentation,
	AAWorkerTracking,
} from "../AAActiveWorkerCard";
import type { AARuntimeHealthCode } from "../AAAgentStatus/aaRuntimeHealth";

export const AA_TASK_FOLDER_STATES = [
	"unassigned",
	"idle",
	"working",
	"waiting",
	"turn-complete",
	"session-ended",
	"error",
	"untracked",
	"starting",
	"cancelling",
	"offline",
	"unknown",
] as const;

export type AATaskFolderState = (typeof AA_TASK_FOLDER_STATES)[number];

export interface AATaskFolderMetricPresentation {
	accessibleSummary: string;
	label: "LAST EVENT" | "LAST TURN" | "SESSION" | "STATUS" | "TRACKING";
	value: string;
}

export interface AATaskFolderContextPresentation {
	authority: string;
	changedFiles?: string;
	employee: string;
	latestAction?: string;
	model?: string;
	reasoning?: string;
	resume?: string;
	runtime: string;
	status: string;
	transport: string;
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

const RUNTIME_ACTION_LABELS: Readonly<Record<string, string>> = {
	authentication_required: "AUTHENTICATION REQUIRED",
	cancel_requested: "CANCELLATION REQUESTED",
	permission_requested: "PERMISSION REQUESTED",
	resume_identity_mismatch: "RESUME FAILED",
	resume_identity_not_confirmed: "RESUME FAILED",
	runtime_failed: "RUNTIME ERROR",
	session_attach: "SESSION ATTACHED",
	session_started: "SESSION STARTED",
	terminal_process_lost: "SESSION INTERRUPTED",
	turn_settled: "TURN SETTLED",
	turn_started: "TURN STARTED",
	user_input_requested: "USER INPUT REQUESTED",
};

const LEGACY_ACTION_LABELS: Readonly<Record<string, string>> = {
	Attached: "SESSION ATTACHED",
	Detached: "SESSION ENDED",
	Failed: "RUNTIME ERROR",
	PendingQuestion: "USER INPUT REQUESTED",
	PermissionRequest: "PERMISSION REQUESTED",
	PostToolUse: "TOOL FINISHED",
	PostToolUseFailure: "TOOL FAILED",
	Start: "TURN STARTED",
	Stop: "TURN COMPLETE",
	UserPromptSubmit: "TURN STARTED",
};

export function getAATaskFolderLatestAction({
	lastEventType,
	stateReason,
}: {
	lastEventType?: string;
	stateReason?: string;
}): string | undefined {
	if (stateReason) {
		return RUNTIME_ACTION_LABELS[stateReason];
	}
	return lastEventType ? LEGACY_ACTION_LABELS[lastEventType] : undefined;
}

export function getAATaskFolderContextPresentation({
	changedFileCount,
	worker,
}: {
	changedFileCount: number | null;
	worker: AAActiveWorkerPresentation;
}): AATaskFolderContextPresentation {
	const model = worker.model?.displayName ?? worker.model?.id;
	const latestAction = getAATaskFolderLatestAction({
		lastEventType: worker.lastEventType,
		stateReason: worker.stateReason,
	});
	return {
		authority: worker.authorityLabel,
		...(changedFileCount === null
			? {}
			: { changedFiles: `${changedFileCount} CHANGED` }),
		employee: worker.tracking === "unassigned" ? "—" : worker.displayName,
		...(latestAction ? { latestAction } : {}),
		...(model ? { model } : {}),
		...(worker.reasoning ? { reasoning: worker.reasoning.value } : {}),
		...(worker.resumeLabel ? { resume: worker.resumeLabel } : {}),
		runtime: worker.runtimeLabel,
		status: worker.statusLabel,
		transport: worker.transportLabel,
	};
}

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

export function mapAARuntimeSnapshotToAATaskFolderState(
	state: AARuntimeState,
	stateReason: string | null | undefined,
): AATaskFolderState {
	switch (state) {
		case "starting":
			return "starting";
		case "idle":
			return stateReason === "turn_settled" ? "turn-complete" : "idle";
		case "working":
			return "working";
		case "waiting_permission":
		case "waiting_user":
			return "waiting";
		case "cancelling":
			return "cancelling";
		case "offline":
			return "offline";
		case "error":
			return "error";
		case "ended":
			return "session-ended";
		case "unknown":
			return "unknown";
	}
}

export function mapAAWorkerToAATaskFolderState(worker: {
	healthCode?: AARuntimeHealthCode;
	lastEventType?: string;
	runtimeState?: AARuntimeState;
	stateReason?: string;
	tracking: AAWorkerTracking;
}): AATaskFolderState {
	if (worker.runtimeState) {
		return mapAARuntimeSnapshotToAATaskFolderState(
			worker.runtimeState,
			worker.stateReason,
		);
	}

	switch (worker.healthCode) {
		case "offline":
		case "offline_resumable":
			return "offline";
		case "starting":
			return "starting";
		case "working":
			return "working";
		case "idle":
			return "idle";
		case "waiting":
			return "waiting";
		case "cancelling":
			return "cancelling";
		case "unknown":
			return "unknown";
		case "error":
		case "resume_identity_mismatch":
		case "resume_not_confirmed":
			return "error";
		case undefined:
			return mapLifecycleEventToAATaskFolderState(
				worker.lastEventType,
				worker.tracking,
			);
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
		case "working":
		case "starting":
		case "cancelling":
		case "offline":
		case "unknown": {
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
