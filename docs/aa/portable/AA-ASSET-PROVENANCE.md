# AA Portable Asset Provenance Audit

Audit baseline: Superset commit `4cfff9261e2cbdb4f9d3f653312f80482657b0f1` on branch `aa-spike`. The DSH checkout is an architectural reference only and contributes no copied asset or code.

This audit is the Phase 5A boundary, not an independent license grant. The source repository is governed by Elastic License 2.0. No standalone package license is declared for `docs/aa/portable/`; distribution or relicensing requires a later owner/legal decision.

## Result

| Classification | Records | Portable-entry rule |
| --- | ---: | --- |
| AA-original | 23 | Concepts may be consolidated; the two original reference sheets are split through clean-room redraws with attribution retained. |
| Superset-adapted | 114 | Existing code and CSS do not enter an independent package. Only behavior/visual observations inform newly authored contracts and assets. |
| third-party | 0 | No third-party source file is copied into the portable tree. Dependencies named below remain dependencies, not source assets. |
| unknown | 0 | No unresolved source item entered the portable tree. A future unknown item must fail the provenance gate. |
| **Total** | **137** | Every in-scope record is assigned below. |

## Inventory profile definitions

Every ledger item references one profile. The profile supplies all required fields: purpose, current dependency surface, visual portability, code portability, clean-room work, attribution/license notes, and proposed portable destination.

