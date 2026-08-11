import type { ReactNode } from "react";
import { useTerminalResumeCandidate } from "renderer/hooks/host-service/useTerminalResumeCandidate";
import { useHotkeyDisplay } from "renderer/hotkeys";
import {
	type AAWorkerLaunchIdentity,
	resolveAAActiveWorkerPresentation,
} from "../AAActiveWorkerCard";
import { useAAAgentStatus } from "../AAAgentStatus";
import { AAIcon } from "../AAIcon";
import { AAStatusLight } from "../AAStatusLight";
import { AATaskFolder, mapAAWorkerToAATaskFolderState } from "../AATaskFolder";

interface AATerminalFrameProps {
	children: ReactNode;
	isActive?: boolean;
	launchIdentity?: AAWorkerLaunchIdentity;
	onTaskTitleChange?: (titleOverride?: string) => void;
	sessionLabel?: string;
	taskTitle?: string;
	taskTitleEdited?: boolean;
	terminalId: string;
}

export function AATerminalFrame({
	children,
	isActive = false,
	launchIdentity,
	onTaskTitleChange,
	sessionLabel,
	taskTitle,
	taskTitleEdited,
	terminalId,
}: AATerminalFrameProps) {
	const focusShortcut = useHotkeyDisplay("AA_FOCUS_WORKSTATION");
	const { bindings, runtimeSnapshots, workspaceId } = useAAAgentStatus();
	const { candidate: resumeCandidate } = useTerminalResumeCandidate(
		workspaceId,
		terminalId,
	);
	const binding = bindings.get(terminalId);
	const runtimeSnapshot = runtimeSnapshots.get(terminalId);
	const worker = resolveAAActiveWorkerPresentation({
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
		terminal: {
			launchIdentity,
			paneTitle: taskTitle ?? sessionLabel,
			taskTitleEdited,
			terminalId,
		},
	});
	const workstationLabel =
		worker.tracking === "unassigned"
			? "LOCAL TERMINAL"
			: `${worker.displayName} WORKSTATION`;
	const taskFolderState = mapAAWorkerToAATaskFolderState(worker);
	const currentSignalAddsContext =
		taskFolderState === "error" ||
		taskFolderState === "session-ended" ||
		taskFolderState === "turn-complete";

	return (
		<div
			className="aa-terminal-frame"
			data-agent-state={worker.status}
			data-pane-active={isActive}
		>
			<div className="aa-terminal-frame__console">
				<span
					className="aa-terminal-frame__label"
					title={`Focus active workstation · ${focusShortcut.text}`}
				>
					<AAIcon name="terminal" />
					{workstationLabel}
				</span>
				<AATaskFolder
					explicitTitle={taskTitle}
					onTitleChange={onTaskTitleChange}
					runtimeSnapshot={runtimeSnapshot}
					sessionLabel={sessionLabel ?? launchIdentity?.label}
					terminalLabel={workstationLabel}
					worker={worker}
					isActive={isActive}
				/>
				<span
					className="aa-terminal-frame__signal"
					data-semantic={currentSignalAddsContext ? "distinct" : "duplicate"}
				>
					<AAStatusLight tone={toneForWorker(worker)} />
					{worker.statusLabel}
				</span>
			</div>
			<div className="aa-terminal-frame__viewport">{children}</div>
		</div>
	);
}

function toneForWorker(
	worker: ReturnType<typeof resolveAAActiveWorkerPresentation>,
): "attention" | "error" | "idle" | "offline" | "success" | "working" {
	if (
		worker.healthCode === "offline_resumable" ||
		worker.healthCode === "unknown" ||
		worker.healthCode === "starting"
	) {
		return "attention";
	}
	switch (worker.status) {
		case "thinking":
		case "working":
			return "working";
		case "waiting":
		case "untracked":
			return "attention";
		case "error":
			return "error";
		case "offline":
		case "unassigned":
			return "offline";
		case "idle":
			return "success";
	}
}
