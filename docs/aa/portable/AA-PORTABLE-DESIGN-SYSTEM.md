# AA Portable Design System v0.1

Status: Phase 5A framework-neutral contract. This document does not declare an independent package license and does not authorize copying current Superset-adapted implementation code. Provenance is normative in [AA-ASSET-PROVENANCE.md](./AA-ASSET-PROVENANCE.md).

## Product character

AA Office makes software work legible through an office metaphor: briefcases contain work, folders preserve task continuity, employees perform work at visible workstations, paper records approvals, and a file cabinet holds inspection detail. It should feel compact, capable, slightly mechanical, and calm under load.

The visual thesis is a late-1990s office workstation specimen: warm grey hard-edge surfaces, a charcoal structural grid, sparse navy/amber signals, original pixel workers, and terminal or conversation data given priority over decoration.

## Governing rules

1. Function precedes decoration. A metaphor may clarify an action or durable object; it may not conceal it.
2. State is truthful. Color, hair, motion, labels, and progress are projections of authoritative data, never guesses from elapsed time or optimistic UI.
3. Dense does not mean cramped. Information groups use the 4 px grid while interactive hit areas remain at least 44 by 44 CSS pixels when used as primary pointer targets.
4. Depth is hard-edged. One-pixel highlights, one- or two-pixel borders, and stepped shadows establish hierarchy. Blur and glass effects are out of character.
5. The portable layer defines visual roles and presentation contracts only. Hosts own routing, persistence, networking, authorization, process control, and domain events.

## Token architecture

`tokens/core.tokens.json` is the stable primitive layer. `tokens/semantic.tokens.json` assigns primitives to product roles. Platform mappings are adapters, not token sources:

```text
core primitive -> portable semantic role -> host mapping or scoped skin fallback
```

Consumers must not use a Superset or DSH variable as an AA semantic name. Unsupported host roles remain explicit and receive a plugin-scoped AA custom property; they are never mapped to a vaguely similar host meaning.

## Color and surface hierarchy

| Level | Semantic role | Use |
| --- | --- | --- |
| 0 | `application.canvas` | Lowest application field and empty workspace |
| 1 | `shell.surface` | Navigation and persistent shell furniture |
| 2 | `surface.inset` | Wells, inputs, trays, and recessed regions |
| 3 | `surface.raised` | Panels, buttons, folders, and foreground tools |
| Edge | `border.strong` | Major containment and selected-object silhouettes |
| Edge | `border.soft` | Internal separators and quiet structure |

Selection uses navy plus light text. Amber means authoritative activity or caution, never general emphasis. Blue means waiting or requested attention. Green and red are reserved for success and error. Offline is neutral grey and must also use a disconnected shape and visible text.

Object colors—paper, workstation, briefcase, and folder—belong to the metaphor layer. They do not substitute for status colors.

## Depth

- Raised controls use a light top/left inset edge and dark bottom/right edge.
- Pressed controls swap those edges and may move content by one pixel.
- A focused control keeps its existing depth and adds a two-pixel external focus ring.
- Panels use square corners by default. Two- or four-pixel radii are permitted only where clipping or host composition requires them.
- Only one foreground surface per region should cast a hard two-pixel shadow.

## Grid and density

The base unit is 4 px. Common gaps are 4, 8, 12, 16, 24, and 32 px. Icons are drawn on a 24-unit integer grid and render at 16, 20, 24, or 32 px. Worker art is authored in 48-unit cells and renders at 24, 32, or 48 px.

Compact visual controls may be 24 or 32 px tall when they sit inside a larger labelled row. Standalone pointer targets and icon-only actions provide a 44 px hit area, even when the visible glyph is smaller.

## Typography

The default UI stack is the host system sans stack; structured identifiers, paths, timestamps, and terminal output use a system monospace stack. No portable asset depends on a downloaded font.

