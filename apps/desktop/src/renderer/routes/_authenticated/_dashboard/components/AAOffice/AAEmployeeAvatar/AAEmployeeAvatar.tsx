import { cn } from "@superset/ui/utils";

interface AAEmployeeAvatarProps {
	className?: string;
	iconSrc?: string;
	label: string;
}

export function AAEmployeeAvatar({
	className,
	iconSrc,
	label,
}: AAEmployeeAvatarProps) {
	const badgeLabel = label.trim().charAt(0).toUpperCase() || "?";

	return (
		<span
			aria-hidden="true"
			className={cn("aa-employee-avatar", className)}
			data-persona={getPersona(label)}
		>
			<svg
				aria-hidden="true"
				className="aa-employee-avatar__worker"
				shapeRendering="crispEdges"
				viewBox="0 0 24 24"
			>
				<rect className="aa-employee-avatar__backdrop" width="24" height="24" />
				<rect
					className="aa-employee-avatar__hair"
					x="8"
					y="3"
					width="9"
					height="4"
				/>
				<rect
					className="aa-employee-avatar__skin"
					x="8"
					y="6"
					width="9"
					height="7"
				/>
				<rect
					className="aa-employee-avatar__ink"
					x="10"
					y="9"
					width="1"
					height="1"
				/>
				<rect
					className="aa-employee-avatar__ink"
					x="14"
					y="9"
					width="1"
					height="1"
				/>
				<rect
					className="aa-employee-avatar__shirt"
					x="6"
					y="13"
					width="13"
					height="9"
				/>
				<rect
					className="aa-employee-avatar__tie"
					x="12"
					y="14"
					width="2"
					height="7"
				/>
			</svg>
			<span className="aa-employee-avatar__badge">
				{iconSrc ? <img alt="" src={iconSrc} /> : <span>{badgeLabel}</span>}
			</span>
		</span>
	);
}

function getPersona(label: string): "0" | "1" | "2" | "3" {
	let checksum = 0;
	for (const character of label) checksum += character.codePointAt(0) ?? 0;
	return String(checksum % 4) as "0" | "1" | "2" | "3";
}
