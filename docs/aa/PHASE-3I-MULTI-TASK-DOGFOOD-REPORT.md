# Phase 3I — Multi-Task Dogfood and Briefcase Review

## 1. Executive verdict

**Decision: `PROCEED TO ACTIVE TASKS PROJECTION`.**

The Phase 3H New Task path remains operational under repeated real use. Five
production New Task submissions created five isolated Work Folders, five Git
worktrees, and five distinct Pi conversations. Task titles, Git truth, terminal
context, exact Pi identity, and resume state remained isolated across switching
and a full Electron/Host restart.

The Workspace-first Briefcase is still usable for distinct titles, but it is no
longer sufficient as the only daily task index. It cannot distinguish duplicate
titles safely at a glance, and after restart its small row glyphs do not tell the
user whether a task is live or merely saved. In this run, rows that had been
working retained animated-looking marks even though the Runtime Contract had no
live snapshots and every Pi conversation was only resumable.

The missing projection can be built from existing authoritative and persisted
inputs. No Task database or Runtime Contract change is justified by this pass.
No product code was changed.

## 2. Baseline, commit, and environment

The run started from a clean `aa-spike` branch and used fast-forward-only sync:

```text
git pull --ff-only origin aa-spike
git rev-parse HEAD
git merge-base --is-ancestor 5676220ea37dba20d1487586e14cd2efc1eee758 HEAD
```

The checked-out and remote commit was exactly
`5676220ea37dba20d1487586e14cd2efc1eee758`.

| Item | Value |
| --- | --- |
| Platform | macOS 26.4, arm64 |
| Bun | 1.3.14 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Primary viewport | 1440×800 logical pixels |
| Large viewport | 1920×976 logical pixels |
| QA profile | Guarded, disposable `phase-3i-multitask` profile |

The test project was a disposable one-commit local Git repository with no
remote. Native macOS file-picker automation was unavailable, so the fixture was
imported through the public Host project-setup interface, as permitted by the
brief. Every Work Folder and Pi process after that setup step was created by the
production `NEW TASK` path.

Electron interaction used real pointer and keyboard input through Chromium's
debugging protocol. It did not invoke DOM `.click()` or a private product
method. Public Host reads were limited to authoritative/sanitized verification
and public Host removal was used for cleanup.

## 3. Disposable Briefcase and five-task setup

One Briefcase contained `local` plus five production-created Work Folders. Four
different titles exercised normal scanning; a fifth deliberately repeated the
first title.

| Sidebar order after creation | Task / Work Folder title | Purpose |
| --- | --- | --- |
| 1, newest | `Add greeting helper file` | Duplicate-title pressure case |
| 2 | `Create summary.txt` | Distinct text-output request |
| 3 | `Create date_label.txt` | Distinct text-output request |
| 4 | `Add number formatter file` | Distinct code-output request |
| 5, oldest | `Add greeting helper file` | Distinct helper implementation |

The initial title was also the initial Pi task prompt. Installed Pi planning
extensions made two turns longer than this tiny fixture warranted; the summary
task had no changed file at restart, and the number-formatter task had one real
Pi task-metadata file but had not yet emitted the requested formatter. This did
not undermine the acceptance conditions: the date-label task was settled
`IDLE` with real output, the original greeting task was settled `IDLE` with
real output, and real uncommitted output remained across restart.

## 4. Repeated New Task creation results

Each submission took two user interaction groups from the Briefcase to a ready
Pi TUI:

1. activate `NEW TASK`;
2. enter the title and submit with Enter.

The title field received focus on open. The progress sheet closed only after
authoritative Pi identity arrived, and the xterm helper input held focus when
ready. No extra Work Folder selection or employee selection was required.

