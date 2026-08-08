# AA Codebase Map

This is the working map for the **AA Minimal Skin PoC**. It is a navigation
guide, not a UI design or an implementation plan. It was scoped on branch
`aa-spike` at commit `cb24df7887fc7f67a6b310ae15fd14e0c8de4968`.

Use this map after reading `SPIKE.md`, `IMPLEMENTATION-PLAN.md`, and
`BASELINE.md`. Start from the Renderer entries below; do not rescan the
monorepo unless a concrete dependency crosses one of the documented
boundaries.

Every relevant path is classified into exactly one of these categories:

- **A. ACTIVE WORKING SET** — AA GUI code and its immediate presentation layer.
- **B. READ-ONLY INFRASTRUCTURE** — mature runtime code AA consumes but should
  not normally change.
- **C. OUT OF SCOPE** — code a normal AA GUI session should ignore.

The color labels in the final **AA Change Boundary** section are a modification
policy over these three categories, not additional categories.

## A. ACTIVE WORKING SET

### Future product vocabulary

These are navigation aids only. Do not implement the mappings during scoping.

| Superset concept | Possible AA representation |
| --- | --- |
| Project | Briefcase |
| Workspace | Folder or Desk |
| Worktree | Workspace copy or folder variant |
| Agent | Pixel Worker |
| Agent lifecycle status | Worker animation/state |
| Terminal session | Work session |
| Diff / changed files | Work output |
| Pane / tab | Desk surface / work view |

### Active areas

