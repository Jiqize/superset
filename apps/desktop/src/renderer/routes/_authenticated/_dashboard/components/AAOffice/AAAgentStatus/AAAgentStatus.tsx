import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { cn } from "@superset/ui/utils";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
	type TerminalAgentBinding,
	useTerminalAgentBindings,
} from "renderer/hooks/host-service/useTerminalAgentBindings";
import { AAAgentAvatar } from "../AAAgentAvatar";
import { AAStatusLight, type AAStatusTone } from "../AAStatusLight";
import {
	type AAAgentState,
	mapAARuntimeStateToAAState,
	mapLifecycleEventToAAState,
	selectLatestPiBinding,
} from "./aaAgentState";
import { useAARuntimeSnapshots } from "./useAARuntimeSnapshots";

interface AAAgentStatusValue {
	binding?: TerminalAgentBinding;
	bindings: Map<string, TerminalAgentBinding>;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	runtimeSnapshots: Map<string, AARuntimeSessionSnapshot>;
	state: AAAgentState;
	statusLabel: string;
}

const AAAgentStatusContext = createContext<AAAgentStatusValue | null>(null);

export function AAAgentStatusProvider({
	children,
	workspaceId,
}: {
	children: ReactNode;
	workspaceId: string;
}) {
	const bindings = useTerminalAgentBindings(workspaceId);
	const runtimeSnapshots = useAARuntimeSnapshots(workspaceId);
	const value = useMemo<AAAgentStatusValue>(() => {
		const binding = selectLatestPiBinding(bindings.values());
		const runtimeSnapshot = selectLatestPiRuntimeSnapshot(
			runtimeSnapshots.values(),
		);
		return {
			binding,
			bindings,
			runtimeSnapshot,
			runtimeSnapshots,
			state: runtimeSnapshot
				? mapAARuntimeStateToAAState(runtimeSnapshot.state)
				: mapLifecycleEventToAAState(binding?.lastEventType),
			statusLabel: runtimeSnapshot
				? runtimeSnapshot.state.replaceAll("_", " ").toUpperCase()
				: mapLifecycleEventToAAState(binding?.lastEventType).toUpperCase(),
		};
	}, [bindings, runtimeSnapshots]);

	return (
		<AAAgentStatusContext.Provider value={value}>
			{children}
		</AAAgentStatusContext.Provider>
	);
}

export function useAAAgentStatus(): AAAgentStatusValue {
	const value = useContext(AAAgentStatusContext);
	if (!value) {
		throw new Error(
			"useAAAgentStatus must be used inside AAAgentStatusProvider",
		);
	}
	return value;
}

interface AAAgentStatusProps {
	className?: string;
	compact?: boolean;
}

export function AAAgentStatus({
	className,
	compact = false,
}: AAAgentStatusProps) {
	const { binding, runtimeSnapshot, state, statusLabel } = useAAAgentStatus();
	const tone = toneForState(state);
	const reasoning =
		runtimeSnapshot?.capabilities.reasoningRead.support === "available"
			? runtimeSnapshot.reasoning
			: null;

	return (
		<div
			className={cn(
				"aa-agent-status",
				compact && "aa-agent-status--compact",
				className,
			)}
			data-state={state}
			title={
				runtimeSnapshot
					? `Pi runtime: ${runtimeSnapshot.state}${runtimeSnapshot.stateReason ? ` (${runtimeSnapshot.stateReason})` : ""}`
					: binding
						? `Pi lifecycle: ${binding.lastEventType}`
						: "No active Pi terminal session"
			}
		>
			{!compact && (
				<span className="aa-agent-status__portrait">
					<AAAgentAvatar reasoningLevel={reasoning?.value} state={state} />
				</span>
			)}
			<div className="aa-agent-status__copy">
				{!compact && (
					<span className="aa-agent-status__eyebrow">
						PI WORKER
						<AAStatusLight className="aa-agent-status__light" tone={tone} />
					</span>
				)}
				<span className="aa-agent-status__state">
					{compact && <AAStatusLight tone={tone} />}
					{statusLabel}
				</span>
			</div>
		</div>
	);
}

function selectLatestPiRuntimeSnapshot(
	snapshots: Iterable<AARuntimeSessionSnapshot>,
): AARuntimeSessionSnapshot | undefined {
	let latest: AARuntimeSessionSnapshot | undefined;
	for (const snapshot of snapshots) {
		if (snapshot.runtime !== "pi") continue;
		if (!latest || snapshot.observedAt > latest.observedAt) latest = snapshot;
	}
	return latest;
}

function toneForState(state: AAAgentState): AAStatusTone {
	switch (state) {
		case "working":
		case "thinking":
			return "working";
		case "waiting":
			return "attention";
		case "error":
			return "error";
		case "idle":
			return "success";
		case "offline":
			return "offline";
	}
}