| Task | Sidebar and Work Folder label | First measured worker state | Changed files at measured point | Native Pi fingerprint | Immediately identifiable? |
| --- | --- | --- | ---: | --- | --- |
| Newer greeting duplicate | `Add greeting helper file` | `WORKING` | 0 | `f68afc1fa1e2` | No, because it duplicates the older title |
| Summary | `Create summary.txt` | `WORKING` | 0 | `07de7c98de1d` | Yes |
| Date label | `Create date_label.txt` | `IDLE` | 1 | `e04d7814eb1c` | Yes |
| Number formatter | `Add number formatter file` | `WORKING` | 1 | `bf33032c5859` | Yes |
| Older greeting | `Add greeting helper file` | `IDLE` | 5 | `6a3a383377fa` | No, once the duplicate existed |

The five fingerprints are distinct 12-character SHA-256 prefixes; no raw
native identity is retained. Git reported five isolated worktrees in addition
to `main`, each on a distinct generated branch.

Screenshots `01-one-task.png`, `02-three-tasks.png`, and
`03-five-tasks-1440.png` show the accumulation without exposing technical
identities.

## 5. Task-switching results

Repeatedly selecting the five Work Folder rows through the normal sidebar gave
the following results:

- the central Task Folder title always matched the selected row;
- the Pi Worker state and authoritative snapshot changed with the active pane;
- Files/Changes switched to the selected worktree;
- the date-label workspace exposed only `date_label.txt` as its user output;
- the older greeting workspace exposed its helper, test, and planning files;
- zero-change workspaces did not inherit another task's Files/Changes;
- every live workspace resolved to its own native Pi fingerprint;
- no terminal conversation or input focus moved into another Work Folder.

For four distinct titles, switching did not require remembering branch or
worktree names. With the duplicate title, the user had to rely on list position,
current selection, and then inspect central state or files. That is a navigation
failure, even though the underlying isolation remained correct.

The Pi TUI remained the real work surface. The installed planning extensions
also demonstrated why `IDLE`, `WORKING`, and changed count must not be treated as
task completion: a real changed file may be runtime-owned metadata rather than
the requested deliverable.

## 6. Duplicate-title observation

The two `Add greeting helper file` submissions produced distinct worktrees,
branches, terminals, and Pi native identities. Runtime/workspace integrity was
not corrupted.

Visible identity was weaker:

| Surface | Observation |
| --- | --- |
| Briefcase rows | Both primary labels were identical; only order and incidental state/count marks differed. |
| Work Folder header | Exact human title was preserved, but remained identical for both tasks. |
| Task Folder | Exact title was preserved and explicit after opening a row. |
| Pane/tab | The human title was restored when live; before exact resume, a technical shell/path-style label could appear. |
| Employee Profile | Pi identity/resume evidence is worker-centric and adds no duplicate task discriminator. |
| Resume surface | Exact candidate belonged to the active workspace, but duplicate selection still had to happen first. |

The current UI therefore protects data through workspace isolation but does not
protect the initial user choice. A future projection needs a stable,
non-semantic discriminator when two persisted human titles collide. It must not
invent a status or expose a raw UUID.

## 7. Full restart and exact resume

The isolated Electron/Host stack was fully stopped and started again with the
same guarded profile.

Before resuming anything:

- all five Work Folder titles were present;
- every workspace retained its Task Folder title;
- Runtime Contract queries returned zero live snapshots;
- every workspace had an authoritative Pi `SAVED / RESUMABLE` candidate;
- real Git counts remained reconstructable as `0`, `0`, `1`, `1`, and `5`;
- opening any row showed `OFFLINE / RESUMABLE` centrally;
- the sidebar did not state `RESUMABLE`, and previously busy rows still carried
  small animated-looking marks.

The older greeting task was resumed through the visible `RESUME PI SESSION`
action. The result was:

| Evidence | Before restart | After exact resume |
| --- | --- | --- |
| Native Pi fingerprint | `6a3a383377fa` | `6a3a383377fa` |
| Epoch fingerprint | `4ab01022d9de` | `3b5b06aa634f` |
| Worker | `IDLE` before shutdown | `IDLE` after confirmation |
| Task title | `Add greeting helper file` | Preserved exactly |
| Changed count | 5 before shutdown | 4 after recomputation |

