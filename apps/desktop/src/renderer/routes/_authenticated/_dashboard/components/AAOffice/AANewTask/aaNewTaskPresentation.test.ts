import { describe, expect, it } from "bun:test";
import type { HostAgentConfig } from "@superset/host-service/settings";
import {
	buildAANewTaskBranch,
	buildAANewTaskCreateSnapshot,
	selectAANewTaskPiConfig,
	validateAANewTaskTitle,
} from "./aaNewTaskPresentation";

function agent(
	id: string,
	presetId: string,
	overrides: Partial<HostAgentConfig> = {},
): HostAgentConfig {
	return {
		id,
		presetId,
		iconId: null,
		label: presetId,
		command: presetId,
		args: [],
		promptTransport: "argv",
		promptArgs: [],
		resumeArgs: [],
		env: {},
		order: 0,
		...overrides,
	};
}

describe("validateAANewTaskTitle", () => {
	it("rejects an empty title without deriving one from runtime history", () => {
		expect(validateAANewTaskTitle(" \n\t ")).toEqual({
			ok: false,
			error: "Enter a task title.",
		});
	});

	it("normalizes whitespace and uses the exact title as the Pi prompt", () => {
		expect(validateAANewTaskTitle("  Fix   login\nstate  ")).toEqual({
			ok: true,
			title: "Fix login state",
			prompt: "Fix login state",
		});
	});

	it("preserves Unicode and applies the existing 48-codepoint contract", () => {
		const exact = "办".repeat(48);
		const long = "办".repeat(60);

		expect(validateAANewTaskTitle(exact)).toMatchObject({
			ok: true,
			title: exact,
		});
		const result = validateAANewTaskTitle(long);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect([...result.title]).toHaveLength(48);
			expect(result.prompt).toBe(result.title);
		}
	});
});

describe("buildAANewTaskBranch", () => {
	const workspaceId = "123e4567-e89b-42d3-a456-426614174000";

	it("combines a sanitized eight-character seed with a compact UUID", () => {
		expect(buildAANewTaskBranch("Fix login state", workspaceId)).toBe(
			"task-fix-logi-123e4567e89b42d3a456426614174000",
		);
	});

	it("falls back to the compact UUID for Unicode-only titles", () => {
		expect(buildAANewTaskBranch("修复登录", workspaceId)).toBe(
			"task-123e4567e89b42d3a456426614174000",
		);
	});

	it("is stable for one ID, distinct for different IDs, and bounded", () => {
		const first = buildAANewTaskBranch(
			"../Fix .lock / control\u0000",
			workspaceId,
		);
		const second = buildAANewTaskBranch(
			"../Fix .lock / control\u0000",
			"123e4567-e89b-42d3-a456-426614174001",
		);

		expect(first).toBe(
			buildAANewTaskBranch("../Fix .lock / control\u0000", workspaceId),
		);
		expect(second).not.toBe(first);
		expect(first.length).toBeLessThanOrEqual(46);
		expect(first).not.toMatch(/[/\\]/);
		expect([...first].some((character) => character.charCodeAt(0) < 32)).toBe(
			false,
		);
		expect(first).not.toEndWith(".lock");
	});

	it("requires a UUID so accidental branch collisions fail closed", () => {
		expect(() => buildAANewTaskBranch("Task", "workspace-1")).toThrow(
			"valid Workspace UUID",
		);
	});
});

describe("selectAANewTaskPiConfig", () => {
	it("selects the first ordered real Host Pi config", () => {
		const configs = [
			agent("codex-config", "codex", { order: 0 }),
			agent("pi-primary", "pi", { order: 1 }),
			agent("pi-secondary", "pi", { order: 2 }),
		];

		expect(selectAANewTaskPiConfig(configs)?.id).toBe("pi-primary");
	});

	it("does not fabricate a fallback employee", () => {
		expect(
			selectAANewTaskPiConfig([agent("codex-config", "codex")]),
		).toBeNull();
	});
});

describe("buildAANewTaskCreateSnapshot", () => {
	it("builds the one-call Pi-first contract without model, effort, or resume controls", () => {
		const workspaceId = "123e4567-e89b-42d3-a456-426614174000";
		expect(
			buildAANewTaskCreateSnapshot({
				baseBranch: "main",
				piConfigId: "pi-config",
				projectId: "project-1",
				title: "Fix login state",
				workspaceId,
			}),
		).toEqual({
			id: workspaceId,
			projectId: "project-1",
			name: "Fix login state",
			branch: "task-fix-logi-123e4567e89b42d3a456426614174000",
			baseBranch: "main",
			agents: [{ agent: "pi-config", prompt: "Fix login state" }],
		});
	});
});
