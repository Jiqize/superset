# Phase 4B — Single-Machine AA v0.2 Product Completion & Visual Acceptance

## Mission

Complete AA Office v0.2 on the original development Mac before any other computer is updated.

Phase 4A solved two real-use blockers:

1. Pi is now the fixed first-class Employee in Employee Roster.
2. One route-aware AA shell now covers the required V2 dashboard and Settings route families.

Phase 4B must close the remaining product-coherence gap inside those routes, run a complete single-machine product acceptance, and issue the final AA Office v0.2 release-candidate verdict.

This is the only development and acceptance environment for this phase:

```text
/Users/lianglei/Code/bluejob/superset
```

Do not update, test, inspect, or coordinate with a second computer. Do not design cross-device synchronization. Do not package the application in this phase. A second computer will receive one completed stable version only after the user accepts the v0.2 checkpoint.

## Baseline

Required baseline commit:

```text
9bffbf9f1cd3dce2b2ce9ce0c4edb64f84b1c456
```

Required branch:

```text
aa-spike
```

Read first:

1. `docs/aa/PHASE-4A-PI-FIRST-EMPLOYEE-GLOBAL-SHELL-REPORT.md`
2. `docs/aa/AA-V0.2-SHELL-EMPLOYEE-CHECKPOINT.md`
3. `docs/aa/AA-V0.2-REAL-USE-FINDINGS.md`
4. `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md`
5. `docs/aa/AA-V0.1-TERMINOLOGY.md`
6. `docs/aa/AA-V0.1-DEBT-REGISTER.md`
7. `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md`
8. `docs/aa/CODEBASE-MAP.md`

Treat the Phase 4A checkpoint and the v0.1 Runtime/work-model contracts as normative.

## Required final verdict

The Phase 4B report must choose exactly one:

- `AA OFFICE V0.2 RC READY`
- `AA OFFICE V0.2 RC READY WITH ACCEPTED DEBT`
- `AA OFFICE V0.2 NOT RC READY`

Do not inflate the verdict. Automated tests alone are insufficient.

## Product objective

The user should experience one coherent AA Office from application entry through daily work and configuration:

```text
AA Office
  → Home
  → Briefcases / Cases
  → New Task
  → Active Tasks
  → Work Folder
  → Pi / compatibility Employees
  → Files / Changes / Diff / Review
  → Sessions
  → Agents
  → Settings
```

The user should no longer feel that AA exists only inside one Case or Work Folder.

Phase 4A established the shared outer shell. Phase 4B must harmonize the visible page bodies, page headers, action hierarchy, spacing, surfaces, state language, and route transitions enough that the application reads as one product while mature Superset business logic remains intact.

## 1. Single-machine rule

All work and QA must occur on the original development Mac.

Allowed:

- the normal development profile when safe;
- the repository-supported isolated QA profile for destructive or repeatable acceptance;
- disposable local Git fixtures on the same Mac;
- full Electron/Host restarts on the same Mac.

Disallowed:

- pulling or testing on another computer;
- comparing machine-local Host databases across computers;
- copying Pi sessions or Work Folder state between computers;
- treating the second machine as a test environment;
- packaging/signing/notarization work;
- cross-device state or sync design.

The report must explicitly confirm that the second computer was not part of Phase 4B.

## 2. Pre-change visual and interaction audit

Before production edits, run the current Phase 4A build on the original development Mac and capture a structured before-state audit at 1440×800 and 1920×976.

Audit every required route family:

- `/v2-workspaces` — Home
- `/project/$projectId` — Case / Briefcase detail
- `/v2-workspace/$workspaceId` — Work Folder
- `/new-workspace` — Advanced Work Folder creation
- `/tasks` and a nested task route if available
- `/automations` and a nested automation route if available
- `/pull-requests` and a nested route if available
- `/settings/terminal` — Sessions
- `/settings/agents` — Agents
- `/settings/account`
- `/settings/appearance`
- `/settings/keyboard`

For each route record:

1. AA rail continuity;
2. selected navigation state;
3. page title/header hierarchy;
4. content background and framing;
5. card/surface geometry;
6. typography and spacing;
7. primary versus secondary actions;
8. empty/loading/error states;
9. focus and keyboard behavior;
10. scrolling and viewport fit;
11. visible Superset language or chrome that conflicts with AA terminology;
12. duplicated shell, top bar, sidebar, or navigation.

Create a before/after matrix in the final report. Do not change UI blindly before this audit.

## 3. Shared AA page-body system

