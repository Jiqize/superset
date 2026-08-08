# AA Office Design System v0.1

Status: design specification for Phase 1
Scope: macOS-first, Pi-first AA Terminal Office Shell
Implementation rule: preserve Superset runtime infrastructure; redesign the Renderer and presentation layer only.

## 1. Product character

AA Office should feel like a serious coding workstation presented through the visual language of a late-1990s corporate office system. The product should be dense, precise, slightly dry, quietly humorous, and immediately recognizable.

The visual reference is not a literal Windows 95 clone. The target is a modern interpretation of old enterprise software: hard edges, inset panels, compact controls, dark charcoal outlines, muted greys, deep navy selection states, amber activity lights, pixel-office objects, and small animated workers.

The terminal remains real. The office shell explains and organizes the work around it.

Primary product sentence:

> A real coding-agent terminal running inside a tiny pixel office.

## 2. Core principles

### 2.1 Function before decoration

Every visual metaphor should map to a real product concept or runtime state. Avoid decorative game mechanics, fake progress, invented workload, fake emotions, XP, coins, levels, or arbitrary simulation data.

### 2.2 The terminal stays honest

Pi continues to run in a real PTY/TUI. The shell may frame, label, resize, or contextualize it. Do not visually rewrite the terminal transcript unless a later native Pi adapter exists.

### 2.3 Pixel art is a representation layer

Pixel workers, office objects, lights, folders, and briefcases explain state. They should remain secondary to text, terminal output, diff, files, and actions.

### 2.4 Compact desktop density

Use 4, 8, 12, and 16 px spacing increments. Avoid oversized cards, giant headings, excessive empty space, large radii, glassmorphism, gradients, floating SaaS cards, or soft consumer-app styling.

### 2.5 Real states only

Animated states must come from actual Superset/Pi lifecycle events where possible.

Examples:

- SessionStart -> worker arrives / online
- UserPromptSubmit -> thinking / active
- PostToolUse -> working / tool activity
- Stop -> idle / completed current action
- SessionEnd -> offline
- verified error -> error state

## 3. Product-object mapping

| Superset / runtime concept | AA Office object | Meaning |
|---|---|---|
| Project | Briefcase | One codebase / main working case |
| Workspace | Folder / desk folder | Active isolated working space |
| Worktree | Folder copy / duplicate tab | Git-isolated variation of a workspace |
| Agent runtime | Worker identity | Pi, Codex, Grok, Claude, etc. |
| Model | Worker persona / face / badge | Model identity inside a runtime |
| Reasoning level | Hair / cognitive strain modifier | User-selected reasoning intensity |
| Agent session | Work session | One continuing unit of work |
| Terminal | CRT workstation | Real TUI/PTY surface |
| Files | Filing cabinet | Repository file access |
| Changes | Stack of marked papers | Files changed by the agent |
| Diff | Two-page comparison | Exact code delta |
| Browser preview | Secondary monitor | Visual output / preview |
| Approval | Paper awaiting signature | Explicit user decision |
| Completed | Filed/stamped document | Finished work |
| Running | Amber desk/status light | Active computation |
| Error | Red status light / scattered paper | Verified failure |

## 4. Visual language

### 4.1 Color

Use the tokens in `docs/aa/design/tokens.json` as the source of truth.

Core palette:

- Canvas: warm neutral grey
- Panel: light office grey
- Raised surface: off-white grey
- Border: charcoal / near black
- Text: near black
- Muted text: medium grey
- Selection: deep navy
- Selection text: off-white
- Working: amber
- Success: muted green
- Error: dark red
- Offline: cool grey

Color should be sparse. Most of the interface stays monochrome. Color primarily communicates selection and status.

### 4.2 Borders

Primary borders are 1 px or 2 px. Use hard rectangular geometry.

Recommended structure:

- outer frame: 2 px dark
- inner highlight: 1 px light
- inset content: 1 px darker internal edge

Avoid smooth shadows. If depth is needed, use hard 1-2 px offset shadows or inset highlight lines.

### 4.3 Radius

- default: 0 px
- small control exception: 2 px maximum
- avatars may use square frames or 2 px clipped corners

Do not use modern 8-16 px card radii in the AA shell.

### 4.4 Typography

Use a two-font strategy:

1. UI text: system sans or existing Superset UI font for readability.
2. Labels/status/compact chrome: pixel or monospace display face where appropriate.

Do not render long body text, code, or dense settings forms in a bitmap font.

Recommended hierarchy:

- Window/system label: 11-12 px mono/pixel
- Section label: 11-12 px semibold sans/mono
- Body/control text: 12-13 px sans
- Terminal: existing terminal font/settings
- Large marketing-style headings: avoid inside the product shell

