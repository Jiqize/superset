import { describe, expect, it, mock } from "bun:test";
import {
	captureAATerminalFocus,
	focusAAActiveWorkstation,
	restoreAAWorkflowFocus,
} from "./aaDailyWorkflowFocus";

function focusTarget({
	connected = true,
	terminal = false,
}: {
	connected?: boolean;
	terminal?: boolean;
} = {}) {
	return {
		focus: mock(() => {}),
		isConnected: connected,
		matches: mock((selector: string) =>
			terminal ? selector === ".xterm-helper-textarea" : false,
		),
	};
}

describe("AA daily workflow focus", () => {
	it("captures only a real xterm input as a terminal workflow origin", () => {
		const terminal = focusTarget({ terminal: true });
		const button = focusTarget();

		expect(captureAATerminalFocus(terminal)).toBe(terminal);
		expect(captureAATerminalFocus(button)).toBeNull();
	});

	it("restores a connected terminal target and ignores a stale target", () => {
		const terminal = focusTarget({ terminal: true });
		const stale = focusTarget({ connected: false, terminal: true });

		expect(restoreAAWorkflowFocus(terminal)).toBe(true);
		expect(terminal.focus).toHaveBeenCalledTimes(1);
		expect(restoreAAWorkflowFocus(stale)).toBe(false);
		expect(stale.focus).not.toHaveBeenCalled();
	});

	it("focuses only the active AA terminal workstation", () => {
		const terminal = focusTarget({ terminal: true });
		const root = {
			querySelector: mock((selector: string) => {
				expect(selector).toContain('[data-pane-active="true"]');
				return terminal;
			}),
		};

		expect(focusAAActiveWorkstation(root)).toBe(true);
		expect(terminal.focus).toHaveBeenCalledTimes(1);
	});
});
