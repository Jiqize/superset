# AA Office for DSH — Adapter Plan

## Decision

Start with **Option 1: Theme + Brand + Scoped Skin plugins**. The pinned DSH source exposes enough documented theme aliases, generic brand seats, additive layout/conversation/settings slots, and Workspace/Session snapshot contracts to prove AA identity without replacing the shell.

This is a plan for a bounded Phase 5B adapter spike, not a production port. No DSH code or profile is modified in Phase 5A.

## Naming and brand boundary

Working product name: **AA Office for DSH**.

Recommended package family:

```text
@aa-office/dsh-theme    verified ThemeRuntime overrides
@aa-office/dsh-brand    AA-owned brand slot occupants
@aa-office/dsh-skin     scoped AA presentation and additive slot contributions
@aa-office/dsh-bundle   optional profile patch package composing the three
```

Descriptive footer copy may say **built on DeepSeek Harness** when it is factually true. The adapter must not use the official DeepSeek logo, fish mark, official wordmark, or imply endorsement. The profile layer replaces/disables the official brand occupant and registers the original AA mark in generic slots.

## Proposed package boundaries

```text
portable assets/contracts
  -> dsh-theme  (tokens only; no domain reads)
  -> dsh-brand  (brand slots only; no Session reads)
  -> dsh-skin   (typed additive slots + pure semantic translators)
  -> dsh-bundle (composition rows only; no UI implementation)
```

Each package has one responsibility and one disposal lifecycle. The skin may depend on theme and brand types only where unavoidable; the theme and brand packages never depend on skin. Host/runtime event translation stays in a small tested module inside `dsh-skin`, outside visual components.

## Option comparison

| Option | Identity ceiling | Compatibility risk | Upstream merge cost | Initial verdict |
| --- | --- | --- | --- | --- |
| 1. Theme + Brand + Scoped Skin | High visual identity; official shell behavior preserved | Low–medium, mainly RC contract drift and limited object-color aliases | Low | **Choose first** |
| 2. Shell contribution via existing slots | Higher structural identity in selected regions | Medium; whole-slot ownership can collapse child seats | Medium | Escalation only after measured Option 1 gaps |
| 3. Selective official package replacement | Very high within replaced domains | High; assumes each package's full behavior/accessibility contract | High | Only for one proven, bounded package gap |
| 4. Full layout replacement | Maximum | Very high; owns root geometry, providers, responsive and lifecycle behavior | Very high / fork-like | Last resort; no current evidence |

## Option 1 — Theme + Brand + Scoped Skin plugins

### Packages/plugins

- `@aa-office/dsh-theme`: call `ThemeRuntime.register` or `overrideTokens` with verified aliases and both palette modes.
- `@aa-office/dsh-brand`: occupy `sidebar.brand.mark`, `sidebar.brand.name`, and `conversation.hero.brand.mark` with AA-owned accessible components.
- `@aa-office/dsh-skin`: add session status/worker utility, optional frame status, and tightly scoped AA wrappers or style ownership exposed by its own occupants.
- `@aa-office/dsh-bundle`: later profile layer that inserts the three client rows and removes only the official brand occupant when necessary.

### Consumed public contracts

- `@deepseek-ai/dsh-client-ui-theme/client`: `ThemeRuntime.register`, `overrideTokens`, inspection API.
- `@deepseek-ai/dsh-client-ui-slots`: declaration-aware `register`/`inject` and composed props.
- Sidebar, conversation, layout, and settings exported slot declarations.
- `IWorkspaces`, `ISessions`, `SessionFace`, snapshot/projection selector hooks only for state actually displayed.
- Profile bundle and `cordis.patch.yml` overlay semantics.

No CSS module, AppFrame, column solver, conversation assembler, boot kernel, or official brand component is imported.

### Compatibility risk

