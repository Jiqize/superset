# AA Phase 3A Runtime Contract Report

## 1. Executive Recommendation

**PROCEED WITH SHARED PI+GROK ADAPTER FOUNDATION**

AA should share one runtime-neutral session, lifecycle, capability, and resume
contract while retaining two different authoritative transports:

- Pi remains a real terminal/TUI runtime. A versioned Pi extension bridge
  should expose safe runtime observations without replacing xterm or PTY.
- Grok Build should use its structured ACP/stdio mode, built on the existing
  host-owned ACP session infrastructure rather than a new AA service.
- Codex, Claude Code, OpenCode, Kimi, and other Tier 2 employees should remain
  existing terminal presets with `DISPATCHED`, binding-confirmed `ASSIGNED`,
  or explicit `UNTRACKED` semantics.

This is the smallest architecture that preserves AA Office's real terminal,
avoids parsing TUI output, and can represent runtime-specific capability gaps.
Phase 3A changed no production runtime, schema, PTY, Git/worktree, or Renderer
file. The proposed normative contract is
[`AA-RUNTIME-CONTRACT-V0.1.md`](./AA-RUNTIME-CONTRACT-V0.1.md).

Starting point was fast-forwarded and confirmed at
`503328079d9c633b3ed395612b6ff4296a9f34a9`.

## 2. Runtime Tier Policy

| Tier | Runtimes | Phase 3 contract |
| --- | --- | --- |
| Tier 1 product runtimes | Pi, Grok Build | Authoritative capability negotiation, session snapshot, lifecycle, model/reasoning observation, tool identity, resume, and structured controls only where verified. |
| Tier 2 compatibility runtimes | Codex, Claude Code, OpenCode, Kimi, other CLIs | Keep current terminal launch and binding path. `DISPATCHED + UNTRACKED` remains valid when no authoritative lifecycle exists. No Phase 3A optimization around vendor-specific hooks. |

Tier is a product-support policy, not an employee rank or model-quality claim.
Tier 2 agents remain launchable and usable in the terminal.

## 3. Pi Capability Matrix

QA runtime: Pi `0.82.1` at `$HOME/.npm-global/bin/pi`, provided by
the installed `@earendil-works/pi-coding-agent` package.

| Capability | Pi 0.82.1 authoritative surface | Current Superset bridge | Finding |
| --- | --- | --- | --- |
| Runtime identity | Launch definition/environment identifies Pi. | `agentId: pi` is persisted. | Available. |
| Native session ID | `ctx.sessionManager.getSessionId()` and RPC state return a UUID; the session JSONL header repeats it. | Extension sends no session ID; binding column is empty. | Runtime available; bridge missing. |
| Durable user-turn ID | No native request/turn UUID observed. `turnIndex` identifies LLM calls and reset to `0` after process resume. | None. | Unavailable; must remain `null`. |
| Lifecycle | `session_start`, `agent_start`, `agent_end`, `agent_settled`, `session_shutdown`, turn/message/tool events. | Coarse `Attached`, `Start`, `Stop`. | Rich runtime surface; lossy bridge. |
| Authoritative turn settled | `agent_settled` means no automatic retry, compaction, or queued continuation remains. | `agent_end` currently emits `Stop`. | Use `agent_settled` in a future bridge. |
| Tool lifecycle | Start/update/end each carry stable `toolCallId`, tool name, and error outcome. | Only `tool_execution_end` becomes `PostToolUse` → `Start`; ID and name are dropped. | Runtime available; bridge missing. |
| Permission wait | No universal Pi core permission event. | None. | Conditional on optional extension, never assumed. |
| User-question wait | No universal Pi core question event. | None. | Conditional on optional extension, never assumed. |
| Model read | `ctx.model` and `model_select`. | Not sent. | Runtime available; bridge missing. |
| Model write | `ExtensionAPI.setModel(...)`; RPC also has model controls. | Current terminal hook is outbound-only. | Runtime API exists; current adapter write unavailable. |
| Reasoning read | `ctx.thinkingLevel`, `getThinkingLevel()`, RPC state, and `thinking_level_select`. | Launch preference only; no effective active value. | Runtime available; bridge missing. |
| Reasoning write | `setThinkingLevel(...)`; RPC `set_thinking_level`, with model clamping. | No Renderer-to-Pi control channel. | Runtime API exists; current adapter write unavailable. |
| Structured messages | Message start/update/end and RPC event stream expose structured runtime messages. | Only raw PTY bytes reach xterm. | Available in Pi, intentionally absent from current terminal-first UI. |
| Error | Tool end includes `isError`; provider response status and shutdown reasons are observable. | Pi-specific failure fields are not sent. | Partial runtime evidence; bridge missing. |
| Structured cancellation | Extension context exposes `abort()` and RPC exposes control. | Ctrl-C/PTY input only; no structured confirmation. | Current adapter unavailable. |
| Resume | `--session <id>` reloads the native session file. | Generic resume plumbing exists, but Pi ID is never captured. | Runtime verified; current AA full-restart resume blocked by bridge. |
| Nested/subagent distinction | `mode` and `hasUI` distinguish TUI/RPC from print/JSON helpers; core events have no parent/root ID. | `hasUI === false` is skipped, preventing helper flicker. | Main-vs-non-UI filtering works; hierarchical child identity is unavailable. |

