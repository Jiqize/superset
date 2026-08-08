# AA Phase 0 Baseline

- Date: 2026-08-09
- Platform: macOS arm64
- Repository: `/Users/lianglei/Code/bluejob/superset`
- Branch: `aa-spike` at `cb24df788`

## Result

Phase 0 is complete. The macOS development baseline is usable and reproducible after one minimal local-database proxy compatibility fix.

The core Phase 0 acceptance criteria pass:

- dependencies install with the repository-pinned Bun version;
- the Superset desktop application starts and completes local development sign-in;
- a local Git project and a real Git worktree workspace open successfully;
- Pi is present in the builtin terminal-agent picker and launches through the existing terminal/PTY path;
- Superset observes Pi start, progress and stop lifecycle events;
- file navigation, Git status and diff rendering work;
- a live terminal reattaches after renderer reload.

One limitation remains: after a full Electron quit/restart, the workspace and terminal pane are recreated, but the Pi conversation is not resumable because the Pi lifecycle binding has no persisted `agent_session_id`. This is recorded below and was not fixed because doing so would cross the Phase 0 guardrails around Pi hooks, terminal persistence and host-service lifecycle primitives.

No Phase 1 UI work was started. No PTY daemon, Git/worktree, Pi hook, terminal persistence or host-service lifecycle code was modified.

## Repository State

Repository preparation was completed immediately before this verification with:

```sh
git clone https://github.com/Jiqize/superset.git
cd superset
git remote add upstream https://github.com/superset-sh/superset.git
git fetch origin
git checkout aa-spike
```

The effective state was verified with:

```sh
git remote -v
git branch --show-current
git rev-parse --short HEAD
```

Observed:

```text
origin    https://github.com/Jiqize/superset.git
upstream  https://github.com/superset-sh/superset.git
branch    aa-spike
HEAD      cb24df788
```

## Environment Assumptions

- Apple Silicon Mac with Xcode command-line/native build support.
- Docker Desktop is installed and may need to be started manually before setup.
- Homebrew is available at `/opt/homebrew`.
- Ports beginning at `3000` are available to the local setup allocator.
- Local development authentication uses the seeded `admin@local.test` account.
- Pi is already installed on `PATH` as `/Users/lianglei/.npm-global/bin/pi`.
- The machine's current DNS/proxy configuration maps `db.localtest.me` to a fake-IP address rather than loopback. This machine therefore needs the `localhost` database-proxy override described below.
- The baseline fixture deliberately has no Git remote. Remote-fetch warnings for that fixture are expected and do not invalidate local project/worktree behavior.

Environment inspection commands:

```sh
sw_vers
uname -m
xcodebuild -version
bun --version
node --version
git --version
gh --version
jq --version
pi --version
docker version --format 'client={{.Client.Version}} server={{.Server.Version}}'
command -v caddy
caddy version
```

Observed versions:

| Dependency | Version |
| --- | --- |
| macOS | 26.4, build 25E246 |
| Architecture | arm64 |
| Xcode | 26.4.1, build 17E202 |
| Bun | 1.3.14 |
| Node | v24.14.0 |
| Git | 2.50.1 Apple Git-155 |
| GitHub CLI | 2.87.3 |
| jq | 1.7.1-apple |
| Pi | 0.82.1 |
| Docker client/server | 29.2.1 / 29.2.1 |
| Caddy | 2.11.4 |

The repository requires Bun 1.3.14 through `.bun-version` and `packageManager`. Bun was initially 1.3.12 and was upgraded before setup.

## Exact Setup and Validation Commands

### 1. Install missing prerequisites

Docker Desktop was started through the macOS application UI. The remaining prerequisite commands were:

```sh
bun upgrade
brew install caddy
```

### 2. Run repository-supported local setup

```sh
./.superset/setup.local.sh
```

This command:

- created the ignored root `.env` local overrides;
- installed 5,671 packages;
- rebuilt the arm64 native modules used by Electron, including `better-sqlite3`, `node-pty`, `native-keymap`, `@parcel/watcher` and `packages/macos-process-metrics`;
- pulled and started Postgres 17, the local Neon HTTP proxy, Electric 1.7.4, Redis 7 and serverless-redis-http;
- applied database migrations.

Allocated local ports:

