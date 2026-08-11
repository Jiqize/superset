# Phase 3K — Task Retention & Evidence Durability Report

## 1. Executive verdict

**PASS — the observation spike is complete. No product behavior was changed.**

The exact archive outcome is:

> **PROCEED WITH ONE MINIMAL PERSISTED ARCHIVE FIELD**

The existing AA Work Folder, pane, Runtime, Pi resume, and Git evidence is
enough to keep Active Tasks as a truthful projection. It is not enough to
derive a user's explicit retention intent. Absence of a live Runtime or exact
resume candidate means only “session unavailable”; it never means archived,
done, abandoned, or safe to delete.

A Task entity is not justified. The smallest future persistence unit is one
Workspace-owned boolean, proposed as `activeTasksArchived`, defaulting to
`false` in Host SQLite. It would store only explicit organization intent and
would remain independent of Runtime, resume, Git, prompt, transcript, and
completion truth. This report does not implement that field.

The 10-task production-UI dogfood reached 17 Work Folders and 13 simultaneously
projected rows. The hierarchy remained understandable, exact Pi resume stayed
strict, and no stale live state survived either complete Electron/Host restart.
The principal product gap is now explicit retention, not a missing Task model.

## 2. 10+ task dogfood result

### Baseline and environment

Fast-forward-only synchronization and baseline confirmation used:

```text
git pull --ff-only origin aa-spike
git rev-parse HEAD
git merge-base --is-ancestor f051062f9297924418c8dc8ba4fb27c21ed0b40f HEAD
git show -s --format='%H %s' f051062f9297924418c8dc8ba4fb27c21ed0b40f
```

The checked-out baseline was exactly
`f051062f9297924418c8dc8ba4fb27c21ed0b40f` before this documentation-only
work began.

| Item | Value |
| --- | --- |
| Platform | macOS 26.4 (25E246), arm64 |
| Bun | 1.3.14 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Desktop | Local development build, guarded isolated disposable profile |
| Project | Disposable local one-commit Git project with no remote |
| Viewports | 1440×800 and 1920×976 logical pixels |

The matched renderer used port 3005, the isolated profile's authenticated
session, and the expected Phase 3J disposable project route. Visible controls
were operated with real Chromium pointer and keyboard events through CDP.
Read-only DOM inspection located controls and recorded visible facts; it did
not invoke product methods or synthesize Runtime evidence.

### Acceptance facts

| Exercise | Result |
| --- | --- |
| Production `NEW TASK` submissions | 10 passed |
| Work Folders after creation | 17 |
| Eligible Task Folders at peak | At least 13; 13 rows projected together |
| Projected Active Task rows at peak | 13 |
| Rows after intentional clean Pi end | 12 |
| Duplicate-title pair | Passed; `#CC88` and `#BE05` distinguished it |
| Concurrent real Pi lifecycle | `WORKING` and `IDLE` visible together |
| Real changed tasks | 3 observed; requirement was 2 |
| Tier 2 compatibility | Existing Grok task remained `UNTRACKED` |
| Repeated task-row switching | Passed |
| Renderer reload | Passed; 17 Work Folders and 12 rows reconstructed |
| Full Electron/Host restarts | 2 passed |
| Exact Pi resumes | 3 passed; requirement was at least 2 |
| Keyboard navigation | Tab moved between rows; Enter opened the focused row |

The harmless synthetic prompts asked Pi either to retain a label or create a
small text file. No prompt or terminal transcript is preserved in evidence.
Three tasks exposed a real nonzero changed-file count across the run.

The development console retained three pre-existing/environmental findings:

- the known `DockBadgeController` render-time update warning;
- Electric's HTTP development guidance;
- background base-ref fetch failures because the disposable project
  intentionally has no `origin` remote.

None blocked the test. In accordance with the brief, none was proactively
fixed.

## 3. Active Tasks usability at both viewports

