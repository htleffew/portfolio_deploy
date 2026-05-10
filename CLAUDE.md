# Portfolio Design System — Master Workflow

**Read this file completely before touching any article file.**
This is the single source of truth for every new article, every deployment, and every design decision.

---

## Repo Identity

- **Git remote:** `https://github.com/htleffew/portfolio_deploy` (branch: `master`)
- **CSS:** `design_system/css/global.css`
- **JS (cinematic engine):** `design_system/js/global.js`
- **Article template:** `design_system/case-study-template.html`
- **Component snippets:** `design_system/source-snippets/*.html`
- **Component specs:** `design_system/docs/` (51 .md files)
- **Project registry:** `projects_index.json` at repo root

Article folders live at repo root: `Folder_Name/filename.html`

---

## Mandatory Pre-Writing Rules

Before writing a single line of HTML for a new article:

1. **Read the source material** (.txt file) completely. Never summarize from the title alone. Look for: specific mechanisms, real numbers, named methods, the actual "why it matters." Surface-level summaries produce hollow articles.
2. **Read `design_system/docs/AGENT_INSTRUCTIONS.md`** — operational rules and checklist
3. **Read `design_system/docs/components/system/global-js-contract.md`** — what global.js auto-injects (nav, footer, grain, spine, related works, next-article). Do NOT include any of those elements manually.
4. **Read `design_system/docs/components/system/band-theme-system.md`** — the dark/paper rhythm
5. **Run the Visualization Decision Tree** (in this file, below) for every data element before choosing a chart type

---

## The .txt to HTML Workflow

### Step 1 — Read source material fully
Note: core mechanisms, specific results with numbers, the "why it matters," any visualizable data (numbers that become charts or diagrams).

### Step 2 — Plan section structure
- Minimum 6 bands, maximum 12
- Always alternate: `band--dark` / `band--paper` / `band--dark` (never same type twice in a row)
- Front matter: always `band--dark`
- References: always `band--paper`
- Back matter (Related Works + Next Chapter): always `band--dark`

### Step 3 — Select components
Use the Visualization Decision Tree (below) for every data element.

### Step 4 — Write the HTML
Start from `design_system/case-study-template.html`. Replace all `{{PLACEHOLDER}}` values. Copy component HTML from `design_system/source-snippets/`.

### Step 5 — Update projects_index.json
Add a new entry. Schema is in this file, below.

### Step 6 — Commit and push
Exact commands at the bottom of this file.

---

## HTML Structure — Required Elements

### Head (in this exact order)
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Article Title] | Dr. Heather Leffew</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
<!-- Only include Plotly if the article has interactive charts: -->
<!-- <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script> -->
<link rel="stylesheet" href="../design_system/css/global.css">
```

### Body — required placeholders (empty, global.js populates them)
```html
<div id="preloader"><div id="preloader-left"></div><div id="preloader-right"></div><div id="preloader-line"></div></div>
<canvas id="glCanvas"></canvas>
<div id="progress"></div>
<div id="global-nav-container"></div>
<aside id="spine"></aside>
<div class="atmosphere"></div>
```

### Body attributes
```html
<body data-category="Machine Learning" data-title="Short Title">
```

### Last script before </body>
```html
<script src="../design_system/js/global.js" defer></script>
```

### What global.js auto-injects — do NOT add these manually
| Element | Do NOT add |
|---------|-----------|
| `<header id="topnav">` | Auto-injected |
| `<footer class="site-foot">` | Auto-injected |
| `<div id="grain">` | Auto-injected |
| Any Three.js `<script>` | global.js lazy-loads it |
| Second `#glCanvas` | Causes black screen |
| `<nav>` | Auto-injected |

---

## Band / Grid System — Critical Rules

`section.band` at viewports >1240px is a CSS grid:
```
grid-template-columns: [left-gutter] 680px 400px [right-gutter]
```

**Direct children of `section.band` default to the 680px reading column.**

These classes span the wider 1080px zone (columns 2+3):

