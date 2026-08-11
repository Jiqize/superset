# Phase 3J — Active Tasks Projection v0.1

## Status

Phase 3I concluded `PROCEED TO ACTIVE TASKS PROJECTION`.

This phase implements a Briefcase-level, task-oriented projection using only existing authoritative/persisted data. Do not add a Task database, Runtime Contract change, or new Host/runtime primitive.

## Read first

1. `docs/aa/PHASE-3I-MULTI-TASK-DOGFOOD-REPORT.md`
2. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
3. `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md`
4. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
7. `docs/aa/CODEBASE-MAP.md`

Phase 3F Grok activation remains deferred.

## Goal

Make the Briefcase answer the user's real question after multiple New Tasks exist:

> What work do I have, which task is live, which task is saved/resumable, and which one should I open?

Keep the existing Workspace/Work Folder model as the durable navigation target. Active Tasks is a derived projection over that model.

Target mental model:

```text
BRIEFCASE
AA Office

ACTIVE TASKS

Fix restart status
PI · LIVE · WORKING
3 changed

Improve sidebar
PI · LIVE · IDLE
1 changed

SAVED / RESUMABLE

Refactor runtime
PI · RESUMABLE
0 changed

+ NEW TASK
```

Do not infer `DONE` or completion.

## 1. Projection contract

Create a pure presentation/projection layer that derives one task row per eligible Work Folder/Workspace using only existing data.

Allowed evidence:

- Project/Briefcase ownership
- Workspace/Work Folder identity and persisted label
- persisted Task Folder title metadata
- terminal launch identity
- authoritative live AA Runtime Contract snapshot
- authoritative saved Pi resume candidate
- real Git changed-file count
- existing selected/open Workspace state

Forbidden evidence:

- terminal/xterm text
- prompt/transcript parsing
- elapsed-time guesses
- process-title heuristics
- stale UI animation state
- inferred completion/progress
- hidden branch/worktree naming as primary task identity

## 2. Task classification

Each task row must classify through explicit precedence:

### LIVE

Use only when an authoritative live runtime snapshot exists for that Workspace/terminal.

Show:

- employee identity, e.g. `PI`
- `LIVE`
- lifecycle only from the live snapshot, e.g. `WORKING`, `IDLE`, `WAITING`, `ERROR`

### SAVED / RESUMABLE

Use when no live authoritative snapshot exists and an exact Pi resume candidate exists.

Show:

- `PI`
- `RESUMABLE`

Do not reuse the last live lifecycle or animation after restart.

### UNTRACKED / COMPATIBILITY

Use when the Work Folder has a compatibility employee/terminal identity but no Tier 1 runtime authority and no exact Pi resume candidate.

Show:

- known compatibility employee if available
- `UNTRACKED`

### INSUFFICIENT EVIDENCE

Use only when a Workspace cannot be projected confidently into a task row.

Do not fabricate employee/status. Prefer keeping such Work Folders under the existing Workspace list rather than manufacturing an Active Task.

## 3. Eligible task identity

Primary task title precedence must use accepted persisted human-facing title semantics.

Prefer:

1. explicit persisted Task Folder title marked as user-edited/task-title metadata;
2. accepted existing human Workspace label only when it is known to come from New Task / accepted presentation state;
3. otherwise do not promote a technical branch/path label into Active Tasks.

Do not expose generated branch names, raw Workspace IDs, native runtime IDs, or worktree paths as primary labels.

## 4. Duplicate-title discriminator

Phase 3I found duplicate titles unsafe to choose by label alone.

When two or more projected task rows within the same Briefcase have the same normalized visible title, append a small stable discriminator derived from existing Workspace identity/creation evidence.

Requirements:

- deterministic across Renderer reload and full app restart;
- stable for the lifetime of the Work Folder;
- no raw UUID or technical path in normal UI;
- visually secondary;
- only shown when a collision exists;
- must not imply age/status unless that fact is authoritative.

