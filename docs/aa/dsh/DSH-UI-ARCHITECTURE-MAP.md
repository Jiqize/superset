# DeepSeek Harness UI Architecture Map — Phase 5A

## Verification boundary

| Fact | Verified value |
| --- | --- |
| Repository | Official `deepseek-ai/deepseek-harness` checkout |
| Commit | `141eb6fef83422698aef7a981029e843e8161534` |
| Checkout state | Detached HEAD, clean, read-only reference |
| Root version / license | `0.1.0-rc.8` / MIT |
| Required toolchain | Node `^22.19.0 || >=24.0.0`, pnpm `11.7.0` |
| Local compatibility | Node `24.14.0`, pnpm `11.7.0` satisfy declared ranges |
| Build boundary | Not run: the clean reference checkout has no `node_modules`, and Phase 5A forbids modifying it |

This map is source inspection at the pinned commit. DSH is an RC/developer-preview surface; even documented exports require pinning and adapter contract tests.

## Seam labels

- **Public/documented seam**: exported contract or README-described plugin/profile surface designed for cross-package use.
- **Internal implementation**: useful for understanding behavior but not an adapter dependency.
- **Unstable developer-preview dependency**: public enough to consume at this pin, but release-candidate compatibility is not promised. All DSH seams below also carry this release-level risk.

## End-to-end Web boot

```text
dsh --profile web
  -> profile template: @deepseek-ai/dsh-base + @deepseek-ai/dsh-web-app
  -> ordered Cordis patch composition
  -> web-app node rows + dsh.client roster
  -> window.__DSH_BOOT__ + window.__ModuleLoader__
  -> apps/web #root
  -> @deepseek-ai/dsh-client-web AppWebEntry
  -> client module system + Cordis Loader
  -> activate every roster plugin
  -> uiRenderer.mount(#root)
  -> root slot -> AppFrame -> Sidebar | Conversation | Details + shell.overlay
```

### 1. Entry and kernel

| Layer | Exact evidence | Finding | Classification |
| --- | --- | --- | --- |
| Web app entry | `apps/web/src/main.ts` | Finds `#root` and invokes `new AppWebEntry(el).run()`; no product UI lives here. | Internal implementation |
| Browser kernel | `packages/client/web/src/boot.ts` | Creates the module system from `window.__ModuleLoader__` and `window.__DSH_BOOT__`, prefetches immediate entries, installs Cordis Loader, creates all manifest plugins, waits for activation, then injects `uiRenderer` and mounts. | Internal implementation |
| Node module half | `packages/client/modules/src/index.ts`, `packages/client/modules/README.md` | Scans Loader entries whose package declares `dsh.client`, constructs the boot graph, and serves `/plugins/<id>/client.js`. | Public/documented plugin packaging seam; implementation internal |
| Browser module half | `packages/client/modules/src/client/index.ts` | Provides the module table used by the kernel before Cordis exists. | Internal implementation |
| Renderer handoff | `packages/client/ui-renderer/src/client/index.ts`, README | Installs slot renderer/session providers and exposes `uiRenderer.mount`. AA does not replace this in the first adapter option. | Public/documented service; unstable preview |

An AA adapter should declare a normal Web client plugin and join the roster through profile composition. It should not modify `apps/web`, the boot kernel, the module loader, or the renderer.

## Cordis profile, bundle, and overlay path

`packages/boot/app-boot/src/profile.ts` defines the shipped Web template exactly as:

```text
web = [@deepseek-ai/dsh-base, @deepseek-ai/dsh-web-app]
```

The effective row tree is composed in this order, verified in `apps/cli/src/profile-boot.ts`:

1. bundle patches in `dsh.profile.bundles` order;
2. profile-local `cordis.patch.yml`;
3. home-level `cordis.patch.yml`;
4. launcher `--patch` overlays in argument order;
5. launcher-owned overlays such as the telemetry switch.