| Class | Grid Span | Use for |
|-------|-----------|---------|
| `.col-wide` | 2/4 (1080px) | Main wrapper for all section content |
| `.bio-wrap` | 2/4 (1080px) | Biography split-grid |
| `.figure` | 2/4 (1080px) | All SVG diagrams and images |
| `.plotly-wrapper` | 2/4 (1080px) | Plotly chart containers |
| `.stat-grid` | 2/4 (1080px) | Stat trios |
| `.simulator-layout` | 2/4 (1080px) | Interactive simulators |
| `.dashboard-layout` | 2/4 (1080px) | Dashboard panels |

**`.report-prose` stays at 680px** with `overflow-x: auto` — tables inside scroll horizontally.

### Preferred section pattern (new articles)
Wrap all section content in `.col-wide`. Elements inside `.col-wide` can use internal spacing.
```html
<section class="band band--paper" data-spine="Label" data-section="Full Label">
  <div class="col-wide">
    <div class="eyebrow reveal">01 / Section Name</div>
    <h2 class="reveal is-chapter">Heading</h2>
    <p class="has-dropcap reveal">...</p>
  </div>
</section>
```

Charts that need the wide span: use `.plotly-wrapper` or `.figure` as direct band children (not inside `.col-wide`).

### Every section requires both data attributes
```html
<section class="band band--dark" data-spine="Short" data-section="Full Section Name">
```
- `data-spine` ≤20 chars — appears in the left chapter spine
- `data-section` — full name for accessibility and GSAP

---

## Visualization Decision Tree

For every piece of data in the source material:

1. **Does the reader need to explore the data interactively?**
   - No → use SVG. Continue to step 4.
   - Yes → continue to step 2.

2. **Does it need hover tooltips with exact values, or is it 3D?**
   - Yes → use Plotly. Continue to step 3.
   - No → use Vanilla JS. See INT-01 through INT-03 in DESIGN.md.

3. **Choose Plotly component:**
   - ROC curve, PR curve → VIZ-01, VIZ-02
   - 3D regression / feature surface → VIZ-03
   - SHAP / feature importance → VIZ-04

4. **Choose SVG component:**
   - Architecture / hierarchy / pipeline flow → DIA-01
   - Event timing / causal sequence → DIA-02
   - Annotated metric curve with threshold line → DIA-03
   - Bar chart where annotation IS the message → custom SVG (see NLA article FIG.02 / FIG.03 as pattern)

---

## Design Rules

### Palette — CSS variables only, never hex
**Dark bands:** `var(--obsidian)` `var(--charcoal)` `var(--graphite)` `var(--brushed)` `var(--tungsten)` `var(--platinum)` `var(--flare)` `var(--phthalo)` `var(--phthalo-lift)`
**Paper bands:** `var(--paper)` `var(--paper-2)` `var(--paper-3)` `var(--ink)` `var(--ink-2)` `var(--ink-3)` `var(--ink-blue)`
**Diagram accents:** `var(--alizarin)` `var(--hookers)` `var(--hansa)` `var(--dioxazine)`

Thresholds and risk zones always: `var(--alizarin)` + dashed line + bold label.

### Typography
- `var(--display)` (Playfair Display) — headlines only, never inside chart frames
- `var(--body)` (Lora) — all prose
- `var(--mono)` (JetBrains Mono) — all data labels, eyebrows, chart axes, metadata

### Chart backgrounds — always transparent
Plotly: `paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'`
SVG: no fill on root `<svg>` element

### Zero border-radius
Global CSS resets `border-radius: 0 !important` everywhere. Do not add it.

### No backdrop-filter on animated elements
The bands use `backdrop-filter: blur(10px)` on static elements. Never add additional backdrop-filter to components that animate over the WebGL canvas.

---

## Prose Style Rules

**Em-dashes are banned.** Use hyphens or restructure the sentence. Grep for `—` `&mdash;` `&ndash;` before submitting any article.

**Banned prose patterns:**
- Contrast structures: "Not X. Y." / "While X, Y."
- Tricolons: "X, Y, and Z." as a rhetorical device
- Negation pivots: "This is not about X — it is about Y."
- Preaching cadence: any sentence that tells the reader how to feel about the finding
- Antithesis: "The more X, the less Y."

