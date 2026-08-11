import { useStore } from "zustand";
import {
	type AANewTaskDialogTarget,
	type AANewTaskFlowState,
	createAANewTaskFlowStore,
} from "./aaNewTaskFlowStore";

export const aaNewTaskFlowStore = createAANewTaskFlowStore();

export function openAANewTaskDialog(target: AANewTaskDialogTarget): void {
	aaNewTaskFlowStore.getState().openDialog(target);
}

export function useAANewTaskFlow<T>(
	selector: (state: AANewTaskFlowState) => T,
): T {
	return useStore(aaNewTaskFlowStore, selector);
}
