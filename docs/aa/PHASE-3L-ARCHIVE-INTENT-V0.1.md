# Phase 3L — Archive Intent v0.1

## Status

Phase 3K completed with the explicit recommendation:

> PROCEED WITH ONE MINIMAL PERSISTED ARCHIVE FIELD

This phase is authorized to cross the narrow Host SQLite/schema/API boundary required to persist one Workspace-owned archive-intent boolean. No broader RED-area expansion is authorized.

Read first:

1. `docs/aa/PHASE-3K-TASK-RETENTION-DURABILITY-REPORT.md`
2. `docs/aa/TASK-RETENTION-CLEANUP-V0.1-PROPOSAL.md`
3. `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md`
4. `docs/aa/PHASE-3J-ACTIVE-TASKS-PROJECTION-REPORT.md`
5. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
7. `docs/aa/CODEBASE-MAP.md`

Treat the Phase 3K proposal as the product contract for this phase.

## Goal

Add one explicit, reversible user-organization fact to an existing Work Folder:

```text
activeTasksArchived: boolean = false
```

Use it only to control whether a Work Folder appears in current Active Tasks groups or in a collapsed Archived group.

Archive must remain completely independent from:

- Runtime lifecycle;
- Pi resume capability;
- terminal state;
- Git/worktree/branch state;
- changed-file count;
- PR/delivery state;
- task completion;
- prompt/transcript/history.

No Task entity is introduced.

## 1. Persist exactly one archive field

Add one Workspace-owned Host SQLite boolean field named:

`activeTasksArchived`

Default: `false`.

Requirements:

- normal repository migration using existing migration conventions;
- exposed through the normal Workspace read model;
- survives full Electron/Host restart;
- removed naturally with Workspace deletion;
- no archive timestamp;
- no archivedBy, reason, completion, status, priority, tag, or history fields;
- do not overload an existing unrelated Workspace column;
- do not copy archive state into Renderer localStorage.

If the exact naming conflicts with existing schema conventions, preserve the semantic name at the public contract and document the internal mapping before changing it.

## 2. Add one idempotent Host mutation

Provide the smallest existing-router-compatible mutation to set archive intent for a real Workspace.

Preferred semantic shape:

```text
setActiveTasksArchived(workspaceId, archived: boolean)
```

Requirements:

- Workspace-scoped validation using existing Host ownership rules;
- setting the current value again is a successful idempotent no-op;
- return the updated Workspace/read model using existing conventions where practical;
- invalidate/update the existing Renderer workspace cache through normal query behavior;
- do not call terminal, runtime, resume, Git, cleanup, worktree, branch, or PR APIs;
- no automatic delete/close/kill/hide behavior.

Do not add separate Archive and Unarchive backend semantics if one boolean setter fits existing router conventions better.

## 3. Active Tasks projection behavior

Extend the accepted Phase 3J projection.

When `activeTasksArchived === false`:

- classify the Work Folder exactly as Phase 3J already does;
- `LIVE`, `SAVED / RESUMABLE`, and `UNTRACKED` truth remain unchanged;
- insufficient-evidence behavior remains unchanged.

When `activeTasksArchived === true`:

- remove it from CURRENT / ACTIVE TASKS / SAVED / RESUMABLE / UNTRACKED groups;
- show it in a collapsed `ARCHIVED` group when there is explicit Task Folder presentation sufficient to identify the work item;
- preserve independent evidence in the archived row.

Examples:

```text
ARCHIVED
PI · LIVE · WORKING
3 CHANGED
```

```text
ARCHIVED
PI · RESUMABLE
0 CHANGED
```

```text
ARCHIVED
PI SESSION UNAVAILABLE
3 CHANGED
```

```text
ARCHIVED
SUPERSET CLI · UNTRACKED
1 CHANGED
```

`ARCHIVED` is organization intent. Never replace or downgrade the independent evidence label.

Do not infer `DONE`, `COMPLETED`, `INACTIVE`, or `SAFE TO DELETE`.

