# Design System Changelog

## Week 4 — Ambient, Cinematic, Tokens & Gallery (May 2026)

### New Files
- `components/ambient/three-particle-network.md` — Full documentation of the Three.js WebGL engine: three rendering layers, physics system (drift, mouse repulsion, damping, boundary reflection), connection filament logic, camera parallax, color mapping, self-bootstrapping, failure modes
- `components/ambient/film-grain-overlay.md` — SVG feTurbulence noise overlay, steps(1) animation rationale, opacity 0.022 threshold, z-index context
- `components/ambient/scroll-cue-drip.md` — CSS drip animation, GSAP fade-in/fade-out lifecycle, required HTML placement
- `components/ambient/reading-progress-bar.md` — CSS custom property --p pattern, passive scroll listener, transition tuning
- `components/cinematic/sticky-stack-narrative.md` — 2-column sticky layout, top: 80px nav offset, integration with GSAP
- `components/cinematic/scroll-svg-draw.md` — stroke-dashoffset animation, getTotalLength() usage, stagger config
- `components/cinematic/curtain-reveal.md` — Split curtain panels, conflict note re: global.js preloader IDs, ScrollTrigger once flag
- `components/cinematic/sticky-cards.md` — Card stacking via scroll, .r-card styling, 3D tilt integration
- `components/cinematic/text-mask-reveal.md` — background-clip:text fill animation, H2-only restriction, paper/dark variants
- `components/cinematic/odometer-counter.md` — Counter on .byline scroll entry, data-* HTML API, GSAP interpolation
- `components/cinematic/typewriter.md` — Character-by-character reveal, code block target, conflict note re: SplitType
- `components/cinematic/mesh-gradient.md` — Paper-band-only atmospheric gradient, palette constraints, ::before animation
- `tokens/typography.md` — All font families, size scale, weight usage, letter-spacing conventions, line-height, italic usage, loading strategy
- `tokens/spacing.md` — Full spacing scale, column widths, band padding, nav height, card padding, code block padding, 48px margin convention
- `gallery/DESIGN.html` — Self-contained visual browser of all 44 components: sidebar nav, search filter, live Plotly mini-charts, SVG previews, scroll-animated demos, reading progress bar, film grain overlay

---

## Week 3 — Complete Pages (May 2026)

### New Files
**Interactive (4):**
- `components/interactive/dual-slider-calculator.md`
- `components/interactive/patient-profile-explorer.md`
- `components/interactive/sortable-ranking-table.md`
- `components/interactive/infinite-carousel.md`

**Layout (6):**
- `components/layout/numbered-section-header.md`
- `components/layout/hero-stat-trio.md`
- `components/layout/expand-collapse-section.md`
- `components/layout/resume-experience-card.md`
- `components/layout/competency-tag-block.md`
- `components/layout/formula-display-block.md`

**Chrome (5):**
- `components/chrome/global-nav.md`
- `components/chrome/site-footer.md`
- `components/chrome/search-overlay.md`
- `components/chrome/chapter-spine.md`
- `components/chrome/next-article-block.md`

**Data Display (4):**
- `components/data-display/schema-preview-table.md`
- `components/data-display/simulation-parameter-table.md`
- `components/data-display/clinical-report-card.md`
- `components/data-display/svg-abstract-thumbnail.md`

---

## Week 2 — Visualizations (May 2026)

### New Files
**Charts (4):**
- `components/charts/plotly-roc-curve.md`
- `components/charts/plotly-pr-curve.md`
- `components/charts/plotly-3d-surface.md`
- `components/charts/plotly-shap-beeswarm.md`

**Diagrams (3):**
- `components/diagrams/svg-hierarchy-tree.md`
- `components/diagrams/svg-temporal-sequence.md`
- `components/diagrams/svg-roc-with-annotation.md`

**Source Snippets (7):**
- `source-snippets/dual-slider-calculator.html`
- `source-snippets/svg-hierarchy-tree.html`
- `source-snippets/svg-temporal-sequence.html`
- `source-snippets/svg-roc-annotation.html`
- `source-snippets/plotly-shap-beeswarm.html`
- `source-snippets/patient-profile-explorer.html`
- `source-snippets/sortable-ranking-table.html`

---

## Week 1 — Foundation (May 2026)

### New Files
- `DESIGN.md` — Master index: visual grammar, component index table (51 entries), global.js auto-injection summary, visualization decision tree
- `AGENT_INSTRUCTIONS.md` — Operational guide: 5-step workflow, new article checklist, visualization decision tree (imperative), 15-point component checklist, critical gotchas, file naming conventions
- `components/system/global-js-contract.md` — Complete documentation of all three engines in global.js: WebGL cinematic, chrome injector, GSAP orchestration
- `components/system/projects-index-schema.md` — Full field schema, SVG visual vocabulary (7 patterns), complete example entry, common mistakes
- `components/system/band-theme-system.md` — Dark/paper band CSS, translucency rationale, data-mode attribute, padding conventions, editorial rhythm, eyebrow + H2 pattern
- `tokens/colors.md` — All CSS custom properties with hex, usage rules, additive blending note, dark/paper behavior, no new colors rule

---

## System Status

| Category | Files | Status |
|----------|-------|--------|
| Foundation (DESIGN.md + AGENT_INSTRUCTIONS.md) | 2 | ✅ Stable |
| System docs | 3 | ✅ Stable |
| Color/Typography/Spacing tokens | 3 | ✅ Stable |
| Ambient components | 4 | ✅ Stable |
| Chrome components | 5 | ✅ Stable |
| Interactive components | 4 | ✅ Stable |
| Chart specs | 4 | ✅ Stable |
| Diagram specs | 3 | ✅ Stable |
| Layout specs | 6 | ✅ Stable |
| Data display specs | 4 | ✅ Stable |
| Cinematic specs | 8 | ✅ Stable |
| Source snippets | 7 | ✅ Stable |
| Visual gallery | 1 | ✅ Stable |
| **Total** | **54** | **✅ Complete** |

---

## Next Update Triggers

Update this system when:
1. A new article is published → add entry to projects_index.json, document any new components
2. global.js is modified → update `components/system/global-js-contract.md`
3. global.css tokens change → update `tokens/colors.md` and/or `tokens/typography.md`
4. A new visualization type is built → create spec file, add to DESIGN.md component index, update CHANGELOG
5. A cinematic component is used for the first time in production → update `adaptation-status` from `token-mapped` to `production-tested`
