# AA Phase 1 Report

## Status

Phase 1 — **AA Terminal Office Shell v0.1** is complete.

- Implementation commit: `8a9469f7754aec02bd8fe725b3adcae7f16d9806`
- Commit title: `feat(desktop): add AA terminal office shell`
- Target branch: `aa-spike`
- Platform verified: macOS
- Product scope verified: one project, one workspace, one active Pi terminal
- Runtime scope: presentation-layer changes only

The implementation establishes the first runnable AA Office shell on top of
the existing Superset V2 workspace. It preserves the existing terminal, Pi,
host-service, PTY, Git, worktree, filesystem, pane, and persistence
infrastructure.

## Delivered Surfaces

Phase 1 implements the six requested presentation surfaces:

1. A scoped AA window/workspace shell for V2 workspace routes.
2. A 52 px global navigation rail backed by existing Superset routes and
   sidebar state.
3. Real project and workspace identity represented as a briefcase and folder.
4. A compact Pi Pixel Worker driven by existing lifecycle bindings.
5. An AA workstation frame around the unchanged xterm/Pi terminal viewport.
6. A 28 px bottom status bar showing available workspace, Pi, branch,
   worktree, and changed-file information.

## Files and Components Added

All new production UI is local to:

`apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`

| Component/files | Responsibility |
| --- | --- |
| `AAAgentAvatar/AAAgentAvatar.tsx` and `index.ts` | Small inline pixel worker with state-specific poses. Uses SVG `shapeRendering="crispEdges"`; the worker remains secondary to the terminal. |
| `AAAgentStatus/AAAgentStatus.tsx` and `index.ts` | Provides the workspace-scoped Pi binding context and renders compact/full worker status. Selects only real Pi bindings from `useTerminalAgentBindings`. |
| `AAAgentStatus/aaAgentState.ts` | Maps existing lifecycle event names to the AA state vocabulary and selects the newest live Pi binding. |
| `AAAgentStatus/aaAgentState.test.ts` | Covers lifecycle mapping and newest-Pi-binding selection. |
| `AABottomStatusBar/AABottomStatusBar.tsx` and `index.ts` | Displays the real workspace name, Pi state, current branch, unique changed-file count when available, and main-checkout/worktree identity. |
| `AAIcon/AAIcon.tsx` and `index.ts` | Minimal inline pixel icon vocabulary for Home, Briefcase, Archive, Sessions, Agents, Settings, Folder, Terminal, and Changes. |
| `AANavigationRail/AANavigationRail.tsx` and `index.ts` | Connects the AA rail to existing workspace sidebar state, right-sidebar file state, and Superset routes. |
| `AAStatusLight/AAStatusLight.tsx` and `index.ts` | Reusable state light for agent and terminal status. |
| `AATerminalFrame/AATerminalFrame.tsx` and `index.ts` | Adds labels and status outside the terminal viewport while leaving `TerminalPane` and xterm unchanged. |
| `AAWindowFrame/AAWindowFrame.tsx` and `index.ts` | Provides the bounded workspace frame and bottom-status slot. |
| `AAWorkspaceHeader/AAWorkspaceHeader.tsx` and `index.ts` | Renders AA Office identity, real project name, real workspace name/type, and active Pi worker state. |
| `aa-office.css` | Scoped Phase 1 tokens, layout, component styling, pixel rendering, state animation, responsive rules, and reduced-motion behavior. |
| `index.ts` | Local exports for the AA presentation layer. |

The commit adds 22 AA Office files. It does not add a general-purpose design
system package or modify `packages/ui`.

## Existing Superset Surfaces Modified

