# Phase 4A: First-Class Pi Employee and Global AA Shell

## Status

AA Office v0.1 RC is accepted at implementation commit `04c2fb53b78455f696f8be7f81108ab3c06b691d` and documentation closeout commit `e34b5f07afffb795d08abba75ccb1b61ef4c6812`.

The current `aa-spike` tip also includes `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md`.

This phase is authorized from real use on a second computer. Two product gaps now materially block useful testing:

1. the AA shell is visually dominant only inside a concrete V2 Work Folder route, while Home and settings surfaces return to visibly different Superset presentation;
2. the Employee Roster shows compatibility presets such as Claude, Codex, and OpenCode, while Pi, the primary Tier 1 daily runtime, has no stable first-class roster item.

Phase 4A should correct both gaps while preserving the v0.1 RC runtime, work model, Git, terminal, and persistence contracts.

## Read first

1. `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md`
2. `docs/aa/AA-V0.1-TERMINOLOGY.md`
3. `docs/aa/AA-V0.1-DEBT-REGISTER.md`
4. `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md`
5. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
6. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
7. `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md`
8. `docs/aa/CODEBASE-MAP.md`

Treat the RC checkpoint and Runtime Contract as normative. Do not reopen accepted runtime semantics without a verified blocker.

## Goal

Create one coherent AA product surface across the user’s normal navigation, and make Pi visibly and functionally the primary Employee in every Work Folder.

The expected product hierarchy is:

```text
AA OFFICE

Global shell
  Home
  Briefcases
  Sessions
  Agents
  Settings

Inside a Work Folder
  Employee Roster
    Pi: Primary Tier 1
    compatibility employees
  Task Folder
  Pi Workstation
  Output
```

At the end of Phase 4A, a fresh user on another Mac should understand these facts without prior explanation:

- AA Office remains the same product when navigating away from a Work Folder;
- Pi is the primary Employee;
- clicking Pi in the Employee Roster can start a new Pi conversation in the current Work Folder;
- Claude, Codex, OpenCode, Superset CLI, and similar entries remain compatibility Employees;
- runtime truth, Task Folder truth, and Git truth remain unchanged.

## Part 1: First-class Pi Employee

### Product contract

Pi must appear as the first Employee in the Work Folder Employee Roster whenever the current serving Host exposes a real agent config with `presetId === "pi"`.

Pi must not depend on:

- a user-created terminal preset;
- preset bar ordering;
- preset visibility preferences;
- the built-in Superset CLI preset list;
- a compatibility preset with the display name `Pi`;
- stale configuration from another Host.

The first-class roster composition should be conceptually:

```text
TIER 1 EMPLOYEES
Pi
Grok later, after authenticated activation

COMPATIBILITY EMPLOYEES
Claude
Codex
OpenCode
Superset CLI
other configured presets
```

The UI may keep this as one compact horizontal row. It does not need large visible section headers. The ordering and visual hierarchy must still communicate that Pi is primary.

### Authoritative Pi config selection

Reuse the same product rule as New Task:

```ts
configs.find((config) => config.presetId === "pi")
```

Use the agent configuration list from the Host that serves the current Work Folder. Confirm the correct Host URL before implementation. Do not silently use a different local or globally active Host when the Work Folder is served elsewhere.

If multiple Pi configs exist, v0.1 behavior remains deterministic: use the first ordered real Host config matching `presetId === "pi"`. Agent Settings remains the place to manage configuration.

### Always-visible state

The Pi Employee position must remain visible even when a valid Pi config cannot currently be resolved.

Valid product states:

- `PI · AVAILABLE`
- `PI · CURRENT`
- `PI · STARTING`
- `PI · LIVE · <authoritative lifecycle>`
- `PI · SETUP REQUIRED`
- `PI · HOST OFFLINE`

Use compact copy consistent with the existing AA terminology and available evidence.

When Pi is unavailable:

- keep the roster item visible and disabled;
- explain the exact reason through tooltip and accessible description;
- provide a clear route to Agent Settings when configuration is missing;
- do not fabricate a config or launch command;
- do not hide Pi and leave only compatibility Employees.

