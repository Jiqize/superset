import { AAIcon } from "../AAIcon";
import { getAAFileCabinetPresentation } from "./aaFileCabinetPresentation";

interface AAFileCabinetHeaderProps {
	changedFileCount: number | null;
	deliveryState: string | null;
}

export function AAFileCabinetHeader({
	changedFileCount,
	deliveryState,
}: AAFileCabinetHeaderProps) {
	const presentation = getAAFileCabinetPresentation({
		changedFileCount,
		deliveryState,
	});

	return (
		<header className="aa-file-cabinet__header">
			<span className="aa-file-cabinet__title">
				<AAIcon name="archive" />
				<span>
					<strong>FILE CABINET</strong>
					<small>WORK FOLDER RECORDS</small>
				</span>
			</span>
			<div className="aa-file-cabinet__records">
				{presentation.output ? (
					<span
						className="aa-file-cabinet__record"
						data-has-changes={presentation.hasChanges || undefined}
					>
						<AAIcon name="changes" />
						<span>
							<small>OUTPUT</small>
							<strong>{presentation.output}</strong>
						</span>
					</span>
				) : null}
				{presentation.delivery ? (
					<span className="aa-file-cabinet__record">
						<AAIcon name="review" />
						<span>
							<small>DELIVERY</small>
							<strong>{presentation.delivery}</strong>
						</span>
					</span>
				) : null}
			</div>
		</header>
	);
}
