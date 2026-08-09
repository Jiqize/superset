import { cn } from "@superset/ui/utils";
import { AAAgentAvatar } from "../AAAgentAvatar";
import type { AAAgentState } from "../AAAgentStatus/aaAgentState";
import { getAAReasoningPresentation } from "./aaReasoningPresentation";

interface AAReasoningIndicatorProps {
	className?: string;
	level?: string | null;
	state?: AAAgentState;
}

export function AAReasoningIndicator({
	className,
	level,
	state = "idle",
}: AAReasoningIndicatorProps) {
	const presentation = getAAReasoningPresentation(level);
	const label = presentation?.label ?? "UNAVAILABLE";

	return (
		<div
			className={cn("aa-reasoning-indicator", className)}
			data-available={Boolean(presentation)}
			data-hair-state={presentation?.hairState}
			data-reasoning-level={presentation?.level}
		>
			<span className="aa-reasoning-indicator__portrait">
				<AAAgentAvatar reasoningLevel={presentation?.level} state={state} />
			</span>
			<span className="aa-reasoning-indicator__copy">
				<small>REASONING</small>
				<strong>{label}</strong>
			</span>
		</div>
	);
}
