# Phase 3K safe evidence

This directory contains sanitized evidence from the guarded Phase 3K isolated
AA Office run on 2026-08-11. The disposable project had one harmless local Git
commit and no remote. The renderer was driven through visible AA controls with
real Chromium pointer and keyboard events. Read-only DOM inspection was used
only to locate controls and record visible state.

## Files

- `acceptance-summary.json` — sanitized counts and lifecycle outcomes from the
  larger-Briefcase run.
- `durability-matrix.json` — machine-readable evidence classifications used by
  the report.
- `projection-cost.json` — static query fan-out and observed local hydration
  facts.
- `ten-plus-1440x800.png` — Briefcase Cabinet at the compact viewport with 12
  projected rows after the intentional clean end; lower groups require scroll.
- `ten-plus-1920x976.png` — the same 12-row projection at the larger viewport,
  including live, resumable, and compatibility groups.
- `restart-one-resumable.png` — first complete Electron/Host restart: three
  exact Pi resume candidates and no stale live claim.
- `resume-one.png` — one exact saved Pi session restored to live state.
- `restart-two-resumable.png` — second complete restart: only the still-valid,
  unconsumed exact candidate remains.
- `resume-two.png` — that second-cycle exact candidate restored to live state.
- `non-resumable-work-folder.png` — the intentionally ended Pi task remains in
  the 17-item Work Folder list after disappearing from Active Tasks.

## Safety

Screenshots are limited to the AA Briefcase Cabinet. They contain only
synthetic task/project labels and derived status/count presentation. They do
not contain credentials, tokens, absolute filesystem paths, raw Workspace or
terminal identifiers, session identifiers, prompts/transcripts, terminal
output, or private repository contents.

No observation instrumentation or disposable profile is committed. The QA
profile, fixtures, helper, databases, logs, and worktrees remain outside this
evidence directory.
