import { useMemo } from "react";
import { useWorkspaceGitStatus } from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/providers/WorkspaceGitStatusProvider";
import { AAAgentStatus } from "../AAAgentStatus";
import { AAIcon } from "../AAIcon";

interface AABottomStatusBarProps {
	branch: string;
	workspaceName: string;
	workspaceType: "main" | "worktree";
}

export function AABottomStatusBar({
	branch,
	workspaceName,
	workspaceType,
}: AABottomStatusBarProps) {
	const gitStatus = useWorkspaceGitStatus();
	const changedFileCount = useMemo(() => {
		if (!gitStatus.data) return null;
		return new Set(
			[...gitStatus.data.staged, ...gitStatus.data.unstaged].map(
				(file) => file.path,
			),
		).size;
	}, [gitStatus.data]);
	const currentBranch = gitStatus.data?.currentBranch.name || branch;

	return (
		<footer className="aa-bottom-status-bar">
			<span className="aa-bottom-status-bar__item aa-bottom-status-bar__workspace">
				<AAIcon name="folder" />
				<strong>{workspaceName || branch}</strong>
			</span>
			<span className="aa-bottom-status-bar__separator" aria-hidden="true" />
			<AAAgentStatus compact />
			<span className="aa-bottom-status-bar__separator" aria-hidden="true" />
			<span className="aa-bottom-status-bar__item" title={currentBranch}>
				BRANCH&nbsp; <strong>{currentBranch}</strong>
			</span>
			{changedFileCount !== null && (
				<>
					<span
						className="aa-bottom-status-bar__separator"
						aria-hidden="true"
					/>
					<span className="aa-bottom-status-bar__item">
						<AAIcon name="changes" />
						<strong>{changedFileCount}</strong> CHANGED
					</span>
				</>
			)}
			<span className="aa-bottom-status-bar__spacer" />
			<span className="aa-bottom-status-bar__item aa-bottom-status-bar__kind">
				{workspaceType === "main" ? "MAIN FOLDER" : "WORK FOLDER"}
			</span>
		</footer>
	);
}
