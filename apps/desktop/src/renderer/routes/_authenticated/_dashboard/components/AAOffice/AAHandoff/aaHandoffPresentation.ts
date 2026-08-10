import { normalizeAATaskFolderTitleInput } from "../AATaskFolder/aaTaskFolderPresentation";

export interface AAHandoffPanePresentation {
	launchLabel?: string;
	taskTitleEdited?: true;
	titleOverride?: string;
}

export function resolveAAHandoffTaskTitle({
	paneTitle,
	taskTitleEdited,
}: {
	paneTitle?: string | null;
	taskTitleEdited?: boolean;
}): string | undefined {
	if (!taskTitleEdited) return undefined;
	return normalizeAATaskFolderTitleInput(paneTitle);
}

export function resolveAAHandoffTaskTitleFromPaneCandidates(
	candidates: readonly {
		paneTitle?: string | null;
		taskTitleEdited?: boolean;
	}[],
): string | undefined {
	for (const candidate of candidates) {
		const title = resolveAAHandoffTaskTitle(candidate);
		if (title) return title;
	}
	return undefined;
}

export function resolveAAHandoffPanePresentation({
	employeeTitle,
	taskFolderTitle,
}: {
	employeeTitle?: string;
	taskFolderTitle?: string;
}): AAHandoffPanePresentation {
	const launchLabel = employeeTitle?.trim() || undefined;
	const explicitTaskTitle = normalizeAATaskFolderTitleInput(taskFolderTitle);
	return {
		...(launchLabel ? { launchLabel } : {}),
		...(explicitTaskTitle ? { taskTitleEdited: true as const } : {}),
		...(explicitTaskTitle || launchLabel
			? { titleOverride: explicitTaskTitle ?? launchLabel }
			: {}),
	};
}
