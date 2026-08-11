# Phase 3J — Active Tasks Projection v0.1 Report

## 1. Executive verdict

**PASS — Active Tasks Projection v0.1 is implemented and accepted.**

The AA Briefcase now answers which persisted work is currently selected, live,
saved/resumable, or compatibility-only. It remains a pure Renderer projection
over existing Work Folders, persisted Task Folder presentation, authoritative
AA Runtime snapshots, exact Pi resume candidates, and current Git truth. It
adds no Task entity, persistence, polling loop, Runtime Contract change, or
Host/runtime primitive.

Five production New Tasks were exercised in one disposable Briefcase. The
projection safely distinguished a duplicate-title pair, opened every real Work
Folder, showed two real changed counts, reconstructed only exact resumable Pi
rows after a full restart, and transitioned only the explicitly resumed row
back to `LIVE`. Superset CLI remained `UNTRACKED`; Grok remained
authentication-gated with no live-runtime claim.

## 2. Baseline, commits, and environment

Fast-forward-only sync and baseline confirmation used:

```text
git pull --ff-only origin aa-spike
git rev-parse HEAD
git merge-base --is-ancestor c9471bec910ac11bf9a19495aa10c6d0d05922d2 HEAD
git show -s --format='%H %s' c9471bec910ac11bf9a19495aa10c6d0d05922d2
```

| Revision | Exact commit |
| --- | --- |
| Phase 3J brief / baseline | `c9471bec910ac11bf9a19495aa10c6d0d05922d2` |
| Runnable implementation and safe evidence | `0144aeb9b67501fab78cf0fa2de573d979d7b89c` |
| Report/checkpoint closeout | The documentation commit immediately following the implementation commit on `origin/aa-spike` |

The report cannot contain the hash of the commit that contains itself. The
exact pushed closeout SHA is therefore recorded in the delivery handoff and Git
history, following the same two-commit convention used by Phase 3H.

| Item | Value |
| --- | --- |
| Platform | macOS 26.4 (25E246), arm64 |
| Bun | 1.3.14 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Desktop | Local development build, isolated disposable profile |
| Primary viewport | 1440×800 logical pixels |
| Large viewport | 1920×976 logical pixels |
| Briefcase | Disposable local one-commit Git project with no remote |

The Electron UI was operated with real Chromium pointer and keyboard events
against the matched local renderer. Read-only DOM inspection located visible
controls and measured state; it did not invoke product methods or synthesize
runtime truth.

## 3. Projection inputs and authority precedence

The projection consumes only existing evidence:

1. `v2WorkspaceLocalState` supplies project ownership, stable sidebar order,
   persisted pane layout, explicit `taskTitleEdited` metadata, terminal ID, and
   launch identity.
2. `HostWorkspacesProvider` confirms the real Workspace/Briefcase relationship
   and resolves the existing Host URL.
3. `aaRuntime.list` supplies authoritative workspace- and terminal-scoped AA
   Runtime snapshots.
4. the existing terminal-agent resume-candidate query supplies exact durable
   Pi resume evidence.
5. the existing Git status query supplies staged and unstaged paths; duplicate
   paths are counted once.
6. the current route supplies selected/open Workspace identity.

Authority precedence is exact live Runtime snapshot, then exact Pi resume
candidate, then explicit compatibility launch identity, then omission for
insufficient evidence. Workspace and terminal identity must both match before
runtime or resume evidence can classify a row.

Updates remain event-driven. Existing `aa-runtime:changed` events update the
runtime query cache, existing agent/terminal lifecycle events invalidate resume
evidence, and existing `git:changed` events invalidate Git status. No timer or
new polling loop was added.

## 4. Classification rules

| Class | Required evidence | Presentation |
| --- | --- | --- |
| `LIVE` | Exact Workspace + terminal AA Runtime snapshot in `starting`, `idle`, `working`, either waiting state, `cancelling`, or `error` | Employee, `LIVE`, authoritative lifecycle |
| `SAVED / RESUMABLE` | No accepted live snapshot and exact resumable Pi candidate for the same terminal | `PI · RESUMABLE`, no copied lifecycle |
| `UNTRACKED` | Explicit non-Pi compatibility launch identity, without stronger authority | Known employee + `UNTRACKED` |
| Insufficient evidence | Missing explicit title/terminal evidence, or Pi with neither live nor exact saved evidence | No Active Task row; Work Folder remains available |

Both runtime waiting states map to the explicit `WAITING` lifecycle. Offline,
ended, and unknown runtime snapshots do not become live. An offline snapshot
can still fall through to an exact resume candidate. Pi launch metadata alone
never becomes an optimistic active row.

