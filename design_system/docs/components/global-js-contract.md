# global.js Contract
> Complete documentation of what global.js does. The most critical system file — agents must understand this to avoid breaking the site.

---

## Overview

`design_system/js/global.js` is a single self-bootstrapping file containing three engines that run on every page. It has zero external dependencies that need to be manually loaded — it lazy-loads everything it needs.

**Load it exactly once, as the last script before `</body>`:**
```html
<script src="../design_system/js/global.js" defer></script>
```

---

## Engine 1: Cinematic WebGL Engine

**Lines:** ~1–240 of global.js  
**Execution:** Runs immediately on `DOMContentLoaded`; lazy-loads Three.js r128 first if absent.

### What It Does
Renders a three-layer interactive particle network on a fixed canvas (`#glCanvas`) that sits behind all page content at `z-index: 0`.

### Three Rendering Layers

**Layer 1 — Background Starfield**
- `STAR_N = 300` static background stars
- Size: `2.0` world units; barely move; pure atmosphere
- Colors: 35% `colFlare` (#FFFFFF), 65% `colPhthalolift` (#3866A0) lerped toward white
- Luminosity: `0.40–0.85` (bright enough to show through translucent bands)
- Material: `THREE.PointsMaterial`, `AdditiveBlending`, `depthWrite: false`

**Layer 2 — Interactive Network Nodes**
- `NODE_N = 60` larger, brighter drifting points
- Size: `5.5` world units; luminosity `0.80–1.0`
- Per-node drift velocity: `nodeVel` array, max `0.04` world units/frame (x/y), `0.01` (z)
- Mouse repulsion: activates within `MOUSE_D2 = 70²` units; force = `(MOUSE_D2 - dist²) / MOUSE_D2 × 0.0035`
- Velocity damping: `×0.979` per frame (x/y), `×0.992` (z — slower to feel weightless)
- Soft boundary: reflects at `±120` (x/y) and `±40` (z)
- Material: `THREE.PointsMaterial`, `AdditiveBlending`, `opacity: 0.95`

**Layer 3 — Connection Filaments**
- `MAX_SEG = 700` dynamic line segments; rebuilt every frame
- Connection threshold: `CONNECT_D2 = 58²` world units
- Proximity factor: `t = 1.0 - d²/CONNECT_D2` → drives filament luminosity
- Glow boost: filament midpoint within `MOUSE_D2` radius adds `0.65` luminosity boost
- Mouse-to-node direct filaments: drawn when `dm2 < MOUSE_D2 × 0.45`, alpha `0.75`
- Color: `colPhthalo` (#0F3A6B) lerped toward `colPhthalolift` (#3866A0) by proximity factor
- Material: `THREE.LineBasicMaterial`, `AdditiveBlending`, `opacity: 0.45`

### Camera Parallax
```js
camera.position.x += (mX * 22 - camera.position.x) * 0.035;
camera.position.y += (mY * 22 - camera.position.y) * 0.035;
```
Lerp factor `0.035` toward mouse × `22` world units — gentle cinematic drift.

### Color Mapping (CSS tokens → Three.js)
| Token | Hex | Three.js Constant | Used For |
|-------|-----|-------------------|----------|
| `--phthalo` | #0F3A6B | `colPhthalo` / `baseC` | Connection filament base color |
| `--phthalo-lift` | #3866A0 | `colPhthalolift` / `highC` | Node color, filament glow |
| `--tungsten` | #A1A1A6 | `colTungsten` | (available, not currently used) |
| `--flare` | #FFFFFF | `colFlare` | Star bright fraction (35%) |

### Self-Bootstrapping Behavior
```js
(function launchCinematicEngine() {
    // 1. Inject #glCanvas if absent
    // 2. If THREE defined → run initCinematicEngine
    // 3. If THREE absent → load three.min.js r128 from cdnjs → then run
})();
```
**Only Three.js core r128 is loaded.** PostProcessing, OrbitControls, and other Three.js extras are NOT available and will throw if referenced.

### Performance Settings
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))` — capped at 1.5
- `antialias: false` — performance over quality
- `alpha: true` — transparent background so page background (#030303 on `html`) shows through

### Failure Modes
| Symptom | Cause |
|---------|-------|
| Black canvas, console error | Duplicate Three.js load (competing WebGL contexts) |
| Canvas correct size but blank | `#glCanvas` injected after DOMContentLoaded fired |
| Nodes visible, filaments missing | `MAX_SEG` budget exceeded (unlikely with <60 nodes) |
| Canvas wrong size on mobile | `onResize()` not firing; ensure no `transform: scale` on `body` |

---

## Engine 2: Global Chrome Injector

**Lines:** ~245–490 of global.js  
**Execution:** IIFE runs synchronously on script parse.

