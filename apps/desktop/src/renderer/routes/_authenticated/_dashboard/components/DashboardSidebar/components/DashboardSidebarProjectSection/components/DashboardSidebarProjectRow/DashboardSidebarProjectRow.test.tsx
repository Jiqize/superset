import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardSidebarProjectRow } from "./DashboardSidebarProjectRow";

function renderRow(isNewTaskAvailable: boolean) {
	return renderToStaticMarkup(
		<DashboardSidebarProjectRow
			projectName="aa-fixture"
			iconUrl={null}
			projectColor={null}
			isCollapsed={false}
			isRenaming={false}
			renameValue="aa-fixture"
			onRenameValueChange={() => {}}
			onSubmitRename={() => {}}
			onCancelRename={() => {}}
			onStartRename={() => {}}
			onToggleCollapse={() => {}}
			onNewTask={() => {}}
			isNewTaskAvailable={isNewTaskAvailable}
			onNewWorkspace={() => {}}
		/>,
	);
}

describe("DashboardSidebarProjectRow AA New Task entry", () => {
	it("keeps the functional project name and exposes a visible New Task action", () => {
		const markup = renderRow(true);

		expect(markup).toContain("aa-fixture");
		expect(markup).toContain("NEW TASK");
		expect(markup).toContain('aria-label="New task in aa-fixture"');
		expect(markup).toContain('aria-label="New workspace"');
	});

	it("disables New Task when the serving Host is unavailable", () => {
		const markup = renderRow(false);

		expect(markup).toContain('aria-label="New task in aa-fixture"');
		expect(markup).toContain("disabled");
	});
});
