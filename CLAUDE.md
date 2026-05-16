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

## The .txt to Markdown Workflow

### Step 1 — Read source material fully
Note: core mechanisms, specific results with numbers, the "why it matters," any visualizable data (numbers that become charts or diagrams).

### Step 2 — Plan section structure
- Organize the document using `## ` (H2) headings.
- The SSG Compiler (`build.js`) will automatically split the document at every `## ` heading and wrap it in the proper alternating `band--dark` and `band--paper` HTML layout.
- The text following a `## ` heading becomes its own section. The heading text is automatically used for the left-hand chapter spine.

### Step 3 — Select components
Interactive web components (like Plotly charts or custom WebGL) cannot be embedded directly in the Markdown body, as this breaks LaTeX compilation. If you need a visualization, write a standalone JS script for it, and list it in the YAML frontmatter `scripts` array. The SSG layout will inject it into a designated container outside the article body.

### Step 4 — Write the Markdown
Create your `article.md` file. Ensure it begins with the required YAML frontmatter, immediately followed by the formal LaTeX title block (see below).

### Step 5 — Compile & Deploy
Run the SSG compiler (`node build.js`), update the index (`node deploy.js`), and commit to GitHub. Exact commands at the bottom of this file.

---

## Markdown Structure — Required Elements

Every article MUST be a `.md` file containing YAML frontmatter at the very top.

### Frontmatter Schema (Mandatory)
```yaml
---
title: "Article Title as Shown in Search"
description: "2-3 sentence description. First 80 chars appear in the next-article block."
category: "Machine Learning"
subcategory: "Analysis"
subject: "Deep Learning"
architecture: "ResNet-50"
output: "Classification"
format: "CASE STUDY"
time: "X min read"
tags:
  - "Tag One"
  - "Tag Two"
visual: "<svg fill=\"none\" viewBox=\"0 0 600 600\"><!-- thumbnail SVG --></svg>"
scripts: ["custom_script.js"]
---
```

### LaTeX-Compatible Title Block (Mandatory)
Directly beneath the YAML frontmatter, you MUST include the formal LaTeX title block for `md_to_latex.py` compatibility. The file must look exactly like this:
```markdown
---
[...YAML Frontmatter...]
---
# Your Article Title Here

Dr. Heather Leffew
Obelus Institute
Month Year
---

## Abstract
(Write your abstract here)

## Next Section
...
```

### Body Content
Write strictly pure Markdown below the abstract.
- Use `## ` (H2) to separate major sections. The SSG compiler automatically parses `## ` headings to create alternating dark/paper bands and generates the left-hand navigation spine.
- **DO NOT** use H1 (`# `) anywhere except for the single Title block at the top.
- **NO RAW HTML**: To remain compatible with academic LaTeX compilation via `md_to_latex.py`, you are strictly forbidden from writing any HTML tags (`<div>`, `<svg>`, `<canvas>`, etc.) inside the markdown body.
- **Tables**: Use standard pure Markdown tables. Do not use HTML tables.
- **Visualizations**: If an interactive visualization is required for the web version, do NOT write HTML. Instead, declare the required JS file in the YAML frontmatter (`scripts: ["chart.js"]`). The SSG layout engine will automatically mount the visualization outside of the pristine markdown body.

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

### Front Matter
The Front Matter is now handled entirely by the YAML metadata block and the SSG compiler. Do not manually write front matter HTML.

### Content Sections
Use `## ` (H2) for all top-level sections. Do not use H1 except for the main title.

```markdown
## 01 / Eyebrow Text Here
Opening paragraph goes here.

Subsequent paragraphs...
```

### Figures and Data
Use standard Markdown formatting for tables and code snippets.
If a data visualization is required, do NOT write HTML blocks like `<div class="plotly-wrapper">`. Use the `scripts` array in your YAML frontmatter to load external interactive components, or compile static SVG files into the directory and reference them as normal Markdown links if supported by your secondary rendering pipelines.

### Related Works & Next Chapter
These are automatically injected by the SSG compiler (`build.js`) and `global.js`. You do not need to append back matter to your markdown file.

---

## projects_index.json — Automated

You no longer need to manually append to `projects_index.json`. 
When you run `node deploy.js`, it will automatically parse the YAML frontmatter from your `.md` files and inject the project into `master_index.json` and `projects_index.json`.

**Rules for Frontmatter Visuals:**
- `visual` is an inline SVG used as a thumbnail on the research library page — make it abstract/geometric, reflecting the article's content without literal illustration. Use `var(--phthalo)`, `var(--phthalo-lift)`, `var(--alizarin)`.

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

After writing your Markdown file:

```powershell
cd C:\Users\drhea\repos\Pm_html\portfolio_deploy
node build.js      # Compiles your Markdown into HTML layouts
node deploy.js     # Extracts metadata and updates indices
git add .
git status         # verify your new files are staged
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
