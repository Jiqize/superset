# AA Office v0.1 RC checkpoint

## Verdict

**AA OFFICE V0.1 RC READY WITH ACCEPTED DEBT**

Baseline: `b97abf97b867d2a9c107bb79e3dc8949b85ff004`.

This checkpoint closes Phase 3M. It is the product/runtime baseline that a
future phase must preserve unless a new brief explicitly replaces part of the
contract.

## Product contract

```text
Briefcase
→ NEW TASK
→ Active Tasks
→ Saved / Resumable
→ Untracked
→ Archived
→ Work Folders
→ Task Folder
→ Employee
→ Runtime
→ Output
```

- macOS, Pi first, one real terminal per New Task, real xterm/TUI as the visual
  and interaction anchor.
- `NEW TASK` creates one existing Superset Workspace/worktree, one terminal
  pane, and launches the real builtin Pi preset with the normalized explicit
  title as its prompt.
- `New Workspace · Advanced` and Work Folders remain available as secondary
  mature Superset paths.
- Active Tasks is a derived read model. There is no AA task table, scheduler,
  completion model, history, or orchestration layer.
- The canonical copy and meanings are defined by
  `docs/aa/AA-V0.1-TERMINOLOGY.md`.

## Runtime truth contract

- Tier 1 lifecycle, identity, model, reasoning, capabilities, and resume facts
  come from `AA-RUNTIME-CONTRACT-V0.1.md` and exact Host evidence.
- Pi is the only activated Tier 1 daily runtime in this checkpoint.
- Grok Build remains a truthful authentication-gated Tier 1 target; activation
  is deferred.
- Codex, Claude, Superset CLI, and other terminal CLIs remain compatibility
  employees. An explicit launch may be `UNTRACKED`; it never inherits Pi
  authority.
- Terminal/TUI output is not parsed into structured lifecycle, progress, or
  task truth.
- Identity matching remains exact on Workspace, terminal, runtime/agent, and
  native session where required. Ambiguous evidence fails closed.

## Lifecycle and resume contract

- `LIVE` requires an exact current authoritative runtime snapshot.
- `SAVED / RESUMABLE` requires the Host's exact terminal resume candidate. An
  offline snapshot alone must not promote work to Saved.
- A real Pi resume preserves the native session identity and creates a fresh
  runtime epoch.
- A clean Pi `quit` emits authoritative `session.ended` with reason `pi_quit`.
  It remains unavailable after restart and must not become Saved.
- Pi replacement (`reload`, `new`, `resume`, `fork`) remains offline/resumable.
- Existing death-gasp semantics remain authoritative for signal, PTY, daemon,
  and unexpected terminal loss. Phase 3M did not alter PTY or persistence.

## Work and organization contract

- Work Folder is the AA daily name for the existing Workspace/worktree work
  location; Main Folder is the primary repository.
- Task Folder is presentation derived from existing pane metadata, runtime,
  and Git state. It is not a persistent task entity.
- `activeTasksArchived` is a durable boolean organization intent only.
  Archive/Undo/Unarchive do not stop, resume, delete, clean, or mutate runtime,
  Git, terminal, or Work Folder identity.
- A selected archived Task Folder remains visibly current and its Archived
  disclosure stays open.
- Duplicate visible titles retain deterministic opaque discriminators and full
  accessible names.
- Files, Changes, Diff, Review, changed counts, Output, and Delivery always use
  real Work Folder-scoped services and data.

## Presentation contract

- AA Office stays visually dominant while mature Superset infrastructure stays
  intact underneath.
- The central real terminal remains larger and visually stronger than Task
  Folder, Worker, reasoning, roster, runtime, and File Cabinet chrome.
- Lifecycle character state and Reasoning Hair never replace explicit text.
- Reduced motion disables repeating AA/Tailwind status animation.
- At 1440×800, the shell has no document-level overflow, xterm remains usable,
  and Files/Changes/Review remain reachable.

## Verified RC envelope

- Isolated disposable real Git Briefcase with 11 Work Folders.
- Production New Task path, two concurrent Pi tasks, two real changed-file
  tasks, duplicate titles, Tier 2 `UNTRACKED`, archive/Undo/unarchive, Files /
  Changes / Diff / Review, and Work Folder fallback.
- Three full Electron/Host restart cycles, Renderer reload, exact archived Pi
  resume, resumed follow-up, and clean-end durability.
- Exact archived resume preserved native fingerprint `e268f16dd29f`, changed
  epoch `03720f0727c6` → `c41535471c0c`, and retained Archived intent.
- Real 1440×800 and 1920×976 interaction; 11-folder performance remained below
  the Phase 3K batching gate.
- AA-focused regressions: 234 passed. Full Host Service: 1,083 passed, 14
  opt-in real-ACP skips, 8 existing todos, 0 failures.

## Change boundary

- Normal future presentation work stays inside the CODEBASE-MAP GREEN areas.
- Phase 3M's only frozen-boundary exception was the documented clean-quit Pi
  bridge blocker. No Host schema/migration, PTY daemon, xterm transport, Git /
  worktree semantics, resume persistence, or task data model changed.
- Do not reopen runtime or architecture work from this checkpoint without a
  verified blocker and an explicit brief.

## Evidence and debt

- Safe evidence: `docs/aa/release-candidate/v0.1/`
- Accepted/deferred work: `docs/aa/AA-V0.1-DEBT-REGISTER.md`
- Phase report: `docs/aa/PHASE-3M-AA-V0.1-PRODUCT-CONSOLIDATION-RC-REPORT.md`
