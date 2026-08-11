# Phase 3H — New Task Flow v0.1 Implementation

## Status

The New Task Flow feasibility spike concluded `PROCEED` at commit `aa8460973609151649ee3e5a2790d747bc4ad176`.

This phase implements the accepted product contract:

- `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md`
- `docs/aa/NEW-TASK-FLOW-V0.1-SPIKE-REPORT.md`
- `docs/aa/NEW-TASK-FLOW-V0.1-IMPLEMENTATION-PLAN.md`

Phase 3F Grok activation remains deferred. Do not execute it.

## Product target

The normal Pi-first path should become:

```text
Open Briefcase
→ NEW TASK
→ type task title
→ Enter
→ real Pi TUI focused and ready
```

The system must preserve every accepted truth boundary:

- real Project/Briefcase;
- real Workspace/worktree;
- real terminal;
- real new Pi conversation;
- authoritative Pi Runtime Contract state;
- real Task Folder title persistence;
- real Files/Changes/Diff/Review output;
- exact Pi resume identity.

Do not optimize interaction count by weakening Git/worktree safety, runtime identity, or failure visibility.

## Read first

1. `docs/aa/NEW-TASK-FLOW-V0.1-SPEC.md`
2. `docs/aa/NEW-TASK-FLOW-V0.1-SPIKE-REPORT.md`
3. `docs/aa/NEW-TASK-FLOW-V0.1-IMPLEMENTATION-PLAN.md`
4. `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
7. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
8. `docs/aa/CODEBASE-MAP.md`

Treat the product spec as the UX contract and the implementation plan as the technical execution plan.

## Fixed architecture decision

Use the existing bundled Host operation:

```text
workspaces.create
```

for the default New Work Folder path.

The Renderer owns only New Task coordination:

```text
validate input
→ resolve real Pi config
→ generate optimistic Workspace ID + deterministic branch input
→ submit one workspaces.create call with one Pi agent
→ seed explicit Task Folder presentation into returned Pi pane
→ reconcile canonical Workspace ID
→ wait for matching authoritative Pi Runtime snapshot
→ focus real xterm
```

Do not add a Host New Task coordinator or transaction. Do not split worktree creation and Pi launch into duplicated Renderer operations.

## 1. Implement pure New Task contracts first

Follow Sprint 1 of the implementation plan before production UI wiring.

Required pure behavior:

- normalize title with the existing Task Folder title contract;
- reject empty/whitespace task intent;
- use the normalized title as the initial Pi prompt;
- generate Workspace UUID before request composition;
- generate deterministic safe branch input using existing `sanitizeSegment` plus compact Workspace UUID as specified by the spike;
- define ephemeral flow states only:
  - `editing`
  - `validating`
  - `provisioning-work-folder`
  - `opening-workspace`
  - `starting-pi`
  - `connecting-runtime`
  - `ready`
  - `failed`
- never use `working` as a provisioning state;
- ignore stale flow/runtime events that do not match the active Workspace/terminal;
- do not persist flow state or errors.

Add focused tests before continuing.

## 2. Add Briefcase-local NEW TASK entry

Add a clear `NEW TASK` action to the AA Briefcase/Project row while retaining the existing New Workspace affordance as an advanced/fallback path.

Requirements:

- action is explicitly scoped to the selected Project;
- reuse existing serving-Host/local-first resolution;
- keyboard and pointer accessible;
- does not toggle/collapse the Briefcase accidentally;
- unavailable Host/Pi prerequisites produce a real focused error/disabled state;
- no hidden use of the last selected compatibility employee.

Default employee must resolve to the first ordered real Host config whose `presetId === "pi"`.

## 3. Build the compact New Task dialog

Required visible UI:

```text
NEW TASK

What are we working on?
[ task title ]

EMPLOYEE
[ PI ]

WORK LOCATION
[ NEW WORK FOLDER ]

[ WORK OPTIONS ]

