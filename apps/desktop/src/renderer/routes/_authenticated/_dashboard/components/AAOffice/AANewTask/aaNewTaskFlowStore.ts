import { createStore } from "zustand/vanilla";

export type AANewTaskStage =
	| "editing"
	| "validating"
	| "provisioning-work-folder"
	| "opening-workspace"
	| "starting-pi"
	| "connecting-runtime"
	| "ready"
	| "failed";

export type AANewTaskFailureBoundary =
	| "validation"
	| "pi-configuration"
	| "workspace-provisioning"
	| "workspace-navigation"
	| "terminal-launch"
	| "runtime-confirmation"
	| "terminal-focus";

export interface AANewTaskFailure {
	boundary: AANewTaskFailureBoundary;
	message: string;
}

export interface AANewTaskDialogTarget {
	projectId: string;
	projectName: string;
	hostId: string;
}

export interface AANewTaskFlowInput extends AANewTaskDialogTarget {
	flowId: string;
	workspaceId: string;
	title: string;
	branch: string;
	piConfigId: string;
	baseBranch?: string;
}

export interface AANewTaskFlow extends AANewTaskFlowInput {
	stage: AANewTaskStage;
	canonicalWorkspaceId?: string;
	terminalId?: string;
	failure?: AANewTaskFailure;
}

type AANewTaskFlowPatch = Partial<
	Pick<
		AANewTaskFlow,
		"canonicalWorkspaceId" | "terminalId" | "failure" | "baseBranch"
	>
>;

export interface AANewTaskFlowState {
	dialogTarget: AANewTaskDialogTarget | null;
	draftTitle: string;
	activeFlow: AANewTaskFlow | null;
	surfaceVisible: boolean;
	openDialog: (target: AANewTaskDialogTarget) => void;
	closeDialog: () => void;
	setDraftTitle: (title: string) => void;
	beginFlow: (input: AANewTaskFlowInput) => void;
	transition: (
		flowId: string,
		stage: AANewTaskStage,
		patch?: AANewTaskFlowPatch,
	) => boolean;
	fail: (flowId: string, failure: AANewTaskFailure) => boolean;
	dismissSurface: () => void;
	showSurface: () => void;
	abandon: () => void;
}

const NEXT_STAGES: Readonly<Record<AANewTaskStage, readonly AANewTaskStage[]>> =
	{
		editing: ["validating", "failed"],
		validating: ["provisioning-work-folder", "failed"],
		"provisioning-work-folder": ["opening-workspace", "failed"],
		"opening-workspace": ["starting-pi", "failed"],
		"starting-pi": ["connecting-runtime", "failed"],
		"connecting-runtime": ["ready", "failed"],
		ready: ["failed"],
		failed: ["connecting-runtime"],
	};

export function canTransitionAANewTaskStage(
	from: AANewTaskStage,
	to: AANewTaskStage,
): boolean {
	return NEXT_STAGES[from]?.includes(to) ?? false;
}

export function createAANewTaskFlowStore() {
	return createStore<AANewTaskFlowState>((set, get) => ({
		dialogTarget: null,
		draftTitle: "",
		activeFlow: null,
		surfaceVisible: false,
		openDialog: (dialogTarget) => {
			set({ dialogTarget, draftTitle: "" });
		},
		closeDialog: () => {
			set({ dialogTarget: null });
		},
		setDraftTitle: (draftTitle) => {
			set({ draftTitle });
		},
		beginFlow: (input) => {
			set({
				dialogTarget: null,
				activeFlow: { ...input, stage: "validating" },
				surfaceVisible: true,
			});
		},
		transition: (flowId, stage, patch = {}) => {
			const activeFlow = get().activeFlow;
			if (
				!activeFlow ||
				activeFlow.flowId !== flowId ||
				!canTransitionAANewTaskStage(activeFlow.stage, stage)
			) {
				return false;
			}
			set({
				activeFlow: {
					...activeFlow,
					...patch,
					stage,
					...(stage === "failed" ? {} : { failure: undefined }),
				},
			});
			return true;
		},
		fail: (flowId, failure) => {
			return get().transition(flowId, "failed", { failure });
		},
		dismissSurface: () => {
			set({ surfaceVisible: false });
		},
		showSurface: () => {
			if (get().activeFlow) set({ surfaceVisible: true });
		},
		abandon: () => {
			set({ activeFlow: null, surfaceVisible: false });
		},
	}));
}

export type AANewTaskFlowStore = ReturnType<typeof createAANewTaskFlowStore>;
