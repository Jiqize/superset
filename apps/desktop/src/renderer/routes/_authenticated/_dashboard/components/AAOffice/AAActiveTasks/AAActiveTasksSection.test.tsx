import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAActiveTasksSection } from "./AAActiveTasksSection";
import type { AAActiveTaskProjection } from "./aaActiveTaskProjection";

describe("AAActiveTasksSection", () => {
	it("renders a compact task-first Briefcase projection with complete labels", () => {
		const projection: AAActiveTaskProjection = {
			rows: [
				{
					changedFileCount: 3,
					discriminator: "#A3F2",
					employee: "PI",
					evidenceClass: "live",
					isArchived: false,
					isSelected: true,
					lifecycle: "WORKING",
					personaId: "pi",
					stableOrder: 0,
					title: "Fix restart status",
					workspaceId: "workspace-secret-id",
				},
				{
					changedFileCount: 0,
					employee: "PI",
					evidenceClass: "resumable",
					isArchived: false,
					isSelected: false,
					personaId: "pi",
					stableOrder: 1,
					title: "Improve sidebar",
					workspaceId: "workspace-saved-id",
				},
			],
		};

		const html = renderToStaticMarkup(
			<AAActiveTasksSection projection={projection} onSelect={() => {}} />,
		);

		expect(html).toContain("ACTIVE TASKS · CURRENT");
		expect(html).toContain("SAVED / RESUMABLE");
		expect(html).toContain("Fix restart status");
		expect(html).toContain("#A3F2");
		expect(html).toContain("<span>PI</span><span>·</span><span>LIVE</span>");
		expect(html).toContain("<span>WORKING</span>");
		expect(html).toContain("3</strong><small>CHANGED");
		expect(html).toContain(
			'aria-label="Fix restart status #A3F2, PI, LIVE WORKING, 3 changed files"',
		);
		expect(html).not.toContain("workspace-secret-id");
	});

	it("renders Archive actions and a collapsed Archived group with Unarchive", () => {
		const projection: AAActiveTaskProjection = {
			rows: [
				{
					changedFileCount: 1,
					employee: "CODEX",
					evidenceClass: "untracked",
					isArchived: false,
					isSelected: false,
					personaId: "codex",
					stableOrder: 0,
					title: "Compatibility task",
					workspaceId: "workspace-codex",
				},
				{
					changedFileCount: 3,
					employee: "PI",
					evidenceClass: "unavailable",
					isArchived: true,
					isSelected: false,
					personaId: "pi",
					stableOrder: 1,
					title: "Ended Pi task",
					workspaceId: "workspace-pi-ended",
				},
			],
		};

		const html = renderToStaticMarkup(
			<AAActiveTasksSection
				projection={projection}
				onSelect={() => {}}
				onArchiveChange={() => {}}
			/>,
		);

		expect(html).toContain(
			'aria-label="Archive Task Folder: Compatibility task"',
		);
		expect(html).toContain("ARCHIVED");
		expect(html).toContain("Ended Pi task");
		expect(html).toContain("SESSION UNAVAILABLE");
		expect(html).toContain('aria-label="Unarchive Task Folder: Ended Pi task"');
		expect(html).toContain('<details class="aa-active-tasks__archive"');
		expect(html).not.toContain(
			'<details class="aa-active-tasks__archive" open',
		);
	});

	it("keeps a selected archived Task Folder visible as the current context", () => {
		const projection: AAActiveTaskProjection = {
			rows: [
				{
					changedFileCount: 0,
					employee: "PI",
					evidenceClass: "resumable",
					isArchived: true,
					isSelected: true,
					personaId: "pi",
					stableOrder: 0,
					title: "Archived current work",
					workspaceId: "workspace-archived-current",
				},
			],
		};

		const html = renderToStaticMarkup(
			<AAActiveTasksSection projection={projection} onSelect={() => {}} />,
		);

		expect(html).toContain("ARCHIVED · CURRENT");
		expect(html).toContain(
			'<details class="aa-active-tasks__archive" data-current="true" open="">',
		);
		expect(html).toContain('data-active="true" data-archived="true"');
	});

	it("does not manufacture a task row while evidence is loading", () => {
		const html = renderToStaticMarkup(
			<AAActiveTasksSection
				isLoading
				projection={{ rows: [] }}
				onSelect={() => {}}
			/>,
		);

		expect(html).toContain("CHECKING TASK EVIDENCE");
		expect(html).not.toContain("aa-active-task-row");
	});
});
