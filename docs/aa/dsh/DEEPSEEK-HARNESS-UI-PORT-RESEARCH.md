# DeepSeek Harness UI Port Research

Status: completed architecture and product research
Date: 2026-08-20
AA source baseline: `Jiqize/superset@7aef629e257f23f0a5493f1ce553f34bf1b1e04e`
DeepSeek Harness research baseline: `deepseek-ai/deepseek-harness@141eb6fef83422698aef7a981029e843e8161534` (`dsh@0.1.0-rc.8`)

## 1. Executive conclusion

Proceed, but do **not** transplant the Superset Renderer wholesale.

The correct long-term shape is:

```text
AA Office portable visual core
  ├─ tokens
  ├─ icons
  ├─ pixel-worker anatomy and states
  ├─ semantic state vocabulary
  ├─ component presentation contracts
  └─ motion/accessibility rules

Platform adapters
  ├─ Superset adapter (existing AA Office implementation)
  └─ DSH adapter
       ├─ theme plugin
       ├─ brand plugin
       ├─ scoped skin/component plugin
       └─ optional layout plugin only if skinning is insufficient
```

DeepSeek Harness is a better portability target than a conventional monolithic GUI because its runtime and Web UI are explicitly plugin-composed. The Web client exposes theme services, brand slots, UI slots, a modular layout, Workspace/Session projections, structured conversation nodes, Tool renderers, settings extension areas, and durable session events.

The first DSH implementation should therefore be an **AA Office plugin bundle/overlay**, not a permanent fork of DeepSeek Harness and not a copy of Superset-specific AA code.

## 2. DeepSeek Harness status

Official repository:

```text
https://github.com/deepseek-ai/deepseek-harness
```

Observed baseline:

- Open source under MIT.
- TypeScript monorepo.
- Package manager: `pnpm@11.7.0`.
- Node requirement: `^22.19.0 || >=24.0.0`.
- Current studied release: `0.1.0-rc.8`.
- Default branch: `master`.
- Developer preview with explicitly expected compatibility-breaking changes.
- Web UI can be launched through `npx @deepseek-ai/dsh web` or from source.

This instability changes the integration strategy: pin an exact DSH commit for every adapter milestone, keep the portable AA visual core independent, and make the DSH-specific layer deliberately thin.

## 3. DeepSeek Harness architecture

### 3.1 Everything is a plugin

DSH is built on Cordis. Model adapters, Tool registries, Session logging, Agent loop behavior, UI features, brand, theme, layout, settings, and editor integrations are mounted as plugins.

There is no single privileged product core that an AA implementation must patch. A profile composes ordered bundles and optional overlays. Registrations are reversible effects and unload with their plugin.

This is the central architectural advantage for AA portability.

### 3.2 Profiles, bundles, and overlays

A running Harness is a plugin tree assembled from:

1. Bundles in profile order.
2. Profile-level `cordis.patch.yml`.
3. Home-level patch.
4. Invocation-level `--patch` overlay.

The standard Web product combines `dsh-base` and `dsh-web-app`. A future AA distribution can add or replace selected browser plugins through its own bundle/overlay instead of directly rewriting the official Web app.

### 3.3 Durable facts and live events

DSH distinguishes:

- Durable Session events, including `turn/*`, `step/*`, `assistant/*`, `tool/*`, and user input.
- Live Agent events for in-flight work.
- Capability events for swappable services.

This is much stronger than inferring state from Terminal text. AA worker presentation can be driven by authoritative turn, Tool, approval, question, retry, and completion facts.

### 3.4 Web surface

`apps/web` is a very thin Vite bootstrap over `@deepseek-ai/dsh-client-web`. The actual GUI is assembled from client packages.

Important packages include:

- `ui-renderer`
- `ui-slots`
- `ui-theme`
- `ui-primitives`
- `ui-layout`
- `ui-sidebar`
- `ui-brand-official`
- `ui-workspace`
- `ui-conversation`
- `ui-tool`
- `ui-deliverables`
- `ui-model-selection`
- `ui-permission`
- `ui-settings-*`
- `ui-agent-preset`

The standard `dsh-web-app` bundle lists these plugins explicitly in `cordis.patch.yml`, which makes selective replacement practical.

## 4. DSH UI extension points relevant to AA

### 4.1 Theme service

The DSH theme system is based on `--dsw-*` semantic token stylesheets. It supports:

- built-in light/dark/system preferences;
- registered third-party theme definitions;
- stacked token override layers;
- durable preference storage;
- theme-change snapshots;
- plugin-owned stylesheet lifecycle.

An AA theme can begin as token overrides without replacing the whole application.

Recommended first package:

```text
@aa-office/dsh-theme
```

Responsibilities:

- map AA warm greys, charcoal borders, navy selection, amber activity, success, error, and muted text to DSH semantic aliases;
- preserve light/dark correctness, even if AA v0.1 initially ships one primary light interpretation;
- add only truly missing semantic aliases through an explicit design decision;
- avoid brittle global selectors when a token or slot contract exists.

### 4.2 Brand slots

The official brand package fills independent slots:

