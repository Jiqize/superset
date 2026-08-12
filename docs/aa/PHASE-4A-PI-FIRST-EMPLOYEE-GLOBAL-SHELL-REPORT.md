# Phase 4A — Pi First-Class Employee & Global AA Shell report

## 1. Executive verdict

**PASS — Phase 4A is runnable and accepted.** Pi is now the fixed first-class
primary Employee, and one AA outer shell remains coherent across every required
V2 daily route. The AA Office v0.1 RC work model, Runtime Contract, terminal,
Git/worktree, Archive, and exact-resume semantics remain intact.

## 2. Exact baseline/final commits and environment

- Branch: `aa-spike`
- Required and confirmed baseline: `f0b7a1018c148f670de05d58cdddd3a9310ba196`
- Final Phase 4A commit: recorded in the Git handoff because a commit cannot
  contain its own SHA.
- Remote at start: `origin/aa-spike` = required baseline.
- macOS 26.4 (25E246), Apple Silicon `arm64`
- Bun 1.3.14, Node 24.14.0
- Desktop Renderer: `http://localhost:3005`
- Isolated disposable profile: `phase-4a`
- Synthetic local-only Git Briefcase
- Logical viewports: 1920×976 and 1440×800

The user's unrelated modified release-candidate PNG was copied to
`/Users/lianglei/Desktop/aa-safety-backup/01-concurrent-pi-tasks-1920x976.local-backup.png`
and only that tracked file was restored before the required fast-forward pull.
The backup remains outside the repository.

## 3. Root cause of missing Pi

New Task already chose Pi from the real Host agent configuration, but Employee
Roster projected terminal-preset rows. A machine could therefore have a valid
Pi Host config and a working Pi New Task flow without a user-created Pi preset,
causing the product's primary Employee to disappear from the Roster.

Phase 4A centralizes the presentation selector on the first ordered real Host
config whose `presetId === "pi"`. Pi no longer depends on a persisted terminal
preset, and no synthetic row is created.

## 4. Pi Roster data, launch, and dedupe contract

`selectAAPiHostConfig` selects the smallest real `order`, with config ID only as
a deterministic tie-break. The fixed Pi tile is rendered before the existing
reorderable compatibility projection and does not participate in its drag,
hide/show, or persistence behavior.

Available Pi activation calls the existing Workspace agent launcher with the
real config ID, passes the explicit Task Folder title as the real prompt, and
adds one active terminal tab. The existing TerminalPane active-state effect
continues to focus xterm. A single-flight gate coalesces simultaneous activation
events while allowing later intentional new conversations.

Dedupe is presentation-only. A compatibility preset is excluded only when the
existing `findLinkedAgent` rules resolve its `agentId` (exact config ID, then
legacy preset ID) to the selected Pi config. The filtered projection is shared
with preset hotkeys, so the linked row cannot become a hidden duplicate hotkey.
Settings data, launch-on-new-tab/workspace behavior, and the source collection
are not deleted or rewritten. Compatibility reorder reuses only their existing
tab-order slots.

## 5. Missing-Pi setup behavior

While Host config is loading, Pi remains first as `CHECKING SETUP`. With no real
Pi config it remains first as `PI · SETUP REQUIRED`; with a failed config read it
shows setup unavailable. Both non-launching states route to the existing
`/settings/agents` surface and do not guess whether the binary, extension, or
configuration is the cause.

In isolated real acceptance, deleting the Pi config through Agents settings,
then activating the Roster tile, opened Agent settings and left the terminal
count unchanged. Pi was restored through that same UI. New Task uses the shared
selector and aligned setup-required language.

## 6. Route coverage matrix before/after

