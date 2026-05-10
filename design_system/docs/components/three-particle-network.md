---
component: Three.js Particle Network
id: AMB-01
status: stable
category: ambient
interactivity: WebGL + mouse
source: global.js — cinematic engine (lines 1–240)
---

## What It Does
A three-layer interactive WebGL particle network rendered on a fixed canvas (#glCanvas) that sits behind all page content. Agents don't choose to include it — it is always present. Understanding it is necessary to avoid breaking it.

## Architecture — Three Rendering Layers in One WebGL Pass

All three layers share a single Three.js scene, renderer, and animation loop. They composite automatically via AdditiveBlending.

### Layer 1: Background Starfield
- `STAR_N = 300` static background stars scattered across a large volume
- Size: `2.0` world units | Barely drift | Pure atmosphere
- Colors: 35% `colFlare` (#FFFFFF), 65% `colPhthalolift` (#3866A0) lerped toward white
- Luminosity: `0.40–0.85` — bright enough to show through translucent bands
- Material: `PointsMaterial`, `AdditiveBlending`, `depthWrite: false`

### Layer 2: Interactive Network Nodes
- `NODE_N = 60` larger drifting points with mouse repulsion
- Size: `5.5` world units | Luminosity: `0.80–1.0`
- Per-node drift velocity: `nodeVel` array — max `0.04` world units/frame (x/y), `0.01` (z)
- Material: `PointsMaterial`, `AdditiveBlending`, `opacity: 0.95`

### Layer 3: Connection Filaments
- `MAX_SEG = 700` dynamic line segments rebuilt every frame
- Material: `LineBasicMaterial`, `AdditiveBlending`, `opacity: 0.45`

## The Physics System

### Drift
Each node has an independent velocity vector (`nodeVel`) initialized at random:
```js
nodeVel[i*3]   = (Math.random() - 0.5) * 0.04;  // x: ±0.02 max
nodeVel[i*3+1] = (Math.random() - 0.5) * 0.04;  // y: ±0.02 max
nodeVel[i*3+2] = (Math.random() - 0.5) * 0.01;  // z: ±0.005 max (shallower)
```

### Mouse Repulsion
```js
const MOUSE_D2 = 70 * 70;  // squared threshold
const dmx = x - mWX, dmy = y - mWY;
const dm2 = dmx*dmx + dmy*dmy;
if (dm2 < MOUSE_D2) {
  const f = (MOUSE_D2 - dm2) / MOUSE_D2 * 0.0035;  // force magnitude
  const a = Math.atan2(dmy, dmx);
  nodeVel[i*3]   += Math.cos(a) * f;
  nodeVel[i*3+1] += Math.sin(a) * f;
}
```
Force falls off quadratically from center of repulsion zone. Nodes accelerate away from cursor.

### Velocity Damping
```js
nodeVel[i*3]   *= 0.979;  // x/y: ~50% velocity retained after 30 frames
nodeVel[i*3+1] *= 0.979;
nodeVel[i*3+2] *= 0.992;  // z: slower damping — weightless feeling
```

### Soft Boundary Reflection
```js
if (x >  120 || x < -120) { nodeVel[i*3]   *= -1; x = Math.max(-120, Math.min(120, x)); }
if (y >  120 || y < -120) { nodeVel[i*3+1] *= -1; y = Math.max(-120, Math.min(120, y)); }
if (z >   40 || z <  -40) { nodeVel[i*3+2] *= -1; z = Math.max( -40, Math.min( 40, z)); }
```
Nodes bounce off invisible walls at ±120 (x/y) and ±40 (z). Clamping prevents escape.

## The Connection System
```js
const CONNECT_D2 = 58 * 58;  // connection distance threshold
const t = 1.0 - d2 / CONNECT_D2;  // proximity factor 0→1

// Glow boost when filament midpoint near cursor
const md2 = (midX-mWX)**2 + (midY-mWY)**2;
const glow = md2 < MOUSE_D2 ? (1.0 - md2/MOUSE_D2) * 0.65 : 0;

const lum = Math.pow(t, 1.8) * 0.55 + glow;  // luminosity
```

Mouse-to-node direct filaments drawn when `dm2 < MOUSE_D2 * 0.45` (very close):
```js
alpha = 1.0 - dm2 / (MOUSE_D2 * 0.45);
lum = alpha * 0.75;
```

## Camera Parallax
```js
camera.position.x += (mX * 22 - camera.position.x) * 0.035;
camera.position.y += (mY * 22 - camera.position.y) * 0.035;
camera.lookAt(0, 0, 0);
```
Lerp factor `0.035` — smooth, never snappy. `22` world units of total travel range.

## Color Mapping (CSS Tokens → Three.js)
| CSS Token | Hex | Three.js Constant | Role |
|-----------|-----|-------------------|------|
| `--phthalo` | #0F3A6B | `colPhthalo` / `baseC` | Filament base color |
| `--phthalo-lift` | #3866A0 | `colPhthalolift` / `highC` | Node color, filament glow |
| `--tungsten` | #A1A1A6 | `colTungsten` | Available, unused currently |
| `--flare` | #FFFFFF | `colFlare` | 35% of stars |

## Self-Bootstrapping
```js
(function launchCinematicEngine() {
  // 1. Inject #glCanvas if missing
  // 2. If THREE defined → initCinematicEngine()
  // 3. Else → load three.min.js r128 → then init
})();
```
**Only Three.js core r128 loaded.** PostProcessing, OrbitControls — NOT available.

## Performance Settings
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))` — capped at 1.5×
- `antialias: false` — GPU performance
- `alpha: true` — transparent canvas background
- `nodeMesh.rotation.y += 0.00025` — imperceptibly slow ambient rotation

## Failure Modes
| Symptom | Cause | Fix |
|---------|-------|-----|
| Black canvas | Duplicate Three.js load | Remove any manual Three.js script tags |
| No particles | `#glCanvas` not found | Auto-injected; ensure `body` exists before script runs |
| Wrong canvas size | `onResize()` not firing | Check for CSS `transform: scale` on body or html |
| Stutter on scroll | `backdrop-filter` over canvas | Never add backdrop-filter to elements animating over canvas |

## Source Reference
`global.js` → `const initCinematicEngine = () => { ... }` + `launchCinematicEngine()` IIFE.
