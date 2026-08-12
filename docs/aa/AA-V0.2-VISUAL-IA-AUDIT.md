# AA Office v0.2 visual and IA audit

## Verdict

The visible application now reads as one AA Office product rather than an AA
Work Folder embedded in otherwise unrelated Superset pages. The accepted
Runtime, terminal, Git/worktree, New Task, Active Tasks, and Archive models did
not change. Remaining mature Superset language is confined to the controls
whose underlying meaning is still Superset-specific.

The detailed before/after route record is in
`docs/aa/v0.2/phase-4b/route-matrix.md`.

## Information architecture

The v0.2 daily model is now consistently presented as:

```text
AA Office
├── Home — Briefcase and Work Folder directory
├── Cases — Briefcase Cabinet and project-local work
│   ├── NEW TASK — primary daily Pi entry
│   ├── Active / Saved / Untracked / Archived — evidence projection
│   └── Work Folders — underlying workspace infrastructure
├── Tasks — existing Superset team tasks; not AA Task Folders
├── Automations — existing scheduled work
├── Pull Requests — existing repository review data
├── Sessions — terminal/session preset infrastructure
├── Employees & Agents — Pi and compatibility configuration
└── Settings — device and workflow controls
```

Inside a Work Folder, the real terminal remains the anchor. Task Folder,
Worker, Roster, Runtime state, File Cabinet, and bottom status continue to
describe real evidence around it.

## Shared application-page hierarchy

`AAApplicationPage` supplies only a scoped presentation layer:

1. a dark functional eyebrow with restrained amber text;
2. a compact uppercase semantic page title;
3. one short, route-specific description;
4. a warm-grey inset body that preserves the mature route component;
5. hard 1–2px structure, navy selection, and squared focusable controls.

The wrapper is resolved through the existing Phase 4A route classifier and is
used by the authenticated dashboard and Settings composition. It does not own
data, routing, forms, tables, API calls, or business actions. Non-AA/V1 routes
remain unchanged.

## Visual decisions

- Reused the existing AA warm neutral, paper, inset, charcoal, navy, amber,
  green, and error palette; no new theme system was added.
- Removed the visible Automations gradient only inside the scoped AA route.
- Kept compact headers at 48px minimum height rather than adding hero space.
- Used inset/raised surfaces and one-pixel highlights instead of large shadow,
  blur, glass, texture, scanline, or CRT effects.
- Kept the mature Settings black navigation because it provides dense,
  established wayfinding; embedded its body with AA headers, frame, selection,
  and surface depth.
- Preserved explicit labels with every metaphor. Briefcase, Work Folder,
  Employee, Worker, and File Cabinet never replace functional text.

## Action and terminology hierarchy

- Project-local `NEW TASK` remains the primary daily action.
- `New Work Folder · Advanced` replaces the remaining shell-level
  `New Workspace · Advanced` copy and stays visually secondary.
- Home now says `Work Folder Directory`, `Search work folders…`, and
  `All briefcases` without renaming underlying models.
- Tasks explicitly states that existing team tasks/issues are separate from AA
  Task Folders.
- Sessions and Employees & Agents describe the actual mature configuration
  surfaces instead of claiming an AA-owned runtime manager.

## Navigation audit

The rail retains exactly one destination per application function. The Cases
button is both a route destination and a pressed cabinet control. Phase 4B
separates these states so Home is current only when appropriate, Cases is
current while the cabinet is the active Home sub-surface, and a persisted open
cabinet cannot steal `aria-current` from Tasks, Automations, Pull Requests,
Sessions, Agents, or Settings.

`FILES` continues to fail closed outside a real Work Folder using native
disabled semantics. No rail action launches, resumes, archives, or creates
work.

## Density and viewport result

Both 1440×800 and 1920×976 passed without document-level horizontal overflow.
The small viewport kept every rail destination, page header, primary action,
and mature body usable. The wide viewport remained anchored rather than
stretching into oversized decorative gaps. Existing Work Folder pane layout
continued to resize xterm correctly.

## Accessibility result

- Shared AA titles are semantic headings and label their page sections.
- Route buttons expose full labels and one current destination.
- Pi keeps its full availability/action name even when visual text truncates.
- Tab navigation and visible focus passed on rail and mature actions.
- Dialog and terminal workflows restored real xterm focus.
- Color is accompanied by explicit lifecycle/selection text.
- Reduced motion collapses repeating AA animations and transitions to one
  effectively instantaneous iteration.

The legacy File Cabinet tab state lacks explicit `aria-selected`/`aria-pressed`
semantics; this is recorded in the v0.2 debt register instead of being silently
claimed fixed.

## Accepted boundary

Mature forms still use terms such as Project, Workspace, agent, terminal
preset, and Superset when those are the real underlying controls. Advanced Work
Folder creation keeps its mature form and defaults. Nested Tasks, Automations,
and Pull Request bodies were unavailable without fabricating fixture data.
These choices preserve product truth and keep Phase 4B out of Runtime, Host,
PTY, xterm, Git/worktree, task-model, and archive-model architecture.
