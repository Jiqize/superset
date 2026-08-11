# AA Daily Workflow v0.1 Checkpoint

## Status

Phase 3G is complete on baseline
`ced39d1db35dbf1d549eefa6d0b3ee1e89046b88`. The exact runnable
implementation/evidence commit is
`0ccc962d22bcd0bb833573d408c8844f392fae94`; this checkpoint and the report are
the documentation closeout immediately after it.

Pi is the accepted primary daily worker. Grok remains Tier 1 in the Runtime
Contract but authentication-gated; Phase 3F is deferred. All other visible
CLIs remain Tier 2 compatibility employees.

## Accepted daily loop

```text
Project
→ Work Folder
→ Task Folder
→ Pi TUI work
→ Files / Changes / Diff / Review
→ return to Pi
→ optional manual Tier 2 dispatch
→ leave / reload / restart
→ exact Pi resume
```

The Task Folder is lightweight pane presentation, not a task entity. Manual
dispatch carries only its explicit title and the existing shared workspace;
it does not transfer a prompt, transcript, hidden context, or agent message.

## Accepted keyboard surface

| Action | macOS shortcut |
| --- | --- |
| Focus recent AA workstation/xterm | `⌘⇧A` |
| Open Task Folder | `⌘⌥T` |
| Rename Task Folder | `⌘⌥R` |
| Open Employee Profile | `⌘⌥E` |
| Open Files | `⌘⌥F` |
| Open/toggle Changes | `⌘L` |
| Open/focus Diff workspace | `⌘⇧L` |
| Dismiss transient AA surface | `Esc` |

The AA-specific defaults are macOS-first and intentionally unbound on Windows
and Linux. They are registered in the existing hotkey system and exposed in
tooltips/accessibility labels.

## Presentation hierarchy

- Compact Worker: employee, authoritative status, reasoning/hair, compact
  model, Employee Profile affordance.
- Task Folder context: title, employee, status, real output count, resume.
- Collapsed runtime details: runtime, transport, model, reasoning, latest
  action.
- Employee Profile: runtime authority, transport, exact model/reasoning,
  health, resume, and negotiated capabilities.
- File Cabinet: existing real Files/Changes/Diff/Review surfaces.

## Runtime truth and resume

- Pi lifecycle/model/reasoning/resume remain Host-owned contract truth.
- Compatibility terminals remain `UNTRACKED` and never inherit Pi detail.
- Grok without a verified snapshot remains `NO LIVE RUNTIME` with no
  speculative capability claims.
- Exact Pi resume still requires the same native session identity and a fresh
  epoch. The Phase 3G dogfood matched the native-session fingerprint, changed
  the epoch fingerprint, preserved the Task Folder title, restored xterm
  focus, and confirmed conversation continuity.

## Verification checkpoint

- AA/V2 workflow tests: 146 passed.
- Runtime Contract/Host regressions: 54 passed.
- Pi bridge/isolated-profile tests: 6 passed.
- Session Protocol, Workspace Client, Host Service, and Desktop TypeScript:
  passed.
- Targeted Biome: passed.
- Full lint: only the two unchanged AA design JSON baseline format failures.
- Real Pi work, Files/Changes/Diff/Review, keyboard focus return, Renderer
  reload, full restart, exact resume, Tier 2 dispatch, Grok boundary, 1440×800,
  1920×976, and reduced motion: passed.

## Boundary

Phase 3G changed only AAOffice presentation and narrow V2 hotkey/pane/sidebar
composition points. It did not change PTY, xterm transport, Git/worktree
semantics, local database schema, Host lifecycle primitives, Runtime Contract,
Pi/Grok adapters, or Tier 2 lifecycle behavior.

Do not infer approval for native chat, task persistence, automatic agent
routing, orchestration, model/reasoning write controls, permissions UI,
cancellation UI, or Phase 3F activation from this checkpoint.

## Evidence

Read `PHASE-3G-PI-FIRST-DAILY-WORKFLOW-REPORT.md` and
`runtime-foundation/phase-3g/README.md`. The machine-readable evidence retains
only sanitized state and hashed runtime identity fingerprints.

## Next decision

Stop here. Review the daily shortcut vocabulary and compact Task Folder/Worker
hierarchy before authoring another phase. The next explicit brief may choose
the deferred Grok activation or a separate open-project-to-Pi friction pass.
