# Phase 3G — Pi-first Daily Workflow Report

## 1. Executive verdict

Phase 3G is complete and accepted. AA's existing Pi-first work model is now
materially faster to use with a keyboard while preserving the accepted chain:

> Project → Workspace → Task Folder → Employee → Output

The real Pi TUI remains the working surface. This phase adds no task database,
native chat, orchestration, runtime adapter, polling loop, or transcript
retention. Phase 3F Grok activation remains explicitly deferred.

## 2. Baseline, final revision, and environment

The branch was fast-forwarded from `origin/aa-spike`, and commit
`ced39d1db35dbf1d549eefa6d0b3ee1e89046b88` was confirmed as the exact Phase
3G baseline. The final runnable source and safe-evidence revision is
`0ccc962d22bcd0bb833573d408c8844f392fae94`; this report and the checkpoint are
committed immediately after it as the documentation closeout.

| Item | Value |
| --- | --- |
| Host | macOS 26.4, Apple Silicon (`arm64`) |
| Bun / Node | 1.3.14 / 24.14.0 |
| Git | 2.50.1 (Apple Git-155) |
| Pi | 0.82.1 |
| Codex / Grok | 0.144.6 / 0.2.87 (`0ae0bf47e53`) |
| Primary QA viewport | 1440×800 logical pixels |
| Secondary viewport | 1920×976 logical pixels |
| QA state | Disposable `phase-3g` profile and disposable Git projects |

## 3. Before/after daily workflow audit

The audit used real Electron pointer/key input and an isolated profile.
Interaction groups are reported to show repeated friction, not as an arbitrary
score.

| Workflow | Before | After | Decision |
| --- | --- | --- | --- |
| Open project → usable Pi | 7 groups | 7 groups | Unchanged; a reduction was not safely Renderer-local. |
| Rename Task Folder | double-click, edit, confirm | `⌘⌥R`, edit/confirm | Removes pointer travel and restores xterm on keyboard dismissal. |
| Inspect Task Folder | open, dismiss, re-focus terminal | `⌘⌥T`, `Esc` | Two groups; xterm focus returns automatically. |
| Inspect Employee Profile | open, dismiss, re-focus terminal | `⌘⌥E`, `Esc` | Two groups; originating xterm/control focus is restored. |
| Open Files | distant tab click | `⌘⌥F` | Same action count, no pointer travel. |
| Open Changes | distant tab click | `⌘L` | Opens Changes; a second `⌘L` closes it. |
| Open a changed-file Diff | click a real changed row | unchanged | AA does not guess which output is current. |
| Return from Diff to Pi | terminal picker or pane click | `⌘⇧A` | One deterministic action targets the recent terminal and real xterm input. |
| Resume after full restart | one primary action | one primary action | Action count retained; context and hierarchy clarified. |

The main pre-change duplication was runtime/transport/authority/resume repeated
between Worker and Task Folder. The 208 px Worker card also competed with the
header at 1440×800.

## 4. Task Folder ergonomics

- The compact Task Folder remains attached to its real terminal workstation.
- `⌘⌥T` opens its context and `⌘⌥R` starts direct rename only for the active
  terminal pane.
- Pointer or keyboard opening captures a real xterm input as the workflow
  origin. `Esc` or keyboard rename completion restores that connected input;
  a normal control-origin open retains Radix's standard focus behavior.
- Primary facts are now Employee, Status, Output, and Resume. Runtime,
  transport, model, reasoning, and latest action live in an accessible,
  collapsed `RUNTIME DETAILS` disclosure.
- The duplicated File Cabinet footer was removed.
- The explicit title `Build line report utility` survived Diff/File activity,
  Renderer reload, Tier 2 dispatch, full Electron/Host restart, and exact Pi
  resume.

No prompt, transcript, terminal history, priority, due date, inferred progress,
or persistent task record was introduced.

## 5. Worker and Employee Profile ergonomics

The compact Worker surface now prioritizes identity, authoritative status,
runtime-backed Reasoning Hair/value, and compact model identity. Deep runtime,
transport, resume, health, and capability detail remains in Employee Profile.
The card width is 190 px instead of 208 px, and the profile affordance is
slightly larger and exposes its shortcut.

