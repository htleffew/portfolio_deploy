---
component: Text Mask Reveal
id: CIN-05
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: text-mask.html
adaptation-status: token-mapped
---

## What It Does
A headline fills with color as the reader scrolls — text starts as an outline/gray and saturates to full color as the element passes through the viewport.

## When to Use In This Portfolio
**For H2 section headings only.** Apply to `<h2>` elements in content sections when you want to add kinetic energy to a major insight heading.

Do NOT apply to H1 hero headings — those already use GSAP SplitType char animation (global.js). Stacking two entrance effects on one element creates visual noise.

## When NOT to Use
- Hero H1 (owned by GSAP SplitType in global.js)
- Body text or paragraphs
- Eyebrow labels (too small for the effect to read)
- Paper band H2s (color fill works best against dark backgrounds)

## Adapted Implementation

```css
/* Base state: text starts unfilled */
.text-mask-h2 {
  background: linear-gradient(
    90deg,
    var(--flare) var(--fill, 0%),
    var(--tungsten) var(--fill, 0%)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Fallback for browsers without background-clip: text */
  color: var(--flare);
}
```

```js
// Apply to target H2 elements
document.querySelectorAll('h2.text-mask-h2').forEach(el => {
  gsap.to(el, {
    '--fill': '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      end: 'top 40%',
      scrub: true    // fill tracks scroll position
    }
  });
});
```

## HTML Usage
```html
<!-- Add class to target H2 headings only -->
<h2 class="text-mask-h2">Interpreting the Results and Overfitting Warnings</h2>
```

## Design Token Integration
```css
/* Dark band: flare → tungsten fill */
.band--dark .text-mask-h2 {
  background: linear-gradient(90deg, var(--flare) var(--fill, 0%), var(--tungsten) var(--fill, 0%));
}

/* Paper band variant: ink → ink-3 */
.band--paper .text-mask-h2 {
  background: linear-gradient(90deg, var(--ink) var(--fill, 0%), var(--ink-3) var(--fill, 0%));
}
```

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/text-mask.html`
