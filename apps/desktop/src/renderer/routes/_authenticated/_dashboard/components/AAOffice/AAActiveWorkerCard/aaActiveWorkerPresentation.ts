import {
	type AAAgentState,
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
	personaId: AAEmployeePersonaId;
	source: AAWorkerIdentitySource;
	status: AAWorkerStatus;
	tracking: AAWorkerTracking;
}

interface ResolveAAActiveWorkerPresentationInput {
	binding?: AAWorkerBindingLike;
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
	terminal,
}: ResolveAAActiveWorkerPresentationInput): AAActiveWorkerPresentation {
	if (!terminal) {
		return {
			displayName: "NO ACTIVE",
			heading: "NO ACTIVE WORKER",
			personaId: "generic",
			source: "none",
			status: "unassigned",
			tracking: "unassigned",
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
		tracking: "unassigned",
	};
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
