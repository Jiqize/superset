import { describe, expect, it } from "bun:test";
import { AARuntimeRegistry } from "../aa-runtime";
import {
	createGrokAcpAdapterDescriptor,
	createGrokFoundationObservation,
} from "./grok-acp-adapter";

const initialize = {
	protocolVersion: 1,
	agentCapabilities: {
		loadSession: true,
		promptCapabilities: {
			image: false,
			audio: false,
			embeddedContext: true,
		},
	},
	authMethods: [{ id: "grok.com", name: "Grok", description: "Sign in" }],
	_meta: {
		agentVersion: "0.2.87",
		agentId: "must-not-escape",
		agentInstanceId: "must-not-escape-either",
		currentWorkingDirectory: "/private/runtime/probe",
		modelState: {
			currentModelId: "grok-build",
			availableModels: [],
		},
		cancelRewind: true,
		sessionRecap: true,
		defaultAuthMethodId: null,
	},
};

const authenticationError = {
	code: -32000,
	message: "Authentication required",
	data: "no auth method id provided",
};

describe("Grok ACP runtime foundation", () => {
	it("describes a Grok stdio child owned by the existing ACP manager", () => {
		expect(createGrokAcpAdapterDescriptor("/safe/bin/grok")).toEqual({
			harness: "grok-build-acp",
			command: "/safe/bin/grok",
			args: ["agent", "--no-leader", "stdio"],
			forceDefaultPermissionMode: false,
		});
	});

	it("turns verified initialize plus auth failure into a truthful capability snapshot", () => {
		const observation = createGrokFoundationObservation({
			adapterInstanceId: "probe-1",
			epoch: "epoch-1",
			initialize,
			observedAt: 100,
			sessionError: authenticationError,
			workspaceId: "workspace-1",
		});

		expect(observation).toMatchObject({
			runtimeVersion: "0.2.87",
			authentication: {
				status: "required",
				methods: ["grok.com"],
			},
			snapshot: {
				sessionKey: "aa:grok:adapter-probe-1",
				runtime: "grok",
				nativeSessionId: null,
				model: { provider: null, id: "grok-build", displayName: null },
				reasoning: null,
				state: "error",
				stateReason: "authentication_required",
				capabilities: {
					sessionIdentity: { support: "conditional" },
					lifecycle: { support: "conditional" },
					toolLifecycle: { support: "conditional" },
					modelRead: { support: "available" },
					modelWrite: { support: "unknown" },
					reasoningRead: { support: "unknown" },
					cancellation: { support: "conditional" },
					resume: { support: "conditional" },
				},
				resume: { canResume: false, mechanism: null },
			},
		});
		expect(JSON.stringify(observation)).not.toContain(
			"no auth method id provided",
		);
		expect(JSON.stringify(observation)).not.toContain("/private/runtime/probe");
		expect(JSON.stringify(observation)).not.toContain("must-not-escape");
	});

	it("produces a validated registry event and survives the structured error", () => {
		const observation = createGrokFoundationObservation({
			adapterInstanceId: "probe-1",
			epoch: "epoch-1",
			initialize,
			observedAt: 100,
			sessionError: authenticationError,
			workspaceId: "workspace-1",
		});
		const registry = new AARuntimeRegistry();

		expect(registry.ingest(observation.event)).toEqual({
			status: "accepted",
		});
		expect(registry.get(observation.snapshot.sessionKey)).toMatchObject({
			state: "error",
			stateReason: "authentication_required",
		});
	});

	it("rejects malformed initialize evidence instead of inferring support", () => {
		expect(() =>
			createGrokFoundationObservation({
				adapterInstanceId: "probe-1",
				epoch: "epoch-1",
				initialize: { protocolVersion: "one" },
				observedAt: 100,
				sessionError: authenticationError,
				workspaceId: "workspace-1",
			}),
		).toThrow();
	});
});
