# AA Office — User Guide (v0.1 RC + v0.2 foundation)

> **Current branch note:** this guide now describes the `aa-spike` v0.2
> foundation after Phase 4A. The accepted AA Office v0.1 RC runtime, New Task,
> Active Tasks, Archive, Git, terminal, and exact-resume contracts remain
> frozen underneath the new Pi-first Employee and global application shell.

## 1. What this build is

AA Office v0.1 RC is a Pi-first, macOS-first Agent Workstation built on the existing Superset desktop/runtime foundation.

RC status:

- Verdict: `AA OFFICE V0.1 RC READY WITH ACCEPTED DEBT`
- RC closeout commit: `e34b5f07afffb795d08abba75ccb1b61ef4c6812`
- Runnable RC implementation commit: `04c2fb53b78455f696f8be7f81108ab3c06b691d`
- Development branch: `aa-spike`
- Current presentation foundation: Phase 4A, Pi-first Employee + global AA
  shell (baseline `f0b7a1018c148f670de05d58cdddd3a9310ba196`)

The primary product flow is:

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

Pi is the only fully activated Tier 1 daily runtime in this RC. Grok Build remains a Tier 1 target but is authentication-gated until a later authenticated activation pass. Codex, Claude, Superset CLI and other terminal CLIs remain compatibility employees and may appear as `UNTRACKED`.

## 2. Do I need to package the app?

No, not for normal personal use of the current RC.

The RC has been validated as the local Superset desktop development application. The simplest daily path is to keep the repository checked out at the RC branch/commit and start the desktop stack normally.

Packaging becomes useful when you specifically want one of these outcomes:

- a normal double-clickable macOS `.app`;
- a version that does not require the development services to be started from Terminal;
- distribution to another Mac/user;
- release signing/notarization and an installer/update path.

The repository has desktop build/release scripts, but Phase 3M did not establish a signed/notarized AA Office distribution as part of the RC contract. Treat packaging as a separate release-engineering task rather than a prerequisite for using AA Office now.

## 3. Recommended baseline discipline

For normal use, keep `aa-spike` as the active development branch but remember that the v0.1 RC baseline is the closeout commit:

```text
e34b5f07afffb795d08abba75ccb1b61ef4c6812
```

Before starting a future development phase, preserve this commit as the rollback/reference point. A Git tag such as `aa-office-v0.1-rc` is recommended when convenient.

If you want to test exactly the frozen RC rather than later changes, check out the exact RC commit in a detached worktree or dedicated branch instead of moving the main development checkout backward and forward.

## 4. Normal startup

From the repository root:

```bash
cd /Users/lianglei/Code/bluejob/superset
git switch aa-spike
git pull --ff-only origin aa-spike
bun run dev:desktop
```

The root `package.json` defines `dev:desktop` as the desktop development stack, including the API, Desktop, Electric proxy and Caddy dependencies used by Superset Desktop.

If dependencies are missing after a fresh clone or dependency update, install them first:

```bash
bun install --frozen-lockfile
```

For ordinary repeated startup on the same machine, do not reinstall dependencies every time.

### Stop the application

Stop the development command from the Terminal that launched it, normally with:

```text
Ctrl+C
```

Then allow the app/services to exit cleanly. Do not manually kill Pi/PTY processes unless the normal shutdown path is genuinely stuck.

## 5. The main mental model

### Briefcase

A Briefcase is the project/repository context.

Think:

> “Which project am I working on?”

### NEW TASK

`NEW TASK` is the normal daily entry point.

Think:

> “What do I want Pi to work on now?”

For the standard path:

1. Open the Briefcase.
2. Click `NEW TASK`.
3. Enter a short, explicit task title.
4. Press Enter / Start Work.
5. AA creates a separate real Work Folder/worktree, starts one new real Pi conversation, waits for authoritative Pi runtime identity and focuses the real Pi TUI.

You normally do not need to choose a Workspace, worktree or employee manually.

### Work Folder

A Work Folder is the real Superset Workspace/worktree used for one work location.

It is infrastructure underneath the task. `WORK FOLDERS` remains available when you need the lower-level workspace view or when a Task cannot be projected safely.

