# Phase 3C — Pi Runtime Productization Report

## 1. Executive verdict

Phase 3C is complete. AA Office now treats the Host-owned Pi runtime snapshot
as the normal product authority, presents exact runtime model and reasoning,
drives Reasoning Hair only from real reasoning evidence, and exposes exact Pi
conversation resume as a normal terminal-first action.

A disposable repository-supported profile made a real full Electron, Host, and
Pi-process restart safe. The acceptance proved that AA first shows the restored
conversation as `OFFLINE / RESUMABLE`, resumes only the recorded Pi
conversation, requires the same native identity in a new sequence-1 epoch, and
preserves conversation context. Renderer reload, terminal input, Files,
Changes, Review, diff, route navigation, 1440×800 layout, and Tier 2
`DISPATCHED + UNTRACKED` behavior also passed.

Grok Build remains truthfully blocked at `authentication_required`; no
credentials were entered and no speculative Grok product behavior was added.
No PTY daemon, xterm transport, Git/worktree semantics, database schema, Tier 2
vendor lifecycle, native chat, write control, or orchestration code changed.

## 2. Exact baseline, final commit, and environment

- Branch: `aa-spike`
- Required baseline confirmed before implementation:
  `ea53df214cead5972941fd63b73421ef01c6f903`
- `origin/aa-spike` and local `HEAD` both pointed to that commit after the
  required fast-forward-only pull.
- Final Phase 3C code, report, checkpoint, and evidence are carried by the
  report-bearing commit pushed to `origin/aa-spike`; after checkout,
  `git rev-parse HEAD` is its exact identifier. The push handoff also records
  that SHA explicitly.

| Environment | Verified value |
| --- | --- |
| Host | macOS 26.4 (`25E246`), Apple Silicon arm64 |
| Bun | `1.3.14` |
| Electron | `41.10.3` |
| Pi CLI | `0.82.1` |
| Grok Build | `0.2.87` (`0ae0bf47e53`) |
| Logical QA viewport | 1440×800 |
| QA profile | Disposable `phase-3c` profile |
| Pi workspace | Disposable `pi-runtime-restart`, removed after QA |
| Grok authentication | Not authenticated; no credentials entered |

The existing local Docker development dependencies were already running. The
test created only disposable projects/workspaces and used a deliberately
harmless marker file as its Pi task.

## 3. Isolated QA profile design

`apps/desktop/scripts/aa-runtime-qa-profile.ts` adds four supported commands:

```sh
bun run --cwd apps/desktop qa:aa-runtime:prepare
bun run --cwd apps/desktop qa:aa-runtime:start
bun run --cwd apps/desktop qa:aa-runtime:status
bun run --cwd apps/desktop qa:aa-runtime:clean
```

The launcher creates `.superset/qa-profiles/phase-3c/` inside the repository
and derives all paths from the repository root. It isolates:

- `SUPERSET_HOME_DIR`, including the local Host database and sockets;
- Electron `userData` and `sessionData`;
- the desktop notification listener (`13306`);
- the development-only CDP listener (`19323`);
- the workspace name used by the desktop build.

The Renderer uses the repository-supported port `3005`; the launcher refuses
to start if it or another QA port is occupied, so it never attaches to another
desktop. Electric uses the local development proxy directly at
`http://localhost:3012`. The tested three-terminal startup was:

```sh
bun run --cwd apps/api dev
bun run --cwd apps/electric-proxy dev
bun run --cwd apps/desktop qa:aa-runtime:start
```

The profile marker and PID file are owner-only. Cleanup refuses paths outside
`.superset/qa-profiles/`, refuses an unmarked or mismatched profile, and refuses
to delete a profile whose launcher is still live. The launcher forwards only
its own termination signals. It does not discover, attach to, or kill unrelated
terminals or agents, and it starts the existing desktop/Host architecture.

The first probe used a separate Renderer port, but the API's repository dotenv
configuration accepts the standard desktop origin. The supported default was
therefore corrected to `3005` and covered by a regression test; port occupancy
still fails closed. No product runtime behavior depends on the QA profile.

## 4. Pi authority and fallback precedence

For an active terminal, AA now resolves presentation evidence in this order:

1. matching Tier 1 runtime snapshot;
2. saved exact Pi resume candidate, only when no runtime snapshot exists;
3. legacy terminal-agent binding;
4. launch/preset identity;
5. recognized legacy pane title;
6. local/unassigned fallback.

