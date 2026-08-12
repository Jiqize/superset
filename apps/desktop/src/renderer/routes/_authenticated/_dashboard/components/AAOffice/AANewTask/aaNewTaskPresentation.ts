import { sanitizeSegment } from "@superset/shared/workspace-launch";
import type { WorkspacesCreateInput } from "renderer/stores/workspace-creates";
import { normalizeAATaskFolderTitleInput } from "../AATaskFolder/aaTaskFolderPresentation";

export { selectAAPiHostConfig as selectAANewTaskPiConfig } from "../AAPiEmployee/aaPiEmployeePresentation";

const WORKSPACE_UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AANewTaskTitleResult =
	| { ok: true; title: string; prompt: string }
	| { ok: false; error: string };

export function validateAANewTaskTitle(input: string): AANewTaskTitleResult {
	const title = normalizeAATaskFolderTitleInput(input);
	if (!title) {
		return { ok: false, error: "Enter a task title." };
	}
	return { ok: true, title, prompt: title };
}

export function buildAANewTaskBranch(
	title: string,
	workspaceId: string,
): string {
	if (!WORKSPACE_UUID_PATTERN.test(workspaceId)) {
		throw new Error("New Task requires a valid Workspace UUID.");
	}

	const seed = sanitizeSegment(title, 8);
	const compactWorkspaceId = workspaceId.replaceAll("-", "").toLowerCase();
	const candidate = seed
		? `task-${seed}-${compactWorkspaceId}`
		: `task-${compactWorkspaceId}`;

	// The Host may add a 50-character branch prefix. Keeping this input at 46
	// characters preserves the shared 100-character branch-name budget.
	return candidate.slice(0, 46);
}

interface BuildAANewTaskCreateSnapshotInput {
	baseBranch?: string;
	piConfigId: string;
	projectId: string;
	title: string;
	workspaceId: string;
}

export function buildAANewTaskCreateSnapshot({
	baseBranch,
	piConfigId,
	projectId,
	title,
	workspaceId,
}: BuildAANewTaskCreateSnapshotInput): WorkspacesCreateInput {
	return {
		id: workspaceId,
		projectId,
		name: title,
		branch: buildAANewTaskBranch(title, workspaceId),
		...(baseBranch ? { baseBranch } : {}),
		agents: [{ agent: piConfigId, prompt: title }],
	};
}
