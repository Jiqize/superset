# Phase 3A — Pi + Grok Runtime Contract Spike

## Purpose

AA Office v0.1 is stable enough for real use. The next priority is to deepen the runtime layer only where it materially improves AA's two primary runtimes:

1. Pi
2. Grok Build

Codex, Claude Code, OpenCode, Kimi, and other terminal agents remain compatibility runtimes for now. Do not optimize AA runtime architecture around them in this phase.

This is an investigation and contract-design spike. Do not implement a broad runtime rewrite.

## Read first

- `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`
- `docs/aa/DOGFOOD-V0.1-REPORT.md`
- `docs/aa/CODEBASE-MAP.md`
- `docs/aa/SPIKE.md`
- `docs/aa/BASELINE.md`
- `docs/aa/PHASE-2.1-REPORT.md`
- `docs/aa/PHASE-2.2-REPORT.md`

Use `CODEBASE-MAP.md` boundaries. RED runtime areas may be inspected deeply during this spike, but do not modify them unless the brief explicitly permits a tiny diagnostic-only change. Prefer zero runtime changes.

## Product priority

### Tier 1 — Product runtimes

- Pi
- Grok Build

AA may eventually offer richer, authoritative state and controls for these runtimes.

### Tier 2 — Compatible terminal employees

- Codex
- Claude Code
- OpenCode
- Kimi
- other CLI agents

For Tier 2, the v0.1 contract remains sufficient:

- terminal launch works
- known launch identity when available
- `DISPATCHED`
- authoritative binding when Superset already provides one
- otherwise explicit `UNTRACKED`

Do not spend Phase 3A solving Codex/Claude-specific lifecycle semantics.

## Core questions

Phase 3A must answer whether AA can obtain authoritative contracts for Pi and Grok covering:

- runtime identity
- session identity
- turn identity
- current lifecycle state
- working / waiting / stopped semantics
- tool execution lifecycle
- permission / question waiting state
- model identity
- reasoning / thinking level
- session resume identity
- process restart / full app restart recovery
- structured output availability
- error state
- cancellation

Do not assume all fields are available.

## Part A — Pi runtime investigation

Trace the current Pi path end to end:

```text
AA Renderer
→ Superset terminal-agent launch
→ PTY / Pi process
→ Pi extension/hooks
→ Superset hook transport
→ TerminalAgentBinding
→ Renderer lifecycle presentation
```

Inspect the real Pi extension API and the currently installed/generated Superset Pi extension.

Determine precisely:

1. Which Pi events are available.
2. What identifiers are attached to each event.
3. Whether Pi exposes a conversation/session ID.
4. Whether Pi exposes a turn/request ID.
5. Whether nested/subagent events can be distinguished from the main Pi turn.
6. Whether effective model and reasoning level can be read after launch.
7. Whether reasoning can be changed during a live session.
8. Whether permissions/questions have structured events.
9. Whether tool start/end can be correlated to a specific turn.
10. What durable identifier is required to resume the same Pi conversation after a full Electron/process restart.

### Pi restart experiment

Use a disposable Pi workspace/session.

Run a simple turn, record all available identifiers, then test separately:

- Renderer reload
- terminal detach/reattach
- Electron full process restart if safe in the isolated QA environment
- explicit Pi resume mechanisms if available

Do not risk the user's shared long-lived environment. If full restart is unsafe, create an isolated dev instance or document why the experiment cannot be safely completed.

Report exactly which identity survives each boundary.

### Pi reasoning audit

Phase 2 established launch-time Pi effort values:

- `off`
- `minimal`
- `low`
- `medium`
- `high`
- `xhigh`

Determine whether the effective active-session value can be obtained authoritatively from Pi itself, session metadata, extension context, or another stable API.

Do not infer it from launch preference if Pi cannot confirm the effective value.

## Part B — Grok Build runtime investigation

Treat Grok as a primary runtime candidate, not merely another terminal preset.

First determine what Grok Build capabilities are actually installed/available on the QA machine. Do not assume commands or versions.

Inspect the local Grok CLI/help/version and, where source/documentation is already available locally or in the repository context, identify its structured agent interface.

If Grok exposes an ACP/stdio/JSON-RPC agent mode, investigate it directly.

Determine whether Grok can authoritatively expose:

- session create
- session load/resume
- session ID
- prompt/turn identity
- streaming assistant output
- reasoning stream or reasoning status
- tool-call lifecycle
- permission requests
- waiting-for-user state
- completion/stop
- cancellation
- model selection
- error state

### Grok structured-mode experiment

If a supported structured stdio/ACP mode is available, run a disposable direct protocol experiment outside AA UI.

Capture a concise event transcript showing the smallest complete turn:

