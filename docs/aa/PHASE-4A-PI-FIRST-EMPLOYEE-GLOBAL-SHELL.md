# Phase 4A — Pi First-Class Employee & Global AA Shell

## Status

AA Office v0.1 RC is complete at commit `e34b5f07afffb795d08abba75ccb1b61ef4c6812`. The current `aa-spike` branch also contains the v0.1 user guide.

This phase is authorized from two real-use findings reproduced on another Mac:

1. AA visual identity is concentrated in the V2 Work Folder route while Home, Sessions, Agents, Settings, and other first-level surfaces still read as the original Superset application.
2. Employee Roster can show Claude, Codex, OpenCode, and other terminal presets while omitting Pi, even though Pi is AA's primary Tier 1 employee and the default New Task runtime.

Both findings violate the accepted AA product model and materially reduce the value of further personal testing.

## Read first

1. `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md`
2. `docs/aa/AA-V0.1-DEBT-REGISTER.md`
3. `docs/aa/AA-V0.1-TERMINOLOGY.md`
4. `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md`
5. `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md`
6. `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
7. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
8. `docs/aa/CODEBASE-MAP.md`

Preserve the v0.1 RC contracts unless this brief explicitly changes presentation composition.

## Goal

Establish the first coherent AA v0.2 foundation through two tightly scoped outcomes:

1. Pi is always represented as the primary first-class Employee in the Employee Roster, grounded in the real Host Pi agent configuration and existing Tier 1 runtime contract.
2. AA becomes the consistent application shell across the user's daily first-level routes, while mature Superset page content and infrastructure remain intact.

The result should feel like one product when the user moves between Briefcases, Home, Work Folders, Sessions, Agents, Settings, Tasks, Automations, Pull Requests, and advanced Workspace creation.

Do not build new runtime, task, Git, chat, or orchestration capabilities.

# Part A — Pi First-Class Employee

## A1. Product contract

Employee Roster order in AA mode must be conceptually:

```text
Tier 1 employees
  Pi
  Grok, only after future authenticated activation

Compatibility employees
  Claude
  Codex
  OpenCode
  Superset CLI
  other configured presets
