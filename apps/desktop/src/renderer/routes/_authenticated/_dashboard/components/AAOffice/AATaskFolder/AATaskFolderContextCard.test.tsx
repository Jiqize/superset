import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AATaskFolderContextCard } from "./AATaskFolderContextCard";

describe("AA Task Folder context card", () => {
	it("renders the real work context without hidden-content summaries", () => {
		const markup = renderToStaticMarkup(
			<AATaskFolderContextCard
				presentation={{
					authority: "RUNTIME VERIFIED",
					changedFiles: "2 CHANGED",
					employee: "PI",
					latestAction: "TURN SETTLED",
					model: "Gemini 3.5 Flash",
					reasoning: "high",
					resume: "AVAILABLE",
					runtime: "PI",
					status: "IDLE",
					transport: "TERMINAL",
				}}
				state="turn-complete"
				title="Build login flow"
			/>,
		);

		expect(markup).toContain("TASK FOLDER");
		expect(markup).toContain("Build login flow");
		expect(markup).toContain("RUNTIME VERIFIED");
		expect(markup).toContain("Gemini 3.5 Flash");
		expect(markup).toContain("REASONING");
		expect(markup).toContain("2 CHANGED");
		expect(markup).toContain("TURN SETTLED");
		expect(markup).not.toContain("TRANSCRIPT");
		expect(markup).not.toContain("PROGRESS");
	});
});