| Existing file | Phase 1 change |
| --- | --- |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx` | Activates the AA shell only on valid V2 workspace routes, mounts the AA navigation rail, imports scoped AA styles, and suppresses the redundant collapsed Superset rail. Existing routing and macOS window structure remain in place. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/DashboardSidebar.tsx` | Adds an `aaOffice` presentation flag, applies the AA project-sidebar class, and hides unrelated organization/hiring/footer chrome only while AA mode is active. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarHeader/DashboardSidebarHeader.tsx` | Adjusts the macOS traffic-light inset for the 52 px rail and omits unrelated Workspaces, Automations, Tasks, and Pull Requests entries in AA mode. Existing project, workspace, search, and creation behavior is reused. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarExpandedWorkspaceRow/DashboardSidebarExpandedWorkspaceRow.tsx` | Exposes the existing active state as `data-active` for scoped AA styling. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx` | Adds the Pi status provider, reads the existing project name, mounts the AA window/header/status bar, and keeps the existing Workspace and Git-status providers. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/hooks/usePaneRegistry/usePaneRegistry.tsx` | Wraps the existing `TerminalPane` in `AATerminalFrame`; terminal creation, focus, transport, persistence, and pane actions are unchanged. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx` | Adds one scoped styling hook for the existing preset controls. |
| `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/WorkspaceSidebar/WorkspaceSidebar.tsx` | Adds one scoped styling hook for the existing Files/Changes sidebar. |

No files in the host service, PTY daemon, Git/worktree implementation, Pi
integration, shared agent definitions, local database schemas, or global UI
library were changed.

## Runtime Behaviors Verified

The implementation was exercised in the running macOS Electron development
application against the real Phase 0 fixture project and workspace.

| Behavior | Result |
| --- | --- |
| V2 workspace shell | The AA shell rendered at the real Electron viewport without document overflow. macOS traffic-light space remained usable. |
| Real identity | The header displayed project `aa-baseline-fixture` and workspace `pi-baseline` from existing project/workspace data. |
| Project navigation | The Projects/Briefcases rail button collapsed and reopened the existing project sidebar. Workspace content resized with it. |
| Files and Changes | The existing Changes panel displayed its real empty state; the AA Files/Archive button switched the existing right sidebar to Files and its selected state followed the real active tab. |
| Existing routes | Home, Sessions, Agents, and Settings navigated to `/v2-workspaces`, `/settings/terminal`, `/settings/agents`, and `/settings/account`. Navigation back to the workspace remained functional. |
| Pi availability | The live Pi terminal binding was detected through the existing Renderer hook. An `Attached` lifecycle event rendered as `IDLE`. |
| Terminal rendering | The existing Pi TUI remained visible inside the AA frame. No terminal text overlay, shader, scanline, blur, or new renderer was introduced. |
| Terminal focus | Clicking the terminal focused the existing `xterm-helper-textarea`; keyboard input ownership remained with xterm. |
| Terminal resize | The terminal and adjacent panes resized correctly when the project sidebar changed state. |
| Pane behavior | Existing Terminal, Diff, Changes, and Files surfaces remained mounted and usable. No pane registration semantics were replaced. |
| Git status | The bottom bar consumed the existing `WorkspaceGitStatusProvider`, displayed the real branch/worktree kind, and counted unique staged/unstaged paths without adding polling. |
| Practical session continuity | After route round-trips, the existing xterm session and screen remained present. This verifies Renderer-level terminal continuity, not Pi conversation resume after a full application restart. |
| Compact layout | A 1440 × 800 viewport-metrics pass showed all required regions present with no document overflow. This was a layout-fit fallback, not a native Electron window/compositor resize test. |

Automated checks completed for the implementation commit:

```sh
bun test apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/aaAgentState.test.ts
bun run --cwd apps/desktop typecheck
./scripts/lint.sh <Phase-1-renderer-files>
git diff --check
```

Results:

- lifecycle tests: 9 passed, 0 failed
- Desktop TypeScript typecheck: passed
- scoped Biome lint: 30 files checked, no diagnostics
- whitespace/error-marker check: passed

The repository-wide `bun run lint` still reports formatter diagnostics for the
pre-existing source assets `docs/aa/design/assets-manifest.json` and
`docs/aa/design/tokens.json`. Phase 1 did not change those files.

## Pi Lifecycle Mapping

`AAAgentStatusProvider` consumes `useTerminalAgentBindings(workspaceId)`, keeps
the newest binding whose `agentId` is `pi`, and maps only the binding's real
`lastEventType`.

| Superset lifecycle input | AA state | Presentation |
| --- | --- | --- |
| no Pi binding or `Detached` | `OFFLINE` | Static worker/offline light |
| `Attached`, `Stop`, or another observed but unmapped event | `IDLE` | Static worker/success light |
| `Thinking`, `UserPromptSubmit`, or `BeforeAgent` | `THINKING` | Small thinking pose/movement and amber light |
| `Start`, `PostToolUse`, or `PostToolUseFailure` | `WORKING` | Minimal typing loop and amber light |
| `PermissionRequest` or `PendingQuestion` | `WAITING` | Static waiting pose and attention light |
| `Failed` | `ERROR` | Static error pose and error light |

This table describes the presentation mapper, not a claim that Pi currently
emits every listed event. The current Pi extension exposes a deliberately
coarse lifecycle, reliably including session attachment, work start/end, tool
completion refreshes, and detachment. It does not currently provide structured
permissions, structured failures, tool details, or a dedicated reasoning
stream. Therefore `THINKING`, `WAITING`, and `ERROR` appear only if the existing
runtime supplies their corresponding real events; the AA UI does not synthesize
them.

## Visual Implementation Decisions

- AA styling is scoped under `.aa-office-shell` and activates only for the V2
  workspace, avoiding a global Superset redesign.
- The shell uses the documented warm-grey canvas, raised/inset surfaces,
  charcoal outlines, deep-navy selected state, amber activity state, and hard
  two-dimensional shadows.
- Navigation is fixed at 52 px, the identity header is 52 px, and the bottom
  status bar is 28 px to preserve compact desktop density.
- Corners are square or at most 2 px. The implementation uses no gradients,
  glass effects, blur, or oversized cards.
- Pixel icons and the worker are compact inline SVGs with crisp-edge rendering;
  `image-rendering: pixelated` is scoped to appropriate AA artwork.
- Worker motion is limited to small CSS frame changes for thinking/working and
  a status-light pulse. `prefers-reduced-motion` disables AA animation.
- Labels and status lights sit outside the terminal viewport. The xterm DOM,
  renderer, parser, theme, WebSocket transport, focus behavior, and persistence
  are not modified.
- Existing Files, Changes, Diff, Browser, terminal presets, pane tabs, and
  navigation actions are visually integrated through narrow class hooks rather
  than copied or rewritten.
- All displayed product identity and runtime status are derived from existing
  data. No fake progress, workload, tool details, or simulated office activity
  is shown.

## Known Limitations

1. **Pi state is coarse.** The current Pi hook path does not expose a continuous
   thinking stream, structured approval state, failure detail, or tool
   metadata. Several safe mapper states may therefore be rarely or never
   reached with today's Pi extension.
2. **Pi conversation resume is unavailable.** Superset preserves/reconnects the
   terminal, but the Pi extension does not provide a Pi conversation session
   ID. A full Electron quit/restart starts a fresh Pi conversation.
3. **Terminal output remains TUI-only.** AA receives raw PTY output, not
   structured chat messages or structured tool progress.
4. **Navigation destinations remain Superset surfaces.** Home and Settings
   routes intentionally leave the AA workspace shell; those screens were not
   redesigned in Phase 1.
5. **Single-worker visual model.** The header selects the newest active Pi
   binding. Multiple workers, multiple simultaneous Pi sessions, and worker
   selection are not represented.
6. **Minimal asset vocabulary.** Phase 1 uses a deliberately small inline icon
   and avatar set rather than a production sprite sheet or broad pixel-art
   library.
7. **macOS-first verification.** Other operating systems and a full matrix of
   native compact-window sizes were not validated.
8. **Project-name fallback is minimal.** If the existing project query is
   unavailable, the briefcase identity renders an em dash instead of inferred
   or fabricated data.
9. **Changed-file count is availability-based.** It is shown only when the
   existing Git-status query has data; no extra polling was added.

## Items Intentionally Deferred

- Phase 2 product-shell expansion or redesign of non-workspace routes
- richer worker sprites, larger animation systems, and decorative office scenes
- project briefcase state variants and task-folder/session metaphors
- multi-project, multi-workspace, or multi-agent orchestration UI
- a new Pi adapter or changes to the existing Pi extension/hooks
- native structured Pi chat, tool progress, approval controls, or message model
- Pi conversation-ID capture and full application-restart resume
- a new Pi model picker or a new reasoning-control integration
- PTY daemon, terminal runtime, host-service lifecycle, Git/worktree,
  filesystem, persistence, or data-model changes
- refactoring AA components into the global `packages/ui` library
- large production asset generation or replacement of existing Superset icons

## Recommended Phase 1.1 Visual Refinements

These are presentation-only follow-ups. They do not require Phase 2 or runtime
architecture changes.

1. Validate and tune density at native 1280 × 800, 1440 × 900, and Retina
   scaling rather than relying on viewport-metrics simulation for compact
   sizes.
2. Refine truncation and responsive priority in the workspace header and
   bottom bar so long project, workspace, and branch names remain readable.
3. Tighten the terminal frame's label height and padding after real daily use
   to maximize xterm rows without losing the workstation identity.
4. Audit keyboard focus visibility, hover/pressed contrast, tooltip timing,
   and screen-reader labels across the AA rail and existing sidebar controls.
5. Test each worker pose against captured real lifecycle sequences and tune
   transition timing without inventing intermediate state.
6. Review icon legibility at 1× and 2× scale, then promote only the approved
   minimal set into production assets if inline SVG maintenance becomes
   awkward.
7. Decide explicitly whether AA Office should have one fixed office palette or
   a separately designed dark variant; do not inherit an accidental hybrid
   from global theme changes.
8. Add focused visual regression coverage for expanded/collapsed project
   sidebar, Files/Changes selection, Pi offline/idle/working, long names, and
   reduced-motion mode.
9. Revisit the relative prominence of presets, pane tabs, terminal header, and
   status bar after a longer real Pi session, keeping the terminal as the
   dominant working surface.

## Phase Boundary

Phase 1 is complete at commit
`8a9469f7754aec02bd8fe725b3adcae7f16d9806`. The recommendations above are a
bounded visual-polish queue only. No Phase 2 work is included in this report.
