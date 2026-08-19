# Phase 5A — AA Portable UI Asset Extraction and DSH Adapter Spike

Status: execution brief
Primary repository: `Jiqize/superset`, branch `aa-spike`
AA product baseline: `7aef629e257f23f0a5493f1ce553f34bf1b1e04e`
DeepSeek Harness study baseline: `deepseek-ai/deepseek-harness@141eb6fef83422698aef7a981029e843e8161534`

## 1. Read first

Treat these documents as the source of truth:

```text
docs/aa/dsh/DEEPSEEK-HARNESS-UI-PORT-RESEARCH.md
docs/aa/AA-OFFICE-DESIGN-SYSTEM.md
docs/aa/AA-V0.2-VISUAL-DECISION-LOG.md
docs/aa/AA-OFFICE-V0.2-VISUAL-REFINEMENT-CHECKPOINT.md
docs/aa/design/tokens.json
docs/aa/design/assets-manifest.json
```

Also read the current AA implementation under:

```text
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/
```

## 2. Goal

Extract the AA Office visual identity, art assets, state language, and component presentation contracts into a complete framework-neutral portable kit.

In parallel, produce a precise DeepSeek Harness UI architecture map and a minimal-risk adapter plan.

This phase must answer:

1. What is the reusable AA visual/art system independent of Superset?
2. Which current files are original AA assets, Superset-adapted code, third-party material, or unresolved?
3. How should AA map onto DeepSeek Harness Workspace, Session, Agent, Conversation, Tool, approval, and deliverable concepts?
4. Which DSH plugin seams should the first implementation use?
5. Can the AA visual kit render independently from both Superset and DSH?

## 3. Non-goals

Do not:

- port AA into the production DeepSeek Harness UI;
- modify the DeepSeek Harness checkout;
- fork or rewrite DSH `ui-layout`;
- copy the Superset Renderer wholesale;
- change current AA Office product behavior;
- modify Pi Runtime, Host Service, PTY, Git/worktree, Workspace schema, or Task state;
- add a new Runtime adapter;
- create a new Task database;
- declare an independent package license before provenance is complete;
- use official DeepSeek brand art or imply official endorsement;
- start Phase 5B.

## 4. Repository safety

Work only on the original development Mac.

Primary writable repository:

```text
/Users/lianglei/Code/bluejob/superset
```

Before work:

```bash
pwd
git status --short
git branch --show-current
git fetch origin
git rev-parse HEAD
git rev-parse origin/aa-spike
```

Requirements:

- branch is `aa-spike`;
- worktree is clean;
- use `git pull --ff-only origin aa-spike`;
- if dirty, STOP and report exact files;
- do not stash, reset, delete, or alter unrelated files.

## 5. Read-only DeepSeek Harness checkout

Use this sibling path for architecture verification:

```text
/Users/lianglei/Code/bluejob/deepseek-harness
```

If absent, clone the official repository.

If present, first verify it is clean. If it contains local changes, do not modify or clean it; STOP the DSH checkout step and report the exact state.

Pin the checkout in detached HEAD at:

```text
141eb6fef83422698aef7a981029e843e8161534
```

This is a read-only reference checkout for Phase 5A.

Do not commit to it. Do not create a feature branch in it. Do not update it beyond the pinned commit during this phase.

Record:

- exact SHA;
- package version;
- Node and pnpm requirements;
- whether source build succeeds if dependencies are already practical to install;
- any observed architecture differences from the research document.

Do not enter credentials or configure a real DeepSeek API key merely for this phase.

## 6. Workstream A — AA source inventory

Audit the current AA source and create a complete inventory.

Include at minimum:

```text
docs/aa/design/
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/aa-office.css
all Phase 1–4C visual decision/checkpoint documents
```

Classify every relevant item into one category:

```text
AA-original
Superset-adapted
third-party
unknown
```

For each item record:

- path;
- purpose;
- current dependency surface;
- whether it is visually portable;
- whether it is code-portable;
- required clean-room work;
- attribution/license notes;
- proposed destination in the portable kit.

Create:

```text
docs/aa/portable/AA-ASSET-PROVENANCE.md
```

No item marked `Superset-adapted`, `third-party`, or `unknown` may silently enter an independent future package.

## 7. Workstream B — portable token system

Create a two-level framework-neutral token system.

Required files:

```text
docs/aa/portable/tokens/core.tokens.json
docs/aa/portable/tokens/semantic.tokens.json
docs/aa/portable/tokens/superset.mapping.json
docs/aa/portable/tokens/dsh.mapping.json
```

### 7.1 Core tokens

Include stable primitives:

- palette;
- spacing;
- dimensions;
- border widths;
- radius;
- hard/inset depth;
- typography;
- icon/avatar sizes;
- motion durations/fps.

### 7.2 Semantic tokens

Use product roles, not framework names:

- application canvas;
- shell surface;
- raised/inset surfaces;
- strong/soft borders;
- primary/secondary text;
- selection;
- working;
- waiting;
- success;
- error;
- offline;
- paper;
- terminal/workstation;
- briefcase/folder;
- focus;
- disabled.