| Role | Size | Weight | Guidance |
| --- | ---: | ---: | --- |
| Micro metadata | 10 px | 400 | Nonessential metadata only; never status by itself |
| Caption | 11 px | 400/700 | Object labels and compact state text |
| Body | 12 px | 400 | Dense primary content |
| Label | 13 px | 700 | Controls and section headers |
| Title | 16 px | 700 | Panel or object title |
| Display | 24 px | 700 | Rare gallery or empty-state heading |

Text is never rasterized into icon assets. Visible state text is not replaced by tooltip-only copy.

## Icon system

Icons use integer geometry, square endpoints, solid silhouettes, and a 4 px structural rhythm. Status icons pair color with distinct geometry. Product icons are original AA clean-room redraws documented in the manifest. They are not wrappers around host icon components.

At runtime, decorative instances use empty alternative text. Standalone meaningful instances use their localized semantic label. Icon-only controls require an accessible name supplied by the component contract.

## Worker system

Workers are assembled from a small set of layers rather than one file per combination:

```text
base anatomy
+ persona appearance
+ reasoning hair
+ authoritative activity overlay
+ optional office prop
```

Persona is presentational and must not infer protected traits, skill, seniority, model quality, or availability. Hair is a redundant reasoning indicator; the model/reasoning label remains visible. Activity overlays require authoritative runtime state and a text fallback.

## Objects

- Briefcase: host-level collection of work, never a decorative global container.
- Task Folder / Work Folder: durable unit of conversational or task continuity.
- Workstation: live work surface; its terminal styling does not imply a shell exists.
- File Cabinet: inspectable details, files, or history—not a place to hide required controls.
- Approval Paper: structured pending decision with explicit outcome controls.
- Deliverable Tray: verified produced output with origin and location; it is not inferred from prose.

## Motion

Motion follows `motion/motion-spec.json`. The normal working indicator uses two stepped frames at no more than 2.5 fps and runs only while authoritative state is working. Panel and control transitions finish within 160 ms. Attention motion is bounded and does not loop indefinitely.

Under `prefers-reduced-motion: reduce` or `data-aa-motion="reduce"`, transitions become immediate and activity becomes a static shape plus text. Status meaning must remain unchanged.

## Accessibility

- Preserve a logical heading structure, landmark structure, and DOM reading order.
- Keyboard order follows visual order. Tabs implement roving selection semantics or use native buttons with `role="tab"`, `aria-selected`, and an associated panel.
- Focus is always visible and has at least a 2 px high-contrast outline.
- Selected, pending, error, disabled, and offline states include text. Color and animation are never the sole channel.
- Disabled native controls use `disabled`; non-native controls use `aria-disabled="true"` and suppress activation.
- Live status announcements are polite unless a decision is blocking user work. Approval prompts must not repeatedly steal focus.
- Body text and control text target WCAG AA contrast. Pixel art is supplemental; its metadata or nearby label communicates meaning.

## Host boundaries

Portable assets may be copied into a host adapter after provenance approval. Presentation contracts may be implemented in React, Vue, Web Components, or another view layer. The adapter must translate only authoritative host records and documented plugin seams.

The portable tree contains no Superset modules, Electron, tRPC, TanStack Router, Pi Runtime bridge, xterm, DSH official brand assets, remote resources, or host CSS selectors.

## Anti-patterns

- Decorative animation that implies an idle agent is working.
- Hair-only model or reasoning communication.
- A generic card grid relabelled with office nouns.
- Rounded, blurred, glassy surfaces that erase hierarchy.
- Dense 24 px icon buttons with 24 px hit targets.
- Invented host token names or styling internal DOM selectors across package boundaries.
- Copying current AAOffice React/CSS into an independent package.
- Replacing DSH layout before documented theme, brand, and additive slot seams are exhausted.
- Showing demo/gallery data without an explicit mock label.

## Reference implementation status

The static gallery is a verification specimen, not a framework or production component library. It demonstrates the intended hierarchy and contract behavior while remaining build-free and host-independent.
