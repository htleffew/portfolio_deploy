---
component: Mesh Gradient
id: CIN-08
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: mesh-gradient.html
adaptation-status: token-mapped
---

## What It Does
An animated mesh gradient background — soft organic color blobs that shift slowly, creating a living atmospheric background texture.

## When to Use In This Portfolio
**Paper band atmosphere only.** The Three.js starfield provides ambient depth for dark bands. Paper bands (`.band--paper`) have 85% cream opacity over the starfield — the stars are barely visible. A subtle mesh gradient inside paper bands can provide equivalent atmospheric depth for the light context.

This is the **only cinematic component that is optional and band-specific.**

## When NOT to Use
- Dark bands (`.band--dark`) — the starfield already provides atmosphere; competing gradients create visual noise
- As the primary design element — it should be barely perceptible, like the grain overlay
- Saturated or bright colors — restrict to the cream/phthalo-lift palette range only

## Palette Constraint
The mesh gradient for this portfolio must use only cream and phthalo tones:
```css
--mesh-color-1: rgba(245, 245, 247, 0.6);   /* --paper at 60% */
--mesh-color-2: rgba(56, 102, 160, 0.04);   /* --phthalo-lift at 4% */
--mesh-color-3: rgba(245, 245, 247, 0.8);   /* --paper at 80% */
--mesh-color-4: rgba(26, 58, 107, 0.03);    /* --ink-blue at 3% */
```
Never use saturated colors (red, green, yellow) in the mesh. The effect should read as "atmospheric texture," not "colorful background."

## Adapted Implementation

```css
/* Applied to .band--paper sections that benefit from depth */
.band--paper.has-mesh {
  background: rgba(245,245,247,0.85);
  position: relative;
  overflow: hidden;
}

.band--paper.has-mesh::before {
  content: '';
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(56,102,160,0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(245,245,247,0.8) 0%, transparent 40%),
    radial-gradient(ellipse at 60% 80%, rgba(26,58,107,0.04) 0%, transparent 45%);
  animation: mesh-drift 20s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

@keyframes mesh-drift {
  0%   { transform: translate(0%, 0%) rotate(0deg); }
  33%  { transform: translate(3%, -2%) rotate(2deg); }
  66%  { transform: translate(-2%, 3%) rotate(-1deg); }
  100% { transform: translate(1%, -1%) rotate(1deg); }
}

/* Ensure content sits above the mesh */
.band--paper.has-mesh > * { position: relative; z-index: 1; }
```

## HTML Usage
```html
<!-- Add has-mesh class to paper bands that need atmospheric depth -->
<section class="band band--paper has-mesh" data-spine="Results" data-section="Results">
  <!-- content -->
</section>
```

## Performance Note
The `::before` pseudo-element with `animation` on a large element can cause repaints. Add `will-change: transform` to the `::before` to keep animation on the compositor thread.

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/mesh-gradient.html`
