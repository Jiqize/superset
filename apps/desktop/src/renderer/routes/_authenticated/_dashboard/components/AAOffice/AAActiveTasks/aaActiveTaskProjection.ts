import type { WorkspaceState } from "@superset/panes";
import type {
	AARuntimeSessionSnapshot,
	AARuntimeState,
} from "@superset/session-protocol";
import type {
	PaneViewerData,
	TerminalPaneData,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";
import {
	type AAEmployeePersonaId,
	resolveAAEmployeePersona,
} from "../AAEmployeeAvatar/aaEmployeePersonas";

export type AAActiveTaskEvidenceClass = "live" | "resumable" | "untracked";

export interface AAActiveTaskTerminalEvidence {
	launchIdentity?: TerminalPaneData["launchIdentity"];
	taskTitleEdited: true;
	terminalId: string;
	title: string;
}

export interface AAActiveTaskResumeEvidence {
	agentId: string;
	resumeSupported: boolean;
	terminalId: string;
}

export interface AAActiveTaskProjectionInput {
	changedFileCount: number | null;
	isSelected: boolean;
	resumeCandidate?: AAActiveTaskResumeEvidence | null;
	runtimeSnapshot?: AARuntimeSessionSnapshot | null;
	stableOrder: number;
	terminal: AAActiveTaskTerminalEvidence;
	workspaceId: string;
}

export interface AAActiveTaskProjectionRow {
	changedFileCount: number | null;
	discriminator?: string;
	employee: string;
	evidenceClass: AAActiveTaskEvidenceClass;
	isSelected: boolean;
	lifecycle?: string;
	personaId: AAEmployeePersonaId;
	stableOrder: number;
	title: string;
	workspaceId: string;
}

export interface AAActiveTaskProjection {
	rows: AAActiveTaskProjectionRow[];
}

interface AAChangedFilesStatus {
	staged: readonly { path: string }[];
	unstaged: readonly { path: string }[];
}

const LIVE_RUNTIME_STATES = new Set<AARuntimeState>([
	"starting",
	"idle",
	"working",
	"waiting_permission",
	"waiting_user",
	"cancelling",
	"error",
]);

const PERSONA_LABELS: Record<AAEmployeePersonaId, string> = {
	claude: "CLAUDE",
	codex: "CODEX",
	copilot: "COPILOT",
	generic: "EMPLOYEE",
	grok: "GROK",
	kimi: "KIMI",
	mistral: "MISTRAL VIBE",
	opencode: "OPENCODE",
	pi: "PI",
	superset: "SUPERSET CLI",
};

const EVIDENCE_ORDER: Record<AAActiveTaskEvidenceClass, number> = {
	live: 0,
	resumable: 1,
	untracked: 2,
};

export function projectAAActiveTasks(
	inputs: readonly AAActiveTaskProjectionInput[],
): AAActiveTaskProjection {
	const rows = inputs.flatMap((input) => {
		const row = projectAAActiveTask(input);
		return row ? [row] : [];
	});

	assignDuplicateDiscriminators(rows);
	rows.sort(
		(left, right) =>
			Number(right.isSelected) - Number(left.isSelected) ||
			EVIDENCE_ORDER[left.evidenceClass] -
				EVIDENCE_ORDER[right.evidenceClass] ||
			left.stableOrder - right.stableOrder ||
			left.workspaceId.localeCompare(right.workspaceId),
	);

	return { rows };
}

export function extractAAActiveTaskTerminalEvidence(
	paneLayout: WorkspaceState<PaneViewerData> | null | undefined,
): AAActiveTaskTerminalEvidence | null {
	if (!paneLayout) return null;

	const activeTab = paneLayout.tabs.find(
		(tab) => tab.id === paneLayout.activeTabId,
	);
	const orderedTabs = activeTab
		? [activeTab, ...paneLayout.tabs.filter((tab) => tab.id !== activeTab.id)]
		: paneLayout.tabs;

	for (const tab of orderedTabs) {
		const activePane = tab.activePaneId
			? tab.panes[tab.activePaneId]
			: undefined;
		const panes = Object.values(tab.panes);
		const orderedPanes = activePane
			? [activePane, ...panes.filter((pane) => pane.id !== activePane.id)]
			: panes;

		for (const pane of orderedPanes) {
			if (pane.kind !== "terminal") continue;
			const data = pane.data as TerminalPaneData;
			if (data.taskTitleEdited !== true || !data.terminalId) continue;
			const title = normalizeVisibleTaskTitle(
				pane.titleOverride ?? tab.titleOverride,
			);
			if (!title) continue;
			return {
				launchIdentity: data.launchIdentity,
				taskTitleEdited: true,
				terminalId: data.terminalId,
				title,
			};
		}
	}

	return null;
}

export function normalizeAAActiveTaskTitle(title: string): string {
	return title.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
}

export function countAAActiveTaskChangedFiles(
	status: AAChangedFilesStatus | null | undefined,
): number | null {
	if (!status) return null;
	return new Set(
		[...status.staged, ...status.unstaged].map((file) => file.path),
	).size;
}

function projectAAActiveTask(
	input: AAActiveTaskProjectionInput,
): AAActiveTaskProjectionRow | null {
	const title = normalizeVisibleTaskTitle(input.terminal.title);
	if (!title || !input.workspaceId || !input.terminal.terminalId) return null;

	const runtimeSnapshot = isExactLiveRuntimeSnapshot(input)
		? input.runtimeSnapshot
		: null;
	if (runtimeSnapshot) {
		const identity = resolveEmployee(
			runtimeSnapshot.agentId,
			runtimeSnapshot.agentId,
		);
		return {
			changedFileCount: normalizeChangedFileCount(input.changedFileCount),
			employee: identity.label,
			evidenceClass: "live",
			isSelected: input.isSelected,
			lifecycle: formatLiveLifecycle(runtimeSnapshot.state),
			personaId: identity.personaId,
			stableOrder: input.stableOrder,
			title,
			workspaceId: input.workspaceId,
		};
	}

	if (isExactPiResumeCandidate(input)) {
		return {
			changedFileCount: normalizeChangedFileCount(input.changedFileCount),
			employee: "PI",
			evidenceClass: "resumable",
			isSelected: input.isSelected,
			personaId: "pi",
			stableOrder: input.stableOrder,
			title,
			workspaceId: input.workspaceId,
		};
	}

	const launchIdentity = input.terminal.launchIdentity;
	if (!launchIdentity) return null;
	const identity = resolveEmployee(
		launchIdentity.agentId,
		launchIdentity.label,
	);
	// A Pi launch without Runtime Contract or an exact resume candidate lacks
	// enough evidence to promote. Other explicit launch identities remain a
	// truthful compatibility/deferred-runtime row marked UNTRACKED.
	if (identity.personaId === "pi") return null;

	return {
		changedFileCount: normalizeChangedFileCount(input.changedFileCount),
		employee: identity.label,
		evidenceClass: "untracked",
		isSelected: input.isSelected,
		personaId: identity.personaId,
		stableOrder: input.stableOrder,
		title,
		workspaceId: input.workspaceId,
	};
}

function isExactLiveRuntimeSnapshot(
	input: AAActiveTaskProjectionInput,
): input is AAActiveTaskProjectionInput & {
	runtimeSnapshot: AARuntimeSessionSnapshot;
} {
	const snapshot = input.runtimeSnapshot;
	return Boolean(
		snapshot &&
			snapshot.workspaceId === input.workspaceId &&
			snapshot.transport.kind === "terminal" &&
			snapshot.transport.terminalId === input.terminal.terminalId &&
			LIVE_RUNTIME_STATES.has(snapshot.state),
	);
}

function isExactPiResumeCandidate(input: AAActiveTaskProjectionInput): boolean {
	const candidate = input.resumeCandidate;
	return Boolean(
		candidate &&
			candidate.agentId === "pi" &&
			candidate.resumeSupported &&
			candidate.terminalId === input.terminal.terminalId,
	);
}

function formatLiveLifecycle(state: AARuntimeState): string {
	switch (state) {
		case "waiting_permission":
		case "waiting_user":
			return "WAITING";
		default:
			return state.toUpperCase();
	}
}

function resolveEmployee(
	agentId: string | undefined,
	label: string,
): { label: string; personaId: AAEmployeePersonaId } {
	const persona = resolveAAEmployeePersona({ agentId, name: label });
	if (persona.id !== "generic") {
		return { label: PERSONA_LABELS[persona.id], personaId: persona.id };
	}

	const normalizedLabel = label
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toUpperCase();
	return {
		label: normalizedLabel ? normalizedLabel.slice(0, 20) : "EMPLOYEE",
		personaId: "generic",
	};
}

function normalizeVisibleTaskTitle(title: string | null | undefined): string {
	return title?.normalize("NFKC").replace(/\s+/g, " ").trim() ?? "";
}

function normalizeChangedFileCount(value: number | null): number | null {
	return value === null || !Number.isFinite(value)
		? null
		: Math.max(0, Math.trunc(value));
}

function assignDuplicateDiscriminators(
	rows: AAActiveTaskProjectionRow[],
): void {
	const groups = new Map<string, AAActiveTaskProjectionRow[]>();
	for (const row of rows) {
		const key = normalizeAAActiveTaskTitle(row.title);
		const group = groups.get(key);
		if (group) group.push(row);
		else groups.set(key, [row]);
	}

	for (const group of groups.values()) {
		if (group.length < 2) continue;
		const hashes = group.map((row) => hashWorkspaceIdentity(row.workspaceId));
		let length = 4;
		while (
			length < 8 &&
			new Set(hashes.map((hash) => hash.slice(0, length))).size < group.length
		) {
			length += 1;
		}
		const fullHashCounts = new Map<string, number>();
		for (const hash of hashes) {
			fullHashCounts.set(hash, (fullHashCounts.get(hash) ?? 0) + 1);
		}
		const collidingRanks = new Map(
			[...group]
				.sort((left, right) =>
					left.workspaceId.localeCompare(right.workspaceId),
				)
				.map((row, index) => [row.workspaceId, index + 1]),
		);

		group.forEach((row, index) => {
			const hash = hashes[index];
			const collisionSuffix =
				(fullHashCounts.get(hash) ?? 0) > 1
					? `-${collidingRanks.get(row.workspaceId) ?? index + 1}`
					: "";
			row.discriminator = `#${hash.slice(0, length)}${collisionSuffix}`;
		});
	}
}

function hashWorkspaceIdentity(value: string): string {
	let hash = 0x811c9dc5;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}
