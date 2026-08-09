import { z } from "zod";

export const AA_RUNTIME_CONTRACT_VERSION = "0.1" as const;

export type AARuntimeId = "pi" | "grok";
export type AATransportKind = "terminal" | "acp";

export type AARuntimeState =
	| "starting"
	| "idle"
	| "working"
	| "waiting_permission"
	| "waiting_user"
	| "cancelling"
	| "offline"
	| "error"
	| "ended"
	| "unknown";

export type AACapabilitySupport =
	| "available"
	| "unavailable"
	| "conditional"
	| "unknown";

export interface AACapability {
	support: AACapabilitySupport;
	reason: string | null;
}

export interface AARuntimeCapabilities {
	sessionIdentity: AACapability;
	turnIdentity: AACapability;
	lifecycle: AACapability;
	toolLifecycle: AACapability;
	permissionRequests: AACapability;
	userQuestions: AACapability;
	modelRead: AACapability;
	modelWrite: AACapability;
	reasoningRead: AACapability;
	reasoningWrite: AACapability;
	structuredMessages: AACapability;
	cancellation: AACapability;
	resume: AACapability;
	processRecovery: AACapability;
}

export interface AARuntimeModel {
	provider: string | null;
	id: string;
	displayName: string | null;
}

export interface AARuntimeReasoning {
	value: string;
	availableValues: readonly string[] | null;
}

export interface AAResumeState {
	canResume: boolean;
	mechanism: "pi_session" | "acp_load" | null;
	lastConfirmedAt: number | null;
}

export interface AARuntimeSessionSnapshot {
	contractVersion: typeof AA_RUNTIME_CONTRACT_VERSION;
	sessionKey: string;
	runtime: AARuntimeId;
	agentId: string;
	workspaceId: string;
	transport: {
		kind: AATransportKind;
		terminalId: string | null;
	};
	nativeSessionId: string | null;
	nativeTurnId: string | null;
	model: AARuntimeModel | null;
	reasoning: AARuntimeReasoning | null;
	state: AARuntimeState;
	stateReason: string | null;
	capabilities: AARuntimeCapabilities;
	resume: AAResumeState;
	epoch: string;
	lastSequence: number;
	observedAt: number;
}

export interface AARuntimeEventPayloadMap {
	snapshot: { snapshot: AARuntimeSessionSnapshot };
	"session.started": { reason: "new" | "load" | "attach" };
	"session.offline": { resumable: boolean };
	"session.ended": { reason: string | null };
	"turn.started": { correlationId: string | null };
	"turn.settled": { stopReason: string | null };
	"tool.started": { toolCallId: string; name: string | null };
	"tool.progress": { toolCallId: string };
	"tool.finished": {
		toolCallId: string;
		outcome: "completed" | "failed" | "cancelled" | "unknown";
	};
	"permission.requested": {
		requestId: string;
		toolCallId: string | null;
		title: string;
		options: readonly {
			id: string;
			label: string;
			kind: "allow_once" | "allow_always" | "reject_once" | "reject_always";
		}[];
	};
	"permission.resolved": { requestId: string; optionId: string | null };
	"user_input.requested": { requestId: string; title: string };
	"user_input.resolved": { requestId: string };
	"model.changed": { model: AARuntimeModel };
	"reasoning.changed": { reasoning: AARuntimeReasoning };
	"message.delta": {
		channel: "assistant" | "reasoning";
		content: { type: string; text?: string; data?: unknown };
	};
	"cancel.requested": Record<string, never>;
	"cancel.settled": { outcome: "cancelled" | "too_late" | "failed" };
	"runtime.error": { code: string | null; message: string };
}

export type AARuntimeEventKind = keyof AARuntimeEventPayloadMap;

export type AARuntimeEventEnvelope<
	K extends AARuntimeEventKind = AARuntimeEventKind,
> = K extends AARuntimeEventKind
	? {
			contractVersion: typeof AA_RUNTIME_CONTRACT_VERSION;
			eventId: string;
			sessionKey: string;
			runtime: AARuntimeId;
			workspaceId: string;
			terminalId: string | null;
			nativeSessionId: string | null;
			nativeTurnId: string | null;
			epoch: string;
			sequence: number;
			occurredAt: number;
			kind: K;
			payload: AARuntimeEventPayloadMap[K];
		}
	: never;

