# New Task Flow v0.1 — Safe Acceptance Evidence

This directory contains the deliberately minimized evidence retained from the
Phase 3H isolated, real Pi-first acceptance run. The primary viewport was
1440×800 logical pixels (2× screenshot); the larger-layout check used
1920×976 logical pixels.

## Files

| File | Evidence |
| --- | --- |
| `01-dispatch-sheet-1440x800.png` | Briefcase-local `NEW TASK`, compact dispatch sheet, fixed Pi employee, fixed New Work Folder, and Work Options at the primary viewport. |
| `02-title-preserved-exact-resume-safe.png` | Cropped exact-resume result showing the explicit Task Folder title and connected Pi Worker after a full isolated restart. |
| `03-real-unicode-diff-safe.png` | Cropped real Diff for the harmless file created from a Unicode-titled Pi task. |
| `04-tier2-untracked-safe.png` | Cropped Tier 2 Superset CLI regression showing compatibility-worker presentation without Tier 1 runtime authority. |
| `05-grok-boundary-safe.png` | Cropped Grok Build profile showing the authentication-gated `NO LIVE RUNTIME` boundary. |
| `acceptance.json` | Sanitized machine-readable acceptance projection and hashed runtime identity continuity. |

## Method

- The app ran from the guarded `phase-3h-new-task` QA profile against a
  disposable local Git repository.
- Product interaction used real Electron pointer/key input through Chromium's
  debugging protocol. It did not invoke DOM `.click()` or private product
  methods.
- Public Host calls were limited to sanitized readback and disposable-project
  cleanup. Native macOS file-picker automation was unavailable, so the
  disposable project was imported through the same public Host setup path
  before the product journey began.
- Real Pi created the harmless acceptance files. Files, Changes, Diff,
  authoritative Runtime Contract state, Renderer reload, full restart, and
  exact resume were inspected in AA Office.
- The original full screenshots that exposed disposable raw Workspace,
  terminal, branch, or path identifiers were intentionally not retained.

## Safety and cleanup

No credential, environment dump, raw native session ID, epoch ID, terminal
ID, Workspace UUID, worktree path, transcript, or tool payload is present.
Runtime identities are represented only by 12-character SHA-256 fingerprints.
The Host project and generated worktrees were removed, the guarded QA profile
was cleaned, and all isolated Electron/Host/API/Electric processes were
stopped. The disposable source fixture was moved to the macOS Trash and remains
recoverable; it contains no user repository data.
