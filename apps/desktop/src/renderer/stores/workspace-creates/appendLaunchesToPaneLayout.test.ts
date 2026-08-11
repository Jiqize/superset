import { describe, expect, it } from "bun:test";
import { createWorkspaceStore, type WorkspaceState } from "@superset/panes";
import type {
	PaneViewerData,
	TerminalPaneData,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";
import { appendLaunchesToPaneLayout } from "./appendLaunchesToPaneLayout";

describe("appendLaunchesToPaneLayout", () => {
	it("adds one tab per terminal and agent launch", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-1", label: "Workspace Setup" }],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "term-2", label: "Claude" },
			],
		});

		expect(state.tabs).toHaveLength(2);
		expect(state.tabs.map((tab) => tab.titleOverride)).toEqual([
			"Workspace Setup",
			"Claude",
		]);
	});

	it("dedupes a chained agent that reuses the setup terminal to one tab", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-1", label: "Workspace Setup" }],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "term-1", label: "Claude" },
			],
		});

		expect(state.tabs).toHaveLength(1);
		expect(state.tabs[0].titleOverride).toBe("Workspace Setup");
		const pane = Object.values(state.tabs[0].panes)[0];
		expect((pane.data as TerminalPaneData).launchIdentity).toEqual({
			label: "Claude",
		});
	});

	it("keeps a new Pi-first layout terminal-only", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "term-pi", label: "Pi" },
			],
		});

		expect(state.tabs).toHaveLength(1);
		const panes = Object.values(state.tabs[0].panes);
		expect(panes).toHaveLength(1);
		expect(panes[0]).toMatchObject({
			kind: "terminal",
			data: {
				launchIdentity: { label: "Pi" },
				terminalId: "term-pi",
			},
		});
	});

	it("applies an explicit Task Folder title only to the intended Pi pane", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "term-pi", label: "Pi" },
			],
			initialAgentPresentation: {
				agentId: "pi-config",
				agentResultIndex: 0,
				title: "Fix login state",
			},
		});

		expect(state.tabs[0].titleOverride).toBe("Fix login state");
		const pane = Object.values(state.tabs[0].panes)[0];
		expect(pane).toMatchObject({
			kind: "terminal",
			data: {
				launchIdentity: { agentId: "pi-config", label: "Pi" },
				taskTitleEdited: true,
				terminalId: "term-pi",
			},
		});
	});

	it("carries Task Folder presentation onto a chained setup terminal", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-shared", label: "Workspace Setup" }],
			agents: [
				{
					ok: true,
					kind: "terminal",
					sessionId: "term-shared",
					label: "Pi",
				},
			],
			initialAgentPresentation: {
				agentId: "pi-config",
				agentResultIndex: 0,
				title: "Run guarded setup",
			},
		});

		expect(state.tabs).toHaveLength(1);
		expect(state.tabs[0].titleOverride).toBe("Run guarded setup");
		const pane = Object.values(state.tabs[0].panes)[0];
		expect(pane.data).toMatchObject({
			launchIdentity: { agentId: "pi-config", label: "Pi" },
			taskTitleEdited: true,
			terminalId: "term-shared",
		});
	});

	it("does not fabricate a task pane when the intended Pi launch fails", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-setup", label: "Workspace Setup" }],
			agents: [{ ok: false, error: "Pi executable missing" }],
			initialAgentPresentation: {
				agentId: "pi-config",
				agentResultIndex: 0,
				title: "Should not appear",
			},
		});

		expect(state.tabs).toHaveLength(1);
		expect(state.tabs[0].titleOverride).toBe("Workspace Setup");
		const pane = Object.values(state.tabs[0].panes)[0];
		expect((pane.data as TerminalPaneData).taskTitleEdited).toBeUndefined();
	});

	it("leaves unrelated command and setup panes unchanged", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-command", label: "Bootstrap" }],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "term-pi", label: "Pi" },
			],
			initialAgentPresentation: {
				agentId: "pi-config",
				agentResultIndex: 0,
				title: "Implement New Task",
			},
		});

		expect(state.tabs.map((tab) => tab.titleOverride)).toEqual([
			"Bootstrap",
			"Implement New Task",
		]);
	});

	it("preserves an existing split layout when appending a launch", () => {
		const initial = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "term-1", label: "Terminal 1" }],
			agents: [],
		});
		const store = createWorkspaceStore<PaneViewerData>({
			initialState: initial,
		});
		const tab = initial.tabs[0];
		const paneId = Object.keys(tab.panes)[0];
		store.getState().splitPane({
			newPane: {
				kind: "terminal",
				data: { terminalId: "term-2" } satisfies TerminalPaneData,
			},
			paneId,
			position: "right",
			tabId: tab.id,
		});
		const splitState = store.getState();
		const existing: WorkspaceState<PaneViewerData> = {
			activeTabId: splitState.activeTabId,
			tabs: splitState.tabs,
			version: splitState.version,
		};
		const existingSnapshot = JSON.stringify(existing.tabs[0]);
		expect(Object.keys(existing.tabs[0].panes)).toHaveLength(2);

		const state = appendLaunchesToPaneLayout({
			existing,
			terminals: [],
			agents: [
				{
					ok: true,
					kind: "terminal",
					sessionId: "term-3",
					label: "Pi",
				},
			],
		});

		expect(JSON.stringify(state.tabs[0])).toBe(existingSnapshot);
		expect(state.tabs).toHaveLength(2);
	});

	it("skips failed agent launches", () => {
		const state = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [],
			agents: [{ ok: false, error: "boom" }],
		});

		expect(state.tabs).toHaveLength(0);
	});
});
