# AA Portable UI Kit v0.1 Checkpoint

Checkpoint status: **Phase 5A complete; Phase 5B not started**.

The Git commit containing this file is the immutable Phase 5A checkpoint. It records a portable AA visual/semantic kit and a DSH adapter decision, not a production DSH port or an independently licensed package.

## Baselines

| System | Baseline |
| --- | --- |
| Writable Superset repository | branch `aa-spike`; Phase 5A started clean at `4cfff9261e2cbdb4f9d3f653312f80482657b0f1` |
| DeepSeek Harness reference | official checkout, detached and clean at `141eb6fef83422698aef7a981029e843e8161534` |
| DSH version | `0.1.0-rc.8`, MIT, Node `^22.19.0 || >=24.0.0`, pnpm `11.7.0` |
| Portable license | intentionally undeclared pending provenance/owner review |

No current AA Runtime/Host behavior, AAOffice implementation, Superset package, or DSH file changed in this phase.

## Portable kit inventory

| Area | Result |
| --- | --- |
| Source provenance | 137 records: 23 AA-original, 114 Superset-adapted, 0 copied third-party, 0 unknown |
| Core system | 26 palette values plus spacing, dimensions, borders, radius, depth, typography, icon/avatar sizes, and motion |
| Semantic system | 21 host-neutral roles |
| Superset mapping | 19 supported, 2 explicit unsupported/composed roles |
| DSH mapping | 15 verified alias targets, 6 explicit scoped-skin gaps |
| Icons | 19 individual local SVGs at 16/20/24/32 px |
| Worker sheets | anatomy, personas, hair levels, activity states, and props at 24/32/48 px |
| Motion | stepped, bounded, truth-driven contract with system and explicit reduced-motion fallback |
| Contracts | design system, semantic model, and 17 component presentation contracts |
| Gallery | no-build local HTML/CSS/JS specimen, independent of Superset and DSH code |

The worker composition remains:

```text
base anatomy + persona + reasoning hair + authoritative activity + optional prop
```

No combinatorial asset dump, downloaded font, remote image, official DeepSeek mark, or copied Superset icon/component entered the kit.

## DSH architecture decision

Verified public/documented seams at the pin:

- profile/bundle/overlay composition;
- `ThemeRuntime.register` and `overrideTokens`, with mandatory light/dark pairs;
- generic brand seats;
- typed declaration-aware UI slots;
- additive `shell.overlay`, conversation utilities, turn-tail, tool-view, and settings seats;
- Workspace, Session, snapshot, and projection outward faces;
- structured Session, Agent, Tool, approval, and produced-file sources.

Internal implementation boundaries include AppFrame/store/column solver, CSS modules and DOM selectors, conversation assembler internals, boot details, and official brand components. They are not adapter dependencies.

The semantic axis is fixed:

```text
DSH Workspace -> Briefcase
DSH Session -> Task Folder / selected Work Folder
Agent preset -> Employee role
Active Agent -> Worker
```

DSH deliverables are not treated as a first-class entity at this pin. AA's outbox/stamped document maps to the conservative produced-file fact derived from a successful mutation result plus structured `locations`.

## Decision gate

Selected option: **Theme + Brand + Scoped Skin plugins**.

Recommended future names:

```text
AA Office for DSH
@aa-office/dsh-theme
@aa-office/dsh-brand
@aa-office/dsh-skin
@aa-office/dsh-bundle
```

“built on DeepSeek Harness” may be used only as truthful descriptive copy. Official marks and endorsement language remain out of scope.

Escalation order is fixed:

1. theme + brand + additive/scoped skin;
2. one bounded shell slot only after a measured public-seam gap;
3. one selective clean-room official package replacement with parity evidence;
4. full layout replacement only as a separately approved last resort.

## Verification checkpoint

| Check | Result |
| --- | --- |
| Portable audit | PASS — 1332 assertions; 6 JSON; 24 SVG; 24 assets; 21 semantic tokens; 137 inventory records |
| JSON / XML | PASS — all JSON parsed; all SVGs passed `xmllint`, metadata, integer viewBox, and dependency checks |
| Gallery browser smoke | PASS — 0 console errors/warnings; 108/108 images loaded; no 1440 px overflow |
| Practical accessibility | PASS — no duplicate ids, unnamed buttons, missing `alt`, or unlabeled fields; landmarks/live regions present |
| Interaction / reduced motion | PASS — motion toggle, tabs, state translator, and structured demo approval behavior verified |
| Required screenshots | PASS — 1440×800 and 1920×976 CSS-pixel PNGs with recorded SHA-256 |
| Existing AAOffice regression | PASS — 36 tests in 4 targeted files |
| Repository formatter | PASS — `bun run lint:fix` |
| Repository lint/guards | PASS — 6058 files checked; no diagnostics/fixes |
| TypeScript | Not applicable — Phase 5A changed no `.ts` or `.tsx` file |
| Sensitive information | PASS — text patterns plus visual evidence review; demo-only screenshot policy |
| Provenance | PASS — every design file, 19 Phase 1–4C visual/checkpoint document, and 114 AAOffice file is assigned |
| Frozen area | PASS — only Phase 5A documentation, portable assets/evidence, and the narrow audit script changed |
| DSH build/test | Not run — reference checkout is intentionally clean/read-only and has no installed dependencies |

Evidence: `docs/aa/dsh/phase-5a-evidence/README.md`.

## Known constraints carried forward

- DSH `0.1.0-rc.8` contracts are developer-preview and must remain pinned/tested.
- Six AA semantic roles need adapter-scoped variables because no verified DSH equivalent exists.
- Reasoning level may be unavailable; the truthful fallback is unknown plus neutral hair and text.
- Whole-slot replacement recursively removes child declarations; it is not a cosmetic swap.
- Direct styling of DSH internal DOM/CSS modules is not a supported portability strategy.
- Independent distribution waits for an explicit provenance/license decision.

## Bounded next checkpoint

If Phase 5B is separately authorized, its first checkpoint should contain only a pinned out-of-tree theme, AA-owned brand occupants, one session-header worker/status contribution driven by real snapshots, an optional pointer-safe shell overlay, a dedicated profile overlay, and cold-boot/contract/e2e evidence. It must not include a full shell/layout replacement or new runtime semantics.

Phase 5A stops at this checkpoint.