Changed count is the number of unique real paths in staged plus unstaged Git
status. It is labeled only `CHANGED` and is not completion or progress.

## 5. Duplicate-title solution

Visible titles are normalized with Unicode NFKC, collapsed whitespace, trim,
and case folding for collision detection. Only colliding rows receive a
discriminator.

The discriminator is a stable uppercase FNV-1a hash of existing Workspace
identity. It starts at four characters and expands up to eight when a prefix
collides. A deterministic rank is available for the pathological full-hash
collision case. The UI never displays the raw Workspace ID or path.

Pure tests prove normalized collisions, non-collision omission, stable suffixes
under input reordering/reconstruction, stable ordering, and distinct suffixes.
The real duplicate pair retained `#685C` and `#82CE` across renderer reload and
full restart.

## 6. Ordering rules

Rows use the following deterministic order:

1. selected/current Workspace;
2. remaining live rows;
3. remaining resumable rows;
4. remaining compatibility/untracked rows;
5. existing sidebar `tabOrder` inside a class;
6. Workspace identity only as a final invisible deterministic tie-break.

No priority, urgency, productivity, age, recency, or completion is inferred.
The selected row keeps its truthful evidence label even when placed in the
`ACTIVE TASKS · CURRENT` group.

## 7. Briefcase information architecture: before and after

Before Phase 3J, the expanded Briefcase exposed a flat Work Folder list. A row
identified storage, but did not safely distinguish duplicate titles or explain
live versus saved runtime evidence.

After Phase 3J, AA mode presents:

```text
BRIEFCASE
  NEW TASK
  ACTIVE TASKS · CURRENT
  ACTIVE TASKS
  SAVED / RESUMABLE
  UNTRACKED
  WORK FOLDERS (secondary disclosure)
```

Every projected row remains a button that navigates to the existing underlying
Workspace route. Selection does not launch or resume an agent. `WORK FOLDERS`
preserves the full sortable infrastructure list, including non-projectable
workspaces, without presenting it at equal visual weight.

The row contains a compact employee avatar, full accessible task identity,
employee, evidence class, live lifecycle when available, and real changed
count. The visual title may truncate at narrow width, while the `aria-label`
retains the full title, discriminator, evidence, and count.

## 8. Creation hierarchy cleanup

Project-local `NEW TASK` remains the high-contrast primary Briefcase action.
Only in AA mode:

- the global action reads `New Workspace · Advanced`;
- the adjacent legacy `+` is visually muted;
- its tooltip reads `Advanced: new workspace` when New Task is available.

The existing New Workspace behavior, route, and non-AA copy are unchanged.

## 9. Restart and exact-resume behavior

At the five-task measurement point, all five rows had exact live Runtime
evidence. A clean Electron/Host restart then produced:

- zero stale `LIVE`, `WORKING`, or `IDLE` rows before new runtime evidence;
- three `PI · RESUMABLE` rows backed by exact saved candidates;
- stable duplicate discriminators;
- Git counts recomputed from current worktree truth;
- two Pi Work Folders omitted from Active Tasks because their cleanly stopped
  sessions did not expose an exact resume candidate; both remained available
  under `WORK FOLDERS`.

The user activated the existing visible `RESUME PI SESSION` action for the
`#82CE` duplicate. Only that row transitioned to `PI · LIVE · IDLE`; the other
two exact candidates remained resumable and no lifecycle leaked across rows.
Selecting a saved row alone never auto-resumed it.

## 10. Real five-task acceptance

Five tasks were created through the production Phase 3H `NEW TASK` flow in one
disposable Briefcase:

| Measured row | Evidence | Changed |
| --- | --- | ---: |
| Gamma-file task (selected) | `PI · LIVE · IDLE` | 1 |
| Beta-file task | `PI · LIVE · IDLE` | 0 |
| Alpha-file task | `PI · LIVE · IDLE` | 1 |
| Duplicate-file task `#685C` | `PI · LIVE · IDLE` | 0 |
| Duplicate-file task `#82CE` | `PI · LIVE · WORKING` | 0 |

Acceptance results:

- five production task submissions created five independent real Work Folders;
- the duplicate-title pair was distinguishable before opening;
- activating each task row opened the matching Work Folder and Task Folder;
- real pointer navigation and Tab/Enter keyboard activation passed;
- terminal focus/input remained functional;
- Files and Changes switched with the selected worktree;
- a real untracked file opened in Diff with its expected harmless content;
- live lifecycle came only from authoritative snapshots;
- at least one Pi task was settled before restart;
- full restart and one exact resume behaved as described above;
- Work Folder disclosure and direct navigation remained available;
- Superset CLI projected as `UNTRACKED`;
- a real Grok launch reached its existing authentication boundary, was not
  authenticated, and produced no live-runtime claim.

