# AA Phase 2 Report

## Reasoning Integration Audit

Audit completed before implementation on branch `aa-spike` at
`554f540b1`.

### Existing capability

- `packages/shared/src/agent-models.ts` defines Pi's real launch-time effort
  values as `off`, `minimal`, `low`, `medium`, `high`, and `xhigh`, using the
  existing `--thinking` flag.
- The existing New Workspace Renderer flow selects an effort through
  `useAgentEffortPreference` and passes it to `workspaces.create`.
- The existing host `agents.run` contract also accepts an optional effort and
  validates it before adding the corresponding launch argument.

### Renderer read/write boundary

- **Write at launch:** available through existing workspace/agent launch
  contracts. This is a launch option, not a live session setting.
- **Read for the active Pi session:** unavailable. `TerminalAgentBinding`
  exposes agent identity, lifecycle timestamps/state, terminal ID, and an
  optional agent-session ID, but not effort. `TerminalPaneData` stores only the
  terminal ID, and V2 terminal preset rows do not persist an effort value.
- **Change after launch:** no existing Renderer control can change the active
  Pi process's thinking level and then confirm the effective value.

### Phase 2 decision

Phase 2 will not add an active-workspace reasoning selector or claim a current
reasoning value. It will add only the AA presentation mapping/API, hair-state
component, focused tests, and an untracked non-runtime visual preview. No RED
runtime file will be modified to obtain or persist reasoning state.

### Reasoning Hair implementation

The local AA presentation contract accepts only Pi's real values. Unknown,
blank, or invented labels return no presentation:

| Pi value | Explicit label | Hair state |
| --- | --- | --- |
| `off` | `OFF` | full |
| `minimal` | `MINIMAL` | full |
| `low` | `LOW` | trimmed |
| `medium` | `MEDIUM` | receding |
| `high` | `HIGH` | sparse |
| `xhigh` | `XHIGH` | bald |

`AAHairState` supplies the SVG hair fragments, while
`AAReasoningIndicator` always renders both the worker and the exact text value.
`AAAgentAvatar` accepts an optional reasoning value but keeps its Phase 1.2
full-hair appearance when no real value is supplied.

The indicator is deliberately **not mounted in the active workspace**. A
non-runtime QA gallery was mounted temporarily through the development
Renderer to inspect every real mapping plus `UNAVAILABLE`, then removed. The
active workspace contained zero reasoning indicators and zero reasoning data
attributes both before and after that preview.

## Task Folder

Phase 2 places a compact paper-folder strip in the existing terminal frame,
outside the xterm viewport. It does not add a task entity or modify the pane
model.

### Real data sources

| Display | Existing source |
| --- | --- |
| Title | Existing `pane.titleOverride`, then the known terminal kind (`Pi Workstation` or `Local Terminal`) |
| Assignee | Existing live Pi `TerminalAgentBinding.agentId`, only when the binding belongs to that terminal |
| State | Existing Pi `lastEventType` on that binding |
| Changed files | Existing `WorkspaceGitStatusProvider`; staged and unstaged paths are de-duplicated |

The pure title resolver also codifies the complete safe priority contract:
explicit title, existing session/preset label, terminal label, then
`Current Work Session`. It normalizes whitespace and truncates at 48 Unicode
characters. No terminal history or prompt text is inspected.

### State mapping

| Real condition/event | Task Folder state |
| --- | --- |
| No binding for this terminal | `UNASSIGNED` |
| `Attached` or another non-action event | `IDLE` |
| `Start`, `PostToolUse`, `PostToolUseFailure`, `Thinking`, `UserPromptSubmit`, `BeforeAgent` | `WORKING` |
| `PermissionRequest`, `PendingQuestion` | `WAITING` |
| `Stop`, or `Detached` if surfaced | `DONE` |
| `Failed` | `ERROR` |

`DONE` means the real Pi lifecycle reported the end of the current turn; it is
not a claim that a durable project-management task was completed. Ended
bindings normally disappear from the live query, so `Detached` is chiefly a
defensive presentation mapping.

The folder is shown for every terminal. A Pi terminal can show the real Pi
assignee and lifecycle; another terminal remains explicitly `UNASSIGNED`
because Superset does not expose a durable generic-agent binding to this pane.
At narrow pane widths, container queries hide changed-file and then status
metrics while retaining the explicit Task Folder title. There is no new
polling and no Phase 2 persistence.

