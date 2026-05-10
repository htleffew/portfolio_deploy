---
component: Reading Progress Bar
id: AMB-04
status: stable
category: ambient
interactivity: scroll-reactive
source: global.css #progress + article HTML + article JS
---

## What It Does
A 2px fixed bar at the very top of the viewport that fills left-to-right as the reader scrolls through the article — communicating reading position without a scrollbar.

## Required HTML Placeholder
Every article must include this empty div — the bar is rendered via CSS `::after` pseudo-element:
```html
<div id="progress"></div>
```
Place it near the top of `<body>`, before the first `<section>`.

## CSS
```css
#progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  z-index: 200;
  pointer-events: none;
  background: transparent;
}

#progress::after {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: var(--p, 0%);    /* CSS custom property updated by JS */
  background: linear-gradient(90deg, var(--phthalo-lift) 0%, var(--phthalo) 100%);
  transition: width 0.05s linear;
}
```

## JS Scroll Listener

```js
const updateProgress = () => {
  const scroll  = window.scrollY;
  const height  = document.documentElement.scrollHeight - window.innerHeight;
  const p = Math.min(100, Math.max(0, (scroll / height) * 100));
  document.getElementById('progress').style.setProperty('--p', p + '%');
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress(); // initialize at 0%
```

The `{ passive: true }` flag is mandatory — it tells the browser this listener won't call `preventDefault()`, allowing smooth scrolling without jank.

## The CSS Custom Property Pattern

```css
width: var(--p, 0%)
```

The bar width is driven by the `--p` custom property set inline by JS. This is faster than manipulating `element.style.width` because it only updates the CSS variable, not the element's style attribute directly. The `0%` fallback ensures the bar starts empty before JS runs.

`transition: width 0.05s linear` — tight enough to feel live but loose enough to not stutter on rapid scroll.

## Design Tokens Applied
| Element | Token |
|---------|-------|
| Bar start color | `--phthalo-lift` (#3866A0) |
| Bar end color | `--phthalo` (#0F3A6B) |
| Bar height | 2px |
| z-index | 200 (above bands at 1, below spine at 130, below nav at 9999) |
| Transition | 0.05s linear |

## Source Reference
CSS: `global.css` → `#progress` + `#progress::after`. JS: inline `<script>` in `multimodal-autism-ai.html` → `updateProgress()` + scroll listener.