### Pi roster presentation

Use the existing explicit Pi persona and Pixel Worker language.

The roster item should include:

- Pi avatar/persona;
- `PI` label;
- a restrained `PRIMARY` or Tier 1 cue where it fits;
- exact runtime state only when a matching authoritative snapshot is available;
- full accessible name describing availability and action;
- a tooltip that explains the action, for example `Start a new Pi session in this Work Folder`.

Do not expose raw runtime, terminal, Workspace, or native session identifiers.

Do not make Tier 1 a performance ranking. It is the AA runtime integration tier.

### Launch behavior

Activating the Pi roster item should start one new Pi terminal conversation in the current Work Folder through the existing mature agent/terminal launch path.

Required behavior:

1. use the current Work Folder’s real Host Pi config;
2. preserve the current explicit Task Folder title when one exists;
3. open a new real terminal pane/tab using existing V2 layout semantics;
4. keep the existing Pi session and all other terminals intact;
5. do not resume or replace an earlier Pi conversation;
6. do not close the current Employee;
7. do not create a new Work Folder;
8. do not create a Task entity;
9. keep xterm/TUI as the work surface;
10. wait for existing Runtime Contract evidence before showing Pi as live.

The assignment language remains truthful:

- `HANDING TO PI` while the existing launch operation is pending;
- `DISPATCHED TO PI` after the terminal/launch path accepts the action;
- `LIVE` and lifecycle only after exact Pi Runtime Contract evidence arrives.

Terminal creation alone must not be shown as a live Pi runtime.

### Launch failure

If launch fails:

- return the assignment UI to an explicit failure/idle state;
- retain the current Work Folder and current terminals;
- show the real error through the existing toast/error conventions;
- do not create a fake Pi pane;
- do not automatically retry;
- do not fall back to another Employee.

### Dedupe rules

Prevent duplicate Pi identities in the Employee Roster.

- The first-class Pi item owns the real Host config whose `presetId === "pi"`.
- A compatibility preset bound to that exact Pi agent config must not render as a second Pi Employee.
- Do not dedupe by display name alone. A user preset merely named `Pi` is not authoritative evidence.
- Preserve all unrelated presets and their ordering.

### Roster settings behavior

The existing Manage Employee Roster surface may continue to manage compatibility preset visibility and ordering.

Pi should not be hidden through compatibility preset visibility settings.

The manage surface should make its ownership clear:

- Pi configuration routes to Agent Settings;
- compatibility entries route to preset management;
- Superset CLI remains the existing built-in compatibility item;
- hiding a compatibility preset must never hide Pi.

### Tests for Pi

Add focused tests for:

- Pi appears first with a valid current-Host config;
- Pi remains visible as `SETUP REQUIRED` when config is missing;
- current Host and remote/alternate Host selection do not cross-contaminate;
- compatibility visibility preferences do not hide Pi;
- exact Pi config dedupe;
- a user preset named Pi without authoritative identity is not incorrectly removed;
- Task Folder title preservation;
- one launch action creates one new Pi terminal path;
- no resume ID or replacement behavior;
- dispatch receipt versus authoritative live state;
- launch failure creates no fake live state;
- Tier 2 Employee behavior remains unchanged.

## Part 2: Global AA shell consistency

### Current problem

The current AA shell is activated primarily for `/v2-workspace/$workspaceId`. Navigating to Home, Sessions, Agents, Settings, or other dashboard pages visibly drops the AA rail, spacing, page frame, and industrial surface language.

This phase should make the product feel continuous while retaining existing Superset page functionality.

### Required route coverage

At minimum, apply the AA global shell to these macOS V2 daily-use surfaces:

- `/v2-workspaces` as Home;
- `/v2-workspace/$workspaceId` as the existing Work Folder surface;
- `/new-workspace` as the advanced Work Folder creation surface;
- `/automations`;
- `/tasks`;
- `/pull-requests`;
- `/settings/terminal` as Sessions;
- `/settings/agents` as Agents;
- `/settings/account` and the remaining `/settings/*` routes as Settings.

