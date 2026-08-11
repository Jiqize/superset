# Phase 3M — AA v0.1 Product Consolidation RC report

## 1. Executive verdict

**AA OFFICE V0.1 RC READY WITH ACCEPTED DEBT**

All Phase 3M release-candidate blockers are closed. The production Pi-first
New Task journey, multi-task isolation, exact restart/resume, archive intent,
real Git output, Tier 2 compatibility boundary, required viewports, keyboard
flows, and automated gates passed. Remaining work is explicitly deferred or
accepted in `AA-V0.1-DEBT-REGISTER.md`; no open item invalidates the v0.1
contract.

## 2. Baseline, final commit, and environment

- Branch: `aa-spike`
- Confirmed baseline: `b97abf97b867d2a9c107bb79e3dc8949b85ff004`
- Final RC implementation/evidence/checkpoint commit:
  `04c2fb53b78455f696f8be7f81108ab3c06b691d`
- This report is the documentation-only closeout layered on that immutable RC
  content commit; its containing branch-tip SHA is recorded in the final Git
  handoff because a commit cannot embed its own hash.
- macOS 26.4 (25E246), Apple Silicon `arm64`
- Electron 41.10.3, desktop package 1.19.0
- Bun 1.3.14, Node 24.14.0, Pi 0.82.1
- Isolated profile: `phase-3m`
- Disposable local-only real Git Briefcase; intentionally no remote
- Logical viewport acceptance: 1920×976 and 1440×800

The isolated Electron profile was removed after evidence capture. Its 10
generated copied Work Folders were removed through `git worktree remove`; the
fixture repository and QA helper scripts were moved to macOS Trash under
`superset-phase-3m-qa-20260812`. The committed sanitized evidence is retained.

## 3. Full dogfood journey

The matched isolated Electron renderer was driven with real pointer/keyboard
input wherever practical. Host/runtime APIs were read only to confirm truth;
they were not used to manufacture task or lifecycle state.

1. Opened one disposable real local Git Briefcase and confirmed the AA daily
   path plus the secondary `New Workspace · Advanced` path.
2. Used the production project-local `NEW TASK` dialog repeatedly. The final
   fixture contained 11 Work Folders: 10 copied Work Folders plus Main Folder.
3. Kept two Pi New Tasks live concurrently and switched between them without
   title, lifecycle, terminal, or Git-output crossover.
4. Produced real changes in two Work Folders. Files, Changes, a one-file Diff,
   Review, changed counts, Output, and `NO GITHUB REPO` Delivery all followed
   the selected Work Folder.
5. Created two tasks titled `Inspect duplicate identity`. Their stable opaque
   discriminators (`#B40E` and `#E9AF`) and full accessible names remained
   distinct through navigation and restart.
6. Opened/closed Employee Profile, opened and renamed Task Folder to
   `RC beta file task`, then verified reload/restart persistence and terminal
   focus restoration.
7. Dispatched the existing Superset CLI preset from Employee Roster. The UI
   showed `DISPATCHED` then `UNTRACKED`, with no Pi runtime authority leakage.
8. Exercised Archive, toast Undo, final archive, direct archived navigation,
   Unarchive, and re-archive. Runtime, terminal, Git, and Work Folder identity
   remained independent of the organization intent.
9. Reloaded Renderer, performed three complete Electron/Host restart cycles,
   and confirmed no stale Live evidence.
10. Resumed `Keep archived resume ready` while it remained Archived. The real
    native session fingerprint stayed `e268f16dd29f`, the epoch changed from
    `03720f0727c6` to `c41535471c0c`, and a real follow-up turn returned to Idle
    without clearing Archived intent.
11. Ended `Clean end RC proof` through Pi's real interactive clean-exit path.
    It recorded `ended / pi_quit`, exposed no resume candidate, remained
    unavailable after restart, and stayed reachable only through Work Folders.
12. Repeated key navigation, runtime, File Cabinet, and layout checks at both
    required viewports.

Sanitized task/runtime facts are in `release-candidate/v0.1/*.json`; clipped
AA-only visual evidence is in `release-candidate/v0.1/screenshots/`.

## 4. Information-architecture consolidation

The left side now reads in a stable daily-to-advanced order:

```text
Briefcase
→ NEW TASK
→ current/live/saved/untracked task evidence
→ Archived
→ Work Folders
```

Findings and changes:

- The selected Task Folder stays the strongest row and remains visible when
  Archived; its disclosure opens and reads `ARCHIVED · CURRENT`.
- `NEW TASK` remains project-local and primary. The generic global action and
  legacy project `+` remain available but visually secondary.
- Current, Live, Saved/Resumable, Untracked, and Archived continue to state
  different evidence rather than becoming decorative categories.
