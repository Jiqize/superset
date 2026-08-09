# Phase 2.2 — Semantic Density and v0.1 Checkpoint

Phase 2.1 is complete and stable at commit `5fbdd66792ad277affe8af7a2c7826ab16ba4e3e`.

Do not begin Phase 3.

## Read first

- `docs/aa/SPIKE.md`
- `docs/aa/IMPLEMENTATION-PLAN.md`
- `docs/aa/BASELINE.md`
- `docs/aa/CODEBASE-MAP.md`
- `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
- `docs/aa/PHASE-2-REPORT.md`
- `docs/aa/PHASE-2.1-REPORT.md`

Treat `CODEBASE-MAP.md` as the repository scope. Do not rescan unrelated monorepo areas.

## Goal

Complete a narrow semantic-density pass and establish AA Office v0.1 as a stable checkpoint.

This phase addresses two observed usability issues:

1. The Worker Card reports current state while Task Folder may report the last completed turn. The labels must make that distinction immediately clear.
2. The Employee Roster can overflow at compact widths without a strong discoverability cue.

This is a Renderer and presentation task. Preserve all existing runtime behavior.

## 1. Clarify current worker state versus last turn result

### Current behavior

A tracked Pi terminal can truthfully display:

- Worker Card: `PI WORKER / IDLE`
- Task Folder: `STATUS / TURN COMPLETE`

The values describe different time scopes, but the repeated status language can appear contradictory.

### Required semantic model

The Worker Card remains the authoritative presentation of the worker's current live state.

Examples:

- `IDLE`
- `THINKING`
- `WORKING`
- `WAITING`
- `ERROR`
- `UNTRACKED`
- `UNASSIGNED`

The Task Folder describes the current work item and, where applicable, the outcome of the most recent turn or session event.

### Required Task Folder labels

Use context-aware metric labels rather than always displaying `STATUS`.

Recommended mapping:

| Task Folder presentation state | Metric label | Value |
| --- | --- | --- |
| `unassigned` | `STATUS` | `UNASSIGNED` |
| `untracked` | `TRACKING` | `UNTRACKED` |
| `idle` | `STATUS` | `IDLE` |
| `working` | `STATUS` | `WORKING` |
| `waiting` | `STATUS` | `WAITING` |
| `turn-complete` | `LAST TURN` | `COMPLETE` |
| `session-ended` | `SESSION` | `ENDED` |
| `error` | `LAST EVENT` or `STATUS` | `ERROR` |

Choose one consistent error label after inspecting the actual event model. Do not claim task completion.

The rendered phrase should read naturally, for example:

```text
ASSIGNED PI    LAST TURN COMPLETE    0 CHANGED
```

while the Worker Card may simultaneously show:

```text
PI WORKER    IDLE
```

This is expected and should no longer look contradictory.

### Accessibility

Update the Task Folder `aria-label` so the temporal distinction is explicit.

Example:

```text
Task folder: Fix session resume; assigned: PI; last turn: complete
```

Do not remove the explicit text labels in favor of icon-only presentation.

### Testing

Add or update focused tests for:

- `turn-complete` uses `LAST TURN / COMPLETE`
- `session-ended` uses `SESSION / ENDED`
- live states continue to use `STATUS`
- `untracked` continues to use `TRACKING`
- accessible summary text reflects the displayed metric meaning

Keep the existing lifecycle mappings unchanged unless a verified semantic bug is found.

## 2. Employee Roster overflow discoverability

### Current behavior

At approximately 1440 px width, the Employee Roster remains horizontally scrollable, but later employees such as Grok or Superset CLI may be outside the visible area. The user receives little indication that more employees exist.

### Required behavior

Add a lightweight, accessible overflow affordance while preserving the existing Roster layout and launch behavior.

The preferred implementation is:

- a subtle right-edge hard-gradient or solid-step fade when more content exists to the right
- a compact right scroll button when more content exists to the right
- a compact left scroll button only after the user has scrolled away from the start
- buttons scroll by a useful group-sized amount rather than a few pixels
- pointer, trackpad, mouse wheel, touch, and keyboard scrolling continue to work

The visual affordance must match AA Office:

- hard-edged control
- compact size
- explicit tooltip or accessible label
- no floating glass controls
- no large overlay
- no dependency on hover-only discovery

Suggested accessible labels:

- `Scroll employee roster left`
- `Scroll employee roster right`

### Overflow truthfulness

Only show an overflow control when overflow actually exists.

Update visibility when:

- the container resizes
- roster items change
- the user scrolls
- the application switches between verified viewport sizes

Use a local, lightweight approach such as scroll measurements and `ResizeObserver` if consistent with repository conventions. Avoid continuous polling.

### Interaction requirements

- Do not alter preset ordering.
- Do not hide employees behind a new menu as the only access path.
- Do not change preset launch semantics.
- Do not interfere with drag/reorder behavior, context menus, or hotkeys.
- Preserve horizontal scroll position where existing component lifecycle permits.
- Respect reduced motion. Smooth scrolling may be disabled or made immediate under reduced motion.

### Optional count

A small `MORE` or hidden-count label may be added only if it can be derived exactly and remains visually compact. Arrow controls plus edge cue are sufficient.

### Testing

Add focused tests or pure helper tests for:

- no overflow at wide width
- right overflow at initial position
- both left and right availability in the middle
- left overflow only near the end
- visibility recalculation after item/container changes

Use manual Electron verification for actual scrolling and preset launches.

## 3. Remove only obvious adjacent semantic duplication

Perform a narrow audit of the Phase 2.1 header and terminal frame.

Remove or compress text only when the same fact appears in adjacent surfaces and removing it does not reduce clarity or accessibility.

Allowed examples:

- avoid showing the same current worker state twice within the same compact terminal header
- retain global Pi state in the bottom status bar when it has a distinct global purpose
- retain Worker Card state because it describes the active pane
- retain Task Folder metrics because they describe the work item

Do not redesign the layout. Do not remove labels solely to make the interface visually sparse.

Document every semantic compression in the report.

## 4. AA Office v0.1 checkpoint

Create:

`docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`

This document should be concise and useful to a fresh Codex session. Include:

### Product statement

A real terminal-agent workstation inside a compact pixel office.

### Stable scope

- macOS first
- Pi first
- real xterm/Pi TUI
- Briefcase Cabinet
- Work Folder
- Employee Roster
- active Worker Card
- Task Folder
- manual dispatch language
- File Cabinet
- Git/worktree/diff integration
- AA lifecycle visuals

### Architecture boundary

List the stable presentation layer and the infrastructure intentionally reused from Superset.

### Truthfulness rules

Summarize:

- `DISPATCHED` versus binding-confirmed `ASSIGNED`
- `UNTRACKED` versus `UNASSIGNED`
- current Worker state versus `LAST TURN`
- reasoning hair remains unavailable in the active workspace without authoritative session reasoning

### Known limitations

Include at minimum:

- no generic lifecycle binding for every terminal agent
- no authoritative active-session reasoning value
- Task Folder is pane-level presentation, not a task database
- dispatch receipt is ephemeral
- older panes may lack launch identity
- saved user pane layouts remain preserved

### Recommended future options

Describe future choices without starting them:

1. Runtime contract for generic agent identity/lifecycle
2. Authoritative Pi active-session reasoning contract
3. Native structured chat exploration
4. Multi-agent handoff exploration only after identity and task contracts are stable

Do not describe unimplemented features as available.

## 5. Keep stable

Do not substantially modify:

- real Pi TUI or xterm rendering
- terminal focus/input
- active Worker resolution priority
- Task Folder rename persistence
- Briefcase Cabinet
- File Cabinet
- default pane composition
- pane engine
- Git/worktree behavior
- Pi lifecycle hooks
- Host Service
- PTY daemon
- database schema
- runtime adapters

Small local CSS or component changes required for this phase are allowed.

## 6. Architecture boundary

Follow `CODEBASE-MAP.md` strictly.

GREEN: normal AA Renderer and presentation changes.

YELLOW: modify only when required and justified.

RED: do not modify.

GRAY: ignore.

If any requirement appears to need RED changes, stop that sub-feature and document the blocker.

## 7. Verification

Run:

- Desktop TypeScript checks
- targeted Biome/format checks
- targeted lint
- focused AA tests
- `git diff --check`
- RED-path review

Electron verification must cover:

- Pi current state plus Task Folder `LAST TURN` semantics
- live `WORKING` or `WAITING` state if practical
- Superset CLI or another known non-Pi employee remains `UNTRACKED`
- Roster at 1920×976
- Roster at 1440×800
- right scroll control reveals hidden employees
- left control appears after scrolling
- every revealed employee still launches through the existing path
- keyboard and trackpad/wheel scrolling remain usable
- reduced-motion behavior
- terminal input/focus
- Files/Changes/Review
- route navigation and Renderer reload
- no page-level overflow
- no uncaught Renderer errors

Temporary QA tabs, workspaces, files, branches, and worktrees must be cleaned up.

## 8. Deliverables

Create:

- `docs/aa/PHASE-2.2-REPORT.md`
- `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`

The Phase 2.2 report must include:

- baseline commit
- exact files changed
- Task Folder semantic changes
- Roster overflow implementation
- any duplicate information compressed
- accessibility behavior
- tests and Electron verification
- screenshots or screenshot paths if practical
- known limitations
- confirmation that no RED area changed

## Explicit non-goals

Do not implement:

- generic agent lifecycle infrastructure
- active-session reasoning runtime support
- native Pi chat
- Pi RPC adapter
- ACP rewrite
- automatic multi-agent orchestration
- agent-to-agent communication
- workflow engine
- task database
- Kanban or timeline
- project management
- fake progress or productivity metrics
- office simulation or gamification

After Phase 2.2 is complete, create both documents, commit, push to `origin/aa-spike`, and STOP.

Do not begin Phase 3.