Pi core does not make the machine's optional packages universal. This QA
installation happens to include:

- `@gotgenes/pi-permission-system`, which publishes
  `permissions:ui_prompt` and `permissions:decision`, including request IDs
  and optional forwarded-subagent context;
- `@juicesharp/rpiv-ask-user-question`, which publishes
  `rpiv:ask-user:prompt` and `rpiv:ask-user:blocked { active }`.

Those are package contracts, not Pi core contracts. A future adapter may
detect a compatible version and mark the capability available for that
session; without detection it must report `conditional` or `unavailable`.

## 4. Pi Event and Identity Trace

### Current end-to-end path

```text
AA Renderer preset / new-workspace form
  -> workspaceTrpc.agents.run or workspaces.create
  -> packages/host-service/src/trpc/router/agents/agents.ts
  -> createTerminalSessionInternal
  -> DaemonClient -> packages/pty-daemon -> shell
  -> Pi TUI process
  -> ~/.pi/agent/extensions/superset-hooks.ts
  -> notify.sh -> notifications.hook
  -> AgentLifecycle event + TerminalAgentStore
  -> workspace-client event bus
  -> Renderer binding/status hooks -> AA Worker presentation
```

Relevant repository paths:

- Pi catalog and launch arguments:
  `packages/shared/src/builtin-terminal-agents.ts`
- V2 launch:
  `packages/host-service/src/trpc/router/agents/agents.ts`
- terminal creation:
  `packages/host-service/src/terminal/terminal.ts`
- installer:
  `apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts`
- generated source:
  `apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts`
- shared shell transport:
  `apps/desktop/src/main/lib/agent-setup/templates/notify-hook.template.sh`
- hook receiver:
  `packages/host-service/src/trpc/router/notifications/notifications.ts`
- normalization/store:
  `packages/host-service/src/events/map-event-type.ts` and
  `packages/host-service/src/terminal-agents/store.ts`
- Renderer event/binding/status:
  `packages/workspace-client/src/lib/eventBus.ts`,
  `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentBindings/`, and
  `apps/desktop/src/renderer/hooks/host-service/useTerminalAgentStatuses/`.

The installed `~/.pi/agent/extensions/superset-hooks.ts` is the generated v1
template. It writes only:

```json
{ "hook_event_name": "<event>" }
```

It currently maps:

| Pi event | Shell event | Host event |
| --- | --- | --- |
| `session_start` | `SessionStart` | `Attached` |
| `before_agent_start` | `UserPromptSubmit` | `Start` |
| `tool_execution_end` | `PostToolUse` | `Start` |
| `agent_end` | `Stop` | `Stop` |
| `session_shutdown` | `Stop` | `Stop` |
| `session_end` | `SessionEnd` | `Detached` |

The final row is stale for installed Pi 0.82.1: the current typed extension API
has `session_shutdown`, not `session_end`. The registration therefore provides
no reliable detach event on this version. No runtime code was changed to fix
that during the spike.

