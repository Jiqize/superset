import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAApplicationPage } from "./AAApplicationPage";

describe("AAApplicationPage", () => {
	it("frames a mature route without replacing its body", () => {
		const markup = renderToStaticMarkup(
			<AAApplicationPage pathname="/automations">
				<div data-mature-body>Existing automation controls</div>
			</AAApplicationPage>,
		);

		expect(markup).toContain('data-aa-page="automations"');
		expect(markup).toContain("OPERATIONS INDEX");
		expect(markup).toContain("<h1");
		expect(markup).toContain("Existing automation controls");
		expect(markup).toContain("aa-application-page__body");
	});

	it("does not frame a route outside AA", () => {
		const markup = renderToStaticMarkup(
			<AAApplicationPage pathname="/workspaces">
				<span>V1</span>
			</AAApplicationPage>,
		);
		expect(markup).toBe("<span>V1</span>");
	});
});
