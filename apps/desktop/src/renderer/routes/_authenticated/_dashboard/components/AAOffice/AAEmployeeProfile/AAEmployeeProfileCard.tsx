import { AAAgentAvatar } from "../AAAgentAvatar";
import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import type { AAEmployeeProfilePresentation } from "./aaEmployeeProfilePresentation";

interface AAEmployeeProfileCardProps {
	presentation: AAEmployeeProfilePresentation;
}

export function AAEmployeeProfileCard({
	presentation,
}: AAEmployeeProfileCardProps) {
	const isPi = presentation.personaId === "pi";
	return (
		<section
			aria-label={`${presentation.employeeName} employee profile`}
			className="aa-employee-profile-card"
			data-authority={presentation.authority}
			data-status={presentation.statusLabel.toLowerCase().replaceAll(" ", "-")}
		>
			<header className="aa-employee-profile-card__header">
				<span className="aa-employee-profile-card__portrait">
					{isPi ? (
						<AAAgentAvatar
							reasoningLevel={presentation.reasoning?.value}
							state={presentation.avatarState}
						/>
					) : (
						<AAEmployeeAvatar
							agentId={presentation.personaId}
							label={presentation.employeeName}
						/>
					)}
				</span>
				<span className="aa-employee-profile-card__identity">
					<small>EMPLOYEE PROFILE</small>
					<strong>{presentation.employeeName}</strong>
					<span>{presentation.authorityLabel}</span>
				</span>
				<AAStatusLight tone={toneForProfile(presentation)} />
			</header>

			<dl className="aa-employee-profile-card__facts">
				<ProfileFact label="RUNTIME" value={presentation.runtimeLabel} />
				<ProfileFact label="TRANSPORT" value={presentation.transportLabel} />
				<ProfileFact label="STATUS" value={presentation.statusLabel} />
				{presentation.model ? (
					<ProfileFact
						label="MODEL"
						value={presentation.model.label}
						detail={presentation.model.id}
					/>
				) : null}
				{presentation.reasoning ? (
					<ProfileFact
						label="REASONING"
						value={presentation.reasoning.value}
						detail={
							presentation.reasoning.availableValues?.length
								? `AVAILABLE VALUES · ${presentation.reasoning.availableValues.join(" · ")}`
								: undefined
						}
					/>
				) : null}
				{presentation.resumeLabel ? (
					<ProfileFact label="RESUME" value={presentation.resumeLabel} />
				) : null}
			</dl>

			{presentation.notice ? (
				<p className="aa-employee-profile-card__notice">
					{presentation.notice}
				</p>
			) : null}

			{presentation.capabilities.length > 0 ? (
				<div className="aa-employee-profile-card__capabilities">
					<strong>CAPABILITY STATUS</strong>
					<ul>
						{presentation.capabilities.map((capability) => (
							<li
								key={capability.label}
								data-support={capability.support}
								title={capability.reason ?? undefined}
							>
								<span>{capability.label}</span>
								<small>{capability.support.toUpperCase()}</small>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</section>
	);
}

function ProfileFact({
	detail,
	label,
	value,
}: {
	detail?: string;
	label: string;
	value: string;
}) {
	return (
		<div>
			<dt>{label}</dt>
			<dd>
				<strong>{value}</strong>
				{detail ? <small>{detail}</small> : null}
			</dd>
		</div>
	);
}

function toneForProfile(
	presentation: AAEmployeeProfilePresentation,
): AAStatusTone {
	if (presentation.authority === "saved") return "attention";
	if (presentation.authority !== "authoritative") return "offline";
	if (presentation.statusLabel.includes("ERROR")) return "error";
	if (presentation.statusLabel.includes("AUTHENTICATION")) return "attention";
	if (presentation.avatarState === "working") return "working";
	if (presentation.avatarState === "waiting") return "attention";
	if (presentation.avatarState === "idle") return "success";
	return "offline";
}
