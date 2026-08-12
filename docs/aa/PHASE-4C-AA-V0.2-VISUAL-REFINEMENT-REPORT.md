# Phase 4C — AA v0.2 visual refinement report

## Verdict

`AA OFFICE V0.2 VISUAL REFINEMENT ACCEPTED WITH DEBT`

Phase 4C completed the authorized geometry, hierarchy, state-language, and
interaction-polish pass on the original development Mac. The real terminal
remains the dominant Work Folder surface. No product capability, Runtime
contract, persistence model, Git/worktree behavior, or terminal architecture
changed.

## Commit scope

- Baseline: `c156ba0da6f348477b3573dd0af2c77aa62dbb9f`
- Final product implementation and safe-evidence commit:
  `76abd3ff98246e343ef344b2babd06a02adf2536`
- Phase report/checkpoint commit: the documentation commit containing this
  report; the pushed branch HEAD is recorded in the final handoff.

Only the original development Mac and
`/Users/lianglei/Code/bluejob/superset` were used. No other computer was
inspected, updated, or tested.

## Before-audit findings

The pre-edit punch list is preserved in
`docs/aa/v0.2/phase-4c/VISUAL-PUNCH-LIST.md`. The reproducible findings were:

- the 52 px rail, 58 px Work Folder header, 44 px Roster, and 30 px workstation
  label consumed more 1440×800 terminal area than necessary;
- cabinet, pane, application-body, and workspace-well greys were too close;
- Active Task evidence and archive labels were smaller than the functional type
  ladder and competed within one compressed row;
- Pi was correctly first/PRIMARY, but Roster edges and persistent chrome were
  visually noisy;
- File Cabinet selection was visible but lacked tab-selected semantics, roving
  keyboard behavior, and a strong visual seam into its active panel;
- mature page bodies retained inconsistent rounding/shadow depth inside the
  accepted AA wrapper.

## Implemented refinement decisions

### Shell, typography, and surface hierarchy

- Tightened the rail to 50 px and its controls to 40 px while preserving one
  navigation system, route behavior, labels, and current-state logic.
- Tightened application headers to 46 px and Work Folder headers to 54 px.
- Increased tonal separation among shell, cabinet, workspace well, pane, raised
  controls, and terminal without adding a new token system.
- Kept navy current state, amber working/focus state, explicit text labels, and
  hard 1–2 px workstation edges. No gradient, blur, glass, texture, scanline,
  CRT filter, or large shadow was introduced.
- Scoped mature-card radius/shadow normalization to `AAApplicationPage`; mature
  forms, tables, queries, actions, and route data remain owned by Superset.

### Briefcase Cabinet, Active Tasks, and Work Folders

- Tightened cabinet headings, project rows, group margins, and disclosure
  rhythm.
- Increased real Active Task row room from 39 px to 44 px, raised status and
  archive text to the AA functional-label ladder, and separated title,
  lifecycle, count, and archive columns more clearly.
- Added `aria-current="true"` to the actual selected Task Folder control. Active
  Tasks authority, ordering, evidence classification, archive persistence, and
  queries were not modified.

### Task Folder, Pi Worker, Roster, and terminal composition

- Reduced the persistent Work Folder header plus Roster from 102 px to 94 px.
- Tightened Pi Worker portrait/card, Task Folder strip, Roster label/items, and
  workstation console label while keeping every real state and label.
- Pi remains fixed first, `PRIMARY`, non-draggable, non-hideable, and sourced
  from the real Host Pi configuration. Compatibility Employees remain secondary
  and explicitly `UNTRACKED`.
- The terminal frame gained 10 px height and the terminal viewport gained 14 px
  at the measured 1440×800 state. xterm code, input, focus, transport, resize,
  rendering, persistence, and performance paths were untouched.

### File Cabinet

- Added `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`,
  `aria-labelledby`, stable IDs, and roving tab stops.
- Added Arrow Left/Right, Home, and End navigation with activation following
  focus; mouse activation and existing shortcuts remain intact.
- Strengthened the selected navy tab with an amber lower seam and a visible
  inset amber focus outline.
- Retained Files, Changes, Diff, Review, counts, pane state, and their existing
  engines unchanged.

## Before/after route matrix

The exact paired evidence and truthful availability notes are in
`docs/aa/v0.2/phase-4c/ROUTE-MATRIX.md`. It covers Home, Cases, idle/working and
compatibility Work Folder states, Tasks, Automations, Pull Requests, Sessions,
Employees & Agents, Settings, Advanced Work Folder, and restart/resumable state.