Acceptable forms include a short neutral suffix such as `#A3F2` or another compact opaque discriminator derived from a stable hash of Workspace identity.

Do not use `newer`, `older`, `latest`, or timestamps unless existing authoritative creation metadata is already available and the design explicitly chooses it.

Add pure tests for collision groups, stable ordering, reload/restart reconstruction, and title normalization.

## 5. Briefcase information architecture

Inside an expanded Briefcase, make the task-oriented projection primary without deleting existing Work Folder navigation.

Recommended structure:

```text
AA Office
[ NEW TASK ]

ACTIVE TASKS
  Fix restart status
  PI · LIVE · WORKING     3 changed

  Improve sidebar
  PI · LIVE · IDLE        1 changed

SAVED / RESUMABLE
  Refactor runtime
  PI · RESUMABLE          0 changed

WORK FOLDERS
  local
  ...
```

Rules:

- `NEW TASK` remains the primary creation action inside the Briefcase.
- Original New Workspace remains available as an advanced/legacy path but should be visually secondary to the accepted Pi-first `NEW TASK` path.
- Existing Work Folder rows remain available for infrastructure/navigation/debugging and non-projectable workspaces.
- Avoid duplicating the same task at equal visual weight in both Active Tasks and Work Folders.
- If a projected task row maps to a Work Folder also shown below, de-emphasize the infrastructure row or move the full Workspace list under a secondary disclosure/section.

Do not remove existing Workspace routes or data models.

## 6. Row contents and density

At 1440×800 each projected row should remain compact.

Minimum row content:

- task title
- collision discriminator only if needed
- employee
- evidence class/status
- real changed-file count when available

Optional, only if it fits without crowding:

- small Pixel Worker/persona marker
- selected/live indicator

Do not show model, reasoning, runtime transport, branch, worktree path, native session ID, epoch, capability matrix, or timestamps in the row. Those belong to Employee Profile / Task Folder / infrastructure surfaces.

Changed count must be labeled/understood only as `changed`. Never treat it as progress or deliverable completion.

## 7. Row interaction

Selecting a projected task row must navigate to the real underlying Workspace/Work Folder.

After navigation:

- live Pi workspace shows existing authoritative worker/runtime state;
- saved/resumable Pi workspace shows the existing resume surface;
- compatibility workspace remains `UNTRACKED`;
- Files/Changes/Diff point to the selected real worktree;
- no new session is launched merely by selecting a task row.

Keyboard navigation and screen-reader labels must include task title, duplicate discriminator if present, employee, evidence state, and changed count when available.

Do not auto-resume a saved task on click. Resume remains explicit.

## 8. Restart truthfulness

Full restart behavior is a hard acceptance criterion.

Before any Pi resume after restart:

- no task row may display stale `WORKING`, `IDLE`, or animated activity unless a new authoritative live snapshot exists;
- exact saved Pi candidates must classify as `SAVED / RESUMABLE`;
- changed-file counts must be recomputed from current Git truth;
- duplicate discriminators must remain stable;
- task title must remain human-readable;
- technical pane/path labels must not replace the task title in the projection.

After exact Pi resume:

- the matching row transitions from `SAVED / RESUMABLE` to `LIVE · <authoritative lifecycle>`;
- other rows remain saved/untracked as appropriate;
- no global stale state leaks between rows.

## 9. Ordering

Use a deterministic, truth-preserving ordering.

Recommended precedence:

1. selected/current task
2. live tasks
3. saved/resumable tasks
4. compatibility/untracked tasks

Within the same class, prefer an existing stable Workspace ordering already used by the product. Do not introduce inferred urgency, priority, completion, productivity, or recency unless authoritative metadata already exists and is explicitly justified.

Document the exact chosen ordering and add tests.

## 10. Projection implementation boundary

Prefer a pure Renderer projection under AAOffice, for example:

