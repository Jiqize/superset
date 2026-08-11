import { describe, expect, it } from "bun:test";
import { HOTKEYS_REGISTRY } from "./registry";
import type { ShortcutBinding } from "./types";

// Locks in the shape of shipped defaults so the toggle keeps doing
// something. The original "Adaptive layout mapping" toggle was decorative
// for shipped defaults because every entry was a bare-string (physical)
// chord, and bindingToDispatchChord short-circuits physical mode. Keeping
// printable defaults as `mode: "logical"` is what makes the toggle move
// them on non-US layouts.

const NAMED_TERMINAL_TOKENS = new Set([
	"enter",
	"escape",
	"backspace",
	"delete",
	"tab",
	"space",
	"up",
	"down",
	"left",
	"right",
	"arrowup",
	"arrowdown",
	"arrowleft",
	"arrowright",
	"home",
	"end",
	"pageup",
	"pagedown",
	"insert",
]);

function isFunctionKey(token: string): boolean {
	return /^f([1-9]|1[0-2])$/.test(token);
}

function terminalToken(chord: string): string {
	const parts = chord.split("+");
	return parts[parts.length - 1] ?? "";
}

function* allBindings(): Generator<{
	id: string;
	platform: "mac" | "windows" | "linux";
	binding: ShortcutBinding | null;
}> {
	for (const [id, def] of Object.entries(HOTKEYS_REGISTRY)) {
		for (const platform of ["mac", "windows", "linux"] as const) {
			yield { id, platform, binding: def.key[platform] };
		}
	}
}

describe("HOTKEYS_REGISTRY shape", () => {
	it("ships a mnemonic macOS-first AA daily workflow without duplicate chords", () => {
		expect(HOTKEYS_REGISTRY.AA_FOCUS_WORKSTATION.key.mac).toMatchObject({
			chord: "meta+shift+a",
		});
		expect(HOTKEYS_REGISTRY.AA_OPEN_TASK_FOLDER.key.mac).toMatchObject({
			chord: "meta+alt+t",
		});
		expect(HOTKEYS_REGISTRY.AA_RENAME_TASK_FOLDER.key.mac).toMatchObject({
			chord: "meta+alt+r",
		});
		expect(HOTKEYS_REGISTRY.AA_OPEN_EMPLOYEE_PROFILE.key.mac).toMatchObject({
			chord: "meta+alt+e",
		});
		expect(HOTKEYS_REGISTRY.AA_OPEN_FILES.key.mac).toMatchObject({
			chord: "meta+alt+f",
		});

		const macChords = Array.from(allBindings())
			.filter(({ platform }) => platform === "mac")
			.flatMap(({ id, binding }) =>
				binding === null
					? []
					: [
							{
								id,
								chord: typeof binding === "string" ? binding : binding.chord,
							},
						],
			);
		const aaIds = [
			"AA_FOCUS_WORKSTATION",
			"AA_OPEN_TASK_FOLDER",
			"AA_RENAME_TASK_FOLDER",
			"AA_OPEN_EMPLOYEE_PROFILE",
			"AA_OPEN_FILES",
		];
		for (const entry of macChords.filter(({ id }) => aaIds.includes(id))) {
			expect(
				macChords
					.filter((candidate) => candidate.chord === entry.chord)
					.map(({ id }) => id),
			).toEqual([entry.id]);
		}
	});

	it("authors printable defaults as mode: 'logical'", () => {
		const offenders: string[] = [];
		for (const { id, platform, binding } of allBindings()) {
			if (binding === null) continue;
			if (typeof binding !== "string") continue; // v2 objects checked below

			const token = terminalToken(binding);
			const isLayoutStable =
				NAMED_TERMINAL_TOKENS.has(token) || isFunctionKey(token);
			if (!isLayoutStable) {
				offenders.push(`${id}.${platform}=${binding}`);
			}
		}
		// If this fires: a printable chord ('meta+t', 'ctrl+shift+0', 'meta+slash')
		// was authored as a bare string, which parses as physical mode and bypasses
		// the adaptive-layout toggle. Wrap it with the L() helper in registry.ts.
		expect(offenders).toEqual([]);
	});

	it("keeps every logical entry pinned to v2 / logical mode", () => {
		for (const { id, platform, binding } of allBindings()) {
			if (binding === null) continue;
			if (typeof binding === "string") continue;
			expect({ id, platform, binding }).toMatchObject({
				binding: { version: 2, mode: "logical" },
			});
		}
	});

	it("keeps named-key chords as bare strings (layout-stable, no L() needed)", () => {
		// Chords whose terminal is a named key gain nothing from logical mode —
		// translateLogicalChord short-circuits named keys. Authoring them as
		// bare strings keeps the registry terse.
		for (const { id, platform, binding } of allBindings()) {
			if (typeof binding !== "string") continue;
			const token = terminalToken(binding);
			const isLayoutStable =
				NAMED_TERMINAL_TOKENS.has(token) || isFunctionKey(token);
			if (!isLayoutStable) {
				throw new Error(
					`${id}.${platform}=${binding} is a bare string but its terminal token is not a named key — wrap with L() in registry.ts`,
				);
			}
		}
	});

	it("includes a canary letter, digit, and punctuation default in logical mode", () => {
		// Sample three different terminal-token shapes so a partial regression
		// (e.g. only digits revert to physical) gets caught here too.
		expect(HOTKEYS_REGISTRY.QUICK_OPEN.key.mac).toMatchObject({
			mode: "logical",
			chord: "meta+p",
		});
		expect(HOTKEYS_REGISTRY.JUMP_TO_WORKSPACE_1.key.mac).toMatchObject({
			mode: "logical",
			chord: "meta+1",
		});
		expect(HOTKEYS_REGISTRY.OPEN_SETTINGS.key.mac).toMatchObject({
			mode: "logical",
			chord: "meta+comma",
		});
	});
});
