# Phase 3D — Tier 1 Agent Experience v0.1

## Status

Phase 3C completed Pi runtime productization. This phase builds the first user-facing Agent Experience layer on top of the authoritative runtime foundation.

Priority:

1. Pi is the primary runtime experience.
2. Grok Build remains Tier 1 and receives capability-aware presentation only where verified.
3. Tier 2 CLIs remain compatibility runtimes with existing DISPATCHED / UNTRACKED semantics.

Do not redesign runtime architecture. Do not begin native chat.

## Read first

- `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
- `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
- `docs/aa/PHASE-3C-PI-RUNTIME-PRODUCTIZATION-REPORT.md`
- `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`
- `docs/aa/CODEBASE-MAP.md`

## Goal

Transform authoritative runtime data into a coherent AA Office employee experience.

The user should understand:

- who is working;
- what runtime/model is active;
- how deeply the agent is thinking;
- whether the session can resume;
- what capabilities are available;
- whether a state is authoritative or unavailable.

The real terminal remains the primary work surface.

## 1. Pi Worker Card v2

Upgrade the existing Worker Card using runtime snapshots.

Display compactly:

- employee identity;
- runtime: Pi;
- effective model;
- effective reasoning;
- current state;
- resume availability when offline.

Example:

PI WORKER

Gemini 3.5 Flash
REASONING: HIGH
STATUS: WORKING

Rules:

- values come only from authoritative runtime snapshots;
- never display launch preference as active state;
- never infer state from terminal text;
- preserve fallback behavior for Tier 2 workers.

## 2. Reasoning Hair Productization

Make the existing Reasoning Hair concept a real runtime-backed feature.

Requirements:

- map exact runtime reasoning values to visual hair states;
- always show textual reasoning value beside the visual metaphor;
- support model-specific available values;
- if unavailable/unknown, do not show guessed hair;
- no reasoning write controls.

The visual metaphor remains secondary to the explicit runtime value.

## 3. Agent Profile / Employee Detail

Introduce a compact employee detail surface.

Purpose:

Turn the Employee Roster from a launcher into an Agent identity system.

Possible information:

- Agent name;
- runtime type;
- transport;
- model;
- reasoning;
- capabilities;
- current status;
- resumability.

Do not add:

- intelligence ranking;
- personality scoring;
- productivity metrics;
- fake seniority.

## 4. Runtime Health Language

Create user-facing translations for runtime states.

Support:

- STARTING
- WORKING
- WAITING
- IDLE
- OFFLINE / RESUMABLE
- UNKNOWN
- ERROR
- RESUME FAILED

Internal details such as epoch, sequence, and UUID should remain diagnostic information, not primary UI.

## 5. Resume Experience

Polish the Pi resume flow.

Requirements:

- discoverable from AA UI;
- clear offline/resumable state;
- preserve real Pi TUI;
- show starting state during resume;
- success only after same native session UUID confirmation;
- failure must explain mismatch or missing confirmation.

Do not silently create a replacement conversation.

## 6. Grok Capability Presentation

Do not activate incomplete Grok runtime features.

If unauthenticated:

Show:

GROK BUILD
Authentication required
Capabilities unavailable until login

If authenticated later:

Only display capabilities verified by runtime negotiation.

Do not create fake Grok UI before runtime evidence exists.

## 7. Dogfood Runtime Scenario

Run a new Tier 1 focused acceptance test:

Pi task:

1. create a small coding task;
2. run Pi;
3. observe model/reasoning/state;
4. change reasoning if runtime write is not available only document it;
5. stop and resume exact session;
6. verify Worker Card and Task Folder after resume.

The goal is proving the Runtime Contract improves daily use.

## 8. Architecture Boundary

Allowed:

- AAOffice Renderer components;
- runtime presentation mapping;
- shared contract helpers/tests;
- focused Host query/event improvements.

Do not modify:

- PTY daemon;
- xterm transport;
- Git/worktree behavior;
- database schema;
- Tier 2 runtime tracking;
- native chat;
- orchestration.

## 9. Verification

Run:

- runtime contract tests;
- Host registry tests;
- Pi bridge tests;
- AA Renderer tests;
- TypeScript checks;
- Biome/lint;
- git diff --check.

Real verification:

- Pi working state;
- Pi idle after agent_settled;
- real model display;
- real reasoning display;
- exact resume;
- offline/resume UI;
- Renderer reload;
- 1440×800 layout;
- Tier 2 fallback remains unchanged.

## Deliverables

Create:

- `docs/aa/PHASE-3D-TIER1-AGENT-EXPERIENCE-REPORT.md`
- `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
- evidence under `docs/aa/runtime-foundation/phase-3d/`

After completion commit and push to `origin/aa-spike`.

STOP after Phase 3D.
Do not begin Phase 3E.