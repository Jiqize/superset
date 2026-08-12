import { describe, expect, it } from "bun:test";

const css = await Bun.file(new URL("./aa-office.css", import.meta.url)).text();

describe("AA Office CSS contract", () => {
	it("keeps the global shell behind the AA scope", () => {
		expect(css).toContain(".aa-office-shell {");
		expect(css).toContain(".aa-application-shell {");
		expect(css).toContain(".aa-application-shell__content {");
		expect(css).not.toMatch(/^:root\s*\{/m);
		expect(css).not.toMatch(/^body\s*\{/m);
	});

	it("keeps the shell hard-edged and avoids prohibited effects", () => {
		expect(css).toContain("border-right: 2px solid var(--aa-border)");
		expect(css).not.toMatch(/backdrop-filter\s*:/);
		expect(css).not.toMatch(/filter\s*:\s*blur/);
		expect(css).not.toMatch(/linear-gradient|radial-gradient/);
	});

	it("retains a reduced-motion contract for AA animations and controls", () => {
		expect(css).toContain("@media (prefers-reduced-motion: reduce)");
		expect(css).toContain(".aa-navigation-rail__button");
		expect(css).toContain("animation-iteration-count: 1");
		expect(css).toContain("transition-duration: 0.01ms");
	});
});