### 7.3 Platform maps

`superset.mapping.json` maps portable semantic names to the current AA/Superset variables.

`dsh.mapping.json` maps portable semantic names to verified DSH `--dsw-*` aliases. Mark unsupported semantics explicitly; do not invent unverified DSH token names.

Validate all JSON.

## 8. Workstream C — portable SVG art library

Split the current reference sheets into individually addressable, framework-neutral SVG assets.

Target structure:

```text
docs/aa/portable/icons/
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
  status-idle.svg
  status-working.svg
  status-waiting.svg
  status-success.svg
  status-error.svg
  status-offline.svg

docs/aa/portable/workers/
  anatomy.svg
  personas.svg
  hair-levels.svg
  states.svg
  props.svg
```

Rules:

- integer viewBox coordinates;
- `shape-rendering="crispEdges"` where appropriate;
- no external font, image, or network dependency;
- text-free where practical;
- explicit title/description metadata for reference sheets;
- deterministic rendering at 16/20/24/32 px icons and 24/32/48 px workers;
- preserve AA's 4 px grid logic;
- no official DeepSeek logo or wordmark;
- no copied Superset icons unless provenance explicitly permits them.

The worker library must demonstrate composable layers:

```text
base anatomy
+ persona
+ hair/reasoning
+ activity state
+ optional office prop
```

Do not create one full asset for every combinatorial state.

## 9. Workstream D — portable design and component contracts

Create:

```text
docs/aa/portable/AA-PORTABLE-DESIGN-SYSTEM.md
docs/aa/portable/AA-SEMANTIC-MODEL.md
docs/aa/portable/AA-COMPONENT-CONTRACTS.md
docs/aa/portable/asset-manifest.json
docs/aa/portable/motion/motion-spec.json
```

### 9.1 Design system

Consolidate the current mature AA rules:

- product character;
- function-before-decoration;
- hard-edge depth;
- compact density;
- state truthfulness;
- typography;
- color roles;
- grid/spacing;
- motion;
- accessibility;
- anti-patterns.

Remove Phase-1-only wording and Superset-only implementation assumptions.

### 9.2 Semantic model

Define portable concepts:

- Briefcase;
- Task Folder;
- Work Folder;
- Employee;
- Runtime;
- Model;
- Reasoning/Hair;
- Workstation;
- File Cabinet;
- Approval;
- Deliverable;
- Archive.

For each concept specify:

- visual metaphor;
- required authoritative data;
- allowed states;
- forbidden inference;
- text fallback;
- Superset mapping;
- DSH mapping.

### 9.3 Component contracts

Specify framework-neutral presentation props and behavior for at least:

```text
AAAppFrame
AANavigationRail
AAPanel
AAButton
AAIconButton
AATabs
AAStatusLight
AABriefcase
AATaskFolder
AAEmployeeAvatar
AAEmployeeCard
AAReasoningHair
AAWorkstationFrame
AAFileCabinet
AAApprovalPaper
AADeliverableTray
AABottomStatusBar
```

These are contracts, not a new abstract component framework.

Document accessibility, reduced motion, minimum targets, selected/focus/disabled/pending/error behavior, and state-text requirements.

## 10. Workstream E — independent portable gallery

Create a no-build static gallery:

```text
docs/aa/portable/gallery/index.html
docs/aa/portable/gallery/aa-portable.css
docs/aa/portable/gallery/gallery.js
```

The gallery must run by opening `index.html` locally and must not import Superset or DSH code.

It must demonstrate:

- complete palette and token roles;
- border/surface hierarchy;
- typography scale;
- buttons, tabs, inputs, panels, status lights;
- all icons at supported sizes;
- worker personas;
- hair/reasoning levels;
- idle/thinking/working/waiting/error/offline states;
- reduced-motion mode;
- Briefcase/Task Folder/File Cabinet objects;
- Superset composition example;
- DSH composition example using `Sidebar | Conversation | Details`;
- truthful structured approval and deliverable examples.

Use mock labels clearly marked as gallery/demo data. Do not present demo states as live Runtime facts.

Capture safe screenshots at:

```text
1440×800
1920×976
```

## 11. Workstream F — DSH UI architecture map

Create:

```text
docs/aa/dsh/DSH-UI-ARCHITECTURE-MAP.md
```

Verify against the pinned checkout and document:

- Web bootstrap path;
- client module loading;
- Cordis profile/bundle/overlay path;
- browser plugin roster;
- `ui-theme` registration and token overrides;
- brand slots;
- root/layout/sidebar/conversation/details slots;
- Workspace and Session projections;
- Agent/turn/Tool/approval/deliverable event sources;
- settings extension points;
- HMR/development workflow;
- package build/test requirements;
- exact files/packages an AA adapter would consume.

Clearly distinguish:

```text
public/documented seam
internal implementation
unstable developer-preview dependency
```

## 12. Workstream G — DSH semantic mapping and adapter plan

