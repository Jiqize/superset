# Phase 3F — Grok Tier 1 Runtime Activation v0.1

## Status and priority

Phase 3E is complete at commit `7f6004c0417a59c33872f7d3a6294ae05cb1ffed` and `AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md` is the stable starting point.

Tier policy remains:

- Pi: Tier 1, productionized and authoritative.
- Grok Build: Tier 1 target. Phase 3F moves Grok from foundation/auth-boundary state toward a real authoritative AA employee runtime.
- Codex, Claude Code, OpenCode, Kimi, and other CLIs: Tier 2 compatibility only.

Do not spend Phase 3F on Tier 2 vendor-specific lifecycle work.

## Read first

1. `docs/aa/AA-RUNTIME-CONTRACT-V0.1.md`
2. `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md`
3. `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md`
4. `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md`
5. `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md`
6. `docs/aa/PHASE-3A-RUNTIME-CONTRACT-REPORT.md`
7. `docs/aa/PHASE-3B-SHARED-RUNTIME-REPORT.md`
8. `docs/aa/PHASE-3E-REPORT.md`
9. `docs/aa/CODEBASE-MAP.md`
10. relevant Grok evidence under `docs/aa/runtime-spike/` and `docs/aa/runtime-foundation/`

Treat the Runtime Contract and accepted checkpoints as normative.

## Goal

Make Grok Build a real Tier 1 employee through its structured ACP/stdio path while preserving AA's terminal-first product and truthful capability model.

The desired end state, only where behavior is actually verified, is:

```text
GROK EMPLOYEE
Runtime: Grok Build
Transport: ACP
Session: authoritative
State: working / idle / waiting / error
Model: runtime-reported
Tools: structured lifecycle
Permissions: structured when supported
Resume: exact session load when verified
```

Do not replace Pi. Pi remains Tier 1 and must regress cleanly through the entire phase.

## 1. Authentication gate first

Before implementing live Grok behavior, determine the current local Grok authentication state through the existing structured/runtime-supported mechanism.

Rules:

- Never enter, request, log, store, or synthesize user credentials.
- Never scrape browser/session cookies.
- Never treat a binary-installed state as authenticated.
- If Grok is already authenticated through a user-owned login, proceed with live Tier 1 verification.
- If Grok is not authenticated, productize the authentication prerequisite clearly and stop live-session claims at that boundary.

For an unauthenticated machine, AA should present a truthful Grok state such as:

```text
GROK BUILD
AUTHENTICATION REQUIRED
ACP READY
LIVE SESSION UNAVAILABLE
```

If Grok provides an official/local login command or user-owned flow already available in the installed CLI, AA may expose a non-destructive `OPEN LOGIN` or `SHOW LOGIN INSTRUCTIONS` affordance that launches/displays that existing flow. Do not automate credential entry.

The UI must never imply Grok is working, idle, resumable, or assigned until a real authenticated session exists.

## 2. Grok ACP adapter completion

Build on the existing Phase 3B Grok ACP descriptor and `AcpSessionManager` integration. Do not create a second daemon or unrelated process manager.

When authenticated behavior is available, map the real ACP surface into `AA-RUNTIME-CONTRACT-V0.1.md`.

Required minimum investigation/implementation:

- initialize and negotiated capabilities;
- `session/new`;
- runtime-native session identity;
- `session/prompt` lifecycle;
- authoritative working → idle settlement;
- assistant/reasoning stream presence as capability evidence only;
- `tool_call` / `tool_call_update` lifecycle and stable tool-call correlation;
- `session/request_permission` if emitted by the installed version;
- `session/cancel` support if confirmed;
- `session/load` / resume behavior if confirmed;
- model read and model-change support if confirmed;
- reasoning read/support only if confirmed by the live session;
- structured runtime errors.

Keep `nativeTurnId: null` unless Grok returns a distinct durable runtime-native turn ID. JSON-RPC request IDs are correlation only.

Do not promote static symbol discovery or initialize-advertised support to `available` unless the live authenticated adapter/session confirms it.

## 3. Grok authoritative state mapping

Implement authoritative Grok session snapshots/events using the shared Host runtime registry.

Required state truthfulness:

- `starting` while authenticated session creation/load is pending;
- `idle` only after a live session is confirmed ready and no prompt/wait is active;
- `working` after a real prompt is accepted until ACP returns authoritative settlement/stop reason;
- `waiting_permission` only from a structured unresolved permission request;
- `waiting_user` only from a structured unresolved user-input request if supported;
- `cancelling` only after structured cancel acceptance;
- `offline` only for a known session with no live adapter and a verified resume path;
- `error` for authoritative structured failure;
- `unknown` when evidence is missing or contradictory.

Tool completion MUST NOT settle a prompt.

Terminal text MUST NOT be scraped for lifecycle truth.

## 4. Grok Employee integration

Upgrade the Grok Employee Profile and active Worker presentation to consume authoritative Tier 1 Grok snapshots when available.

When authenticated and live, show only real values:

- employee: Grok;
- runtime: Grok Build;
- transport: ACP;
- state;
- model if available;
- reasoning if available;
- resume state if available;
- capability matrix;
- latest meaningful structured action from the fixed runtime vocabulary.

When unauthenticated, show authentication-required state and the negotiated/conditional capability matrix without pretending a live session exists.

Do not show raw instance IDs, JSON-RPC IDs, native session IDs, epochs, or credentials in normal UI.

## 5. Grok launch/work surface

AA remains terminal-first, but Grok Tier 1 uses ACP as its authoritative runtime transport.

Choose the smallest product integration that preserves the existing workspace model:

- Employee Roster should launch/select Grok through the Tier 1 path when a verified authenticated ACP session can be created.
- The user must still get a visible work surface in the workspace. Reuse existing pane/session patterns where practical.
- Do not build a full native chat UI.
- If the existing Grok terminal/TUI remains useful as the human-visible interaction surface, it may coexist with ACP authority, but lifecycle truth must come from ACP, not the terminal.
- If ACP is the only viable session transport for the installed Grok version, create the smallest compatible pane shell needed to host/control that session without designing a new chat product.

Document the chosen coexistence model explicitly.

## 6. Structured permission boundary

If the installed authenticated Grok session emits structured permission requests, implement only the minimum shared runtime contract plumbing and a compact AA permission affordance.

Requirements:

- stable request identity;
- exact request title/tool context supplied by the runtime, sanitized if necessary;
- only runtime-provided options;
- first valid resolution wins;
- stale/already-resolved requests are rejected truthfully;
- unresolved permission produces `waiting_permission`;
- resolution returns to `working` until authoritative prompt settlement;
- no generic permission policy engine;
- no automatic approval feature.

If permission behavior cannot be verified, leave capability `unknown` or `conditional` and do not create speculative UI.

## 7. Structured cancellation boundary

If live Grok confirms structured cancellation:

- expose a small `CANCEL` action only while capability is `available` and the session is in a cancellable state;
- transition to `cancelling` after request acceptance;
- wait for runtime confirmation/settlement before showing idle/ended;
- do not model Ctrl-C or process kill as successful structured cancellation.

If live cancellation cannot be verified, do not add the control.

## 8. Grok exact resume

If authenticated Grok confirms `session/load` or equivalent exact resume:

- persist/bind only the runtime-reported native session identity using existing allowed persistence seams;
- never choose a recent session heuristically;
- load in the original workspace/cwd;
- require the resumed runtime to confirm the same native session identity;
- mint a new epoch;
- expose a truthful `RESUME GROK SESSION` action only when `resume.canResume === true`;
- on mismatch or failed confirmation, report explicit error and never silently create a replacement session.

If the live runtime does not verify exact resume, keep resume unavailable.

Do not add a new transcript database.

## 9. Grok-first dogfood task

If authenticated Grok is available, run one disposable real task where Grok is the primary implementer, not a reviewer.

Suggested task:

Create a tiny TypeScript utility in a disposable Git project that:

- reads a JSON file;
- validates two required fields;
- prints a compact summary;
- includes focused tests and README usage.

Use AA Office through real UI interaction where practical.

Acceptance journey:

1. create/open disposable Project and Work Folder;
2. explicitly name Task Folder;
3. assign to Grok through the Tier 1 path;
4. observe authoritative `starting → idle/working` states;
5. give the real task;
6. observe real tool lifecycle without relying on terminal parsing;
7. exercise permission/cancel only if live runtime supports them;
8. inspect Files/Changes/Diff/Review;
9. verify real tests and CLI behavior;
10. fully restart the isolated AA profile if Grok resume is verified;
11. exact-resume and prove context continuity if supported;
12. return to Pi and verify Pi Tier 1 behavior is unchanged.

