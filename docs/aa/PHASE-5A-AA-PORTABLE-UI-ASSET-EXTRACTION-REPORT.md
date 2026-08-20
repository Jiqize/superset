# Phase 5A — AA Portable UI Asset Extraction and DSH Adapter Spike Report

## Outcome

Phase 5A produced a complete framework-neutral AA asset/contract kit, a build-free independent gallery, a file-complete provenance audit, a pinned DeepSeek Harness architecture map, an evidence-backed semantic translation, and a four-option adapter plan. No AA Runtime/Host behavior changed, no current AAOffice source moved, no Superset package was adapted, and the DSH reference remained detached, clean, and unmodified.

The evidence supports a narrow adapter built from documented theme, generic brand, and additive/scoped slot seams. It does not support beginning a production port or replacing the DSH layout.

## Repository safety and pins

Phase start checks were run in the writable repository before any edit:

```text
pwd                                      writable Superset repository confirmed
git status --short                       empty
git branch --show-current                aa-spike
git fetch origin                         success
git pull --ff-only origin aa-spike       fast-forward success
git rev-parse HEAD                       4cfff9261e2cbdb4f9d3f653312f80482657b0f1
```

The official DeepSeek Harness repository was checked out as a separate read-only reference and pinned to:

```text
141eb6fef83422698aef7a981029e843e8161534
```

It remained detached and clean. Root metadata reports `0.1.0-rc.8`, MIT, Node `^22.19.0 || >=24.0.0`, and pnpm `11.7.0`. The local Node `24.14.0` and pnpm `11.7.0` satisfy those ranges. The checkout had no `node_modules`; build/typecheck/test were deliberately not run because installing dependencies would modify the forbidden read-only reference.

## Source inventory and provenance

The audit covers the minimum Phase 1–4C source set file by file:

- all 4 files under `docs/aa/design/`;
- all 19 visual design-system, decision, audit, punch-list, Phase 4C, and checkpoint documents;
- all 114 files in the current AAOffice implementation tree, including CSS;
- current third-party/host dependency surfaces referenced by those files.

### Counts

| Classification | Records | Disposition |
| --- | ---: | --- |
| AA-original | 23 | Consolidated as design evidence; reference art redrawn/split with attribution retained |
| Superset-adapted | 114 | Existing code/CSS excluded from any independent package; concepts only inform new contracts |
| third-party | 0 | No third-party source or asset copied |
| unknown | 0 | No unresolved item admitted |
| **Total** | **137** | Complete at the pinned Superset baseline |

`AA-ASSET-PROVENANCE.md` assigns every record to a profile that states path, purpose, dependency surface, visual portability, code portability, clean-room work, attribution/license, and destination. It also records the original reference-sheet introduction commits:

- icon reference sheet: `831d5196bbc18674f40df85c02d55af3db5a13c7`, Jiqize;
- worker/state reference sheet: `f49a495f2374a3615a0e807b7de5289ca61f698d`, Jiqize.

The source repository is ELv2. Phase 5A intentionally declares no independent portable-package license. Ownership/license approval is a hard future distribution gate.

## Portable asset kit

### Framework-neutral documents and data

```text
docs/aa/portable/AA-PORTABLE-DESIGN-SYSTEM.md
docs/aa/portable/AA-SEMANTIC-MODEL.md
docs/aa/portable/AA-COMPONENT-CONTRACTS.md
docs/aa/portable/AA-ASSET-PROVENANCE.md
docs/aa/portable/asset-manifest.json
docs/aa/portable/motion/motion-spec.json
```

The design system removes Phase-1-only and Superset-only assumptions while retaining hard-edge depth, compact 4 px density, state truthfulness, redundant state text, motion limits, accessibility, and anti-patterns. The semantic model covers Briefcase, Task/Work Folder, Employee, Runtime, Model, Reasoning/Hair, Workstation, File Cabinet, Approval, Deliverable, and Archive with authoritative inputs and forbidden inferences. Seventeen component contracts define presentation props/behavior without creating a framework.

### Token system

The two-level system contains 26 palette primitives plus spacing, dimensions, border widths, radius, depth, typography, supported asset sizes, and motion durations/fps. Its 21 semantic roles cover every role required by the brief.

| Platform map | Supported | Explicitly unsupported | Result |
| --- | ---: | ---: | --- |
| Current AA/Superset | 19 / 21 | 2 | Folder is composed; disabled is derived rather than a dedicated variable |
| DSH pin | 15 / 21 | 6 | Waiting, offline, paper, workstation, briefcase, and folder stay scoped AA variables |

The DSH map names only aliases verified in the pinned theme source. Every gap has a reason; no synthetic `--dsw-*` token was invented.

### SVG art list

Nineteen individual icons:

```text
home                 briefcase             folder
filing-cabinet       conversation          agent
settings             terminal              files
changes              diff                  approval
deliverable          status-idle           status-working
status-waiting       status-success        status-error
status-offline
```

Five composable worker sheets:

```text
anatomy              personas              hair-levels
states               props
```