- `AAActiveTasks/aaActiveTaskProjection.ts`
- `AAActiveTasks/aaActiveTaskProjection.test.ts`
- `AAActiveTasks/AAActiveTasksSection.tsx`
- `AAActiveTasks/AAActiveTaskRow.tsx`

Consume existing hooks/data for:

- projects/workspaces
- persisted V2 pane/task-title state
- AA runtime snapshots
- saved Pi resume candidate state
- Git changed-file count

Do not create a second store of record.

A small memoized derived selector/store is acceptable only as ephemeral Renderer computation. It must not persist runtime/task truth separately.

Do not add polling if existing query/subscription boundaries can update the projection.

## 11. Creation hierarchy cleanup

Phase 3I found three competing creation affordances.

In AA mode only, make the accepted hierarchy clearer:

- project-local `NEW TASK` is primary;
- legacy New Workspace remains accessible but secondary;
- adjacent unlabeled `+` actions must have clear tooltips/labels and should not visually compete with `NEW TASK`.

Do not remove global/general Superset workspace creation for non-AA flows.

Keep changes narrow and reversible.

## 12. Real multi-task acceptance

Use the isolated QA profile and one disposable Briefcase.

Create at least five New Tasks through the production Phase 3H flow:

- at least three unique titles;
- at least one duplicate-title pair;
- at least two tasks with real changed files;
- at least one live Pi task at measurement time;
- at least one settled Pi task before restart.

Verify:

1. Active Tasks projection appears without Task DB/persistence additions.
2. Duplicate rows are safely distinguishable before opening.
3. Selecting each row opens the correct Work Folder/files/runtime.
4. Live lifecycle comes only from authoritative snapshots.
5. Full restart converts all non-live Pi rows to `SAVED / RESUMABLE` when exact candidates exist.
6. No stale activity animation survives without runtime evidence.
7. Exact resume transitions only the matching task row back to LIVE.
8. Other tasks do not inherit the resumed task's state.
9. Changed counts reflect real Git state after restart/resume.
10. 1440×800 and 1920×976 remain usable with at least five task rows.
11. Keyboard navigation and focus work.
12. Existing Work Folder navigation remains available.
13. `NEW TASK` remains the clear primary creation action.
14. Tier 2 compatibility regression remains `UNTRACKED`.
15. Grok remains authentication-gated/no-live-runtime.

## 13. Automated verification

Minimum:

- pure projection classification tests;
- duplicate discriminator tests;
- ordering tests;
- restart reconstruction tests;
- sidebar/Briefcase composition tests;
- existing New Task regressions;
- existing Pi Runtime/Resume regressions;
- relevant TypeScript checks;
- targeted Biome/lint;
- `git diff --check`;
- RED-area modification scan;
- sensitive evidence scan.

Do not alter Host Service, PTY, xterm transport, Git/worktree semantics, DB schema, Runtime Contract, Pi bridge, Grok adapter, or Tier 2 lifecycle code.

## 14. Deliverables

Create:

- `docs/aa/PHASE-3J-ACTIVE-TASKS-PROJECTION-REPORT.md`
- `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-active-tasks/`

Report must include:

1. executive verdict;
2. exact baseline/final commits and environment;
3. projection inputs and authority precedence;
4. classification rules;
5. duplicate-title solution;
6. ordering rules;
7. Briefcase IA before/after;
8. creation hierarchy cleanup;
9. restart/resume behavior;
10. real five-task acceptance results;
11. 1440×800 and 1920×976 density review;
12. automated verification;
13. security/RED-area review;
14. known limitations;
15. recommended next phase.

## Explicit non-goals

Do not implement:

- Task database/entity/schema;
- task completion/DONE inference;
- archive/cleanup workflow;
- due dates, priorities, tags;
- Current Workspace New Task target;
- automatic Pi resume;
- native chat;
- transcript/history store;
- model/reasoning writes;
- workflow engine;
- automatic handoff;
- Grok activation;
- Tier 2 runtime tracking.

After Phase 3J is complete, commit and push to `origin/aa-spike`, then STOP.