**Write instead:** Direct, spoken sentences. Subtle observation over declarative insight. The subject is the problem and method, not the author's credentials.

**No company names** in article prose — adapt real work without prestige-signaling.

---

## Section Patterns

### Front Matter (always band--dark)
```html
<section class="band band--dark front" data-spine="Front" data-section="Front matter">
  <canvas id="glCanvas"></canvas>
  <div class="col-wide">
    <div class="grid">
      <div>
        <div class="meta-row">
          <span class="bracket">Working note</span>
          <span class="sep">/</span>
          <span>Category</span>
          <span class="sep">/</span>
          <span>Subcategory</span>
        </div>
        <h1>Headline</h1>
        <p class="abstract">Abstract text.</p>
        <div class="byline">
          <div>Subject <strong>Value</strong></div>
          <div>Architecture <strong>Value</strong></div>
          <div>Output <strong>Value</strong></div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</section>
```

### Content Section — col-wide pattern
```html
<section class="band band--paper" data-spine="Label" data-section="Full Label">
  <div class="col-wide">
    <div class="eyebrow reveal">01 / Eyebrow</div>
    <h2 class="reveal is-chapter">Heading</h2>
    <p class="has-dropcap reveal">Opening paragraph...</p>
    <p class="reveal">Subsequent paragraph...</p>
  </div>
</section>
```

### Figure (SVG or image) — direct band child, gets wide span
```html
<div class="figure reveal">
  <div class="frame">
    <!-- SVG or img here -->
  </div>
  <div class="cap"><span class="num">FIG. 01</span> Caption text.</div>
</div>
```

### Method Box (inside col-wide)
```html
<div class="method">
  <div class="inner">
    <div class="lab">Label</div>
    Content text here.
  </div>
</div>
```

### Plotly Chart (direct band child, gets 1080px span)
```html
<div class="plotly-wrapper">
  <div id="chart-id" style="width:100%;height:400px;"></div>
</div>
<script>/* Plotly.newPlot call */</script>
```

### Back Matter (always band--dark, always last)
```html
<section class="band band--dark back-matter" data-spine="Research Graph" data-section="Research Graph">
  <div class="back-matter" style="padding-top:0;">
    <h3 style="margin-bottom:22px;">Related Works</h3>
    <div class="related">
      <div class="related-grid" id="recommendation-grid">
        <!-- Populated by global.js from projects_index.json -->
      </div>
    </div>
  </div>
  <a class="next-chap" id="next-chap-link" href="#">
    <div class="lf">
      <div class="eb">Next Publication</div>
      <div class="ti" id="next-chap-title">Loading...</div>
    </div>
    <div class="rt">&rarr;</div>
  </a>
</section>
<script src="../design_system/js/global.js" defer></script>
```

---

## projects_index.json — Required Entry for Every New Article

Add to `projects_index.json` at the repo root. The file is a JSON array — append before the closing `]`.

```json
{
  "id": "Folder_Name",
  "title": "Full Article Title as Shown in Search",
  "desc": "2-3 sentence description. First 80 chars appear in the next-article block. First 140 chars appear in search results. Be specific about method and outcome.",
  "cat": "Machine Learning",
  "subtype": "CASE STUDY",
  "tags": ["Tag One", "Tag Two", "Tag Three"],
  "url": "Folder_Name/filename.html",
  "time": "X min read",
  "visual": "<svg fill=\"none\" viewBox=\"0 0 600 600\"><!-- thumbnail SVG --></svg>"
}
```

**Rules:**
- `id` must exactly match the article folder name
- `url` is relative from the portfolio root
- `visual` is an inline SVG used as a thumbnail on the research library page — make it abstract/geometric, reflecting the article's content without literal illustration. Use `var(--phthalo)`, `var(--phthalo-lift)`, `var(--alizarin)`.
- `cat` must match the `data-category` attribute on the article `<body>`

---