At **1440×800**, the project-local `NEW TASK`, current row, and eight additional
live rows remained legible at normal cabinet width. The selected navy row,
employee, lifecycle light, duplicate suffix, and changed count stayed distinct.
The saved and compatibility groups moved below the fold, so the user must
scroll the cabinet to see every one of the 12 projected rows. This is usable,
but no longer a single-glance overview.

At **1920×976**, the same 12 rows, all evidence groups, the collapsed 17-item
Work Folder disclosure, and the compatibility row were visible together. No
terminal width, xterm sizing, or pane geometry changed.

Expanding all 17 Work Folders produces a necessarily long cabinet. The
secondary disclosure still works, but it confirms the product need for a
reversible retention control before AA targets substantially larger
Briefcases. The existing Setup scripts card also competes for vertical space
at 1440×800; that is a separate established Superset surface and was not
changed during this spike.

Verdict: the hierarchy remains usable in the requested 10–20 Work Folder
range, with expected sidebar scrolling at compact height. Do not add a task
dashboard or redesign the hierarchy yet.

## 4. Evidence durability matrix

Legend:

- **AD** — authoritative and durable
- **AL** — authoritative but live-only
- **PP** — persisted presentation only
- **—** — unavailable
- **UI** — unsafe to infer

| Evidence | Live app | Renderer reload | Full app restart | Pi process exit | Exact Pi resume | Intentional end / no candidate | Workspace removal | Worktree removal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Explicit Task Folder title | PP | PP | PP | PP | PP | PP | — | PP |
| Workspace identity/project ownership | AD | AD | AD | AD | AD | AD | — | AD |
| Pane layout/title metadata | PP | PP | PP | PP | PP | PP | — | PP |
| Terminal launch identity | PP | PP | PP | PP | PP | PP | — | PP |
| Live Runtime snapshot | AL | AL | — | — | AL | — | — | AL |
| Saved Pi resume candidate | AD | AD | AD | UI | — | — | — | UI |
| Changed-file count | AD | AD | AD | AD | AD | AD | — | — |
| Git branch/worktree existence | AD | AD | AD | AD | AD | AD | UI | UI |
| PR/delivery state, if applicable | AD | AD | AD | AD | AD | AD | UI | AD |
| Compatibility employee identity | PP | PP | PP | PP | PP | PP | — | PP |

Important qualifications:

1. Task title, pane layout, and launch identity survive through the
   organization-scoped `v2-workspace-local-state-*` localStorage collection.
   They are durable UI presentation, not authoritative task or runtime state.
2. Workspace/project ownership is Host SQLite truth. A manually missing
   worktree does not erase that record, so it does not prove the checkout still
   exists.
3. Runtime snapshots live in the Host's in-memory AA Runtime registry. They
   survive a Renderer reload but not a complete Host restart without fresh
   lifecycle evidence.
4. Resume candidates are durable Host SQLite capability records, not history.
   Pi process exit by itself is insufficient: only a terminal-exited binding
   with captured session ID and progress beyond `Attached` qualifies.
5. Changed count is recomputed from staged and unstaged Git paths. The count is
   not stored, but its source remains durable while the worktree exists.
6. Branch and worktree must be checked separately after cleanup. Removing a
   worktree does not imply deleting its branch.
7. Workspace removal drops the local PR link; it does not prove a remote PR was
   deleted. The Phase 3K fixture had no PR, so PR durability is code-inspection
   evidence rather than a live GitHub test.

The machine-readable version is
`docs/aa/new-task-flow/v0.1-retention-spike/durability-matrix.json`.

## 5. Non-resumable and end-of-session findings

One idle Pi task was opened through its projected row and ended inside the real
Pi TUI with `/quit`. After the lifecycle settled:

- its Active Tasks row disappeared;
- no exact resume candidate appeared;
- the Briefcase still contained 17 Work Folders;
- the named Work Folder remained visible and navigable in the secondary list;
- its Workspace/project identity, worktree/branch, explicit title, pane
  presentation, and Pi launch identity still existed;
