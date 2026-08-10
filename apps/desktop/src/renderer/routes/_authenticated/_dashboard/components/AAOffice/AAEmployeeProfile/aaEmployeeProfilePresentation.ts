import type {
	AACapability,
	AACapabilitySupport,
	AARuntimeSessionSnapshot,
} from "@superset/session-protocol";
import type { AAAgentState } from "../AAAgentStatus/aaAgentState";
import { resolveAARuntimeHealth } from "../AAAgentStatus/aaRuntimeHealth";
import {
	type AAEmployeePersonaId,
	resolveAAEmployeePersona,
} from "../AAEmployeeAvatar/aaEmployeePersonas";

export interface AAEmployeeCapabilityPresentation {
	label: string;
	reason: string | null;
	support: AACapabilitySupport;
}

export interface AAEmployeeProfilePresentation {
	authority: "authoritative" | "saved" | "unavailable" | "untracked";
	authorityLabel: string;
	avatarState: AAAgentState;
	capabilities: AAEmployeeCapabilityPresentation[];
	employeeName: string;
	model?: {
		id: string;
		label: string;
		provider: string | null;
	};
	notice?: string;
	personaId: AAEmployeePersonaId;
	reasoning?: {
		availableValues: readonly string[] | null;
		value: string;
	};
	resumeLabel?: "AVAILABLE";
	runtimeLabel: string;
	statusLabel: string;
	transportLabel: string;
}

const PERSONA_LABELS: Partial<Record<AAEmployeePersonaId, string>> = {
	claude: "CLAUDE",
	codex: "CODEX",
	copilot: "COPILOT",
	grok: "GROK BUILD",
	kimi: "KIMI",
	mistral: "MISTRAL VIBE",
	opencode: "OPENCODE",
	pi: "PI",
	superset: "SUPERSET CLI",
};

const PROFILE_CAPABILITIES: ReadonlyArray<{
	key:
		| "lifecycle"
		| "toolLifecycle"
		| "modelRead"
		| "reasoningRead"
		| "resume"
		| "permissionRequests"
		| "userQuestions"
		| "cancellation";
	label: string;
}> = [
	{ key: "lifecycle", label: "LIFECYCLE" },
	{ key: "toolLifecycle", label: "TOOLS" },
	{ key: "modelRead", label: "MODEL READ" },
	{ key: "reasoningRead", label: "REASONING READ" },
	{ key: "resume", label: "RESUME" },
	{ key: "permissionRequests", label: "PERMISSIONS" },
	{ key: "userQuestions", label: "USER QUESTIONS" },
	{ key: "cancellation", label: "CANCELLATION" },
];

export function selectAAEmployeeRuntimeSnapshot(
	snapshots: readonly AARuntimeSessionSnapshot[],
	employee: { agentId?: string | null; name: string },
): AARuntimeSessionSnapshot | undefined {
	const persona = resolveAAEmployeePersona(employee);
	const runtime =
		persona.id === "pi" ? "pi" : persona.id === "grok" ? "grok" : null;
	if (!runtime) return undefined;

	let latest: AARuntimeSessionSnapshot | undefined;
	for (const snapshot of snapshots) {
		if (snapshot.runtime !== runtime) continue;
		if (!latest || snapshot.observedAt > latest.observedAt) latest = snapshot;
	}
	return latest;
}

