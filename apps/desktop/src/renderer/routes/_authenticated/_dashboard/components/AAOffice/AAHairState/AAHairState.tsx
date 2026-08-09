import type { AAHairStateName } from "../AAReasoningIndicator/aaReasoningPresentation";

interface AAHairStateProps {
	state?: AAHairStateName;
}

export function AAHairState({ state }: AAHairStateProps) {
	switch (state) {
		case "trimmed":
			return (
				<g className="aa-agent-avatar__reasoning-hair" data-hair-state={state}>
					<rect
						className="aa-agent-avatar__hair"
						x="13"
						y="4"
						width="14"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="11"
						y="7"
						width="3"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="26"
						y="7"
						width="3"
						height="4"
					/>
				</g>
			);
		case "receding":
			return (
				<g className="aa-agent-avatar__reasoning-hair" data-hair-state={state}>
					<rect
						className="aa-agent-avatar__hair"
						x="16"
						y="4"
						width="8"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="11"
						y="7"
						width="3"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="26"
						y="7"
						width="3"
						height="4"
					/>
				</g>
			);
		case "sparse":
			return (
				<g className="aa-agent-avatar__reasoning-hair" data-hair-state={state}>
					<rect
						className="aa-agent-avatar__hair"
						x="18"
						y="4"
						width="5"
						height="2"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="12"
						y="8"
						width="2"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="27"
						y="8"
						width="2"
						height="3"
					/>
				</g>
			);
		case "bald":
			return (
				<g className="aa-agent-avatar__reasoning-hair" data-hair-state={state}>
					<rect
						className="aa-agent-avatar__hair"
						x="12"
						y="9"
						width="2"
						height="2"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="27"
						y="9"
						width="2"
						height="2"
					/>
				</g>
			);
		case "full":
		case undefined:
			return (
				<g className="aa-agent-avatar__reasoning-hair" data-hair-state={state}>
					<rect
						className="aa-agent-avatar__hair"
						x="12"
						y="4"
						width="16"
						height="6"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="10"
						y="7"
						width="4"
						height="6"
					/>
					<rect
						className="aa-agent-avatar__hair"
						x="26"
						y="7"
						width="4"
						height="5"
					/>
				</g>
			);
	}
}
