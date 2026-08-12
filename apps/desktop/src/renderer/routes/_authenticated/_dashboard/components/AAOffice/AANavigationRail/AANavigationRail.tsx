import { useNavigate } from "@tanstack/react-router";
import { useV2UserPreferences } from "renderer/hooks/useV2UserPreferences";
import { useCollections } from "renderer/routes/_authenticated/providers/CollectionsProvider";
import {
	COLLAPSED_WORKSPACE_SIDEBAR_WIDTH,
	useWorkspaceSidebarStore,
} from "renderer/stores/workspace-sidebar-state";
import {
	type AANavigationDestination,
	resolveAANavigationContext,
} from "../AAApplicationShell/aaApplicationShellPresentation";
import { AAIcon, type AAIconName } from "../AAIcon";

interface NavigationItem {
	active?: boolean;
	disabled?: boolean;
	icon: AAIconName;
	id: AANavigationDestination | "files";
	label: string;
	onClick: () => void;
	pressed?: boolean;
	title?: string;
}

interface AANavigationRailProps {
	pathname: string;
}

export function AANavigationRail({ pathname }: AANavigationRailProps) {
	const navigate = useNavigate();
	const {
		activeDestination,
		dashboardCabinetAvailable,
		filesAvailable,
		workspaceId,
	} = resolveAANavigationContext(pathname);
	const collections = useCollections();
	const sidebarOpen = useWorkspaceSidebarStore((state) => state.isOpen);
	const sidebarWidth = useWorkspaceSidebarStore((state) => state.width);
	const setSidebarOpen = useWorkspaceSidebarStore((state) => state.setOpen);
	const toggleSidebarCollapsed = useWorkspaceSidebarStore(
		(state) => state.toggleCollapsed,
	);
	const { preferences, setRightSidebarOpen, setRightSidebarTab } =
		useV2UserPreferences();
	const projectIndexOpen =
		dashboardCabinetAvailable &&
		sidebarOpen &&
		sidebarWidth !== COLLAPSED_WORKSPACE_SIDEBAR_WIDTH;
	const filesOpen =
		workspaceId !== null &&
		preferences.rightSidebarOpen &&
		preferences.rightSidebarTab === "files";

	const openProjectIndex = () => {
		if (!sidebarOpen) {
			setSidebarOpen(true);
			return;
		}
		toggleSidebarCollapsed();
	};

	const openCases = () => {
		if (dashboardCabinetAvailable) {
			openProjectIndex();
			return;
		}
		if (!sidebarOpen) setSidebarOpen(true);
		if (sidebarWidth === COLLAPSED_WORKSPACE_SIDEBAR_WIDTH) {
			toggleSidebarCollapsed();
		}
		void navigate({ to: "/v2-workspaces" });
	};

	const openFiles = () => {
		if (workspaceId && collections.v2WorkspaceLocalState.get(workspaceId)) {
			collections.v2WorkspaceLocalState.update(workspaceId, (draft) => {
				draft.sidebarState.activeTab = "files";
			});
		}
		setRightSidebarTab("files");
		setRightSidebarOpen(true);
	};

	const primaryItems: NavigationItem[] = [
		{
			id: "home",
			label: "Home",
			icon: "home",
			onClick: () => navigate({ to: "/v2-workspaces" }),
			active: activeDestination === "home",
		},
		{
			id: "cases",
			label: "Projects / Briefcases",
			icon: "briefcase",
			onClick: openCases,
			active: activeDestination === "cases",
			pressed: projectIndexOpen,
		},
		{
			id: "files",
			label: "Files / Archive",
			icon: "archive",
			onClick: openFiles,
			disabled: !filesAvailable,
			pressed: filesOpen,
			title: !filesAvailable
				? "Open a Work Folder to browse files"
				: "Files / Archive",
		},
		{
			id: "tasks",
			label: "Tasks",
			icon: "tasks",
			onClick: () => navigate({ to: "/tasks" }),
			active: activeDestination === "tasks",
		},
		{
			id: "automations",
			label: "Automations",
			icon: "automations",
			onClick: () => navigate({ to: "/automations" }),
			active: activeDestination === "automations",
		},
		{
			id: "pull-requests",
			label: "Pull Requests",
			icon: "pull-requests",
			onClick: () => navigate({ to: "/pull-requests" }),
			active: activeDestination === "pull-requests",
		},
		{
			id: "sessions",
			label: "Sessions",
			icon: "sessions",
			onClick: () => navigate({ to: "/settings/terminal" }),
			active: activeDestination === "sessions",
		},
		{
			id: "agents",
			label: "Agents",
			icon: "agents",
			onClick: () => navigate({ to: "/settings/agents" }),
			active: activeDestination === "agents",
		},
	];

	return (
		<nav aria-label="AA Office" className="aa-navigation-rail">
			<div aria-hidden="true" className="aa-navigation-rail__drag drag" />
			<div className="aa-navigation-rail__items">
				{primaryItems.map((item) => (
					<AANavigationButton key={item.id} item={item} />
				))}
			</div>
			<div className="aa-navigation-rail__footer">
				<AANavigationButton
					item={{
						id: "settings",
						label: "Settings",
						icon: "settings",
						onClick: () => navigate({ to: "/settings/account" }),
						active: activeDestination === "settings",
					}}
				/>
			</div>
		</nav>
	);
}

function AANavigationButton({ item }: { item: NavigationItem }) {
	return (
		<button
			aria-label={
				item.disabled && item.title
					? `${item.label}. ${item.title}`
					: item.label
			}
			aria-current={item.active ? "page" : undefined}
			aria-disabled={item.disabled || undefined}
			aria-pressed={item.pressed === undefined ? undefined : item.pressed}
			className="aa-navigation-rail__button"
			data-active={item.active || item.pressed || undefined}
			data-disabled={item.disabled || undefined}
			disabled={item.disabled}
			onClick={item.onClick}
			title={item.title ?? item.label}
			type="button"
		>
			<AAIcon className="aa-navigation-rail__icon" name={item.icon} />
			<span>{shortLabel(item.id)}</span>
		</button>
	);
}

function shortLabel(id: NavigationItem["id"]): string {
	switch (id) {
		case "cases":
			return "CASES";
		case "automations":
			return "AUTO";
		case "pull-requests":
			return "PRS";
		case "tasks":
			return "TASKS";
		case "sessions":
			return "SESS";
		case "settings":
			return "SET";
		default:
			return id.toUpperCase();
	}
}
