---
component: Film Grain Overlay
id: AMB-02
status: stable
category: ambient
interactivity: none
source: global.js section 2.5 + global.css #grain
---

## What It Does
A fixed-position SVG noise texture tiled across the entire viewport at near-invisible opacity — providing subliminal film texture without any conscious perception of grain.

## CRITICAL: Do Not Add Manually
Injected by global.js as `body.firstChild`. Guard: `if (!document.getElementById('grain'))`.

## What Gets Injected
```html
<div id="grain" aria-hidden="true"></div>
```

## CSS
```css
#grain {
  position: fixed;
  inset: 0;
  z-index: 9998;           /* above everything except search overlay (10000) */
  pointer-events: none;
  opacity: 0.022;           /* below conscious perception threshold */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;     /* tiled at 200×200 */
  animation: grain-drift 0.3s steps(1) infinite;
}

@keyframes grain-drift {
  0%   { background-position: 0 0; }
  25%  { background-position: -3% -2%; }
  50%  { background-position: 2% 3%; }
  75%  { background-position: -1% 1%; }
  100% { background-position: 1% -2%; }
}
```

## Why `steps(1)` Not `linear`

`animation-timing-function: steps(1)` creates **discrete jumps** between positions — the background position snaps instantly rather than sliding. This is what makes it feel like film grain (random frame-by-frame noise) rather than a texture sliding across the screen. If you change `steps(1)` to `linear`, the effect looks like a moving watermark.

## The SVG Noise Filter

The inline SVG uses `feTurbulence` with:
- `type="fractalNoise"` — organic, non-repeating texture
- `baseFrequency="0.75"` — fine grain (higher = finer)
- `numOctaves="4"` — complexity/detail layers
- `stitchTiles="stitch"` — seamless tiling at edges

## Why `opacity: 0.022`

At 0.022 (2.2%), the grain is below the threshold of direct perception but above zero. The human eye registers it as "this feels like film" without being able to articulate why. At 0.05+, it becomes distracting. At 0.01-, it's imperceptible (defeats the purpose).

## z-index Context
```
z-index: 10000  → #search-overlay (above grain)
z-index:  9999  → #topnav
z-index:  9998  → #grain (below nav, above all content)
z-index:   130  → #spine
z-index:   200  → #progress
z-index:     1  → .band (page content)
z-index:     0  → #glCanvas (WebGL)
```

## Source Reference
`global.js` → `initGlobalChrome()` section 2.5. CSS: `global.css` → `#grain` + `@keyframes grain-drift`.