Twenty-eight normalized, metadata-stripped captures are stored under
`docs/aa/v0.2/phase-4c/screenshots/`. Raw identifiers, personal paths, terminal
transcripts, prompts, credentials, and private repository content are excluded
or masked.

## Work Folder density measurement

Measured at the same real 1440×800 Work Folder with both cabinets open:

| Region | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Navigation rail width | 52 px | 50 px | −2 px |
| Workspace header | 58 px | 54 px | −4 px |
| Employee Roster | 44 px | 40 px | −4 px |
| Persistent header + Roster | 102 px | 94 px | −8 px |
| Terminal frame height | 589 px | 599 px | +10 px |
| Terminal viewport height | 547 px | 561 px | +14 px |
| xterm width | 724 px | 730 px | +6 px |

No document-level overflow appeared at 1440×800 or 1920×976. The machine-
readable record is `docs/aa/v0.2/phase-4c/DENSITY-MEASUREMENTS.json`.

## Real acceptance

- Real New Task created one isolated Work Folder and real Pi terminal.
- Authoritative Pi `WORKING → IDLE` was visible; one harmless file produced a
  real changed count of `1`.
- Files, Changes, one-file Diff, Review, and selected pane persistence worked.
- A second Pi conversation launched from the fixed first Roster tile.
- Real Codex dispatch remained truthfully `UNTRACKED`.
- Tasks, Automations, Pull Requests, Sessions, Employees & Agents, Settings,
  Advanced Work Folder, and return to the original terminal worked.
- Archive and Unarchive changed only organization intent.
- Renderer reload preserved state and terminal input.
- Full Electron/Host restart first settled at `OFFLINE / RESUMABLE`, with no
  stale `LIVE`; exact Pi resume moved through `STARTING` to `IDLE`, preserved one
  changed file, and a bounded follow-up proved conversation continuity.
- Mouse and keyboard File Cabinet operation, rail focus, xterm textarea focus
  and input, and both required viewports passed.
- Reduced-motion emulation produced one effectively instantaneous AA status
  iteration and transition; no repeating AA motion was observed.

Sanitized details are in
`docs/aa/v0.2/phase-4c/ACCEPTANCE-RESULTS.md`,
`ACCESSIBILITY-MOTION.json`, and `RESTART-RESUME.json`.

## Automated verification

- AAOffice/CSS/Employee/Pi/File Cabinet: 197 passed, 0 failed, 31 files.
- Dashboard sidebar, WorkspaceSidebar, and Settings composition: 133 passed, 0
  failed, 22 files.
- Focused Runtime, terminal, workspace-client, and session-protocol regression:
  127 passed, 0 failed, 14 files.
- Full Host Service: 1083 passed, 14 opt-in real-adapter skips, 8 existing TODOs,
  0 failed, 111 files.
- Desktop, Host Service, Workspace Client, and Session Protocol TypeScript:
  passed.
- Root TypeScript: 37 tasks passed.
- Root `lint:fix` and `lint`: passed with no fixes required after disposable QA
  cleanup.
- CSS contract, `git diff --check`, frozen-area audit, screenshot OCR/string
  scan, and PNG profile/comment scan: passed.

## Frozen-boundary audit

Production changes are limited to AAOffice presentation/test files and the
existing V2 WorkspaceSidebar header/panel integration. Documentation is limited
to `docs/aa/`.

No Phase 4C diff touches Host Service, database/schema, Runtime Contract,
runtime registry, Pi bridge/extensions/hooks, PTY daemon, xterm/terminal
transport, Git/worktree/branch/Diff engines, New Task orchestration, Active
Tasks projection logic, Archive persistence, Task Folder persistence, Tier 2
lifecycle, Grok activation, native chat, or orchestration.

## Rejected or deferred ideas

- No new layout, route, visual identity, product capability, or asset family:
  this phase refines the accepted v0.2 system.
- No removal of truthful repeated state labels: hierarchy was adjusted, but
  explicit status remains more important than decorative minimalism.
- No inferred Pi waiting state, Tier 2 lifecycle, model/reasoning controls, or
  Runtime workaround in Renderer.
- No mature file tree, Diff, Review, PR, task, automation, or Settings rewrite.
- No correction of the mature Pull Requests absolute-path error, DockBadge
  diagnostic, dev font protocol, or Electric transport warning outside their
  owning scopes.
- No packaging, signing, notarization, release tag, distribution, cross-device
  work, or second-computer update.

## Accepted debt

The verified File Cabinet selected-state/accessibility debt is resolved. The
remaining accepted items are recorded in `docs/aa/AA-V0.2-DEBT-REGISTER.md`.
There is no open P1 item and no new Phase 4C debt.