| Service | Port |
| --- | ---: |
| Web | 3000 |
| API | 3001 |
| Desktop renderer | 3005 |
| Desktop notifications | 3006 |
| Streams | 3007 |
| Electric | 3009 |
| Caddy / Electric proxy | 3010 |
| Wrangler | 3012 |
| Relay | 3013 |
| Postgres | 3014 |
| Neon HTTP proxy | 3015 |
| Redis | 3016 |
| Redis HTTP shim | 3017 |

The first setup run failed only at the development-account seed. Diagnosis and the minimal fix are recorded in the next section. After the fix, the seed completed with:

```sh
bun run db:seed-dev
```

Final dependency reproducibility was checked with the frozen repository lockfile:

```sh
bun install --frozen-lockfile
```

Result:

```text
Checked 2909 installs across 3231 packages (no changes)
```

### 3. Start the desktop application

The supported root development command was run with a diagnostic CDP port:

```sh
RENDERER_REMOTE_DEBUG_PORT=9222 bun run dev
```

The logs confirmed:

- renderer available at `http://localhost:3005/`;
- local database migrations complete;
- host-service database initialized;
- PTY daemon listening with protocol version `v0.2.7`;
- managed Pi extension verified;
- bundled Superset CLI shim installed;
- main renderer loaded successfully.

The running page was also checked with:

```sh
curl --fail --silent http://127.0.0.1:9222/json/list \
  | jq -r '.[] | select(.type=="page") | [.id,.title,.url] | @tsv'
```

After testing a full Electron quit, the root Turbo process kept the API, web, Caddy and Electric-proxy tasks alive. The desktop task was relaunched independently with the same supported package script:

```sh
RENDERER_REMOTE_DEBUG_PORT=9222 bun run --cwd apps/desktop dev
```

It reopened the persisted route:

```text
http://localhost:3005/#/v2-workspace/d5f28a2f-ab3f-44b6-9c6d-31d40be6df8b
```

### 4. Verify local services

```sh
docker compose -p superset-superset ps

curl --fail --silent --show-error \
  -X POST http://localhost:3015/sql \
  -H 'Neon-Connection-String: postgres://postgres:postgres@localhost:3015/main' \
  -H 'Content-Type: application/json' \
  -d '{"query":"select 1 as ok","params":[]}'

curl --fail --silent --show-error \
  -X POST http://localhost:3017/ \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer local_dev_token' \
  -d '["PING"]'

curl --fail --silent --show-error http://localhost:3005/ >/dev/null
curl --fail --silent --show-error http://localhost:3001/api/desktop/version
```

Results:

- all five Compose services were up;
- Postgres, Electric and Redis reported healthy;
- Neon query returned `ok=1`;
- Redis HTTP returned `PONG`;
- renderer HTTP returned success;
- desktop version API returned its normal development compatibility payload.

## Database Proxy Error and Minimal Fix

### Error

The development seed failed with a Neon `ECONNRESET`. The setup-generated database hostname did not resolve locally on this machine:

```sh
dscacheutil -q host -a name db.localtest.me
```

Observed:

```text
name: db.localtest.me
ip_address: 198.18.6.214
```

Direct access to `localhost:3015` worked, while `db.localtest.me:3015` was routed to the machine's fake-IP DNS/proxy range.

Changing only the ignored `.env` override to `localhost` was not sufficient: `packages/db/src/local-proxy.ts` recognized only the exact hostname `db.localtest.me`, so the Neon client attempted secure `https://localhost/sql` instead of the local insecure proxy endpoint.

### Fix

The final ignored `.env` override was changed to:

```dotenv
DATABASE_URL="postgres://postgres:postgres@localhost:3015/main"
```

The local-proxy detector was minimally widened to accept both supported local names:

```ts
const LOCAL_DATABASE_HOSTS = new Set(["db.localtest.me", "localhost"]);
```

Only this source file was changed:

```text
packages/db/src/local-proxy.ts
```

Validation commands:

```sh
bun run --cwd packages/db typecheck

bun -e 'import { isLocalProxy } from "./packages/db/src/local-proxy.ts"; const cases = [["postgres://u:p@db.localtest.me:3015/db", true], ["postgres://u:p@localhost:3015/db", true], ["postgres://u:p@example.com:5432/db", false], ["not-a-url", false]]; for (const [url, expected] of cases) { const actual = isLocalProxy(url); if (actual !== expected) throw new Error(`${url}: expected ${expected}, got ${actual}`); } console.log("local proxy host cases passed");'
```

