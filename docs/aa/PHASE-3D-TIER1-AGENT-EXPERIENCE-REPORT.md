# Phase 3D — Tier 1 Agent Experience Report

## 1. Verdict

Phase 3D is complete. AA Office now turns the authoritative Tier 1 runtime
snapshot into a compact employee experience without changing the runtime
architecture or displacing the real terminal.

The Pi Worker Card presents identity, runtime/transport authority, real model,
real reasoning, lifecycle state, and resume availability. A separate Employee
File exposes the negotiated capability matrix while preserving every roster
button's existing launch behavior. Runtime-backed Reasoning Hair remains paired
with explicit text. Saved Pi conversations read as `OFFLINE / RESUMABLE`; Tier
2 CLIs continue to read as `DISPATCHED + UNTRACKED`.

A real isolated Pi run passed work, settlement, full Electron/Host/Pi restart,
exact conversation resume, context continuity, Renderer reload, and subsequent
terminal input. No Phase 3E work was started.

## 2. Baseline and environment

- Branch: `aa-spike`
- Required baseline commit:
  `b97b033af608873a36a8fedb4ccd06c2161a9523`
- The branch was fast-forwarded from `origin/aa-spike`, and the required commit
  was confirmed as `HEAD` before implementation.
- Final Phase 3D code, documentation, and evidence are carried by the commit
  containing this report and pushed to `origin/aa-spike`.

| Environment | Verified value |
| --- | --- |
| Host | macOS 26.4, Apple Silicon arm64 |
| Bun | 1.3.14 |
| Electron | 41.10.3 |
| Pi CLI | 0.82.1 |
| Grok Build | 0.2.87 (`0ae0bf47e53`) |
| Logical QA viewport | 1440×800 |
| QA state | Disposable `phase-3d` profile |

## 3. Implementation

### Pi Worker Card v2

`AAActiveWorkerCard` now presents a concise authority line and only exposes
runtime values that pass the contract capability gate:

- `PI · TERMINAL · RUNTIME VERIFIED` for a live authoritative Pi snapshot;
- effective model display name, with its exact ID retained in detail text;
- explicit `REASONING: <value>`;
- the existing stable runtime-health label;
- `RESUME: AVAILABLE` only for an offline exact Pi session;
- `SAVED SESSION` for a durable cold-start candidate without a live snapshot;
- `COMPATIBILITY CLI · TERMINAL PRESET · UNTRACKED` for Tier 2 launches.

Runtime snapshot precedence from Phase 3C is unchanged. Launch preference,
pane text, elapsed time, and terminal output never become Tier 1 authority.

### Reasoning Hair

The existing deterministic reasoning mapping is now used as normal product
presentation in both the Worker Card and Pi Employee File. Hair appears only
for an exact recognized runtime value, while the textual value remains visible.
Unknown, null, unavailable, or unrecognized reasoning uses the neutral cap and
does not guess.

The profile supports the model-specific `availableValues` list when the runtime
provides it. The verified Pi bridge reported the effective value `high` but no
available-values list, so AA displayed `high` and did not invent selectable
levels. No reasoning or model write control was added.

### Employee File

A new `AAEmployeeProfile` popover and `AAEmployeeProfileCard` provide a compact,
hard-edged employee detail surface. A small secondary employee-file button was
added beside each roster employee and inside the active Worker Card; the main
employee tile remains the existing launch/dispatch action.

The detail surface can show:

- explicit employee identity and authority;
- runtime and transport;
- runtime-health label;
- effective model and reasoning;
- exact-resume availability;
- negotiated support for lifecycle, tools, model read, reasoning read, resume,
  permissions, user questions, and cancellation.

Capability reasons remain optional detail/tooltips. No native runtime UUID,
epoch, sequence, transcript, intelligence score, productivity metric, or fake
seniority appears in the UI.

### Runtime indexing and health language

The Renderer now indexes the latest snapshot both by terminal and by Tier 1
runtime. Terminal indexing continues to drive panes; runtime indexing lets the
roster present verified terminal-less Grok ACP evidence without fabricating a
terminal identity.

