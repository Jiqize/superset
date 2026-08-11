import type { WorkspaceState, WorkspaceStore } from "@superset/panes";
import type { StoreApi } from "zustand/vanilla";
import type { PaneViewerData, TerminalPaneData } from "../../types";

interface TerminalPaneLocation {
	tabId: string;
	paneId: string;
}

export type FocusOrAddTerminalPaneResult = "focused" | "added";

export function findTerminalPaneLocation(
	state: WorkspaceState<PaneViewerData>,
	terminalId: string,
): TerminalPaneLocation | null {
	for (const tab of state.tabs) {
		for (const pane of Object.values(tab.panes)) {
			if (pane.kind !== "terminal") continue;
			const data = pane.data as Partial<TerminalPaneData>;
			if (data.terminalId !== terminalId) continue;
			return { tabId: tab.id, paneId: pane.id };
		}
	}

	return null;
}

/**
 * Finds the terminal that best represents the user's current workstation.
 * Explicit recent history wins, followed by the active pane, another terminal
 * in the active tab, and finally the first terminal in the workspace.
 */
export function findPreferredTerminalPaneLocation(
	state: WorkspaceState<PaneViewerData>,
	lastTerminalId?: string | null,
): TerminalPaneLocation | null {
	if (lastTerminalId) {
		const previous = findTerminalPaneLocation(state, lastTerminalId);
		if (previous) return previous;
	}

	const activeTab = state.tabs.find((tab) => tab.id === state.activeTabId);
	if (activeTab?.activePaneId) {
		const activePane = activeTab.panes[activeTab.activePaneId];
		if (activePane?.kind === "terminal") {
			return { tabId: activeTab.id, paneId: activePane.id };
		}
	}

	if (activeTab) {
		const terminal = Object.values(activeTab.panes).find(
			(pane) => pane.kind === "terminal",
		);
		if (terminal) return { tabId: activeTab.id, paneId: terminal.id };
	}

	for (const tab of state.tabs) {
		const terminal = Object.values(tab.panes).find(
			(pane) => pane.kind === "terminal",
		);
		if (terminal) return { tabId: tab.id, paneId: terminal.id };
	}

	return null;
}

export function focusTerminalPane(
	store: StoreApi<WorkspaceStore<PaneViewerData>>,
	terminalId: string,
): boolean {
	const state = store.getState();
	const location = findTerminalPaneLocation(state, terminalId);
	if (!location) return false;

	state.setActiveTab(location.tabId);
	state.setActivePane(location);
	return true;
}

export function focusPreferredTerminalPane(
	store: StoreApi<WorkspaceStore<PaneViewerData>>,
	lastTerminalId?: string | null,
): boolean {
	const state = store.getState();
	const location = findPreferredTerminalPaneLocation(state, lastTerminalId);
	if (!location) return false;

	state.setActiveTab(location.tabId);
	state.setActivePane(location);
	return true;
}

export function focusOrAddTerminalPane(
	store: StoreApi<WorkspaceStore<PaneViewerData>>,
	terminalId: string,
): FocusOrAddTerminalPaneResult {
	if (focusTerminalPane(store, terminalId)) return "focused";

	store.getState().addTab({
		panes: [
			{
				kind: "terminal",
				data: { terminalId } as PaneViewerData,
			},
		],
	});
	return "added";
}
