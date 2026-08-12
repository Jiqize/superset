import { describe, expect, it, mock } from "bun:test";
import type { HostAgentConfig } from "@superset/host-service/settings";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

mock.module("../AAEmployeeProfile", () => ({
	AAEmployeeProfile: ({ children }: { children: ReactNode }) => children,
}));

const { AAPiEmployeeRosterItem } = await import("./AAPiEmployeeRosterItem");

const piConfig: HostAgentConfig = {
	args: [],
	command: "pi",
	env: {},
	iconId: null,
	id: "real-host-pi-config",
	label: "Pi",
	order: 0,
	presetId: "pi",
	promptArgs: [],
	promptTransport: "argv",
	resumeArgs: ["--session"],
};

describe("AAPiEmployeeRosterItem", () => {
	it("renders available Pi as the explicit primary Tier 1 employee", () => {
		const html = renderToStaticMarkup(
			<AAPiEmployeeRosterItem
				availability="available"
				config={piConfig}
				isLaunching={false}
				onActivate={() => {}}
			/>,
		);
		expect(html).toContain("PI");
		expect(html).toContain("PRIMARY");
		expect(html).toContain(
			'aria-label="Pi, primary Tier 1 employee, available. Send Task Folder to Pi"',
		);
		expect(html).toContain("View Pi primary Tier 1 employee profile");
		expect(html).not.toContain("real-host-pi-config");
	});

	it("keeps missing Pi visible with truthful setup language and no launch claim", () => {
		const html = renderToStaticMarkup(
			<AAPiEmployeeRosterItem
				availability="setup-required"
				config={null}
				isLaunching={false}
				onActivate={() => {}}
			/>,
		);
		expect(html).toContain("SETUP REQUIRED");
		expect(html).toContain(
			'aria-label="Pi, primary Tier 1 employee, setup required. Open Agent settings"',
		);
		expect(html).not.toContain("Send Task Folder to Pi");
	});
});