const CAPABILITY_KEYS = [
	"sessionIdentity",
	"turnIdentity",
	"lifecycle",
	"toolLifecycle",
	"permissionRequests",
	"userQuestions",
	"modelRead",
	"modelWrite",
	"reasoningRead",
	"reasoningWrite",
	"structuredMessages",
	"cancellation",
	"resume",
	"processRecovery",
] as const satisfies readonly (keyof AARuntimeCapabilities)[];

export function createAARuntimeCapabilities(
	defaults: AACapability = { support: "unknown", reason: null },
): AARuntimeCapabilities {
	return Object.fromEntries(
		CAPABILITY_KEYS.map((key) => [key, { ...defaults }]),
	) as unknown as AARuntimeCapabilities;
}

const boundedOpaqueIdSchema = z
	.string()
	.min(1)
	.max(256)
	.regex(/^[A-Za-z0-9][A-Za-z0-9._:/-]*$/, "invalid opaque identifier");
const boundedTextSchema = z.string().max(2_048);
const timestampSchema = z.number().int().nonnegative().safe();
const nullableOpaqueIdSchema = boundedOpaqueIdSchema.nullable();

export const aaCapabilitySchema = z.object({
	support: z.enum(["available", "unavailable", "conditional", "unknown"]),
	reason: boundedTextSchema.nullable(),
});

export const aaRuntimeCapabilitiesSchema = z.object(
	Object.fromEntries(
		CAPABILITY_KEYS.map((key) => [key, aaCapabilitySchema]),
	) as Record<keyof AARuntimeCapabilities, typeof aaCapabilitySchema>,
);

export const aaRuntimeModelSchema = z.object({
	provider: boundedOpaqueIdSchema.nullable(),
	id: boundedOpaqueIdSchema,
	displayName: z.string().min(1).max(256).nullable(),
});

export const aaRuntimeReasoningSchema = z.object({
	value: boundedOpaqueIdSchema,
	availableValues: z.array(boundedOpaqueIdSchema).max(32).nullable(),
});

export const aaResumeStateSchema = z
	.object({
		canResume: z.boolean(),
		mechanism: z.enum(["pi_session", "acp_load"]).nullable(),
		lastConfirmedAt: timestampSchema.nullable(),
	})
	.superRefine((resume, context) => {
		if (
			resume.canResume &&
			(resume.mechanism === null || resume.lastConfirmedAt === null)
		) {
			context.addIssue({
				code: "custom",
				message:
					"resumable sessions require a mechanism and confirmation timestamp",
			});
		}
	});

export const aaRuntimeSessionSnapshotSchema = z
	.object({
		contractVersion: z.literal(AA_RUNTIME_CONTRACT_VERSION),
		sessionKey: z
			.string()
			.min(1)
			.max(320)
			.regex(/^aa:(pi|grok):[A-Za-z0-9][A-Za-z0-9._:-]*$/),
		runtime: z.enum(["pi", "grok"]),
		agentId: boundedOpaqueIdSchema,
		workspaceId: boundedOpaqueIdSchema,
		transport: z.object({
			kind: z.enum(["terminal", "acp"]),
			terminalId: nullableOpaqueIdSchema,
		}),
		nativeSessionId: nullableOpaqueIdSchema,
		nativeTurnId: nullableOpaqueIdSchema,
		model: aaRuntimeModelSchema.nullable(),
		reasoning: aaRuntimeReasoningSchema.nullable(),
		state: z.enum([
			"starting",
			"idle",
			"working",
			"waiting_permission",
			"waiting_user",
			"cancelling",
			"offline",
			"error",
			"ended",
			"unknown",
		]),
		stateReason: boundedTextSchema.nullable(),
		capabilities: aaRuntimeCapabilitiesSchema,
		resume: aaResumeStateSchema,
		epoch: boundedOpaqueIdSchema,
		lastSequence: z.number().int().nonnegative().safe(),
		observedAt: timestampSchema,
	})
	.superRefine((snapshot, context) => {
		if (snapshot.sessionKey === snapshot.transport.terminalId) {
			context.addIssue({
				code: "custom",
				path: ["sessionKey"],
				message: "sessionKey must not equal terminalId",
			});
		}
		if (!snapshot.sessionKey.startsWith(`aa:${snapshot.runtime}:`)) {
			context.addIssue({
				code: "custom",
				path: ["sessionKey"],
				message: "sessionKey runtime namespace mismatch",
			});
		}
		if (snapshot.resume.canResume && snapshot.nativeSessionId === null) {
			context.addIssue({
				code: "custom",
				path: ["resume", "canResume"],
				message: "resumable sessions require nativeSessionId",
			});
		}
	});