### Authoritative Pi event inventory

The installed type surface and direct probe confirmed these useful groups:

- session: `session_start` with reason, session switch/fork/compact/tree
  events, metadata changes, and `session_shutdown` with reason;
- run: `before_agent_start`, `agent_start`, `agent_end`, and
  `agent_settled`;
- LLM calls: `turn_start`/`turn_end` with `turnIndex`;
- messages: `message_start`, token-stream `message_update`, and `message_end`;
- tools: `tool_execution_start`, `tool_execution_update`, and
  `tool_execution_end`, correlated by `toolCallId`;
- configuration: `model_select` and `thinking_level_select`;
- context: mode, `hasUI`, current model, current thinking, native session ID,
  session file, idle state, and abort signal.

### Real AA UI identity comparison

The disposable AA workspace `runtime-contract-pi` launched a real Pi turn and
one harmless bash tool call. The identities after completion were:

| Layer | Value |
| --- | --- |
| Workspace | `f5e93b86-97dc-4e66-b7f8-611d15a81717` |
| Superset terminal | `d9f3fb2b-fa41-4b38-8cb2-03da4cc57d18` |
| Pi native session | `019fe6c7-0087-71e0-8552-55d2f6575e0d` |
| Binding `agent_id` | `pi` |
| Binding `agent_session_id` | `NULL` |
| Hook cadence | `SessionStart → Start → PostToolUse → Stop` |

Pi's session file independently recorded model `google/gemini-3.5-flash` and
effective thinking `high`; none reached the binding or Renderer. Curated
evidence is in
[`runtime-spike/pi-superset-ui-probe.json`](./runtime-spike/pi-superset-ui-probe.json).

## 5. Pi Restart and Resume Findings

| Boundary | Result | Identity that survived |
| --- | --- | --- |
| Renderer reload | Passed in the real AA workspace. | Workspace ID, Superset terminal ID, live Pi process, terminal tab, and native Pi session all remained the same. |
| Route detach/reattach | Passed via real Home navigation and browser Back keyboard input. The UI reported one background terminal while detached. | Same Superset terminal and Pi process/session. |
| Pi process restart + explicit `--session` | Passed in a disposable direct RPC harness. | Same Pi UUID, same session file, four prior messages, effective thinking `low`, then six messages after the resumed prompt. |
| Electron/Host Service full restart | Not run. | The shared dev instance owned unrelated live terminals/Pi processes; killing it would risk the user's long-lived environment. |
| Current AA full-restart conversation resume | Not available. | Pi's UUID exists, but the bridge drops it and `terminal_agent_bindings.agent_session_id` remains empty. |

The explicit process-restart probe also found that `turnIndex` restarted at
`0`. It is not a durable request identity. The resumed process emitted
`session_start.reason = "startup"`, not `"resume"`, so the reason string alone
also cannot prove resume; the matching native UUID is authoritative. The safe
transcript is
[`runtime-spike/pi-rpc-probe.json`](./runtime-spike/pi-rpc-probe.json).

The durable Pi resume requirement is exact: preserve the native UUID returned
by `getSessionId()` and invoke `pi --session <that UUID>` in the original
workspace. AA must require the resumed process to report the same UUID; it
must not select a most-recent session heuristically.

## 6. Pi Reasoning Findings

Pi exposes the effective value authoritatively:

- `ctx.thinkingLevel` in extension callbacks;
- `ExtensionAPI.getThinkingLevel()`;
- `thinking_level_select { level, previousLevel }`;
- RPC state and `get_available_thinking_levels`;
- persistent `thinking_level_change` entries in the native session file.

The direct probe launched with `high`, changed live to `low`, observed the
selection event, and resumed a new Pi process at effective `low`. The active
model reported only `off`, `minimal`, `low`, `medium`, and `high` as available.
Although Pi CLI accepts wider values such as `xhigh`/`max`, the available set
is model-dependent; AA must use the effective model's reported values rather
than the launch picker catalog.

Pi can change reasoning live through its extension/RPC API, but AA's current
TUI hook is unidirectional. Therefore:

- `reasoningRead` can be implemented safely by enriching observations;
- `reasoningWrite` remains unavailable on the current terminal adapter;
- the Phase 2 launch preference must not be displayed as active reasoning;
- Reasoning Hair may render only after an authoritative active value arrives.

## 7. Grok Capability Matrix

QA runtime: signed macOS arm64 Grok Build `0.2.87 (0ae0bf47e53)` at
`$HOME/.local/bin/grok`. `grok agent --help` exposes `stdio`,
`headless`, `serve`, and `leader` modes.

Evidence levels below deliberately distinguish live verification from static
protocol discovery.

| Capability | Evidence | Status after Phase 3A |
| --- | --- | --- |
| Structured transport | Real `grok agent ... stdio` accepted newline-delimited JSON-RPC and answered `initialize`. | Verified. |
| Runtime identity/version | Initialize returned Grok-shell metadata and agent version 0.2.87. Instance IDs were redacted. | Verified. |
| Model read | Initialize returned current model `grok-build`; available list was empty while unauthenticated. | Verified at initialize only. |
| Session create | `session/new` returned structured error `-32000 Authentication required`. | Method verified; success blocked. |
| Session load/resume | Initialize advertised `loadSession: true`; CLI supports `--resume`. | Advertised, not behaviorally verified. |
| Native session ID | Expected from successful `session/new`, but creation was blocked. | Unknown until authenticated test. |
| Durable user-turn ID | No distinct native turn ID was observed. JSON-RPC request ID would be client correlation only. | Unknown/absent; contract remains null. |
| Prompt and assistant stream | `session/prompt` and `agent_message_chunk` are present in the local structured surface. | Static evidence only; blocked by auth. |
| Reasoning stream/state | Binary surface contains `agent_thought_chunk`; CLI exposes effort/reasoning flags. No authenticated session value was observed. | Static evidence only. |
| Tool lifecycle | `tool_call` and `tool_call_update` are present. | Static evidence only. |
| Permission/waiting | `session/request_permission` is present; local Grok hooks also classify permission and elicitation notifications. | Static evidence only. |
| Completion/stop | ACP prompt response supplies a stop reason by protocol, but no prompt completed. | Not behaviorally verified. |
| Cancellation | `session/cancel` is present and initialize reports `cancelRewind: true`. | Advertised/static only. |
| Model write | CLI `--model` and `session/set_model` are present. | Static evidence only. |
| Structured error | JSON-RPC authentication error was returned with code/message/data. | Verified. |

This matrix does not promote symbol presence to an available product
capability. The current session capability must remain `unknown` or
`conditional` until an authenticated initialize/create/prompt path confirms
it.

## 8. Grok Structured-Protocol Experiment

Commands used:

```sh
grok --version
grok agent --help
grok agent stdio --help
grok agent --no-leader --always-approve stdio
grok models
```

The smallest live transcript reached:

```text
client -> initialize(protocolVersion=1)
grok   -> initialize result
          loadSession=true
          modelState.currentModelId="grok-build"
          authMethods=["grok.com"]
          defaultAuthMethodId=null
client -> session/new(disposable cwd)
grok   -> error -32000 "Authentication required"
```

`grok models` independently reported `You are not authenticated.` The brief
requires stopping a structured sub-experiment at an exact missing
prerequisite, so no user credentials were entered and no successful turn,
tool event, completion, cancel, or load/resume is claimed. An authenticated
Grok account on an isolated QA profile is the exact missing prerequisite.

The sanitized transcript and distinction between verified/static/blocked
capabilities are in
[`runtime-spike/grok-acp-probe.json`](./runtime-spike/grok-acp-probe.json).

### Existing Superset Grok surfaces

Grok currently remains a terminal preset in
`packages/shared/src/builtin-terminal-agents.ts`, launched as
`grok --always-approve` with `grok --always-approve --resume` available. The
installer at
`apps/desktop/src/main/lib/agent-setup/agent-wrappers-grok.ts` registers native
Grok hooks for session, prompt, tool completion/failure, stop/failure, and
blocking notifications. Those hooks still collapse into the generic
terminal-agent lifecycle.

