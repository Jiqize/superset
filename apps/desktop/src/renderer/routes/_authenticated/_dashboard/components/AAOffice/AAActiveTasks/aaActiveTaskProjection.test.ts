import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { appendLaunchesToPaneLayout } from "renderer/stores/workspace-creates/appendLaunchesToPaneLayout";
import {
	type AAActiveTaskProjectionInput,
	countAAActiveTaskChangedFiles,
	extractAAActiveTaskTerminalEvidence,
	normalizeAAActiveTaskTitle,
	projectAAActiveTasks,
} from "./aaActiveTaskProjection";

function runtimeSnapshot(
	workspaceId: string,
	terminalId: string,
	state: AARuntimeSessionSnapshot["state"] = "idle",
): AARuntimeSessionSnapshot {
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: `aa:pi:${workspaceId}`,
		runtime: "pi",
		agentId: "pi",
		workspaceId,
		transport: { kind: "terminal", terminalId },
		nativeSessionId: `native-${workspaceId}`,
		nativeTurnId: null,
		model: null,
		reasoning: null,
		state,
		stateReason: null,
		capabilities: createAARuntimeCapabilities(),
		resume: {
			canResume: true,
			mechanism: "pi_session",
			lastConfirmedAt: 100,
		},
		epoch: "epoch-1",
		lastSequence: 1,
		observedAt: 100,
	};
}

function input({
	workspaceId,
	title = "Fix restart status",
	stableOrder = 0,
	isSelected = false,
	state = "idle",
	evidence = "live",
	agentId = "pi",
}: {
	workspaceId: string;
	title?: string;
	stableOrder?: number;
	isSelected?: boolean;
	state?: AARuntimeSessionSnapshot["state"];
	evidence?: "live" | "resumable" | "untracked" | "insufficient";
	agentId?: string;
}): AAActiveTaskProjectionInput {
	const terminalId = `terminal-${workspaceId}`;
	return {
		changedFileCount: stableOrder,
		isSelected,
		stableOrder,
		terminal: {
			launchIdentity: {
				agentId,
				label: agentId === "superset" ? "Superset CLI" : agentId,
			},
			taskTitleEdited: true,
			terminalId,
			title,
		},
		workspaceId,
		...(evidence === "live"
			? { runtimeSnapshot: runtimeSnapshot(workspaceId, terminalId, state) }
			: {}),
		...(evidence === "resumable"
			? {
					resumeCandidate: {
						agentId: "pi",
						resumeSupported: true,
						terminalId,
					},
				}
			: {}),
	};
}