### pathPrefix Resolution
```js
const gsScript = document.querySelector('script[src*="global.js"]');
const src = gsScript.getAttribute('src');
const dsIndex = src.indexOf('design_system/js/global.js');
pathPrefix = src.substring(0, dsIndex);
```
This extracts the path to the portfolio root from the script's own `src` attribute. For an article at `Account_Prioritization/account-prioritization.html` loading `../design_system/js/global.js`, `pathPrefix` resolves to `../`. All injected links (nav, footer, search results) use `pathPrefix + relative-url`.

### Elements Injected

**2.5 — Film Grain Overlay**
```html
<div id="grain" aria-hidden="true"></div>
```
Inserted as `body.firstChild`. Styled entirely in CSS: SVG `feTurbulence` noise, `opacity: 0.022`, `background-size: 200px`, `animation: grain-drift 0.3s steps(1) infinite`.

**3 — Top Navigation**
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
Inserted as `body.firstChild`. Guard: `if (!document.getElementById('topnav'))`.

**4 — Site Footer**
```html
<footer class="site-foot">
  <div class="lf">Dr. Heather Leffew © 2026</div>
  <div class="rt">
    <a href="{pathPrefix}projects-repository.html">Research Library</a>
    <a href="https://linkedin.com/in/heathertleffew" target="_blank">LinkedIn</a>
  </div>
</footer>
```
Appended to `body`. Guard: `if (!document.querySelector('footer.site-foot'))`.

**5 — Search Overlay**
```html
<div id="search-overlay">
  <button id="search-close">Close [X]</button>
  <div id="search-input-container">
    <input type="text" id="search-input" placeholder="Search architecture, case studies, frameworks...">
  </div>
  <div id="search-results"></div>
</div>
```
Lazy-loads `projects_index.json` on first open. Searches across `title`, `desc`, `cat`, `tags` simultaneously. Results link to `pathPrefix + p.url`. Closes on ESC key.

**6 — Recommendation Grid & Next Article**
Reads `#recommendation-grid` and `#next-chap-link` from DOM. If found, fetches `projects_index.json`, filters out current article by URL path, picks 3 random articles for grid, picks first for next-chapter link.

**8 — 3D Tilt on Cards**
Applied to: `.p-card, .r-card, .edu-card, .bio-card`  
Formula: `rotateX = ((y - centerY) / centerY) × -3`, `rotateY = ((x - centerX) / centerX) × 3`  
The ±3° constraint keeps tilt subtle — enough to feel physical, not enough to obscure content.  
MutationObserver watches for new cards added dynamically.

**9 — Audio Feedback**
Web Audio API sine wave triggered on any `click` on `button, a, .p-card, .bio-expand-btn, .r-card, .db-row`:
```js
osc.frequency.setValueAtTime(200, audioCtx.currentTime);
osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
gain.gain.setValueAtTime(0.02, audioCtx.currentTime);  // subtle
// Duration: 80ms
```

---

## Engine 3: GSAP Orchestration

**Lines:** ~495–709 of global.js  
**Execution:** IIFE; lazy-loads GSAP 3.12.5, ScrollTrigger, Lenis 1.0.29, SplitType; runs on `window.load`.

### Dependencies Loaded
```
gsap.min.js          — cdnjs 3.12.5
ScrollTrigger.min.js — cdnjs 3.12.5
lenis.min.js         — jsdelivr studio-freight 1.0.29
split-type           — unpkg
```

### Preloader Timeline
If `#preloader`, `#preloader-left`, `#preloader-right`, `#preloader-line` exist:
1. `#preloader-line` grows to `28vh` (1.1s, power2.inOut)
2. Line fades + grows to `50vh` (0.6s)
3. Left and right curtains slide off screen (1.1s, power3.inOut)
4. `#preloader` set to `display:none`

If only `#preloader` (no curtain panels): simple opacity fade.

### Hero Entrance Sequence (after preloader)
1. `#glCanvas` fades to opacity:1 over 3.5s
2. `#topnav` slides in from `translateY(-100%)` over 1.4s
3. `.meta-row span` elements stagger in (opacity + x)
4. Hero H1 split by SplitType chars — staggered rotateX + y animation
5. `.hero-rule` width expands to 64px
6. `.abstract` fades up
7. `.scroll-cue` fades in last

### Scroll Triggers (after hero completes)
- **Scroll cue fadeout:** `.scroll-cue` fades when reader scrolls 120px past hero top
- **Band reveals:** Each `.band` triggers when `top 75%` — eyebrow slides in from left, heading fades up from y:25, then `.type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout` stagger up from y:40
- **Generic reveals:** `.reveal, .ds-prose` elements trigger at `top 85%`

### Disable Flag
```js
if (window.disableGlobalOrchestration) return;
```
Set `window.disableGlobalOrchestration = true` before loading global.js to suppress GSAP entirely (useful for testing).

### HTML Placeholders Required by GSAP
Articles using the preloader must include:
```html
<div id="preloader">
  <div id="preloader-left"></div>
  <div id="preloader-right"></div>
  <div id="preloader-line"></div>
</div>
```
