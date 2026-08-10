# Phase 3E — Agent Workspace Workflow Report

## Status

Phase 3E is complete. AA Office now presents a small, real work model around:

> Project → Workspace → Task Folder → Employee → Output

The implementation remains a Renderer composition over existing Superset
workspace, terminal, runtime, Git, Diff, Files, Review, and preset-launch
infrastructure. It does not add a task database, native chat, automatic
orchestration, a new runtime adapter, or agent-to-agent messaging.

The branch was fast-forwarded to and started from
`b1fb5c160fd3e9ea89d64b8f71ee03211f0fed08`.

## Environment

| Item | Value |
| --- | --- |
| Host | macOS 26.4, Apple Silicon (`arm64`) |
| Bun | 1.3.14 |
| Pi CLI | 0.82.1 |
| Codex CLI | 0.144.6 |
| Grok Build CLI | 0.2.87 (`0ae0bf47e53`) |
| QA viewport | 1440×800 logical pixels |
| QA state | Disposable `phase-3e` profile and disposable local Git project |

## 1. Task Folder 2.0

The compact Task Folder mark remains part of the terminal frame. Activating it
now opens a hard-edged AA context card containing only values already available
to the Renderer:

- user-visible Task Folder title;
- employee identity and evidence authority;
- runtime and transport;
- effective model and reasoning when present in the authoritative snapshot;
- lifecycle status;
- real changed-file count from the existing workspace Git-status provider;
- exact-resume availability;
- latest meaningful action from a fixed lifecycle/reason vocabulary.

The card never reads xterm content, infers progress, summarizes a prompt, or
stores a transcript. Unknown lifecycle reasons are omitted instead of being
rendered as invented activity.

Task Folder titles continue to use existing pane presentation state. A title is
marked explicit only after the user edits it. Blank values fall back through
the existing session/terminal labels and finally to `Current Work Session`.
No task entity or persistence schema was introduced.

## 2. Employee Profile

The Phase 3D Employee File presentation is now named **Employee Profile**
throughout the UI and accessibility labels. The profile remains a compact view
of runtime truth and distinguishes all four contract support values:

- `AVAILABLE`
- `CONDITIONAL`
- `UNAVAILABLE`
- `UNKNOWN`

Pi presents its real runtime, terminal transport, status, model, reasoning,
resume state, and negotiated capability matrix. Compatibility employees remain
explicitly `UNTRACKED` when no Tier 1 snapshot exists.

For a verified Grok `authentication_required` snapshot, the profile shows
`GROK BUILD`, `ACP`, `AUTHENTICATION REQUIRED`, and the capability support
reported by that sanitized negotiation snapshot. The notice makes clear that
live Grok work still requires authentication. With no Grok snapshot, the
profile continues to show `NO LIVE RUNTIME` and does not reuse historic or
static claims.

## 3. Manual Task Folder handoff

The Employee Roster language now says `SEND TASK FOLDER`. Selecting an employee
still invokes the same Superset preset execution path; Phase 3E changes only
Renderer presentation metadata and wording.

When a Task Folder has a user-edited title:

1. the active workspace tab locates that explicit title without treating a
   Diff/File pane title as task context;
2. the title is supplied to the existing preset execution call;
3. the new terminal pane keeps the selected employee as launch identity while
   using the Task Folder title as its pane/work title;
4. the same explicit title is preserved when an exact Pi resume replaces a
   dead terminal session.

No prompt, terminal history, transcript, model setting, or hidden context is
transferred. The receiving employee sees the same real workspace/files because
that is existing Superset behavior, not because AA added agent messaging.

The dogfood pass found two Renderer-only context-loss defects and fixed both:

- opening Changes/Review made the Diff pane active and initially hid the
  explicit Task Folder from the handoff action;
- exact Pi resume initially replaced the user-edited Task Folder title with
  the preset label `Pi`.

Both fixes are covered by pure presentation regression tests. Runtime launch
and exact-resume identity validation remain unchanged.

## 4. File Cabinet output and delivery

The File Cabinet header now separates two real concepts:

- **OUTPUT** — the distinct staged/unstaged changed-file count from the
  existing Git-status query;
- **DELIVERY** — the existing PR/Git flow badge selected by the current Review
  state.

Unavailable values are omitted, a verified zero is retained, and amber is used
only when the real changed-file count is greater than zero. Files, Changes,
Diff, Review, tab persistence, and PR behavior are otherwise untouched. No new
polling or artifact store was added.

## 5. Real dogfood acceptance

The acceptance used AA Office through real Electron pointer/keyboard events and
a disposable local Git project.

1. Opened the real main workspace and a real terminal.
2. Renamed the Task Folder to `Review Phase 3E handoff` through the UI.
3. Started Pi in xterm and asked it to create the harmless
   `aa-phase-3e-proof.txt` marker.
4. Observed authoritative `WORKING`, tool activity, settlement-driven `IDLE`,
   model `Gemini 3.5 Flash`, reasoning `high`, and one changed file.
5. Opened Task Folder 2.0 and verified the runtime-backed context card.
6. Opened the real Changes/Diff pane, Files tab, and Review tab.
7. Sent the same Task Folder to Codex through the existing Employee Roster
   action. The new pane retained the exact title and initially presented the
   compatibility runtime as `DISPATCHED` + `UNTRACKED`.
8. Codex reviewed the Pi marker and created
   `aa-phase-3e-review.txt`; File Cabinet and the status bar updated to two real
   changes.
9. Returned to the original Pi terminal and recovered Pi's authoritative
   identity/model/reasoning presentation beside both outputs.
