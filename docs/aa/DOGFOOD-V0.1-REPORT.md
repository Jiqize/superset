# AA Office v0.1 — Dogfood Acceptance Report

## 1. Executive verdict

**READY WITH KNOWN FRICTION**

AA Office completed the realistic `project-summary` task end to end with a real Pi implementation turn, a real Codex review/fix turn, real terminal commands, and the existing Files/Changes/Diff surfaces. The terminal-first workspace, Task Folder, Employee Roster, File Cabinet, navigation, renderer persistence, and compact layout were usable without modifying Superset or AA product code.

The principal risk is state truthfulness for non-Pi agents: during the Codex review, AA displayed `LAST TURN / COMPLETE` and `IDLE` while the Codex TUI was still visibly `Working` and continued to make changes for several minutes. Until that contract is fixed, the terminal/TUI must remain the authority for whether Codex work is finished. This is a HIGH finding and makes Runtime Contract work more important than another visual pass.

No BLOCKER was encountered and no product fix was made during this dogfood pass.

## 2. Environment and exact commit tested

- Source worktree: `/Users/lianglei/Code/bluejob/superset`
- Branch: `aa-spike`
- Application commit tested: `c8964bfc191c2b0f9420fd29a0fb6955fa39383c`
- Remote update: `git pull --ff-only origin aa-spike`
- Commit confirmation: HEAD exactly matched the requested commit before testing; `git cat-file -e c8964bfc191c2b0f9420fd29a0fb6955fa39383c^{commit}` and the ancestor check both succeeded.
- OS: macOS 26.4 (25E246), Apple Silicon (`arm64`)
- Bun: 1.3.14
- Node: v24.14.0
- Git: 2.50.1 (Apple Git-155)
- Desktop dev runtime: existing Electron process, Vite renderer on port 3005, Electron remote debugging on port 9222
- Main viewport: 1920×976; compact verification viewport: 1440×800

The Electron accessibility tree was not available to the local computer-use driver even though the app was visible. UI dogfooding therefore used Chrome DevTools Protocol pointer and keyboard input events against the real Electron renderer. It did not call DOM `.click()`. Shell/CDP evaluation was limited to setup, observation, screenshots, independent verification, and cleanup.

## 3. Test fixture/task

AA Office created and opened the disposable local Git project:

`/Users/lianglei/Code/bluejob/aa-v01-dogfood-cli`

The project started on `main` with an empty initial commit (`5811eee366baecbc7565185b972e13b46bdd5c19`). The product-created implementation workspace was:

`/Users/lianglei/.superset/worktrees/dffc345a-adba-48ba-bbde-a6eb23afabdd/project-summary-pi`

Task Folder title:

`Build project-summary CLI`

The real task was a minimal TypeScript CLI accepting a project JSON path and printing:

```text
Project: AA Office
Owner: Agent Arsenal
Status: prototype
Tasks: 1/2 complete
```

It also had to provide missing-file and invalid-JSON errors, focused tests, minimal dependencies, and a README usage example.

Final fixture records visible to Git and AA:

- `.gitignore`
- `README.md`
- `bun.lock`
- `package.json`
- `sample-project.json`
- `src/cli.ts`
- `src/index.ts`
- `tests/cli.test.ts`
- `tsconfig.json`

The final AA changed-file count was 9, exactly matching `git ls-files --others --exclude-standard | wc -l`.

## 4. End-to-end journey with actual outcomes

### Project and fresh workspace

The project was created through AA's **Create new project** flow, then appeared as the real `aa-v01-dogfood-cli` Briefcase. A fresh Pi workspace named `project-summary-pi` was created through the workspace flow.

Observed result:

- Briefcase Cabinet showed the real project and both exploratory/final Work Folders.
- The selected Work Folder used the expected AA selection treatment.
- The final fresh workspace opened terminal-first with one real Pi terminal.
- File Cabinet pointed at the correct worktree.
- No unrelated saved panes or layout leaked into the fresh workspace.
- A preliminary no-agent workspace was created during exploration because no launch prompt was supplied; it remained independent and was removed during cleanup.

