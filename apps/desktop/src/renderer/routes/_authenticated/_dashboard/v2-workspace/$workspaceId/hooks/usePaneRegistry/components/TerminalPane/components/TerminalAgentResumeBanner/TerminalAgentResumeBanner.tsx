import type { RendererContext } from "@superset/panes";
import { toast } from "@superset/ui/sonner";
import { workspaceTrpc } from "@superset/workspace-client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTerminalResumeCandidate } from "renderer/hooks/host-service/useTerminalResumeCandidate";
import type { ConnectionState } from "renderer/lib/terminal/terminal-runtime-registry";
import { terminalRuntimeRegistry } from "renderer/lib/terminal/terminal-runtime-registry";
import {
	AAIcon,
	resolveAAHandoffPanePresentation,
	resolveAAHandoffTaskTitle,
	resolveAAResumeSessionPresentation,
	useAAAgentStatus,
} from "renderer/routes/_authenticated/_dashboard/components/AAOffice";
import type {
	PaneViewerData,
	TerminalPaneData,
} from "renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types";

interface TerminalAgentResumeBannerProps {
	workspaceId: string;
	terminalId: string;
	/** Re-checks the candidate on transport transitions: the host marks the
	 * binding ended during the attach that cold-respawns a lost pty. */
	connectionState: ConnectionState;
	ctx: RendererContext<PaneViewerData>;
}

/**
 * Offers to restore an agent session whose terminal died without the agent's
 * own SessionEnd (killed daemon, laptop reboot, crashed pty). Resuming runs
 * the agent's resume command (e.g. `claude --resume <id>`) in a fresh
 * terminal and re-points this pane at it.
 */
export function TerminalAgentResumeBanner({
	workspaceId,
	terminalId,
	connectionState,
	ctx,
}: TerminalAgentResumeBannerProps) {
	const { candidate, invalidate } = useTerminalResumeCandidate(
		workspaceId,
		terminalId,
	);
	const { runtimeSnapshots } = useAAAgentStatus();
	const [dismissed, setDismissed] = useState(false);

	// The host marks the binding ended during the attach that cold-respawns a
	// lost pty, so every transport transition is a reason to re-check.
	useEffect(() => {
		void connectionState;
		invalidate();
	}, [connectionState, invalidate]);

	const runAgent = workspaceTrpc.agents.run.useMutation();
	// The replaced session is dead (or a respawned empty shell nobody asked
	// for) — drop it silently once the pane points elsewhere.
	const killReplacedSession = workspaceTrpc.terminal.killSession.useMutation({
		onError: (error) => {
			console.warn("Failed to kill replaced terminal session", {
				workspaceId,
				terminalId,
				error,
			});
		},
	});

	const presentation = resolveAAResumeSessionPresentation({
		candidate,
		runtimeSnapshot: runtimeSnapshots.get(terminalId),
	});
	if (!candidate || presentation.availability !== "available" || dismissed)
		return null;

	const handleResume = async () => {
		try {
			const result = await runAgent.mutateAsync({
				workspaceId,
				agent: candidate.agent,
				prompt: "",
				resumeSessionId: candidate.agentSessionId,
			});
			if (result.kind !== "terminal") {
				toast.error("Selected agent isn't a terminal agent");
				return;
			}
			const state = ctx.store.getState();
			const currentData = ctx.pane.data as TerminalPaneData;
			const panePresentation = resolveAAHandoffPanePresentation({
				employeeTitle: result.label,
				taskFolderTitle: resolveAAHandoffTaskTitle({
					paneTitle: ctx.pane.titleOverride,
					taskTitleEdited: currentData.taskTitleEdited,
				}),
			});
			state.setPaneData({
				paneId: ctx.pane.id,
				data: {
					launchIdentity: {
						agentId: candidate.agent,
						label: panePresentation.launchLabel ?? result.label,
					},
					...(panePresentation.taskTitleEdited
						? { taskTitleEdited: true as const }
						: {}),
					terminalId: result.sessionId,
				} satisfies TerminalPaneData,
			});
			state.setPaneTitleOverride({
				tabId: ctx.tab.id,
				paneId: ctx.pane.id,
				titleOverride: panePresentation.titleOverride ?? result.label,
			});
			killReplacedSession.mutate({ workspaceId, terminalId });
			terminalRuntimeRegistry.dispose(terminalId);
		} catch (error) {
			toast.error("Failed to resume agent session", {
				description: error instanceof Error ? error.message : undefined,
			});
		}
	};

	return (
		<output className="aa-resume-session">
			<span className="aa-resume-session__mark" aria-hidden="true">
				<AAIcon name="folder" />
			</span>
			<span className="aa-resume-session__copy">
				<strong>{presentation.contextLabel}</strong>
				<small>
					{candidate.agentLabel.toUpperCase()} INTERRUPTED
					{presentation.endedAt ? (
						<time dateTime={new Date(presentation.endedAt).toISOString()}>
							{" · "}
							{formatResumeTime(presentation.endedAt)}
						</time>
					) : null}
				</small>
			</span>
			<button
				aria-label="Resume exact saved Pi session"
				className="aa-resume-session__action"
				type="button"
				title="Resume the exact saved Pi conversation; runtime identity must be confirmed"
				onClick={() => void handleResume()}
				disabled={runAgent.isPending}
			>
				{runAgent.isPending ? "RESUMING…" : presentation.actionLabel}
			</button>
			<button
				type="button"
				className="aa-resume-session__dismiss"
				aria-label="Dismiss resume prompt"
				onClick={() => setDismissed(true)}
			>
				<X className="size-3.5" />
			</button>
		</output>
	);
}

function formatResumeTime(timestamp: number): string {
	return new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	}).format(timestamp);
}