- Work Folders remains a discoverable fallback for Main Folder, clean-ended
  work, and any item without sufficient Active Tasks evidence.
- Duplicate titles keep compact opaque discriminators while accessible labels
  contain the complete identity and real changed count.
- A cold-attached exact resume candidate now updates Active Tasks immediately;
  it no longer waits for Renderer reload while the central pane says Resume.
- No dashboard, history, task queue, priority, or new navigation model was
  introduced.

At a glance, the RC distinguishes what is current, live, resumable, untracked,
archived, or available only as a Work Folder without requiring knowledge of
Superset's internal Workspace/worktree model.

## 5. Central-workspace hierarchy

- The real xterm/Pi TUI remains the visual and interaction anchor.
- Task Folder, Pi Worker, Reasoning Hair, runtime health, Resume, Archive, and
  File Cabinet remain compact supporting surfaces and keep explicit labels.
- An offline snapshot alone no longer claims `OFFLINE / RESUMABLE`; the active
  surfaces require the exact Host candidate.
- File Cabinet copy now says `WORK FOLDER RECORDS`; the bottom status says
  `MAIN FOLDER` or `WORK FOLDER` rather than checkout/worktree terminology.
- Archive controls consistently say `Archive Task Folder` and explain a Work
  Folder host outage.
- No terminal rendering, focus contract, resize behavior, pane architecture,
  or CRT effect changed.

## 6. Terminology decisions

`AA-V0.1-TERMINOLOGY.md` is normative. Key decisions are:

- Project → Briefcase.
- Workspace/worktree → Work Folder; the primary repository is Main Folder.
- Agent preset → Employee in Employee Roster.
- Task Folder remains a derived work-session presentation, not an entity.
- Saved/Resumable requires an exact durable Pi candidate.
- Untracked means explicit compatibility launch without Tier 1 authority.
- Archived means durable organization intent only.
- Changed/Output/Delivery always reflect real Git/PR state.

Low-level types and APIs were not renamed.

## 7. Release-blocker and debt classification

Closed `RC BLOCKER` items:

1. clean Pi quit becoming resumable after restart;
2. selected archived context hidden by a collapsed disclosure;
3. cold-attach Resume/Active Tasks contradiction until reload.

Closed `FIX IN 3M` items:

- offline snapshot overclaiming resume;
- AA daily-path terminology leaks;
- selected-archived hierarchy;
- unnamed Employee Roster preset settings;
- AA reduced-motion coverage for shared ping/spin utilities.

Deferred and accepted findings are actionable in
`AA-V0.1-DEBT-REGISTER.md`, grouped exactly as `DEFERRED — GROK`,
`DEFERRED — SCALE`, `DEFERRED — PRODUCT`, and
`ACCEPTED PLATFORM DEBT`.

## 8. Warning and error audit

No uncaught AA-owned runtime error remains after clean restart.

Observed non-AA findings:

- existing `DockBadgeController` render-time update warnings;
- Electric HTTP/1.1 development guidance;
- TanStack route-export/code-split guidance;
- expected background base-ref fetch failures from the no-remote disposable
  repository;
- transient Vite HMR invalidation while editing live source.

The first root `lint:fix` attempt also encountered an in-progress Electron
network-log placeholder and broken singleton links inside the disposable QA
profile. After the real QA ended, the marked profile was safely cleaned and
the required root lint commands passed. This was isolated fixture state, not
an application or source warning.

## 9. Accessibility and keyboard result

Passed:

- New Task initial focus and keyboard Enter submission through the existing
  IME-aware form path;
- task-row Tab/Enter activation;
- Task Folder open, rename, cancel/close, and focus return;
- Employee Profile open/Escape close and terminal focus restoration;
- Files/Changes access and return to the Pi workstation;
- Archive, Undo, Unarchive, Archived disclosure, and Resume;
- full duplicate accessible identity despite visual truncation;
- visible focus treatment and unchanged terminal keyboard input.

The Employee Roster settings control now has the explicit accessible name and
tooltip `Manage Employee Roster presets`.

With `prefers-reduced-motion: reduce`, all 10 inspected AA animations resolved
to a single 0.01ms iteration; none remained infinite. Existing unnamed legacy
Superset icon controls outside the changed AA surface remain accepted platform
debt.

## 10. Restart and durability result

Three full Electron/Host restart cycles passed (two required):

- no stale Live lifecycle survived;
- exact current evidence reconstructed Saved/Resumable and Untracked groups;
- Archived intent, Task Folder titles, duplicate discriminators, and Work
  Folder navigation persisted;
- changed counts came from current Git truth;
- archived exact resume preserved native identity and used a new epoch;
- resumed Pi accepted a real follow-up and Renderer reload stayed correct;
- clean-ended Pi remained ended/unavailable and did not become Saved.

