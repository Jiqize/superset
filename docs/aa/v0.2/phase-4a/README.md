# Phase 4A safe evidence

Baseline: `f0b7a1018c148f670de05d58cdddd3a9310ba196`

This directory contains the reproducible, sanitized evidence for the Pi-first
Employee and global AA shell acceptance. The real run used an isolated desktop
profile and a synthetic local Git fixture. No production profile was read or
changed.

## Evidence index

- `route-coverage-before.md` — route/layout audit captured before implementation.
- `route-coverage-after.md` — final route, rail, sidebar, and context-action matrix.
- `QA-INVENTORY.md` — fixed acceptance inventory and final results.
- `acceptance-summary.json` — sanitized real Electron acceptance facts.
- `restart-resume.json` — truncated one-way identity proof for exact Pi resume.
- `screenshots/` — product-only crops from the real Electron run.

## Screenshot index

| File | Evidence |
| --- | --- |
| `01-pi-primary-working-roster.png` | Pi fixed first, `PRIMARY`, real `WORKING` Worker state |
| `02-pi-new-conversation-roster.png` | second explicit Roster launch in the same Work Folder |
| `03-codex-compatibility-untracked.png` | compatibility employee remains `UNTRACKED` |
| `04-expanded-shell-reduced-motion-1440x800.png` | 1440×800 expanded Briefcase and reduced-motion layout |
| `05-collapsed-shell-reduced-motion-1440x800.png` | 1440×800 collapsed Briefcase, terminal remains the anchor |
| `06-full-restart-pi-saved-resumable.png` | full-restart `OFFLINE / RESUMABLE` Worker truth |
| `06b-full-restart-resume-control.png` | exact `RESUME PI SESSION` action |
| `07-exact-pi-resume-restored.png` | resumed Pi returns to authoritative `IDLE` |
| `08-pi-setup-required.png` | missing real Pi config remains first as `SETUP REQUIRED` |
| `09-home-global-shell.png` | Home/Briefcase index inside the AA outer shell |
| `10-settings-global-shell.png` | mature Settings navigation inside the AA outer shell |
| `11-sessions-global-shell.png` | Sessions route-derived rail state |
| `12-agents-global-shell.png` | Agents route-derived rail state and existing setup content |
| `13-tasks-global-shell.png` | Tasks content inside the AA dashboard frame |

The crops intentionally omit terminal transcripts, absolute paths, raw
Workspace/terminal/session identifiers, account fields, tokens, and private
repository content. PNG metadata was stripped during deterministic cropping.
