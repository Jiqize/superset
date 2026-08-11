import type {
	AARuntimeSessionSnapshot,
	AARuntimeState,
} from "@superset/session-protocol";

export interface AANewTaskRuntimeTarget {
	workspaceId: string;
	terminalId: string;
}

export type AANewTaskRuntimeClassification =
	| { kind: "ignored"; reason: "identity-mismatch" }
	| {
			kind: "pending";
			reason: "native-session-unconfirmed" | "session-identity-unavailable";
			state: AARuntimeState;
	  }
	| {
			kind: "unavailable";
			reason: "runtime-state-unavailable";
			state: AARuntimeState;
	  }
	| { kind: "confirmed"; state: AARuntimeState };

const UNAVAILABLE_STATES = new Set<AARuntimeState>([
	"error",
	"ended",
	"offline",
	"unknown",
]);

export function classifyAANewTaskRuntimeSnapshot(
	snapshot: AARuntimeSessionSnapshot,
	target: AANewTaskRuntimeTarget,
): AANewTaskRuntimeClassification {
	if (
		snapshot.runtime !== "pi" ||
		snapshot.workspaceId !== target.workspaceId ||
		snapshot.transport.kind !== "terminal" ||
		snapshot.transport.terminalId !== target.terminalId
	) {
		return { kind: "ignored", reason: "identity-mismatch" };
	}

	if (UNAVAILABLE_STATES.has(snapshot.state)) {
		return {
			kind: "unavailable",
			reason: "runtime-state-unavailable",
			state: snapshot.state,
		};
	}

	if (!snapshot.nativeSessionId) {
		return {
			kind: "pending",
			reason: "native-session-unconfirmed",
			state: snapshot.state,
		};
	}

	if (snapshot.capabilities.sessionIdentity.support !== "available") {
		return {
			kind: "pending",
			reason: "session-identity-unavailable",
			state: snapshot.state,
		};
	}

	return { kind: "confirmed", state: snapshot.state };
}
