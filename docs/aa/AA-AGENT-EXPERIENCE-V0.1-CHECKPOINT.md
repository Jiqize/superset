# AA Agent Experience v0.1 Checkpoint

## Status

Phase 3D is complete. This checkpoint freezes the first user-facing employee
experience built on `AA-RUNTIME-CONTRACT-V0.1.md`, the Phase 3B Host foundation,
and the Phase 3C exact Pi product path. It does not authorize Phase 3E.

## Stable authority rules

For an active terminal, retain this evidence order:

1. matching Tier 1 Host runtime snapshot;
2. saved exact Pi resume candidate when no snapshot exists;
3. legacy terminal-agent binding;
4. launch/preset identity;
5. recognized legacy pane-title identity;
6. local/unassigned fallback.

A snapshot stays authoritative when it says `unknown`, `offline`, `error`, or
resume failure. Never infer runtime state/model/reasoning/capabilities from
terminal text, elapsed time, launch preference, or a Tier 2 process.

The Renderer maintains two projections of the same Host query:

- latest snapshot by terminal for pane presentation;
- latest snapshot by Tier 1 runtime for capability-aware roster presentation,
  including terminal-less Grok ACP evidence.

Do not create a second registry or move runtime ownership into Renderer.

## Worker Card v2

The compact Worker Card may present:

- employee identity;
- runtime and transport;
- evidence authority;
- stable runtime-health state;
- effective model and reasoning when their read capabilities are available;
- exact-resume availability for offline Pi.

Stable authority labels are:

- `RUNTIME VERIFIED` — current authoritative Tier 1 snapshot;
- `SAVED SESSION` — durable Pi candidate, not a live process;
- `LIFECYCLE BINDING` — legacy tracked fallback;
- `UNTRACKED` — Tier 2 launch/preset evidence;
- `NO ACTIVE EVIDENCE` / `UNASSIGNED` — no worker claim.

Tier 2 presentation remains `COMPATIBILITY CLI · TERMINAL PRESET · UNTRACKED`.

## Reasoning Hair

- Render hair only from an exact recognized runtime reasoning value.
- Always show the explicit textual reasoning value with the metaphor.
- Show model-specific available values only when the runtime supplies them.
- Unknown/null/unavailable/unrecognized reasoning uses the neutral cap.
- Launch preferences are not runtime evidence.
- No reasoning or model write controls exist in this checkpoint.

## Employee File

`AAEmployeeProfile` is a presentation-only popover opened by a secondary
employee-file button. The primary roster tile continues to launch the existing
preset.

The profile may show runtime, transport, status, effective model/reasoning,
resume availability, and the negotiated capability support matrix. Capability
reasons may appear as detail text/tooltips. It must not expose raw runtime
identity, epoch/sequence, prompt/transcript bodies, productivity scores,
intelligence rankings, or invented status.

## Runtime-health and resume language

Continue using the shared Phase 3C health mapping, including:

- `STARTING`
- `WORKING`
- `WAITING / PERMISSION`
- `WAITING / USER`
- `IDLE`
- `OFFLINE`
- `OFFLINE / RESUMABLE`
- `UNKNOWN`
- `ERROR`
- `RESUME IDENTITY MISMATCH`
- `RESUME NOT CONFIRMED`

A cold saved candidate may claim only `OFFLINE / RESUMABLE` and
`RESUME AVAILABLE`. The existing normal resume action must confirm the exact
native Pi identity in a new sequence-1 epoch. Never silently create a
replacement conversation.

## Pi, Grok, and compatibility boundary

- Pi remains the primary Tier 1 product experience and the real Pi TUI remains
  the primary conversation surface.
- For an authoritative Grok `authentication_required` snapshot, show
  `GROK BUILD`, `AUTHENTICATION REQUIRED`, and
  `Capabilities unavailable until login.`
- With no Grok snapshot, show `NO LIVE RUNTIME`; do not present a historic
  probe as current state.
- Show Grok capabilities only after runtime negotiation verifies them.
- Codex, Claude, OpenCode, Copilot, Mistral Vibe, Kimi, Superset CLI, and other
  compatibility CLIs retain existing launch behavior and
  `DISPATCHED + UNTRACKED` semantics.
- Do not add vendor-specific Tier 2 lifecycle tracking.

## Verified acceptance

A real isolated Pi acceptance verified:

- authoritative work followed by settlement-driven idle;
- effective `Gemini 3.5 Flash` / `gemini-3.5-flash` model and `high` reasoning;
- real Files/Changes count;
- full Electron/Host/Pi restart;
- cold saved-session presentation;
- exact same-conversation resume in a new epoch;
- prior harmless context after resume;
- Renderer reload and subsequent terminal input;
- 1440×800 layout;
- real Codex dispatch with unchanged `UNTRACKED` presentation.

All relevant Runtime Contract, Host registry/router, Pi bridge, AA Renderer,
TypeScript, and targeted Biome checks pass. Repository-wide lint has only the
two unchanged design JSON format findings documented in the Phase 3D report.

## Privacy and architecture invariants

- The Host Service remains the only runtime registry owner.
- Runtime ingress remains validated, bounded, workspace-scoped, and
  privacy-minimized.
- Do not persist prompt/transcript bodies, tool arguments/results, credentials,
  or environment data in the minimum registry or employee UI.
- PTY daemon, xterm transport, Git/worktree behavior, database schema, native
  chat, write controls, permissions/cancellation UI, and orchestration remain
  outside this checkpoint.

## Open limitations

- Grok authenticated behavior is not verified.
- Pi did not supply a model-specific reasoning-values list in the accepted run.
- The Host registry is intentionally in-memory; cold-start model/reasoning/live
  capability detail returns only after runtime reattachment.
- Employee Files are currently scoped to the workspace roster and active
  Worker Card.
- Repository-wide lint retains two unrelated baseline JSON format findings.

## Evidence and next-session reading order

- Normative contract: `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- Runtime foundation: `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
- Pi product checkpoint: `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
- Detailed Phase 3D result:
  `docs/aa/PHASE-3D-TIER1-AGENT-EXPERIENCE-REPORT.md`
- Safe evidence: `docs/aa/runtime-foundation/phase-3d/`

Future work must receive a new explicit brief. Do not begin Phase 3E from this
checkpoint alone.