### Task Folder

A Task Folder is the human-facing work label attached to the real working pane/workspace presentation.

It is not a separate task database record. The explicit title survives pane switching, renderer reload, full app restart where the underlying workspace persists, handoff and exact Pi resume.

### Employee

The Employee is the agent/CLI working in the Work Folder.

- Pi: primary Tier 1 daily employee.
- Grok Build: Tier 1 target, currently authentication-gated.
- Codex / Claude / Superset CLI / other CLIs: compatibility employees. They can be launched, but AA may truthfully show `UNTRACKED` because it does not claim their lifecycle authority.

In the current v0.2 foundation, Pi is always the first Employee tile. AA reads
that tile from the first ordered real Host agent configuration whose preset is
Pi; it does not depend on a user-created terminal preset and does not persist a
synthetic row. If that real configuration is missing, Pi remains first as
`SETUP REQUIRED` and opens the existing Agents setup page without launching a
fake terminal.

Activating available Pi in the Roster sends the current Task Folder to one new
Pi conversation in the same Work Folder. It preserves the explicit Task Folder
title, focuses the new real terminal, and waits for normal Runtime evidence.
An existing Pi-linked terminal preset remains editable in Settings but is
deduplicated from the visible Roster.

## 5.1 Global AA navigation

The compact AA rail is now stable across the daily first-level application
routes:

```text
HOME    Briefcase / Workspaces index
CASES   Briefcases; toggles the cabinet inside a Work Folder
FILES   current Work Folder files (disabled outside a Work Folder)
TASKS   existing Superset Tasks
AUTO    existing Automations
PRS     existing Pull Requests
SESS    terminal/session preset settings
AGENTS  agent setup and configuration
SET     general Settings
```

The selected state follows the current route. Settings and the mature Tasks,
Automations, Pull Requests, Home, and advanced Workspace pages retain their
existing data/actions inside the AA hard-edge outer frame. `FILES` intentionally
fails closed outside a real Work Folder and explains that a Work Folder must be
opened first.

## 6. Starting a new task

Use `NEW TASK` for new work.

Good task titles are short and concrete, for example:

```text
Fix restart status
Add CSV export
Review runtime adapter
Improve sidebar spacing
```

The task title becomes the initial Pi prompt and Task Folder title.

Important behavior:

- each New Task creates a new Pi conversation;
- it creates a separate Work Folder/worktree by default;
- it never silently reuses the most recent Pi session;
- it never silently falls back to another Workspace;
- `WORKING` appears only when authoritative Pi Runtime evidence says the turn is working;
- if provisioning partially fails, AA preserves real resources instead of aggressively deleting or replaying them.

Use `New Workspace · Advanced` only when you intentionally need Superset's lower-level workspace creation path.

## 7. Reading Active Tasks

The Briefcase projects current work using existing authoritative evidence.

### LIVE

A row is `LIVE` only when AA has an exact current runtime snapshot for that Work Folder/terminal.

Possible lifecycle labels include:

- `LIVE · STARTING`
- `LIVE · WORKING`
- `LIVE · IDLE`
- `LIVE · WAITING`
- `LIVE · ERROR`

Do not read `IDLE` as “task completed.” It only means the current runtime turn is settled/idle.

### SAVED / RESUMABLE

`SAVED / RESUMABLE` means Host has an exact Pi resume candidate for that terminal/session.

It does not mean the task is complete or recently active.

### UNTRACKED

`UNTRACKED` means AA knows a compatibility employee was explicitly launched but does not have Tier 1 authoritative lifecycle evidence for it.

This is expected for compatibility CLIs.

### CHANGED

`N CHANGED` comes from real Git staged/unstaged paths in that Work Folder.

It does not mean progress percentage, deliverable count or completion.

### Duplicate titles

If two tasks have the same visible title, AA adds a stable opaque discriminator such as:

```text
Fix login issue #685C
Fix login issue #82CE
```

Use that suffix only to distinguish rows. It is not a status or priority.

## 8. Working with Pi

The real Pi TUI/xterm is the central working surface.

