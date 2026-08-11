# Phase 3L — Archive Intent v0.1 Report

## 1. Executive verdict

**PASS — Archive Intent v0.1 is implemented, durable, reversible, and accepted.**

AA Office now stores exactly one Workspace-owned organization fact:
`activeTasksArchived: boolean = false`. Archive moves an identifiable Work
Folder out of current Active Tasks groups and into a collapsed `ARCHIVED`
group without changing runtime, terminal, resume, Git, worktree, branch,
delivery, or cleanup state.

Real acceptance covered live Pi `IDLE`, live Pi `WORKING`, exact Pi resume after
full restart, Pi session unavailable, Superset CLI `UNTRACKED`, a real changed
file, duplicate titles, Undo/Unarchive, ten Work Folders, two viewports, and two
complete Electron/Host restart cycles. Exact resume while archived preserved
the native Pi identity, minted a new epoch, and left archive intent true.

## 2. Baseline, commits, and environment

Fast-forward-only sync and baseline confirmation used:

```text
git pull --ff-only origin aa-spike
git rev-parse HEAD
git merge-base --is-ancestor 7bf637be484769ad5f39612c13b8c52c33eb994d HEAD
git show -s --format='%H %s' 7bf637be484769ad5f39612c13b8c52c33eb994d
```

| Revision | Exact commit |
| --- | --- |
| Phase 3L brief / baseline | `7bf637be484769ad5f39612c13b8c52c33eb994d` |
| Runnable implementation | `48fc579ae6e8202478ed7d5bcfeea227d33d4100` |
| Report/checkpoint closeout | The documentation commit immediately following the implementation commit on `origin/aa-spike` |

The report cannot contain the hash of the commit that contains itself. The
exact pushed closeout SHA is therefore recorded in Git history and the final
delivery handoff.

| Item | Value |
| --- | --- |
| Platform | macOS 26.4 (25E246), arm64 |
| Bun | 1.3.14 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Desktop | Local development build, isolated disposable profile |
| Viewports | 1440×800 and 1920×976 logical pixels |
| Briefcase | Disposable one-commit local Git fixture without a remote |

Real UI signoff used pointer and keyboard interaction against the matched
Electron renderer. Read-only Host queries and DOM inspection measured truth;
they did not manufacture product state. The disposable QA profile was removed
after evidence capture.

## 3. Exact schema, migration, and read-model change

The authorized Host SQLite boundary contains one new column on the existing
`workspaces` table:

```text
public field: activeTasksArchived: boolean
SQLite column: active_tasks_archived INTEGER NOT NULL DEFAULT false
```

The normal Drizzle migration is
`packages/host-service/drizzle/0019_short_living_lightning.sql`, with its
generated snapshot and journal entry. It performs one `ALTER TABLE` and no
backfill heuristic. A pre-field fixture row migrated to `false`; a real
isolated Host applied the migration, completed two restart cycles, and ended
with ten rows split into eight explicit `true` and two default `false` values.

The field is carried through `HostWorkspaceRow`, `WorkspaceSnapshot`, the
cloud-shaped local read model, the Host workspace event, the Renderer Host
workspace cache, and the New Task optimistic row. Cloud-only/stale fallback
rows use `false`; archive intent is never copied into Renderer localStorage.

No timestamp, actor, reason, completion, priority, tag, history, or Task table
was added. Normal Workspace deletion owns row cleanup automatically.

## 4. Host mutation contract

The existing protected Workspace router now exposes the narrow setter:

```text
workspace.setActiveTasksArchived({ id: workspaceUuid, archived: boolean })
```

It validates the UUID, requires the normal authenticated Host boundary, reads
the real Workspace, returns `NOT_FOUND` when absent, and writes through
`updateLocalWorkspace` so the existing `workspace:changed` event contains the
canonical read model. Setting the current value is a successful no-op and
emits no duplicate event.

The procedure calls no terminal, runtime, Pi, resume, Git, worktree, branch,
PR, cleanup, or delete API. Focused tests cover migration/default, persistence,
event shape, idempotence, not-found, and unauthorized behavior.

## 5. Active Tasks and Archived projection rules

Unarchived Work Folders retain the accepted Phase 3J precedence:

1. exact authoritative live Runtime snapshot;
2. exact Pi resume candidate;
3. explicit non-Pi compatibility launch identity;
4. omission when evidence is insufficient.

Archived Work Folders are removed from current groups and placed in the
collapsed `ARCHIVED` group when explicit Task Folder presentation can identify
them. Independent evidence is preserved as `LIVE` plus lifecycle,
`RESUMABLE`, `UNTRACKED`, or `SESSION UNAVAILABLE`. Archive never implies
`DONE`, completion, inactivity, safety to delete, or progress.

