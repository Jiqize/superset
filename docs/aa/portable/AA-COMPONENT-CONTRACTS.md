# AA Portable Component Contracts v0.1

These contracts name presentation responsibilities. They are not a new component framework and do not prescribe React props, DOM structure, CSS class names, or host data fetching.

## Shared value types

```text
AAState = idle | thinking | working | waiting | success | error | offline | unknown
AAControlState = default | hover | pressed | selected | focused | disabled | pending | error
AASize = compact | default | large
AAIconName = an id from asset-manifest.json
AAAccessibleText = localized, non-empty visible or programmatic text
```

Every host adapter passes translated values; no component queries Superset or DSH services directly.

## Contracts

| Contract | Required presentation inputs | Behavior and output |
| --- | --- | --- |
| `AAAppFrame` | accessible product label; navigation region; primary content; optional details and status regions | Establishes canvas/shell hierarchy and landmark order. Does not own routing or persistence. At narrow widths, host policy may collapse details before primary content. |
| `AANavigationRail` | labelled destinations; stable selected key; activation callbacks | Renders one selected destination, visible focus, icon plus accessible label. Selection comes from host navigation state; disabled destinations do not activate. |
| `AAPanel` | heading or accessible label; content; depth (`raised`/`inset`); optional status | Groups related information with hard-edge hierarchy. A pending/error state preserves the heading and shows text, not only an overlay. |
| `AAButton` | visible label; activation; variant; control state | Native button where possible. Minimum standalone hit target 44 px. Pending preserves label, exposes busy state, and prevents duplicate activation. Pressed depth moves at most one pixel. |
| `AAIconButton` | icon id; accessible name; activation; control state | Glyph at 16–24 px inside at least a 44 px standalone hit area. Tooltip is supplementary; accessible name is mandatory. |
| `AATabs` | tab ids/labels; selected id; associated panels; change callback | Arrow-key or native-button tab behavior, visible selection, `aria-selected`, labelled panel. Disabled tabs remain focus-policy compliant and do not activate. |
| `AAStatusLight` | state; visible `stateText`; optional reason | Uses manifest status icon, color, shape, and text. It never starts motion itself or infers status. Unknown is distinct from offline. |
| `AABriefcase` | id; label; item count or explicit unknown; open/selected/unavailable state; activation | Represents a host work collection. Handle and clasp are decorative; label and state remain text. |
| `AATaskFolder` | id; title; lifecycle text; optional updated time; selected state; activation | Shows durable task/session continuity. Selected does not mean working. Error and archived states stay readable and actionable only when host permits. |
| `AAEmployeeAvatar` | persona id; accessible employee label; size; optional state | Composes anatomy plus persona layers. Persona is deterministic from an explicit id, not inferred from a name or protected trait. State overlay requires state text nearby. |
| `AAEmployeeCard` | employee role; avatar inputs; runtime state/text; assignment text; primary action | Keeps role, runtime, and assignment separate. Disabled/pending actions expose why. Does not imply a worker exists solely because a preset exists. |
| `AAReasoningHair` | explicit reasoning level; visible level text; avatar size | Adds one hair layer while retaining text. Unknown uses base hair and “Reasoning: unknown”; no animation. |
| `AAWorkstationFrame` | accessible heading; bound task/worker label; content region; state/text | Frames conversation, terminal-like output, or tool detail without assuming xterm or shell access. Working motion follows the motion spec and stops with authoritative state. |
| `AAFileCabinet` | labelled drawer groups; counts or unknown; selected drawer; details content | Provides an inspector/file/history metaphor. Keyboard order follows drawers then details. Empty, loading, and error states are explicit. |
| `AAApprovalPaper` | approval id; reason; tool/context label; allowed outcomes; decision handler; pending/resolved state | Renders a structured blocking decision. Outcome controls have distinct labels and cannot be fabricated. Announces a newly pending approval once; resolved papers retain outcome text. |
| `AADeliverableTray` | verified deliverables with label, location/status, source; optional open action | Shows only durable output records or verified successful produced-file facts. Missing outputs remain listed with error text; prose mentions never enter the tray. |
| `AABottomStatusBar` | product/connection state text; optional counts; optional labelled actions | Persistent compact summary. Does not become the only location for errors or approval state. Icon-only actions follow `AAIconButton`. |

## Control state matrix

| State | Visual requirement | Semantic requirement |
| --- | --- | --- |
| selected | navy field or strong inset marker plus persistent silhouette | `aria-current` or `aria-selected` where applicable |
| focused | 2 px external navy ring, never focus removal | native focus or managed roving focus |
| disabled | muted surface/text, unchanged readable label | `disabled` or `aria-disabled`; activation suppressed |
| pending | static/stepped working marker plus original label | `aria-busy="true"`; duplicate action suppressed |
| error | red edge/marker plus error copy | error relation or live announcement appropriate to severity |
| pressed | inverted hard-edge depth, optional 1 px translation | native pressed state or `aria-pressed` for toggles |

## Accessibility and motion baseline

- Meaningful controls have non-empty accessible names; meaningful images have localized alternatives or nearby labels.
- State is never conveyed by color, pixel hair, or animation alone.
- All keyboard-operable elements show focus. DOM order remains usable without CSS.
- Primary actions and standalone icon actions expose at least 44 by 44 px hit targets. Dense passive icons may render at the manifest sizes.
- Text can zoom to 200% without hiding required actions or state. Hosts may reflow details below primary content.
- `prefers-reduced-motion: reduce` and the explicit AA motion override disable nonessential transition and replace working animation with a static frame.
- A component receiving contradictory inputs fails safe: visible `unknown` or `error` text is preferable to an inferred success/working state.

## Adapter implementation rule

Host adapters may wrap these contracts with framework-specific components, but their public inputs should remain serializable presentation facts plus callbacks. Imports from host routing, process bridges, terminal registries, or data clients stay outside the portable implementation.
