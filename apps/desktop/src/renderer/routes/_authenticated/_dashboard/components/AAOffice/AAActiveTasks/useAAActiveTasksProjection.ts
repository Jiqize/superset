import type { WorkspaceState } from "@superset/panes";
import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { getEventBus } from "@superset/workspace-client";
import { useLiveQuery } from "@tanstack/react-db";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
	getTerminalResumeCandidateQueryKey,
	type TerminalResumeCandidate,
} from "renderer/hooks/host-service/useTerminalResumeCandidate";
import { getHostServiceWsToken } from "renderer/lib/host-service-auth";
import { getHostServiceClientByUrl } from "renderer/lib/host-service-client";
import type { PaneViewerData } from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";
import { useCollections } from "renderer/routes/_authenticated/providers/CollectionsProvider";
import { useHostWorkspaces } from "renderer/routes/_authenticated/providers/HostWorkspacesProvider";
import { getAARuntimeSnapshotsQueryKey } from "../AAAgentStatus/useAARuntimeSnapshots";
import {
	type AAActiveTaskProjection,
	countAAActiveTaskChangedFiles,
	extractAAActiveTaskTerminalEvidence,
	projectAAActiveTasks,
} from "./aaActiveTaskProjection";

interface AAActiveTaskGitStatus {
	staged: readonly { path: string }[];
	unstaged: readonly { path: string }[];
}

interface AAActiveTaskTarget {
	hostUrl: string | null;
	isSelected: boolean;
	stableOrder: number;
	terminal: NonNullable<ReturnType<typeof extractAAActiveTaskTerminalEvidence>>;
	workspaceId: string;
}

export interface UseAAActiveTasksProjectionResult {
	eligibleTaskCount: number;
	isLoading: boolean;
	projection: AAActiveTaskProjection;
}

function getAAActiveTaskGitStatusQueryKey(
	hostUrl: string | null,
	workspaceId: string,
) {
	return ["aa-active-task-git-status", hostUrl, workspaceId] as const;
}

