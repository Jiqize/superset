# AA Phase 1.1 Report

## Status

Phase 1.1 — **AA Office Visual Refinement** is implemented and verified on
macOS in the `aa-spike` working tree.

This refinement is presentation-only. It makes the AA Office metaphor dominant
in the existing V2 workspace while preserving Superset's terminal, pane,
workspace, Pi lifecycle, Git/worktree, filesystem, routing, and persistence
behavior. Phase 2 is not included.

## Before and After

| Area | Phase 1 | Phase 1.1 |
| --- | --- | --- |
| Project/workspace sidebar | Mostly the original Superset list with AA shell styling | A compact **Briefcase Cabinet** with a strong project briefcase, indexed work folders, real `MAIN`/`COPY` identity, and deep-navy selection |
| Agent presets | Original provider/preset strip | An **Employee Roster** of compact worker buttons with explicit preset names and provider badges |
| Pi worker | Small worker mark adjacent to status text | A 140 px **Pi Worker Status Card** with a 44 px pixel worker, real-state light, and state label |
| Files/Changes/Review | Standard right-sidebar tabs | A unified **File Cabinet** with an industrial title bar, inset tab tray, pixel document icons, and real changed-file count |
| Hierarchy | Similar grey weight across most regions | Warm-grey canvas, lighter raised controls, darker recessed cabinet regions, charcoal title bars, navy selection, and restrained amber attention |

The real Pi terminal remains the dominant working surface. No decorative office
scene, fake workload, fake progress, gradient, glass effect, blur, scanline, or
terminal overlay was added.

## Files Changed

### Components added

All new production components remain local to the existing AA layer:

`apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`

| Files | Responsibility |
| --- | --- |
| `AAEmployeeAvatar/AAEmployeeAvatar.tsx` and `index.ts` | Renders a small crisp-edge pixel employee. The existing preset/provider icon is retained as a badge; a deterministic muted shirt variation supplies identity without implying status, seniority, or performance. |
| `AAFileCabinetHeader/AAFileCabinetHeader.tsx` and `index.ts` | Renders the File Cabinet title and the unique staged/unstaged file count already supplied by `WorkspaceGitStatusProvider`. |

### AA components updated

| File | Change |
| --- | --- |
| `AAOffice/AAAgentStatus/AAAgentStatus.tsx` | Promotes the existing Pi worker into a full status card while preserving the compact bottom-bar variant and the existing lifecycle provider. |
| `AAOffice/AAIcon/AAIcon.tsx` | Adds one small review-document icon to the existing AA pixel vocabulary. |
| `AAOffice/aa-office.css` | Adds the scoped Briefcase Cabinet, Employee Roster, Worker Card, File Cabinet, hierarchy, responsive, focus, and reduced-motion presentation. |
| `AAOffice/index.ts` | Exports the two new local components and the existing icon-name type. |

### Existing Superset surfaces updated

| Area/files | Visual integration |
| --- | --- |
| `DashboardSidebar/DashboardSidebar.tsx` | Passes the existing AA presentation flag to the project-list heading. |
| `DashboardSidebarHeader/DashboardSidebarHeader.tsx` | Adds AA-only cabinet toolbar hooks to the existing New Workspace and Search controls. |
| `DashboardSidebarProjectSection/DashboardSidebarProjectSection.tsx` | Adds the cabinet-section frame without changing context menus, dragging, or project data. |
| `DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx` | Adds the briefcase mark, visible cabinet chevron, and collapsed-state styling hook; existing toggle, rename, creation, context-menu, and drag behavior remain in place. |
| `DashboardSidebarExpandedWorkspaceRow/DashboardSidebarExpandedWorkspaceRow.tsx` | Presents the existing row as a folder, retains its real runtime/PR mark as a small badge, and labels the existing workspace type as `MAIN` or `COPY`. |
| `DashboardSidebarWorkspacesHeader/DashboardSidebarWorkspacesHeader.tsx` | Changes the AA-mode heading from Projects to Briefcase Cabinet while preserving collapse and Add Project actions. |
| `V2PresetsBar/V2PresetsBar.tsx` | Adds the Employee Roster identity strip and compact raised-control layout. |
| `V2PresetBarItem/V2PresetBarItem.tsx` | Uses the pixel employee avatar and an explicit accessible launch label while preserving drag, reorder, edit, hotkey, and launch callbacks. |
| `BuiltinPresetBarItem/BuiltinPresetBarItem.tsx` | Applies the same employee presentation to built-in presets while preserving launch and hide behavior. |
| `WorkspaceSidebar/WorkspaceSidebar.tsx` | Mounts the File Cabinet header, derives a unique real changed-file count from the existing provider, and adds presentation hooks around existing content. |
| `WorkspaceSidebar/components/SidebarHeader/SidebarHeader.tsx` | Applies AA tabs/icons when requested while retaining the same tab definitions, actions, badges, and persistence callback. |