| Area | Path and important entries | Responsibility and AA-relevant dependencies | Modification safety | Possible AA role |
| --- | --- | --- | --- | --- |
| Renderer bootstrap and app shell | `apps/desktop/src/renderer/index.tsx`; `routes/__root.tsx`; `routes/-layout.tsx`; `routes/_authenticated/layout.tsx`; `routes/_authenticated/_dashboard/layout.tsx` | Mounts TanStack Router, global CSS, providers, dashboard sidebar, top bar, and route content. Depends on `LocalHostServiceProvider`, `HostWorkspacesProvider`, `CollectionsProvider`, and notification controllers. | **GREEN** for dashboard composition and presentation. Provider order and startup effects are **YELLOW**. | Pixel-office outer shell and main frame. |
| V2 workspace shell | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/layout.tsx`; `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx` | Resolves a host-owned workspace, creates the pane workspace, composes tab bar, presets, run controls, empty states, and the right sidebar. Depends on `@superset/panes`, `WorkspaceProvider`, `workspaceTrpc`, and local pane-layout persistence. | **GREEN** for wrappers, layout, labels, and visual composition. Leave data and lifecycle hooks intact. | One AA Desk and its visible work surfaces. |
| Project/workspace navigation | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/DashboardSidebar.tsx`; its `components/DashboardSidebarProjectSection/` and `components/DashboardSidebarWorkspaceItem/` trees | Renders projects, sections, workspaces, selection, pinning, and creation affordances. Data comes from `useDashboardSidebarData`, `useHostProjects`, `HostWorkspacesProvider`, and local sidebar collections. | **GREEN** for rendering. Action/data hooks are **YELLOW**. | Project → Briefcase; workspace/worktree → Folder or Desk variant. |
| Workspace and agent badges | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarWorkspaceIcon/DashboardSidebarWorkspaceIcon.tsx`; the sibling `DashboardSidebarExpandedWorkspaceRow/components/DashboardSidebarWorkspaceChips/` tree; `apps/desktop/src/renderer/screens/main/components/StatusIndicator/` | Presents host kind, creation/working state, live terminal-agent identities, and derived status. Depends on `useTerminalAgentBindings`, `useTerminalAgentStatuses`, and `useV2WorkspaceNotificationStatus`. | **GREEN** for presentation only; status derivation is **RED**. | Pixel Worker identity plus idle/working/review/permission/failed animation. |
| Agent picker and launch surfaces | `apps/desktop/src/renderer/components/AgentSelect/AgentSelect.tsx`; `apps/desktop/src/renderer/components/AgentModelSelect/`; `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/PromptGroup/PromptGroup.tsx`; V2 workspace `components/V2PresetsBar/V2PresetsBar.tsx` and `components/AddTabMenu/AddTabMenu.tsx` | Displays host agent configs, selection, supported model/effort controls, and terminal presets. Depends on `useV2AgentChoices`, `useV2AgentConfigs`, `useBuiltinPresets`, and existing launch callbacks. | **GREEN** for labels/layout/visual treatment. Keep config IDs, preference semantics, and launch payloads unchanged. | Worker hiring/assignment and work-session launcher. |
| Pane presentation and registration | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`; its `components/TerminalPane/`, `components/FilePane/`, `components/DiffPane/`, and `components/BrowserPane/` trees; `packages/panes/src/react/components/Workspace/` | Registers pane kinds and supplies headers, icons, toolbar content, close behavior, and pane bodies to the generic layout engine. Depends on `@superset/panes`, `workspaceTrpc`, file state, Git status, browser IPC, and the terminal runtime. | Renderer-level headers/wrappers are **GREEN**. Registry behavior is **YELLOW**. `TerminalPane` transport/xterm code and `packages/panes` store mechanics are not PoC targets. | Work session, work output, file view, and browser work surface. |
| Workspace right sidebar | `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/WorkspaceSidebar/WorkspaceSidebar.tsx`; its `components/FilesTab/`, `hooks/useChangesTab/`, and `hooks/useReviewTab/` trees | Presents Files, Changes, and Review using `WorkspaceGitStatusProvider`, filesystem queries, Git queries, and local selected-tab preferences. | **GREEN** for the container and rows; mutations/query logic are **YELLOW/RED**. | Desk drawers: source files and produced work. |
| Desktop visual tokens and themes | `apps/desktop/src/renderer/globals.css`; `apps/desktop/src/renderer/stores/theme/`; `apps/desktop/src/shared/themes/` | Desktop CSS variables map into Tailwind utilities; the theme store applies `UIColors` at runtime and separately derives xterm colors. | Additive desktop shell tokens are **GREEN**. Existing theme schema/store is **YELLOW**. Do not alter the `.xterm` sizing contract for the PoC. | AA palette, spacing, typography, and later pixel-office visual language. |
| Shared UI primitives | `packages/ui/src/components/ui/`; `packages/ui/src/components/`; `packages/ui/src/globals.css` | Shared Radix/shadcn-style controls consumed across all Superset apps. | Prefer consuming them unchanged. Add a genuinely reusable primitive cautiously; broad restyling is **YELLOW** because it affects non-AA surfaces. | Reusable AA-compatible controls where desktop-local composition is insufficient. |
| Generic pane layout | `packages/panes/src/core/`; `packages/panes/src/react/` | Headless tab/split-pane state and generic React chrome. The Renderer supplies pane content through a registry. | Consume unchanged for the first PoC. A generic visual extension is **YELLOW**; store/layout behavior is **RED**. | Existing desk/pane geometry, not a new runtime abstraction. |

### Renderer Entry Map

1. **Where does the desktop app shell start?**
   `apps/desktop/src/renderer/index.tsx` mounts the router. The route/provider
   chain is `apps/desktop/src/renderer/routes/__root.tsx` →
   `apps/desktop/src/renderer/routes/-layout.tsx` →
   `apps/desktop/src/renderer/routes/_authenticated/layout.tsx`; the visible
   dashboard shell starts in
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx`.

2. **Where does the V2 workspace UI start?**
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/layout.tsx`
   resolves the workspace and installs `WorkspaceProvider`; the actual UI is
   composed in
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx`.

3. **Where is the workspace sidebar?**
   There are two relevant sidebars:
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/DashboardSidebar.tsx`
   is the left project/workspace navigator, while
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/WorkspaceSidebar/WorkspaceSidebar.tsx`
   is the right Files/Changes/Review sidebar.

4. **Where are project/workspace navigation components?**
   Start at the left sidebar in A.3, then follow
   `components/DashboardSidebarProjectSection/DashboardSidebarProjectSection.tsx`,
   its `components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx`,
   and `components/DashboardSidebarWorkspaceItem/DashboardSidebarWorkspaceItem.tsx`.
   Under the same sidebar root,
   `hooks/useDashboardSidebarData/useDashboardSidebarData.ts` is the read-model
   join; modify it only if a verified data need cannot be met in presentation
   code.

5. **Where are terminal panes rendered?**
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`
   registers the `terminal` pane, which renders its
   `components/TerminalPane/TerminalPane.tsx`. The latter mounts the existing
   xterm runtime and connects it to the host WebSocket; it is an infrastructure
   boundary, not a skin target.

