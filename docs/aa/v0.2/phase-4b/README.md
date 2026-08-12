# Phase 4B safe evidence

This directory records the AA Office v0.2 single-machine product-completion
acceptance performed on the original development Mac. The acceptance used the
repository-managed `phase-4b` QA profile and one disposable local Git fixture.
No second computer, production profile, package, release tag, signing, or
notarization flow was involved.

Evidence is intentionally product-safe:

- JSON contains only bounded counts, state words, timing observations, and
  12-character SHA-256 fingerprints;
- screenshots contain only the disposable fixture and product UI;
- terminal transcripts, account data, absolute paths, raw project/workspace/
  terminal/session IDs, tokens, and environment dumps are omitted;
- screenshots named `1440x800` or `1920x976` describe the logical viewport;
  PNGs were normalized to that logical size and stripped of metadata.

Files:

- `QA-INVENTORY.md` — claims fixed before implementation and test coverage;
- `route-matrix.md` — final route, IA, viewport, and interaction review;
- `acceptance-summary.json` — sanitized real-product result;
- `restart-resume.json` — exact Pi resume identity proof;
- `performance-observations.json` — development-build observations only;
- `screenshots/01-*` and `02-*` — one representative before/after pair;
- `screenshots/03-*`, `04-*`, and `08-*` — final application-page composition;
- `screenshots/05-*`, `06-*`, and `07-*` — product-only Runtime/compatibility
  crops with terminal content excluded.

The complete interpretation and accepted debt are in the Phase 4B report,
visual/IA audit, checkpoint, and debt register at `docs/aa/`.
