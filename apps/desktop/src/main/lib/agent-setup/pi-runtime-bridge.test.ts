import { afterEach, describe, expect, it } from "bun:test";
import {
	chmodSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { getPiExtensionContent } from "./agent-wrappers-pi";

type Handler = (event: unknown, context: unknown) => unknown;

const testRoots: string[] = [];
afterEach(() => {
	for (const root of testRoots.splice(0)) {
		rmSync(root, { recursive: true, force: true });
	}
});

async function loadExtension() {
	const root = path.join(
		tmpdir(),
		`aa-pi-bridge-${process.pid}-${crypto.randomUUID()}`,
	);
	const hooksDir = path.join(root, "hooks");
	const capturePath = path.join(root, "events.ndjson");
	mkdirSync(hooksDir, { recursive: true });
	const notifyPath = path.join(hooksDir, "notify.sh");
	writeFileSync(
		notifyPath,
		`#!/bin/bash\ncat >> ${JSON.stringify(capturePath)}\nprintf '\\n' >> ${JSON.stringify(capturePath)}\n`,
	);
	chmodSync(notifyPath, 0o755);
	const transpiler = new Bun.Transpiler({ loader: "ts" });
	const modulePath = path.join(root, "superset-hooks.mjs");
	writeFileSync(modulePath, transpiler.transformSync(getPiExtensionContent()));
	testRoots.push(root);

	const prior = {
		home: process.env.SUPERSET_HOME_DIR,
		terminal: process.env.SUPERSET_TERMINAL_ID,
		workspace: process.env.SUPERSET_WORKSPACE_ID,
	};
	process.env.SUPERSET_HOME_DIR = root;
	process.env.SUPERSET_TERMINAL_ID = "terminal-1";
	process.env.SUPERSET_WORKSPACE_ID = "workspace-1";
	const extension = (await import(`${modulePath}?v=${crypto.randomUUID()}`))
		.default as (api: {
		on: (event: string, handler: Handler) => void;
	}) => void;
	const handlers = new Map<string, Handler>();
	extension({ on: (event, handler) => handlers.set(event, handler) });

	return {
		capturePath,
		handlers,
		restoreEnv() {
			if (prior.home === undefined) delete process.env.SUPERSET_HOME_DIR;
			else process.env.SUPERSET_HOME_DIR = prior.home;
			if (prior.terminal === undefined) delete process.env.SUPERSET_TERMINAL_ID;
			else process.env.SUPERSET_TERMINAL_ID = prior.terminal;
			if (prior.workspace === undefined)
				delete process.env.SUPERSET_WORKSPACE_ID;
			else process.env.SUPERSET_WORKSPACE_ID = prior.workspace;
		},
	};
}

async function waitForEvents(capturePath: string, count: number) {
	const deadline = Date.now() + 4_000;
	while (Date.now() < deadline) {
		try {
			const events = readFileSync(capturePath, "utf8")
				.trim()
				.split("\n")
				.filter(Boolean)
				.map((line) => JSON.parse(line) as Record<string, unknown>);
			if (events.length >= count) return events;
		} catch {
			// Capture file is created by the first asynchronous notify process.
		}
		await Bun.sleep(20);
	}
	throw new Error(`Timed out waiting for ${count} Pi bridge events`);
}

function context(overrides: Record<string, unknown> = {}) {
	return {
		hasUI: true,
		mode: "tui",
		sessionManager: { getSessionId: () => "native-session" },
		model: {
			provider: "anthropic",
			id: "claude-sonnet-4",
			name: "Claude Sonnet 4",
		},
		thinkingLevel: "high",
		...overrides,
	};
}

describe("Pi runtime bridge v2", () => {
	it("emits a native identity snapshot followed by gapless structured events", async () => {
		const loaded = await loadExtension();
		try {
			await loaded.handlers.get("session_start")?.(
				{ type: "session_start", reason: "startup" },
				context(),
			);
			await loaded.handlers.get("agent_start")?.(
				{ type: "agent_start" },
				context(),
			);
			await loaded.handlers.get("tool_execution_start")?.(
				{
					type: "tool_execution_start",
					toolCallId: "call-1",
					toolName: "bash",
					args: { secret: "must-not-leak" },
				},
				context(),
			);
			await loaded.handlers.get("tool_execution_update")?.(
				{
					type: "tool_execution_update",
					toolCallId: "call-1",
					toolName: "bash",
					args: { secret: "must-not-leak" },
					partialResult: "must-not-leak",
				},
				context(),
			);
			await loaded.handlers.get("tool_execution_end")?.(
				{
					type: "tool_execution_end",
					toolCallId: "call-1",
					toolName: "bash",
					result: "must-not-leak",
					isError: false,
				},
				context(),
			);
			await loaded.handlers.get("agent_settled")?.(
				{ type: "agent_settled" },
				context(),
			);

			const events = await waitForEvents(loaded.capturePath, 7);
			expect(events.map((event) => event.kind)).toEqual([
				"snapshot",
				"session.started",
				"turn.started",
				"tool.started",
				"tool.progress",
				"tool.finished",
				"turn.settled",
			]);
			expect(events.map((event) => event.sequence)).toEqual([
				1, 2, 3, 4, 5, 6, 7,
			]);
			expect(new Set(events.map((event) => event.epoch)).size).toBe(1);
			expect(events[0]).toMatchObject({
				hook_event_name: "AARuntime",
				contractVersion: "0.1",
				sessionKey: "aa:pi:native-session",
				nativeSessionId: "native-session",
				workspaceId: "workspace-1",
				terminalId: "terminal-1",
				payload: {
					snapshot: {
						model: {
							provider: "anthropic",
							id: "claude-sonnet-4",
							displayName: "Claude Sonnet 4",
						},
						reasoning: { value: "high", availableValues: null },
						resume: { canResume: true, mechanism: "pi_session" },
					},
				},
			});
			expect(JSON.stringify(events)).not.toContain("must-not-leak");
		} finally {
			loaded.restoreEnv();
		}
	});

	it("filters print/json helpers and emits model/reasoning changes only from runtime events", async () => {
		const loaded = await loadExtension();
		try {
			await loaded.handlers.get("session_start")?.(
				{ type: "session_start", reason: "startup" },
				context({ hasUI: false, mode: "print" }),
			);
			await Bun.sleep(100);
			expect(() => readFileSync(loaded.capturePath)).toThrow();

			await loaded.handlers.get("session_start")?.(
				{ type: "session_start", reason: "resume" },
				context(),
			);
			await loaded.handlers.get("model_select")?.(
				{
					type: "model_select",
					model: { provider: "openai", id: "gpt-5", name: "GPT-5" },
				},
				context(),
			);
			await loaded.handlers.get("thinking_level_select")?.(
				{ type: "thinking_level_select", level: "xhigh" },
				context(),
			);

			const events = await waitForEvents(loaded.capturePath, 4);
			expect(events[2]).toMatchObject({
				kind: "model.changed",
				payload: {
					model: { provider: "openai", id: "gpt-5", displayName: "GPT-5" },
				},
			});
			expect(events[3]).toMatchObject({
				kind: "reasoning.changed",
				payload: { reasoning: { value: "xhigh", availableValues: null } },
			});
		} finally {
			loaded.restoreEnv();
		}
	});
});
