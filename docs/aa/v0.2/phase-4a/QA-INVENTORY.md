# Phase 4A QA inventory

Fixed before real Electron acceptance. Results are recorded only after the
corresponding normal user interaction has been exercised in the matched
isolated Renderer; DOM mutation and fabricated runtime state are not accepted.

| Product claim or control | Functional check | Required visual/evidence check |
| --- | --- | --- |
| Pi is the fixed primary Employee | Start with a real Host Pi config and no Pi terminal-preset row | Pi is the first Employee tile, marked `PRIMARY`, with compatibility employees after it |
| Pi is never fabricated | Remove/disable Pi config in a disposable profile, then use the Pi tile | Tile remains visible as `PI · SETUP REQUIRED`, routes to `/settings/agents`, and starts no terminal |
| Pi-linked preset is deduplicated | Add a compatibility preset linked to the same real Pi config | One Pi Employee, no duplicate launch/hotkey, underlying settings row unchanged |
| Roster Pi launch is exact and local | From a titled Task Folder activate Pi once, then try a rapid second activation | One new Pi terminal in the same Work Folder, explicit title retained, new pane active and focused |
| Pi authority remains runtime-owned | Observe the launched pane through real Pi work and settlement | Worker/Profile resolve to Pi and show authoritative `WORKING → IDLE`; no launch-only `ASSIGNED` claim |
| Compatibility behavior is preserved | Dispatch Codex or Superset CLI from the Roster | Existing terminal starts and AA reports `DISPATCHED + UNTRACKED` without Pi authority |
| Global shell covers daily routes | Navigate Home → Cases → Work Folder → Files → Sessions → Agents → Settings → Tasks → Automations → Pull Requests → Advanced Workspace → active Task | AA rail, hard-edge frame, typography, palette, and route-derived active state remain coherent |
| Context actions fail closed | Visit all non-Workspace routes and activate/inspect Files | Files is disabled with `Open a Work Folder to browse files`; no empty File Cabinet opens |
| Existing page behavior remains mature | Exercise representative controls/forms on Home, Sessions, Agents, Settings, Tasks, Automations, Pull Requests, New Workspace | Existing content/actions remain present inside the AA frame; no business surface is rewritten |
| Briefcase/sidebar remains functional | Expand/collapse/resize the dashboard sidebar, select project/Work Folder/Active Task | AA cabinet styling stays present across dashboard routes and state/selection persists |
| Terminal contract is unchanged | Type into real Pi xterm, switch panes, use Files/Changes/Diff/Review, reload Renderer | Input/focus/resize/output remain correct; File Cabinet surfaces keep prior behavior |
| Restart/resume remains exact | Full Electron/Host restart, return to saved Pi, invoke exact resume | Shell route state reconstructs; same native-session fingerprint, new epoch, functional xterm |
| Viewport and motion contracts hold | Inspect 1440×800 and 1920×976, sidebar expanded/collapsed, then emulate reduced motion | No document overflow/clipping; terminal remains anchor; no infinite AA animation under reduce |
| Accessibility remains explicit | Tab/Enter through rail, Pi, compatibility employees, setup path, settings and terminal return | Visible focus, full accessible names, `aria-current`, disabled context explanation, no icon-only loss |

## Required screenshots

1. 1920×976 Work Folder with Pi first, compatibility employees, active real Pi
   terminal, expanded Briefcase, and File Cabinet.
2. 1440×800 Work Folder with collapsed Briefcase and one usable terminal.
3. Home/Briefcase index inside the global AA shell.
4. Sessions and Agents inside the global AA shell with correct active rail state.
5. Settings and one of Tasks/Automations/Pull Requests inside the global shell.
6. Missing-Pi `SETUP REQUIRED` state in a guarded disposable configuration.

## Cleanup

- Stop the QA launcher normally.
- Do not retain tokens, raw runtime/session IDs, prompts beyond harmless test
  labels, terminal transcripts, environment dumps, or absolute disposable
  worktree paths in committed evidence.
- Keep only sanitized summaries and cropped product screenshots under this
  directory.
- Remove the disposable profile only through the guarded
  `qa:aa-runtime:clean` command after the launcher is stopped.

## Final results

| Area | Result | Evidence |
| --- | --- | --- |
| Pi fixed first / no user preset dependency | Pass | `01`, `02`, real Host config/no synthetic row |
| Missing Pi setup path / no fake launch | Pass | `08`, Agent settings route, unchanged terminal count |
| Pi-linked preset dedupe / data retention | Pass | one Pi tile; original settings row remained visible |
| Exactly-once Roster launch | Pass | one activation added one terminal; single-flight regression tests |
| Real Pi lifecycle / title carry-forward | Pass | `WORKING → IDLE`; same explicit synthetic title |
| Compatibility dispatch | Pass | `03`, Codex `UNTRACKED` |
| Route journey / contextual Files | Pass | `route-coverage-after.md`, `09`–`13` |
| Briefcase interactions | Pass | real expand/collapse/select; `04` and `05` |
| Terminal/File Cabinet | Pass | focus/input, Files/Changes/Review and unchanged xterm behavior |
| Full restart / exact resume | Pass | `06`, `06b`, `07`, `restart-resume.json` |
| Viewports / reduced motion | Pass | 1920×976 plus `04`/`05` at 1440×800 |
| Accessibility | Pass | real pointer/keyboard; explicit labels and route-derived `aria-current` |

The isolated run produced zero captured uncaught Renderer errors. The known
Superset dock-badge render-time warning (already `PLT-01`) and the mature
Advanced Workspace Select controlled-state warning were observed in developer
console output and did not block any accepted interaction.