- its prior live lifecycle was no longer available.

This is the correct current classification. A clean agent detach is final for
resume purposes. `packages/host-service/src/terminal-agents/persistence.ts`
only returns a candidate when the binding ended as `terminal-exited`, captured
an agent session ID, and progressed beyond `Attached`. A detached binding is
not resumable. A detach within the 30-second terminal “death gasp” window may
be upgraded to `terminal-exited`, but a normal `/quit` remains final.

There is **no dedicated New Task provenance field**. The remaining title and
launch metadata is consistent with a New Task, but the same presentation can
also be produced by later title/assignment actions. It is therefore unsafe to
claim “created by New Task” as authoritative history after the session ends.
The trustworthy statement is narrower: this real Work Folder has explicit
Task Folder presentation and a persisted Pi launch identity, while its Pi
session is unavailable.

This gap does not justify a Task entity. It does explain why Work Folders must
remain the durable navigation fallback and why future Archive must be explicit
user intent rather than inferred from session loss.

## 6. Archive recommendation

### PROCEED WITH ONE MINIMAL PERSISTED ARCHIVE FIELD

Archive cannot be derived from any current state:

- no live Runtime may mean app restart, clean exit, or merely no new evidence;
- no resume candidate means only that exact resume is unavailable;
- zero changed files does not mean done;
- a stopped/closed terminal is not completion;
- `isHidden` means sidebar visibility and currently clears pane layout;
- Workspace/worktree deletion is destructive cleanup, not organization.

The proposal is one Host SQLite field on the existing Workspace record:

```text
activeTasksArchived: boolean = false
```

The scope in the name is intentional. It must not mean “Workspace deleted,”
“session closed,” or “task completed.” A boolean is preferable to an archive
timestamp for v0.1 because ordering/history is out of scope and the only fact
needed is current explicit intent.

When true, the Work Folder leaves the active evidence groups and may appear in
a collapsed `ARCHIVED` group. Its independent facts continue to update and can
be shown together, for example:

```text
ARCHIVED
PI SESSION UNAVAILABLE
3 CHANGED
```

Unarchive sets the same field to `false`. Archive must never alter Runtime,
resume candidates, terminals, panes, Git, worktrees, branches, PRs, or changed
files.

The field belongs to Host SQLite because it is unbounded Workspace-owned state.
Renderer localStorage policy explicitly reserves localStorage for bounded
singleton UI state. A future implementation would cross a RED-area schema/API
boundary and therefore requires its own authorized brief and migration; this
spike does not cross it.

## 7. Cleanup safety matrix

| Future action | Existing API/path | Reversibility | Dirty and unpushed behavior | Live agent / saved resume behavior | Confirmation | Product home |
| --- | --- | --- | --- | --- | --- | --- |
| Hide/Archive from active projection | No archive API today; proposed Workspace boolean | Fully reversible by Unarchive | No effect | No effect; evidence remains independent | No destructive dialog; Undo is appropriate | AA |
| Close live Pi session | `terminal.killSession({workspaceId, terminalId})` | Partial; exact resume may or may not result | No effect on Git | Terminates PTY and marks terminal exited; may create exact candidate only when requirements hold | Required when a process is running | AA may expose as clearly named session action |
| Remove saved resume binding | **No safe public operation exists** | Destructive to exact resume | No effect on Git | Would intentionally discard recovery capability | Required if ever added | Keep out of v0.1; new RED runtime semantic required |
| Close terminal panes | Pane registry `onBeforeClose`/`onAfterClose`; terminal close normally kills session unless explicitly backgrounded | Partial; pane layout is lost, session may become resumable | No effect on Git | Confirms a running process, disposes runtime registry entry, then kills terminal; background intent is separate | Existing running-process confirmation | Existing Superset pane infrastructure |
| Remove Workspace record | Only safely as part of `workspaceCleanup.destroy`; do not call low-level delete alone | Destructive to AA navigation and local link state | Dirty blocks unless explicit force; unpushed is warned | Cleanup disposes all Workspace PTYs; resume metadata is no longer usable | Strong destructive confirmation | Advanced Superset infrastructure |
| Delete Git worktree | `workspaceCleanup.destroy` worktree phase, double-force after consent | Destructive to checkout; committed branch may remain | Dirty blocks unless force; missing/broken worktree is handled idempotently/best effort | All Workspace PTYs are disposed first | Strong confirmation including dirty/unpushed warnings | Advanced Superset infrastructure |
| Delete generated branch | Optional `deleteBranch` phase in `workspaceCleanup.destroy` using `-D` | Destructive locally; remote ref is separate | Unpushed/unmerged commits can be lost; checkbox is explicit consent | Runs after Workspace commit point; no session effect beyond prior cleanup | Separate unchecked-by-default consent | Advanced Superset infrastructure |

