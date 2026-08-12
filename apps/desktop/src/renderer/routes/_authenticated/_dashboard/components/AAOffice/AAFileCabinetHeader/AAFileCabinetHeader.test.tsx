import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAFileCabinetHeader } from "./AAFileCabinetHeader";
import {
	AA_FILE_CABINET_PANEL_ID,
	getAAFileCabinetTabId,
} from "./aaFileCabinetAccessibility";

const sidebarHeaderSource = await Bun.file(
	new URL(
		"../../../v2-workspace/$workspaceId/components/WorkspaceSidebar/components/SidebarHeader/SidebarHeader.tsx",
		import.meta.url,
	),
).text();

describe("AA File Cabinet header", () => {
	it("presents real output and delivery state as separate records", () => {
		const markup = renderToStaticMarkup(
			<AAFileCabinetHeader changedFileCount={2} deliveryState="Ready" />,
		);

		expect(markup).toContain("FILE CABINET");
		expect(markup).toContain("OUTPUT");
		expect(markup).toContain("2 CHANGED");
		expect(markup).toContain("DELIVERY");
		expect(markup).toContain("READY");
		expect(markup).not.toContain("MARKED");
	});

	it("exposes an explicit selected tab and tabpanel relationship", () => {
		expect(getAAFileCabinetTabId("changes")).toBe(
			"aa-file-cabinet-tab-changes",
		);
		expect(AA_FILE_CABINET_PANEL_ID).toBe("aa-file-cabinet-panel");
		expect(sidebarHeaderSource).toContain('role="tablist"');
		expect(sidebarHeaderSource).toContain('role="tab"');
		expect(sidebarHeaderSource).toContain("aria-selected={isActive}");
		expect(sidebarHeaderSource).toContain(
			"onKeyDown={(event) => handleAATabKeyDown(event, index)}",
		);
	});
});