Every SVG has an integer viewBox, crisp-edge metadata, title/description, local shapes only, no `<text>`, external font/image/network dependency, or official DeepSeek mark. Icons declare 16/20/24/32 px; worker sheets declare 24/32/48 px. The new paths are clean-room redraws from AA-original reference evidence and semantics; no `AAIcon.tsx`, avatar JSX, Superset icon, or host selector was copied.

## Independent gallery

`docs/aa/portable/gallery/index.html` opens without a build and uses only sibling HTML/CSS/JavaScript/SVG files. It imports no Superset or DSH code and performs no fetch. The visual thesis is a late-1990s office workstation specimen with warm grey hard-edge hierarchy, charcoal structure, sparse navy/amber signal, and original pixel workers.

It demonstrates:

- all core colors and semantic roles;
- surface/border depth and typography scale;
- buttons, inputs, tabs, panels, status lights, focus/disabled/pending/error states;
- all 19 icons at all four sizes;
- worker anatomy, four personas, five hair levels, six activity states, five props, and three render sizes;
- system and explicit reduced-motion handling;
- Briefcase, Task Folder, File Cabinet, workstation, approval paper, and deliverable tray;
- independent Superset and DSH composition studies;
- exact DSH `Sidebar | Conversation | Details` composition language;
- structured demo approval and conservative produced-file deliverable examples.

All illustrative state is visibly labelled `DEMO` or `STATIC GALLERY · DEMO DATA` and is not presented as live Runtime fact.

### Gallery verification

Chromium/Playwright verification reported:

```text
console errors / warnings     0 / 0
images loaded                 108 / 108
horizontal overflow at 1440   0 px
duplicate ids                 0
unnamed buttons               0
images missing alt            0
unlabelled fields             0
main / nav / live regions     1 / 2 / 2
```

The motion toggle updated both `aria-pressed` and the root motion mode; keyboard-style tabs exposed their associated panel; the state translator changed persistent/live text; the demo approval updated outcome text and disabled both outcome controls.

Safe screenshots exist at exact CSS-pixel dimensions:

- `docs/aa/dsh/phase-5a-evidence/aa-portable-gallery-1440x800.png`;
- `docs/aa/dsh/phase-5a-evidence/aa-portable-gallery-1920x976.png`.

Hashes and the safe-evidence policy are recorded in the evidence README.

## Portable dependency audit

`scripts/aa/verify-aa-portable.mjs` is a read-only verification script. It passed 1332 assertions and checks:

- every JSON file parses;
- every manifest file exists and ids/paths are unique;
- all 24 SVGs parse through `xmllint`, match their manifest viewBox/sizes, and contain required metadata;
- every semantic key is covered exactly once in both platform maps;
- every supported DSH target belongs to the pinned verified alias allowlist;
- unsupported mappings have explicit reasons;
- runtime assets/gallery contain no Superset module, Electron, tRPC, TanStack application router/data module, Pi bridge, xterm, Superset-specific selector, official DeepSeek mark, module import, or remote resource;
- gallery local resources, document landmarks, image alternatives, button names, live text, and reduced-motion contracts exist;
- all 137 provenance inputs remain enumerated;
- every changed file stays inside the Phase 5A frozen scope;
- changed text files contain no absolute user/home path, API-key-like material, bearer token, or email address.

## DSH architecture findings

### Bootstrap and composition

The Web path is a thin `apps/web` entry into `AppWebEntry`. The client Web kernel builds a module system from `window.__ModuleLoader__` / `window.__DSH_BOOT__`, prefetches immediate plugins, mounts Cordis Loader, activates the roster, and hands the root to `uiRenderer`.

The shipped Web profile is exactly:

```text
@deepseek-ai/dsh-base + @deepseek-ai/dsh-web-app
```

Composition order is bundle layers, profile patch, home patch, `--patch` overlays, then launcher overlays. This is the correct out-of-tree adapter seam.

### Theme, brand, and slots

- `ThemeRuntime.register` and `overrideTokens` are exported/documented; override values require both light and dark modes.
- The official brand package fills only generic brand slots in official builds. AA can provide its own mark/name without copying official assets.
- The typed slot registry makes declaration and lifecycle ownership explicit.
- `root` owns `sidebar`, `conversation`, `details`, and additive `shell.overlay`.
- Inner sidebar, conversation, tool, turn-tail, input, and settings seats provide additive paths before whole-slot replacement.
- Replacing a whole occupant also removes its child declarations; this is the main shell-replacement hazard.

### Workspace, Session, events, and outputs

The semantic mapping is host-native:

```text
DSH Workspace -> Briefcase
DSH Session -> Task Folder / selected Work Folder
Agent preset -> Employee role
Active Agent -> Worker
Model -> brain/badge detail
Reasoning -> hair + text
Approval -> signature paper
Tool call -> office tool/paper trail
Deliverable -> outbox/stamped produced-file fact
Composer -> desk inbox
Details -> file cabinet/inspector
```

Workspace and Session outward faces, `ConversationSnapshot`, projection faces, durable Session events, scoped Agent events, and browser approval mux provide authoritative inputs. UI components should consume the existing client snapshots/owner props rather than subscribe to low-level Agent internals.