No prompt transcript, terminal history, runtime identifier, or private content
was retained as evidence.

## 11. Density review

At 1440×800, all five projected rows, all group headers, `NEW TASK`, and the
collapsed Work Folder disclosure fit in the Briefcase without sidebar
scrolling. The selected deep-navy row, amber working light, evidence labels,
counts, and duplicate suffixes remained legible. Long task titles truncate
instead of widening the cabinet.

At 1920×976, the same compact density held with additional vertical room and no
layout shift. The projection did not consume terminal width or alter xterm/pane
layout. Retina crops are stored at twice the logical height; their filenames
record the tested logical viewport.

## 12. Automated verification

| Command or suite | Result |
| --- | --- |
| AAOffice + New Task + Task Folder + Pi status/resume + workspace-create + sidebar + terminal resume regressions | 179 passed, 0 failed, 306 expectations across 27 files |
| Session Protocol + Host Runtime registry/router + Pi bridge + terminal-agent persistence/resume + Grok boundary regressions | 65 passed, 0 failed, 196 expectations across 9 files |
| Desktop TypeScript, generated icons, and routes | Passed |
| Session Protocol TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Root `bun run lint:fix` | Passed after disposable QA profile was removed from the repository tree |
| Root `bun run lint` | Passed; 6,003 files checked, no diagnostics |
| `git diff --check` | Passed |
| RED-area modification scan | Passed |
| Sensitive evidence scan | Passed |

The required root lint normalization made format-only changes to the existing
`docs/aa/design/assets-manifest.json` and `docs/aa/design/tokens.json`; their
data is unchanged.

The development console retained existing Electric HTTP guidance,
`DockBadgeController` render-time update warnings, and the expected background
fetch failure for a disposable repository without `origin`. No new Phase 3J
application error remained after a clean full restart.

## 13. Security and RED-area review

Product changes are limited to the new AAOffice projection, AA CSS, and narrow
Renderer sidebar composition/copy. No Host Service behavior, PTY daemon,
Desktop main process, xterm transport, Git/worktree implementation, database
schema, Runtime Contract, Pi bridge, Grok adapter, or Tier 2 lifecycle code was
modified.

The projection does not parse xterm text, prompts, transcripts, process titles,
branches, worktree paths, or elapsed time. It adds no persistence and no
polling. Runtime/terminal/Workspace IDs are used only for exact in-memory joins
and opaque collision hashing.

Evidence contains synthetic task names and sidebar-only crops. Scans found no
credential, token, absolute user path, UUID, raw Workspace/terminal/native
session identity, prompt/transcript, or private repository content.

## 14. Known limitations

1. A Pi Work Folder with neither current live authority nor an exact saved
   candidate is intentionally omitted rather than guessed. It remains under
   `WORK FOLDERS`; two such rows were observed after the clean restart.
2. One Work Folder produces at most one Active Task row. If it contains several
   explicitly titled terminal panes, the active tab/pane is preferred, then the
   existing persisted pane order.
3. Long titles truncate visually in the narrow cabinet. Full accessible labels
   remain available, but there is no dedicated hover expansion yet.
4. Changed count includes every real staged/unstaged path, including possible
   agent-owned metadata. It must not be read as deliverable or progress.
5. Evidence queries are event-driven but currently run per eligible Work
   Folder. Very large Briefcases need measurement before batching is justified.
6. The existing setup-scripts onboarding card can occupy lower sidebar space
   in a fresh disposable profile; it did not block the five-row acceptance.
7. Grok remains authentication-gated and Phase 3F remains deferred.
8. No completion, archive, cleanup, priority, due date, tag, or history model
   exists, by design.

## 15. Recommended next phase

First run a short daily-workflow observation pass with this projection as
shipped, including larger Briefcases and repeated restart/resume. The next
implementation should be authorized only after that review.

If the projection remains accepted, the most useful scoped investigation is a
**task retention/cleanup and evidence-durability spike**: explain when a Work
Folder stops being projectable, measure per-workspace evidence-query cost, and
define an explicit user-controlled archive/cleanup boundary without inferring
`DONE`. It must remain separate from native chat, orchestration, Grok
activation, or Runtime Contract expansion.

Stop here. Phase 3J does not begin another product phase.
