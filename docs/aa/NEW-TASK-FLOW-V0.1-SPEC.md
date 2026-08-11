# AA New Task Flow v0.1 — Product Spec

## Status

Product specification for the next AA entry-flow spike. This document defines user intent and product rules only. It does not authorize implementation by itself.

Current accepted foundation:

- `AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
- `AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
- `AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
- `AA-RUNTIME-CONTRACT-V0.1.md`

Phase 3F Grok activation remains deferred until the user can authenticate the machine.

## Product problem

The accepted Pi-first daily workflow is reliable after a workspace exists, but opening a project and reaching a usable Pi workstation still requires roughly seven interaction groups.

The current product sequence exposes infrastructure decisions too early:

```text
Project
→ Workspace
→ worktree / checkout choice
→ terminal
→ employee preset
→ Pi launch
→ task naming
→ work
```

AA should optimize for the user's actual intent:

```text
What do I want to do?
→ Who should do it?
→ AA prepares a safe work location
→ Work begins
```

The first implementation target is a task-oriented entry flow without introducing a task database.

## Core mental model

The accepted storage/runtime model remains:

```text
Project / Briefcase
  → Workspace / Work Folder
    → Task Folder presentation
      → Employee
        → Runtime session
          → Output
```

The user-facing entry order becomes:

```text
Briefcase
  → Task intent
    → Employee
      → Work-location provisioning
        → Workstation
```

Workspace remains a real and important infrastructure boundary. It becomes a secondary decision in the common entry path rather than the first thing the user must reason about.

## v0.1 default flow

Inside a selected Briefcase, expose one primary action:

`NEW TASK`

Opening it presents a compact dialog/sheet:

```text
NEW TASK

What are we working on?
[ Fix restart status                    ]

EMPLOYEE
[ PI ✓ ]

WORK LOCATION
[ NEW WORK FOLDER ✓ ]

[ WORK OPTIONS ]

                         [ START WORK ]
```

Default values:

- Employee: Pi
- Work location: New Work Folder
- Base branch: existing safe project default/current base resolved by existing Superset semantics
- Reasoning: runtime/default; no write control in v0.1
- Model: runtime/default; no write control in v0.1

For the normal Pi-first path, the user should usually type a task title and press Enter.

## Product rules

### 1. New Task defaults to a new Work Folder

A new Task should default to an isolated Workspace/worktree using existing Superset project/worktree semantics.

Rationale:

- concurrent tasks do not mix code changes;
- terminals and runtime sessions remain naturally isolated;
- cleanup and review boundaries remain understandable;
- the existing AA Workspace and Pi Runtime contracts continue to work.

`Current Workspace` may exist as an advanced option when the existing project state safely supports it, but it is not the default.

Do not invent new Git/worktree semantics.

### 2. New Task means new Pi conversation

Starting a new Task must create a new Pi runtime session.

AA must not:

- reuse the most recent Pi session;
- choose a native session heuristically;
- silently attach a new task to an existing conversation;
- treat a currently idle Pi conversation as available for arbitrary new work.

Existing Pi conversations are resumed only from an existing Task/Work Folder through the accepted exact-resume path.

### 3. Task Folder is the user's primary work label

The task title entered in New Task becomes the explicit Task Folder title using the accepted presentation semantics.

v0.1 does not create a persistent Task database entity.

The title must continue to survive:

- pane switching;
- Files/Changes/Diff/Review activity;
- manual compatibility-employee handoff;
- Renderer reload;
- full app restart where current presentation persistence supports it;
- exact Pi resume.

The title is a user-visible work label, not employee identity, branch identity, or runtime identity.

### 4. One Task defaults to one primary Work Folder

In v0.1, a Task has one primary Work Folder/workspace.

Manual handoff to another Employee continues to share that Work Folder and real files using existing Superset behavior.

Do not create one worktree per employee. Do not copy files for handoff. Do not introduce cross-workspace orchestration.

### 5. Start Work is a truthful provisioning sequence

The UI must not claim the employee is working before the underlying steps succeed.

Conceptual sequence:

```text
validate task input
→ provision Workspace/Work Folder
→ create/open terminal pane
→ launch Pi through existing path
→ wait for authoritative Pi runtime identity/session evidence
→ bind/preserve explicit Task Folder title
→ focus real Pi TUI
```

The implementation spike must determine the exact existing APIs/order and rollback semantics.

The UI may show neutral provisioning states such as:

- PREPARING WORK FOLDER
- STARTING PI
- CONNECTING WORKSTATION

`WORKING` remains runtime-authoritative and must not be shown until the Pi Runtime Contract reports it.

### 6. Failure must stop at the real boundary

If provisioning fails, show the actual stage and preserve recoverable resources.

Examples:

- Work Folder creation failed
- terminal launch failed
- Pi process started but runtime identity not confirmed

Do not silently retry by creating a different workspace/session unless the existing Superset API already defines a safe idempotent retry.

Do not silently fall back from New Work Folder to Current Workspace.

The spike must document which partial resources can be safely cleaned automatically and which require user-visible recovery.

### 7. Resume is explicit and separate from New Task

New Task always means a new work context and new Pi conversation.

Resume belongs to existing Task/Work Folder presentation:

```text
ACTIVE / SAVED TASK
Fix restart status
PI · RESUMABLE
[ RESUME ]
```

Resume must continue to use exact native Pi session identity and the existing Runtime Contract.

No recent-session picker or heuristic resume is introduced.

### 8. Completion is user-managed work organization

Pi `turn.settled` means the current runtime turn settled. It does not mean the Task is complete.

A future implementation may expose a manual `MARK DONE` / `COMPLETE TASK` presentation state if it can be represented safely without inventing runtime truth.

For v0.1 entry-flow implementation, completion/archival is not required unless the spike finds an existing presentation-only mechanism that is trivial and clearly separated from runtime status.

Do not infer Task completion from:

- Pi idle;
- no changed files;
- tests passing;
- a PR existing;
- terminal text;
- elapsed time.

### 9. No automatic destructive cleanup

Completing or leaving a Task must not automatically:

- delete a worktree;
- delete a branch;
- close a resumable Pi conversation;
- discard changed files;
- remove a Workspace.

Future Archive/Cleanup actions must be separately designed with explicit confirmation and real Git/worktree state.

### 10. Active Tasks may become the primary Briefcase index later

The long-term desired Briefcase presentation is task-oriented:

```text
BRIEFCASE
AA Office

