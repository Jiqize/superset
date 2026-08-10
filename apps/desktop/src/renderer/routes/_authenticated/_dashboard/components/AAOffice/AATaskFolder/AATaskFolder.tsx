import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Button } from "@superset/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@superset/ui/popover";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWorkspaceGitStatus } from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/providers/WorkspaceGitStatusProvider";
import type { AAActiveWorkerPresentation } from "../AAActiveWorkerCard";
import { AAEmployeeProfile } from "../AAEmployeeProfile";
import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import { AATaskFolderContextCard } from "./AATaskFolderContextCard";
import {
	type AATaskFolderState,
	getAATaskFolderContextPresentation,
	getAATaskFolderMetricPresentation,
	mapAAWorkerToAATaskFolderState,
	resolveAATaskFolderRename,
	resolveAATaskFolderTitle,
} from "./aaTaskFolderPresentation";

interface AATaskFolderProps {
	explicitTitle?: string;
	onTitleChange?: (titleOverride?: string) => void;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	sessionLabel?: string;
	terminalLabel?: string;
	worker: AAActiveWorkerPresentation;
}

export function AATaskFolder({
	explicitTitle,
	onTitleChange,
	runtimeSnapshot,
	sessionLabel,
	terminalLabel,
	worker,
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
	const title = resolveAATaskFolderTitle({
		explicitTitle,
		sessionLabel,
		terminalLabel,
	});
	const state = mapAAWorkerToAATaskFolderState(worker);
	const stateMetric = getAATaskFolderMetricPresentation(state);
	const contextPresentation = getAATaskFolderContextPresentation({
		changedFileCount,
		worker,
	});
	const workerLabel =
		worker.tracking === "unassigned" ? "—" : worker.displayName;
	const workerMetric = worker.tracking === "tracked" ? "ASSIGNED" : "WORKER";
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(title);
	const finishingRef = useRef(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isEditing) {
			setDraft(title);
			return;
		}
		titleInputRef.current?.focus();
		titleInputRef.current?.select();
	}, [isEditing, title]);

	const beginEditing = useCallback(() => {
		if (!onTitleChange) return;
		finishingRef.current = false;
		setDraft(title);
		setIsEditing(true);
	}, [onTitleChange, title]);

	const finishEditing = useCallback(
		(action: "cancel" | "save") => {
			if (finishingRef.current) return;
			finishingRef.current = true;
			const result = resolveAATaskFolderRename({
				action,
				currentTitleOverride: explicitTitle,
				draft,
			});
			setIsEditing(false);
			if (result.committed) onTitleChange?.(result.titleOverride);
		},
		[draft, explicitTitle, onTitleChange],
	);

	return (
		<Popover modal={false}>
			<section
				aria-label={`Task folder: ${title}; ${workerMetric.toLowerCase()}: ${workerLabel}; ${stateMetric.accessibleSummary}`}
				className="aa-task-folder"
				data-state={state}
				title={isEditing ? undefined : title}
			>
				<PopoverTrigger asChild>
					<button
						aria-label={`Open Task Folder details: ${title}`}
						className="aa-task-folder__mark"
						title="Open Task Folder details"
						type="button"
					>
						<AAIcon name="folder" />
					</button>
				</PopoverTrigger>
				<span className="aa-task-folder__copy">
					<small>TASK FOLDER</small>
					{isEditing ? (
						<input
							aria-label="Task folder title"
							className="aa-task-folder__title-input"
							ref={titleInputRef}
							value={draft}
							onBlur={() => finishEditing("save")}
							onChange={(event) => setDraft(event.currentTarget.value)}
							onFocus={(event) => event.currentTarget.select()}
							onKeyDown={(event) => {
								event.stopPropagation();
								if (event.key === "Enter") {
									event.preventDefault();
									finishEditing("save");
								} else if (event.key === "Escape") {
									event.preventDefault();
									finishEditing("cancel");
								}
							}}
							onKeyUp={(event) => event.stopPropagation()}
						/>
					) : (
						<button
							aria-label={`Rename task folder: ${title}`}
							className="aa-task-folder__title-button"
							type="button"
							onDoubleClick={(event) => {
								event.stopPropagation();
								beginEditing();
							}}
							onKeyDown={(event) => {
								if (event.key !== "Enter" && event.key !== "F2") return;
								event.preventDefault();
								event.stopPropagation();
								beginEditing();
							}}
							title="Double-click or press Enter to rename"
						>
							{title}
						</button>
					)}
				</span>
				<span className="aa-task-folder__metric">
					{workerMetric} <strong>{workerLabel}</strong>
				</span>
				<span className="aa-task-folder__metric">
					{stateMetric.label}
					<AAStatusLight tone={toneForTaskState(state)} />
					<strong>{stateMetric.value}</strong>
				</span>
				{changedFileCount !== null && (
					<span className="aa-task-folder__metric aa-task-folder__files">
						<strong>{changedFileCount}</strong> CHANGED
					</span>
				)}
			</section>
			<PopoverContent
				align="center"
				aria-label={`Task Folder: ${title}`}
				className="aa-task-folder-popover"
				side="bottom"
				sideOffset={7}
			>
				<AATaskFolderContextCard
					presentation={contextPresentation}
					state={state}
					title={title}
				/>
				{worker.tracking !== "unassigned" ? (
					<div className="aa-task-folder-card__actions">
						<span>MANUAL WORKFLOW</span>
						<AAEmployeeProfile
							agentId={worker.agentId}
							name={worker.displayName}
							resumeAvailable={worker.resumeLabel === "AVAILABLE"}
							runtimeSnapshot={runtimeSnapshot}
							side="right"
						>
							<Button
								aria-label={`View ${worker.displayName} employee profile`}
								className="aa-task-folder-card__employee-action"
								size="sm"
								variant="ghost"
							>
								<AAIcon name="agents" />
								EMPLOYEE PROFILE
							</Button>
						</AAEmployeeProfile>
					</div>
				) : null}
			</PopoverContent>
		</Popover>
	);
}

function toneForTaskState(state: AATaskFolderState): AAStatusTone {
	switch (state) {
		case "working":
			return "working";
		case "waiting":
		case "untracked":
			return "attention";
		case "turn-complete":
			return "success";
		case "error":
			return "error";
		case "idle":
			return "idle";
		case "starting":
		case "cancelling":
		case "unknown":
			return "attention";
		case "offline":
		case "session-ended":
		case "unassigned":
			return "offline";
	}
}
