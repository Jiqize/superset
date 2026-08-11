interface AAFocusableTarget {
	focus: () => void;
	isConnected: boolean;
	matches: (selector: string) => boolean;
}

interface AAQueryRoot {
	querySelector: (selector: string) => unknown;
}

const XTERM_INPUT_SELECTOR = ".xterm-helper-textarea";
const ACTIVE_WORKSTATION_INPUT_SELECTOR =
	'.aa-terminal-frame[data-pane-active="true"] .xterm-helper-textarea';

export function captureAATerminalFocus(
	activeElement: unknown = typeof document === "undefined"
		? null
		: document.activeElement,
): AAFocusableTarget | null {
	if (!isFocusableTarget(activeElement)) return null;
	return activeElement.matches(XTERM_INPUT_SELECTOR) ? activeElement : null;
}

export function restoreAAWorkflowFocus(
	target: AAFocusableTarget | null,
): boolean {
	if (!target?.isConnected) return false;
	target.focus();
	return true;
}

export function focusAAActiveWorkstation(
	root: AAQueryRoot = document,
): boolean {
	const target = root.querySelector(ACTIVE_WORKSTATION_INPUT_SELECTOR);
	if (!isFocusableTarget(target) || !target.isConnected) return false;
	target.focus();
	return true;
}

function isFocusableTarget(value: unknown): value is AAFocusableTarget {
	return (
		typeof value === "object" &&
		value !== null &&
		"focus" in value &&
		typeof value.focus === "function" &&
		"matches" in value &&
		typeof value.matches === "function" &&
		"isConnected" in value &&
		typeof value.isConnected === "boolean"
	);
}