The repository also already contains a mature internal host-owned ACP path:

- `packages/host-service/src/runtime/acp-sessions/`
- `packages/host-service/src/trpc/router/acp-sessions/`
- `packages/session-protocol/src/`
- `packages/host-client/src/acp/`
- `packages/host-service/docs/acp-sessions.md`

It currently spawns one hard-coded `claude-agent-acp` child per session and is
rendered by mobile, not desktop. It already demonstrates native/public session
identity separation, `session/new`, `session/load`, structured updates,
permissions, cancellation, a bounded journal, persistence, and offline
resurrection. Phase 3A inspected but did not modify or repurpose it.

## 9. Proposed AA Runtime Contract

The full normative proposal is
[`AA-RUNTIME-CONTRACT-V0.1.md`](./AA-RUNTIME-CONTRACT-V0.1.md). Its minimum
session snapshot contains:

- AA session key, runtime, agent, workspace, transport kind, and terminal ID;
- runtime-native session ID and optional runtime-native turn ID;
- authoritative model and reasoning, or null;
- current lifecycle state and reason;
- per-session capability flags;
- native resume mechanism and confirmation time;
- adapter/process epoch, sequence, and observation time.

The contract separates three identities that the current terminal path
conflates:

```text
AA session key         durable AA-namespaced identity
Superset terminal ID   PTY transport identity
native session ID      Pi/Grok conversation identity
```

`nativeTurnId` remains null unless a runtime supplies a durable user-turn ID.
Pi `turnIndex` and ACP JSON-RPC request IDs may be correlation fields, never
turn identity.

Every event carries `(sessionKey, epoch, sequence)`. A new adapter/process
incarnation mints a new epoch. This avoids the stale-cursor ambiguity already
documented by the existing ACP journal after host restart.

## 10. Runtime State Machine

The proposed states are:

```text
starting
idle
working
waiting_permission
waiting_user
cancelling
offline
error
ended
unknown
```

Core transitions:

```text
starting -> idle                    native create/load/attach confirmed
idle -> working                    prompt/agent run accepted
working -> waiting_permission      structured permission request
working -> waiting_user            structured user question
waiting_* -> working               final request resolved
working|waiting_* -> cancelling    structured cancel accepted
working|cancelling -> idle         authoritative turn settled
live state -> offline              process absent, native session resumable
offline|error -> starting          explicit resume/retry
any -> error                       authoritative runtime/adapter error
any -> ended                       authoritative non-resumable end
any -> unknown                     evidence missing/stale/contradictory
```

Important negative rules:

- tool completion is not turn completion;
- terminal launch success is not assignment or working state;
- terminal text is never parsed for state;
- silence/timeouts do not imply idle;
- Pi `agent_end` is not fully settled when automatic continuation may follow;
- an ACP prompt request ID is not a durable Grok turn ID;
- Ctrl-C/process kill is not a successful structured cancellation.

## 11. Capability Model

Each snapshot carries an explicit status for:

```text
sessionIdentity      turnIdentity
lifecycle            toolLifecycle
permissionRequests   userQuestions
modelRead            modelWrite
reasoningRead        reasoningWrite
structuredMessages   cancellation
resume               processRecovery
```

Each is one of:

- `available`: usable in this current session/adapter incarnation;
- `unavailable`: verified absent;
- `conditional`: depends on an optional package, account, mode, or config and
  is not usable now;
- `unknown`: not established.

UI rules are strict:

- only `available` read capability plus a value may present an authoritative
  value;
- only `available` write capability may enable a control;
- `conditional` and `unknown` must not produce fake state;
- capability catalogs must be refreshed after model/session/adapter changes.

Expected first adapter posture:

| Capability group | Pi terminal bridge | Grok ACP bridge |
| --- | --- | --- |
| Session/lifecycle/model/reasoning read | Available after versioned Pi observation | Negotiated after authenticated initialize/create |
| Tool lifecycle | Available without args/results | Negotiated ACP updates |
| Turn identity | Unavailable | Null unless Grok returns a distinct native ID |
| Permission/question | Conditional optional Pi packages | Negotiated structured requests |
| Model/reasoning write | Unavailable on outbound-only Pi bridge | Negotiated; not assumed from CLI flags |
| Structured messages | Optional/deferred to preserve terminal-first scope | Negotiated ACP stream |
| Cancellation | Unavailable on outbound-only Pi bridge | Negotiated `session/cancel` |

## 12. Adapter Architecture Options

| Option | RED-area change / merge risk | Correctness and resume | Pi | Grok | Tier 2 |
| --- | --- | --- | --- | --- | --- |
| 1. Extend `TerminalAgentBinding` and generic hook path for everything | Medium. Schema/event payload growth touches host lifecycle shared by every CLI. | Good for identity/coarse events, poor for bidirectional controls and structured streams. Risks turning a binding row into a transcript/runtime protocol. | Natural but still needs richer versioned events. | Poor fit for ACP request/response, permissions, cancel, and streaming. | High regression risk because all presets share the path. |
| 2. Add a separate AA runtime service beside Host Service | High. Duplicates process ownership, auth, persistence, journal, transport, and lifecycle. | Could be correct, but creates two local runtime authorities and highest upstream conflict. | Possible. | Possible. | Isolated, but unnecessary duplication. |
| 3. Hybrid Pi terminal bridge + Grok ACP behind one AA contract | Low-to-medium additive RED changes. Reuses current PTY for Pi and current ACP foundations for Grok. | Best match to authoritative vendor surfaces; strong resume path without TUI parsing. | Preserves real TUI and xterm. | Uses native structured mode. | Existing preset path stays untouched. |
| 4. Move both Pi and Grok to structured RPC/ACP | Medium-to-high and product-risky. | Uniform protocol, but Pi RPC would replace or duplicate the primary Pi TUI. | Violates the real-terminal-first product and changes interaction semantics. | Good. | Unchanged. |
| 5. Parameterize the existing ACP manager for Grok, without a shared contract | Medium, localized host/session-protocol change. | Good Grok implementation, but Pi remains a separate ad hoc shape and AA Renderer gets two incompatible models. | No benefit. | Strong foundation. | Unchanged. |

Option 3 should use Option 5's existing ACP manager as its Grok
implementation vehicle. It does not require a new service.

## 13. Recommended Architecture

```text
                         AA Runtime Contract v0.1
                       snapshot + event + capability
                                  |
                    host-owned runtime projection/stream
                       /                          \
      Pi terminal observation adapter       Grok ACP adapter
      - existing PTY/xterm/TUI              - existing ACP manager base
      - versioned Pi extension payload      - grok agent stdio
      - no terminal-text parsing            - new/load/prompt/update/cancel
                       \                          /
                    existing workspace / host ownership

Tier 2 presets -> existing TerminalAgentBinding path -> tracked or UNTRACKED
```

Implementation principles:

1. Keep `TerminalAgentBinding` as the existing terminal identity/coarse
   lifecycle read model; do not turn it into the complete runtime contract.
2. Add a versioned, safe Pi observation payload carrying session ID, event,
   model, thinking, tool ID/name/outcome, and adapter metadata. Do not carry
   prompts, tool arguments/results, or transcript content in the minimum path.
3. Project those observations into a runtime snapshot/event stream. Persist
   only the native session identity needed for resume, reusing existing
   terminal-agent resume storage where practical.
4. Generalize the existing host ACP harness boundary so Grok can supply its
   executable/args and harness ID while retaining the current journal,
   permission, cancel, persistence, and load semantics.
5. Keep the Grok adapter disabled until an authenticated isolated E2E proves
   create, one safe tool, permission, cancel, and load of the same native ID.
6. Renderer consumes the shared contract and capability flags; it does not
   know Pi event names or ACP methods.

## 14. Codex Dogfood Finding Reclassification

The dogfood HIGH finding was: Codex TUI still appeared to be working while AA
showed completion/idle.

Classification:

- It exposes a generic limitation of terminal hook semantics: a vendor hook
  called `Stop` or `turn complete` may not mean the interactive TUI has no
  continuing operation.
