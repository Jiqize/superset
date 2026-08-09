import { describe, expect, it } from "bun:test";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AARuntimeEventEnvelope,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import { AARuntimeRegistry } from "../../../runtime/aa-runtime";
import type { HostServiceContext } from "../../../types";
import { aaRuntimeRouter } from "./aa-runtime";

function initialEvent(): AARuntimeEventEnvelope<"snapshot"> {
	const snapshot = {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey: "aa:pi:native-session",
		runtime: "pi" as const,
		agentId: "pi",
		workspaceId: "workspace-1",
		transport: { kind: "terminal" as const, terminalId: "terminal-1" },
		nativeSessionId: "native-session",
		nativeTurnId: null,
		model: null,
		reasoning: null,
		state: "idle" as const,
		stateReason: "session_attached",
		capabilities: createAARuntimeCapabilities(),
		resume: {
			canResume: true,
			mechanism: "pi_session" as const,
			lastConfirmedAt: 100,
		},
		epoch: "epoch-1",
		lastSequence: 1,
		observedAt: 100,
	};
	return {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		eventId: "pi:epoch-1:1",
		sessionKey: snapshot.sessionKey,
		runtime: "pi",
		workspaceId: snapshot.workspaceId,
		terminalId: "terminal-1",
		nativeSessionId: "native-session",
		nativeTurnId: null,
		epoch: "epoch-1",
		sequence: 1,
		occurredAt: 100,
		kind: "snapshot",
		payload: { snapshot },
	};
}

function createContext(): HostServiceContext {
	const aaRuntime = new AARuntimeRegistry();
	aaRuntime.ingest(initialEvent());
	return {
		isAuthenticated: true,
		runtime: { aaRuntime },
	} as unknown as HostServiceContext;
}

describe("aaRuntimeRouter", () => {
	it("queries host-owned snapshots by workspace, terminal, and session key", async () => {
		const caller = aaRuntimeRouter.createCaller(createContext());

		expect(await caller.list({ workspaceId: "workspace-1" })).toHaveLength(1);
		expect(
			await caller.findByTerminal({
				workspaceId: "workspace-1",
				terminalId: "terminal-1",
			}),
		).toMatchObject({ nativeSessionId: "native-session" });
		expect(
			await caller.get({
				workspaceId: "workspace-1",
				sessionKey: "aa:pi:native-session",
			}),
		).toMatchObject({ state: "idle" });
		expect(
			await caller.events({
				workspaceId: "workspace-1",
				sessionKey: "aa:pi:native-session",
			}),
		).toHaveLength(1);
	});

	it("does not expose a session through a different workspace scope", async () => {
		const caller = aaRuntimeRouter.createCaller(createContext());

		expect(
			await caller.findByTerminal({
				workspaceId: "workspace-other",
				terminalId: "terminal-1",
			}),
		).toBeNull();
		expect(
			await caller.get({
				workspaceId: "workspace-other",
				sessionKey: "aa:pi:native-session",
			}),
		).toBeNull();
		expect(
			await caller.events({
				workspaceId: "workspace-other",
				sessionKey: "aa:pi:native-session",
			}),
		).toEqual([]);
	});
});
