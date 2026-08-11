# AA New Task Flow v0.1 Checkpoint

## Status

Phase 3H is complete on baseline
`d57858aff388a7742e9653674425996ced37362a`. The exact runnable
implementation/evidence revision is `1e79ad59581196233ff3c2a6081683d7171d7763`; this
checkpoint and the Phase 3H report are the documentation closeout immediately
after it.

## Accepted product flow

```text
Real Briefcase
→ project-local NEW TASK
→ normalized task title
→ one independent Git work folder
→ one new real Pi terminal conversation
→ authoritative Pi identity + open xterm
→ focused Pi TUI
→ real Files / Changes / Diff / Review output
→ exact resume
```

The normal path is two user interaction groups: invoke `NEW TASK`, then type a
title and press Enter. Automatic provisioning does not bypass safety or runtime
truth.

## Accepted contracts

- The existing Task Folder title normalizer defines whitespace, Unicode, and
  48-codepoint behavior.
- The normalized title is the exact initial Pi prompt.
- One per-submission Workspace UUID creates a bounded, sanitized, collision-
  safe branch input.
- The first ordered real Host config with `presetId === "pi"` is the only v0.1
  default employee.
- New Work Folder is the only v0.1 work location.
- One existing `workspaces.create` call owns worktree creation and one Pi
  launch; no Renderer-side transaction or retry exists.
- Task Folder presentation is written only to the intended successful real Pi
  pane and survives hydration, reload, restart, and exact resume.
- Ready requires a matching authoritative Pi snapshot with native identity and
  available session-identity capability, an open xterm, and matching persisted
  pane title.
- `WORKING` remains exclusively runtime-owned after `turn.started`; it is not
  a provisioning stage.
- Dismiss is not cancel, and ambiguous failures preserve resources.

## Accepted recovery boundary

Validation and Pi configuration fail before resource creation. Workspace,
navigation, Pi launch, runtime confirmation, and focus failures expose their
exact boundary and preserve any real resource already returned. Runtime
confirmation supports a non-launching `CHECK AGAIN`; no automatic replay,
second Pi, silent Current Workspace fallback, or destructive rollback exists.

## Persistence boundary

New Task flow/progress/errors are ephemeral Renderer presentation. Durable
truth remains the existing Workspace/worktree, pane layout, terminal binding,
Task Folder title, and Pi resume candidate. No Task entity, database schema,
transcript store, or inferred Active Tasks index was added.

## Real acceptance checkpoint

- Real Pi received the exact normalized ASCII and Unicode titles as initial
  prompts.
- Pi created harmless files; real `WORKING → IDLE`, Files, Changes, and Diff
  were verified.
- Same-title submissions created two distinct branch/worktree identities.
- Renderer reload and full Electron/Host restart preserved workspace and title.
- Exact resume retained native identity, minted a new epoch, and restored xterm
  focus for both retained acceptance samples.
- Existing New Workspace remained available.
- Tier 2 Superset CLI remained `DISPATCHED + UNTRACKED`.
- Grok remained authentication-gated with `NO LIVE RUNTIME`.
- 1440×800, 1920×976, keyboard, IME-safe Enter, focus restoration,
  accessibility announcements, and reduced motion passed.

## Verification checkpoint

- Pre-edit baseline: 129 passed.
- New Task/AA/pane/workspace-create/sidebar: 165 passed.
- Hotkey and terminal-focus regressions: 17 passed.
- Runtime Contract/Host/Grok/Pi/resume regressions: 50 passed.
- Shared, Workspace Client, Session Protocol, Host Service, and Desktop
  TypeScript: passed.
- Targeted Biome, `git diff --check`, RED-area scan, and sensitive-evidence
  scan: passed.
- Full lint retained only the two unchanged AA design JSON formatting failures.

## Change boundary

Phase 3H changes only AAOffice presentation/coordination and narrow existing
Renderer sidebar, Workspace-create result/layout, V2 gate, and exact-resume
title integrations. It does not modify Host Service behavior, PTY daemon,
Desktop main runtime, xterm transport, Git/worktree semantics, filesystem
services, database schema, Runtime Contract semantics, Pi/Grok bridges, or Tier
2 lifecycle behavior.

## Deferred

- Current Workspace as a New Task target;
- Briefcase Active Tasks projection;
- duplicate-safe `START PI` recovery after partial launch failure;
- persisted progress/error state;
- task completion, priority, due date, tags, archive/cleanup;
- native chat, transcript/history, model/reasoning writes, permissions,
  cancellation, orchestration, and agent-to-agent messaging;
- Grok activation and Tier 2 runtime tracking.

## Evidence

Safe screenshots and sanitized runtime fingerprints are in
`new-task-flow/v0.1-implementation/`. Raw runtime and worktree identifiers are
not retained.

## Stop condition

Stop here. Review the production New Task flow before authoring or starting
another phase.