## Manual Assignment

The Employee Roster continues to call the existing
`useV2PresetExecution.executePreset` path. Phase 2 does not create an agent
adapter, handoff protocol, or alternate launch route.

Presentation language now reads:

- idle: `EMPLOYEE ROSTER / ASSIGN CURRENT WORK`
- launch pending: `TASK FOLDER / HANDING TO <EMPLOYEE>`
- launch succeeded: `TASK FOLDER / ASSIGNED TO <EMPLOYEE>`

Preset buttons and their context-menu actions use `Assign current work`, with
explicit accessible labels such as `Assign current work to Codex`.

The existing executor now returns a boolean result from the same terminal
write/create operation. `V2PresetsBar` shows the success receipt only after
that promise returns `true`; a thrown launch keeps the existing error toast and
returns the Roster to idle without claiming assignment. An attempt token
prevents an older concurrent launch from overwriting a newer receipt. The
receipt is an `aria-live="polite"` status and clears after 2.6 seconds. Its
single two-pixel folder motion is disabled by `prefers-reduced-motion`.

The verified Superset CLI assignment created a second tab using the existing
launch semantics. The original Pi binding remained `Attached`, its worker
state remained `IDLE`, and closing the test tab restored the original Pi Task
Folder. No session migration occurred.

## Files Changed

