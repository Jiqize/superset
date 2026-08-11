# AA New Task Flow v0.1 — Feasibility Spike Brief

## Mission

Investigate whether the product rules in `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md` can be implemented by composing existing Superset + AA infrastructure, with no Task database and no new runtime primitive.

This is an investigation/design phase. Do not implement the New Task UI or production provisioning flow.

## Baseline

Start from the latest `origin/aa-spike` after the New Task Flow spec commit.

Read first:

1. `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md`
2. `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
3. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
4. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
6. `docs/aa/CODEBASE-MAP.md`
7. `docs/aa/PHASE-3G-PI-FIRST-DAILY-WORKFLOW-REPORT.md`

Phase 3F Grok activation remains deferred. Do not execute it.

## Scope

Trace and, where safe, probe the existing paths for:

- Project/Briefcase selection;
- Workspace creation;
- worktree creation and naming;
- base branch selection;
- V2 workspace navigation;
- terminal/pane creation;
- Pi launch;
- authoritative Pi runtime confirmation;
- Task Folder explicit title persistence;
- failure/rollback/cleanup;
- existing Workspace as an advanced work-location option;
- deriving an Active Task projection across a Briefcase.

Do not modify production runtime, database schema, PTY, xterm, Git/worktree semantics, or Tier 2 lifecycle behavior.

## Required questions

Answer every question from the `Next step: implementation feasibility spike` section of `NEW-TASK-FLOW-V0.1-SPEC.md` with exact repository paths and evidence.

In addition, determine:

### Composition boundary

- Is there already a single Host/API operation that creates a Workspace and launches an initial terminal/agent?
- If multiple existing operations are required, which layer should orchestrate them without duplicating business logic?
- Would Renderer composition be safe across failure/retry, or is a narrow Host transaction/coordinator justified?
- If a coordinator is justified, specify the smallest possible interface and why existing operations are insufficient. Do not implement it during the spike.

### Naming

Determine how existing code chooses:

- workspace name;
- worktree directory;
- branch name;
- terminal/pane title.

Propose a deterministic safe mapping from a user Task title to existing naming inputs, including collision handling and Unicode/long-title behavior. Prefer existing naming helpers.

Do not make Task title itself a Git branch name unless existing code already safely normalizes it.

### Truthful progress

Define the exact observable milestones for a future New Task flow:

- validating;
- provisioning Work Folder;
- opening workspace;
- starting Pi;
- runtime connected;
- workstation ready.

For each milestone identify its authoritative source and what failure looks like.

### Rollback matrix

Build a table for failures after each stage:

- before Workspace exists;
- Workspace record exists but worktree creation fails;
- worktree exists but navigation/pane creation fails;
- terminal exists but Pi launch fails;
- Pi process exists but Runtime Contract identity is not confirmed;
- runtime confirmed but UI transition/title/focus fails.

For each stage state:

- resources that exist;
- safe automatic rollback, if any;
- user-visible recovery action;
- idempotency/retry concerns;
- whether cleanup could destroy user changes.

Default toward preserving recoverable resources over aggressive cleanup.

### Task projection

Investigate whether a Briefcase-level task index can be derived from current state.

Candidate inputs may include only existing authoritative/persisted data such as:

- Workspace records;
- pane presentation/task title metadata;
- terminal-agent binding;
- saved Pi resume candidate/native session binding;
- current Host runtime snapshot when live;
- Git changed-file count.

Do not use terminal history, prompt parsing, process-title heuristics, or guessed recency.

Classify each candidate task row as one of:

- LIVE
- SAVED / RESUMABLE
- UNTRACKED / COMPATIBILITY
- INSUFFICIENT EVIDENCE

Determine whether this projection survives a full app restart using current persistence.

If it does not, identify the exact missing field(s) and persistence lifetime. Do not propose a Task table unless the evidence demonstrates it is necessary.

## Safe probing

Use disposable projects/workspaces in the isolated AA QA profile when real behavior needs verification.

You MAY perform harmless existing operations to observe IDs, ordering, failure behavior, navigation, and persistence.

Do not intentionally corrupt Git repositories or kill unrelated processes. Do not enter Grok credentials.

Any temporary resources must be cleaned safely after evidence is captured.

## Deliverables

Create:

- `docs/aa/NEW-TASK-FLOW-V0.1-SPIKE-REPORT.md`
- `docs/aa/NEW-TASK-FLOW-V0.1-IMPLEMENTATION-PLAN.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-spike/`

The spike report must include:

1. executive recommendation choosing exactly one:
   - `PROCEED`
   - `PROCEED WITH MINIMAL PERSISTENCE`
   - `DO NOT PROCEED`
2. current seven-group entry-flow trace;
3. exact existing Project → Workspace/worktree path;
4. exact existing Workspace → terminal → Pi path;
5. Runtime Contract confirmation point;
6. Task Folder title persistence path;
7. proposed future orchestration boundary;
8. safe naming/collision strategy;
9. truthful progress-state map;
10. rollback matrix;
11. Current Workspace advanced-option analysis;
12. Briefcase-level Active Task projection analysis;
13. persistence-gap analysis;
14. expected interaction reduction;
15. accessibility/focus requirements;
16. security/RED-area review;
17. real probe results;
18. recommendation for the implementation phase.

The implementation plan must be task-oriented and ordered, with:

- files/areas likely to change;
- files/areas explicitly frozen;
- tests required before implementation;
- implementation sequence;
- migration/fallback behavior;
- STOP conditions.

Do not implement the production New Task flow during this spike.

## Verification

Run focused tests/typechecks only where needed to validate probes or documentation claims. Run `git diff --check`, RED-area scan, and evidence sensitive-information scan before commit.

Commit and push only the spike report, implementation plan, and safe evidence. Then STOP. Do not begin the New Task implementation phase.