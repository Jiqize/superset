# Phase 4C — AA v0.2 Visual Refinement & Interaction Polish

## Status

Phase 4B is complete at commit `ec49eccae06cf13a298bef804a3b567aa7f034ea` with verdict:

`AA OFFICE V0.2 RC READY WITH ACCEPTED DEBT`

The user has reviewed the overall direction and accepts the visual identity. This phase is a controlled refinement pass over the existing product. Preserve the current AA Office language and improve precision, hierarchy, density, alignment, state clarity, and finish.

This phase is authorized only on the original development Mac and only in:

`/Users/lianglei/Code/bluejob/superset`

Do not update or inspect another computer. Do not package, sign, notarize, tag, or distribute.

## Read first

1. `docs/aa/AA-OFFICE-V0.2-RC-CHECKPOINT.md`
2. `docs/aa/PHASE-4B-SINGLE-MACHINE-V0.2-PRODUCT-COMPLETION-REPORT.md`
3. `docs/aa/AA-V0.2-VISUAL-IA-AUDIT.md`
4. `docs/aa/AA-V0.2-DEBT-REGISTER.md`
5. `docs/aa/AA-V0.1-TERMINOLOGY.md`
6. `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
7. `docs/aa/CODEBASE-MAP.md`

Treat the v0.2 RC checkpoint as the frozen product and runtime contract.

## Goal

Make AA Office v0.2 feel more deliberate and finished without changing its product model or architecture.

The target impression is:

- compact industrial office software;
- pixel-worker character with restrained personality;
- clear hierarchy around a dominant real terminal;
- precise spacing and alignment;
- strong functional states;
- consistent application-wide visual rhythm;
- mature page functionality preserved inside the AA shell.

This phase must not become a redesign, theme replacement, or feature expansion.

## Working method

### 1. Capture the baseline before editing

Using the repository-managed isolated QA profile, capture safe baseline screenshots at exactly the same state and route for later comparison.

Required logical viewports:

- 1440×800
- 1920×976

Required baseline surfaces:

1. Home with Briefcase Cabinet expanded
2. Cases with Active Tasks, Saved / Resumable, Archived, and Work Folders visible where real evidence allows
3. Work Folder with Pi `IDLE`, cabinet open, Employee Roster visible, File Cabinet closed
4. Work Folder with Pi `WORKING`, File Cabinet open, one real changed file
5. Work Folder with Codex or another compatibility employee `UNTRACKED`
6. Tasks
7. Automations
8. Pull Requests
9. Sessions
10. Employees & Agents
11. Settings, including Appearance or Keyboard
12. New Work Folder · Advanced

Do not fabricate runtime, Git, PR, automation, or task data for screenshots. Use truthful empty/error states when real data is unavailable.

Before production edits, create an internal visual punch list grouped into:

- alignment;
- spacing;
- typography;
- surface hierarchy;
- state clarity;
- information density;
- accessibility;
- repeated visual noise.

Only implement changes that are supported by the audit or by a clearly reproducible interaction problem.

## Refinement areas

### 2. Global application shell geometry

Review the shared shell across every Phase 4B route.

Refine where evidence supports it:

- rail width, button spacing, icon baseline, label baseline, and selected-state geometry;
- macOS traffic-light and drag-region alignment;
- page header height and body inset alignment;
- border continuity between rail, cabinet, page body, tab bar, and right sidebar;
- route transitions that create one-pixel jumps or inconsistent padding;
- content wells that feel too loose at 1920 or too compressed at 1440;
- disabled, hover, focus, pressed, and current states.

Keep one navigation rail. Do not introduce a second navigation system.

### 3. Typography and label hierarchy

Unify the relative hierarchy of:

- application eyebrow;
- page title;
- page description;
- cabinet section label;
- task title;
- employee identity;
- runtime state;
- metrics and metadata;
- button text;
- tooltips.

Pixel/bitmap character should remain concentrated in functional labels and worker identity. Dense content, forms, file lists, terminal output, and long descriptions should remain highly readable.

Review letter spacing, line height, truncation, and vertical centering. Avoid oversized headings and marketing-style hero layouts.

### 4. Briefcase Cabinet and Active Tasks

Refine the cabinet without changing projection logic.

Audit and improve:

- project header and `NEW TASK` hierarchy;
- current, live, resumable, untracked, archived, and Work Folder group separation;
- task-row height, title baseline, employee/status baseline, changed-count placement, and archive action placement;
- duplicate-title discriminator legibility;
- current-row selection strength without overpowering runtime state;
- collapsed disclosure summaries;
- long titles and narrow cabinet behavior;
- empty and insufficient-evidence states;
- reduced visual repetition between row, Task Folder, Worker, and bottom status.

Do not alter Active Tasks authority, ordering, hashing, evidence classification, archive persistence, or query behavior.

### 5. Work Folder composition

The real terminal must remain the visual and interaction anchor.

Refine the relationship among:

- AA Workspace Header;
- Task Folder;
- Pi Worker Card;
- Employee Roster;
- pane tab bar;
- terminal frame;
- File Cabinet;
- bottom status.

Specific goals:

- reduce persistent chrome that competes with the terminal;
- align Task Folder, Worker, and Roster into one clear horizontal rhythm;
- make the fixed Pi `PRIMARY` tile easy to identify without making it visually oversized;
- keep compatibility employees legible and secondary;
- keep Reasoning Hair and worker pose supportive of explicit text;
- improve Roster overflow controls and edge affordances;
- remove accidental double borders, uneven gaps, and baseline drift;
- retain a practical xterm area at 1440×800 with cabinet and File Cabinet in realistic states.

Do not change terminal, xterm, pane, focus, runtime, or launch behavior.

### 6. Employee Roster state polish

Verify and refine all visible Pi states:

- checking setup;
- setup required;
- available;
- starting;
- working;
- idle;
- waiting when authoritative;
- error;
- offline / resumable.

Verify and refine compatibility presentation:

- available preset;
- dispatching;
- dispatched;
- untracked;
- hidden/overflow management.

Keep Pi first, fixed, non-draggable, and non-hideable. Do not create a synthetic persisted Pi preset. Do not add Tier 2 lifecycle authority.

### 7. File Cabinet state and accessibility refinement

Within the existing File Cabinet composition:

- make the selected Files / Changes / Review state visually unmistakable;
- add correct selected-state accessibility semantics such as `aria-selected` or `aria-pressed` where the existing component structure supports it safely;
- preserve shortcuts, focus, open/close behavior, real counts, Diff behavior, and Review truth;
- align tab labels, icons, count badges, border, and focus geometry;
- preserve the existing file/diff engines.

This is the only currently accepted v0.2 debt item explicitly authorized for correction in Phase 4C. Do not broaden into a file-tree or Diff-engine rewrite.

### 8. Mature page-body polish

Review Home, Tasks, Automations, Pull Requests, Sessions, Employees & Agents, Settings, and Advanced Work Folder inside `AAApplicationPage`.

Refine only scoped presentation concerns:

- header/action alignment;
- filter and toolbar alignment;
- card/table/empty-state edge treatment;
- selected navigation and focus states;
- consistent content padding;
- excess rounded corners, gradients, shadows, or empty decorative space within AA scope;
- truthful AA shell terminology where it does not rename underlying data models.

Do not copy, fork, or reimplement mature route functionality. Keep real Superset forms, tables, queries, and controls.

### 9. Interaction states and motion

Create one consistent AA interaction language for:

- hover;
- keyboard focus;
- pressed/current;
- disabled;
- pending;
- success;
- warning;
- error.

State must remain text-backed. Color, pose, hair, glow, or animation cannot be the sole indicator.

Retain reduced-motion behavior. No infinite animation may remain inside AA scope when `prefers-reduced-motion: reduce` is active.

### 10. Token and CSS discipline

Prefer existing AA tokens. Add a new token only when the audit proves that existing tokens cannot express a recurring structural distinction.

Requirements:

- keep CSS scoped to AA application/page/workspace surfaces;
- no global Superset theme rewrite;
- no gradients, blur, glass, CRT, scanlines, large shadows, or decorative textures;
- avoid one-off magic values when an existing spacing/border/type token fits;
- remove dead or superseded AA CSS introduced by earlier phases when safe;
- preserve contrast and system font fallback behavior.

## Real acceptance journey

After implementation, use one disposable real Git Briefcase on the original Mac and complete this journey through the actual Electron UI:

1. open Home and expand a Briefcase;
2. create one real New Task with Pi;
3. observe authoritative Pi `WORKING → IDLE`;
4. create one harmless changed file;
5. inspect Files, Changes, Diff, and Review;
6. launch one additional Pi conversation from the fixed Roster tile;
7. dispatch Codex or another real compatibility employee and verify `UNTRACKED`;
8. switch through Tasks, Automations, Pull Requests, Sessions, Employees & Agents, Settings, and Advanced Work Folder;
9. return to the original Work Folder;
10. archive and unarchive one Task Folder;
11. verify Renderer reload;
12. perform one full Electron/Host restart;
13. verify no stale `LIVE` state;
14. perform exact Pi resume and prove context continuity;
15. verify 1440×800 and 1920×976;
16. verify keyboard navigation, visible focus, xterm input, and reduced motion.

The acceptance journey must verify that refinement did not change behavior.

## Visual comparison evidence

Store safe before/after evidence under:

`docs/aa/v0.2/phase-4c/`

Use paired filenames where practical, for example:

- `01-home-before-1440.png`
- `01-home-after-1440.png`
- `02-work-folder-idle-before-1440.png`
- `02-work-folder-idle-after-1440.png`
- `03-work-folder-working-after-1920.png`
- `04-settings-before-1440.png`
- `04-settings-after-1440.png`

Evidence must exclude credentials, private repository content, raw IDs, absolute personal paths, prompts/transcripts, and sensitive terminal text.

## Architecture boundaries

Allowed:

- AAOffice presentation components;
- AA scoped CSS/tokens;
- narrow authenticated dashboard and Settings composition;
- existing V2 Presets Bar/Employee Roster presentation;
- existing File Cabinet tab presentation and accessibility attributes;
- focused tests and documentation.

Frozen:

- Host Service behavior and schema;
- Runtime Contract and registry;
- Pi bridge, extension, hooks, resume, model, reasoning, and lifecycle semantics;
- PTY daemon;
- xterm transport/rendering/input/persistence;
- Git, worktree, branch, cleanup, PR, and Diff engines;
- New Task orchestration;
- Active Tasks evidence/projection logic;
- Archive persistence;
- Task Folder persistence/data model;
- Tier 2 lifecycle behavior;
- Grok activation;
- native chat and orchestration.

If a desired refinement requires a frozen-area change, STOP that item and record it as debt. Continue with independent presentation work only when safe.

## Automated verification

Minimum required:

- full AAOffice tests;
- dashboard/sidebar/Settings composition tests;
- Employee Roster and Pi presentation tests;
- File Cabinet selected-state/accessibility tests;
- focused Runtime/terminal/workspace-client/session-protocol regressions;
- full Host Service suite as a regression gate;
- Desktop, Host Service, Workspace Client, Session Protocol, and root TypeScript;
- root `lint:fix` and `lint`;
- `git diff --check`;
- CSS contract test;
- RED/frozen-area audit;
- sensitive-evidence and PNG metadata scan.

## Deliverables

Create:

1. `docs/aa/PHASE-4C-AA-V0.2-VISUAL-REFINEMENT-REPORT.md`
2. `docs/aa/AA-OFFICE-V0.2-VISUAL-REFINEMENT-CHECKPOINT.md`
3. `docs/aa/AA-V0.2-VISUAL-DECISION-LOG.md`
4. update `docs/aa/AA-V0.2-VISUAL-IA-AUDIT.md`
5. update `docs/aa/AA-V0.2-DEBT-REGISTER.md` only for verified changes or new accepted debt
6. safe evidence under `docs/aa/v0.2/phase-4c/`

The report must include:

- exact baseline and final commit;
- before-audit findings;
- implemented refinement decisions;
- rejected or deferred ideas and why;
- before/after route matrix;
- Work Folder density measurements;
- File Cabinet accessibility result;
- real Pi and compatibility regression result;
- restart/resume result;
- viewport and reduced-motion result;
- automated verification;
- frozen-boundary audit;
- final verdict choosing exactly one:
  - `AA OFFICE V0.2 VISUAL REFINEMENT ACCEPTED`
  - `AA OFFICE V0.2 VISUAL REFINEMENT ACCEPTED WITH DEBT`
  - `AA OFFICE V0.2 VISUAL REFINEMENT NEEDS FOLLOW-UP`

## Explicit non-goals

Do not implement:

- new product features;
- new routes;
- new task fields or task entities;
- completion/history/timeline;
- model or reasoning write controls;
- permission/cancellation UI;
- Runtime Contract changes;
- Grok activation;
- cross-device sync;
- packaging/distribution/signing/notarization;
- another computer update;
- broad mature-page redesign;
- new illustration or asset family.

After Phase 4C is complete, commit and push to `origin/aa-spike`, verify a clean worktree and exact remote parity, then STOP. Do not begin Phase 4D.