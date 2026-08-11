# AA Task Retention & Cleanup v0.1 Proposal

## Status

**Proposal only. No archive, cleanup, completion, or persistence is implemented
by Phase 3K.**

Recommended architecture outcome:

> **PROCEED WITH ONE MINIMAL PERSISTED ARCHIVE FIELD**

## Product model

AA keeps three independent kinds of truth:

1. **Work location** — the real Workspace/Work Folder and its Git worktree.
2. **Execution evidence** — live Runtime, exact Pi resume candidate, or
   compatibility `UNTRACKED` identity.
3. **User organization intent** — whether the user has explicitly archived the
   Work Folder from the current working set.

Only the third item is missing. It should be stored as one boolean on the
existing Host Workspace record:

```text
activeTasksArchived: boolean = false
```

No Task entity is proposed. No timestamp is proposed in v0.1. Archive state is
not history and does not order work by age.

## User-facing information architecture

```text
BRIEFCASE
  NEW TASK
  ACTIVE TASKS · CURRENT
  ACTIVE TASKS
  SAVED / RESUMABLE
  UNTRACKED
  ARCHIVED (collapsed by default)
  WORK FOLDERS
```

An archived row remains one real Work Folder. Its label combines organization
intent with independently derived evidence, for example:

```text
ARCHIVED
PI SESSION UNAVAILABLE
3 CHANGED
```

or:

```text
ARCHIVED
PI · RESUMABLE
0 CHANGED
```

`ARCHIVED` must not replace or rewrite `LIVE`, `RESUMABLE`, `UNTRACKED`, changed
count, worktree availability, or delivery state.

## Proposed actions

### Archive

- Sets `activeTasksArchived` to `true`.
- Removes the row from current/live/saved/untracked groups.
- Adds it to the collapsed Archived group when Task Folder presentation is
  available.
- Does not close a terminal, stop an agent, discard a resume candidate, hide
  the Workspace from Superset, or change Git.
- Is reversible and should offer Undo rather than a destructive confirmation.

Archive must also be reachable from the durable Work Folder/Task Folder surface
because a clean-ended Pi task may already be absent from Active Tasks.

### Unarchive

- Sets the same boolean to `false`.
- Returns the row to whichever evidence group is true at that moment.
- If no live, resume, or compatibility evidence exists, the Work Folder remains
  available without an optimistic Active Tasks row.

### Remove from Active Tasks

Do not create a second v0.1 action. If this wording is ever used, it must be an
alias for Archive, not a different hidden state.

Current **Remove from Sidebar** remains separate Superset infrastructure. It
writes `isHidden` and clears pane layout, so it is not a safe archive mechanism.

### Close Session

- Uses the existing terminal close/kill flow.
- Explicitly means “end this terminal process,” not archive or complete.
- Warns when a process is running.
- May produce an exact Pi resume candidate, but must not promise one.
- Does not change archive state or Git.

### Delete Work Folder

- Remains an advanced destructive action backed by existing
  `workspaceCleanup.inspect/destroy` behavior.
- Blocks main Workspace deletion.
- Blocks dirty worktrees unless the user explicitly force-confirms.
- Warns about unpushed commits.
- Disposes Workspace PTYs and removes the worktree before deleting the
  authoritative Workspace record.
- Keeps branch deletion as a separate unchecked-by-default option.
- Does not claim to delete a remote pull request.

Archive UI must not visually place this action next to the reversible Archive
action without an advanced/destructive separation.

## State language

Allowed independent labels:

- `LIVE · IDLE`
- `LIVE · WORKING`
- `LIVE · WAITING`
- `LIVE · ERROR`
- `SAVED / RESUMABLE`
- `UNTRACKED`
- `PI SESSION UNAVAILABLE`
- `WORKTREE UNAVAILABLE`
- `ARCHIVED`
- `<N> CHANGED`

Disallowed implications:

- `DONE` from Archive, close, zero changes, or missing Runtime;
- `COMPLETED` from a Pi `Stop`/detach event;
- `SAFE TO DELETE` from a clean working tree alone;
- `SAVED` without an exact resume candidate;
- `ACTIVE` as a synonym for high workload or recent activity.

## Persistence contract

The proposed field:

- is Workspace-owned Host SQLite state;
- stores only explicit user organization intent;
- survives Renderer and full app restart;
- is removed naturally with the Workspace record;
- is not copied from Runtime, terminal, Git, prompt, or transcript data;
- never mutates those sources;
- is not stored in Renderer localStorage;
- does not overload the existing `workspaces.taskId` column.

For AA's current macOS-first, local single-user prototype, Workspace scope is
the smallest correct unit. If a future shared Host requires per-user archive
preferences, that is a separate product decision; v0.1 must not silently add a
second localStorage copy.

## Cleanup safety rules

1. Archive and Unarchive are the only AA retention actions in v0.1.
2. Archive never invokes terminal, resume, pane, Git, worktree, branch, PR, or
   Workspace deletion APIs.
3. Close Session never changes archive or completion state.
4. There is no “forget saved Pi session” action until Host exposes an explicit,
   reviewed capability; `clearWorkspaceStatuses` is not a substitute.
5. Delete Work Folder always uses the existing cleanup preflight/saga rather
   than Renderer-side sequencing.
6. Dirty, unpushed, unmerged, active-terminal, resume, and PR facts remain
   independent and visible wherever the destructive flow can expose them.
7. A missing worktree is shown as unavailable, never as zero changed or done.
8. Remote branches and pull requests are never inferred deleted from local
   Workspace/worktree cleanup.

## Minimal future implementation boundary

An authorized implementation should be limited to:

- one Host Workspace schema field and normal migration;
- one idempotent Host Archive/Unarchive mutation;
- Workspace read-model exposure;
- AA Active Tasks projection/rendering and focused tests;
- restart/unarchive/destructive-boundary acceptance evidence.

It must not modify:

- AA Runtime Contract or registry;
- Pi lifecycle bridge or resume eligibility;
- terminal agent persistence semantics;
- PTY/xterm;
- Git/worktree cleanup behavior;
- completion/history;
- prompts, transcripts, or native chat;
- orchestration;
- Grok activation or Tier 2 tracking.

## Acceptance criteria for a future phase

1. Archive a live Pi row; Runtime remains live and truthful.
2. Archive an exact resumable row; candidate remains resumable.
3. Archive an `UNTRACKED` compatibility row; it remains untracked.
4. Archive from a clean-ended Pi Work Folder with no Active Tasks row; show
   `ARCHIVED · PI SESSION UNAVAILABLE` without inventing history.
5. Restart Renderer and full app; archive intent persists.
6. Unarchive; current evidence determines placement.
7. Changed counts continue to come from Git events.
8. Remove from Sidebar remains visibly and behaviorally distinct.
9. Delete Work Folder still uses existing destructive safeguards.
10. No Runtime, PTY, Git, resume, prompt, transcript, or Task entity change.

## Explicit non-goals

- task completion or “done” state;
- archive timestamps, history, recency, sorting, or timeline;
- task descriptions, priorities, owners, tags, due dates, dependencies, or
  percentages;
- automatic archive rules;
- retention TTL or background cleanup;
- bulk archive/delete;
- deleting saved Pi resume bindings;
- deleting remote branches or PRs;
- task database/entity;
- native chat, orchestration, or Grok activation.

Phase 3K stops at this proposal. Implementation requires a separate approved
phase because the single field crosses the Host SQLite RED boundary.
