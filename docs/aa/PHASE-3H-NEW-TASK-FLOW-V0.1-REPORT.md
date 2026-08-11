# Phase 3H — New Task Flow v0.1 Report

## 1. Executive verdict

Phase 3H is complete and accepted. The production New Task Flow now turns a
real Briefcase and one short task title into an isolated Git work folder, one
new Pi terminal conversation, a persisted Task Folder title, an authoritative
Pi Runtime Contract binding, and focused real xterm input.

The accepted normal path is now:

```text
Open Briefcase
→ NEW TASK
→ type task title
→ Enter
→ real Pi TUI focused and ready
```

The implementation reuses the bundled Host `workspaces.create` operation and
the existing pane/runtime infrastructure. It adds no task database, Host
transaction, runtime adapter, terminal parser, transcript store, Git/worktree
primitive, or automatic agent workflow.

## 2. Baseline, final revision, and environment

The branch was fast-forwarded from `origin/aa-spike`, and
`d57858aff388a7742e9653674425996ced37362a` was confirmed as the exact Phase 3H
baseline and remote tip before edits. The final runnable implementation and
safe-evidence revision is `1e79ad59581196233ff3c2a6081683d7171d7763`; this report and the
checkpoint are committed immediately after it as documentation closeout.

| Item | Value |
| --- | --- |
| Host | macOS 26.4 (`25E246`), Apple Silicon (`arm64`) |
| Bun / Node | 1.3.14 / 24.14.0 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Codex / Grok | 0.144.6 / 0.2.87 (`0ae0bf47e53`) |
| Primary QA viewport | 1440×800 logical pixels |
| Secondary viewport | 1920×976 logical pixels |
| QA state | Guarded `phase-3h-new-task` profile and disposable local Git project |

Before implementation, the exact focused spike baseline reproduced 129
passing tests, 0 failures, and 245 expectations.

## 3. Implementation architecture

The production coordinator is Renderer-local and follows the accepted one-call
boundary:

```text
Briefcase NEW TASK
→ validate and normalize title
→ select first ordered real Host Pi config
→ mint Workspace UUID and collision-safe branch input
→ submit one existing workspaces.create request with one Pi launch
→ write explicit Task Folder presentation with the returned Pi pane
→ reconcile canonical Workspace ID and navigate
→ wait for matching authoritative Pi identity plus open xterm
→ focus the real terminal
```

New presentation and coordination code lives under
`AAOffice/AANewTask/`:

- `aaNewTaskPresentation.ts` — title, Pi selection, branch, and request
  contracts;
- `aaNewTaskFlowStore.ts` — ephemeral flow state and typed failure boundaries;
- `aaNewTaskRuntime.ts` — authoritative matching/confirmation classifier;
- `AANewTaskDialog.tsx` and `AANewTaskBranchPicker.tsx` — dispatch input;
- `AANewTaskProgress.tsx` — truthful provisioning and recovery surface;
- `AANewTaskWorkspaceGate.tsx` — pane/title/xterm/runtime gate and focus;
- `aaNewTaskFlow.ts` and `index.ts` — local store binding and exports.

The narrow YELLOW integrations are limited to:

- dashboard/sidebar composition for the AA-only project-local entry;
- the existing Renderer workspace-create result and initial pane-layout path;
- the V2 workspace page for the gate;
- exact-resume title carry-forward from a single-pane tab.

## 4. New Task input and naming contracts

- Title input reuses `normalizeAATaskFolderTitleInput`: whitespace is
  normalized, empty input is rejected, Unicode is retained, and the existing
  48-codepoint Task Folder bound applies.
- The normalized title is the exact initial Pi prompt. No terminal-history
  parsing or derived task description exists.
- One UUID is minted per user submission before request composition.
- Branch input is `task-<sanitizeSegment(title, 8)>-<compact UUID>`, or the
  compact UUID fallback when no safe title seed exists. The input is capped at
  46 characters to preserve the shared Host prefix budget.
- An invalid/non-UUID Workspace ID fails closed in the pure contract.
- Repeating the same human title produces different branch/worktree identities
  because the UUID suffix is part of the deterministic per-submission input.

## 5. Briefcase entry and dialog behavior

Each AA Briefcase project row now exposes a visible, project-scoped `NEW TASK`
button without replacing its original New Workspace `+` affordance. The action
does not toggle project expansion. Serving-Host resolution retains the existing
local-first behavior; no available Host produces a disabled, labelled action
and a real error path rather than guessing another Host.

The compact 1440×800 dispatch sheet shows only the contracted controls:

- real Briefcase name;
- task title, initially focused;
- fixed real Pi employee;
- fixed New Work Folder location;
- collapsed Work Options with the existing base-branch/default picker;
- Cancel and Start Work.

