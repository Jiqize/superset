import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import type {
	AATaskFolderContextPresentation,
	AATaskFolderState,
} from "./aaTaskFolderPresentation";

interface AATaskFolderContextCardProps {
	presentation: AATaskFolderContextPresentation;
	state: AATaskFolderState;
	title: string;
}

export function AATaskFolderContextCard({
	presentation,
	state,
	title,
}: AATaskFolderContextCardProps) {
	return (
		<section
			aria-label={`Task Folder details: ${title}`}
			className="aa-task-folder-card"
			data-state={state}
		>
			<header className="aa-task-folder-card__header">
				<span className="aa-task-folder-card__mark">
					<AAIcon name="folder" />
				</span>
				<span className="aa-task-folder-card__identity">
					<small>TASK FOLDER</small>
					<strong>{title}</strong>
					<span>{presentation.authority}</span>
				</span>
				<span className="aa-task-folder-card__health">
					<AAStatusLight tone={toneForTaskState(state)} />
					{presentation.status}
				</span>
			</header>

			<dl className="aa-task-folder-card__facts">
				<TaskFact label="EMPLOYEE" value={presentation.employee} />
				<TaskFact label="STATUS" value={presentation.status} />
				{presentation.changedFiles ? (
					<TaskFact label="OUTPUT" value={presentation.changedFiles} />
				) : null}
				{presentation.resume ? (
					<TaskFact label="RESUME" value={presentation.resume} />
				) : null}
			</dl>

			<details className="aa-task-folder-card__runtime-details">
				<summary>RUNTIME DETAILS</summary>
				<dl className="aa-task-folder-card__facts aa-task-folder-card__facts--secondary">
					<TaskFact label="RUNTIME" value={presentation.runtime} />
					<TaskFact label="TRANSPORT" value={presentation.transport} />
					{presentation.model ? (
						<TaskFact label="MODEL" value={presentation.model} />
					) : null}
					{presentation.reasoning ? (
						<TaskFact label="REASONING" value={presentation.reasoning} />
					) : null}
					{presentation.latestAction ? (
						<TaskFact label="LATEST ACTION" value={presentation.latestAction} />
					) : null}
				</dl>
			</details>
		</section>
	);
}

function TaskFact({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt>{label}</dt>
			<dd>{value}</dd>
		</div>
	);
}

function toneForTaskState(state: AATaskFolderState): AAStatusTone {
	switch (state) {
		case "working":
			return "working";
		case "waiting":
		case "untracked":
		case "starting":
		case "cancelling":
		case "unknown":
			return "attention";
		case "turn-complete":
			return "success";
		case "error":
			return "error";
		case "idle":
			return "idle";
		case "offline":
		case "session-ended":
		case "unassigned":
			return "offline";
	}
}