```text
sidebar.brand.mark
sidebar.brand.name
conversation.hero.brand.mark
```

AA can provide its own brand plugin without replacing Sidebar or Conversation.

Recommended package:

```text
@aa-office/dsh-brand
```

It must use original AA marks and office objects. It must not reuse the official DeepSeek fish/whale mark or imply official endorsement.

### 4.3 UI slots

DSH UI features register React components into declared slots. The slot system supports:

- typed registration;
- child-slot declarations;
- keyed and chain selection;
- plugin-owned stores;
- scoped Session and global data;
- lifecycle cleanup.

AA should prefer slot contributions over editing central switches.

Likely AA contributions:

- worker/state indicators in Session header utilities;
- compact office-status rows in input docks;
- Task/Session metadata presentation;
- pixel worker in blank/Hero states;
- Tool and deliverable office-object renderers;
- settings cards for AA theme and motion preferences.

### 4.4 Layout

The official DSH layout is already a productive three-column shell:

```text
Sidebar | Conversation | Details
```

The Sidebar collapses to a 56 px rail. Details can close to zero. This is compatible with the compact AA philosophy.

Recommendation: **do not replace `ui-layout` in the first DSH phase**.

Start by skinning and contributing to the existing layout. Replace the layout only if real use proves that AA requires a structurally different shell. A layout replacement has high contract risk because it must preserve root slot ownership, Sidebar/Conversation/Details declarations, geometry services, Session providers, and responsive concession behavior.

### 4.5 Sidebar and Workspace/Session browser

DSH Sidebar already owns:

- brand;
- New Session;
- collapse rail;
- Workspace/Session browser slot;
- Settings seat.

The Workspace plugin already owns:

- Workspace grouping;
- Session rows;
- search;
- running/waiting/approval indicators;
- archive;
- rename/reorder/fork behavior.

AA should adapt its office metaphor to these real entities instead of forcing Superset's Project/Workspace model onto DSH.

### 4.6 Conversation, Tools, and deliverables

DSH has structured Conversation nodes, durable streaming, Tool trees, approvals, user questions, model selection, permissions, plans, goals, background jobs, retries, compaction, files, and deliverables.

The DSH AA surface should therefore remain **conversation-first**, not Terminal-first.

A CRT/Terminal visual can still appear for real shell/PTY Tool surfaces, but it should not become the main content frame by default. The conversation transcript and composer are the authoritative work surface.

## 5. Semantic mapping: AA Office to DSH

Recommended DSH mapping:

| DSH concept | AA Office object | Notes |
|---|---|---|
| Workspace | Briefcase | One codebase/directory context. |
| Session | Task Folder / Work Folder | One continuing unit of agent work. |
| Agent preset | Employee role/configuration | Tools, persona, permissions, model route. |
| Active Agent | Worker | Current runtime identity. |
| Model | Brain/badge/persona detail | Do not equate model with the entire Employee. |
| Thinking level / reasoning stream | Hair + explicit text | Hair is secondary; text remains authoritative. |
| Turn running | Worker typing/thinking | Driven by durable/live Agent state. |
| Pending approval | Paper awaiting signature | DSH already has structured approval state. |
| Pending question | Worker waiting with note | Structured user-question state. |
| Tool call | Office tool / paper trail | Keep exact Tool name and status visible. |
| Deliverables | Outbox / stamped documents | Use DSH durable deliverable data. |
| Composer | Desk inbox | Primary place where the user assigns work. |
| Details column | File cabinet / inspector | Tool details, files, previews. |
| Archived Session | Archived Task Folder | Use DSH's real archive behavior. |
| Session fork | Duplicate Task Folder | Preserve lineage text; do not fake merge semantics. |

Important change from Superset AA:

```text
Superset AA: Project -> Briefcase, Workspace -> Work Folder
DSH AA:      Workspace -> Briefcase, Session -> Task Folder
```

This is intentional. The metaphor must follow the target runtime's real data model.

## 6. What is portable from the current AA implementation

### 6.1 Portable visual core

The following should become platform-neutral assets/contracts:

- color system;
- 4 px spacing grid;
- hard-edge borders and inset depth;
- typography hierarchy;
- compact control dimensions;
- icons and office objects;
- worker anatomy;
- hair/reasoning layers;
- worker state poses;
- status-light vocabulary;
- motion timing;
- reduced-motion behavior;
- accessibility rules;
- textual state vocabulary;
- component presentation contracts.

### 6.2 Portable product principles

- Function before decoration.
- Real states only.
- Pixel art is a representation layer.
- The work surface stays honest.
- Color is sparse and semantic.
- Motion communicates state, not entertainment.
- Text always accompanies color, hair, and animation.

### 6.3 Superset-specific adapter code

The following must not be treated as portable core:

- TanStack routes;
- Superset dashboard shells;
- Electron assumptions;
- tRPC queries/mutations;
- Host SQLite read models;
- Pi Runtime Contract bridge;
- pane registry and pane layout;
- xterm/PTTY wrappers;
- Git/worktree orchestration;
- Superset CSS class normalization;
- New Task/Active Tasks/Archive implementation details.