Profile/bundle manifests and later patch layers are a **public/documented seam**. Row ids are configuration contracts at this pin but remain an **unstable developer-preview dependency**. AA should ship its own profile/bundle patch rather than editing the official Web bundle.

## Verified browser plugin roster

Source: `packages/bundle/web-app/cordis.patch.yml`. `client-hmr` is mounted immediately before the comment-delimited roster block but its package also declares a Web `dsh.client` face, so it is included in the complete browser roster below:

```text
client-hmr                    modules                       connection
api-remotes                   client-runtime                cordis-client-runner
ui-theme                      locale                        ui-layout
ui-renderer                   ui-sidebar                    ui-settings
ui-settings-general           ui-settings-models            ui-settings-plugin-inventory
ui-conversation               ui-brand-official             ui-attachment
ui-tool                       ui-cordis                     ui-workflow-run
ui-deliverables               ui-workspace                  ui-input-trigger
ui-commands                   ui-skill                      ui-subagent
ui-reference                  ui-jobs                       ui-goal
ui-message-feedback           ui-model-selection            ui-permission
ui-agent-preset               ui-settings-plugins           ui-plan
ui-user-questions             ui-trajectory
```

The later `agent-presets` row is host/agent-plane composition, not an additional browser UI entry. AA Option 1 adds its own theme, brand, and skin client rows and disables or supersedes only the official brand occupant in a later profile layer.

## Theme architecture

Package: `@deepseek-ai/dsh-client-ui-theme`.

| Contract | Verified behavior | Classification | AA use |
| --- | --- | --- | --- |
| `ThemeRuntime.register(definition)` | Registers a selectable theme with id, `light`/`dark` base scheme, and token dictionary; returns disposer. | Public/documented; unstable preview | Register `aa-office` theme if a selectable entry is desired. |
| `ThemeRuntime.overrideTokens(source, tokens)` | Stacks a partial override layer; each value must provide both `light` and `dark`; returns disposer. | Public/documented; unstable preview | Preferred way to map AA semantics onto verified DSH aliases. |
| `exportInspectTokens()` | Exposes accepted/described token entries and dynamic registered overrides. | Public export; unstable preview | Contract-test expected aliases before mounting AA overrides. |
| Theme settings | Built-ins are `system`, `light`, `dark`; the plugin occupies `settings.general.item` with Appearance UI. | Public/documented | AA should not recreate preference persistence. |
| Theme presentation | `packages/client/ui-layout/src/client/theme-presenter.ts` writes resolved aliases, body dark marker, and `color-scheme`. | Internal implementation | Do not import or target its DOM. |

The verified alias mapping lives in `docs/aa/portable/tokens/dsh.mapping.json`. Important constraints:

- `--dsw-alias-bg-base`, layers 1/2, borders, labels, state error/success/warn, brand primary, and `--dsw-specific-sidebar-fill` exist at the pin.
- Every override supplies light and dark values, even when AA intentionally uses the same value.
- Waiting, offline, paper, workstation, briefcase, and folder do not have verified equivalent semantic aliases. They remain AA plugin-scoped skin variables; no `--dsw-*` name is invented.
- Internal CSS module selectors and DOM structure are not theme contracts.

## Slot system and layout ownership

`@deepseek-ai/dsh-client-ui-slots` is a React-free typed registry. `SlotCore` seeds `root`; one `register()` call contributes an occupant and may declare child slots, store seats, and an injected business face. Declaration grants render authority, and disposal recursively collapses child declarations. `ctx.slots.inject()` waits for a declaration rather than requiring load order.

This registry and its exported types are a **public/documented seam** and an **unstable developer-preview dependency**. Ledger internals, renderer records, and component markup are internal.

### Layout slots

Source: `packages/client/ui-layout/src/client/index.ts`.

