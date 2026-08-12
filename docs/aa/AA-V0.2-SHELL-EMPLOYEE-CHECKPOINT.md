# AA v0.2 Shell & Employee checkpoint

## Verdict

**PHASE 4A ACCEPTED — PI-FIRST EMPLOYEE AND GLOBAL AA SHELL READY**

This checkpoint advances the `aa-spike` presentation foundation to v0.2 while
preserving the AA Office v0.1 RC runtime and work-model contracts.

## Baseline and scope

- Baseline: `f0b7a1018c148f670de05d58cdddd3a9310ba196`
- Branch: `aa-spike`
- Platform: macOS 26.4, Apple Silicon
- Scope: Renderer presentation/composition, Employee Roster projection, the
  existing Renderer terminal-launch helper, tests, guide, and safe evidence.
- Frozen areas changed: none.

## Accepted Pi-first contract

1. Pi is the fixed first Roster Employee in AA mode.
2. Its source is the first ordered real Host config with `presetId === "pi"`.
3. No real config means one visible `PI · SETUP REQUIRED` entry that opens the
   existing Agent settings and launches nothing.
4. An available activation creates exactly one new Pi terminal conversation in
   the same Work Folder, retains the explicit Task Folder title, activates the
   pane, and relies on existing xterm focus/runtime evidence.
5. A terminal preset linked by the existing agent-link resolver to the selected
   Pi config is removed only from the Roster/hotkey projection. Its persisted
   settings row is retained.
6. Pi is not draggable, hideable, or synthesized as a persisted preset.
7. Compatibility employees keep existing launch/order/settings behavior and
   remain `UNTRACKED` unless their existing contract says otherwise.

## Accepted shell contract

- One route-aware `AAApplicationShell` at the authenticated layout boundary.
- Required V2 dashboard and Settings route families receive one AA rail,
  hard-edge surface hierarchy, typography, and route-derived selected state.
- Existing dashboard sidebar content becomes the AA Briefcase Cabinet across
  Home, project, Work Folder, advanced Workspace, Tasks, Automations, and Pull
  Requests.
- Existing Settings navigation/forms remain intact inside the outer frame.
- Files is enabled only for `/v2-workspace/$workspaceId` and disabled elsewhere.
- V1 Workspace, auth, sign-in, onboarding, and unrelated/public surfaces remain
  outside the AA shell and CSS scope.

## Preserved v0.1 RC contracts

- New Task and explicit Task Folder title
- Active Tasks and Saved / Resumable projection
- Archive / Unarchive intent
- Pi Runtime Contract and exact native Pi resume
- terminal/xterm input, focus, resize, rendering, and persistence
- Files / Changes / Diff / Review
- Git/worktree/branch semantics
- Host database and lifecycle primitives
- Tier 2 compatibility and Grok authentication boundary

## Acceptance

The isolated clean-profile run passed real Pi with no Pi terminal-preset row,
Roster new conversation, authoritative `WORKING → IDLE`, missing Pi setup,
Pi-linked duplicate preservation/dedupe, Codex compatibility dispatch, the
complete daily route journey, both required viewports, reduced motion, full
Electron/Host restart, and exact Pi resume. The resumed native identity is
proved only by a truncated SHA-256 fingerprint in safe evidence.

Automated results and the final implementation commit are recorded in
`PHASE-4A-PI-FIRST-EMPLOYEE-GLOBAL-SHELL-REPORT.md`. Safe evidence is indexed
under `docs/aa/v0.2/phase-4a/`.

## Stop boundary

This checkpoint does not authorize Phase 4B. Grok activation, new Runtime
Contract capabilities, native chat, write controls, orchestration, task
history/entities, packaging, and broad mature-page redesign remain out of
scope.
