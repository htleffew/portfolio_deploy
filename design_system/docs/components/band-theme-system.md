# Band Theme System
> The fundamental layout primitive of every page. All content lives inside bands.

---

## What a Band Is

A band is a full-width horizontal section (`<section class="band band--dark">` or `<section class="band band--paper">`). Every article is composed entirely of alternating bands. There are no other layout containers at the page level.

---

## The Two Band Types

### `.band--dark`
```css
background: rgba(3,3,3,0.6);
color: var(--platinum);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```
- **Translucent obsidian** — not solid black. The `rgba(3,3,3,0.6)` lets the Three.js starfield show through at 40% opacity.
- Text: `var(--platinum)` (#F5F5F7) for body, `var(--flare)` (#FFFFFF) for headings
- Eyebrows: `var(--phthalo-lift)` (#3866A0)
- Borders: `var(--graphite)` (#222222) or `rgba(255,255,255,0.08)`

### `.band--paper`
```css
background: rgba(245,245,247,0.85);
color: var(--obsidian);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```
- **Translucent cream** — 85% opacity cream over the starfield. The stars are barely perceptible through paper bands, creating a subtle depth.
- Text: `var(--ink)` (#030303) for headings, `var(--ink-2)` (#222222) for body
- Eyebrows: `var(--ink-blue)` (#1A3A6B)
- Borders: `var(--paper-3)` (#DDDDDD)

### `.band--ink` (variant)
```css
background: rgba(26,26,26,0.7);
color: var(--platinum);
backdrop-filter: blur(10px);
```
Darker than `band--dark`. Used sparingly for code-heavy sections where maximum contrast is needed.

---

## Why Translucency Is Non-Negotiable

The Three.js particle network is `position: fixed; z-index: 0`. All bands are `position: relative; z-index: 1`. The starfield is only visible because bands are semi-transparent.

**If you make a band opaque, the background becomes a dead flat color.** The entire spatial depth of the design collapses. Opaque bands are a design error — not a stylistic choice.

The same rule applies to chart frames: `background: rgba(0,0,0,0)` not `background: #000` or `background: white`.

---

## The `data-mode` Attribute

GSAP reads `data-mode` (values: `"dark"` or `"paper"`) on sections for scroll-triggered reveals:
```html
<section class="band band--paper" data-spine="Section" data-section="Full Name" data-mode="paper">
```
This also drives the `#spine` and `#topnav` paper/dark state transitions via IntersectionObserver (threshold: 0.3).

When a paper band becomes active at >30% visibility:
- `#spine` gains class `is-paper` → switches to light background
- `#topnav` gains class `is-paper` → switches to cream background

---

## Band Padding Conventions

```css
.band { padding: 80px 0; }                    /* Default for most bands */
.front { min-height: 100vh; padding: 120px 0 80px; }  /* Hero front matter */
.back-matter { padding-top: 120px; padding-bottom: 160px; }  /* Bibliography + related works */
```

Mobile override (max-width: 768px): padding reduces to `60px 0` implicitly via content padding.

---

## The Band Transition

```css
.band {
  transition: background 0.9s cubic-bezier(0.4,0,0.2,1),
              color 0.9s cubic-bezier(0.4,0,0.2,1);
}
```
The `0.9s` duration with `ease-standard` easing creates a slow, film-like dissolve between band states when the spine or IntersectionObserver triggers a mode change.

---

## Column System Inside Bands

| Class | Max-Width | Padding | Use For |
|-------|-----------|---------|---------|
| `.col` | `860px` (var(--col)) | `0 32px` | Default prose content |
| `.col-wide` | `1400px` (var(--col-wide)) | `0 48px` | Full-width figures, tables, simulators |
| `.col-main` | Inherits from grid column | `0` | Used inside grid layout for centered prose |
| (default) | `860px` via grid | auto | Content directly in `section.band` uses master grid |

### Master Grid System (≥1240px)
```css
section.band:not(.front):not(.library-band):not(.back-matter) {
  display: grid;
  grid-template-columns: var(--grid-left) 680px 400px minmax(16px, 1fr);
}
```
Where `--grid-left: max(260px, calc(50vw - 540px))` at ≥1360px viewport.

Direct children of `section.band` are placed in column 2 (the 680px reading column) by default. Children with class `.col-wide`, `.figure`, `.report-prose`, `.simulator-layout`, `.dashboard-layout` span columns 2–4 (reading column + sidenote column).

---

## Editorial Band Rhythm

A valid article band sequence (alternating creates visual rhythm):
```
1. .band--dark   → Front matter / hero (full viewport height)
2. .band--paper  → First content section (introduces the problem)
3. .band--dark   → Architecture / code section
4. .band--paper  → Data tables / schema preview
5. .band--dark   → Interactive chart / visualization
6. .band--paper  → Results / analysis
7. .band--dark   → MLOps / deployment / code
8. .band--paper  → Conclusions / references
9. .band--dark   → Back matter (related works, next article)
```

Rules:
- Never use the same band type for more than 2 consecutive sections
- Front matter is always `.band--dark`
- Back matter (recommendation grid, next article) is always `.band--dark`
- Code-heavy sections prefer `.band--dark` (dark background = less eye strain for code)
- Tables and data previews read better on `.band--paper`

---

## Eyebrow + H2 Header Pattern

Every content section (not front matter) must begin with this exact pattern:
```html
<section class="band band--dark" data-spine="Label" data-section="Full Name">
  <div class="eyebrow">01 / Section Name</div>
  <h2>Section Heading That Communicates the Insight</h2>
  <!-- content -->
</section>
```

CSS for eyebrow:
```css
.band--dark .eyebrow {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: var(--phthalo-lift);
  margin: 0 auto 18px;
  max-width: var(--col);
  padding: 0 32px;
}
.band--paper .eyebrow { color: var(--ink-blue); }
```

The eyebrow format is always: `[two-digit number] / [Section Name]` — the slash convention is mandatory. Examples: `01 / The Flaw`, `03 / Stage 1`, `06 / Interpretability`.

H2 should communicate the insight, not describe the content. "The Blind Spot in Conversion Probability" not "Problem Overview."

---

## When to Use Dark vs. Paper

| Content Type | Preferred Band |
|-------------|---------------|
| Hero / front matter | Always dark |
| Problem statement / narrative hook | Paper (inviting, readable) |
| Technical architecture | Dark (code reads better dark) |
| Schema / data preview table | Paper (tabular data = light background) |
| Interactive Plotly charts | Dark (transparency rule: stars visible through chart) |
| Static SVG diagrams | Either (SVG adapts to both via CSS) |
| Methodology callout block | Dark |
| Results table | Paper |
| Conclusion / references | Paper |
| Back matter / related works | Always dark |

---

## Band Transition Between Adjacent Bands
```css
.band--dark + .band--paper,
.band--paper + .band--dark,
.band--ink + .band--paper,
.band--paper + .band--ink {
  border-top: 1px solid rgba(0,0,0,0.0);
}
```
The border is transparent — this selector exists to reset any inherited border that might appear between bands. The visual transition is handled by the background color alone.