export function parseAARuntimeSessionSnapshot(
	value: unknown,
): AARuntimeSessionSnapshot {
	return aaRuntimeSessionSnapshotSchema.parse(
		value,
	) as AARuntimeSessionSnapshot;
}

const nullableTextSchema = boundedTextSchema.nullable();
const eventPayloadSchemas = {
	snapshot: z.object({ snapshot: aaRuntimeSessionSnapshotSchema }),
	"session.started": z.object({ reason: z.enum(["new", "load", "attach"]) }),
	"session.offline": z.object({ resumable: z.boolean() }),
	"session.ended": z.object({ reason: nullableTextSchema }),
	"turn.started": z.object({ correlationId: nullableOpaqueIdSchema }),
	"turn.settled": z.object({ stopReason: nullableTextSchema }),
	"tool.started": z.object({
		toolCallId: boundedOpaqueIdSchema,
		name: boundedOpaqueIdSchema.nullable(),
	}),
	"tool.progress": z.object({ toolCallId: boundedOpaqueIdSchema }),
	"tool.finished": z.object({
		toolCallId: boundedOpaqueIdSchema,
		outcome: z.enum(["completed", "failed", "cancelled", "unknown"]),
	}),
	"permission.requested": z.object({
		requestId: boundedOpaqueIdSchema,
		toolCallId: nullableOpaqueIdSchema,
		title: z.string().min(1).max(512),
		options: z
			.array(
				z.object({
					id: boundedOpaqueIdSchema,
					label: z.string().min(1).max(256),
					kind: z.enum([
						"allow_once",
						"allow_always",
						"reject_once",
						"reject_always",
					]),
				}),
			)
			.min(1)
			.max(16),
	}),
	"permission.resolved": z.object({
		requestId: boundedOpaqueIdSchema,
		optionId: nullableOpaqueIdSchema,
	}),
	"user_input.requested": z.object({
		requestId: boundedOpaqueIdSchema,
		title: z.string().min(1).max(512),
	}),
	"user_input.resolved": z.object({ requestId: boundedOpaqueIdSchema }),
	"model.changed": z.object({ model: aaRuntimeModelSchema }),
	"reasoning.changed": z.object({ reasoning: aaRuntimeReasoningSchema }),
	"message.delta": z.object({
		channel: z.enum(["assistant", "reasoning"]),
		content: z.object({
			type: boundedOpaqueIdSchema,
			text: z.string().max(8_192).optional(),
			data: z.unknown().optional(),
		}),
	}),
	"cancel.requested": z.object({}),
	"cancel.settled": z.object({
		outcome: z.enum(["cancelled", "too_late", "failed"]),
	}),
	"runtime.error": z.object({
		code: boundedOpaqueIdSchema.nullable(),
		message: z.string().min(1).max(2_048),
	}),
} as const satisfies Record<AARuntimeEventKind, z.ZodType>;

const aaRuntimeEventKindSchema = z.enum(
	Object.keys(eventPayloadSchemas) as [
		AARuntimeEventKind,
		...AARuntimeEventKind[],
	],
);