Also inspect any route reached directly from current AA navigation or normal V2 dashboard navigation. Include it if omission would create an immediate shell drop during the accepted daily path.

Do not apply the AA shell to:

- sign-in;
- onboarding;
- organization creation;
- V1 workspace routes;
- incompatible-version states where the existing recovery screen must remain authoritative;
- modal-only or system error surfaces that require their own full-screen handling.

### Shell architecture

Create or refactor toward one route-aware global AA shell boundary.

Preferred properties:

- one `AANavigationRail` instance at a time;
- one scoped AA shell root class/data attribute;
- one route classification helper with pure tests;
- no CSS leakage into non-AA/V1 routes;
- no duplicate drag regions, traffic-light padding, TopBars, or navigation controls;
- preserve the existing Work Folder tab-bar integration;
- preserve the existing dashboard sidebar and settings navigation;
- preserve page-specific route components and business logic.

The exact composition layer may be the authenticated layout, dashboard layout, settings layout, or a narrow shared wrapper. Choose the smallest architecture that provides continuous routing without duplicating the shell.

Document the decision in the Phase 4A report.

### AANavigationRail behavior

The rail must remain visible across required AA routes and expose truthful route-aware active states.

Required navigation behavior:

- `HOME` routes to `/v2-workspaces` and is active there;
- `CASES` opens or returns to the Briefcase index in a meaningful route context;
- `FILES` works inside a Work Folder and is clearly disabled outside one;
- `SESS` routes to `/settings/terminal` and is active there;
- `AGENTS` routes to `/settings/agents` and is active there;
- `SET` routes to Settings and is active on other settings pages.

Outside a Work Folder, `FILES` must not pretend a file context exists. Use a disabled state with a concise tooltip such as `Open a Work Folder to view Files`.

When `CASES` cannot directly toggle the Work Folder sidebar because the current route does not mount it, route to Home and expose the existing Briefcase index there.

Do not add fake session, agent, or file counts to the rail.

### Page frame and visual consistency

The required result is a coherent shell, not a rewrite of every Superset feature.

Apply AA visual language to the route-level frame:

- continuous graphite/charcoal application background;
- hard-edge panel boundaries;
- consistent window/drag region;
- compact industrial page header;
- AA typography hierarchy;
- AA spacing and surface tokens;
- route-aware title and optional short subtitle;
- selected navigation in deep navy;
- amber reserved for real working/attention states;
- clear content container boundaries.

Preserve existing page internals where mature functionality already exists:

- data tables;
- forms;
- filters;
- settings controls;
- task/automation/PR behavior;
- New Workspace behavior;
- existing empty states.

Where existing internal surfaces clash strongly with the shell, use narrowly scoped wrapper styles or existing component variants. Do not clone a page just to restyle it.

### Required page titles

Use terminology consistent with `AA-V0.1-TERMINOLOGY.md`.

Suggested route-level headings:

- Home: `AA OFFICE` or `BRIEFCASES` with the existing project/work overview;
- `/v2-workspaces`: `BRIEFCASES` or `WORK INDEX`;
- `/new-workspace`: `NEW WORK FOLDER · ADVANCED`;
- `/automations`: `AUTOMATIONS`;
- `/tasks`: use existing product meaning, without confusing Superset tasks with AA Task Folders;
- `/pull-requests`: `DELIVERY / PULL REQUESTS` where accurate;
- `/settings/terminal`: `SESSIONS`;
- `/settings/agents`: `EMPLOYEES / AGENTS` where the existing settings content remains understandable;
- other settings: `SETTINGS` plus existing section title.

Do not rename underlying technical concepts in ways that damage accuracy. The terminology document remains authoritative.

### Workspace route protection

The existing Work Folder route is the strongest and most verified AA surface. Preserve it exactly unless a change is necessary to integrate the global shell.

Protect:

- `AAWindowFrame`;
- tab/pane layout;
- real xterm sizing and focus;
- `AAWorkspaceHeader`;
- Employee Roster;
- Task Folder;
- Worker/Reasoning presentation;
- File Cabinet;
- bottom status bar;
- New Task Workspace Gate;
- full restart and exact Pi resume;
- Active Tasks and Archive behavior.

