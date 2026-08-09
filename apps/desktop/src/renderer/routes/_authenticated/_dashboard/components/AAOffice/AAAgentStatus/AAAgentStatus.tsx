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
	mapLifecycleEventToAAState,
	selectLatestPiBinding,
} from "./aaAgentState";

interface AAAgentStatusValue {
	binding?: TerminalAgentBinding;
	bindings: Map<string, TerminalAgentBinding>;
	state: AAAgentState;
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
	const value = useMemo<AAAgentStatusValue>(() => {
		const binding = selectLatestPiBinding(bindings.values());
		return {
			binding,
			bindings,
			state: mapLifecycleEventToAAState(binding?.lastEventType),
		};
	}, [bindings]);

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
	const { binding, state } = useAAAgentStatus();
	const label = state.toUpperCase();
	const tone = toneForState(state);

	return (
		<div
			className={cn(
				"aa-agent-status",
				compact && "aa-agent-status--compact",
				className,
			)}
			data-state={state}
			title={
				binding
					? `Pi lifecycle: ${binding.lastEventType}`
					: "No active Pi terminal session"
			}
		>
			{!compact && (
				<span className="aa-agent-status__portrait">
					<AAAgentAvatar state={state} />
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
					{label}
				</span>
			</div>
		</div>
	);
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
