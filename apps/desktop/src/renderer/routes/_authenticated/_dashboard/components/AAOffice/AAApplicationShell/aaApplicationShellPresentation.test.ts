import { describe, expect, it } from "bun:test";
import {
	type AAApplicationRouteKind,
	isAAApplicationShellRoute,
	isAADashboardShellRoute,
	resolveAAActiveNavigation,
	resolveAAApplicationRoute,
	resolveAANavigationContext,
	resolveAAWorkspaceId,
} from "./aaApplicationShellPresentation";

describe("AA application shell presentation", () => {
	it("covers every Phase 4A first-level route and nested alias", () => {
		const routes = new Map<string, AAApplicationRouteKind>([
			["/v2-workspaces", "home"],
			["/project/project-1", "cases"],
			["/v2-workspace/workspace-1", "work-folder"],
			["/new-workspace", "advanced-workspace"],
			["/tasks", "tasks"],
			["/tasks/task-1", "tasks"],
			["/automations/automation-1", "automations"],
			["/pull-requests/42", "pull-requests"],
			["/settings/terminal", "sessions"],
			["/settings/agents/pi", "agents"],
			["/settings/account", "settings"],
		]);

		for (const [pathname, kind] of routes) {
			expect(resolveAAApplicationRoute(pathname)).toBe(kind);
			expect(isAAApplicationShellRoute(pathname)).toBe(true);
		}
	});

	it("keeps V1, onboarding, auth, and public routes outside the AA shell", () => {
		for (const pathname of [
			"/workspace/legacy",
			"/workspaces",
			"/onboarding",
			"/sign-in",
			"/",
		]) {
			expect(resolveAAApplicationRoute(pathname)).toBe("outside");
			expect(isAAApplicationShellRoute(pathname)).toBe(false);
		}
	});

	it("derives one stable global navigation destination from the route", () => {
		expect(resolveAAActiveNavigation("/v2-workspaces")).toBe("home");
		expect(resolveAAActiveNavigation("/v2-workspace/workspace-1")).toBe(
			"cases",
		);
		expect(resolveAAActiveNavigation("/settings/terminal")).toBe("sessions");
		expect(resolveAAActiveNavigation("/settings/agents/pi")).toBe("agents");
		expect(resolveAAActiveNavigation("/settings/appearance")).toBe("settings");
	});

	it("separates dashboard/sidebar composition from settings composition", () => {
		expect(isAADashboardShellRoute("/tasks")).toBe(true);
		expect(isAADashboardShellRoute("/v2-workspace/workspace-1")).toBe(true);
		expect(isAADashboardShellRoute("/settings/account")).toBe(false);
		expect(isAADashboardShellRoute("/workspace/legacy")).toBe(false);
	});

	it("exposes a Workspace id only on a real V2 Work Folder route", () => {
		expect(resolveAAWorkspaceId("/v2-workspace/workspace%201")).toBe(
			"workspace 1",
		);
		expect(resolveAAWorkspaceId("/v2-workspaces")).toBeNull();
		expect(resolveAAWorkspaceId("/settings/agents")).toBeNull();
	});

	it("fails workspace-only rail actions closed outside a Work Folder", () => {
		expect(resolveAANavigationContext("/v2-workspace/workspace-1")).toEqual({
			activeDestination: "cases",
			dashboardCabinetAvailable: true,
			filesAvailable: true,
			workspaceId: "workspace-1",
		});
		expect(resolveAANavigationContext("/v2-workspaces")).toEqual({
			activeDestination: "home",
			dashboardCabinetAvailable: true,
			filesAvailable: false,
			workspaceId: null,
		});
		expect(resolveAANavigationContext("/settings/account")).toEqual({
			activeDestination: "settings",
			dashboardCabinetAvailable: false,
			filesAvailable: false,
			workspaceId: null,
		});
	});
});
