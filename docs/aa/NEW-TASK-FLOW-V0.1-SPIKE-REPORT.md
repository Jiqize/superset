# AA New Task Flow v0.1 — Feasibility Spike Report

## 1. Executive recommendation

**PROCEED**

The default New Task flow can be built by composing the existing Project,
`workspaces.create`, V2 pane persistence, Pi terminal launch, and AA Runtime
Contract paths. It does not require a Task table, a new Host transaction, a new
runtime adapter, or changes to PTY/Git/worktree semantics.

The key implementation constraint is to treat the existing Host call and the
Pi Runtime Contract as two different truth boundaries:

1. `workspaces.create` can authoritatively return a real Workspace/worktree and
   a real terminal whose initial Pi command was queued.
2. Only the first accepted Pi Runtime Contract identity snapshot can prove that
   Pi itself connected.

The Renderer should coordinate those existing boundaries, seed the explicit
Task Folder title into the pane layout before the pending-create transaction
clears, and never automatically replay the full create-and-launch request.

No blocking persistence gap was found for the local macOS v0.1 contract. The
accepted explicit title fields already survive Renderer reload and full app
restart in the same Electron profile.

## 2. Current seven-group entry-flow trace

| Group | Current user/infrastructure step | Exact current path | New Task disposition |
| --- | --- | --- | --- |
| 1. Project | Choose/open a Project | `DashboardSidebarProjectRow.tsx` and `useDashboardSidebarData.ts` render Host-owned projects as Briefcases. | Remains: the user chooses a Briefcase. |
| 2. Workspace | Invoke New Workspace and select/confirm a project | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/hooks/useDashboardSidebarProjectSectionActions/useDashboardSidebarProjectSectionActions.ts` → `useOpenNewWorkspaceModal()` → `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/DashboardNewWorkspaceModal.tsx` → `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceModalContent/DashboardNewWorkspaceModalContent.tsx`. | Replaced by one Briefcase-local `NEW TASK` action. |
| 3. Worktree/checkout | Choose a base/branch/worktree and name | `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/PromptGroup/PromptGroup.tsx` and `apps/desktop/src/renderer/stores/v2-workspace-create-defaults.ts`; its imported branch hooks own the detailed picker behavior. | Hidden behind `WORK OPTIONS`; new isolated Work Folder is the default. |
| 4. Terminal | Create the first terminal/pane | Host `workspaces.create` starts setup/command/agent terminals; Renderer `writeWorkspacePaneLayout.ts` folds returned sessions into the persisted V2 layout. | Automatic, using the same path. |
| 5. Employee | Choose an agent/preset | `useV2AgentConfigs.ts`, `useV2AgentChoices.ts`, and `PromptGroup.tsx`. | Defaults explicitly to the first ordered Host config whose `presetId` is `pi`; no remembered compatibility agent may override it. |
| 6. Pi launch | Submit the prompt and start Pi | `useSubmitWorkspace.ts` → `useWorkspaceCreates.ts` → Host `workspaces.create` → `dispatchSugarAgents()` → `runAgentInWorkspace()` → terminal/PTY. | Automatic after validation; the normalized explicit task intent is the initial Pi prompt. |
| 7. Task naming/work | Rename the active terminal presentation, then work in the TUI | `AATaskFolder.tsx` → `AATerminalFrame.tsx` → `usePaneRegistry.tsx` writes `titleOverride` plus `taskTitleEdited`. | The dialog title is persisted at initial pane creation; the real Pi TUI remains the working surface. |

The accepted Phase 3G audit measured about seven interaction groups from
project entry to a named, usable Pi workstation. The common proposed path is:

```text
Open Briefcase → NEW TASK → type title → Enter → focused real Pi TUI
```

## 3. Exact Project → Workspace/worktree path

### Renderer selection and request

1. `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/hooks/useDashboardSidebarData/useDashboardSidebarData.ts`
   joins `useHostProjects()`, `useHostWorkspaces()`, and the local sidebar
   placement collections.
2. `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx`
   renders the selected Project/Briefcase and its creation affordance.
3. `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/hooks/useDashboardSidebarProjectSectionActions/useDashboardSidebarProjectSectionActions.ts`
   resolves a serving Host, preferring the local machine when it serves the
   Project, and opens the project-preselected creation surface.
4. The existing general flow resolves project, Host, prompt, base branch,
   agent config and attachments under
   `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/`.
5. `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/PromptGroup/hooks/useSubmitWorkspace/useSubmitWorkspace.ts`
   generates an optimistic UUID, resolves names, builds the
   `workspaces.create` snapshot, calls `useWorkspaceCreates().submit`, and
   immediately navigates to `/v2-workspace/$workspaceId`.
6. `apps/desktop/src/renderer/stores/workspace-creates/useWorkspaceCreates.ts`
   resolves the Host URL, inserts an optimistic Host-workspace cache row,
   creates an empty `v2WorkspaceLocalState` row, calls
   `client.workspaces.create.mutate(snapshot)`, and tracks the promise as a
   pending insert transaction.

The optimistic Workspace ID therefore exists **before the network request**.
The authoritative/canonical ID is known when `workspaces.create` resolves. A
fresh uniquely named New Task should retain the optimistic ID; an existing
branch/adopt path may return another canonical ID, and current navigation code
already replaces the route in that case.

### Host creation

The public operation is:

`packages/host-service/src/trpc/router/workspaces/workspaces.ts` →
`workspacesRouter.create`.

For the default non-PR, non-adopt path it:

1. validates the request and any explicit effort;
2. loads the local Project with `requireLocalProject`;
3. ensures the real main Workspace exists;
4. resolves the default or explicit base with
   `packages/host-service/src/trpc/router/workspace-creation/utils/resolve-new-branch-start-point.ts`;
5. applies existing project/Host branch-prefix policy;
6. checks existing branches and worktrees;
7. derives the worktree path with `safeResolveWorktreePath`;
8. creates the real Git worktree with `addBranchWorktree`;
9. inserts the Host-owned Workspace row with `registerLocalWorkspace`;
10. optionally starts setup/command terminals and dispatches requested agents;
11. returns `{ workspace, terminals, agents, alreadyExists, txid }`.

The fresh Host Workspace row is inserted after the worktree is created. The
Renderer's earlier row is only an optimistic cache projection.

### Base branch behavior

`packages/host-service/src/trpc/router/workspace-creation/utils/resolve-start-point.ts`
uses an explicit trimmed base when supplied; otherwise it resolves the Git
default branch. It prefers the local ref, then its remote-tracking ref, then
HEAD. `resolve-new-branch-start-point.ts` upgrades a local base with an
upstream to the refreshed remote-tracking ref when available. Existing fetch
failure behavior logs and continues with the resolved ref.

The New Task default can safely reuse the last per-project explicit base from
`apps/desktop/src/renderer/stores/v2-workspace-create-defaults.ts`; when none
exists, it should omit `baseBranch` and let the Host apply this existing
default logic.

## 4. Exact Workspace → terminal → Pi path

There is already one public Host operation that creates a Workspace and
launches its initial agent: `workspaces.create` accepts `agents[]`.

The exact default Pi path is:

```text
Host Pi config (`settings.agentConfigs.list`, presetId = "pi")
  → workspaces.create({ id, projectId, name, branch, baseBranch,
                       agents: [{ agent: config.id, prompt: taskTitle }] })
  → dispatchSugarAgents
  → runAgentInWorkspace
  → buildTerminalAgentLaunch
  → createTerminalSessionInternal
  → PTY daemon shell with the existing Pi initial command
  → workspaces.create result agents[0].sessionId (Superset terminal ID)
  → writeWorkspacePaneLayout
  → v2WorkspaceLocalState.paneLayout
  → V2 Workspace / TerminalPane / AATerminalFrame
  → existing xterm WebSocket