Any visual refactor must pass pixel/dimension comparison at 1440×800 against the RC before intentional changes are accepted.

### Settings route protection

Settings has mature navigation and forms. Keep all existing sections and behavior.

Add the AA global shell around Settings and make the route transition visually continuous. Do not rebuild the settings information architecture.

The AA rail and the existing settings section navigation may coexist. Their hierarchy must be clear:

- AA rail: global product areas;
- settings navigation: settings subsections.

Avoid two equally dominant left rails. Use density, width, and surface hierarchy to keep the AA rail primary and settings navigation secondary.

### Dashboard page protection

Tasks, Automations, Pull Requests, and Home remain existing Superset features under the AA shell. This phase does not change their data model, API behavior, or workflow.

Do not introduce Agent runtime claims into pages that lack a Work Folder/runtime context.

## Part 3: Fresh-computer acceptance

The triggering feedback came from a second computer. Reproduce the important conditions with a clean isolated profile.

### Required clean-profile cases

1. A current Host with Pi plus several compatibility agent configs/presets.
2. A current Host with compatibility presets but no valid Pi config.
3. A normal Work Folder with an existing Task Folder title.
4. Home and Settings reached directly before opening a Work Folder.
5. Full Electron/Host restart.

### Required real journey

Use real Electron pointer and keyboard interaction where practical.

1. start from Home in a clean profile;
2. verify the AA shell and rail are already present;
3. navigate Home → Agents → Sessions → Settings → Home without shell disappearance or layout flash;
4. open a Briefcase and create a real New Task;
5. verify New Task still launches the authoritative Pi path;
6. confirm Pi appears first in Employee Roster;
7. launch a second Pi conversation from the Pi roster item in the same Work Folder;
8. verify the original Pi session remains available;
9. verify the new Pi terminal is `DISPATCHED` before runtime evidence and becomes authoritative only after the matching snapshot;
10. dispatch one Tier 2 Employee and confirm `UNTRACKED` remains truthful;
11. inspect Files/Changes/Diff/Review;
12. navigate away to Home/Settings and back without losing Task/terminal state;
13. perform Renderer reload;
14. fully restart Electron/Host;
15. verify saved/resumable and exact Pi resume behavior;
16. verify the global shell remains present after restart;
17. verify 1440×800 and 1920×976;
18. verify keyboard navigation, focus restoration, accessible names, and reduced motion.

### Missing-Pi acceptance

In a controlled clean profile/fixture with no valid Pi config:

- Pi remains the first roster position;
- Pi reads `SETUP REQUIRED` or equivalent exact copy;
- the action is disabled;
- the tooltip/accessibility description explains why;
- Agent Settings is reachable;
- compatibility Employees still render;
- no fake Pi launch occurs.

Do not mutate the user’s real Agent configuration merely to simulate this case. Use safe test fixtures, mocks, or an isolated disposable Host/profile.

## Part 4: Performance and stability

The global shell must not materially degrade route navigation or Work Folder interaction.

Measure in the isolated development profile:

- Home → Settings route transition;
- Settings → Home transition;
- Home → Work Folder transition;
- Work Folder → Home → Work Folder return;
- Pi roster click → terminal creation receipt;
- terminal creation → authoritative Pi identity;
- post-settle xterm input latency;
- cold restart shell settle.

These are development-profile observations, not packaged-build benchmarks. Record them without inventing hard release thresholds.

Required guards:

- no duplicate Runtime/Host queries caused by multiple shell instances;
- no repeated AANavigationRail mounts during nested route changes where avoidable;
- no new polling;
- no document-level overflow;
- no Work Folder terminal width regression;
- no input/navigation freeze;
- no new AA-owned uncaught console errors after clean restart.

## Architecture boundaries

### Allowed

