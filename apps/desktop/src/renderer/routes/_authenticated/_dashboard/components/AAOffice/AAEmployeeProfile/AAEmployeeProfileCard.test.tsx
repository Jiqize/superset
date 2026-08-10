import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AAEmployeeProfileCard } from "./AAEmployeeProfileCard";
import type { AAEmployeeProfilePresentation } from "./aaEmployeeProfilePresentation";

const presentation: AAEmployeeProfilePresentation = {
	authority: "authoritative",
	authorityLabel: "RUNTIME VERIFIED",
	avatarState: "working",
	capabilities: [
		{ label: "LIFECYCLE", reason: null, support: "available" },
		{
			label: "PERMISSIONS",
			reason: "optional_extension_not_detected",
			support: "conditional",
		},
		{ label: "CANCELLATION", reason: null, support: "unavailable" },
		{ label: "USER QUESTIONS", reason: null, support: "unknown" },
	],
	employeeName: "PI",
	model: {
		id: "gemini-3.5-flash",
		label: "Gemini 3.5 Flash",
		provider: "google",
	},
	personaId: "pi",
	reasoning: {
		availableValues: ["low", "medium", "high", "xhigh"],
		value: "high",
	},
	resumeLabel: "AVAILABLE",
	runtimeLabel: "PI",
	statusLabel: "WORKING",
	transportLabel: "TERMINAL",
};

describe("AA employee profile card", () => {
	it("renders explicit runtime identity, values, and negotiated capabilities without transport IDs", () => {
		const markup = renderToStaticMarkup(
			<AAEmployeeProfileCard presentation={presentation} />,
		);

		expect(markup).toContain("EMPLOYEE PROFILE");
		expect(markup).toContain("RUNTIME VERIFIED");
		expect(markup).toContain("Gemini 3.5 Flash");
		expect(markup).toContain("gemini-3.5-flash");
		expect(markup).toContain("REASONING");
		expect(markup).toContain("high");
		expect(markup).toContain("AVAILABLE VALUES");
		expect(markup).toContain("RESUME");
		expect(markup).toContain("LIFECYCLE");
		expect(markup).toContain("AVAILABLE");
		expect(markup).toContain("CONDITIONAL");
		expect(markup).toContain("UNAVAILABLE");
		expect(markup).toContain("UNKNOWN");
		expect(markup).not.toContain("native-session");
		expect(markup).not.toContain("epoch-1");
	});
});