Additional boundaries:

- `workspaceCleanup.inspect` blocks main Workspace deletion, reports dirty and
  unpushed state, and fails closed on indeterminate destructive Git checks.
- Unpushed commits are counted against all remotes and presented as a warning;
  dirty changes require a force retry.
- Cleanup does not include live AA Runtime, resume-candidate, or PR status in
  its preflight response. It kills Workspace PTYs during destruction and does
  not delete a remote PR.
- Current **Remove from Sidebar** is not Archive. It writes an `isHidden`
  tombstone, releases renderer pane runtimes, and replaces the pane layout with
  an empty layout. It is reversible only as sidebar visibility and is lossy for
  Task Folder presentation.
- `terminalAgents.clearWorkspaceStatuses` is only a status escape hatch. It
  neither closes a session nor removes a resume binding and must not be reused
  for cleanup.

## 8. Projection scale and query-cost findings

`useAAActiveTasksProjection.ts` selects eligible rows only when all of these are
true: same project, not hidden, real Host Workspace, and explicit Task Folder
terminal evidence. It then issues three initial Host reads per eligible Work
Folder—even if the pure projection later omits the row:

1. `aaRuntime.list`
2. `terminalAgents.resumeCandidate`
3. `git.getStatus` at background priority

| Eligible Work Folders | Initial Host reads | Logical event listeners |
| ---: | ---: | ---: |
| 5 | 15 | 20 |
| 10 | 30 | 40 |
| 13, observed minimum | 39 | 52 |
| 20, estimated | 60 | 80 |

Each target listens for `aa-runtime:changed`, `agent:lifecycle`,
`terminal:lifecycle`, and `git:changed`, while retaining the shared event bus.
Runtime reads are stale after 30 seconds, resume reads after 15 seconds, and Git
reads remain fresh until a Git event invalidates them. There is no polling and
Git does not refetch on focus.

The Phase 3K Briefcase had 17 Work Folders and a peak of 13 projected rows, so
13 is the UI-proven minimum eligible count: at least 39 initial reads and 52
logical event listeners. A Task Folder later omitted by the pure projection can
still be an eligible query target, so the true fan-out may be higher and is not
claimed from UI evidence alone. Whole-renderer navigation/DOM-ready
observations ranged from 2.822 to 3.104 seconds across reload and restart runs.
This includes dev renderer and route hydration and is **not** an isolated query
benchmark. No projection-specific Host failure or input/navigation stall was
observed.

Decision: keep the current event-driven per-Workspace implementation for the
current 20-Work-Folder envelope. Do not add a batched endpoint yet.

Use this explicit future batching gate: revisit before AA promises more than 20
eligible Work Folders, or when a controlled 20-folder run on two consecutive
clean starts takes more than five seconds to settle all evidence, emits Host
worker/backpressure errors, or causes observable input/navigation stalls. A
future batch must preserve exact Workspace+terminal joins and event-driven
invalidation; query count alone does not authorize a Runtime rewrite.