The project-scoped **New workspace** action twice preselected the previously used `aa-baseline-fixture` project instead of the dogfood project. Manually selecting `aa-v01-dogfood-cli` allowed the journey to continue.

### Pi implementation

Pi was launched from the existing AA/Superset agent path. Task Folder rename worked through the UI and immediately displayed `Build project-summary CLI`.

The first prompt used a loosely described sample and Pi spent time on unnecessary web research without changing files. It was interrupted with normal terminal input and given the exact sample JSON and acceptance criteria. This was agent/prompt behavior, not an AA runtime bypass.

With the corrected prompt:

- the Worker Card displayed Pi and moved to real `WORKING`;
- Task Folder displayed real working state;
- terminal focus, text input, Ctrl+C, and subsequent prompting were reliable;
- Pi created the CLI, README, sample, configuration, and tests;
- after the turn, AA displayed `LAST TURN / COMPLETE` and returned Pi to idle;
- the renamed Task Folder remained correct.

Pi initially left `.pi/` and `node_modules/` unignored, so AA truthfully displayed 119 changed records. The count exactly matched Git, although this made File Cabinet noisy. The second employee later corrected repository hygiene, reducing the real/final count to 9.

### Files, Changes, Diff, and Review

All inspection was performed through AA Office before independent shell verification:

- **Files** opened `README.md` from the real worktree tree.
- **Changes** listed the actual untracked/changed files.
- **Diff** opened the README preview and unified/split diff presentation.
- **Review** showed the truthful empty state: a pull request is required for checks/comments. No PR was created for the disposable local fixture.
- File Cabinet counts tracked Git both before and after the second-agent cleanup.

A local terminal was added through the workspace `+` menu. `bun test`, typecheck, the successful CLI case, and both failure cases were run inside AA Office. No implementation file was manually edited outside the agent workflow.

### Manual dispatch to Codex

Codex was selected from the Employee Roster. AA opened a real Codex terminal in under a second.

Observed assignment sequence:

- the new terminal initially showed Codex as `UNTRACKED`, which was truthful before authoritative lifecycle binding;
- the standard Codex trust prompt required explicit Enter confirmation;
- after binding, the Worker Card followed the active Codex terminal and showed `ASSIGNED CODEX / WORKING`;
- Pi's original terminal remained available;
- switching back to Pi and focusing its xterm restored Pi identity and `IDLE` state.

The requested review was:

`Review the project-summary implementation. Run its tests and error cases, fix any real issue you find, keep it minimal, and do not commit.`

Codex found and fixed three real issues: generated tool/dependency directories were unignored, tests used fixed repository-root temporary files, and tests did not exercise process stdout/stderr/exit codes. It added `.gitignore`, process-level CLI tests, a typecheck script, and Bun types.

The brief's short-lived `HANDING TO` and `DISPATCHED TO` receipts were not visually observable because the tab switch/launch completed in under roughly 300 ms. The new Codex tab and truthful initial `UNTRACKED` state made the launch outcome clear, but the receipt language itself was too transient to verify visually.

During the same turn, AA later switched to `LAST TURN / COMPLETE` and `IDLE` while the Codex TUI still showed `Working (3m 53s)` and subsequently made additional edits. This is the HIGH truthfulness finding captured in evidence 08.

Codex also reported `MCP client for codex_apps failed to start: timed out awaiting tools/list after 30s` during startup. The coding session remained usable after the delay and completed its review.

## 5. Verification of the finished CLI

The final command sequence run inside the AA local terminal was:

