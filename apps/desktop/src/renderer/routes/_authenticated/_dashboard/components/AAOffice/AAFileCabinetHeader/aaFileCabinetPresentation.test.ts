import { describe, expect, it } from "bun:test";
import { getAAFileCabinetPresentation } from "./aaFileCabinetPresentation";

describe("AA File Cabinet presentation", () => {
	it("uses the real changed-file count and existing delivery state", () => {
		expect(
			getAAFileCabinetPresentation({
				changedFileCount: 3,
				deliveryState: "Ready",
			}),
		).toEqual({
			delivery: "READY",
			hasChanges: true,
			output: "3 CHANGED",
		});
	});

	it("preserves a verified zero and omits unavailable values", () => {
		expect(
			getAAFileCabinetPresentation({
				changedFileCount: 0,
				deliveryState: null,
			}),
		).toEqual({
			delivery: null,
			hasChanges: false,
			output: "0 CHANGED",
		});
		expect(
			getAAFileCabinetPresentation({
				changedFileCount: null,
				deliveryState: null,
			}),
		).toEqual({
			delivery: null,
			hasChanges: false,
			output: null,
		});
	});
});