Archived ordering uses existing stable sidebar order and Workspace identity
only as a deterministic tie-break. Duplicate discriminators are assigned
across archived and unarchived rows before sorting, so moving a row does not
change its identity suffix.

The existing event-driven per-Workspace Runtime, resume, and Git reads remain
unchanged. Archived rows still read enough evidence to stay truthful. No
batching, backend projection, or polling was introduced.

## 6. Archive, Undo, and Unarchive UX

Archive is available from both required durable surfaces:

- each Active Tasks row has a separate, explicit `ARCHIVE` control; the row's
  main button still only opens the real Workspace;
- Task Folder details expose `ORGANIZATION / ARCHIVE`, so a Pi Work Folder with
  no Active Tasks row remains archivable.

Both controls have full accessible names, tooltip/title text, disabled Host
offline state, pending state, and shared optimistic Host cache updates. A
failed write rolls back and invalidates the Host cache. Success uses the
existing toast system with `Undo`; real UI Undo restored the prior boolean.

Archived rows expose `UNARCHIVE`. Unarchive writes only the same boolean and
lets current evidence decide placement. A resumed live Pi row returned to
`LIVE · IDLE`; an insufficient-evidence row left the projection and remained
in `WORK FOLDERS`. Neither action launched, resumed, closed, or killed a
session.

## 7. Runtime and resume independence evidence

A real Pi task with one real changed file was archived while authoritative
state was `working`:

| Observation | Before | After |
| --- | --- | --- |
| Archive intent | `false` | `true` |
| Runtime state | `working` | `working` |
| Native-session fingerprint | `9942a484bd86` | `9942a484bd86` |
| Epoch fingerprint | `1b236f67d6f4` | `1b236f67d6f4` |
| Changed files | 1 | 1 |

The unchanged fingerprints prove that archive did not restart or substitute
the Pi process. A Superset CLI task similarly retained one visible terminal
session and the same visible session label before/after archive while its
archived evidence remained `SUPERSET CLI · UNTRACKED`.

Archive state does not enter AA Runtime Contract, the Pi bridge, terminal-agent
persistence, resume matching, or pane metadata. No Runtime, Pi, terminal,
xterm, PTY, or Git implementation file changed.

## 8. Full restart persistence and exact resume

Two full Electron/Host stop-start cycles were performed with the same isolated
profile. Listening Host/CDP ports were confirmed closed between processes, so
these were not renderer-only reloads.

For the exact archived resume journey:

| Stage | Archive | Pi identity | Epoch | Evidence |
| --- | --- | --- | --- | --- |
| Before restart | `true` | `9dad8e20be26` | `8d67684baaf7` | live `IDLE` |
| After restart | `true` | `9dad8e20be26` | no live epoch | exact resumable candidate |
| After explicit resume | `true` | `9dad8e20be26` | `5914b4b71995` | live `IDLE` |

The existing visible `RESUME PI SESSION` action was used. Native identity
matched, the epoch changed, and archive intent remained true. Renderer reload
then retained live `IDLE` and the archived count. Later Unarchive changed only
the organization field; the same runtime identity and epoch remained.

## 9. Unavailable-session archive result

A Pi task was allowed to settle and its terminal was ended from the real xterm
surface. Before archive it had no Active Tasks row. Task Folder remained
available and was used to archive it. The new archived row said
`PI · SESSION UNAVAILABLE`; it did not infer idle, done, or completion.

The evidence label remained dynamic rather than stored: when a later restart
made an exact candidate available for an archived fixture, the row changed to
`PI · RESUMABLE`. Other archived Pi rows without exact evidence remained
`SESSION UNAVAILABLE`. This is the intended separation between archive intent
and runtime truth.

## 10. Tier 2 compatibility result

The existing Employee Roster dispatched a Task Folder to Superset CLI. The
result was a real compatibility terminal labeled `UNTRACKED`. Archiving it:

- moved the row into `ARCHIVED`;
- preserved `SUPERSET CLI · UNTRACKED`;
- kept terminal count at one;
- kept the same visible terminal-session label;
- did not create Tier 2 lifecycle or Runtime Contract evidence.

No Codex, Claude, Superset CLI, or other compatibility runtime adapter was
changed.

## 11. Duplicate-title result

Multiple real New Tasks used the same explicit title. The first measured pair
retained opaque discriminators `#8711` and `#6704` across archive/unarchive,
Renderer reload, and restart. At the ten-Work-Folder density point, five
same-title rows remained separately focusable with distinct suffixes.

Activating an archived row opened only its underlying Workspace. It did not
unarchive, launch, or resume. Pure tests also prove discriminator stability
when archive state changes and when input order is reconstructed.

## 12. Accessibility, viewports, and interaction

- Archive and Unarchive preserve explicit functional text and accessible
  names; icons are supplemental.
