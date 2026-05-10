---
component: Curtain Reveal
id: CIN-03
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: curtain-reveal.html
adaptation-status: token-mapped
---

## What It Does
A two-panel curtain that splits left and right to reveal content beneath — the same mechanic as the global preloader, but applied to in-page section transitions.

## When to Use In This Portfolio
- Dramatic entrance for a dark band following a light band (the contrast is already strong; a curtain amplifies it)
- Revealing a key visualization or data table after building narrative tension
- Section introductions where the reader should feel the "reveal" of an insight

## When NOT to Use
- More than once per article (loses impact through repetition)
- On sections the reader reaches by scrolling continuously (curtain works best at scroll landmarks)
- Do not apply to the hero section — global.js already owns the preloader curtain there

## Conflict Note: global.js Preloader
global.js uses `#preloader-left` and `#preloader-right` for the page-load curtain. **Do not reuse these IDs** for in-page curtains. Use unique IDs per curtain:

```html
<div id="curtain-section-3">
  <div id="curtain-3-left"></div>
  <div id="curtain-3-right"></div>
</div>
```

## Adapted Implementation

```html
<!-- Curtain wrapper — same dimensions as target section -->
<div id="curtain-results" style="position: relative; overflow: hidden;">

  <!-- Left panel -->
  <div id="curtain-results-left" style="
    position: absolute; top: 0; left: 0; bottom: 0; width: 50.5%;
    background: var(--obsidian); z-index: 10; will-change: transform;">
  </div>

  <!-- Right panel -->
  <div id="curtain-results-right" style="
    position: absolute; top: 0; right: 0; bottom: 0; width: 50.5%;
    background: var(--obsidian); z-index: 10; will-change: transform;">
  </div>

  <!-- Content revealed by curtain -->
  <section class="band band--dark" data-spine="Results" data-section="Results">
    <!-- section content -->
  </section>

</div>
```

```js
// Trigger curtain open when section enters viewport
ScrollTrigger.create({
  trigger: '#curtain-results',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('#curtain-results-left',  { xPercent: -100, duration: 1.1, ease: 'power3.inOut' });
    gsap.to('#curtain-results-right', { xPercent:  100, duration: 1.1, ease: 'power3.inOut' });
  },
  once: true  // only fires once — curtain doesn't close on scroll back
});
```

## Design Token Integration
```css
/* Curtain panels use obsidian — matching preloader for visual consistency */
background: var(--obsidian);  /* #030303 */
```

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/curtain-reveal.html`