```sh
printf '\n=== FINAL TESTS ===\n'
bun test
printf '\n=== TYPECHECK ===\n'
bun run typecheck
printf '\n=== FINAL SUCCESS ===\n'
bun run src/cli.ts sample-project.json
printf '\n=== FINAL ERROR EXITS ===\n'
bun run src/cli.ts does-not-exist.json && printf 'missing=UNEXPECTED-SUCCESS\n' || printf 'missing=EXPECTED-NONZERO\n'
bun run src/cli.ts README.md && printf 'invalid=UNEXPECTED-SUCCESS\n' || printf 'invalid=EXPECTED-NONZERO\n'
```

Actual results:

- `bun test`: exit 0; 7 passed, 0 failed, 20 `expect()` calls.
- `bun run typecheck`: exit 0 (`tsc --noEmit`).
- valid sample: exit 0 with the exact four required output lines.
- missing file: exit 1 with `Error: File not found: does-not-exist.json`; wrapper printed `missing=EXPECTED-NONZERO`.
- invalid JSON (`README.md`): exit 1 with `Error: Invalid JSON: JSON Parse error: Unrecognized token '#'`; wrapper printed `invalid=EXPECTED-NONZERO`.

The same tests, typecheck, exact stdout, error messages, exit codes, and final Git count were independently rechecked from a shell after the AA run. The task was accepted on observed behavior, not on either agent's completion claim.

## 6. Persistence/restart observations

The following product navigation was exercised with real UI input:

- switched among Pi, local-terminal, and Codex tabs;
- switched Files, Changes, and Review;
- navigated Home and returned to the workspace;
- reloaded the Electron renderer.

After Home/return and after renderer reload:

- Task Folder title remained `Build project-summary CLI`;
- all three workspace tabs and the saved pane layout remained present before cleanup;
- the Pi terminal reattached and accepted focus/input;
- focusing Pi restored Pi/idle presentation;
- File Cabinet still reported the final 9 real changes.

A full Electron process restart was not performed. The running Electron/Vite instance was a shared long-lived development environment, and stopping it would have risked unrelated state. Consequently, process-restart Pi conversation resume was not reconfirmed. The checkpoint's known Pi conversation-resume limitation remains open; this test verifies renderer reload/terminal reattachment only.

The CDP harness itself briefly raced the blank document immediately after `Page.reload`; after 2.5 seconds the product was fully loaded with the persisted state above. This was a test-observation race, not a Renderer console/product error.

## 7. Rubric scores

| Category | Score | Evidence-based justification |
| --- | ---: | --- |
| 1. Project/workspace setup | 3/5 | UI creation worked and the fresh workspace was clean, but project-scoped workspace creation selected the wrong prior project and required manual correction. |
| 2. Agent launch and terminal reliability | 4/5 | Pi, Codex, and local terminals all launched and accepted normal focus/input; Codex had a trust step and a 30-second MCP startup timeout. |
| 3. AA state truthfulness | 2/5 | Pi lifecycle and Git counts were truthful, but Codex was reported complete/idle while its main turn was still visibly working. |
| 4. Task Folder usefulness | 4/5 | Meaningful rename, real assignment/state, changed count, and persistence made the current unit of work easy to identify. |
| 5. Employee Roster / dispatch clarity | 3/5 | Codex launch, `UNTRACKED`, binding, tab identity, and compact overflow worked; `HANDING TO`/`DISPATCHED TO` were too transient to verify. |
| 6. Files/Changes/Diff workflow | 4/5 | Real files, counts, preview, changes, and diff were usable; local Review correctly had no PR data. |
| 7. Navigation and persistence | 4/5 | Home/return and Renderer reload preserved title, layout, terminals, and Git state; full process restart was intentionally not attempted. |
| 8. Compact-layout usability | 4/5 | At 1440×800 the terminal, both cabinets, and Worker Card remained usable with no page overflow; roster overflow controls exposed hidden employees. |
| 9. Visual coherence | 4/5 | Briefcase, roster, Task Folder, workstation, File Cabinet, and status bar read as one compact AA Office system. |
| 10. Overall daily-use readiness | 3/5 | A complete real task is possible inside AA, but state completion cannot yet be trusted across all employees. |

