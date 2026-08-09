# AA Phase 2.1 Report

## Scope and Baseline

Phase 2.1 was implemented on `aa-spike` after a fast-forward-only update:

```sh
git pull --ff-only origin aa-spike
```

The resulting baseline was confirmed as
`89daff7b3b8ea35969d27218150f72392be40dfa`
(`docs(aa): add Phase 2.1 truthfulness and focus brief`). The implementation
stays within AA Renderer code and narrowly scoped V2 Renderer integration. No
Host Service, PTY daemon, terminal persistence, Pi hook, Git/worktree,
database-schema, or runtime-adapter file changed.

## Semantic Changes and Final Vocabulary

Phase 2.1 separates a successful launch receipt from an authoritative runtime
assignment:

| Term | Exact meaning |
| --- | --- |
| `HANDING TO <EMPLOYEE>` | The existing preset launch promise is still pending. |
| `DISPATCHED TO <EMPLOYEE>` | The existing launch path returned success after creating or writing the target terminal. |
| `ASSIGNED TO <EMPLOYEE>` | Reserved for presentation backed by an authoritative terminal-agent binding. A boolean preset result does not produce this state. |
| `UNTRACKED` | The active terminal has a known employee/preset launch identity but no authoritative lifecycle binding. |
| `UNASSIGNED` | The active terminal is generic/local and has no known employee identity. |

`V2PresetsBar` still calls the unchanged
`useV2PresetExecution.executePreset` path. Its temporary receipt now moves
from `HANDING` to `DISPATCHED` only after the existing promise returns `true`.
A failed launch returns to the idle Roster state and retains the existing error
toast behavior. The presentation contract keeps an explicit `assigned` case
for future binding-confirmed callers, but the Roster never selects it from a
boolean launch result.

## Active Worker Card

The compact header card now follows the active pane instead of always showing
the newest global Pi session. The bottom status bar continues to expose the
global Pi lifecycle, so switching panes does not hide or detach a live Pi
session.

Identity is resolved in this order:

1. The real `TerminalAgentBinding` for the active terminal.
2. Renderer launch identity captured from the existing preset/agent launch.
3. A recognized legacy pane title, but only while the title has not been
   edited as Task Folder display text.
4. Honest `LOCAL WORKER / UNASSIGNED` fallback.

A non-terminal active pane produces `NO ACTIVE WORKER` rather than retaining a
stale Pi card. A binding supplies real lifecycle state. Known non-Pi launches
without a binding use the existing Employee Persona Registry and display
`UNTRACKED`; they never receive fabricated live state.

The existing AA agent-status provider now exposes its already-fetched binding
map to AA children. This adds no polling. `TerminalPaneData` carries optional
Renderer-only `launchIdentity` and `taskTitleEdited` metadata inside the
existing pane-layout persistence mechanism. Launch identity is captured at
the existing preset, terminal-agent, resume, and workspace-create entry
points; it is not a new runtime identity protocol.

## Task Folder

### State vocabulary

The Task Folder now uses the truthful Phase 2.1 vocabulary:

| Real tracking/event condition | Display state |
| --- | --- |
| Generic terminal with no identity | `UNASSIGNED` |
| Known launch identity without a binding | `UNTRACKED` |
| Tracked default/attached state | `IDLE` |
| `Start`, `PostToolUse`, `PostToolUseFailure`, `Thinking`, `UserPromptSubmit`, `BeforeAgent` | `WORKING` |
| `PermissionRequest`, `PendingQuestion` | `WAITING` |
| `Stop` | `TURN COMPLETE` |
| `Detached` | `SESSION ENDED` |
| `Failed` | `ERROR` |

`TURN COMPLETE` replaces Phase 2's ambiguous `DONE`; it describes only the
end of the current Pi turn and does not claim completion of a durable task.
Tracked folders say `ASSIGNED <worker> / STATUS <state>`. Known non-Pi folders
say `WORKER <employee> / TRACKING UNTRACKED`. Generic terminals say
`WORKER — / STATUS UNASSIGNED`.

### Direct rename and persistence

The visible Task Folder title can be edited by double-click, Enter, or F2.
Enter and blur save; Escape cancels. Saved input is whitespace-normalized and
limited to 48 Unicode characters. Saving an empty value clears the override
and restores the safe session/terminal fallback.

