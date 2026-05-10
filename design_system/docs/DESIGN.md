# Leffew Portfolio Design System
> Master index. Read this file first. Fetch specific component files as needed. Stay under 200 lines.

## What This System Is

Dr. Heather Leffew's portfolio is a cinematic, dark-mode-first publication platform that treats data science case studies as long-form editorial pieces. Every page is a spatial narrative: a fixed WebGL starfield provides infinite depth, translucent dark and cream bands float above it, and GSAP-orchestrated reveals turn scrolling into storytelling. The design rejects SaaS conventions (no rounded corners, no gradients, no pastels) in favor of a metallurgical, institutional aesthetic — obsidian backgrounds, phthalo-blue accents, Playfair Display headlines, and JetBrains Mono for all data labels. The two-band system (dark/paper) creates rhythm across every article. Visualizations are always transparent so the starfield shows through.

---

## Visual Grammar

### Three-Layer Interactivity Principle
| Level | Technology | When to Use |
|-------|-----------|-------------|
| **Level 0** | Static SVG | Diagrams where annotation IS the message (hierarchy trees, temporal sequences, annotated ROC curves). No hover needed. |
| **Level 1** | Plotly.js | Interactive charts requiring hover tooltips, zoom, or 3D rotation (ROC/PR curves, 3D regression surface, SHAP beeswarm). |
| **Level 2** | Vanilla JS | Full interactive components requiring state (dual-slider calculator, patient profile explorer, sortable table). |

### The Palette Rule
Use only CSS variable names — never raw hex values. The full palette:
- Primary dark: `var(--obsidian)`, `var(--charcoal)`, `var(--graphite)`, `var(--brushed)`, `var(--tungsten)`, `var(--platinum)`, `var(--flare)`
- Primary light: `var(--paper)`, `var(--paper-2)`, `var(--paper-3)`, `var(--ink)`, `var(--ink-2)`, `var(--ink-3)`
- Brand accents: `var(--phthalo)`, `var(--phthalo-lift)`, `var(--ink-blue)`
- Diagram accents: `var(--alizarin)`, `var(--hookers)`, `var(--hansa)`, `var(--dioxazine)`

