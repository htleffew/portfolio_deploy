> **STATUS**: References to `global.js` below are historical. Since 2026-06-05 the chrome injector lives in `global_chrome.js`; the same path-prefix detection logic now keys off `global_chrome.js` instead of `global.js`. Treat this document as the SAME contract, just renamed.

---
component: Global Nav
id: CHR-01
status: stable
category: chrome
interactivity: injected
source: global.js â€” initGlobalChrome() section 3
---

## What It Does
The fixed top navigation bar injected on every page by global.js. Contains brand link, search trigger, about, research library, and resume PDF links. Adapts between dark and paper modes as the reader scrolls.

## CRITICAL: Do Not Add Manually

**Never include `<nav>`, `<header id="topnav">`, or any navigation HTML in article files.**

global.js injects `#topnav` as `body.firstChild` on every page load. If you add your own nav, two navigation bars appear. The guard is:
```js
if (!document.getElementById('topnav')) { /* inject */ }
```

## What Gets Injected

```html
<header id="topnav">
  <a href="{pathPrefix}index.html" class="brand">Dr. Heather Leffew</a>
  <div class="nav-links">
    <button id="trigger-search">Search</button>
    <a href="{pathPrefix}about.html">About</a>
    <a href="{pathPrefix}projects-repository.html">Research Library</a>
    <a href="{pathPrefix}resume.pdf" target="_blank" class="nav-btn">Resume -></a>
  </div>
</header>
```

## pathPrefix Resolution

The nav uses `pathPrefix` â€” a root-relative path calculated from the global.js `<script>` src attribute:
```js
const src = gsScript.getAttribute('src');
// e.g. "../design_system/js/global.js"
const dsIndex = src.indexOf('design_system/js/global.js');
pathPrefix = src.substring(0, dsIndex);
// result: "../"
```
All nav links prepend `pathPrefix`. For root pages: `pathPrefix = "./"`. For subdirectory articles: `pathPrefix = "../"`.

## Dark / Paper Mode Toggle

The nav switches appearance when a `.band--paper` section becomes active (via IntersectionObserver in article JS):
```js
// Paper band active â†’ nav goes light
topnav.classList.add('is-paper');

// Dark band active â†’ nav goes dark
topnav.classList.remove('is-paper');
```

```css
#topnav {
  background: rgba(3,3,3,0.55);
  backdrop-filter: blur(14px) saturate(140%);
  color: var(--platinum);
  transition: background 0.6s, color 0.6s, border-color 0.6s;
}
#topnav.is-paper {
  background: rgba(245,245,247,0.82);
  border-bottom-color: rgba(0,0,0,0.08);
  color: var(--ink);
}
```

## Nav Anatomy
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Dr. Heather Leffew          Search   About   Research Library   Resume â†’ â”‚
â”‚  â†brand (display font)       â†â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ mono 11px 0.18em â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â†’ â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
  height: 60px | padding: 0 48px | z-index: 9999
```

## Entry Animation
GSAP slides nav in from `translateY(-100%)` on page load as part of the hero timeline:
```js
tl.to('#topnav', { y: 0, duration: 1.4, ease: 'power3.out' }, '-=2.8');
```
The nav starts off-screen and slides down after the preloader curtain opens.

## Design Tokens Applied
| Element | Dark Mode | Paper Mode |
|---------|-----------|------------|
| Background | `rgba(3,3,3,0.55)` | `rgba(245,245,247,0.82)` |
| Text | `--platinum` | `--ink` |
| Brand font | `--display`, 15px | same |
| Links font | `--mono`, 11px | same |
| Resume btn border | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.2)` |

## Source Reference
`global.js` â†’ `initGlobalChrome()` â†’ section 3 "Construct and Inject Top Navigation".
