# AA Office v0.1 — Dogfood Acceptance Test

## Purpose

Run a realistic end-to-end acceptance test of AA Office v0.1 as if you were an actual user. This is primarily a product-validation task, not an implementation phase.

Use the stable checkpoint as the product contract:

- `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md`
- `docs/aa/CODEBASE-MAP.md`
- `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md`
- latest Phase reports where needed

Do not begin Phase 3. Do not proactively fix product issues during the test. Record them first.

## Core rule: use the product

Where practical, perform the workflow through the running AA Office Electron UI using real pointer and keyboard interaction, as a user would.

You may use shell/CDP/devtools for setup, observation, verification, screenshots, and cleanup. Do not bypass an AA UI interaction with direct repository edits or shell commands merely because that is faster. If the UI cannot perform a required step and you must fall back to shell or another route, record that as a dogfood finding.

Do not use direct DOM `.click()` as a substitute for normal UI interaction. The acceptance path should exercise real application behavior.

## Safety and isolation

Create a disposable local Git repository outside the Superset source tree for this test. Do not use a production/user project. Do not modify unrelated repositories.

Suggested temporary project name:

`aa-v01-dogfood-cli`

The repository should contain only the small fixture needed for the task. Clean up temporary worktrees, branches, tabs, processes, and test files after evidence is captured. Do not delete the dogfood report or screenshots referenced by it.

## Real task

Build a tiny TypeScript command-line utility named `project-summary`.

Input: path to a JSON file describing a project.

Example input:

```json
{
  "name": "AA Office",
  "owner": "Agent Arsenal",
  "status": "prototype",
  "tasks": [
    { "title": "Build shell", "done": true },
    { "title": "Test workflow", "done": false }
  ]
}
```

Expected CLI behavior:

```text
Project: AA Office
Owner: Agent Arsenal
Status: prototype
Tasks: 1/2 complete
```

Requirements:

- TypeScript
- minimal dependencies
- clear error for missing file
- clear error for invalid JSON
- at least a few focused tests
- README with one usage example

Keep the task deliberately small. The purpose is to validate AA Office, not to build a sophisticated CLI.

## Acceptance journey

### 1. Create/open the project through AA Office

Create the disposable Git repository and open it as a real AA Project/Briefcase.

Create a fresh Work Folder/workspace through the product flow where practical.

Verify:

- Briefcase Cabinet shows the real project
- Work Folder shows the real workspace
- fresh layout is terminal-first
- File Cabinet points at the correct repository/worktree
- no unrelated saved layout leaks into the new workspace

Capture a screenshot.

### 2. Assign the implementation to Pi

Launch/use Pi through the existing AA/Superset agent flow.

Rename the Task Folder to something meaningful such as:

`Build project-summary CLI`

Give Pi the real implementation task through the real terminal/TUI.

Observe and record:

- Worker Card identity and state
- Task Folder state while Pi is working
- `LAST TURN / COMPLETE` behavior after a completed Pi turn
- changed-file count
- whether terminal focus/input feels reliable
- whether Task Folder rename remains correct

Do not manually edit the fixture implementation outside the agent workflow unless the product cannot complete the task. Any fallback is a finding.

Capture screenshots for at least the working state and post-turn state.

### 3. Inspect the work through AA Office

Use the real File Cabinet and existing review surfaces to inspect Pi's changes.

Exercise:

- Files
- Changes
- Diff
- Review if meaningful for the fixture

Verify the changed-file count matches reality.

Run the fixture tests and CLI through an AA terminal.

Record any place where you must leave AA Office or use an external shell because the product path is missing or too difficult.

### 4. Manual dispatch to a second employee

Use the Employee Roster to dispatch current work to a second available employee. Prefer Codex if it is configured and usable; otherwise use another real configured preset and state which one was used.

Give the second employee a small review/fix request, for example:

`Review the project-summary implementation. Run its tests, fix any real issue you find, and keep the implementation minimal.`

Verify truthfulness:

- pending launch uses `HANDING TO`
- successful launch receipt uses `DISPATCHED TO`
- do not expect `ASSIGNED` without authoritative binding
- active Worker Card follows the second terminal
- known employee without lifecycle binding displays `UNTRACKED`
- original Pi terminal/session remains available
- switching back to Pi restores Pi identity/state