All text must remain legible at macOS Retina scaling.

### 4.5 Spacing

Base grid: 4 px.

Common spacing:

- control internal padding: 4 x 8
- compact row gap: 4
- standard row gap: 8
- panel gap: 8
- major region gap: 12 or 16

The interface should feel like a workstation, not a dashboard presentation.

## 5. Window anatomy

Recommended Phase 1 shell:

```text
┌────────────────────────────────────────────────────────────┐
│ AA OFFICE   💼 Project Name                PI ● WORKING    │
├──────────┬─────────────────────────────────────────────────┤
│ Global   │ Workspace Header                                │
│ Rail     ├─────────────────────────────────────────────────┤
│          │ Worker Strip / Task Context                     │
│ Home     ├─────────────────────────────────────────────────┤
│ Briefcase│                                                 │
│ Archive  │                REAL PI TUI                      │
│ Messages │                                                 │
│ Agents   │                                                 │
│ Settings ├─────────────────────────────────────────────────┤
│          │ Files | Changes | Diff | Browser | Terminal     │
├──────────┴─────────────────────────────────────────────────┤
│ WORKSPACE: aa   PI: ACTIVE   3 FILES CHANGED   LOCAL       │
└────────────────────────────────────────────────────────────┘
```

The central terminal receives the largest area. Pixel characters should never permanently consume large working space.

## 6. Global navigation rail

Inspired by vertical office-tool buttons.

Phase 1 items:

1. Home
2. Briefcases / Projects
3. Archive / Workspaces
4. Messages / Sessions
5. Agents
6. Settings

Behavior:

- fixed width: 48-56 px
- icon-first
- square cells
- selected item uses deep navy fill
- tooltip provides clear text label
- avoid badges unless they represent real state/counts

Suggested objects:

- Home -> office/home icon
- Projects -> briefcase
- Archive -> filing cabinet
- Sessions -> speech bubble
- Agents -> worker/robot head
- Settings -> gear

## 7. Project and workspace representation

### 7.1 Project = Briefcase

A project is represented as a brown pixel briefcase. The briefcase may have a small tag or light indicating state.

States:

- closed: normal project
- open: currently active project
- amber lamp: active work running
- greyed: unavailable / missing

Do not animate the briefcase continuously.

### 7.2 Workspace = Folder

Inside a project, workspaces appear as folders or labeled office files.

A worktree should visually look like a sibling/duplicate folder with a branch marker, not like a separate product concept.

## 8. Agent character system

### 8.1 Character size

Default UI avatar sizes:

- 24 px: compact list
- 32 px: standard picker/sidebar
- 48 px: status strip / focus state
- 64-96 px: temporary detail/empty-state illustration only

Avoid full-screen character art in normal workflows.

### 8.2 Character anatomy layers

Treat the worker as a composable sprite system:

```text
base body
+ face/model identity
+ hair/reasoning state
+ role clothing/badge
+ runtime badge
+ activity pose
+ optional status prop
```

Do not create a separate hand-painted sprite for every combination.

### 8.3 Reasoning represented by hair

Hair is a playful secondary cue for the user-selected reasoning level. The explicit text label remains visible.

Suggested mapping:

- Low / Quick: full neat hair
- Medium: normal hair
- High: receding hairline
- Very High: sparse hair
- Max: mostly bald with one or two pixels of hair

Important: hair reflects a selected reasoning level, not hidden chain-of-thought content.

### 8.4 Runtime/activity states

Phase 1 supports five visible worker states:

#### Idle
Neutral posture. Grey status light.

#### Thinking
Hand near chin / subtle head movement. Amber light.

#### Working
Typing at CRT. Four-frame loop. Amber blinking light.

#### Waiting
Holding a paper / looking toward user. Blue or neutral attention indicator.

#### Error
Hands to head or a small scattered-paper cue. Red light.

Animation should be low-frame-rate pixel animation, generally 4-8 frames at 4-8 fps.

Respect `prefers-reduced-motion`.

## 9. Status lights

Use tiny square or circular lights as an additional state channel.

- grey -> idle/offline
- amber -> thinking/running/tool activity
- green -> completed/healthy
- red -> verified error
- blue -> waiting for user input/attention

Status lights must never imply success or failure without a real signal.

## 10. Terminal frame

The Pi TUI should remain the visual center.

Treatment:

- dark terminal remains visually dark
- wrap inside an office CRT/workstation frame only at the perimeter
- retain terminal selection, mouse, resize, keyboard, scrollback, and accessibility behavior
- do not rasterize terminal content
- do not add overlays that block text

The contrast between the monochrome/pixel office shell and the real terminal is intentional.

