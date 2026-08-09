# AA Phase 2.2 Report

## Scope and Baseline

Phase 2.2 was implemented on `aa-spike` after the required fast-forward-only
update:

```sh
git pull --ff-only origin aa-spike
```

The exact starting commit was confirmed as
`b5161b8c5814b667918566d76a77f25df966be2a`
(`docs(aa): add Phase 2.2 semantic density brief`). The change is limited to
AA Renderer presentation plus the existing V2 preset-bar composition. No Host
Service, PTY, terminal persistence, Pi hook, Git/worktree, database, pane
engine, or runtime-adapter file changed.

## Task Folder Semantic Changes

The active Worker Card remains the authoritative current-state surface. The
Task Folder now distinguishes live state from the result of the latest turn or
session event:

| Existing presentation state | Task Folder metric |
| --- | --- |
| `unassigned` | `STATUS / UNASSIGNED` |
| `untracked` | `TRACKING / UNTRACKED` |
| `idle` | `STATUS / IDLE` |
| `working` | `STATUS / WORKING` |
| `waiting` | `STATUS / WAITING` |
| `turn-complete` | `LAST TURN / COMPLETE` |
| `session-ended` | `SESSION / ENDED` |
| `error` | `LAST EVENT / ERROR` |

`LAST EVENT` was selected for `Failed` because the underlying value is the
latest lifecycle event, not proof that a durable task is currently failed or
complete. The Phase 2.1 lifecycle-to-presentation mapping was not changed.

A real Pi turn verified the intended temporal combination: while Pi ran, the
Worker Card and Task Folder showed `WORKING` and `STATUS / WORKING`. After the
real `Stop` event, the Worker Card returned to current `IDLE` while the Task
Folder retained `LAST TURN / COMPLETE`.

The Task Folder accessible name uses the same meaning, including `status:
working`, `tracking: untracked`, `last turn: complete`, `session: ended`, and
`last event: error`.

## Employee Roster Overflow

`AAEmployeeRosterOverflow` is a local AA wrapper around the existing preset
items. It does not change item order, preset actions, drag/reorder behavior,
context menus, hotkeys, or the existing execution path.

The wrapper provides:

- controls only when measured content genuinely exceeds the full Roster area;
- a right button at the start, both directions in the middle, and only a left
  button at the end;
- fixed-width inert slots that prevent item jumps as a directional control
  appears or disappears;
- a hard-edge solid-step cue beside each available direction;
- group scrolling equal to 72 percent of the visible employee viewport, with
  a minimum useful distance of 180 px;
- native horizontal wheel/trackpad and touch scrolling;
- Arrow Left/Right plus Home/End keyboard support on the labeled Roster
  viewport;
- `ResizeObserver` updates for the root, viewport, and content, with scroll
  updates and no polling;
- immediate scrolling under `prefers-reduced-motion: reduce`.

At 1920×976, the measured Roster viewport and content were both 1058 px, so no
scroll control was rendered. At 1440×800, the viewport was 522 px and content
was 773 px; the initial right control appeared, the left control appeared
after scrolling, and the final Superset CLI employee was fully revealed at the
251 px endpoint.

## Adjacent Semantic Compression

One narrow duplication was compressed. The per-pane terminal signal is hidden
when the Task Folder already displays the same live state (`STATUS`,
`TRACKING`, or unassigned state). It remains visible when the Task Folder has a
different temporal meaning: `LAST TURN`, `SESSION`, or `LAST EVENT`.

For example, the completed-turn header shows `LAST TURN / COMPLETE` in the
Task Folder and retains the current `IDLE` pane signal. When the terminal frame
is at most 400 px wide and Task Folder metrics are intentionally hidden, the
current pane signal is restored so responsive compression never removes the
only visible state. The global Worker Card and bottom status bar retain their
existing distinct scopes.

## Accessibility and Interaction

- Task Folder ARIA text now matches the temporal metric rather than always
  saying `status`.
- The scroll viewport is a labeled `Employee roster` section and becomes
  keyboard-focusable only when overflow exists.
- Direction buttons use explicit `Scroll employee roster left/right` labels,
  matching tooltips, crisp SVG arrows, and visible hard-edge focus treatment.
- Employee buttons keep their explicit `Assign current work to <name>` names.
- Smooth button scrolling is disabled when reduced motion is requested.
- xterm focus, keyboard input, and the existing terminal viewport are
  unchanged.

## Exact Files Changed

New AA presentation module:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAEmployeeRosterOverflow/AAEmployeeRosterOverflow.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAEmployeeRosterOverflow/aaEmployeeRosterOverflowPresentation.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAEmployeeRosterOverflow/aaEmployeeRosterOverflow.test.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAEmployeeRosterOverflow/index.ts`

Existing AA presentation files:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/AATaskFolder.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.test.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATerminalFrame/AATerminalFrame.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/aa-office.css`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/index.ts`

Narrow existing V2 Renderer composition:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx`