`resume-identity.json`, the before/after runtime snapshots, and clean-end
snapshot preserve only hashed identifiers.

## 11. Performance sanity result

With 11 Work Folders in the development build:

| Observation | Result |
| --- | ---: |
| CDP available from cold-start probe | 2,715ms |
| DOM content loaded | 3,520ms |
| Sidebar usable from Renderer navigation | 10,053ms |
| Runtime evidence settled from Renderer navigation | 10,677ms |
| Task-row switch | 297ms |
| Files switch | 98ms |
| Changes switch | 65ms |
| Cold-attach candidate → matching Active Tasks row | 571ms |

The cold numbers include development source build and local data hydration;
they are not a packaged-build benchmark. Once settled, navigation and input
remained responsive. The Phase 3K batching gate was not crossed, so no batch
endpoint or caching architecture was added.

At 1440×800 there was no document-level overflow. The terminal frame measured
744×548 CSS pixels and xterm 720×528; input/focus, Files/Changes/Review, and
the task sidebar remained usable. 1920×976 also passed.

## 12. Automated verification

| Command or suite | Result |
| --- | --- |
| AAOffice + Pi bridge + managed wrapper regressions | 234 passed, 0 failed, 638 expectations across 26 files |
| Full `@superset/host-service` suite | 1,083 passed, 14 opt-in real-ACP skips, 8 existing todos, 0 failed |
| Desktop TypeScript, generated icons, and routes | Passed |
| Host Service TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Session Protocol TypeScript | Passed |
| Root `bun run typecheck` | 37 tasks successful across 36 packages |
| Root `bun run lint:fix` | Passed after disposable-profile cleanup; 6,022 files, no fixes |
| Root `bun run lint` | Passed; 6,022 files, no fixes |
| `git diff --check` | Passed |
| RED/frozen-boundary audit | Passed with one documented blocker exception |
| Sensitive-evidence audit | Passed |

Primary commands:

```text
bun test apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice apps/desktop/src/main/lib/agent-setup/pi-runtime-bridge.test.ts apps/desktop/src/main/lib/agent-setup/agent-wrappers.test.ts
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

## 13. Architecture and RED-area review

Normal changes stayed in AAOffice Renderer presentation and tests. The narrow
V2 Presets Bar edit adds only an accessible name/tooltip.

One frozen-boundary exception was necessary and documented before change in
`release-candidate/v0.1/RC-BLOCKER-CLEAN-END.md`: the managed Pi extension now
preserves Pi's authoritative clean-quit reason instead of emitting a false
resumable state. Tests cover quit versus replacement. This does not alter the
Runtime Contract schema, Host database, terminal-agent persistence, resume
mechanism, PTY daemon, xterm, Git/worktree semantics, or task data model.

No Host Service source, PTY daemon, Git/worktree implementation, database
schema/migration, Grok adapter, native chat, orchestration, or model/reasoning
write control changed.

## 14. Known accepted limitations

- Grok Build remains unauthenticated and therefore activation-gated.
- Tier 2 employees remain compatibility `UNTRACKED`.
- Active Tasks is intentionally a projection, not a durable task entity.
- Clean-ended non-archived work uses Work Folders rather than a history list.
- No Done/history/priority/tags/dependencies, native chat, structured approval
  UI, cancellation UI, automated handoff, or orchestration exists.
- Model and reasoning are read-only runtime truth.
- Per-Work-Folder projection reads remain until the Phase 3K scale gate is
  reproducibly crossed.
- Known Superset development warnings and legacy unnamed icon controls remain
  accepted platform debt.

## 15. Recommended next action

Stop product implementation and use this RC for repeated personal daily work.
Collect only reproducible defects against the checkpoint and debt register.
The next implementation brief should be chosen from real RC usage evidence;
Grok activation remains the natural runtime follow-up only after machine
authentication is available. Do not silently expand this checkpoint into task
management, native chat, orchestration, or a new runtime abstraction.

## Evidence index

- `QA-INVENTORY.md` — pre-QA acceptance inventory
- `RC-BLOCKER-CLEAN-END.md` — blocker proof and narrow exception rationale
- `acceptance-summary.json` — sanitized journey counts and surfaces
- `accessibility-summary.json` — keyboard/reduced-motion facts
- `performance-cold-start.json` and `performance-sanity.json` — practical
  timing/viewport facts
- `resume-identity.json` and `runtime-*.json` — hashed restart/resume facts
- `screenshots/00…14` — safe clipped UI evidence, including before/after blocker
  state, Tier 2, File Cabinet/Diff, clean end, archived resume, 1440 layout, and
  cold-attach consistency
