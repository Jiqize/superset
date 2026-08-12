# Phase 4A route coverage — before implementation

Baseline: `f0b7a1018c148f670de05d58cdddd3a9310ba196`

This inventory was captured before Phase 4A implementation from the real
TanStack file-route tree. `AA shell` means the shared AA navigation rail,
palette, hard-edge frame, and route-derived navigation state. It does not mean
that the mature page body is rewritten.

| Route family | Existing layout owner | AA before 4A | Phase 4A target |
| --- | --- | --- | --- |
| `/v2-workspaces` | `_dashboard/layout.tsx` | Plain dashboard; no AA rail/frame | Home inside the shared AA shell and AA Briefcase sidebar |
| `/project/$projectId` | `_dashboard/layout.tsx` | Plain dashboard; no AA rail/frame | Briefcase detail inside the shared AA shell/sidebar |
| `/v2-workspace/$workspaceId` | `_dashboard/layout.tsx` + V2 Workspace layout | Full workspace-only AA shell | Preserve the existing Work Folder surface inside the shared shell |
| `/new-workspace` | `_dashboard/layout.tsx` | Plain advanced creation screen | Existing advanced form inside the shared AA shell/sidebar |
| `/tasks` and nested task routes | `_dashboard/tasks/layout.tsx` | Plain dashboard | Existing Tasks content inside the shared AA shell/sidebar |
| `/automations` and `/$automationId` | `_dashboard/automations/layout.tsx` | Plain dashboard | Existing Automations content inside the shared AA shell/sidebar |
| `/pull-requests` and `/$prNumber` | `_dashboard/pull-requests/layout.tsx` | Plain dashboard | Existing Pull Requests content inside the shared AA shell/sidebar |
| `/settings/terminal` | `settings/layout.tsx` | Separate Superset settings frame | Sessions destination inside the shared AA outer shell |
| `/settings/agents` and `/$agentId` | `settings/layout.tsx` | Separate Superset settings frame | Employees destination inside the shared AA outer shell |
| `/settings/account` and other nested settings | `settings/layout.tsx` | Separate Superset settings frame | Existing Settings content/navigation inside the shared AA outer shell |
| `/workspace*`, `/workspaces` | `_dashboard/layout.tsx` | V1 behavior | Excluded; non-AA/V1 behavior stays unchanged |
| `/onboarding*`, `/sign-in`, public/auth routes | Auth/onboarding layouts | Non-AA | Excluded from AA CSS and composition |

## Pre-implementation findings

- `aaOfficeActive` in `_dashboard/layout.tsx` requires a matched V2 Work Folder
  route, so all other dashboard destinations receive the plain sidebar.
- `AANavigationRail` is mounted by that same workspace-only condition.
- Settings is a sibling of `_dashboard`, so its existing layout cannot inherit
  the workspace-owned rail.
- The authenticated provider boundary is the smallest common parent that
  already owns the mature collections and Host context required by the rail.
- Non-workspace routes must receive only the outer shell; they must not mount
  Workspace, Runtime, xterm, File Cabinet, or pane-layout providers.