ACTIVE TASKS

Fix restart status
PI · WORKING
3 changed

Improve sidebar
PI · IDLE
1 changed

SAVED / RESUMABLE

Build CLI fixture
PI · RESUMABLE
```

However, v0.1 must not invent a task list from unreliable heuristics.

The next spike must determine whether existing Workspace + pane presentation + runtime binding + Git state can derive a trustworthy task-oriented projection across a Briefcase.

If a trustworthy projection cannot be derived, document the minimum persistence gap before proposing a Task entity/schema.

## Work Options

The default dialog remains short. Secondary infrastructure choices belong behind `WORK OPTIONS`.

Candidate v0.1 options, only if already supported safely:

- Base branch
- New Work Folder vs Current Workspace
- Employee, default Pi

Do not add in this version:

- reasoning write control;
- model write control;
- permission policy;
- automatic reviewer;
- workflow templates;
- multiple employees;
- task priority/due date/tags;
- branch naming complexity beyond existing safe defaults.

## Interaction target

The desired common path is conceptually:

```text
Open Briefcase
→ NEW TASK
→ type title
→ Enter
→ Pi TUI focused and ready
```

This is a product target, not permission to hide unsafe operations. If existing APIs require an explicit decision for correctness, retain it and document why.

Do not optimize for click count at the expense of Git/worktree safety or runtime identity truth.

## Architecture constraints

Prefer composition over new infrastructure.

Reuse:

- existing Project/Briefcase data;
- existing Workspace/worktree creation APIs;
- existing V2 pane/terminal composition;
- existing Pi launch path;
- existing AA Runtime Contract and exact resume;
- existing pane presentation state for Task Folder title;
- existing Git/Files/Changes/Diff/Review surfaces.

Do not introduce during the spike:

- task database/schema;
- new runtime adapter;
- PTY/xterm changes;
- Git/worktree semantic changes;
- transcript storage;
- native chat;
- orchestration engine;
- automatic agent handoff.

## Next step: implementation feasibility spike

Before implementing New Task Flow, run a bounded repository/product spike answering these questions:

1. Which existing API creates a Workspace/worktree for a selected Project?
2. Can that API safely accept or derive the correct base branch and branch/worktree name?
3. Which existing path creates the terminal and launches Pi for that Workspace?
4. Can Workspace creation and Pi launch be composed from Renderer without duplicating Host logic?
5. At what exact point is the Workspace ID available for navigation and Task Folder presentation?
6. At what exact point can AA truthfully say Pi is connected, based on Runtime Contract evidence?
7. How should the explicit Task Folder title be attached early enough to survive the first render/reload/resume?
8. What partial resources exist after failure at each provisioning stage?
9. Which partial resources can be rolled back safely and idempotently?
10. Can an existing Workspace be used as an explicit advanced option without weakening isolation?
11. Can a trustworthy Active Task projection be derived across all Workspaces in a Briefcase using existing state?
12. If not, what is the smallest persistence gap? Do not propose a schema until this gap is demonstrated.
13. Can the common path reach focused Pi TUI without new Host/runtime primitives?
14. Which current 7 interaction groups disappear, and which remain structurally necessary?
15. What accessibility/keyboard/focus behavior is required for the dialog and successful transition?

The spike should produce an implementation plan, risk map, rollback matrix, and explicit `PROCEED / PROCEED WITH MINIMAL PERSISTENCE / DO NOT PROCEED` recommendation.

## Acceptance principle

The New Task Flow succeeds when AA lets the user express work intent first while preserving all underlying truth:

- real Project;
- real Workspace/worktree;
- real terminal;
- real Pi runtime session;
- real runtime state;
- real files/output;
- exact resume identity.

AA may hide infrastructure complexity from the common path. It must never fabricate or weaken the infrastructure guarantees.