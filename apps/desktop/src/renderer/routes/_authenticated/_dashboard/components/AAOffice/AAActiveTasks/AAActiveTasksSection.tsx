import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAIcon } from "../AAIcon";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import type {
	AAActiveTaskEvidenceClass,
	AAActiveTaskProjection,
	AAActiveTaskProjectionRow,
} from "./aaActiveTaskProjection";

interface AAActiveTasksSectionProps {
	canArchiveChange?: (workspaceId: string) => boolean;
	isLoading?: boolean;
	onArchiveChange?: (workspaceId: string, archived: boolean) => void;
	onSelect: (workspaceId: string) => void;
	pendingWorkspaceIds?: ReadonlySet<string>;
	projection: AAActiveTaskProjection;
}

interface AAActiveTaskGroup {
	key: string;
	label: string;
	rows: AAActiveTaskProjectionRow[];
}

export function AAActiveTasksSection({
	canArchiveChange,
	isLoading = false,
	onArchiveChange,
	onSelect,
	pendingWorkspaceIds,
	projection,
}: AAActiveTasksSectionProps) {
	if (projection.rows.length === 0) {
		return isLoading ? (
			<output className="aa-active-tasks__loading">
				CHECKING TASK EVIDENCE…
			</output>
		) : null;
	}

	const archived = projection.rows.filter((row) => row.isArchived);
	const selectedArchived = archived.some((row) => row.isSelected);
	const current = projection.rows.filter((row) => !row.isArchived);
	const selected = current.filter((row) => row.isSelected);
	const remaining = current.filter((row) => !row.isSelected);
	const groups: AAActiveTaskGroup[] = [
		{ key: "current", label: "ACTIVE TASKS · CURRENT", rows: selected },
		{
			key: "live",
			label: "ACTIVE TASKS",
			rows: remaining.filter((row) => row.evidenceClass === "live"),
		},
		{
			key: "resumable",
			label: "SAVED / RESUMABLE",
			rows: remaining.filter((row) => row.evidenceClass === "resumable"),
		},
		{
			key: "untracked",
			label: "UNTRACKED",
			rows: remaining.filter((row) => row.evidenceClass === "untracked"),
		},
	].filter((group) => group.rows.length > 0);

	return (
		<section className="aa-active-tasks" aria-label="Briefcase tasks">
			{groups.map((group) => (
				<div className="aa-active-tasks__group" key={group.key}>
					<h3 className="aa-active-tasks__heading">
						<span>{group.label}</span>
						<small>{group.rows.length}</small>
					</h3>
					<div className="aa-active-tasks__rows">
						{group.rows.map((row) => (
							<AAActiveTaskRow
								canArchiveChange={canArchiveChange}
								key={row.workspaceId}
								onArchiveChange={onArchiveChange}
								pending={pendingWorkspaceIds?.has(row.workspaceId)}
								row={row}
								onSelect={onSelect}
							/>
						))}
					</div>
				</div>
			))}
			{archived.length > 0 ? (
				<details
					className="aa-active-tasks__archive"
					data-current={selectedArchived || undefined}
					open={selectedArchived ? true : undefined}
				>
					<summary className="aa-active-tasks__heading">
						<span>{selectedArchived ? "ARCHIVED · CURRENT" : "ARCHIVED"}</span>
						<small>{archived.length}</small>
					</summary>
					<div className="aa-active-tasks__rows">
						{archived.map((row) => (
							<AAActiveTaskRow
								canArchiveChange={canArchiveChange}
								key={row.workspaceId}
								onArchiveChange={onArchiveChange}
								onSelect={onSelect}
								pending={pendingWorkspaceIds?.has(row.workspaceId)}
								row={row}
							/>
						))}
					</div>
				</details>
			) : null}
		</section>
	);
}