| Slot | Kind / scope | Ownership implication | AA decision |
| --- | --- | --- | --- |
| `root` | built-in single / root | Occupied by AppFrame; replacement owns the entire application render tree. | Do not replace in Option 1–3. |
| `sidebar` | single / root | Occupied by `ui-sidebar`; replacing it also removes sidebar child declarations. | Use inner seats first. |
| `conversation` | single / session-maybe | Occupied by `ui-conversation`; owns hero and live session without identity change. | Use additive inner seats first. |
| `details` | single / session | Occupied by conversation DetailsPanel; replacement must preserve tool-details behavior. | Skin or contribute; replace only with explicit coverage. |
| `shell.overlay` | list / root | Additive, frame-wide, outside column scrollports. | Safe candidate for a labelled AA status strip or demo-independent chrome. |

Public exports include `LayoutController`, `ILayout`, and owner-prop contracts. `AppFrame.tsx`, `stores.ts`, `columns.ts`, CSS modules, and the responsive concession solver are **internal implementation**. At the pin, the collapsed sidebar is 56 px, details is solved around 300–520 px, and the center has a 640 px minimum; these measurements are observations, not AA dependencies.

### Sidebar and brand slots

Source: `packages/client/ui-sidebar/src/client/contract/slots.ts`.

| Slot | Kind | First AA use |
| --- | --- | --- |
| `sidebar.brand.mark` | single | Original AA mark; no official DeepSeek logo |
| `sidebar.brand.name` | single | “AA Office for DSH” |
| `sidebar.workspaces` | single | Leave official workspace/session browser in place |
| `sidebar.settings` | single | Leave official settings shell in place |
| `sidebar.footer.action` | list | Optional additive AA inspector/motion action only if needed |

`@deepseek-ai/dsh-client-ui-brand-official` occupies `sidebar.brand.mark`, `sidebar.brand.name`, and `conversation.hero.brand.mark` only when `DSH_CLIENT_BUILD_PROFILE === 'official'`. These generic slots are the correct replacement seam. Its `Brand.tsx`, logos, and wordmark are not inputs to AA.

### Conversation and details slots

Source: `packages/client/ui-conversation/src/client/contract/slots.ts`.

The principal contracts are:

| Slot family | Kind | Replacement blast radius / AA use |
| --- | --- | --- |
| `conversation.session` | single | Entire session body; do not replace initially. |
| `conversation.session.header` | single | Whole header and its declared action seat; avoid. |
| `.header.actions`, `.header.utilities` | list | Additive per-session controls or truthful worker/status readout; preferred. |
| `conversation.view` | list | Adds an entire view tab; only if an office-specific view has standalone value. |
| `conversation.chat.node` | keyed | Business-node dispatch; use only for a verified new node kind. |
| `.message.images` | single | Leave attachment presentation intact. |
| `.chat.commandview` | keyed | Per-command row specialization. |
| `.chat.turnTail` | chain | Additive/selected turn-tail presentation; current deliverables use this. |
| `.chat.assistant-actions` | list | Additive message actions. |
| `conversation.details.tool` | single | Whole details tool body; use keyed tool views instead of replacing when possible. |
| `conversation.composer` | chain | Composer takeover; AA does not need this for skinning. |
| `conversation.hero.workspace` | single | Workspace picker; keep official behavior. |
| `conversation.hero.brand.mark` | single | Original AA mark. |
| `conversation.hero.agentPreset` | single | Keep official preset chooser; skin externally through supported AA scope. |
| input/composer slots | list/single/chain | `input.dock`, `composer.dock`, `input.left/right`, `composer.bar`, attachments, plan, model; preserve normal workflow. |

The slot keys and exported owner props are public/documented. Conversation assembly, node folding, CSS modules, DOM selectors, and store implementation are internal.

## Workspace, Session, Agent, and projections

### Workspace

`@deepseek-ai/dsh-client-runtime` exposes `ctx.workspaces` through `IWorkspaces` in `packages/client/runtime/src/client/contract/workspaces.ts`. The public face includes observable list state and commands for connect/start/create/pick/browse/rename/delete/reorder/archive-session. `@deepseek-ai/dsh-client-ui-workspace` owns the Workspace/Session browser, grouping, dialogs, and live pending interaction labels.

