# Phase 3M — AA v0.1 Product Consolidation & Release Candidate

## Status

Phase 3L is complete. Use the latest `origin/aa-spike` as baseline and confirm the Phase 3L closeout commit before edits.

This phase is a consolidation and release-candidate pass. It is not a feature expansion phase.

Primary product model to preserve:

```text
Briefcase
→ NEW TASK
→ Active Tasks
→ Saved / Resumable
→ Untracked
→ Archived
→ Work Folders
→ Task Folder
→ Employee
→ Runtime
→ Output
```

Pi remains the primary Tier 1 runtime. Grok activation remains deferred until the user can authenticate the machine. Tier 2 CLIs remain compatibility employees.

## Read first

1. `docs/aa/AA-ARCHIVE-INTENT-V0.1-CHECKPOINT.md`
2. `docs/aa/PHASE-3L-ARCHIVE-INTENT-V0.1-REPORT.md`
3. `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md`
4. `docs/aa/PHASE-3J-ACTIVE-TASKS-PROJECTION-REPORT.md`
5. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
7. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
8. `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
9. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
10. `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
11. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
12. `docs/aa/CODEBASE-MAP.md`

Treat the latest checkpoints as the accepted product/runtime contract.

## Goal

Produce an AA Office v0.1 Release Candidate that is coherent enough for repeated personal daily use and stable enough to become the baseline for later Grok activation and future runtime/product work.

The phase has four objectives:

1. run a complete product acceptance across the full task lifecycle;
2. consolidate information architecture and visual hierarchy without redesigning AA;
3. identify and fix only release-blocking or high-value local debt;
4. produce a durable v0.1 RC checkpoint and release-readiness audit.

Do not add a new user-facing product concept in this phase.

## 1. End-to-end release-candidate dogfood

Use an isolated QA profile and one disposable real Git Briefcase.

Create at least 6 real New Tasks through the production `NEW TASK` flow, covering:

- at least 2 concurrently live Pi tasks;
- at least 2 exact saved/resumable Pi tasks after restart;
- at least 1 archived Pi task;
- at least 1 Tier 2 `UNTRACKED` compatibility task;
- at least 1 duplicate-title pair;
- at least 2 tasks with real changed files;
- at least 1 Pi task that ends cleanly and becomes session-unavailable;
- at least 1 archived task that is later unarchived;
- at least 1 archived resumable Pi task that is resumed while still archived.

The full journey must exercise:

```text
Open Briefcase
→ NEW TASK
→ Pi work
→ Active Tasks switching
→ Files / Changes / Diff / Review
→ Employee Profile / Task Folder
→ archive / Undo / unarchive
→ Renderer reload
→ full Electron/Host restart
→ exact resume
→ resumed Pi follow-up
→ Work Folder fallback
```

Run at both 1440×800 and 1920×976.

Do not use product-private methods to create task/runtime truth. Use real UI interaction wherever practical and only read authoritative Host/runtime state for verification.

## 2. Information architecture consolidation

Audit the complete AA left-side hierarchy as a product, not as individual components.

Review:

- Briefcase header;
- project-local `NEW TASK`;
- global `New Workspace · Advanced`;
- legacy project `+`;
- Active Tasks groups;
- Archived group;
- Work Folders disclosure;
- Setup/onboarding card if present;
- selected Workspace/task indication;
- duplicate-title discriminator;
- employee/runtime labels;
- changed count;
- Task Folder and Worker information repeated in the central workspace.

Primary question:

> At a glance, can a user understand what work exists, what is live, what can resume, what is archived, and where to click next without understanding Superset internals?

Allowed consolidation changes:

- reduce duplicate labels;
- lower visual weight of legacy/advanced paths;
- improve section ordering;
- improve truncation/tooltips;
- align spacing and row density with existing AA tokens;
- improve selected/current state clarity;
- move secondary technical detail into Work Folders or existing detail surfaces;
- remove purely decorative duplicate chrome where safe.

Do not:

- create a new dashboard;
- introduce a new navigation model;
- hide Work Folders completely;
- remove existing Superset advanced functionality;
- add task completion/history/priority/tags.

