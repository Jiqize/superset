import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import type {
	AAActiveTaskEvidenceClass,
	AAActiveTaskProjection,
	AAActiveTaskProjectionRow,
} from "./aaActiveTaskProjection";

interface AAActiveTasksSectionProps {
	isLoading?: boolean;
	onSelect: (workspaceId: string) => void;
	projection: AAActiveTaskProjection;
}

interface AAActiveTaskGroup {
	key: string;
	label: string;
	rows: AAActiveTaskProjectionRow[];
}

export function AAActiveTasksSection({
	isLoading = false,
	onSelect,
	projection,
}: AAActiveTasksSectionProps) {
	if (projection.rows.length === 0) {
		return isLoading ? (
			<output className="aa-active-tasks__loading">
				CHECKING TASK EVIDENCE…
			</output>
		) : null;
	}

	const selected = projection.rows.filter((row) => row.isSelected);
	const remaining = projection.rows.filter((row) => !row.isSelected);
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
								key={row.workspaceId}
								row={row}
								onSelect={onSelect}
							/>
						))}
					</div>
				</div>
			))}
		</section>
	);
}

function AAActiveTaskRow({
	row,
	onSelect,
}: {
	row: AAActiveTaskProjectionRow;
	onSelect: (workspaceId: string) => void;
}) {
	return (
		<button
			type="button"
			aria-label={getAAActiveTaskAriaLabel(row)}
			className="aa-active-task-row"
			data-active={row.isSelected || undefined}
			data-evidence={row.evidenceClass}
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
	return `${identity}, ${row.employee}, ${evidence}${changed}`;
}

function getEvidenceLabel(evidenceClass: AAActiveTaskEvidenceClass): string {
	switch (evidenceClass) {
		case "live":
			return "LIVE";
		case "resumable":
			return "RESUMABLE";
		case "untracked":
			return "UNTRACKED";
	}
}

function getAAActiveTaskTone(row: AAActiveTaskProjectionRow): AAStatusTone {
	if (row.evidenceClass === "resumable") return "offline";
	if (row.evidenceClass === "untracked") return "attention";
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