No file in Host Service, the PTY daemon, terminal adapters, Pi hooks/extensions,
Git/worktree services, filesystem services, local database schemas, shared
runtime abstractions, or `packages/ui` was modified.

## Briefcase Cabinet

- Displays the real project `aa-baseline-fixture` as the enclosing briefcase.
- Displays the real `local` main checkout and `pi-baseline` worktree as folder
  rows, with existing workspace names and existing selection/navigation.
- Uses the existing workspace type to show `MAIN` or `COPY`; it does not infer
  or fabricate project metadata.
- Uses deep navy plus a narrow amber index mark for the active work folder.
- Preserves project collapse/expand, rename, context menu, Add Project, New
  Workspace, search, workspace hover, workspace navigation, and drag behavior.
- Keeps the original runtime/PR indicator available as a small badge on the
  folder rather than replacing it with decorative state.

## Employee Roster

- Keeps the existing preset order, visibility, drag/reorder, editing, hiding,
  hotkeys, and `onExecutePreset` behavior.
- Renders every available pinned preset as a compact named employee button.
  The verified fixture exposed Claude, Codex, OpenCode, Copilot, Mistral Vibe,
  Kimi Code, Grok, and Superset CLI.
- Uses the existing resolved provider icon as a small badge. No online state,
  model score, workload, emotion, or seniority is invented.
- Adds explicit `Run employee preset: <name>` accessible labels and retains the
  visible functional name.
- Keeps horizontal overflow available for narrower windows instead of growing
  the bar or introducing large character cards.

## Pixel Worker Status Card

- Expands the worker to a recognizable 44 px crisp-edge SVG inside a 140 px
  card; the card stays within the existing identity header and remains smaller
  than the terminal.
- Keeps the existing real-state vocabulary: `OFFLINE`, `IDLE`, `THINKING`,
  `WORKING`, `WAITING`, and `ERROR`.
- Keeps the existing mapping and data source unchanged. The card title exposes
  the underlying lifecycle event, or reports that no Pi binding exists.
- Uses a four-position integer-pixel typing loop for `WORKING`, the existing
  small thinking motion for `THINKING`, and static restrained poses for other
  states.
- Keeps `prefers-reduced-motion` coverage. No animation engine was introduced.
- Preserves the compact light-and-label variant in the bottom status bar.

## File Cabinet

- Adds a dark File Cabinet title bar and an inset tray around the existing
  Files, Changes, and Review tabs.
- Uses a folder, marked-paper, and checked-document icon while retaining the
  explicit tab labels and existing badges.
- Displays the unique real count of staged and unstaged paths as `N MARKED`.
  The count is hidden while existing Git data is unavailable and turns amber
  only when the real count is greater than zero.
- Preserves the existing file tree, file actions, Changes content, Review
  content, diff pane, tab callbacks, and persisted active-tab state.
- Adds no polling and does not alter the diff engine or Git status provider.

## Visual Hierarchy Decisions

- The warm neutral canvas now separates lighter raised employee controls from
  darker recessed cabinet contents.
- Charcoal title bars make Briefcase Cabinet, Employee Roster, Pi Worker, and
  File Cabinet read as one Office System.
- Deep navy is reserved for selected navigation, the active workspace folder,
  and the active File Cabinet tab.
- Amber is limited to real activity/attention, the active-folder index, and a
  non-zero changed-file count.
- Depth comes from hard 1–2 px borders and inset highlights. Corners remain
  square or at the existing 2 px AA radius.
- All new pixel artwork is inline SVG/CSS with crisp-edge or pixelated
  rendering. No raster asset library was added.

## Runtime Verification

The implementation was exercised in the running macOS Electron development
app at `http://localhost:3005` against the real Phase 0 fixture.

