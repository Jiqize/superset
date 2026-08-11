import { createWorkspaceStore, type WorkspaceState } from "@superset/panes";
import type {
	ChatPaneData,
	PaneViewerData,
	TerminalPaneData,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";

const EMPTY_STATE: WorkspaceState<PaneViewerData> = {
	version: 1,
	tabs: [],
	activeTabId: null,
};

type AgentLaunchResult =
	| { ok: true; kind: "terminal"; sessionId: string; label: string }
	| { ok: true; kind: "chat"; sessionId: string; label: string }
	| { ok: false; error: string };

interface AppendArgs {
	existing: WorkspaceState<PaneViewerData> | undefined;
	terminals: Array<{ terminalId: string; label?: string }>;
	agents: AgentLaunchResult[];
	initialAgentPresentation?: InitialAgentPanePresentation;
}

export interface InitialAgentPanePresentation {
	agentId: string;
	agentResultIndex: number;
	title: string;
}

interface PaneLaunch {
	kind: "terminal" | "chat";
	launchIdentity?: TerminalPaneData["launchIdentity"];
	sessionId: string;
	label?: string;
	taskTitle?: string;
	taskTitleEdited?: boolean;
}

export function appendLaunchesToPaneLayout({
	existing,
	terminals,
	agents,
	initialAgentPresentation,
}: AppendArgs): WorkspaceState<PaneViewerData> {
	const terminalLaunches: PaneLaunch[] = terminals.map((entry) => ({
		kind: "terminal",
		sessionId: entry.terminalId,
		label: entry.label,
	}));
	const agentLaunches: PaneLaunch[] = agents.flatMap((entry, index) => {
		if (!entry.ok) return [];
		const hasInitialPresentation =
			entry.kind === "terminal" &&
			initialAgentPresentation?.agentResultIndex === index;
		return [
			{
				kind: entry.kind,
				launchIdentity:
					entry.kind === "terminal"
						? {
								...(hasInitialPresentation
									? { agentId: initialAgentPresentation.agentId }
									: {}),
								label: entry.label,
							}
						: undefined,
				sessionId: entry.sessionId,
				label: entry.label,
				...(hasInitialPresentation
					? {
							taskTitle: initialAgentPresentation.title,
							taskTitleEdited: true,
						}
					: {}),
			},
		];
	});
	// A wait-for-setup chained agent reuses the setup terminal, so its result
	// carries the same session id as the setup terminal descriptor — dedupe to
	// one tab (first entry wins, keeping the setup terminal's label).
	const launches: PaneLaunch[] = [];
	const launchesBySessionId = new Map<string, PaneLaunch>();
	for (const launch of [...terminalLaunches, ...agentLaunches]) {
		const existingLaunch = launchesBySessionId.get(launch.sessionId);
		if (existingLaunch) {
			// A wait-for-setup agent reuses the setup terminal. Preserve the setup
			// label while retaining the real agent launch identity separately.
			if (!existingLaunch.launchIdentity && launch.launchIdentity) {
				existingLaunch.launchIdentity = launch.launchIdentity;
			}
			if (launch.taskTitle) {
				existingLaunch.taskTitle = launch.taskTitle;
				existingLaunch.taskTitleEdited = launch.taskTitleEdited;
			}
			continue;
		}
		const nextLaunch = { ...launch };
		launchesBySessionId.set(launch.sessionId, nextLaunch);
		launches.push(nextLaunch);
	}

	if (launches.length === 0) {
		return existing ?? EMPTY_STATE;
	}

	const store = createWorkspaceStore<PaneViewerData>({
		initialState: existing ?? EMPTY_STATE,
	});

	for (const launch of launches) {
		store.getState().addTab({
			titleOverride: launch.taskTitle ?? launch.label,
			panes: [
				launch.kind === "chat"
					? {
							kind: "chat",
							data: { sessionId: launch.sessionId } satisfies ChatPaneData,
						}
					: {
							kind: "terminal",
							data: {
								launchIdentity: launch.launchIdentity,
								taskTitleEdited: launch.taskTitleEdited,
								terminalId: launch.sessionId,
							} satisfies TerminalPaneData,
						},
			],
		});
	}

	const next = store.getState();
	return {
		version: next.version,
		tabs: next.tabs,
		activeTabId: next.activeTabId,
	};
}
