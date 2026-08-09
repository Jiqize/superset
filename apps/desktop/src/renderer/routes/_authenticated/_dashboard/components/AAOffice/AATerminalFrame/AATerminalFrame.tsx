import type { ReactNode } from "react";
import {
	type AAWorkerLaunchIdentity,
	resolveAAActiveWorkerPresentation,
} from "../AAActiveWorkerCard";
import { useAAAgentStatus } from "../AAAgentStatus";
import { AAIcon } from "../AAIcon";
import { AAStatusLight } from "../AAStatusLight";
import {
	AATaskFolder,
	mapAARuntimeSnapshotToAATaskFolderState,
	mapLifecycleEventToAATaskFolderState,
} from "../AATaskFolder";

interface AATerminalFrameProps {
	children: ReactNode;
	launchIdentity?: AAWorkerLaunchIdentity;
	onTaskTitleChange?: (titleOverride?: string) => void;
	sessionLabel?: string;
	taskTitle?: string;
	taskTitleEdited?: boolean;
	terminalId: string;
}

export function AATerminalFrame({
	children,
	launchIdentity,
	onTaskTitleChange,
	sessionLabel,
	taskTitle,
	taskTitleEdited,
	terminalId,
}: AATerminalFrameProps) {
	const { bindings, runtimeSnapshots } = useAAAgentStatus();
	const binding = bindings.get(terminalId);
	const runtimeSnapshot = runtimeSnapshots.get(terminalId);
	const worker = resolveAAActiveWorkerPresentation({
		binding,
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
	const taskFolderState = worker.runtimeState
		? mapAARuntimeSnapshotToAATaskFolderState(
				worker.runtimeState,
				worker.stateReason,
			)
		: mapLifecycleEventToAATaskFolderState(
				worker.lastEventType,
				worker.tracking,
			);
	const currentSignalAddsContext =
		taskFolderState === "error" ||
		taskFolderState === "session-ended" ||
		taskFolderState === "turn-complete";

	return (
		<div className="aa-terminal-frame" data-agent-state={worker.status}>
			<div className="aa-terminal-frame__console">
				<span className="aa-terminal-frame__label">
					<AAIcon name="terminal" />
					{workstationLabel}
				</span>
				<AATaskFolder
					explicitTitle={taskTitle}
					onTitleChange={onTaskTitleChange}
					sessionLabel={sessionLabel ?? launchIdentity?.label}
					terminalLabel={workstationLabel}
					worker={worker}
				/>
				<span
					className="aa-terminal-frame__signal"
					data-semantic={currentSignalAddsContext ? "distinct" : "duplicate"}
				>
					<AAStatusLight tone={toneForWorkerStatus(worker.status)} />
					{worker.statusLabel}
				</span>
			</div>
			<div className="aa-terminal-frame__viewport">{children}</div>
		</div>
	);
}

function toneForWorkerStatus(
	status: ReturnType<typeof resolveAAActiveWorkerPresentation>["status"],
): "attention" | "error" | "idle" | "offline" | "success" | "working" {
	switch (status) {
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
