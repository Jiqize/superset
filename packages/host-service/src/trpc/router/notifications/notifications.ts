import {
	type AARuntimeEventEnvelope,
	parseAARuntimeEvent,
} from "@superset/session-protocol";
import type { AgentIdentity } from "@superset/shared/agent-identity";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { terminalSessions } from "../../../db/schema";
import { mapEventType } from "../../../events";
import { publicProcedure, router } from "../../index";

// Hook scripts emit "" for unset env vars; we coerce to undefined so the
// AgentIdentity broadcast carries only meaningful fields.
const agentIdentityInput = z
	.object({
		agentId: z.string().optional(),
		sessionId: z.string().optional(),
		definitionId: z.string().optional(),
	})
	.optional();

const hookInput = z.object({
	terminalId: z.string().optional(),
	eventType: z.string().optional(),
	agent: agentIdentityInput,
	runtimeEvent: z.unknown().optional(),
});

function trimOrUndefined(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function normalizeAgentIdentity(
	agent: z.infer<typeof agentIdentityInput>,
): AgentIdentity | undefined {
	const agentId = trimOrUndefined(agent?.agentId);
	if (!agentId) return undefined;
	const sessionId = trimOrUndefined(agent?.sessionId);
	const definitionId = trimOrUndefined(agent?.definitionId);
	return {
		agentId: agentId as AgentIdentity["agentId"],
		...(sessionId ? { sessionId } : {}),
		...(definitionId
			? { definitionId: definitionId as AgentIdentity["definitionId"] }
			: {}),
	};
}

export const notificationsRouter = router({
	/**
	 * Agent lifecycle hook. The shell hook POSTs here; we normalize, resolve
	 * the terminal's workspace, and fan out over the WS event bus.
	 *
	 * Intentionally unauthenticated: a caller can only trigger a chime and a
	 * sidebar indicator. Reusing the host-service PSK would leak it into every
	 * agent shell's env for zero practical gain.
	 */
	hook: publicProcedure.input(hookInput).mutation(async ({ ctx, input }) => {
		if (input.runtimeEvent !== undefined) {
			if (!input.terminalId) {
				return { success: true, ignored: true as const };
			}

			let runtimeEvent: AARuntimeEventEnvelope;
			try {
				runtimeEvent = parseAARuntimeEvent(input.runtimeEvent);
			} catch {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Malformed AA runtime event",
				});
			}
			if (
				runtimeEvent.runtime !== "pi" ||
				runtimeEvent.terminalId !== input.terminalId ||
				runtimeEvent.nativeSessionId === null
			) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "AA runtime event identity mismatch",
				});
			}

			const terminalSession = ctx.db.query.terminalSessions
				.findFirst({
					where: eq(terminalSessions.id, input.terminalId),
					columns: { originWorkspaceId: true },
				})
				.sync();
			if (!terminalSession?.originWorkspaceId) {
				return { success: true, ignored: true as const };
			}
			if (runtimeEvent.workspaceId !== terminalSession.originWorkspaceId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "AA runtime event workspace mismatch",
				});
			}

			const result = ctx.runtime.aaRuntime.ingest(runtimeEvent);
			return {
				success: true,
				ignored: result.status !== "accepted",
				runtimeStatus: result.status,
			};
		}

		const eventType = mapEventType(input.eventType);
		if (!eventType) {
			return { success: true, ignored: true as const };
		}

		if (!input.terminalId) {
			return { success: true, ignored: true as const };
		}

		const terminalSession = ctx.db.query.terminalSessions
			.findFirst({
				where: eq(terminalSessions.id, input.terminalId),
				columns: { originWorkspaceId: true },
			})
			.sync();
		if (!terminalSession?.originWorkspaceId) {
			return { success: true, ignored: true as const };
		}

		const agent = normalizeAgentIdentity(input.agent);
		const occurredAt = Date.now();

		ctx.eventBus.broadcastAgentLifecycle({
			workspaceId: terminalSession.originWorkspaceId,
			eventType,
			terminalId: input.terminalId,
			...(agent ? { agent } : {}),
			occurredAt,
		});

		ctx.terminalAgentStore.recordEvent({
			terminalId: input.terminalId,
			workspaceId: terminalSession.originWorkspaceId,
			eventType,
			...(agent?.agentId ? { agentId: agent.agentId } : {}),
			...(agent?.sessionId ? { agentSessionId: agent.sessionId } : {}),
			...(agent?.definitionId ? { definitionId: agent.definitionId } : {}),
			occurredAt,
		});

		return { success: true, ignored: false as const };
	}),
});