Both passed, and `bun run db:seed-dev` then seeded `admin@local.test` successfully.

### Lockfile normalization

The machine-level npm registry is `https://registry.npmmirror.com`. The first non-frozen install populated resolved tarball URLs in `bun.lock`, producing a 7,988-line metadata-only diff. No package versions changed. Those registry URLs were mechanically normalized back to the repository representation:

```sh
npm config get registry
perl -pi -e 's#"https://registry\.npmmirror\.com/[^"]+\.tgz"#""#g' bun.lock
git diff --exit-code -- bun.lock
```

The subsequent frozen install completed with no lockfile changes.

## Project and Workspace Verification

A disposable local Git fixture was created outside the Superset repository:

```sh
mkdir -p /Users/lianglei/Code/bluejob/aa-baseline-fixture
cd /Users/lianglei/Code/bluejob/aa-baseline-fixture
git init -b main
git add README.md baseline.txt
git commit -m 'chore: add baseline fixture'
```

Fixture commit:

```text
13175d4d438c703e90c55a9e050e96f7601d2e15
```

Through the actual Superset desktop UI:

1. selected `Sign in as Local Admin (dev)`;
2. chose **Add project → Open project**;
3. selected `/Users/lianglei/Code/bluejob/aa-baseline-fixture` in the native macOS folder dialog;
4. confirmed the project appeared in the sidebar;
5. opened **New Workspace**;
6. selected project `aa-baseline-fixture`, base branch `main`, workspace name `pi-baseline`, branch `aa/pi-baseline`, and builtin agent `Pi`;
7. submitted the read-only Pi prompt.

Superset created:

| Record | ID | Path / branch |
| --- | --- | --- |
| Project | `7acc361e-00d5-4152-8a51-3d69fb1b7edd` | `/Users/lianglei/Code/bluejob/aa-baseline-fixture` |
| Main workspace | `9acd692f-d0e6-451d-99e5-2b1f5f4fd2a0` | fixture root / `main` |
| Worktree workspace | `d5f28a2f-ab3f-44b6-9c6d-31d40be6df8b` | `~/.superset/worktrees/7acc361e-00d5-4152-8a51-3d69fb1b7edd/aa/pi-baseline` / `aa/pi-baseline` |

Worktree verification:

```sh
git -C /Users/lianglei/Code/bluejob/aa-baseline-fixture worktree list --porcelain
git -C /Users/lianglei/Code/bluejob/aa-baseline-fixture status --short
git -C /Users/lianglei/.superset/worktrees/7acc361e-00d5-4152-8a51-3d69fb1b7edd/aa/pi-baseline status --short
```

Both the main checkout and created worktree were clean at the end of verification.

## Pi and Lifecycle Verification

The New Workspace agent picker visibly listed `Pi` alongside the other builtin agents. This confirms the existing builtin registration path is active; no agent catalog code was changed.

Prompt sent through the existing Pi terminal-agent integration:

```text
Read README.md and report its first Markdown heading. Do not modify any files.
```

Pi used its TUI, read `README.md`, reported the heading `AA Baseline Fixture`, and explicitly reported that it modified no files. A Git status check confirmed the worktree remained clean.

The host database was inspected with:

```sh
sqlite3 -header -column \
  superset-dev-data/host/307a5720-39dc-4821-9fa0-fdf4aa2a86a7/host.db \
  'select * from terminal_agent_bindings; select * from terminal_sessions;'
```

Observed lifecycle evidence before the full app restart:

```text
terminal_id      776b49f3-2e19-4931-8fc1-8dd985de6f7e
workspace_id     d5f28a2f-ab3f-44b6-9c6d-31d40be6df8b
agent_id         pi
last_event_type  Stop
terminal status  active
```

During execution, Superset showed the active/working indicator. The Pi extension emitted `Start`, emitted progress through its `PostToolUse → Start` mapping, and finally persisted `Stop`; the UI returned to its non-working state when the turn completed. `terminal status=active` is expected because the interactive Pi process remains open after the turn stops.

## File, Diff and Worktree Verification

The workspace Files tab listed:

```text
.git
baseline.txt
README.md
```

