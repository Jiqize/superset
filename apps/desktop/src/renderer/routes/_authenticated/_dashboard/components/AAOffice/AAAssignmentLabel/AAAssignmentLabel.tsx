import { AAIcon } from "../AAIcon";
import {
	type AAAssignmentPhase,
	getAAAssignmentPresentation,
} from "./aaAssignmentPresentation";

interface AAAssignmentLabelProps {
	employeeName?: string | null;
	phase: AAAssignmentPhase;
}

export function AAAssignmentLabel({
	employeeName,
	phase,
}: AAAssignmentLabelProps) {
	const presentation = getAAAssignmentPresentation(phase, employeeName);

	return (
		<div
			aria-live={phase === "idle" ? "off" : "polite"}
			className="aa-employee-roster__label"
			data-assignment-phase={phase}
			role={phase === "idle" ? undefined : "status"}
			title={presentation.detail}
		>
			<AAIcon name={phase === "idle" ? "agents" : "folder"} />
			<span>
				<strong>{presentation.heading}</strong>
				<small>{presentation.detail}</small>
			</span>
		</div>
	);
}
