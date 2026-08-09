# AA Runtime Foundation v0.1 Checkpoint

## Status

Phase 3B is complete. This checkpoint freezes the first production slice of
`AA-RUNTIME-CONTRACT-V0.1.md`. It is the starting point for future runtime work;
it does not authorize Phase 3C.

## Stable and authoritative now

### Shared contract

- Contract version `0.1` is implemented in `@superset/session-protocol` with
  runtime validation.
- `sessionKey`, transport/terminal identity, runtime-native identity, epoch,
  sequence, state, capabilities, model, reasoning, and resume state have one
  shared representation.
- Runtime IDs are currently Tier 1 `pi | grok`; unknown support is explicit.
- A new adapter process/incarnation uses a new epoch. Sequence is gapless only
  inside that epoch.

### Host authority

- The existing Host Service owns the runtime registry; there is no AA daemon.
- Host ingress validates identity and payloads, deduplicates repeats,
  quarantines gaps/stale/resume mismatches, and publishes workspace-scoped
  changes.
- Renderer reload reads the latest live Host snapshot.
- Event diagnostics are bounded, cloned, and stripped of structured message
  bodies before retention/publication.
- Existing terminal-agent binding storage remains the durable location for a
  Pi native session UUID; no schema migration was added.

### Pi Tier 1

The following are authoritative when supplied by the Pi bridge v2 snapshot or
events:

- native Pi session UUID;
- live/offline/error state and working-to-idle settlement;
- effective model provider/id/display label;
- effective reasoning value and its explicit text presentation;
- native tool-call ID, name, progress correlation, and outcome;
- exact UUID resume expectation and confirmation;
- new epoch after a resumed process starts.

`agent_settled` is the idle boundary. `agent_end` and `tool.finished` are not.
`nativeTurnId` is `null` because Pi does not expose a durable native turn ID.

### Grok Tier 1 foundation

The existing ACP manager can own an explicit Grok Build stdio process. On the
verified unauthenticated runtime, initialize version/model metadata and the
authentication prerequisite are authoritative. No live Grok session, turn,
tool, permission, cancellation, or resume is authoritative yet.

## Compatibility-only behavior

- Grok's Employee Roster action still uses its current terminal preset until
  an authenticated ACP path is behaviorally proven and deliberately enabled.
- Codex, Claude Code, OpenCode, Kimi, Superset CLI, and other Tier 2 CLIs keep
  their existing terminal-preset paths.
- Tier 2 dispatch receipts are launch acknowledgements, not runtime tracking;
  `DISPATCHED` plus `UNTRACKED` remains the truthful presentation.
- The old Pi lifecycle/binding surface remains a fallback and compatibility
  bridge during migration. It is not preferred over a Tier 1 snapshot.
- Terminal/TUI output remains the conversation and tool-detail surface. AA has
  no native structured chat, model/reason write, permission, cancellation, or
  orchestration UI.

## Fresh-session read order

For a newly opened workspace or Renderer reload, AA reads runtime state in this
order:

1. Resolve the workspace's existing Host Service URL.
2. Query `aaRuntime.list({ workspaceId })` for current Tier 1 snapshots.
3. Subscribe to workspace-scoped `aa-runtime:changed` events and replace a
   session snapshot only with its newest authoritative observation.
4. For each active terminal pane, select the latest snapshot whose transport
   terminal ID matches the pane.
5. If a Tier 1 snapshot exists, use it for identity, state, model, reasoning,
   Task Folder state, and Worker presentation, gated by its capabilities.
6. Otherwise read the existing terminal-agent binding.
7. Otherwise use launch/preset identity and show `UNTRACKED`.
8. Otherwise show truthful local/unassigned state.

For a fresh Pi process, the adapter-side order is:

1. Pi extension process mints one epoch.
2. `session_start` reads the runtime-reported UUID, model, and reasoning.
3. It sends snapshot sequence 1, then `session.started` sequence 2.
4. Host validates and registers the snapshot before Renderer presentation.
5. Subsequent turn/tool/model/reasoning events increment sequence gaplessly.

For Pi resume, Host records the exact expected UUID before launching
`pi --session <UUID>` and accepts the new epoch only after Pi reports that same
UUID in a sequence-1 snapshot.

## Persistence boundary

- Renderer reload: supported by the Host registry and verified.
- Pi process restart: exact UUID and conversation resume supported and
  verified; new epoch required.
- Full Host/Electron restart: Pi UUID persists in the existing binding, but the
  complete snapshot is reconstructed only after Pi reports again. A safely
  isolated full-app test remains outstanding.
- Runtime events and model/reasoning snapshots are not a new durable task or
  transcript database.

## Security boundary

Do not add prompts, transcripts, message bodies, tool arguments/results,
credentials, environment dumps, arbitrary files, or raw authentication data to
the registry or evidence. Keep inbound validation and workspace scoping. Do not
derive runtime truth by scraping xterm output.

## Evidence and handoff

- Detailed result: `docs/aa/PHASE-3B-SHARED-RUNTIME-REPORT.md`
- Normative contract: `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- Curated evidence: `docs/aa/runtime-foundation/phase-3b/`

Future sessions should read the contract, this checkpoint, and the Phase 3B
report before changing Tier 1 runtime code. Phase 3C must not begin without a
new explicit brief.
