import type {
	AARuntimeModel,
	AARuntimeReasoning,
	AARuntimeSessionSnapshot,
	AARuntimeState,
} from "@superset/session-protocol";
import {
	type AAAgentState,
	mapAARuntimeStateToAAState,
	mapLifecycleEventToAAState,
} from "../AAAgentStatus/aaAgentState";
import {
	type AAEmployeePersonaId,
	resolveAAEmployeePersona,
} from "../AAEmployeeAvatar/aaEmployeePersonas";

export interface AAWorkerLaunchIdentity {
	agentId?: string;
	label: string;
}

export interface AAActiveTerminalPresentationInput {
	launchIdentity?: AAWorkerLaunchIdentity;
	paneTitle?: string;
	taskTitleEdited?: boolean;
	terminalId: string;
}

interface AAWorkerBindingLike {
	agentId: string;
	lastEventType: string;
}

export type AAWorkerTracking = "tracked" | "untracked" | "unassigned";
export type AAWorkerStatus = AAAgentState | "untracked" | "unassigned";
export type AAWorkerIdentitySource =
	| "runtime"
	| "binding"
	| "launch"
	| "pane-title"
	| "local"
	| "none";

export interface AAActiveWorkerPresentation {
	agentId?: string;
	displayName: string;
	heading: string;
	lastEventType?: string;
	model?: AARuntimeModel;
	personaId: AAEmployeePersonaId;
	reasoning?: AARuntimeReasoning;
	runtimeState?: AARuntimeState;
	source: AAWorkerIdentitySource;
	stateReason?: string;
	status: AAWorkerStatus;
	statusLabel: string;
	tracking: AAWorkerTracking;
}

interface ResolveAAActiveWorkerPresentationInput {
	binding?: AAWorkerBindingLike;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	terminal?: AAActiveTerminalPresentationInput | null;
}

const PERSONA_LABELS: Record<
	Exclude<AAEmployeePersonaId, "generic">,
	string
> = {
	claude: "CLAUDE",
	codex: "CODEX",
	copilot: "COPILOT",
	grok: "GROK",
	kimi: "KIMI",
	mistral: "MISTRAL VIBE",
	opencode: "OPENCODE",
	pi: "PI",
	superset: "SUPERSET CLI",
};

export function resolveAAActiveWorkerPresentation({
	binding,
	runtimeSnapshot,
	terminal,
}: ResolveAAActiveWorkerPresentationInput): AAActiveWorkerPresentation {
	if (!terminal) {
		return {
			displayName: "NO ACTIVE",
			heading: "NO ACTIVE WORKER",
			personaId: "generic",
			source: "none",
			status: "unassigned",
			statusLabel: "UNASSIGNED",
			tracking: "unassigned",
		};
	}

	if (
		runtimeSnapshot &&
		runtimeSnapshot.transport.terminalId === terminal.terminalId
	) {
		const identity = resolveIdentity(
			runtimeSnapshot.agentId,
			runtimeSnapshot.agentId,
		);
		const model =
			runtimeSnapshot.capabilities.modelRead.support === "available" &&
			runtimeSnapshot.model
				? runtimeSnapshot.model
				: undefined;
		const reasoning =
			runtimeSnapshot.capabilities.reasoningRead.support === "available" &&
			runtimeSnapshot.reasoning
				? runtimeSnapshot.reasoning
				: undefined;
		return {
			agentId: runtimeSnapshot.agentId,
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			...(model ? { model } : {}),
			personaId: identity.personaId,
			...(reasoning ? { reasoning } : {}),
			runtimeState: runtimeSnapshot.state,
			source: "runtime",
			...(runtimeSnapshot.stateReason
				? { stateReason: runtimeSnapshot.stateReason }
				: {}),
			status: mapAARuntimeStateToAAState(runtimeSnapshot.state),
			statusLabel: formatRuntimeState(runtimeSnapshot.state),
			tracking: "tracked",
		};
	}

	if (binding) {
		const identity = resolveIdentity(binding.agentId, binding.agentId);
		return {
			agentId: binding.agentId,
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			lastEventType: binding.lastEventType,
			personaId: identity.personaId,
			source: "binding",
			status: mapLifecycleEventToAAState(binding.lastEventType),
			statusLabel: mapLifecycleEventToAAState(
				binding.lastEventType,
			).toUpperCase(),
			tracking: "tracked",
		};
	}

	if (terminal.launchIdentity) {
		const identity = resolveIdentity(
			terminal.launchIdentity.agentId,
			terminal.launchIdentity.label,
		);
		return {
			agentId: terminal.launchIdentity.agentId,
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			personaId: identity.personaId,
			source: "launch",
			status: "untracked",
			statusLabel: "UNTRACKED",
			tracking: "untracked",
		};
	}

	if (!terminal.taskTitleEdited && terminal.paneTitle) {
		const identity = resolveIdentity(undefined, terminal.paneTitle);
		if (identity.personaId !== "generic") {
			return {
				displayName: identity.displayName,
				heading: `${identity.displayName} WORKER`,
				personaId: identity.personaId,
				source: "pane-title",
				status: "untracked",
				statusLabel: "UNTRACKED",
				tracking: "untracked",
			};
		}
	}

	return {
		displayName: "LOCAL",
		heading: "LOCAL WORKER",
		personaId: "generic",
		source: "local",
		status: "unassigned",
		statusLabel: "UNASSIGNED",
		tracking: "unassigned",
	};
}

function formatRuntimeState(state: AARuntimeState): string {
	return state.replaceAll("_", " ").toUpperCase();
}

function resolveIdentity(
	agentId: string | undefined,
	label: string,
): { displayName: string; personaId: AAEmployeePersonaId } {
	const persona = resolveAAEmployeePersona({ agentId, name: label });
	const knownLabel =
		persona.id === "generic" ? undefined : PERSONA_LABELS[persona.id];
	return {
		displayName: knownLabel ?? normalizeWorkerLabel(label || agentId),
		personaId: persona.id,
	};
}

function normalizeWorkerLabel(value: string | undefined): string {
	const normalized = value
		?.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toUpperCase();
	if (!normalized) return "EMPLOYEE";
	const characters = Array.from(normalized);
	return characters.length <= 20
		? normalized
		: `${characters.slice(0, 19).join("")}…`;
}