| Route family | Before | After |
| --- | --- | --- |
| `/v2-workspaces` | Plain dashboard | AA Home shell + Briefcase Cabinet |
| `/project/$projectId` | Plain dashboard | AA Cases shell + mature detail |
| `/v2-workspace/$workspaceId` | Workspace-only AA | Same Work Folder inside shared shell |
| `/new-workspace` | Plain advanced page | Existing form inside AA dashboard frame |
| `/tasks*` | Plain dashboard | Existing Tasks inside AA frame |
| `/automations*` | Plain dashboard | Existing Automations inside AA frame |
| `/pull-requests*` | Plain dashboard | Existing Pull Requests inside AA frame |
| `/settings/terminal` | Separate Superset frame | Sessions inside shared AA outer shell |
| `/settings/agents*` | Separate Superset frame | Agents inside shared AA outer shell |
| `/settings/*` | Separate Superset frame | Existing Settings inside shared AA outer shell |
| V1/auth/onboarding/public | Existing non-AA | Explicitly excluded and unchanged |

The audited before/after matrices are in `docs/aa/v0.2/phase-4a/`.

## 7. Global shell architecture

`AAApplicationShell` is mounted at the authenticated layout, the smallest
common boundary above dashboard and Settings. It activates only when V2 cloud
is enabled and the pathname matches the explicit AA route contract. It supplies
one rail and one scoped hard-edge content well; dashboard and Settings keep
their existing layout owners and providers.

The dashboard layout now applies AA Briefcase/Active Tasks styling to all
required V2 dashboard routes rather than only Work Folder. Settings receives a
conditional AA body frame only under the same V2 flag. Non-Workspace routes do
not receive new Runtime, File Cabinet, pane, or xterm providers.

## 8. Navigation behavior matrix

| Control | Destination/context | Active rule |
| --- | --- | --- |
| `HOME` | `/v2-workspaces` | Home only |
| `CASES` | Toggle cabinet on dashboard; navigate/open cabinet from Settings | project, Work Folder, advanced Workspace |
| `FILES` | Open current real Work Folder Files | contextual pressed state; disabled elsewhere |
| `TASKS` | `/tasks` | Tasks family |
| `AUTO` | `/automations` | Automations family |
| `PRS` | `/pull-requests` | Pull Requests family |
| `SESS` | `/settings/terminal` | Sessions only |
| `AGENTS` | `/settings/agents` | Agents family |
| `SET` | `/settings/account` | other Settings routes |

Each button retains explicit accessible text, visible focus, and route-derived
`aria-current`. Files uses native disabled semantics and explains `Open a Work
Folder to browse files` in its title.

## 9. Clean-profile acceptance

The guarded isolated profile started without assuming a Pi terminal-preset
row. A project was imported through the real UI, then the production New Task
flow created a real Work Folder and Pi conversation from the explicit synthetic
title `Inspect README and reply PHASE4A_READY; do not modify files`.

Accepted scenarios:

1. real Pi config/no Pi terminal preset: Pi first, compatibility after it;
2. Roster Pi: one new focused conversation in the same Work Folder;
3. missing Pi: visible setup-required tile, Agent settings, no fake launch;
4. restored Pi-linked preset: one visible Pi, source settings row retained;
5. Home → Cases → Work Folder → Files → Sessions → Agents → Settings → Tasks →
   Automations → Pull Requests → Advanced Workspace → active Task;
6. expanded/collapsed Briefcase, File Cabinet, renderer navigation/reload,
   keyboard focus, and both required viewports.

Sanitized facts and product-only screenshots are indexed in
`docs/aa/v0.2/phase-4a/README.md`.

## 10. Pi and compatibility runtime results

The New Task Pi reached real `WORKING`, read the fixture, returned the harmless
marker, and settled to authoritative `IDLE`; the Worker exposed real model and
reasoning values. The Roster Pi activation added exactly one terminal, retained
the title, became active, and focused `textarea.xterm-helper-textarea`.

Codex launched through its existing compatibility preset. The UI showed Codex
and `UNTRACKED`; no Pi lifecycle/model/reasoning/resume authority leaked. Other
existing compatibility employee actions and settings remained present.

