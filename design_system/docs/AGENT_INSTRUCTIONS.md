# Agent Instructions — Leffew Portfolio Design System
> Operational guide for agents building new articles or components. Read this before touching any file.

---

## ⚠️ Writing any user-facing copy? Read this first.

**Before writing or editing any text that will appear on the site — article prose, abstracts, project descriptions, bio text, captions, labels — read [`VOICE.md`](VOICE.md).**

This is not optional and it is not scoped to a piece type. Every word a visitor reads must conform to the voice spec. The most common agent failure mode is producing technically correct HTML with prose that sounds like an LLM wrote it. `VOICE.md` defines exactly what that means and how to avoid it, including a cold-read gate that must pass before any copy is finalized.

---

## Start Here — 6-Step Workflow

Before writing a single line of HTML, every agent must complete these steps in order:

1. **Read `VOICE.md`** — Understand the voice, register, and hard constraints before writing a word of copy.
2. **Read `DESIGN.md`** — Understand the visual grammar, palette rules, and component index.
3. **Read `components/system/global-js-contract.md`** — Know what global.js auto-injects. If you add any of those elements manually, the page breaks.
4. **Read `components/system/band-theme-system.md`** — Understand the dark/paper band rhythm before laying out sections.
5. **Identify which components you need** from the DESIGN.md index. Fetch those spec files.
6. **Run the Visualization Decision Tree** (in DESIGN.md) for every data visualization before choosing a chart type.

---

## New Article Checklist

### a. HTML File Structure

Required `<head>` elements (in this order):
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Article Title] | Dr. Heather Leffew</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
<!-- Plotly ONLY if article has interactive charts -->
<script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
<link rel="stylesheet" href="../design_system/css/global.css">
```

Required `<body>` attributes:
```html
<body data-category="[Category]" data-title="[Article Title]">
```

Required last element before `</body>` (three script tags in order; pages link them, no single-file entry):
```html
<script src="../design_system/js/cinematic_engine_v3.js" defer></script>
<script src="../design_system/js/global_chrome.js" defer></script>
<script src="../design_system/js/institutional.js" defer></script>
```

Legacy: pre-2026-06-05, every page linked a single `../design_system/js/global.js`. Both files are gone from the deployed architecture; do not reintroduce them.

### b. Mandatory HTML Placeholders

These elements must be present in every article, empty — global.js populates them:

```html
<canvas id="deep-space"></canvas>
<div id="progress"></div>
<div id="global-nav-container"></div>
<aside id="spine"></aside>
```

### c. Section Markup Contract

Every `<section>` must have both attributes:
```html
<section class="band band--dark" data-spine="Short Label" data-section="Full Section Name">
```

- `data-spine` — Short label shown in the left chapter spine navigation (≤20 chars)
- `data-section` — Full name for accessibility and GSAP orchestration
- `class` must include `band` plus one of `band--dark` or `band--paper`

Every content section (not front matter) must begin with the numbered section header pattern:
```html
<div class="eyebrow">01 / Section Name</div>
<h2>Section Heading</h2>
```

### d. What NOT to Include

| Element | Reason |
|---------|--------|
| `<nav>`, `<header id="topnav">` | Auto-injected by global.js |
| `<footer>` | Auto-injected by global.js |
| `<script src="three.js">` or any Three.js import | Already loaded by global.js — duplicate = black screen |
| `<div id="grain">` | Auto-injected |
| `#glCanvas` | Auto-injected |
| Any `border-radius` | Global reset sets `border-radius: 0 !important` everywhere |
| Raw hex color values | Always use CSS variable names |

### e. Voice checklist

Before finalizing any prose, verify every item:

- [ ] Piece is oriented toward what the reader leaves with, not what the author accomplished
- [ ] No sassy, denigrating, or dismissive language toward any person, organization, or body of work
- [ ] Register matches harm assessment, not topic gravity — see `VOICE.md` for the distinction
- [ ] Humor (if present) comes from the situation, not the author's commentary; not at anyone's expense
- [ ] No significance stamping: *"this demonstrates," "this proves," "this is significant because"*
- [ ] No aphoristic closer (tidy moral or lesson in the final sentence)
- [ ] No staged contrast: *"X is not Y; it is Z"*
- [ ] No *"rather than"* — use *"not"* or *"instead of"*
- [ ] No banned words: *matters*, *earns* (in evaluative sense)
- [ ] No em-dashes or en-dashes in research/analytical pieces
- [ ] Epistemic verbs match claim strength: *indicates/supports*, not *shows/proves*
- [ ] First-person active where author is the agent: *"I built"*, not *"a pipeline was constructed"*
- [ ] American spelling throughout
- [ ] **Cold-read gate:** read the prose as if seeing it for the first time. Flag and rewrite any sentence that sounds AI-generated.

### f. projects_index.json Entry

Every new article must add an entry. The agent must add this to `projects_index.json`:

```json
{
  "id": "Folder_Name",
  "title": "Full Article Title as shown in search",
  "desc": "2-3 sentence description. First 80 chars appear in next-article block. First 140 chars appear in search results.",
  "cat": "Category Name",
  "subtype": "UPPERCASE SUBTYPE LABEL",
  "tags": ["Tag One", "Tag Two", "Tag Three"],
  "url": "Folder_Name/filename.html",
  "time": "X min read",
  "visual": "<svg fill=\"none\" viewbox=\"0 0 600 600\">...</svg>"
}
```

