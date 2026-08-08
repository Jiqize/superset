import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useV2UserPreferences } from "renderer/hooks/useV2UserPreferences";
import { useCollections } from "renderer/routes/_authenticated/providers/CollectionsProvider";
import {
	COLLAPSED_WORKSPACE_SIDEBAR_WIDTH,
	useWorkspaceSidebarStore,
} from "renderer/stores/workspace-sidebar-state";
import { AAIcon, type AAIconName } from "../AAIcon";

interface NavigationItem {
	icon: AAIconName;
	id: string;
	label: string;
	onClick: () => void;
	pressed?: boolean;
}

export function AANavigationRail() {
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();
	const workspaceMatch = matchRoute({
		to: "/v2-workspace/$workspaceId",
		fuzzy: true,
	});
	const workspaceId =
		workspaceMatch !== false ? workspaceMatch.workspaceId : null;
	const collections = useCollections();
	const { data: [workspaceLocalState] = [] } = useLiveQuery(
		(query) =>
			query
				.from({ localState: collections.v2WorkspaceLocalState })
				.where(({ localState }) =>
					eq(localState.workspaceId, workspaceId ?? ""),
				),
		[collections, workspaceId],
	);
	const sidebarOpen = useWorkspaceSidebarStore((state) => state.isOpen);
	const sidebarWidth = useWorkspaceSidebarStore((state) => state.width);
	const setSidebarOpen = useWorkspaceSidebarStore((state) => state.setOpen);
	const toggleSidebarCollapsed = useWorkspaceSidebarStore(
		(state) => state.toggleCollapsed,
	);
	const { preferences, setRightSidebarOpen, setRightSidebarTab } =
		useV2UserPreferences();
	const projectIndexOpen =
		sidebarOpen && sidebarWidth !== COLLAPSED_WORKSPACE_SIDEBAR_WIDTH;
	const filesOpen =
		preferences.rightSidebarOpen &&
		workspaceLocalState?.sidebarState.activeTab === "files";

	const openProjectIndex = () => {
		if (!sidebarOpen) {
			setSidebarOpen(true);
			return;
		}
		toggleSidebarCollapsed();
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
		},
		{
			id: "projects",
			label: "Projects / Briefcases",
			icon: "briefcase",
			onClick: openProjectIndex,
			pressed: projectIndexOpen,
		},
		{
			id: "files",
			label: "Files / Archive",
			icon: "archive",
			onClick: openFiles,
			pressed: filesOpen,
		},
		{
			id: "sessions",
			label: "Sessions",
			icon: "sessions",
			onClick: () => navigate({ to: "/settings/terminal" }),
		},
		{
			id: "agents",
			label: "Agents",
			icon: "agents",
			onClick: () => navigate({ to: "/settings/agents" }),
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
					}}
				/>
			</div>
		</nav>
	);
}

function AANavigationButton({ item }: { item: NavigationItem }) {
	return (
		<button
			aria-label={item.label}
			aria-pressed={item.pressed}
			className="aa-navigation-rail__button"
			data-active={item.pressed || undefined}
			onClick={item.onClick}
			title={item.label}
			type="button"
		>
			<AAIcon className="aa-navigation-rail__icon" name={item.icon} />
			<span>{shortLabel(item.id)}</span>
		</button>
	);
}

function shortLabel(id: string): string {
	switch (id) {
		case "projects":
			return "CASES";
		case "sessions":
			return "SESS";
		case "settings":
			return "SET";
		default:
			return id.toUpperCase();
	}
}