To exercise change detection, `baseline.txt` was temporarily changed from:

```text
baseline
```

to:

```text
baseline
phase-0 diff verification
```

Superset updated the sidebar to `+1 −0`, showed `Changes (1)`, listed `baseline.txt +1`, and rendered the added line in the split diff view. The temporary line was then removed, and the UI returned to `0 files / No changes`. Both Git checkouts were clean afterward.

This verifies the existing Git/worktree backend, file browser, status watcher and diff viewer without changing any of them.

## Session Resume Verification

### Renderer reload: pass

Before reload, terminal `776b49f3-2e19-4931-8fc1-8dd985de6f7e` had:

```text
created_at        1786215339748
last_attached_at  1786215344923
```

After pressing **Command-R** in Superset:

- the same workspace route reopened;
- the same terminal ID reattached;
- the complete Pi prompt, tool output and final answer remained visible;
- `last_attached_at` advanced to `1786215449344`.

This proves the live daemon-backed terminal survives and reattaches across a renderer reload.

### Full Electron quit/restart: workspace pass, Pi conversation resume unavailable

After a full **Command-Q** and desktop relaunch:

- Superset reopened the same `v2-workspace` URL;
- the workspace, files and pane layout persisted;
- a terminal with the same pane terminal ID was cold-created;
- the prior Pi binding was first marked `ended_at` with `end_reason=terminal-exited`;
- the pane launched a fresh Pi TUI, whose `SessionStart` changed the binding back to `last_event_type=Attached` and cleared the ended fields;
- the earlier prompt and answer were not present in that fresh Pi TUI;
- `agent_session_id` remained `NULL`/empty.

The resume-candidate implementation requires a non-null `agent_session_id`. Therefore Superset cannot offer the existing `pi --session <id>` resume path for this session even though the builtin Pi definition contains `resumeCommand: "pi --session"`.

This is a real baseline limitation, not a Phase 0 fix. Resolving it would likely involve the Pi extension/session-identification path and possibly terminal-agent persistence behavior, all explicitly outside the allowed Phase 0 scope.

## Other Errors and Warnings

| Observation | Impact | Disposition |
| --- | --- | --- |
| Docker daemon was initially stopped. | Setup could not start local services. | Started Docker Desktop; resolved. |
| Caddy was initially missing. | Root `dev:caddy` task could not run. | Installed Caddy 2.11.4 with Homebrew; resolved. |
| Bun was 1.3.12 instead of pinned 1.3.14. | Reproducibility/version mismatch. | Upgraded Bun; resolved. |
| `db.localtest.me` resolved to `198.18.6.214`. | Dev seed reset its database connection. | Localhost `.env` override plus two-host detector; resolved. |
| Fixture has no `origin`. | Background base-ref fetch logs `origin does not appear to be a git repository`. | Expected for this deliberately local fixture; local Git features pass. |
| Git auto-filled author identity for the fixture commit. | Non-blocking warning only. | Fixture commit succeeded; no repository config was changed. |
| Renderer logs React warnings about `DockBadgeController` updates during `DashboardSidebarWorkspaceItem`/`DashboardSidebarWorkspaceChips` render. | No observed functional failure. | Recorded for later upstream triage; not changed in Phase 0. |
| New Workspace select logs controlled/uncontrolled warnings. | No observed functional failure. | Recorded; not changed in Phase 0. |
| Pi TUI reports a newer Pi version is available. | Current Pi 0.82.1 still launched and completed the task. | Not upgraded during baseline to avoid changing the tested agent unexpectedly. |
| Full app restart does not resume this Pi conversation. | Prior conversation cannot be automatically continued. | Recorded blocker/limitation; no prohibited lifecycle changes made. |

## Features Verified

