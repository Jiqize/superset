# AA Office v0.2 RC user guide

## Status

AA Office v0.2 is a Pi-first macOS development build on the `aa-spike` branch.
Its release-candidate verdict is:

`AA OFFICE V0.2 RC READY WITH ACCEPTED DEBT`

It is validated for local use on the original development Mac. It is not yet a
packaged, signed, notarized, tagged, or second-machine distribution.

## Start and stop

From the repository root:

```bash
cd /Users/lianglei/Code/bluejob/superset
git switch aa-spike
git pull --ff-only origin aa-spike
bun run dev:desktop
```

If a fresh dependency install is actually required:

```bash
bun install --frozen-lockfile
```

Stop the development stack with `Ctrl+C` in the terminal that launched it and
allow Electron, Host Service, and terminal children to exit normally.

## Product model

```text
Briefcase (real Git project)
└── NEW TASK (normal Pi-first entry)
    └── Work Folder (real Workspace/worktree)
        ├── Task Folder (current work label and evidence)
        ├── Employee (Pi or a compatibility CLI)
        ├── Runtime (authoritative Tier 1 state)
        └── Output (real Files/Changes/Diff/Review)
```

Active Tasks projects real current evidence. It is not a task database, queue,
history, scheduler, or completion system.

## Global navigation

| Rail | Destination | Meaning |
| --- | --- | --- |
| `HOME` | Briefcases & Work Folders | Find existing work and open a project/work location |
| `CASES` | Briefcase Cabinet | Toggle/select project-local New Task, Active, Archived, and Work Folder entries |
| `FILES` | Current Work Folder File Cabinet | Enabled only inside a real Work Folder |
| `TASKS` | Existing Superset Tasks | Team task/issue system; not AA Task Folders |
| `AUTO` | Automations | Existing scheduled agent work |
| `PRS` | Pull Requests | Existing repository review data |
| `SESS` | Sessions | Terminal presets, persistence, and session infrastructure |
| `AGENTS` | Employees & Agents | Pi and compatibility launch configuration |
| `SET` | Settings | Account, Appearance, Keyboard, Git, and other controls |

Exactly one destination is current. Cases can also be pressed while its cabinet
is open. Navigation never creates a Task/Work Folder and never auto-resumes Pi.

## Start normal work

1. Open Home or Cases and select the Briefcase.
2. Click the project-local `NEW TASK` action.
3. Enter a short, concrete title.
4. Start work.
5. AA creates one isolated Work Folder/worktree, launches the title through the
   existing Pi path, waits for authoritative Pi identity, and focuses real
   xterm.

Good titles describe one result, for example:

```text
Fix restart status
Add CSV export
Review runtime adapter
```

Use `New Work Folder · Advanced` only when you intentionally need lower-level
branch/worktree/Employee form controls. The advanced form still uses mature
Workspace/Project terminology where those are the actual models.

## Employee Roster

Pi is always the first tile and is marked `PRIMARY`. It comes from the real Host
Pi configuration, not a synthetic preset.

- Available Pi: sends the current Task Folder to one new real Pi conversation.
- `SETUP REQUIRED`: opens existing Employees & Agents setup and launches no
  fake terminal.
- Clicking Pi again is an intentional new conversation in the same Work Folder;
  it is not resume.
- Claude, Codex, OpenCode, Copilot, Mistral Vibe, Kimi, Grok, Superset CLI, and
  other CLIs retain their existing preset behavior.

Compatibility Employees may show `UNTRACKED`. That means AA has no activated
Tier 1 lifecycle authority for the launched CLI; it does not mean offline,
failed, idle, or completed.

## Runtime state

The Pi Worker and Task Folder show only accepted structured evidence:

- `STARTING`
- `WORKING`
- `IDLE`
- `WAITING`
- `ERROR`
- `OFFLINE`
- `RESUMABLE`
- `ENDED`

`IDLE` means the current turn settled. It does not mean the work is done.
Reasoning and model labels are read-only effective Pi values. Reasoning Hair is
a visual representation of the real reasoning label and never replaces text.

If Pi's TUI displays a permission prompt while AA still says `WORKING`, follow
the real terminal prompt. AA intentionally does not parse terminal text to
invent `WAITING`.

## Active Tasks

- `LIVE` requires an exact current Tier 1 snapshot.
- `SAVED / RESUMABLE` requires an exact Host resume candidate.
- `UNTRACKED` requires explicit compatibility launch identity and makes no
  lifecycle claim.
- `N CHANGED` is the unique real staged/unstaged Git path count.
- Duplicate titles receive stable opaque suffixes only to distinguish rows.

Open `WORK FOLDERS` when you need the underlying main/copy infrastructure or
when AA cannot truthfully project a Task row.

## Files, Changes, Diff, and Review

The File Cabinet is the existing mature repository tooling:

- Files browses the selected Work Folder filesystem.
- Changes lists real staged/unstaged output.
- Diff opens the real selected file change.
- Review exposes existing pull-request/review data when available.

Always inspect actual output. Agent state and changed-file count are not
progress or correctness scores.

Useful accepted shortcuts include:

| Shortcut | Action |
| --- | --- |
| `⌘⌥F` | Open Files |
| `⌘L` | Open/toggle Changes |
| `⌘⇧L` | Open/focus Diff workspace |
| `⌘⇧A` | Focus the most recently active real xterm |

## Archive and Unarchive

Archive changes durable organization intent only. It does not stop Pi, close a
terminal, delete a Work Folder, reset Git, discard resume, or mark work Done.

1. Click `ARCHIVE` on an Active Tasks row.
2. Expand the collapsed `ARCHIVED` group when needed.
3. Click `UNARCHIVE` to return it to the truthful current grouping.

Runtime, resumability, changes, and Work Folder identity remain independent.

## Restart and exact Pi resume

After full app/Host restart, AA must not carry stale Live state. A saved exact
candidate appears as `OFFLINE / RESUMABLE` with `RESUME PI SESSION`.

1. Open the saved Work Folder.
2. Click `RESUME PI SESSION`.
3. AA starts a new Runtime epoch and waits for the same native Pi session
   identity.
4. When confirmed, real xterm returns and Runtime becomes authoritative again.

AA never chooses a recent session heuristically and never silently substitutes
a new conversation for an exact resume. A real clean Pi quit can be final and
leave the Work Folder without a resume action.

## Settings and mature operational pages

Tasks, Automations, Pull Requests, Sessions, Employees & Agents, and general
Settings now use one AA page hierarchy, but their business data and actions are
still the mature Superset implementation. Terms such as Superset, Project,
Workspace, terminal preset, or agent remain where they describe real controls.

## Current accepted debt

See `AA-V0.2-DEBT-REGISTER.md`. Important daily points:

- some Pi permission prompts are visible only in TUI until the Runtime bridge
  provides structured waiting evidence;
- compatibility CLIs remain untracked by design;
- advanced forms retain mature terminology;
- this is a development build, not a distribution artifact.

For safe recovery, prefer the existing visible controls and normal shutdown/
resume paths. Do not manually edit Host databases, reuse recent Pi sessions by
guess, or kill PTY children unless a separately authorized diagnostic requires
it.
