# Phase 3J safe evidence

This directory contains fixture-only, sanitized acceptance evidence for the
Active Tasks Projection v0.1. It intentionally excludes prompts/transcripts,
credentials, absolute host paths, raw Workspace/runtime/session identifiers,
and private repository content.

The screenshots use the disposable `aa-phase3j-five-task-qa` Briefcase and
synthetic file-creation tasks only. Machine-readable acceptance facts are in
`acceptance-summary.json`.

Evidence index:

- `five-task-1440x800.png` — five projected rows, a live Pi task, two stable
  duplicate discriminators, and two real changed-file counts at 1440×800;
- `five-task-1920x976.png` — the same five-row projection at 1920×976;
- `restart-resumable-1440x800.png` — clean-restart reconstruction from exact
  saved Pi candidates without stale lifecycle state;
- `exact-resume-1440x800.png` — only the explicitly resumed Pi row returns to
  `LIVE`;
- `tier2-untracked-1440x800.png` — a compatibility employee remains explicitly
  `UNTRACKED`;
- `acceptance-summary.json` — sanitized acceptance facts and limitations.