Use Pi exactly as you would from Terminal. AA adds runtime-aware context around it without replacing the TUI.

The Worker/Employee presentation may show:

- real Pi runtime state;
- effective model;
- effective reasoning level;
- Reasoning Hair derived from that real reasoning value;
- session/resume health.

The text label is authoritative. Pixel character state and Reasoning Hair are visual language only and never replace explicit text.

## 9. Files, Changes, Diff and Review

Use the File Cabinet / existing Superset surfaces for real repository output:

- `Files`: browse the Work Folder filesystem.
- `Changes`: inspect real Git changes.
- `Diff`: inspect the selected change.
- `Review`: use the existing review/PR surface when real review data exists.

These always operate on the selected real Work Folder.

A task can be `IDLE` with changes, `WORKING` with zero changes, or have agent-owned metadata among changed files. Always inspect the actual files/diff when correctness matters.

## 10. Resume after closing or restarting AA Office

After a full app restart, a previous live Pi task should not remain falsely `LIVE` without fresh runtime evidence.

If AA has an exact saved candidate, the task appears as `SAVED / RESUMABLE` or as archived with `RESUMABLE` evidence.

To continue:

1. Open/select the Task/Work Folder.
2. Use `RESUME PI SESSION`.
3. AA launches the exact saved native Pi session.
4. AA waits for the resumed Pi bridge to confirm the same native session identity with a new runtime epoch.
5. The real Pi TUI becomes usable again with prior conversation context.

AA does not choose a recent session heuristically and does not silently substitute a new conversation if exact resume fails.

A normal clean Pi `/quit` is intentionally final and may leave the Work Folder with `PI SESSION UNAVAILABLE`. That does not delete files or the Work Folder.

## 11. Archive, Undo and Unarchive

Archive is an organization action only.

Use `ARCHIVE` when you want to remove a Work Folder from the current working set without destroying anything.

Archive does not:

- stop Pi;
- close the terminal;
- discard a resume candidate;
- delete or reset Git changes;
- remove the worktree;
- delete a branch;
- mark work `DONE`;
- claim completion.

Archived items appear under the collapsed `ARCHIVED` group and continue to show independent evidence such as:

```text
ARCHIVED
PI · RESUMABLE
3 CHANGED
```

or:

```text
ARCHIVED
PI SESSION UNAVAILABLE
0 CHANGED
```

Use `Undo` immediately after Archive or `UNARCHIVE` later. Unarchive returns the Work Folder to whichever evidence group is true at that moment.

## 12. Actions that are intentionally different

Do not confuse these operations:

### Archive

Reversible organization intent. Safe. Does not touch runtime or Git.

### Remove from Sidebar

Existing Superset infrastructure behavior. It hides the Workspace and can clear pane-layout presentation. It is not AA Archive.

### Close/kill terminal session

Ends the actual terminal process. Exact Pi resume may or may not be available afterward depending on the authoritative persistence rules.

### Delete Work Folder / cleanup

Destructive infrastructure operation. It uses Superset's existing cleanup safeguards, including dirty/unpushed checks. Treat this separately from Archive.

## 13. Compatibility employees

You can manually dispatch the current Work Folder to a compatibility employee from the Employee Roster.

Expected behavior:

```text
DISPATCHED TO <employee>
<employee> · UNTRACKED
```

The real terminal opens and the employee can work on the same Work Folder/files.

AA deliberately does not invent lifecycle/model/reasoning/resume truth for compatibility CLIs.

Use Pi when you want the complete AA Runtime-native experience.

## 14. Grok Build in v0.1 RC

Grok Build remains visible as a Tier 1 target but is not activated in this RC because the QA machine was not authenticated during the Grok activation phase.

Expected current presentation is authentication-gated / no live runtime.

Do not interpret this as a broken employee. Authenticated ACP/session/turn/tool/resume activation is intentionally deferred to a later dedicated phase.

## 15. Useful keyboard workflow

AA v0.1 includes compact keyboard paths for common daily operations. Current accepted shortcuts from the Pi-first workflow include:

