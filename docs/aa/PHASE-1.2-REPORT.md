# AA Phase 1.2 Report

## Status

Phase 1.2 — **Character & Depth Pass** is implemented and verified on macOS
in the `aa-spike` working tree.

The change is presentation-only. It adds explicit employee personas, makes the
existing Pi lifecycle states easier to read as character poses, and separates
the AA shell, cabinets, pane well, panes, and terminal workstation with the
existing hard-edge Office System language. No product structure, route,
runtime adapter, lifecycle mapping, terminal, pane, Git/worktree, Host Service,
PTY, or database behavior changed. Phase 2 is not included.

## Before and After

| Area | Phase 1.1 | Phase 1.2 |
| --- | --- | --- |
| Employee identity | Compact workers varied by a name checksum | Explicit, deterministic presentation registry with named personas and a generic fallback |
| Pi worker | Recognizable worker with limited pose differences | Clear neutral, thinking, typing, document, and restrained error silhouettes in the same 44 px footprint |
| Workspace hierarchy | AA styling was present but the center remained visually flat | Distinct shell, cabinet, recessed workspace well, raised pane, and active terminal layers |

The terminal remains the dominant working surface. No gradient, blur, glass,
large shadow, texture, CRT filter, scanline, decorative scene, fake status, or
fake workload was introduced.

## Files Changed

### AA presentation components

All new presentation logic remains under:

`apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`

| File | Change |
| --- | --- |
| `AAEmployeeAvatar/aaEmployeePersonas.ts` | Adds the typed, explicit employee persona registry and deterministic resolver. |
| `AAEmployeeAvatar/aaEmployeePersonas.test.ts` | Covers the named mappings, Pi/Copilot token boundary, and generic fallback. |
| `AAEmployeeAvatar/AAEmployeeAvatar.tsx` | Replaces checksum styling with persona-driven hair, eyewear, jacket, accent, and badge details while keeping the compact pixel worker primary. |
| `AAAgentAvatar/AAAgentAvatar.tsx` | Refines the Pi worker face, clothing, and six state-specific poses without increasing the status-card footprint. |
| `aa-office.css` | Adds persona traits, state-pose styling, scoped reduced motion, and hard-edge workspace depth variables/treatments. |

### Existing Renderer integration points

| File | Change |
| --- | --- |
| `V2PresetsBar/components/BuiltinPresetBarItem/BuiltinPresetBarItem.tsx` | Passes the existing optional `preset.agentId` to the AA presentation resolver. Launch behavior is unchanged. |
| `V2PresetsBar/components/V2PresetBarItem/V2PresetBarItem.tsx` | Passes the same existing identity for user-visible preset items. Drag, edit, hotkey, and launch behavior are unchanged. |

No file in `packages/panes`, Host Service, PTY daemon, terminal adapters, Pi
hooks/extensions, Git/worktree services, filesystem services, local database,
or shared runtime architecture was modified.

## Employee Persona Registry

The previous checksum-based selection has been removed. The AA layer now
resolves existing `agentId` and display-name strings against an explicit local
registry. The registry contains presentation metadata only.

| Persona | Hair | Eyewear | Jacket | Accent |
| --- | --- | --- | --- | --- |
| Claude | Parted | None | Umber | Paper |
| Codex | Crop | Square | Navy | Paper |
| OpenCode | Wave | Round | Slate | Brass |
| Grok | Spiked | None | Charcoal | Blue |
| Pi | Swept | Round | Navy | Brass |
| Copilot | Cap | None | Slate | Blue |
| Mistral | Fringe | Square | Umber | Brass |
| Kimi | Short | Round | Olive | Paper |
| Superset | Parted | Square | Charcoal | Paper |
| Generic fallback | Crop | None | Slate | Paper |

- Matching is deterministic and uses normalized whole-token aliases. For
  example, `Copilot` cannot accidentally resolve as `Pi`.
- The provider icon remains a small badge when Superset already supplies one;
  it is not used as the whole character.
- No capability, availability, performance, model quality, status, rank, or
  seniority metadata exists in the registry.
- The visible roster continues to show explicit functional preset names and
  uses the existing callbacks and ordering.

## Pi Worker Refinement

The Pi Worker stays in the existing 140 px status card with the existing 44 px
avatar. Only its presentation changed:

| Real AA state | Pose |
| --- | --- |
| `offline` | Muted, desaturated worker with closed eyes and calm arms |
| `idle` | Neutral worker with arms lowered |
| `thinking` | Hand-to-chin gesture, shifted gaze, and two small thought marks |
| `working` | Worker at a compact desk/monitor with a four-frame two-hand typing loop |
| `waiting` | Worker holding and reading a marked document |
| `error` | Restrained furrowed expression, hands at temples, and one error-marked paper |

The existing lifecycle provider and event-to-state mapping were not touched.
The UI continues to render only the real states supplied by that integration.
The normal typing loop remains `800ms steps(1)` with four integer-pixel hand
positions. Under `prefers-reduced-motion: reduce`, animated worker parts and
the working status light run once at `0.01ms`; AA navigation and cabinet
transitions are similarly reduced. This was verified from computed styles in
the running Renderer.

## Workspace Depth and Hierarchy

Depth uses only flat AA palette values, 1 px highlights/dark edges, and small
hard offset/inset treatments:

1. **Application shell** — `#8f8e89`, establishing the outer workstation.
2. **Cabinet surfaces** — `#9d9c97`, shared by Briefcase and File Cabinets.
3. **Workspace well** — recessed `#878681` around the existing pane group.
4. **Pane surface/header** — raised `#bdbcb6` content with `#aaa9a3` headers.
5. **Active terminal workstation** — the existing dark terminal surface with a
   stronger hard inset/offset frame; its content is untouched.

Deep navy remains the selected/navigation state. Amber appears on the terminal
frame only when the real Pi state is `thinking` or `working`. The CSS targets
the existing pane `data-slot` hooks for presentation; it does not modify the
pane implementation or layout model.

## Runtime Verification

The pass was exercised in the running macOS Electron development app against
the real `aa-baseline-fixture` / `pi-baseline` V2 workspace.

| Behavior | Result |
| --- | --- |
| Workspace and route | The current V2 workspace rendered successfully. Home navigation and the existing Back control returned to the same workspace route. |
| Employee personas | The eight visible employees resolved to explicit, distinct persona data. Pi and generic fallback mappings were covered by unit tests even though Pi was not pinned in the fixture roster. |
| Employee preset launch | Clicking the real `Superset CLI` employee created a second xterm and selected its real session. The test pane was closed and the original `π - pi-baseline` terminal restored. |
| Terminal focus/input | A real pointer click focused `xterm-helper-textarea` (`aria-label="Terminal input"`). Real `z` and cleanup `Backspace` key events were delivered to that same input target without leaving text behind. |
| Pi lifecycle | The real card rendered `IDLE`. During Renderer reload the binding briefly rendered `OFFLINE`, then returned to `IDLE` after reconnection; no intermediate state was synthesized. |
| Worker state readability | A temporary, untracked visual harness rendered all six component states. Each state produced distinct pose markup; normal and reduced-motion computed styles matched the intended behavior. |
| Briefcase Cabinet | Existing project expansion/collapse, active workspace selection, and real names remained intact. Its structure was not changed. |
| File Cabinet and diff | Files, Changes, and Review tabs activated through real pointer events. Review persisted across Renderer reload, Files was restored for final review, and the existing Changes pane continued to show the fixture's real `No changes` result. |
| Renderer reload | The route, one Pi xterm, cabinet state, and terminal interaction returned after reload. |
| 1920 × 976 layout | All visible employees fit, the Pi card remained 140 px, the avatar remained 44 px, and no page-level overflow appeared. |
| 1440 × 800 layout | The shell matched the viewport with no page-level overflow. Cabinets, pane grid, terminal, and worker card remained usable; the roster retained its existing horizontal overflow behavior. |
| Runtime errors | No uncaught Renderer exception occurred. Only the pre-existing React development warnings from `DockBadgeController` updates during sidebar renders appeared. |
| Architecture boundary | Git status contains only AAOffice presentation files, the two documented V2 preset visual integration points, tests, and this report. No RED-area file changed. |

## Checks

Commands run:

```sh
bun run --cwd apps/desktop typecheck
bun test \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAEmployeeAvatar/aaEmployeePersonas.test.ts \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/aaAgentState.test.ts
./scripts/lint.sh <seven changed Phase 1.2 Renderer source/test files>
git diff --check
```

Results:

- Desktop TypeScript: passed.
- Employee persona and AA lifecycle tests: 20 passed, 0 failed.
- Targeted Biome lint/format: passed with no diagnostics.
- `git diff --check`: passed.
- Electron interaction and visual pass: completed with no uncaught exception.
- RED-area modification audit: passed.

## Visual Artifacts

The following local QA screenshots are intentionally untracked and are not
production assets:

- `/tmp/aa-office-phase-1.2.png` — final 1920 × 976 workspace.
- `/tmp/aa-office-phase-1.2-compact.png` — 1440 × 800 compact viewport.
- `/tmp/aa-office-phase-1.2-worker-states.png` — temporary six-state Pi worker
  comparison.

## Known Limitations

1. Pi lifecycle fidelity is unchanged. `THINKING`, `WAITING`, and `ERROR` can
   appear only when the current integration emits the corresponding real
   lifecycle event.
2. Pi was not a pinned Employee Roster item in the fixture. Its explicit
   persona is implemented and tested, but the UI does not fabricate a row.
3. At narrower widths the unchanged roster remains horizontally scrollable;
   it does not wrap or shrink employees into unreadable controls.
4. The employee characters are maintainable inline SVG/CSS pixel workers, not
   a final production sprite library.
5. Two existing React development warnings involving `DockBadgeController`
   remain during some sidebar renders. They predate this phase and no Phase
   1.2 file appears in them.
6. The state gallery validates pose readability without pretending those
   states occurred in the real Pi session. Runtime lifecycle verification used
   only the real `OFFLINE` and `IDLE` events observed during reload.

## Recommended Next Visual Refinements

These remain visual-only follow-ups and are not Phase 2 work:

1. Validate the persona set at Retina 2× and one native 1280 × 800 window.
2. Capture real Pi `THINKING`, `WORKING`, `WAITING`, and `ERROR` sessions before
   tuning animation timing or state colors further.
3. Add screenshot fixtures for all explicit personas, the generic fallback,
   reduced motion, and long localized preset names.
4. Review roster discoverability at compact widths without changing its
   existing launch/reorder model.
5. Tune pane-divider contrast only after evaluating long coding sessions in
   both dark terminal and light file/diff panes.

## Phase Boundary

Phase 1.2 ends with this character and depth pass plus this report. No native
Pi chat, new runtime adapter, terminal rewrite, pane refactor, Git/worktree
change, Host Service/PTY/database modification, or Phase 2 work is included.