- AAOffice components and scoped styles;
- route-aware AA shell composition;
- authenticated/dashboard/settings layout composition where required;
- AANavigationRail route logic;
- V2PresetsBar composition;
- a dedicated first-class Pi roster item and pure presentation helpers;
- narrow existing V2 terminal/agent launch composition needed to reuse the real Pi config;
- focused tests and documentation;
- update the v0.1 user guide to reflect the shipped behavior.

### Frozen unless a verified blocker is documented

- AA Runtime Contract semantics;
- Pi bridge and Pi lifecycle mapping;
- terminal-agent persistence and exact resume eligibility;
- PTY daemon;
- xterm transport/rendering/input;
- Git/worktree creation and cleanup semantics;
- Host Workspace schema and migrations;
- Active Tasks archive field and mutation;
- Task Folder persistence contract;
- New Task product contract;
- Tier 2 runtime tracking;
- Grok ACP activation;
- task/completion/history data model.

If launching Pi from the roster appears to require a Runtime, PTY, Host schema, or Git change, stop that subfeature and document the actual missing existing launch capability before crossing the boundary.

## Explicit non-goals

Do not implement:

- Grok authentication or Phase 3F;
- native chat;
- model/reasoning write controls;
- permissions/cancellation UI;
- agent orchestration or automatic handoff;
- Task entity, Done, history, priority, tags, due dates, or timeline;
- package/sign/notarize/release engineering;
- Windows/Linux shell redesign;
- sign-in/onboarding redesign;
- full rewrites of Tasks, Automations, Pull Requests, or Settings;
- new Host schema or migration;
- new agent/preset persistence model;
- fake runtime status on global pages.

## Automated verification

At minimum run:

- all AAOffice tests;
- new global shell route-classification/navigation tests;
- new Pi roster composition and launch tests;
- V2PresetsBar regressions;
- New Task regressions;
- Task Folder/Handoff regressions;
- Active Tasks/Archive regressions;
- Runtime Contract, Host runtime registry/router, Pi bridge, terminal-agent persistence/resume regressions;
- Desktop TypeScript;
- Host Service TypeScript;
- Workspace Client TypeScript;
- Session Protocol TypeScript;
- root TypeScript if touched scope warrants it;
- root lint and `git diff --check`;
- RED-area modification audit;
- sensitive evidence scan.

Do not weaken existing RC tests to make the new composition pass.

## Deliverables

Create:

- `docs/aa/PHASE-4A-FIRST-CLASS-PI-AND-GLOBAL-AA-SHELL-REPORT.md`
- `docs/aa/AA-OFFICE-V0.2-FOUNDATION-CHECKPOINT.md`
- `docs/aa/AA-V0.2-REAL-USE-FINDINGS.md`
- safe evidence under `docs/aa/v0.2/phase-4a/`

Update:

- `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md`

The report must include:

1. executive verdict;
2. exact baseline/final commits and environment;
3. route coverage map before/after;
4. global shell architecture decision;
5. navigation rail behavior by route;
6. page-frame/visual consistency decisions;
7. Pi Employee data source and Host selection;
8. Pi ordering, unavailable state, and dedupe rules;
9. exact Pi roster launch path reused;
10. dispatch versus authoritative runtime behavior;
11. fresh-computer/clean-profile acceptance;
12. full restart and exact resume result;
13. Tier 2 and Grok regression result;
14. accessibility, focus, reduced-motion, and viewport checks;
15. performance observations;
16. automated verification;
17. files/areas changed;
18. security and frozen-boundary review;
19. known limitations;
20. recommendation for the next real-use cycle.

The checkpoint must define the new stable contract for:

- global AA shell route coverage;
- first-class Pi Employee behavior;
- Tier 1 versus compatibility Employee ordering;
- Pi unavailable behavior;
- shell behavior outside a Work Folder;
- preserved v0.1 RC runtime/work contracts.

## Final verdict

Choose exactly one:

- `AA V0.2 FOUNDATION READY`
- `AA V0.2 FOUNDATION READY WITH ACCEPTED DEBT`
- `AA V0.2 FOUNDATION NOT READY`

After implementation, verification, report, checkpoint, findings, user-guide update, and safe evidence are complete, commit and push to `origin/aa-spike`, then STOP. Do not begin another phase.