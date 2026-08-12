# Phase 4A route coverage — after implementation

The authenticated layout owns one route-aware `AAApplicationShell`. Mature
dashboard and Settings bodies remain owned by their existing layouts. Only a
real V2 Work Folder enables Files and workspace-local rail actions.

| Route family | AA route kind | Rail state | Existing content/behavior retained | Result |
| --- | --- | --- | --- | --- |
| `/v2-workspaces` | `home` | `HOME` current; Files disabled | Workspaces index and Briefcase sidebar | Pass |
| `/project/$projectId` | `cases` | `CASES` current; Files disabled | Existing project detail | Pass by route contract |
| `/v2-workspace/$workspaceId` | `work-folder` | `CASES` current; Files contextual | Pane engine, xterm, File Cabinet, Active Tasks | Pass, real Electron |
| `/new-workspace` | `advanced-workspace` | `CASES` current; Files disabled | Existing advanced creation surface | Pass, real Electron |
| `/tasks` and nested | `tasks` | `TASKS` current; Files disabled | Existing task source/table | Pass, real Electron |
| `/automations` and nested | `automations` | `AUTO` current; Files disabled | Existing automation content | Pass, real Electron |
| `/pull-requests` and nested | `pull-requests` | `PRS` current; Files disabled | Existing pull-request content | Pass, real Electron |
| `/settings/terminal` | `sessions` | `SESS` current; Files disabled | Existing terminal-preset settings | Pass, real Electron |
| `/settings/agents` and nested | `agents` | `AGENTS` current; Files disabled | Existing agent configuration | Pass, real Electron |
| `/settings/*` | `settings` | `SET` current; Files disabled | Existing Settings navigation/forms | Pass, real Electron |
| `/workspace*`, `/workspaces` | `outside` | no AA shell | V1 behavior | Excluded and unchanged |
| `/onboarding*`, `/sign-in`, auth/public | `outside` | no AA shell | Existing auth/onboarding behavior | Excluded and unchanged |

Dashboard routes retain the AA Briefcase Cabinet/Active Tasks presentation.
Settings routes retain their mature Settings sidebar inside the common hard-edge
outer frame. No non-Workspace route mounts a new Runtime, File Cabinet, pane, or
xterm provider.
