---
component: Chapter Spine
id: CHR-04
status: stable
category: chrome
interactivity: injected + scroll-reactive
source: global.js + article HTML (data-spine attributes)
---

## What It Does
A fixed left-sidebar navigation that shows the article's sections as a vertical list of tick-marks and labels. The active section's tick extends and glows as the reader scrolls. Clicking a label jumps to that section.

## THIS IS WHY `data-spine` IS MANDATORY

The spine is populated by reading `data-spine` attributes from every `section.band`. Without `data-spine`, the spine renders empty.

```html
<!-- Required on every section — no exceptions -->
<section class="band band--dark" data-spine="Short Label" data-section="Full Name">
```

## HTML Placeholder Required

Articles must include this empty `<aside>` — global.js populates it:
```html
<aside id="spine"></aside>
```

## What Gets Injected Into `#spine`

For each `section.band` with a `data-spine` attribute:
```html
<div class="row">
  <span class="num">01</span>
  <div class="tick"></div>
  <span class="label">Short Label</span>
</div>
```

## Visual Design
```
  01 ─── Overview         ← .row (inactive: tick 16px wide, opacity 0.35)
  02 ──────── The Flaw    ← .row.is-active (tick 28px wide, opacity 1, --phthalo-lift)
  03 ─── Preprocessing
  04 ─── Stage 1
  05 ─── Synthesis
```

## CSS
```css
#spine {
  position: fixed;
  left: 18px; top: 50%;
  transform: translateY(-50%);
  z-index: 130;
  display: flex; flex-direction: column; gap: 14px;
  padding: 18px 14px;
  background: rgba(3,3,3,0.45);
  backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(255,255,255,0.08);
  transition: opacity 0.6s, transform 0.6s, background 0.6s, color 0.6s;
}

/* Auto-hide when hero (first section) is active */
#spine:has(.row:first-child.is-active) {
  opacity: 0; pointer-events: none;
  transform: translateY(-50%) translateX(-20px);
}

#spine.is-paper {
  background: rgba(245,245,247,0.78);
  border-color: rgba(0,0,0,0.10);
  color: var(--ink);
}

.tick {
  width: 16px; height: 1px;
  background: currentColor; opacity: 0.35;
  transition: width 0.35s cubic-bezier(0.16,1,0.3,1),
              opacity 0.35s;
}
.row.is-active .tick { width: 28px; opacity: 1; background: var(--phthalo-lift); }
.label {
  font-family: var(--mono); font-size: 9.5px;
  letter-spacing: 0.18em; text-transform: uppercase;
  opacity: 0.55; transition: opacity 0.35s; white-space: nowrap;
}
.row:hover .label, .row.is-active .label { opacity: 1; }
```

## Active Section Detection

IntersectionObserver watches each `section.band` at `threshold: 0.3`. When a section enters view at >30% visibility, its corresponding `.row` gets `is-active`. Paper bands also add `is-paper` to `#spine` (and `#topnav`).

```js
const observer = new IntersectionObserver(entries => {
  if (e.isIntersecting) {
    [...spine.children].forEach(c => c.classList.remove('is-active'));
    row.classList.add('is-active');
    if (e.target.classList.contains('band--paper')) {
      spine.classList.add('is-paper');
    } else {
      spine.classList.remove('is-paper');
    }
  }
}, { threshold: 0.3 });
```

## Responsive Behavior
- Hidden entirely at `max-width: 1180px` — spine only shows on wide desktop
- Between 1180px–1360px: collapses to 44px wide, expands to full width on hover
- At ≥1360px: always full width

## Design Tokens Applied
| Element | Dark Mode | Paper Mode |
|---------|-----------|------------|
| Background | `rgba(3,3,3,0.45)` | `rgba(245,245,247,0.78)` |
| Border | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.10)` |
| Active tick | `--phthalo-lift` | `--ink-blue` |
| Number | `--mono`, 9px, opacity 0.4 | same |
| Label | `--mono`, 9.5px, tracking 0.18em | same |

## Source Reference
`global.js` → article JS inline `<script>` (multimodal-autism-ai.html) → IntersectionObserver spine population. CSS in global.css → `#spine`, `.row`, `.tick`, `.label`.
