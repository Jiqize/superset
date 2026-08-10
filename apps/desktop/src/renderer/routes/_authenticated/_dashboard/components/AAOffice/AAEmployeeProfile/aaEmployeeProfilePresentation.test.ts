import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import {
	resolveAAEmployeeProfilePresentation,
	selectAAEmployeeRuntimeSnapshot,
} from "./aaEmployeeProfilePresentation";

function piSnapshot(): AARuntimeSessionSnapshot {
	const capabilities = createAARuntimeCapabilities();
	capabilities.sessionIdentity = { support: "available", reason: null };
	capabilities.lifecycle = { support: "available", reason: null };
	capabilities.toolLifecycle = { support: "available", reason: null };
	capabilities.modelRead = { support: "available", reason: null };
	capabilities.reasoningRead = { support: "available", reason: null };
	capabilities.resume = { support: "available", reason: null };

	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: "aa:pi:native-session",
		runtime: "pi",
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal", terminalId: "terminal-1" },
		nativeSessionId: "native-session",
		nativeTurnId: null,
		model: {
			provider: "google",
			id: "gemini-3.5-flash",
			displayName: "Gemini 3.5 Flash",
		},
		reasoning: {
			value: "high",
			availableValues: ["low", "medium", "high", "xhigh"],
		},
		state: "working",
		stateReason: "turn_started",
		capabilities,
		resume: {
			canResume: true,
			mechanism: "pi_session",
			lastConfirmedAt: 100,
		},
		epoch: "epoch-1",
		lastSequence: 3,
		observedAt: 200,
	};
}

function unauthenticatedGrokSnapshot(): AARuntimeSessionSnapshot {
	const capabilities = createAARuntimeCapabilities();
	capabilities.lifecycle = {
		support: "conditional",
		reason: "authentication_required",
	};
	capabilities.modelRead = { support: "available", reason: null };

	return {
		...piSnapshot(),
		sessionKey: "aa:grok:authentication-boundary",
		runtime: "grok",
		agentId: "grok",
		transport: { kind: "acp", terminalId: null },
		nativeSessionId: null,
		model: { provider: "xai", id: "grok-build", displayName: "Grok Build" },
		reasoning: null,
		state: "error",
		stateReason: "authentication_required",
		capabilities,
		resume: { canResume: false, mechanism: null, lastConfirmedAt: null },
	};
}

describe("AA employee profile presentation", () => {
	it("presents active Pi identity and negotiated runtime values without launch preferences", () => {
		const presentation = resolveAAEmployeeProfilePresentation({
			agentId: "pi",
			name: "Pi",
			runtimeSnapshot: piSnapshot(),
		});

		expect(presentation).toMatchObject({
			authority: "authoritative",
			authorityLabel: "RUNTIME VERIFIED",
			employeeName: "PI",
			model: {
				id: "gemini-3.5-flash",
				label: "Gemini 3.5 Flash",
			},
			reasoning: {
				availableValues: ["low", "medium", "high", "xhigh"],
				value: "high",
			},
			runtimeLabel: "PI",
			statusLabel: "WORKING",
			transportLabel: "TERMINAL",
		});
		expect(presentation.capabilities).toContainEqual({
			label: "LIFECYCLE",
			reason: null,
			support: "available",
		});
	});

	it("keeps a Tier 2 roster employee explicit and untracked without runtime evidence", () => {
		const presentation = resolveAAEmployeeProfilePresentation({
			agentId: "codex",
			name: "Codex",
		});

		expect(presentation).toMatchObject({
			authority: "untracked",
			authorityLabel: "UNTRACKED",
			capabilities: [],
			employeeName: "CODEX",
			notice: "Runtime capabilities are not tracked for this employee.",
			runtimeLabel: "COMPATIBILITY CLI",
			statusLabel: "UNTRACKED",
			transportLabel: "TERMINAL PRESET",
		});
	});

	it("translates a verified unauthenticated Grok boundary without enabling capabilities", () => {
		const presentation = resolveAAEmployeeProfilePresentation({
			agentId: "grok",
			name: "Grok",
			runtimeSnapshot: unauthenticatedGrokSnapshot(),
		});

		expect(presentation).toMatchObject({
			authority: "authoritative",
			authorityLabel: "RUNTIME VERIFIED",
			capabilities: [],
			employeeName: "GROK BUILD",
			notice: "Capabilities unavailable until login.",
			runtimeLabel: "GROK BUILD",
			statusLabel: "AUTHENTICATION REQUIRED",
			transportLabel: "ACP",
		});
	});

	it("keeps Tier 1 identity visible but unavailable before runtime evidence exists", () => {
		expect(
			resolveAAEmployeeProfilePresentation({ agentId: "pi", name: "Pi" }),
		).toMatchObject({
			authority: "unavailable",
			authorityLabel: "NO LIVE RUNTIME",
			notice: "Runtime details appear when a verified Pi session is active.",
			runtimeLabel: "PI",
			statusLabel: "NOT CONNECTED",
			transportLabel: "TERMINAL",
		});
		expect(
			resolveAAEmployeeProfilePresentation({ agentId: "grok", name: "Grok" }),
		).toMatchObject({
			authority: "unavailable",
			authorityLabel: "NO LIVE RUNTIME",
			notice:
				"Capabilities unavailable without a verified Grok runtime session.",
			runtimeLabel: "GROK BUILD",
			statusLabel: "NOT CONNECTED",
			transportLabel: "ACP",
		});
	});

	it("selects the latest matching Tier 1 snapshot, including terminal-less Grok ACP", () => {
		const oldPi = { ...piSnapshot(), observedAt: 100 };
		const currentPi = { ...piSnapshot(), observedAt: 300 };
		const grok = unauthenticatedGrokSnapshot();
		const snapshots = [oldPi, grok, currentPi];

		expect(
			selectAAEmployeeRuntimeSnapshot(snapshots, {
				agentId: "pi",
				name: "Pi",
			}),
		).toBe(currentPi);
		expect(
			selectAAEmployeeRuntimeSnapshot(snapshots, {
				agentId: "grok",
				name: "Grok",
			}),
		).toBe(grok);
		expect(
			selectAAEmployeeRuntimeSnapshot(snapshots, {
				agentId: "codex",
				name: "Codex",
			}),
		).toBeUndefined();
	});

	it("shows resume availability only for authoritative offline Pi evidence", () => {
		const offline = resolveAAEmployeeProfilePresentation({
			agentId: "pi",
			name: "Pi",
			runtimeSnapshot: {
				...piSnapshot(),
				state: "offline",
				stateReason: "terminal_process_lost",
			},
		});
		const live = resolveAAEmployeeProfilePresentation({
			agentId: "pi",
			name: "Pi",
			runtimeSnapshot: piSnapshot(),
		});

		expect(offline).toMatchObject({
			resumeLabel: "AVAILABLE",
			statusLabel: "OFFLINE / RESUMABLE",
		});
		expect(live).not.toHaveProperty("resumeLabel");
	});

	it("presents a durable Pi resume candidate without claiming live runtime evidence", () => {
		const presentation = resolveAAEmployeeProfilePresentation({
			agentId: "pi",
			name: "Pi",
			resumeAvailable: true,
		});

		expect(presentation).toMatchObject({
			authority: "saved",
			authorityLabel: "SAVED SESSION",
			capabilities: [],
			notice: "Live runtime details return after exact resume.",
			resumeLabel: "AVAILABLE",
			runtimeLabel: "PI",
			statusLabel: "OFFLINE / RESUMABLE",
			transportLabel: "TERMINAL",
		});
	});
});
