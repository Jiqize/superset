export const AA_AGENT_STATES = [
	"offline",
	"idle",
	"thinking",
	"working",
	"waiting",
	"error",
] as const;

export type AAAgentState = (typeof AA_AGENT_STATES)[number];

export interface AAAgentBindingLike {
	agentId: string;
	lastEventAt: number;
	lastEventType: string;
	terminalId: string;
}

export function mapLifecycleEventToAAState(
	eventType: string | undefined,
): AAAgentState {
	switch (eventType) {
		case undefined:
		case "Detached":
			return "offline";
		case "Thinking":
		case "UserPromptSubmit":
		case "BeforeAgent":
			return "thinking";
		case "Start":
		case "PostToolUse":
		case "PostToolUseFailure":
			return "working";
		case "PermissionRequest":
		case "PendingQuestion":
			return "waiting";
		case "Failed":
			return "error";
		default:
			return "idle";
	}
}

/** Avatar pose mapping only; callers retain the exact runtime label. */
export function mapAARuntimeStateToAAState(
	state: AARuntimeState,
): AAAgentState {
	switch (state) {
		case "idle":
			return "idle";
		case "working":
			return "working";
		case "waiting_permission":
		case "waiting_user":
		case "cancelling":
			return "waiting";
		case "error":
			return "error";
		case "starting":
		case "offline":
		case "ended":
		case "unknown":
			return "offline";
	}
}

export function selectLatestPiBinding<T extends AAAgentBindingLike>(
	bindings: Iterable<T>,
): T | undefined {
	let latest: T | undefined;
	for (const binding of bindings) {
		if (binding.agentId !== "pi") continue;
		if (!latest || binding.lastEventAt > latest.lastEventAt) latest = binding;
	}
	return latest;
}

import type { AARuntimeState } from "@superset/session-protocol";