```

Exact files:

- Host config read: `apps/desktop/src/renderer/hooks/useV2AgentConfigs/useV2AgentConfigs.ts`
- Host operation: `packages/host-service/src/trpc/router/workspaces/workspaces.ts`
- Agent launch: `packages/host-service/src/trpc/router/agents/agents.ts`
- Terminal ownership: `packages/host-service/src/terminal/terminal.ts`
- Initial pane write: `apps/desktop/src/renderer/stores/workspace-creates/writeWorkspacePaneLayout.ts`
- Pane construction: `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.ts`
- Layout hydration: `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/useV2WorkspacePaneLayout/useV2WorkspacePaneLayout.ts`
- Terminal presentation: `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`
- xterm mount/focus: `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/components/TerminalPane/TerminalPane.tsx`

An `agents[]` entry returning `{ ok: true, kind: "terminal", sessionId }`
means a terminal exists and its initial command was queued. It does **not**
prove that the `pi` binary started or emitted Runtime Contract identity.

## 5. Runtime Contract confirmation point

AA may say **Pi connected** only after the Host accepts the first structured Pi
snapshot satisfying all of these conditions:

- `event.kind === "snapshot"`;
- `event.sequence === 1` for a new session/epoch;
- `runtime === "pi"` and `agentId === "pi"`;
- `workspaceId` matches the new Workspace;
- `transport.kind === "terminal"` and `transport.terminalId` matches the
  terminal returned by the launch;
- `nativeSessionId` is present;
- `capabilities.sessionIdentity.support === "available"`.

Source path:

1. `apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts`
   emits the sequence-1 snapshot on Pi `session_start`.
2. `packages/host-service/src/trpc/router/notifications/notifications.ts`
   validates terminal/workspace identity and calls `aaRuntime.ingest`.
3. `packages/host-service/src/runtime/aa-runtime/registry.ts` accepts only a
   sequence-1 snapshot for a new session and publishes the resulting snapshot.
4. `packages/host-service/src/app.ts` broadcasts `aa-runtime:changed`.
5. `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/useAARuntimeSnapshots.ts`
   queries and subscribes by Workspace, indexing snapshots by terminal.

`state: "working"` is a later, separate truth produced by `turn.started`. New
Task must not display `WORKING` merely because the terminal or identity exists.

## 6. Task Folder title persistence path

The accepted explicit-title contract is already present:

```text
normalized user title
  → terminal pane.titleOverride
  + terminal pane.data.taskTitleEdited = true
  → WorkspaceStore subscription
  → collections.v2WorkspaceLocalState[workspaceId].paneLayout
  → localStorage key v2-workspace-local-state-<organizationId>