## 4. Archive action

Add a compact, discoverable Archive action from the existing task/work surfaces.

At minimum it must be reachable from:

- an Active Tasks row or its focused/context affordance;
- the durable Work Folder / Task Folder surface, so a clean-ended Pi task with no Active Tasks row can still be archived.

Requirements:

- action label is `ARCHIVE` or `Archive task` depending existing copy style;
- archive performs only the archive-intent mutation;
- no destructive confirmation dialog;
- after success, offer a reversible Undo affordance if the existing notification/toast system supports this cleanly;
- keyboard accessible;
- symbolic control has tooltip/accessibility name;
- no animation beyond existing reduced-motion-safe patterns;
- archive while Pi is `WORKING` must leave Pi working and truthful;
- archive while resumable must leave exact resume candidate untouched;
- archive an `UNTRACKED` compatibility task without altering the terminal;
- archive a clean-ended Pi Work Folder with no live/resume evidence and show `PI SESSION UNAVAILABLE` rather than inventing state.

If Undo cannot be implemented using existing notification infrastructure without broadening scope, provide explicit Unarchive in the Archived group and document the omission. Do not invent a notification subsystem.

## 5. Unarchive action

Archived rows must expose `UNARCHIVE`.

Unarchive:

- sets the same field to `false`;
- does not launch/resume/close anything;
- returns the Work Folder to whichever evidence group is true at that moment;
- if no current live/resume/compatibility evidence exists, the Work Folder may leave the Active Tasks projection and remain available in `WORK FOLDERS`.

This is expected behavior. Do not force an Active Tasks row merely because it was unarchived.

## 6. Archived group

Add a compact `ARCHIVED` group under the existing task evidence groups and before/near the secondary Work Folder disclosure according to the current Phase 3J information hierarchy.

Requirements:

- collapsed by default;
- archived count may be shown if the existing group-header pattern supports it;
- no archive timestamp or chronological sorting;
- preserve deterministic sidebar/workspace ordering within the group;
- duplicate-title discriminators continue to work;
- clicking an archived row opens the real underlying Workspace only;
- clicking a row does not automatically unarchive, launch, or resume anything;
- 1440×800 density must remain usable with 10+ Work Folders.

## 7. Keep existing infrastructure actions separate

Do not merge or rename existing destructive/infrastructure actions into Archive.

The UI must continue to distinguish:

- Archive / Unarchive: reversible organization intent only;
- Close Session: terminal/process action;
- Remove from Sidebar: existing Superset sidebar behavior and its current semantics;
- Delete Work Folder / cleanup: advanced destructive operation using existing cleanup safeguards.

Do not place Delete Work Folder immediately beside Archive in a way that makes them look equivalent.

Do not modify existing cleanup semantics in this phase.

## 8. Migration and backwards compatibility

Existing Workspaces must read as `activeTasksArchived = false` after migration.

Requirements:

- no data backfill from runtime/session/Git state;
- no heuristic archival of older work;
- existing AA and non-AA Workspace behavior remains unchanged unless the new field is explicitly set;
- non-AA Superset surfaces do not need new archive UI;
- Workspace import/create/New Task flows naturally receive the default false value through the schema default;
- Workspace deletion requires no special archive cleanup beyond normal row deletion.

## 9. Query/performance boundary

Phase 3K accepted the existing event-driven per-Workspace evidence queries for the current <=20 eligible Work Folder envelope.

Do not add batching or a projection backend in Phase 3L.

Archive filtering should happen before expensive evidence queries where the current hook architecture allows that safely, because archived rows still need enough evidence to render truthful archived state. If current architecture requires evidence reads for archived rows, preserve truth and document the cost rather than optimizing away required facts.

Do not introduce polling.

## 10. Runtime and resume invariants

Strong regression requirement:

