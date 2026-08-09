# Phase 2.1 — Truthfulness & Focus Pass

Phase 2 is complete and stable. Do not begin Phase 3.

## Read first

- `docs/aa/SPIKE.md`
- `docs/aa/IMPLEMENTATION-PLAN.md`
- `docs/aa/BASELINE.md`
- `docs/aa/CODEBASE-MAP.md`
- `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
- `docs/aa/PHASE-1.2-REPORT.md`
- `docs/aa/PHASE-2-BRIEF.md`
- `docs/aa/PHASE-2-REPORT.md`

Treat `CODEBASE-MAP.md` as the repository scope. Do not rescan unrelated parts of the monorepo.

## Goal

Resolve the remaining semantic conflicts in the Phase 2 work model and make the real terminal the clear primary working surface.

Phase 2.1 has four objectives:

1. Make assignment language accurately reflect what Superset has verified.
2. Make the Worker Card follow the active terminal/pane.
3. Make Task Folder state and title more useful and truthful.
4. Improve the default pane composition for a Pi-first, single-session workspace.

Preserve all runtime architecture and existing Superset terminal behavior.

---

## 1. Dispatch, assignment, and tracking semantics

### Current problem

The Phase 2 interface can simultaneously show:

- `ASSIGNED TO SUPERSET CLI` in the Employee Roster receipt
- `UNASSIGNED` inside the newly created non-Pi Task Folder
- `PI WORKER / IDLE` in the global worker card

The underlying launch succeeded, but Superset does not expose a durable generic-agent lifecycle binding for every terminal. A successful terminal/pane creation therefore proves dispatch, not a fully tracked agent assignment.

### Required terminology

Use these meanings consistently:

- `HANDING TO <EMPLOYEE>`: launch request is in progress.
- `DISPATCHED TO <EMPLOYEE>`: the existing Superset preset launch completed successfully and created/wrote the target terminal session.
- `ASSIGNED TO <EMPLOYEE>`: use only when an authoritative binding or existing tracked identity confirms that the active terminal is attached to that employee.
- `UNTRACKED`: a known employee/preset terminal exists, but AA has no authoritative lifecycle binding for it.
- `UNASSIGNED`: use only for a generic/local terminal with no known employee or preset identity.

Do not show `ASSIGNED` merely because `executePreset()` returned `true`.

### Implementation guidance

Update the manual assignment presentation contract and tests.

The existing launch path must remain unchanged:

`V2PresetsBar` → `useV2PresetExecution.executePreset` → existing terminal/pane creation or terminal write.

Keep the boolean success return if useful. Interpret it as successful dispatch.

Suggested receipt flow:

```text
EMPLOYEE ROSTER / ASSIGN CURRENT WORK
TASK FOLDER / HANDING TO CODEX
TASK FOLDER / DISPATCHED TO CODEX
```

The receipt remains temporary and must only show success after the existing launch promise resolves successfully.

Preserve current error toast behavior. A failed launch must return directly to the idle roster state without a success claim.

Do not add persistent assignment storage in this phase.

---

## 2. Active Worker Card

### Product rule

The Worker Card should describe the currently active terminal/pane, while the bottom status bar may continue to expose the global Pi session state where useful.

### Active pane presentation

Resolve the active terminal using existing pane/tab state.

Use the strongest real identity source available:

1. authoritative terminal-agent binding for that terminal
2. existing preset/session label associated with the pane
3. existing pane title when it still represents the launch identity
4. generic local terminal fallback

Do not infer identity from terminal transcript or shell history.

### Expected behavior

For an active Pi terminal with a real Pi binding:

```text
PI WORKER
IDLE / THINKING / WORKING / WAITING / ERROR
```

Use the real Pi lifecycle state.

For a known non-Pi preset terminal without a generic lifecycle binding:

```text
CODEX WORKER
UNTRACKED
```

or:

```text
SUPERSET CLI
SESSION
```

Use one consistent explicit status vocabulary. `UNTRACKED` is preferred because it explains the limitation accurately.

For an ordinary shell/local terminal:

```text
LOCAL WORKER
UNASSIGNED
```

Use the existing Employee Persona Registry for recognized employee identities. Use the generic persona for local or unknown terminals.

### Global Pi state

Switching to a non-Pi pane must not destroy or hide the actual Pi session. Keep any global Pi indicator in an appropriate compact status area if it already exists, but avoid presenting Pi as the current worker when another pane is active.

### Constraints

- Do not add a generic agent lifecycle protocol.
- Do not modify terminal bindings, Host Service, Pi hooks, or PTY.
- Do not claim live state for an untracked employee.
- Keep the Worker Card compact and preserve the current layout.

---

## 3. Task Folder truthfulness and direct rename

### 3.1 Task state vocabulary

Current `DONE` can be interpreted as durable task completion even though Pi `Stop` only confirms the end of the current turn.

Replace the state language with:

- `UNASSIGNED`
- `IDLE`
- `WORKING`
- `WAITING`
- `TURN COMPLETE`
- `SESSION ENDED` when a detached/ended session is explicitly surfaced
- `ERROR`
- `UNTRACKED` for a recognized employee terminal without lifecycle tracking

Recommended lifecycle mapping:

- `Start`, `PostToolUse`, `PostToolUseFailure`, `Thinking`, `UserPromptSubmit`, `BeforeAgent` → `WORKING`
- `PermissionRequest`, `PendingQuestion` → `WAITING`
- `Stop` → `TURN COMPLETE`
- `Detached` or an explicitly ended terminal → `SESSION ENDED`
- `Failed` → `ERROR`
- attached/default tracked state → `IDLE`

Do not claim project/task completion.

Update pure presentation mappings and tests accordingly.

### 3.2 Known non-Pi terminal

A terminal created from a known Employee Roster preset should not display `UNASSIGNED` solely because it lacks a generic lifecycle binding.

When its launch identity is still known, show:

```text
WORKER      CODEX
TRACKING    UNTRACKED
```

The Task Folder may derive the employee label from the existing pane/preset label. Treat this as launch identity, not verified runtime lifecycle.

A truly generic terminal remains `UNASSIGNED`.

### 3.3 Direct Task Folder rename

Allow the user to rename the current Task Folder using the existing pane title mechanism. Do not add a task database or schema.

Preferred interaction:

- double-click the Task Folder title to edit
- Enter saves
- Escape cancels
- blur may save if consistent with existing application patterns
- empty value restores the safe terminal/session fallback
- normalize whitespace
- maximum 48 Unicode characters

Reuse the existing pane title update API/store, such as the existing `titleOverride` mechanism. Do not parse terminal history or prompts.

Important distinction:

A user-edited Task Folder title is task display text. It must not be used to infer employee identity after editing. Keep employee identity resolution separate and use authoritative binding or existing launch context where available. If no separate identity remains available, fall back honestly to generic/untracked presentation.

Preserve keyboard focus behavior. Editing the Task Folder must not send keystrokes to xterm until editing ends.

Add accessible labels and visible focus state.

---

## 4. Terminal-first default pane composition

### Current problem

At 1440×800, an empty central Changes pane can consume close to half the workspace while the real terminal becomes too narrow for practical use. The right File Cabinet already exposes Files, Changes, and Review.

### Target

For a new Pi-first workspace with no saved user layout, the real terminal should be the dominant central surface.

Suggested default:

- one terminal pane as the primary pane
- no automatically opened empty Changes pane
- Changes/Diff/Review opens when the user explicitly requests it
- right File Cabinet remains available

At approximately 1440 px application width, target at least 65 percent of the central workspace for the terminal when no secondary pane was explicitly opened.

### Preservation rules

- Preserve existing saved pane layouts.
- Preserve user-created splits and tabs.
- Do not force-close a Changes pane the user explicitly opened.
- Apply a new default only when initializing an AA/V2 workspace with no saved pane composition.
- Do not modify the pane engine.
- Do not remove Changes, Diff, Review, Browser, or File functionality.

Inspect the existing V2 workspace initialization and default pane composition before editing. Keep the change narrow and Renderer-scoped.

If the current architecture cannot distinguish default initialization from a saved/user layout safely, stop this sub-feature and document the blocker rather than risking layout loss.

---

## 5. UI and visual guidance

Keep the Phase 1.2 and Phase 2 visual language stable.

Do not redesign:

- Briefcase Cabinet
- Employee Persona Registry
- File Cabinet
- terminal frame styling
- global navigation
- bottom status bar
- Reasoning Hair visual contract

Small typography, spacing, and narrow-layout adjustments are allowed for Task Folder and Worker Card.

The terminal remains the visual anchor.

Do not add large office scenes, game mechanics, fake progress, productivity scores, or decorative status data.

---

## 6. Architecture boundary

Follow `CODEBASE-MAP.md` strictly.

GREEN: AA Renderer and presentation changes.

YELLOW: narrowly scoped V2 Renderer integration only when required.

RED: no modifications.

Do not modify:

- PTY daemon
- Host Service lifecycle architecture
- terminal persistence
- Pi extension/hooks
- Git/worktree implementation
- database schema
- runtime adapter architecture
- agent protocol

Do not solve missing generic lifecycle tracking by creating fake Renderer state.

---

## 7. Testing and verification

Add or update focused tests for:

- `HANDING` versus `DISPATCHED` versus binding-confirmed `ASSIGNED`
- tracked, untracked, and unassigned worker presentation
- active pane identity resolution and fallbacks
- Task Folder lifecycle mapping including `TURN COMPLETE` and `SESSION ENDED`
- Task Folder rename normalization, length limit, save, cancel, and empty fallback
- default pane composition guard, if implemented

Manual Electron verification must include:

1. Open the existing Pi terminal and confirm real Pi lifecycle state.
2. Dispatch Superset CLI, Codex, or another available preset.
3. Confirm the receipt says `DISPATCHED`, not `ASSIGNED`, without a binding.
4. Confirm the active Worker Card changes to the active terminal identity.
5. Confirm the original Pi session remains attached and recoverable.
6. Confirm non-Pi Task Folder shows known worker plus `UNTRACKED` where appropriate.
7. Rename the Task Folder, save it, cancel an edit, and test empty fallback.
8. Confirm terminal keyboard input and focus still work after rename editing.
9. Verify Files, Changes, Review, Diff, navigation, route return, and renderer reload.
10. Verify a new/default workspace is terminal-first without damaging an existing saved split layout.
11. Verify 1440×800 and 1920×976 without page-level overflow.
12. Verify reduced motion and accessibility labels.

Run:

- desktop TypeScript check
- targeted lint/format
- focused AA tests
- `git diff --check`
- RED-path change review

---

## 8. Deliverable

Create `docs/aa/PHASE-2.1-REPORT.md` with:

- semantic changes and final vocabulary
- active Worker Card identity sources and fallbacks
- Task Folder rename implementation and persistence behavior
- default pane composition decision
- exact files changed
- tests and Electron verification
- screenshots or screenshot paths
- known limitations
- recommended next phase

After Phase 2.1 is runnable and the report is complete, STOP.

Do not begin Phase 3, native Pi chat, generic lifecycle infrastructure, reasoning runtime integration, task persistence, or multi-agent orchestration.