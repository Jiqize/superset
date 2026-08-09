import { describe, expect, it } from "bun:test";
import { resolveAAActiveWorkerPresentation } from "./aaActiveWorkerPresentation";

const terminal = { terminalId: "terminal-1" };

describe("AA active Worker Card presentation", () => {
	it("uses an authoritative binding ahead of launch metadata", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			binding: { agentId: "pi", lastEventType: "Start" },
			terminal: {
				...terminal,
				launchIdentity: { label: "Codex" },
			},
		});

		expect(presentation).toMatchObject({
			displayName: "PI",
			source: "binding",
			status: "working",
			tracking: "tracked",
		});
	});

	it("marks a known preset terminal without a binding as untracked", () => {
		const presentation = resolveAAActiveWorkerPresentation({
			terminal: {
				...terminal,
				launchIdentity: { agentId: "agent-config", label: "Codex" },
			},
		});

		expect(presentation).toMatchObject({
			displayName: "CODEX",
			source: "launch",
			status: "untracked",
			tracking: "untracked",
		});
	});

	it("uses a recognized legacy pane title only while it is launch identity", () => {
		expect(
			resolveAAActiveWorkerPresentation({
				terminal: { ...terminal, paneTitle: "Claude" },
			}),
		).toMatchObject({ source: "pane-title", status: "untracked" });

		expect(
			resolveAAActiveWorkerPresentation({
				terminal: {
					...terminal,
					paneTitle: "Claude",
					taskTitleEdited: true,
				},
			}),
		).toMatchObject({ source: "local", status: "unassigned" });
	});

	it("keeps generic task text from becoming an employee identity", () => {
		expect(
			resolveAAActiveWorkerPresentation({
				terminal: { ...terminal, paneTitle: "Fix login state" },
			}),
		).toMatchObject({
			displayName: "LOCAL",
			source: "local",
			status: "unassigned",
		});
	});

	it("does not keep a previous worker visible on a non-terminal pane", () => {
		expect(resolveAAActiveWorkerPresentation({ terminal: null })).toMatchObject(
			{
				heading: "NO ACTIVE WORKER",
				source: "none",
				status: "unassigned",
			},
		);
	});
});
