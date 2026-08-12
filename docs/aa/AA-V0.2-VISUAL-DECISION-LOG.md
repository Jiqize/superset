# AA Office v0.2 visual decision log

This log records Phase 4C presentation decisions. It is not a new product or
Runtime contract.

## V4C-01 — Reclaim space for the terminal

- Evidence: 102 px of persistent Work Folder header/Roster chrome at 1440×800.
- Decision: reduce the header to 54 px, Roster to 40 px, workstation strip to
  28 px, and local hard-edge padding by 1 px.
- Result: terminal viewport height increased by 14 px in the matched state.
- Rejected: hiding state labels, overlaying controls on xterm, or modifying
  terminal layout/rendering internals.

## V4C-02 — Strengthen hierarchy with existing AA surfaces

- Evidence: cabinet, workspace well, pane, and mature body greys read too
  uniformly.
- Decision: adjust existing AA surface values and preserve charcoal edges,
  paper highlights, navy selection, amber attention, and terminal darkness.
- Rejected: a new theme system, gradients, shadows, texture, glass, CRT, or
  decorative office scenery.

## V4C-03 — Give task evidence room rather than remove it

- Evidence: title, lifecycle, changed count, and archive label collided in the
  compact current row.
- Decision: make task rows 44 px, increase evidence/archive type one step, and
  add `aria-current` to the real selected control.
- Rejected: hiding changed count/status, changing projection grouping, or adding
  a new task field.

## V4C-04 — Keep Pi prominent through order and semantics

- Evidence: Pi was already correctly fixed/PRIMARY; size and adjacent edges
  created unnecessary noise.
- Decision: preserve fixed first order and explicit PRIMARY text while slightly
  tightening the tile/card and Roster gaps.
- Rejected: a larger hero Worker, synthetic Pi preset, draggable Pi, model
  ranking, invented availability, or Tier 2 lifecycle authority.

## V4C-05 — Treat File Cabinet views as real tabs

- Evidence: visual selection lacked selected-state semantics and expected arrow
  key behavior.
- Decision: implement tablist/tab/tabpanel relationships, roving focus,
  Arrow/Home/End navigation, an amber selected seam, and a visible inset focus
  outline.
- Rejected: rewriting the pane registry, File tree, Diff, Review, shortcuts, or
  persisted sidebar state.

## V4C-06 — Normalize mature bodies only through the shared AA scope

- Evidence: selected cards and controls retained inconsistent large rounding
  and small shadows.
- Decision: normalize relevant radius/shadow selectors below
  `AAApplicationPage` and add a narrow Automation surface edge treatment.
- Rejected: forking mature routes, renaming data models, or changing their
  actions, forms, queries, tables, and empty/error truth.

## V4C-07 — Keep state text-backed and motion optional

- Evidence: lifecycle color and Worker animation support identity but cannot be
  the only signal.
- Decision: preserve every explicit state label and verify computed reduced-
  motion values in the real Renderer.
- Rejected: inferred emotion/workload, fake progress, continuous motion under
  reduced motion, and terminal effects.

## V4C-08 — Prefer paired truthful evidence over staged screenshots

- Evidence: visual claims needed comparison without leaking terminal/history,
  personal paths, or raw IDs.
- Decision: use one disposable real Git fixture and identical logical
  viewports/states, then normalize, mask, strip, OCR, and string-scan 28 images.
- Rejected: fabricated Runtime/GitHub/automation/task data and committed raw
  transcripts or transport identifiers.
