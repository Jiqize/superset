# Phase 2 — AA Work Model v0.1

Phase 1.2 is complete and stable. Do not begin later phases.

## Read first

- `docs/aa/SPIKE.md`
- `docs/aa/IMPLEMENTATION-PLAN.md`
- `docs/aa/BASELINE.md`
- `docs/aa/CODEBASE-MAP.md`
- `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
- `docs/aa/PHASE-1-REPORT.md`
- `docs/aa/PHASE-1.1-REPORT.md`
- `docs/aa/PHASE-1.2-REPORT.md`

Treat `CODEBASE-MAP.md` as repository scope. Do not rescan unrelated monorepo areas.

## Goal

Move AA from a visual shell into a small real work model through three concepts:

1. Reasoning Hair System
2. Task Folder
3. Manual Work Assignment / Handoff Language

Keep real terminal agents and existing Superset infrastructure. Do not build native structured chat, multi-agent orchestration, or new runtime architecture.

## 1. Reasoning Hair System

Reasoning intensity is represented by worker hair while the exact functional value remains visible as text. Hair is a mnemonic, never the only indicator.

First audit the current Pi integration and determine whether reasoning level is already readable and/or writable from Renderer through existing safe interfaces. Record where it lives and what is available.

If real reasoning level is safely available, add a compact AA reasoning indicator/selector and deterministic visual mapping from real Pi values to hair states. Adapt to Pi's actual level names rather than inventing runtime values.

Suggested visual continuum: full hair → slightly reduced → receding → sparse → bald/nearly bald.

If reasoning is not safely available, do not modify PTY, Host Service, Pi hooks, adapters, or other RED infrastructure to obtain it. Implement only the presentation component/API, mapping contract, and optional non-runtime preview. The active workspace must never display a fake reasoning value.

Prefer local components such as `AAReasoningIndicator`, `AAHairState`, and `aaReasoningPresentation.ts` under AAOffice.

## 2. Task Folder

Introduce a lightweight Task Folder representing the current piece of work inside a Workspace. This is a presentation over existing state, not a project-management/task database.

Use real data where available:

- current terminal/session
- workspace
- existing session/preset label
- initial command/prompt only if safely accessible
- changed file count
- real agent lifecycle state
- branch/worktree
- existing session start time

Compact example:

```text
TASK FOLDER
Fix login state
ASSIGNED: PI
STATUS: WORKING
FILES: 3 CHANGED
```

Task title source priority:

1. explicit existing task title
2. existing session/preset label
3. initial command/prompt if safely accessible
4. terminal/session label
5. `Current Work Session`

Never hallucinate a title. Do not parse terminal history heuristically. If prompt text is used, truncate it and avoid exposing secrets.

Task state must be derived from real state only. Suitable presentation states are `UNASSIGNED`, `IDLE`, `WORKING`, `WAITING`, `DONE`, `ERROR` where the underlying data supports them. Do not invent completion percentages.

Do not add a persistent task schema in Phase 2. Prefer derived state and presentation-only ephemeral state if absolutely necessary.

## 3. Manual Work Assignment / Handoff Language

Employee Roster currently launches existing agents. Make that action read as assigning work to an employee while reusing the exact existing Superset preset/terminal launch path.

Examples of presentation language:

- `ASSIGN CURRENT WORK`
- `Assign to Codex`
- `Send Task to Claude`

Use the smallest behavioral change possible. Existing launch semantics remain authoritative.

This is manual assignment only. Do not implement automatic chaining, planner/reviewer/executor orchestration, agent-to-agent protocols, automatic routing, background workflows, or shared-memory systems.

Protect the existing Pi session. If Superset currently opens a new pane/tab/session when another agent launches, preserve that behavior. Do not invent session migration.

Only show a successful handoff state after the underlying launch succeeds. A small transition such as `TASK FOLDER → ASSIGNED TO CODEX` is acceptable when grounded in a real successful launch.

## Employee presentation

Continue using the explicit AA Employee Persona Registry from Phase 1.2. Do not modify the Superset agent catalog.

Neutral role labels may be shown only when derived from real preset/runtime configuration. Do not invent seniority, rankings, intelligence scores, personality quality, performance, or efficiency metrics.

## Office object vocabulary

Preserve the mapping:

- Project → Briefcase
- Workspace → Folder
- Files → File Cabinet
- Agent → Employee
- Terminal → Workstation
- Current task → Task Folder
- Reasoning level → Hair state
- Assignment → handing over the Task Folder

Do not introduce decorative office objects with no product meaning.

## Layout

Preserve the Phase 1.2 structure: global rail, Briefcase Cabinet, Employee Roster, workspace, worker status, real terminal, File Cabinet, bottom status bar.

Task Folder and reasoning controls must remain compact and use existing header/status space where practical. Do not create a large task panel or office scene.

## Runtime boundary

Follow `CODEBASE-MAP.md` strictly.

GREEN: normal Renderer/presentation changes.

YELLOW: inspect/modify only when clearly necessary and safe.

RED: do not modify.

Do not modify PTY daemon, Host Service lifecycle architecture, Git/worktree implementation, database schema, Pi hook protocol, terminal persistence, or runtime adapter architecture. If a sub-feature requires RED changes, stop that sub-feature and document the missing capability. Do not move runtime logic into Renderer as a workaround.

## Testing

Add focused tests for reasoning presentation mapping, hair-state mapping, Task Folder state mapping, assignment presentation logic, and fallbacks where applicable.

Manually verify Pi session launch/use, Employee Roster launches, active Pi session safety, Files/Changes/Review, workspace navigation, renderer reload, Task Folder grounding, reasoning grounding, and reduced motion.

Run desktop TypeScript checks, targeted lint, AA tests, and `git diff --check`.

## Deliverable

Create `docs/aa/PHASE-2-REPORT.md` containing:

- Reasoning Integration Audit: where reasoning lives, Renderer read/write capability, implementation and deferrals
- Task Folder: real data sources, fallback title, state mapping, persistence decision
- Manual Assignment: existing Superset launch path reused, UI language, confirmation behavior, session safety
- files changed
- tests
- known limitations
- recommended next phase

## Explicit non-goals

Do not implement native Pi chat, Pi RPC adapter, ACP rewrite, automatic multi-agent orchestration, agent-to-agent communication, workflow engine, task database, Kanban, timeline, project management, fake progress/productivity metrics, office simulation, or gamification.

After Phase 2 is runnable and `PHASE-2-REPORT.md` is complete, STOP.