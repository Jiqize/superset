import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AAIcon } from "../AAIcon";
import { AAActiveTasksSection } from "./AAActiveTasksSection";
import { useAAActiveTasksProjection } from "./useAAActiveTasksProjection";

interface AAActiveTasksProjectShellProps {
	children: ReactNode;
	enabled: boolean;
	projectId: string;
	workFolderCount: number;
}

export function AAActiveTasksProjectShell({
	children,
	enabled,
	projectId,
	workFolderCount,
}: AAActiveTasksProjectShellProps) {
	if (!enabled) return children;
	return (
		<EnabledAAActiveTasksProjectShell
			projectId={projectId}
			workFolderCount={workFolderCount}
		>
			{children}
		</EnabledAAActiveTasksProjectShell>
	);
}

function EnabledAAActiveTasksProjectShell({
	children,
	projectId,
	workFolderCount,
}: Omit<AAActiveTasksProjectShellProps, "enabled">) {
	const navigate = useNavigate();
	const activeTasks = useAAActiveTasksProjection(projectId);

	return (
		<>
			<AAActiveTasksSection
				isLoading={activeTasks.isLoading}
				projection={activeTasks.projection}
				onSelect={(workspaceId) => {
					void navigate({
						to: "/v2-workspace/$workspaceId",
						params: { workspaceId },
					});
				}}
			/>
			<details
				className="aa-work-folders"
				open={activeTasks.projection.rows.length === 0 || undefined}
			>
				<summary className="aa-work-folders__summary">
					<AAIcon name="folder" />
					<span>WORK FOLDERS</span>
					<small>{workFolderCount}</small>
				</summary>
				{children}
			</details>
		</>
	);
}
