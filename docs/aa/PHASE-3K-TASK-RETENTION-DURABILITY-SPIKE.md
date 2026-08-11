# Phase 3K — Task Retention & Evidence Durability Spike

## Purpose

Phase 3J Active Tasks Projection v0.1 is accepted. Before adding task completion, archive, cleanup, or history, investigate how long a projected task remains trustworthy and what explicit user-controlled retention/cleanup model can be built from existing Workspace, Git, pane, runtime, and resume evidence.

This is an observation and architecture/product spike. Do not implement archive, cleanup, completion, history, or new persistence.

## Read first

1. `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md`
2. `docs/aa/PHASE-3J-ACTIVE-TASKS-PROJECTION-REPORT.md`
3. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
4. `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
7. `docs/aa/CODEBASE-MAP.md`

Phase 3F Grok activation remains deferred. Do not authenticate Grok in this phase.

## Main questions

Answer these with repository evidence and real isolated QA where useful:

1. Under exactly what conditions does an existing Work Folder appear as `LIVE`, `SAVED / RESUMABLE`, `UNTRACKED`, or disappear from Active Tasks?
2. What durable evidence survives Renderer reload, full Electron/Host restart, terminal process exit, exact Pi resume, and a later clean app start?
3. When a Pi session is intentionally ended and no exact resume candidate remains, what trustworthy evidence still exists that this Work Folder was created from a New Task?
4. Can a user-controlled `ARCHIVED` presentation be derived without a Task entity, or would archive require one minimal persistent field?
5. What is the smallest persistence unit, if any, required to remember only explicit user intent such as `archived`, without storing runtime truth, transcript, prompts, or completion claims?
6. Can cleanup safely reuse existing Workspace/worktree removal APIs and Git truth?
7. What cleanup preconditions are required for dirty files, unpushed commits, branches, active terminals, live Pi runtime, saved Pi resume candidates, PR state, and compatibility terminals?
8. Which cleanup operations are reversible, partially reversible, or destructive?
9. What should `Remove from Active Tasks`, `Archive`, `Close Session`, and `Delete Work Folder` mean as separate product actions, if they are needed at all?
10. How should AA avoid implying `DONE` when the user merely archives or removes a task from the visible working set?
11. How expensive is the current per-Work-Folder evidence projection at larger Briefcase sizes, and when would batching/query aggregation become justified?
12. Does the Active Tasks hierarchy remain usable with 10–20 Work Folders after multiple restart/resume cycles?

## Real larger-Briefcase dogfood

Use the guarded isolated AA QA profile and disposable Git project.

Create enough real New Tasks to exercise at least 10 Work Folders in one Briefcase. Keep tasks harmless and small. It is acceptable for only a subset to produce changed files.

Exercise at minimum:

- at least 10 New Task creations through production UI;
- duplicate titles;
- at least 2 live Pi sessions at different lifecycle states if safely possible;
- at least 3 exact saved/resumable Pi candidates after a full restart;
- at least 1 intentionally ended/non-resumable Pi task;
- at least 1 Tier 2 compatibility task;
- at least 2 tasks with real Git changes;
- repeated switching between projected rows;
- Renderer reload;
- two full isolated Electron/Host restart cycles;
- exact resume of at least two saved Pi sessions across the run;
- 1440×800 and 1920×976;
- keyboard navigation.

Do not change product code to make the dogfood pass easier.

Record projection-query timings/counts using safe local instrumentation or existing dev tooling if practical, but do not add production telemetry or polling.

## Evidence durability matrix

Build a matrix whose rows include at least:

- explicit Task Folder title;
- Workspace identity/project ownership;
- pane layout/title metadata;
- terminal launch identity;
- live Runtime snapshot;
- saved Pi resume candidate;
- changed-file count;
- Git branch/worktree existence;
- PR/delivery state if applicable;
- compatibility employee identity.

Columns must include:

- live app;
- Renderer reload;
- full app restart;
- Pi process exit;
- exact Pi resume;
- Pi intentionally ended/no resume candidate;
- Workspace removal;
- worktree removal.

For every cell classify evidence as:

- authoritative and durable;
- authoritative but live-only;
- persisted presentation only;
- unavailable;
- unsafe to infer.

## Archive / retention product model

Investigate and recommend one of these exact outcomes:

- `NO ARCHIVE MODEL YET`
- `PROCEED WITH PRESENTATION-ONLY ARCHIVE`
- `PROCEED WITH ONE MINIMAL PERSISTED ARCHIVE FIELD`
- `TASK ENTITY IS NOW JUSTIFIED`

Do not choose the last option unless existing evidence demonstrably cannot support explicit user retention intent without a real entity.

Any recommended archive model must keep runtime truth separate from user organization state.

For example, a row may be:

```text
ARCHIVED
Pi session unavailable
3 changed
```

if those are independently true. Archive must never become a synonym for completed.

## Cleanup boundary

Create a proposed safety matrix for possible future cleanup actions. At minimum evaluate:

- Hide/Archive from active projection only
- Close live Pi session
- Remove saved resume binding if such an existing safe operation exists
- Close terminal panes
- Remove Workspace record
- Delete Git worktree
- Delete generated branch

For each action state:

- existing API/path;
- reversibility;
- dirty-file behavior;
- unpushed/unmerged commit behavior;
- live agent behavior;
- saved resume behavior;
- confirmation requirement;
- whether the operation belongs in AA or should remain advanced Superset infrastructure.

Do not implement any cleanup action during this phase.

## Projection scale review

Measure or estimate, from current implementation and safe QA observations:

- number of Host/runtime/resume/Git queries per projected Work Folder;
- event invalidation behavior;
- approximate render/query behavior at 5, 10, and 20 Work Folders;
- whether current event-driven per-workspace queries remain acceptable;
- exact threshold/evidence that would justify a batched Host endpoint later.

Do not add a batched endpoint in this phase.

## Deliverables

Create:

- `docs/aa/PHASE-3K-TASK-RETENTION-DURABILITY-REPORT.md`
- `docs/aa/TASK-RETENTION-CLEANUP-V0.1-PROPOSAL.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-retention-spike/`

The report must include:

1. executive verdict;
2. 10+ task dogfood result;
3. Active Tasks usability at both viewports;
4. evidence durability matrix;
5. non-resumable/end-of-session findings;
6. archive recommendation using one exact outcome from above;
7. cleanup safety matrix;
8. projection scale/query-cost findings;
9. duplicate-title and restart observations;
10. Pi exact-resume regression;
11. Tier 2/Grok regression boundaries;
12. persistence-gap analysis;
13. architecture/RED-area review;
14. recommended next implementation phase.

`TASK-RETENTION-CLEANUP-V0.1-PROPOSAL.md` must translate the findings into a concise product model with proposed user-facing actions, state language, safety rules, and explicit non-goals. It remains a proposal only.

## Constraints

Do not implement:

- task completion state;
- archive state;
- cleanup/delete actions;
- task database/entity;
- history timeline;
- runtime transcript storage;
- native chat;
- orchestration;
- Grok activation;
- Runtime Contract changes;
- Host/PTTY/xterm/Git semantic changes;
- production telemetry or polling.

Safe observation-only instrumentation must be removed before commit.

## Verification and stop

Run relevant existing AA/Runtime regression suites, TypeScript checks where touched, targeted lint/Biome, `git diff --check`, RED-area scan, and sensitive-evidence scan.

Commit and push only reports, proposal, and safe evidence. Product code must remain unchanged.

Then STOP. Do not begin an implementation phase.