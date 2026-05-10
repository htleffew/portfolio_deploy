---
component: SVG Abstract Thumbnail
id: DAT-04
status: stable
category: data-display
interactivity: none
source: projects_index.json — visual fields
---

## What It Does
Small inline SVG strings stored in `projects_index.json` that serve as visual thumbnails for project cards, the carousel, and the repository dashboard. Each SVG communicates the article's analytical category through a recognizable abstract motif.

## Standard Dimensions
- `viewBox="0 0 600 600"` — square, 600×600 units
- Rendered at various sizes: 420×280 in carousel cards, 160×100 in repository thumbnails
- `fill="none"` on root SVG (shapes are stroked, not filled)
- All colors hardcoded hex (not CSS variables — SVG renders outside CSS scope)

## The Gradient Definition Pattern

All thumbnails use a standard phthalo gradient:
```html
<defs>
  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0%" stop-color="#3866A0" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#0F3A6B" stop-opacity="0.0"/>
  </linearGradient>
</defs>
```
Top-left (#3866A0 at 55%) → bottom-right (transparent). Gradient `id` is always `g1` or `g2` (reversed diagonal).

⚠️ **Gradient ID collision warning:** All thumbnails use `id="g1"`. When multiple render on the same page, the browser uses the first definition. This is a known system quirk — do not "fix" by using unique IDs.

## Complete SVG Vocabulary

### 1. Concentric Circles (Bayesian / Uncertainty)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs><linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stop-color="#3866A0" stop-opacity="0.55"/>
<stop offset="100%" stop-color="#0F3A6B" stop-opacity="0.0"/>
</linearGradient></defs>
<g fill="none" stroke="url(#g1)" stroke-width="1">
<circle cx="300" cy="300" r="80"/>
<circle cx="300" cy="300" r="140"/>
<circle cx="300" cy="300" r="200"/>
<circle cx="300" cy="300" r="260"/>
</g>
</svg>
```
**Use for:** Bayesian inference, uncertainty quantification, probability distributions, confidence intervals.

### 2. J-Curve Path (Adoption / Learning Curve)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs>...(g1)...</defs>
<path d="M 100 200 Q 300 450 500 100" fill="none" stroke="url(#g1)" stroke-width="2"/>
<line opacity="0.8" stroke="#3866A0" stroke-dasharray="2 6" stroke-width="1" x1="100" x2="500" y1="300" y2="300"/>
<g fill="#3866A0" opacity="0.7">
<circle cx="100" cy="200" r="3.5"/>
<circle cx="200" cy="300" r="3.5"/>
<circle cx="300" cy="350" r="3.5"/>
<circle cx="400" cy="275" r="3.5"/>
<circle cx="500" cy="100" r="3.5"/>
</g>
</svg>
```
**Use for:** AI adoption curves, productivity J-curves, learning curves, recovery arcs, any "gets worse before better" pattern.

### 3. Dashed Orbit Circles (Autonomous Systems)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs>...(g1)...</defs>
<circle cx="300" cy="300" r="200" stroke="url(#g1)" stroke-dasharray="4 12" stroke-width="1"/>
<circle cx="300" cy="300" r="140" stroke="url(#g1)" stroke-dasharray="2 6" stroke-width="1"/>
<g fill="#3866A0" opacity="0.6">
<rect height="4" width="4" x="298" y="98"/>
<rect height="4" width="4" x="298" y="498"/>
</g>
</svg>
```
**Use for:** Agentic AI, autonomous systems, feedback loops, entity resolution, cyclical processes.

### 4. Diagonal Scatter + ROC Line (Classification)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs>...(g1)...</defs>
<line opacity="0.8" stroke="#3866A0" stroke-dasharray="2 6" stroke-width="1" x1="60" x2="540" y1="540" y2="60"/>
<g fill="#3866A0" opacity="0.7">
<circle cx="120" cy="490" r="2.5"/>
<circle cx="180" cy="430" r="2.5"/>
<circle cx="240" cy="380" r="2.5"/>
<circle cx="300" cy="310" r="2.5"/>
<circle cx="360" cy="260" r="2.5"/>
<circle cx="420" cy="210" r="2.5"/>
<circle cx="480" cy="140" r="2.5"/>
</g>
<circle cx="380" cy="380" fill="#7A1626" opacity="0.95" r="3.5"/>
</svg>
```
**Use for:** Binary classification, ROC curves, prediction accuracy, regression correlation, outlier detection.

### 5. Ascending Path with Terminal Node (Ranking / Scoring)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs><linearGradient id="g2" x1="0" x2="1" y1="1" y2="0">
<stop offset="0%" stop-color="#1A3A6B" stop-opacity="0.6"/>
<stop offset="100%" stop-color="#3866A0" stop-opacity="0.2"/>
</linearGradient></defs>
<path d="M100 500 L200 400 L300 450 L500 100" stroke="url(#g2)" stroke-width="4"/>
<circle cx="500" cy="100" r="8" fill="#3866A0"/>
</svg>
```
**Use for:** Predictive ranking, priority scoring, optimization convergence, ascending performance curves.

### 6. Cross/Grid Mesh (Research / Exploration)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs>...(g1)...</defs>
<rect height="200" stroke="url(#g1)" stroke-dasharray="4 8" stroke-width="1" width="200" x="200" y="200"/>
<path d="M 250 250 L 350 350 M 350 250 L 250 350" stroke="url(#g1)" stroke-width="1"/>
<g fill="#3866A0" opacity="0.6">
<rect height="4" width="4" x="298" y="198"/>
<rect height="4" width="4" x="298" y="398"/>
</g>
</svg>
```
**Use for:** Research boundaries, mutation space, hyperparameter grids, combinatorial exploration.

### 7. Dual Arc / Lens (Interpretability / Latent Space)
```svg
<svg fill="none" viewbox="0 0 600 600">
<defs><linearGradient id="nla-g" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stop-color="#3866A0" stop-opacity="0.7"/>
<stop offset="100%" stop-color="#7A1626" stop-opacity="0.7"/>
</linearGradient></defs>
<path d="M100 300 C 200 100, 400 100, 500 300" stroke="url(#nla-g)" stroke-width="4" fill="none"/>
<path d="M100 300 C 200 500, 400 500, 500 300" stroke="url(#nla-g)" stroke-width="4" fill="none" stroke-dasharray="10 5"/>
<circle cx="300" cy="150" r="6" fill="#3866A0"/>
<circle cx="300" cy="450" r="6" fill="#7A1626"/>
</svg>
```
**Use for:** Encoder-decoder architectures, interpretability, latent representations, duality (explicit vs. hidden).

## Choosing a Visual for a New Article

| Article Category | SVG Pattern |
|-----------------|-------------|
| Bayesian / Uncertainty | Concentric circles |
| Adoption / Learning curves | J-curve |
| Agents / Autonomous systems | Dashed orbits |
| Classification / Prediction | Diagonal scatter |
| Ranking / Scoring | Ascending path |
| Research / Exploration | Cross/grid mesh |
| Interpretability / NLP | Dual arc |
| Graph ML / Networks | Node-edge (custom — not yet in system) |

## Source Reference
All `visual` fields in `projects_index.json` (8 articles).
