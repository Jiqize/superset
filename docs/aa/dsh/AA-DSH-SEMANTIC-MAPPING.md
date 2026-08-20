# AA ↔ DeepSeek Harness Semantic Mapping

Pinned evidence: official DeepSeek Harness commit `141eb6fef83422698aef7a981029e843e8161534`. This mapping translates DSH facts into portable AA presentation inputs; it does not add a domain layer to DSH.

## Canonical mapping

| DSH concept | AA concept | Authoritative DSH evidence | Allowed presentation | Guardrail |
| --- | --- | --- | --- | --- |
| Workspace | Briefcase | `ctx.workspaces.list`, `WorkspaceView`, workspace id/title/path and APIs | Labelled briefcase containing its Session folders | A Workspace is not a Superset Project or AA runtime. Do not infer current selection from route text. |
| Session | Task Folder / Work Folder | `ctx.sessions.list`, current selection, `SessionFace`, lifecycle fields | Task Folder in lists; selected/open Session becomes Work Folder | Selected does not mean running; blank, archived, pending, completed, and errored remain distinct. |
| Agent preset | Employee role | Session `agentPreset`, preset roster and label | Employee role/persona chip | A preset is configuration, not proof of a live worker or availability. |
| Active Agent | Worker | scoped Agent/session context, agent creation/disposal/status, running turn | Pixel worker plus explicit runtime state | Do not show a live Worker from preset existence alone. Missing presence is unknown, not offline. |
| Model | Brain / badge / persona detail | model-selection/session configuration and host label | Secondary model badge and visible text | Never infer quality, speed, reasoning depth, or persona from a model id. |
| Reasoning | Hair + text | explicit model/reasoning configuration when DSH exposes it | One hair layer plus “Reasoning: …” | Duration/content does not establish reasoning level. If absent, show unknown and neutral hair. |
| Approval | Signature paper | `approval/requested` and `approval/resolved`, or durable `approval/asked`/`decided` | Structured paper with reason, tool context, allowed outcome controls and resolution text | Assistant prose never creates or resolves an approval. Keep approval id out of screenshots unless it is a fixture. |
| Tool call | Office tool / paper trail | paired `tool/call` + `tool/result`, call view and error state | Tool row, office prop, structured trail | Tool name alone does not establish result, side effect, or deliverable. |
| Deliverable | Outbox / stamped document | successful mutation result with call-view `locations`, as derived by `ui-deliverables` | Produced-file row/tray with path and source turn | Not a first-class DSH entity. Exclude reads, deletes, failed calls, and prose-only paths. |
| Composer | Desk inbox | conversation composer/input state and submission contract | Desk inbox frame around existing composer behavior | Do not replace queue/steer, attachments, plan, model, or keyboard semantics for decoration. |
| Details | File cabinet / inspector | DSH `details` column, selected tool/file/detail records | Drawer/inspector styling with explicit content type | Do not hide required details or style private DOM selectors as a contract. |

## Domain separation from Superset AA

```text
Superset-adapted AA: Project -> Briefcase; Workspace/task context -> Work Folder
DSH AA:              Workspace -> Briefcase; Session -> Task Folder / Work Folder
```

The shared visual nouns do not make the host records interchangeable. An adapter defines a small translation for its own host and emits the portable presentation record; it never converts DSH Workspace into a fake Superset Project.

## State translation

| AA state | Minimum DSH evidence | Text fallback | Must not use |
| --- | --- | --- | --- |
| `idle` | Explicit active Agent status idle and no open blocking interaction | “Runtime: Idle” | Absence of recent events |
| `thinking` | Open request/stream phase before a tool activity, when surfaced authoritatively | “Runtime: Thinking” | Response latency or hair alone |
| `working` | Open `turn/start` span, explicit Agent running, or open structured tool call | “Runtime: Working” plus activity label | Optimistic click state after host rejection |
| `waiting` | Pending approval/question/wait record | “Waiting: {reason}” | Generic network delay without a host state |
| `success` | Successful structured terminal result for the addressed operation | “Completed” / “Produced {file}” | Positive assistant prose |
| `error` | Error event/result or rejected host operation with message | “Error: {safe reason}” | A red treatment without error copy |
| `offline` | Explicit disconnected/unavailable host fact | “Runtime: Offline” | Missing Agent/presence data |
| `unknown` | Required evidence absent or contradictory | “Runtime: Unknown” | Silent fallback to idle |

