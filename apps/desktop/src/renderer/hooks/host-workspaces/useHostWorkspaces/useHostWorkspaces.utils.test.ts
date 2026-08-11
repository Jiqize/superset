import { describe, expect, it } from "bun:test";
import { applyWorkspaceChangedEvent } from "./useHostWorkspaces.utils";

describe("applyWorkspaceChangedEvent", () => {
	it("updates the Renderer workspace cache with Host archive intent", () => {
		const next = applyWorkspaceChangedEvent(
			undefined,
			{
				eventType: "updated",
				workspace: {
					id: "workspace-archive",
					projectId: "project-archive",
					name: "Archive fixture",
					branch: "aa/archive-fixture",
					type: "worktree",
					worktreePath: "/tmp/archive-fixture",
					taskId: null,
					activeTasksArchived: true,
					createdByUserId: null,
					createdAt: 10,
					updatedAt: 20,
				},
			},
			{ organizationId: "organization-archive", machineId: "host-archive" },
			"workspace-archive",
		);

		expect(next?.[0]).toMatchObject({
			id: "workspace-archive",
			activeTasksArchived: true,
		});
	});
});
