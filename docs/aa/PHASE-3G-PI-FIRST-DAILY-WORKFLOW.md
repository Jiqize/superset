# Phase 3G — Pi-first Daily Workflow v0.1

## Status and sequencing

Phase 3E is complete at commit `7f6004c0417a59c33872f7d3a6294ae05cb1ffed`.

`PHASE-3F-GROK-TIER1-ACTIVATION.md` remains intentionally deferred because the current machine is not authenticated to Grok Build and the user is away from the machine where login can be completed conveniently. Do not execute Phase 3F during this task.

Phase 3G is a Pi-first daily-use pass over the accepted Agent Workspace model:

> Project → Workspace → Task Folder → Employee → Output

Pi remains the primary Tier 1 product runtime. Grok remains Tier 1 but authentication-gated. Codex, Claude Code, OpenCode, Kimi, and other CLIs remain Tier 2 compatibility employees.

## Read first

1. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
2. `docs/aa/PHASE-3E-REPORT.md`
3. `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
4. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
6. `docs/aa/CODEBASE-MAP.md`
7. `docs/aa/DOGFOOD-V0.1-REPORT.md`

Treat the checkpoints and Runtime Contract as authoritative. Preserve the Phase 3E work-model definitions and truthfulness rules.

## Goal

Make the existing Pi-first AA Agent Workspace materially faster and clearer for repeated daily use without introducing a new runtime, task database, native chat, or orchestration system.

This phase should optimize the repeated loop:

```text
Open project
→ choose/create Work Folder
→ name Task Folder
→ work with Pi
→ inspect Output
→ optionally send Task Folder to a compatibility employee
→ return to Pi
→ leave/reopen/restart
→ resume exact Pi session
```

Phase 3G must reduce interaction friction, duplicate information, and unnecessary pointer travel while keeping runtime truth explicit.

## 1. Daily workflow audit before implementation

Before changing UI, run one compact real Pi-first workflow in the isolated QA profile and record the interaction path.

Measure at minimum:

- actions/clicks/keystrokes from opening a project to focusing a usable Pi TUI;
- actions required to name/rename a Task Folder;
- actions required to open Files, Changes, and Diff;
- actions required to inspect Employee Profile;
- actions required to return focus to Pi;
- actions required to resume an offline Pi session after full restart;
- any duplicated state labels visible simultaneously;
- any controls that require excessive pointer travel at 1440×800.

Do not optimize toward an arbitrary click-count target. Use the audit to identify real repeated friction.

Record the before/after workflow table in the Phase 3G report.

## 2. Task Folder daily-use ergonomics

Task Folder 2.0 is already the accepted lightweight work context. Improve its daily ergonomics without making it a persistent task entity.

Requirements:

- keep the compact Task Folder mark visible near the workstation;
- preserve direct rename with keyboard support;
- add a discoverable keyboard-first rename path if one is not already obvious;
- opening Task Folder context must not steal terminal focus permanently after dismissal;
- context card should prioritize the most actionable facts: title, employee, status, output count, resume availability;
- model/reasoning/runtime detail may be secondary when space is tight because Employee Profile already carries deep runtime detail;
- remove or de-emphasize duplicated labels when the same fact is already adjacent in Worker/Terminal chrome;
- preserve exact title across handoff, Diff/File pane activation, Renderer reload, and exact Pi resume;
- never add prompt/transcript summaries, fake progress, due dates, priorities, or task persistence.

At 1440×800, the Task Folder context must remain readable without materially shrinking the TUI.

## 3. Pi Worker and Employee Profile daily-use ergonomics

Keep the Pixel Worker memorable but make the primary workspace faster to scan.

Required hierarchy in the compact worker surface:

1. employee identity;
2. current authoritative status;
3. effective reasoning/hair when available;
4. compact model identity if it fits without crowding;
5. clear affordance to open Employee Profile.

Employee Profile remains the deeper surface for:

- runtime/transport;
- model/reasoning exact values;
- resume state;
- capability support;
- runtime health/authority.

Requirements:

- profile open/close must be keyboard accessible;
- closing it should restore sensible focus, preferably the originating control or terminal workflow;
- do not repeat the full capability matrix in the main workspace;
- Tier 2 employees remain clearly `UNTRACKED` and must not inherit Pi runtime detail;
- Grok with no live authenticated snapshot remains authentication-gated/no-live-runtime and must not display speculative capabilities.

## 4. Output inspection shortcuts and focus return

Files/Changes/Diff/Review already use real Superset surfaces. Improve access and focus behavior rather than rebuilding them.

Provide or refine compact, discoverable paths for the frequent actions:

- open Files;
- open Changes;
- open Diff for the current changed output where the existing product has a deterministic target;
- return focus to the active terminal/worker.

Prefer existing keyboard shortcut infrastructure and existing pane/sidebar actions. Do not invent a parallel command system if one already exists.

Requirements:

- shortcuts must not conflict with existing Superset/macOS conventions;
- symbolic controls retain labels/tooltips/accessibility names;
- after inspecting a file/diff, returning to the Pi terminal should be fast and deterministic;
- do not auto-open Diff based on inferred task completion;
- do not add polling or an output database.

If a useful shortcut cannot be added safely without broad shortcut architecture changes, document the friction and leave it unchanged.

## 5. Resume UX consolidation

Exact Pi resume is already authoritative and verified. Make the normal user path concise and unmistakable.

For an offline resumable Pi session:

- present one primary resume affordance rather than multiple competing controls;
- show concise user-facing context such as Task Folder title, Pi identity, and `RESUMABLE`;
- keep raw UUID/epoch hidden from normal presentation;
- invoking resume must use the existing exact native-session path unchanged;
- show truthful `STARTING` while identity confirmation is pending;
- mismatch/not-confirmed errors remain explicit;
- successful resume returns the user to the real Pi TUI with the same Task Folder title;
- focus should land in a useful place after successful resume.

Do not add heuristic recent-session selection or automatic silent resume.

## 6. Workspace and Briefcase navigation polish

Re-test the common project/workspace navigation path at both 1440×800 and the larger development viewport.

Improve only friction that is clearly repeated and Renderer-local, such as:

- originating Briefcase context when creating a Work Folder;
- selected Work Folder visibility;
- long project/workspace labels;
- predictable return from Home to the previous workspace;
- avoiding redundant project/workspace labels across adjacent chrome.

Preserve existing project/workspace/worktree data models and routing.

Do not create a new launcher, dashboard, project database, recent-work algorithm, or cross-workspace orchestration layer.

## 7. Compact keyboard workflow

Define and implement the smallest coherent keyboard workflow that can be safely supported using existing infrastructure.

The desired user outcome is to be able to perform the common sequence with minimal mouse use:

- focus active Pi workstation;
- rename/open Task Folder;
- inspect Files/Changes;
- open Employee Profile;
- dismiss transient AA cards/panels;
- return to active Pi workstation.

Reuse existing shortcuts first. Add AA-specific shortcuts only where they are local, conflict-free, discoverable, and testable.

Document the final shortcut table in the report and expose it through tooltips or an existing help surface where practical. Do not build a new command palette in Phase 3G.

## 8. Information-density pass

Perform one restrained density review of the 1440×800 workspace.

Look specifically for:

- duplicated employee/status/model/reasoning labels;
- excessive headers around Terminal/Task/Worker/File Cabinet;
- controls that consume persistent width but are rarely used;
- AA metaphors that have become decorative rather than functional;
- status text that competes with the TUI.

Allowed actions:

- reorder information;
- collapse secondary details behind Employee Profile/Task Folder context;
- tighten spacing within existing design tokens;
- improve truncation/tooltips;
- reduce redundant copy.

Do not perform a new visual redesign. Preserve AA Office System visual identity, pixel workers, Briefcase Cabinet, Employee Roster, File Cabinet, and real terminal as the visual anchor.

## 9. Pi-first dogfood acceptance

After implementation, run a fresh isolated real task using Pi as the only authoritative worker.

Suggested harmless task: create a tiny local script or text-processing utility in a disposable Git project, with tests and README. Keep it small enough that product workflow is the focus.

The acceptance journey must exercise:

1. open/create project;
2. create/select Work Folder;
3. name Task Folder;
4. Pi real work through TUI;
5. real WORKING → settled IDLE;
6. runtime-backed model/reasoning/Reasoning Hair;
7. Files/Changes/Diff inspection;
8. keyboard return to Pi;
9. Employee Profile;
10. Renderer reload;
11. full isolated Electron/Host restart;
12. exact Pi resume with same native identity and new epoch;
13. follow-up prompt proving context continuity;
14. 1440×800 compact workflow.

A Tier 2 employee MAY be launched once only as a regression check that compatibility dispatch remains `DISPATCHED + UNTRACKED`. Do not use Tier 2 as the main dogfood worker.

## 10. Grok boundary

Phase 3F remains deferred.

During Phase 3G:

- do not enter Grok credentials;
- do not attempt authenticated Grok product activation;
- do not modify the Grok ACP adapter except for a regression fix directly caused by Phase 3G shared UI changes;
- preserve truthful authentication-gated presentation;
- keep `PHASE-3F-GROK-TIER1-ACTIVATION.md` intact for later execution when the user can authenticate the machine.

## 11. Security and architecture boundaries

Preserve all current restrictions:

- no transcript/prompt/message-body persistence;
- no tool argument/result retention in AA runtime registry;
- no xterm/TUI scraping for runtime truth;
- no credentials/environment dumps;
- no PTY daemon changes;
- no xterm transport/rendering changes;
- no Git/worktree semantic changes;
- no database schema/migrations;
- no new runtime adapter;
- no Tier 2 lifecycle work;
- no native chat;
- no automatic agent orchestration;
- no task database.

Keep AA-specific presentation code under AAOffice and existing narrow V2 composition points where practical.

## 12. Verification

Automated minimum:

- existing AAOffice tests plus new workflow/focus/shortcut tests;
- Runtime Contract tests;
- relevant Pi/Host runtime regression tests;
- relevant TypeScript checks;
- targeted Biome/lint;
- `git diff --check`;
- RED-area modification scan;
- evidence/diff sensitive-information scan.

Real minimum:

- before/after daily workflow audit;
- Pi TUI focus/input;
- Task Folder rename/context/focus return;
- Worker/Profile presentation;
- Files/Changes/Diff access and terminal return;
- exact resume UX;
- Renderer reload;
- full isolated restart and same-session resume;
- 1440×800 and larger viewport;
- reduced motion;
- Tier 2 compatibility regression;
- Grok authentication-gated regression.

## 13. Deliverables

Create:

- `docs/aa/PHASE-3G-PI-FIRST-DAILY-WORKFLOW-REPORT.md`
- `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/runtime-foundation/phase-3g/`

The report must include:

1. executive verdict;
2. exact baseline/final commit and environment;
3. before/after daily workflow audit;
4. Task Folder ergonomics changes;
5. Worker/Profile ergonomics changes;
6. Output inspection/focus changes;
7. resume UX consolidation;
8. workspace/navigation changes;
9. final keyboard shortcut table;
10. information-density decisions;
11. real Pi-first dogfood result;
12. Tier 2 and Grok regression results;
13. automated verification;
14. security/RED-area review;
15. known limitations;
16. recommended next phase.

## Explicit non-goals

Do not implement:

- Phase 3F Grok activation;
- native structured chat;
- transcript/history store;
- model/reasoning write controls;
- permission/cancellation UI;
- automatic workflow engine;
- agent-to-agent messaging;
- task database;
- Kanban/timeline/project management;
- command palette;
- broad visual redesign.

After Phase 3G is complete, commit and push the implementation/report/evidence to `origin/aa-spike`, then STOP. Do not begin another phase.