| Requirement | Result | Evidence |
| --- | --- | --- |
| Dependencies install | Pass | Frozen Bun install completed with native modules and no lock changes. |
| Desktop starts | Pass | Electron, renderer, local DB, host service and PTY daemon started; local login succeeded. |
| Local Git project opens | Pass | `aa-baseline-fixture` imported through the native folder picker. |
| Workspace creates/opens | Pass | `pi-baseline` worktree workspace opened on `aa/pi-baseline`. |
| Pi is builtin | Pass | `Pi` visibly present in the New Workspace agent picker. |
| Pi launches | Pass | Pi TUI launched in the generated worktree and completed a read-only task. |
| Lifecycle visible | Pass | Working UI indicator plus persisted `agent_id=pi`, progress mapping and `last_event_type=Stop`. |
| Files | Pass | `.git`, `baseline.txt` and `README.md` visible in Files. |
| Diff/status | Pass | Temporary `baseline.txt` edit appeared as one unstaged file and `+1`, with rendered diff. |
| Worktree | Pass | `git worktree list` showed main plus the Superset-created `aa/pi-baseline` worktree. |
| Live-session reattach | Pass | Command-R restored the same terminal/output and advanced `last_attached_at`. |
| Full app Pi resume | Limited | Layout/terminal pane restored, but Pi conversation lacked the required persisted session ID. |

## Blockers

There are no blockers to running Superset locally or to beginning the renderer-only Phase 1 PoC after this baseline is reviewed.

Known product limitation for Phase 1 planning:

- full Electron restart does not resume the tested Pi conversation because `terminal_agent_bindings.agent_session_id` is empty. Phase 1 should not attempt to solve this. Keep the existing terminal path and treat app-restart Pi resume as unavailable until a separate, explicitly scoped integration task is approved.

The fixture's missing Git remote is not a product blocker; it was intentional so that local-project behavior could be verified independently of GitHub/network access.

## Files Changed in Phase 0

Tracked source/documentation:

```text
packages/db/src/local-proxy.ts
docs/aa/BASELINE.md
```

Local/generated state not intended for commit:

```text
.env
node_modules/
superset-dev-data/
/Users/lianglei/Code/bluejob/aa-baseline-fixture/
/Users/lianglei/.superset/worktrees/7acc361e-00d5-4152-8a51-3d69fb1b7edd/
```

`bun.lock` was restored to its repository state and is not part of the Phase 0 change.

## Exact Files Likely to Be Touched in Phase 1

High-confidence existing renderer entry points:

```text
apps/desktop/src/renderer/globals.css
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/page.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/V2PresetsBar/V2PresetsBar.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/WorkspaceSidebar/WorkspaceSidebar.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarProjectSection/components/DashboardSidebarProjectRow/DashboardSidebarProjectRow.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarWorkspaceIcon/DashboardSidebarWorkspaceIcon.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/DashboardSidebar/components/DashboardSidebarWorkspaceItem/components/DashboardSidebarExpandedWorkspaceRow/components/DashboardSidebarWorkspaceChips/components/DashboardSidebarAgentsChip/components/DashboardSidebarAgentAvatar/DashboardSidebarAgentAvatar.tsx
```

Likely renderer-local additions for the PoC, subject to the Phase 1 design review:

```text
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/AAPixelWorker/AAPixelWorker.tsx
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/AAPixelWorker/index.ts
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/AAPixelWorker/deriveAAWorkerState.ts
apps/desktop/src/renderer/routes/_authenticated/_dashboard/v2-workspace/$workspaceId/components/AAPixelWorker/deriveAAWorkerState.test.ts
```

Existing lifecycle sources should be consumed, not redesigned:

```text
apps/desktop/src/renderer/hooks/host-service/useTerminalAgentBindings/useTerminalAgentBindings.ts
apps/desktop/src/renderer/hooks/host-service/useTerminalAgentStatuses/deriveTerminalAgentStatus.ts
apps/desktop/src/renderer/hooks/host-service/useTerminalAgentStatuses/useTerminalAgentStatuses.ts
```

Files and areas that should remain untouched in Phase 1:

```text
packages/pty-daemon/
packages/host-service/src/terminal/
packages/host-service/src/terminal-agents/
packages/host-service/src/daemon/
apps/desktop/src/main/lib/agent-setup/agent-wrappers-pi.ts
apps/desktop/src/main/lib/agent-setup/templates/pi-extension.template.ts
apps/desktop/src/renderer/lib/agent-session-orchestrator/
```

The last path remains a future adapter boundary, but Phase 1 does not need to change it while retaining the existing Pi TUI.

## Final Validation

Commands run after the source fix and cleanup:

```sh
bun install --frozen-lockfile
bun run --cwd packages/db typecheck
git diff --check
git status --short
```

Expected tracked status at completion:

```text
 M packages/db/src/local-proxy.ts
?? docs/aa/BASELINE.md
```
