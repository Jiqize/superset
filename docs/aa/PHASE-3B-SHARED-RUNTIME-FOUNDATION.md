# Phase 3B — Shared Pi + Grok Runtime Foundation v0.1

## Status

Phase 3A is complete. This brief implements the first production slice of `AA-RUNTIME-CONTRACT-V0.1.md`.

The product priority is fixed:

- Tier 1 product runtimes: Pi and Grok Build
- Tier 2 compatibility runtimes: Codex, Claude Code, OpenCode, Kimi, and other terminal CLIs

Do not optimize Phase 3B around Tier 2 lifecycle behavior. Their existing terminal-preset path and truthful `DISPATCHED` / `UNTRACKED` semantics remain valid.

## Read first

1. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
2. `docs/aa/PHASE-3A-RUNTIME-CONTRACT-REPORT.md`
3. `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`
4. `docs/aa/DOGFOOD-V0.1-REPORT.md`
5. `docs/aa/CODEBASE-MAP.md`
6. Relevant runtime-spike evidence under `docs/aa/runtime-spike/`

Treat the Runtime Contract as normative. If implementation convenience conflicts with the contract, preserve the contract and document the blocker.

## Goal

Build a shared runtime-neutral foundation and land one authoritative Pi adapter path while adding a truthful Grok ACP adapter foundation.

Phase 3B must deliver these user-visible outcomes for Pi:

1. AA receives the native Pi session UUID.
2. Pi state remains `working` until the authoritative `agent_settled` event.
3. AA reads the active Pi model and effective reasoning value.
4. Reasoning Hair can display the real effective Pi value.
5. Pi tool lifecycle is correlated by real `toolCallId` without scraping terminal output.
6. The existing resume path can use the exact native Pi UUID and verify the resumed process reports the same UUID.

For Grok Build, Phase 3B must deliver a shared adapter skeleton over the existing ACP/stdio infrastructure with truthful capability negotiation. On an unauthenticated machine, it must expose the authentication prerequisite and must not claim a working Grok session.

Preserve the real Pi TUI/xterm and existing Superset terminal infrastructure.

## Planned architecture

The implementation should create four layers while following existing repository conventions:

```text
shared contract types and validation
        ↓
host-owned runtime session registry
        ↓
Pi bridge adapter / Grok ACP adapter
        ↓
Renderer query + event consumption
```

Do not create a second standalone AA daemon or duplicate the existing Host Service.

## 1. Shared contract package

Implement production TypeScript types and runtime validation corresponding to `AA-RUNTIME-CONTRACT-V0.1.md`.

Use an existing shared package when appropriate, or create a narrowly scoped shared module following monorepo conventions.

Required minimum exports:

- contract version
- runtime/session/capability/model/reasoning/resume types
- event envelope and event kinds
- validators/parsers for snapshots and events
- helpers for capability defaults
- helpers for stable event deduplication keys

The implementation must preserve these rules:

- `sessionKey` is not a terminal ID
- `nativeSessionId` is runtime-reported only
- `nativeTurnId` remains `null` unless the runtime supplies a durable native turn ID
- `(sessionKey, epoch, sequence)` is unique
- sequence is monotonic only inside one epoch
- a new process or adapter incarnation creates a new epoch
- unknown or unsupported capabilities remain explicit

Add focused unit tests for validators, capability defaults, sequence rules, deduplication, and rejection of invalid runtime IDs or malformed events.

## 2. Host runtime session registry

Add a Host Service owned registry/store for Tier 1 runtime snapshots and events.

Required behavior:

- ingest validated runtime events
- maintain the latest authoritative session snapshot
- deduplicate repeated events
- reject or quarantine stale/out-of-order events according to the epoch/sequence rules
- expose current snapshots by workspace, terminal, session key, and runtime where practical
- publish snapshot/event changes through existing Superset event or tRPC infrastructure
- survive Renderer reload
- preserve enough durable identity for Pi process/app resume using existing storage where available