export const aaRuntimeEventEnvelopeSchema = z
	.object({
		contractVersion: z.literal(AA_RUNTIME_CONTRACT_VERSION),
		eventId: boundedOpaqueIdSchema,
		sessionKey: z
			.string()
			.min(1)
			.max(320)
			.regex(/^aa:(pi|grok):[A-Za-z0-9][A-Za-z0-9._:-]*$/),
		runtime: z.enum(["pi", "grok"]),
		workspaceId: boundedOpaqueIdSchema,
		terminalId: nullableOpaqueIdSchema,
		nativeSessionId: nullableOpaqueIdSchema,
		nativeTurnId: nullableOpaqueIdSchema,
		epoch: boundedOpaqueIdSchema,
		sequence: z.number().int().positive().safe(),
		occurredAt: timestampSchema,
		kind: aaRuntimeEventKindSchema,
		payload: z.unknown(),
	})
	.superRefine((event, context) => {
		if (event.sessionKey === event.terminalId) {
			context.addIssue({
				code: "custom",
				path: ["sessionKey"],
				message: "sessionKey must not equal terminalId",
			});
		}
		if (!event.sessionKey.startsWith(`aa:${event.runtime}:`)) {
			context.addIssue({
				code: "custom",
				path: ["sessionKey"],
				message: "sessionKey runtime namespace mismatch",
			});
		}
		const payloadResult = eventPayloadSchemas[event.kind].safeParse(
			event.payload,
		);
		if (!payloadResult.success) {
			for (const issue of payloadResult.error.issues) {
				context.addIssue({
					...issue,
					path: ["payload", ...issue.path],
				});
			}
		}
		if (event.kind === "snapshot" && payloadResult.success) {
			const snapshot = (
				payloadResult.data as AARuntimeEventPayloadMap["snapshot"]
			).snapshot;
			if (
				snapshot.sessionKey !== event.sessionKey ||
				snapshot.runtime !== event.runtime ||
				snapshot.workspaceId !== event.workspaceId ||
				snapshot.transport.terminalId !== event.terminalId ||
				snapshot.nativeSessionId !== event.nativeSessionId ||
				snapshot.nativeTurnId !== event.nativeTurnId ||
				snapshot.epoch !== event.epoch ||
				snapshot.lastSequence !== event.sequence ||
				snapshot.observedAt !== event.occurredAt
			) {
				context.addIssue({
					code: "custom",
					path: ["payload", "snapshot"],
					message: "snapshot identity must match its event envelope",
				});
			}
		}
		try {
			if (JSON.stringify(event).length > 32_768) {
				context.addIssue({
					code: "too_big",
					origin: "string",
					maximum: 32_768,
					inclusive: true,
					path: [],
					message: "runtime event exceeds 32 KiB",
				});
			}
		} catch {
			context.addIssue({
				code: "custom",
				path: [],
				message: "runtime event must be JSON serializable",
			});
		}
	});

export function parseAARuntimeEvent(value: unknown): AARuntimeEventEnvelope {
	const event = aaRuntimeEventEnvelopeSchema.parse(value);
	const payload = eventPayloadSchemas[event.kind].parse(event.payload);
	return { ...event, payload } as AARuntimeEventEnvelope;
}

export function getAARuntimeEventDeduplicationKeys(
	event: Pick<
		AARuntimeEventEnvelope,
		"eventId" | "sessionKey" | "epoch" | "sequence"
	>,
): readonly [eventId: string, position: string] {
	return [
		`event:${event.eventId}`,
		`position:${event.sessionKey}:${event.epoch}:${event.sequence}`,
	];
}

export type AARuntimeEventOrder =
	| "accept"
	| "duplicate"
	| "stale"
	| "gap"
	| "new_epoch";

export function classifyAARuntimeEventOrder(
	current: Pick<
		AARuntimeSessionSnapshot,
		"epoch" | "lastSequence" | "observedAt"
	>,
	event: Pick<AARuntimeEventEnvelope, "epoch" | "sequence" | "occurredAt">,
): AARuntimeEventOrder {
	if (event.epoch === current.epoch) {
		if (event.sequence === current.lastSequence) return "duplicate";
		if (event.sequence < current.lastSequence) return "stale";
		return event.sequence === current.lastSequence + 1 ? "accept" : "gap";
	}

	if (event.occurredAt < current.observedAt) return "stale";
	return event.sequence === 1 ? "new_epoch" : "gap";
}