The pinned `ui-deliverables` implementation derives produced paths from successful mutation render intent plus structured `locations`; reads, deletes, failures, and prose do not count. This refines the earlier research phrase “durable deliverable data”: there is no separate first-class Deliverable record at this pin.

### Public versus internal boundary

Public/documented seams selected for a future spike:

- theme runtime exports and inspected aliases;
- typed slot contracts and documented owner props;
- generic brand seats;
- profile/bundle overlay composition;
- Workspace/Session outward faces and named projection contracts;
- settings extension slots.

Internal/non-consumable evidence:

- AppFrame JSX, layout stores, column solver, and CSS modules;
- private DOM selectors and conversation assembly/store internals;
- Web boot implementation details;
- official Brand components and assets.

All public seams are still developer-preview dependencies because the pinned version is an RC. A future adapter must pin and contract-test them.

## Adapter option analysis

| Option | Risk | Merge cost | Decision |
| --- | --- | --- | --- |
| Theme + Brand + Scoped Skin | Low–medium | Low | Recommended first implementation |
| One shell contribution via existing layout slot | Medium–high | Medium | Escalate only after a measured Option 1 gap |
| Selective official UI package replacement | High | High | One bounded clean-room replacement with parity evidence only |
| Full layout replacement | Very high | Very high/fork-like | Last resort; current evidence does not justify it |

The detailed plan names packages/plugins, consumed public contracts, compatibility risk, merge cost, testing, migration/rollback, and stop conditions for every option.

## Known incompatibilities

1. Six AA semantic roles have no verified DSH equivalent and need AA-scoped variables.
2. DSH theme/slot/package APIs are RC/developer-preview and can drift.
3. Official layout DOM and CSS modules are internal; deep-selector skinning is not portable.
4. Whole-slot replacement collapses child declarations and can remove workspace, settings, composer, or tool behavior.
5. DSH Workspace/Session and Superset Project/Workspace use different semantic axes.
6. A configured Agent preset is not a live worker; scoped Agent/runtime evidence is required.
7. There is no verified universal reasoning-level field; unknown is the required fallback.
8. Produced-file deliverables are derived/turn-local rather than a first-class durable output entity.
9. The read-only DSH checkout had no dependencies, so Phase 5A did not execute DSH builds or tests.

## Clean-room rewrite requirements

Before any independent package distribution:

1. approve ownership and an explicit independent license;
2. retain the provenance/source pins and prohibit silent `Superset-adapted`, third-party, or unknown entry;
3. use the new SVGs/contracts rather than copying AAOffice React/CSS/tests;
4. implement host translators from documented snapshots/slots, never Superset runtime bridges or DSH internals;
5. keep official DeepSeek marks and code out; use descriptive brand copy only;
6. contract-test every DSH alias, slot, owner prop, projection key, approval state, and produced-file rule at the chosen pin;
7. repeat dependency, manifest, XML, accessibility, sensitive-information, and screenshot audits.

## Verification summary

| Verification | Result |
| --- | --- |
| New portable audit | PASS — 1332 assertions |
| JSON validation | PASS — 6 files |
| SVG/XML validation | PASS — 24 files through `xmllint` |
| Static gallery smoke | PASS — local static server, no build or external request |
| Practical accessibility | PASS — static audit plus live browser checks |
| 1440×800 / 1920×976 screenshots | PASS — exact dimensions and hashes recorded |
| Existing targeted AAOffice tests | PASS — 36 tests, 0 failures across CSS/state/persona/hair files |
| Formatter | PASS — `bun run lint:fix`, no remaining fixes |
| Repository lint/guards | PASS — 6058 files checked, no diagnostics |
| TypeScript | Not applicable — no TypeScript file changed |
| `git diff --check` | PASS at completion review, including the staged new-file diff |
| Sensitive-information scan | PASS — automated text scan plus screenshot review |
| Provenance completeness | PASS — 137/137 records |
| Frozen-area audit | PASS — no `apps/desktop`, package, runtime, host, or DSH file changed |
| DSH build/typecheck | Not run — clean read-only checkout lacks installed dependencies |

## Recommended Phase 5B scope

If separately authorized, Phase 5B should be a bounded out-of-tree Option 1 spike:

1. resolve independent licensing and pin/re-audit DSH;
2. implement `@aa-office/dsh-theme` against inspected aliases;
3. implement AA-owned brand occupants and profile-level official brand replacement;
4. implement one truthful `conversation.session.header.utilities` worker/status contribution;
5. optionally add one pointer-safe `shell.overlay` status element;
6. preserve official Sidebar, Conversation, Details, Workspace, composer, settings, tool, and deliverables behavior;
7. run cold-boot, disposal, semantic, approval/deliverable, accessibility, theme, narrow-layout, HMR, and official regression evidence;
8. write a measured gap report before considering Option 2.

Do not begin full shell/layout replacement, production distribution, official package forking, or runtime/model-loop changes in that first slice.

PROCEED WITH DSH THEME + BRAND + SCOPED SKIN PLUGINS
