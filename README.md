# Deployment Environment: Institutional Portfolio

This repository (`portfolio_deploy`) acts as the strict production environment and GitHub Pages host for the `htleffew.github.io/portfolio_deploy/` domain.

## Live Domain
**[https://htleffew.github.io/portfolio_deploy/](https://htleffew.github.io/portfolio_deploy/)**

## CSS Architecture

```
design_system/
├── tokens.css                    ← SINGLE SOURCE OF TRUTH for all design variables
│                                    Colors, fonts, spacing, motion, borders, shadows
│                                    Every CSS file @imports from here
│
├── assets/css/
│   └── institutional.css         ← @import url('../../tokens.css')
│                                    Case study components: .band, .col-wide, tables,
│                                    sidenotes, sandboxes, spine nav, reading typography
│
└── css/
    └── global_chrome.css         ← @import url('../tokens.css')
                                     App shell: #topnav, footer, preloader, grain,
                                     search modal, Lenis, scroll-cue, tilt effects
```

**Every HTML page needs exactly ONE stylesheet link:** `institutional.css`. Tokens cascade automatically through the `@import` chain. Google Fonts also load through `tokens.css` — no separate `<link>` tag required.

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