Precedence for a single compact status readout is: blocking interaction → error → working → durable completion/archive → explicit idle/offline → unknown. Rich views may show multiple non-contradictory facts, such as “Working · approval required”.

## DSH source-to-view pipeline

```text
Workspace / Session feeds + ConversationSnapshot + projections + approval mux
  -> AA DSH translator (pure, pinned, tested)
  -> portable semantic record (id, label, state, stateText, source, observedAt)
  -> AA component contract
  -> typed DSH slot occupant or scoped theme/skin
```

The translator does not subscribe inside presentation components. It receives snapshot/owner data through documented session and slot contracts, then produces deterministic serializable props.

## Object-specific contracts

### Briefcase and folders

- Briefcase identity is the DSH Workspace id; visible label uses its title or a safe host fallback.
- Session folders preserve DSH lineage, archive, and fork semantics. A fork is a duplicated Task Folder with lineage text, not a merge.
- The open Work Folder is derived from current Session selection; running is a separate state marker.

### Employee, model, and reasoning

- Employee role is keyed by preset id and label. Persona selection is an explicit adapter mapping or stable host-neutral seed; it is not derived from a person's name or model quality.
- A scoped/active Agent supplies worker presence. On disposal, the worker is removed or becomes explicitly unavailable according to the host snapshot.
- Model and reasoning stay visible as text. Hair is a redundant visual layer and never drives state.

### Approval

Minimum presentation record:

```text
approvalId       opaque; retained for decision callback
sessionId        current session scope
toolName         visible structured tool context
reason           safe host-provided reason or explicit “No reason provided”
outcomes         only host-supported outcomes
state            pending | approved | denied | cancelled | unavailable | error
stateText        localized visible text
```

Only a pending structured request exposes decision controls. Once resolved, controls disable and the outcome remains visible. The adapter must handle reconnect/replay without announcing the same approval repeatedly.

### Tool trail and deliverables

Tool call state is paired by call id. The outbox consumes the same conservative produced-path rule verified in DSH `ui-deliverables`: successful mutation render intent plus `locations`, first-seen order, deduplicated per turn. A generic “Deliverable” domain id must not be invented.

If future DSH versions introduce a first-class output record, the adapter may add it only after a pinned contract test and migration note; until then, the AA portable `Deliverable` concept maps to a derived produced-file fact.

## Placement on verified DSH seams

| AA element | Preferred seat / service | Why |
| --- | --- | --- |
| AA palette | `ThemeRuntime.overrideTokens` | Public alias layer with light/dark modes |
| AA brand mark/name | `sidebar.brand.mark`, `sidebar.brand.name`, `conversation.hero.brand.mark` | Generic replaceable brand occupants |
| Compact worker/state | `conversation.session.header.utilities` | Additive, session-scoped, does not replace header |
| Frame status | `shell.overlay` | Additive root-scoped overlay; must remain pointer-safe |
| Motion/accessibility preference | Existing theme preference or optional `settings.general.item` | Additive settings row |
| Produced-file treatment | Existing `conversation.chat.turnTail` contribution or scoped wrapper negotiated with current deliverables entry | Must preserve conservative DSH derivation |
| Tool-specific office treatment | Keyed tool-view seam where available | Avoid replacing `conversation.details.tool` wholesale |
| File cabinet | Existing `details` column styling/additive detail content | Preserve panel lifecycle and tool-detail seat |

## Known gaps

- DSH theme aliases do not cover AA waiting/offline or office-object colors; scoped AA variables are required.
- There is no verified universal reasoning-level field. “Unknown” is the default until a preset/model contract supplies one.
- Agent core events are lower-level than most UI plugins should consume; the existing client runtime snapshot is preferred.
- Official brand and layout occupants must be changed by profile composition/slots, not deep CSS selectors.
- Deliverables are derived and turn-local; archive/output persistence beyond the produced path belongs to the host.
