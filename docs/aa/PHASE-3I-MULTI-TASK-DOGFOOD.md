# Phase 3I — Multi-Task Dogfood and Briefcase Review

## Purpose

Validate the Phase 3H New Task Flow under repeated real use before changing the Briefcase information architecture.

This is an acceptance and product-observation phase. Do not implement Active Tasks, task persistence, archive/completion, Current Workspace targeting, or another major UI flow during this pass.

The accepted Phase 3H product path is:

```text
Briefcase
→ NEW TASK
→ type title + Enter
→ isolated Work Folder
→ one new Pi session
→ authoritative runtime confirmation
→ focused Pi TUI
```

The question for Phase 3I is whether this remains understandable when one Briefcase contains several real tasks at the same time and after a full restart.

## Read first

1. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
2. `docs/aa/PHASE-3H-NEW-TASK-FLOW-V0.1-REPORT.md`
3. `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md`
4. `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
7. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
8. `docs/aa/CODEBASE-MAP.md`

Phase 3F Grok activation remains deferred. Do not authenticate Grok and do not execute Phase 3F.

## Primary questions

Answer these through real product use:

1. After creating 3–5 Tasks in one Briefcase, does the current Workspace-first sidebar remain understandable?
2. Can a user tell which visible Work Folder corresponds to which Task Folder without opening every workspace?
3. Can a user distinguish live Pi tasks, idle tasks, and saved/resumable tasks after restart?
4. Does `NEW TASK` remain visually and cognitively primary once many Work Folders exist?
5. Does the old New Workspace affordance become confusing beside the New Task entry?
6. Does the same Task title remain easy to recognize through sidebar, tab, Task Folder, Employee Profile, and resume surfaces?
7. Are project/workspace names now redundant or competing with task names?
8. Is the next product move clearly a Briefcase-level Active Tasks projection, or can the current hierarchy remain acceptable?
9. If Active Tasks is needed, can it still be derived from existing authoritative/persisted state without a Task database?
10. What minimum information should a Briefcase-level task row show without fabricating task status?

## Test setup

Use the isolated AA QA profile and one disposable local Git project.

Create one real Briefcase and then create at least four Tasks through the production `NEW TASK` UI. Use short, visibly different titles, for example:

- `Add greeting helper`
- `Add number formatter`
- `Add date label`
- `Add summary command`

Each Task should ask Pi to make a harmless, small, distinct code or text change so Files/Changes truth differs between Work Folders.

At least one task should remain with real uncommitted output. At least one should reach settled IDLE with output. At least one should be left resumable across a full restart. A fourth may be used for same-title or Unicode observation if useful.

Do not manually create worktrees or Pi sessions outside the New Task flow except for fixture/project setup and cleanup.

## Acceptance journey

### 1. Repeated New Task creation

Create Tasks one by one through the real Briefcase `NEW TASK` action.

For each Task record:

- task title;
- visible Briefcase/sidebar label;
- Work Folder/workspace label;
- Pi Worker state;
- changed-file count;
- whether the Task is immediately identifiable when returning to the Briefcase;
- number of user interaction groups from Briefcase to ready Pi TUI;
- any focus or navigation surprise.

Verify every submission creates an isolated real worktree and distinct new Pi conversation.

Capture screenshots after Task 1, Task 3, and final Task creation.

### 2. Switch among several active tasks

Move repeatedly among the four Work Folders using only normal AA/Superset UI.

For each switch verify:

- Task Folder title matches the intended task;
- Worker identity/state belongs to the active pane;
- Files/Changes belong to the correct worktree;
- terminal session/context does not bleed across tasks;
- returning to the Briefcase makes it reasonably clear which work item to choose next.

Measure whether task switching requires remembering implementation details such as generated branch/worktree names.

### 3. Same-title and naming-pressure check

Create a second task with the same visible human title as an existing Task, or use an equivalent duplicate-title test if already covered by the disposable fixture.

Verify:

- isolated branch/worktree identities remain distinct;
- visible human titles may be identical without corrupting runtime/workspace identity;
- current UI provides enough context to distinguish them, or record this as a finding;
- do not alter title rules during this phase.

### 4. Full restart and return-to-work test

With multiple tasks present, fully restart the isolated Electron/Host stack.

After restart, inspect the Briefcase before resuming anything.

Record exactly what the user can and cannot infer from current UI:

- which tasks existed;
- which Work Folder maps to which Task title;
- which Pi conversations are saved/resumable;
- which tasks have changed files;
- which items are live versus only persisted presentation;
- whether task identity survives strongly enough to resume without trial-and-error.

Resume one saved Pi task through the accepted exact-resume path. Confirm same native identity, new epoch, preserved Task Folder title and context continuity.

Capture pre-resume and post-resume screenshots.

### 5. Briefcase information-architecture review

At 1440×800 and 1920×976, review the left-side project/workspace hierarchy with several Tasks present.

Evaluate:

- visual scan speed;
- hierarchy clarity;
- whether Workspace names or Task titles dominate;
- whether generated technical labels leak into the primary user model;
- whether `NEW TASK` remains obvious;
- whether `New Workspace` should remain visible as a secondary/advanced action;
- whether completed/idle/resumable concepts can be represented truthfully from existing evidence;
- whether an Active Tasks layer would reduce confusion or merely duplicate Workspace rows.

Do not redesign the sidebar during this pass.

## Derived Active Tasks feasibility check

Without changing production code, inspect current persisted/authoritative inputs and create a sanitized prototype projection in the report/evidence only.

Allowed evidence inputs:

- Project/Workspace ownership;
- persisted pane/tab Task Folder title and `taskTitleEdited` evidence;
- terminal launch identity;
- current Runtime Contract snapshot when live;
- saved Pi resume candidate when authoritative;
- real Git changed-file count;
- current workspace/main-worktree identity.

Forbidden inputs:

- terminal/xterm text;
- prompt/transcript parsing;
- elapsed-time guesses;
- process titles as task semantics;
- fake completion state;
- heuristic recent-session matching.

For each candidate row classify evidence as:

- `LIVE`
- `SAVED / RESUMABLE`
- `UNTRACKED`
- `INSUFFICIENT EVIDENCE`

Prototype the smallest possible row, for example:

```text
Add greeting helper
PI · WORKING
2 changed
```

or

```text
Add number formatter
PI · RESUMABLE
1 changed
```

Only include fields that current evidence can support.

Determine whether this projection can be reconstructed after a full app restart with the current persistence model.

## Findings and severity

Classify each finding:

- `BLOCKER`: repeated task use becomes unsafe or task identity can be confused enough to edit the wrong workspace;
- `HIGH`: major daily-use ambiguity or repeated navigation burden;
- `MEDIUM`: meaningful friction with an obvious workaround;
- `LOW`: copy, density, hierarchy, or polish issue.

For every finding include:

- exact step;
- expected behavior;
- actual behavior;
- workaround;
- whether it is Renderer-only, persistence-related, runtime-related, or existing Superset behavior;
- whether an Active Tasks projection would solve it.

Do not fix findings during this phase unless a BLOCKER prevents completion of the acceptance journey. If a minimal blocker fix is required, isolate and document it explicitly.

## Decision gate

The report must choose exactly one next-step recommendation:

- `KEEP WORKSPACE-FIRST NAVIGATION`
- `PROCEED TO ACTIVE TASKS PROJECTION`
- `PROCEED TO ACTIVE TASKS WITH MINIMAL PERSISTENCE SPIKE`
- `STOP AND REVISIT TASK MODEL`

Do not choose based on aesthetics alone. Base it on repeated use, restart behavior, identity truth, and navigation burden.

## Evidence

Store safe evidence under:

`docs/aa/new-task-flow/v0.1-multitask-dogfood/`

Suggested files:

- `01-one-task.png`
- `02-three-tasks.png`
- `03-four-tasks-1440.png`
- `04-pre-restart.png`
- `05-post-restart-saved.png`
- `06-resumed-task.png`
- `07-large-viewport.png`
- `active-task-projection.json`

Do not commit raw native IDs, local worktree paths, transcripts, credentials, or user repository content. Use disposable project data and hashed runtime fingerprints where identity comparison is needed.

## Deliverable

Create:

- `docs/aa/PHASE-3I-MULTI-TASK-DOGFOOD-REPORT.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-multitask-dogfood/`

The report must include:

1. executive verdict;
2. exact baseline/commit/environment;
3. test project and four-task setup;
4. repeated New Task creation results;
5. task-switching results;
6. duplicate-title observation;
7. full restart and resume results;
8. 1440×800 and 1920×976 information-architecture review;
9. current Briefcase/workspace hierarchy strengths and failures;
10. derived Active Tasks feasibility analysis;
11. sanitized prototype task rows;
12. findings ordered by severity;
13. user interaction/friction observations;
14. recommendation choosing exactly one decision-gate outcome;
15. implementation implications for the recommended next step;
16. cleanup and security review.

## Verification and cleanup

At minimum run:

- existing New Task / AA targeted regression tests;
- relevant Runtime Contract/Pi resume tests;
- `git diff --check` for documentation/evidence;
- RED-area scan;
- evidence sensitive-information scan.

After evidence is captured:

- clean disposable QA processes;
- remove disposable Project/Workspace records through supported APIs;
- move fixture/worktree remnants to recoverable Trash when appropriate;
- leave the Superset worktree clean except intended dogfood report/evidence.

Commit and push only the report/evidence and any explicitly documented minimal BLOCKER fix. Then STOP.

Do not implement Active Tasks, task persistence, archive/completion, Current Workspace targeting, Phase 3F Grok activation, or another product phase.