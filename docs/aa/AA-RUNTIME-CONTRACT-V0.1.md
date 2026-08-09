# AA Runtime Contract v0.1

Status: proposed normative contract for Phase 3B. It is not implemented by
Phase 3A.

## Scope

This contract covers AA's Tier 1 runtimes only:

- Pi
- Grok Build

Tier 2 terminal employees remain on the existing terminal-preset contract and
may truthfully remain `DISPATCHED + UNTRACKED`. The contract is independent of
Pi extensions, ACP, PTY, xterm, and Renderer presentation.

The words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are normative.

## Types

```ts
export const AA_RUNTIME_CONTRACT_VERSION = "0.1" as const;

export type AARuntimeId = "pi" | "grok";
export type AATransportKind = "terminal" | "acp";

export type AARuntimeState =
  | "starting"
  | "idle"
  | "working"
  | "waiting_permission"
  | "waiting_user"
  | "cancelling"
  | "offline"
  | "error"
  | "ended"
  | "unknown";

export type AACapabilitySupport =
  | "available"
  | "unavailable"
  | "conditional"
  | "unknown";

export interface AACapability {
  support: AACapabilitySupport;
  /** Stable, non-sensitive reason suitable for diagnostics. */
  reason: string | null;
}

export interface AARuntimeCapabilities {
  sessionIdentity: AACapability;
  turnIdentity: AACapability;
  lifecycle: AACapability;
  toolLifecycle: AACapability;
  permissionRequests: AACapability;
  userQuestions: AACapability;
  modelRead: AACapability;
  modelWrite: AACapability;
  reasoningRead: AACapability;
  reasoningWrite: AACapability;
  structuredMessages: AACapability;
  cancellation: AACapability;
  resume: AACapability;
  processRecovery: AACapability;
}

export interface AARuntimeModel {
  /** Runtime-native provider value, when supplied. */
  provider: string | null;
  /** Runtime-native model value; never inferred from a launch preference. */
  id: string;
  displayName: string | null;
}

export interface AARuntimeReasoning {
  /** Opaque runtime-native value such as "low" or "high". */
  value: string;
  /** Values reported for the effective model, or null when not reported. */
  availableValues: readonly string[] | null;
}

export interface AAResumeState {
  canResume: boolean;
  mechanism: "pi_session" | "acp_load" | null;
  /** Last time the runtime confirmed the native session identity. */
  lastConfirmedAt: number | null;
}

export interface AARuntimeSessionSnapshot {
  contractVersion: typeof AA_RUNTIME_CONTRACT_VERSION;
  /** AA-namespaced durable key; not a terminal identifier. */
  sessionKey: string;
  runtime: AARuntimeId;
  agentId: string;
  workspaceId: string;
  transport: {
    kind: AATransportKind;
    /** Superset PTY identity; null for a transport with no terminal. */
    terminalId: string | null;
  };
  /** Runtime-native conversation identity, or null until observed. */
  nativeSessionId: string | null;
  /** Runtime-native user-turn identity, or null when the runtime has none. */
  nativeTurnId: string | null;
  model: AARuntimeModel | null;
  reasoning: AARuntimeReasoning | null;
  state: AARuntimeState;
  stateReason: string | null;
  capabilities: AARuntimeCapabilities;
  resume: AAResumeState;
  /** Adapter-process incarnation. Changes after adapter/process restart. */
  epoch: string;
  /** Latest gapless sequence inside this epoch. */
  lastSequence: number;
  observedAt: number;
}
```

## Event Envelope