export function resolveAAEmployeeProfilePresentation({
	agentId,
	name,
	resumeAvailable = false,
	runtimeSnapshot,
}: {
	agentId?: string | null;
	name: string;
	resumeAvailable?: boolean;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
}): AAEmployeeProfilePresentation {
	const persona = resolveAAEmployeePersona({ agentId, name });
	if (!runtimeSnapshot) {
		if (persona.id === "pi" && resumeAvailable) {
			return {
				authority: "saved",
				authorityLabel: "SAVED SESSION",
				avatarState: "offline",
				capabilities: [],
				employeeName: "PI",
				notice: "Live runtime details return after exact resume.",
				personaId: "pi",
				resumeLabel: "AVAILABLE",
				runtimeLabel: "PI",
				statusLabel: "OFFLINE / RESUMABLE",
				transportLabel: "TERMINAL",
			};
		}
		if (persona.id === "pi" || persona.id === "grok") {
			const isGrok = persona.id === "grok";
			return {
				authority: "unavailable",
				authorityLabel: "NO LIVE RUNTIME",
				avatarState: "offline",
				capabilities: [],
				employeeName: PERSONA_LABELS[persona.id] ?? "EMPLOYEE",
				notice: isGrok
					? "Capabilities unavailable without a verified Grok runtime session."
					: "Runtime details appear when a verified Pi session is active.",
				personaId: persona.id,
				runtimeLabel: isGrok ? "GROK BUILD" : "PI",
				statusLabel: "NOT CONNECTED",
				transportLabel: isGrok ? "ACP" : "TERMINAL",
			};
		}
		return {
			authority: "untracked",
			authorityLabel: "UNTRACKED",
			avatarState: "offline",
			capabilities: [],
			employeeName:
				PERSONA_LABELS[persona.id] ?? normalizeEmployeeName(name || agentId),
			notice: "Runtime capabilities are not tracked for this employee.",
			personaId: persona.id,
			runtimeLabel: "COMPATIBILITY CLI",
			statusLabel: "UNTRACKED",
			transportLabel: "TERMINAL PRESET",
		};
	}
	const health = resolveAARuntimeHealth({
		state: runtimeSnapshot.state,
		stateReason: runtimeSnapshot.stateReason,
		canResume: runtimeSnapshot.resume.canResume,
	});
	const authenticationRequired =
		runtimeSnapshot.runtime === "grok" &&
		runtimeSnapshot.stateReason === "authentication_required";
	const model =
		runtimeSnapshot.capabilities.modelRead.support === "available" &&
		runtimeSnapshot.model
			? {
					id: runtimeSnapshot.model.id,
					label: runtimeSnapshot.model.displayName ?? runtimeSnapshot.model.id,
					provider: runtimeSnapshot.model.provider,
				}
			: undefined;
	const reasoning =
		runtimeSnapshot.capabilities.reasoningRead.support === "available" &&
		runtimeSnapshot.reasoning
			? {
					availableValues: runtimeSnapshot.reasoning.availableValues,
					value: runtimeSnapshot.reasoning.value,
				}
			: undefined;

	return {
		authority: "authoritative",
		authorityLabel: "RUNTIME VERIFIED",
		avatarState: health.avatarState,
		capabilities: authenticationRequired
			? []
			: PROFILE_CAPABILITIES.map(({ key, label }) =>
					formatCapability(label, runtimeSnapshot.capabilities[key]),
				),
		employeeName:
			PERSONA_LABELS[persona.id] ?? normalizeEmployeeName(name || agentId),
		...(model ? { model } : {}),
		...(authenticationRequired
			? { notice: "Capabilities unavailable until login." }
			: {}),
		personaId: persona.id,
		...(reasoning ? { reasoning } : {}),
		...(runtimeSnapshot.runtime === "pi" &&
		runtimeSnapshot.state === "offline" &&
		runtimeSnapshot.resume.canResume &&
		runtimeSnapshot.resume.mechanism === "pi_session"
			? { resumeLabel: "AVAILABLE" as const }
			: {}),
		runtimeLabel: runtimeSnapshot.runtime === "grok" ? "GROK BUILD" : "PI",
		statusLabel: authenticationRequired
			? "AUTHENTICATION REQUIRED"
			: health.label,
		transportLabel: runtimeSnapshot.transport.kind.toUpperCase(),
	};
}

function formatCapability(
	label: string,
	capability: AACapability,
): AAEmployeeCapabilityPresentation {
	return {
		label,
		reason: capability.reason,
		support: capability.support,
	};
}

function normalizeEmployeeName(value: string | null | undefined): string {
	return value?.trim().toUpperCase() || "EMPLOYEE";
}
