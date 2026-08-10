export interface AAFileCabinetPresentation {
	delivery: string | null;
	hasChanges: boolean;
	output: string | null;
}

export function getAAFileCabinetPresentation({
	changedFileCount,
	deliveryState,
}: {
	changedFileCount: number | null;
	deliveryState: string | null;
}): AAFileCabinetPresentation {
	return {
		delivery: deliveryState?.trim().toUpperCase() || null,
		hasChanges: changedFileCount !== null && changedFileCount > 0,
		output:
			changedFileCount === null
				? null
				: `${changedFileCount.toString()} CHANGED`,
	};
}
