import { Button } from "@superset/ui/button";
import { useTerminalResumeCandidate } from "renderer/hooks/host-service/useTerminalResumeCandidate";
import { AAAgentAvatar } from "../AAAgentAvatar";
import { useAAAgentStatus } from "../AAAgentStatus";
import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAEmployeeProfile } from "../AAEmployeeProfile";
import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import {
	type AAActiveTerminalPresentationInput,
	resolveAAActiveWorkerPresentation,
} from "./aaActiveWorkerPresentation";

interface AAActiveWorkerCardProps {
	terminal?: AAActiveTerminalPresentationInput | null;
}

export function AAActiveWorkerCard({ terminal }: AAActiveWorkerCardProps) {
	const { bindings, runtimeSnapshots, workspaceId } = useAAAgentStatus();
	const { candidate: resumeCandidate } = useTerminalResumeCandidate(
		workspaceId,
		terminal?.terminalId ?? "",
	);
	const binding = terminal ? bindings.get(terminal.terminalId) : undefined;
	const runtimeSnapshot = terminal
		? runtimeSnapshots.get(terminal.terminalId)
		: undefined;
	const presentation = resolveAAActiveWorkerPresentation({
		binding,
		...(resumeCandidate
			? {
					resumeCandidate: {
						agentId: resumeCandidate.agentId,
						resumeSupported: resumeCandidate.resumeSupported,
					},
				}
			: {}),
		runtimeSnapshot,
		terminal,
	});
	const isPi = presentation.personaId === "pi";
	const avatarState =
		presentation.tracking === "tracked" &&
		presentation.status !== "untracked" &&
		presentation.status !== "unassigned"
			? presentation.status
			: "offline";

	return (
		<section
			aria-label={`${presentation.heading}: ${presentation.statusLabel}`}
			className="aa-agent-status aa-active-worker-card"
			data-source={presentation.source}
			data-state={presentation.status}
			data-runtime-health={presentation.healthCode}
			data-runtime-authority={presentation.authorityLabel}
			title={getCardDetail(presentation)}
		>
			<span className="aa-agent-status__portrait">
				{isPi ? (
					<AAAgentAvatar
						reasoningLevel={presentation.reasoning?.value}
						state={avatarState}
					/>
				) : (
					<AAEmployeeAvatar
						agentId={presentation.agentId}
						className="aa-active-worker-card__employee"
						label={presentation.displayName}
					/>
				)}
			</span>
			<div className="aa-agent-status__copy">
				<span className="aa-agent-status__eyebrow">
					{presentation.heading}
					<span className="aa-active-worker-card__actions">
						<AAEmployeeProfile
							agentId={presentation.agentId}
							name={presentation.displayName}
							resumeAvailable={presentation.resumeLabel === "AVAILABLE"}
							runtimeSnapshot={runtimeSnapshot}
							side="bottom"
						>
							<Button
								aria-label={`View ${presentation.displayName} employee file`}
								className="aa-active-worker-card__profile"
								size="icon"
								title={`View ${presentation.displayName} employee file`}
								variant="ghost"
							>
								<AAIcon name="agents" />
							</Button>
						</AAEmployeeProfile>
						<AAStatusLight
							className="aa-agent-status__light"
							tone={toneForPresentation(presentation)}
						/>
					</span>
				</span>
				<span className="aa-agent-status__state">
					{presentation.statusLabel}
				</span>
				<span
					className="aa-active-worker-card__authority"
					title={presentation.authorityLabel}
				>
					{presentation.runtimeLabel} · {presentation.transportLabel} ·{" "}
					{presentation.authorityLabel}
				</span>
				{presentation.model && (
					<span
						className="aa-active-worker-card__runtime"
						title={formatModelDetail(presentation.model)}
					>
						MODEL: {presentation.model.displayName ?? presentation.model.id}
					</span>
				)}
				{presentation.reasoning && (
					<span className="aa-active-worker-card__runtime">
						REASONING: {presentation.reasoning.value}
					</span>
				)}
				{presentation.resumeLabel && (
					<span className="aa-active-worker-card__runtime aa-active-worker-card__resume">
						RESUME: {presentation.resumeLabel}
					</span>
				)}
			</div>
		</section>
	);
}

function getCardDetail(
	presentation: ReturnType<typeof resolveAAActiveWorkerPresentation>,
): string {
	if (presentation.healthDiagnostic) return presentation.healthDiagnostic;
	switch (presentation.source) {
		case "runtime":
			return "Authoritative Tier 1 runtime snapshot";
		case "resume-candidate":
			return "Saved Pi conversation is offline and available for exact resume";
		case "binding":
			return `Tracked terminal-agent binding: ${presentation.lastEventType ?? "Attached"}`;
		case "launch":
		case "pane-title":
			return "Known launch identity; lifecycle tracking unavailable";
		case "local":
			return "Local terminal with no employee assignment";
		default:
			return "The active pane is not a terminal";
	}
}

function formatModelDetail(model: {
	displayName: string | null;
	id: string;
	provider: string | null;
}): string {
	return [model.displayName, model.id, model.provider]
		.filter((value, index, values) => value && values.indexOf(value) === index)
		.join(" · ");
}

function toneForPresentation(
	presentation: ReturnType<typeof resolveAAActiveWorkerPresentation>,
): AAStatusTone {
	if (
		presentation.healthCode === "offline_resumable" ||
		presentation.healthCode === "unknown" ||
		presentation.healthCode === "starting"
	) {
		return "attention";
	}
	switch (presentation.status) {
		case "working":
		case "thinking":
			return "working";
		case "waiting":
		case "untracked":
			return "attention";
		case "error":
			return "error";
		case "idle":
			return "success";
		case "offline":
		case "unassigned":
			return "offline";
	}
}
