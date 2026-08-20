# Phase 5B — AA Office for DSH Out-of-Tree Adapter Spike

Status: execution brief

Control repository: `Jiqize/superset`, branch `aa-spike`

Control baseline:

```text
Jiqize/superset@2259115af32717d7fced406961eb20980ebcf64b
```

New implementation repository:

```text
Jiqize/aa-office-dsh
```

Repository visibility:

```text
PRIVATE
```

DeepSeek Harness compatibility pin:

```text
deepseek-ai/deepseek-harness@141eb6fef83422698aef7a981029e843e8161534
dsh@0.1.0-rc.8
```

Phase 5A decision:

```text
PROCEED WITH DSH THEME + BRAND + SCOPED SKIN PLUGINS
```

## 1. Goal

Create a new private, independent repository that proves AA Office can be mounted into the official DeepSeek Harness Web UI through documented public plugin seams, without modifying the DeepSeek Harness checkout and without copying Superset-adapted React, CSS, routing, Runtime, Electron, or test code.

The first adapter slice must contain only:

```text
AA portable assets/contracts
+
DSH theme adapter
+
AA-owned brand occupants
+
one truthful Session/Worker status contribution
+
profile/patch composition
```

This phase is a bounded compatibility and product-identity spike. It is not a production distribution, a full AA shell port, or a replacement of the DSH Sidebar, Conversation, Details, Workspace, Session, composer, settings, tool, approval, or deliverable implementations.

## 2. Required reading

Read the following from the control repository before creating the new repository:

```text
docs/aa/PHASE-5A-AA-PORTABLE-UI-ASSET-EXTRACTION-REPORT.md
docs/aa/AA-PORTABLE-UI-KIT-V0.1-CHECKPOINT.md

docs/aa/portable/AA-PORTABLE-DESIGN-SYSTEM.md
docs/aa/portable/AA-SEMANTIC-MODEL.md
docs/aa/portable/AA-COMPONENT-CONTRACTS.md
docs/aa/portable/AA-ASSET-PROVENANCE.md
docs/aa/portable/asset-manifest.json

docs/aa/dsh/DEEPSEEK-HARNESS-UI-PORT-RESEARCH.md
docs/aa/dsh/DSH-UI-ARCHITECTURE-MAP.md
docs/aa/dsh/AA-DSH-SEMANTIC-MAPPING.md
docs/aa/dsh/AA-DSH-ADAPTER-PLAN.md
```

Treat Phase 5A provenance classifications and clean-room boundaries as normative.

## 3. Repository safety and ownership boundary

Work only on the original development Mac.

Control repository:

```text
/Users/lianglei/Code/bluejob/superset
```

New repository target:

```text
/Users/lianglei/Code/bluejob/aa-office-dsh
```

Official DSH reference:

```text
/Users/lianglei/Code/bluejob/deepseek-harness
```

Before doing anything:

```bash
cd /Users/lianglei/Code/bluejob/superset
pwd
git status --short
git branch --show-current
git fetch origin
git rev-parse HEAD
git rev-parse origin/aa-spike
```

Requirements:

- branch is `aa-spike`;
- the control worktree is clean;
- local HEAD equals `origin/aa-spike` after `git pull --ff-only origin aa-spike`;
- the Phase 5B brief exists at this path;
- if the control repository is dirty, STOP and report exact files;
- do not stash, reset, clean, delete, or modify unrelated files.

The control Superset repository is read-only for Phase 5B after this brief is read. Do not add implementation or Phase 5B report files to Superset.

## 4. Create the new private repository

First verify GitHub CLI authentication:

```bash
gh auth status
```

Then verify that neither the local path nor the remote repository already exists:

```bash
test ! -e /Users/lianglei/Code/bluejob/aa-office-dsh
gh repo view Jiqize/aa-office-dsh
```

Expected remote result is not found.

If either the local path or remote repository already exists, STOP and report its exact state. Do not overwrite, delete, rename, or repurpose an existing repository.

Create the local repository:

```bash
mkdir -p /Users/lianglei/Code/bluejob/aa-office-dsh
cd /Users/lianglei/Code/bluejob/aa-office-dsh
git init -b main
```

Create the initial repository files and first commit locally before creating the remote. Then create the private remote and push:

```bash
gh repo create Jiqize/aa-office-dsh \
  --private \
  --description "Private clean-room AA Office adapter experiments for DSH" \
  --source . \
  --remote origin \
  --push
```

Do not create a public repository.

