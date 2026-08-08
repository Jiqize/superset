# AA Implementation Plan

## Phase 0 — Baseline Verification

Goal: establish a clean and reproducible Superset development baseline before product changes.

Tasks:

1. Clone `Jiqize/superset` on the target remote macOS development machine.
2. Add `superset-sh/superset` as `upstream`.
3. Checkout `aa-spike`.
4. Install the repository's required Bun/Node/native dependencies.
5. Start the desktop app using the repository-supported development command.
6. Open or create one local Git project and one workspace.
7. Confirm Pi is available in the builtin terminal-agent list.
8. Launch Pi inside the workspace.
9. Verify basic agent lifecycle state: session start, working, progress, stop/end.
10. Verify worktree and diff/file views operate normally.
11. Test session resume behavior if practical.
12. Record every blocker. Do not redesign UI yet.

Deliverable: `docs/aa/BASELINE.md`.

### Phase 0 acceptance criteria

- Desktop application starts without unresolved setup errors.
- A project/workspace opens successfully.
- Pi launches and can perform a small read-only repository task.
- Superset receives Pi lifecycle state.
- No modifications to PTY daemon, host-service lifecycle or Git/worktree internals are required.

## Phase 1 — AA Minimal Skin PoC

Goal: test the AA product language on top of a real working Pi session.

Scope:

- one project
- one workspace
- one Pi terminal session
- macOS only
- existing Pi TUI retained

Primary UI changes:

1. Replace project/workspace visual representation with the briefcase/folder system.
2. Introduce a pixel-worker component for Pi.
3. Map real Superset/Pi lifecycle state to worker animation states.
4. Simplify workspace chrome and navigation for the single-project PoC.
5. Preserve existing terminal, diff, file and browser panes.
6. Create AA design tokens without changing infrastructure behavior.

Initial worker states:

- idle
- session-starting
- working
- tool-progress
- completed
- error/offline when backed by a real state

Reasoning/hair visualization may be mocked only as an explicit visual control during this stage. It must not imply a Pi setting is active unless the setting is actually wired to Pi.

### Phase 1 acceptance criteria

- A user can launch Pi from the AA-themed workspace.
- The active worker state reflects real lifecycle events.
- Terminal behavior is unchanged from upstream Superset.
- Diff and file navigation remain functional.
- The PoC feels like an AA product while keeping the Superset runtime intact.

## Phase 2 — Product Shell Refinement

Only start after Phase 1 is validated through real use.

Possible work:

- richer pixel-worker asset system
- project briefcase states
- task-folder/session presentation
- improved changed-file handoff metaphors
- model/agent identity system
- real reasoning-level control if Pi exposes a stable integration path
- reduced visual prominence of raw terminal chrome

## Phase 3 — Native Pi Adapter Spike

Optional.

Goal: determine whether the Pi TUI should be replaced by a structured native chat transcript.

Potential architecture:

`AgentSessionOrchestrator -> Pi adapter -> Pi structured interface/RPC -> native transcript`

Requirements before implementation:

- stable structured Pi API/RPC contract
- message streaming
- tool lifecycle
- model selection
- reasoning level selection
- cancellation
- session persistence/resume
- permission semantics

Do not build this stage merely for visual polish. It should be justified by a meaningful interaction advantage over the existing Pi TUI.

## Guardrails

During Phase 0 and Phase 1:

- do not rewrite Superset architecture
- do not replace the PTY daemon
- do not build a new Git/worktree layer
- do not add multi-agent orchestration
- do not add cloud sync
- do not add collaboration
- do not generalize for every runtime
- do not remove working upstream features unless hiding them is enough

## Upstream Strategy

Keep `main` close to upstream Superset.

Suggested branch model:

- `main`: synced fork baseline
- `aa-spike`: current AA experimental implementation
- later feature branches: branch from `aa-spike` or a stabilized AA integration branch

Prefer renderer-local changes and additive components. Minimize modifications to infrastructure packages so upstream merges remain manageable.