Create or refine the smallest reusable AA application-page primitives required to harmonize mature route bodies.

Candidate responsibilities:

- route-level page background;
- consistent content maximum width where appropriate;
- compact AA page title and supporting copy;
- hard-edge section framing;
- consistent 1px divider/border hierarchy;
- AA-aligned empty/loading/error framing;
- primary and advanced action hierarchy;
- predictable top spacing below macOS drag/window chrome;
- selected/focus treatment;
- reduced-motion-safe transitions.

Prefer shared wrappers and route-scoped CSS over rewriting every mature component.

Possible implementation forms include:

- `AAApplicationPage`
- `AAApplicationPageHeader`
- `AAApplicationSection`
- route-aware scoped classes using `data-aa-route`

Names are not prescribed. Reuse existing AA tokens and components where practical.

Do not globally restyle Superset outside the AA shell. All styling must remain scoped to AA-enabled routes.

## 4. Route-family harmonization

### 4.1 Home and Cases

Home and Case routes should clearly communicate the AA work model:

```text
Briefcase
→ New Task
→ Active / Saved / Archived work
→ Work Folders as infrastructure
```

Requirements:

- `NEW TASK` remains the primary project-local action;
- `New Workspace · Advanced` remains available but visually secondary;
- Briefcase Cabinet and Active Tasks retain Phase 3J/3L behavior;
- no duplicate global and project-local action should compete at equal visual weight;
- empty project state should explain the AA entry path without inventing task persistence;
- selected Case and Work Folder remain clear at both viewports.

### 4.2 Work Folder

Preserve the accepted Work Folder product:

- real terminal/xterm remains the visual anchor;
- Pi remains first in Employee Roster;
- Task Folder, Worker, Reasoning Hair, Files/Changes/Review, bottom status, resume, and archive remain truthful;
- AA global shell must not create a second rail, duplicated frame, or excessive chrome;
- switching away and returning must retain terminal, pane layout, Task Folder title, runtime state, and focus behavior.

Only make restrained visual adjustments required for consistency with the wider application.

### 4.3 Tasks, Automations, and Pull Requests

Keep their existing data, routes, tables, forms, and actions.

Harmonize:

- page heading and supporting copy;
- AA section boundaries;
- toolbar/action hierarchy;
- filter/search placement where existing composition permits;
- table/list container edges;
- empty/loading/error states;
- route transition and selected rail state;
- terminology that can be safely presented at the shell level.

Do not create an AA task database or reinterpret Superset Tasks as AA Task Folders.

Do not claim an existing task/automation/PR belongs to an AA Task Folder without real evidence.

### 4.4 Advanced Work Folder creation

The mature New Workspace form remains an advanced infrastructure path.

Requirements:

- present it inside a coherent AA page body;
- use the accepted user-facing label `New Work Folder · Advanced` where safe at the shell/header level;
- preserve every existing branch/worktree/agent/form behavior;
- do not hide advanced controls or change defaults in this phase;
- resolve only AA-owned layout/copy issues;
- existing form warnings may be recorded as accepted platform debt when fixing them would require business-control changes.

### 4.5 Sessions and Agents

These are central to the Employee mental model.

Sessions should read as the place to configure terminal/preset/session infrastructure. Agents should read as Employee setup and runtime configuration.

Requirements:

- consistent AA page title and section hierarchy;
- Pi setup state remains understandable from Roster and Agents page;
- Roster `SETUP REQUIRED` navigation lands in a visibly coherent Agents page;
- do not invent detailed binary/extension/config diagnostics without authoritative evidence;
- do not change Host Agent Config semantics;
- compatibility preset management remains intact.

### 4.6 General Settings

Settings may retain its mature navigation and form controls, but it must feel embedded in AA.

Harmonize:

- outer page background and frame;
- settings navigation selected state;
- page title/subtitle hierarchy;
- section/card edges and spacing;
- button hierarchy;
- form grouping;
- keyboard/focus visibility;
- scrolling behavior.

Do not redesign every form control. Do not rename settings whose underlying meaning remains Superset-specific.

## 5. Global navigation and route continuity

Audit and fix the AA rail as a real application navigation system.

Required behavior:

- exactly one AA rail on every in-scope route;
- active destination is correct on direct navigation, nested routes, browser back/forward, and reload;
- `FILES` is enabled only inside a real Work Folder;
- disabled controls use native disabled semantics and explanatory accessible text;
- Home, Cases, Tasks, Automations, Pull Requests, Sessions, Agents, and Settings destinations remain reachable at 1440×800;
- no destination silently loses the current Pi/Work Folder state;
- returning to an existing Work Folder must reattach existing panes/terminal rather than starting a new session;
- navigation must not auto-resume Pi;
- navigation must not create a Task or Work Folder;
- drag regions and macOS traffic-light spacing remain correct.

