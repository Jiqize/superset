import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAFileCabinetHeader } from "./AAFileCabinetHeader";

describe("AA File Cabinet header", () => {
	it("presents real output and delivery state as separate records", () => {
		const markup = renderToStaticMarkup(
			<AAFileCabinetHeader changedFileCount={2} deliveryState="Ready" />,
		);

		expect(markup).toContain("FILE CABINET");
		expect(markup).toContain("OUTPUT");
		expect(markup).toContain("2 CHANGED");
		expect(markup).toContain("DELIVERY");
		expect(markup).toContain("READY");
		expect(markup).not.toContain("MARKED");
	});
});
