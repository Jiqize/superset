import { Database } from "bun:sqlite";
import { describe, expect, it, mock } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import type { HostDb } from "../../../db";
import * as schema from "../../../db/schema";
import { projects, workspaces } from "../../../db/schema";
import type { EventBus } from "../../../events";
import type { HostServiceContext } from "../../../types";
import { workspaceRouter } from "./workspace";

const MIGRATIONS_FOLDER = resolve(import.meta.dir, "../../../../drizzle");
const ORGANIZATION_ID = "00000000-0000-0000-0000-000000000001";
const PROJECT_ID = "22222222-2222-4222-8222-222222222222";
const WORKSPACE_ID = "33333333-3333-4333-8333-333333333333";

function createContext({ isAuthenticated = true } = {}) {
	const sqlite = new Database(":memory:");
	const db = drizzle(sqlite, { schema }) as unknown as HostDb;
	migrate(db as never, { migrationsFolder: MIGRATIONS_FOLDER });
	db.insert(projects)
		.values({ id: PROJECT_ID, name: "Archive fixture", repoPath: "/tmp/repo" })
		.run();
	db.insert(workspaces)
		.values({
			id: WORKSPACE_ID,
			projectId: PROJECT_ID,
			worktreePath: "/tmp/repo-worktree",
			branch: "aa/archive-fixture",
			name: "Archive fixture",
		})
		.run();

	const broadcastWorkspaceChanged = mock(() => {});
	const eventBus = {
		broadcastWorkspaceChanged,
	} as unknown as EventBus;
	const ctx = {
		db,
		eventBus,
		isAuthenticated,
		organizationId: ORGANIZATION_ID,
	} as unknown as HostServiceContext;

	return { broadcastWorkspaceChanged, ctx };
}

interface ArchiveIntentCaller {
	setActiveTasksArchived(input: {
		id: string;
		archived: boolean;
	}): Promise<Record<string, unknown>>;
}

describe("workspace archive intent", () => {
	it("migrates a pre-field workspace row to the false default", () => {
		const sqlite = new Database(":memory:");
		sqlite.exec("CREATE TABLE workspaces (id text PRIMARY KEY NOT NULL)");
		sqlite.exec("INSERT INTO workspaces (id) VALUES ('existing-workspace')");
		sqlite.exec(
			readFileSync(
				resolve(MIGRATIONS_FOLDER, "0019_short_living_lightning.sql"),
				"utf8",
			),
		);

		const existing = sqlite
			.query("SELECT active_tasks_archived FROM workspaces WHERE id = ?")
			.get("existing-workspace") as { active_tasks_archived: number };
		expect(existing.active_tasks_archived).toBe(0);
	});

	it("defaults existing workspaces to unarchived in the public read model", async () => {
		const { ctx } = createContext();

		const rows = await workspaceRouter.createCaller(ctx).list();

		expect(rows).toHaveLength(1);
		expect(
			(rows[0] as unknown as Record<string, unknown>).activeTasksArchived,
		).toBe(false);
	});

	it("persists archive intent through the public workspace mutation", async () => {
		const { broadcastWorkspaceChanged, ctx } = createContext();
		const caller = workspaceRouter.createCaller(
			ctx,
		) as unknown as ArchiveIntentCaller;

		const updated = await caller.setActiveTasksArchived({
			id: WORKSPACE_ID,
			archived: true,
		});

		expect(updated.activeTasksArchived).toBe(true);
		expect((await workspaceRouter.createCaller(ctx).list())[0]).toMatchObject({
			id: WORKSPACE_ID,
			activeTasksArchived: true,
		});
		expect(broadcastWorkspaceChanged).toHaveBeenCalledWith(
			expect.objectContaining({
				eventType: "updated",
				workspaceId: WORKSPACE_ID,
				workspace: expect.objectContaining({ activeTasksArchived: true }),
			}),
		);
	});

	it("treats setting the current archive value as a successful no-op", async () => {
		const { broadcastWorkspaceChanged, ctx } = createContext();
		const caller = workspaceRouter.createCaller(
			ctx,
		) as unknown as ArchiveIntentCaller;

		await caller.setActiveTasksArchived({ id: WORKSPACE_ID, archived: true });
		const repeated = await caller.setActiveTasksArchived({
			id: WORKSPACE_ID,
			archived: true,
		});

		expect(repeated.activeTasksArchived).toBe(true);
		expect(broadcastWorkspaceChanged).toHaveBeenCalledTimes(1);
	});

	it("rejects unknown workspaces without creating archive state", async () => {
		const { broadcastWorkspaceChanged, ctx } = createContext();
		const caller = workspaceRouter.createCaller(
			ctx,
		) as unknown as ArchiveIntentCaller;

		expect(
			caller.setActiveTasksArchived({
				id: "44444444-4444-4444-8444-444444444444",
				archived: true,
			}),
		).rejects.toMatchObject({ code: "NOT_FOUND" });
		expect(broadcastWorkspaceChanged).not.toHaveBeenCalled();
	});

	it("requires the normal Host authentication boundary", async () => {
		const { ctx } = createContext({ isAuthenticated: false });
		const caller = workspaceRouter.createCaller(
			ctx,
		) as unknown as ArchiveIntentCaller;

		expect(
			caller.setActiveTasksArchived({ id: WORKSPACE_ID, archived: true }),
		).rejects.toMatchObject({ code: "UNAUTHORIZED" });
	});
});
