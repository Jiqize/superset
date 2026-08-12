import { describe, expect, it } from "bun:test";
import type { HostAgentConfig } from "@superset/host-service/settings";
import {
	AA_PI_AGENT_SETTINGS_ROUTE,
	filterAACompatibilityPresets,
	getAAPiEmployeeAccessibleName,
	isPresetLinkedToAAPi,
	resolveAAPiEmployeeAction,
	resolveAAPiEmployeeAvailability,
	selectAAPiHostConfig,
} from "./aaPiEmployeePresentation";

function config(id: string, presetId: string, order: number): HostAgentConfig {
	return {
		args: [],
		command: presetId,
		env: {},
		iconId: null,
		id,
		label: presetId.toUpperCase(),
		order,
		presetId,
		promptArgs: [],
		promptTransport: "argv",
		resumeArgs: [],
	};
}

describe("AA Pi employee presentation", () => {
	it("selects the first ordered real Host Pi config", () => {
		const configs = [
			config("pi-later", "pi", 9),
			config("codex", "codex", 0),
			config("pi-primary", "pi", 2),
		];
		expect(selectAAPiHostConfig(configs)?.id).toBe("pi-primary");
		expect(
			selectAAPiHostConfig([config("pi-z", "pi", 2), config("pi-a", "pi", 2)])
				?.id,
		).toBe("pi-a");
	});

	it("keeps Pi visible truthfully while config availability changes", () => {
		const pi = config("pi", "pi", 0);
		expect(
			resolveAAPiEmployeeAvailability({
				config: pi,
				isError: false,
				isPending: false,
			}),
		).toBe("available");
		expect(
			resolveAAPiEmployeeAvailability({
				config: null,
				isError: false,
				isPending: true,
			}),
		).toBe("checking");
		expect(
			resolveAAPiEmployeeAvailability({
				config: null,
				isError: false,
				isPending: false,
			}),
		).toBe("setup-required");
		expect(AA_PI_AGENT_SETTINGS_ROUTE).toBe("/settings/agents");
		expect(resolveAAPiEmployeeAction(null)).toEqual({
			kind: "open-setup",
			route: "/settings/agents",
		});
		expect(resolveAAPiEmployeeAction(pi)).toEqual({
			kind: "launch",
			config: pi,
		});
	});

	it("deduplicates only presets that resolve to the selected Pi config", () => {
		const configs = [
			config("pi-later", "pi", 9),
			config("codex-primary", "codex", 1),
			config("pi-primary", "pi", 0),
		];
		const presets = [
			{ agentId: "codex-primary", id: "codex" },
			{ agentId: "pi-primary", id: "pi-exact" },
			{ agentId: "pi", id: "pi-legacy" },
			{ id: "unlinked-pi-name" },
		];

		expect(isPresetLinkedToAAPi(presets[1] ?? {}, configs)).toBe(true);
		expect(isPresetLinkedToAAPi(presets[2] ?? {}, configs)).toBe(true);
		expect(filterAACompatibilityPresets(presets, configs)).toEqual([
			presets[0],
			presets[3],
		]);
		expect(presets).toHaveLength(4);
	});

	it("keeps functional status explicit in accessible copy", () => {
		expect(getAAPiEmployeeAccessibleName("available")).toContain(
			"primary Tier 1",
		);
		expect(getAAPiEmployeeAccessibleName("setup-required")).toContain(
			"Open Agent settings",
		);
		expect(getAAPiEmployeeAccessibleName("checking")).toContain(
			"checking setup",
		);
	});
});