describe("projectAAActiveTasks", () => {
	it("classifies exact authoritative Runtime Contract evidence as LIVE", () => {
		const projection = projectAAActiveTasks([
			input({
				workspaceId: "workspace-live",
				state: "waiting_permission",
			}),
		]);

		expect(projection.rows).toEqual([
			expect.objectContaining({
				employee: "PI",
				evidenceClass: "live",
				lifecycle: "WAITING",
				workspaceId: "workspace-live",
			}),
		]);
	});

	it("uses an exact Pi candidate only after live authority is absent", () => {
		const resumable = input({
			workspaceId: "workspace-saved",
			evidence: "resumable",
		});
		resumable.runtimeSnapshot = runtimeSnapshot(
			"workspace-saved",
			"terminal-workspace-saved",
			"offline",
		);

		expect(projectAAActiveTasks([resumable]).rows[0]).toMatchObject({
			employee: "PI",
			evidenceClass: "resumable",
		});
		expect(projectAAActiveTasks([resumable]).rows[0].lifecycle).toBeUndefined();
	});

	it("does not promote Pi without authority and keeps explicit compatibility launches UNTRACKED", () => {
		const piWithoutAuthority = input({
			workspaceId: "workspace-pi-unknown",
			evidence: "insufficient",
		});
		const compatibility = input({
			workspaceId: "workspace-codex",
			evidence: "untracked",
			agentId: "codex",
		});

		const projection = projectAAActiveTasks([
			piWithoutAuthority,
			compatibility,
		]);

		expect(projection.rows).toHaveLength(1);
		expect(projection.rows[0]).toMatchObject({
			employee: "CODEX",
			evidenceClass: "untracked",
			workspaceId: "workspace-codex",
		});
	});

	it("rejects cross-workspace and cross-terminal runtime or resume evidence", () => {
		const target = input({
			workspaceId: "workspace-target",
			evidence: "insufficient",
		});
		target.runtimeSnapshot = runtimeSnapshot(
			"workspace-other",
			"terminal-workspace-target",
			"working",
		);
		target.resumeCandidate = {
			agentId: "pi",
			resumeSupported: true,
			terminalId: "terminal-other",
		};

		expect(projectAAActiveTasks([target]).rows).toEqual([]);
	});

	it("adds stable opaque discriminators only to normalized title collisions", () => {
		const firstPass = projectAAActiveTasks([
			input({ workspaceId: "workspace-alpha", title: "Fix  Login" }),
			input({ workspaceId: "workspace-beta", title: " fix login " }),
			input({ workspaceId: "workspace-gamma", title: "Ship docs" }),
		]);
		const restartPass = projectAAActiveTasks([
			input({ workspaceId: "workspace-gamma", title: "Ship docs" }),
			input({ workspaceId: "workspace-beta", title: "fix\nlogin" }),
			input({ workspaceId: "workspace-alpha", title: "Fix Login" }),
		]);
		const duplicateSuffixes = new Map(
			firstPass.rows.map((row) => [row.workspaceId, row.discriminator]),
		);
		const restartedSuffixes = new Map(
			restartPass.rows.map((row) => [row.workspaceId, row.discriminator]),
		);

		expect(normalizeAAActiveTaskTitle("  Fix\n Login  ")).toBe("fix login");
		expect(duplicateSuffixes.get("workspace-alpha")).toMatch(
			/^#[A-F0-9]{4,8}$/,
		);
		expect(duplicateSuffixes.get("workspace-alpha")).not.toBe(
			duplicateSuffixes.get("workspace-beta"),
		);
		expect(duplicateSuffixes.get("workspace-gamma")).toBeUndefined();
		expect(restartedSuffixes).toEqual(duplicateSuffixes);
	});

	it("orders selected first, then live, resumable, untracked, and stable workspace order", () => {
		const projection = projectAAActiveTasks([
			input({
				workspaceId: "workspace-untracked",
				evidence: "untracked",
				agentId: "superset",
				stableOrder: 0,
			}),
			input({
				workspaceId: "workspace-live-later",
				stableOrder: 4,
			}),
			input({
				workspaceId: "workspace-saved-current",
				evidence: "resumable",
				isSelected: true,
				stableOrder: 9,
			}),
			input({
				workspaceId: "workspace-live-earlier",
				stableOrder: 2,
			}),
			input({
				workspaceId: "workspace-saved",
				evidence: "resumable",
				stableOrder: 1,
			}),
		]);

		expect(projection.rows.map((row) => row.workspaceId)).toEqual([
			"workspace-saved-current",
			"workspace-live-earlier",
			"workspace-live-later",
			"workspace-saved",
			"workspace-untracked",
		]);
	});

	it("reconstructs restart truth without carrying stale lifecycle to saved rows", () => {
		const liveInputs = [
			input({ workspaceId: "workspace-one", state: "working" }),
			input({ workspaceId: "workspace-two", state: "idle" }),
		];
		const beforeRestart = projectAAActiveTasks(liveInputs);
		const afterRestart = projectAAActiveTasks(
			liveInputs.map((entry) => ({
				...entry,
				runtimeSnapshot: runtimeSnapshot(
					entry.workspaceId,
					entry.terminal.terminalId,
					"offline",
				),
				resumeCandidate: {
					agentId: "pi",
					resumeSupported: true,
					terminalId: entry.terminal.terminalId,
				},
			})),
		);

		expect(beforeRestart.rows.map((row) => row.lifecycle)).toEqual([
			"WORKING",
			"IDLE",
		]);
		expect(afterRestart.rows.map((row) => row.evidenceClass)).toEqual([
			"resumable",
			"resumable",
		]);
		expect(afterRestart.rows.every((row) => row.lifecycle === undefined)).toBe(
			true,
		);
	});
});

describe("extractAAActiveTaskTerminalEvidence", () => {
	it("reads only persisted task-title metadata and keeps launch identity exact", () => {
		const layout = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [],
			agents: [
				{ ok: true, kind: "terminal", sessionId: "terminal-pi", label: "Pi" },
			],
			initialAgentPresentation: {
				agentId: "pi",
				agentResultIndex: 0,
				title: "Fix restart truth",
			},
		});

		expect(extractAAActiveTaskTerminalEvidence(layout)).toEqual({
			launchIdentity: { agentId: "pi", label: "Pi" },
			taskTitleEdited: true,
			terminalId: "terminal-pi",
			title: "Fix restart truth",
		});
	});

	it("does not promote a technical terminal label", () => {
		const layout = appendLaunchesToPaneLayout({
			existing: undefined,
			terminals: [{ terminalId: "terminal-shell", label: "Terminal 1" }],
			agents: [],
		});

		expect(extractAAActiveTaskTerminalEvidence(layout)).toBeNull();
	});
});

describe("countAAActiveTaskChangedFiles", () => {
	it("counts real staged and unstaged paths once", () => {
		expect(
			countAAActiveTaskChangedFiles({
				staged: [{ path: "src/a.ts" }, { path: "src/b.ts" }],
				unstaged: [{ path: "src/a.ts" }, { path: "src/c.ts" }],
			}),
		).toBe(3);
		expect(countAAActiveTaskChangedFiles(undefined)).toBeNull();
	});
});