export function useAAActiveTasksProjection(
	projectId: string | null,
): UseAAActiveTasksProjectionResult {
	const collections = useCollections();
	const { workspaceId: selectedWorkspaceId } = useParams({ strict: false });
	const queryClient = useQueryClient();
	const { workspaces, cache } = useHostWorkspaces();
	const { data: localStateRows = [] } = useLiveQuery(
		(query) =>
			query.from({
				workspaceLocalState: collections.v2WorkspaceLocalState,
			}),
		[collections],
	);

	const targets = useMemo<AAActiveTaskTarget[]>(() => {
		if (!projectId) return [];
		const workspacesById = new Map(
			workspaces.map((workspace) => [workspace.id, workspace]),
		);
		return localStateRows
			.filter(
				(row) =>
					row.sidebarState.projectId === projectId &&
					!row.sidebarState.isHidden,
			)
			.sort(
				(left, right) =>
					left.sidebarState.tabOrder - right.sidebarState.tabOrder ||
					left.workspaceId.localeCompare(right.workspaceId),
			)
			.flatMap((row, stableOrder) => {
				const workspace = workspacesById.get(row.workspaceId);
				if (!workspace || workspace.projectId !== projectId) return [];
				const terminal = extractAAActiveTaskTerminalEvidence(
					row.paneLayout as WorkspaceState<PaneViewerData>,
				);
				if (!terminal) return [];
				return [
					{
						hostUrl: cache.resolveHostUrl(workspace.hostId),
						isSelected: selectedWorkspaceId === workspace.id,
						stableOrder,
						terminal,
						workspaceId: workspace.id,
					},
				];
			});
	}, [cache, localStateRows, projectId, selectedWorkspaceId, workspaces]);

	const runtimeQueries = useQueries({
		queries: targets.map((target) => ({
			queryKey: getAARuntimeSnapshotsQueryKey(target.workspaceId),
			enabled: Boolean(target.hostUrl),
			queryFn: async (): Promise<AARuntimeSessionSnapshot[]> => {
				if (!target.hostUrl) return [];
				return getHostServiceClientByUrl(target.hostUrl).aaRuntime.list.query({
					workspaceId: target.workspaceId,
				});
			},
			networkMode: "always" as const,
			staleTime: 30_000,
		})),
	});
	const resumeQueries = useQueries({
		queries: targets.map((target) => ({
			queryKey: getTerminalResumeCandidateQueryKey(
				target.workspaceId,
				target.terminal.terminalId,
			),
			enabled: Boolean(target.hostUrl),
			queryFn: async (): Promise<TerminalResumeCandidate | null> => {
				if (!target.hostUrl) return null;
				return getHostServiceClientByUrl(
					target.hostUrl,
				).terminalAgents.resumeCandidate.query({
					workspaceId: target.workspaceId,
					terminalId: target.terminal.terminalId,
				});
			},
			networkMode: "always" as const,
			staleTime: 15_000,
		})),
	});
	const gitStatusQueries = useQueries({
		queries: targets.map((target) => ({
			queryKey: getAAActiveTaskGitStatusQueryKey(
				target.hostUrl,
				target.workspaceId,
			),
			enabled: Boolean(target.hostUrl),
			queryFn: async (): Promise<AAActiveTaskGitStatus> => {
				if (!target.hostUrl) return { staged: [], unstaged: [] };
				return getHostServiceClientByUrl(target.hostUrl).git.getStatus.query({
					workspaceId: target.workspaceId,
					priority: "background",
				});
			},
			networkMode: "always" as const,
			refetchOnWindowFocus: false,
			staleTime: Number.POSITIVE_INFINITY,
		})),
	});

	useEffect(() => {
		const cleanups: Array<() => void> = [];
		for (const target of targets) {
			if (!target.hostUrl) continue;
			const hostUrl = target.hostUrl;
			const bus = getEventBus(hostUrl, () => getHostServiceWsToken(hostUrl));
			cleanups.push(
				bus.on(
					"aa-runtime:changed",
					target.workspaceId,
					(_workspaceId, payload) => {
						queryClient.setQueryData<AARuntimeSessionSnapshot[]>(
							getAARuntimeSnapshotsQueryKey(target.workspaceId),
							(current = []) => [
								payload.snapshot,
								...current.filter(
									(snapshot) =>
										snapshot.sessionKey !== payload.snapshot.sessionKey,
								),
							],
						);
					},
				),
			);
			const invalidateResumeCandidate = () => {
				void queryClient.invalidateQueries({
					queryKey: getTerminalResumeCandidateQueryKey(
						target.workspaceId,
						target.terminal.terminalId,
					),
				});
			};
			cleanups.push(
				bus.on(
					"agent:lifecycle",
					target.workspaceId,
					invalidateResumeCandidate,
				),
				bus.on(
					"terminal:lifecycle",
					target.workspaceId,
					invalidateResumeCandidate,
				),
				bus.on("git:changed", target.workspaceId, () => {
					void queryClient.invalidateQueries({
						queryKey: getAAActiveTaskGitStatusQueryKey(
							target.hostUrl,
							target.workspaceId,
						),
					});
				}),
				bus.retain(),
			);
		}

		return () => {
			for (const cleanup of cleanups) cleanup();
		};
	}, [queryClient, targets]);

	// `useQueries` may preserve the result-array identity while updating an
	// individual result. Rebuild this cheap pure projection on every render so
	// async runtime/resume/Git evidence cannot remain stuck at its initial value.
	const projection = projectAAActiveTasks(
		targets.map((target, index) => {
			const runtimeSnapshot = (runtimeQueries[index]?.data ?? [])
				.filter(
					(snapshot) =>
						snapshot.transport.terminalId === target.terminal.terminalId,
				)
				.sort((left, right) => right.observedAt - left.observedAt)[0];
			return {
				changedFileCount: countAAActiveTaskChangedFiles(
					gitStatusQueries[index]?.data,
				),
				isSelected: target.isSelected,
				resumeCandidate: resumeQueries[index]?.data,
				runtimeSnapshot,
				stableOrder: target.stableOrder,
				terminal: target.terminal,
				workspaceId: target.workspaceId,
			};
		}),
	);
	const isLoading = targets.some(
		(target, index) =>
			Boolean(target.hostUrl) &&
			(runtimeQueries[index]?.isPending || resumeQueries[index]?.isPending),
	);

	return {
		eligibleTaskCount: targets.length,
		isLoading,
		projection,
	};
}
