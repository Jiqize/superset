# Phase 3E Safe Evidence

This directory contains curated evidence for the isolated AA Agent Workspace
workflow acceptance. Screenshots use a 1440×800 logical viewport and contain
only a disposable Git project, deliberately harmless marker files, and a
non-secret resume token. No credential, environment dump, production source,
or raw runtime identity is retained.

## Screenshots

1. `01-pi-task-folder-runtime-output.png` — Task Folder 2.0 shows the explicit
   title, Pi identity, runtime authority, model, reasoning, latest action, and
   one real changed file.
2. `02-file-cabinet-diff-output.png` — the real Pi output is open in the
   existing Changes/Diff surface.
3. `03-file-cabinet-review-state.png` — Review retains its existing behavior
   and truthfully reports that the disposable repository has no pull request.
4. `04-codex-task-folder-dispatched-untracked.png` — manual handoff carries the
   explicit Task Folder title to Codex while the compatibility runtime remains
   `UNTRACKED`.
5. `05-codex-review-output.png` — Codex reviews the Pi file and creates a
   second harmless output; File Cabinet and the status bar both show two real
   changes.
6. `06-return-to-pi-workflow.png` — returning to the original Pi terminal
   restores authoritative Pi model/reasoning/lifecycle presentation beside
   both outputs.
7. `07-pi-resume-candidate-task-folder.png` — after a full isolated restart,
   the Task Folder title remains present while Pi is explicitly
   `OFFLINE / RESUMABLE`.
8. `08-pi-exact-resume-task-folder-preserved.png` — the normal exact-resume
   action restores the authoritative Pi runtime without replacing the
   user-edited Task Folder title.
9. `09-pi-resumed-context-confirmed.png` — the resumed conversation recalls
   the harmless token, confirming context continuity.
10. `10-pi-employee-profile.png` — the first-class Pi Employee Profile shows
    real runtime/transport/model/reasoning and negotiated capability support.

## Machine-readable evidence

`workflow-acceptance-evidence.json` records the safe workflow projection and
the exact-resume comparison. Native conversation and epoch identities are
represented only by 12-character SHA-256 fingerprints. The file contains no
raw native session UUID, terminal/workspace/project ID, prompt transcript,
tool payload, credential, or absolute fixture path.

## Interaction and cleanup

The acceptance used real Electron pointer and keyboard input. The macOS
accessibility query located the app process but did not expose the Electron
window tree, so Chromium's debugging protocol was used to dispatch actual
mouse/key events; no DOM `.click()` shortcut or private product method was
used. The existing public Host Service interface was used only to register and
remove the disposable project and to read the sanitized runtime projection.

The project and workspace were removed through Host Service, the guarded QA
profile cleaner completed, all diagnostic listeners were stopped, and the
disposable Git fixture was moved to the macOS Trash rather than permanently
deleted.
