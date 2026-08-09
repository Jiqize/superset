import type { AARuntimeState } from "@superset/session-protocol";
import type { AAStatusTone } from "../AAStatusLight";
import type { AAAgentState } from "./aaAgentState";

export type AARuntimeHealthCode =
	| "starting"
	| "working"
	| "idle"
	| "waiting"
	| "cancelling"
	| "offline"
	| "offline_resumable"
	| "unknown"
	| "error"
	| "resume_identity_mismatch"
	| "resume_not_confirmed";

export interface AARuntimeHealthPresentation {
	avatarState: AAAgentState;
	code: AARuntimeHealthCode;
	diagnostic: string;
	label: string;
	tone: AAStatusTone;
}

interface ResolveAARuntimeHealthInput {
	canResume: boolean;
	state: AARuntimeState;
	stateReason: string | null | undefined;
}

export function resolveAARuntimeHealth({
	canResume,
	state,
	stateReason,
}: ResolveAARuntimeHealthInput): AARuntimeHealthPresentation {
	const diagnostic = formatDiagnostic(state, stateReason);

	if (state === "error" && stateReason === "resume_identity_mismatch") {
		return {
			avatarState: "error",
			code: "resume_identity_mismatch",
			diagnostic,
			label: "RESUME IDENTITY MISMATCH",
			tone: "error",
		};
	}
	if (state === "error" && stateReason === "resume_identity_not_confirmed") {
		return {
			avatarState: "error",
			code: "resume_not_confirmed",
			diagnostic,
			label: "RESUME NOT CONFIRMED",
			tone: "error",
		};
	}

	switch (state) {
		case "starting":
			return {
				avatarState: "waiting",
				code: "starting",
				diagnostic,
				label: "STARTING",
				tone: "attention",
			};
		case "working":
			return {
				avatarState: "working",
				code: "working",
				diagnostic,
				label: "WORKING",
				tone: "working",
			};
		case "idle":
			return {
				avatarState: "idle",
				code: "idle",
				diagnostic,
				label: "IDLE",
				tone: "success",
			};
		case "waiting_permission":
			return {
				avatarState: "waiting",
				code: "waiting",
				diagnostic,
				label: "WAITING / PERMISSION",
				tone: "attention",
			};
		case "waiting_user":
			return {
				avatarState: "waiting",
				code: "waiting",
				diagnostic,
				label: "WAITING / USER",
				tone: "attention",
			};
		case "cancelling":
			return {
				avatarState: "waiting",
				code: "cancelling",
				diagnostic,
				label: "CANCELLING",
				tone: "attention",
			};
		case "offline":
			return canResume
				? {
						avatarState: "offline",
						code: "offline_resumable",
						diagnostic,
						label: "OFFLINE / RESUMABLE",
						tone: "attention",
					}
				: {
						avatarState: "offline",
						code: "offline",
						diagnostic,
						label: "OFFLINE",
						tone: "offline",
					};
		case "ended":
			return {
				avatarState: "offline",
				code: "offline",
				diagnostic,
				label: "OFFLINE",
				tone: "offline",
			};
		case "unknown":
			return {
				avatarState: "offline",
				code: "unknown",
				diagnostic,
				label: "UNKNOWN",
				tone: "attention",
			};
		case "error":
			return {
				avatarState: "error",
				code: "error",
				diagnostic,
				label: "ERROR",
				tone: "error",
			};
	}
}

function formatDiagnostic(
	state: AARuntimeState,
	stateReason: string | null | undefined,
): string {
	if (!stateReason) {
		return `Authoritative runtime state: ${state.replaceAll("_", " ")}`;
	}
	return `Runtime evidence: ${stateReason.replaceAll("_", " ")}`;
}