6. **Where are agent presets / agent selection defined?**
   Presentation starts at
   `apps/desktop/src/renderer/components/AgentSelect/AgentSelect.tsx`,
   `apps/desktop/src/renderer/hooks/useV2AgentChoices/useV2AgentChoices.ts`,
   the new-workspace `PromptGroup.tsx` listed in the Pi trace, and
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx`.
   Builtin terminal definitions are in
   `packages/shared/src/builtin-terminal-agents.ts`; host-editable instances
   are exposed by
   `packages/host-service/src/trpc/router/settings/agent-configs.ts`.

7. **Where is agent lifecycle status exposed to Renderer?**
   `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentBindings/useTerminalAgentBindings.ts`
   reads live bindings;
   `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentStatuses/deriveTerminalAgentStatus.ts`
   maps hook events to `working`, `permission`, `failed`, `review`, or `idle`;
   and
   `apps/desktop/src/renderer/hooks/host-service/useV2NotificationStatus/useV2NotificationStatus.ts`
   aggregates terminal → pane → workspace status.
   `apps/desktop/src/renderer/routes/_authenticated/components/V2NotificationController/V2NotificationController.tsx`
   maintains background subscriptions.

8. **Where are Diff/File/Browser panes registered?**
   All three are entries in
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`,
   with bodies in its `components/DiffPane/`, `components/FilePane/`, and
   `components/BrowserPane/` directories.

9. **Where are global visual tokens/styles defined?**
   Desktop defaults and Tailwind mappings are in
   `apps/desktop/src/renderer/globals.css`. Runtime theme values come from
   `apps/desktop/src/shared/themes/` through
   `apps/desktop/src/renderer/stores/theme/store.ts` and
   `apps/desktop/src/renderer/stores/theme/utils/css-variables.ts`.
   `packages/ui/src/globals.css` is the broader shared default and should not
   be the first AA override point.