Test the exact route journey:

```text
Home
→ Case
→ Work Folder
→ Files
→ Sessions
→ Agents
→ Settings
→ Tasks
→ Automations
→ Pull Requests
→ Advanced Work Folder
→ original Work Folder
```

## 6. Pi-first Employee completion

Phase 4A established Pi as the fixed first Employee. Phase 4B must validate and refine that product experience inside the completed application.

Required states:

- `CHECKING SETUP`
- available primary Pi
- `SETUP REQUIRED`
- setup query unavailable/error
- active Pi with real Runtime evidence
- compatibility Employees after Pi

Required behavior:

- Pi remains first across reload, route changes, Roster overflow, settings changes, and full app restart;
- Pi cannot be hidden, reordered, or duplicated by a linked terminal preset;
- the linked preset remains intact in settings;
- clicking available Pi creates exactly one new real Pi conversation in the current Work Folder;
- the current explicit Task Folder title is passed through the existing launch path;
- the new terminal becomes active and real xterm receives focus;
- terminal creation may show `DISPATCHED`; `LIVE` requires Runtime Contract evidence;
- clicking unavailable Pi opens Agents settings and creates no terminal;
- Codex, Claude, OpenCode, Superset CLI, and other compatibility Employees retain existing behavior and `UNTRACKED` truth.

Do not modify the Pi Runtime Contract, bridge, session identity, or exact-resume semantics.

## 7. Information density and visual language

Preserve the AA Office System:

- compact industrial office character;
- hard edges and 1px structural borders;
- navy selection and restrained amber state accents;
- pixel-worker personality;
- clear text accompanying visual metaphors;
- terminal remains dominant in a Work Folder;
- no gradients;
- no glassmorphism or blur;
- no CRT filter;
- no decorative animation engine;
- no large empty hero sections that reduce daily information density.

At 1440×800:

- all primary rail destinations remain usable;
- page headers do not consume excessive height;
- Tasks/Automations/PR/Settings content remains usable without document-level overflow;
- Work Folder terminal remains practically sized;
- Employee Roster and Task Folder remain discoverable;
- the UI should not feel like an AA rail pasted around an unrelated application.

At 1920×976:

- wider space should improve composition without creating oversized blank zones;
- page content should remain anchored and coherent.

## 8. Accessibility and reduced motion

Verify:

- visible keyboard focus across rail, page navigation, actions, Roster, settings, and dialogs;
- correct `aria-current`, `aria-pressed`, `aria-expanded`, and native disabled states;
- Pi names include availability and action;
- full accessible labels survive visual truncation;
- page titles use a meaningful heading hierarchy;
- dialogs restore focus to their origin or the real xterm workflow;
- reduced motion eliminates repeating AA status/transition animations;
- color is never the only lifecycle or selection signal.

Do not broaden this phase into a global remediation of all legacy Superset accessibility debt. Record unrelated legacy issues in the debt register.

## 9. Single-machine real acceptance

Use the original development Mac only. Use the isolated QA profile where appropriate.

Create or import one disposable local Git Briefcase and exercise at least three real Work Folders:

1. one New Task with real Pi work and one harmless changed file;
2. a second Pi Task with a separate session;
3. one compatibility Employee dispatch, preferably Codex, remaining `UNTRACKED`.

Acceptance journey:

1. cold start AA on the original development Mac;
2. Home and Case visual review;
3. create a real New Task;
4. observe Pi `WORKING → IDLE` from Runtime Contract;
5. inspect Files, Changes, Diff, and Review;
6. launch Pi once from Employee Roster in the same Work Folder;
7. verify one new conversation and xterm focus;
8. launch one compatibility Employee and verify `UNTRACKED`;
9. traverse every required route family;
10. return to the original Work Folder and verify continuity;
11. archive and unarchive one row;
12. Renderer reload;
13. full Electron/Host restart;
14. verify no stale live state;
15. exact Pi resume using the existing visible action;
16. verify same native Pi identity and new epoch using sanitized fingerprints;
17. follow up to prove context continuity;
18. repeat core route and visual checks at 1440×800 and 1920×976;
19. verify reduced motion and keyboard navigation;
20. clean disposable resources safely.

