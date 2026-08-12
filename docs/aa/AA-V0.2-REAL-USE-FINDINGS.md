# AA v0.2 Phase 4A real-use findings

## Resolution of the triggering findings

| Finding | Real-use cause | Phase 4A result |
| --- | --- | --- |
| Pi missing from Employee Roster | The old Roster projected user terminal presets, while New Task selected Pi from real Host agent configs. A valid Pi config therefore did not guarantee a visible Roster row. | Resolved. One fixed first Pi Employee now shares the real Host-config selector with New Task; missing config remains visible as setup required. |
| AA identity stopped at Work Folder | AA rail/CSS activation was owned by the V2 Work Folder match in the dashboard layout, and Settings lives under a sibling layout. | Resolved. One route-aware outer shell now covers the required V2 dashboard and Settings families; mature page bodies remain intact. |

## Findings retained from real acceptance

| ID | Classification | Observation | Decision |
| --- | --- | --- | --- |
| RF-01 | Accepted platform debt | The existing dashboard query-cache subscription can emit the already recorded `DockBadgeController` render-time React warning when sidebar rows mount. | Retain `PLT-01`; no AA-owned uncaught error and no Phase 4A infrastructure change. |
| RF-02 | Accepted platform debt | The mature Advanced Workspace form can emit controlled/uncontrolled Select warnings during direct route/reload development QA. | Record only. The form remains functional and Phase 4A does not rewrite its business controls. |
| RF-03 | Accepted product boundary | Page bodies such as Settings and Tasks still carry mature Superset component language inside the AA frame. | Intentional B5 compromise: coherent outer product shell, not a full page redesign. Review visually before authorizing any narrower refinement. |
| RF-04 | Accepted runtime boundary | Missing Pi config provides truthful setup-required state but does not guess whether binary, extension, or config is absent. | Correct fail-closed behavior until authoritative diagnostics exist through an approved contract. |
| RF-05 | Accepted compatibility boundary | Codex and other Tier 2 employees still launch real terminals but remain `UNTRACKED`. | Preserve v0.1 Runtime Contract; no authority inference. |

## Usability observations

- Pi reads immediately as the primary employee because it is fixed before the
  reorderable compatibility list and has a compact `PRIMARY` label.
- The same Roster tile remains present during setup failure, so the product
  model does not disappear when a machine is not configured yet.
- The global rail makes route location predictable. Disabling Files outside a
  Work Folder prevents the most likely context error without adding new state.
- The AA Briefcase remains useful at 1440×800 in both expanded and collapsed
  modes; the real terminal stays the dominant surface.
- Settings preserves its information architecture, which is safer but also the
  strongest remaining visual reminder of Superset underneath.

## Recommended next decision

Review the Phase 4A screenshots and use the branch for ordinary Pi-first work
before authorizing another phase. If a follow-up is warranted, scope it from
observed daily friction on the now-stable global shell; do not reopen Runtime,
PTY, Git/worktree, task persistence, or exact-resume contracts without a new
verified blocker and brief.