Employee Profile is controlled and keyboard accessible. Closing a profile
opened from xterm restores xterm; closing one opened from a roster control
returns to that control. Tier 2 profiles remain `UNTRACKED`. Grok without a
verified live snapshot remains `NO LIVE RUNTIME` and shows no speculative
capabilities.

## 6. Output inspection and focus return

Files, Changes, Diff, Review, file trees, Git status, and Diff rendering remain
the existing Superset surfaces. Phase 3G only adds discoverable access and
focus composition:

- `⌘⌥F` opens Files and preserves terminal focus;
- `⌘L` opens/switches to Changes and toggles it closed when already selected;
- existing `⌘⇧L` opens/focuses the Diff workspace without selecting an
  invented file;
- `⌘⇧A` focuses the most recently active terminal pane, falling back to the
  active tab and then another real terminal, before focusing its xterm helper
  textarea.

The dogfood pass verified three final product files through Files, Changes,
and Diff. Review truthfully retained `NO GITHUB REPO`. The live pre-restart
count briefly included a fourth Pi-owned task-metadata entry; after resume the
File Cabinet truthfully showed the three product outputs.

## 7. Resume UX consolidation

An offline resumable Pi workstation now presents one primary action with:

- the explicit Task Folder title;
- `PI · RESUMABLE · SAVED CONVERSATION`;
- no raw session UUID, epoch, or transport ID.

The existing exact native-session resume path is unchanged. The real UI showed
`STARTING` while identity confirmation was pending, then returned to the Pi
TUI in `IDLE` with xterm focused. The native-session fingerprint remained
`c8cedff76340`; the epoch fingerprint changed from `fe487a54b5c0` to
`4754c2ef0307`. A follow-up question recovered the harmless prior completion
marker, proving conversation continuity.

## 8. Workspace and navigation result

The selected Briefcase/Work Folder remained visible at 1440×800. Navigating to
Home and selecting the prior `local` Work Folder returned predictably to the
same AA workspace and Task Folder. At 1920×976 all primary surfaces remained
visible with no document-level horizontal overflow. No launcher, recent-work
algorithm, project model, workspace model, or worktree behavior changed.

## 9. Final keyboard workflow

| Action | Shortcut | Scope |
| --- | --- | --- |
| Focus recent AA workstation/xterm | `⌘⇧A` | macOS V2 workspace |
| Open active Task Folder | `⌘⌥T` | active AA terminal |
| Rename active Task Folder | `⌘⌥R` | active AA terminal |
| Open active Employee Profile | `⌘⌥E` | active AA worker |
| Open File Cabinet Files | `⌘⌥F` | macOS V2 workspace |
| Open/toggle File Cabinet Changes | `⌘L` | existing shortcut, refined behavior |
| Open/focus Diff workspace | `⌘⇧L` | existing shortcut |
| Dismiss transient card | `Esc` | existing platform behavior |

The five new AA chords are macOS-first, explicitly registered, tested against
duplicate shipped chords, and shown in tooltips/accessibility labels. Windows
and Linux remain unbound rather than receiving speculative defaults.

## 10. Information-density decisions

- Worker width reduced from 208 px to 190 px.
- Reasoning remains explicit and visually primary; model is quieter.
- Runtime/transport/authority/resume duplicates were removed from the compact
  Worker surface.
- Task Folder deep runtime facts are collapsed behind `RUNTIME DETAILS`.
- Resume time was removed from the primary banner because it competed with
  the action and added no identity assurance.
- Existing AA hard edges, palette, Pixel Worker, Briefcase, Roster, File
  Cabinet, terminal frame, and bottom status bar were retained.

No visual redesign, new asset family, animation engine, gradient, blur, CRT
filter, or decorative scene was added. With reduced motion emulated, all 37
queried AA worker/status candidates had no active CSS animation.

## 11. Real Pi-first dogfood

Through the real UI, Pi was launched in a disposable local Git project and
given a harmless line-report utility task. Pi asked its real TUI questions,
received approval through the TUI, and created:

- `line_report.ts`;
- `line_report.test.ts`;
- `README.md`.

The fixture's real `bun test` result was 9 passed, 0 failed. AA observed real
`WORKING → IDLE`, model `Gemini 3.5 Flash`, reasoning `high`, and matching
Reasoning Hair. The journey then covered Files, Changes, Diff, keyboard return,
Employee Profile, Renderer reload, full Electron/Host restart, exact resume,
context-continuity follow-up, and 1440×800 density.