The existing Phase 3C health mapping remains the single presentation source
for `STARTING`, `WORKING`, waiting states, `IDLE`, `OFFLINE / RESUMABLE`,
`UNKNOWN`, `ERROR`, and exact-resume failure language. No new lifecycle
inference was introduced.

### Resume experience

Phase 3D reuses the exact Pi resume implementation productized in Phase 3C.
The Worker Card and Employee File make the saved/offline state more legible,
while the normal `RESUME PI SESSION` action still supplies the recorded native
identity to the existing path. AA shows starting during launch and accepts
success only after the Host confirms the same native conversation in a new
epoch. It never silently substitutes a newer conversation.

### Grok and Tier 2 truthfulness

For a verified Grok snapshot whose contract reason is
`authentication_required`, the Employee File renders exactly:

- `GROK BUILD`
- `AUTHENTICATION REQUIRED`
- `Capabilities unavailable until login.`

Capabilities remain hidden until negotiation verifies them. A Grok roster item
with no live snapshot instead says `NO LIVE RUNTIME`; Phase 3D does not turn the
prior authentication probe into fake current state. The Host adapter's real
authentication-boundary regression remains green.

Codex, Claude, OpenCode, Copilot, Mistral Vibe, Kimi, Superset CLI, and other
compatibility CLIs retain their existing terminal preset behavior and do not
receive Tier 1 lifecycle claims.

## 4. Real acceptance

The acceptance used a disposable Git project and workspace in the isolated
repository-supported QA profile.

1. A real Pi session was launched through the Employee Roster.
2. Pi created a harmless `aa-phase-3d-proof.txt` marker containing
   `AA_PHASE_3D_OK`.
3. AA observed authoritative work and then `IDLE` only after
   `turn.settled`; it displayed model `Gemini 3.5 Flash` / ID
   `gemini-3.5-flash` and reasoning `high`.
4. Files/Changes showed the one real untracked file.
5. Electron, Host Service, and the Pi process were fully stopped and cold
   restarted with the same isolated profile.
6. Before any live snapshot, AA showed `SAVED SESSION`,
   `OFFLINE / RESUMABLE`, and `RESUME AVAILABLE`.
7. The normal resume action passed through `STARTING` and restored the real Pi
   TUI. The native-session fingerprint matched
   `e641393c74df`; the epoch fingerprint changed
   `4c7701235bc9` → `39573e8cafb6`.
8. A harmless follow-up recovered `AA_PHASE_3D_OK` without reading a file or
   using a tool, proving conversation continuity.
9. After a Renderer reload, keyboard input reached Pi and produced the expected
   `RELOAD_INPUT_OK` response.
10. A real Codex roster launch displayed `DISPATCHED TO CODEX`, while the
    active Worker Card and Task Folder remained truthfully `UNTRACKED`.
11. All screenshots were captured at 1440×800. The exact workspace/project
    were removed through Host Service, the QA profile was guarded-cleaned, all
    listeners were released, and the source fixture was moved to Trash.

The machine-readable exact-resume projection is
`runtime-foundation/phase-3d/pi-exact-resume-evidence.json`; the screenshot
index is `runtime-foundation/phase-3d/README.md`.

Real product interactions used pointer and keyboard events. Orca could locate
the Electron process but the logged-in macOS graphical session did not expose
the Electron accessibility tree. The fallback used Chromium's debugging
protocol to dispatch real pointer/key events; no DOM `.click()` shortcut or
private product method was used. Initial fixture registration and final cleanup
used the existing public Host Service project/workspace interfaces.

## 5. Verification

### Automated