| Behavior | Result |
| --- | --- |
| Desktop/workspace launch | The existing Electron app remained running and opened the real `aa-baseline-fixture` / `pi-baseline` V2 workspace. |
| Briefcase interactions | Pointer collapse removed both visible folder rows; pointer expansion restored both rows. Project and workspace actions remained attached to the existing components. |
| Workspace selection/navigation | `pi-baseline` remained the selected deep-navy folder. Home navigation and the existing Back control returned to the same workspace route. |
| Employee Roster | Clicking `Superset CLI` created a second real xterm, selected a `Superset CLI` session, and displayed the preset's actual `superset --help` output. The test pane was then closed and the original `π - pi-baseline` session restored. |
| Pi terminal | The existing Pi TUI remained readable and interactive. Clicking its surface focused the existing `xterm-helper-textarea` with `aria-label="Terminal input"`. |
| Pi lifecycle | During renderer reload the real binding temporarily rendered `OFFLINE` (`No active Pi terminal session`); after session reconnection it returned to real `IDLE`. No intermediate state was synthesized. |
| Files | The real `.git`, `baseline.txt`, and `README.md` entries rendered under the AA frame. Existing file actions remained available. |
| Changes/Diff | The Changes tab activated correctly and the existing diff surface retained the fixture's real `No changes` state. No diff implementation changed. |
| Review | The Review tab activated correctly and remained selected after renderer reload, verifying the existing right-sidebar persistence path. |
| Renderer reload/session continuity | The workspace, one xterm, and Pi session returned after reload; Files was restored as the final active tab for review. |
| Layout | At the native 1920 × 976 renderer viewport, document width/height matched the viewport and no page-level overflow appeared. The roster fit through the final `Superset CLI` employee, the worker card measured 140 px, and the worker avatar measured 44 px. |
| Runtime errors | No uncaught renderer exception occurred. The only console errors observed were pre-existing React development warnings from `DockBadgeController` updates during `DashboardSidebarWorkspaceItem` / `DashboardSidebarWorkspaceChips` render; none points to a Phase 1.1 file. |
| Architecture boundary | Git status confirmed that every production change is in the Renderer AA working set or its documented visual integration surfaces. No RED-area file changed. |

Final visual verification screenshot:

`/tmp/aa-office-phase-1.1.png`

The screenshot is a local, untracked QA artifact rather than a production
asset. It shows the restored Pi session, Files tab, real project/workspace
identity, and zero real marked files.

## Checks

The final verification set is:

```sh
bun run --cwd apps/desktop typecheck
bun test apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/AAAgentStatus/aaAgentState.test.ts
./scripts/lint.sh <changed Phase 1.1 renderer files and AAOffice files>
git diff --check
```

Results:

- Desktop TypeScript typecheck: passed.
- AA lifecycle tests: 9 passed, 0 failed.
- Targeted Biome lint/format: passed with no diagnostics.
- `git diff --check`: passed.
- Electron interaction pass: completed with no uncaught exception.

As recorded in the Phase 1 report, repository-wide lint still has existing
formatter findings in `docs/aa/design/tokens.json` and
`docs/aa/design/assets-manifest.json`; this phase did not modify either file.

## Known Limitations

1. Pi lifecycle fidelity is unchanged. `THINKING`, `WAITING`, and `ERROR` can
   only appear when the current integration emits the corresponding real
   event; the UI intentionally does not infer them.
2. The Employee Roster reflects existing pinned presets. Pi was not a pinned
   roster preset in the verified fixture, so the UI did not fabricate a Pi
   roster entry; the active Pi remains represented by the real worker card.
3. Employee variation is deliberately minimal and deterministic. The Phase
   1.1 SVG workers are not a final production sprite family.
4. Narrow layouts retain horizontal roster scrolling, and secondary cabinet
   labels hide at existing responsive thresholds. A broader native-window and
   Retina scale matrix remains to be checked visually.
5. The draggable project row remains focusable, but its existing `dnd-kit`
   keyboard listener owns Enter/Space. Collapse/expand was therefore verified
   by pointer without changing existing drag semantics.
6. Two existing React development warnings involving `DockBadgeController`
   remain visible during some sidebar renders. They predate and are outside
   the Phase 1.1 presentation changes; there were no uncaught exceptions.
7. Full Pi conversation resume after an application restart remains
   unavailable for the reasons documented in Phase 1. Terminal reconnect on
   renderer reload continues to work.

## Recommended Next Visual Refinements

These are bounded visual-polish candidates, not Phase 2 work:

1. Review the same shell at native 1280 × 800 and 1440 × 900 sizes and tune
   only truncation/priority where real names collide.
2. Create one approved employee sprite sheet only after the current compact
   roster scale and badge treatment are accepted.
3. Capture real `THINKING`, `WORKING`, `WAITING`, and `ERROR` lifecycle samples
   before changing poses or timing.
4. Add visual regression fixtures for collapsed/expanded Briefcase Cabinet,
   long names, non-zero change count, each File Cabinet tab, reduced motion,
   and offline/idle/working worker states.
5. Tune small-screen File Cabinet tab density and action placement without
   changing the existing sidebar state or content architecture.
6. Audit 1×/2× icon sharpness, focus-ring contrast, and tooltip timing during
   normal keyboard-driven use.

## Phase Boundary

Phase 1.1 ends with this visual refinement and report. No native Pi chat, new
runtime adapter, PTY/Git/worktree change, broader Superset redesign, or Phase 2
implementation is included.