10. **Which files are the best first AA visual PoC candidates?**

    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/DashboardSidebar.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarExpandedWorkspaceRow/DashboardSidebarExpandedWorkspaceRow.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarExpandedWorkspaceRow/components/DashboardSidebarWorkspaceChips/components/DashboardSidebarAgentsChip/components/DashboardSidebarAgentAvatar/DashboardSidebarAgentAvatar.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/TopBar/TopBar.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx`
    - `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/WorkspaceSidebar/WorkspaceSidebar.tsx`
    - `apps/desktop/src/renderer/globals.css`

These candidates can change the shell substantially without changing terminal,
agent, Git, or persistence semantics.

## B. READ-ONLY INFRASTRUCTURE

> **DO NOT MODIFY unless a verified blocker requires it.** Reproduce the
> blocker at the public Renderer boundary first, and keep any unavoidable fix
> minimal and covered by the existing tests.

| Area | Paths | Public interface used by Renderer | Why AA should avoid changing it |
| --- | --- | --- | --- |
| Agent Session Orchestrator | `apps/desktop/src/renderer/lib/agent-session-orchestrator/`; `packages/shared/src/agent-launch-request.ts`; `packages/shared/src/agent-launch.ts` | `launchAgentSession(...)` and `queueAgentSessionLaunch(...)` route generic `AgentLaunchRequest` values to chat or terminal adapters. | It handles idempotency, legacy tabs, task launches, attachments, and chat. The current V2 Pi flow does **not** pass through this orchestrator; changing it would not skin the AA workspace and could regress V1/task flows. |
| Host-service lifecycle | `apps/desktop/src/main/lib/host-service-coordinator.ts`; `apps/desktop/src/main/index.ts`; `packages/host-service/src/serve.ts`; `packages/host-service/src/app.ts`; `renderer/routes/_authenticated/providers/LocalHostServiceProvider/` | Renderer reads `useLocalHostService()` (`machineId`, `activeHostUrl`, status, `waitForHostReady`) and Electron tRPC coordinator status. | Process spawn/adoption, auth, ports, respawn, shutdown, and per-organization ownership are mature lifecycle primitives outside a GUI skin. |
| Renderer ↔ host client boundary | `packages/workspace-client/src/`; `apps/desktop/src/renderer/lib/host-service-client.ts`; `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/providers/WorkspaceTrpcProvider/`; `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/providers/WorkspaceProvider/` | `workspaceTrpc.*`, `getHostServiceClientByUrl(...)`, `WorkspaceClientProvider`, `useWorkspaceWsUrl(...)`, and the shared event bus. | This is the stable HTTP/tRPC/WebSocket boundary for local and remote hosts. AA should consume it rather than introduce another runtime abstraction. |
| Host agent configs and launch | `packages/shared/src/builtin-terminal-agents.ts`; `packages/shared/src/host-agent-presets.ts`; `packages/shared/src/agent-models.ts`; `packages/host-service/src/trpc/router/settings/agent-configs.ts`; `packages/host-service/src/trpc/router/agents/agents.ts` | `settings.agentConfigs.list`, `agents.run`, and the `HostAgentConfig` shape. | These files define commands, prompt transport, model/effort flags, resume args, validation, and shell quoting for every terminal agent. AA is Pi-first, but must not fork this machinery. |
| Terminal and PTY ownership | `packages/host-service/src/trpc/router/terminal/terminal.ts`; `packages/host-service/src/terminal/terminal.ts`; `packages/host-service/src/terminal/DaemonClient/`; `packages/host-service/src/daemon/`; `packages/pty-daemon/src/` | `workspaceTrpc.terminal.*` plus `/terminal/:terminalId?workspaceId=...` WebSocket. | Owns shell environment, PTY processes, byte transport, replay, resize, exit, daemon adoption, and process cleanup. This is explicitly outside AA UI work. |
| Renderer terminal persistence | `apps/desktop/src/renderer/lib/terminal/terminal-runtime.ts`; `terminal-runtime-registry.ts`; `terminal-ws-transport.ts`; `terminal-buffer-gc.ts`; V2 `TerminalPane.tsx` | `terminalRuntimeRegistry.mount/connect/detach/release/dispose`; serialized xterm buffer/dimensions in localStorage, keyed by terminal ID. | It preserves xterm/TUI correctness and scrollback across React unmounts/reloads. Pixel presentation must wrap it, not alter its transport, parser, sizing, or persistence behavior. |
| Agent hooks and lifecycle binding | `apps/desktop/src/main/lib/agent-setup/`; `packages/host-service/src/trpc/router/notifications/notifications.ts`; `packages/host-service/src/events/`; `packages/host-service/src/terminal-agents/`; `packages/workspace-client/src/lib/eventBus.ts` | Host `notifications.hook`, `terminalAgents.listByWorkspace`, `resumeCandidate`, and `clearWorkspaceStatuses`; event types `agent:lifecycle` and `terminal:lifecycle`; Renderer hooks listed in A.7. | This is the cross-process source of agent identity, status, notification, and resume metadata. Presentation may interpret the exposed status but must not change hook semantics for the PoC. |
| Git and worktrees | `packages/host-service/src/trpc/router/workspaces/workspaces.ts`; `packages/host-service/src/trpc/router/workspace-creation/`; `packages/host-service/src/trpc/router/workspace-cleanup/`; `packages/host-service/src/trpc/router/git/git.ts`; `packages/host-service/src/runtime/git/` | `workspaces.create`, workspace list/get/delete operations, and `workspaceTrpc.git.*`. Renderer consumes these through `useWorkspaceCreates`, `HostWorkspacesProvider`, `WorkspaceGitStatusProvider`, Changes, and Diff UI. | Branch selection, worktree paths, sparse checkout, cleanup, credentials, status, diff, staging, and PR state have destructive edge cases. Re-label or re-present them; do not change their behavior. |
| Filesystem service | `packages/host-service/src/trpc/router/filesystem/filesystem.ts`; `packages/host-service/src/runtime/filesystem/`; `packages/workspace-fs/src/` | `workspaceTrpc.filesystem.*` plus `fs:events`. FilePane, FilesTab, Quick Open, and file-document state consume it. | It enforces workspace boundaries, symlink/path safety, watching, file I/O, and error translation. AA needs its results, not a replacement. |
| Local persistence/read models | `packages/host-service/src/db/`; `packages/local-db/src/`; `packages/db/src/`; `apps/desktop/src/renderer/routes/_authenticated/providers/CollectionsProvider/`; `apps/desktop/src/renderer/routes/_authenticated/providers/HostWorkspacesProvider/`; `apps/desktop/src/renderer/hooks/host-projects/`; `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/useV2WorkspacePaneLayout/` | `useCollections()` local collections, `useHostWorkspaces()`, `useHostProjects()`, and persisted `v2WorkspaceLocalState.paneLayout`. | These layers preserve project/workspace identity, sidebar placement, pane layout, presets, terminal IDs, and cached host data. Styling must not alter schemas, storage keys, synchronization, or ownership. |

### Existing Pi path

The current AA path is the V2 host-service path. The similarly named Renderer
`apps/desktop/src/renderer/lib/agent-session-orchestrator/adapters/terminal-adapter.ts`
is a V1/task adapter
that creates legacy tab-store panes and writes commands into them; it is **not**
the adapter used by the V2 AA workspace.

1. **Builtin definition** — `packages/shared/src/builtin-terminal-agents.ts`
   defines Pi as `command: "pi"`, `resumeCommand: "pi --session"`, and
   `nonInteractiveCommand: "pi --no-tools -p"`.
2. **Host config materialization** —
   `packages/shared/src/host-agent-presets.ts` tokenizes that definition;
   `packages/host-service/src/trpc/router/settings/agent-configs.ts` seeds a
   host-local config row. Renderer reads it through
   `apps/desktop/src/renderer/hooks/useV2AgentConfigs/useV2AgentConfigs.ts`
   and
   `apps/desktop/src/renderer/hooks/useV2AgentChoices/useV2AgentChoices.ts`.
3. **Launch request** — for a new workspace,
   `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/PromptGroup/PromptGroup.tsx`
   passes the selected config UUID, prompt, optional model, and optional
   effort to
   `apps/desktop/src/renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/PromptGroup/hooks/useSubmitWorkspace/useSubmitWorkspace.ts`,
   then
   `apps/desktop/src/renderer/stores/workspace-creates/useWorkspaceCreates.ts`
   calls
   `workspaces.create`. For an already-open workspace, the agent action in
   `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`
   calls
   `workspaceTrpc.agents.run` directly.
4. **Effective V2 terminal adapter** — both paths converge on
   `packages/host-service/src/trpc/router/agents/agents.ts`.
   `resolveHostAgentConfig` finds the Pi row,
   `buildTerminalAgentLaunch` builds the quoted command and appends supported
   model/effort/resume arguments, and `runTerminalAgent` requests a terminal.
   `workspaces.create` reaches the same function through
   `dispatchSugarAgents` in
   `packages/host-service/src/trpc/router/workspaces/workspaces.ts`.
5. **PTY/session** — `createTerminalSessionInternal` in
   `packages/host-service/src/terminal/terminal.ts` creates a Superset terminal
   UUID, constructs the workspace-scoped shell environment, and calls the
   daemon through `packages/host-service/src/terminal/DaemonClient/` and
   `packages/host-service/src/daemon/DaemonSupervisor.ts`.
   `packages/pty-daemon/src/Server/Server.ts`,
   `packages/pty-daemon/src/SessionStore/SessionStore.ts`, and
   `packages/pty-daemon/src/Pty/Pty.ts` own the live shell, byte stream, and
   bounded replay buffer.
6. **Pi process** — the shell receives the generated `pi ...` initial command.
   Pi runs as its existing terminal TUI; Superset does not parse the TUI into a
   chat protocol.
7. **Pi extension/hooks** — desktop startup calls `setupAgentIntegrations` from
   `apps/desktop/src/main/index.ts`.
   `apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts` installs
   `apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts`
   as
   `~/.pi/agent/extensions/superset-hooks.ts`. Pi auto-loads it and it invokes
   the shared `~/.superset/hooks/notify.sh`, generated from
   `apps/desktop/src/main/lib/agent-setup/templates/notify-hook.template.sh`.
8. **Lifecycle/status** — `notify.sh` posts to
   `packages/host-service/src/trpc/router/notifications/notifications.ts`.
   `packages/host-service/src/events/map-event-type.ts` normalizes the event;
   the EventBus broadcasts it; `packages/host-service/src/terminal-agents/store.ts`
   and `packages/host-service/src/terminal-agents/persistence.ts` update the
   binding.
9. **Back to Renderer** — `packages/workspace-client/src/lib/eventBus.ts`
   carries `agent:lifecycle`;
   `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentBindings/useTerminalAgentBindings.ts`
   refetches `terminalAgents.listByWorkspace`;
   `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentStatuses/useTerminalAgentStatuses.ts`
   and
   `apps/desktop/src/renderer/hooks/host-service/useV2NotificationStatus/useV2NotificationStatus.ts`
   derive presentation state. Sidebar avatars, workspace icons, pane
   indicators, and
   `apps/desktop/src/renderer/routes/_authenticated/components/V2NotificationController/V2NotificationController.tsx`
   render it.
10. **Terminal rendering** — the launch result's `sessionId` is the Superset
    **terminal ID**. It is stored in terminal pane data;
    `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/components/TerminalPane/TerminalPane.tsx`
    mounts `terminalRuntimeRegistry` and connects to `/terminal/:terminalId`.

In compact form:

```text
builtin Pi definition
  -> host agent-config row
  -> Renderer workspaces.create / agents.run
  -> host buildTerminalAgentLaunch (effective V2 terminal adapter)
  -> createTerminalSessionInternal
  -> DaemonClient -> pty-daemon -> shell -> pi TUI
  -> Pi extension -> notify.sh -> notifications.hook
  -> EventBus + TerminalAgentStore
  -> workspace-client + Renderer status hooks
  -> sidebar/pane status presentation