A matching runtime snapshot always wins, including `unknown`, `offline`,
`error`, resume mismatch, and resume-not-confirmed states. AA never replaces a
contradictory authoritative snapshot with an optimistic legacy `Stop`/idle
binding. The saved candidate gives a cold-restarted UI only enough evidence to
say `OFFLINE / RESUMABLE`; it does not claim a live runtime.

At Host ingress, a gap in the active epoch immediately changes the affected
snapshot to `unknown / event_gap_quarantined`. A non-snapshot first event in a
new epoch similarly becomes `unknown / new_epoch_without_snapshot`. The event
is still quarantined. Existing snapshot-led, sequence-1 epoch acceptance and
gapless ordering remain unchanged.

Focused tests cover runtime-over-binding precedence, explicit unknown/error,
cold-restart resume-candidate fallback, quarantined gaps, and new-epoch rules.
No elapsed-time, terminal-silence, tool-finish, or TUI-text inference was added;
`turn.settled` remains the idle boundary.

## 5. Model, reasoning, and Reasoning Hair

The compact Pi Worker card reads model and reasoning only when the authoritative
runtime snapshot advertises the corresponding read capability as `available`.

- `MODEL` displays the exact effective runtime model ID. Its tooltip retains
  the available display/provider detail without treating picker metadata as
  authority.
- `REASONING` displays the exact effective runtime value.
- The existing deterministic Pi reasoning presentation maps that exact value
  to Reasoning Hair.
- An absent, unavailable, unknown, null, or unrecognized reasoning value shows
  no guessed hair level; the avatar uses a neutral office cap instead.

The real run displayed model `gemini-3.5-flash`, reasoning `high`, and the
corresponding sparse-hair presentation. Text remained visible beside the
metaphor. No model or reasoning write control was introduced.

## 6. Resume UI and identity confirmation

An interrupted, resumable Pi pane now shows an AA-styled
`RESUME PI SESSION` action with `SAVED PI CONVERSATION`, employee label, and
safe interruption time. Raw session UUID, epoch, and sequence are not primary
UI text.

The button reuses the existing `agents.run` exact-resume path and supplies the
recorded native Pi UUID. It has an explicit accessible name, normal keyboard
button behavior, visible focus styling, and motion-free pending feedback. The
Host records the exact expected identity before launch and the UI remains
truthfully `STARTING` until runtime evidence arrives.

Success requires a sequence-1 snapshot from a new epoch containing the same
native Pi UUID. A different UUID remains `ERROR / RESUME IDENTITY MISMATCH`.
If a launched process remains alive but sends no confirming snapshot within 30
seconds, the Host expires the expectation as
`ERROR / RESUME NOT CONFIRMED`. A late or mismatched stream cannot silently
become a replacement conversation. No recent-session heuristic is used.

## 7. Full Electron/Host restart result

The full isolated acceptance passed:

1. Through real UI interaction, a disposable Git project and Pi workspace were
   created and opened.
2. A real Pi turn created the harmless marker file. The Host saw sequence 1
   snapshot, session start, turn start, correlated tool events, and
   `turn.settled` at sequence 10.
3. AA showed `WORKING`, the exact model/reasoning, then `IDLE` only after
   settlement.
4. The isolated Electron, Host, and all profile-owned terminal children were
   fully stopped. No QA listener remained.
5. The same profile was cold-started. The known project, workspace, pane,
   changed file, and durable Pi binding restored, while AA correctly showed
   `OFFLINE / RESUMABLE` before live runtime evidence.
6. The normal resume action showed `STARTING` and reopened the real Pi TUI.
7. The resumed sequence-1 snapshot matched the pre-restart native-session
   fingerprint `2df5034831c6` and used a new epoch (fingerprints
   `74c56a880343` → `bc8b06c6d071`).
8. A harmless follow-up recovered the prior marker context without reading a
   file or invoking a tool.
9. A Renderer reload retained the Host snapshot and route. New keyboard input
   reached Pi and the follow-up settled normally.
10. Files, Changes, Review, real diff, route navigation, and Tier 2 Codex
    dispatch were exercised.
11. The exact workspace/worktree/branch, terminals, projects, profile, and QA
    listeners were removed.

