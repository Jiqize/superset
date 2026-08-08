import { cn } from "@superset/ui/utils";
import type { ReactNode } from "react";
import {
	type AAEmployeeEyewear,
	type AAEmployeeHair,
	resolveAAEmployeePersona,
} from "./aaEmployeePersonas";

interface AAEmployeeAvatarProps {
	agentId?: string;
	className?: string;
	iconSrc?: string;
	label: string;
}

export function AAEmployeeAvatar({
	agentId,
	className,
	iconSrc,
	label,
}: AAEmployeeAvatarProps) {
	const persona = resolveAAEmployeePersona({ agentId, name: label });

	return (
		<span
			aria-hidden="true"
			className={cn("aa-employee-avatar", className)}
			data-accent={persona.accent}
			data-eyewear={persona.eyewear}
			data-hair={persona.hair}
			data-jacket={persona.jacket}
			data-persona={persona.id}
		>
			<svg
				aria-hidden="true"
				className="aa-employee-avatar__worker"
				shapeRendering="crispEdges"
				viewBox="0 0 24 24"
			>
				<rect className="aa-employee-avatar__backdrop" width="24" height="24" />
				<rect
					className="aa-employee-avatar__skin"
					x="6"
					y="7"
					width="2"
					height="5"
				/>
				<rect
					className="aa-employee-avatar__skin"
					x="17"
					y="7"
					width="2"
					height="5"
				/>
				<rect
					className="aa-employee-avatar__skin"
					x="7"
					y="5"
					width="11"
					height="7"
				/>
				{renderHair(persona.hair)}
				{renderEyewear(persona.eyewear)}
				<rect
					className="aa-employee-avatar__ink"
					x="9"
					y="8"
					width="1"
					height="1"
				/>
				<rect
					className="aa-employee-avatar__ink"
					x="15"
					y="8"
					width="1"
					height="1"
				/>
				<rect
					className="aa-employee-avatar__mouth"
					x="11"
					y="10"
					width="3"
					height="1"
				/>
				<rect
					className="aa-employee-avatar__jacket"
					x="5"
					y="13"
					width="15"
					height="9"
				/>
				<rect
					className="aa-employee-avatar__shirt"
					x="10"
					y="13"
					width="5"
					height="9"
				/>
				<path
					className="aa-employee-avatar__lapel"
					d="M5 13h5v6H8v-2H5zm15 0h-5v6h2v-2h3z"
				/>
				<rect
					className="aa-employee-avatar__accent"
					x="12"
					y="14"
					width="1"
					height="7"
				/>
			</svg>
			<span className="aa-employee-avatar__badge">
				{iconSrc ? <img alt="" src={iconSrc} /> : <span>{persona.badge}</span>}
			</span>
		</span>
	);
}

function renderHair(hair: AAEmployeeHair): ReactNode {
	switch (hair) {
		case "parted":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="3"
						width="5"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="12"
						y="2"
						width="6"
						height="4"
					/>
				</>
			);
		case "wave":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="8"
						y="1"
						width="7"
						height="2"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="3"
						width="12"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="5"
						y="5"
						width="3"
						height="4"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="17"
						y="5"
						width="3"
						height="4"
					/>
				</>
			);
		case "spiked":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="3"
						width="12"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="1"
						width="2"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="10"
						y="2"
						width="2"
						height="2"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="14"
						y="1"
						width="2"
						height="3"
					/>
				</>
			);
		case "fringe":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="2"
						width="12"
						height="4"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="5"
						width="3"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="12"
						y="5"
						width="3"
						height="2"
					/>
				</>
			);
		case "cap":
			return (
				<>
					<rect
						className="aa-employee-avatar__cap"
						x="6"
						y="2"
						width="12"
						height="4"
					/>
					<rect
						className="aa-employee-avatar__cap"
						x="5"
						y="5"
						width="15"
						height="2"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="6"
						width="3"
						height="2"
					/>
				</>
			);
		case "swept":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="3"
						width="12"
						height="3"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="8"
						y="2"
						width="9"
						height="2"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="16"
						y="5"
						width="3"
						height="3"
					/>
				</>
			);
		case "short":
			return (
				<rect
					className="aa-employee-avatar__hair"
					x="7"
					y="3"
					width="10"
					height="3"
				/>
			);
		case "crop":
			return (
				<>
					<rect
						className="aa-employee-avatar__hair"
						x="7"
						y="2"
						width="10"
						height="2"
					/>
					<rect
						className="aa-employee-avatar__hair"
						x="6"
						y="4"
						width="12"
						height="2"
					/>
				</>
			);
	}
}

function renderEyewear(eyewear: AAEmployeeEyewear): ReactNode {
	if (eyewear === "none") return null;

	if (eyewear === "round") {
		return (
			<>
				<path
					className="aa-employee-avatar__glasses"
					d="M7 7h5v1h1V7h5v4h-1v1h-4v-1h-1v1H8v-1H7z"
				/>
				<rect
					className="aa-employee-avatar__lens"
					x="9"
					y="8"
					width="2"
					height="2"
				/>
				<rect
					className="aa-employee-avatar__lens"
					x="14"
					y="8"
					width="2"
					height="2"
				/>
			</>
		);
	}

	return (
		<>
			<path
				className="aa-employee-avatar__glasses"
				d="M7 7h5v1h1V7h5v5h-5v-2h-1v2H7z"
			/>
			<rect
				className="aa-employee-avatar__lens"
				x="8"
				y="8"
				width="3"
				height="2"
			/>
			<rect
				className="aa-employee-avatar__lens"
				x="14"
				y="8"
				width="3"
				height="2"
			/>
		</>
	);
}