macOS discovered the Electron process but did not expose its accessibility
window tree. The allowed fallback used Chromium's debugging protocol to
dispatch actual pointer/key input. It never invoked DOM `.click()` or a private
product method. Public Host Service calls were limited to sanitized snapshot
reads and disposable-project cleanup.

## 12. Tier 2 and Grok regressions

Superset CLI was launched once through Employee Roster. It carried the exact
Task Folder title and showed `DISPATCHED` plus `UNTRACKED`; it did not inherit
Pi model, reasoning, lifecycle, or capability authority. Returning to the
original Pi tab restored Pi's runtime-backed presentation.

Grok was not launched and no credential was entered. Its profile truthfully
showed `GROK BUILD`, `ACP`, `NO LIVE RUNTIME`, `NOT CONNECTED`, and unavailable
capability evidence. `PHASE-3F-GROK-TIER1-ACTIVATION.md` remains untouched.

## 13. Automated verification

| Command or suite | Result |
| --- | --- |
| AAOffice + hotkey registry + terminal-focus tests | 146 passed, 0 failed |
| Runtime Contract + Host registry/router/resume/Grok regressions | 54 passed, 0 failed |
| Pi bridge + isolated QA profile | 6 passed, 0 failed |
| Session Protocol TypeScript | Passed |
| Workspace Client TypeScript | Passed |
| Host Service TypeScript | Passed |
| Desktop TypeScript, including generated icons/routes | Passed |
| Targeted Biome over 20 changed AA/V2 files | Passed |
| Full `bun run lint` | Baseline-only failure: unchanged `docs/aa/design/assets-manifest.json` and `docs/aa/design/tokens.json` require formatting |
| `git diff --check` | Passed |
| RED-area and sensitive-evidence scans | Passed |

The development console retained the known Electric HTTP/1.1 advisory and
`DockBadgeController` render-time update warning. The Electric proxy exited
once during the long dogfood run and produced one transient CORS error; it was
restarted without changing product code. Viewing an untracked Diff also
produced the existing missing-cache-key advisory. No new Phase 3G application
error was found after a clean full restart.

## 14. Security and RED-area review

No PTY daemon, xterm transport/rendering, Git/worktree semantics, database
schema, Host lifecycle primitive, runtime adapter, Runtime Contract, or Tier 2
lifecycle file was modified. Runtime truth still comes only from the accepted
Pi/Host contract; xterm output is never parsed for status.

Evidence contains only disposable names and safe runtime projections. Raw
native session, epoch, terminal, workspace, and project IDs are omitted;
resume identities appear only as 12-character SHA-256 fingerprints. No
credential, environment dump, prompt transcript, or tool payload is retained.

## 15. Known limitations

1. Initial project/workspace/Pi setup remains seven interaction groups; safely
   reducing it requires a separately scoped product decision, not a Renderer
   shortcut.
2. `⌘⇧L` can open the Diff workspace, but AA intentionally does not guess a
   changed file. The user still selects a real output row.
3. Task Folder remains pane presentation state, not a task entity or durable
   project-management record.
4. AA-specific shortcuts are macOS-first in v0.1; Windows/Linux are unbound.
5. Tier 2 employees remain compatibility terminals without runtime-contract
   authority or exact-resume guarantees.
6. Grok authenticated activation remains deferred until the user can
   authenticate the machine.

## 16. Recommended next phase

Do not start another phase automatically. The recommended next review is a
short daily-use acceptance of the shortcut vocabulary and Task Folder density.
If accepted, the next implementation brief should decide between the deferred
Grok authentication activation and a narrowly scoped open-project-to-Pi
friction pass. Neither requires changing the accepted Pi runtime foundation.

## Evidence and cleanup

Safe screenshots and the sanitized acceptance projection are in
`docs/aa/runtime-foundation/phase-3g/`.

The disposable projects were removed through Host Service. Their fixture
directories and one modified audit worktree were moved to the macOS Trash and
remain recoverable. The guarded `phase-3g` profile was cleaned, and Electron,
Host Service, PTY daemon, API, and Electric proxy QA processes were stopped.
