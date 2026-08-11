# Phase 3I — Safe Multi-Task Dogfood Evidence

This directory contains minimized evidence from an isolated AA Office run with
five real New Task flows in one disposable Briefcase. The primary viewport was
1440×800 logical pixels; the large-layout check used 1920×976.

## Files

| File | Evidence |
| --- | --- |
| `01-one-task.png` | First production New Task result and the project-local creation affordance. |
| `02-three-tasks.png` | Three isolated Work Folders with distinct human Task titles. |
| `03-five-tasks-1440.png` | Five Work Folders at 1440×800, including a deliberate duplicate title. |
| `04-pre-restart.png` | Five-task Briefcase immediately before the full Electron/Host restart. |
| `05-post-restart-saved.png` | Persisted five-task Briefcase before any session was resumed. |
| `06-resumed-task.png` | Cropped, safe Task Folder and Pi Worker state after exact resume. |
| `07-large-viewport.png` | Five-task Briefcase at 1920×976. |
| `active-task-projection.json` | Sanitized projection derived only from allowed persisted, runtime, resume, and Git evidence. |

## Method

- The guarded `phase-3i-multitask` profile ran against a disposable local Git
  repository with no remote.
- All five Work Folders and Pi sessions were created through the production
  project-local `NEW TASK` UI. Product interaction used real Electron
  pointer/key input through Chromium's debugging protocol; it did not call DOM
  `.click()` or private product methods.
- Native macOS file-picker automation was unavailable. The disposable project
  import used the public Host setup interface, the exception allowed by the
  brief. Public Host reads were also used to sanitize authoritative state and
  public Host removal was used for cleanup.
- Runtime identities are represented only by 12-character SHA-256
  fingerprints. No terminal text was used to build the task projection.

## Safety and cleanup

The retained screenshots are deliberately cropped. They contain no credential,
raw native session/epoch/terminal ID, Workspace UUID, local path, transcript,
prompt history, or user repository content. Unsafe full screenshots were not
retained. The disposable Project was removed through the supported Host API,
the QA profile and processes were cleaned, and dirty fixture/worktree remnants
were moved to the macOS Trash, where they remain recoverable.
