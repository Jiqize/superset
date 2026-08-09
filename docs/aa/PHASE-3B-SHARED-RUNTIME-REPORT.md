# Phase 3B — Shared Runtime Foundation Report

## 1. Executive verdict

Phase 3B is complete. AA Office now has a versioned, runtime-neutral contract,
a Host-owned runtime registry, an authoritative Pi observation/resume path, and
a truthful Grok Build ACP foundation. The real Pi TUI remains the primary work
surface and continues to use the existing terminal, PTY, workspace, and pane
infrastructure.

The real Pi acceptance run proved native session identity, model, reasoning,
gapless lifecycle/tool events, Renderer reattachment, and exact UUID resume
with a new epoch and retained conversation context. The current Grok machine is
not authenticated, so Phase 3B truthfully stops at real stdio initialization,
runtime metadata, sanitized authentication-required state, and deterministic
adapter/registry fixtures. It does not claim a live Grok session.

No database migration, PTY daemon change, xterm change, Git/worktree change,
native chat, write control, permission UI, cancellation UI, or orchestration was
introduced.

## 2. Exact commits and environment

- Branch: `aa-spike`
- Required brief commit confirmed before implementation:
  `d913285f3546f0b9dfc58ac3ca34477eb620fd36`
- Phase 3A contract parent:
  `64593b5b0df0dc74f7a5866c14b4a2b879438f90`