Create:

```text
docs/aa/dsh/AA-DSH-SEMANTIC-MAPPING.md
docs/aa/dsh/AA-DSH-ADAPTER-PLAN.md
```

The mapping must use:

```text
DSH Workspace -> Briefcase
DSH Session -> Task Folder / Work Folder
Agent preset -> Employee role
Active Agent -> Worker
Model -> brain/badge/persona detail
Reasoning -> Hair + text
Approval -> signature paper
Tool call -> office tool/paper trail
Deliverable -> outbox/stamped document
Composer -> desk inbox
Details -> file cabinet/inspector
```

Do not force Superset's Project/Workspace mapping onto DSH.

The adapter plan must compare these options:

### Option 1 — Theme + Brand + Scoped Skin plugins

Expected first choice.

### Option 2 — Shell contribution plugin using existing layout slots

Use if Option 1 cannot provide enough AA identity.

### Option 3 — Selective official UI package replacement

High cost; justify each replaced package.

### Option 4 — Full layout replacement

Last resort only.

For each option include:

- packages/plugins;
- consumed public contracts;
- compatibility risk;
- upstream merge cost;
- testing strategy;
- migration path;
- stop conditions.

Recommend a working project/package naming scheme that follows DeepSeek brand guidance, such as:

```text
AA Office for DSH
@aa-office/dsh-theme
@aa-office/dsh-brand
@aa-office/dsh-skin
```

Use the phrase `built on DeepSeek Harness` only as truthful descriptive copy.

## 13. Portable dependency audit

Create an automated audit that fails if the portable asset/gallery tree imports or references:

- Superset application modules;
- Electron;
- tRPC;
- TanStack Router;
- Pi Runtime bridge;
- xterm;
- Superset-specific CSS class names;
- DeepSeek official logo assets;
- remote network resources.

The audit can live under a narrow script/test location, but must not alter product Runtime behavior.

Validate:

- JSON;
- SVG/XML parseability;
- duplicate asset ids;
- missing manifest files;
- unsupported token mappings;
- accessibility labels in the gallery;
- reduced-motion CSS;
- no external URLs in portable runtime assets.

## 14. Required deliverables

Create all of the following:

```text
docs/aa/PHASE-5A-AA-PORTABLE-UI-ASSET-EXTRACTION-REPORT.md
docs/aa/AA-PORTABLE-UI-KIT-V0.1-CHECKPOINT.md

docs/aa/portable/AA-PORTABLE-DESIGN-SYSTEM.md
docs/aa/portable/AA-SEMANTIC-MODEL.md
docs/aa/portable/AA-COMPONENT-CONTRACTS.md
docs/aa/portable/AA-ASSET-PROVENANCE.md
docs/aa/portable/asset-manifest.json
docs/aa/portable/tokens/*
docs/aa/portable/icons/*
docs/aa/portable/workers/*
docs/aa/portable/motion/motion-spec.json
docs/aa/portable/gallery/*

docs/aa/dsh/DSH-UI-ARCHITECTURE-MAP.md
docs/aa/dsh/AA-DSH-SEMANTIC-MAPPING.md
docs/aa/dsh/AA-DSH-ADAPTER-PLAN.md

docs/aa/dsh/phase-5a-evidence/README.md
```

The report must include:

- source inventory summary;
- provenance counts by category;
- portable asset list;
- token mapping coverage;
- gallery verification;
- DSH pinned version and architecture findings;
- recommended adapter option;
- known incompatibilities;
- clean-room rewrite requirements;
- recommended Phase 5B scope.

## 15. Verification

Run at minimum:

- all new portable asset/audit tests;
- JSON validation;
- SVG/XML validation;
- static gallery smoke test;
- accessibility checks practical for the gallery;
- 1440×800 and 1920×976 gallery screenshots;
- existing targeted AAOffice tests affected by moved/reference assets;
- repository TypeScript/lint checks required for changed files;
- `git diff --check`;
- sensitive-information scan;
- provenance completeness check;
- frozen-area audit confirming no current AA Runtime/Host behavior changed.

If DSH dependencies are installed, optionally run its relevant documented build/typecheck on the pinned clean checkout. Do not treat missing dependencies or credentials as a product failure; report the exact verification boundary.

## 16. Decision gate

End the report with exactly one recommendation:

```text
PROCEED WITH DSH THEME + BRAND + SCOPED SKIN PLUGINS
PROCEED WITH DSH SHELL CONTRIBUTION PLUGIN
PROCEED WITH SELECTIVE DSH UI PACKAGE REPLACEMENT
DO NOT PROCEED WITH DSH PORT
```

The expected result from current research is the first option, but evidence must decide.

## 17. Completion protocol

After all deliverables and verification are complete:

1. Review `git diff` for scope.
2. Commit the Phase 5A work.
3. Push to `origin/aa-spike`.
4. Confirm `git status --short` is empty.
5. Confirm local HEAD equals `origin/aa-spike`.
6. STOP.

Do not begin Phase 5B.