| Command or suite | Result |
| --- | --- |
| `bun test packages/session-protocol/src/runtime-contract.test.ts` | 4 passed, 0 failed |
| Host registry, legacy bridge, AA router, and Grok adapter tests | 16 passed, 0 failed |
| Pi bridge and isolated QA-profile tests | 6 passed, 0 failed |
| `bun test .../AAOffice` | 119 passed, 0 failed |
| Session protocol TypeScript | Passed |
| Workspace client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Desktop TypeScript, generated icons/routes included | Passed |
| Biome over AAOffice and modified roster files | 67 files passed |
| Biome over sanitized JSON evidence | Passed |
| `git diff --check` | Passed |
| Evidence sensitive-string and visual review | Passed |

`bun run lint` was also run across all 5,962 files. Its code checks completed,
and it reports only the two unchanged repository-baseline format findings in
`docs/aa/design/assets-manifest.json` and `docs/aa/design/tokens.json`.
Targeted Phase 3D source/evidence checks are green; those unrelated design
documents were intentionally not reformatted into this phase.

### Real behavior

| Scenario | Result |
| --- | --- |
| Pi authoritative working state | Passed |
| Pi idle only after `agent_settled` / `turn.settled` | Passed |
| Real model and reasoning presentation | Passed |
| Runtime-backed Reasoning Hair | Passed |
| Full Electron/Host/Pi restart | Passed |
| Cold `OFFLINE / RESUMABLE` UI | Passed |
| Exact native Pi conversation resume | Passed |
| Conversation-context continuity | Passed |
| Renderer reload and subsequent terminal input | Passed |
| Files/Changes and changed count | Passed |
| 1440×800 layout | Passed |
| Tier 2 `DISPATCHED + UNTRACKED` fallback | Passed |
| Reduced-motion-safe presentation | Passed; no new animation introduced |

## 6. Files changed

| Area | Files | Purpose |
| --- | --- | --- |
| Employee File | new `AAOffice/AAEmployeeProfile/` | Runtime identity, values, capabilities, Grok auth boundary, saved/Tier 2 fallbacks |
| Worker Card | `AAOffice/AAActiveWorkerCard/` | Authority/runtime/transport, display model, reasoning, resume, profile action |
| Renderer snapshot access | `AAOffice/AAAgentStatus/` | Preserve terminal map and add latest-by-runtime map |
| AA exports/style | `AAOffice/index.ts`, `AAOffice/aa-office.css` | Reusable profile export and compact workstation styling |
| Employee Roster | `V2PresetsBar.tsx`, `BuiltinPresetBarItem.tsx`, `V2PresetBarItem.tsx` | Secondary employee-file affordance without changing launch behavior |
| Evidence/docs | `runtime-foundation/phase-3d/`, this report, checkpoint | Safe acceptance record and handoff |

No PTY daemon, xterm transport, Git/worktree behavior, database schema,
Host lifecycle primitive, Tier 2 tracking, native chat, cancellation/write UI,
permissions UI, or orchestration file changed.

## 7. Known limitations and deferred work

1. Grok authenticated behavior remains unverified. Phase 3D only presents the
   verified authentication boundary when that authoritative snapshot exists.
2. The current Pi snapshot supplied reasoning `high` but
   `availableValues: null`; the UI contract supports model-specific values but
   does not invent a list.
3. No model/reasoning write control, permissions UI, cancellation UI, native
   chat, transcript surface, or orchestration was added.
4. The Host runtime registry remains intentionally in-memory. After a cold
   restart, the saved candidate provides only offline/resume evidence; model,
   reasoning, and live capabilities return after the resumed bridge snapshot.
5. Employee Files are scoped to the active Worker Card and the existing
   workspace roster; Phase 3D does not redesign the global Agents page.
6. Existing development warnings remained: DockBadge render-time warnings and
   the expected background fetch failure for a disposable repository without a
   remote. No new blocking console error was observed.
7. Repository-wide lint remains red only on the two unchanged design JSON
   format findings listed above.

## 8. Boundary and stop condition

Phase 3D changed only Renderer presentation and safe evidence/docs. Runtime,
terminal, Git/worktree, and persistence contracts remain frozen at their
Phase 3B/3C checkpoints. This report does not authorize Phase 3E, and no Phase
3E implementation has begun.
