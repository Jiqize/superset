import { cn } from "@superset/ui/utils";
import type { AAAgentState } from "../AAAgentStatus/aaAgentState";

interface AAAgentAvatarProps {
	className?: string;
	state: AAAgentState;
}

export function AAAgentAvatar({ className, state }: AAAgentAvatarProps) {
	return (
		<svg
			aria-hidden="true"
			className={cn("aa-agent-avatar", className)}
			data-state={state}
			shapeRendering="crispEdges"
			viewBox="0 0 40 40"
		>
			<rect className="aa-agent-avatar__backdrop" width="40" height="40" />
			<rect
				className="aa-agent-avatar__hair"
				x="13"
				y="5"
				width="14"
				height="5"
			/>
			<rect
				className="aa-agent-avatar__skin"
				x="14"
				y="9"
				width="12"
				height="11"
			/>
			<rect
				className="aa-agent-avatar__ink"
				x="17"
				y="13"
				width="2"
				height="2"
			/>
			<rect
				className="aa-agent-avatar__ink"
				x="22"
				y="13"
				width="2"
				height="2"
			/>
			<rect
				className="aa-agent-avatar__shirt"
				x="11"
				y="20"
				width="18"
				height="13"
			/>
			<rect
				className="aa-agent-avatar__tie"
				x="19"
				y="21"
				width="3"
				height="10"
			/>

			{state === "working" ? (
				<>
					<rect
						className="aa-agent-avatar__desk"
						x="4"
						y="32"
						width="32"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="23"
						y="22"
						width="12"
						height="10"
					/>
					<rect
						className="aa-agent-avatar__screen"
						x="25"
						y="24"
						width="8"
						height="6"
					/>
					<rect
						className="aa-agent-avatar__hand aa-agent-avatar__hand--left"
						x="10"
						y="29"
						width="7"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__hand aa-agent-avatar__hand--right"
						x="17"
						y="30"
						width="6"
						height="3"
					/>
				</>
			) : state === "thinking" ? (
				<>
					<rect
						className="aa-agent-avatar__skin aa-agent-avatar__thinking-hand"
						x="28"
						y="17"
						width="4"
						height="9"
					/>
					<rect
						className="aa-agent-avatar__thought"
						x="30"
						y="7"
						width="2"
						height="2"
					/>
					<rect
						className="aa-agent-avatar__thought"
						x="34"
						y="4"
						width="2"
						height="2"
					/>
				</>
			) : state === "waiting" ? (
				<>
					<rect
						className="aa-agent-avatar__paper"
						x="27"
						y="20"
						width="9"
						height="12"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="29"
						y="23"
						width="5"
						height="1"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="29"
						y="26"
						width="4"
						height="1"
					/>
				</>
			) : state === "error" ? (
				<>
					<rect
						className="aa-agent-avatar__skin"
						x="5"
						y="18"
						width="7"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__skin"
						x="29"
						y="18"
						width="7"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__paper"
						x="4"
						y="27"
						width="5"
						height="7"
					/>
				</>
			) : (
				<>
					<rect
						className="aa-agent-avatar__ink"
						x="10"
						y="23"
						width="2"
						height="10"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="29"
						y="23"
						width="2"
						height="10"
					/>
				</>
			)}
		</svg>
	);
}
