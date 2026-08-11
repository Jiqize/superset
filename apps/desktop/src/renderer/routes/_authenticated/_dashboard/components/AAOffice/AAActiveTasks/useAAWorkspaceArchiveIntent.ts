import { toast } from "@superset/ui/sonner";
import { useCallback, useMemo, useRef, useState } from "react";
import { getHostServiceClientByUrl } from "renderer/lib/host-service-client";
import { useHostWorkspaces } from "renderer/routes/_authenticated/providers/HostWorkspacesProvider";

export interface UseAAWorkspaceArchiveIntentResult {
	canSetWorkspaceArchived: (workspaceId: string) => boolean;
	getWorkspaceArchived: (workspaceId: string) => boolean | null;
	pendingWorkspaceIds: ReadonlySet<string>;
	setWorkspaceArchived: (
		workspaceId: string,
		archived: boolean,
	) => Promise<boolean>;
}

export function useAAWorkspaceArchiveIntent(): UseAAWorkspaceArchiveIntentResult {
	const { workspaces, cache } = useHostWorkspaces();
	const workspacesById = useMemo(
		() => new Map(workspaces.map((workspace) => [workspace.id, workspace])),
		[workspaces],
	);
	const workspacesByIdRef = useRef(workspacesById);
	workspacesByIdRef.current = workspacesById;
	const pendingRef = useRef(new Set<string>());
	const [pendingWorkspaceIds, setPendingWorkspaceIds] = useState<
		ReadonlySet<string>
	>(() => new Set());

	const mutateArchiveIntent = useCallback(
		async (
			workspaceId: string,
			archived: boolean,
			showUndo: boolean,
		): Promise<boolean> => {
			const workspace = workspacesByIdRef.current.get(workspaceId);
			if (!workspace || pendingRef.current.has(workspaceId)) return false;
			const hostUrl = cache.resolveHostUrl(workspace.hostId);
			if (!hostUrl) {
				toast.error(
					"Archive unavailable while this Work Folder host is offline.",
				);
				return false;
			}

			const previousValue = workspace.activeTasksArchived;
			pendingRef.current.add(workspaceId);
			setPendingWorkspaceIds(new Set(pendingRef.current));
			cache.patchWorkspace(workspace.hostId, workspaceId, {
				activeTasksArchived: archived,
				updatedAt: new Date(),
			});

			try {
				await getHostServiceClientByUrl(
					hostUrl,
				).workspace.setActiveTasksArchived.mutate({
					id: workspaceId,
					archived,
				});
				if (showUndo) {
					toast.success(archived ? "Task archived" : "Task unarchived", {
						action: {
							label: "Undo",
							onClick: () => {
								void mutateArchiveIntent(workspaceId, !archived, false);
							},
						},
					});
				}
				return true;
			} catch (error) {
				cache.patchWorkspace(workspace.hostId, workspaceId, {
					activeTasksArchived: previousValue,
				});
				cache.invalidateHost(workspace.hostId);
				toast.error(
					error instanceof Error
						? `Could not update archive intent: ${error.message}`
						: "Could not update archive intent.",
				);
				return false;
			} finally {
				pendingRef.current.delete(workspaceId);
				setPendingWorkspaceIds(new Set(pendingRef.current));
			}
		},
		[cache],
	);

	const setWorkspaceArchived = useCallback(
		(workspaceId: string, archived: boolean) =>
			mutateArchiveIntent(workspaceId, archived, true),
		[mutateArchiveIntent],
	);
	const getWorkspaceArchived = useCallback(
		(workspaceId: string) =>
			workspacesByIdRef.current.get(workspaceId)?.activeTasksArchived ?? null,
		[],
	);
	const canSetWorkspaceArchived = useCallback(
		(workspaceId: string) => {
			const workspace = workspacesByIdRef.current.get(workspaceId);
			return Boolean(
				workspace &&
					cache.resolveHostUrl(workspace.hostId) &&
					workspace.source === "host",
			);
		},
		[cache],
	);

	return {
		canSetWorkspaceArchived,
		getWorkspaceArchived,
		pendingWorkspaceIds,
		setWorkspaceArchived,
	};
}
