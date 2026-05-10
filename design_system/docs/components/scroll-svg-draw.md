---
component: Scroll SVG Draw
id: CIN-02
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: scroll-svg-draw.html
adaptation-status: token-mapped
---

## What It Does
SVG paths animate their `stroke-dashoffset` from full (invisible) to zero (fully drawn) as the reader scrolls — creating a "self-drawing" diagram effect. Transforms static SVG diagrams into scroll-driven reveals.

## When to Use In This Portfolio
**HIGH VALUE.** The SVG hierarchy tree (FIG.02) and temporal sequence (FIG.05) in multimodal-autism-ai.html are currently static. Applying this component would make them draw themselves as the reader arrives — dramatically improving the pedagogical impact.

Apply to:
- `DIA-01` SVG Hierarchy Tree — paths draw as architecture is explained
- `DIA-02` SVG Temporal Sequence — timeline appears then event markers pop in
- Any `<path>` or `<line>` element in a `.figure` block

## When NOT to Use
- Diagrams that are small or simple (< 3 paths) — the draw effect needs complexity to pay off
- Text-heavy SVGs (text elements don't support dashoffset animation)
- When the diagram must be immediately readable (waitlisted reader context)

## Original Implementation Summary
Uses `stroke-dasharray` set to the path's total length, and `stroke-dashoffset` animated from full-length to 0 via GSAP ScrollTrigger.

## Adapted Implementation

```js
// Apply to any SVG in a .figure block
function initSVGDraw(figureEl) {
  const paths = figureEl.querySelectorAll('path, line, circle, rect');

  paths.forEach((path, i) => {
    const length = path.getTotalLength ? path.getTotalLength() : 200;
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      delay: i * 0.08,   // stagger each path
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: figureEl,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// Initialize after GSAP + ScrollTrigger are loaded
document.querySelectorAll('.figure').forEach(initSVGDraw);
```

## Design Token Integration
```css
/* Paths must have explicit stroke to animate */
svg path, svg line {
  stroke: var(--phthalo-lift);   /* or hardcoded #3866A0 for SVG context */
  fill: none;
}
```

## Specific ScrollTrigger Config for Path Length Calculation
```js
// getTotalLength() only works on path, polyline, polygon, line, circle elements
// For rect: calculate perimeter manually = 2 * (width + height)
const rectLength = 2 * (parseFloat(el.getAttribute('width')) +
                        parseFloat(el.getAttribute('height')));
```

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/scroll-svg-draw.html`
