---
component: Infinite Carousel
id: INT-04
status: stable
category: interactive
interactivity: css-animation
source: index.html — featured projects section (.project-carousel)
---

## What It Does
An ambient, auto-scrolling horizontal carousel of project cards that loops infinitely using pure CSS animation — no JS for the motion. Project cards are dynamically injected from `projects_index.json` by global.js.

## When to Use
- Homepage featured projects section (its canonical use)
- Any "ambient showcase" context where the reader isn't expected to interact
- When you want content discovery to feel effortless rather than demanding

## When NOT to Use
- When the reader needs to choose between items deliberately (use a grid or filterable table)
- Inside article pages (too visually busy for a reading context)
- When card count is < 4 (visible repetition of the loop seam)

## The Two-Group DOM Trick
```html
<div class="project-carousel">
  <div class="carousel-track">
    <div class="carousel-group"><!-- cards --></div>   <!-- Group 1 -->
    <div class="carousel-group"><!-- same cards --></div>  <!-- Group 2: identical copy -->
  </div>
</div>
```
Two groups with identical content. The CSS animation moves the track left by exactly 50% + 12px (half-width + gap), which brings Group 2 into view at exactly the same moment Group 1 exits — creating a seamless infinite loop. No JS required for the motion itself.

## CSS Animation
```css
.carousel-track {
  display: flex;
  gap: 24px;
  min-width: max-content;
  animation: scrollMarquee 90s linear infinite;
  will-change: transform;
}
.carousel-track:hover { animation-play-state: paused; }

@keyframes scrollMarquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 12px)); }
  /* -50%: moves exactly one group width. -12px: accounts for gap. */
}
```
Duration `90s` at linear timing creates a slow, ambient drift. Shorter = more urgent. The `will-change: transform` hint keeps it on the GPU compositor thread.

The fade mask on container edges:
```css
.project-carousel {
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}
```

## Project Card Injection
global.js fetches `projects_index.json` and injects `.p-card` elements into both carousel groups. Articles don't need to manage this — it's automatic when the `.project-carousel` and `.carousel-group` structure is present.

## Card Structure (injected by global.js)
```html
<a class="p-card" href="{pathPrefix}{p.url}">
  <div class="p-content">
    <div class="p-eyebrow">{p.subtype}</div>
    <div class="p-title">{p.title}</div>
    <div class="p-desc">{p.desc.substring(0, 120)}...</div>
    <div class="p-link">Read Case Study →</div>
  </div>
</a>
```

## Design Tokens Applied
| Element | Token |
|---------|-------|
| `.p-card` background | `rgba(22,22,22,0.65)` (`--charcoal` at 65%) |
| `.p-card` border | `--graphite` |
| `.p-card:hover` border | `rgba(77,140,255,0.4)` |
| `.p-eyebrow` | `--tungsten` |
| `.p-title` | `--flare` |
| `.p-desc` | `--tungsten` |
| `.p-link` | `--phthalo-lift` |
| 3D tilt | Applied by global.js `attachTilt()` (±3°) |

## Source Reference
`index.html` → `.project-carousel` section. CSS animation in global.css → `@keyframes scrollMarquee`. Card injection in global.js section 8 (tilt) + homepage-specific JS.
