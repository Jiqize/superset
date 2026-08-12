import {
	type AAApplicationRouteKind,
	resolveAAApplicationRoute,
} from "../AAApplicationShell/aaApplicationShellPresentation";

export interface AAApplicationPagePresentation {
	route: AAApplicationRouteKind;
	eyebrow: string;
	title: string;
	description: string;
}

const ROUTE_PRESENTATION: Record<
	Exclude<AAApplicationRouteKind, "settings" | "outside">,
	Omit<AAApplicationPagePresentation, "route">
> = {
	home: {
		eyebrow: "HOME DESK",
		title: "Briefcases & Work Folders",
		description: "Start with New Task; return to saved work from the cabinet.",
	},
	cases: {
		eyebrow: "BRIEFCASE DESK",
		title: "Case · Work Folder Setup",
		description: "Create or configure infrastructure inside this Briefcase.",
	},
	"work-folder": {
		eyebrow: "TERMINAL FLOOR",
		title: "Work Folder",
		description: "Real terminal work, runtime evidence, and file output.",
	},
	"advanced-workspace": {
		eyebrow: "ADVANCED INFRASTRUCTURE",
		title: "New Work Folder · Advanced",
		description:
			"Choose branch, worktree, Employee, and launch controls directly.",
	},
	tasks: {
		eyebrow: "OPERATIONS INDEX",
		title: "Tasks",
		description:
			"Existing team tasks and issues; separate from AA Task Folders.",
	},
	automations: {
		eyebrow: "OPERATIONS INDEX",
		title: "Automations",
		description:
			"Scheduled work using the existing Superset automation system.",
	},
	"pull-requests": {
		eyebrow: "REVIEW TRAY",
		title: "Pull Requests",
		description: "Repository review status and existing pull-request actions.",
	},
	sessions: {
		eyebrow: "SESSION OFFICE",
		title: "Sessions",
		description: "Terminal presets, persistence, and session infrastructure.",
	},
	agents: {
		eyebrow: "EMPLOYEE OFFICE",
		title: "Employees & Agents",
		description:
			"Configure primary Pi and compatibility Employee launch settings.",
	},
};

const SETTINGS_TITLES: Record<string, string> = {
	account: "Account",
	appearance: "Appearance",
	keyboard: "Keyboard",
	behavior: "General",
	git: "Git & Worktrees",
	links: "Links",
	models: "Models",
	ringtones: "Notifications",
};

export function resolveAAApplicationPagePresentation(
	pathname: string,
): AAApplicationPagePresentation | null {
	const route = resolveAAApplicationRoute(pathname);
	if (route === "outside") return null;
	if (route !== "settings") {
		return { route, ...ROUTE_PRESENTATION[route] };
	}

	const section = pathname.match(/^\/settings\/([^/]+)/)?.[1] ?? "account";
	const title = SETTINGS_TITLES[section] ?? "Settings";
	return {
		route,
		eyebrow: "OFFICE CONTROLS",
		title,
		description:
			"Device, workflow, and application preferences for this office.",
	};
}