Do not enable GitHub Pages, releases, package publishing, or a public npm package in this phase.

## 5. License and provenance status

The new repository must not claim MIT, Apache, ELv2, or any other independent distribution license in Phase 5B.

Create:

```text
LICENSE-STATUS.md
```

It must clearly state:

```text
PRIVATE PROTOTYPE
LICENSE NOT YET DECLARED
NOT FOR DISTRIBUTION
```

It must also state that:

- DeepSeek Harness is referenced as an MIT-licensed compatibility target;
- no official DeepSeek brand asset is included;
- no Superset-adapted implementation file may enter the repository;
- AA portable assets are admitted only through the Phase 5A provenance gate;
- any future public distribution requires an explicit ownership and license decision.

Create:

```text
docs/PROVENANCE.md
docs/SOURCE-PINS.md
```

`SOURCE-PINS.md` must record exact source commits:

```text
Jiqize/superset@2259115af32717d7fced406961eb20980ebcf64b
deepseek-ai/deepseek-harness@141eb6fef83422698aef7a981029e843e8161534
```

Every copied portable file must retain its source path, source SHA-256, Phase 5A classification, and destination path.

## 6. New repository structure

Create this bounded workspace:

```text
aa-office-dsh/
├── README.md
├── AGENTS.md
├── LICENSE-STATUS.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .gitignore
│
├── packages/
│   ├── portable/
│   │   ├── package.json
│   │   ├── tokens/
│   │   ├── icons/
│   │   ├── workers/
│   │   ├── motion/
│   │   └── contracts/
│   │
│   ├── dsh-theme/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tests/
│   │
│   ├── dsh-brand/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tests/
│   │
│   ├── dsh-skin/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tests/
│   │
│   └── dsh-bundle/
│       ├── package.json
│       ├── cordis.patch.yml
│       └── tests/
│
├── examples/
│   └── aa-dsh-web/
│       ├── README.md
│       ├── run.sh
│       └── test-config/
│
├── docs/
│   ├── PROVENANCE.md
│   ├── SOURCE-PINS.md
│   ├── DSH-COMPATIBILITY.md
│   ├── SEMANTIC-MAPPING.md
│   ├── PHASE-5B-REPORT.md
│   ├── AA-OFFICE-FOR-DSH-V0.1-CHECKPOINT.md
│   └── evidence/
│       └── README.md
│
└── scripts/
    ├── verify-provenance.mjs
    ├── verify-dsh-contracts.mjs
    └── verify-boundaries.mjs
```

Small deviations are allowed only when the DSH package contract requires them. Record every deviation in the report.

All packages and the root workspace must be private in Phase 5B:

```json
{
  "private": true
}
```

Do not include `publishConfig`.

## 7. Portable asset intake

Copy only the Phase 5A portable kit from the pinned Superset control repository into `packages/portable`.

Allowed source tree:

```text
docs/aa/portable/
```

Do not copy:

```text
apps/desktop/**
docs/aa/design/**
AAOffice React components
aa-office.css
Superset route code
Electron code
tRPC code
Pi Runtime bridge code
xterm code
Superset tests
```

The destination may reorganize files into package-friendly paths, but must retain all provenance records.

The portable package must expose data and assets only. It must not import React, DSH, Superset, Electron, or browser Runtime code.

Required portable package exports:

- core tokens;
- semantic tokens;
- DSH mapping;
- icon asset paths or URL-safe exports;
- worker asset paths or URL-safe exports;
- motion contract;
- semantic and component contract documents or machine-readable summaries where practical.

Run the existing portable audit logic or reimplement its checks without importing the Superset application.

## 8. Dependency and pin strategy

Use:

```text
Node 24.x compatible with the DSH pin
pnpm 11.7.0
TypeScript
React 18 only where DSH client components require it
Vitest
Playwright for browser verification
```

Pin all DeepSeek Harness package dependencies to exact `0.1.0-rc.8` versions where those packages are publicly available and sufficient.

Before writing adapters, prove the external dependency path:

1. query npm metadata for every intended `@deepseek-ai/*` dependency;
2. verify exact `0.1.0-rc.8` availability;
3. verify exported public entry points;
4. verify no dependency requires imports from `deepseek-harness/src`, private CSS modules, or unpublished internal paths.

If a required public package is not available from npm or cannot be consumed without private source imports:

- do not vendor it;
- do not copy source from DSH;
- do not alter the official DSH checkout;
- document the exact gap;
- use a local file dependency to the pinned checkout only if it points to a documented package root/export and remains a development-only compatibility harness;
- ensure no absolute local path is committed to package manifests, lockfiles, examples, or documentation.

If even a development-only documented package link cannot be made portable, STOP implementation and finish a blocked Phase 5B report rather than bypassing the boundary.

## 9. Official DSH checkout

Use the official checkout only as the compatibility host:

```text
/Users/lianglei/Code/bluejob/deepseek-harness
```

Verify:

```bash
cd /Users/lianglei/Code/bluejob/deepseek-harness
git status --short
git rev-parse HEAD
```

Required SHA:

```text
141eb6fef83422698aef7a981029e843e8161534
```

It must remain detached and have no tracked modifications.

Phase 5B may install dependencies and build the pinned checkout if required for real adapter verification, provided:

- no tracked DSH file changes;
- no commit or branch is created there;
- no DSH source is copied into the new repository;
- the final DSH `git status --short` is clean;
- the exact commands and build outputs are recorded.

Do not configure a real DeepSeek API key merely for this phase. Use no-credential surfaces, official mock/test support, or deterministic fixtures.

## 10. Package A — `@aa-office/dsh-theme`

Implement the AA visual palette through documented DSH theme APIs only.

Consume public exports from the pinned `@deepseek-ai/dsh-client-ui-theme` package.

Use verified APIs such as:

```text
ThemeRuntime.register
ThemeRuntime.overrideTokens
ThemeRuntime.exportInspectTokens
```

Do not invent DSH aliases.

Do not directly style DSH private DOM selectors or CSS-module class names.

Map only the aliases verified by Phase 5A. Every override layer must provide both light and dark values where required by DSH.

AA semantic roles without verified DSH aliases must remain AA-scoped custom properties used only inside AA-owned components:

```text
waiting
offline
paper
workstation
briefcase
folder
```

The theme plugin must:

- have a deterministic source id;
- return/dispose every theme registration or override effect correctly;
- preserve the user's DSH light/dark/system preference semantics;
- not write a new user preference unless the public API and product decision explicitly require it;
- expose contract tests for registration, override order, light/dark mapping, and disposal;
- fail clearly if a mapped DSH alias disappears at a future pin.

## 11. Package B — `@aa-office/dsh-brand`

Implement original AA brand occupants for the documented generic brand slots:

```text
sidebar.brand.mark
sidebar.brand.name
conversation.hero.brand.mark
```

Use only AA-owned portable assets and accessible text.

Recommended visible name:

```text
AA OFFICE
```

Recommended descriptive copy where needed:

```text
AA Office for DSH
built on DeepSeek Harness
```

Do not use:

- DeepSeek official fish/whale mark;
- DeepSeek official wordmark;
- copied `ui-brand-official` components;
- endorsement language;
- the full `DeepSeek Harness` trademark as the project name.

The bundle/profile layer may disable or replace only the official brand occupant row required to avoid duplicate brand marks. It must preserve the official Sidebar and Conversation packages.

Tests must prove:

- all three generic brand slots mount;
- accessible names exist;
- disposal removes only AA contributions;
- Sidebar, Workspace, Settings, Conversation, and composer child slots remain alive;
- no official DeepSeek asset or source enters the repository.

## 12. Package C — `@aa-office/dsh-skin`

Implement one bounded, truthful Session/Worker status contribution.

Preferred first seat:

```text
conversation.session.header.utilities
```

Use another documented additive seat only if the pinned public contract proves the preferred seat is unavailable. Record the exact reason.

The first component may show:

```text
AA WORKER
SESSION STATE
MODEL, only if authoritative and public
PENDING INTERACTION, only if authoritative and public
REASONING, only if authoritative and public; otherwise UNKNOWN
```

Required status precedence:

1. pending approval / pending question / pending plan review -> `WAITING` with exact text;
2. authoritative session running -> `WORKING`;
3. authoritative terminal error/failure state, if publicly available -> `ERROR`;
4. connected non-running session -> `IDLE`;
5. missing/unavailable session -> `OFFLINE` or `UNKNOWN`, according to public evidence.

Forbidden inferences:

- do not infer status from elapsed time;
- do not parse conversation text;
- do not scrape the DOM;
- do not infer reasoning level from model name;
- do not call an Agent preset a live Worker;
- do not call a produced path a deliverable unless it satisfies the pinned DSH structured rule;
- do not claim completion merely because a tool call ended.

Reasoning Hair rules:

- use a neutral hair state when reasoning is unknown;
- display explicit `UNKNOWN` text;
- only map hair levels when a public authoritative reasoning value is verified.

The status component must be compact, text-backed, keyboard-safe, screen-reader named, and reduced-motion compliant.

All component CSS must be locally scoped to AA-owned classes/components. Do not target private DSH DOM structure.

An optional pointer-safe `shell.overlay` contribution is allowed only after the header utility works and only if it adds real value without blocking pointer, focus, scroll, or mobile/narrow layouts. Omitting it is acceptable.

## 13. Package D — `@aa-office/dsh-bundle`

Create a removable Cordis overlay/profile composition that mounts:

```text
dsh-theme
dsh-brand
dsh-skin
```

The bundle must:

- use only documented Cordis/profile/patch semantics;
- preserve official `ui-layout`, `ui-sidebar`, `ui-workspace`, `ui-conversation`, `ui-tool`, `ui-settings`, approval, question, model, permission, and deliverable packages;
- disable or replace only the official brand row if required;
- avoid whole-slot replacement;
- avoid `root`, `sidebar`, `conversation`, and `details` ownership;
- be removable through one profile/patch change;
- restore the official DSH UI when omitted.

Provide a documented command similar to:

```bash
pnpm dsh web --patch /absolute/path/to/aa-office-dsh/packages/dsh-bundle/cordis.patch.yml
```

Do not commit machine-specific absolute paths. Provide a runner that resolves paths at runtime.

## 14. Example application and developer workflow

Create `examples/aa-dsh-web` with:

- prerequisites;
- exact DSH pin check;
- dependency installation;
- build commands;
- one command to launch official DSH Web with the AA adapter;
- one command to launch official DSH Web without AA for comparison;
- one command to run tests;
- rollback instructions;
- no API-key requirement for shell/brand/theme smoke testing.

The example must use the new repository as the writable implementation source and the pinned DSH checkout only as the host.

If HMR is practical through documented DSH client plugin behavior, test and document it. If not, document the rebuild/restart loop honestly.

## 15. Real compatibility verification

Run a real pinned DSH Web boot with the adapter mounted.

Minimum real checks:

### 15.1 Cold boot

- official DSH host starts;
- AA adapter packages resolve;
- browser loads with zero uncaught errors;
- Sidebar, Conversation, Details, Settings, and Workspace surfaces remain available;
- removing the AA patch restores the official surface.

### 15.2 Theme

- AA palette applies through public aliases;
- light mode is legible;
- dark mode is legible or explicitly rejected by a documented product decision;
- system preference transitions preserve DSH semantics;
- no private selector dependency is present;
- disposing the theme layer restores prior values.

### 15.3 Brand

- AA mark and name render in generic slots;
- no duplicate official and AA brand remains;
- blank Hero and active Session surfaces both remain usable;
- collapse/expand behavior remains official DSH behavior.

### 15.4 Session/Worker status

Use deterministic public fixtures, official mock support, or a no-credential local test route to prove at least:

```text
IDLE
WORKING
WAITING FOR APPROVAL or WAITING FOR ANSWER
UNKNOWN/OFFLINE
```

If a real `ERROR` state cannot be created through public no-credential paths, unit-test the translator only and report that boundary.

### 15.5 Official behavior regression

Verify that AA does not break:

- adding/selecting a Workspace;
- creating/selecting a Session;
- composer input and focus;
- settings opening;
- model settings surface;
- sidebar collapse/expand;
- details open/close;
- approval/question composer takeover where practical;
- Tool rows/details where practical;
- Session archive where practical;
- reduced motion;
- keyboard navigation;
- narrow layout concession.

### 15.6 Viewports and evidence

Capture safe screenshots at minimum:

```text
1440×800
1920×976
```

Also test one narrow viewport supported by the official Web UI.

Evidence must not contain:

- API keys;
- personal paths;
- terminal transcripts;
- real repository names if unnecessary;
- emails;
- access tokens;
- private Session identifiers;
- official DeepSeek brand assets copied into AA-owned files.

## 16. Automated verification

Required checks:

- root install with frozen lockfile;
- all package builds;
- TypeScript;
- lint/format;
- unit tests;
- theme alias contract tests;
- slot declaration/mount/disposal tests;
- semantic translator tests;
- provenance completeness;
- package-boundary audit;
- no Superset application import/reference;
- no Electron, tRPC, TanStack application router, Pi bridge, xterm, or Superset-specific selector;
- no DSH private `src` import from adapter packages;
- no official DeepSeek brand art;
- no remote assets;
- no committed absolute local paths;
- JSON/YAML validation;
- SVG/XML validation;
- accessibility smoke;
- reduced-motion smoke;
- real DSH cold boot and browser smoke;
- official UI rollback smoke;
- `git diff --check`;
- sensitive-information scan.

Use DSH public package exports and documented test surfaces. Do not make tests pass by reaching into private implementation paths.

## 17. Required documentation

Create in the new repository:

```text
README.md
AGENTS.md
LICENSE-STATUS.md

docs/PROVENANCE.md
docs/SOURCE-PINS.md
docs/DSH-COMPATIBILITY.md
docs/SEMANTIC-MAPPING.md
docs/PHASE-5B-REPORT.md
docs/AA-OFFICE-FOR-DSH-V0.1-CHECKPOINT.md
docs/evidence/README.md
```

The README must explain:

- what AA Office for DSH is;
- that it is a private prototype;
- how it relates to DSH;
- how to run it;
- how to disable it;
- which official DSH behaviors remain authoritative;
- current compatibility pin;
- current license status.

The report must include:

- final repository URL and visibility;
- exact source pins;
- package structure;
- dependency strategy;
- consumed public DSH contracts;
- theme coverage and scoped-token gaps;
- brand slot behavior;
- Session/Worker status authority and fallbacks;
- real boot results;
- official behavior regression results;
- screenshots/evidence;
- provenance and license status;
- known compatibility risks;
- measured visual/product gaps;
- whether Option 1 is sufficient.

## 18. Strict frozen boundaries

Do not:

- modify or commit to the official DSH checkout;
- modify the Superset control repository after reading this brief;
- copy `AAOffice` React, CSS, routing, Runtime, Electron, tRPC, xterm, or test code;
- copy DSH official UI source or brand components;
- import private DSH `src` paths;
- replace `ui-layout`, `ui-sidebar`, `ui-conversation`, or `ui-details`;
- occupy the root `sidebar`, `conversation`, `details`, or `root` slots;
- introduce deep selectors against official DSH DOM/CSS modules;
- add Runtime/model-loop behavior;
- create a new deliverable entity;
- create a new Session database;
- configure or expose real credentials;
- publish npm packages;
- make the repository public;
- add a distribution license;
- begin Phase 5C.

## 19. Stop conditions

Stop implementation and report clearly if any of the following occurs:

1. `Jiqize/aa-office-dsh` already exists or the local target path is occupied.
2. GitHub CLI authentication cannot create a private repository.
3. A required DSH dependency cannot be consumed without copying source or importing a private path.
4. AA identity requires replacing an official whole shell slot.
5. Official Workspace, Session, composer, settings, approval, or tool behavior regresses.
6. A status cannot be derived truthfully from a public contract.
7. Provenance cannot classify a file before copying it.
8. Any secret or personal data would need to enter the repository or evidence.
9. The official DSH checkout acquires tracked changes.
10. Rollback cannot restore the official UI by removing the AA patch.

Do not work around a stop condition silently.

## 20. Decision gate

End `docs/PHASE-5B-REPORT.md` with exactly one decision:

```text
OPTION 1 SUFFICIENT — PROCEED TO AA DSH PRODUCT REFINEMENT
OPTION 1 SUFFICIENT WITH ACCEPTED GAPS — PROCEED CAUTIOUSLY
OPTION 1 INSUFFICIENT — SPIKE ONE BOUNDED PUBLIC SHELL SLOT
DO NOT PROCEED WITH AA OFFICE FOR DSH
```

Do not select an escalation merely because the first version is less visually complete than Superset AA. Escalation requires a documented critical product requirement that cannot be implemented through verified theme aliases, generic brand slots, additive inner slots, or AA-owned wrappers.

## 21. Completion protocol

After implementation and verification:

1. review every changed/new file in `aa-office-dsh`;
2. confirm the Superset control repository remains clean and unchanged after this brief commit;
3. confirm the official DSH checkout remains detached, pinned, and clean;
4. run all required checks;
5. create `docs/PHASE-5B-REPORT.md` and the checkpoint;
6. commit all new-repository work to `main`;
7. push to `origin/main`;
8. verify the GitHub repository is private;
9. verify local `main` equals `origin/main`;
10. verify `git status --short` is empty in all three repositories;
11. STOP.

Do not begin Phase 5C.