```text
⌘⇧A   Focus/return to the recent active workstation
⌘⌥T   Open Task Folder context
⌘⌥R   Rename Task Folder
⌘⌥E   Open Employee Profile
```

Use Escape to dismiss transient AA surfaces where supported. Standard Tab/Enter keyboard navigation works through task rows, Archive/Unarchive and normal dialog controls.

If a shortcut conflicts with future Superset/macOS changes, the visible control remains the authoritative fallback.

## 16. Recommended daily routine

A simple daily loop:

```text
Morning
→ bun run dev:desktop
→ open Briefcase
→ inspect Active Tasks / Saved
→ Resume an existing Pi task or create NEW TASK

During work
→ use Pi TUI
→ inspect Files / Changes / Diff
→ switch tasks from Active Tasks
→ use compatibility Employee only when useful

When a work item leaves your current attention
→ ARCHIVE

When returning later
→ UNARCHIVE or select SAVED / RESUMABLE
→ exact RESUME PI SESSION

End of day
→ stop the desktop dev stack cleanly
```

You do not need to manually clean worktrees at the end of each day. Archive is the normal organization action; destructive Work Folder cleanup is a separate advanced decision.

## 17. Troubleshooting

### AA says `SAVED / RESUMABLE`

Normal after restart. Open the task and use exact Resume.

### AA says `PI SESSION UNAVAILABLE`

The Work Folder still exists, but AA has neither a live Pi runtime nor an exact resume candidate. Inspect files/changes and start a new task/conversation if more agent work is required.

### A compatibility employee says `UNTRACKED`

Expected. AA is refusing to fabricate Tier 1 lifecycle evidence.

### New Task fails during provisioning

Read the exact stage shown by AA. Existing Work Folder/terminal resources may have been preserved intentionally. Open the created Workspace if available. Do not repeatedly press Start Work in a way that could create duplicate resources.

### Terminal exists but AA remains connecting

AA is waiting for authoritative Pi runtime identity and open xterm evidence. Use `CHECK AGAIN` if shown. If identity cannot be confirmed, preserve the Work Folder and investigate rather than assuming readiness.

### After restart a task disappears from Active Tasks

Open `WORK FOLDERS`. AA intentionally omits a row when there is insufficient current live/resume/compatibility evidence. The underlying Workspace may still be intact.

### Too many Work Folders

Use Archive to keep the Active Tasks projection focused. Current v0.1 has been real-tested with roughly 10–20 Work Folders; larger Briefcases should be measured before assuming the same projection/query envelope.

## 18. Development and safety notes

For normal daily use, avoid modifying these foundational areas casually:

- PTY daemon;
- xterm transport/rendering;
- Git/worktree semantics;
- AA Runtime Contract;
- Pi bridge/session identity;
- Host schema/migrations;
- terminal-agent resume persistence.

The v0.1 RC exists precisely because these boundaries have been tested together. Future work should start from an explicit brief and preserve the RC checkpoint unless a verified blocker requires replacing part of the contract.

Reference documents:

- `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md`
- `docs/aa/AA-V0.1-TERMINOLOGY.md`
- `docs/aa/AA-V0.1-DEBT-REGISTER.md`
- `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- `docs/aa/PHASE-3M-AA-V0.1-PRODUCT-CONSOLIDATION-RC-REPORT.md`
- `docs/aa/AA-V0.2-SHELL-EMPLOYEE-CHECKPOINT.md`
- `docs/aa/PHASE-4A-PI-FIRST-EMPLOYEE-GLOBAL-SHELL-REPORT.md`

## 19. Packaging later

When personal use proves the RC is stable enough, packaging should be treated as a dedicated release step with its own acceptance criteria:

- production desktop build succeeds from the frozen RC baseline;
- app data/profile behavior is separated from the dev profile as intended;
- bundled Host/API/runtime services start correctly without the dev command;
- Pi launch/hook installation works in the packaged app;
- exact resume survives packaged-app restart;
- macOS signing/notarization behavior is understood;
- upgrade/rollback path is documented;
- disposable packaged-app dogfood passes before replacing the dev build for daily use.

Until that is verified, the development desktop launch remains the known-good AA Office v0.1 RC operating mode.