## File Naming and Location

| Type | Pattern | Example |
|------|---------|---------|
| Article folder | `Title_Case_With_Underscores/` | `Account_Prioritization/` |
| Article HTML | `kebab-case.html` | `account-prioritization.html` |
| Article assets | Inside article folder | `Account_Prioritization/chart-data.json` |
| Component specs | `design_system/docs/components/[cat]/[kebab].md` | `docs/components/charts/plotly-roc-curve.md` |
| Source snippets | `design_system/source-snippets/[kebab].html` | `source-snippets/dual-slider-calculator.html` |

---

## Critical Gotchas

| Symptom | Cause | Fix |
|---------|-------|-----|
| Black screen / WebGL nothing | Extra Three.js script tag | Never add Three.js manually; global.js loads it |
| Two nav bars at top | Manual `<header>` or `<nav>` in article | Remove — global.js injects topnav |
| Spine shows empty or wrong labels | Missing `data-spine` attribute | Every `section.band` needs `data-spine` |
| Article invisible in search / recommendations | Not in projects_index.json | Add complete entry before deploying |
| Colors wrong in paper bands | Raw hex values in CSS | Always use `var(--token-name)` |
| GPU stutter on scroll | Extra backdrop-filter on animated elements | Only static band backgrounds use backdrop-filter |
| Two canvases in DOM | Old `<canvas id="deep-space">` + global.js injection | Use `<canvas id="glCanvas">` only, or omit canvas (global.js creates it) |
| Bio text column crushed | `.bio-wrap` not getting wide grid span | Add `col-wide` class: `<div class="bio-wrap col-wide">` |
| Table bleeds past headings | Table inside `.report-prose` wider than 680px | `.report-prose` has `overflow-x: auto`; table will scroll |
| Charts narrow (680px) | `.plotly-wrapper` not a direct band child | `.plotly-wrapper` must be a direct `section.band` child, not inside `.col-wide` |

---

## GitHub Deploy

After writing the HTML and updating `projects_index.json`:

```powershell
cd C:\Users\drhea\repos\Pm_html\portfolio_deploy
git add .
git status   # verify only your new files are staged
git commit -m "feat: add [article title] case study"
git push origin master
```

GitHub Pages deploys automatically from the `master` branch.

**Before committing:** grep for `—` (em-dash) in the new article. None should appear.

---

## Component Reference

Full specs in `design_system/docs/`. Source HTML in `design_system/source-snippets/`.

| ID | Name | Snippet file | Notes |
|----|------|-------------|-------|
| INT-01 | Dual Slider Calculator | `dual-slider-calculator.html` | A × B formula simulator |
| INT-02 | Patient Profile Explorer | `patient-profile-explorer.html` | Dropdown-driven metric display |
| INT-03 | Sortable Ranking Table | `sortable-ranking-table.html` | Click-to-sort columns |
| LAY-06 | Formula Display Block | `formula-display-block.html` | Mathematical notation display |
| DIA-01 | SVG Hierarchy Tree | `svg-hierarchy-tree.html` | Architecture / pipeline diagrams |
| DIA-02 | SVG Temporal Sequence | `svg-temporal-sequence.html` | Event timing diagrams |
| DIA-03 | SVG ROC with Annotation | `svg-roc-with-annotation.html` | Annotated metric curves |
| VIZ-01 | Plotly ROC Curve | `plotly-roc-curve.html` | Interactive ROC |
| VIZ-02 | Plotly PR Curve | `plotly-pr-curve.html` | Precision-Recall |
| VIZ-03 | Plotly 3D Surface | `plotly-3d-surface.html` | 3D regression / feature space |
| VIZ-04 | Plotly SHAP Beeswarm | `plotly-shap-beeswarm.html` | Feature importance |
| CIN-01 | Odometer Counter | (see multimodal-autism-ai.html) | Scroll-triggered number count-up |
| CIN-02 | Sticky Stack Narrative | (see docs/components/cinematic/) | Sticky-scroll story panels |

For components not listed here, read the spec in `design_system/docs/components/`.