## 9. Duplicate-title and restart observations

The new duplicate pair appeared simultaneously as `Retention duplicate
sample #CC88` and `Retention duplicate sample #BE05`. Both were separately
focusable and opened distinct Work Folders. Renderer reload preserved the pair
and its discriminators.

After the first complete Host restart, neither duplicate had an exact resume
candidate, so both were truthfully omitted from Active Tasks while both named
Work Folders remained. Their disappearance was evidence gating, not title
deduplication or data loss. The deterministic discriminator continues to be
derived from Workspace identity and does not make title a key.

This run therefore confirms two different durability facts:

- duplicate titles and Work Folder identity survive restart;
- duplicate rows only reconstruct when each row independently retains live,
  exact resume, or explicit compatibility evidence.

The prior accepted Phase 3J run already demonstrated discriminator stability
for duplicate rows that did retain exact resume candidates. No new duplicate
persistence mechanism is needed.

## 10. Pi exact-resume regression

Before restart, the larger Briefcase showed real `IDLE` and `WORKING` Pi rows.
The intentionally clean-ended row had already disappeared.

The first full Electron/Host restart produced:

- 0 stale `LIVE` rows;
- 3 exact `PI · RESUMABLE` rows;
- 1 compatibility `UNTRACKED` row;
- unchanged Work Folder count of 17;
- real Git counts recomputed from the surviving worktrees.

Two saved Pi sessions were resumed through the visible `RESUME PI SESSION`
action. Each matching row alone became `LIVE · IDLE`; no sibling inherited its
lifecycle. One resumed file task exposed its real changed count after resume.

After the second complete restart, only the still-valid unconsumed exact
candidate remained. It was resumed successfully as a third exact resume. The
previous candidates did not act as history after they had been consumed or
cleanly ended.

The strict subset is important: ten live Pi launches did not become ten saved
conversations. A candidate is exposed only when the existing persistence rules
can actually resume it. Active Tasks must continue to prefer omission over an
optimistic saved claim.

## 11. Tier 2 and Grok regression boundaries

The existing Grok compatibility task remained `GROK · UNTRACKED` before and
after both restarts. Its explicit employee identity came only from persisted
launch presentation. It never became `LIVE`, `IDLE`, `WORKING`, or
`RESUMABLE` without Tier 1 authority.

Grok was not authenticated, activated, or used for Runtime verification. Phase
3F remains deferred. Codex, Claude, Superset CLI, Grok, and other terminal CLIs
remain compatibility runtimes unless separately promoted by the Runtime
Contract. Archive must preserve the same boundary: archiving a compatibility
row cannot upgrade its runtime evidence.

## 12. Persistence-gap analysis

| Gap | Current consequence | Phase 3K conclusion |
| --- | --- | --- |
| No explicit archive intent | Session loss cannot distinguish “keep” from ordinary inactivity | Add one future Workspace boolean |
| No authoritative New Task provenance | Presentation can describe a Task Folder but cannot prove creation history | Do not add provenance or Task entity yet |
| Clean-ended Pi rows disappear | Durable work remains only under Work Folders | Correct today; future Archive can retain only explicit user choices |
| Remove from Sidebar clears pane layout | Task title/launch presentation is lost even if Workspace survives | Never alias it to Archive |
| No resume-binding removal API | User cannot separately forget a saved candidate | Keep out of v0.1; requires explicit Runtime design |
| No worktree-existence gate in Active Tasks | Manual external removal can leave presentation/runtime evidence and an unavailable Git count | Document; do not patch projection or Git semantics in this spike |
| No completion/history state | AA cannot say done or order old work by completion time | Intentional non-goal; do not infer |

The existing `workspaces.taskId` column is not an AA Task Folder entity and must
not be overloaded. The current evidence supports a Workspace-scoped archive
preference without transcript storage, a history timeline, completion state,
or a Jira-like model.

