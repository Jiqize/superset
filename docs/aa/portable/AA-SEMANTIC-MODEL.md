# AA Portable Semantic Model v0.1

This model defines presentation inputs, not a database schema. Every visual fact must be translated from a host's authoritative record or documented live event. “Unknown” is a valid state and must not be patched over with an inference.

## Cross-cutting truth contract

- Durable host records win over UI-local state after reconciliation.
- Live events may add a transient overlay only while their lifecycle is open.
- A model or reasoning setting is configuration, not proof of capability or current thought.
- Tool prose is not a deliverable. A successful, structured output record or verified produced-file fact is required.
- A missing presence signal is `unknown`, not `offline`.
- Superset and DSH mappings are independent; DSH Workspace is not forced through Superset Project/Workspace semantics.

## Concept matrix

| Concept | Visual metaphor | Required authoritative data | Allowed states | Forbidden inference | Required text fallback | Superset mapping | DSH mapping |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Briefcase | Handled work container | Stable collection id, label, membership or scope | closed, open, selected, unavailable | Do not infer scope from the current route alone | “Briefcase: {label}” plus availability | Project/workspace collection only where host records say so | `Workspace` directly |
| Task Folder | Labelled active folder | Stable task/session id, title, lifecycle, updated time | new, active, waiting, completed, error, archived | Do not derive completion from quiet time | “Task folder: {title}, {state}” | AA task/workspace thread | `Session` used as a task folder |
| Work Folder | Open continuation folder | Session id plus active continuation/selection and history | open, selected, paused, closed | Do not equate selected with running | “Work folder: {title}, {state}” | Selected AA workspace/task context | Active or selected DSH `Session` |
| Employee | Named office persona | Stable role/preset id and display label | available, assigned, unavailable, unknown | Persona art must not infer demographic, skill, or online state | “Employee role: {label}” | Configured AA employee/Pi role | Agent preset |
| Runtime | Status light and activity overlay | Runtime/agent id, lifecycle state, timestamp or open event span | unknown, idle, working, waiting, error, offline | No elapsed-time, animation, or last-message inference | “Runtime: {state}” with reason when present | AA Runtime snapshot/host facts | Active Agent plus agent/runtime events |
| Model | Brain/badge detail | Configured model identifier and host-provided label | configured, unavailable, unknown | No quality, speed, or reasoning claim from model name | “Model: {label or unknown}” | AA Runtime/model config | DSH Session/agent model selection |
| Reasoning / Hair | Layered hair silhouette | Explicit reasoning setting or host label | low, medium, high, very-high, maximum, unknown | Hair length cannot be inferred from response duration or content | “Reasoning: {level}” | AA reasoning setting | DSH model/reasoning configuration when exposed |
| Workstation | Dark framed work surface | Bound runtime/session plus authoritative activity/content source | idle, active, waiting, blocked, error, unavailable | Terminal visuals do not imply shell access | “Workstation: {state}” | AA terminal/runtime view | Conversation/session work surface; optional tool detail |
| File Cabinet | Drawer/inspector | Structured files, history, metadata, or details records | empty, available, loading, error | Do not fabricate files from message mentions | “File cabinet: {count/status}” | AA files/changes/archive details | DSH `details` slot, workspace/files/tool details |
| Approval | Signature paper | Approval id, tool/call context, reason, allowed outcomes, unresolved/resolved status | pending, approved, denied, cancelled, error | Never infer approval from a successful-looking message | “Approval required/resolved: {reason/outcome}” | AA Host structured approval | DSH approval requested/resolved stream |
| Deliverable | Stamped document in outbox | Stable output id or verified produced-file location, source turn/tool, success state | produced, available, missing, error | Assistant prose or a planned path is not a deliverable | “Deliverable: {label}, {location/status}” | AA artifact/output record | DSH derived successful mutation result plus `locations`; not first-class |
| Archive | Closed labelled cabinet | Stable object id, archived flag/time, allowed restore action | active, archived, restoring, error | Hidden or inactive is not archived | “Archived {object}: {label}” | AA archive intent and durable result | DSH Workspace/Session archive API where exposed |

## Structured state precedence

When multiple host signals exist, adapters apply this order:

1. blocking structured interaction (`approval`, user question);
2. explicit error;
3. authoritative running/turn span;
4. durable completion or archive state;
5. explicit idle/offline state;
6. unknown.

A presentation may show more than one fact—such as “working · approval required”—but it must not collapse blocking interaction into generic activity.

## Minimum adapter record

```text
id             stable host identifier
label          host-provided or explicit safe fallback
state          translated allowed state
stateText      localized redundant state label
source         host record/event family used
observedAt     timestamp when freshness matters
isDemo         true only for gallery/example data
```

Host-only identifiers stay out of screenshots and portable fixtures. The gallery uses invented labels and marks every composition as demo data.
