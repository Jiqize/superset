import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWorkspaceGitStatus } from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/providers/WorkspaceGitStatusProvider";
import type { AAActiveWorkerPresentation } from "../AAActiveWorkerCard";
import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import {
	type AATaskFolderState,
	formatAATaskFolderState,
	mapLifecycleEventToAATaskFolderState,
	resolveAATaskFolderRename,
	resolveAATaskFolderTitle,
} from "./aaTaskFolderPresentation";

interface AATaskFolderProps {
	explicitTitle?: string;
	onTitleChange?: (titleOverride?: string) => void;
	sessionLabel?: string;
	terminalLabel?: string;
	worker: AAActiveWorkerPresentation;
}

export function AATaskFolder({
	explicitTitle,
	onTitleChange,
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
	const state = mapLifecycleEventToAATaskFolderState(
		worker.lastEventType,
		worker.tracking,
	);
	const stateLabel = formatAATaskFolderState(state);
	const workerLabel =
		worker.tracking === "unassigned" ? "—" : worker.displayName;
	const workerMetric = worker.tracking === "tracked" ? "ASSIGNED" : "WORKER";
	const stateMetric = worker.tracking === "untracked" ? "TRACKING" : "STATUS";
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
		<section
			aria-label={`Task folder: ${title}; ${workerMetric.toLowerCase()}: ${workerLabel}; ${stateMetric.toLowerCase()}: ${stateLabel}`}
			className="aa-task-folder"
			data-state={state}
			title={isEditing ? undefined : title}
		>
			<span className="aa-task-folder__mark">
				<AAIcon name="folder" />
			</span>
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
				{stateMetric}
				<AAStatusLight tone={toneForTaskState(state)} />
				<strong>{stateLabel}</strong>
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
		case "untracked":
			return "attention";
		case "turn-complete":
			return "success";
		case "error":
			return "error";
		case "idle":
			return "idle";
		case "session-ended":
		case "unassigned":
			return "offline";
	}
}