Enter submits except during IME composition. Empty Enter stays in the sheet,
announces `Enter a task title.`, restores focus to the field, and creates no Git
resource. Escape returns focus to the originating project-local `NEW TASK`
control. Missing Pi configuration stays explicit and links to Agent Settings.
Provisioning stage changes have a polite live announcement.

## 6. Exact Host composition reused

The default path submits exactly one existing public Host request:

```ts
{
  id: workspaceId,
  projectId,
  name: normalizedTitle,
  branch: deterministicBranch,
  baseBranch: selectedBaseOrUndefined,
  agents: [{ agent: realPiConfig.id, prompt: normalizedTitle }]
}
```

There is no resume/native session ID, model override, reasoning override,
permission setting, second launch, or automatic full-request retry. The Pi
config is the first ordered real Host config whose `presetId === "pi"`; there
is no fabricated fallback and no use of the last selected compatibility
employee.

`useWorkspaceCreates.submit` remains compatible for existing callers and now
also exposes an additive completion outcome containing the untouched Host
workspace/terminal/agent result. New Task independently inspects agent entry
zero, so overall Workspace success plus `{ok:false}` Pi launch is not treated
as a ready Task.

## 7. Pane and title persistence

The existing initial pane-layout write accepts optional presentation metadata
for one intended successful Pi launch. It writes the normalized title,
`taskTitleEdited: true`, the real terminal ID, and the real `launchIdentity` in
the same layout collection write. Chained setup reuse attaches that metadata
to the real shared Pi terminal. Failed Pi launches create no fake pane, and
command/setup/unrelated panes remain unchanged.

The real acceptance pass found one exact-resume edge: a single-pane tab can
carry the edited Task Folder title at the tab level while the resume banner
previously read only the pane title. A small pure helper now prefers an edited
pane title and otherwise carries the edited single-pane tab title. It never
promotes an unedited runtime label. Full restart and exact resume then retained
the original Task Folder title.

## 8. Runtime gate and truth boundaries

`editing`, `validating`, `provisioning-work-folder`, `opening-workspace`,
`starting-pi`, and `connecting-runtime` are orchestration stages only.
`working` is deliberately absent from provisioning state.

Ready requires all of the following to match the active flow:

1. the canonical Workspace route;
2. the returned terminal ID in a real pane;
3. the explicit persisted Task Folder title;
4. an open xterm transport in the terminal registry;
5. an authoritative Runtime Contract snapshot for runtime `pi`, the same
   Workspace, terminal transport, and terminal ID;
6. non-null runtime-reported native session identity;
7. available session-identity capability.

Wrong Workspace, terminal, transport, or runtime snapshots are ignored.
Missing identity/capability remains pending. `error`, `ended`, `offline`, and
`unknown` remain visibly unavailable. A 30-second confirmation timeout says
only that runtime identity was not confirmed and preserves the work folder and
terminal. Terminal creation, command queue success, process presence, elapsed
time, TUI text, tool completion, and legacy lifecycle are never used as proof.

When the exact runtime and xterm are ready, AA focuses the real terminal,
transitions to `ready`, and closes the progress sheet. Real QA exposed a modal
focus-restoration race; the progress sheet now prevents default restoration
and explicitly returns focus to the accepted active workstation.

## 9. Implemented failure and recovery matrix

| Boundary | Truth shown | Resource handling | Recovery |
| --- | --- | --- | --- |
| Validation | Exact title error in dispatch sheet | Nothing created | Edit and submit |
| Pi configuration | Real Host/Pi prerequisite error | Nothing created | Open Agent Settings |
| Workspace provisioning | Host error text | No assumed cleanup or replay | Edit dispatch sheet |
| Workspace navigation | Work folder may exist | Created Workspace is preserved | Open the canonical Workspace when available / dismiss |
| Pi launch | Workspace exists; Pi did not launch | Workspace/worktree preserved; no fake pane | Open Workspace / dismiss |
| Runtime confirmation | Pi identity unavailable, timed out, or reported unavailable | Workspace and terminal preserved | Check Again / Open Workspace / dismiss |
| Terminal focus | Runtime confirmed but xterm focus failed | All created resources preserved | Open Workspace / dismiss |

Flow state and errors are in-memory presentation state only. Stale flow events
are ignored. Dismiss means hide the surface, not cancel resources. There is no
destructive automatic rollback and no ambiguous automatic replay. A dedicated
post-provision `START PI` action is intentionally absent because no duplicate-
safe launch recovery contract was proven for v0.1.

## 10. Current Workspace option decision

