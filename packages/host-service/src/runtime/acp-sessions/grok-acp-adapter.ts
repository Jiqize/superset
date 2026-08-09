import {
	AA_RUNTIME_CONTRACT_VERSION,
	type AACapability,
	type AARuntimeCapabilities,
	type AARuntimeEventEnvelope,
	type AARuntimeSessionSnapshot,
	createAARuntimeCapabilities,
	parseAARuntimeEvent,
} from "@superset/session-protocol";
import { z } from "zod";
import type { AcpAdapterProcessDescriptor } from "./adapter-descriptor";

const safeId = z
	.string()
	.min(1)
	.max(128)
	.regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/);
const initializeSchema = z.object({
	protocolVersion: z.number().int().positive(),
	agentCapabilities: z.object({
		loadSession: z.boolean().optional(),
		promptCapabilities: z
			.object({
				image: z.boolean().optional(),
				audio: z.boolean().optional(),
				embeddedContext: z.boolean().optional(),
			})
			.optional(),
	}),
	_meta: z
		.object({
			agentVersion: z.string().min(1).max(128).optional(),
			modelState: z
				.object({
					currentModelId: safeId.optional(),
					availableModels: z.array(z.unknown()).max(256).optional(),
				})
				.optional(),
			cancelRewind: z.boolean().optional(),
			sessionRecap: z.boolean().optional(),
			defaultAuthMethodId: safeId.nullable().optional(),
		})
		.optional(),
	authMethods: z
		.array(
			z.union([
				safeId,
				z.object({ id: safeId, name: z.string().max(256).optional() }),
			]),
		)
		.max(16)
		.optional(),
});
const structuredErrorSchema = z.object({
	code: z.number().int(),
	message: z.string().min(1).max(2_048),
	data: z.unknown().optional(),
});

export interface GrokFoundationObservation {
	authentication: {
		status: "required" | "unknown";
		methods: string[];
	};
	event: AARuntimeEventEnvelope<"snapshot">;
	runtimeVersion: string | null;
	snapshot: AARuntimeSessionSnapshot;
}

export function createGrokAcpAdapterDescriptor(
	command = "grok",
): AcpAdapterProcessDescriptor {
	return {
		harness: "grok-build-acp",
		command,
		args: ["agent", "--no-leader", "stdio"],
		forceDefaultPermissionMode: false,
	};
}

/**
 * Sanitizes the verified initialize/authentication boundary into the shared
 * runtime contract. No active Grok session is claimed before session/new
 * succeeds on an authenticated profile.
 */
export function createGrokFoundationObservation(input: {
	adapterInstanceId: string;
	epoch: string;
	initialize: unknown;
	observedAt: number;
	sessionError: unknown;
	workspaceId: string;
}): GrokFoundationObservation {
	const adapterInstanceId = safeId.parse(input.adapterInstanceId);
	const epoch = safeId.parse(input.epoch);
	const initialize = initializeSchema.parse(input.initialize);
	const sessionError = structuredErrorSchema.parse(input.sessionError);
	const authenticationRequired =
		sessionError.code === -32000 &&
		sessionError.message.trim().toLowerCase() === "authentication required";
	const methods = (initialize.authMethods ?? []).map((method) =>
		typeof method === "string" ? method : method.id,
	);
	const modelId = initialize._meta?.modelState?.currentModelId;
	const conditionalOnAuthentication: AACapability = {
		support: authenticationRequired ? "conditional" : "unknown",
		reason: authenticationRequired ? "authentication_required" : null,
	};
	const capabilities: AARuntimeCapabilities = {
		...createAARuntimeCapabilities(),
		sessionIdentity: { ...conditionalOnAuthentication },
		turnIdentity: {
			support: "unknown",
			reason: "no_authenticated_session_observed",
		},
		lifecycle: { ...conditionalOnAuthentication },
		toolLifecycle: { ...conditionalOnAuthentication },
		permissionRequests: { ...conditionalOnAuthentication },
		userQuestions: { ...conditionalOnAuthentication },
		modelRead: modelId
			? { support: "available", reason: null }
			: { support: "unknown", reason: "initialize_reported_no_model" },
		modelWrite: {
			support: "unknown",
			reason: "not_behaviorally_verified",
		},
		reasoningRead: {
			support: "unknown",
			reason: "not_behaviorally_verified",
		},
		reasoningWrite: {
			support: "unknown",
			reason: "not_behaviorally_verified",
		},
		structuredMessages: { ...conditionalOnAuthentication },
		cancellation: { ...conditionalOnAuthentication },
		resume:
			initialize.agentCapabilities.loadSession === true
				? { ...conditionalOnAuthentication }
				: { support: "unknown", reason: "load_session_not_reported" },
		processRecovery: {
			support: "unknown",
			reason: "not_behaviorally_verified",
		},
	};
	const sessionKey = `aa:grok:adapter-${adapterInstanceId}`;
	const snapshot: AARuntimeSessionSnapshot = {
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		sessionKey,
		runtime: "grok",
		agentId: "grok",
		workspaceId: input.workspaceId,
		transport: { kind: "acp", terminalId: null },
		nativeSessionId: null,
		nativeTurnId: null,
		model: modelId ? { provider: null, id: modelId, displayName: null } : null,
		reasoning: null,
		state: authenticationRequired ? "error" : "unknown",
		stateReason: authenticationRequired
			? "authentication_required"
			: "session_create_not_verified",
		capabilities,
		resume: { canResume: false, mechanism: null, lastConfirmedAt: null },
		epoch,
		lastSequence: 1,
		observedAt: input.observedAt,
	};
	const event = parseAARuntimeEvent({
		contractVersion: AA_RUNTIME_CONTRACT_VERSION,
		eventId: `grok:${epoch}:1`,
		sessionKey,
		runtime: "grok",
		workspaceId: input.workspaceId,
		terminalId: null,
		nativeSessionId: null,
		nativeTurnId: null,
		epoch,
		sequence: 1,
		occurredAt: input.observedAt,
		kind: "snapshot",
		payload: { snapshot },
	}) as AARuntimeEventEnvelope<"snapshot">;

	return {
		authentication: {
			status: authenticationRequired ? "required" : "unknown",
			methods,
		},
		event,
		runtimeVersion: initialize._meta?.agentVersion ?? null,
		snapshot,
	};
}
