import { Button } from "@superset/ui/button";
import { AAIcon } from "../AAIcon";

interface AATaskFolderArchiveActionProps {
	archived: boolean;
	available: boolean;
	onArchiveChange: (archived: boolean) => void;
	pending?: boolean;
	title: string;
}

export function AATaskFolderArchiveAction({
	archived,
	available,
	onArchiveChange,
	pending = false,
	title,
}: AATaskFolderArchiveActionProps) {
	const action = archived ? "Unarchive" : "Archive";
	return (
		<div className="aa-task-folder-card__actions aa-task-folder-card__archive">
			<span>ORGANIZATION</span>
			<Button
				aria-busy={pending || undefined}
				aria-label={`${action} task: ${title}`}
				className="aa-task-folder-card__archive-action"
				disabled={!available || pending}
				size="sm"
				title={
					available
						? `${action} task`
						: "Archive unavailable while the Workspace host is offline"
				}
				variant="ghost"
				onClick={() => onArchiveChange(!archived)}
			>
				<AAIcon name={archived ? "folder" : "archive"} />
				{pending ? "SAVING" : action.toUpperCase()}
			</Button>
		</div>
	);
}