Deferred. Reusing Current Workspace would require a separate explicit target
selection and duplicate-safe new-conversation contract. Inferring whichever
workspace happens to be visible would weaken isolation and make failure
ownership ambiguous. Phase 3H therefore ships only the accepted New Work
Folder default, while retaining safe base-branch selection under Work Options.

## 11. Active Tasks index decision

Deferred. The New Task flow itself needs no new persistence, but a truthful
Briefcase-wide Active Tasks projection after restart was not proven from all
existing pane/workspace/runtime bindings. No Task table, heuristic task list,
transcript store, or database migration was introduced.

## 12. Before/after interaction audit

| Journey | Before | After |
| --- | --- | --- |
| Real project to usable new Pi workstation | Accepted seven interaction groups: create Workspace, choose worktree/base, configure launch, choose Pi, enter prompt, create/open, focus | Two user interaction groups: invoke project-local `NEW TASK`; type title and press Enter. Provisioning, route opening, runtime confirmation, and focus are automatic but truth-gated. |

The reduction removes repeated setup, not safety. Project, independent
worktree, real Pi config, task prompt, runtime identity, and xterm focus remain
explicit system boundaries.

## 13. Real Pi-first acceptance

The real journey used AA Office at 1440×800 with pointer/key input:

1. opened a disposable real Briefcase and invoked its `NEW TASK` action;
2. verified empty-title recovery and Work Options/base-branch context;
3. entered `Create harmless aa_task_marker.txt` and pressed Enter;
4. observed one independent Workspace/worktree and one real Pi terminal;
5. verified the normalized title reached Pi as the initial prompt;
6. confirmed AA remained connecting until authoritative native identity and
   open xterm were both present;
7. verified the Task Folder title on first render and xterm focus on readiness;
8. observed real `WORKING → IDLE` while Pi created
   `aa_task_marker.txt` containing `Harmless task marker file`;
9. verified the one real untracked output in Files, Changes, and Diff;
10. reloaded Renderer and retained title, Workspace, runtime, and file truth;
11. fully restarted isolated Electron/Host and completed exact Pi resume;
12. repeated the flow, Unicode, New Workspace, Tier 2, Grok, larger viewport,
    keyboard, focus, and reduced-motion checks.

Electron's macOS accessibility window tree was unavailable. The accepted
fallback dispatched actual pointer/key input through Chromium's debugging
protocol and never called DOM `.click()` or a private product method. The
native file picker could not be automated with the available local controls,
so the disposable project was imported through the same public Host setup path
before the product UI journey. Public Host calls after that were limited to
sanitized readback and cleanup.

## 14. Collision and Unicode results

Running the identical human title twice created two distinct Workspaces and
two distinct generated branch/worktree identities. No collision occurred.

The Unicode title `创建无害的 unicode_marker.txt` remained the visible Task
Folder title and exact Pi prompt. Its branch input safely used the bounded
UUID-backed fallback. Pi created `unicode_marker.txt` with Unicode content,
and the real Diff rendered it correctly. Empty Unicode/unsafe branch segments
never became an unbounded or duplicate branch name.

## 15. Restart and exact-resume regression

Two full exact-resume checks were retained as hashed evidence:

| Task | Native identity before/after | Epoch before/after | Title |
| --- | --- | --- | --- |
| ASCII | `559861d24f3d` / `559861d24f3d` | `bafc5b7f3f3f` / `6c38a310b83e` | Preserved |
| Unicode | `b68249231450` / `b68249231450` | `db1cf9a5651c` / `459d56e9c94d` | Preserved |

The native-session fingerprint remained exact and the resumed process used a
fresh epoch. Saved Pi candidate presentation was visible before resume; after
resume, the authoritative Pi worker and Task Folder title returned and xterm
input was focused. No raw identity is retained in evidence.

## 16. Tier 2 and Grok regressions

Superset CLI was manually dispatched from Employee Roster. AA showed the real
transient `DISPATCHED TO SUPERSET CLI` language while the compatibility worker
and Task Folder remained `UNTRACKED`; it inherited no Pi lifecycle, model,
reasoning, capability, or resume authority.

Grok was not launched and no credential was entered. Its profile remained
`GROK BUILD`, `ACP`, `NO LIVE RUNTIME`, `NOT CONNECTED`, with unavailable
capabilities. Phase 3F remains deferred and untouched.

## 17. Automated verification