Low relative to the alternatives, but not low in absolute terms because DSH is `0.1.0-rc.8`. Risks are renamed token/slot keys, changed owner props, and official composition row changes. Theme overrides cannot express all AA object semantics, so the skin must own AA variables only inside AA-rendered wrappers rather than target private host markup.

### Upstream merge cost

Low. The adapter lives out of tree or as independent packages plus a later overlay. Upgrading DSH requires updating pins and contract snapshots, not rebasing a UI fork.

### Testing strategy

1. manifest test: package `dsh.client` face and profile rows resolve;
2. theme contract: inspect every mapped alias and verify light/dark values/disposal;
3. slot contract: boot real declarations, mount each AA occupant, dispose it, and assert official child seats remain live;
4. semantic translator unit tests for unknown/idle/working/waiting/error/offline precedence;
5. approval replay/reconnect and allowed-outcome tests;
6. deliverable tests matching DSH's successful-mutation-plus-`locations` rule;
7. keyboard, accessible name, focus, contrast, and reduced-motion checks;
8. cold Web profile boot plus 1440×800, 1920×976, narrow, dark/light, and HMR smoke tests;
9. upstream official Web snapshot subset to prove Workspace, Session, composer, details, and settings behavior remains.

### Migration path

Ship behind an AA-specific profile/bundle. First enable theme only, then brand, then one additive status occupant, then optional local skin wrappers. Every step is independently removable. Keep official shell packages mounted and collect specific gap evidence before escalating.

### Stop conditions

Stop Option 1 and review Option 2 only if at least one critical AA requirement cannot be implemented through documented aliases, generic brand slots, additive inner slots, or AA-owned wrappers **without** deep selectors. Cosmetic mismatch alone is not sufficient. Stop the whole port if truthful Workspace/Session/approval/deliverable mapping would require inventing host facts.

## Option 2 — Shell contribution plugin using existing layout slots

### Packages/plugins

Add `@aa-office/dsh-shell` to occupy one bounded shell slot—most plausibly `sidebar` or `details`—while leaving `root`, `conversation`, and the other official packages intact. The replacement must redeclare and render every child seat the official occupant currently owns.

### Consumed public contracts

- `SidebarOwnerProps`, `DetailsOwnerProps`, `ILayout`, slot render/store/inject contracts;
- all child declarations of the replaced occupant;
- workspace/session and settings faces needed to preserve the official interaction surface.

### Compatibility risk

Medium to high. A whole-slot registration is exclusive. Replacing `sidebar` removes `sidebar.brand.*`, `sidebar.workspaces`, `sidebar.settings`, and footer declarations unless the AA shell faithfully recreates them. Replacing `details` can remove `conversation.details.tool`.

### Upstream merge cost

Medium. AA owns a structural component and must track changes to owner props, declared children, accessibility, geometry, and official browser behavior.

### Testing strategy

Run every Option 1 test plus parity tests for all child seats, collapsed 56 px rail, expansion/focus, Workspace/Session browser, settings trigger/dialog, details open/close, narrow concession, and lifecycle disposal. Compare against the official occupant's public behavior—not its DOM snapshot alone.

### Migration path

Replace exactly one slot behind a separate profile row. Preserve Option 1 theme/brand packages. Provide a one-row rollback that restores the official occupant. Never replace sidebar and details in the same first experiment.

### Stop conditions

Stop if child slot parity cannot be demonstrated, responsive geometry requires importing internal stores/columns, accessibility regresses, or more than one adjacent official package must be forked to make the shell usable. Return to Option 1 or narrow the requirement.

## Option 3 — Selective official UI package replacement

### Packages/plugins

Replace one official roster row with an AA equivalent, for example a future `@aa-office/dsh-deliverables` only if the existing turn-tail occupant cannot accept AA treatment through a supported seam. Each replacement is a separate package and decision record.

### Consumed public contracts

The full slot, snapshot, locale, service, settings, and lifecycle contract of the replaced package; the profile row id used to disable it; and every public child seat it declares. Private `src` imports remain forbidden.

### Compatibility risk