Run two complete Electron/Host restart cycles if the first cycle exposes any state or route discrepancy.

Do not involve another computer at any step.

## 10. Performance and stability

Measure practical development-build behavior on the original Mac:

- cold route shell appearance;
- evidence/Active Tasks settle;
- route switching after settle;
- return to Work Folder;
- Files/Changes open;
- Settings route transition;
- terminal focus after return/resume.

Use these as observational metrics, not packaged-build claims.

Do not add caching, batching, virtualization, or a new endpoint unless an existing documented threshold is reproducibly crossed and the brief explicitly permits that architecture. Record measurements and debt instead.

No new AA-owned uncaught Renderer errors may remain after a clean restart.

## 11. Allowed modification boundary

Allowed when necessary:

- `AAOffice/AAApplicationShell/`
- `AAOffice/AANavigationRail/`
- `AAOffice/AAPiEmployee/`
- other AAOffice presentation components and AA-scoped CSS;
- authenticated/dashboard/Settings route composition;
- narrow page-level wrappers/classes for in-scope route families;
- Renderer-only copy and layout integration;
- focused tests, documentation, and safe evidence.

Mature page components may receive narrow presentation props/classes only when shared wrappers cannot solve the issue cleanly.

## 12. Frozen boundary

Do not modify:

- Host Service database/schema/migrations;
- Runtime Contract or registry;
- Pi bridge, extension, lifecycle, or exact-resume logic;
- PTY daemon;
- xterm transport/rendering/input/persistence;
- Git/worktree/branch behavior;
- Active Tasks evidence model;
- Archive persistence model;
- Task Folder persistence semantics;
- Tier 2 lifecycle tracking;
- Grok activation;
- native chat;
- task entity/history/completion;
- orchestration;
- packaging/signing/notarization;
- cross-device sync.

If a required product fix cannot be completed without crossing a frozen boundary, document it as a blocker and stop that subtask. Do not expand scope silently.

## 13. Automated verification

Minimum automated gates:

- all AAOffice tests;
- Phase 4A route-shell and Pi Employee tests;
- New Task, Active Tasks, Archive, Task Folder, Pi status/resume regressions;
- dashboard sidebar and Settings composition tests;
- route classification/navigation tests;
- CSS scope and reduced-motion contract tests;
- terminal focus/hotkey regressions;
- relevant Runtime/Host/Pi regression suites without modifying them;
- Desktop TypeScript;
- Host Service TypeScript;
- Workspace Client TypeScript;
- Session Protocol TypeScript;
- root TypeScript;
- root lint/lint:fix;
- `git diff --check`;
- frozen-boundary audit;
- sensitive-evidence and PNG metadata scan.

All final checks must be rerun after the last product correction.

## 14. Deliverables

Create:

- `docs/aa/PHASE-4B-SINGLE-MACHINE-V0.2-PRODUCT-COMPLETION-REPORT.md`
- `docs/aa/AA-OFFICE-V0.2-RC-CHECKPOINT.md`
- `docs/aa/AA-V0.2-VISUAL-IA-AUDIT.md`
- `docs/aa/AA-V0.2-DEBT-REGISTER.md`
- safe evidence under `docs/aa/v0.2/phase-4b/`

Update:

- `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md` into a current v0.2 guide, or create a clearly superseding `AA-OFFICE-V0.2-USER-GUIDE.md` and link the old guide to it;
- terminology documentation when Phase 4B introduces or corrects user-facing copy.

The Phase 4B report must include:

1. final verdict;
2. exact baseline and final commits;
3. explicit single-machine confirmation;
4. pre-change audit;
5. before/after route matrix;
6. shared page-body architecture;
7. Pi Employee acceptance;
8. route and navigation acceptance;
9. visual hierarchy and density decisions;
10. accessibility/reduced-motion results;
11. real Pi/compatibility workflow;
12. restart/resume results;
13. performance observations;
14. automated verification;
15. files changed and frozen-boundary audit;
16. accepted debt;
17. exact recommendation for the user's manual review.

## 15. STOP condition

After Phase 4B:

1. commit the completed implementation, report, checkpoint, guide, audit, debt register, and safe evidence;
2. push to `origin/aa-spike`;
3. confirm `git status --short` is empty;
4. confirm local HEAD equals `origin/aa-spike`;
5. STOP.

Do not begin Phase 4C.

Do not update another computer.

Do not package or tag a release.

The user will manually review the completed v0.2 experience on the original development Mac before authorizing any distribution, second-machine update, tag, package, or future phase.