- It is not a blocker or design input for Pi/Grok Tier 1 adapters. Pi has
  `agent_settled`; Grok has a structured prompt response/stop reason once
  authenticated.
- Codex should remain Tier 2 and may be partially tracked or `UNTRACKED`.
- The AA Runtime Contract can solve this opportunistically later if a Codex
  adapter supplies authoritative `turn.settled` and capabilities. Until then,
  the contract should classify evidence gaps as `unknown`, not add
  Codex-specific timing heuristics.

No Codex hook or UI behavior was changed in Phase 3A.

## 15. RED-Area Impact Assessment

### Phase 3A actual impact

None. Only documentation and sanitized evidence were added. No file under
`apps/desktop/src/main/`, `packages/host-service/src/`,
`packages/session-protocol/src/`, `packages/workspace-client/src/`,
`packages/pty-daemon/src/`, or any database schema was modified.

### Likely Phase 3B RED touch points

| Path | Why it may be required | Boundary rule |
| --- | --- | --- |
| `apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts` | Versioned Pi observations and current-event correction. | Additive, safe fields only; preserve no-op/fire-and-forget behavior. |
| `apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts` | Install/version the new template. | No launch or PTY behavior change. |
| `packages/host-service/src/trpc/router/notifications/` or a narrow sibling runtime router | Receive versioned runtime observations. | Do not overload generic lifecycle meaning or expose secrets. |
| `packages/host-service/src/terminal-agents/` | Persist Pi native session ID for existing resume machinery. | Prefer existing `agent_session_id`; avoid schema changes unless proven necessary. |
| `packages/host-service/src/runtime/acp-sessions/` | Parameterize the hard-coded harness and add Grok only after authenticated evidence. | Preserve current Claude behavior and tests. |
| `packages/session-protocol/src/` | Shared runtime types, validators, envelopes, epoch cursor. | Additive versioned exports; no Pi/ACP names in contract types. |
| `packages/host-client/src/acp/` or the established local host-client boundary | Deliver snapshots/commands to consumers. | Reuse transport; no parallel AA process/service. |

Explicitly avoid in Phase 3B unless a separately verified blocker exists:

- `packages/pty-daemon/src/`
- xterm/TerminalPane transport and focus behavior
- Git/worktree/filesystem services
- host process lifecycle/spawn primitives
- Tier 2 preset and hook semantics
- broad database or chat architecture rewrites.

## 16. Exact Next Implementation Slice for Phase 3B

Phase 3B should be one bounded foundation with an authenticated Grok gate:

1. Add the v0.1 types plus runtime validators and state-machine tests to the
   shared session-protocol boundary. Include `epoch` in stream cursors from the
   start.
2. Add a host-owned, additive runtime snapshot/event projection. It should
   expose read/list/subscribe and capability data only; do not add native chat
   UI or task orchestration.
3. Upgrade the Pi extension payload to a versioned observational schema and
   map `session_start`, `agent_start`, tool start/update/end,
   `agent_settled`, `model_select`, `thinking_level_select`, and
   `session_shutdown`. Capture the native session ID in the existing resume
   field. Omit prompt text, messages, args, and results.
4. Expose Pi effective model/reasoning and native session resume in AA using
   capability flags. Keep model/reasoning write, permissions, structured
   transcript, and structured cancellation disabled in this first slice.
5. Parameterize the existing ACP manager with a harness descriptor while
   retaining the current Claude default and all existing tests.
6. Before enabling a Grok harness, run an authenticated isolated E2E proving:
   initialize, new, native ID, prompt stream, one harmless tool with correlated
   lifecycle, permission request/response without `--always-approve`, cancel,
   process restart, and load of the same native ID. If this gate is unavailable,
   ship the shared foundation and Pi adapter with Grok capability `conditional`
   rather than guessing.
7. Add only a minimal AA diagnostic surface for snapshots/capabilities. Defer
   product UI changes until the runtime tests pass.

Acceptance requires existing terminal/PTY, Renderer reload/reattach, Tier 2
launch, and current ACP Claude tests to remain green.

## 17. Open Questions

