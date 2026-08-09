# Phase 3C — Pi Runtime Productization v0.1

## Status and priority

Phase 3B is complete at commit `38766087d74b47311e5bcfbdeb8aff06850d8a16` and `AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md` is the stable starting point.

Phase 3C remains Tier-1 focused:

1. Pi is the primary runtime to productize now.
2. Grok Build remains Tier 1, but authenticated Grok turn work is blocked until the user-owned machine is logged in. Preserve the Phase 3B ACP foundation and do not fake progress around authentication.
3. Codex, Claude Code, OpenCode, Kimi, and other CLIs remain Tier 2 compatibility runtimes. Do not spend Phase 3C on vendor-specific lifecycle work for them.

## Read first

1. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
2. `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
3. `docs/aa/PHASE-3B-SHARED-RUNTIME-REPORT.md`
4. `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`
5. `docs/aa/DOGFOOD-V0.1-REPORT.md`
6. `docs/aa/CODEBASE-MAP.md`
7. `docs/aa/runtime-foundation/phase-3b/`

Treat the runtime contract and Phase 3B checkpoint as normative.

## Goal

Turn the authoritative Pi runtime foundation into a coherent daily-use product path while preserving the real Pi TUI/xterm.

Phase 3C must focus on five outcomes:

1. Authoritative Pi runtime state becomes the default AA presentation path with clear diagnostics/fallbacks.
2. Real effective Pi model and reasoning become useful, compact UI information. Reasoning Hair becomes a real runtime-backed feature.
3. Exact Pi conversation resume becomes discoverable and safe in the normal AA workflow.
4. Full Host/Electron restart behavior is tested in a safely isolated AA development profile, without risking unrelated user sessions.
5. Runtime health/unknown/quarantine states are understandable enough for daily use without exposing internal implementation noise.

Do not add native chat, orchestration, task database, transcript storage, or Tier 2 runtime expansion.

## 1. Isolated AA runtime QA profile

The shared development profile prevented a safe full Electron restart in Phase 3B. Fix the test environment before claiming restart behavior.

Create a repository-supported, disposable AA runtime QA profile or launch mode that isolates local app state from the user's normal Superset development profile.

Requirements:

- isolated application/profile data directory using existing Electron/Superset profile mechanisms where possible;
- no database schema fork;
- no hard-coded personal paths;
- clearly named disposable QA profile;
- startup/cleanup commands documented;
- must not kill or attach to unrelated existing terminals/agents;
- safe to launch, stop, and relaunch Electron during automated/manual QA;
- do not create a second Host Service architecture.

Use this isolated profile to perform the full restart acceptance later in this brief.

If repository architecture already has an appropriate test-profile mechanism, reuse it rather than inventing another one.

## 2. Pi authoritative presentation productization

Audit all AA Worker/Task/Terminal/status surfaces and ensure an available Tier-1 Pi runtime snapshot is the default authority.

Required behavior:

- runtime snapshot identity/state wins over legacy binding and launch metadata;
- legacy Pi binding remains fallback only during bridge migration or when no valid runtime snapshot exists;
- `unknown`, `offline`, `error`, and quarantine/resume mismatch conditions must remain explicit;
- never infer `idle` from elapsed time, tool completion, terminal silence, or TUI text;
- `turn.settled` remains the completion boundary;
- a runtime snapshot with insufficient/contradictory evidence must not be silently replaced with a more optimistic legacy state.

Add focused regression tests proving precedence and fallback rules.

## 3. Runtime-backed Pi model and Reasoning Hair

Phase 3B proved authoritative Pi model and effective reasoning read.

Make these values part of the normal Pi Worker/Workstation presentation when capabilities are `available`.

Requirements:

- show exact effective model label/value from the runtime snapshot;
- show exact effective reasoning text from the runtime snapshot;
- drive the existing Reasoning Hair presentation from that exact effective value;
- preserve the textual reasoning value at all times when hair is shown;
- if reasoning read is unavailable/unknown/null, do not show a guessed hair level;
- available reasoning values are model/runtime-specific; do not assume the launch picker catalog is authoritative;
- do not add reasoning write controls in Phase 3C;
- do not add model write controls in Phase 3C.

Keep this compact. It should enrich the existing Worker/Terminal header, not create a large settings panel.

## 4. Pi exact resume as a normal product flow

Phase 3B verified exact native UUID resume. Productize it carefully.

When a Pi session is `offline` and `resume.canResume === true`:

- show a clear `RESUME PI SESSION` action in an appropriate existing AA surface;
- show enough identity context to distinguish a resumable conversation without exposing raw internal IDs by default;
- invoke the existing exact resume path using the recorded native Pi UUID;
- transition through truthful `starting` state;
- accept success only after the resumed Pi bridge reports the same native UUID in a new sequence-1 snapshot/new epoch;
- on mismatch, remain explicit `ERROR / RESUME IDENTITY MISMATCH` or equivalent truthful product copy;
- on missing confirmation, report a truthful failure and do not silently create a replacement conversation;
- do not select a recent Pi session heuristically.

Preserve the existing terminal-first UI. Resume should reopen/reattach the real Pi TUI.

Add accessibility labels, keyboard operation, and reduced-motion-safe feedback.

## 5. Full restart acceptance

Using the isolated QA profile from section 1, execute a real end-to-end restart test.

Minimum journey:

1. create/open a disposable Git project and Pi workspace through AA;
2. run a harmless Pi turn that creates identifiable conversation context;
3. verify authoritative native session ID, model, reasoning, and settled state;
4. fully quit the isolated Electron/Host app stack;
5. relaunch the same isolated profile;
6. verify the known workspace/pane/binding metadata restores as designed;
7. verify the runtime presentation does not claim a live Pi session before runtime evidence exists;
8. use the normal AA resume action;
9. require the same native Pi UUID after resume and a new epoch;
10. ask Pi a harmless follow-up that proves prior conversation context survived;
11. verify Renderer reload after the full restart/resume still reads the Host runtime snapshot;
12. clean up the disposable workspace, worktree, branch, terminal, and QA profile artifacts.

If any part cannot be isolated safely, stop that sub-test and document the exact blocker. Do not kill the user's normal development sessions.

## 6. Runtime health presentation

Create a small presentation mapping for runtime conditions that are meaningful to a user.

At minimum cover:

- STARTING
- WORKING
- IDLE
- OFFLINE / RESUMABLE
- UNKNOWN
- ERROR
- RESUME IDENTITY MISMATCH
- RESUME NOT CONFIRMED

Use stable user-facing language while retaining diagnostic details in a tooltip/details affordance where appropriate.

Do not expose epoch/sequence/session UUID as primary UI labels. They may be available in diagnostics/copyable details for development builds if safe.

Do not turn this into a generic observability dashboard.

## 7. Grok boundary

Do not expand Grok beyond the Phase 3B foundation unless the machine is already authenticated through a user-owned login before the task begins.

If still unauthenticated:

- rerun the smallest initialize/auth boundary check;
- preserve truthful `authentication_required` capability/state;
- do not enter credentials;
- do not implement speculative prompt/tool/permission behavior;
- document the exact next authenticated acceptance test for a later phase.

If Grok is already authenticated without Codex entering credentials, you MAY perform a narrowly scoped read-only/probe turn to validate the existing adapter foundation, but do not make Grok product UI changes in Phase 3C. Record evidence and stop at contract validation.

## 8. Fix the dogfood workspace-selection friction if still present

Re-test the MEDIUM dogfood finding: invoking `New workspace` from a specific Briefcase/project row selected the previously used project.

If reproducible and the fix is confined to existing Renderer/YELLOW flow state:

- fix the project-context preselection;
- add focused tests;
- verify the originating Briefcase is selected.

If the issue is no longer reproducible or requires broader architecture, document it and do not expand scope.

## 9. Security and privacy

Preserve Phase 3B restrictions:

- no prompt/transcript/message-body persistence in AA runtime registry;
- no tool argument/result retention in the minimum runtime contract;
- no environment/credential dumps;
- no raw authentication payloads;
- workspace-scoped Host reads/events;
- bounded event retention;
- validated ingress;
- no xterm/TUI scraping for runtime truth.

Screenshots/evidence must exclude terminal transcript unless the content is a deliberately harmless QA marker with no sensitive context. Prefer chrome/state-only captures.

## 10. Architecture boundaries

Allowed when necessary:

- AAOffice Renderer presentation and focused V2 composition;
- shared runtime contract helpers/tests;
- existing Host AA runtime registry/router/resume code;
- Pi bridge v2 template/installer and narrow agent launch/resume integration;
- repository-supported isolated QA profile/startup tooling;
- focused workspace-create Renderer fix for the project-preselection issue.

Do not modify:

- PTY daemon behavior;
- xterm byte transport/rendering;
- Git/worktree semantics;
- database schema/migrations;
- Tier 2 vendor-specific lifecycle hooks;
- native chat;
- automatic multi-agent orchestration.

Any necessary expansion beyond these boundaries must be documented before implementation.

## 11. Verification

Automated minimum:

- shared runtime contract tests;
- Host registry/resume/router tests;
- Pi bridge/template/installer tests;
- AA Renderer runtime presentation tests;
- workspace-selection regression test if fixed;
- relevant TypeScript checks for all touched packages;
- Biome/targeted lint;
- `git diff --check`;
- evidence/diff sensitive-information scan.

Real minimum:

- Pi working → settled state driven by authoritative runtime snapshot;
- real model/reasoning display and Reasoning Hair;
- tool finish does not settle the turn;
- offline/resumable presentation;
- normal UI exact-resume action;
- same native UUID + new epoch after resume;
- full isolated Electron/Host restart journey;
- Renderer reload after resumed session;
- 1440×800 layout and terminal focus/input;
- Files/Changes/Review regression;
- Tier 2 dispatch still works and remains `UNTRACKED` without authoritative Tier-1 snapshot;
- Grok auth boundary recheck or authenticated probe if already logged in.

## 12. Deliverables

Create:

- `docs/aa/PHASE-3C-PI-RUNTIME-PRODUCTIZATION-REPORT.md`
- `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/runtime-foundation/phase-3c/`

The report must include:

1. executive verdict;
2. exact baseline/final commit and environment;
3. isolated QA profile design;
4. Pi authority/fallback precedence;
5. model/reasoning/Reasoning Hair behavior;
6. resume UI and identity-confirmation behavior;
7. full Electron/Host restart result;
8. runtime-health presentation;
9. workspace-selection dogfood finding result;
10. Grok authentication boundary status;
11. automated and real verification;
12. security/privacy review;
13. files changed;
14. known limitations;
15. recommended next phase.

## Explicit non-goals

Do not implement:

- native structured chat;
- transcript storage;
- model write UI;
- reasoning write UI;
- permission UI;
- structured cancellation UI;
- Grok product activation without authenticated evidence;
- Tier 2 runtime tracking work;
- workflow engine;
- automatic agent handoff;
- task database;
- project-management features.

After Phase 3C is complete, commit and push the implementation/report/evidence to `origin/aa-spike`, then STOP. Do not begin Phase 3D.