[ START WORK ]
```

Requirements:

- initial focus goes to title field;
- Enter submits when valid and not inside IME composition;
- Escape closes and restores sensible focus;
- Pi is the fixed default in v0.1;
- New Work Folder is the fixed default in v0.1;
- no model write, reasoning write, permission, reviewer, workflow, priority, due date, tag, or attachment controls;
- 1440×800 must remain compact;
- preserve reduced motion;
- never log/store title as transcript metadata outside accepted pane presentation.

### Work Options

Only expose already-safe existing options:

- Base branch using existing per-project defaults and branch context;
- Current Workspace only if the implementation plan's advanced-option safety criteria are met.

Do not add branch-name editing. Do not expose generated branch IDs as primary UI.

## 4. Expose existing workspace-create success data

Make the smallest YELLOW integration change described by the plan.

`useWorkspaceCreates` should preserve compatibility for existing callers while allowing New Task to receive the already-returned Host result including:

- canonical Workspace;
- terminals;
- agents;
- `alreadyExists`;
- `txid`.

Do not change the Host API.

New Task must inspect the returned Pi agent launch entry independently from overall Workspace success.

A successful Workspace creation with `{ ok:false }` Pi launch is a recoverable partial failure, not a successful ready Task.

## 5. Seed Task Folder presentation with initial pane layout

Extend the existing Renderer pane-layout write path with optional presentation-only New Task metadata.

For the intended successful Pi terminal only, seed:

- `titleOverride = normalized task title`;
- `taskTitleEdited = true`;
- existing real terminal ID;
- real Pi `launchIdentity`.

Do this in the same collection/layout write that creates the Pi pane, before the pending create transaction clears.

Do not title setup/command panes as the Task. Do not create a fake Pi pane when Pi launch failed.

Preserve existing layout dedupe/split/hydration behavior and exact-resume title carry-forward.

## 6. Submit exactly one bundled New Task creation request

For default New Work Folder path, compose exactly one request using the existing public Host operation:

```ts
{
  id: workspaceId,
  projectId,
  name: normalizedTitle,
  branch: deterministicBranch,
  baseBranch: selectedBaseOrUndefined,
  agents: [{ agent: piConfig.id, prompt: normalizedTitle }]
}
```

Rules:

- generate Workspace ID and branch once per user submission;
- no resume/native session ID;
- no model or effort override;
- no automatic second Pi launch;
- no automatic retry of the whole request after ambiguous failure;
- never silently fall back to Current Workspace;
- reconcile canonical Workspace ID using the existing route/cache behavior;
- preserve recoverable Workspace when Pi launch fails.

## 7. Truthful provisioning and Runtime gate

Use product language such as:

- `PREPARING WORK FOLDER`
- `OPENING WORKSPACE`
- `STARTING PI`
- `CONNECTING WORKSTATION`

These are orchestration states, not runtime states.

AA may say Pi is connected only after a matching authoritative Runtime Contract sequence-1 snapshot is accepted for:

- runtime `pi`;
- matching Workspace;
- matching returned terminal ID;
- non-null runtime-reported native session identity;
- available session identity capability.

Do not use terminal creation, command queue success, process existence, elapsed time, tool completion, xterm text, or legacy lifecycle alone as connection proof.

`WORKING` remains owned by the later authoritative `turn.started` state.

After the matching runtime snapshot and xterm mount are ready, close the provisioning surface and focus the real Pi xterm.

Add a bounded timeout only for user-facing recovery if the implementation plan specifies one. Timeout must produce `runtime identity not confirmed`, never pretend Pi failed definitively if evidence is ambiguous.

## 8. Failure and recovery UX

Implement the spike rollback matrix conservatively.

Principles:

- preserve recoverable Workspaces/worktrees instead of aggressive cleanup;
- do not delete any resource that may contain user changes;
- do not auto-replay the full bundled request;
- expose exact failure stage;
- distinguish Workspace success from Pi launch/runtime-confirmation failure.

Required recovery examples:

- validation failure: stay in dialog;
- Workspace create failure before real resource: return to editable flow;
- real Workspace exists but Pi launch failed: offer `OPEN WORK FOLDER` and an explicit retry/launch action only if it can reuse existing safe launch semantics without creating duplicate hidden state;
- Pi terminal exists but runtime identity not confirmed: preserve terminal/workspace and show truthful recovery, do not create another Pi automatically;
- UI/focus failure after runtime confirmation: keep the created Task/Workspace and allow direct navigation.

Do not implement destructive automatic rollback unless the spike specifically proved it is safe and idempotent for that exact boundary.

## 9. Current Workspace advanced option

Implement only if the implementation plan concludes it can reuse existing semantics safely without weakening isolation.

If implemented:

- keep it under Work Options;
- label it clearly as reusing the current Workspace;
- do not make it sticky/default over New Work Folder;
- launch a new Pi conversation, not a resume;
- do not infer the current Workspace when none is explicitly selected.

If this option introduces scope or ambiguity, defer it and document the reason. The default New Work Folder path is the acceptance requirement.

## 10. Do not implement Briefcase Active Tasks index yet unless fully derived

The spike found no blocking persistence gap for the New Task flow itself. The Briefcase-level task projection is a separate product surface.

Only implement an Active Tasks projection in Phase 3H if the spike/plan proves all rows can be derived truthfully from current persisted Workspace/pane/runtime binding state after restart.

Otherwise defer it. Do not create a Task table or new persistence just to make the index possible.

Phase 3H success does not depend on a Briefcase task index.

## 11. Preserve existing accepted AA daily workflow

Regression requirements:

- existing New Workspace still works;
- manual Task Folder rename works;
- Task Folder context/Profile shortcuts work;
- Files/Changes/Diff/Review work;
- `⌘⇧A` returns to Pi workstation;
- manual Tier 2 dispatch remains `DISPATCHED + UNTRACKED`;
- exact Pi resume remains unchanged;
- full restart/resume remains valid;
- Grok remains `NO LIVE RUNTIME` / authentication-gated and Phase 3F remains untouched.

## 12. Architecture boundaries

Expected GREEN/YELLOW changes should match `NEW-TASK-FLOW-V0.1-IMPLEMENTATION-PLAN.md`.

Explicitly frozen:

- `packages/host-service/src/**` behavior/contracts;
- `packages/pty-daemon/src/**`;
- `apps/desktop/src/main/**`;
- xterm transport/rendering/input persistence;
- Git/worktree creation semantics and filesystem services;
- shared runtime contract semantics;
- Pi bridge/hook templates;
- DB schemas/migrations;
- Tier 2 lifecycle behavior;
- deferred Grok activation;
- Files/Changes/Diff/Review behavior.

If implementation requires changing a frozen area, STOP and document the blocker rather than expanding scope.

## 13. Automated verification

Before edits, reproduce the 129-test spike baseline or equivalent current focused baseline.

After implementation run at minimum:

- pure New Task presentation/state-machine tests;
- Briefcase action/dialog tests;
- workspace-create outcome compatibility tests;
- initial pane presentation/layout tests;
- Runtime gate/matching/stale-event tests;
- Task Folder persistence/resume regression tests;
- AA daily-workflow/focus/shortcut tests;
- Runtime Contract + Host registry regression tests;
- relevant Desktop TypeScript checks;
- relevant shared/workspace-client/Host TypeScript checks if touched through imports/types;
- targeted Biome/lint;
- `git diff --check`;
- RED-area modification scan;
- evidence/diff sensitive-information scan.

Existing repository-wide lint failures in untouched design JSON should be recorded separately and must not be hidden.

## 14. Real acceptance

Use the isolated AA QA profile and a disposable local Git project.

Required real journey:

1. open a real Briefcase;
2. invoke `NEW TASK`;
3. type a harmless task title;
4. press Enter with default Pi + New Work Folder;
5. observe real Workspace/worktree provisioning;
6. observe real Pi terminal launch;
7. verify UI remains in connecting state until authoritative Pi runtime identity arrives;
8. verify Task Folder title is correct on first workstation render without manual rename;
9. verify real Pi TUI receives the title as its initial task prompt through the existing launch path;
10. verify xterm is focused when ready;
11. have Pi create a harmless file or tiny utility;
12. verify real WORKING → settled IDLE and Files/Changes/Diff truth;
13. Renderer reload and verify title/runtime/workspace survive;
14. full isolated Electron/Host restart;
15. verify saved Pi candidate and exact resume with same native identity/new epoch;
16. verify Task Folder title survives exact resume;
17. run the New Task flow a second time with the same human title and prove the generated branch/worktree does not collide;
18. verify Unicode task title handling;
19. test at least one recoverable partial-failure path without corrupting Git state;
20. verify existing New Workspace path still works;
21. verify Tier 2 dispatch regression and Grok authentication-gated presentation;
22. verify 1440×800 and larger viewport, keyboard, focus, accessibility, reduced motion.

Record before/after interaction groups. The normal successful path should materially reduce the accepted seven-group setup while preserving explicit safety boundaries.

## 15. Deliverables

Create:

- `docs/aa/PHASE-3H-NEW-TASK-FLOW-V0.1-REPORT.md`
- `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-implementation/`

The report must include:

1. executive verdict;
2. exact baseline/final commit and environment;
3. implementation architecture;
4. New Task input/naming contracts;
5. Briefcase entry/dialog behavior;
6. exact Host composition reused;
7. pane/title persistence behavior;
8. Runtime gate and truth boundaries;
9. failure/recovery matrix as implemented;
10. Current Workspace option decision;
11. Active Tasks index decision;
12. before/after interaction audit;
13. real Pi-first acceptance;
14. collision and Unicode results;
15. restart/resume regression;
16. Tier 2/Grok regressions;
17. automated verification;
18. security/RED-area review;
19. known limitations;
20. recommended next phase.

## Explicit non-goals

Do not implement:

- Task database/schema;
- automatic Task completion;
- destructive archive/cleanup;
- task priority/due date/tags;
- task list heuristics;
- native structured chat;
- transcript/history store;
- model/reasoning write controls;
- permission/cancellation UI;
- automatic agent workflow/orchestration;
- agent-to-agent messaging;
- Grok activation;
- Tier 2 runtime tracking.

After Phase 3H is complete, commit and push implementation/report/evidence to `origin/aa-spike`, then STOP. Do not begin another phase.