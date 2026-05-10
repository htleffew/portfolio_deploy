---
component: Scroll Cue Drip
id: AMB-03
status: stable
category: ambient
interactivity: scroll-reactive
source: global.css .scroll-cue + global.js orchestration
---

## What It Does
A subtle "SCROLL" label and animated dripping line at the bottom of the hero section — fades in at the end of the hero entrance sequence and fades out when the reader starts scrolling.

## Required HTML
Must be placed inside the `.hero` or `.front` section, with `position: absolute`:

```html
<section class="band band--dark front" ...>
  <div class="col-wide">
    <!-- hero content -->
  </div>

  <!-- Scroll cue — positioned absolute within .front -->
  <div class="scroll-cue">
    <span>Scroll</span>
    <div class="scroll-cue-line"></div>
  </div>
</section>
```

## CSS
```css
.scroll-cue {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;        /* starts invisible — GSAP fades in */
  z-index: 5;
}

.scroll-cue span {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--tungsten);
}

.scroll-cue-line {
  width: 1px;
  height: 48px;
  position: relative;
  overflow: hidden;
}

.scroll-cue-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--phthalo-lift));
  animation: scrollDrip 2s ease-in-out infinite;
}

@keyframes scrollDrip {
  0%   { top: -100%; opacity: 0; }
  30%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
```

## GSAP Lifecycle

**Fade IN** — at end of hero entrance timeline (global.js):
```js
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) tl.to(scrollCue, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.3');
```
The cue appears last, after the H1 animation and abstract have settled.

**Fade OUT** — ScrollTrigger when reader scrolls 120px past hero top:
```js
gsap.to('.scroll-cue', {
  opacity: 0, y: -10, duration: 0.6, ease: 'power2.in',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=120',
    scrub: true
  }
});
```
The cue dissolves as the reader begins scrolling — it has served its purpose.

## Design Tokens Applied
| Element | Token |
|---------|-------|
| "SCROLL" text | `--tungsten` (#A1A1A6), mono 9px, tracking 0.35em |
| Drip gradient end | `--phthalo-lift` (#3866A0) |
| Drip gradient start | transparent |
| Animation duration | 2s, ease-in-out, infinite |

## Source Reference
CSS: `global.css` → `.scroll-cue`, `.scroll-cue-line`, `@keyframes scrollDrip`. GSAP: `global.js` → `doTimeline()` hero sequence + `initScrollTriggers()`.
