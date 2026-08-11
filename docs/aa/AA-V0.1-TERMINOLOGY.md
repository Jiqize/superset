# AA v0.1 terminology

## Purpose

This is the canonical user-facing vocabulary for the AA Office v0.1 daily
path. Internal Superset type, API, and database names remain unchanged. An
advanced or diagnostic surface may expose those internal names when they are
needed to explain real system state.

## Canonical vocabulary

| AA term | User-facing meaning | Existing Superset source | Copy rule |
| --- | --- | --- | --- |
| **Briefcase** | One real local Git project and the Work Folders that belong to it. | Project | Use `Briefcase` in the AA daily path. Keep `Project` for advanced setup and technical diagnostics. |
| **New Task** | The Pi-first production action that creates one isolated Work Folder, opens one terminal pane, and launches the task title as the real Pi prompt. | Workspace creation + terminal-agent launch | Write `NEW TASK`. It is not a generic workspace creator and does not create a task database row. |
| **Active Tasks** | A read-only projection of real current evidence: live Tier 1 runtime, exact resumability, explicit Tier 2 launch, plus durable archived intent. | Workspace local pane state + Runtime Contract + resume candidate + archive field + Git status | Never imply a task table, queue, history, completion, or scheduler. |
| **Saved / Resumable** | Pi is not live and the Host has an exact, identity-bound resume candidate for that terminal. | Terminal-agent resume candidate | `Saved` never means a transcript export or generic persistence. Do not show this state from an offline snapshot alone. |
| **Untracked** | An explicit compatibility employee was dispatched, but AA has no Tier 1 structured lifecycle authority for it. | Terminal launch identity | Use `UNTRACKED`; do not infer offline, idle, working, or resume capability. |
| **Archived** | Durable user organization intent that removes a row from the current groups while preserving its Work Folder, runtime, Git state, and resume behavior. | `activeTasksArchived` | Archive is not Done, closed, deleted, detached, stopped, or cleaned up. |
| **Work Folder** | The real place where work happens. A copied Work Folder is backed by an existing Superset Workspace and Git worktree; the primary repository is the Main Folder. | Workspace / worktree | Use `Work Folder` or `Main Folder` in AA. `Workspace` and `worktree` may remain in advanced/technical surfaces. |
| **Task Folder** | The compact presentation of the current work session: explicit title, assigned employee, lifecycle, and changed-file count derived from existing state. | Terminal pane metadata + runtime + Git | It is not a persistent task entity. Do not invent descriptions, progress, priority, or completion. |
| **Employee** | An available terminal-agent preset presented as a person in the Employee Roster. | Agent config / preset | Keep the functional employee name explicit. A persona does not imply capability, quality, seniority, or availability. |
| **Pi Worker** | The active Tier 1 Pi employee whose real structured lifecycle is visible to AA. | Pi Runtime Contract snapshot | Use `Pi Worker` for the character/status presentation. Never show a fake pose or state. |
| **Worker** | A compact status presentation for an employee with current authoritative runtime evidence. | Runtime/binding evidence | Prefer the explicit employee name when ambiguity is possible. |
| **Employee Roster** | The existing agent preset launcher presented as manual work assignment. | Presets bar | `Send Task Folder`/`Dispatch` describe the user action; they do not promise orchestration or a confirmed binding. |
| **Runtime** | The structured Tier 1 contract that reports identity, lifecycle, capabilities, model, reasoning, and resume facts. | AA Runtime Contract v0.1 | Use in technical status and Employee Profile. Do not use terminal text or launch metadata as runtime authority. |
| **Session** | A real agent conversation associated with an exact terminal and native agent session identity. | Pi native session + terminal-agent persistence | Avoid using `session` as a synonym for task. A restart may create a new runtime epoch while preserving the native Pi session. |
| **Resume** | Explicitly continue an exact saved Pi native session. | Existing terminal-agent resume path | Resume must preserve native identity, start a new runtime epoch, and never alter Archived intent. |
| **Changed** | The unique real staged and unstaged file count for the selected Work Folder. | Git status | Always show a real count. Do not treat changed files as progress or completion. |
| **Output** | The current Work Folder's real Git changes, exposed through Files, Changes, and Diff. | Git/file/diff services | Output is evidence, not a productivity score. |
| **Delivery** | Existing pull-request linkage/status when available. | Pull-request read model | Show the real state, including `NO GITHUB REPO`; never fabricate a delivery target. |
| **File Cabinet** | The existing Files, Changes, and Review surfaces in AA presentation. | Workspace sidebar/panes | Preserve the explicit tab names and underlying interactions. |
| **New Workspace · Advanced** | The unchanged generic Superset workspace-creation path retained for advanced use. | Global New Workspace action | Keep visually secondary to project-local `NEW TASK`; do not remove it. |

## State-language rules

- `LIVE` requires an exact current Tier 1 Runtime Contract snapshot.
- `RESUMABLE` requires an exact Host resume candidate. An offline snapshot is
  insufficient.
- `UNTRACKED` requires an explicit non-Pi launch identity and states only the
  absence of Tier 1 tracking.
- A clean Pi quit is `SESSION ENDED`/unavailable, not Saved.
- `IDLE`, `WORKING`, `WAITING`, `ERROR`, model, and reasoning labels come only
  from the accepted runtime authority.
- `Archived` may coexist with Live or Resumable. It never overrides runtime or
  Git truth.

## Avoid in the AA daily path

Do not casually substitute `Project`, `Workspace`, `worktree`, `checkout`,
`preset`, or `agent CLI` for the AA terms above. Do not use `Done`, `complete`,
`history`, `queue`, `assigned`, or `saved` unless the corresponding accepted
contract actually proves that claim.
