# Deployment Environment: Institutional Portfolio

This repository (`portfolio_deploy`) acts as the strict production environment and GitHub Pages host for the `htleffew.github.io/portfolio_deploy/` domain.

## Live Domain
**[https://htleffew.github.io/portfolio_deploy/](https://htleffew.github.io/portfolio_deploy/)**

## Deployed Architecture

```
design_system/
├── tokens.css                          ← Design tokens (colors, fonts, spacing, motion).
│                                         @imported by institutional.css + global_chrome.css;
│                                         do not link directly.
├── css/
│   └── global_chrome.css               ← App shell stylesheet. @imports tokens.css. Defines
│                                         #topnav, #progress, .site-foot, #search-overlay,
│                                         #grain film grain, #preloader, #glCanvas, .scroll-cue,
│                                         .ambient, .atmosphere fixed-position chrome.
├── assets/
│   └── css/
│       └── institutional.css           ← Single stylesheet linked by every page.
│                                         @imports tokens.css and global_chrome.css.
│                                         Defines .band mode system, .col-wide grid, .reveal
│                                         scroll transitions, .figure, .data-table, .sn
│                                         sidenotes, .has-dropcap, plus page-specific extracts
│                                         kept for widget compatibility.
└── js/
    ├── cinematic_engine_v3.js          ← Three.js starfield + interactive node network behind
    │                                     every page. Self-bootstrapping: injects #glCanvas,
    │                                     dynamically loads three.min.js if needed.
    ├── global_chrome.js                ← App shell injector + SPA router. Injects topnav,
    │                                     footer, search overlay, film grain. Owns the
    │                                     HyperShader WebGL page-transition router. Provides
    │                                     scoped window.onReady / window.onLoad helpers and
    │                                     the 3D tilt parallax via event delegation.
    └── institutional.js                ← Reveal orchestration + reading engine. Lenis smooth
                                          scroll, GSAP hero reveal cascade, ScrollTrigger band
                                          reveals, scroll-progress bar, nav-mode toggle, spine
                                          row generation, sidenotes Tufte layout.
```

**Every HTML page needs exactly one stylesheet link and three script tags (in this order):**

```html
<link rel="stylesheet" href="design_system/assets/css/institutional.css">
<script src="design_system/js/cinematic_engine_v3.js" defer></script>
<script src="design_system/js/global_chrome.js" defer></script>
<script src="design_system/js/institutional.js" defer></script>
```

Case-study pages prefix every path with `../`. Tokens cascade automatically through the `@import` chain inside `institutional.css`; Google Fonts load via that chain too — no separate `<link>` tag required. GSAP, ScrollTrigger, Lenis, SplitType, simplex-noise, and HyperShader are loaded on demand by `institutional.js` and `global_chrome.js`; pages may add them as `<script defer>` tags but are not required to.

## History

`design_system/css/global.css` and `design_system/js/global.js` were the pre-split single-file predecessors of the current architecture. They were removed on 2026-06-05 after the split files had been verified live on `drheatherleffew.com` on both index and case-study pages. The legacy documents under `design_system/docs/components/` (`global-js-contract.md`, `global-nav.md`) carry historical-status banners and remain as a record of the unified-file design.

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