```

Exact files:

- normalization (whitespace collapse, 48 Unicode codepoints):
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AATaskFolder/aaTaskFolderPresentation.ts`;
- current interactive write:
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`;
- serialized pane data type:
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/types.ts`;
- persistence subscription:
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/useV2WorkspacePaneLayout/useV2WorkspacePaneLayout.ts`;
- collection schema/storage:
  `apps/desktop/src/renderer/routes/_authenticated/providers/CollectionsProvider/dashboardSidebarLocal/schema.ts`
  and
  `apps/desktop/src/renderer/routes/_authenticated/providers/CollectionsProvider/collections.ts`;
- exact-resume carry-forward:
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/components/TerminalPane/components/TerminalAgentResumeBanner/TerminalAgentResumeBanner.tsx`
  plus
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAHandoff/aaHandoffPresentation.ts`.

For New Task, `writeWorkspacePaneLayout` should receive Renderer-only
presentation metadata and create the initial Pi pane with both fields before
the create promise settles. `useWorkspaceCreates` already writes the returned
layout before its tracked transaction resolves, so the first real Workspace
render can hydrate the explicit title without a new storage field.

This persistence is profile-local, not Host-owned or cross-device. That is
consistent with the accepted macOS-local v0.1 scope.

## 7. Proposed future orchestration boundary

### Decision

Use a narrow **Renderer New Task coordinator hook/store**, colocated under
`AAOffice`, and keep Host business logic in existing public operations.

The default New Work Folder path should call the single existing bundled
operation, not split or duplicate worktree and agent logic:

```ts
startNewTask({ projectId, hostId, title, baseBranch? })
  -> validate Renderer inputs and resolve the Pi config
  -> submit one workspaces.create request with one Pi agent launch
  -> persist returned pane + explicit Task Folder title
  -> navigate/reconcile canonical Workspace ID
  -> wait for the matching Runtime Contract snapshot and terminal connection
  -> dismiss provisioning UI and focus the real xterm