## 8. Findings ordered by severity

### HIGH — Codex can be reported complete while its main turn is still working

- **Exact step:** dispatch the review to Codex, allow it to use its internal review agents, and observe the active Codex terminal/Worker Card while the turn continues.
- **Expected:** AA remains `WORKING` until the authoritative main Codex turn has actually stopped, then records `LAST TURN / COMPLETE`.
- **Actual:** AA displayed `LAST TURN / COMPLETE` and the Worker Card displayed `IDLE` while the TUI visibly showed `Working (3m 53s)`; Codex made further edits afterward.
- **Workaround:** treat the active terminal/TUI as authoritative and do not hand off or close the tab based solely on AA's completion card.
- **Likely area:** terminal-agent lifecycle event identity/binding or hook-to-session correlation, not the AA visual component alone.
- **Boundary:** likely requires Runtime/RED investigation before any change. Do not mask it with Renderer inference.

### MEDIUM — Project-scoped New workspace starts with the wrong project selected

- **Exact step:** invoke **New workspace** from the `aa-v01-dogfood-cli` Briefcase/project row.
- **Expected:** the originating dogfood project is selected in the modal.
- **Actual:** the previously used `aa-baseline-fixture` project was selected on both attempts.
- **Workaround:** manually select `aa-v01-dogfood-cli` before creating the workspace.
- **Likely area:** Renderer new-workspace modal/store initialization or project-row action context.
- **Boundary:** appears YELLOW/presentation-flow integration; no Runtime/RED change should be necessary.

### MEDIUM — Codex optional MCP startup timed out

- **Exact step:** launch Codex, accept its trust prompt, and wait for startup.
- **Expected:** configured optional tools initialize without delaying the coding session.
- **Actual:** Codex reported `MCP client for codex_apps failed to start: timed out awaiting tools/list after 30s`.
- **Workaround:** continue without that MCP client; core terminal-agent review still worked.
- **Likely area:** local Codex/MCP configuration or preset environment, not AA Office presentation.
- **Boundary:** investigate outside AA Renderer first; no AA Runtime/RED change is established by this test.

### LOW — Dispatch receipt copy is too transient to verify

- **Exact step:** click Codex in Employee Roster and watch the Task Folder/Worker Card during launch.
- **Expected:** `HANDING TO CODEX`, followed by a visible `DISPATCHED TO CODEX` receipt, then authoritative state or `UNTRACKED`.
- **Actual:** launch/tab activation completed in under approximately 300 ms; the first reliably visible state was the new Codex terminal with `UNTRACKED`.
- **Workaround:** use the created tab and Worker Card identity as the launch receipt.
- **Likely area:** AA Task Folder/Employee Roster presentation timing.
- **Boundary:** presentation-only unless later measurement reveals missing launch events.

### LOW — Setup notification occupies compact cabinet space until dismissed

- **Exact step:** keep the workspace open through implementation and resize to 1440×800.
- **Expected:** setup guidance remains available without persistently covering useful cabinet area.
- **Actual:** the setup notification remained at the bottom of the Briefcase Cabinet throughout the session.
- **Workaround:** dismiss it with its close button.
- **Likely area:** existing Renderer notification presentation.
- **Boundary:** presentation-only.

## 9. Workarounds required

- Manually selected the dogfood project in the New workspace modal.
- Rephrased the Pi prompt with the exact sample JSON after the first prompt led to irrelevant research.
- Accepted the normal Codex trust prompt.
- Continued without the timed-out optional `codex_apps` MCP client.
- Used the Codex TUI, not AA's premature completion state, to decide when review work had really stopped.
- Used an AA local terminal for command verification and a shell only for independent confirmation/cleanup.

No manual source edit, direct fixture implementation edit, new runtime adapter, or product-code workaround was used.

## 10. What worked especially well

