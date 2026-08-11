import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AATaskFolderArchiveAction } from "./AATaskFolderArchiveAction";

describe("AATaskFolderArchiveAction", () => {
	it("keeps durable Archive and Unarchive actions explicit and accessible", () => {
		const archiveHtml = renderToStaticMarkup(
			<AATaskFolderArchiveAction
				archived={false}
				available
				onArchiveChange={() => {}}
				title="Ended Pi task"
			/>,
		);
		const unarchiveHtml = renderToStaticMarkup(
			<AATaskFolderArchiveAction
				archived
				available
				onArchiveChange={() => {}}
				title="Ended Pi task"
			/>,
		);

		expect(archiveHtml).toContain('aria-label="Archive task: Ended Pi task"');
		expect(archiveHtml).toContain("ARCHIVE");
		expect(unarchiveHtml).toContain(
			'aria-label="Unarchive task: Ended Pi task"',
		);
		expect(unarchiveHtml).toContain("UNARCHIVE");
	});
});