### The Annotation Rule
Thresholds and risk zones always use: `var(--alizarin)` (#7A1626) + dashed line + bold label. See FIG.03 in multimodal-autism-ai.html for the canonical pattern.

### The Typography Rule
- `var(--display)` (Playfair Display) — headlines only, never inside chart frames
- `var(--body)` (Lora) — all prose, abstracts, report text
- `var(--mono)` (JetBrains Mono) — all data labels, eyebrows, metadata, code, chart axis text

### The Transparency Rule
All chart backgrounds must be `rgba(0,0,0,0)`. In Plotly: `paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'`. The Three.js starfield is fixed at z-index:0; bands are translucent so stars show through. **Never use solid backgrounds on bands or chart frames.**

---

## Component Index

| ID | Component Name | Category | File Path | Interactivity | Status |
|----|---------------|----------|-----------|---------------|--------|
| SYS-01 | Global JS Contract | System | components/system/global-js-contract.md | — | stable |
| SYS-02 | Projects Index Schema | System | components/system/projects-index-schema.md | — | stable |
| SYS-03 | Band Theme System | System | components/system/band-theme-system.md | — | stable |
| TOK-01 | Colors | Tokens | tokens/colors.md | — | stable |
| TOK-02 | Typography | Tokens | tokens/typography.md | — | stable |
| TOK-03 | Spacing | Tokens | tokens/spacing.md | — | stable |
| AMB-01 | Three.js Particle Network | Ambient | components/ambient/three-particle-network.md | WebGL | stable |
| AMB-02 | Film Grain Overlay | Ambient | components/ambient/film-grain-overlay.md | none | stable |
| AMB-03 | Scroll Cue Drip | Ambient | components/ambient/scroll-cue-drip.md | scroll | stable |
| AMB-04 | Reading Progress Bar | Ambient | components/ambient/reading-progress-bar.md | scroll | stable |
| CHR-01 | Global Nav | Chrome | components/chrome/global-nav.md | injected | stable |
| CHR-02 | Site Footer | Chrome | components/chrome/site-footer.md | injected | stable |
| CHR-03 | Search Overlay | Chrome | components/chrome/search-overlay.md | injected | stable |
| CHR-04 | Chapter Spine | Chrome | components/chrome/chapter-spine.md | injected | stable |
| CHR-05 | Next Article Block | Chrome | components/chrome/next-article-block.md | injected | stable |
| INT-01 | Dual Slider Calculator | Interactive | components/interactive/dual-slider-calculator.md | live-js | stable |
| INT-02 | Patient Profile Explorer | Interactive | components/interactive/patient-profile-explorer.md | dropdown | stable |
| INT-03 | Sortable Ranking Table | Interactive | components/interactive/sortable-ranking-table.md | click | stable |
| INT-04 | Infinite Carousel | Interactive | components/interactive/infinite-carousel.md | css-anim | stable |
| LAY-01 | Numbered Section Header | Layout | components/layout/numbered-section-header.md | none | stable |
| LAY-02 | Hero Stat Trio | Layout | components/layout/hero-stat-trio.md | none | stable |
| LAY-03 | Expand/Collapse Section | Layout | components/layout/expand-collapse-section.md | click | stable |
| LAY-04 | Resume Experience Card | Layout | components/layout/resume-experience-card.md | hover | stable |
| LAY-05 | Competency Tag Block | Layout | components/layout/competency-tag-block.md | none | stable |
| LAY-06 | Formula Display Block | Layout | components/layout/formula-display-block.md | none | stable |
| VIZ-01 | Plotly ROC Curve | Charts | components/charts/plotly-roc-curve.md | plotly-hover | stable |
| VIZ-02 | Plotly PR Curve | Charts | components/charts/plotly-pr-curve.md | plotly-hover | stable |
| VIZ-03 | Plotly 3D Surface | Charts | components/charts/plotly-3d-surface.md | plotly-3d | stable |
| VIZ-04 | Plotly SHAP Beeswarm | Charts | components/charts/plotly-shap-beeswarm.md | plotly-hover | stable |
| DIA-01 | SVG Hierarchy Tree | Diagrams | components/diagrams/svg-hierarchy-tree.md | none | stable |
| DIA-02 | SVG Temporal Sequence | Diagrams | components/diagrams/svg-temporal-sequence.md | none | stable |
| DIA-03 | SVG ROC with Annotation | Diagrams | components/diagrams/svg-roc-with-annotation.md | none | stable |
| DAT-01 | Schema Preview Table | Data Display | components/data-display/schema-preview-table.md | none | stable |
| DAT-02 | Simulation Parameter Table | Data Display | components/data-display/simulation-parameter-table.md | none | stable |
| DAT-03 | Clinical Report Card | Data Display | components/data-display/clinical-report-card.md | none | stable |
| DAT-04 | SVG Abstract Thumbnail | Data Display | components/data-display/svg-abstract-thumbnail.md | none | stable |
| CIN-01 | Sticky Stack Narrative | Cinematic | components/cinematic/sticky-stack-narrative.md | scroll | stable |
| CIN-02 | Scroll SVG Draw | Cinematic | components/cinematic/scroll-svg-draw.md | scroll | stable |
| CIN-03 | Curtain Reveal | Cinematic | components/cinematic/curtain-reveal.md | scroll | stable |
| CIN-04 | Sticky Cards | Cinematic | components/cinematic/sticky-cards.md | scroll | stable |
| CIN-05 | Text Mask Reveal | Cinematic | components/cinematic/text-mask-reveal.md | scroll | stable |
| CIN-06 | Odometer Counter | Cinematic | components/cinematic/odometer-counter.md | scroll | stable |
| CIN-07 | Typewriter | Cinematic | components/cinematic/typewriter.md | scroll | stable |
| CIN-08 | Mesh Gradient | Cinematic | components/cinematic/mesh-gradient.md | none | stable |
| SNIP-01 | Dual Slider Calculator | Snippets | source-snippets/dual-slider-calculator.html | — | stable |
| SNIP-02 | SVG Hierarchy Tree | Snippets | source-snippets/svg-hierarchy-tree.html | — | stable |
| SNIP-03 | SVG Temporal Sequence | Snippets | source-snippets/svg-temporal-sequence.html | — | stable |
| SNIP-04 | SVG ROC Annotation | Snippets | source-snippets/svg-roc-annotation.html | — | stable |
| SNIP-05 | Plotly SHAP Beeswarm | Snippets | source-snippets/plotly-shap-beeswarm.html | — | stable |
| SNIP-06 | Patient Profile Explorer | Snippets | source-snippets/patient-profile-explorer.html | — | stable |
| SNIP-07 | Sortable Ranking Table | Snippets | source-snippets/sortable-ranking-table.html | — | stable |
| GAL-01 | Visual Gallery | Gallery | gallery/DESIGN.html | search | stable |

---

## What global.js Injects Automatically

Agents **must not** add these elements manually — global.js creates them:

| Element | ID/Class | Notes |
|---------|----------|-------|
| WebGL canvas | `#glCanvas` | Injected before body firstChild |
| Film grain overlay | `#grain` | Injected before body firstChild |
| Top navigation | `#topnav` | Full nav with search, about, library, resume |
| Site footer | `footer.site-foot` | Appended to body |
| Search overlay | `#search-overlay` | Appended to body; lazy-loads projects_index.json |
| Three.js script | CDN r128 | Auto-loaded if THREE undefined |
| GSAP + ScrollTrigger | CDN 3.12.5 | Auto-loaded |
| Lenis smooth scroll | CDN 1.0.29 | Auto-loaded |
| SplitType | unpkg | Auto-loaded for hero H1 animation |
| 3D tilt | `.p-card, .r-card, .edu-card, .bio-card` | ±3° perspective tilt on mousemove |
| Audio feedback | All `button, a, .p-card` | 200→80Hz sine wave, 80ms, 0.02 gain |

**Recommendation and next article blocks are populated by global.js** when `#recommendation-grid` and `#next-chap-link` are present in the DOM.

---

## New Visualization Decision Tree

1. **Does the reader need to explore the data interactively?** → Yes: go to Q2. No: SVG diagram.
2. **Is it 3D, or does it need hover tooltips with exact values?** → Yes: Plotly. No: go to Q3.
3. **Does the visualization show model evaluation metrics (ROC, PR, SHAP)?** → Yes: Plotly. No: go to Q4.
4. **Is the diagram primarily conceptual/architectural (showing flow, hierarchy, sequence)?** → Yes: SVG. No: go to Q5.
5. **Is the insight communicated by annotation (threshold line, risk zone, label)?** → Yes: SVG with annotation pattern. No: go to Q6.
6. **Does the user need to input parameters and see live output?** → Yes: Vanilla JS Level 2. No: use simplest SVG.