New AA presentation modules:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAHairState/`
  - `AAHairState.tsx`
  - `index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAReasoningIndicator/`
  - `AAReasoningIndicator.tsx`
  - `aaReasoningPresentation.ts`
  - `aaReasoningPresentation.test.ts`
  - `index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/`
  - `AATaskFolder.tsx`
  - `aaTaskFolderPresentation.ts`
  - `aaTaskFolderPresentation.test.ts`
  - `index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAssignmentLabel/`
  - `AAAssignmentLabel.tsx`
  - `aaAssignmentPresentation.ts`
  - `aaAssignmentPresentation.test.ts`
  - `index.ts`

Existing AA/Renderer files updated:

- `AAOffice/AAAgentAvatar/AAAgentAvatar.tsx` — optional real reasoning hair.
- `AAOffice/AATerminalFrame/AATerminalFrame.tsx` — compact Task Folder host.
- `AAOffice/aa-office.css` — Task Folder, reasoning preview contract, handoff,
  responsive behavior, and reduced motion.
- `AAOffice/index.ts` — local exports.
- `V2PresetsBar/V2PresetsBar.tsx` — manual assignment state and receipt.
- `V2PresetBarItem.tsx` and `BuiltinPresetBarItem.tsx` — assignment wording and
  accessible actions.
- `usePaneRegistry.tsx` — passes the existing pane title to the AA frame.
- `useV2PresetExecution.ts` — reports success/failure from the unchanged launch
  path.
- `useWorkspaceHotkeys.ts` and `useWorkspacePaneOpeners.ts` — matching return
  type only.
- `docs/aa/PHASE-2-REPORT.md` — this report.

No RED-area file was modified. The only non-AA behavioral edit is the narrow
YELLOW Renderer change that returns whether the existing preset execution
succeeded.

## Verification

The branch was first fast-forwarded with:

```sh
git pull --ff-only origin aa-spike
```

This moved the baseline from `1e525c74b` to `554f540b1` and added the Phase 2
brief.

### Automated checks

| Check | Result |
| --- | --- |
| `bun run --cwd apps/desktop typecheck` | Passed (`tsc --noEmit`) |
| targeted `./scripts/lint.sh ...` over all changed TypeScript/TSX/CSS | Passed, 25 files, no warnings or fixes |
| focused AA Bun tests | Passed, 47 tests / 0 failures / 48 assertions |
| `git diff --check` | Passed |
| change-boundary review | Only AAOffice, scoped V2 Renderer integration, and this document changed; no RED paths |

The focused suite covered the existing lifecycle and persona contracts plus:

- all six real Pi reasoning values and unknown-value rejection;
- deterministic hair mapping;
- title priority, whitespace, truncation, and generic fallback;
- Task Folder unassigned/idle/working/waiting/done/error mapping;
- idle, pending, successful, and neutral-fallback assignment language.

### Electron runtime verification

The running Electron process and Renderer were confirmed to originate from
this worktree (`apps/desktop`, Vite port `3005`, CDP port `9222`). Verification
used real CDP mouse and keyboard input against the application, not direct DOM
click invocation.

| Surface/behavior | Result |
| --- | --- |
| Existing Pi session | Live binding remained `Attached`; AA Worker and Task Folder showed real `IDLE` |
| Pi terminal input/focus | xterm retained `Terminal input` focus and received a typed `z` plus cleanup Backspace |
| Task Folder grounding | `Pi Workstation`, assignee `PI`, `IDLE`, and real `0 CHANGED`; no invented title or metric |
| Reasoning grounding | Active workspace exposed no reasoning indicator/value; non-runtime gallery showed exact `OFF` through `XHIGH` plus `UNAVAILABLE` |
| Manual assignment | Real Superset CLI Roster click created a second terminal tab, then showed `ASSIGNED TO SUPERSET CLI` |
| Pi session safety | Pi stayed attached while the second terminal was active and was restored after that tab was closed |
| Non-Pi fallback | New Superset CLI terminal used its real pane label and honestly showed `UNASSIGNED` without fabricated lifecycle data |
| File Cabinet | Files, Changes, and Review all activated through real clicks; Files was restored |
| Navigation | Home route and Back-to-workspace route both succeeded |
| Renderer reload | Pi terminal, Task Folder, lifecycle state, and route restored |
| Reduced motion | Handoff motion changed from `0.3s` to `0.01ms` under the reduced-motion media query |
| Responsive layout | 1920×976 and emulated 1440×800 had no document overflow; Task Folder remained visible at 202 px in the compact pane |
| Runtime errors | No uncaught Renderer exception. Only the already documented `DockBadgeController` React development warnings appeared during sidebar renders. |

Screenshots produced during verification (untracked QA artifacts):

- `/tmp/aa-office-phase-2.png` — final Pi workspace at 1920×976.
- `/tmp/aa-office-phase-2-compact.png` — compact 1440×800 layout.
- `/tmp/aa-office-phase-2-assigned.png` — grounded Superset CLI handoff receipt
  and new terminal.
- `/tmp/aa-office-phase-2-reasoning-hair.png` — non-runtime reasoning/hair
  contract preview.

## Known Limitations and Intentional Deferrals

1. The active Pi reasoning level is not Renderer-readable. A selector and live
   hair state remain deferred rather than presenting a launch preference as an
   effective session value.
2. V2 terminal panes do not retain an explicit task title, initial prompt, or
   generic-agent identity. The Task Folder therefore uses the pane/session
   label or terminal-kind fallback, and non-Pi terminals remain `UNASSIGNED`.
3. The manual assignment receipt is intentionally ephemeral. It confirms the
   real launch, but it does not create a persistent relationship or task row.
4. `DONE` represents a real Pi `Stop` event for the current turn, not durable
   task completion. No percentage, workload, or productivity state exists.
5. Hotkey preset launches preserve their prior behavior and do not currently
   show the Roster's transient receipt; button and context-menu assignment
   paths do.
6. Failure fallback is covered by return-path logic and presentation tests,
   but QA did not deliberately corrupt an agent command merely to force a
   launch failure.
7. The two pre-existing `DockBadgeController` development warnings remain
   outside the Phase 2 scope and do not reference a Phase 2 file.

Explicitly deferred: native Pi chat, live reasoning RPC, new adapters, generic
agent lifecycle bindings, task persistence, prompt/history parsing,
multi-agent orchestration, automatic routing, workflow engines, project
management, and any PTY/Host Service/Git/worktree/database changes.

## Recommended Next Phase

Before expanding the work model, the next phase should first expose an
authoritative active-session reasoning value and durable generic terminal-agent
identity through an approved runtime contract. Only then should AA mount a live
reasoning selector or retain assignments beyond the success receipt. A smaller
presentation-only follow-up could refine narrow Task Folder typography and
clarify the distinction between turn `DONE` and session `IDLE` without changing
runtime behavior.

Phase 2 stops here. No later-phase work has begun.
