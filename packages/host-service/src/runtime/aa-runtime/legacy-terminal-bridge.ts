import type { AARuntimeEventEnvelope } from "@superset/session-protocol";
import type { AgentLifecycleEventType, EventBus } from "../../events";
import type { TerminalAgentStore } from "../../terminal-agents";
import type { AARuntimeRegistryChange } from "./registry";

export interface LegacyTerminalBridgeDependencies {
	eventBus: EventBus;
	terminalAgentStore: TerminalAgentStore;
}

/**
 * Keeps existing terminal-agent bindings and notifications operational while
 * Pi presentation migrates to the authoritative runtime registry. Structured
 * tool events deliberately never settle the legacy working state.
 */
export function syncPiRuntimeChangeToLegacy(
	change: AARuntimeRegistryChange,
	dependencies: LegacyTerminalBridgeDependencies,
): void {
	const { event, snapshot } = change;
	if (!event || event.runtime !== "pi") return;
	const terminalId = snapshot.transport.terminalId;
	const agentSessionId = snapshot.nativeSessionId;
	if (!terminalId || !agentSessionId) return;

	const eventType = legacyEventTypeForRuntimeEvent(event);
	if (!eventType) return;

	dependencies.terminalAgentStore.recordEvent({
		terminalId,
		workspaceId: snapshot.workspaceId,
		eventType,
		agentId: "pi",
		agentSessionId,
		occurredAt: event.occurredAt,
	});
	dependencies.eventBus.broadcastAgentLifecycle({
		workspaceId: snapshot.workspaceId,
		eventType,
		terminalId,
		agent: { agentId: "pi", sessionId: agentSessionId },
		occurredAt: event.occurredAt,
	});
}

function legacyEventTypeForRuntimeEvent(
	event: AARuntimeEventEnvelope,
): AgentLifecycleEventType | null {
	switch (event.kind) {
		case "snapshot":
			return "Attached";
		case "turn.started":
			return "Start";
		case "turn.settled":
			return "Stop";
		case "permission.requested":
			return "PermissionRequest";
		case "permission.resolved":
			return "Start";
		case "runtime.error":
			return "Failed";
		case "session.ended":
			return "Detached";
		case "session.started":
		case "session.offline":
		case "tool.started":
		case "tool.progress":
		case "tool.finished":
		case "user_input.requested":
		case "user_input.resolved":
		case "model.changed":
		case "reasoning.changed":
		case "message.delta":
		case "cancel.requested":
		case "cancel.settled":
			return null;
	}
}
