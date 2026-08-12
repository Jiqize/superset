# Phase 4B route matrix

All visual checks used the original development Mac and the isolated `phase-4b`
profile. “Before” means the Phase 4A implementation at product commit
`9bffbf9f1cd3dce2b2ce9ce0c4edb64f84b1c456`; “after” means the Phase 4B
working tree after the final product correction.

| Route / surface | Before | After | Real interaction result |
| --- | --- | --- | --- |
| Home `/v2-workspaces` | AA rail around a mature workspace directory with no AA body hierarchy | `HOME DESK`, Briefcases/Work Folders copy, hard-edge page frame, `Work Folder Directory`, and `All briefcases` filter | Project/workspace rows, search/filter composition, cabinet, and New Task entry remained real; no overflow at either viewport |
| Cases / Briefcase | Cabinet was the clearest Case surface; the local-only fixture had no reachable cloud Project detail record | Cabinet selection, navy Case state, project-local `NEW TASK`, Active/Untracked/Archived groups, and secondary Advanced action read as one work model | Cabinet expand/collapse and selection passed; `/project/$projectId` framing is covered, but the isolated local-only fixture could not supply a real cloud Project detail record |
| Work Folder `/v2-workspace/$workspaceId` | Accepted Phase 4A Office/terminal frame | Intentionally preserved; only surrounding route continuity and copy alignment changed | Real Pi/xterm, Roster, Task Folder, Files/Changes/Diff/Review, focus, resize, archive projection, reload, restart, and resume passed |
| Advanced Work Folder | Mature New Workspace modal/route language remained visually dominant | Shell label is `New Work Folder · Advanced`; direct AA route gets a folder mark and Work Folder prompt while the mature form and defaults remain intact | Existing modal controls were reviewed; no worktree/branch/default behavior changed |
| Tasks `/tasks` | Mature Tasks body appeared directly beside the AA rail | Compact `OPERATIONS INDEX / TASKS` hierarchy, inset frame, squared controls, explicit separation from AA Task Folders | Existing Linear/GitHub modes, filters, search, connect empty state, and New task action remained present |
| Automations `/automations` | Mature header/cards and gradient-bearing template surface | AA header, hard section boundaries, flat inset template surface, and squared cards/actions | Mine/Team, Learn more, New automation, templates, and scrolling remained usable |
| Pull Requests `/pull-requests` | Mature PR filters/error surface beside rail | `REVIEW TRAY / PULL REQUESTS`, framed toolbar/table/error surface | Existing filters/retry remained; fixture truthfully reported no GitHub remote; raw absolute-path error was excluded from evidence |
| Sessions `/settings/terminal` | Mature Settings composition under outer AA rail | `SESSION OFFICE / SESSIONS` around the existing terminal settings page; selected Settings row uses navy | Preset list/import/add/configuration remained intact and scrollable |
| Agents `/settings/agents` | Mature agent configuration page under outer AA rail | `EMPLOYEE OFFICE / EMPLOYEES & AGENTS` around the existing configuration page | Existing list, Pi row, commands, hooks, and compatibility settings remained intact |
| Settings Account/Appearance/Keyboard | Mature black Settings navigation and forms lacked an AA content header | `OFFICE CONTROLS`, route-specific title, warm inset body, hard section edges, and navy selected row | Navigation, focus, form controls, scrolling, Appearance, and Keyboard remained usable |

## Navigation and state matrix

- Exactly one AA rail was present on every in-scope route.
- Home is current only when its directory is the visible destination. Cases is
  current while the cabinet is the active Home sub-surface, but no longer
  steals current state on Tasks/Automations/other routes when the cabinet stays
  open.
- `FILES` uses native disabled state outside a real Work Folder and is enabled
  only after returning to one.
- The real journey Home → Case/cabinet → Work Folder → Files → Sessions →
  Agents → Settings → Tasks → Automations → Pull Requests → Advanced → original
  Work Folder passed. No navigation step created or resumed work.
- Nested Task/Automation/PR records were unavailable in the isolated fixture;
  route-family classification tests cover their nested paths without inventing
  product data.
- Browser/Renderer reload preserved the selected Work Folder. Full application
  restart removed stale live truth and exposed exact Pi resume instead of
  auto-resuming.

## Viewport and accessibility matrix

| Check | 1440×800 | 1920×976 |
| --- | --- | --- |
| Rail destinations reachable | Pass | Pass |
| Document-level horizontal overflow | None | None |
| Header density | Compact; description remains readable | Anchored; no oversized hero gap |
| Mature page body usable | Pass | Pass |
| Cabinet open/closed | Pass | Pass |
| Work Folder terminal/focus | Pass, including existing Diff pane | Pass |

Keyboard Tab moved from Home to Cases to Tasks with visible focus. Pi's full
accessible name retained PRIMARY, availability, and action. Reduced-motion
emulation reduced repeating AA animation/transition duration to `0.01ms` with
one iteration. Existing File Cabinet tab state semantics are retained debt and
are not misreported as a Phase 4B fix.
