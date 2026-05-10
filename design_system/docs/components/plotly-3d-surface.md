---
component: Plotly 3D Surface
id: VIZ-03
status: stable
category: charts
interactivity: plotly-3d
source: account-prioritization.html — Section 04 (plot-3d-regression)
---

## What It Does
Renders an interactive 3D surface plot showing a regression prediction plane over two feature axes, with scatter points overlaid to show actual data vs. predicted surface.

## When to Use
- Visualizing a regression model's learned surface over two continuous features
- Showing how deal size / continuous outcome varies across two key predictors
- When 3D exploration adds genuine insight (e.g., non-linear interaction between features)
- As the "wow" visualization in a section — high visual impact, earns its complexity

## When NOT to Use
- Mobile-primary audiences — 3D Plotly degrades severely on small screens (fallback: use 2D heatmap)
- When the insight is a single number (use stat trio instead)
- When the surface is nearly flat — a 2D line chart communicates better
- More than 2 feature axes — 3D can't show 3+ features simultaneously

## Mobile Fallback
If the article will be read on mobile, replace the 3D surface with a 2D heatmap:
```js
type: 'heatmap',
colorscale: 'Blues',
```
The same data works for both. Test at 375px viewport width — if the 3D chart clips or controls overlap content, switch to heatmap.

## Anatomy
```
┌─────────────────────────────────────┐
│  Title: "Predicted Deal Size (USD)" │
│                                     │
│         ╱╲     ← Peak              │
│        ╱  ╲    (high revenue tier  │
│       ╱    ╲    + high engagement) │
│  ────╱──────╲──────────────────    │
│  Revenue Tier  Engagement Score    │
│   ● ● ●  ← scatter: actual data    │
└─────────────────────────────────────┘
```

## Plotly Configuration

```js
// Surface (regression plane)
const trace3D = {
  z: zPlane,   // 2D array [rows][cols] of predicted values
  x: xRev,    // Revenue tier axis values [1,2,3,4,5]
  y: yEng,    // Engagement score axis values [1,2,3,4,5]
  type: 'surface',
  colorscale: 'Blues',
  opacity: 0.8,
  showscale: false
};

// Scatter (actual data points)
const traceScat = {
  x: [2, 4, 1, 5, 3],
  y: [1, 5, 2, 4, 3],
  z: [3000, 45000, 1500, 60000, 12000],
  mode: 'markers',
  type: 'scatter3d',
  marker: {
    color: '#FFFFFF',        // --flare: white dots stand out on blue surface
    size: 5,
    symbol: 'circle',
    line: { color: '#3866A0', width: 1 }  // --phthalo-lift outline
  }
};

Plotly.newPlot('plot-3d-regression', [trace3D, traceScat], {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#A1A1A6', family: "'JetBrains Mono', monospace" },
  title: { text: 'Predicted Deal Size (USD)', font: { color: '#FFFFFF' } },
  scene: {
    xaxis: { title: 'Revenue Tier' },
    yaxis: { title: 'Engagement Score' },
    zaxis: { title: 'Deal Size $' },
    camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }  // EXACT angle — do not change
  },
  margin: { t: 50, b: 0, l: 0, r: 0 }
}, { displayModeBar: false });
```

## The Camera Position

```js
camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
```

This is the exact camera angle that shows the surface clearly:
- `x: 1.5, y: 1.5` — 45° diagonal view from the front-right
- `z: 1.2` — slightly elevated, showing surface topology without looking straight down
- Do not change this. Lower z values obscure the surface; higher z makes it look flat.

## Building the Z Plane

For an exponential-style regression surface (matches the article):
```js
const xRev = [1, 2, 3, 4, 5];
const yEng = [1, 2, 3, 4, 5];
let zPlane = [];
for (let i = 0; i < xRev.length; i++) {
  let row = [];
  for (let j = 0; j < yEng.length; j++) {
    row.push(Math.exp(0.5 * xRev[i] + 0.3 * yEng[j]) * 1000);
  }
  zPlane.push(row);
}
```
Replace coefficients (0.5, 0.3) with your actual model coefficients. The `* 1000` scaling factor depends on your target variable's magnitude.

## Design Tokens Applied
| Config | Token | Value |
|--------|-------|-------|
| `colorscale` | — | `'Blues'` (Plotly built-in, aligns with phthalo palette) |
| `marker.color` | `--flare` | #FFFFFF |
| `marker.line.color` | `--phthalo-lift` | #3866A0 |
| `font.color` | `--tungsten` | #A1A1A6 |
| `title.font.color` | `--flare` | #FFFFFF |

## Generalization
Works for any regression model with 2 continuous features. The Z plane grid size can expand (e.g., 10×10 for smoother surface), but keep scatter points sparse — 5–10 actual data points are enough to show residuals. Wrap in `.figure > .frame` with transparent background.

## Source Reference
`account-prioritization.html` → `Plotly.newPlot('plot-3d-regression', ...)` in `DOMContentLoaded` handler.
