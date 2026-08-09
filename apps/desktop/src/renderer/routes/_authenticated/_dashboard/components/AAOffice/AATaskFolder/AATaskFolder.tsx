import { useMemo } from "react";
import { useWorkspaceGitStatus } from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/providers/WorkspaceGitStatusProvider";
import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import {
	type AATaskFolderState,
	mapLifecycleEventToAATaskFolderState,
	resolveAATaskFolderTitle,
} from "./aaTaskFolderPresentation";

interface AATaskFolderBinding {
	agentId: string;
	lastEventType: string;
}

interface AATaskFolderProps {
	binding?: AATaskFolderBinding;
	sessionLabel?: string;
	terminalLabel?: string;
}

export function AATaskFolder({
	binding,
	sessionLabel,
	terminalLabel,
}: AATaskFolderProps) {
	const gitStatus = useWorkspaceGitStatus();
	const changedFileCount = useMemo(() => {
		if (!gitStatus.data) return null;
		return new Set(
			[...gitStatus.data.staged, ...gitStatus.data.unstaged].map(
				(file) => file.path,
			),
		).size;
	}, [gitStatus.data]);
	const title = resolveAATaskFolderTitle({ sessionLabel, terminalLabel });
	const state = mapLifecycleEventToAATaskFolderState(
		binding?.lastEventType,
		Boolean(binding),
	);
	const assignee = binding?.agentId.toUpperCase() ?? "—";

	return (
		<section
			aria-label={`Task folder: ${title}; assigned: ${assignee}; status: ${state}`}
			className="aa-task-folder"
			data-state={state}
			title={title}
		>
			<span className="aa-task-folder__mark">
				<AAIcon name="folder" />
			</span>
			<span className="aa-task-folder__copy">
				<small>TASK FOLDER</small>
				<strong>{title}</strong>
			</span>
			<span className="aa-task-folder__metric">
				ASSIGNED <strong>{assignee}</strong>
			</span>
			<span className="aa-task-folder__metric">
				<AAStatusLight tone={toneForTaskState(state)} />
				<strong>{state.toUpperCase()}</strong>
			</span>
			{changedFileCount !== null && (
				<span className="aa-task-folder__metric aa-task-folder__files">
					<strong>{changedFileCount}</strong> CHANGED
				</span>
			)}
		</section>
	);
}

function toneForTaskState(state: AATaskFolderState): AAStatusTone {
	switch (state) {
		case "working":
			return "working";
		case "waiting":
			return "attention";
		case "done":
			return "success";
		case "error":
			return "error";
		case "idle":
			return "idle";
		case "unassigned":
			return "offline";
	}
}
