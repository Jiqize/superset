# AA Superset Adaptation Spike

## Goal

Validate whether Superset can serve as the runtime and desktop foundation for an Agent Arsenal themed coding-agent workstation, with the majority of product work concentrated in the Renderer and presentation layer.

## Product Direction

Phase 1 is intentionally narrow:

- macOS first
- Pi first
- one project
- one workspace
- one active agent session
- retain Pi TUI initially
- preserve a future Runtime Adapter boundary
- focus product differentiation on the AA visual and interaction system

## Why Superset

Superset already provides the expensive infrastructure we do not want to rebuild:

- Electron desktop shell
- project and workspace model
- Git worktree lifecycle
- persistent PTY infrastructure
- terminal rendering
- agent catalog
- Pi integration
- agent lifecycle hooks
- session resume support
- pane system
- file navigation
- Git status and diff views
- browser and preview panes
- local persistence

## Relevant Source Areas

### Renderer

`apps/desktop/src/renderer/`

Primary workspace route:

`apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/`

This is the main area for the AA shell and visual language.

### Agent session orchestration

`apps/desktop/src/renderer/lib/agent-session-orchestrator/`

Current adapters include terminal and chat launch paths. This is the natural future boundary for runtime-specific integrations.

### Builtin terminal agents

`packages/shared/src/builtin-terminal-agents.ts`

Pi, Codex, Grok, Claude, Gemini, OpenCode and other terminal agents are registered here.

### Pi lifecycle integration

`apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts`

`apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts`

Superset installs a Pi extension that translates Pi lifecycle events into Superset agent status events.

### Host service

`packages/host-service/`

Includes terminal-agent bindings, lifecycle state, session resume, filesystem and daemon coordination.

### PTY daemon

`packages/pty-daemon/`

Treat this as infrastructure. Phase 1 should not modify it.

## Product Representation Mapping

| Superset concept | AA presentation |
| --- | --- |
| Project | Briefcase |
| Workspace | Folder / desk |
| Worktree | Folder copy / branch folder |
| Terminal agent | Pixel worker |
| Agent type | Worker identity |
| Agent status | Worker animation |
| Reasoning level | Hair density / hairstyle state |
| Tool use | Office prop / work action |
| Diff | Changed document |
| Approval | Document awaiting signature |
| Session | Work file / active assignment |

## Critical Finding

Pi is currently integrated primarily as a terminal agent. The reliable execution path is:

`AgentLaunchRequest -> terminal adapter -> PTY -> pi -> xterm`

Superset already captures Pi lifecycle status, but the current Pi path does not automatically provide a full structured native chat transcript, GUI model selector, GUI reasoning selector or structured approval cards.

This leads to two possible product stages.

### Stage A: Pixel Terminal Shell

Keep Pi TUI inside the workspace and rebuild the surrounding GUI.

Expected scope:

- project briefcase UI
- workspace folder UI
- pixel worker identity
- real lifecycle animations
- changed files and diff presentation
- AA navigation and shell

This is the preferred first implementation.

### Stage B: Native Pi GUI

Later, add a Pi-specific structured adapter and replace the central TUI with a native transcript.

Do not begin Stage B until Stage A proves the product language is useful.

## Do Not Touch in Phase 1

- PTY daemon internals
- terminal persistence
- Git/worktree backend
- host-service lifecycle primitives
- Pi hook installation
- session-resume logic
- low-level xterm integration

## Success Criteria for the Spike

Superset is accepted as the AA base if all of the following are true:

1. Desktop app runs reliably on the target macOS development machine.
2. A local project can create/open a workspace.
3. Pi launches successfully through the existing terminal-agent path.
4. Agent lifecycle state changes can be observed.
5. A Pi session can be resumed after terminal/app restart where supported.
6. Renderer shell can be substantially reskinned without modifying PTY, Git or host-service internals.
7. The AA visual system can be introduced incrementally instead of through a large rewrite.

## Decision

Proceed with a minimal fork-based PoC on branch `aa-spike`.