## 13. Architecture and RED-area review

### Boundaries inspected

The investigation stayed inside CODEBASE-MAP boundaries and inspected these
public seams without modifying them:

- AA projection:
  `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAActiveTasks/`
- Renderer local presentation:
  `apps/desktop/src/renderer/routes/_authenticated/providers/CollectionsProvider/`
- Host Workspace and cleanup:
  `packages/host-service/src/trpc/router/workspace/` and
  `packages/host-service/src/trpc/router/workspace-cleanup/`
- terminal session/resume persistence:
  `packages/host-service/src/terminal-agents/`,
  `packages/host-service/src/terminal/`, and
  `packages/host-service/src/trpc/router/terminal-agents/`
- live Runtime registry:
  `packages/host-service/src/runtime/aa-runtime/`
- Host local schema and PR projection:
  `packages/host-service/src/db/schema.ts` and
  `packages/host-service/src/trpc/router/pull-requests/`

No Renderer, Runtime, Host Service, PTY daemon, xterm, Git/worktree, database
schema, Runtime Contract, Pi bridge, Grok adapter, or Tier 2 product file was
modified. The only committed changes are this report, the proposal, and safe
evidence.

A future archive implementation would need explicit authorization for a narrow
RED-area change: Host SQLite Workspace schema/migration, Workspace read/mutate
interface, and corresponding Renderer projection. It must not touch
Session Protocol, AA Runtime registry, terminal-agent persistence, PTY, or Git
cleanup semantics.

### Verification

Verification results are recorded after the final documentation pass:

| Check | Result |
| --- | --- |
| Guarded real AA Office dogfood | 10 production New Tasks, 17 Work Folders, duplicate pair, mixed live lifecycle, clean end, two full restarts, and three exact resumes passed |
| AAOffice + New Task + Task Folder + Active Tasks + workspace-create + terminal-resume regressions | 179 passed, 0 failed, 306 expectations across 27 files |
| Session Protocol + Host AA Runtime + Pi persistence/resume + Grok boundary regressions | 90 passed, 0 failed, 239 expectations across 9 files |
| Desktop TypeScript, generated icons, and routes | Passed |
| Session Protocol TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Root `bun run lint:fix` | Passed; only the three new evidence JSON files required normalization |
| Root `bun run lint` | Passed; 6,006 files checked, no diagnostics |
| Evidence JSON parse and PNG format/dimension check | Passed |
| `git diff --check` | Passed |
| RED-area modification scan | Passed; every changed path is a requested `docs/aa` deliverable |
| Sensitive text and PNG metadata scan | Passed |
| Remote baseline recheck | `HEAD` and `origin/aa-spike` both remained at the required `f051062f...` baseline before the Phase 3K commit |

The sensitive-evidence review covers credentials, tokens, absolute user paths,
raw Workspace/terminal/session IDs, prompt/transcript text, and private
repository content. Screenshot evidence is cabinet-only and synthetic.

## 14. Recommended next implementation phase

If this proposal is accepted, the next phase should be narrowly titled
**Minimal Active Tasks Archive Intent v0.1** and should do only this:

1. add `activeTasksArchived: boolean = false` to the existing Host Workspace
   record through the normal migration process;
2. expose one read field and idempotent Archive/Unarchive mutation;
3. render a collapsed `ARCHIVED` group without changing Runtime evidence;
4. make Archive available from both a projected row and the durable Work Folder
   surface so a clean-ended Pi task can still be retained intentionally;
5. test live, resumable, untracked, session-unavailable, restart, unarchive,
   and Workspace deletion behavior;
6. leave Close Session, saved-resume removal, worktree/branch deletion,
   completion, history, native chat, orchestration, and Grok activation out of
   scope.

Do not begin that phase from this report. Phase 3K stops with the architecture
decision and evidence.

Safe evidence is indexed under
`docs/aa/new-task-flow/v0.1-retention-spike/`.
