import { resolveAAHandoffTaskTitle } from "renderer/routes/_authenticated/_dashboard/components/AAOffice/AAHandoff/aaHandoffPresentation";

export function resolveTerminalResumeTaskTitle({
	paneTitle,
	tabTitle,
	taskTitleEdited,
}: {
	paneTitle?: string;
	tabTitle?: string;
	taskTitleEdited?: boolean;
}): string | undefined {
	return resolveAAHandoffTaskTitle({
		paneTitle: paneTitle ?? tabTitle,
		taskTitleEdited,
	});
}
