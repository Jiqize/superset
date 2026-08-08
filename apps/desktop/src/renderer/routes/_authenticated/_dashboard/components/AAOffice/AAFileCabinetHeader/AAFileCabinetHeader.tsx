import { AAIcon } from "../AAIcon";

interface AAFileCabinetHeaderProps {
	changedFileCount: number | null;
}

export function AAFileCabinetHeader({
	changedFileCount,
}: AAFileCabinetHeaderProps) {
	return (
		<header className="aa-file-cabinet__header">
			<span className="aa-file-cabinet__title">
				<AAIcon name="archive" />
				<span>
					<strong>FILE CABINET</strong>
					<small>WORKSPACE RECORDS</small>
				</span>
			</span>
			{changedFileCount !== null && (
				<span
					className="aa-file-cabinet__marked-count"
					data-has-changes={changedFileCount > 0 || undefined}
				>
					<AAIcon name="changes" />
					<strong>{changedFileCount}</strong> MARKED
				</span>
			)}
		</header>
	);
}