| Profile | Category | Purpose | Current dependency surface | Visually portable? | Code-portable? | Required clean-room work | Attribution / license | Proposed destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A-REF-ICON` | AA-original | Original AA icon reference sheet | Standalone SVG; embedded labels; no network | Yes, as AA visual source | No direct package entry in this phase | Redraw each glyph as text-free individual integer-grid SVG; do not copy Superset icon components | Introduced by Jiqize in `831d5196bbc18674f40df85c02d55af3db5a13c7`; source repo ELv2; independent license pending | `icons/*.svg` |
| `A-REF-WORKER` | AA-original | Original worker/state/hair reference sheet | Standalone SVG; embedded labels; no network | Yes, as AA visual source | No direct package entry in this phase | Redraw into composable anatomy/persona/hair/state/prop sheets | Introduced by Jiqize in `f49a495f2374a3615a0e807b7de5289ca61f698d`; source repo ELv2; independent license pending | `workers/*.svg` |
| `A-DATA` | AA-original | Early design token and source-asset metadata | JSON tied to earlier AA vocabulary and sheets | Partly | Not as normative v0.1 data | Reconcile against mature Phase 4C CSS, rename by semantic role, add explicit platform maps | AA project authors; source repo ELv2; independent license pending | `tokens/*.json`, `asset-manifest.json` |
| `A-DOC` | AA-original | Phase 1–4C visual intent, decisions, checkpoints, and audit evidence | Markdown; some Superset/runtime assumptions | Yes, selectively | Not applicable | Consolidate mature rules; remove obsolete phase wording and host assumptions; keep factual attribution | AA project authors; source repo ELv2; independent license pending | Portable design system, semantic model, component contracts |
| `S-CSS` | Superset-adapted | Current production AA styling and token realization | Superset AA DOM selectors, global theme variables, current component structure | Concepts and measured values only | **No** | Re-author scoped, framework-neutral gallery CSS and semantic tokens; copy no selectors or rule blocks | Multiple AA commits by repository contributors; source repo ELv2 | Tokens and gallery CSS as clean-room implementations |
| `S-VIEW` | Superset-adapted | React views, pixel renderers, objects, controls, and shell composition | React plus combinations of `@superset/*`, router/query/db/runtime/terminal host services and AA CSS selectors | Component/object concepts only | **No** | Write framework-neutral contracts and original SVG redraws; never transplant JSX or imports | Source repo contributors; source repo ELv2 | Component contracts, SVG library, gallery examples |
| `S-PRESENTATION` | Superset-adapted | Presentation projections, labels, persona selection, accessibility helpers | TypeScript and current host/domain types; some modules are pure but belong to Superset implementation | Semantic rules selectively | **No** for independent package | Restate invariants as host-neutral semantic contracts and fixtures | Source repo contributors; source repo ELv2 | Semantic model and component contracts |
| `S-HOST` | Superset-adapted | Runtime snapshots, task projections, archive intent, launch/new-task flow, hooks | Superset DB/services, Pi bridge, tRPC/TanStack/React state and host lifecycle | No implementation; state meanings inform contracts | **No** | Keep out of portable UI; document authoritative-input boundary only | Source repo contributors; source repo ELv2 | Semantic model references; no runtime asset destination |
| `S-TEST` | Superset-adapted | Regression tests for existing AA product code and CSS | Bun test, React testing tools, Superset aliases, existing DOM/selectors | Expected behavior selectively | **No** | Create a new host-free asset/dependency/accessibility audit | Source repo contributors; source repo ELv2 | `scripts/aa/verify-aa-portable.mjs` only as newly authored verification |
| `S-BARREL` | Superset-adapted | Host module export surfaces | TypeScript module graph and Superset directory structure | No | **No** | None; do not reproduce host barrels in the static kit | Source repo contributors; source repo ELv2 | None |

## AA-original ledger (23 records)

| Path | Profile |
| --- | --- |
| `docs/aa/design/aa-office-icon-sheet.svg` | `A-REF-ICON` |
| `docs/aa/design/aa-agent-state-sheet.svg` | `A-REF-WORKER` |
| `docs/aa/design/assets-manifest.json` | `A-DATA` |
| `docs/aa/design/tokens.json` | `A-DATA` |
| `docs/aa/AA-ACTIVE-TASKS-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-AGENT-EXPERIENCE-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-AGENT-WORKSPACE-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-ARCHIVE-INTENT-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-DAILY-WORKFLOW-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-NEW-TASK-FLOW-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-OFFICE-DESIGN-SYSTEM.md` | `A-DOC` |
| `docs/aa/AA-OFFICE-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-OFFICE-V0.1-RC-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-OFFICE-V0.2-RC-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-OFFICE-V0.2-VISUAL-REFINEMENT-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-PI-RUNTIME-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-RUNTIME-FOUNDATION-V0.1-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-V0.2-SHELL-EMPLOYEE-CHECKPOINT.md` | `A-DOC` |
| `docs/aa/AA-V0.2-VISUAL-DECISION-LOG.md` | `A-DOC` |
| `docs/aa/AA-V0.2-VISUAL-IA-AUDIT.md` | `A-DOC` |
| `docs/aa/PHASE-4C-AA-V0.2-VISUAL-REFINEMENT-REPORT.md` | `A-DOC` |
| `docs/aa/PHASE-4C-AA-V0.2-VISUAL-REFINEMENT.md` | `A-DOC` |
| `docs/aa/v0.2/phase-4c/VISUAL-PUNCH-LIST.md` | `A-DOC` |

## Superset-adapted ledger (114 records)

Base path for every entry in this section:

`apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice/`

### `S-CSS` (1)

```text
aa-office.css
```

### `S-TEST` (31)

```text
AAActiveTasks/AAActiveTasksSection.test.tsx
AAActiveTasks/aaActiveTaskProjection.test.ts
AAActiveWorkerCard/aaActiveWorkerPresentation.test.ts
AAAgentStatus/aaAgentState.test.ts
AAAgentStatus/aaRuntimeHealth.test.ts
AAAgentStatus/useAARuntimeSnapshots.test.ts
AAApplicationPage/AAApplicationPage.test.tsx
AAApplicationPage/aaApplicationPagePresentation.test.ts
AAApplicationShell/aaApplicationShellPresentation.test.ts
AAAssignmentLabel/aaAssignmentPresentation.test.ts
AAEmployeeAvatar/aaEmployeePersonas.test.ts
AAEmployeeProfile/AAEmployeeProfileCard.test.tsx
AAEmployeeProfile/aaEmployeeProfilePresentation.test.ts
AAEmployeeRosterOverflow/aaEmployeeRosterOverflow.test.ts
AAFileCabinetHeader/AAFileCabinetHeader.test.tsx
AAFileCabinetHeader/aaFileCabinetPresentation.test.ts
AAHairState/AAHairState.test.tsx
AAHandoff/aaHandoffPresentation.test.ts
AANewTask/aaNewTaskFlowStore.test.ts
AANewTask/aaNewTaskPresentation.test.ts
AANewTask/aaNewTaskRuntime.test.ts
AAPiEmployee/AAPiEmployeeRosterItem.test.tsx
AAPiEmployee/aaPiEmployeeLaunch.test.ts
AAPiEmployee/aaPiEmployeePresentation.test.ts
AAReasoningIndicator/aaReasoningPresentation.test.ts
AAResumeSessionAction/aaResumeSessionPresentation.test.ts
AATaskFolder/AATaskFolderArchiveAction.test.tsx
AATaskFolder/AATaskFolderContextCard.test.tsx
AATaskFolder/aaTaskFolderPresentation.test.ts
aaDailyWorkflowFocus.test.ts
aaOfficeCssContract.test.ts
```

### `S-BARREL` (26)

```text
AAActiveTasks/index.ts
AAActiveWorkerCard/index.ts
AAAgentAvatar/index.ts
AAAgentStatus/index.ts
AAApplicationPage/index.ts
AAApplicationShell/index.ts
AAAssignmentLabel/index.ts
AABottomStatusBar/index.ts
AAEmployeeAvatar/index.ts
AAEmployeeProfile/index.ts
AAEmployeeRosterOverflow/index.ts
AAFileCabinetHeader/index.ts
AAHairState/index.ts
AAHandoff/index.ts
AAIcon/index.ts
AANavigationRail/index.ts
AANewTask/index.ts
AAPiEmployee/index.ts
AAReasoningIndicator/index.ts
AAResumeSessionAction/index.ts
AAStatusLight/index.ts
AATaskFolder/index.ts
AATerminalFrame/index.ts
AAWindowFrame/index.ts
AAWorkspaceHeader/index.ts
index.ts
```

### `S-VIEW` (30)

```text
AAActiveTasks/AAActiveTasksProjectShell.tsx
AAActiveTasks/AAActiveTasksSection.tsx
AAActiveWorkerCard/AAActiveWorkerCard.tsx
AAAgentAvatar/AAAgentAvatar.tsx
AAAgentStatus/AAAgentStatus.tsx
AAApplicationPage/AAApplicationPage.tsx
AAApplicationShell/AAApplicationShell.tsx
AAAssignmentLabel/AAAssignmentLabel.tsx
AABottomStatusBar/AABottomStatusBar.tsx
AAEmployeeAvatar/AAEmployeeAvatar.tsx
AAEmployeeProfile/AAEmployeeProfile.tsx
AAEmployeeProfile/AAEmployeeProfileCard.tsx
AAEmployeeRosterOverflow/AAEmployeeRosterOverflow.tsx
AAFileCabinetHeader/AAFileCabinetHeader.tsx
AAHairState/AAHairState.tsx
AAIcon/AAIcon.tsx
AANavigationRail/AANavigationRail.tsx
AANewTask/AANewTaskBranchPicker.tsx
AANewTask/AANewTaskDialog.tsx
AANewTask/AANewTaskProgress.tsx
AANewTask/AANewTaskWorkspaceGate.tsx
AAPiEmployee/AAPiEmployeeRosterItem.tsx
AAReasoningIndicator/AAReasoningIndicator.tsx
AAStatusLight/AAStatusLight.tsx
AATaskFolder/AATaskFolder.tsx
AATaskFolder/AATaskFolderArchiveAction.tsx
AATaskFolder/AATaskFolderContextCard.tsx
AATerminalFrame/AATerminalFrame.tsx
AAWindowFrame/AAWindowFrame.tsx
AAWorkspaceHeader/AAWorkspaceHeader.tsx
```

### `S-HOST` (10)

```text
AAActiveTasks/aaActiveTaskProjection.ts
AAActiveTasks/useAAActiveTasksProjection.ts
AAActiveTasks/useAAWorkspaceArchiveIntent.ts
AAAgentStatus/aaRuntimeHealth.ts
AAAgentStatus/useAARuntimeSnapshots.ts
AANewTask/aaNewTaskFlow.ts
AANewTask/aaNewTaskFlowStore.ts
AANewTask/aaNewTaskRuntime.ts
AAPiEmployee/aaPiEmployeeLaunch.ts
aaDailyWorkflowFocus.ts
```

### `S-PRESENTATION` (16)

```text
AAActiveWorkerCard/aaActiveWorkerPresentation.ts
AAAgentStatus/aaAgentState.ts
AAApplicationPage/aaApplicationPagePresentation.ts
AAApplicationShell/aaApplicationShellPresentation.ts
AAAssignmentLabel/aaAssignmentPresentation.ts
AAEmployeeAvatar/aaEmployeePersonas.ts
AAEmployeeProfile/aaEmployeeProfilePresentation.ts
AAEmployeeRosterOverflow/aaEmployeeRosterOverflowPresentation.ts
AAFileCabinetHeader/aaFileCabinetAccessibility.ts
AAFileCabinetHeader/aaFileCabinetPresentation.ts
AAHandoff/aaHandoffPresentation.ts
AANewTask/aaNewTaskPresentation.ts
AAPiEmployee/aaPiEmployeePresentation.ts
AAReasoningIndicator/aaReasoningPresentation.ts
AAResumeSessionAction/aaResumeSessionPresentation.ts
AATaskFolder/aaTaskFolderPresentation.ts
```

## Third-party dependency surface

The inventoried implementation references third-party or host packages including React, Bun test, TanStack Router/Query/DB, Zustand, xterm, and `@superset/*` UI/runtime modules. These are dependency names only; their source, icons, styles, and logos were not copied. The portable gallery uses only browser-native HTML, CSS, JavaScript, and local AA-authored SVG files.

The pinned DSH repository is MIT-licensed upstream, but Phase 5A consumes it only as read-only research. No DSH source, CSS, official logo, wordmark, or bundled asset appears in `docs/aa/portable/`.

## Clean-room extraction record

| Portable output | Inputs consulted | Clean-room action | Direct code copied? |
| --- | --- | --- | --- |
| Core/semantic tokens | Mature AA CSS values, design tokens, Phase 4C decisions | Re-authored normalized JSON and product-role names | No CSS rules or selectors |
| Individual icons | Original AA icon sheet and object semantics | New integer-grid SVG paths, new metadata, no font/text dependency | No `AAIcon.tsx` code and no Superset icon |
| Worker sheets | Original AA state sheet plus current semantic rules | New modular five-sheet geometry with named layers | No React avatar component code |
| Design/semantic/component docs | Phase documents and current behavior | Consolidated framework-neutral contracts | No implementation code |
| Gallery | Portable contracts and new local assets | New static HTML/CSS/JS | No Superset or DSH imports/selectors |
| DSH mapping | Pinned DSH documented/public source inspection | Documentation and verified token/slot names only | No DSH source or official branding |

## Future package gate

Before publishing an independent package:

1. confirm ownership and a license compatible with intended distribution;
2. preserve this provenance table and source commit pins;
3. keep every `Superset-adapted`, `third-party`, or future `unknown` source out unless separately reviewed and attributed;
4. repeat manifest, dependency, SVG, mapping, and sensitive-information audits;
5. review branding separately—“AA Office for DSH” and “built on DeepSeek Harness” are descriptive; official DeepSeek marks remain excluded.