## 3. Central workspace hierarchy audit

Review the AA workstation itself as one composition:

- global AA shell;
- Briefcase / Work Folder context;
- Task Folder;
- Pi Worker Card / Employee Profile;
- Reasoning Hair;
- Runtime health/status;
- xterm/TUI frame;
- Files / Changes / Diff / Review;
- handoff presentation;
- Resume action;
- Archive action.

The real terminal must remain the visual anchor.

Look for:

- model/reasoning/status repeated in multiple adjacent places;
- runtime labels competing with the terminal;
- controls that remain permanently visible but are rarely used;
- Task Folder and Worker information that can be collapsed without reducing truth;
- AA metaphors that no longer perform useful product work;
- inconsistent terminology across `Work Folder`, `Workspace`, `Task Folder`, `Employee`, `Worker`, `Runtime`, `Session`.

Prefer one stable user-facing term per concept. Preserve internal Superset names where required for advanced/technical surfaces.

## 4. Terminology audit

Create a canonical AA v0.1 vocabulary table and apply safe local copy fixes where needed.

At minimum define the intended user-facing meaning of:

- Briefcase
- New Task
- Active Tasks
- Saved / Resumable
- Untracked
- Archived
- Work Folder
- Task Folder
- Employee
- Worker
- Runtime
- Session
- Resume
- Changed
- New Workspace · Advanced

Identify confusing synonyms or places where Superset-native words leak into the AA daily path.

Do not rename low-level API/types solely for copy consistency.

## 5. Release-blocker and debt audit

Search the AA codebase and prior reports/checkpoints for:

- TODO / FIXME / temporary fallback comments;
- compatibility branches added during Phase 1–3L;
- stale presentation fallbacks;
- dead AA prototype components;
- duplicated state mapping helpers;
- AA-specific feature flags or one-off conditions that can now be simplified;
- known console warnings caused by AA code;
- race conditions around focus, restart, resume, archive, or route reconciliation;
- tests that only validate historical transitional behavior no longer needed;
- design assets that no longer match product reality;
- documentation contradictions.

Classify every finding:

- `RC BLOCKER`
- `FIX IN 3M`
- `DEFERRED — GROK`
- `DEFERRED — SCALE`
- `DEFERRED — PRODUCT`
- `ACCEPTED PLATFORM DEBT`

Only fix items classified `RC BLOCKER` or `FIX IN 3M`.

Do not use this phase as justification for broad refactors.

## 6. AA-only warning/error cleanup

During the real dogfood, collect console/application warnings and errors.

For each one, determine whether it is:

- introduced by AA;
- existing Superset/platform debt;
- isolated QA-environment behavior;
- expected disposable-repository behavior.

Fix AA-owned warnings only when the correction is local and low-risk.

Do not modify unrelated platform warnings such as existing Electron/Superset development warnings unless AA changes directly caused them.

The final report must explicitly state whether any uncaught AA-owned error remains.

## 7. Accessibility and keyboard RC audit

Re-run the accepted AA keyboard workflow and verify:

- `NEW TASK` from a Briefcase;
- dialog focus and IME-safe Enter;
- task-row Tab/Enter activation;
- Task Folder rename/open;
- Employee Profile open/close;
- Files / Changes access;
- return to Pi workstation;
- Archive / Unarchive;
- Archived disclosure;
- Resume action;
- Escape/focus restoration from transient surfaces.

Verify accessible names communicate full task identity when visible titles truncate or collide.

Run reduced-motion acceptance.

Do not create a new command palette or shortcut system.

## 8. Restart and durability RC audit

Perform at least two complete Electron/Host restart cycles.

Verify after restart:

- no stale live lifecycle is shown;
- Active Tasks reconstruction follows exact current evidence;
- archived intent persists;
- duplicate discriminators remain stable;
- Task Folder titles persist;
- Work Folders remain navigable;
- changed counts come from current Git truth;
- exact Pi resume preserves native session identity and uses a new epoch;
- resume while archived preserves archive intent;
- clean-ended/non-resumable Pi work remains session-unavailable and does not become saved;
- Renderer reload after resume remains correct.

