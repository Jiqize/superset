import { cn } from "@superset/ui/utils";
import type { ReactNode } from "react";
import type { AAAgentState } from "../AAAgentStatus/aaAgentState";
import { AAHairState } from "../AAHairState";
import { getAAReasoningPresentation } from "../AAReasoningIndicator/aaReasoningPresentation";

interface AAAgentAvatarProps {
	className?: string;
	reasoningLevel?: string | null;
	state: AAAgentState;
}

export function AAAgentAvatar({
	className,
	reasoningLevel,
	state,
}: AAAgentAvatarProps) {
	const reasoning = getAAReasoningPresentation(reasoningLevel);

	return (
		<svg
			aria-hidden="true"
			className={cn("aa-agent-avatar", className)}
			data-hair-state={reasoning?.hairState}
			data-reasoning-level={reasoning?.level}
			data-state={state}
			shapeRendering="crispEdges"
			viewBox="0 0 40 40"
		>
			<rect className="aa-agent-avatar__backdrop" width="40" height="40" />
			<rect
				className="aa-agent-avatar__floor"
				x="0"
				y="36"
				width="40"
				height="4"
			/>
			<rect
				className="aa-agent-avatar__shirt"
				x="10"
				y="21"
				width="20"
				height="13"
			/>
			<rect
				className="aa-agent-avatar__shirt-panel"
				x="16"
				y="21"
				width="8"
				height="12"
			/>
			<rect
				className="aa-agent-avatar__tie"
				x="19"
				y="22"
				width="3"
				height="9"
			/>
			<rect
				className="aa-agent-avatar__skin"
				x="11"
				y="11"
				width="3"
				height="7"
			/>
			<rect
				className="aa-agent-avatar__skin"
				x="26"
				y="11"
				width="3"
				height="7"
			/>
			<AAHairState state={reasoning?.hairState} />
			<rect
				className="aa-agent-avatar__skin"
				x="13"
				y="8"
				width="14"
				height="12"
			/>
			{renderExpression(state)}
			{renderPose(state)}
		</svg>
	);
}

function renderExpression(state: AAAgentState): ReactNode {
	if (state === "offline") {
		return (
			<>
				<rect
					className="aa-agent-avatar__ink"
					x="15"
					y="14"
					width="3"
					height="1"
				/>
				<rect
					className="aa-agent-avatar__ink"
					x="22"
					y="14"
					width="3"
					height="1"
				/>
				<rect
					className="aa-agent-avatar__mouth"
					x="18"
					y="18"
					width="4"
					height="1"
				/>
			</>
		);
	}

	if (state === "error") {
		return (
			<>
				<path
					className="aa-agent-avatar__ink"
					d="M15 12h2v1h2v1h-4zm10 0h-2v1h-2v1h4z"
				/>
				<rect
					className="aa-agent-avatar__ink"
					x="16"
					y="15"
					width="2"
					height="1"
				/>
				<rect
					className="aa-agent-avatar__ink"
					x="23"
					y="15"
					width="2"
					height="1"
				/>
				<path className="aa-agent-avatar__mouth" d="M18 19h1v-1h3v1h1v1h-5z" />
			</>
		);
	}

	return (
		<>
			<rect
				className="aa-agent-avatar__ink"
				x="16"
				y="13"
				width="2"
				height="2"
			/>
			<rect
				className="aa-agent-avatar__ink"
				x="23"
				y={state === "thinking" ? "14" : "13"}
				width="2"
				height="2"
			/>
			<rect
				className="aa-agent-avatar__mouth"
				x="18"
				y="18"
				width="4"
				height="1"
			/>
		</>
	);
}

function renderPose(state: AAAgentState): ReactNode {
	switch (state) {
		case "working":
			return (
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
						x="24"
						y="22"
						width="12"
						height="10"
					/>
					<rect
						className="aa-agent-avatar__screen"
						x="26"
						y="24"
						width="8"
						height="6"
					/>
					<rect
						className="aa-agent-avatar__screen-line"
						x="27"
						y="26"
						width="4"
						height="1"
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
						width="7"
						height="3"
					/>
				</>
			);
		case "thinking":
			return (
				<>
					<rect
						className="aa-agent-avatar__shirt"
						x="8"
						y="23"
						width="3"
						height="9"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="8"
						y="30"
						width="3"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__shirt"
						x="29"
						y="22"
						width="4"
						height="7"
					/>
					<rect
						className="aa-agent-avatar__hand aa-agent-avatar__thinking-hand"
						x="27"
						y="17"
						width="4"
						height="7"
					/>
					<rect
						className="aa-agent-avatar__hand aa-agent-avatar__thinking-hand"
						x="25"
						y="16"
						width="4"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__thought"
						x="30"
						y="8"
						width="2"
						height="2"
					/>
					<rect
						className="aa-agent-avatar__thought"
						x="34"
						y="4"
						width="3"
						height="3"
					/>
				</>
			);
		case "waiting":
			return (
				<>
					<rect
						className="aa-agent-avatar__shirt"
						x="8"
						y="24"
						width="6"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__shirt"
						x="26"
						y="24"
						width="6"
						height="5"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="13"
						y="27"
						width="4"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="24"
						y="27"
						width="4"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__paper"
						x="16"
						y="23"
						width="9"
						height="13"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="18"
						y="26"
						width="5"
						height="1"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="18"
						y="29"
						width="4"
						height="1"
					/>
					<rect
						className="aa-agent-avatar__ink"
						x="18"
						y="32"
						width="5"
						height="1"
					/>
				</>
			);
		case "error":
			return (
				<>
					<rect
						className="aa-agent-avatar__shirt"
						x="6"
						y="19"
						width="7"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__shirt"
						x="28"
						y="19"
						width="7"
						height="4"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="8"
						y="13"
						width="4"
						height="7"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="29"
						y="13"
						width="4"
						height="7"
					/>
					<rect
						className="aa-agent-avatar__paper"
						x="4"
						y="28"
						width="7"
						height="8"
					/>
					<rect
						className="aa-agent-avatar__error-mark"
						x="7"
						y="30"
						width="1"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__error-mark"
						x="7"
						y="34"
						width="1"
						height="1"
					/>
				</>
			);
		case "idle":
		case "offline":
			return (
				<>
					<rect
						className="aa-agent-avatar__shirt"
						x="8"
						y="23"
						width="3"
						height="8"
					/>
					<rect
						className="aa-agent-avatar__shirt"
						x="29"
						y="23"
						width="3"
						height="8"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="8"
						y="30"
						width="3"
						height="3"
					/>
					<rect
						className="aa-agent-avatar__hand"
						x="29"
						y="30"
						width="3"
						height="3"
					/>
				</>
			);
	}
}
