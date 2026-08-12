export type AAApplicationRouteKind =
	| "home"
	| "cases"
	| "work-folder"
	| "advanced-workspace"
	| "tasks"
	| "automations"
	| "pull-requests"
	| "sessions"
	| "agents"
	| "settings"
	| "outside";

export type AANavigationDestination =
	| "home"
	| "cases"
	| "tasks"
	| "automations"
	| "pull-requests"
	| "sessions"
	| "agents"
	| "settings";

export interface AANavigationContext {
	activeDestination: AANavigationDestination | null;
	dashboardCabinetAvailable: boolean;
	filesAvailable: boolean;
	workspaceId: string | null;
}

function isPathFamily(pathname: string, root: string): boolean {
	return pathname === root || pathname.startsWith(`${root}/`);
}

export function resolveAAApplicationRoute(
	pathname: string,
): AAApplicationRouteKind {
	if (isPathFamily(pathname, "/v2-workspaces")) return "home";
	if (isPathFamily(pathname, "/project")) return "cases";
	if (isPathFamily(pathname, "/v2-workspace")) return "work-folder";
	if (isPathFamily(pathname, "/new-workspace")) return "advanced-workspace";
	if (isPathFamily(pathname, "/tasks")) return "tasks";
	if (isPathFamily(pathname, "/automations")) return "automations";
	if (isPathFamily(pathname, "/pull-requests")) return "pull-requests";
	if (isPathFamily(pathname, "/settings/terminal")) return "sessions";
	if (isPathFamily(pathname, "/settings/agents")) return "agents";
	if (isPathFamily(pathname, "/settings")) return "settings";
	return "outside";
}

export function isAAApplicationShellRoute(pathname: string): boolean {
	return resolveAAApplicationRoute(pathname) !== "outside";
}

export function isAADashboardShellRoute(pathname: string): boolean {
	const route = resolveAAApplicationRoute(pathname);
	return !["outside", "sessions", "agents", "settings"].includes(route);
}

export function resolveAAActiveNavigation(
	pathname: string,
): AANavigationDestination | null {
	switch (resolveAAApplicationRoute(pathname)) {
		case "home":
			return "home";
		case "cases":
		case "work-folder":
		case "advanced-workspace":
			return "cases";
		case "tasks":
			return "tasks";
		case "automations":
			return "automations";
		case "pull-requests":
			return "pull-requests";
		case "sessions":
			return "sessions";
		case "agents":
			return "agents";
		case "settings":
			return "settings";
		case "outside":
			return null;
	}
}

export function resolveAAWorkspaceId(pathname: string): string | null {
	const match = pathname.match(/^\/v2-workspace\/([^/]+)/);
	return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function resolveAANavigationContext(
	pathname: string,
): AANavigationContext {
	const workspaceId = resolveAAWorkspaceId(pathname);
	return {
		activeDestination: resolveAAActiveNavigation(pathname),
		dashboardCabinetAvailable: isAADashboardShellRoute(pathname),
		filesAvailable: workspaceId !== null,
		workspaceId,
	};
}