The native identity was exact and the resumed process used a fresh epoch. The
changed-count shift was real Git truth: a Pi task-metadata file present before
shutdown was no longer part of the post-resume change set. A harmless no-tools
follow-up asking for the prior helper filename returned `greeting.ts`, confirming
conversation context continuity; that transcript was not retained.

`04-pre-restart.png`, `05-post-restart-saved.png`, and
`06-resumed-task.png` record safe portions of the journey.

## 8. Viewport and information-architecture review

### 1440×800

All five task rows plus `local` fit without document overflow or sidebar
scrolling. Rows remained compact at 32 logical pixels. `NEW TASK` stayed
high-contrast and visible beside the Briefcase name. Distinct titles scanned
quickly; duplicate titles did not.

The global `New Workspace` action remained larger than the project-local
`NEW TASK`, and a small legacy `+` also sat beside it. The accepted task path was
still discoverable, but three creation affordances competed for interpretation.

### 1920×976

The same rows remained fully visible with substantial unused vertical space and
no layout overflow. The larger viewport improved breathing room but did not add
state or identity information, so it did not solve duplicate or restart
ambiguity. See `07-large-viewport.png`.

Generated branch/worktree labels did not replace the human title in the primary
Briefcase row, which is good. They could still appear in pane/Git/status surfaces
and became more noticeable during restart transition.

## 9. Current hierarchy: strengths and failures

Strengths:

- `Briefcase → Work Folder` remains an understandable ownership hierarchy.
- Production New Task writes the human title into the Work Folder and Task
  Folder, avoiding a separate opaque workspace name for normal cases.
- The selected deep-navy row is clear.
- Five rows remain compact at both required viewports.
- Worktree, Git, Files/Changes, terminal, and Pi identities stay isolated.
- `NEW TASK` remains the strongest action inside the project cabinet.

Failures:

- a Work Folder row is being asked to serve as both storage identity and task
  status projection;
- small unlabeled glyphs cannot express `LIVE` versus `SAVED / RESUMABLE`;
- duplicate titles have no stable human-facing discriminator;
- changed count is most legible only on the active row and can include
  runtime-owned metadata;
- technical pane/Git labels leak through when the human task presentation is
  temporarily unavailable;
- the global New Workspace affordance competes with the Pi-first daily path.

An Active Tasks layer would not replace Work Folders. It would project their
current evidence at Briefcase scope and keep the existing rows as the durable
navigation target.

## 10. Derived Active Tasks feasibility

The prototype in `active-task-projection.json` used only allowed evidence:

- Project/Workspace ownership;
- persisted Work Folder and pane Task Folder title;
- terminal launch identity;
- authoritative live Runtime Contract snapshot;
- authoritative saved Pi resume candidate;
- real Git changed-file count.

It did not use terminal text, prompts, transcript parsing, elapsed-time guesses,
process titles, or inferred completion.

The projection was reconstructable after a complete Host restart. Before any
resume, all five rows classified as `SAVED / RESUMABLE`; after exact resume, one
row classified as `LIVE · IDLE` while the others remained saved. Current
persistence already carries the ownership, title, launch identity, resume
candidate, and Git data needed for this distinction.

Therefore a new Task database is not warranted. The Renderer can derive the
projection from existing Host/pane state and existing event/query boundaries.
It should not add expensive polling or copy runtime state into a new store of
record.

## 11. Sanitized prototype rows

Before resume, a truthful projection could have shown:

```text
Add greeting helper file  [newer duplicate]
PI · SAVED / RESUMABLE
0 changed

Create summary.txt
PI · SAVED / RESUMABLE
0 changed

Create date_label.txt
PI · SAVED / RESUMABLE
1 changed

Add number formatter file
PI · SAVED / RESUMABLE
1 changed

Add greeting helper file  [older duplicate]
PI · SAVED / RESUMABLE
5 changed
```

After exact resume, the older greeting row could truthfully become:

```text
Add greeting helper file
PI · LIVE · IDLE
4 changed
```

The bracketed duplicate labels above describe the test evidence, not proposed
copy. Production UI should derive a stable, compact discriminator from existing
Workspace identity/creation evidence only when names collide. Minimum row data
is: title, employee, evidence classification, live lifecycle only when live,
real changed count, and the collision discriminator when required.

`DONE` must not be inferred from `IDLE`, a zero count, or a Pi turn ending.

## 12. Findings ordered by severity

### HIGH — Duplicate titles are unsafe to choose by label alone

- **Step:** create a second task named `Add greeting helper file`, then return
  to the Briefcase.
- **Expected:** each isolated work item can be selected without remembering
  hidden implementation identity.
- **Actual:** both primary rows are identical; order and incidental glyph/count
  differences are the only cues.
- **Workaround:** open a row and verify Task Folder, Worker, and Files/Changes
  before editing.
- **Boundary:** Renderer information architecture; identity persistence is
  already correct.
- **Would Active Tasks solve it?** Yes, if it includes a stable duplicate
  discriminator and authoritative state/count.

### HIGH — Restarted rows imply activity without live runtime evidence

- **Step:** fully restart with several Pi tasks, inspect the Briefcase before
  any resume.
- **Expected:** saved work is distinguishable from live work.
- **Actual:** all five sessions were authoritative resume candidates with zero
  live snapshots, but rows previously seen as working retained small
  animated-looking activity marks and no `RESUMABLE` text.
- **Workaround:** open each workspace and read `OFFLINE / RESUMABLE` centrally.
- **Boundary:** Renderer projection; existing Host persistence already provides
  exact candidates.
- **Would Active Tasks solve it?** Yes. It should prefer live snapshots, then
  exact resume candidates, and never reuse stale presentation as runtime truth.

### MEDIUM — Human task identity temporarily yields to technical pane labels

- **Step:** inspect a task immediately before and after full restart, before
  exact resume.
- **Expected:** the human Task title remains the primary label across surfaces.
- **Actual:** Briefcase and Task Folder remained human-readable, but pane/header
  presentation could expose a generated branch or shell/path-style label.
- **Workaround:** use the Briefcase row and central Task Folder as authority.
- **Boundary:** Renderer/pane presentation; existing Superset behavior.
- **Would Active Tasks solve it?** It reduces reliance on the pane label but
  does not itself repair that surface.

### MEDIUM — Three creation affordances compete

- **Step:** view a populated Briefcase at either viewport.
- **Expected:** the accepted Pi-first `NEW TASK` path is cognitively primary.
- **Actual:** `NEW TASK` is strong within the project, but the larger global
  `New Workspace` and adjacent legacy `+` remain equally available.
- **Workaround:** use the clearly labeled project-local action.
- **Boundary:** Renderer navigation plus existing Superset behavior.
- **Would Active Tasks solve it?** No; creation hierarchy is a separate visual
  follow-up.

### MEDIUM — Changed count is truthful but not task completion

- **Step:** compare the number-formatter and greeting tasks while Pi planning
  extensions are active.
- **Expected:** output evidence is real and not presented as progress.
- **Actual:** one changed file could be Pi task metadata, and a count changed
  from five to four after exact resume as Git truth changed.
- **Workaround:** open Files/Changes; do not equate count or `IDLE` with `DONE`.
- **Boundary:** real Git/runtime-extension behavior.
- **Would Active Tasks solve it?** It can label the field only as `changed`; it
  must not claim deliverable completion.

### LOW — First-run setup card consumes Briefcase space

- **Step:** inspect the first task result before dismissing the setup notice.
- **Expected:** repeated task navigation owns the available cabinet area.
- **Actual:** the existing Setup scripts card occupied the lower sidebar.
- **Workaround:** dismiss it once.
- **Boundary:** existing Superset behavior.
- **Would Active Tasks solve it?** No.

No `BLOCKER` prevented the journey. The duplicate-title risk is serious, but
selection remains recoverable because the central Task Folder, active selected
state, and isolated Files/Changes allow verification before editing.