```

For Phase 4A:

- Pi is fixed first.
- Pi is labelled as the primary Tier 1 employee through restrained presentation.
- Compatibility employees continue to use existing preset behavior.
- Grok remains authentication-gated and is not added as an active roster employee in this phase.

Pi must not disappear merely because no user-created terminal preset row exists.

## A2. Authoritative Pi source

Use the real Host agent configuration whose `presetId === "pi"`, following the same selection rule already accepted by New Task:

- first ordered real Host config matching `presetId === "pi"`;
- no fabricated config;
- no last-selected compatibility employee fallback;
- no persisted synthetic terminal-preset row solely to make Pi visible.

Reuse or centralize the existing Pi selection contract so New Task and Employee Roster cannot drift.

If a safe ephemeral presentation object is needed, keep it Renderer-only and prove it cannot enter the persisted terminal-preset collection.

## A3. Pi availability states

Pi occupies the first roster position in AA mode under both conditions:

### Available

When a real Host Pi config exists:

- show the Pi pixel employee;
- show `PRIMARY` or equivalent compact Tier 1 treatment;
- allow launching a new Pi conversation in the current Work Folder;
- show authoritative live runtime state when a matching Pi snapshot exists;
- preserve explicit Task Folder title when the current work is sent to Pi.

### Setup required

When no real Host Pi config exists:

- keep a disabled/non-launching Pi employee visible first;
- show truthful copy such as `PI · SETUP REQUIRED`;
- provide a clear action to the existing Agent settings/setup surface;
- do not infer whether the binary, extension, or config is missing unless existing authoritative diagnostics provide that distinction;
- New Task and Roster must use consistent missing-Pi language.

A missing config must never silently remove AA's primary employee from the user's mental model.

## A4. Pi launch behavior from Employee Roster

Clicking available Pi in Employee Roster means:

```text
Send current Task Folder to Pi
→ launch one new Pi terminal conversation in the same real Work Folder
→ preserve the explicit Task Folder title when present
→ activate/focus the new real terminal pane
→ wait for normal authoritative Pi Runtime Contract evidence
```

Requirements:

- reuse the existing safe terminal/agent launch path;
- do not create a new Work Folder;
- do not resume or replace an old Pi conversation automatically;
- do not destroy the active terminal/session;
- do not create a second launch through duplicate event handling;
- launch receipt may use existing `HANDING TO PI` / `DISPATCHED TO PI` language;
- Tier 1 `ASSIGNED`/live state remains runtime-evidence-driven;
- Worker Card and Employee Profile must resolve to the launched Pi runtime when the new terminal becomes active;
- exact Pi resume semantics remain unchanged.

If the existing generic preset execution path cannot launch the Host Pi config safely without persistent fabrication, create the smallest narrow Renderer launch adapter over existing launcher APIs. Do not change Host runtime behavior.

## A5. Pi deduplication

If existing user data contains a terminal preset or compatibility row that resolves to the same Pi Host agent config:

- show one Pi Employee in AA Roster;
- preserve the user's underlying preset/config in settings;
- do not delete or mutate user data;
- avoid duplicate hotkeys and duplicate launches;
- document the exact dedupe key and fallback behavior.

Pi remains fixed first and does not participate in compatibility-preset drag ordering or hide/show controls. Compatibility presets retain current ordering and visibility behavior.

## A6. Pi profile and accessibility

- Pi roster button must have a complete accessible name including availability and primary status.
- Keyboard activation launches or opens setup as appropriate.
- Tooltips explain `PRIMARY TIER 1` and `SETUP REQUIRED` without exposing internal config IDs.
- Reduced motion remains respected.
- Pixel persona, Reasoning Hair, model, and lifecycle display only real data under existing contracts.

# Part B — Global AA Application Shell

## B1. Route coverage audit

Before implementation, enumerate the real route tree and produce a coverage matrix for every first-level destination reachable from the current AA navigation and normal dashboard navigation.

Required minimum coverage:

- `/v2-workspaces` — Home / Briefcase index
- `/v2-workspace/$workspaceId` — Work Folder
- `/new-workspace` — advanced Workspace creation
- `/tasks`
- `/automations`
- `/pull-requests`
- `/settings/terminal` — Sessions/presets
- `/settings/agents` — Agents/employees
- `/settings/account` — Settings entry

Include route aliases/nested settings pages that share the same layouts. Do not apply AA shell to authentication, login, onboarding, or unrelated public surfaces.

## B2. Shell architecture

Replace the current workspace-only `aaOfficeActive` assumption with a route-aware AA application-shell contract.

The implementation should provide a shared outer composition with:

- AA navigation rail;
- AA background and hard-edge frame language;
- consistent macOS traffic-light/drag-region treatment;
- AA typography, spacing, borders, and page-surface hierarchy;
- route-aware active navigation state;
- existing dashboard/sidebar/settings content mounted inside the shell rather than rewritten.

Use the smallest common layout boundary that can cover the required routes without duplicating shell code. Renderer-only route/layout work is preferred.

Do not force workspace-only providers, Runtime queries, File Cabinet state, or terminal assumptions onto non-workspace routes.

## B3. Navigation Rail behavior outside Work Folders

Make `AANavigationRail` a true application navigation surface.

Required behavior:

- `HOME` navigates to the AA Home/Briefcase index and shows active state there.
- `CASES` opens or navigates to the Briefcase/Project index. Inside a Work Folder it may retain the current cabinet toggle behavior. Outside a Work Folder it must not call workspace-only state blindly.
- `FILES` remains context-specific. Outside a real Work Folder it is visibly disabled or explains `Open a Work Folder to browse files`; it must not open an empty/incorrect sidebar.
- `SESS` is active on terminal/session preset settings.
- `AGENTS` is active on agent settings.
- `SET` is active on general settings routes.
- Add restrained navigation entries for Tasks, Automations, and Pull Requests if these remain first-level product destinations after the route audit. Use the AA icon vocabulary and compact labels.
- Active state must be route-derived, not stale local state.
- Full accessible names and keyboard navigation are required.

Do not create a parallel router or duplicate existing page actions.

## B4. Briefcase/sidebar consistency

On all applicable V2 dashboard routes:

- use the AA Briefcase Cabinet/Active Tasks styling when the dashboard sidebar is present;
- retain real Active Tasks, Archived, Work Folders, New Task, and advanced Workspace behaviors;
- avoid falling back to the plain Superset sidebar merely because the center route is Home, Tasks, Automations, Pull Requests, or New Workspace;
- preserve collapse/expand, resize, keyboard, project selection, and traffic-light spacing.

Settings pages may keep their existing settings navigation panel, but the outermost application frame and global AA rail should remain consistent.

## B5. Page content treatment

Do not redesign mature Superset functions in Phase 4A.

For Home, Tasks, Automations, Pull Requests, New Workspace, and Settings:

- keep existing data, forms, tables, routes, actions, and business logic;
- place them inside an AA page frame/surface;
- normalize page header hierarchy, background, border, spacing, and empty-state treatment where safely local;
- remove obvious visual discontinuities such as sudden rounded/glassy full-page shells when a hard-edge AA wrapper can contain them;
- keep original complex widgets intact when restyling them would increase risk.

The acceptance standard is one coherent application shell, not a complete rewrite of every internal component.

## B6. Feature and fallback boundaries

- Non-AA/V1 behavior remains unchanged.
- Existing feature flags continue to select the appropriate route generation.
- If a route cannot safely receive the full shell, document the blocker and apply the closest consistent outer frame rather than altering its business logic.
- No page may lose functionality, focus order, native drag regions, or window controls.
- Global shell CSS must remain scoped and must not leak into login/onboarding/public pages.

# Cross-machine clean-profile acceptance

The real-use problem was found on another computer. Phase 4A must include a guarded clean-profile test that starts with no AA user preset assumptions.

Required scenarios:

1. Real Pi config available, no Pi terminal-preset row:
   - Pi appears first;
   - compatibility employees appear after it;
   - Pi launches a new real conversation;
   - runtime/Worker/Profile become authoritative.
2. Pi config unavailable:
   - Pi remains visible first as `SETUP REQUIRED`;
   - click routes to existing Agent setup;
   - no fake launch occurs.
3. Existing compatibility presets for Claude, Codex, OpenCode, and Superset CLI:
   - all remain usable;
   - no compatibility runtime receives Pi authority.
4. Existing duplicate Pi-like preset:
   - one Pi Employee appears;
   - user settings data remains intact.
5. Route journey:
   - Home → Cases → Work Folder → Files → Sessions → Agents → Settings → Tasks → Automations → Pull Requests → Advanced Workspace → back to active Task;
   - AA outer shell remains coherent throughout;
   - real page functions remain available.
6. Full Electron/Host restart:
   - shell selection and route behavior remain correct;
   - Pi roster availability is reconstructed from current Host config;
   - exact Pi resume still passes.

Test at 1440×800 and 1920×976, including sidebar collapsed/expanded and reduced motion.

# Architecture boundaries

Allowed:

- AAOffice components/presentation/tests;
- authenticated/dashboard/settings route-layout composition;
- AANavigationRail route behavior;
- V2PresetsBar roster composition;
- existing Renderer terminal/agent launch helper composition where necessary;
- scoped AA CSS and AA pixel icon additions;
- focused settings/home/dashboard page wrappers.

Frozen unless a verified blocker is documented before change:

- Host Service API/business behavior;
- Host database schema/migrations;
- AA Runtime Contract;
- Pi bridge and resume semantics;
- PTY daemon;
- xterm transport/rendering/input;
- Git/worktree behavior;
- Task/Archive data model;
- Tier 2 runtime tracking;
- Grok ACP activation.

Do not introduce a persistent Pi preset row as a shortcut.

# Verification

Automated minimum:

- Pi selection/availability/dedupe presentation tests;
- Pi roster launch exactly-once tests;
- missing-Pi setup-route tests;
- V2PresetsBar compatibility regressions;
- route-aware shell/rail active-state tests;
- workspace and non-workspace rail behavior tests;
- dashboard/sidebar shell-composition tests;
- AA CSS scoping/reduced-motion tests where practical;
- existing New Task, Active Tasks, Archive, Pi Runtime, exact resume, and Tier 2 regressions;
- Desktop and all touched package TypeScript;
- root lint;
- `git diff --check`;
- RED-area and sensitive-evidence scans.

Real minimum:

- clean-profile cross-machine-equivalent journey described above;
- new Pi conversation from Employee Roster;
- real Task Folder title carry-forward;
- authoritative `WORKING → IDLE` Pi lifecycle;
- compatibility employee dispatch;
- full restart and exact resume;
- all required route shells;
- native keyboard/focus/traffic-light/drag behavior;
- both viewports and reduced motion.

# Deliverables

Create:

- `docs/aa/PHASE-4A-PI-FIRST-EMPLOYEE-GLOBAL-SHELL-REPORT.md`
- `docs/aa/AA-V0.2-SHELL-EMPLOYEE-CHECKPOINT.md`
- `docs/aa/AA-V0.2-REAL-USE-FINDINGS.md`
- safe evidence under `docs/aa/v0.2/phase-4a/`

Update when implementation is accepted:

- `docs/aa/AA-OFFICE-V0.1-USER-GUIDE.md` with current launch/use behavior and a note that the guide now describes the v0.2 foundation branch state;
- `docs/aa/AA-V0.1-DEBT-REGISTER.md` only to mark these two real-use findings as resolved or superseded, while retaining historical traceability.

The report must include:

1. executive verdict;
2. exact baseline/final commits and environment;
3. root-cause explanation for missing Pi;
4. Pi roster data/launch/dedupe contract;
5. missing-Pi setup behavior;
6. route coverage matrix before/after;
7. global shell architecture;
8. navigation behavior matrix;
9. clean-profile acceptance;
10. Pi and compatibility runtime results;
11. restart/resume result;
12. accessibility, viewports, and reduced motion;
13. automated verification;
14. files changed and frozen-boundary audit;
15. accepted limitations and recommended next step.

# Explicit non-goals

Do not implement:

- Grok authenticated activation;
- new Runtime Contract capabilities;
- native structured chat;
- model/reasoning write controls;
- automatic orchestration or handoff;
- Task completion/history/timeline;
- Task database/entity;
- new Git/worktree behavior;
- packaging/signing/notarization;
- a complete redesign of every Superset page component.

After Phase 4A is complete, commit and push implementation, report, checkpoint, findings, guide/debt updates, and safe evidence to `origin/aa-spike`, then STOP. Do not begin Phase 4B.