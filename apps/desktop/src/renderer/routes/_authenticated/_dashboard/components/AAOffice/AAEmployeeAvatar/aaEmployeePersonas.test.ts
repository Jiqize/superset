import { describe, expect, test } from "bun:test";
import { resolveAAEmployeePersona } from "./aaEmployeePersonas";

describe("AA employee persona registry", () => {
	const cases = [
		{ name: "Claude", agentId: undefined, expected: "claude" },
		{ name: "Custom", agentId: "builtin:codex", expected: "codex" },
		{ name: "OpenCode", agentId: undefined, expected: "opencode" },
		{ name: "Grok", agentId: "xai-grok", expected: "grok" },
		{ name: "Pi", agentId: "builtin:pi", expected: "pi" },
		{ name: "Copilot", agentId: "github-copilot", expected: "copilot" },
		{ name: "Mistral Vibe", agentId: undefined, expected: "mistral" },
		{ name: "Kimi Code", agentId: undefined, expected: "kimi" },
		{ name: "Superset CLI", agentId: undefined, expected: "superset" },
	] as const;

	for (const { name, agentId, expected } of cases) {
		test(`maps ${name} to the explicit ${expected} persona`, () => {
			expect(resolveAAEmployeePersona({ name, agentId }).id).toBe(expected);
		});
	}

	test("does not mistake Copilot for the Pi persona", () => {
		expect(resolveAAEmployeePersona({ name: "Copilot" }).id).toBe("copilot");
	});

	test("uses the explicit generic fallback for unknown presets", () => {
		expect(resolveAAEmployeePersona({ name: "Local helper" }).id).toBe(
			"generic",
		);
	});
});
