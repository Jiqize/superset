# Phase 3E — Agent Workspace Workflow v0.1

## Status

Phase 3D is complete. Start from `AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`.

Phase 3E moves AA from an Agent Workstation into an Agent Workspace model.

The focus is not runtime expansion. Runtime foundations already exist.
The focus is turning runtime capability into a useful daily workflow model.

## Read first

1. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
2. `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
3. `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
4. `docs/aa/PHASE-3D-TIER1-AGENT-EXPERIENCE-REPORT.md`
5. `docs/aa/CODEBASE-MAP.md`

## Goal

Build the first AA work model around:

Project → Workspace → Task Folder → Employee → Output

Do not build a project-management system.
Do not build automatic orchestration.
Do not build native chat.

The user remains the manager. Agents remain employees.

## 1. Task Folder 2.0

Upgrade Task Folder from a status label into the main unit of work context.

Display only real available information:

- title
- assigned employee
- runtime
- model
- reasoning
- status
- changed files
- resumability
- latest meaningful action if available

Example:

TASK FOLDER

Build login flow

EMPLOYEE
PI

RUNTIME
Pi

MODEL
Gemini

REASONING
HIGH

STATUS
WORKING

FILES
12 changed

RESUME
AVAILABLE

Rules:

- Never invent progress percentage.
- Never summarize hidden terminal content.
- Never scrape TUI text.
- Never store transcripts.
- Runtime truth comes from AA Runtime Contract.

## 2. Agent Profile Card

Create a first-class Employee profile view.

The user should be able to understand:

Who is this employee?

Example:

PI EMPLOYEE

Runtime:
Pi
Transport:
Terminal
Model:
Gemini 3.5 Flash
Reasoning:
HIGH
Tools:
bash
Session:
Resumable
Capabilities:

The profile must distinguish:

- available
- unavailable
- conditional
- unknown

Do not create rankings, intelligence scores, or fake personalities.

## 3. Manual Handoff Model

Evolve current dispatch language into a human-managed workflow.

Current:

Assign to Codex

Future presentation:

Task Folder

↓

Send to Reviewer

↓

Codex Employee

↓

Return Result

Important:

This is still manual.

Do not implement:

- automatic agent chaining
- planner/executor/reviewer engine
- workflow graph
- background routing
- agent-to-agent messaging

Reuse existing launch paths.

## 4. Output and Delivery Language

Extend AA objects:

Task Folder
contains

- current work
- assigned employee
- output state

File Cabinet
contains

- changed files
- review state
- delivery state

Do not create a new artifact database.
Use existing Files, Changes, Review, Git state where possible.

## 5. Grok Employee Presentation

Do not expand Grok runtime implementation.

Create presentation support for:

Grok Employee

Show:

- runtime
- transport
- known capabilities
- authentication requirement
- available / conditional states

Do not claim live session capabilities without authenticated evidence.

## 6. Runtime Boundary

Continue using AA Runtime Contract.

Do not modify:

- PTY
- xterm transport
- Git/worktree
- database schema
- Tier 2 vendor lifecycle
- native chat
- orchestration runtime

Allowed:

- AAOffice Renderer
- Host runtime queries
- presentation models
- existing workspace composition

## 7. Dogfood

Run a realistic workflow:

User creates a Task Folder.

Pi implements.

User reviews output.

User manually sends Task Folder to another Employee.

Employee reviews/fixes.

User returns to original Employee.

Verify:

- identity
- runtime
- model
- reasoning
- resume
- Files
- Changes
- Review
- state transitions

## Deliverables

Create:

- `docs/aa/PHASE-3E-REPORT.md`
- `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
- evidence under `docs/aa/runtime-foundation/phase-3e/`

After completion:

- run verification
- commit
- push
- STOP

Do not begin Phase 3F.