function AAActiveTaskRow({
	row,
	canArchiveChange,
	onArchiveChange,
	onSelect,
	pending = false,
}: {
	row: AAActiveTaskProjectionRow;
	canArchiveChange?: (workspaceId: string) => boolean;
	onArchiveChange?: (workspaceId: string, archived: boolean) => void;
	onSelect: (workspaceId: string) => void;
	pending?: boolean;
}) {
	const archiveAvailable = canArchiveChange?.(row.workspaceId) ?? true;
	return (
		<div
			className="aa-active-task-row"
			data-active={row.isSelected || undefined}
			data-archived={row.isArchived || undefined}
			data-evidence={row.evidenceClass}
		>
			<button
				type="button"
				aria-current={row.isSelected ? "true" : undefined}
				aria-label={getAAActiveTaskAriaLabel(row)}
				className="aa-active-task-row__select"
				onClick={() => onSelect(row.workspaceId)}
			>
				<AAEmployeeAvatar
					agentId={row.personaId === "generic" ? undefined : row.personaId}
					className="aa-active-task-row__avatar"
					label={row.employee}
				/>
				<span className="aa-active-task-row__body">
					<span className="aa-active-task-row__title">
						<span>{row.title}</span>
						{row.discriminator && <small>{row.discriminator}</small>}
					</span>
					<span className="aa-active-task-row__evidence" aria-hidden="true">
						<AAStatusLight tone={getAAActiveTaskTone(row)} />
						<span>{row.employee}</span>
						<span>·</span>
						<span>{getEvidenceLabel(row.evidenceClass)}</span>
						{row.lifecycle && (
							<>
								<span>·</span>
								<span>{row.lifecycle}</span>
							</>
						)}
					</span>
				</span>
				{row.changedFileCount !== null && (
					<span className="aa-active-task-row__changed">
						<strong>{row.changedFileCount}</strong>
						<small>CHANGED</small>
					</span>
				)}
			</button>
			{onArchiveChange ? (
				<button
					aria-label={`${row.isArchived ? "Unarchive" : "Archive"} Task Folder: ${row.title}`}
					aria-busy={pending || undefined}
					className="aa-active-task-row__archive-action"
					disabled={!archiveAvailable || pending}
					title={
						archiveAvailable
							? row.isArchived
								? "Unarchive Task Folder"
								: "Archive Task Folder"
							: "Archive unavailable while the Work Folder host is offline"
					}
					type="button"
					onClick={() => onArchiveChange(row.workspaceId, !row.isArchived)}
				>
					<AAIcon name={row.isArchived ? "folder" : "archive"} />
					<span>
						{pending ? "SAVING" : row.isArchived ? "UNARCHIVE" : "ARCHIVE"}
					</span>
				</button>
			) : null}
		</div>
	);
}

export function getAAActiveTaskAriaLabel(
	row: AAActiveTaskProjectionRow,
): string {
	const identity = [row.title, row.discriminator].filter(Boolean).join(" ");
	const evidence = [getEvidenceLabel(row.evidenceClass), row.lifecycle]
		.filter(Boolean)
		.join(" ");
	const changed =
		row.changedFileCount === null
			? ""
			: `, ${row.changedFileCount} changed ${row.changedFileCount === 1 ? "file" : "files"}`;
	const archived = row.isArchived ? "ARCHIVED, " : "";
	return `${identity}, ${archived}${row.employee}, ${evidence}${changed}`;
}

function getEvidenceLabel(evidenceClass: AAActiveTaskEvidenceClass): string {
	switch (evidenceClass) {
		case "live":
			return "LIVE";
		case "resumable":
			return "RESUMABLE";
		case "untracked":
			return "UNTRACKED";
		case "unavailable":
			return "SESSION UNAVAILABLE";
	}
}

function getAAActiveTaskTone(row: AAActiveTaskProjectionRow): AAStatusTone {
	if (row.evidenceClass === "resumable") return "offline";
	if (row.evidenceClass === "untracked") return "attention";
	if (row.evidenceClass === "unavailable") return "offline";
	switch (row.lifecycle) {
		case "ERROR":
			return "error";
		case "WORKING":
		case "STARTING":
		case "CANCELLING":
			return "working";
		case "WAITING":
			return "attention";
		default:
			return "idle";
	}
}
