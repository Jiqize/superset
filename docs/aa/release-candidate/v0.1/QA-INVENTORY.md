# AA Office v0.1 RC QA inventory

This inventory was fixed before the Phase 3M real dogfood pass. Results and
safe evidence are added only after the corresponding visible workflow has
been exercised through the matched isolated Electron renderer.

| Product claim or control | Functional check | Required visual state / evidence |
| --- | --- | --- |
| Briefcase is the daily entry point | Open one disposable real Git project and expand its Briefcase | Full AA shell with project-local `NEW TASK` visible |
| New Task creates real isolated work | Use the production dialog at least six times; verify initial focus, title normalization, IME-safe Enter, and one Work Folder per submission | Dialog plus populated multi-task Briefcase |
| Multiple Pi tasks remain isolated | Keep at least two Pi tasks live concurrently and switch between their rows | Distinct selected row, Task Folder title, terminal, and output per Work Folder |
| Active Tasks is truthful | Observe live, resumable, untracked, archived, and unavailable evidence only from current state | Densest sidebar state at 1440×800 and 1920×976 |
| Duplicate titles remain distinguishable | Create a same-title pair, activate both with pointer and keyboard, and inspect full accessible names | Both opaque discriminators visible and stable |
| Task Folder is durable presentation | Open, rename, close, reopen, reload, and restart | Title retained; focus restored to the workstation |
| Employee Profile is secondary detail | Open and close from Worker Card and Task Folder; inspect authority/model/reasoning/capabilities | Profile popover plus restored terminal focus |
| Tier 2 stays compatibility-only | Dispatch to Superset CLI or Codex from Employee Roster | `DISPATCHED` and `UNTRACKED`; no Pi authority leakage |
| Output stays real and workspace-scoped | Produce changes in two tasks; use Files, Changes, Diff, and Review, then return to Pi | Correct file/count/diff for the selected Work Folder |
| Archive is organization intent only | Archive live Pi work, use Undo, archive again, unarchive, and navigate the archived row | Runtime/Git identity unchanged; Archived remains separate from Remove/Delete |
| Exact resume is explicit | Restart twice, resume one saved Pi task and one archived saved Pi task using the visible action | Same native-session fingerprint, new epoch, archive intent preserved |
| Clean-ended work is not promoted | End one Pi task cleanly and verify it becomes unavailable rather than saved/live | `SESSION UNAVAILABLE` only when archived; Work Folder fallback remains |
| Advanced Superset paths remain available | Inspect global `New Workspace · Advanced`, legacy project `+`, Work Folders, and workspace context actions | Advanced paths visually secondary but discoverable |
| Keyboard and transient surfaces are complete | Exercise Tab/Enter, Task Folder shortcuts, Employee Profile, Files/Changes, Archive/Unarchive, Resume, and Escape | Visible focus, full accessible names, deterministic focus restoration |
| Reduced motion and viewport fit hold | Emulate reduced motion and inspect both required logical sizes | No required region clipped; no document-level overflow; terminal remains anchor |
| RC performance remains practical | Measure clean-start route settle, sidebar usability, evidence settle, task-row switch, and Files/Changes switch with at least ten Work Folders | Sanitized timing ranges, not synthetic benchmarks |

Exploratory scenarios:

1. Exercise a long duplicate title at narrow width and confirm visual
   truncation does not erase the complete accessible identity.
2. Select an archived row while its disclosure is collapsed, then expand it
   and verify navigation never implicitly resumes or unarchives the task.
3. Reload while a Pi task is working and verify no adjacent task inherits its
   lifecycle or changed count.
