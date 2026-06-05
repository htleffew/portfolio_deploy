# Deployment Environment: Institutional Portfolio

This repository (`portfolio_deploy`) acts as the strict production environment and GitHub Pages host for the `htleffew.github.io/portfolio_deploy/` domain.

## Live Domain
**[https://htleffew.github.io/portfolio_deploy/](https://htleffew.github.io/portfolio_deploy/)**

## Deployed Architecture (current ground truth)

Every HTML page in this repository links exactly two files from `design_system/`:

```
design_system/
├── tokens.css                    ← Design tokens (colors, fonts, spacing, motion).
│                                    @imported from global.css; do not link directly.
├── css/
│   └── global.css                ← Single deployed stylesheet (linked by every page).
│                                    Contains every component rule, band system,
│                                    typography, preloader, search overlay, etc.
└── js/
    └── global.js                 ← Single deployed runtime. Hosts:
                                     • Cinematic WebGL engine (Three.js starfield + nodes)
                                     • Global chrome injector (topnav, footer, search, grain)
                                     • Lenis smooth scroll bootstrap
                                     • GSAP hero reveal cascade + ScrollTriggers
                                     • SPA router (WebGL shader transitions between pages)
                                     • Related-works engine
                                     • 3D tilt parallax (delegated)
```

**Every HTML page needs exactly two links:**

```html
<link rel="stylesheet" href="design_system/css/global.css">
<script src="design_system/js/global.js" defer></script>
```

GSAP, ScrollTrigger, Lenis, SplitType, simplex-noise, and HyperShader are loaded on demand by `global.js` itself; pages may add them as `<script defer>` tags but are not required to. Google Fonts load via `@import` inside `tokens.css`, which is `@import`ed by `global.css`; no separate `<link>` tag required.

## Planned (not yet deployed) refactor

The directories `design_system/assets/css/` and `design_system/assets/js/institutional.js` reflect a planned migration to a thinner `institutional.css` / `institutional.js` split. That refactor was scoped but never deployed: the `institutional.css` file does not exist on disk, and no page in the repository links `institutional.js`. The README previously documented the planned state as if it were current; this section now reconciles the two. Reactivate the refactor only by building `institutional.css` from scratch and migrating every page link in one batch.

## Adding a New Case Study

### Quick Start (paste this into Antigravity)
```
/html_translation
```

### Manual Process
1. Run `/content_synthesis` on source files → produces `[ProjectName]_enriched_article.txt`
2. Run `/html_translation` → copies `design_system/ui_kits/case-study/template.html`, fills content, builds SVGs + interactives
3. Paste the deployment audit prompt from `deployment-prompt.txt` → 4-phase conformity check
4. Run `node sync_index.js` → registers in `projects_index.json`, regenerates Related Works
5. `git add . && git commit && git push` → live on GitHub Pages

### What NOT to do
- ❌ Add inline `:root` token declarations (tokens come from `tokens.css`)
- ❌ Add a Google Fonts `<link>` tag (fonts load through `tokens.css`)
- ❌ Hardcode hex colors in SVG diagrams (use `var(--phthalo)`, `var(--alizarin)`, etc.)
- ❌ Add inline `<style>` for standard components (use `institutional.css` classes)
- ✅ Inline `<style>` is fine for page-specific interactive widgets (sliders, sandboxes, live charts)

## Key Files

| File | Purpose |
|------|---------|
| `tokens.css` | Single source of truth for all design variables |
| `institutional.css` | Case study component styles |
| `global_chrome.css` | App shell (nav, footer, search, grain) |
| `global_chrome.js` | Runtime nav/footer/search injector |
| `institutional.js` | Spine, sidenotes, reveals, Related Works engine |
| `cinematic_engine_v3.js` | Three.js particle network + deep-space starfield |
| `library_dashboard.js` | Projects repository filterable dashboard |
| `sync_index.js` | Regenerates site index from `projects_index.json` |
| `deployment-prompt.txt` | 4-phase conformity audit prompt |
| `template.html` | Canonical case study HTML skeleton |
| `projects_index.json` | Master registry of all case studies |

## Architectural Rules
1. **Tokens are centralized.** All design variables live in `tokens.css`. Never re-declare them anywhere else.
2. **Global Chrome is injected.** Navigation, footers, search overlays, and film grain are dynamically injected by `global_chrome.js`.
3. **Automated Index.** Run `node sync_index.js` after adding a new case study to regenerate the Research Library and Related Works grids.