## 11. Panels, buttons, tabs, inputs

### 11.1 Panel

- rectangular
- 1-2 px hard border
- optional inset highlight
- neutral grey fill
- title integrated into frame or top strip

### 11.2 Button

Default:

- rectangular
- 28-32 px height for standard controls
- compact variants allowed
- hard pressed state using 1 px offset/inset shift
- icon buttons square

### 11.3 Tabs

Tabs should feel like file-folder tabs or old system tabs.

Selected tab:

- merged visually with content surface
- darker text / stronger border

Inactive tabs:

- slightly darker neutral fill

### 11.4 Inputs

Inputs should remain highly usable and modern internally, with old-system framing outside.

Do not fake bitmap text fields. Use native HTML/React input behavior.

### 11.5 Scrollbars

If custom scrollbars are introduced, use a compact old-system treatment with square arrow buttons and a visible thumb. Do not compromise native scrolling behavior or accessibility.

## 12. Icon system

Icons should be pixel-authentic in silhouette but implemented as scalable SVG or CSS where possible.

Rules:

- 16, 20, 24, 32 px targets
- integer coordinates
- `shape-rendering="crispEdges"`
- no antialiased diagonal complexity unless unavoidable
- mostly monochrome charcoal
- one accent color only for actual state

Initial icon vocabulary:

- home
- briefcase
- filing cabinet
- speech bubble
- agent head
- gear
- folder
- CRT monitor
- paper stack
- diff pages
- browser monitor
- status lights

Reference sheet: `docs/aa/design/aa-office-icon-sheet.svg`

## 13. Motion

Motion is used for state, not decoration.

Allowed:

- 4-frame typing loop
- subtle thinking loop
- one-time briefcase opening when activating a project
- short status-light blink
- paper handoff for an actual approval/handoff event

Avoid:

- floating particles
- idle bouncing everywhere
- constant decorative animations
- fake progress bars
- large cinematic office scenes during normal work

## 14. Accessibility

The pixel metaphor must always have a textual equivalent.

Requirements:

- icon buttons have labels/tooltips/aria-labels
- status colors are paired with text or shape
- keyboard navigation preserved
- high-contrast terminal preserved
- `prefers-reduced-motion` supported
- minimum hit target 28 px desktop, preferably 32 px
- no essential information encoded only through hair, animation, or color

## 15. Design tokens

Source of truth:

`docs/aa/design/tokens.json`

During Phase 1, tokens may first be consumed locally in the AA Renderer experiment. Do not replace Superset global theme architecture until the PoC is approved.

## 16. Asset package

Initial v0.1 design assets:

- `docs/aa/design/tokens.json`
- `docs/aa/design/assets-manifest.json`
- `docs/aa/design/aa-office-icon-sheet.svg`
- `docs/aa/design/aa-agent-state-sheet.svg`

These are reference/implementation assets for the PoC. They can later move into a production asset package after the component architecture is confirmed.

## 17. Phase 1 component kit

Build the first UI kit around these components:

```text
AAWindowFrame
AAPanel
AAButton
AAIconButton
AATabs
AAStatusLight
AABriefcaseIcon
AAFolderIcon
AAAgentAvatar
AAAgentStatus
AATerminalFrame
AABottomStatusBar
```

Do not create a large abstract design-system framework. Build only what Phase 1 uses.

## 18. Phase 1 visual scope

Phase 1 should redesign only:

1. App shell / chrome
2. Global navigation rail
3. Workspace header
4. Agent identity/status strip
5. Terminal outer frame
6. Bottom status bar
7. Existing Files/Changes/Diff/Browser/Terminal controls at the presentation layer

Keep the real terminal and existing runtime behavior unchanged.

## 19. Anti-patterns

Reject implementations that look like:

- generic SaaS dashboard with pixel icons
- game HUD
- RPG stats panel
- Windows 95 clone for nostalgia alone
- oversized pixel illustration occupying half the editor
- fake office simulation
- cartoon employee management game
- soft rounded AI assistant UI
- neon cyberpunk terminal theme

The desired result is a credible developer tool with a distinctive office metaphor.

## 20. Acceptance criteria for the first visual PoC

A successful first PoC should satisfy all of the following:

- the terminal is still fully usable
- Superset runtime behavior is unchanged
- the product is recognizable as AA Office within one screenshot
- Project, Workspace, Agent, and Agent State have clear office metaphors
- the interface remains compact and productive
- pixel art does not overwhelm the code/tooling surfaces
- a new user can still understand what is clickable and what state the agent is in
- no fake runtime information is displayed

After the PoC, evaluate the visual system before expanding into native Pi chat, multi-agent orchestration, or large animation systems.