Prefer existing persistence and the existing `terminal_agent_bindings.agent_session_id` field for Pi native session identity. Do not add a database schema migration unless it is truly unavoidable.

If a new persistent field or schema migration appears necessary, STOP that sub-feature, document the exact gap, and continue with the remaining in-memory/runtime foundation. Do not silently expand the schema.

Do not replace the existing TerminalAgentStore. Keep legacy bindings working for Tier 2 and compatibility surfaces. The new runtime registry may coexist and gradually become authoritative for Tier 1 AA presentation.

Add tests for:

- event ordering
- epoch reset
- duplicate events
- stale events
- snapshot derivation
- workspace/terminal lookup
- process loss and offline state
- exact native session identity persistence where existing storage permits it

## 3. Pi bridge v2

Upgrade the generated Superset Pi extension from the current lossy bridge to a versioned structured observation bridge.

Relevant existing surfaces include:

- `apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts`
- `apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts`
- existing notification/hook transport and receiver
- TerminalAgentStore/binding persistence

### Bridge envelope

Every Pi v2 observation must include enough data to validate and correlate it safely:

- bridge/contract version
- event ID
- AA session key or material needed to derive it safely
- runtime `pi`
- workspace ID
- terminal ID
- native Pi session UUID
- epoch
- sequence
- occurred-at timestamp
- event kind
- event payload

Generate the epoch once per Pi adapter/extension process. Sequence starts at a defined value and increments gaplessly for every emitted v2 event.

Do not include secrets, full prompts, tool arguments, tool results, raw message bodies, environment variables, or credentials in the minimum bridge.

### Pi event mapping

Use authoritative Pi events:

- `session_start` → session attach/start plus initial snapshot
- `agent_start` → `working`
- `agent_settled` → turn settled and `idle`
- `tool_execution_start` → tool started
- `tool_execution_update` → tool progress
- `tool_execution_end` → tool finished with outcome
- `model_select` → model changed
- `thinking_level_select` → reasoning changed
- `session_shutdown` → offline or ended according to verified reason
- provider/tool failure surfaces → runtime error where authoritative

Do not use `agent_end` as the final turn-settled boundary.

Do not map `tool_execution_end` to idle or completion.

Keep `nativeTurnId: null`. Pi `turnIndex` may be recorded only as optional diagnostic correlation and must not become a durable turn identity.

### Pi snapshot values

Read from Pi runtime APIs/context:

- `ctx.sessionManager.getSessionId()` or equivalent authoritative native UUID
- effective model provider/id when available
- effective thinking level
- available thinking values for the active model when authoritatively available
- current UI/mode evidence needed to exclude print/JSON helper runs

Continue excluding non-UI helper/subagent processes using verified Pi context such as `hasUI === false` and mode. Do not claim hierarchical parent/child identity when Pi does not expose it.

### Backward compatibility

Keep existing Superset generic lifecycle/binding behavior operational during migration.

The v2 bridge may dual-write or feed both the new runtime registry and existing TerminalAgentStore, but:

- the new Pi session UUID must populate existing `agent_session_id` where safely supported
- current terminal status/notifications must not regress
- Tier 2 bindings must remain unchanged
- old v1 payloads must be safely tolerated during an upgrade window

Version the installed extension marker and verify idempotent installation/update.

Add focused tests for bridge payload construction, event mapping, epoch/sequence, helper filtering, session UUID propagation, model/reasoning mapping, tool IDs, and legacy compatibility.

## 4. Pi exact resume path

Use the existing generic resume plumbing and the captured Pi native UUID.

Required resume semantics:

1. Resume only the exact native UUID previously reported by Pi.
2. Use the original workspace/cwd.
3. Invoke Pi through the existing command path with `pi --session <UUID>` or the equivalent existing Pi resume definition.
4. Keep the runtime state `starting` or `offline` until the resumed Pi process reports its identity.
5. Require the resumed process to report the same UUID.
6. If the UUID differs or load fails, expose a truthful error/offline state and do not silently create a replacement conversation.
7. Mint a new epoch after process restart/resume.

