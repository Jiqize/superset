# Phase 4C visual punch list

Captured before production edits from the isolated `phase-4c` QA profile at
logical 1440×800 and 1920×976 viewports. Items below are presentation-only;
runtime, persistence, terminal, Git, worktree, and projection authority remain
frozen.

## Alignment

- The page header, Work Folder header, Roster, pane tab bar, and File Cabinet
  use related but slightly different vertical rhythms; the terminal loses more
  height than necessary at 1440×800.
- Rail icon/label pairs are centered but the 42 px control inside a 52 px rail
  leaves uneven visual weight at the selected edge.
- File Cabinet tabs sit above their content instead of reading as connected
  index tabs; the active lower edge is not visually merged with the content.

## Spacing

- The 58 px Work Folder header plus the Roster and 30 px workstation label
  creates avoidable persistent chrome above xterm.
- Active Task rows have enough total height, but internal 3 px padding compresses
  the employee, title, evidence, changed count, and archive action into one band.
- Mature page bodies use inconsistent first-row insets and toolbar padding.

## Typography

- Active Task evidence at 6 px and archive labels at 5 px are below the rest of
  the AA functional-label hierarchy.
- File Cabinet record labels and values are too small for their operational role.
- Page titles, descriptions, cabinet labels, and employee labels need a more
  consistent line-height and letter-spacing ladder.

## Surface hierarchy

- Cabinet groups, the workspace well, pane surface, and mature route bodies use
  close grey values; hard edges are present but hierarchy is flatter than the
  intended shell → cabinet → pane → terminal sequence.
- Mature automation cards and settings controls retain more rounded Superset
  treatment than surrounding AA surfaces.
- The terminal is already the darkest and dominant surface; refinements must
  reclaim space for it rather than add decoration.

## State clarity

- File Cabinet selection is navy but lacks explicit selected-state semantics in
  the rendered button contract.
- Active/current task selection, runtime evidence, and archive state all compete
  inside the same compact row.
- Pi PRIMARY is correctly first and fixed, but the left amber inset and adjacent
  profile affordance create a noisy double edge.

## Information density

- Work Folder chrome is information-rich but duplicates Task Folder/runtime
  evidence across the header, workstation strip, task card, and bottom status.
  No information will be removed; secondary labels can be quieter and tighter.
- At 1440×800 with both cabinets open, xterm remains usable but benefits directly
  from a smaller workspace header and workstation label.
- At 1920×976, mature empty states and content wells spread too loosely; their
  maximum readable width and edge treatment should remain consistent.

## Accessibility

- Files / Changes / Review buttons expose names and shortcuts, but not an
  explicit tab selected state.
- Focus rings vary between AA controls; several are outline-offset outside dense
  hard-edged controls and can be clipped.
- Reduced-motion rules cover AA animations; the final pass must verify computed
  animation and transition behavior again.

## Repeated visual noise

- Repeated double borders at the Roster item/profile boundary, cabinet group
  edges, and File Cabinet tab/content boundary create dark vertical noise.
- Multiple tiny metadata labels use equal contrast, making authority and status
  harder to scan.
- Setup guidance is truthful existing product UI and is not a Phase 4C feature;
  it will not be removed or behaviorally changed.

## Authorized refinement set

1. Normalize AA geometry and type tokens in scoped CSS.
2. Tighten Work Folder chrome while preserving all content and xterm behavior.
3. Improve cabinet row scanability and group separation without projection edits.
4. Clarify PRIMARY/compatibility hierarchy and roster overflow affordances.
5. Add explicit File Cabinet selected-state semantics and a matching visual seam.
6. Harmonize mature page surfaces through `AAApplicationPage`-scoped CSS only.
7. Add focused presentation/accessibility tests; make no runtime change.
