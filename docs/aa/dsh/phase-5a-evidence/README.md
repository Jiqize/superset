# Phase 5A Safe Evidence

Evidence was produced on the original development Mac from Superset commit `4cfff9261e2cbdb4f9d3f653312f80482657b0f1` plus the uncommitted Phase 5A deliverables. DeepSeek Harness was inspected at detached, clean commit `141eb6fef83422698aef7a981029e843e8161534` and was not modified.

## Screenshots

| File | CSS viewport | Content boundary |
| --- | --- | --- |
| `aa-portable-gallery-1440x800.png` | 1440 × 800 | Static AA gallery opening specimen |
| `aa-portable-gallery-1920x976.png` | 1920 × 976 | Static AA gallery opening specimen |

Both screenshots contain only invented labels explicitly marked `STATIC GALLERY · DEMO DATA`. They contain no credential, network response, personal path, user email, production identifier, official DeepSeek logo/wordmark, or DSH runtime screen.

SHA-256:

```text
590c1fd322379c7ed32a8f28a8680757ae80e2d75ebd4a9ddc937c1b9e458323  aa-portable-gallery-1440x800.png
bfac8c58787372ee89f50c930377d727964a0709ce348e3fb1f3017ac2963951  aa-portable-gallery-1920x976.png
```

## Browser verification

The build-free gallery was served from its portable root over loopback only for browser automation. Its HTML, CSS, JavaScript, icons, and worker sheets are all local files; the automated dependency audit separately rejects remote resources and module imports, preserving direct-file use.

Verified in Chromium through the Playwright CLI:

- page title loaded and console reported 0 errors / 0 warnings;
- 108 images loaded with 0 broken images;
- horizontal overflow was 0 px at 1440 × 800;
- 27 buttons, 22 headings, one `main`, two navigation landmarks, and two polite live regions were present;
- duplicate ids: 0;
- unnamed buttons: 0;
- images missing `alt`: 0;
- unlabeled input/textarea fields: 0;
- motion toggle changed `aria-pressed` and `data-aa-motion` to reduced mode;
- Events tab selection exposed its associated panel;
- Working state selection updated visible/live state text and the activity class;
- demo approval decision updated resolution text and disabled both outcome controls.

The images were captured with CSS-pixel screenshots after a fresh reload so the default, unresolved demo state appears consistently.

## Machine-readable/static verification

`node scripts/aa/verify-aa-portable.mjs` validates JSON, XML with `xmllint`, manifest coverage, unique ids, supported sizes, semantic mapping coverage, the pinned DSH alias allowlist, forbidden dependencies/assets/network resources, gallery accessibility markers, reduced motion, local resources, provenance completeness, frozen-area scope, and a sensitive-information pattern scan.

The audit result at evidence capture was:

```text
AA portable audit passed
checks=1332
json=6
svg=24
assets=24
semanticTokens=21
sourceInventory=137
```

## DSH verification boundary

The read-only DSH checkout had no installed `node_modules`, so its build/typecheck/test commands were not run. The local Node and pnpm versions meet the pinned repository's declared engine/package-manager ranges. Phase 5A evidence relies on source inspection and does not present a production DSH port.
