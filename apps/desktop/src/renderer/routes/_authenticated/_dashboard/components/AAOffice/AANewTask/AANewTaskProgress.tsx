import { Button } from "@superset/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@superset/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { AAAgentAvatar } from "../AAAgentAvatar";
import { AAStatusLight } from "../AAStatusLight";
import { focusAAActiveWorkstation } from "../aaDailyWorkflowFocus";
import { aaNewTaskFlowStore, useAANewTaskFlow } from "./aaNewTaskFlow";
import type { AANewTaskStage } from "./aaNewTaskFlowStore";

const STAGE_LABELS: Record<AANewTaskStage, string> = {
	editing: "EDITING DISPATCH SHEET",
	validating: "CHECKING DISPATCH SHEET",
	"provisioning-work-folder": "CREATING WORK FOLDER",
	"opening-workspace": "OPENING WORKSPACE",
	"starting-pi": "STARTING PI",
	"connecting-runtime": "CONNECTING WORKSTATION",
	ready: "WORKSTATION READY",
	failed: "ACTION REQUIRED",
};

const PROGRESS_STAGES: readonly AANewTaskStage[] = [
	"validating",
	"provisioning-work-folder",
	"opening-workspace",
	"starting-pi",
	"connecting-runtime",
];

export function AANewTaskProgress() {
	const navigate = useNavigate();
	const activeFlow = useAANewTaskFlow((state) => state.activeFlow);
	const surfaceVisible = useAANewTaskFlow((state) => state.surfaceVisible);
	if (!activeFlow) return null;

	const currentIndex = PROGRESS_STAGES.indexOf(activeFlow.stage);
	const isFailed = activeFlow.stage === "failed";
	const canonicalWorkspaceId =
		activeFlow.canonicalWorkspaceId ?? activeFlow.workspaceId;

	const openWorkspace = () => {
		void navigate({
			to: "/v2-workspace/$workspaceId",
			params: { workspaceId: canonicalWorkspaceId },
		});
		aaNewTaskFlowStore.getState().dismissSurface();
	};

	const editTitle = () => {
		const target = {
			hostId: activeFlow.hostId,
			projectId: activeFlow.projectId,
			projectName: activeFlow.projectName,
		};
		const title = activeFlow.title;
		aaNewTaskFlowStore.getState().abandon();
		aaNewTaskFlowStore.getState().openDialog(target);
		aaNewTaskFlowStore.getState().setDraftTitle(title);
	};

	const checkAgain = () => {
		aaNewTaskFlowStore
			.getState()
			.transition(activeFlow.flowId, "connecting-runtime");
		aaNewTaskFlowStore.getState().showSurface();
	};

	return (
		<Dialog
			open={surfaceVisible}
			onOpenChange={(open) => {
				if (!open) aaNewTaskFlowStore.getState().dismissSurface();
			}}
			modal
		>
			<DialogContent
				className="aa-new-task-dialog aa-new-task-progress max-w-[430px]"
				showCloseButton
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					if (aaNewTaskFlowStore.getState().activeFlow?.stage !== "ready") {
						return;
					}
					if (!focusAAActiveWorkstation()) {
						requestAnimationFrame(() => focusAAActiveWorkstation());
					}
				}}
			>
				<output className="sr-only" aria-live="polite" aria-atomic="true">
					{STAGE_LABELS[activeFlow.stage]}
				</output>
				<DialogHeader className="aa-new-task-dialog__header">
					<div className="aa-new-task-dialog__eyebrow">
						<span>AA OFFICE / DISPATCH CONTROL</span>
						<AAStatusLight tone={isFailed ? "error" : "working"} />
					</div>
					<DialogTitle className="aa-new-task-dialog__title">
						{STAGE_LABELS[activeFlow.stage]}
					</DialogTitle>
					<DialogDescription className="aa-new-task-dialog__description">
						{activeFlow.title}
					</DialogDescription>
				</DialogHeader>

				<div className="aa-new-task-progress__body">
					<div className="aa-new-task-progress__worker">
						<AAAgentAvatar
							state={isFailed ? "error" : "working"}
							className="aa-new-task-progress__avatar"
						/>
						<div>
							<strong>PI WORKER</strong>
							<span>{isFailed ? "NEEDS ATTENTION" : "ASSIGNED"}</span>
						</div>
					</div>

					{isFailed ? (
						<div className="aa-new-task-progress__error" role="alert">
							<strong>
								{activeFlow.failure?.boundary ?? "unknown boundary"}
							</strong>
							<p className="select-text cursor-text">
								{activeFlow.failure?.message ??
									"New Task could not continue at this boundary."}
							</p>
						</div>
					) : (
						<ol
							className="aa-new-task-progress__stages"
							aria-label="New Task progress"
						>
							{PROGRESS_STAGES.map((stage, index) => (
								<li
									key={stage}
									data-state={
										activeFlow.stage === "ready" || index < currentIndex
											? "done"
											: index === currentIndex
												? "current"
												: "pending"
									}
								>
									<span aria-hidden="true" />
									{STAGE_LABELS[stage]}
								</li>
							))}
						</ol>
					)}
				</div>

				<DialogFooter className="aa-new-task-dialog__footer">
					{isFailed &&
						activeFlow.failure?.boundary === "runtime-confirmation" &&
						activeFlow.terminalId && (
							<Button className="aa-new-task-button" onClick={checkAgain}>
								CHECK AGAIN
							</Button>
						)}
					{isFailed &&
						(activeFlow.failure?.boundary === "validation" ||
							activeFlow.failure?.boundary === "pi-configuration" ||
							activeFlow.failure?.boundary === "workspace-provisioning") && (
							<Button className="aa-new-task-button" onClick={editTitle}>
								EDIT DISPATCH SHEET
							</Button>
						)}
					{isFailed && activeFlow.canonicalWorkspaceId && (
						<Button
							variant="outline"
							className="aa-new-task-button aa-new-task-button--secondary"
							onClick={openWorkspace}
						>
							OPEN WORKSPACE
						</Button>
					)}
					<Button
						variant="outline"
						className="aa-new-task-button aa-new-task-button--secondary"
						onClick={() => aaNewTaskFlowStore.getState().dismissSurface()}
					>
						DISMISS
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
