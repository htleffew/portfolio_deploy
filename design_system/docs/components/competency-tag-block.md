---
component: Competency Tag Block
id: LAY-05
status: stable
category: layout
interactivity: none
source: index.html — capabilities section (.tech-block)
---

## What It Does
A titled block of keyword tags organized by category — for dense skill/capability listings where the taxonomy matters more than interactivity.

## When to Use
- Skills and capabilities sections on homepage/about pages
- Technology stack listings per project
- Taxonomy display where grouping by category adds meaning
- When you have 5+ related terms that belong together

## When NOT to Use
- Navigation chips (use `.tag.active` filter system on repository page instead)
- When fewer than 4 tags (just inline them in prose)
- When tags should be clickable filters (use the repository dashboard tag system)

**Distinction from filter chips:** `.tech-block` tags are **semantic labels** — they communicate taxonomy. Repository filter tags (`.tag.active`) are **interactive filters** — they change displayed content. These are different components serving different purposes.

## Anatomy
```
┌──────────────────────────────────────────────┐
│  Machine Learning                            │  ← .tech-title (display font)
│                                              │
│  [Python]  [XGBoost]  [scikit-learn]        │  ← .tagrow > .tag pills
│  [SHAP]  [MLflow]  [FastAPI]                │
└──────────────────────────────────────────────┘
```

## Implementation

```html
<div class="tech-block">
  <div class="tech-title">Machine Learning</div>
  <div class="tagrow">
    <span class="tag">Python</span>
    <span class="tag">XGBoost</span>
    <span class="tag">scikit-learn</span>
    <span class="tag">SHAP</span>
    <span class="tag">MLflow</span>
    <span class="tag">FastAPI</span>
  </div>
</div>
```

Stack multiple `.tech-block` elements for multiple categories:
```html
<div class="tech-block">...</div>  <!-- ML -->
<div class="tech-block">...</div>  <!-- Data Engineering -->
<div class="tech-block">...</div>  <!-- Clinical & Research -->
```

## CSS (from global.css)
```css
.tech-block {
  padding: 40px 48px;
  border: 1px solid var(--graphite);
  border-bottom: 0;          /* stack flush */
}
.tech-block:last-child { border-bottom: 1px solid var(--graphite); }

.tech-title {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  color: var(--flare);        /* dark */ /* var(--ink) for paper */
  margin-bottom: 20px;
}

.tagrow { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }

.tag {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  padding: 6px 12px;
  background: transparent;
  color: var(--tungsten);          /* dark */
  border: 1px solid var(--graphite);
  transition: border-color 0.3s, color 0.3s;
}
.tag:hover {
  border-color: rgba(77,140,255,0.5);
  color: var(--platinum);
}

/* Paper band overrides */
.band--paper .tag { color: var(--ink-3); border-color: var(--paper-3); }
.band--paper .tag:hover { border-color: var(--ink-blue); color: var(--ink); }
```

## GSAP Reveal

`.tagrow` elements get scroll-triggered entrance via global.js:
```js
// In initScrollTriggers():
const reveals = band.querySelectorAll('.tagrow, ...');
tlBand.fromTo(reveals, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ... });
```
Tags start at `opacity: 0` and slide up on scroll — no manual reveal class needed.

## Design Tokens Applied
| Element | Dark Band | Paper Band |
|---------|-----------|------------|
| Block border | `--graphite` | `--paper-3` |
| Title | `--flare` | `--ink` |
| Tag text | `--tungsten` | `--ink-3` |
| Tag border | `--graphite` | `--paper-3` |
| Tag hover border | `rgba(77,140,255,0.5)` | `--ink-blue` |

## Source Reference
`index.html` → capabilities section. CSS in global.css → `.tech-block`, `.tech-title`, `.tagrow`, `.tag`.