If the machine remains unauthenticated, replace the live dogfood with an authentication-boundary acceptance test and explicitly mark the Grok primary-task journey `BLOCKED BY USER AUTHENTICATION`. Do not fake the task using Codex or another runtime.

## 10. Pi regression gate

Phase 3F must not regress Pi.

Re-run at minimum:

- Pi authoritative working → settled idle;
- model and effective reasoning / Reasoning Hair;
- tool lifecycle;
- offline/resumable presentation;
- exact Pi resume with same native session identity and new epoch;
- full isolated restart path;
- Task Folder and Employee Profile;
- Renderer reload;
- 1440×800 layout;
- Files/Changes/Review.

## 11. Architecture and security boundaries

Allowed when necessary:

- shared runtime contract helpers/tests;
- Host AA runtime registry/router;
- existing ACP session manager and Grok adapter descriptor/adapter;
- focused Renderer AAOffice / V2 composition;
- existing safe persistence seam if exact Grok native identity needs binding;
- isolated QA profile tooling.

Do not modify:

- PTY daemon behavior;
- xterm byte transport/rendering;
- Git/worktree semantics;
- database schema/migrations unless a separately documented blocker proves no existing safe persistence seam exists;
- Tier 2 vendor-specific hooks;
- native chat architecture;
- automatic orchestration.

Preserve privacy rules:

- no credentials;
- no raw auth payloads;
- no transcript/message-body persistence in the runtime registry;
- no tool arguments/results in the minimum contract;
- no environment dumps;
- no terminal scraping for runtime truth;
- workspace-scoped events/queries;
- bounded validated event retention.

## 12. Verification

Automated minimum:

- runtime-contract tests;
- Host registry/router tests;
- Grok ACP adapter/manager tests;
- Renderer Grok presentation tests;
- permission/cancel/resume tests only for implemented verified capabilities;
- Pi regression tests;
- relevant TypeScript checks;
- targeted Biome/lint;
- `git diff --check`;
- sensitive-information scan.

Real minimum:

Authenticated path, if available:

- initialize;
- real `session/new`;
- real prompt working/settlement;
- tool lifecycle;
- model/reasoning observation where provided;
- permission/cancel where provided;
- exact resume where provided;
- Grok-first dogfood;
- Pi regression.

Unauthenticated path:

- initialize;
- structured auth-required boundary;
- truthful AA Employee/Profile state;
- no live-session claim;
- no credential entry;
- Pi regression;
- documented exact commands/actions the user must complete before authenticated acceptance can run.

## 13. Deliverables

Create:

- `docs/aa/PHASE-3F-GROK-TIER1-ACTIVATION-REPORT.md`
- `docs/aa/AA-GROK-RUNTIME-V0.1-CHECKPOINT.md`
- safe evidence under `docs/aa/runtime-foundation/phase-3f/`

The checkpoint must clearly classify Grok as one of:

- `TIER 1 ACTIVE`
- `TIER 1 AUTHENTICATION-GATED`
- `TIER 1 BLOCKED`

Do not use `ACTIVE` unless a real authenticated Grok session and prompt lifecycle were behaviorally verified.

The report must include:

1. executive verdict;
2. exact baseline/final commit and environment;
3. authentication state;
4. ACP capability matrix with evidence level;
5. session/identity/state mapping;
6. work-surface/coexistence model;
7. permission/cancellation findings;
8. resume findings;
9. Grok-first dogfood or explicit authentication blocker;
10. Pi regression result;
11. security/privacy review;
12. files changed;
13. known limitations;
14. recommended next phase.

## Explicit non-goals

Do not implement:

- Native structured chat product;
- transcript storage;
- automatic login;
- credential management;
- automatic multi-agent orchestration;
- agent-to-agent messaging;
- task database;
- Tier 2 runtime upgrades;
- speculative Grok capabilities unsupported by live evidence.

After Phase 3F is complete, commit and push implementation/report/evidence to `origin/aa-spike`, then STOP. Do not begin Phase 3G.