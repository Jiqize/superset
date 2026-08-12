import type { HostAgentConfig } from "@superset/host-service/settings";
import { findLinkedAgent } from "renderer/lib/agent-launch-command";

export const AA_PI_AGENT_SETTINGS_ROUTE = "/settings/agents" as const;

export type AAPiEmployeeAvailability =
	| "checking"
	| "available"
	| "setup-required"
	| "unavailable";

export interface AAPiLinkedPresetLike {
	agentId?: string;
}

export type AAPiEmployeeAction =
	| { kind: "launch"; config: HostAgentConfig }
	| { kind: "open-setup"; route: typeof AA_PI_AGENT_SETTINGS_ROUTE };

function compareAAHostAgentConfig(
	left: HostAgentConfig,
	right: HostAgentConfig,
): number {
	return left.order - right.order || left.id.localeCompare(right.id);
}

export function selectAAPiHostConfig(
	configs: readonly HostAgentConfig[],
): HostAgentConfig | null {
	let selected: HostAgentConfig | null = null;
	for (const config of configs) {
		if (config.presetId !== "pi") continue;
		if (!selected || compareAAHostAgentConfig(config, selected) < 0) {
			selected = config;
		}
	}
	return selected;
}

export function resolveAAPiEmployeeAvailability({
	config,
	isError,
	isPending,
}: {
	config: HostAgentConfig | null;
	isError: boolean;
	isPending: boolean;
}): AAPiEmployeeAvailability {
	if (config) return "available";
	if (isPending) return "checking";
	if (isError) return "unavailable";
	return "setup-required";
}

export function resolveAAPiEmployeeAction(
	config: HostAgentConfig | null,
): AAPiEmployeeAction {
	return config
		? { kind: "launch", config }
		: { kind: "open-setup", route: AA_PI_AGENT_SETTINGS_ROUTE };
}

export function isPresetLinkedToAAPi(
	preset: AAPiLinkedPresetLike,
	configs: readonly HostAgentConfig[],
): boolean {
	const piConfig = selectAAPiHostConfig(configs);
	if (!piConfig) return false;
	if (preset.agentId === piConfig.id) return true;
	const orderedConfigs = [...configs].sort(compareAAHostAgentConfig);
	return findLinkedAgent(orderedConfigs, preset.agentId)?.id === piConfig.id;
}

export function filterAACompatibilityPresets<T extends AAPiLinkedPresetLike>(
	presets: readonly T[],
	configs: readonly HostAgentConfig[],
): T[] {
	return presets.filter((preset) => !isPresetLinkedToAAPi(preset, configs));
}

export function getAAPiEmployeeAccessibleName(
	availability: AAPiEmployeeAvailability,
	isLaunching = false,
): string {
	const identity = "Pi, primary Tier 1 employee";
	if (isLaunching) return `${identity}, launching a new conversation`;
	switch (availability) {
		case "available":
			return `${identity}, available. Send Task Folder to Pi`;
		case "setup-required":
			return `${identity}, setup required. Open Agent settings`;
		case "unavailable":
			return `${identity}, setup status unavailable. Open Agent settings`;
		case "checking":
			return `${identity}, checking setup`;
	}
}