## 9. Performance sanity check

Use a Briefcase with at least 10 Work Folders during RC acceptance.

Measure only practical user-visible sanity, not synthetic microbenchmarks:

- app/route settle after clean start;
- sidebar usable time;
- Active Tasks evidence settling;
- input/navigation responsiveness;
- task-row switching;
- Files/Changes switching.

Use the Phase 3K batching gate as the current standard. Do not add batching or caching architecture unless the documented gate is actually crossed and the failure is reproducible.

## 10. Architecture boundaries

Allowed:

- AAOffice Renderer presentation/components/helpers/tests;
- narrow dashboard/sidebar AA-mode composition;
- narrow copy/tooltips/accessibility fixes;
- local simplification of AA transitional code;
- documentation/checkpoints;
- existing archive read/mutation use;
- existing runtime/read-only evidence use.

Frozen unless a true RC blocker is demonstrated and documented before modification:

- PTY daemon;
- xterm transport/rendering;
- Git/worktree semantics;
- AA Runtime Contract semantics;
- Pi bridge/runtime behavior;
- Grok ACP adapter;
- terminal-agent persistence/resume semantics;
- Host database schema beyond the already accepted archive field;
- task data model;
- native chat;
- orchestration.

Do not add another migration in Phase 3M.

## 11. Release candidate acceptance criteria

The phase may declare `AA OFFICE V0.1 RC READY` only if all are true:

1. production New Task path works through real Pi;
2. multiple concurrent tasks remain isolated;
3. Active Tasks classification is truthful before and after restart;
4. duplicate titles are distinguishable;
5. exact Pi resume works after full restart;
6. Archive/Undo/Unarchive remain independent of runtime and Git;
7. Files/Changes/Diff/Review remain correct per Work Folder;
8. Tier 2 remains compatibility `UNTRACKED` without leaked Pi authority;
9. Grok remains truthful and authentication-gated;
10. no AA-owned uncaught runtime error remains;
11. TypeScript, root lint, tests, diff check, RED audit, and sensitive-evidence audit pass;
12. 1440×800 remains usable without terminal degradation;
13. all RC blockers are closed or the verdict must be `NOT RC READY`.

## 12. Deliverables

Create:

- `docs/aa/PHASE-3M-AA-V0.1-PRODUCT-CONSOLIDATION-RC-REPORT.md`
- `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md`
- `docs/aa/AA-V0.1-DEBT-REGISTER.md`
- `docs/aa/AA-V0.1-TERMINOLOGY.md`
- safe evidence under `docs/aa/release-candidate/v0.1/`

The report must include:

1. executive verdict choosing exactly one:
   - `AA OFFICE V0.1 RC READY`
   - `AA OFFICE V0.1 RC READY WITH ACCEPTED DEBT`
   - `AA OFFICE V0.1 NOT RC READY`
2. exact baseline/final commit and environment;
3. full dogfood journey;
4. IA consolidation findings and changes;
5. central-workspace hierarchy findings and changes;
6. terminology decisions;
7. release-blocker/debt classification;
8. AA-owned warning/error audit;
9. accessibility/keyboard result;
10. restart/durability result;
11. performance sanity result;
12. automated verification;
13. architecture/RED-area review;
14. known accepted limitations;
15. recommended next action after RC.

The checkpoint must state the exact product/runtime contracts that future phases must preserve.

The debt register must remain actionable and grouped by the classification labels defined above.

## Explicit non-goals

Do not implement:

- task completion / Done;
- task history or timeline;
- priority, tags, due dates, dependencies;
- task entity/database;
- native chat;
- agent-to-agent orchestration;
- automated handoff;
- reasoning/model write controls;
- new permission/cancel UI;
- Grok activation;
- Tier 2 lifecycle expansion;
- batch projection endpoint unless the Phase 3K gate is demonstrably crossed;
- broad Superset redesign.

## Final stop condition

After implementation/audit/verification:

1. create all required deliverables;
2. commit and push to `origin/aa-spike`;
3. confirm clean worktree and local/remote SHA match;
4. STOP.

Do not begin another phase.