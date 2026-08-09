import { AAAgentAvatar } from "../AAAgentAvatar";
import { useAAAgentStatus } from "../AAAgentStatus";
import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import {
	type AAActiveTerminalPresentationInput,
	type AAWorkerStatus,
	resolveAAActiveWorkerPresentation,
} from "./aaActiveWorkerPresentation";

interface AAActiveWorkerCardProps {
	terminal?: AAActiveTerminalPresentationInput | null;
}

export function AAActiveWorkerCard({ terminal }: AAActiveWorkerCardProps) {
	const { bindings } = useAAAgentStatus();
	const binding = terminal ? bindings.get(terminal.terminalId) : undefined;
	const presentation = resolveAAActiveWorkerPresentation({ binding, terminal });
	const isPi = presentation.personaId === "pi";
	const avatarState =
		presentation.tracking === "tracked" &&
		presentation.status !== "untracked" &&
		presentation.status !== "unassigned"
			? presentation.status
			: "offline";

	return (
		<section
			aria-label={`${presentation.heading}: ${presentation.status}`}
			className="aa-agent-status aa-active-worker-card"
			data-source={presentation.source}
			data-state={presentation.status}
			title={getCardDetail(presentation.source, presentation.lastEventType)}
		>
			<span className="aa-agent-status__portrait">
				{isPi ? (
					<AAAgentAvatar state={avatarState} />
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
					<AAStatusLight
						className="aa-agent-status__light"
						tone={toneForStatus(presentation.status)}
					/>
				</span>
				<span className="aa-agent-status__state">
					{presentation.status.toUpperCase()}
				</span>
			</div>
		</section>
	);
}

function getCardDetail(source: string, lastEventType?: string): string {
	switch (source) {
		case "binding":
			return `Tracked terminal-agent binding: ${lastEventType ?? "Attached"}`;
		case "launch":
		case "pane-title":
			return "Known launch identity; lifecycle tracking unavailable";
		case "local":
			return "Local terminal with no employee assignment";
		default:
			return "The active pane is not a terminal";
	}
}

function toneForStatus(status: AAWorkerStatus): AAStatusTone {
	switch (status) {
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
