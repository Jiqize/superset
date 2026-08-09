import { describe, expect, it } from "bun:test";
import {
	getAAEmployeeRosterOverflowState,
	getAAEmployeeRosterScrollDistance,
} from "./aaEmployeeRosterOverflowPresentation";

describe("AA Employee Roster overflow presentation", () => {
	it("shows no controls when the employee content fits", () => {
		expect(
			getAAEmployeeRosterOverflowState({
				containerWidth: 900,
				contentWidth: 760,
				scrollLeft: 0,
				viewportWidth: 900,
			}),
		).toEqual({
			canScrollLeft: false,
			canScrollRight: false,
			hasOverflow: false,
		});
	});

	it("shows only the right control at the initial overflow position", () => {
		expect(
			getAAEmployeeRosterOverflowState({
				containerWidth: 520,
				contentWidth: 860,
				scrollLeft: 0,
				viewportWidth: 464,
			}),
		).toEqual({
			canScrollLeft: false,
			canScrollRight: true,
			hasOverflow: true,
		});
	});

	it("shows both controls in the middle", () => {
		expect(
			getAAEmployeeRosterOverflowState({
				containerWidth: 520,
				contentWidth: 860,
				scrollLeft: 180,
				viewportWidth: 464,
			}),
		).toEqual({
			canScrollLeft: true,
			canScrollRight: true,
			hasOverflow: true,
		});
	});

	it("shows only the left control at the end", () => {
		expect(
			getAAEmployeeRosterOverflowState({
				containerWidth: 520,
				contentWidth: 860,
				scrollLeft: 396,
				viewportWidth: 464,
			}),
		).toEqual({
			canScrollLeft: true,
			canScrollRight: false,
			hasOverflow: true,
		});
	});

	it("recalculates truthfully after content or container size changes", () => {
		const compact = getAAEmployeeRosterOverflowState({
			containerWidth: 520,
			contentWidth: 860,
			scrollLeft: 0,
			viewportWidth: 464,
		});
		const widerContainer = getAAEmployeeRosterOverflowState({
			containerWidth: 920,
			contentWidth: 860,
			scrollLeft: 0,
			viewportWidth: 920,
		});
		const fewerEmployees = getAAEmployeeRosterOverflowState({
			containerWidth: 520,
			contentWidth: 480,
			scrollLeft: 0,
			viewportWidth: 520,
		});

		expect(compact.hasOverflow).toBe(true);
		expect(widerContainer.hasOverflow).toBe(false);
		expect(fewerEmployees.hasOverflow).toBe(false);
	});

	it("scrolls by a useful group-sized distance", () => {
		expect(getAAEmployeeRosterScrollDistance(500)).toBe(360);
		expect(getAAEmployeeRosterScrollDistance(120)).toBe(180);
	});
});