- A fresh workspace was genuinely terminal-first and did not inherit an unrelated saved pane layout.
- The real xterm surfaces preserved focus, keyboard input, Ctrl+C, resize behavior, and multiple live terminal tabs.
- Pi's real working/idle/last-turn lifecycle was easy to read without obscuring its TUI.
- Task Folder rename and context survived Home/return and Renderer reload.
- Git truthfulness was strong: AA's 119 and final 9 counts both exactly matched Git.
- Files, Changes, preview, Diff, and Review empty state remained the mature Superset functionality under a coherent AA visual shell.
- Codex began honestly as `UNTRACKED`, later acquired an authoritative assignment, and Pi remained available in its original tab.
- The compact 1440×800 layout had no page-level overflow; roster overflow buttons worked in both directions.
- The second employee found and fixed substantive implementation/test hygiene issues, demonstrating a useful manual handoff rather than a staged visual demo.

## 11. Recommended next phase

Proceed to **Phase 3 Runtime Contract**, focused first on authoritative event ownership and correlation for agent/session lifecycle.

The acceptance test found enough visual and workflow coherence to defer another polish-only pass. The next contract must ensure that a subagent/tool completion cannot mark the parent terminal turn complete, preserve truthful `UNTRACKED` behavior where binding is unavailable, and define exactly which event owns `WORKING`, `WAITING`, and `LAST TURN / COMPLETE`. This should be solved at the documented runtime boundary rather than inferred or delayed in the Renderer.

After the runtime truthfulness issue is resolved, the wrong-project preselection and dispatch-receipt timing are suitable small usability follow-ups.

## 12. Evidence index

All images were reviewed before commit and contain no tokens, credentials, or unrelated private content.

1. [Fresh Pi workspace](dogfood/v0.1/01-fresh-workspace.png) — real Briefcase/Work Folder, single terminal-first layout, correct File Cabinet, 0 changes.
2. [Pi working](dogfood/v0.1/02-pi-working.png) — renamed Task Folder and real Pi `WORKING` state.
3. [Pi turn complete](dogfood/v0.1/03-pi-turn-complete.png) — real `LAST TURN / COMPLETE`; 119 truthful pre-hygiene records.
4. [Files, Diff, and Review](dogfood/v0.1/04-diff-review.png) — README inspection and real diff surfaces.
5. [Second employee](dogfood/v0.1/05-second-employee.png) — Codex terminal/trust prompt with truthful initial `UNTRACKED` state.
6. [Compact 1440×800 layout](dogfood/v0.1/06-compact-layout.png) — single Pi terminal, both cabinets, Worker Card, final 9 changes, roster overflow control, no page overflow.
7. [Final verification](dogfood/v0.1/07-final-verification.png) — 7 passing tests, typecheck, exact successful output, and both expected nonzero errors in an AA terminal.
8. [Premature Codex completion](dogfood/v0.1/08-codex-premature-complete.png) — AA `LAST TURN / COMPLETE` and `IDLE` while the Codex TUI visibly remains `Working`.

## 13. Cleanup performed

- Closed the Codex, local-terminal, and Pi QA tabs through AA Office, including the close confirmation where shown.
- Confirmed the dogfood Pi and Codex child processes had exited.
- Deleted both disposable dogfood workspaces through AA Office.
- Confirmed the associated worktree branch/directories were removed, then removed the now-empty project worktree root.
- Deleted the dogfood Project record through AA Office and confirmed it no longer appeared in project settings.
- Moved the disposable main repository to the recoverable path `/Users/lianglei/.Trash/aa-v01-dogfood-cli-dogfood-20260809`.
- A preliminary setup seed is also isolated in Trash at `/Users/lianglei/.Trash/aa-v01-dogfood-cli-seed-11603ff`.
- Returned AA Office to the existing baseline project's settings; no unrelated project/workspace was modified.
- Kept only this report and the durable screenshot evidence in the Superset source worktree.

No Phase 3 implementation was started.
