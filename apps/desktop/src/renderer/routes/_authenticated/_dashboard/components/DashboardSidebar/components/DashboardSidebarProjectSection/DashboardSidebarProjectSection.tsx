import type {
	DraggableAttributes,
	DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import type { DashboardSidebarProject } from "../../types";
import { getProjectChildrenWorkspaces } from "../../utils/projectChildren";
import { DashboardSidebarCollapsedProjectContent } from "./components/DashboardSidebarCollapsedProjectContent";
import { DashboardSidebarExpandedProjectContent } from "./components/DashboardSidebarExpandedProjectContent";
import { DashboardSidebarProjectContextMenu } from "./components/DashboardSidebarProjectContextMenu";
import { DashboardSidebarProjectRow } from "./components/DashboardSidebarProjectRow";
import { ImportWorktreesDialog } from "./components/ImportWorktreesDialog";
import { useDashboardSidebarProjectSectionActions } from "./hooks/useDashboardSidebarProjectSectionActions";

interface DashboardSidebarProjectSectionProps {
	project: DashboardSidebarProject;
	aaOffice?: boolean;
	isSidebarCollapsed?: boolean;
	isDraggingProject?: boolean;
	workspaceShortcutLabels: Map<string, string>;
	onWorkspaceHover: (workspaceId: string) => void | Promise<void>;
	onToggleCollapse: (projectId: string) => void;
	dragHandleListeners?: DraggableSyntheticListeners;
	dragHandleAttributes?: DraggableAttributes;
}

export function DashboardSidebarProjectSection({
	project,
	aaOffice = false,
	isSidebarCollapsed = false,
	isDraggingProject = false,
	workspaceShortcutLabels,
	onWorkspaceHover,
	onToggleCollapse,
	dragHandleListeners,
	dragHandleAttributes,
}: DashboardSidebarProjectSectionProps) {
	const flattenedCollapsedWorkspaces = useMemo(
		() => getProjectChildrenWorkspaces(project.children),
		[project.children],
	);

	const {
		cancelRename,
		confirmImportWorktrees,
		confirmRemoveFromSidebar,
		deleteSection,
		handleImportWorktrees,
		handleNewSection,
		handleNewTask,
		handleNewWorkspace,
		handleOpenInFinder,
		handleOpenSettings,
		importableWorktrees,
		isImportingWorktrees,
		isRenaming,
		isNewTaskAvailable,
		renameSection,
		renameValue,
		setImportableWorktrees,
		setRenameValue,
		startRename,
		submitRename,
		toggleSectionCollapsed,
	} = useDashboardSidebarProjectSectionActions({
		project,
	});

	const totalWorkspaceCount = flattenedCollapsedWorkspaces.length;

	// Rendered only while open so the checkbox state resets per invocation.
	const importWorktreesDialog = importableWorktrees && (
		<ImportWorktreesDialog
			open
			worktrees={importableWorktrees}
			isImporting={isImportingWorktrees}
			onOpenChange={(open) => {
				if (!open) setImportableWorktrees(null);
			}}
			onConfirm={confirmImportWorktrees}
		/>
	);

	if (isSidebarCollapsed) {
		return (
			<DashboardSidebarProjectContextMenu
				onCreateSection={handleNewSection}
				onImportWorktrees={handleImportWorktrees}
				onOpenInFinder={handleOpenInFinder}
				onOpenSettings={handleOpenSettings}
				onRemoveFromSidebar={confirmRemoveFromSidebar}
				onRename={startRename}
			>
				<div className="aa-briefcase-section mt-1 first:mt-0">
					<DashboardSidebarCollapsedProjectContent
						projectId={project.id}
						projectName={project.name}
						iconUrl={project.iconUrl}
						projectColor={project.color}
						isCollapsed={project.isCollapsed}
						totalWorkspaceCount={totalWorkspaceCount}
						projectChildren={project.children}
						workspaceShortcutLabels={workspaceShortcutLabels}
						onWorkspaceHover={onWorkspaceHover}
						onToggleCollapse={() => onToggleCollapse(project.id)}
					/>
					{importWorktreesDialog}
				</div>
			</DashboardSidebarProjectContextMenu>
		);
	}

	return (
		<div className="aa-briefcase-section mt-1 first:mt-0">
			<DashboardSidebarProjectContextMenu
				onCreateSection={handleNewSection}
				onImportWorktrees={handleImportWorktrees}
				onOpenInFinder={handleOpenInFinder}
				onOpenSettings={handleOpenSettings}
				onRemoveFromSidebar={confirmRemoveFromSidebar}
				onRename={startRename}
			>
				<DashboardSidebarProjectRow
					projectName={project.name}
					iconUrl={project.iconUrl}
					projectColor={project.color}
					isCollapsed={project.isCollapsed}
					isRenaming={isRenaming}
					renameValue={renameValue}
					onRenameValueChange={setRenameValue}
					onSubmitRename={submitRename}
					onCancelRename={cancelRename}
					onStartRename={startRename}
					onToggleCollapse={() => onToggleCollapse(project.id)}
					onNewTask={aaOffice ? handleNewTask : undefined}
					isNewTaskAvailable={isNewTaskAvailable}
					onNewWorkspace={handleNewWorkspace}
					{...(dragHandleAttributes ?? {})}
					{...(dragHandleListeners ?? {})}
				/>
			</DashboardSidebarProjectContextMenu>

			<AnimatePresence initial={false}>
				{!isDraggingProject && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="overflow-hidden"
					>
						<DashboardSidebarExpandedProjectContent
							aaOffice={aaOffice}
							projectId={project.id}
							isCollapsed={project.isCollapsed}
							projectChildren={project.children}
							workspaceShortcutLabels={workspaceShortcutLabels}
							onWorkspaceHover={onWorkspaceHover}
							onDeleteSection={deleteSection}
							onRenameSection={renameSection}
							onToggleSectionCollapse={toggleSectionCollapsed}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{importWorktreesDialog}
		</div>
	);
}