```ts
export interface AARuntimeEventPayloadMap {
  snapshot: { snapshot: AARuntimeSessionSnapshot };
  "session.started": { reason: "new" | "load" | "attach" };
  "session.offline": { resumable: boolean };
  "session.ended": { reason: string | null };
  "turn.started": { correlationId: string | null };
  "turn.settled": { stopReason: string | null };
  "tool.started": { toolCallId: string; name: string | null };
  "tool.progress": { toolCallId: string };
  "tool.finished": {
    toolCallId: string;
    outcome: "completed" | "failed" | "cancelled" | "unknown";
  };
  "permission.requested": {
    requestId: string;
    toolCallId: string | null;
    title: string;
    options: readonly {
      id: string;
      label: string;
      kind: "allow_once" | "allow_always" | "reject_once" | "reject_always";
    }[];
  };
  "permission.resolved": { requestId: string; optionId: string | null };
  "user_input.requested": { requestId: string; title: string };
  "user_input.resolved": { requestId: string };
  "model.changed": { model: AARuntimeModel };
  "reasoning.changed": { reasoning: AARuntimeReasoning };
  "message.delta": {
    channel: "assistant" | "reasoning";
    /** Runtime-neutral content block; consumers MUST tolerate unknown types. */
    content: { type: string; text?: string; data?: unknown };
  };
  "cancel.requested": Record<string, never>;
  "cancel.settled": { outcome: "cancelled" | "too_late" | "failed" };
  "runtime.error": { code: string | null; message: string };
}

export type AARuntimeEventKind = keyof AARuntimeEventPayloadMap;

export interface AARuntimeEventEnvelope<
  K extends AARuntimeEventKind = AARuntimeEventKind,
> {
  contractVersion: typeof AA_RUNTIME_CONTRACT_VERSION;
  eventId: string;
  sessionKey: string;
  runtime: AARuntimeId;
  workspaceId: string;
  terminalId: string | null;
  nativeSessionId: string | null;
  nativeTurnId: string | null;
  /** Adapter/process incarnation; sequence alone is not restart-safe. */
  epoch: string;
  /** Gapless and monotonic only within (sessionKey, epoch). */
  sequence: number;
  occurredAt: number;
  kind: K;
  payload: AARuntimeEventPayloadMap[K];
}
```

`(sessionKey, epoch, sequence)` MUST be unique. Consumers MUST deduplicate by
that tuple or `eventId`. A new process/adapter incarnation MUST mint a new
`epoch`; it MUST NOT continue an unverified old sequence.

## Identity Rules

1. `sessionKey` is AA-namespaced and MUST remain stable across Renderer,
   terminal, adapter, and Host Service restarts. It MAY be a persisted AA UUID
   or a deterministic namespaced key over
   `(runtime, workspaceId, nativeSessionId)` after the runtime reports that
   identity; it MUST NOT be a terminal ID.
2. `terminalId` identifies a Superset PTY. It MUST NOT be used as a runtime
   conversation ID.
3. `nativeSessionId` MUST contain only a value reported by the runtime. A
   filename guess or most-recent-session heuristic is forbidden.
4. `nativeTurnId` MUST contain only a durable runtime-native user-turn ID.
   Pi `turnIndex` and ACP JSON-RPC request IDs are correlation values, not
   native turn IDs, so v0.1 records `null` for them.
5. An adapter MAY generate `correlationId` to join events inside one request,
   but it MUST NOT expose that value as `nativeTurnId`.
6. A tool call is correlated by its runtime-native `toolCallId`. Tool arguments
   and results are outside the minimum v0.1 contract.

## State Semantics

| State | Authoritative meaning |
| --- | --- |
| `starting` | Adapter/process launch or native session create/load is in progress. |
| `idle` | A live runtime has confirmed it is ready and no turn or human wait is active. |
| `working` | The runtime accepted a prompt/agent run and has not authoritatively settled it. |
| `waiting_permission` | At least one structured permission request is unresolved. |
| `waiting_user` | At least one structured non-permission question is unresolved. |
| `cancelling` | A structured cancel was accepted but terminal completion is not yet confirmed. |
| `offline` | A known native session has no live process/adapter and may be resumable. |
| `error` | The runtime/adapter reported a terminal error for the current operation or session. |
| `ended` | The runtime authoritatively ended the session and it is not currently resumable. |
| `unknown` | Evidence is missing, stale, contradictory, or below the capability required to classify it. |

Absence of events, elapsed time, terminal text, animation state, tool finish,
or a launch promise MUST NOT by itself produce `idle`, `ended`, or completion.

### State Machine

```text
starting -> idle                         native create/load/attach confirmed
idle -> working                         prompt/agent run accepted
working -> waiting_permission           structured permission request
working -> waiting_user                 structured user question
waiting_permission -> working           final permission resolved
waiting_user -> working                 final user question resolved
working|waiting_* -> cancelling         structured cancel accepted
working|cancelling -> idle              authoritative turn settled
starting|idle|working|waiting_*|cancelling -> offline  process lost, session resumable
any live state -> error                 authoritative runtime/adapter error
offline|error -> starting               explicit resume/retry
any state -> ended                      authoritative non-resumable session end
any state -> unknown                    evidence becomes insufficient or contradictory
```

