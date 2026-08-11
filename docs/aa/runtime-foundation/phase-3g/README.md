# Phase 3G Safe Evidence

This directory contains curated evidence from the isolated Pi-first daily-use
acceptance. It uses only disposable projects, harmless source files, and a
non-secret completion marker. No credential, production repository content,
raw runtime identity, terminal ID, workspace ID, prompt body, or tool payload
is retained.

## Screenshots

1. `01-pi-daily-task-folder-idle.png` — compact Pi workstation and actionable
   Task Folder facts after real work settled to `IDLE`.
2. `02-pi-employee-profile-keyboard.png` — keyboard-opened Pi Employee Profile
   with runtime-backed model, reasoning, health, and capabilities.
3. `03-file-cabinet-changes.png` — four real changed entries in the existing
   Changes surface, with Pi-owned task metadata collapsed.
4. `04-line-report-diff.png` — the real `line_report.ts` output in Superset's
   existing Diff pane.
5. `05-keyboard-return-to-pi.png` — Pi is authoritative again after the
   deterministic workstation-focus shortcut returns from Diff.
6. `06-pi-resumable-task-title.png` — full Electron/Host restart leaves one
   clear exact-resume action and preserves the explicit Task Folder title.
7. `07-pi-exact-resume-context.png` — exact resume returns to real Pi; the
   harmless completion marker is recalled from the saved conversation.
8. `08-tier2-superset-cli-untracked.png` — compatibility dispatch carries the
   Task Folder title while remaining `UNTRACKED`.
9. `09-grok-authentication-boundary.png` — Grok remains `NO LIVE RUNTIME`; no
   authenticated launch or speculative capability claim was made.
10. `10-large-viewport.png` — the same accepted Pi workflow at 1920×976 with
    no document-level horizontal overflow.

## Machine-readable evidence

`daily-workflow-evidence.json` records the before/after audit, real Pi result,
shortcut behavior, viewport/reduced-motion checks, compatibility boundaries,
and exact-resume comparison. Native conversation and epoch identities are
represented only by 12-character SHA-256 fingerprints.

## Interaction and cleanup

The acceptance used real Electron pointer and keyboard input. macOS app
discovery found Electron, but the accessibility service did not expose its
window tree, so Chromium's debugging protocol dispatched actual mouse/key
input. It did not call DOM `.click()` or private application methods. The
existing public Host Service interface was used only for sanitized runtime
reads and removal of disposable projects.

After verification, the two disposable projects were removed from Host
Service, their fixture directories and one modified test worktree were moved
to the macOS Trash, the guarded QA profile was cleaned, and all local QA
services were stopped.
