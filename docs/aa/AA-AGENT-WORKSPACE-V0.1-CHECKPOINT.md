# AA Agent Workspace v0.1 Checkpoint

## Status

Phase 3E establishes the first accepted AA Agent Workspace workflow:

> Project → Workspace → Task Folder → Employee → Output

This checkpoint builds on `AA-RUNTIME-CONTRACT-V0.1.md`,
`AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`, and
`AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`. It does not authorize Phase 3F.

## Stable work-model definitions

- **Project / Briefcase** — existing Superset project data.
- **Workspace / Work Folder** — existing workspace/main checkout/worktree.
- **Task Folder** — lightweight work context presented over existing pane,
  runtime, session, and Git state.
- **Employee** — existing agent preset/CLI identity; Tier 1 authority only when
  backed by the AA Runtime Contract.
- **Output** — existing changed files, Diff, Files, and Review/Git state.

No definition creates a new database entity or runtime abstraction.

## Task Folder contract

Task Folder 2.0 may display only real Renderer-visible values:

- title;
- employee;
- runtime and transport;
- model and reasoning from an authoritative snapshot;
- lifecycle status;
- changed-file count from existing Git state;
- exact-resume availability;
- a latest action from the fixed lifecycle vocabulary.

It MUST NOT scrape xterm/TUI text, parse terminal history, store transcripts,
summarize hidden prompts, invent progress, or infer workload.

Title precedence remains:

1. explicit user-edited pane title;
2. existing session/preset label;
3. existing terminal label;
4. `Current Work Session`.

An explicit title is Renderer pane presentation metadata marked by
`taskTitleEdited`. It is normalized, limited to 48 Unicode characters, and
does not become employee identity.

## Manual handoff contract

`SEND TASK FOLDER` is manual presentation over the existing preset launch
path.

- The user always chooses the receiving employee.
- The receiving pane preserves employee launch identity separately from the
  Task Folder title.
- Only a user-edited title is carried to another pane.
- Opening a Diff/File pane MUST NOT make the title unavailable to handoff.
- Exact Pi resume MUST preserve the explicit Task Folder title while replacing
  the dead terminal ID.
- No prompt, transcript, terminal history, model/reasoning setting, or hidden
  context is transferred.
- No automatic chaining, planner/reviewer graph, background routing, or
  agent-to-agent messaging exists.

Compatibility runtimes remain compatibility runtimes. A dispatch
acknowledgement proves the existing launch path accepted the action; it does
not create Tier 1 evidence.

## Employee Profile contract

The first-class profile presents:

- employee identity;
- authority (`RUNTIME VERIFIED`, `SAVED SESSION`, `UNTRACKED`, or
  `NO LIVE RUNTIME`);
- runtime and transport;
- current status;
- effective model/reasoning when authoritative;
- exact-resume availability;
- capability support as `AVAILABLE`, `CONDITIONAL`, `UNAVAILABLE`, or
  `UNKNOWN`.

Pi uses authoritative terminal-runtime evidence. A saved Pi candidate may show
only offline/resume facts until the exact runtime returns.

Grok uses only the current Host snapshot. A verified
`authentication_required` snapshot may show the sanitized negotiated support
matrix alongside an explicit authentication notice. With no Grok snapshot,
show `NO LIVE RUNTIME` and no capabilities. Never turn a binary, preset, or
historic probe into a live-session claim.

Tier 2 employees remain `UNTRACKED` unless a future normative contract changes
their tier.

## Output and delivery contract

File Cabinet presentation is derived from existing state:

- **OUTPUT** — distinct staged/unstaged changed-file count;
- **DELIVERY** — the existing PR/Git flow badge;
- **FILES / CHANGES / REVIEW** — existing Superset surfaces and behavior.

Unavailable values are omitted. A real zero is retained. Pending-change amber
requires a real count greater than zero. No new polling, output store, artifact
database, completion percentage, or fake document count is allowed.

## Runtime and architecture boundary

Stable boundaries remain:

- Renderer presentation queries the AA Runtime Contract; it does not recreate
  runtime truth.
- Existing Pi TUI/xterm, terminal focus, pane layout, preset launch, Host
  Service, PTY, Git/worktree, filesystem, local persistence, and database
  schema remain authoritative and unchanged.
- Phase 3E adds no native chat, runtime write controls, permissions UI,
  cancellation UI, adapter, or orchestration primitive.
- Runtime UUIDs, epochs, prompt/transcript bodies, tool arguments/results, and
  credentials MUST NOT enter normal AA UI or committed evidence.

## Accepted workflow

The accepted isolated workflow is:

1. user explicitly names a Task Folder;
2. real Pi performs work;
3. existing Files/Changes/Diff/Review expose the output;
4. user manually sends the Task Folder to Codex;
5. Codex reviews and creates a second real output while remaining a
   compatibility runtime;
6. user returns to Pi;
7. full restart exposes the saved Pi candidate;
8. exact Pi resume restores the same native conversation in a new epoch;
9. the explicit Task Folder title and conversation context remain intact.

Accepted evidence is under `docs/aa/runtime-foundation/phase-3e/`. The exact
resume comparison records only SHA-256 fingerprints: native identity matched,
epoch changed, and no raw runtime ID was retained.

## Known limits

- Task Folder is pane-local presentation, not a durable PM object.
- Handoff shares workspace/files and title only; it is not context transfer or
  orchestration.
- Grok authenticated behavior remains unverified in real QA.
- Compatibility runtime lifecycle/model/reasoning/capabilities remain outside
  Tier 1 authority.
- Delivery is limited to existing Git/PR truth.

Any future phase that needs runtime writes, structured messages, permissions,
cancellation, cross-workspace coordination, or persistence must be separately
scoped against `CODEBASE-MAP.md` and `AA-RUNTIME-CONTRACT-V0.1.md`.
