# Phase 4C QA inventory

This inventory was fixed before production edits. It governs both functional
and visual acceptance on the original development Mac using the repository
managed `phase-4c` profile and a disposable local Git Briefcase.

## Product claims and controls

| Claim / control | Functional check | Required visual state | Safe evidence |
| --- | --- | --- | --- |
| One precise AA shell | Traverse every required route by visible rail/actions; verify one rail and no creation/resume side effect | Home, operational pages, Settings, Advanced, and returned Work Folder at both viewports | Paired Home/Settings/Work Folder captures plus route matrix |
| Rail geometry and state language | Mouse and keyboard through every destination; Cases open/close; Files enabled only in Work Folder | Current, pressed, hover, focus, and disabled states | Home/Cases capture and sanitized measurements |
| Briefcase hierarchy | Expand the real Briefcase; use New Task; expand Active/Saved/Archived/Work Folders; archive/unarchive | Long task title, selected task, truthful Live/Resumable/Untracked/Archived groups where evidence exists | Paired cabinet captures and acceptance summary |
| Pi stays fixed PRIMARY | Inspect initial/checking/available and real starting/working/idle/offline/resumable states; regression-test setup/error/waiting | Pi first in Roster without oversized treatment; explicit text at every state | Work Folder pairs and focused Pi tests |
| Compatibility remains secondary | Dispatch Codex through its real tile and verify `UNTRACKED` without Pi authority | Codex selected/dispatched presentation and explicit Untracked text | Product-only header crop and sanitized summary |
| Work Folder remains terminal-first | Create real Pi work, type into xterm, resize/open cabinet and File Cabinet | Task Folder, Worker, Roster align while xterm stays the largest work surface | Idle/working pairs at 1440×800 and 1920×976 plus bounds |
| File Cabinet selection is explicit | Cycle Files → Changes → Review → Files with mouse and keyboard; open one real Diff | Selected visual tab and correct `aria-selected`/tab semantics track the active body | Paired open-cabinet capture and accessibility probe |
| Real output remains intact | Create one harmless file; inspect Files, Changes, Diff, Review and real count | One real changed file, no fabricated delivery state | Sanitized output summary; terminal content excluded |
| Mature bodies remain mature | Exercise Home, Tasks, Automations, Pull Requests, Sessions, Employees & Agents, Settings, Advanced | Consistent header/body rhythm, squared scoped controls, truthful empty/error states | Route pairs/matrix at 1440×800; representative 1920×976 |
| Reload and restart preserve truth | Renderer reload, full Electron/Host restart, confirm no stale Live, exact visible Pi resume | Offline/Resumable before resume; Idle after exact resume | Product-only crops plus sanitized fingerprints |
| Accessibility and motion | Tab/Enter through rail, Roster, File Cabinet and Settings; focus xterm; emulate reduced motion | Visible focus; text-backed state; no repeating AA motion under reduce | Accessibility/motion JSON and screenshots |
| Viewport fit | Inspect initial and densest realistic layouts at exact logical 1440×800 and 1920×976 | No clipped required regions, double borders, document overflow, or unusable terminal | Paired screenshots and region bounds |

## State transitions to cover

- Cabinet: closed → open → group expanded/collapsed → restored.
- File Cabinet: closed → Files → Changes → Review → Files → closed.
- Pi: available → starting/working → idle → full-stop offline/resumable → exact
  resume starting → idle.
- Compatibility: available → dispatching/dispatched → `UNTRACKED`.
- Archive: active/saved row → archived group → unarchived truthful group.
- Route: Work Folder → every global destination → Advanced → original Work
  Folder, followed by Renderer reload and full restart.
- Motion: normal state → `prefers-reduced-motion: reduce` → normal state.

## Exploratory checks

1. Use a deliberately long real Task Folder title in the narrow cabinet and
   verify title truncation, discriminator, status, changed count, and Archive
   action do not collide.
2. Leave Cases open, rapidly visit Tasks/Automations/Settings, then return via
   browser history and verify current versus pressed state never drifts.
3. Keep the File Cabinet open while resizing between required viewports and
   verify terminal resize/focus and selected-tab semantics remain correct.
4. During a real working state, enable reduced motion and inspect the Worker,
   status lights, Roster affordances, and route controls long enough to detect
   repeating animation or layout movement.

## Evidence safety

- Commit only disposable fixture UI, bounded counts/state words, logical
  viewport measurements, and short one-way identity fingerprints.
- Exclude credentials, account data, private repository content, raw IDs,
  prompts/transcripts, absolute personal paths, tokens, and environment dumps.
- Normalize screenshots to CSS pixels and strip metadata before commit.
- Mark checks as real UI, regression-only, or unavailable rather than
  fabricating Runtime or mature route data.
