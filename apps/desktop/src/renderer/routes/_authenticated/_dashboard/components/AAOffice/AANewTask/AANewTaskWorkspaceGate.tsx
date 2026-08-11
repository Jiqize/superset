import type { WorkspaceStore } from "@superset/panes";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { terminalRuntimeRegistry } from "renderer/lib/terminal/terminal-runtime-registry";
import type {
	PaneViewerData,
	TerminalPaneData,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";
import {
	findTerminalPaneLocation,
	focusTerminalPane,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/utils/focusTerminalPane";
import { useStore } from "zustand";
import type { StoreApi } from "zustand/vanilla";
import { useAARuntimeSnapshots } from "../AAAgentStatus/useAARuntimeSnapshots";
import { focusAAActiveWorkstation } from "../aaDailyWorkflowFocus";
import { aaNewTaskFlowStore, useAANewTaskFlow } from "./aaNewTaskFlow";
import { classifyAANewTaskRuntimeSnapshot } from "./aaNewTaskRuntime";

const RUNTIME_CONFIRMATION_TIMEOUT_MS = 30_000;
const FOCUS_ATTEMPT_LIMIT = 30;

interface AANewTaskWorkspaceGateProps {
	isLayoutReady: boolean;
	store: StoreApi<WorkspaceStore<PaneViewerData>>;
	workspaceId: string;
}

export function AANewTaskWorkspaceGate({
	isLayoutReady,
	store,
	workspaceId,
}: AANewTaskWorkspaceGateProps) {
	const activeFlow = useAANewTaskFlow((state) => state.activeFlow);
	const surfaceVisible = useAANewTaskFlow((state) => state.surfaceVisible);
	const terminalId = activeFlow?.terminalId ?? null;
	const flowWorkspaceId =
		activeFlow?.canonicalWorkspaceId ?? activeFlow?.workspaceId ?? null;
	const isMatchingWorkspace = flowWorkspaceId === workspaceId;

	const paneId = useStore(store, (state) => {
		if (!terminalId) return null;
		return findTerminalPaneLocation(state, terminalId)?.paneId ?? null;
	});
	const panePresentationReady = useStore(store, (state) => {
		if (!terminalId || !activeFlow) return false;
		const location = findTerminalPaneLocation(state, terminalId);
		if (!location) return false;
		const tab = state.tabs.find((candidate) => candidate.id === location.tabId);
		const pane = tab?.panes[location.paneId];
		if (!tab || pane?.kind !== "terminal") return false;
		const data = pane.data as TerminalPaneData;
		const title = pane.titleOverride ?? tab.titleOverride;
		return data.taskTitleEdited === true && title === activeFlow.title;
	});

	const subscribeToConnection = useCallback(
		(listener: () => void) => {
			if (!terminalId || !paneId) return () => {};
			return terminalRuntimeRegistry.onStateChange(
				terminalId,
				listener,
				paneId,
			);
		},
		[terminalId, paneId],
	);
	const getConnectionSnapshot = useCallback(() => {
		if (!terminalId || !paneId) return "disconnected" as const;
		return terminalRuntimeRegistry.getConnectionState(terminalId, paneId);
	}, [terminalId, paneId]);
	const connectionState = useSyncExternalStore(
		subscribeToConnection,
		getConnectionSnapshot,
	);

	const runtimeSnapshots = useAARuntimeSnapshots(
		isMatchingWorkspace ? workspaceId : "",
	);
	const runtimeClassification = useMemo(() => {
		if (!terminalId || !isMatchingWorkspace) return null;
		const snapshot = runtimeSnapshots.get(terminalId);
		if (!snapshot) return null;
		return classifyAANewTaskRuntimeSnapshot(snapshot, {
			terminalId,
			workspaceId,
		});
	}, [isMatchingWorkspace, runtimeSnapshots, terminalId, workspaceId]);

	useEffect(() => {
		if (
			!activeFlow ||
			activeFlow.stage !== "starting-pi" ||
			!isMatchingWorkspace ||
			!isLayoutReady ||
			!paneId ||
			!panePresentationReady
		) {
			return;
		}
		focusTerminalPane(store, activeFlow.terminalId ?? "");
		aaNewTaskFlowStore
			.getState()
			.transition(activeFlow.flowId, "connecting-runtime");
	}, [
		activeFlow,
		isLayoutReady,
		isMatchingWorkspace,
		paneId,
		panePresentationReady,
		store,
	]);

	useEffect(() => {
		if (
			!activeFlow ||
			activeFlow.stage !== "failed" ||
			activeFlow.failure?.boundary !== "runtime-confirmation" ||
			!surfaceVisible ||
			runtimeClassification?.kind !== "confirmed"
		) {
			return;
		}
		aaNewTaskFlowStore
			.getState()
			.transition(activeFlow.flowId, "connecting-runtime");
	}, [activeFlow, runtimeClassification, surfaceVisible]);

	useEffect(() => {
		if (
			!activeFlow ||
			activeFlow.stage !== "connecting-runtime" ||
			!surfaceVisible ||
			!isMatchingWorkspace
		) {
			return;
		}

		if (runtimeClassification?.kind === "unavailable") {
			aaNewTaskFlowStore.getState().fail(activeFlow.flowId, {
				boundary: "runtime-confirmation",
				message: `Pi reported ${runtimeClassification.state}. The created workspace and terminal were kept.`,
			});
			return;
		}

		if (
			runtimeClassification?.kind !== "confirmed" ||
			connectionState !== "open" ||
			!paneId ||
			!terminalId ||
			!panePresentationReady
		) {
			return;
		}

		focusTerminalPane(store, terminalId);
		let cancelled = false;
		let attempts = 0;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		const tryFocus = () => {
			if (cancelled) return;
			attempts += 1;
			terminalRuntimeRegistry.getTerminal(terminalId, paneId)?.focus();
			if (focusAAActiveWorkstation()) {
				aaNewTaskFlowStore.getState().transition(activeFlow.flowId, "ready");
				aaNewTaskFlowStore.getState().dismissSurface();
				return;
			}
			if (attempts >= FOCUS_ATTEMPT_LIMIT) {
				aaNewTaskFlowStore.getState().fail(activeFlow.flowId, {
					boundary: "terminal-focus",
					message:
						"Pi runtime was confirmed, but AA Office could not move keyboard focus into xterm. The task and workspace were kept.",
				});
				return;
			}
			timeoutId = setTimeout(tryFocus, 50);
		};
		requestAnimationFrame(tryFocus);

		return () => {
			cancelled = true;
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [
		activeFlow,
		connectionState,
		isMatchingWorkspace,
		paneId,
		panePresentationReady,
		runtimeClassification,
		store,
		surfaceVisible,
		terminalId,
	]);

	useEffect(() => {
		if (
			!activeFlow ||
			activeFlow.stage !== "connecting-runtime" ||
			!surfaceVisible ||
			!isMatchingWorkspace
		) {
			return;
		}
		const flowId = activeFlow.flowId;
		const timeoutId = setTimeout(() => {
			const current = aaNewTaskFlowStore.getState().activeFlow;
			if (
				current?.flowId !== flowId ||
				current.stage !== "connecting-runtime"
			) {
				return;
			}
			aaNewTaskFlowStore.getState().fail(flowId, {
				boundary: "runtime-confirmation",
				message:
					"Pi runtime identity was not confirmed yet. The workspace and terminal were kept; check again or open the workspace directly.",
			});
		}, RUNTIME_CONFIRMATION_TIMEOUT_MS);

		return () => clearTimeout(timeoutId);
	}, [activeFlow, isMatchingWorkspace, surfaceVisible]);

	return null;
}