They can inspire DSH behavior but should not be copied as the DSH adapter.

## 7. Required AA asset consolidation

The current AA assets are useful but still Phase-1-shaped and partially embedded in Superset CSS/components. Before a DSH port, consolidate them into a portable source of truth.

Target structure:

```text
docs/aa/portable/
  AA-PORTABLE-DESIGN-SYSTEM.md
  AA-SEMANTIC-MODEL.md
  AA-COMPONENT-CONTRACTS.md
  AA-ASSET-PROVENANCE.md
  asset-manifest.json

  tokens/
    core.tokens.json
    semantic.tokens.json
    superset.mapping.json
    dsh.mapping.json

  icons/
    home.svg
    briefcase.svg
    folder.svg
    filing-cabinet.svg
    conversation.svg
    agent.svg
    settings.svg
    terminal.svg
    files.svg
    changes.svg
    diff.svg
    approval.svg
    deliverable.svg
    status-*.svg

  workers/
    anatomy.svg
    personas.svg
    hair-levels.svg
    states.svg
    props.svg

  motion/
    motion-spec.json

  gallery/
    index.html
    aa-portable.css
    gallery.js
```

The gallery must run without Superset or DSH. It is proof that the visual system is genuinely portable.

## 8. Provenance and license boundary

This is mandatory.

The current AA implementation lives inside a Superset fork whose repository license is Elastic License 2.0. DeepSeek Harness is MIT. A future independently distributed AA-for-DSH package must not accidentally copy Superset-owned source or assets into an MIT project.

Every extracted item must be classified as:

- `AA-original`: created specifically for AA and safe to carry forward subject to the user's chosen license;
- `Superset-adapted`: contains Superset implementation structure/selectors/code and must remain in the Superset adapter or be clean-room rewritten;
- `third-party`: requires its own attribution/license review;
- `unknown`: blocked from export until resolved.

The portable asset kit must include a provenance manifest. No independent package license should be declared during the extraction phase unless provenance is complete.

## 9. Brand and naming

DeepSeek's guidelines permit truthful phrases such as:

```text
Built on DeepSeek Harness
Compatible with DeepSeek Harness
```

They recommend the abbreviation `DSH` for ecosystem naming and advise against using the full `DeepSeek Harness` trademark as the project name.

Recommended working names:

- `AA Office for DSH`
- `AA DSH Theme`
- `AA Office DSH Adapter`

Avoid:

- `DeepSeek Harness Office`
- official DeepSeek logo/wordmark reuse;
- visual claims of official endorsement.

## 10. Recommended DSH adapter architecture

### Phase A — portable extraction

Complete the asset/design/provenance kit and independent gallery. No DSH product changes.

### Phase B — DSH theme and brand PoC

Create an independent DSH plugin project pinned to one DSH commit:

```text
packages/
  aa-office-dsh-theme
  aa-office-dsh-brand
  aa-office-dsh-skin
bundle/
  aa-office-dsh-web
```

The bundle should replace the official brand occupant and add AA theme/skin plugins through a Cordis overlay.

### Phase C — structured Agent experience

Add truthful AA workers driven by DSH Session/Agent state:

- running;
- idle;
- waiting for approval;
- waiting for answer;
- error/retry;
- settled;
- archived.

Use existing slots and durable Session events.

### Phase D — evaluate layout replacement

Only after dogfood, decide whether the standard three-column layout is sufficient. Do not replace layout merely to mimic Superset screenshots.

## 11. Risk register

### High: DSH compatibility churn

Mitigation:

- pin exact commits;
- keep adapters thin;
- add contract tests for every consumed slot/token/event;
- do not fork large internal packages prematurely.

### High: accidental Superset code export

Mitigation:

- provenance inventory;
- clean-room rewrite of adapter components;
- no blind file copying from AAOffice into an independent MIT package.

### Medium: forcing the wrong product metaphor

Mitigation:

- map Workspace and Session according to DSH semantics;
- keep structured Conversation central;
- use Terminal objects only for actual Terminal surfaces.

### Medium: CSS brittleness

Mitigation:

- prefer theme aliases and slots;
- scope skin selectors;
- test official light/dark/system modes;
- avoid broad class-name matching.

### Medium: trademark confusion

Mitigation:

- use AA-owned marks;
- use `DSH` in the working name;
- include truthful compatibility copy;
- do not reuse official DeepSeek brand artwork.

## 12. Final recommendation

Decision:

```text
PROCEED WITH PORTABLE AA ASSET EXTRACTION
THEN PROCEED WITH DSH THEME + BRAND + SCOPED SKIN PLUGINS
DO NOT PORT THE SUPERSET RENDERER WHOLESALE
DO NOT REPLACE DSH LAYOUT IN THE FIRST IMPLEMENTATION
```

DeepSeek Harness offers the right extension seams for AA Office. The primary work now is not another large UI rewrite. It is to separate the visual identity and state language from Superset-specific implementation, prove portability in an independent gallery, and then build a thin DSH adapter against a pinned developer-preview release.