Documentation:

- `docs/aa/PHASE-2.2-REPORT.md`
- `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`

## Verification

### Automated checks

| Check | Result |
| --- | --- |
| Desktop `bun run typecheck` | Passed, including generated icons/routes and `tsc --noEmit`. |
| Biome 2.4.2 over every changed TS, TSX, and CSS file | Passed. |
| `./scripts/lint.sh` over every changed TS, TSX, and CSS file | Passed with no fixes. |
| Focused AA and pane-layout Bun suite | Passed, 76 tests / 0 failures / 90 assertions across 8 files. |
| `git diff --check` | Passed. |
| RED-path review | Passed; only AAOffice, the scoped V2 preset-bar presentation, and AA documentation changed. |

The focused tests cover all Task Folder metric/accessible summaries, unchanged
lifecycle classification, wide/start/middle/end Roster states, resize/content
recalculation, and group scroll distance, along with the existing AA worker,
assignment, persona, reasoning, and pane-layout contracts.

### Electron verification

The running Electron Renderer was confirmed to originate from this worktree
on Vite port `3005` and CDP port `9222`. Sign-off used real CDP mouse, wheel,
and keyboard input rather than DOM `click()` calls.

| Surface or behavior | Result |
| --- | --- |
| Real Pi lifecycle | A harmless real Pi turn showed live `STATUS / WORKING`, then `PI WORKER / IDLE` with `LAST TURN / COMPLETE`. |
| Temporal accessibility | The completed Task Folder exposed `last turn: complete`; live work exposed `status: working`. |
| Non-Pi truthfulness | Revealed Superset CLI launched through the unchanged preset path and showed `DISPATCHED TO SUPERSET CLI`, `WORKER SUPERSET CLI`, and `TRACKING / UNTRACKED`. |
| Wide Roster | 1920×976 showed no false edge cue or scroll button; all employees fit. |
| Compact Roster | 1440×800 initially showed only the right control; middle scrolling showed both; the endpoint showed only the left control and fully revealed Superset CLI. |
| Input methods | Pointer control, Arrow/Home/End keyboard input, and native horizontal wheel input all moved the same Roster viewport. |
| Resize and item measurements | 1920 → 1440 → 1920 → 1440 transitions recalculated control visibility without polling or page overflow. |
| Reduced motion | The media query was active, CSS scroll behavior resolved to `auto`, and the button jump completed immediately. |
| Terminal focus | xterm retained `Terminal input` focus and accepted typed input plus cleanup Backspace before and after the Pi turn. |
| File Cabinet | Files, Changes, and Review all activated through real pointer input. |
| Navigation and reload | Home → `pi-baseline` and Renderer reload restored the same workspace, Pi presentation, and saved user pane layout. |
| Layout bounds | Both verified viewports had no page-level horizontal or vertical overflow. |
| Runtime errors | No uncaught Renderer exception. The previously documented `DockBadgeController` React development warnings still occur during sidebar render and do not reference a changed file. |
| QA cleanup | Temporary non-Pi tabs were closed; the fixture worktree remained clean and its saved Pi-plus-Changes layout was preserved. |

Screenshots produced during QA (temporary, untracked artifacts):

- `/tmp/aa-office-phase-2.2-working.png` — real Pi `WORKING` at 1920×976.
- `/tmp/aa-office-phase-2.2-last-turn-complete.png` — current Worker `IDLE`
  plus Task Folder `LAST TURN / COMPLETE` at 1920×976.
- `/tmp/aa-office-phase-2.2-roster-end-pi.png` — final compact Roster position
  with the left control and Superset CLI visible at 1440×800.

## Known Limitations and Intentional Deferrals

1. Superset still has no generic lifecycle binding for every terminal agent;
   known non-Pi launches therefore remain explicitly `UNTRACKED`.
2. The active Pi session still has no authoritative Renderer-readable
   reasoning value. Reasoning hair is not mounted as a fake active state.
3. Task Folder remains pane-level presentation over existing state, not a
   durable task, history, workflow, or project-management database.
4. The dispatch receipt remains ephemeral and confirms launch success, not
   continuing ownership, progress, or task completion.
5. Older saved panes may lack Renderer launch identity and therefore use the
   established honest fallback.
6. Saved user pane layouts are intentionally preserved; Phase 2.2 does not
   normalize or replace an existing split.
7. Overflow controls intentionally provide no hidden count. The exact
   scrollable bounds are authoritative, and native wheel behavior remains
   platform/browser behavior.
8. The existing `DockBadgeController` development warnings remain outside
   the AA change boundary.

Explicitly deferred: generic runtime contracts, active-session reasoning
support, native Pi chat, new adapters, automatic multi-agent orchestration,
agent-to-agent communication, workflow engines, task persistence, project
management, and office simulation.

Phase 2.2 stops here. Phase 3 has not begun.