The existing worktree architecture still chooses the normal Superset worktree
root; Phase 3C did not redirect or modify it. Only the exact disposable
worktree was deleted through the existing UI flow. The sanitized event record
is `runtime-foundation/phase-3c/pi-restart-runtime-evidence.json`.

## 8. Runtime-health presentation

`aaRuntimeHealth.ts` provides one stable presentation mapping shared by the Pi
Worker and terminal frame:

| Runtime evidence | Primary product label | Tone/avatar |
| --- | --- | --- |
| `starting` | `STARTING` | amber / waiting |
| `working` | `WORKING` | amber / working |
| `idle` | `IDLE` | restrained green / idle |
| `waiting_permission` | `WAITING / PERMISSION` | attention / waiting |
| `waiting_user` | `WAITING / USER` | attention / waiting |
| `cancelling` | `CANCELLING` | attention / waiting |
| `offline`, resumable | `OFFLINE / RESUMABLE` | attention / offline |
| `offline` or `ended` | `OFFLINE` | muted / offline |
| `unknown` | `UNKNOWN` | attention / offline |
| `error` | `ERROR` | restrained red / error |
| resume mismatch | `RESUME IDENTITY MISMATCH` | restrained red / error |
| missing confirmation | `RESUME NOT CONFIRMED` | restrained red / error |

The underlying sanitized `stateReason` is available in the existing title
tooltip as a short diagnostic. UUID, epoch, and sequence are not exposed as
primary labels, and no observability dashboard was added.

## 9. Workspace-selection dogfood result

The Phase 2.2 MEDIUM finding was re-tested with two real projects present. The
`New workspace` control was invoked from the runtime project's Briefcase row;
the composer explicitly preselected that originating project, not the
previously used project. The issue was not reproducible, so no workspace-create
code or flow state was changed.

## 10. Grok authentication boundary

The smallest real probe reused the Phase 3B ACP descriptor and existing
`AcpSessionManager`:

- `grok 0.2.87 (0ae0bf47e53)` started and `initialize` succeeded at ACP
  protocol 1;
- `session/new` returned the structured `authentication_required` boundary;
- no pre-existing credentials were available;
- no credentials were entered;
- no authenticated prompt, tool, permission, cancellation, or resume behavior
  was attempted;
- no Grok product UI changed.

The next acceptance is explicit: after the user logs in through a user-owned
Grok flow, repeat initialize and `session/new`, then run one narrowly scoped
harmless turn through the existing ACP manager and validate its events and
capabilities against `AA-RUNTIME-CONTRACT-V0.1.md`.

## 11. Automated and real verification

### Automated commands

| Command or suite | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Passed; 2,909 installs checked, no changes |
| Shared contract + workspace event focused tests | 10 passed, 0 failed |
| Host registry/router/notification/resume/Grok tests | 50 passed, 0 failed |
| Desktop Pi bridge/wrapper/AA/profile tests | 189 passed, 0 failed |
| ACP integration suite | 25 passed, 0 failed |
| Session protocol TypeScript | Passed |
| Workspace client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Desktop TypeScript, generated icons/routes included | Passed |
| Biome 2.4.2 over touched TypeScript/TSX/CSS/JSON | Passed, no diagnostics |
| `git diff --check` | Passed |
| Evidence/diff sensitive-information scan | Passed |

`bun run lint` was also attempted. Its code checks completed, but the
repository-wide format gate still reports only two baseline files not modified
by Phase 3C: `docs/aa/design/assets-manifest.json` and
`docs/aa/design/tokens.json`. Targeted lint/format for every Phase 3C source and
JSON evidence file passed. The unrelated design files were intentionally not
reformatted into this checkpoint.

### Real acceptance

- Real Pi authoritative `WORKING → IDLE`: passed.
- Real model, reasoning, and runtime-backed hair: passed.
- Tool finish without premature settlement: passed.
- Full isolated Electron/Host/Pi-process quit and cold restart: passed.
- Restored metadata without false live state: passed.
- Normal exact-resume action, same native identity, new epoch: passed.
- Prior conversation context: passed with a harmless marker.
- Renderer reload and subsequent terminal keyboard input: passed.
- 1440×800 layout: passed.
- Files, Changes, Review, and diff: passed.
- Briefcase/workspace navigation and originating-project preselection: passed.
- Tier 2 Codex dispatch remained `UNTRACKED`: passed.
- Grok initialize/auth boundary: passed; authenticated work correctly stopped.
- Post-test cleanup and released listeners: passed.