| Command or suite | Result |
| --- | --- |
| Pre-edit focused spike baseline | 129 passed, 0 failed, 245 expectations |
| Final New Task + AAOffice + pane/workspace-create/sidebar regressions | 165 passed, 0 failed, 272 expectations across 24 files |
| Hotkey registry + terminal/workstation focus regressions | 17 passed, 0 failed, 249 expectations across 3 files |
| Runtime Contract + Host registry/router/Grok/Pi bridge/terminal resume regressions | 50 passed, 0 failed, 159 expectations across 10 files |
| Shared TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Session Protocol TypeScript | Passed |
| Host Service TypeScript | Passed |
| Desktop TypeScript, generated icons, and routes | Passed |
| Targeted Biome over changed source/evidence/docs | Passed |
| Full `bun run lint` | Baseline-only failure: the two unchanged `docs/aa/design/assets-manifest.json` and `docs/aa/design/tokens.json` files require formatting |
| `git diff --check` | Passed |
| RED-area and sensitive-evidence scans | Passed |

The long development session retained the known Electric HTTP advisory and
`DockBadgeController` render-time update warnings. Opening the unchanged New
Workspace dialog also emitted its existing controlled/uncontrolled Select
warnings. The disposable Git project had no remote, so background fetch logged
the expected missing-origin warning. No new Phase 3H application error
remained after the focus/title corrections and clean restart.

## 18. Security and RED-area review

No file under Host Service behavior/contracts, PTY daemon, Desktop main
runtime, Git/worktree services, xterm transport/rendering, database schemas or
migrations, runtime contract semantics, Pi/Grok bridges, or Tier 2 lifecycle
was modified. The only Runtime Contract use is read-only Renderer matching of
the already-accepted authoritative snapshot.

Evidence uses disposable names, safe output content, and 12-character SHA-256
runtime fingerprints. It contains no credential, environment dump, raw native
session/epoch/terminal/Workspace/project ID, worktree path, transcript, prompt
history, tool argument/result, or user repository content. Full screenshots
that contained raw disposable identifiers were deliberately discarded before
staging.

## 19. Known limitations

1. The provisioning/recovery surface is ephemeral across Renderer process
   loss. Durable Workspace, pane, title, and resume state remain discoverable,
   but the in-flight progress sheet itself is not reconstructed.
2. A Pi launch partial failure preserves the Workspace but does not offer a
   one-click `START PI` retry; v0.1 avoids an unproven duplicate-launch path.
3. Dismissing progress pauses UI observation until the user shows/checks it
   again; it does not cancel or delete any resource.
4. Current Workspace and Briefcase Active Tasks remain deferred.
5. Generated branch/worktree identity can still appear in existing Git
   surfaces after creation; it is not promoted as the primary New Task UI.
6. Tier 2 employees remain compatibility terminals and Grok remains
   authentication-gated.
7. Native macOS file-picker automation was unavailable in this environment;
   project import was the only acceptance step performed through public Host
   setup instead of the UI.

## 20. Recommended next phase

Do not begin another phase automatically. First review the New Task sheet,
two-group daily entry, failure language, and recovery discoverability in normal
use. A future brief can separately decide whether to add a durable Active Tasks
projection, a duplicate-safe post-provision Pi retry, or the deferred Current
Workspace option. None should weaken the accepted one-call worktree creation,
exact Runtime Contract identity gate, or Pi-first terminal model.

## Files changed

Production implementation:

- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AANewTask/**`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/aa-office.css`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/index.ts`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/DashboardSidebar.tsx`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/DashboardSidebarProjectSection.tsx`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx` and its test;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/hooks/useDashboardSidebarProjectSectionActions/useDashboardSidebarProjectSectionActions.ts`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/layout.tsx`;
- `apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx`;
- `apps/desktop/src/renderer/stores/workspace-creates/appendLaunchesToPaneLayout.ts` and its tests;
- `apps/desktop/src/renderer/stores/workspace-creates/useWorkspaceCreates.ts`;
- `apps/desktop/src/renderer/stores/workspace-creates/writeWorkspacePaneLayout.ts`;
- `apps/desktop/src/renderer/stores/workspace-creates/workspaceCreateOutcome.ts` and its tests;
- `TerminalAgentResumeBanner.tsx`,
  `TerminalAgentResumeBanner.utils.ts`, and the helper tests in the existing V2
  Terminal pane path.

Documentation and evidence:

- `docs/aa/PHASE-3H-NEW-TASK-FLOW-V0.1-REPORT.md`;
- `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`;
- `docs/aa/new-task-flow/v0.1-implementation/`.

## Evidence and cleanup

Read `new-task-flow/v0.1-implementation/README.md` and its sanitized
`acceptance.json`. The Host project and generated worktrees were removed, the
guarded profile was cleaned, and all isolated Electron, Host, PTY, API,
Electric, notification, Vite, and debugging endpoints were stopped. The
disposable source fixture was moved to the macOS Trash and remains recoverable.