```

The coordinator's state is ephemeral UI state keyed by optimistic Workspace ID;
it must not be a persisted task entity or a new localStorage writer.

### Minimal existing-API exposure needed

`useWorkspaceCreates` currently reduces a successful result to
`{ ok: true, workspaceId }`, discarding `agents[]`, `terminals[]`, and
`alreadyExists`. New Task needs the returned terminal ID and agent failure to
tell the truth. The smallest change is to expose the already-returned Host
result in `SubmitOutcome` and accept optional Renderer-only initial-pane
presentation metadata. No Host contract change is required.

### Why no Host coordinator

- Worktree creation and initial agent launch are already one Host operation.
- The remaining steps are Renderer concerns: route, pane presentation,
  runtime observation, and focus.
- A Host transaction cannot make xterm mount/focus or Renderer localStorage
  atomic.
- Existing Host rollback and partial-success semantics should remain visible.

### Retry warning

The bundled operation is not safe to replay automatically after an ambiguous
response: an existing Workspace can be reused while `agents[]` dispatches a
second fresh Pi terminal. `agents.run` is also intentionally “new session per
call.” The future UI must reconcile existing Workspace/terminal/runtime state
and require an explicit recovery action rather than silently retrying the full
flow.

## 8. Safe naming and collision strategy

### Product title

1. Normalize with `normalizeAATaskFolderTitleInput`.
2. Reject an empty result.
3. Use the normalized value for:
   - Workspace display `name`;
   - initial Pi prompt;
   - pane `titleOverride` with `taskTitleEdited: true`.

The 48-codepoint title is the only user-facing task identity. It is not an
employee, runtime, or completion identity.

### Branch/worktree input

The real probe confirmed current Host auto-naming produces
`fix-restart-status` then `fix-restart-status-2` for equal ASCII names. It also
confirmed that Unicode-only titles normalize to an empty Host ASCII branch
seed and would fall back to a friendly-random name. To make New Task retries
and Unicode behavior deterministic without changing Host Git semantics, the
implementation should generate the Workspace UUID first and use this pure
Renderer mapping:

```text
seed       = sanitizeSegment(normalizedTitle, 8)
compactId  = workspaceId with hyphens removed (32 lowercase hex chars)
branch     = seed ? "task-<seed>-<compactId>" : "task-<compactId>"
```

`sanitizeSegment` already exists in `@superset/shared/workspace-launch`. The
candidate is at most 46 characters; even the existing maximum 50-character
project prefix plus `/` remains under the shared 100-character branch budget.
The full UUID makes a different task collision-independent; the same request
ID maps to the same branch for recovery.

The Host still owns:

- configured project/Host prefix application;
- existing-ref resolution;
- branch safety and path-traversal rejection;
- base-ref resolution/fetch;
- worktree root and directory resolution;
- final Git worktree creation.

The worktree directory remains derived by `safeResolveWorktreePath`. A title
is never used as a raw filesystem path. Work Options may display the resolved
base but should not expose new branch-naming controls in v0.1.

## 9. Truthful progress-state map

Do not reuse the timed steps in
`apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/components/WorkspaceCreatingState/WorkspaceCreatingState.tsx`;
that component explicitly labels its steps as estimates because
`workspaces.create` has no streaming progress.

| Product milestone | Authoritative source | Allowed presentation | Failure truth |
| --- | --- | --- | --- |
| `VALIDATING` | Local normalized non-empty title; selected Project served by reachable Host; exactly one Pi config resolved; base option valid. | `VALIDATING TASK` | Keep dialog open; field/Host/Pi error receives focus. No resources exist. |
| `PROVISIONING WORK FOLDER` | `workspaces.create` request pending. There is no narrower authoritative sub-step. | `PREPARING WORK FOLDER` with indeterminate activity only. | Mutation error. The UI must reconcile whether a Host row/worktree exists before offering recovery. |
| `OPENING WORKSPACE` | Successful result contains an authoritative Workspace row; route navigation resolves that ID through `WorkspaceProvider`. | `OPENING WORK FOLDER` | Preserve Workspace/worktree; offer `OPEN WORK FOLDER`. Do not call create again. |
| `STARTING PI` | Matching `agents[]` result is `{ ok: true, kind: "terminal", sessionId }`; initial command was queued in a real terminal. | `STARTING PI`, never `WORKING`. | `{ ok: false }` means Workspace remains but Pi did not get a terminal. A terminal with no runtime snapshot may instead contain a shell-level Pi failure. |
| `RUNTIME CONNECTED` | First accepted matching sequence-1 Pi snapshot described in section 5. | `CONNECTING WORKSTATION` until accepted; then `PI CONNECTED`/runtime `IDLE` as reported. | Timeout or quarantined/unknown/error snapshot; retain terminal and show `RUNTIME NOT CONFIRMED`. |
| `WORKSTATION READY` | Explicit title pane is persisted and active; TerminalPane transport is `open`; matching runtime identity exists. | Close provisioning surface and focus real xterm. | Keep recoverable Workspace open; expose retry-focus/open-terminal, not a fake ready state. |

`WORKING` is shown only when the Runtime Contract state is actually
`working`. A successful initial prompt may make that transition immediately,
but the UI must render the received state rather than predict it.

## 10. Rollback matrix

| Failure boundary | Resources that may exist | Safe automatic rollback | User-visible recovery | Retry/idempotency concern | Destructive risk |
| --- | --- | --- | --- | --- | --- |
| Before Workspace exists / validation fails | Dialog state only. | None needed. | Correct the focused field, choose a reachable Host, or restore Pi config. | Safe to resubmit because no request started. | None. |
| Fresh worktree creation fails | Renderer optimistic cache/local row may exist; no authoritative fresh Workspace row. Git may have no worktree, or a rare partially registered worktree/branch. Sparse-checkout failures already attempt to remove their new worktree. | Keep existing Host cleanup only. Renderer removes its optimistic rows on a definite mutation failure. | Show exact Git error; offer return to Briefcase and an inspect/reconcile path. | Do not guess a new branch or silently fall back to Current Workspace. | Removing an ambiguous Git path could delete user-created/adopted work; do not auto-delete. |
| “Workspace record exists but worktree creation failed” | For the fresh path this Host ordering does not occur: insert follows worktree creation. Only the optimistic Renderer projection can precede it. | Existing optimistic cleanup only. | Explain that creation failed before Host registration. | Reconcile by Workspace ID/branch before retry. | Same as above. |
| Worktree exists but Host row persistence fails | New worktree and branch briefly exist. `registerLocalWorkspace` already invokes its bound rollback, removing the worktree. The branch may remain. | Existing Host rollback only. | Show persistence error and let the user inspect any remaining branch. | A new request must not silently choose another branch. | Deleting the branch automatically could remove commits/hooks created during checkout; do not add cleanup. |
| Workspace/worktree exists but navigation or pane-layout write fails | Durable Host Workspace/worktree; possibly setup terminal and Pi terminal/runtime; local pane state may be empty. | None. | `OPEN WORK FOLDER`; V2 `useAutoAdoptBackgroundSessions` can recover unrepresented live terminals. Reapply explicit title only from the retained New Task intent. | Never replay bundled create solely to repair navigation. | Deleting the Workspace could discard real setup/agent output. |
| Terminal creation / Pi launch request fails | Workspace/worktree. A pre-terminal config/attachment failure yields `agents[].ok=false` and no agent terminal. Daemon-open failure also returns no terminal row. | None beyond existing terminal creation behavior. | Open Work Folder; restore Pi config/install, then explicitly `START PI`. | `agents.run` always creates a fresh conversation; a retry must be explicit. | Workspace may already contain setup output or user changes. |
| Terminal exists but Pi command fails in the shell | Workspace/worktree and live terminal with truthful shell output; no Pi snapshot. | None. | Inspect terminal, fix executable/auth/config, then explicitly start a fresh Pi session. | Runtime timeout must not auto-launch another Pi. | Killing the terminal would erase the most useful diagnosis. |
| Pi process exists but Runtime identity is not confirmed | Workspace, terminal, possibly Pi process/TUI; no authoritative AA identity. | None. | Show `RUNTIME NOT CONFIRMED`, keep terminal visible, allow recheck/open terminal. | Late snapshot may still arrive; dedupe by exact terminal. No relaunch without user action. | Killing an unconfirmed process may destroy real work. |
| Runtime confirmed but UI/title/focus transition fails | Full Workspace/worktree, terminal, Pi native session/runtime snapshot; initial pane layout should already hold title. | Idempotent route/focus/title reapplication only. | Reload/open Workspace; use existing focus command; exact resume remains available after process loss. | Do not replay creation or Pi launch. | Any rollback now could kill a verified conversation or delete changed files. |

No “cancel provisioning” action should imply Git rollback in v0.1. Closing the
dialog may hide the progress surface; it must not delete partial resources.

## 11. Current Workspace advanced-option analysis

An existing Workspace can host a new Task without new runtime primitives, but
it must remain explicit because it shares its branch, files, changes, setup,
and ports with existing work.

Safe eligibility for v0.1:

- the current route resolves a V2 Workspace;
- its `projectId` is the selected Briefcase;
- its serving Host is reachable;
- `workspace.get` says the worktree exists;
- the user opens `WORK OPTIONS` and explicitly chooses `CURRENT WORKSPACE`.

Behavior:

1. Do not call `workspaces.create`.
2. Call existing `workspaceTrpc.agents.run`/Host `agents.run` with the Pi
   config and normalized title as prompt, with no resume ID.
3. Add/focus the returned terminal pane and seed the explicit title using the
   same pane-presentation helper.
4. Wait for exact new runtime identity; never reuse an existing idle Pi.

This preserves “New Task means new Pi conversation,” but intentionally gives
up worktree isolation. The UI must state `SHARES CURRENT FILES AND CHANGES`.
If more than one task-labelled terminal lives in that Workspace, its Git
changed-file count is Workspace-wide and must not be attributed to one task.

If the current route is not an eligible same-Project Workspace, omit the
option. Do not silently choose the main Workspace and do not fall back to it
after new-worktree failure.

## 12. Briefcase-level Active Task projection analysis

A trustworthy local projection is possible without a Task table, provided the
row starts from an **explicit titled terminal pane**, not from Workspace names,
terminal history, prompts, process titles, or recency.

### Authoritative inputs and lifetimes

| Input | Source | Lifetime | Use |
| --- | --- | --- | --- |
| Workspace/Project identity | Host `workspaces` and `projects`; Renderer `useHostWorkspaces`/`useHostProjects` | Durable Host DB; remote last-seen cache where applicable | Briefcase and Work Folder identity. |
| Explicit task label | `v2WorkspaceLocalState.paneLayout`: pane `titleOverride` + `taskTitleEdited` | Electron-profile localStorage; survives full app restart | Required candidate title and terminal association. |
| Live Pi state | Host `aaRuntime.list({ workspaceId })`, indexed by terminal | Host-process memory; event-updated | `LIVE` only. |
| Legacy live binding | `terminalAgents.listByWorkspace` | Host store backed by binding persistence but returns live bindings | Secondary current identity; never stronger than Tier 1 runtime. |
| Saved Pi identity | `terminalAgents.resumeCandidate({ workspaceId, terminalId })` | Host SQLite `terminal_agent_bindings` | `SAVED / RESUMABLE` when exact Pi resume is supported. |
| Compatibility launch identity | terminal pane `data.launchIdentity` | Same pane-layout persistence | `UNTRACKED / COMPATIBILITY`. |
| Changed-file count | Existing Host Git status | Current Workspace Git state | Optional Workspace-level output fact; fetch lazily, no polling fan-out. |

### Classification algorithm

For each persisted terminal pane in a Project whose title is explicit:

1. Matching accepted Pi runtime snapshot with session identity → **LIVE**.
2. Otherwise, matching exact Pi resume candidate with resume support →
   **SAVED / RESUMABLE**.
3. Otherwise, persisted non-Tier-1 `launchIdentity` →
   **UNTRACKED / COMPATIBILITY**.
4. Otherwise → **INSUFFICIENT EVIDENCE**.

Workspace rows without an explicit task-labelled pane are also
**INSUFFICIENT EVIDENCE** and must remain ordinary Work Folders, not invented
Tasks.

### Full-restart behavior

- Task title and terminal association survive in the same Electron profile.
- Host Workspace records survive.
- Live `aaRuntime` snapshots do not survive Host restart, so a row cannot stay
  `LIVE` merely from its pre-restart state.
- A progressed Pi conversation whose terminal died under it can reappear as
  `SAVED / RESUMABLE` from the durable binding.
- Compatibility launch identity survives and remains `UNTRACKED`.
- A title with neither live, saved, nor compatibility identity becomes
  `INSUFFICIENT EVIDENCE` rather than guessed idle/offline.

This projection can be computed on demand from existing state. It should not
be added to the first New Task implementation until the default start/recovery
flow is accepted; the product spec describes it as a later Briefcase index.

## 13. Persistence-gap analysis

There is **no blocking persistence gap** for New Task v0.1 after the initial
pane layout has been written:

- explicit title: existing Renderer persistence;
- Workspace/worktree: Host DB + Git;
- terminal association: pane layout + Host terminal row;
- exact Pi resume: durable Host terminal-agent binding;
- live truth: intentionally Host-memory Runtime Contract snapshot.

Known, non-blocking limits:

1. If Electron is killed during the Host mutation before the returned pane is
   persisted, the Workspace name survives but the explicit pane marker may
   not. Recovery must show a partial Work Folder and ask the user to confirm or
   reapply its title; it must not infer every Workspace name is a Task.
2. Clearing/changing the Electron profile loses pane presentation state.
3. Runtime snapshots intentionally downgrade across Host restart until live or
   saved evidence is re-established.
4. There is no durable manual `DONE` state, cross-device Task label, task owner,
   or archive state. None is required by the entry-flow contract.

If a future cross-device or multi-client Task index requires the explicit label
without Renderer state, the demonstrated minimum missing persistence would be
“explicit task label + Workspace/terminal association + user-authored flag” in
a Host-owned read model. This spike does not justify a Task table today.

## 14. Expected interaction reduction

For a selected Briefcase, the common path becomes three direct groups:

1. invoke `NEW TASK`;
2. type the task title;
3. press Enter and arrive in the focused Pi TUI.

Compared with the current seven-group model, explicit Workspace naming,
checkout/worktree choice, terminal creation, employee selection, Pi launch,
and post-launch task rename disappear from the common path. Base branch and
Current Workspace remain available only behind Work Options.

The following remain structurally necessary even when hidden from the common
UI: Host selection, base resolution, real worktree creation, terminal creation,
Pi launch, runtime identity confirmation, pane persistence, and xterm focus.

## 15. Accessibility and focus requirements

- Use the existing accessible Dialog primitives; title it `NEW TASK` and give
  the task input a persistent visible label.
- Initial focus goes to “What are we working on?”.
- Enter submits only when the input is non-empty, the IME is not composing,
  and no Work Options control owns the key.
- Escape closes before submission and returns focus to the exact `NEW TASK`
  trigger. After submission, Escape may dismiss the progress surface but must
  not imply cancellation or cleanup.
- Employee and Work Location keep explicit text (`PI`, `NEW WORK FOLDER`), not
  icon-only metaphors.
- Work Options is a keyboard-operable disclosure. Base branch controls reuse
  existing accessible branch picker semantics.
- Validation errors use field descriptions; asynchronous stage/error changes
  use a polite live region. No percentage or timed fake progress.
- During a recoverable failure, focus the first actionable recovery control
  while leaving error text selectable.
- On success, wait until the active terminal is mounted/open, close the Dialog,
  and focus the real xterm helper textarea. Existing `TerminalPane.tsx` already
  focuses an active terminal; the coordinator should verify/fallback through
  the existing terminal-focus helper, not manipulate PTY/xterm internals.
- Preserve visible focus rings and `prefers-reduced-motion` behavior.

## 16. Security and RED-area review

Investigation modified no production code and no RED-area file.

The implementation can remain GREEN/YELLOW:

- new AA dialog, progress, presentation helpers and tests under `AAOffice/`;
- Briefcase presentation/action wiring;
- a minimal extension to existing Renderer Workspace-create outcome/pane
  persistence;
- V2 Workspace observation/focus composition.

Frozen RED boundaries:

- `packages/host-service/src/`;
- `packages/pty-daemon/src/`;
- `apps/desktop/src/main/` Pi bridge/hook code;
- terminal transport/xterm internals;
- Host/Renderer database schemas;
- Git/worktree implementation and cleanup semantics;
- Runtime Contract/session protocol;
- agent catalog/adapter architecture.

Security posture:

- Only the explicit user-entered title is sent as the initial prompt; no
  terminal-history or prompt heuristic is used.
- Existing `buildTerminalAgentLaunch` and prompt sanitization/quoting remain
  authoritative.
- The proposed branch seed uses an existing shared sanitizer and UUID, never a
  raw path.
- Do not log task titles, prompts, native session IDs, terminal output, or
  environment values as analytics/evidence.
- No new localStorage writer is needed; the existing allowlisted pane-layout
  collection remains the persistence owner.

If implementation requires any frozen area, stop and revise the product plan
instead of moving runtime logic into Renderer.

## 17. Real probe results

### Disposable Workspace/worktree probe

On macOS arm64 with Bun 1.3.14, a disposable Git repository and isolated Host
database called the real `workspacesRouter.create` procedure:

- first `Fix restart status` → worktree branch `fix-restart-status`;
- second equal title → independent branch `fix-restart-status-2`;
- both returned real `type: "worktree"` rows with `alreadyExists: false`;
- with agents/setup disabled, both correctly returned zero terminal/agent
  results;
- a 60-codepoint Unicode input normalized to a 48-codepoint presentation title;
- the proposed stable Unicode branch shape `task-<compact-workspace-uuid>` was
  accepted and persisted as a real worktree;
- `../escape` was rejected with a path-traversal `TRPCError` before row or
  worktree counts changed;
- all fixture worktrees were clean.

Observed local durations were 334 ms and 305 ms. They are evidence of ordering,
not a performance budget.

The first harness attempt used production `better-sqlite3` under Bun and hit
Bun's known unsupported native binding. The probe was rerun with the same
`bun:sqlite`/Drizzle test adapter already used by Host tests; this was a probe
harness issue, not a product failure.

### Focused automated verification

The following 14 focused suites ran together: Workspace base/branch/naming and
real worktree tolerance; pane launch persistence; AA Task Folder, handoff,
worker and runtime-index presentation; Host agent launch; AA Runtime registry
and router; notification ingestion.

Result: **129 passed, 0 failed, 245 expectations**.

### Existing real Pi evidence

No second credentials-bearing Pi dogfood run was needed because production
code is unchanged from the already-accepted Phase 3G run. The spike reuses the
safe evidence under `docs/aa/runtime-foundation/phase-3g/`, which proves real
Pi launch, Runtime Contract state, title persistence across full restart,
exact resume, xterm focus, and the Tier 2 `UNTRACKED` boundary. No raw runtime
identity is copied into this spike.

Sanitized new evidence is in `docs/aa/new-task-flow/v0.1-spike/`.

## 18. Recommendation for the implementation phase

Implement New Task as an additive AA entry surface in five bounded increments:

1. pure title/branch/progress contracts and tests;
2. Briefcase-local dialog with default Pi and New Work Folder;
3. one bundled `workspaces.create` call plus initial explicit-title pane write;
4. exact runtime/terminal readiness gate and recovery states;
5. optional Current Workspace advanced path, followed by isolated real UI QA.

Keep the existing New Workspace surface as the advanced fallback during v0.1.
Do not implement the later Briefcase Active Task index in the same change; the
projection is feasible, but it deserves a separate presentation acceptance
after the entry flow is stable.

The implementation must stop rather than broaden scope if it cannot expose the
existing launch result without Host changes, cannot persist the explicit title
before the pending transaction clears, cannot distinguish terminal creation
from Runtime Contract identity, or would need an automatic destructive
rollback.

Detailed atomic tasks, tests, fallback behavior, and STOP conditions are in
`NEW-TASK-FLOW-V0.1-IMPLEMENTATION-PLAN.md`.
