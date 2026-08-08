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
