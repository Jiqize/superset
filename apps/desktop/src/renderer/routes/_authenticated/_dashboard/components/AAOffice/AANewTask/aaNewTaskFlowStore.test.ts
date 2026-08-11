import { describe, expect, it } from "bun:test";
import {
	canTransitionAANewTaskStage,
	createAANewTaskFlowStore,
} from "./aaNewTaskFlowStore";

const flow = {
	flowId: "123e4567-e89b-42d3-a456-426614174000",
	workspaceId: "123e4567-e89b-42d3-a456-426614174000",
	projectId: "project-1",
	projectName: "AA",
	hostId: "host-1",
	title: "Fix login state",
	branch: "task-fix-logi-123e4567e89b42d3a456426614174000",
	piConfigId: "pi-config",
};

describe("AA New Task flow store", () => {
	it("accepts only the truthful provisioning sequence", () => {
		expect(canTransitionAANewTaskStage("editing", "validating")).toBe(true);
		expect(
			canTransitionAANewTaskStage("validating", "provisioning-work-folder"),
		).toBe(true);
		expect(
			canTransitionAANewTaskStage(
				"provisioning-work-folder",
				"opening-workspace",
			),
		).toBe(true);
		expect(
			canTransitionAANewTaskStage("opening-workspace", "starting-pi"),
		).toBe(true);
		expect(
			canTransitionAANewTaskStage("starting-pi", "connecting-runtime"),
		).toBe(true);
		expect(canTransitionAANewTaskStage("connecting-runtime", "ready")).toBe(
			true,
		);
		expect(
			canTransitionAANewTaskStage(
				"provisioning-work-folder",
				"working" as never,
			),
		).toBe(false);
		expect(canTransitionAANewTaskStage("editing", "ready")).toBe(false);
	});

	it("ignores stale flow events and retains the active flow", () => {
		const store = createAANewTaskFlowStore();
		store.getState().beginFlow(flow);

		expect(
			store.getState().transition("stale-flow", "provisioning-work-folder"),
		).toBe(false);
		expect(store.getState().activeFlow?.stage).toBe("validating");
	});

	it("dismisses progress without pretending to cancel resources", () => {
		const store = createAANewTaskFlowStore();
		store.getState().beginFlow(flow);
		store.getState().dismissSurface();

		expect(store.getState().surfaceVisible).toBe(false);
		expect(store.getState().activeFlow?.flowId).toBe(flow.flowId);
	});

	it("records a typed failure and permits a matching runtime recheck", () => {
		const store = createAANewTaskFlowStore();
		store.getState().beginFlow(flow);
		store.getState().transition(flow.flowId, "provisioning-work-folder");
		store.getState().transition(flow.flowId, "opening-workspace", {
			canonicalWorkspaceId: flow.workspaceId,
			terminalId: "terminal-1",
		});
		store.getState().transition(flow.flowId, "starting-pi");
		store.getState().transition(flow.flowId, "connecting-runtime");
		store.getState().fail(flow.flowId, {
			boundary: "runtime-confirmation",
			message: "Pi runtime identity was not confirmed yet.",
		});

		expect(store.getState().activeFlow).toMatchObject({
			stage: "failed",
			failure: { boundary: "runtime-confirmation" },
		});
		expect(store.getState().transition(flow.flowId, "connecting-runtime")).toBe(
			true,
		);
	});

	it("clears only after ready or explicit abandon", () => {
		const store = createAANewTaskFlowStore();
		store.getState().beginFlow(flow);
		store.getState().abandon();
		expect(store.getState().activeFlow).toBeNull();
	});
});