1. What exact Grok ACP session-new response, config options, stop reasons, and
   replay ordering appear after authentication on the supported production
   account?
2. Does Grok emit `agent_thought_chunk` for the selected model/effort, and is
   there an authoritative current effort value separate from reasoning text?
3. Does Grok `session/set_model` return/emit enough state to confirm the
   effective model, and which authenticated models are available?
4. How does Grok behave when a permission is pending during cancel or process
   loss, and does `session/load` terminalize an interrupted tool consistently?
5. Should AA detect the optional Pi permission/question packages, or defer all
   Pi structured human-wait controls until Pi core defines a universal event?
6. Should Pi structured message events remain diagnostic-only to preserve the
   terminal-first product, or become an optional future transcript capability?
7. Is the current Pi `session_end` registration harmless on every supported Pi
   version, and what minimum Pi version should the v2 bridge declare?
8. Can the existing terminal-agent resume field persist every required Pi
   identity without a new table once a session moves across terminal IDs?
9. What retention/redaction policy should apply if structured Grok message
   deltas are exposed beyond the existing native transcript store?
10. Should the generic ACP journal adopt epoch-aware cursors before Grok is
    enabled, fixing the existing host-restart cursor ambiguity for all
    harnesses at once?

## 18. Verification and Evidence

Investigation commands included:

```sh
git pull --ff-only origin aa-spike
git merge-base --is-ancestor 503328079d9c633b3ed395612b6ff4296a9f34a9 HEAD
pi --version
pi --help
pi list
grok --version
grok --help
grok agent --help
grok agent stdio --help
grok models
sqlite3 superset-dev-data/host/<host-id>/host.db ...
bun /tmp/aa-dogfood-cdp.ts reload
```

Focused existing verification passed:

- desktop Pi/Grok wrapper and notify-hook suites: 72 tests, 0 failures;
- Host Service terminal-agent store/persistence and ACP journal/stream suites:
  46 tests, 0 failures;
- Biome check over all three JSON evidence files;
- JSON parsing and every Markdown/repository path reference check;
- disposable AA probe cleanup: clean worktree, workspace row, local branch,
  and probe Pi process removed through the existing UI;
- `git diff --check` on the final intended files.

```sh
(cd apps/desktop && bun test \
  src/main/lib/agent-setup/agent-wrappers.test.ts \
  src/main/lib/agent-setup/notify-hook.test.ts)
(cd packages/host-service && bun test \
  src/runtime/acp-sessions/journal.test.ts \
  src/runtime/acp-sessions/stream.test.ts \
  src/terminal-agents/store.test.ts \
  src/terminal-agents/persistence.test.ts)
./node_modules/.bin/biome check docs/aa/runtime-spike/*.json
jq empty docs/aa/runtime-spike/*.json
git diff --check
```

The direct Pi probe used a disposable workspace/session directory, Pi RPC
mode, one harmless bash tool, a live thinking change, process shutdown, and
explicit resume. The AA UI probe used real CDP pointer/keyboard input against
the running Electron Renderer; it did not invoke DOM `click()`.

Committed evidence is intentionally curated:

- [`runtime-spike/pi-rpc-probe.json`](./runtime-spike/pi-rpc-probe.json)
- [`runtime-spike/pi-superset-ui-probe.json`](./runtime-spike/pi-superset-ui-probe.json)
- [`runtime-spike/grok-acp-probe.json`](./runtime-spike/grok-acp-probe.json)

No prompt body, assistant body, terminal transcript, tool argument/result,
credential, API key, token, hostname, unrelated session, or private MCP
configuration is committed.

## Decision Gate

**PROCEED WITH SHARED PI+GROK ADAPTER FOUNDATION**

Pi has enough verified authoritative state to justify an observational v2
bridge now. Grok has a genuine structured ACP transport and an existing
Superset ACP foundation, but authenticated behavioral verification is a hard
enablement gate. A shared partial-capability contract lets Phase 3B move
forward without pretending the blocked Grok behaviors were tested and without
turning Tier 2 terminal employees into architecture drivers.

Phase 3A stops here. Phase 3B has not begun.
