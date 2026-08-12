import { describe, expect, it } from "bun:test";
import { resolveAAApplicationPagePresentation } from "./aaApplicationPagePresentation";

describe("AA application page presentation", () => {
	it("uses the accepted work-model language for dashboard routes", () => {
		expect(
			resolveAAApplicationPagePresentation("/v2-workspaces"),
		).toMatchObject({
			route: "home",
			title: "Briefcases & Work Folders",
		});
		expect(
			resolveAAApplicationPagePresentation("/new-workspace"),
		).toMatchObject({
			route: "advanced-workspace",
			title: "New Work Folder · Advanced",
		});
		expect(resolveAAApplicationPagePresentation("/tasks/task-1")).toMatchObject(
			{
				route: "tasks",
				title: "Tasks",
			},
		);
	});

	it("distinguishes settings sections while retaining one route family", () => {
		expect(
			resolveAAApplicationPagePresentation("/settings/appearance"),
		).toMatchObject({ route: "settings", title: "Appearance" });
		expect(
			resolveAAApplicationPagePresentation("/settings/keyboard"),
		).toMatchObject({ route: "settings", title: "Keyboard" });
	});

	it("keeps routes outside AA untouched", () => {
		expect(resolveAAApplicationPagePresentation("/workspaces")).toBeNull();
	});
});
