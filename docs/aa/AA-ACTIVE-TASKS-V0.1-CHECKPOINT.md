# AA Active Tasks v0.1 Checkpoint

## Status

Phase 3J is complete on baseline
`c9471bec910ac11bf9a19495aa10c6d0d05922d2`. The exact runnable
implementation and safe-evidence revision is
`0144aeb9b67501fab78cf0fa2de573d979d7b89c`; this checkpoint and the Phase 3J
report are the documentation closeout immediately after it.

## Accepted product model

```text
Briefcase
→ NEW TASK (primary creation)
→ Active Tasks projection
   → selected/current
   → live Runtime-authoritative work
   → exact saved/resumable Pi work
   → compatibility/untracked work
→ Work Folders (durable infrastructure/navigation disclosure)
```

Active Tasks is not a Task database. A projected row navigates to one existing
real Workspace/Work Folder and never launches or resumes an agent on selection.

## Accepted authority contract

Classification precedence is:

1. exact Workspace + terminal live AA Runtime snapshot;
2. exact saved Pi resume candidate;
3. explicit non-Pi compatibility launch identity;
4. omit when evidence is insufficient.

Persisted title eligibility requires explicit `taskTitleEdited` presentation
metadata. Technical terminal, branch, Workspace ID, and worktree labels are not
promoted. Pi launch metadata alone is insufficient.

Git changed count is the current unique staged/unstaged path count. It is
output truth, never progress or completion.

## Accepted duplicate and ordering contract

Only normalized title collisions receive a compact opaque discriminator derived
deterministically from stable Workspace identity. Raw identity is never shown.
The suffix survives reload/restart and has no age, priority, or status meaning.

Ordering is selected first, then live, resumable, untracked, then existing
stable sidebar order. No urgency, recency, productivity, or completion is
inferred.

## Accepted information architecture

- Project-local `NEW TASK` is the primary creation action.
- Global New Workspace remains available as `New Workspace · Advanced` in AA
  mode.
- The adjacent legacy project `+` remains available, muted, and explicitly
  labeled by tooltip.
- Active Tasks is primary inside an expanded Briefcase.
- The complete existing Work Folder list remains accessible as a secondary
  disclosure.
- Row labels remain explicit and keyboard/screen-reader complete.

## Restart and resume checkpoint

A clean Electron/Host restart removes stale live lifecycle presentation. Exact
saved Pi candidates reconstruct as `RESUMABLE`; Pi rows without sufficient
evidence are omitted and remain reachable through Work Folders. Git counts are
recomputed and duplicate suffixes remain stable.

Explicit exact resume transitions only the matching row back to `LIVE` with its
new authoritative lifecycle. Other rows do not inherit its state and selecting
a row does not auto-resume it.

## Real acceptance checkpoint

- Five production New Tasks were created in one disposable Briefcase.
- At least three titles were unique and one duplicate pair was exercised.
- Five rows projected together; the duplicate pair was distinguishable.
- Two tasks had real changed files and one Pi task was live/working at the
  measurement point.
- Every row opened the correct Work Folder; pointer, keyboard, terminal focus,
  Files, Changes, and Diff passed.
- Full restart produced zero stale live rows and three exact resumable rows;
  two insufficient-evidence Pi Work Folders remained in the secondary list.
- Exact resume made only one row live; the other two remained resumable.
- Superset CLI remained `UNTRACKED`.
- Grok remained authentication-gated with no live-runtime claim.
- 1440×800 and 1920×976 remained usable with five rows.

## Verification checkpoint

- Renderer/AA/New Task/Pi resume regressions: 179 passed.
- Session Protocol/Host Runtime/Pi persistence/Grok regressions: 65 passed.
- Desktop, Session Protocol, Workspace Client, and Host Service TypeScript:
  passed.
- Root lint: passed across 6,003 files with no diagnostics.
- `git diff --check`, RED-area scan, and sensitive-evidence scan: passed.
- Required root lint made format-only, data-preserving normalization to the two
  existing AA design JSON files.

## Change boundary

Only AAOffice presentation/projection, narrow existing Renderer sidebar
integration, AA documentation/evidence, and format-only AA design JSON changed.
No Host Service behavior, PTY, xterm, Git/worktree semantics, database schema,
Runtime Contract, Pi bridge, Grok adapter, or Tier 2 tracking changed.

## Known limits

- Insufficient-evidence Pi work remains only in Work Folders.
- One projected task is selected per Work Folder, active-pane first.
- Long titles visually truncate; accessible identity remains complete.
- Changed count can include agent-owned uncommitted files.
- Per-eligible-workspace read queries need measurement at larger scale.
- Completion, archive, cleanup, priorities, tags, due dates, and history remain
  absent.
- Grok activation remains deferred.

## Evidence

Safe screenshots and sanitized acceptance facts are under
`docs/aa/new-task-flow/v0.1-active-tasks/`. They exclude credentials, paths,
raw IDs, prompts, transcripts, and private repository content.

## Stop condition

Stop here. Review and dogfood Active Tasks v0.1 before authoring or beginning
another phase.
