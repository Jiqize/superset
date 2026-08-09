# AA Pi Runtime v0.1 Checkpoint

## Status

Phase 3C is complete. This checkpoint freezes the daily-use Pi runtime product
path built on `AA-RUNTIME-CONTRACT-V0.1.md` and the Phase 3B Host-owned
foundation. It does not authorize Phase 3D.

## Stable product behavior

### Authority order

For a terminal pane, use evidence in this order:

1. matching Tier 1 Host runtime snapshot;
2. saved exact Pi resume candidate only when no snapshot exists;
3. legacy terminal-agent binding;
4. launch/preset identity;
5. recognized pane-title identity;
6. local/unassigned fallback.

A snapshot is authoritative even when it says `unknown`, `offline`, `error`,
resume mismatch, or resume not confirmed. Never replace contradictory runtime
evidence with an optimistic legacy state. Never infer idle from elapsed time,
terminal silence, tool completion, or TUI text. `turn.settled` is the idle
boundary.

### Model, reasoning, and Reasoning Hair

- Show exact effective model and reasoning only from a snapshot whose read
  capability is `available`.
- Keep the exact textual reasoning value whenever Reasoning Hair appears.
- Map only known real Pi values through the deterministic presentation helper.
- Unknown/unavailable/null/unrecognized reasoning has no guessed hair level;
  use the neutral worker cap.
- The launch picker catalog is not runtime authority.
- There are no model or reasoning write controls in this checkpoint.

### Exact resume

- A durable, resumable Pi candidate may show `OFFLINE / RESUMABLE` after a cold
  Host restart. It is not evidence of a live process.
- `RESUME PI SESSION` calls the existing exact resume path with the recorded
  native Pi UUID; do not select a recent session heuristically.
- Remain `STARTING` until a new epoch begins with a sequence-1 snapshot carrying
  the same native UUID.
- Mismatch is `RESUME IDENTITY MISMATCH` and is quarantined.
- No sequence-1 identity confirmation within 30 seconds is
  `RESUME NOT CONFIRMED`.
- Raw UUID, epoch, and sequence are not primary product labels.

### Runtime-health language

The stable primary labels are:

- `STARTING`
- `WORKING`
- `IDLE`
- `WAITING / PERMISSION`
- `WAITING / USER`
- `CANCELLING`
- `OFFLINE`
- `OFFLINE / RESUMABLE`
- `UNKNOWN`
- `ERROR`
- `RESUME IDENTITY MISMATCH`
- `RESUME NOT CONFIRMED`

Sanitized state reasons may appear in a tooltip/details affordance. Do not turn
this into a general observability dashboard.

## Restart and persistence boundary

Verified through a real isolated full restart:

- workspace, pane, changed-file state, and durable Pi binding restore;
- AA does not claim a live Pi session before new runtime evidence;
- the normal resume action restores the exact native conversation;
- the resumed process uses a new epoch beginning at sequence 1;
- prior harmless conversation context survives;
- Renderer reload reads the Host snapshot;
- terminal input and new rendering work after reload.

The Host registry remains in-memory. Model, reasoning, live state, and event
diagnostics are reconstructed from the next real Pi bridge snapshot; they are
not a new persistent task/transcript database.

## Isolated QA runbook

Use the disposable profile only with the normal local development dependencies.
In separate terminals:

```sh
bun run --cwd apps/api dev
bun run --cwd apps/electric-proxy dev
bun run --cwd apps/desktop qa:aa-runtime:start
```

Inspect or clean it with:

```sh
bun run --cwd apps/desktop qa:aa-runtime:status
bun run --cwd apps/desktop qa:aa-runtime:clean
```

`start` prepares the profile automatically. The default profile name is
`phase-3c`. Optional launcher flags are `--profile`, `--vite-port`,
`--notifications-port`, and `--cdp-port`.

Safety rules:

- the launcher must refuse occupied ports instead of attaching;
- stop the QA launcher before cleanup;
- cleanup must require the repository-scoped profile marker and matching name;
- delete disposable workspaces/worktrees through the existing product flow;
- never kill unrelated agent processes or redirect Superset worktree semantics.

## Host/runtime invariants

- The existing Host Service remains the only AA runtime registry owner.
- Ingress remains validated, bounded, workspace-scoped, and privacy-minimized.
- A sequence gap quarantines the event and makes current evidence `unknown`.
- A new epoch must begin with a snapshot at sequence 1.
- Structured message bodies, prompts, transcripts, tool arguments/results,
  credentials, and environment data do not enter the minimum registry.
- Pi TUI/xterm remains the primary conversation surface.
- PTY, xterm transport, Git/worktree behavior, and database schema remain
  unchanged.

## Compatibility and Grok boundary

- Codex, Claude Code, OpenCode, Kimi, Superset CLI, and other Tier 2 CLIs keep
  their existing launch paths and truthful `DISPATCHED + UNTRACKED` semantics.
- Do not add vendor-specific Tier 2 lifecycle tracking under this checkpoint.
- Grok Build still initializes through the Phase 3B ACP foundation but is
  `authentication_required` on the verified machine.
- Do not enter credentials or claim Grok turns/tools/resume until a user-owned
  login is present and the narrowly scoped authenticated contract test passes.

## Open limitations

- Grok authenticated behavior is not verified.
- The isolated profile depends on normal local API/Electric/Docker services.
- Worktree storage remains in the existing Superset root by design.
- On the verified cold-resume path, Renderer reload left the restored xterm
  canvas blank until new terminal input; input and subsequent rendering worked.
  Any replay investigation needs its own terminal-layer scope.
- Repository-wide lint has two unchanged design JSON formatting findings;
  Phase 3C targeted lint is green.

## Evidence and handoff

- Detailed result:
  `docs/aa/PHASE-3C-PI-RUNTIME-PRODUCTIZATION-REPORT.md`
- Normative runtime contract: `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
- Safe evidence: `docs/aa/runtime-foundation/phase-3c/`

Future sessions should read the runtime contract, the Phase 3B checkpoint, this
checkpoint, and the Phase 3C report before changing Tier 1 runtime behavior.
Do not begin Phase 3D without a new explicit brief.