- archiving a live Pi task leaves Runtime snapshot untouched;
- archiving while `WORKING` does not change lifecycle;
- archiving a resumable Pi task leaves exact resume candidate untouched;
- exact resume from an archived Work Folder remains possible through the existing resume UI when the user opens that Workspace;
- resumed runtime remains archived until the user explicitly unarchives;
- unarchive does not auto-resume;
- archive state never enters AA Runtime Contract, Pi bridge, terminal-agent persistence, or resume matching.

## 11. Real acceptance journey

Use the isolated QA profile and a disposable local Git project.

Create enough real work to cover at minimum:

1. one live Pi task in `IDLE`;
2. one real Pi task observed in `WORKING` during archive action;
3. one exact `SAVED / RESUMABLE` Pi task after full restart;
4. one Pi Work Folder with clean-ended/unavailable session and no Active Tasks row before archive;
5. one Tier 2 `UNTRACKED` task;
6. one task with real changed files;
7. one duplicate-title pair.

Required acceptance:

- archive each evidence category;
- verify the independent evidence remains truthful;
- verify archived rows leave current evidence groups;
- verify collapsed Archived group and duplicate discriminators;
- full Electron/Host restart with archived state preserved;
- exact Pi resume while archived, with same native identity/new epoch;
- verify archived state remains true after resume;
- unarchive and verify current evidence determines placement;
- Renderer reload;
- 1440×800 and 1920×976;
- keyboard navigation/accessibility/reduced motion;
- New Task regression;
- Files/Changes/Diff/Review regression;
- Remove from Sidebar remains behaviorally distinct;
- destructive cleanup safeguards remain unchanged.

Do not deliberately delete user work as part of routine acceptance. Destructive behavior may be inspected/probed only in disposable fixtures using the existing cleanup preflight where necessary.

## 12. Tests

Add focused automated coverage for:

- schema default/migration/read-model field;
- idempotent archive mutation;
- authorization/Workspace-not-found behavior;
- Active Tasks exclusion of archived rows from live/saved/untracked groups;
- Archived-group projection with live, resumable, unavailable, untracked evidence;
- duplicate-title discriminator stability across archive/unarchive;
- archive/unarchive UI action state;
- full query/cache update behavior;
- runtime/resume independence;
- New Task default false;
- non-AA regression where relevant.

Run:

- relevant DB/schema/migration tests;
- Host Service tests;
- Workspace client/session protocol TypeScript as required by touched contracts;
- Desktop/AA Renderer tests;
- Runtime/Pi/resume regression suites;
- root TypeScript checks for touched packages;
- root lint;
- `git diff --check`;
- RED-area audit showing only the explicitly authorized narrow schema/read-model/mutation changes;
- sensitive-evidence scan.

## 13. Deliverables

Create:

- `docs/aa/PHASE-3L-ARCHIVE-INTENT-V0.1-REPORT.md`
- `docs/aa/AA-ARCHIVE-INTENT-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/new-task-flow/v0.1-archive-intent/`

The report must include:

1. executive verdict;
2. baseline/final commits;
3. exact schema/migration/read-model change;
4. Host mutation contract;
5. Active Tasks/Archived projection rules;
6. archive/unarchive UX;
7. runtime/resume independence evidence;
8. full restart persistence result;
9. unavailable-session archive result;
10. Tier 2 result;
11. duplicate-title result;
12. accessibility/viewports;
13. automated verification;
14. RED-area authorization review;
15. known limitations;
16. recommended next phase.

## Explicit non-goals

Do not implement:

- Task entity/table;
- DONE/completion state;
- archive timestamps/history/recency;
- task priorities/tags/due dates/descriptions;
- automatic archive rules;
- TTL/background cleanup;
- bulk archive;
- delete/forget Pi resume binding;
- changes to cleanup/delete/worktree/branch semantics;
- native chat;
- orchestration;
- Grok activation;
- Tier 2 runtime tracking;
- Runtime Contract changes.

After Phase 3L implementation, verification, report, checkpoint, and safe evidence are complete, commit and push to `origin/aa-spike`, then STOP. Do not begin another phase.