10. Performed a full isolated desktop/Host restart, observed the saved Pi
    candidate, used the normal `RESUME PI SESSION` action, and confirmed the
    explicit Task Folder title remained unchanged.
11. The native-session fingerprint matched before/after, the epoch fingerprint
    changed, and the resumed conversation recalled the harmless
    `PHASE3E_RESUME` token.
12. Opened the Pi Employee Profile and verified its real values and capability
    support.

The native-session fingerprint was `f658c6a60b56` before and after resume. The
epoch fingerprint changed from `7621759cd9b7` to `e78018d587ef`. Raw runtime
identities are not retained.

macOS app discovery found the Electron process, but the accessibility service
did not expose its window tree. The allowed fallback used Chromium's debugging
protocol to dispatch actual mouse/key input. It did not invoke DOM `.click()`
or private product methods. The public Host Service interface was used only for
disposable fixture registration/removal and sanitized runtime reads.

## 6. Verification

### Automated

| Command or suite | Result |
| --- | --- |
| `bun test .../AAOffice` | 129 passed, 0 failed |
| `bun test packages/session-protocol/src/runtime-contract.test.ts` | 4 passed, 0 failed |
| Host registry, legacy bridge, AA router, and Grok adapter | 16 passed, 0 failed |
| Pi bridge and isolated QA-profile configuration | 6 passed, 0 failed |
| Session Protocol TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Desktop TypeScript, including generated icons/routes | Passed |
| Targeted Biome over AA/V2 integration files | Passed |
| Full `bun run lint` | Baseline-only failure after checking 5,971 files: the unchanged `docs/aa/design/assets-manifest.json` and `docs/aa/design/tokens.json` still require formatting |
| `git diff --check` | Passed |
| RED-area modification scan | Passed; none modified |
| Evidence JSON/sensitive-string/visual review | Passed |

### Real behavior

| Scenario | Result |
| --- | --- |
| Explicit Task Folder edit | Passed |
| Pi authoritative work → settled idle | Passed |
| Real model/reasoning/latest action | Passed |
| Task Folder context card | Passed |
| Files / Changes / Diff / Review | Passed |
| Real output count and delivery language | Passed |
| Manual handoff to Codex | Passed |
| Compatibility runtime remains non-Tier-1 | Passed |
| Task title survives handoff with Diff active | Passed |
| Return to original Pi employee | Passed |
| Full restart and saved candidate | Passed |
| Exact native Pi resume | Passed |
| Task title survives exact resume | Passed |
| Conversation context continuity | Passed |
| Terminal input/focus and Renderer reload/restart | Passed |
| Pi Employee Profile | Passed |
| 1440×800 layout | Passed |
| Reduced motion | Passed; no new animation introduced |

The development console still reports the existing Electric HTTP/1.1 advisory
and the pre-existing `DockBadgeController` render-time update warning. No new
AA Phase 3E console error was observed.

## 7. Files and components changed

### AAOffice

- `AATaskFolder/AATaskFolder.tsx`
- `AATaskFolder/AATaskFolderContextCard.tsx`
- `AATaskFolder/aaTaskFolderPresentation.ts` and tests
- `AAHandoff/aaHandoffPresentation.ts` and tests
- `AAEmployeeProfile/*` presentation/card/profile files and tests
- `AAFileCabinetHeader/AAFileCabinetHeader.tsx`
- `AAFileCabinetHeader/aaFileCabinetPresentation.ts` and tests
- `AAAssignmentLabel/*`
- `AAActiveWorkerCard/AAActiveWorkerCard.tsx`
- `AATerminalFrame/AATerminalFrame.tsx`
- `AAOffice/index.ts`
- `AAOffice/aa-office.css`

### Existing V2 composition points

- `V2PresetsBar/V2PresetsBar.tsx`
- `V2PresetsBar/components/BuiltinPresetBarItem/BuiltinPresetBarItem.tsx`
- `V2PresetsBar/components/V2PresetBarItem/V2PresetBarItem.tsx`
- `WorkspaceSidebar/WorkspaceSidebar.tsx`
- `useV2PresetExecution/useV2PresetExecution.ts`
- `usePaneRegistry/.../TerminalAgentResumeBanner.tsx`
- `v2-workspace/$workspaceId/page.tsx`

These V2 changes only pass/preserve Renderer presentation state or surface
existing Git/PR state. No RED-area file was changed.

## 8. Evidence

Safe screenshots, the evidence index, and the sanitized workflow/resume
projection are under `docs/aa/runtime-foundation/phase-3e/`.

## 9. Known limitations and deferred work

1. Task Folder remains lightweight Renderer/pane presentation. It is not a
   durable project-management entity and has no separate task database.
2. Manual handoff carries the explicit work label and reuses the shared
   workspace; it does not send a prompt/transcript or automatically coordinate
   employees.
3. Compatibility CLIs may expose their existing terminal lifecycle hooks, but
   AA does not treat them as Tier 1 runtime-contract authority and does not
   claim their model, reasoning, capabilities, or exact resume.
4. Grok authenticated operation was not available in this environment. The
   verified authentication-boundary presentation is covered by adapter and
   Renderer tests; no authenticated live capability is claimed.
5. Delivery remains the existing PR/Git state. There is no artifact database,
   completion percentage, or synthetic delivery score.
6. The UI intentionally does not add native chat, model/reasoning writes,
   permissions UI, cancellation UI, automatic routing, or orchestration.

The disposable project/workspace was removed through Host Service, the guarded
QA profile was cleaned, all diagnostic listeners were stopped, and the fixture
was moved to the macOS Trash. Phase 3F was not started.