High. A “small” visual package may also own projection definitions, locale registration, settings, matching/selectors, file opening, reconnect behavior, and child declarations. The deliverables example must exactly preserve conservative successful mutation derivation.

### Upstream merge cost

High and recurring. AA must diff every upstream release for the replaced package and port behavior changes intentionally.

### Testing strategy

Create a replacement parity matrix from the official package README/exported contracts and run both implementations against identical session fixtures. Require lifecycle, error, empty, replay, accessibility, locale, and disposal parity before visual tests. Keep a test that boots without the AA row to prove rollback.

### Migration path

Begin only after a written gap report names the exact package and contract. Copy no upstream source; implement from public behavior/fixtures and portable assets. Swap one profile row, canary it, and retain the official package dependency for immediate rollback until acceptance.

### Stop conditions

Stop if parity requires internal APIs, copied official implementation, more than one replacement, or upstream behavior cannot be specified from exported contracts. Do not turn a selective replacement into a shadow Web bundle.

## Option 4 — Full layout replacement

### Packages/plugins

An AA root/layout package would occupy `root` and own AppFrame-equivalent rendering, child slot declarations, responsive columns, theme presentation hookup, standard providers, overlays, and layout action service behavior.

### Consumed public contracts

Slot renderer/root registration, layout service contract, session-maybe/session providers, theme change service, and every child shell contract. In practice the pinned implementation exposes critical geometry and lifecycle only internally, which is a warning against this option.

### Compatibility risk

Very high. A root replacement can strand all browser UI. It assumes responsibility for Sidebar/Conversation/Details declaration epochs, current-session lifecycle, focus, scroll containment, responsive concession, overlays, theme application, and future upstream seats.

### Upstream merge cost

Very high and effectively fork-like. Every new official root/layout behavior becomes explicit integration work.

### Testing strategy

Full official Web e2e and snapshot parity across blank/current/changing Session, sidebar collapse, details lifecycle, settings/onboarding, composer, approvals/questions, tools, deliverables, narrow widths, themes, HMR, failure boot, and plugin disposal. Add recovery testing for missing/failed occupants.

### Migration path

Only after Options 1–3 have quantified an irreducible root-layout requirement and a separately approved product/engineering plan funds ongoing ownership. Prototype in an isolated profile, never as an edit to official DSH packages.

### Stop conditions

Stop immediately if the case is aesthetic rather than functional, if internal AppFrame/stores/columns must be imported, if official e2e parity is incomplete, or if rollback cannot restore the official root with a profile-only change.

## Phase 5B bounded spike scope

Recommended next phase, subject to the Phase 5A decision gate:

1. create an independent, licensed adapter workspace after provenance approval;
2. pin DSH to the audited commit or an explicitly re-audited successor;
3. implement `dsh-theme` with verified aliases and scoped AA object variables;
4. implement `dsh-brand` with original AA mark/name and profile-level official brand replacement;
5. implement one `conversation.session.header.utilities` worker/status fixture driven by real Session state;
6. optionally add one pointer-safe `shell.overlay` status element;
7. boot a dedicated Web profile and run the Option 1 contract/e2e matrix;
8. produce a gap report and decide whether Option 1 is sufficient.

Out of scope for the first Phase 5B slice: sidebar/conversation/details replacement, production distribution, official package fork, runtime or model-loop changes, new deliverable entity, and broad deep-selector skinning.

## Upgrade protocol

For every DSH pin change:

1. verify commit, version, Node/pnpm ranges, and clean checkout;
2. diff the exact evidence files listed in the architecture map;
3. regenerate a contract inventory of mapped theme aliases and occupied slots;
4. run translator, lifecycle/disposal, profile boot, official regression subset, and screenshots;
5. record semantic changes—especially Workspace/Session, approval, and produced-file derivation;
6. stop rather than silently fall back when a contract disappears.

## Final recommendation

**PROCEED WITH DSH THEME + BRAND + SCOPED SKIN PLUGINS**
