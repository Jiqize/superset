# Phase 4B QA inventory

Fixed before the Phase 4A before-state audit. This file preserves the claims
that governed implementation and acceptance; final results were recorded only
after the corresponding normal UI interaction or bounded regression check on
the original development Mac.

## Product and visual coverage

| Claim or control | Functional check | Required visual/state evidence |
| --- | --- | --- |
| One coherent AA application | Navigate the complete required route journey, including direct load, back/forward, reload, and return to the original Work Folder | Every route has exactly one rail, a route-correct selected state, one AA page-body hierarchy, and no duplicated shell |
| Home and Case express the work model | Open Home, select a Case, use the project-local primary action and inspect advanced creation | Briefcase, `NEW TASK`, Active/Saved/Archived work, and secondary `New Work Folder · Advanced` hierarchy are clear |
| Mature operational routes remain real | Exercise Tasks, Automations, Pull Requests, Sessions, Agents, and representative Settings controls | Existing data/actions remain intact inside compact AA headers, sections, empty/loading/error framing, and hard-edge surfaces |
| Advanced Work Folder remains advanced | Open the mature creation route and exercise its existing controls without submission side effects | Accepted label and AA framing are present; fields/defaults remain unchanged |
| Work Folder remains the anchor | Return after route traversal, open Files/Changes/Diff/Review, switch panes, and type in xterm | Terminal stays dominant; pane layout, Task Folder title, Runtime truth, File Cabinet, and focus remain continuous |
| Pi stays fixed first | Inspect checking, available, setup-required/error, active, overflow, linked-preset, reload, and restart states | One explicit Pi primary tile remains before compatibility Employees with truthful full labels |
| Employee dispatch stays exact | Activate Pi once and a compatibility Employee once | Pi creates exactly one focused conversation with the real Task Folder title; compatibility dispatch remains `UNTRACKED` |
| Runtime and resume contracts survive | Observe real Pi `WORKING → IDLE`, cold restart, exact visible Resume, and follow-up | No stale live state; same sanitized native identity, new epoch, restored context, focused real xterm |
| Organization/output stays truthful | Create three Work Folders, produce one harmless file change, inspect output, archive and unarchive | Active/Saved/Archived projection and real changed-file count remain independent; no completion claim |
| Navigation fails closed | Inspect/activate Files on every non-Work-Folder route and use Cases from Settings | Native disabled Files explains context; no task/session/workspace is created or resumed by navigation |
| Accessibility and motion hold | Tab/Enter through rail, page actions, Roster, dialogs and Settings; enable reduced motion | Meaningful headings, visible focus, complete names, ARIA/native states, focus restoration, and no repeating AA animation |
| Required viewport fit | Review initial and densest states at 1440×800 and 1920×976 with cabinet expanded/collapsed | No fixed-shell clipping or document overflow; all rail destinations remain reachable; wider layout stays anchored |
| Development stability is practical | Measure cold shell, evidence settle, route changes, Files/Changes, Settings, return and resume focus | Sanitized observational timings; zero new AA-owned uncaught Renderer errors after clean restart |

## Exploratory/off-happy-path checks

1. Remove Pi through the disposable Agents UI, activate its first Roster tile,
   verify no terminal is created, then restore it through the same UI.
2. Retain a Pi-linked terminal preset, reorder a compatibility Employee, reload,
   and verify one Pi tile plus intact settings data and hotkey behavior.
3. Navigate rapidly between Settings and the original Work Folder, then use
   browser back/forward and confirm no stale selected rail state or auto-resume.
4. Inspect empty and error-capable mature routes at the smaller viewport and
   confirm their primary action remains discoverable without fabricated data.

## Final disposition

- The numbered real acceptance journey, three-Work-Folder workflow, restart,
  exact resume, viewport, keyboard, motion, and output checks passed. Sanitized
  results are in the sibling JSON files, route matrix, and screenshots.
- Pi `CHECKING SETUP`, available, `SETUP REQUIRED`, query-error, linked-preset,
  duplicate-suppression, and compatibility ordering remain covered by the
  Phase 4A evidence plus the final `AAPiEmployee` regression suite. The
  disposable setup was not destructively cycled during the Pi work/resume run.
- The local-only fixture could not authorize cloud Project detail or nested
  Task/Automation/PR records. Empty/error surfaces and route-family tests were
  used without fabricating product data; this limitation is recorded debt.

## Evidence safety

- Use only the repository-supported isolated profile and a disposable local Git
  fixture on this Mac.
- Commit product-only crops and sanitized summaries; omit transcripts, account
  data, absolute fixture paths, raw Workspace/terminal/session IDs, tokens, and
  environment dumps.
- Strip PNG metadata and scan evidence before commit.
- Stop the launcher and clean the guarded profile through its marker-aware
  command after acceptance.
