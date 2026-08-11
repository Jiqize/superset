import type {
	AARuntimeModel,
	AARuntimeReasoning,
	AARuntimeSessionSnapshot,
	AARuntimeState,
} from "@superset/session-protocol";
import {
	type AAAgentState,
	mapLifecycleEventToAAState,
} from "../AAAgentStatus/aaAgentState";
import {
	type AARuntimeHealthCode,
	resolveAARuntimeHealth,
} from "../AAAgentStatus/aaRuntimeHealth";
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

interface AAWorkerResumeCandidateLike {
	agentId: string;
	lastEventType?: string;
	resumeSupported: boolean;
}

export type AAWorkerTracking = "tracked" | "untracked" | "unassigned";
export type AAWorkerStatus = AAAgentState | "untracked" | "unassigned";
export type AAWorkerIdentitySource =
	| "runtime"
	| "resume-candidate"
	| "binding"
	| "launch"
	| "pane-title"
	| "local"
	| "none";

export interface AAActiveWorkerPresentation {
	agentId?: string;
	authorityLabel: string;
	displayName: string;
	heading: string;
	healthCode?: AARuntimeHealthCode;
	healthDiagnostic?: string;
	lastEventType?: string;
	model?: AARuntimeModel;
	personaId: AAEmployeePersonaId;
	reasoning?: AARuntimeReasoning;
	resumeLabel?: "AVAILABLE";
	runtimeLabel: string;
	runtimeState?: AARuntimeState;
	source: AAWorkerIdentitySource;
	stateReason?: string;
	status: AAWorkerStatus;
	statusLabel: string;
	tracking: AAWorkerTracking;
	transportLabel: string;
}

interface ResolveAAActiveWorkerPresentationInput {
	binding?: AAWorkerBindingLike;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	resumeCandidate?: AAWorkerResumeCandidateLike;
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
	resumeCandidate,
	terminal,
}: ResolveAAActiveWorkerPresentationInput): AAActiveWorkerPresentation {
	if (!terminal) {
		return {
			authorityLabel: "NO ACTIVE EVIDENCE",
			displayName: "NO ACTIVE",
			heading: "NO ACTIVE WORKER",
			personaId: "generic",
			runtimeLabel: "NONE",
			source: "none",
			status: "unassigned",
			statusLabel: "UNASSIGNED",
			tracking: "unassigned",
			transportLabel: "NONE",
		};
	}

	if (
		runtimeSnapshot &&
		runtimeSnapshot.transport.terminalId === terminal.terminalId
	) {
		// A runtime snapshot describes the last observed session. Once it is
		// offline, only the Host's exact terminal resume candidate is durable
		// evidence that the session can still be resumed. This prevents a clean
		// Pi /quit from retaining the snapshot's capability-level canResume flag.
		const hasExactPiResumeCandidate =
			runtimeSnapshot.runtime === "pi" &&
			resumeCandidate?.agentId === "pi" &&
			resumeCandidate.resumeSupported;
		const canResume =
			runtimeSnapshot.state === "offline"
				? hasExactPiResumeCandidate
				: runtimeSnapshot.resume.canResume;
		const health = resolveAARuntimeHealth({
			state: runtimeSnapshot.state,
			stateReason: runtimeSnapshot.stateReason,
			canResume,
		});
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
			authorityLabel: "RUNTIME VERIFIED",
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			...(model ? { model } : {}),
			healthCode: health.code,
			healthDiagnostic: health.diagnostic,
			personaId: identity.personaId,
			...(reasoning ? { reasoning } : {}),
			...(runtimeSnapshot.runtime === "pi" &&
			runtimeSnapshot.state === "offline" &&
			canResume &&
			runtimeSnapshot.resume.mechanism === "pi_session"
				? { resumeLabel: "AVAILABLE" as const }
				: {}),
			runtimeLabel: runtimeSnapshot.runtime === "grok" ? "GROK BUILD" : "PI",
			runtimeState: runtimeSnapshot.state,
			source: "runtime",
			...(runtimeSnapshot.stateReason
				? { stateReason: runtimeSnapshot.stateReason }
				: {}),
			status: health.avatarState,
			statusLabel: health.label,
			tracking: "tracked",
			transportLabel: runtimeSnapshot.transport.kind.toUpperCase(),
		};
	}

	if (resumeCandidate?.agentId === "pi") {
		const identity = resolveIdentity("pi", "pi");
		const health = resolveAARuntimeHealth({
			state: "offline",
			stateReason: "saved_session_interrupted",
			canResume: resumeCandidate.resumeSupported,
		});
		return {
			agentId: "pi",
			authorityLabel: "SAVED SESSION",
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			healthCode: health.code,
			healthDiagnostic: health.diagnostic,
			lastEventType: resumeCandidate.lastEventType,
			personaId: identity.personaId,
			...(resumeCandidate.resumeSupported
				? { resumeLabel: "AVAILABLE" as const }
				: {}),
			runtimeLabel: "PI",
			source: "resume-candidate",
			status: health.avatarState,
			statusLabel: health.label,
			tracking: "tracked",
			transportLabel: "TERMINAL",
		};
	}

	if (binding) {
		const identity = resolveIdentity(binding.agentId, binding.agentId);
		return {
			agentId: binding.agentId,
			authorityLabel: "LIFECYCLE BINDING",
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			lastEventType: binding.lastEventType,
			personaId: identity.personaId,
			runtimeLabel: identity.personaId === "pi" ? "PI" : "COMPATIBILITY CLI",
			source: "binding",
			status: mapLifecycleEventToAAState(binding.lastEventType),
			statusLabel: mapLifecycleEventToAAState(
				binding.lastEventType,
			).toUpperCase(),
			tracking: "tracked",
			transportLabel: "TERMINAL",
		};
	}

	if (terminal.launchIdentity) {
		const identity = resolveIdentity(
			terminal.launchIdentity.agentId,
			terminal.launchIdentity.label,
		);
		return {
			agentId: terminal.launchIdentity.agentId,
			authorityLabel: "UNTRACKED",
			displayName: identity.displayName,
			heading: `${identity.displayName} WORKER`,
			personaId: identity.personaId,
			runtimeLabel: "COMPATIBILITY CLI",
			source: "launch",
			status: "untracked",
			statusLabel: "UNTRACKED",
			tracking: "untracked",
			transportLabel: "TERMINAL PRESET",
		};
	}

	if (!terminal.taskTitleEdited && terminal.paneTitle) {
		const identity = resolveIdentity(undefined, terminal.paneTitle);
		if (identity.personaId !== "generic") {
			return {
				authorityLabel: "UNTRACKED",
				displayName: identity.displayName,
				heading: `${identity.displayName} WORKER`,
				personaId: identity.personaId,
				runtimeLabel: "COMPATIBILITY CLI",
				source: "pane-title",
				status: "untracked",
				statusLabel: "UNTRACKED",
				tracking: "untracked",
				transportLabel: "TERMINAL PRESET",
			};
		}
	}

	return {
		authorityLabel: "UNASSIGNED",
		displayName: "LOCAL",
		heading: "LOCAL WORKER",
		personaId: "generic",
		runtimeLabel: "LOCAL SHELL",
		source: "local",
		status: "unassigned",
		statusLabel: "UNASSIGNED",
		tracking: "unassigned",
		transportLabel: "TERMINAL",
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
