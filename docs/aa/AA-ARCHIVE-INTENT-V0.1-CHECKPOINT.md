# AA Archive Intent v0.1 Checkpoint

## Status

Phase 3L is complete on baseline
`7bf637be484769ad5f39612c13b8c52c33eb994d`. The exact runnable implementation
revision is `48fc579ae6e8202478ed7d5bcfeea227d33d4100`; this checkpoint and the Phase
3L report are the documentation closeout immediately after it.

## Accepted product model

```text
Existing Workspace / Work Folder
→ activeTasksArchived = false
   → Phase 3J current evidence groups
→ activeTasksArchived = true
   → collapsed ARCHIVED group
   → independent LIVE / RESUMABLE / UNTRACKED / SESSION UNAVAILABLE evidence
```

Archive is reversible organization intent only. It is not completion,
inactivity, priority, deletion, cleanup, terminal closure, or resume state.

## Accepted persistence contract

- One Host SQLite Workspace column:
  `active_tasks_archived INTEGER NOT NULL DEFAULT false`.
- One normal generated migration; existing rows become false without
  heuristics.
- One protected idempotent setter:
  `workspace.setActiveTasksArchived({ id, archived })`.
- Canonical Workspace read model and `workspace:changed` event carry the field.
- New Task and all other creation paths receive false through the schema
  default; Renderer optimistic rows also start false.
- No archive timestamp, history, actor, reason, Task entity, or localStorage
  copy exists.

## Accepted projection contract

Unarchived classification keeps the Phase 3J authority order: exact live
Runtime, exact Pi resume candidate, explicit compatibility launch, or omission.

Archived rows preserve independent evidence:

- `PI · LIVE · <lifecycle>`;
- `PI · RESUMABLE`;
- `PI · SESSION UNAVAILABLE`;
- known compatibility employee + `UNTRACKED`.

Archived ordering follows stable sidebar order. Duplicate-title suffixes remain
stable across archive/unarchive, reload, and restart. Row selection only opens
the real Workspace.

## Accepted interaction contract

- Active Tasks rows expose a separate Archive action.
- Durable Task Folder details expose Archive even when no Active Tasks row
  exists.
- Archived rows and Task Folder expose Unarchive.
- The existing toast supplies working Undo.
- Host-offline and pending states disable the write clearly.
- Archive/Unarchive call only the boolean setter.
- Current evidence alone determines placement after Unarchive.
- Remove from Sidebar, Close Session, and Delete remain separate existing
  infrastructure operations.

## Runtime and restart checkpoint

- Archiving real Pi `WORKING` kept state, native identity, and epoch unchanged.
- Archiving Superset CLI kept its terminal and `UNTRACKED` evidence.
- Two full Electron/Host restart cycles preserved the SQLite boolean.
- Exact Pi resume while archived kept native identity
  `9dad8e20be26`, changed epoch from `8d67684baaf7` to `5914b4b71995`,
  and left archive intent true.
- Renderer reload retained the resumed Runtime truth and archive state.
- Unarchive changed neither runtime identity nor epoch and did not auto-resume.

Fingerprints are truncated SHA-256 values; raw runtime identities are not
retained.

## Real acceptance checkpoint

- Ten real Work Folders existed together in a disposable Briefcase.
- Eight archived rows rendered together at 1440×800 and 1920×976.
- Live `IDLE`, live `WORKING`, exact `RESUMABLE`, `SESSION UNAVAILABLE`, and
  Superset CLI `UNTRACKED` were all exercised.
- One archived task retained a real changed-file count of one.
- Duplicate-title rows remained distinguishable and separately navigable.
- Keyboard Archive, Task Folder Archive, Undo, Unarchive, and row navigation
  passed.
- New Task, terminal input/focus, Files, Changes, Diff, Review, route
  navigation, Renderer reload, and reduced motion passed.
- Remove from Sidebar remained a separate context-menu action; cleanup
  preflight still blocked main and detected dirty/unpushed disposable work.

## Verification checkpoint

- Focused archive tests: 24 passed.
- AA/Runtime/Pi/resume regressions: 248 passed.
- Full Host Service suite: passed.
- Desktop, Host Service, Workspace Client, Session Protocol, and full-repo
  TypeScript: passed.
- Root lint: passed across 6,012 files.
- `git diff --check`, RED-area audit, and sensitive-evidence scan: passed.

## Change boundary

The authorized Host change is limited to the Workspace field, migration,
read-model/event propagation, and one idempotent setter. AA projection,
controls, styling, and optimistic cache integration remain in Renderer.

No Runtime Contract, Pi bridge, terminal-agent persistence, terminal/xterm,
PTY daemon, Git/worktree/branch, cleanup/delete, native chat, Grok, Tier 2
tracking, or Task database behavior changed.

## Evidence

Sanitized facts and AA-only screenshots are under
`docs/aa/new-task-flow/v0.1-archive-intent/`. They exclude credentials,
absolute paths, raw IDs, terminal content, prompts, transcripts, and private
repository content.

## Known limits

- Archived evidence retains the accepted per-Workspace read fan-out.
- Archive is Workspace-scoped and has no timestamp/history/bulk operation.
- Insufficient evidence remains unavailable rather than guessed.
- Long titles visually truncate but remain complete to assistive technology.
- Archive remains intentionally separate from cleanup and completion.
- Grok activation and Tier 2 lifecycle remain deferred.

## Stop condition

Stop here. Review and dogfood Archive Intent v0.1 before authoring or beginning
another phase.