```

### What Superset currently gets from Pi

| Capability | Current state |
| --- | --- |
| Terminal/TUI output | **Yes.** Raw PTY bytes flow through the host terminal WebSocket into xterm. Superset sees and persists terminal presentation, not Pi message objects. |
| Lifecycle state | **Partial, intentionally lossy.** Pi maps `session_start` → `Attached`, `before_agent_start` → `Start`, `tool_execution_end` → `PostToolUse` → `Start`, `agent_end` → `Stop`, `session_end` → `Detached`, and `session_shutdown` → `Stop`. Renderer can show attached/working/review-or-idle; the extension does not emit Pi-specific failure or permission events. |
| Superset terminal session ID | **Yes.** `agents.run` returns the terminal UUID as `sessionId`; pane state and terminal persistence use it. This is not a Pi conversation ID. |
| Pi conversation session ID / resume | **Not currently captured.** Generic host support exists (`resumeArgs`, `terminalAgents.resumeCandidate`, and `agents.run({ resumeSessionId })`), and Pi's preset knows `--session`. However, the Pi extension sends only `{ hook_event_name }`, so `notify.sh` has no `session_id` and `terminal_agent_bindings.agent_session_id` remains empty. The resume banner at `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/components/TerminalPane/components/TerminalAgentResumeBanner/TerminalAgentResumeBanner.tsx` therefore has no Pi candidate. Baseline verification found Renderer reload/reattach practical, but a full Electron restart launched a fresh Pi conversation. |
| Tool progress | **No structured progress.** `tool_execution_end` only refreshes the coarse `Start`/working signal. Tool name, arguments, result, and percent/progress are not sent. |
| Structured chat messages | **No.** Prompts and responses remain terminal/TUI input and output; Pi is not routed through Superset chat sessions. |
| Model selection | **No Pi model picker today.** Pi has no entry in `AGENT_MODEL_SUPPORT`, so the new-workspace UI omits model selection for Pi. |
| Reasoning level | **Yes, at launch.** Pi is in `AGENT_EFFORT_SUPPORT`; the UI can select `off`, `minimal`, `low`, `medium`, `high`, or `xhigh`, and the host appends `--thinking <level>`. |
| Structured approvals | **No.** Approval interaction remains inside the Pi TUI. The Pi extension does not emit `PermissionRequest`, and Superset has no structured approve/deny channel for Pi. |

Do not build a new Pi adapter to fill these gaps during the Minimal Skin PoC.
The existing terminal and lifecycle contract is the baseline.

## C. OUT OF SCOPE

The following was verified from the repository's top-level app/package
manifests and directory roles. These areas are not part of a local,
macOS-first, Pi-first AA GUI skin and should not be scanned during normal AA
sessions.

| Paths | Verified role | AA rule |
| --- | --- | --- |
| `apps/marketing/`, `apps/docs/`, `apps/admin/`, `apps/web/` | Separate Next.js marketing, documentation, admin, and web applications. | Ignore. Shared primitives should be changed only from a concrete desktop need, not by editing these apps. |
| `apps/mobile/` | Expo/React Native mobile application. | Ignore; AA is macOS desktop first. |
| `apps/api/` | Cloud/API Next.js service, including integrations, auth-facing APIs, billing, and hosted features. | Ignore for the local GUI PoC. A baseline service failure is not permission to redesign this backend. |
| `apps/electric-proxy/`, `apps/relay/`, `apps/relay2/` | Electric sync proxy and remote-host relay services. | Ignore while AA is one local project/workspace/session. |
| `apps/discord-triage/`, `apps/streams/` | Discord triage service and an otherwise empty placeholder package. | Ignore. |
| `packages/auth/`, `packages/email/`, `packages/trpc/` | Shared cloud authentication, email, and API router layers. | Ignore unless a separately reproduced baseline/auth blocker is explicitly in scope. |
| `packages/chat/`, `packages/chat-legacy/`, `packages/chat-runtime/`, `packages/session-protocol/` | Superset structured chat/session runtimes. | Ignore for the Pi terminal-first Minimal Skin PoC; do not reroute Pi through them. |
| `packages/cli/`, `packages/cli-framework/`, `packages/mcp/`, `packages/sdk/`, `packages/host-client/` | CLI, MCP, SDK, and non-desktop host clients. | Ignore; they are not the Renderer-to-local-host path used by this PoC. |
| `packages/macos-process-metrics/`, `packages/port-scanner/` | Peripheral resource and port-detection helpers. | Ignore unless the corresponding existing desktop widget becomes an explicit AA requirement. |

## AA Change Boundary

### GREEN — safe/frequent AA modification

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx`
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/` presentation components
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/TopBar/` presentation components
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx` presentation/composition only
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/` presentation components
- `apps/desktop/src/renderer/components/AgentSelect/AgentSelect.tsx` presentation only
- `apps/desktop/src/renderer/globals.css` additive AA tokens and shell styles, excluding xterm sizing/behavior rules
- New AA-only Renderer components colocated under the V2 dashboard/workspace UI

