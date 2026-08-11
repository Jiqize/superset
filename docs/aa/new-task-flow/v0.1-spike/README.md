# AA New Task Flow v0.1 Spike Evidence

This directory contains safe, investigation-only evidence for
`NEW-TASK-FLOW-V0.1-SPIKE-REPORT.md`.

## Contents

- `workspace-create-probe.json` records a real disposable Git/Host-router
  probe of Workspace/worktree creation, collision handling, Unicode title
  handling, and an invalid path rejection.
- `verification-evidence.json` records the focused automated verification and
  the already-accepted real Pi evidence reused by this spike.

## Safety and scope

The Workspace probe used:

- a repository under a unique `/tmp/aa-new-task-spike.*` directory;
- an isolated Bun SQLite Host database;
- the existing `workspacesRouter.create` procedure;
- no agent launch, setup command, credential, remote, or user project.

The temporary repository, database, and all three probe worktrees were deleted
after the observations were reduced to the sanitized JSON below. The evidence
does not retain filesystem paths, UUIDs, Git object IDs, prompts, terminal
output, native Pi session IDs, environment values, or credentials.

No production New Task UI or provisioning code was implemented during this
spike.