`tool.finished` MUST NOT settle a turn. Pi uses `agent_settled`, not
`agent_end`, as its no-retry/no-continuation boundary. An ACP adapter uses the
resolved `session/prompt` response and its stop reason.

## Capability Rules

- Capabilities are per live session/adapter incarnation, not a marketing list.
- `available` means the operation or observation is usable now.
- `unavailable` means the adapter has verified it is absent.
- `conditional` means it depends on an optional extension, mode, account, or
  configuration and is not usable now. UI MUST treat it as unavailable.
- `unknown` means the adapter has not established support. UI MUST hide the
  corresponding control and MUST NOT infer a value.
- A control MUST be enabled only when its write capability is `available`.
- A value MUST be rendered as authoritative only when its read capability is
  `available` and the value is non-null.

## Resume Contract

AA MUST durably bind `sessionKey`, `runtime`, `workspaceId`, runtime harness or
adapter version, and `nativeSessionId` before setting `canResume: true`.

Resume MUST:

1. use the original workspace/cwd;
2. invoke the runtime-native mechanism (`pi --session` or ACP `session/load`);
3. require the resumed runtime to confirm the same `nativeSessionId`;
4. mint a new `epoch`;
5. remain `offline` or become `error` if load fails; and
6. never silently create a replacement conversation.

Renderer reload and terminal detach/reattach are transport reattachment, not
runtime resume. AA metadata is registry data only; conversation content
remains in the runtime's native store unless a later contract says otherwise.

## Model and Reasoning Contract

- `model` and `reasoning` MUST come from active runtime state or a runtime
  event. Launch preferences are not authoritative effective values.
- Reasoning strings are opaque and MUST NOT be normalized into invented
  levels. Hair/persona presentation MAY map them separately while preserving
  the exact text.
- `availableValues` MUST be model-specific when the runtime reports them.
- A set operation acknowledges only request acceptance. The visible value
  MUST change only after a runtime confirmation/event.
- If the current transport is observational only, `modelWrite` or
  `reasoningWrite` MUST be `unavailable` even when an in-process runtime API
  could theoretically perform the change.

## Permission and User-Question Contract

- Waiting states require a structured request with a stable `requestId`.
- Permission and ordinary user input are separate states and event kinds.
- Resolution MUST be idempotent: the first valid answer wins; later answers
  report stale/already-resolved.
- Adapters MUST clear or cancel unresolved requests on turn cancellation,
  adapter death, or session end.
- Terminal/TUI text MUST NOT be scraped to discover prompts or approvals.
- Pi optional permission/question extensions are `conditional`; Pi core does
  not make them universal runtime capabilities.

## Cancellation Contract

- Cancellation is available only through a structured runtime operation.
- Request acceptance transitions to `cancelling`; it does not prove the turn
  stopped.
- A runtime settlement, cancel result, or terminal error completes the state
  transition.
- Sending Ctrl-C or killing a PTY/process is a transport termination action,
  not a successful runtime cancellation, and MUST be modeled separately.

## Adapter Mapping Requirements

### Pi terminal adapter

- Preserve Pi TUI/xterm and emit observations through a versioned bridge.
- Read session ID from `ctx.sessionManager.getSessionId()`.
- Read effective model and reasoning from extension context/runtime APIs.
- Use `agent_start`/`agent_settled` for working/idle.
- Forward tool start/update/end with `toolCallId`, but omit arguments/results
  from the minimum bridge.
- Keep `nativeTurnId: null`; `turnIndex` MAY be diagnostic correlation only.
- Mark permission/question capabilities conditional unless the exact optional
  extension contract is detected.
- A unidirectional hook bridge MUST report model/reasoning write and structured
  cancellation as unavailable.

### Grok ACP adapter

- Negotiate capabilities from `initialize` and session responses.
- Use `session/new`, `session/load`, `session/prompt`, structured updates,
  `session/request_permission`, and `session/cancel` only when the authenticated
  runtime confirms them.
- Keep `nativeTurnId: null` unless Grok returns a distinct durable turn ID;
  JSON-RPC request IDs remain correlation only.
- A declared or binary-visible method is `unknown`/`conditional` until the
  current authenticated adapter session makes it available.

No Phase 3B implementation may modify PTY daemon behavior, xterm rendering,
Git/worktree behavior, or Tier 2 terminal preset semantics.