For AA: **DSH Workspace → Briefcase**. It is the host's directory/codebase context; it is not forced through Superset's Project/Workspace mapping.

### Session

`ctx.sessions` exposes list/current selection, open/fork/search, scoped contexts, and provider registration through `ISessions`. Each `SessionFace` provides an observable `ConversationSnapshot`, behavior verbs (prompt, cancel, rename, command, queue updates, attachments), and `projections.faceOf(key)`.

For AA: **DSH Session → Task Folder / selected Work Folder**. Selected, running, pending interaction, and completed are separate facts. `agentPreset` is an Employee role; an active scoped Agent is the worker.

### Projection seam

`packages/session/session-projection` registers pure key-addressed projection units; `session-projection-cache` optionally persists/cache-warms values. The Host sends `session/projection` frames with key, value, and seq; the client exposes them through the session projection face/hooks.

Projection registration and outward projection values are documented package contracts, but key schemas are feature-owned and an **unstable developer-preview dependency**. AA should consume only named projections required by a component and contract-test their absence/shape.

## Event and truth sources

| AA fact | Verified DSH source | Notes |
| --- | --- | --- |
| Turn activity | `turn/start`, `turn/end` in `packages/core/session/src/types.ts` | End reasons include completion and non-success terminal states; do not infer from time. |
| Step activity | `step/start`, `step/end` | Useful for detailed work text, not a durable task lifecycle by itself. |
| Conversation | `user/message`, `assistant/chunk`, `assistant/message` | Durable/streaming distinction is preserved by the client assembler. |
| Tool activity | `tool/call`, `tool/result` | Pair by call id; structured render views and result error flag beat prose. |
| Todo/context | `todo/write`, `request/header`, `request/context`, `session/end-seed` | Feature-specific evidence; not generic worker status. |
| Active Agent | `agent/created`, `agent/disposed`, `agent/status` plus scoped agent context | `agent/status` exposes idle/running; preset alone is not an active worker. |
| Queue/lifecycle | agent inbox inserted/claimed/discarded, session-start, pre-step, request/error, turn-stopping, agent/error | Core runtime hooks; UI should usually consume client snapshots rather than subscribe directly. |
| Durable event feed | global `session/event` after append | The durable log is the source for folded conversation truth. |
| Approval | durable `approval/asked` and `approval/decided`; browser mux `approval/requested` and `approval/resolved` | Browser payload includes approval id, tool name, optional call/reason, and allowed terminal outcomes. |
| Deliverable | `ui-deliverables` derivation from successful mutation `tool/result` and call-view `locations` | A produced-file fact, not a first-class deliverable entity. Reads, deletes, failed calls, and prose mentions contribute nothing. |

UI adapters should normally read `ConversationSnapshot`, workspace/session feeds, projection faces, and existing UI owner props. Core event types document provenance; importing low-level Agent internals directly into a skin plugin would widen coupling unnecessarily.

## Settings extension points

Source: `packages/client/ui-settings/src/client/contract/slots.ts`.

Public slot contracts include `settings.trigger`, `settings.header`, `settings.action`, `settings.close`, `settings.section`, `settings.plugins.tab`, `settings.onboarding`, and additive `settings.general.item`.

Option 1 should use `settings.general.item` only if AA needs an explicit theme/motion row beyond the existing Appearance preference; otherwise the theme plugin's own setting is sufficient. Replacing `sidebar.settings` would assume responsibility for the whole accessible settings shell and is not justified.

## HMR and development workflow

`packages/client/hmr/README.md` and `scripts/dev-web.ts` establish this workflow:

1. install with the pinned pnpm toolchain;
2. run one full `pnpm run build` to create types, package bundles, and `apps/web/dist`;
3. run `pnpm run dev:web` to watch client type emit, `dsh.client` and linked library bundles, and the Web dist;
4. run the Web profile (`pnpm dsh --profile web`, with the profile/patch containing AA packages);
5. the host polls bundle revisions and publishes `/plugins/events`; the browser HMR plugin reloads the changed Cordis fiber and dependents.