## 13. User interaction and friction observations

- New Task stayed at two interaction groups for all five submissions.
- Title autofocus, Enter submission, ready-state focus, workspace switching,
  and exact-resume focus behaved consistently.
- Sidebar order was newest-first. This helped recent work but made two identical
  names depend on memory of creation order.
- Distinct titles were enough for normal navigation; generated branch names
  were not needed until investigating ambiguity.
- The installed Pi extensions turned tiny requests into longer planning turns.
  AA continued to report real lifecycle state, but the experience reinforces
  that task completion cannot be inferred.
- The no-remote disposable fixture produced expected background fetch warnings.
  The run also retained the known Electric HTTP advisory and
  `DockBadgeController` render-time update warnings. None blocked product use.

## 14. Decision-gate recommendation

**`PROCEED TO ACTIVE TASKS PROJECTION`**

Keeping Workspace-first navigation alone would preserve a known duplicate and
restart-state burden. A persistence spike is unnecessary because the full
restart proved that existing state reconstructs title, ownership, exact resume
availability, and Git count. Reconsidering the whole task model is also
unwarranted: the New Task/worktree/session isolation contract worked.

This recommendation is a finding for the next approved brief. Phase 3I did not
implement it.

## 15. Implementation implications for a future brief

A future, separately approved implementation should stay Renderer-first and:

1. derive rows at Briefcase scope from existing Project/Workspace and pane
   title state;
2. classify evidence in strict order: authoritative live snapshot, exact saved
   Pi candidate, known compatibility launch as `UNTRACKED`, otherwise
   `INSUFFICIENT EVIDENCE`;
3. show the real Git changed-file count without interpreting it as progress;
4. use a stable, compact duplicate discriminator derived from existing
   Workspace identity/creation evidence only when titles collide;
5. navigate to the existing Work Folder rather than introduce a parallel task
   entity;
6. subscribe to existing changes or use existing query invalidation, not a new
   polling loop;
7. keep `DONE`, archive, completion, orchestration, Grok activation, and task
   persistence out of scope unless a later product contract explicitly adds
   them.

No Host Service lifecycle, Runtime Contract, PTY, Git/worktree, database, or Pi
adapter change is indicated.

## 16. Verification, cleanup, and security review

Automated verification:

| Suite | Result |
| --- | --- |
| New Task, AAOffice, sidebar, pane-layout, resume-title, hotkey, and focus regressions | 181 passed, 0 failed, 515 expectations across 27 files |
| Runtime Contract, Host registry/router, Pi bridge, terminal binding persistence/daemon loss, and exact-resume regressions | 96 passed, 0 failed, 247 expectations across 11 files |
| `git diff --check` | Passed |
| RED-area scan | Passed; only this report and safe evidence were added |
| Evidence sensitive-information scan | Passed |

Real acceptance covered five production New Task flows, normal task switching,
distinct Files/Changes, real Pi `WORKING` and `IDLE`, a deliberate duplicate,
1440×800 and 1920×976, full Electron/Host restart, five authoritative saved
candidates, and exact Pi resume with context continuity.

Cleanup completed through supported boundaries:

- the disposable Project/Workspace records were removed through public Host
  `project.remove`;
- clean generated worktrees were removed by that saga;
- the three dirty worktree remnants and source fixture were moved to the macOS
  Trash and remain recoverable;
- the guarded QA profile was removed by its marker-checked cleanup command;
- isolated Electron, Host, PTY, API, Electric, notification, Vite, and debugging
  processes were stopped;
- no listener from the run remained.

Evidence is cropped and fixture-only. It contains no credential, environment
dump, raw native session/epoch/terminal ID, project/Workspace UUID, local
worktree path, transcript, prompt history, or user repository content. Runtime
comparison uses only 12-character SHA-256 fingerprints.

No RED-area or production source file was modified. Phase 3I stops here; Active
Tasks and every other product phase remain unimplemented.
