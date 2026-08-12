import { Button } from "@superset/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@superset/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@superset/ui/dialog";
import { Input } from "@superset/ui/input";
import { Label } from "@superset/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { useHostUrl } from "renderer/hooks/host-service/useHostTargetUrl";
import { useV2AgentConfigs } from "renderer/hooks/useV2AgentConfigs";
import { useV2WorkspaceCreateDefaultsStore } from "renderer/stores/v2-workspace-create-defaults";
import { useWorkspaceCreates } from "renderer/stores/workspace-creates";
import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAIcon } from "../AAIcon";
import { AAStatusLight } from "../AAStatusLight";
import { AANewTaskBranchPicker } from "./AANewTaskBranchPicker";
import { AANewTaskProgress } from "./AANewTaskProgress";
import { aaNewTaskFlowStore, useAANewTaskFlow } from "./aaNewTaskFlow";
import {
	buildAANewTaskBranch,
	buildAANewTaskCreateSnapshot,
	selectAANewTaskPiConfig,
	validateAANewTaskTitle,
} from "./aaNewTaskPresentation";

export function AANewTaskDialog() {
	const navigate = useNavigate();
	const { submit } = useWorkspaceCreates();
	const dialogTarget = useAANewTaskFlow((state) => state.dialogTarget);
	const draftTitle = useAANewTaskFlow((state) => state.draftTitle);
	const hostUrl = useHostUrl(dialogTarget?.hostId);
	const configsQuery = useV2AgentConfigs(hostUrl);
	const piConfig = selectAANewTaskPiConfig(configsQuery.data ?? []);
	const persistedBaseBranch = useV2WorkspaceCreateDefaultsStore((state) =>
		dialogTarget
			? (state.baseBranchesByProjectId[dialogTarget.projectId] ?? null)
			: null,
	);
	const setBaseBranchDefault = useV2WorkspaceCreateDefaultsStore(
		(state) => state.setBaseBranchDefault,
	);
	const clearBaseBranchDefault = useV2WorkspaceCreateDefaultsStore(
		(state) => state.clearBaseBranchDefault,
	);
	const setLastHostId = useV2WorkspaceCreateDefaultsStore(
		(state) => state.setLastHostId,
	);
	const [baseBranch, setBaseBranch] = useState<string | null>(null);
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const titleRef = useRef<HTMLInputElement | null>(null);
	const returnFocusRef = useRef<HTMLElement | null>(null);
	const restoreFocusOnCloseRef = useRef(true);
	const composingRef = useRef(false);

	useEffect(() => {
		if (!dialogTarget) return;
		const triggerLabel = `New task in ${dialogTarget.projectName}`;
		restoreFocusOnCloseRef.current = true;
		returnFocusRef.current =
			Array.from(document.querySelectorAll<HTMLElement>("[aria-label]")).find(
				(element) => element.getAttribute("aria-label") === triggerLabel,
			) ?? null;
		setBaseBranch(persistedBaseBranch?.branchName ?? null);
		setOptionsOpen(false);
		setValidationError(null);
	}, [dialogTarget, persistedBaseBranch?.branchName]);

	const closeDialog = () => {
		aaNewTaskFlowStore.getState().closeDialog();
	};

	const openAgentSettings = () => {
		closeDialog();
		void navigate({ to: "/settings/agents" });
	};

	const startWork = async () => {
		if (!dialogTarget) return;
		const titleResult = validateAANewTaskTitle(draftTitle);
		if (!titleResult.ok) {
			setValidationError(titleResult.error);
			titleRef.current?.focus();
			return;
		}
		if (!piConfig) {
			setValidationError(
				"Pi setup is required on this Host. Open Agent settings before starting work.",
			);
			return;
		}

		setValidationError(null);
		const workspaceId = crypto.randomUUID();
		const snapshot = buildAANewTaskCreateSnapshot({
			workspaceId,
			projectId: dialogTarget.projectId,
			title: titleResult.title,
			piConfigId: piConfig.id,
			...(baseBranch ? { baseBranch } : {}),
		});
		const branch =
			snapshot.branch ?? buildAANewTaskBranch(titleResult.title, workspaceId);
		const flowId = workspaceId;
		restoreFocusOnCloseRef.current = false;
		aaNewTaskFlowStore.getState().beginFlow({
			flowId,
			workspaceId,
			projectId: dialogTarget.projectId,
			projectName: dialogTarget.projectName,
			hostId: dialogTarget.hostId,
			title: titleResult.title,
			branch,
			piConfigId: piConfig.id,
			...(baseBranch ? { baseBranch } : {}),
		});
		aaNewTaskFlowStore
			.getState()
			.transition(flowId, "provisioning-work-folder");
		setLastHostId(dialogTarget.hostId);

		const { completed } = submit({
			hostId: dialogTarget.hostId,
			snapshot,
			initialAgentPresentation: {
				agentId: piConfig.id,
				agentResultIndex: 0,
				title: titleResult.title,
			},
		});

		const outcome = await completed;
		if (!outcome.ok) {
			aaNewTaskFlowStore.getState().fail(flowId, {
				boundary: "workspace-provisioning",
				message: outcome.error,
			});
			return;
		}

		const canonicalWorkspaceId = outcome.workspaceId;
		const piResult = outcome.result.agents[0];
		const terminalId =
			piResult?.ok && piResult.kind === "terminal"
				? piResult.sessionId
				: undefined;
		aaNewTaskFlowStore.getState().transition(flowId, "opening-workspace", {
			canonicalWorkspaceId,
			...(terminalId ? { terminalId } : {}),
		});

		try {
			await navigate({
				to: "/v2-workspace/$workspaceId",
				params: { workspaceId: canonicalWorkspaceId },
			});
		} catch (error) {
			aaNewTaskFlowStore.getState().fail(flowId, {
				boundary: "workspace-navigation",
				message: `The work folder was created, but AA Office could not open it: ${error instanceof Error ? error.message : String(error)}`,
			});
			return;
		}

		if (!piResult?.ok || piResult.kind !== "terminal") {
			const reason =
				piResult && !piResult.ok
					? piResult.error
					: "The Host did not return a Pi terminal session.";
			aaNewTaskFlowStore.getState().fail(flowId, {
				boundary: "terminal-launch",
				message: `The work folder was created and kept, but Pi did not launch: ${reason}`,
			});
			return;
		}

		aaNewTaskFlowStore.getState().transition(flowId, "starting-pi");
	};

	const piUnavailable =
		configsQuery.isFetched && !configsQuery.isFetching && !piConfig;

	return (
		<>
			<Dialog
				open={Boolean(dialogTarget)}
				onOpenChange={(open) => {
					if (!open) closeDialog();
				}}
				modal
			>
				<DialogContent
					className="aa-new-task-dialog max-w-[520px]"
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						titleRef.current?.focus();
					}}
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						if (restoreFocusOnCloseRef.current) {
							returnFocusRef.current?.focus();
						}
					}}
				>
					<DialogHeader className="aa-new-task-dialog__header">
						<div className="aa-new-task-dialog__eyebrow">
							<span>AA OFFICE / NEW DISPATCH</span>
							<AAStatusLight tone="idle" />
						</div>
						<DialogTitle className="aa-new-task-dialog__title">
							NEW TASK
						</DialogTitle>
						<DialogDescription className="aa-new-task-dialog__description">
							Create an independent work folder and send its first assignment to
							Pi.
						</DialogDescription>
					</DialogHeader>

					<form
						className="aa-new-task-form"
						onSubmit={(event) => {
							event.preventDefault();
							if (composingRef.current) return;
							void startWork();
						}}
					>
						<div className="aa-new-task-project-strip">
							<span className="aa-new-task-project-strip__mark">
								<AAIcon name="briefcase" />
							</span>
							<div>
								<span>BRIEFCASE</span>
								<strong>{dialogTarget?.projectName ?? "—"}</strong>
							</div>
						</div>

						<div className="aa-new-task-field">
							<Label htmlFor="aa-new-task-title" className="aa-new-task-label">
								TASK TITLE
							</Label>
							<Input
								ref={titleRef}
								id="aa-new-task-title"
								value={draftTitle}
								onChange={(event) => {
									aaNewTaskFlowStore
										.getState()
										.setDraftTitle(event.target.value);
									if (validationError) setValidationError(null);
								}}
								onCompositionStart={() => {
									composingRef.current = true;
								}}
								onCompositionEnd={() => {
									composingRef.current = false;
								}}
								onKeyDown={(event) => {
									if (event.key !== "Enter") return;
									if (event.nativeEvent.isComposing || composingRef.current)
										return;
									event.preventDefault();
									event.currentTarget.form?.requestSubmit();
								}}
								placeholder="What should Pi work on?"
								maxLength={256}
								aria-describedby={
									validationError ? "aa-new-task-error" : undefined
								}
								aria-invalid={Boolean(validationError)}
								className="aa-new-task-title-input"
							/>
							<span className="aa-new-task-field__hint">
								Enter starts work. The normalized title becomes Pi&apos;s
								initial prompt.
							</span>
						</div>

						<div className="aa-new-task-employee">
							<AAEmployeeAvatar agentId="pi" label="Pi" />
							<div>
								<span>ASSIGNED EMPLOYEE</span>
								<strong>PI</strong>
								<small>
									{configsQuery.isFetching
										? "CHECKING HOST CONFIGURATION…"
										: piConfig
											? piConfig.label
											: "NOT CONFIGURED"}
								</small>
							</div>
							<AAStatusLight tone={piConfig ? "success" : "offline"} />
						</div>

						<div className="aa-new-task-work-folder">
							<AAIcon name="folder" />
							<div>
								<span>WORK LOCATION</span>
								<strong>NEW WORK FOLDER</strong>
								<small>Independent Git worktree · new Pi conversation</small>
							</div>
						</div>

						<Collapsible open={optionsOpen} onOpenChange={setOptionsOpen}>
							<CollapsibleTrigger asChild>
								<button type="button" className="aa-new-task-options-trigger">
									<span>WORK OPTIONS</span>
									<small>
										{baseBranch ? `BASE: ${baseBranch}` : "HOST DEFAULTS"}
									</small>
									<HiChevronDown aria-hidden="true" />
								</button>
							</CollapsibleTrigger>
							<CollapsibleContent className="aa-new-task-options-content">
								{dialogTarget && (
									<AANewTaskBranchPicker
										hostId={dialogTarget.hostId}
										projectId={dialogTarget.projectId}
										value={baseBranch}
										onChange={(branch, source) => {
											setBaseBranch(branch);
											if (branch && source) {
												setBaseBranchDefault(
													dialogTarget.projectId,
													branch,
													source,
												);
											} else {
												clearBaseBranchDefault(dialogTarget.projectId);
											}
										}}
									/>
								)}
							</CollapsibleContent>
						</Collapsible>

						{(validationError || configsQuery.isError || piUnavailable) && (
							<div
								id="aa-new-task-error"
								className="aa-new-task-form__error select-text cursor-text"
								role="alert"
							>
								{validationError ??
									(configsQuery.isError
										? "AA Office could not read the Host agent configuration."
										: "PI · SETUP REQUIRED. Open Agent settings before starting work.")}
								{piUnavailable && (
									<button type="button" onClick={openAgentSettings}>
										OPEN AGENT SETTINGS
									</button>
								)}
							</div>
						)}

						<DialogFooter className="aa-new-task-dialog__footer">
							<Button
								type="button"
								variant="outline"
								className="aa-new-task-button aa-new-task-button--secondary"
								onClick={closeDialog}
							>
								CANCEL
							</Button>
							<Button
								type="submit"
								className="aa-new-task-button"
								disabled={
									!hostUrl ||
									configsQuery.isFetching ||
									configsQuery.isError ||
									!piConfig
								}
							>
								START WORK
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<AANewTaskProgress />
		</>
	);
}