**The `id` field must exactly match the folder name.** The `url` field must be relative from the portfolio root.

---

## New Visualization Decision Tree (Imperative Voice)

1. **Ask: Does the reader need to explore the data?**
   - No → Use SVG. Go to step 4.
   - Yes → Go to step 2.

2. **Ask: Does it need hover tooltips with exact values, or is it 3D?**
   - Yes → Use Plotly. Go to step 3.
   - No → Use Vanilla JS. See `INT-01` through `INT-03`.

3. **Choose the Plotly component:**
   - Classification evaluation (ROC, PR) → `VIZ-01` or `VIZ-02`
   - Regression surface, 3D feature space → `VIZ-03`
   - Feature importance / explanability → `VIZ-04`

4. **Choose the SVG component:**
   - Hierarchy or architecture flow → `DIA-01`
   - Event timing or causal sequence → `DIA-02`
   - Annotated metric curve with threshold → `DIA-03`

---

## New Component Checklist

Before finalizing any new visualization, verify all 15 points:

- [ ] Chart background is `rgba(0,0,0,0)` — not white, not black
- [ ] All colors reference CSS variables, not hex values
- [ ] Font family set to `var(--mono)` for axis labels
- [ ] No `border-radius` anywhere in the component
- [ ] Risk zones / thresholds use `var(--alizarin)` + dashed line + bold label
- [ ] Plotly config has `displayModeBar: false`
- [ ] SVG has explicit `viewBox` attribute
- [ ] SVG arrow markers use `<defs><marker>` pattern (see `DIA-01`)
- [ ] Component degrades gracefully on mobile (test at 375px)
- [ ] Dark-band and light-band variants both tested (dark: `--platinum` labels; light: `--ink-3` labels)
- [ ] No inline `style="color:#XXXXXX"` — only CSS variable references
- [ ] Figure caption uses `.cap` class with `.num` span: `<span class="num">FIG. XX</span>`
- [ ] Component wrapped in `.figure` + `.frame` structure
- [ ] `.reveal` class added to `.figure` for scroll-triggered entrance
- [ ] Component ID added to DESIGN.md component index

---

## Critical Gotchas

### 1. Loading Three.js Manually → Black Screen
**Symptom:** The WebGL canvas renders nothing; console shows "Cannot read property of undefined" on Three.js objects.
**Cause:** global.js lazy-loads Three.js r128. If you also load it in a `<script>` tag, two competing WebGL contexts are created and they corrupt each other.
**Fix:** Never add a Three.js `<script>` tag. global.js handles it.

### 2. Adding Your Own Nav/Footer → Duplicate Chrome
**Symptom:** Two navigation bars appear at the top of the page; footer appears twice.
**Cause:** global.js injects `#topnav` and `footer.site-foot` on every page load.
**Fix:** Remove any `<nav>`, `<header>`, or `<footer>` from article HTML. Only the global `#topnav` injection exists.

### 3. Missing data-spine Attributes → Broken Chapter Spine
**Symptom:** The left sidebar navigation (#spine) renders empty or shows wrong labels.
**Cause:** global.js populates `#spine` by reading `data-spine` attributes from every `section.band`.
**Fix:** Every `<section class="band ...">` must have `data-spine="Label"`.

### 4. Missing projects_index.json Entry → Article Invisible to System
**Symptom:** Article does not appear in search results, recommendations block is empty, next-article link is broken.
**Cause:** Search, recommendations, and next-article all query `projects_index.json`. If the article has no entry, it is invisible.
**Fix:** Add a complete JSON entry (all required fields) to `projects_index.json` before deploying.

### 5. Using Raw Hex Values → Breaks Theming
**Symptom:** Components look wrong in paper bands; colors don't adapt to dark/light context.
**Cause:** The system uses CSS custom properties to switch palettes. Raw hex bypasses this.
**Fix:** Always use `var(--token-name)`. See `tokens/colors.md` for every token.

### 6. Backdrop-filter on Moving WebGL Elements → GPU Stutter
**Symptom:** Page stutters at 60fps; GPU usage spikes on scroll.
**Cause:** `backdrop-filter: blur()` over a WebGL canvas forces per-frame recomposite.
**Fix:** The band system uses `backdrop-filter: blur(10px)` on static bands only. Never add additional backdrop-filter to elements that animate over the canvas.

---

## File Naming and Location Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Article folder | `Title_Case_With_Underscores/` | `Account_Prioritization/` |
| Article HTML | `kebab-case.html` | `account-prioritization.html` |
| Article assets | Inside article folder | `Account_Prioritization/chart-data.json` |
| Design system docs | `design_system/components/[category]/[kebab-name].md` | `components/charts/plotly-roc-curve.md` |
| Source snippets | `design_system/source-snippets/[kebab-name].html` | `source-snippets/dual-slider-calculator.html` |
| Token docs | `design_system/tokens/[name].md` | `tokens/colors.md` |

Article folders must be at the **portfolio root level**, not nested inside other article folders.