Capture a screenshot of the second employee state.

### 5. Verify final output

Use AA Office to inspect final Files/Changes/Diff.

Run:

- fixture tests
- one successful CLI example
- missing-file error case
- invalid-JSON error case

Record actual results.

Do not call the task successful merely because the agent says it is complete. Verify the files and command behavior.

### 6. Persistence and navigation test

Exercise normal product navigation:

- switch between Pi and second-agent tabs
- Files / Changes / Review
- Home and return to workspace
- Renderer reload

Verify:

- Task Folder title persistence
- pane layout persistence
- terminal reattachment
- active Worker presentation
- changed-file state

If practical without risking the test environment, perform one full Electron application restart and document exactly what survives and what does not. The known Pi conversation-resume limitation should be confirmed rather than silently worked around.

### 7. Compact viewport

Verify the final workspace at approximately 1440×800.

Check:

- terminal remains usable
- Briefcase Cabinet remains readable
- File Cabinet remains usable
- Worker Card remains visible
- Employee Roster overflow controls reveal hidden employees
- no page-level overflow

Capture a screenshot.

## Evaluation rubric

Score each category from 1 to 5 and justify the score with observed evidence:

1. Project/workspace setup
2. Agent launch and terminal reliability
3. AA state truthfulness
4. Task Folder usefulness
5. Employee Roster / dispatch clarity
6. Files/Changes/Diff workflow
7. Navigation and persistence
8. Compact-layout usability
9. Visual coherence
10. Overall daily-use readiness

Use this interpretation:

- 5 = smooth enough for daily use
- 4 = good, minor friction
- 3 = usable with meaningful friction
- 2 = workflow frequently breaks or requires bypasses
- 1 = unusable for the intended workflow

Do not inflate scores.

## Finding severity

Classify each finding:

- `BLOCKER`: prevents completion of the realistic task through AA Office
- `HIGH`: major daily-use problem or misleading state
- `MEDIUM`: meaningful friction with a viable workaround
- `LOW`: polish, density, copy, or minor interaction issue

For each finding include:

- severity
- exact step
- expected behavior
- actual behavior
- workaround, if any
- likely area/component if obvious
- whether it requires Runtime/RED changes or appears presentation-only

Do not implement the fix during this dogfood pass unless the test cannot continue at all. If a BLOCKER must be minimally repaired to continue, make the smallest isolated fix, document it explicitly, rerun the affected path, and keep it separate from product improvements.

## Evidence

Create a durable evidence directory under:

`docs/aa/dogfood/v0.1/`

Store useful screenshots there rather than only in `/tmp`.

Use concise filenames such as:

- `01-fresh-workspace.png`
- `02-pi-working.png`
- `03-pi-turn-complete.png`
- `04-diff-review.png`
- `05-second-employee.png`
- `06-compact-layout.png`

Do not commit screenshots containing secrets, tokens, private unrelated paths, or sensitive data. Crop/redact or omit such evidence if needed.

## Deliverable

Create:

`docs/aa/DOGFOOD-V0.1-REPORT.md`

Required sections:

1. Executive verdict
2. Environment and exact commit tested
3. Test fixture/task
4. End-to-end journey with actual outcomes
5. Verification of the finished CLI
6. Persistence/restart observations
7. Rubric scores
8. Findings ordered by severity
9. Workarounds required
10. What worked especially well
11. Recommended next phase
12. Evidence index
13. Cleanup performed

The executive verdict must choose exactly one:

- `READY FOR PERSONAL DAILY USE`
- `READY WITH KNOWN FRICTION`
- `NOT READY FOR DAILY USE`

Base the verdict on the observed workflow, not on automated tests alone.

## Final verification

After dogfooding:

- ensure Superset source worktree is clean except intended dogfood documentation/evidence
- ensure temporary QA tabs/processes are cleaned up
- ensure disposable fixture/worktree state is documented and cleaned up when no longer needed
- run `git diff --check` for documentation changes
- do not start Phase 3

Commit and push only the dogfood report/evidence and any explicitly documented minimal BLOCKER fix that was truly required to complete testing.

After `DOGFOOD-V0.1-REPORT.md` is complete and pushed, STOP.