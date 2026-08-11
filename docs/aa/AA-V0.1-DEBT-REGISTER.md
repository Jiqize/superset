# AA v0.1 debt register

## Use

This register is the release-candidate classification from Phase 3M. Closed
items remain listed so future work does not accidentally restore the old
behavior. Only `RC BLOCKER` and `FIX IN 3M` items were changed in Phase 3M.

## RC BLOCKER

| ID | Status | Finding and resolution | Regression gate |
| --- | --- | --- | --- |
| RCB-01 | **Closed in 3M** | Pi's explicit `session_shutdown(reason: "quit")` was mapped to offline/resumable, so a clean end became Saved after restart. The managed Pi bridge now emits `session.ended(reason: "pi_quit")`; replacement reasons remain resumable and the existing terminal death-gasp still owns signal/PTY loss. | Bridge unit test plus real clean quit, full Host restart, no candidate, no Active Tasks promotion, Work Folder fallback retained. |
| RCB-02 | **Closed in 3M** | Selecting an archived Task Folder could leave its Archived disclosure collapsed, hiding the current context. The selected archived group now opens and reads `ARCHIVED · CURRENT`. | Component regression plus real archive/navigation/reload check. |
| RCB-03 | **Closed in 3M** | During cold terminal attach, the central Resume surface could receive an exact candidate while Active Tasks remained absent until Renderer reload. The projection now explicitly combines per-terminal query fields so it rerenders with the cache update. | Real inactive Work Folder selection produced matching central/row `RESUMABLE` in 571ms without reload. |

## FIX IN 3M

| ID | Status | Finding and resolution | Regression gate |
| --- | --- | --- | --- |
| FIX-01 | **Closed** | Offline runtime snapshots retained capability-level `canResume` and could overstate Saved state without a durable candidate. Worker and global status now fail closed; the active pane adds only its exact Host candidate. | Worker presentation tests cover candidate present/absent. |
| FIX-02 | **Closed** | AA daily-path copy leaked `Workspace`, `worktree`, and `checkout` in archive, File Cabinet, and bottom-status presentation. Local copy now uses Work Folder/Main Folder and Task Folder consistently. | Terminology audit and targeted rendering tests. |
| FIX-03 | **Closed** | A selected archived heading lacked a strong current-state cue. The heading now uses the accepted deep-navy selection and amber edge. | 1920 screenshot and component test. |
| FIX-04 | **Closed** | Roster preset settings had no AA-specific accessible name. It now exposes `Manage Employee Roster presets` in both label and tooltip. | Accessible-name audit. |
| FIX-05 | **Closed** | Shared `animate-ping`/`animate-spin` classes inside AA were not covered by AA reduced-motion CSS. They now settle to one 0.01ms iteration. | Real reduced-motion inspection: 10 animations, zero infinite. |

## DEFERRED — GROK

| ID | Finding | Why deferred | Exit criterion |
| --- | --- | --- | --- |
| GRK-01 | Grok Build Tier 1 activation and authenticated real turns are unavailable on this machine. | Phase 3F remains explicitly deferred; Phase 3M is consolidation, not activation. | User authenticates Grok Build and authorizes the dedicated activation brief. |

## DEFERRED — SCALE

| ID | Finding | Current evidence | Exit criterion |
| --- | --- | --- | --- |
| SCL-01 | Active Tasks still performs per-Work-Folder runtime, resume, and Git reads rather than a batch projection endpoint. | With 11 Work Folders, task switching was 297ms and Files/Changes were 98ms/65ms; evidence settled without freezes. The Phase 3K gate was not crossed. | Reproducible Phase 3K threshold breach under realistic load before any batching/caching architecture is added. |

## DEFERRED — PRODUCT

| ID | Finding | Why deferred | Required future contract |
| --- | --- | --- | --- |
| PRD-01 | There is no Done/completion/history/timeline model. | Explicit v0.1 non-goal. Archived is organization intent only. | Separate product contract and data-model review. |
| PRD-02 | There is no dedicated task entity, priority, tag, due date, dependency, or task database. | Active Tasks and Task Folder intentionally derive from mature Workspace/terminal/runtime/Git state. | Evidence that the projection model no longer satisfies a concrete workflow. |
| PRD-03 | Clean-ended, non-archived work appears through Work Folders rather than a history list. | Truthful under the current evidence classes and avoids manufacturing a task-history concept. | A scoped retention/history product brief. |
| PRD-04 | Tier 2 employees remain `UNTRACKED`; native chat, structured approvals, cancellation UI, and automated handoff/orchestration are absent. | Explicit compatibility boundary and non-goals. | Separate runtime/product phases with normative contracts. |
| PRD-05 | Model/reasoning values are read-only. | AA displays negotiated Pi truth and does not mutate runtime preferences. | Dedicated write-control contract and Pi capability verification. |

## ACCEPTED PLATFORM DEBT

| ID | Finding | Release impact / handling |
| --- | --- | --- |
| PLT-01 | Existing `DockBadgeController` set-state-during-render warnings occur in the Superset dashboard sidebar. | Pre-existing, outside AA scope; no AA-owned uncaught error remained after clean restarts. |
| PLT-02 | Electric emits HTTP/1.1 development guidance and TanStack reports a route export that cannot be code-split. | Development-platform warnings, not AA regressions. |
| PLT-03 | The disposable repository intentionally has no remote, so background base-ref fetch logs fail and Review reports `NO GITHUB REPO`. | Expected QA-repository behavior; UI state is truthful. |
| PLT-04 | Several legacy Superset icon-only controls outside the AA-owned roster button remain unnamed. | Platform accessibility debt; do not broaden Phase 3M into a global control rewrite. |
| PLT-05 | The locked isolated QA session could not automate the native file picker, so fixture import used the formal Host project setup boundary. | Project opening and all daily flows were then exercised in the real Electron UI. |
| PLT-06 | Development cold start includes source build, HMR, and local evidence hydration; the measured sidebar/evidence settle was about 10.1/10.7s. | Not a packaged-build benchmark. Once settled, interaction timings remained practical and the batching gate stayed closed. |
| PLT-07 | Live code edits can trigger transient Vite HMR reload/invalidation diagnostics. | Excluded from release behavior; three clean full Electron/Host starts had no AA-owned uncaught error. |
