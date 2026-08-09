# AA Office v0.1 Checkpoint

## Product Statement

A real terminal-agent workstation inside a compact pixel office.

AA Office v0.1 is a macOS-first, Pi-first GUI layer over Superset's mature
local runtime. The interface presents projects, workspaces, terminal agents,
files, changes, and lifecycle state through a compact late-1990s office-system
language without replacing the real terminal or inventing work data.

## Stable Scope

- macOS first and Pi first
- real xterm and Pi TUI as the primary working surface
- Briefcase Cabinet for real projects and Work Folders for real workspaces
- Employee Roster over existing terminal presets and launch actions
- active Worker Card for the active pane
- pane-level Task Folder over existing title, lifecycle, and changed-file data
- truthful manual `HANDING` / `DISPATCHED` / binding-confirmed `ASSIGNED`
  language
- File Cabinet over existing Files, Changes, Review, and diff behavior
- existing Git/worktree integration and saved pane layouts
- AA lifecycle visuals, compact responsive hierarchy, and reduced motion

This checkpoint does not include native chat, generic agent orchestration, a
task database, or a replacement runtime.

## Architecture Boundary

### Stable AA presentation layer

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`
  owns AA components, visual state mappings, and local styling.
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/`
  supplies narrowly scoped workspace composition, pane metadata, and the
  existing Employee Roster launch surface.
- Existing Renderer stores may retain presentation metadata only when already
  supported by pane-layout persistence. They do not become runtime authority.

These GREEN surfaces may evolve visually while preserving explicit text,
keyboard behavior, and the truthfulness rules below.

### Superset infrastructure intentionally reused

- V2 workspace routing and `@superset/panes` tab/split layout
- real xterm rendering, terminal focus, PTY/session persistence, terminal
  reattachment, and generic resume facilities
- terminal-agent preset execution and launch adapters
- Pi extension hooks, lifecycle events, and terminal-agent bindings
- Host Service lifecycle, process ownership, filesystem services, and local
  persistence
- Git/worktree status and behavior
- Files, Changes, Review, and diff implementations

Host Service, PTY, Pi hooks, Git/worktree, database schema, runtime adapters,
and pane-store mechanics remain RED: do not modify them for presentation
work. Refer to `docs/aa/CODEBASE-MAP.md` before expanding repository scope.

## Truthfulness Rules

1. `HANDING TO` means the existing launch promise is pending.
2. `DISPATCHED TO` means the existing launch path returned success. It does
   not prove a durable assignment or live lifecycle binding.
3. `ASSIGNED TO` is reserved for a binding-confirmed terminal agent.
4. `UNTRACKED` means a real launch identity is known but no authoritative
   lifecycle binding exists for that terminal.
5. `UNASSIGNED` means no worker identity is known; never infer one from edited
   task text or terminal history.
6. The Worker Card is authoritative for current active-pane state.
7. Task Folder uses `STATUS` for current work, `LAST TURN` for the latest
   completed Pi turn, `SESSION` for an ended event, and `LAST EVENT` for an
   error event. `LAST TURN / COMPLETE` is not durable task completion.
8. Changed-file counts, workspace names, employee names, and lifecycle values
   must come from existing state. No fake progress, workload, or productivity
   metric is allowed.
9. Reasoning Hair remains unavailable in the active workspace until the
   active Pi session exposes an authoritative reasoning value. A launch
   preference is not the effective session value.

## Known Limitations

- There is no generic lifecycle binding for every terminal agent. Known
  non-Pi employees remain `UNTRACKED`.
- There is no authoritative active-session reasoning value readable by the
  Renderer.
- Pi does not currently report a conversation session ID through its hook, so
  Renderer reload/reattach is practical but a full app restart cannot resume
  the same Pi conversation authoritatively.
- Task Folder is pane-level presentation, not a task database or work history.
- Dispatch receipt is ephemeral and is not an ownership record.
- Older panes may lack launch identity and fall back to local/unassigned.
- A selected historical session can lose stale launch metadata when no real
  binding confirms it.
- Ended Pi bindings may disappear before a `SESSION / ENDED` presentation is
  visible.
- Saved user pane layouts remain preserved, including existing split panes.
- The active workspace still depends on Superset's existing terminal/TUI for
  conversation content, approvals, model controls, and tool detail.

## Recommended Future Options

These are choices for a later approved phase, not v0.1 capabilities:

1. Define a generic runtime contract for terminal-agent identity and
   lifecycle so non-Pi workers can become authoritatively tracked.
2. Define an authoritative Pi active-session reasoning contract before
   mounting a live Reasoning Hair selector or indicator.
3. Explore native structured chat only after proving it can coexist with the
   real terminal and preserve current runtime behavior.
4. Explore multi-agent handoff only after agent identity and task contracts
   are stable; do not infer orchestration from preset launch receipts.

## Fresh-Session Read Order

1. `docs/aa/SPIKE.md`
2. `docs/aa/IMPLEMENTATION-PLAN.md`
3. `docs/aa/BASELINE.md`
4. `docs/aa/CODEBASE-MAP.md`
5. `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
6. `docs/aa/PHASE-1-REPORT.md`
7. `docs/aa/PHASE-1.1-REPORT.md`
8. `docs/aa/PHASE-1.2-REPORT.md`
9. `docs/aa/PHASE-2-REPORT.md`
10. `docs/aa/PHASE-2.1-REPORT.md`
11. `docs/aa/PHASE-2.2-REPORT.md`
12. `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`

AA Office v0.1 is the stable checkpoint. Do not treat the future options as
implemented, and do not begin Phase 3 without a separate approved brief.
