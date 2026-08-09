import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { resolveAAActiveWorkerPresentation } from "./aaActiveWorkerPresentation";

const terminal = { terminalId: "terminal-1" };

function runtimeSnapshot(overrides: Record<string, unknown> = {}) {
	const capabilities = createAARuntimeCapabilities();
	capabilities.modelRead = { support: "available", reason: null };
	capabilities.reasoningRead = { support: "available", reason: null };
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: "aa:pi:native-session",
		runtime: "pi" as const,
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal" as const, terminalId: "terminal-1" },
		nativeSessionId: "native-session",
		nativeTurnId: null,
		model: { provider: "anthropic", id: "claude-sonnet", displayName: null },
		reasoning: { value: "high", availableValues: null },
		state: "working" as const,
		stateReason: "turn_started",
		capabilities,
		resume: {
			canResume: true,
			mechanism: "pi_session" as const,
			lastConfirmedAt: 100,
		},
		epoch: "epoch-1",
		lastSequence: 2,
		observedAt: 200,
		...overrides,
	};
}

describe("AA active Worker Card presentation", () => {
	it("uses an authoritative Tier 1 snapshot ahead of a legacy binding", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			runtimeSnapshot: runtimeSnapshot(),
			binding: { agentId: "pi", lastEventType: "Stop" },
			terminal,
		});

		expect(presentation).toMatchObject({
			displayName: "PI",
			source: "runtime",
			status: "working",
			statusLabel: "WORKING",
			tracking: "tracked",
			model: { id: "claude-sonnet" },
			reasoning: { value: "high" },
		});
	});

	it("preserves an explicit unknown runtime state instead of claiming offline evidence", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			runtimeSnapshot: runtimeSnapshot({
				state: "unknown",
				stateReason: "evidence_insufficient",
			}),
			terminal,
		});

		expect(presentation).toMatchObject({
			source: "runtime",
			statusLabel: "UNKNOWN",
			runtimeState: "unknown",
			stateReason: "evidence_insufficient",
		});
	});

	it("uses an authoritative binding ahead of launch metadata", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			binding: { agentId: "pi", lastEventType: "Start" },
			terminal: {
				...terminal,
				launchIdentity: { label: "Codex" },
			},
		});

		expect(presentation).toMatchObject({
			displayName: "PI",
			source: "binding",
			status: "working",
			tracking: "tracked",
		});
	});

	it("marks a known preset terminal without a binding as untracked", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			terminal: {
				...terminal,
				launchIdentity: { agentId: "agent-config", label: "Codex" },
			},
		});

		expect(presentation).toMatchObject({
			displayName: "CODEX",
			source: "launch",
			status: "untracked",
			tracking: "untracked",
		});
	});

	it("uses a recognized legacy pane title only while it is launch identity", () => {
		expect(
			resolveAAActiveWorkerPresentation({
				terminal: { ...terminal, paneTitle: "Claude" },
			}),
		).toMatchObject({ source: "pane-title", status: "untracked" });

		expect(
			resolveAAActiveWorkerPresentation({
				terminal: {
					...terminal,
					paneTitle: "Claude",
					taskTitleEdited: true,
				},
			}),
		).toMatchObject({ source: "local", status: "unassigned" });
	});

	it("keeps generic task text from becoming an employee identity", () => {
		expect(
			resolveAAActiveWorkerPresentation({
				terminal: { ...terminal, paneTitle: "Fix login state" },
			}),
		).toMatchObject({
			displayName: "LOCAL",
			source: "local",
			status: "unassigned",
		});
	});

	it("does not keep a previous worker visible on a non-terminal pane", () => {
		expect(resolveAAActiveWorkerPresentation({ terminal: null })).toMatchObject(
			{
				heading: "NO ACTIVE WORKER",
				source: "none",
				status: "unassigned",
			},
		);
	});
});
