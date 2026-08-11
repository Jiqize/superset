# RC blocker — clean Pi quit retained as resumable

## Observation

During the Phase 3M isolated dogfood, a real Pi task was ended with Pi's
visible `/quit` command. Pi emitted `session_shutdown` with the existing bridge
mapping `session.offline(resumable: true)`. The terminal-agent binding retained
only the last turn-level `Stop` event. On the next complete Electron/Host
restart, the cold terminal exit was therefore classified as an interrupted
terminal and produced a saved resume candidate.

Sanitized evidence before restart is recorded in
`runtime-before-restart.json`: the task had an offline runtime snapshot, a
resume-capable snapshot flag, and no durable resume candidate. After restart,
the UI truthfully projected the newly created candidate as `RESUMABLE`, which
violated the Phase 3M acceptance requirement that an explicit clean Pi end
remain session-unavailable and not become saved.

## Classification

`RC BLOCKER`

This is not a presentation-only ambiguity: the bridge omitted Pi's
authoritative `quit` reason even though `SessionShutdownEvent.reason`
distinguishes an interactive quit from session replacement. Renderer copy or
heuristics cannot safely repair that missing lifecycle fact.

## Narrow authorized correction

Change only the managed Pi bridge's `session_shutdown` mapping:

- `reason === "quit"` emits Runtime Contract `session.ended` with an explicit
  reason; the existing legacy bridge records the matching clean `Detached`;
- replacement reasons (`reload`, `new`, `resume`, `fork`) remain
  `session.offline(resumable: true)`;
- the existing terminal death-gasp rule remains authoritative for signal/PTY
  loss and upgrades a near-simultaneous detach to `terminal-exited`.

No PTY, Host persistence, resume semantics, database schema, terminal
transport, or Git/worktree code is changed.
