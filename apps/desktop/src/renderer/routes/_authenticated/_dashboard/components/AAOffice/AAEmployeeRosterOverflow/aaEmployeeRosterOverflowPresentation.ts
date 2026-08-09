export interface AAEmployeeRosterOverflowInput {
	containerWidth: number;
	contentWidth: number;
	scrollLeft: number;
	viewportWidth: number;
}

export interface AAEmployeeRosterOverflowState {
	canScrollLeft: boolean;
	canScrollRight: boolean;
	hasOverflow: boolean;
}

const SCROLL_EDGE_EPSILON = 1;

export function getAAEmployeeRosterOverflowState({
	containerWidth,
	contentWidth,
	scrollLeft,
	viewportWidth,
}: AAEmployeeRosterOverflowInput): AAEmployeeRosterOverflowState {
	if (containerWidth <= 0 || contentWidth <= 0 || viewportWidth <= 0) {
		return {
			canScrollLeft: false,
			canScrollRight: false,
			hasOverflow: false,
		};
	}

	const hasOverflow = contentWidth - containerWidth > SCROLL_EDGE_EPSILON;
	if (!hasOverflow) {
		return {
			canScrollLeft: false,
			canScrollRight: false,
			hasOverflow: false,
		};
	}

	const maximumScrollLeft = Math.max(0, contentWidth - viewportWidth);
	return {
		canScrollLeft: scrollLeft > SCROLL_EDGE_EPSILON,
		canScrollRight: scrollLeft < maximumScrollLeft - SCROLL_EDGE_EPSILON,
		hasOverflow: true,
	};
}

export function getAAEmployeeRosterScrollDistance(
	viewportWidth: number,
): number {
	return Math.max(180, Math.round(viewportWidth * 0.72));
}
