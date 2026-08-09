import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAHairState } from "./AAHairState";

describe("AA Reasoning Hair rendering", () => {
	it("uses a neutral office cap when runtime reasoning is unavailable", () => {
		const markup = renderToStaticMarkup(<AAHairState />);
		expect(markup).toContain("aa-agent-avatar__runtime-cap");
		expect(markup).not.toContain("aa-agent-avatar__reasoning-hair");
	});

	it("renders a reasoning hair state only for an explicit mapped value", () => {
		const markup = renderToStaticMarkup(<AAHairState state="sparse" />);
		expect(markup).toContain("aa-agent-avatar__reasoning-hair");
		expect(markup).toContain('data-hair-state="sparse"');
	});
});