HMR is coarse: component-local React state in a reloaded plugin is lost, data-layer fibers remain, and there is no rollback after a failed reload. A production adapter must work on cold boot; HMR success is not sufficient evidence.

## Build and test requirements for a future adapter checkout

Root scripts at the pin include:

```text
pnpm run build             full build
pnpm run build:lib         host + client library build
pnpm run typecheck         build host libraries then client typecheck
pnpm run lint              build host libraries then oxlint
pnpm test                  Vitest suite
pnpm run test:gui          client + host UI-oriented tests
pnpm run test:web          build then Web tests
pnpm run check:all         repository gate suite
```

An out-of-tree AA adapter should also run its own manifest/token/SVG tests and a Web fixture that boots the actual profile overlay. At this Phase 5A pin, no DSH command was run because dependencies were absent and the checkout had to remain clean/read-only.

## Exact adapter consumption set

### Initial public/documented dependencies

| Adapter package | DSH package/contracts consumed |
| --- | --- |
| `@aa-office/dsh-theme` | `@deepseek-ai/dsh-client-runtime/client` for plugin context; `@deepseek-ai/dsh-client-ui-theme/client` for `ThemeRuntime.register` / `overrideTokens`; optional `@deepseek-ai/dsh-client-ui-settings/client` type merge |
| `@aa-office/dsh-brand` | runtime client context; `@deepseek-ai/dsh-client-ui-slots`; type-only sidebar and conversation client contracts; brand slot keys |
| `@aa-office/dsh-skin` | runtime context; typed slot registry; layout/sidebar/conversation/settings contracts only for seats actually occupied; session/workspace selector faces only when showing truthful facts |
| profile/bundle | DSH profile `dsh.profile.bundles`, bundle patch manifest, row ids in a later `cordis.patch.yml` layer |

### Evidence files to pin in contract tests

```text
packages/client/ui-theme/src/client/index.ts
packages/client/ui-layout/src/client/index.ts
packages/client/ui-sidebar/src/client/contract/slots.ts
packages/client/ui-conversation/src/client/contract/slots.ts
packages/client/ui-settings/src/client/contract/slots.ts
packages/client/runtime/src/client/contract/workspaces.ts
packages/client/runtime/src/client/contract/sessions.ts
packages/client/runtime/src/client/contract/session.ts
packages/client/ui-brand-official/src/client/index.ts
packages/bundle/web-app/cordis.patch.yml
packages/boot/app-boot/src/profile.ts
```

AA must not import `AppFrame.tsx`, layout stores/columns, conversation assemblers, CSS modules, private `src` paths not exported by package manifests, or official brand components/assets.

## Research reconciliation and known incompatibilities

The earlier `DEEPSEEK-HARNESS-UI-PORT-RESEARCH.md` correctly identified Cordis composition, theme/brand/slot seams, Workspace/Session semantics, and the preference for additive skinning. Phase 5A source audit adds two precision notes:

1. The real additive frame slot is `shell.overlay`. An upstream layout README reference to `conversation.empty` is not the pinned source contract and must not be consumed.
2. The earlier phrase “durable deliverable data” is too strong. The pinned `ui-deliverables` package derives turn-local produced paths from successful mutation call views and `locations`; there is no standalone durable Deliverable entity. AA maps this verified derived fact to an outbox/stamped document and must preserve the caveat.

Other incompatibilities to carry into Phase 5B:

- DSH APIs are RC/developer-preview and may change even when exported.
- Theme aliases cover generic roles but not AA object colors or waiting/offline semantics.
- Official layout CSS/DOM is internal; a scoped skin cannot rely on deep selectors and may need additive wrappers to reach full AA identity.
- Whole-slot replacement collapses child declarations and their occupants; replacing sidebar/conversation/details has a much larger blast radius than visual markup suggests.
- DSH Workspace/Session and Superset Project/Workspace represent different domain axes.
