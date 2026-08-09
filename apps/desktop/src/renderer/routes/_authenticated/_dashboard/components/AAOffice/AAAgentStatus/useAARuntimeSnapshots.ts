import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useWorkspaceEvent } from "renderer/hooks/host-service/useWorkspaceEvent";
import { useWorkspaceHostUrl } from "renderer/hooks/host-service/useWorkspaceHostUrl";
import { getHostServiceClientByUrl } from "renderer/lib/host-service-client";

export function getAARuntimeSnapshotsQueryKey(workspaceId: string) {
	return ["aa-runtime-snapshots", workspaceId] as const;
}

export function indexAARuntimeSnapshots(
	snapshots: readonly AARuntimeSessionSnapshot[],
): Map<string, AARuntimeSessionSnapshot> {
	const indexed = new Map<string, AARuntimeSessionSnapshot>();
	for (const snapshot of snapshots) {
		const terminalId = snapshot.transport.terminalId;
		if (!terminalId) continue;
		const current = indexed.get(terminalId);
		if (!current || snapshot.observedAt >= current.observedAt) {
			indexed.set(terminalId, snapshot);
		}
	}
	return indexed;
}

export function useAARuntimeSnapshots(
	workspaceId: string,
): Map<string, AARuntimeSessionSnapshot> {
	const hostUrl = useWorkspaceHostUrl(workspaceId);
	const queryClient = useQueryClient();
	const queryKey = useMemo(
		() => getAARuntimeSnapshotsQueryKey(workspaceId),
		[workspaceId],
	);
	const enabled = Boolean(workspaceId) && Boolean(hostUrl);
	const { data } = useQuery({
		queryKey,
		enabled,
		queryFn: () => {
			if (!hostUrl) return [] as AARuntimeSessionSnapshot[];
			return getHostServiceClientByUrl(hostUrl).aaRuntime.list.query({
				workspaceId,
			});
		},
		staleTime: 30_000,
	});

	const handleChange = useCallback(
		(payload: { snapshot: AARuntimeSessionSnapshot }) => {
			queryClient.setQueryData<AARuntimeSessionSnapshot[]>(
				queryKey,
				(current = []) => [
					payload.snapshot,
					...current.filter(
						(snapshot) => snapshot.sessionKey !== payload.snapshot.sessionKey,
					),
				],
			);
		},
		[queryClient, queryKey],
	);

	useWorkspaceEvent("aa-runtime:changed", workspaceId, handleChange, enabled);

	return useMemo(() => indexAARuntimeSnapshots(data ?? []), [data]);
}
