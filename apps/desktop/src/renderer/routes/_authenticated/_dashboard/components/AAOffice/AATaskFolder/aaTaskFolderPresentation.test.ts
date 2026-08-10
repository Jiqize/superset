import { describe, expect, it } from "bun:test";
import {
	getAATaskFolderContextPresentation,
	getAATaskFolderLatestAction,
	getAATaskFolderMetricPresentation,
	mapAARuntimeSnapshotToAATaskFolderState,
	mapAAWorkerToAATaskFolderState,
	mapLifecycleEventToAATaskFolderState,
	normalizeAATaskFolderTitleInput,
	resolveAATaskFolderRename,
	resolveAATaskFolderTitle,
} from "./aaTaskFolderPresentation";

describe("AA Task Folder presentation", () => {
	it("builds the work context only from authoritative worker and Git evidence", () => {
		expect(
			getAATaskFolderContextPresentation({
				changedFileCount: 3,
				worker: {
					agentId: "pi",
					authorityLabel: "RUNTIME VERIFIED",
					displayName: "PI",
					heading: "PI WORKER",
					model: {
						displayName: "Gemini 3.5 Flash",
						id: "gemini-3.5-flash",
						provider: "google",
					},
					personaId: "pi",
					reasoning: { availableValues: null, value: "high" },
					runtimeLabel: "PI",
					runtimeState: "working",
					source: "runtime",
					stateReason: "turn_started",
					status: "working",
					statusLabel: "WORKING",
					tracking: "tracked",
					transportLabel: "TERMINAL",
				},
			}),
		).toEqual({
			authority: "RUNTIME VERIFIED",
			changedFiles: "3 CHANGED",
			employee: "PI",
			latestAction: "TURN STARTED",
			model: "Gemini 3.5 Flash",
			reasoning: "high",
			runtime: "PI",
			status: "WORKING",
			transport: "TERMINAL",
		});
	});

	it("uses a fixed lifecycle vocabulary for latest action and omits unknown reasons", () => {
		expect(
			getAATaskFolderLatestAction({
				lastEventType: "PostToolUse",
				stateReason: "turn_settled",
			}),
		).toBe("TURN SETTLED");
		expect(
			getAATaskFolderLatestAction({
				lastEventType: "PermissionRequest",
			}),
		).toBe("PERMISSION REQUESTED");
		expect(
			getAATaskFolderLatestAction({
				stateReason: "vendor_detail_not_in_contract",
			}),
		).toBeUndefined();
	});

	it("keeps an exact saved Pi candidate visibly offline instead of inferring idle", () => {
		expect(
			mapAAWorkerToAATaskFolderState({
				healthCode: "offline_resumable",
				tracking: "tracked",
			}),
		).toBe("offline");
	});
	it("uses the highest-priority real title source", () => {
		expect(
			resolveAATaskFolderTitle({
				explicitTitle: "Fix login state",
				sessionLabel: "Pi",
				terminalLabel: "Terminal",
			}),
		).toBe("Fix login state");
	});

	it("falls through blank sources to the existing session label", () => {
		expect(
			resolveAATaskFolderTitle({
				explicitTitle: "  ",
				sessionLabel: "  Pi baseline session  ",
				terminalLabel: "Terminal",
			}),
		).toBe("Pi baseline session");
	});

	it("uses the honest generic fallback when no title exists", () => {
		expect(resolveAATaskFolderTitle({})).toBe("Current Work Session");
	});

	it("normalizes whitespace and limits saved titles to 48 Unicode characters", () => {
		expect(normalizeAATaskFolderTitleInput("  Fix   login\nstate  ")).toBe(
			"Fix login state",
		);
		const title = normalizeAATaskFolderTitleInput("办".repeat(60));
		expect(Array.from(title ?? "")).toHaveLength(48);
		expect(title?.endsWith("…")).toBe(true);
	});

	it("commits normalized titles and uses undefined for empty fallback", () => {
		expect(
			resolveAATaskFolderRename({
				action: "save",
				currentTitleOverride: "Old",
				draft: "  New   task  ",
			}),
		).toEqual({ committed: true, titleOverride: "New task" });
		expect(
			resolveAATaskFolderRename({
				action: "save",
				currentTitleOverride: "Old",
				draft: "  ",
			}),
		).toEqual({ committed: true, titleOverride: undefined });
	});

	it("cancels without changing the existing title", () => {
		expect(
			resolveAATaskFolderRename({
				action: "cancel",
				currentTitleOverride: "Original",
				draft: "Replacement",
			}),
		).toEqual({ committed: false, titleOverride: "Original" });
	});

	it.each([
		[undefined, "unassigned", "unassigned"],
		[undefined, "untracked", "untracked"],
		["Attached", "tracked", "idle"],
		["Start", "tracked", "working"],
		["UserPromptSubmit", "tracked", "working"],
		["PermissionRequest", "tracked", "waiting"],
		["Stop", "tracked", "turn-complete"],
		["Detached", "tracked", "session-ended"],
		["Failed", "tracked", "error"],
	] as const)("maps %s with tracking=%s to %s", (eventType, tracking, expected) => {
		expect(mapLifecycleEventToAATaskFolderState(eventType, tracking)).toBe(
			expected,
		);
	});

	it("uses authoritative runtime settlement rather than tool completion", () => {
		expect(
			mapAARuntimeSnapshotToAATaskFolderState("working", "tool_finished"),
		).toBe("working");
		expect(
			mapAARuntimeSnapshotToAATaskFolderState("idle", "turn_settled"),
		).toBe("turn-complete");
		expect(mapAARuntimeSnapshotToAATaskFolderState("unknown", null)).toBe(
			"unknown",
		);
		expect(mapAARuntimeSnapshotToAATaskFolderState("starting", null)).toBe(
			"starting",
		);
	});

	it.each([
		["unassigned", "STATUS", "UNASSIGNED", "status: unassigned"],
		["idle", "STATUS", "IDLE", "status: idle"],
		["working", "STATUS", "WORKING", "status: working"],
		["waiting", "STATUS", "WAITING", "status: waiting"],
		["untracked", "TRACKING", "UNTRACKED", "tracking: untracked"],
		["turn-complete", "LAST TURN", "COMPLETE", "last turn: complete"],
		["session-ended", "SESSION", "ENDED", "session: ended"],
		["error", "LAST EVENT", "ERROR", "last event: error"],
		["starting", "STATUS", "STARTING", "status: starting"],
		["cancelling", "STATUS", "CANCELLING", "status: cancelling"],
		["offline", "STATUS", "OFFLINE", "status: offline"],
		["unknown", "STATUS", "UNKNOWN", "status: unknown"],
	] as const)("presents %s as %s / %s with an explicit temporal summary", (state, label, value, accessibleSummary) => {
		expect(getAATaskFolderMetricPresentation(state)).toEqual({
			accessibleSummary,
			label,
			value,
		});
	});
});
