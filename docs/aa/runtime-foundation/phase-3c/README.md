# Phase 3C Safe Evidence

This directory contains curated evidence for the isolated AA Pi runtime
productization acceptance. Runtime-native IDs and epochs are represented only
by truncated SHA-256 fingerprints. No credentials, environment dumps, prompts,
tool arguments/results, or user transcript are retained.

The screenshots contain only AA chrome and a deliberately harmless Phase 3C
marker used to prove real Pi context continuity:

1. `01-pi-working-model-reasoning.png` — authoritative `WORKING`, model, and
   reasoning presentation during the harmless marker turn.
2. `02-pi-idle-settled-changes.png` — `IDLE` only after `turn.settled`, with the
   real changed-file count.
3. `03-full-restart-offline-resumable.png` — cold-restarted app before any live
   runtime evidence.
4. `04-resume-starting.png` — normal exact-resume action in truthful `STARTING`.
5. `05-resumed-context-confirmed.png` — the same Pi conversation after a new
   epoch confirmed prior marker context.
6. `06-renderer-reload-1440x800.png` — exact 1440×800 Renderer-reload layout.
7. `07-reload-input-active.png` — terminal input and live rendering after reload.
8. `08-file-change-diff.png` — real Files/Changes/Review regression and diff.
9. `09-tier2-codex-untracked.png` — compatibility runtime remains `DISPATCHED`
   plus `UNTRACKED`.

Machine-readable summaries:

- `pi-restart-runtime-evidence.json`
- `grok-auth-boundary-evidence.json`
- `ui-acceptance-evidence.json`

All disposable projects, workspaces, worktrees, branches, terminal processes,
profile data, and QA listeners were removed after capture.