Do not select the newest Pi session heuristically.

Do not parse Pi session filenames as authority when the runtime can confirm the UUID.

Test at minimum:

- Renderer reload/reattach
- Pi process restart with exact resume
- same native UUID after resume
- previous conversation context remains available
- new epoch after process restart
- mismatch/failure handling

A full Electron restart should be tested through an isolated disposable dev profile/instance if it can be done without risking unrelated live sessions. If the environment cannot isolate it safely, document the limitation and still verify Host/Pi process restart with exact identity.

## 5. Renderer runtime consumption

Add a narrow Renderer client/hook for Tier 1 runtime snapshots.

AA presentation priority should become:

1. authoritative Tier 1 runtime snapshot
2. legacy terminal binding/launch identity fallback
3. truthful local/untracked fallback

Update AA Worker Card and Task Folder to use the Pi runtime snapshot when available.

Required presentation behavior:

- Pi stays `WORKING` until `agent_settled`
- tool completion alone never produces `IDLE` or `LAST TURN / COMPLETE`
- current model may be shown only when the snapshot contains an authoritative model
- current reasoning may be shown only when reasoning-read capability is available and the snapshot contains a value
- Reasoning Hair maps the exact reported reasoning value through presentation mapping while preserving the text
- unavailable/unknown reasoning remains hidden or explicitly unavailable
- Tier 2 employees continue using current compatibility behavior

Do not introduce native structured chat in Phase 3B.

Do not display full structured message deltas, tool arguments, or tool results.

Keep the real terminal/TUI as the primary working surface.

Add tests for snapshot priority, legacy fallback, stale/unknown state, real reasoning display, and turn-settled semantics.

## 6. Grok ACP adapter foundation

Use the existing Host ACP/session infrastructure. Do not create a separate Grok process manager if existing infrastructure can own it.

Implement a runtime-neutral Grok adapter that can map verified ACP/stdio responses into the shared contract.

Minimum Phase 3B requirements:

- launch/initialize through structured stdio
- capture runtime/version metadata
- negotiate capability support from the live initialize/session response
- represent authentication-required as a structured conditional/unavailable capability state
- map structured errors without crashing the registry
- define mappings for session new/load, prompt start/settle, tool updates, permission requests, cancellation, model and reasoning only where the live authenticated protocol verifies them
- keep unknown capabilities unknown
- do not promote binary symbol presence or documentation claims to `available`

The current QA machine is unauthenticated. Do not enter credentials or log into Grok on behalf of the user.

Use recorded safe initialize/authentication-error evidence and deterministic fixtures for tests. If Grok is already authenticated in the environment, a disposable real turn may be verified, but credentials and sensitive output must never be committed.

Grok UI integration is limited to truthful capability/session state if the existing app can surface it safely. Do not replace the current Grok terminal preset yet and do not remove the compatibility path.

## 7. Security and privacy

The runtime foundation must not persist or emit:

- API keys
- auth cookies or tokens
- environment dumps
- full user prompts
- assistant transcripts
- tool arguments/results
- arbitrary filesystem contents
- raw ACP authentication payloads

Diagnostics and evidence must be curated/redacted.

Validate all inbound bridge/ACP events before registry ingestion.

Bound payload sizes where appropriate.

Treat unknown fields as forward-compatible only when the validator can safely ignore them. Reject malformed identity, sequence, or contract-version fields.

## 8. Explicitly allowed runtime scope

Phase 3B is the first implementation phase allowed to make narrow changes in these previously protected areas:

- Pi extension template/installer
- Host Service notification/runtime registry routes
- existing terminal-agent binding propagation needed for native Pi session ID
- shared contract types/validators
- workspace-client event/query plumbing
- AA Renderer hooks/components consuming Tier 1 snapshots
- existing ACP Host infrastructure for Grok adapter mapping