The edit reuses the existing pane `titleOverride` setter. The accompanying
`taskTitleEdited` flag is stored in the same existing pane data so edited task
text is never reinterpreted as employee identity. There is no task table,
schema, prompt parsing, terminal-history parsing, or new persistence service.
The input stops keyboard propagation while editing; xterm focus and input
resume normally afterward. Explicit ARIA labels and a visible hard-edge focus
state were added.

## Default Pane Composition Decision

Inspection showed that the current workspace-create append path already has
the required safe default: a new Pi launch with no saved layout produces one
terminal-only tab and does not automatically create a Changes pane. The
Changes pane seen in the baseline fixture belongs to its saved, user-created
split.

No pane-default rewrite was therefore needed. Focused tests now lock down both
sides of the boundary:

- a fresh Pi-first launch produces one terminal pane and no automatic
  secondary pane;
- an existing split remains byte-for-byte unchanged when another launch is
  appended as a new tab;
- a setup terminal reused by a chained agent remains one pane while retaining
  the agent's separate launch identity.

Real Electron QA created a disposable Pi-first workspace. It opened with one
tab, one real Pi terminal, no split, and no central Changes pane. At 1440 px,
the terminal occupied approximately 99 percent of the central pane workspace,
comfortably exceeding the 65 percent target. Both temporary QA worktrees and
their local branches were deleted after verification; the original fixture
and its saved split were restored intact.

## Exact Files Changed

New AA module:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveWorkerCard/AAActiveWorkerCard.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveWorkerCard/aaActiveWorkerPresentation.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveWorkerCard/aaActiveWorkerPresentation.test.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveWorkerCard/index.ts`

Existing AA presentation files:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/AAAgentStatus.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAssignmentLabel/aaAssignmentPresentation.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAssignmentLabel/aaAssignmentPresentation.test.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/AATaskFolder.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.test.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATerminalFrame/AATerminalFrame.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAWorkspaceHeader/AAWorkspaceHeader.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/aa-office.css`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/index.ts`

Narrow V2 Renderer integration:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/components/TerminalPane/components/TerminalAgentResumeBanner/TerminalAgentResumeBanner.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/useV2PresetExecution/useV2PresetExecution.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types.ts`
- `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.ts`
- `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.test.ts`

Documentation:

- `docs/aa/PHASE-2.1-REPORT.md`

## Verification

### Automated checks

| Check | Result |
| --- | --- |
| `bun run typecheck` from `apps/desktop` | Passed, including icon/route generation and `tsc --noEmit`. |
| Biome `2.4.2` format/check over all changed TS, TSX, and CSS | Passed, 23 source files. |
| `./scripts/lint.sh` over all changed TS, TSX, and CSS | Passed, 23 source files, no fixes. |
| Focused AA and pane-layout Bun suite | Passed, 62 tests / 0 failures / 73 assertions across 7 files. |
| `git diff --check` | Passed. |
| RED-path review | Passed; only AAOffice, scoped V2 Renderer integration, workspace-create Renderer tests, and this report changed. |

The focused suite covers `HANDING`/`DISPATCHED`/binding-confirmed `ASSIGNED`,
tracked/untracked/unassigned worker resolution, active-pane fallbacks, Task
Folder rename normalization/save/cancel/empty fallback, `TURN COMPLETE` and
`SESSION ENDED`, Pi-first default composition, deduped launch identity, and
saved-split preservation.

### Electron verification

The Electron Renderer was confirmed to run from this worktree on Vite port
`3005` with CDP port `9222`. Interaction used real CDP mouse and keyboard input
rather than direct DOM click calls.