Real UI actions used pointer and keyboard interaction. Orca could see the
Electron window but macOS did not expose its accessibility tree, so the tested
fallback was Chromium's debugging protocol with real pointer/key events; no
DOM `.click()` shortcut was used.

## 12. Security and privacy review

- Runtime-native IDs and epochs in evidence are truncated SHA-256 fingerprints,
  not raw values.
- No prompt, transcript, message body, environment, credential, tool argument,
  or tool result was added to the registry, report, or JSON evidence.
- Screenshots contain only AA chrome and the deliberately harmless marker
  interaction permitted by the brief.
- Host validation, workspace-scoped reads/events, bounded retention, and
  structured-message redaction remain unchanged.
- Resume uses only the existing durable native UUID field and does not log it as
  primary UI text.
- QA state directories are owner-only; marker/PID files are created with mode
  `0600` and cleanup is marker-, root-, and live-PID-guarded.
- Grok raw authentication payloads and credentials were neither captured nor
  entered.
- No xterm/TUI scraping is used as runtime truth.

## 13. Files changed

| Area | Files | Purpose |
| --- | --- | --- |
| QA profile | `apps/desktop/scripts/aa-runtime-qa-profile*.ts`, desktop `package.json`, `electron.vite.config.ts`, main `index.ts` | Isolated state/userData/listeners, guarded lifecycle commands |
| Host runtime | `packages/host-service/src/runtime/aa-runtime/registry.ts` and test; agent router | Quarantine-to-unknown behavior and 30-second exact-resume confirmation timeout |
| Worker authority | `AAActiveWorkerCard/`, `AAAgentStatus/`, `AATaskFolder/`, `AATerminalFrame/` | Snapshot precedence, durable cold-restart fallback, shared health language |
| Model/reasoning | `AAHairState/` and Worker presentation | Exact runtime values and neutral no-evidence cap |
| Resume product UI | new `AAResumeSessionAction/`, existing `TerminalAgentResumeBanner`, AA exports/CSS | Discoverable exact Pi resume without raw IDs |
| Evidence | `docs/aa/runtime-foundation/phase-3c/` | Sanitized JSON summaries and nine safe screenshots |
| Documentation | this report and `AA-PI-RUNTIME-V0.1-CHECKPOINT.md` | Phase result and stable handoff boundary |

No RED-area file under PTY daemon behavior, xterm byte transport, Git/worktree
behavior, database schema/migrations, Tier 2 hooks, native chat, or
orchestration changed.

## 14. Known limitations

1. Grok is unauthenticated. Only initialize metadata and the truthful auth
   boundary are verified.
2. The Host runtime registry remains intentionally in-memory. After a cold
   restart, the durable binding supports `OFFLINE / RESUMABLE`; model,
   reasoning, and live state return only after a new Pi snapshot.
3. After Renderer reload in the cold-resumed session, the restored xterm canvas
   was blank until fresh terminal input arrived. Focus/input and subsequent
   rendering worked. Phase 3C did not modify xterm replay or transport.
4. The QA profile isolates app/Host state and Electron data, but deliberately
   preserves Superset's existing worktree-root architecture. Disposable
   worktree cleanup remains part of the acceptance runbook.
5. The profile expects the normal local API, Electric proxy, and Docker-backed
   dependencies; it is not a second all-in-one service stack.
6. Known development warnings remained: a DockBadge render-time warning, a
   controlled/uncontrolled Select warning, and an expected background-fetch
   failure for the disposable repository with no remote. No new blocking
   console error was observed.
7. Repository-wide lint remains red only on the two unrelated pre-existing
   design-token JSON format findings recorded above.

## 15. Recommended next phase

Do not expand runtime behavior until this checkpoint is accepted. A future
Phase 3D brief should prioritize:

1. a user-owned Grok login followed by the single authenticated ACP acceptance
   defined above;
2. an explicit decision on whether the xterm replay observation warrants a
   separately scoped terminal-layer investigation;
3. small diagnostic/detail affordances for runtime failures, still without raw
   identity as primary UI or a generic observability surface;
4. only after authenticated evidence, a deliberate decision about Grok product
   activation under the existing contract.

No Phase 3D work was started.
