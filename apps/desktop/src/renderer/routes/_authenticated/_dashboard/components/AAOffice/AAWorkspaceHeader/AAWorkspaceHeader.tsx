import { AAAgentStatus } from "../AAAgentStatus";
import { AAIcon } from "../AAIcon";

interface AAWorkspaceHeaderProps {
	branch: string;
	projectName?: string;
	workspaceName: string;
	workspaceType: "main" | "worktree";
}

export function AAWorkspaceHeader({
	branch,
	projectName,
	workspaceName,
	workspaceType,
}: AAWorkspaceHeaderProps) {
	return (
		<header className="aa-workspace-header">
			<div className="aa-workspace-header__brand">
				<span className="aa-workspace-header__monogram">AA</span>
				<span className="aa-workspace-header__brand-copy">
					<strong>OFFICE SYSTEM</strong>
					<small>TERMINAL FLOOR 01</small>
				</span>
			</div>

			<div className="aa-workspace-header__identity">
				<div className="aa-identity-block aa-identity-block--project">
					<span className="aa-identity-block__icon">
						<AAIcon name="briefcase" />
					</span>
					<span className="aa-identity-block__copy">
						<small>BRIEFCASE</small>
						<strong>{projectName ?? "—"}</strong>
					</span>
				</div>
				<span aria-hidden="true" className="aa-workspace-header__divider">
					/
				</span>
				<div className="aa-identity-block aa-identity-block--workspace">
					<span className="aa-identity-block__icon">
						<AAIcon name="folder" />
					</span>
					<span className="aa-identity-block__copy">
						<small>
							{workspaceType === "main" ? "MAIN FOLDER" : "WORK FOLDER"}
						</small>
						<strong>{workspaceName || branch}</strong>
					</span>
				</div>
			</div>

			<AAAgentStatus />
		</header>
	);
}