| Surface or behavior | Result |
| --- | --- |
| Existing Pi terminal | Real Pi binding remained attached; the active card and terminal Task Folder showed `PI`, `IDLE`, and binding-backed assignment. |
| Non-Pi dispatch | A real Superset CLI Roster click created its existing terminal target and showed `DISPATCHED TO SUPERSET CLI`, never `ASSIGNED`. |
| Active worker | Superset CLI became `SUPERSET CLI WORKER / UNTRACKED` from launch metadata; selecting the Pi tab restored the real Pi card and state. |
| Pi session safety | The original Pi session stayed attached and recoverable throughout non-Pi dispatch and route/reload checks. |
| Non-Pi Task Folder | Displayed `WORKER SUPERSET CLI / TRACKING UNTRACKED` without fabricated lifecycle state. |
| Rename | Save, Escape cancellation, empty fallback, whitespace behavior, and restoration of the original title all passed. |
| Terminal focus | After rename editing, xterm regained `Terminal input` focus and accepted a typed `z` plus cleanup Backspace. |
| File Cabinet | Files, Changes, and Review activated through real pointer events; Files was restored afterward. |
| Diff | A temporary fixture line produced a real `1 CHANGED` state and rendered the file diff. Unified/Split switching and file collapse/expand worked; the line was removed and both Git and UI returned to clean/`0 CHANGED`. |
| Navigation and reload | Home, return to the same workspace route, and Renderer reload preserved the Pi terminal, saved split, task title, and active-worker behavior. |
| Default workspace | A disposable real Pi workspace opened as one tab, one terminal, no split, and no automatic Changes pane; Pi reached the real `TURN COMPLETE` state after its test turn. |
| Saved layout | The baseline Pi plus Changes split remained two panels after reload and after default-workspace QA. |
| Responsive layout | 1920×976 and emulated 1440×800 had no page-level horizontal or vertical overflow. The 140 px Worker Card and both cabinets remained visible. |
| Reduced motion | The dispatch receipt animation resolved to the reduced `0.01ms` duration under `prefers-reduced-motion: reduce`. |
| Accessibility | Worker Card, Task Folder, rename control, File Cabinet tabs, and xterm retained explicit accessible labels and visible focus behavior. |
| Runtime errors | No uncaught Renderer exception. Only the pre-existing `DockBadgeController` React development warnings appeared. |

Screenshots produced during QA (untracked temporary artifacts):

- `/tmp/aa-office-phase-2.1.png` — restored Pi workspace at 1920×976.
- `/tmp/aa-office-phase-2.1-compact.png` — 1440×800 layout.
- `/tmp/aa-office-phase-2.1-dispatched.png` — Superset CLI dispatch and
  untracked presentation; temporary QA tabs visible in this capture were
  subsequently removed.
- `/tmp/aa-office-phase-2.1-default.png` — new terminal-first Pi workspace.

## Known Limitations and Intentional Deferrals

1. Superset still has no generic lifecycle binding for every terminal agent.
   Known non-Pi presets therefore remain explicitly `UNTRACKED`.
2. Newly launched/resumed panes retain separate Renderer launch identity.
   Older saved panes can use only a recognized, unedited legacy title; an old
   unknown pane honestly falls back to local/unassigned.
3. Selecting a different historical terminal session can clear stale launch
   metadata. Without a real binding for the selected session, AA intentionally
   falls back rather than carrying an incorrect employee forward.
4. Task Folder rename persists only through the existing pane-layout/title
   mechanism. It is not a durable task entity, assignment record, or database
   row.
5. `SESSION ENDED` is mapped truthfully when `Detached` is present, but ended
   bindings may disappear from the live query before the Renderer can display
   that event.
6. Dispatch feedback is intentionally temporary. It proves launch success,
   not continuing ownership, progress, or completion.
7. Existing saved Changes/split layouts are deliberately preserved. Phase 2.1
   changes only the no-saved-layout expectation and does not force the
   terminal to replace user-created panes.
8. The previously documented `DockBadgeController` development warnings
   remain outside this phase and do not reference a changed file.

Explicitly deferred: native Pi chat, reasoning runtime integration, generic
agent lifecycle infrastructure, task persistence, prompt/history inference,
new runtime adapters, multi-agent orchestration, and any Host Service, PTY,
Git/worktree, or database changes.

## Recommended Next Phase

Before adding another product layer, visually review the active-worker and
terminal-first states at both verified viewport sizes. A later approved brief
can decide whether Superset should expose authoritative generic terminal-agent
identity and current reasoning through runtime contracts. Until those
contracts exist, AA should continue to present `UNTRACKED` and unavailable
reasoning explicitly rather than infer either in the Renderer.

Phase 2.1 stops here. Phase 3 has not begun.
