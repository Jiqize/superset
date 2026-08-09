import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";

export interface AAPiResumeCandidateLike {
	agent: string;
	agentId: string;
	agentLabel: string;
	agentSessionId: string;
	endedAt: number | null;
	resumeSupported: boolean;
	terminalId: string;
}

export type AAResumeSessionPresentation =
	| {
			availability: "available";
			actionLabel: "RESUME PI SESSION";
			contextLabel: "SAVED PI CONVERSATION";
			endedAt: number | null;
	  }
	| {
			availability: "blocked";
			reason:
				| "identity_conflict"
				| "runtime_not_offline"
				| "runtime_not_resumable";
	  }
	| { availability: "hidden" };

export function resolveAAResumeSessionPresentation({
	candidate,
	runtimeSnapshot,
}: {
	candidate: AAPiResumeCandidateLike | null | undefined;
	runtimeSnapshot: AARuntimeSessionSnapshot | null | undefined;
}): AAResumeSessionPresentation {
	if (!candidate || candidate.agentId !== "pi" || !candidate.resumeSupported) {
		return { availability: "hidden" };
	}

	if (runtimeSnapshot) {
		if (
			runtimeSnapshot.runtime !== "pi" ||
			runtimeSnapshot.nativeSessionId !== candidate.agentSessionId
		) {
			return { availability: "blocked", reason: "identity_conflict" };
		}
		if (runtimeSnapshot.state !== "offline") {
			return { availability: "blocked", reason: "runtime_not_offline" };
		}
		if (
			!runtimeSnapshot.resume.canResume ||
			runtimeSnapshot.resume.mechanism !== "pi_session"
		) {
			return { availability: "blocked", reason: "runtime_not_resumable" };
		}
	}

	return {
		availability: "available",
		actionLabel: "RESUME PI SESSION",
		contextLabel: "SAVED PI CONVERSATION",
		endedAt: candidate.endedAt,
	};
}