```text
session created
prompt sent
working/stream events
tool event if practical
completion
session resume/load if supported
```

Do not implement the AA Grok adapter yet.

If Grok structured mode is unavailable on the machine, document the exact missing prerequisite and stop that sub-experiment rather than inventing behavior.

## Part C — Define the AA Runtime Contract

Based only on authoritative capabilities discovered in Parts A and B, design a minimal AA runtime contract.

Do not make the contract Pi-specific or ACP-specific.

Suggested conceptual shape only:

```ts
interface AARuntimeSession {
  runtime: "pi" | "grok"
  sessionId: string | null
  turnId: string | null
  agentId: string
  model: string | null
  reasoning: string | null
  state: AARuntimeState
  canResume: boolean
}
```

Possible runtime states:

```text
starting
idle
working
waiting_permission
waiting_user
cancelling
error
ended
unknown
```

Do not include a state unless Pi or Grok can ground it authoritatively, or the contract explicitly allows `unknown`.

Define:

- session snapshot
- event envelope
- stable identity fields
- lifecycle state machine
- capability flags
- resume contract
- reasoning contract
- permission contract
- cancellation contract

The design must support runtimes with partial capability.

Example capability philosophy:

```text
Pi may support rich lifecycle but limited structured transcript.
Grok may support structured protocol and richer session control.
AA should expose only verified capabilities per runtime.
```

## Part D — Adapter boundary recommendation

Recommend the smallest future adapter boundary for AA.

Evaluate at least these options:

1. Extend Superset `TerminalAgentBinding` and existing terminal-agent hook path.
2. Add an AA runtime service beside existing Superset terminal-agent infrastructure.
3. Pi remains terminal/hook based while Grok uses a structured ACP/stdio adapter behind a shared AA contract.
4. Another minimal option discovered during the investigation.

For each option, assess:

- amount of RED-area modification
- upstream merge risk
- runtime correctness
- session resume quality
- ability to support Pi
- ability to support Grok
- ability to keep Tier 2 agents as simple terminal presets

Recommend one architecture.

## Part E — Reclassify the Codex dogfood HIGH finding

The Dogfood report observed Codex TUI still working while AA showed completion/idle.

Do not fix this in Phase 3A.

Classify it under the new runtime-tier model:

- Does it reveal a generic Superset lifecycle limitation?
- Is it irrelevant to Pi/Grok Tier 1 architecture?
- Could the future AA Runtime Contract solve it opportunistically without becoming Codex-specific?

Document the answer.

Tier 2 runtimes are allowed to remain `UNTRACKED` or partially tracked when authoritative state is unavailable.

## Diagnostic code rule

Default: documentation and experiments only.

If a tiny diagnostic change is absolutely required to observe an identifier/event that already exists internally:

- keep it isolated
- do not alter runtime behavior
- do not change schemas
- do not persist new data
- remove the diagnostic code before final commit unless it is clearly useful as a reusable test/debug utility

No production Runtime Adapter implementation in Phase 3A.

## Deliverables

Create:

`docs/aa/PHASE-3A-RUNTIME-CONTRACT-REPORT.md`

Required sections:

1. Executive recommendation
2. Runtime tier policy
3. Pi capability matrix
4. Pi event/identity trace
5. Pi restart/resume findings
6. Pi reasoning findings
7. Grok capability matrix
8. Grok structured-protocol experiment
9. Proposed AA Runtime Contract
10. Runtime state machine
11. Capability model
12. Adapter architecture options
13. Recommended architecture
14. Codex dogfood finding reclassification
15. RED-area impact assessment
16. Exact next implementation slice for Phase 3B
17. Open questions

Also create:

`docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`

This second file should be concise and normative. It should contain only the proposed interfaces/state semantics/capability rules that Phase 3B would implement.

If useful, place protocol transcripts or diagnostic evidence under:

`docs/aa/runtime-spike/`

Do not commit secrets, API keys, tokens, or private unrelated session contents.

## Decision gate for Phase 3B

At the end, choose exactly one recommendation:

- `PROCEED WITH PI-FIRST CONTRACT IMPLEMENTATION`
- `PROCEED WITH GROK-FIRST CONTRACT IMPLEMENTATION`
- `PROCEED WITH SHARED PI+GROK ADAPTER FOUNDATION`
- `DO NOT IMPLEMENT RUNTIME CONTRACT YET`

Justify the choice with observed evidence.

## Verification and stop condition

- verify all referenced repository paths exist
- verify claims against actual local/runtime behavior where possible
- run any focused tests created for diagnostics
- run `git diff --check`
- ensure source worktree is clean except intended docs/evidence
- commit and push the Phase 3A report/contract/evidence
- do not begin Phase 3B

After the report and contract are pushed, STOP.