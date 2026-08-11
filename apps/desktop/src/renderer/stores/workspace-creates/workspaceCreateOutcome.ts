import type { WorkspaceCreateMutationMetadata } from "renderer/routes/_authenticated/providers/CollectionsProvider/collections";

export type WorkspacesCreateResult = NonNullable<
	WorkspaceCreateMutationMetadata["result"]
>;

export interface WorkspaceCreateSuccessOutcome {
	ok: true;
	workspaceId: string;
	result: WorkspacesCreateResult;
}

export function createWorkspaceSuccessOutcome(
	result: WorkspacesCreateResult,
): WorkspaceCreateSuccessOutcome {
	return {
		ok: true,
		workspaceId: result.workspace.id,
		result,
	};
}