Changes must remain minimal and contract-driven.

## 9. Still prohibited

Do not modify:

- PTY daemon behavior
- xterm rendering or terminal byte transport
- Git/worktree behavior
- Tier 2 vendor-specific hooks
- Codex/Claude lifecycle integration
- native chat UI
- prompt/history scraping
- automatic multi-agent orchestration
- agent-to-agent handoff protocols
- task database/project management
- model/reasoning write controls
- structured cancellation UI
- permission UI unless already fully supported by the implemented Tier 1 adapter contract

Do not add a database schema migration without stopping and documenting the blocker as required above.

## 10. Implementation sequence

Use small commits or clearly separable work units in this order:

1. Shared contract types/validators/tests
2. Host runtime registry and event/query plumbing
3. Pi bridge v2 payload and Host ingestion
4. Pi native session/model/reasoning/tool/state mapping
5. Pi exact resume integration
6. Renderer Tier 1 snapshot consumption and real Reasoning Hair
7. Grok ACP adapter foundation and unauthenticated capability behavior
8. End-to-end verification and documentation

Do not start UI polish before the runtime path is proven.

## 11. Required verification

### Automated

Run the relevant repository checks, including:

- Desktop TypeScript
- Host Service/shared package TypeScript
- targeted Biome/lint
- shared contract tests
- runtime registry tests
- Pi bridge tests
- Pi resume tests
- Renderer snapshot tests
- Grok adapter fixture tests
- `git diff --check`
- sensitive-information scan over committed evidence

### Real Pi integration

Use a disposable project/workspace and verify:

1. real native session UUID reaches the Host registry
2. binding/resume metadata contains the exact UUID where expected
3. real model and effective reasoning reach the snapshot
4. Reasoning Hair/text display the real effective value
5. Pi enters `working` at authoritative run start
6. one or more tool calls produce correlated tool lifecycle events
7. Pi remains working after tool finish when the run continues
8. Pi becomes idle only at `agent_settled`
9. Renderer reload retains the same live session snapshot
10. Pi process restart resumes the exact same native UUID and conversation
11. the resumed adapter uses a new epoch

Capture safe JSON evidence and screenshots under:

`docs/aa/runtime-foundation/phase-3b/`

### Grok integration

At minimum verify:

- real stdio initialize
- structured runtime/version response
- authentication-required response on the current unauthenticated machine
- truthful capability snapshot
- no false session/turn availability
- adapter/registry survives the structured error

If authenticated behavior is unavailable, state the exact prerequisite and stop that sub-experiment.

### Regression

Verify AA Office still supports:

- Pi TUI input/focus
- Briefcase/Workspace navigation
- Employee Roster Tier 2 launches
- `DISPATCHED` / `UNTRACKED` semantics for Tier 2
- Files/Changes/Diff/Review
- Task Folder rename
- saved pane layouts
- 1440×800 layout
- reduced motion

## 12. Deliverables

Create:

- `docs/aa/PHASE-3B-SHARED-RUNTIME-REPORT.md`
- `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/runtime-foundation/phase-3b/`

The report must include:

1. Executive verdict
2. Exact commits/environment
3. Shared contract implementation
4. Runtime registry design
5. Pi bridge v2 mapping
6. Pi native session/model/reasoning/tool evidence
7. Pi resume behavior and failure semantics
8. Renderer migration/fallback behavior
9. Grok ACP adapter status and authentication limitation
10. Security/privacy review
11. Files changed
12. Automated and real verification
13. Known limitations
14. Recommended Phase 3C

The checkpoint must state what is now stable and authoritative, what remains compatibility-only, and the fresh-session read order.

## Final stop condition

After implementation, verification, report, checkpoint, commit, and push are complete, STOP.

Do not begin Phase 3C.

Do not add model/reasoning write, native chat, permissions UI, cancellation UI, or orchestration.