### YELLOW — modify only when required

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx`
- Other `apps/desktop/src/renderer/**/hooks/`, `stores/`, and `providers/`
- `apps/desktop/src/renderer/stores/theme/` and `apps/desktop/src/shared/themes/`
- `packages/ui/src/` because it is shared beyond desktop
- `packages/panes/src/react/` when a renderer-level composition cannot express a required generic visual change
- `packages/panes/src/core/` only for a separately verified layout-engine bug, never for skinning

### RED — infrastructure; avoid modification

- `apps/desktop/src/main/`
- `apps/desktop/src/renderer/lib/agent-session-orchestrator/`
- `apps/desktop/src/renderer/lib/terminal/` and V2 `TerminalPane.tsx` transport/xterm behavior
- `packages/shared/src/builtin-terminal-agents.ts`, `host-agent-presets.ts`, `agent-models.ts`, and agent launch contracts
- `packages/host-service/src/` runtime, routers, DB, Git, filesystem, terminal, daemon, and terminal-agent lifecycle code
- `packages/pty-daemon/src/`
- `packages/workspace-client/src/` and `packages/workspace-fs/src/`
- `packages/local-db/src/` and `packages/db/src/` schemas/persistence

### GRAY — unrelated; ignore

- `apps/{admin,api,discord-triage,docs,electric-proxy,marketing,mobile,relay,relay2,streams,web}/`
- `packages/{auth,chat,chat-legacy,chat-runtime,cli,cli-framework,email,host-client,macos-process-metrics,mcp,port-scanner,sdk,session-protocol,trpc}/`

For Phase 1, begin in GREEN. Cross into YELLOW only for a concrete visual
requirement, and treat any RED change as evidence that the task has escaped the
AA Minimal Skin PoC boundary.
