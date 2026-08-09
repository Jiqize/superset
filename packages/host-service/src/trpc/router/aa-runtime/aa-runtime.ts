import { z } from "zod";
import { protectedProcedure, router } from "../../index";

const workspaceScope = z.object({ workspaceId: z.string().min(1).max(256) });

export const aaRuntimeRouter = router({
	list: protectedProcedure
		.input(
			workspaceScope.extend({
				runtime: z.enum(["pi", "grok"]).optional(),
			}),
		)
		.query(({ ctx, input }) =>
			ctx.runtime.aaRuntime.list({
				workspaceId: input.workspaceId,
				...(input.runtime ? { runtime: input.runtime } : {}),
			}),
		),

	findByTerminal: protectedProcedure
		.input(workspaceScope.extend({ terminalId: z.string().min(1).max(256) }))
		.query(({ ctx, input }) => {
			const snapshot = ctx.runtime.aaRuntime.findByTerminal(input.terminalId);
			return snapshot?.workspaceId === input.workspaceId ? snapshot : null;
		}),

	get: protectedProcedure
		.input(workspaceScope.extend({ sessionKey: z.string().min(1).max(512) }))
		.query(({ ctx, input }) => {
			const snapshot = ctx.runtime.aaRuntime.get(input.sessionKey);
			return snapshot?.workspaceId === input.workspaceId ? snapshot : null;
		}),

	events: protectedProcedure
		.input(
			workspaceScope.extend({
				sessionKey: z.string().min(1).max(512),
				limit: z.number().int().min(1).max(256).default(100),
			}),
		)
		.query(({ ctx, input }) => {
			const snapshot = ctx.runtime.aaRuntime.get(input.sessionKey);
			if (snapshot?.workspaceId !== input.workspaceId) return [];
			return ctx.runtime.aaRuntime.listEvents(input.sessionKey, input.limit);
		}),
});