- Keyboard focus plus Enter archived a real Active Tasks row. Keyboard row
  activation, the native `<details>` Archived disclosure, and Task Folder
  controls also passed.
- The existing reduced-motion stylesheet was exercised with
  `prefers-reduced-motion: reduce` at 1440×800.
- At both 1440×800 and 1920×976, eight archived rows and the ten-Work-Folder
  disclosure remained usable with no document-level horizontal or vertical
  overflow.
- Renderer reload, route navigation, New Task, terminal focus/input,
  Files/Changes, a real one-file Diff, and truthful Review-without-PR all
  passed.
- The Workspace context menu still presents `Remove from Sidebar` and
  `Delete` separately from Archive. Read-only cleanup preflight still blocked
  the main Workspace and detected both dirty and unpushed state on the
  disposable changed Work Folder.

## 13. Automated verification

| Command or suite | Result |
| --- | --- |
| Focused archive schema/Host/cache/projection/actions | 24 passed, 0 failed, 56 expectations across 5 files |
| AAOffice + Runtime registry/router + Pi bridge + terminal-agent persistence/resume | 248 passed, 0 failed, 483 expectations across 33 files |
| Full `@superset/host-service` test suite | Passed, including migration, cleanup, terminal persistence, Runtime, and integration tests; expected opt-in ACP skips/todos remained |
| Desktop TypeScript, generated icons, and routes | Passed |
| Host Service TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Session Protocol TypeScript | Passed |
| Root `bun run typecheck` | Passed across 36 packages |
| Root `bun run lint:fix` | Passed; final pass checked 6,012 files and normalized one new evidence JSON file |
| Root `bun run lint` | Passed; 6,012 files checked, no fixes |
| `git diff --check` | Passed |
| RED-area modification audit | Passed |
| Sensitive-evidence scan | Passed |

Primary commands:

```text
bun test packages/host-service/src/trpc/router/workspace/workspace.test.ts ...
bun test apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice ...
bun run --cwd packages/host-service test
bun run --cwd apps/desktop typecheck
bun run --cwd packages/host-service typecheck
bun run --cwd packages/workspace-client typecheck
bun run --cwd packages/session-protocol typecheck
bun run typecheck
bun run lint:fix
bun run lint
git diff --check
```

The development console retained known pre-existing `DockBadgeController`
render-time warnings, Electric-over-HTTP guidance, and expected background
base-ref fetch failures for the disposable no-remote repository. No new
Phase 3L application error remained after either clean restart.

## 14. RED-area authorization review

The only RED-area change is the explicitly authorized narrow Host boundary:

- Host Workspace schema plus generated migration;
- Workspace read-model/event propagation;
- one protected idempotent Workspace setter and focused tests.

All product presentation and optimistic cache work stays in Renderer/AAOffice
or the existing Host-workspace cache/New Task path. The audit found no change
to Host lifecycle primitives, Runtime Contract, runtime registries, Pi bridge,
terminal-agent persistence, PTY daemon, xterm, Git/worktree/branch behavior,
cleanup/delete semantics, database tasks/entities, native chat, Grok, or Tier
2 tracking.

Evidence contains only synthetic titles, opaque truncated SHA-256
fingerprints, sanitized facts, and AA-only screenshot crops. It contains no
credential, absolute user path, UUID, raw session/epoch identity, prompt,
transcript, or private repository content.

## 15. Known limitations

1. Archived rows still issue the existing per-Workspace evidence reads so the
   row remains truthful. Phase 3K's accepted <=20 Work Folder envelope and
   future batching gate are unchanged.
2. Archive is per Workspace, not per terminal pane. One Workspace still
   projects at most one explicit Task Folder using Phase 3J selection rules.
3. An archived insufficient-evidence non-Pi presentation uses the neutral
   employee fallback; no identity is guessed.
4. Long titles truncate visually in the narrow cabinet; the full functional
   identity remains in accessible labels.
5. Archive has no timestamp, history, bulk action, automatic rule, TTL, or
   completion meaning by design.
6. The existing disposable no-remote fixture emits expected background
   base-ref fetch warnings; this is not an archive failure.
7. Grok activation remains deferred, and Tier 2 lifecycle remains untracked.

## 16. Recommended next phase

Stop and dogfood Archive Intent v0.1 as shipped. The next brief should be
authorized only after product review of daily organization behavior, especially
whether users can reliably distinguish Archive, Remove from Sidebar, and
destructive cleanup.

If accepted, the next scoped investigation may evaluate explicit cleanup
entry-point language and retention policy using the Phase 3K proposal. It must
not infer completion, automatically archive/delete work, add a Task entity, or
expand Runtime/Pi/Git/PTY architecture without a new approved contract.

Do not begin another phase from this report.
