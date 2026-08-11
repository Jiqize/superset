import { describe, expect, it } from "bun:test";
import {
	createWorkspaceSuccessOutcome,
	type WorkspacesCreateResult,
} from "./workspaceCreateOutcome";

describe("createWorkspaceSuccessOutcome", () => {
	it("keeps the existing workspace id and exposes the untouched Host result", () => {
		const result = {
			workspace: { id: "workspace-canonical", projectId: "project-1" },
			terminals: [{ terminalId: "terminal-setup" }],
			agents: [
				{
					ok: true,
					kind: "terminal",
					sessionId: "terminal-pi",
					label: "Pi",
				},
			],
		} as unknown as WorkspacesCreateResult;

		const outcome = createWorkspaceSuccessOutcome(result);

		expect(outcome.workspaceId).toBe("workspace-canonical");
		expect(outcome.result).toBe(result);
		expect(outcome.ok).toBe(true);
	});
});