## 11. Restart/resume result

A complete Electron and Host restart restored the exact Work Folder route and
reconstructed Pi availability from current Host config. The prior Pi surface
reported `OFFLINE / RESUMABLE` and exposed `RESUME PI SESSION`. Activating that
real control restored the prior transcript/context, a focused xterm, and
authoritative `IDLE`.

The native Pi session had the same sanitized SHA-256 prefix before restart and
after resume (`b7aaaf936ba2`) with a new Runtime epoch. Raw session and epoch
identities are not committed.

## 12. Accessibility, viewports, and reduced motion

- 1920×976 and 1440×800 had no document overflow.
- Expanded and collapsed Briefcase states kept the terminal usable.
- Real pointer, Tab/Enter paths, `⌘B`, and xterm keyboard input/focus passed.
- Pi accessible names include primary status, availability, and action.
- Rail buttons expose explicit functional labels and correct current/pressed/
  disabled state.
- The existing AA reduced-motion media query covers Worker/status movement,
  shared ping/spin animations, rail transitions, and New Task motion.
- CSS contract tests ensure the shell remains scoped, hard-edged, gradient/blur
  free, and retains reduced-motion treatment.

## 13. Automated verification

Final recorded gates:

| Check | Result |
| --- | --- |
| New Phase 4A Pi/shell/CSS tests | Included in the 190-test AAOffice pass |
| Full AAOffice tests | 190 passed, 0 failed, 29 files |
| AAOffice + existing Pi bridge/wrapper regressions | 251 passed, 0 failed, 31 files |
| Existing dashboard sidebar mutations | 7 passed, 0 failed |
| Host Service tests | 1083 passed, 0 failed, 14 skipped, 8 existing TODOs |
| Desktop TypeScript | Passed (`tsc --noEmit`) |
| Host Service TypeScript | Passed (`tsc --noEmit`) |
| Workspace Client TypeScript | Passed (`tsc --noEmit`) |
| Session Protocol TypeScript | Passed (`tsc --noEmit`) |
| Root TypeScript | 37/37 Turbo tasks passed |
| Root `lint:fix` then `lint` | 6036 files clean |
| `git diff --check` | Passed |
| RED-area modification audit | Passed |
| Sensitive-evidence and PNG metadata audit | Passed |

The first `lint:fix` pass caught a Node built-in import in the new Renderer CSS
contract test. The test now uses Bun's file API; the final format/lint,
AAOffice tests, and Desktop typecheck all passed after that correction.

## 14. Files changed and frozen-boundary audit

Implementation is limited to:

- new `AAOffice/AAApplicationShell/` route presentation and wrapper;
- new `AAOffice/AAPiEmployee/` presentation, tile, and launch gate;
- existing AA rail/icon/New Task exports and scoped CSS;
- authenticated/dashboard/Settings layout composition;
- V2PresetsBar, its existing Renderer launch hook, and Workspace page wiring;
- focused AA tests and requested `docs/aa` deliverables/evidence.

No Host Service API/business file, Host database/migration, Session Protocol,
Pi bridge, Runtime registry, PTY daemon, xterm transport/rendering, Git/worktree,
Task/Archive data model, Grok activation, or Tier 2 tracking file changed.

## 15. Accepted limitations and recommended next step

The already registered Superset `DockBadgeController` render-time warning can
appear as sidebar query caches register (`PLT-01`). The mature Advanced
Workspace form can also emit controlled/uncontrolled Select warnings during
development route reload. Neither produced an uncaught Renderer error or broke
accepted behavior, and widening Phase 4A into notification/form infrastructure
would violate its boundary.

Mature page bodies still visibly carry some Superset language inside the AA
frame. This is intentional: Phase 4A establishes one coherent product shell,
not a wholesale page redesign.

Recommended next step: visually review and dogfood this checkpoint before
authorizing any narrower follow-up. Do not begin Phase 4B from this report.