- Normative contract: `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- Phase 3B code, report, checkpoint, and evidence are one report-bearing commit;
  after checkout, `git rev-parse HEAD` is its exact identifier.

| Environment | Verified value |
| --- | --- |
| Host | macOS 26.4 (`25E246`), Apple Silicon arm64 |
| Bun | `1.3.14` |
| Node | `v24.14.0` |
| Electron | `41.10.3` |
| Pi | `0.82.1` |
| Grok Build | `0.2.87` (`0ae0bf47e53`) |
| AA profile | Existing local development profile and local seeded account |
| Pi project | Existing safe `aa-baseline-fixture` fixture |
| Pi workspace | Disposable `runtime-foundation-pi-live`, removed after QA |
| Grok authentication | Not authenticated; no credentials entered |

The repository `.env` selects the shared `superset-dev-data` profile. Because
unrelated live Pi processes existed on the machine, a claimed isolated full-app
restart would have been unsafe and misleading. Renderer reload plus an exact
Host/Pi process-loss and resume cycle were completed instead, as allowed by the
brief; the limitation is recorded below.

## 3. Shared contract implementation

`packages/session-protocol/src/runtime-contract.ts` implements contract version
`0.1` as production TypeScript and Zod validation:

- Tier 1 runtime IDs `pi | grok` and `terminal | acp` transport identity;
- runtime snapshot, state, capability, model, reasoning, and resume types;
- the complete v0.1 event envelope and event payload map;
- explicit `available | unavailable | conditional | unknown` capability
  defaults;
- snapshot and event parsers;
- stable event-ID and `(sessionKey, epoch, sequence)` deduplication keys;
- epoch-local ordering classification;
- bounded opaque IDs, text, arrays, timestamps, and a 32 KiB event limit;
- cross-field checks that keep `sessionKey` distinct from terminal identity and
  require snapshot identity to match its envelope.

`packages/session-protocol/src/state.ts` adds `grok-build-acp` as a harness kind
without changing existing Claude behavior. Focused tests reject malformed
runtime IDs, conflated identities, invalid resume state, wrong snapshot
envelopes, and invalid sequence transitions.

## 4. Runtime registry design

`packages/host-service/src/runtime/aa-runtime/registry.ts` is owned by the
existing Host Service. It keeps one latest authoritative snapshot and a bounded
256-event diagnostic window per runtime session. It:

- validates every ingress event before use;
- starts an incarnation only from `snapshot` sequence 1;
- accepts gapless same-epoch events and snapshot-led new epochs;
- deduplicates event IDs and positions;
- rejects stale events and quarantines gaps or invalid resume identities;
- indexes snapshots by session key, terminal, workspace, and runtime;
- marks affected snapshots offline on terminal process loss;
- models pending, confirmed, mismatched, and unconfirmed exact resume;
- emits cloned changes through the existing Host event bus and scoped tRPC
  query surface;
- strips `message.delta` text/data before retaining or publishing it.

The registry is deliberately in-memory. Durable Pi identity reuses the existing
`terminal_agent_bindings.agent_session_id` field through
`legacy-terminal-bridge.ts`; no schema migration was needed. The legacy bridge
also preserves existing Attach/Start/Stop/Failed behavior, while tool finish
never becomes legacy Stop.

Renderer reload re-queries the Host registry, so it does not lose a live
snapshot. Workspace event propagation uses the existing EventBus and
workspace-client connection, with workspace scope enforced by the Host tRPC
router.

## 5. Pi bridge v2 mapping

The generated Pi extension is now marked as bridge v2 and emits structured
events through the existing local notification transport. An epoch is minted
once per extension process and sequence begins at 1 and increments through a
serialized sender.

| Authoritative Pi source | Shared runtime event |
| --- | --- |
| `session_start` | Initial `snapshot`, then `session.started` |
| `agent_start` | `turn.started` / state `working` |
| `agent_settled` | `turn.settled` / state `idle` |
| `tool_execution_start` | `tool.started` with native `toolCallId` and name |
| `tool_execution_update` | `tool.progress` with the same `toolCallId` |
| `tool_execution_end` | `tool.finished` with the same ID and outcome |
| `model_select` | `model.changed` |
| `thinking_level_select` | `reasoning.changed` |
| `session_shutdown` | `session.offline` with resumability |

`agent_end` is not used as the settled boundary, and `tool.finished` does not
idle the worker. `ctx.sessionManager.getSessionId()` supplies the native Pi
UUID. Effective model and thinking level come from Pi runtime context. Since Pi
does not expose a durable native turn ID, `nativeTurnId` remains `null`.

Noninteractive helper invocations are excluded using verified UI/mode evidence
(`hasUI === false` and print/JSON modes). The bridge sends no prompts, message
bodies, environment, tool arguments, tool results, or credentials. Old v1
notifications remain accepted during the migration window, and extension
installation stays marker-based and idempotent.

## 6. Pi native session, model, reasoning, and tool evidence

The real disposable Pi run produced:

- native UUID `019fe73e-4e95-76b3-8c72-4a1f8c424246` in the Host snapshot and
  legacy binding;
- model provider/id `google/gemini-3.5-flash`, displayed as
  `Gemini 3.5 Flash`;
- effective reasoning `high`, displayed textually and mapped to the existing
  deterministic sparse-hair presentation;
- first epoch `80a27e89-8a4f-4441-8455-124991d08620`;
- a gapless sequence 1–11;
- two real bash tool IDs (`74912gbz`, `7avn8mh8`) correlated through their
  respective start/progress/finish events;
- `WORKING` after the first tool finished while the second tool/run continued;
- `IDLE` only after sequence 11 `turn.settled`.

The curated chronology is in
`runtime-foundation/phase-3b/pi-runtime-evidence.json`. Screenshots
`01-pi-working.png` and `02-pi-idle-after-renderer-reload.png` show only safe AA
chrome, model/reasoning labels, and lifecycle state; terminal transcript is not
included.

## 7. Pi resume behavior and failure semantics

Pi resume now registers an exact expected native UUID before the existing
terminal creation path executes. The existing preset definition launches
`pi --session <UUID>` in the original workspace. AA remains `starting` until
the new extension process sends sequence-1 identity evidence.

The real test intentionally ended only the exact Pi process correlated to the
disposable terminal. AA changed to `OFFLINE`, then the real Resume action
created terminal `39f880d9-029e-44d6-a875-312520ea4c28`. The resumed process
reported the same native UUID and a new epoch
`3e0dbb62-820f-4dc8-9a43-b7efcbeb56d6`. A follow-up marker check recovered
the prior conversation context and settled at sequence 4.

If the first resumed event is not a matching sequence-1 snapshot, the terminal
is quarantined and the expected session becomes `error /
resume_identity_mismatch`; no replacement conversation is accepted. If launch
or process confirmation fails, it becomes `error /
resume_identity_not_confirmed`. Unit tests cover both paths.

`03-pi-offline-resumable.png` and `04-pi-idle-after-exact-resume.png` provide
safe visual evidence. Full Electron restart isolation remains a limitation, not
a claimed pass.

## 8. Renderer migration and fallback behavior

`useAARuntimeSnapshots` performs one workspace-scoped Host query, then patches
the React Query cache from `aa-runtime:changed` events. Snapshots are indexed by
terminal with the latest observation winning.

The Worker Card, Task Folder, Terminal Frame, status presentation, and Reasoning
Hair now read in this order:

1. authoritative Tier 1 runtime snapshot;
2. existing terminal-agent binding;
3. launch/preset identity;
4. truthful local/unassigned fallback.

Model and reasoning render only when both an authoritative value and an
`available` read capability exist. Runtime `unknown` stays visibly unknown;
the UI does not manufacture offline/idle evidence. Task Folder settlement is
driven by `turn.settled`, never tool completion. Tier 2 employees retain their
existing `DISPATCHED` plus `UNTRACKED` semantics.

The real Electron regression used repository-standard CDP pointer/keyboard
input because Orca's macOS accessibility provider could not expose the Electron
window despite granted permissions. It verified Pi TUI focus/input,
Briefcase/Workspace navigation, Files/Changes/Review, route/back navigation,
1440×800 bounds, reduced motion, Superset CLI dispatch, and Renderer reload.
Task Folder was renamed with real pointer/key events, survived reload, and was
restored to its original title; the active terminal pane and route also
survived.

## 9. Grok ACP adapter status and authentication limitation

`createGrokAcpAdapterDescriptor()` lets the existing `AcpSessionManager` own
`grok agent --no-leader stdio` as harness `grok-build-acp`. The manager now
accepts either its bundled Claude adapter entry or an explicit external process
descriptor; the options are mutually exclusive. External executables do not
inherit Electron's Node mode, and Claude's default-permission-mode policy is
not applied to Grok.

The real Grok `initialize` succeeded and reported protocol 1, agent version
`0.2.87`, current model `grok-build`, an auth method, and advertised session
load. Real `session/new` then returned structured JSON-RPC error `-32000 /
Authentication required`. The adapter mapped that boundary to:

- `state: error`, `stateReason: authentication_required`;
- no native session or turn ID;
- model-read available only for the initialize model;
- session/lifecycle/tool/resume/cancellation support conditional on
  authentication;
- model write and reasoning read/write unknown;
- no raw authentication error data.

The sanitized snapshot was accepted by the shared registry, and a real manager
probe survived the structured auth error. No credentials were entered. Grok's
existing terminal-preset path remains the user-facing compatibility path; an
authenticated ACP turn is not claimed or enabled.

## 10. Security and privacy review

- All bridge and ACP observations pass bounded runtime validation before
  registry ingestion.
- Snapshot/envelope identity, runtime namespace, sequence, epoch, and resume
  invariants are cross-checked.
- The Pi bridge omits prompts, transcripts, message bodies, environment,
  arguments, results, and credentials by construction.
- The Host registry strips structured message text/data before retention or
  publication; a regression test plants sentinel transcript/tool data and
  proves it cannot be observed.
- The Grok mapper selects only verified initialize fields and discards runtime
  instance IDs, paths, unknown metadata, and raw authentication data.
- Registry reads and events are scoped to the requested workspace.
- Evidence JSON is hand-curated, screenshots exclude terminal content, and the
  final evidence/diff sensitive-information scan passed.
- Event retention is bounded to 256 events per session and individual event
  validation is bounded to 32 KiB.

## 11. Files changed

| Area | Files or directories | Purpose |
| --- | --- | --- |
| Shared contract | `packages/session-protocol/src/runtime-contract.ts`, tests, exports, harness state | Types, validation, order/dedup helpers, Grok harness identity |
| Host registry | `packages/host-service/src/runtime/aa-runtime/` | Snapshot/event registry, legacy Pi bridge, exact resume semantics |
| Host APIs/events | Host `app.ts`, event bus/types, `trpc/router/aa-runtime/`, notifications, context/router exports | Registry ownership, validated ingress, query and push propagation |
| Pi launch/bridge | Desktop Pi installer/template, notify hook/template/tests; Host agent router/tests | Bridge v2, native identity, exact resume registration |
| Renderer | AA runtime hook and focused AA Worker/Task/Terminal/Reasoning files plus workspace-event hook | Tier 1 snapshot priority and truthful presentation |
| Grok ACP | `adapter-descriptor.ts`, `grok-acp-adapter.ts`, tests, scoped `AcpSessionManager` changes | Existing-manager external process seam and unauthenticated capability mapping |
| Workspace client | event bus/types/exports and tests | `aa-runtime:changed` transport |
| Dependency metadata | Desktop `package.json`, root `bun.lock` | Direct shared contract dependency |
| Evidence/docs | This report, checkpoint, `runtime-foundation/phase-3b/` | Curated acceptance record |

No file under PTY daemon behavior, xterm byte transport, Git/worktree logic,
database schema/migrations, Tier 2 vendor hooks, or native chat was modified.

## 12. Automated and real verification

### Automated commands

| Command | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Passed; 2,909 installs checked, no changes |
| Shared contract + workspace event focused Bun tests | 10 passed, 0 failed |
| Host registry/router/event/notification/resume/Grok focused Bun tests | 51 passed, 0 failed |
| Desktop Pi bridge/wrapper/Renderer focused Bun tests | 142 passed, 0 failed |
| `bun test packages/host-service/test/integration/acp-sessions.e2e.test.ts` | 25 passed, 0 failed, including external ACP ownership |
| Session protocol `bun run typecheck` | Passed |
| Workspace client `bun run typecheck` | Passed |
| Host Service `bun run typecheck` | Passed |
| Desktop `bun run typecheck` | Passed, including generated icons/routes |
| Biome 2.4.2 over all 58 changed TS/TSX/CSS/JSON files | Passed, no diagnostics |
| Repository lint guards through `scripts/lint.sh` | Passed |
| `git diff --check` | Passed |
| Evidence/diff sensitive-information scan | Passed |

### Real verification

- Real Pi: every required item 1–11 passed except the explicitly isolated
  full-Electron-restart variant; exact Host/Pi process restart was passed.
- Real Grok: stdio initialize, version/model metadata, structured auth error,
  truthful capability snapshot, registry acceptance, and manager survival
  passed; authenticated behavior stopped at the missing user-owned login.
- Real AA UI: focus/input, navigation, Tier 2 launch semantics, file cabinet,
  reload, saved active pane, Task Folder rename persistence, 1440×800 bounds,
  and reduced motion passed.
- QA cleanup: disposable workspaces/worktrees/branches/terminals were removed,
  original Task Folder presentation was restored, and the dev stack was
  stopped.

Evidence index: `docs/aa/runtime-foundation/phase-3b/`.

## 13. Known limitations

1. The authoritative registry snapshot/event window is in Host memory. Existing
   binding storage durably preserves the Pi UUID, but a complete model,
   reasoning, and event snapshot is not reconstructed after a full Host/app
   restart until the runtime reports again.
2. A full Electron restart was not safely isolated because the repository
   `.env` selected the shared dev profile and unrelated Pi processes existed.
   Renderer reload and exact Pi process restart/resume were verified instead.
3. Pi bridge delivery is bounded and validated but not replayed. A missing
   same-epoch event causes quarantine; a new snapshot-led epoch can recover.
4. Pi exposes no durable native turn ID, so `nativeTurnId` remains `null`.
5. Pi structured messages, permission/questions, cancellation, model writes,
   and reasoning writes are not enabled by this phase.
6. Grok is unauthenticated. Session create/load, turn settlement, tools,
   permissions, cancellation, and resume remain conditional/unknown until a
   user-owned authenticated probe proves them.
7. Grok ACP is a Host adapter foundation, not yet the Employee Roster's active
   launch path; the existing terminal preset remains compatibility behavior.
8. Pre-existing development warnings remain: DockBadgeController set-state
   warnings, local fixture remote-fetch failure, and certificate handshake
   noise. None references a Phase 3B changed file or blocked tested behavior.

## 14. Recommended Phase 3C

Phase 3C should begin only after review of this checkpoint. The narrow next
runtime work is:

1. With explicit user-owned Grok authentication, behaviorally verify
   `session/new`, prompt start/settle, tool IDs, permission shape,
   cancellation, and exact `session/load` before upgrading any capability from
   conditional/unknown.
2. Feed those authenticated Grok observations through this registry and only
   then consider switching the Grok Employee action from compatibility terminal
   launch to the structured path, with a safe fallback.
3. Define adapter-owned snapshot resync/replay for event gaps and Host restart
   without adding a second daemon or changing PTY transport.
4. Re-run an isolated full Electron restart when a genuinely separate dev
   profile can be guaranteed, verifying Pi UUID reconstruction end to end.

This report does not start or implement Phase 3C.
