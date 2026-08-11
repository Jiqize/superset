# AA New Task Flow v0.1 — Implementation Plan

## Overview

Implement the accepted task-first path by composing existing Renderer and Host
interfaces:

```text
Briefcase → NEW TASK → title → one workspaces.create call with Pi
→ explicit-title pane persistence → matching Pi Runtime Contract snapshot
→ open/focus real xterm
```

This plan follows the `PROCEED` recommendation in
`NEW-TASK-FLOW-V0.1-SPIKE-REPORT.md`. It is an implementation plan only; the
spike did not execute these tasks.

### Fixed product/runtime invariants

- Default employee is a real Host Pi config.
- Default work location is a new real Workspace/worktree.
- New Task always launches a new Pi conversation; no resume ID is supplied.
- The explicit title is user-authored pane presentation, not inferred runtime
  or Git truth.
- `WORKING` is Runtime Contract-owned.
- The real Pi TUI/xterm remains the working surface.
- No automatic retry, fallback to Current Workspace, or destructive cleanup.
- No Task table, new runtime primitive, native chat, orchestration engine,
  transcript parsing, or polling loop.

## Likely change set

Path aliases used in the task lists below:

- `AAOffice/` =
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`
- `ProjectSection/` =
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/`
- `$workspaceId/` =
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/`
- `workspace-creates/` =
  `apps/desktop/src/renderer/stores/workspace-creates/`

### GREEN — expected AA implementation files

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AANewTask/`
  - `AANewTaskDialog.tsx`
  - `AANewTaskProgress.tsx`
  - `aaNewTaskPresentation.ts`
  - `aaNewTaskPresentation.test.ts`
  - `aaNewTaskFlowStore.ts`
  - `useAANewTaskFlow.ts`
  - `useAANewTaskRuntimeGate.ts`
  - `index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/index.ts`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx`
  for observation/composition only.

### YELLOW — minimal integration changes

- `ProjectSection/hooks/useDashboardSidebarProjectSectionActions/useDashboardSidebarProjectSectionActions.ts`
  to pass selected Project/serving Host into the AA dialog.
- `apps/desktop/src/renderer/stores/workspace-creates/useWorkspaceCreates.ts`
  to expose the existing Host result and carry Renderer-only initial-pane
  presentation metadata.
- `apps/desktop/src/renderer/stores/workspace-creates/writeWorkspacePaneLayout.ts`
- `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.ts`
- `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.test.ts`
- Existing V2 terminal-focus utilities/tests if a composition-only helper is
  needed.

Do not add a persisted Zustand middleware or direct `window.localStorage`
writer. The only durable title write must remain the existing
`v2WorkspaceLocalState.paneLayout` collection.

## Explicitly frozen files/areas

- `packages/host-service/src/**`
- `packages/pty-daemon/src/**`
- `apps/desktop/src/main/**`
- `apps/desktop/src/renderer/lib/terminal/**`
- V2 `TerminalPane.tsx` transport, xterm creation, WebSocket, resize, input,
  buffer and persistence behavior
- `packages/shared/src/agent-*`, builtin agent catalog, launch contracts and Pi
  hook templates
- `packages/session-protocol/**` and AA Runtime Contract semantics
- Host/Renderer database schemas and migrations
- Git/worktree creation, naming, cleanup, branch prefix, sparse checkout and
  filesystem services
- Tier 2 lifecycle behavior and deferred Grok activation
- Files/Changes/Diff/Review behavior

Existing frozen helpers may be imported/consumed. If a task requires changing
their behavior, trigger a STOP condition.

## Tests required before implementation

Run and retain the baseline before the first production edit:

```sh
bun test \
  apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.test.ts \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.test.ts \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAHandoff/aaHandoffPresentation.test.ts \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveWorkerCard/aaActiveWorkerPresentation.test.ts \
  apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/useAARuntimeSnapshots.test.ts \
  packages/host-service/src/trpc/router/workspace-creation/utils/resolve-start-point.test.ts \
  packages/host-service/src/trpc/router/workspace-creation/utils/resolve-new-branch-start-point.test.ts \
  packages/host-service/src/trpc/router/workspace-creation/utils/ai-workspace-names.test.ts \
  packages/host-service/src/trpc/router/workspace-creation/utils/branch-prefix.test.ts \
  packages/host-service/src/trpc/router/workspaces/worktree-add-tolerance.test.ts \
  packages/host-service/src/trpc/router/agents/agents.test.ts \
  packages/host-service/src/runtime/aa-runtime/registry.test.ts \
  packages/host-service/src/trpc/router/aa-runtime/aa-runtime.test.ts \
  packages/host-service/src/trpc/router/notifications/notifications.test.ts
```

Expected baseline at the spike revision: 129 passed, 0 failed.

Also run the disposable Workspace probe pattern documented in
`docs/aa/new-task-flow/v0.1-spike/workspace-create-probe.json` if
Workspace-create code has changed upstream before implementation begins.

## Sprint 1 — Pure New Task contracts

Demo: pure tests show exactly how title, branch, Pi selection, phases and
recovery labels behave; no UI or Host call exists yet.

### Task 1.1 — Define normalized New Task input

Files:

- new `AAOffice/AANewTask/aaNewTaskPresentation.ts`
- new `AAOffice/AANewTask/aaNewTaskPresentation.test.ts`

Work:

- Reuse `normalizeAATaskFolderTitleInput` for whitespace and the 48-codepoint
  limit.
- Define a non-empty validation result with explicit error copy.
- Define the initial Pi prompt as exactly the normalized title.
- Prove no terminal/prompt/history heuristic participates.

Validation:

- empty/whitespace;
- IME/Unicode content;
- 48/49+ codepoints;
- line-break and repeated-space normalization.

Dependencies: none.

Commit boundary: pure input contract and tests only.

### Task 1.2 — Define deterministic branch presentation input

Files: same pure helper/test files.

Work:

- Generate Workspace UUID before request composition.
- Import existing `sanitizeSegment` from
  `@superset/shared/workspace-launch` with an 8-character budget.
- Build `task-<seed>-<compact-uuid>` or `task-<compact-uuid>`.
- Keep the maximum candidate at 46 characters so the existing 50-character
  Host prefix remains under the shared 100-character budget.
- Do not modify shared or Host naming helpers.

Validation:

- ASCII, punctuation, Unicode-only and long titles;
- valid UUID requirement;
- same ID is stable; different IDs differ;
- no slash, traversal, control or `.lock` suffix;
- maximum length.

Dependencies: Task 1.1.

Commit boundary: branch request mapping and tests.

### Task 1.3 — Define truthful phase/recovery state machine

Files: same helper/test files plus new
`AAOffice/AANewTask/aaNewTaskFlowStore.ts` types.

States:

- `editing`
- `validating`
- `provisioning-work-folder`
- `opening-workspace`
- `starting-pi`
- `connecting-runtime`
- `ready`
- `failed`

Work:

- Store stage, optimistic/canonical Workspace ID, returned terminal ID, and a
  typed failure boundary.
- Make the store ephemeral and bounded to at most the active flow.
- Do not persist title, prompt, native session identity or errors to
  localStorage.
- Disallow `working` as a provisioning state.

Validation:

- legal/illegal transitions;
- stale flow ID ignored;
- late runtime event accepted only for matching terminal/workspace;
- dismiss does not mean cancel/cleanup;
- reset after ready or explicit abandon.

Dependencies: Tasks 1.1–1.2.

Commit boundary: pure state machine/store tests.

## Sprint 2 — Briefcase-local dialog

Demo: `NEW TASK` opens from a Briefcase, focuses the title field, defaults to
Pi + New Work Folder, and validates without making a Host mutation.

### Task 2.1 — Add the Briefcase `NEW TASK` entry

Files:

- `DashboardSidebarProjectRow.tsx`
- `useDashboardSidebarProjectSectionActions.ts`
- AAOffice exports

Work:

- Add a labelled `NEW TASK` action while retaining the existing New Workspace
  action as an advanced fallback.
- Carry exact Project ID and serving Host ID; reuse the existing local-first
  Host resolution in the project action hook.
- Keep expand/collapse, rename, keyboard and context-menu behavior intact.

Validation:

- pointer and keyboard activation;
- explicit aria label includes Project name;
- nested button does not toggle/collapse the Briefcase;
- offline/no-serving-Host state is disabled or produces a focused real error.

Dependencies: Sprint 1.

Commit boundary: trigger/wiring only.

### Task 2.2 — Build the compact AA dialog

Files:

- new `AANewTaskDialog.tsx`
- new component tests
- dashboard `layout.tsx` mount

Work:

- Reuse existing Dialog/Input/Disclosure/Tooltip primitives.
- Visible sections: title, Employee (`PI`), Work Location
  (`NEW WORK FOLDER`), Work Options, Start Work.
- Resolve the first ordered Host config with `presetId === "pi"` from
  `useV2AgentConfigs`; never substitute the last selected employee.
- Omit model/reasoning/permission controls.
- Keep the dialog mounted at dashboard level so it survives navigation during
  its ephemeral flow.

Validation:

- initial focus and Escape return;
- Enter submit rules including IME composition;
- missing/removed Pi config;
- Host loading/offline;
- reduced motion and 1440×800 density;
- no title/prompt logged.

Dependencies: Task 2.1.

Commit boundary: non-mutating dialog.

### Task 2.3 — Reuse base-branch defaults under Work Options

Files: AANewTask dialog/hooks only; consume existing
`v2-workspace-create-defaults.ts` and `useBranchContext.ts`.

Work:

- Default to the saved per-project base when present; otherwise omit
  `baseBranch` and let Host default semantics apply.
- Only fetch/render the branch picker when Work Options is opened.
- Persist an explicit user selection through the existing defaults store.
- Do not add branch naming controls.

Validation:

- saved local and remote-tracking base;
- no saved base;
- stale/offline query displays truth without blocking Host default;
- keyboard disclosure/picker.

Dependencies: Task 2.2.

Commit boundary: Work Options base selector.

## Sprint 3 — Default New Work Folder composition

Demo: one submit creates a real isolated Workspace/worktree and an initial Pi
terminal pane whose Task Folder title is correct on first render. The UI stops
at `CONNECTING WORKSTATION` until runtime proof arrives.

### Task 3.1 — Expose the existing Host create result

Files:

- `workspace-creates/useWorkspaceCreates.ts`
- its type/tests (add focused tests if absent)

Work:

- Extend only the success outcome to carry the existing
  `{ workspace, terminals, agents, alreadyExists, txid }` result.
- Keep all current callers source-compatible.
- Preserve Host URL resolution, setup-wait setting, optimistic cache, failure
  collection, canonical-ID reconciliation and transaction lifetime.
- Do not change Host API types or behavior.

Validation:

- success/raw result;
- agent `{ ok:false }` remains visible to New Task;
- canonical ID differs;
- failure still removes only optimistic local/cache rows;
- old callers compile and behave unchanged.

Dependencies: Sprint 2.

Commit boundary: outcome exposure only.

### Task 3.2 — Seed explicit Task Folder presentation atomically with pane layout

Files:

- `writeWorkspacePaneLayout.ts`
- `appendLaunchesToPaneLayout.ts`
- `appendLaunchesToPaneLayout.test.ts`

Work:

- Add optional Renderer-only initial presentation input containing normalized
  Task Folder title and selected Pi config identity.
- Apply it only to the intended successful Pi terminal launch.
- Write pane `titleOverride`, `taskTitleEdited: true`, `terminalId`, and
  `launchIdentity` in the same collection update.
- Keep setup-terminal/agent deduplication and existing layouts unchanged.
- Ensure the write occurs before `completed` resolves and the pending-create
  transaction clears.

Validation:

- first Pi pane explicit title;
- setup + chained Pi same terminal;
- failed Pi launch creates no fake titled agent pane;
- unrelated setup/command panes keep labels;
- Renderer serialization/hydration round trip;
- existing split layout append;
- manual handoff and exact resume preserve title.

Dependencies: Task 3.1.

Commit boundary: pane presentation persistence and tests.

### Task 3.3 — Submit one bundled create and navigate

Files:

- new `AAOffice/AANewTask/useAANewTaskFlow.ts`
- `AANewTaskDialog.tsx`

Work:

- Generate Workspace ID and deterministic branch once.
- Compose one snapshot:

  ```ts
  {
    id,
    projectId,
    name: normalizedTitle,
    branch: stableBranch,
    baseBranch: explicitBaseOrUndefined,
    agents: [{ agent: piConfig.id, prompt: normalizedTitle }]
  }
  ```

- Omit model, effort, resume ID and attachments.
- Close/reset only the editable fields after the snapshot is safely captured.
- Navigate to the optimistic route; reconcile a canonical ID exactly like the
  current general flow.
- Inspect `agents[0]`; never treat overall Workspace success as Pi success.

Validation:

- exact request snapshot;
- one Pi launch only;
- no heuristic resume;
- canonical redirect only while viewing the optimistic route;
- agent failure enters recoverable failed state with Workspace ID;
- no automatic retry in any failure path.

Dependencies: Tasks 3.1–3.2.

Commit boundary: real default create path.

### Task 3.4 — Replace synthetic New Task progress with real boundaries

Files:

- `AANewTaskProgress.tsx`
- new progress tests
- optionally composition in V2 Workspace `layout.tsx`

Work:

- Present only the state machine's stage labels.
- Use indeterminate activity, not percentage/timed steps.
- Keep the existing general Workspace creating screen unchanged for non-AA
  flows.
- Show actual Host/agent errors and a retained Work Folder action.

Validation:

- no “Pi working” before runtime state;
- no synthetic step completion;
- polite live-region announcements once per transition;
- dismiss does not call delete/kill/cleanup.

Dependencies: Task 3.3.

Commit boundary: truthful provisioning UI.

## Sprint 4 — Runtime confirmation, terminal readiness and recovery

Demo: a real Pi session moves from starting to Runtime-verified state; dialog
closes only after terminal/title/runtime readiness and xterm owns focus.

### Task 4.1 — Gate on exact Pi identity

Files:

- new `useAANewTaskRuntimeGate.ts`
- `$workspaceId/page.tsx` composition
- reuse `AAOffice/AAAgentStatus/useAARuntimeSnapshots.ts`

Work:

- Query/subscription must match flow Workspace ID + returned terminal ID.
- Accept only Runtime `pi`, matching transport terminal, native identity and
  session-identity capability.
- Keep actual runtime state (`idle`, `working`, `waiting`, `error`, etc.); do
  not map connection to work.
- Use a bounded UI timeout for “not confirmed,” without changing Host runtime
  timeout/registry semantics.
- A late valid snapshot may recover the same flow.

Validation:

- event-before-route handled by initial query;
- event-after-route handled by `aa-runtime:changed`;
- wrong workspace/terminal/runtime ignored;
- sequence gap/unknown/error shown truthfully;
- missing Pi executable yields no false connected state;
- late snapshot recovery.

Dependencies: Sprint 3.

Commit boundary: runtime gate/tests.

### Task 4.2 — Confirm terminal presentation/readiness and focus

Files:

- V2 Workspace composition and existing terminal-focus utility tests;
- consume `terminalRuntimeRegistry` read interfaces only.

Work:

- Require persisted matching pane and open terminal transport before `ready`.
- Select the matching pane, close the transient dialog/progress surface, and
  rely on `TerminalPane` active-focus behavior.
- Use the existing focus helper as a fallback when the xterm helper is mounted.
- Do not edit terminal runtime, xterm, WebSocket, resize or input code.

Validation:

- route/pane not yet hydrated;
- background tab;
- WebSocket open/closed/reconnect;
- xterm receives actual keyboard input after success;
- focus fallback if app window was inactive;
- no focus theft while error/recovery controls are active.

Dependencies: Task 4.1.

Commit boundary: ready/focus composition.

### Task 4.3 — Implement non-destructive recovery states

Files: New Task dialog/progress/flow hook tests.

Work:

- Validation failure: edit/retry.
- Definite pre-Workspace failure: return to dialog with retained safe input.
- Workspace exists: `OPEN WORK FOLDER`; never call create automatically.
- Agent launch failed: explicit `START PI` action using existing `agents.run`.
- Runtime unconfirmed: `OPEN TERMINAL` and `RECHECK`; no relaunch.
- UI/focus failure: reopen/focus existing terminal.
- Never expose “rollback” unless a later separately approved design defines
  exact Git cleanup.

Validation:

- ambiguous response does not duplicate Workspace/Pi;
- partial live terminal auto-adopts through existing path;
- errors retain selectable real message but redact raw IDs from normal copy;
- no delete/kill mutation is called.

Dependencies: Tasks 4.1–4.2.

Commit boundary: recovery matrix implementation.

## Sprint 5 — Current Workspace advanced option

Demo: when the current V2 Workspace belongs to the selected Briefcase, Work
Options can explicitly start a fresh Pi conversation in that Workspace while
preserving files, title, runtime truth and existing sessions.

Do this sprint only after the default New Work Folder path is accepted.

### Task 5.1 — Define eligibility and disclosure

Files: New Task pure helper/dialog tests.

Work:

- Offer only for a same-Project current V2 Workspace with reachable Host and
  existing worktree.
- Label `SHARES CURRENT FILES AND CHANGES`.
- Never default to it; never select main Workspace implicitly.
- Omit when unsafe/unavailable.

Validation: cross-project route, missing worktree, offline Host, main/worktree,
dirty files disclosure, keyboard selection.

Dependencies: Sprint 4 accepted.

Commit boundary: eligibility/UI only.

### Task 5.2 — Launch fresh Pi and add the titled pane

Files:

- `useAANewTaskFlow.ts`
- reuse/refactor the existing V2 `agents.run` + add/focus-pane composition
  without moving Host logic.

Work:

- Call `agents.run` with prompt and no resume ID.
- Add returned terminal as a new pane/tab with explicit title and Pi launch
  identity.
- Run the same runtime/terminal readiness gate.
- Keep every existing terminal/session untouched.

Validation:

- existing idle Pi is not reused;
- two same-Workspace tasks have distinct terminals/titles;
- changed count is labelled Workspace-wide or omitted per task;
- no worktree/create mutation;
- exact new runtime identity.

Dependencies: Task 5.1.

Commit boundary: advanced launch path.

## Sprint 6 — Verification and acceptance

Demo: isolated 1440×800 real UI run from Briefcase to focused Pi TUI, including
failure recovery and full restart.

### Task 6.1 — Automated verification

Run:

- all baseline focused suites;
- all new AANewTask unit/component tests;
- Workspace create/store/pane tests;
- AA state, handoff, title, runtime and exact-resume tests;
- desktop TypeScript;
- Host/session-protocol typechecks if inferred result types changed;
- targeted Biome over changed files;
- `git diff --check`;
- RED-area path scan;
- evidence sensitive-information scan.

Required new coverage:

- default request contains one Pi launch and no resume/model/effort;
- equal titles produce independent IDs/branches;
- Unicode/long title;
- missing Pi config;
- Host definite failure and ambiguous response;
- agent `{ ok:false }` partial success;
- terminal success without runtime identity;
- wrong/late/runtime-error snapshots;
- first-render title, Renderer reload, full restart and exact resume;
- keyboard/IME/focus/reduced motion;
- no automatic cleanup/retry.

Dependencies: Sprints 1–5 as included.

### Task 6.2 — Isolated real UI acceptance

Use the repository-supported AA QA profile and a disposable Git Project.

Required journey:

1. open the disposable Briefcase;
2. invoke `NEW TASK` by keyboard;
3. enter a harmless title and press Enter;
4. observe only real provisioning stages;
5. confirm real independent worktree/branch;
6. confirm returned Pi terminal and sequence-1 runtime identity;
7. send/complete a harmless file task in the real Pi TUI;
8. verify Files/Changes/Diff/Review remain unchanged;
9. Renderer reload: title and terminal remain;
10. full Electron/Host restart: title remains and exact saved Pi resume works;
11. verify one failure case without corrupting Git (for example missing
    disposable agent config or invalid preflight input);
12. if Sprint 5 shipped, verify Current Workspace creates a new Pi
    conversation and no new worktree;
13. clean disposable resources through existing safe UI/Host operations.

Capture only safe screenshots and fingerprinted runtime identity. Never retain
task prompt bodies, terminal transcript, raw UUIDs, paths, credentials or
environment dumps.

Dependencies: Task 6.1 green.

### Task 6.3 — Implementation report/checkpoint

Document:

- exact commit/environment;
- files changed;
- actual interaction count;
- progress/failure observations;
- worktree/branch result;
- runtime confirmation evidence;
- title reload/restart/resume evidence;
- accessibility/focus;
- known limits and deferred Active Task projection;
- RED scan and cleanup.

Do not begin the Briefcase Active Task index or another phase automatically.

## Migration and fallback behavior

- No database or local collection schema migration.
- Existing Workspace/pane rows remain valid; only New Task-created panes gain
  the existing `taskTitleEdited` flag at creation time.
- Existing New Workspace remains available as the advanced/general fallback.
- Existing Employee Roster, manual handoff and exact resume remain unchanged.
- No Pi config: disable Start Work with a real setup/settings explanation; do
  not choose another employee.
- No Runtime Contract identity: preserve/open terminal and show unconfirmed;
  do not downgrade Pi to Tier 2 or infer from TUI text.
- Unavailable Current Workspace: omit the option; use New Work Folder only.
- Older/remote Host incompatibility: stop before submission and retain input;
  do not add a compatibility Host path in this phase.
- In-flight app crash: discover the durable Workspace/terminal on restart and
  present recovery; do not infer all Workspace names are tasks.

## STOP conditions

Stop implementation and report the blocker if any of these becomes true:

1. A required change crosses into Host Service, PTY daemon, Git/worktree,
   database schema, Pi hook/bridge, session protocol, xterm transport or agent
   adapter behavior.
2. The existing `workspaces.create` result cannot be exposed by a small
   source-compatible Renderer type change.
3. The explicit title cannot be written into the initial pane layout before
   the pending transaction clears without a new persistent task record.
4. Pi connected cannot be proven by matching existing Runtime Contract
   identity; terminal/TUI text would have to be parsed.
5. Correctness would require silently replaying create/`agents.run`, choosing a
   different Workspace/branch, or killing/deleting partial resources.
6. The default flow would ignore the user's existing wait-for-setup semantics
   or start Pi before the Host's current bundled operation permits it.
7. Current Workspace cannot guarantee a new conversation or preserve all
   existing sessions/files.
8. Focus/input verification shows regression in xterm typing, shortcuts,
   resize, reconnect or reduced motion.
9. A new direct localStorage writer or unbounded cross-Workspace polling fan-out
   appears necessary.
10. A trustworthy recovery path would require inventing task state, completion,
    progress, employee authority or recency.

At a STOP condition, leave the existing New Workspace path intact, preserve all
partial user resources, write the evidence, and wait for a revised brief.
