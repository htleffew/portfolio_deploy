---
component: SVG Hierarchy Tree
id: DIA-01
status: stable
category: diagrams
interactivity: none
source: multimodal-autism-ai.html — FIG.02
---

## What It Does
A static SVG hierarchical tree diagram mapping multimodal data streams to ADOS-2 behavioral domains — showing parent-to-child relationships with directional arrows and color-coded node tiers.

## When to Use
- System architecture diagrams (input → processing → output)
- Feature extraction pipelines (raw modality → extracted feature → domain mapping)
- Organizational hierarchies, taxonomy trees
- Any "this feeds into that" relationship with clear levels

## When NOT to Use
- Cyclic relationships (use dashed orbit circles instead — DAT-04)
- Temporal/causal sequences where timing matters (use DIA-02)
- More than 4 levels deep (becomes unreadable at SVG scale)
- When the diagram needs to be interactive (use a JS-rendered tree)

## Anatomy
```
                    ┌──────────────────┐
                    │  MULTIMODAL INPUT │  ← Root (fill:#161616, stroke:#333333)
                    └────────┬─────────┘
              ┌──────────────┴──────────────┐
    ┌─────────▼─────────┐         ┌─────────▼─────────┐
    │  Video Stream (CV) │         │ Audio Stream (NLP) │  ← Stream (fill:#030303, stroke:#0F3A6B)
    └────────┬──────────┘         └──────────┬─────────┘
       ┌─────┴──────┐                  ┌──────┴──────┐
  ┌────▼────┐ ┌─────▼────┐       ┌────▼────┐  ┌────▼────┐
  │Gaze/Face│ │  Pose    │       │Prosodic │  │Speech   │  ← Leaf (fill:#030303, stroke:#222222)
  │ A1,A2,A7│ │ C1,D1,D4 │       │  B1,A4  │  │  B2     │
  └─────────┘ └──────────┘       └─────────┘  └─────────┘
```

## SVG Implementation

Complete markup extracted verbatim from `multimodal-autism-ai.html` FIG.02:

```html
<svg viewBox="0 0 800 300" style="width:100%; height:auto;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3866A0" />
    </marker>
  </defs>
  <g font-family="JetBrains Mono" font-size="12" fill="#A1A1A6">
    <!-- Root node -->
    <rect x="300" y="20" width="200" height="40" rx="4"
          fill="#161616" stroke="#333333" stroke-width="2"/>
    <text x="400" y="44" text-anchor="middle" fill="#F5F5F7" font-weight="bold">
      MULTIMODAL INPUT
    </text>

    <!-- Branch paths to stream nodes -->
    <path d="M 400 60 L 400 90 L 200 90 L 200 120"
          fill="none" stroke="#3866A0" stroke-width="2" marker-end="url(#arrow)"/>
    <path d="M 400 60 L 400 90 L 600 90 L 600 120"
          fill="none" stroke="#3866A0" stroke-width="2" marker-end="url(#arrow)"/>

    <!-- Stream nodes (Level 2) -->
    <rect x="120" y="120" width="160" height="30" rx="4"
          fill="#030303" stroke="#0F3A6B" stroke-width="1"/>
    <text x="200" y="140" text-anchor="middle" fill="#3866A0">Video Stream (CV)</text>

    <rect x="520" y="120" width="160" height="30" rx="4"
          fill="#030303" stroke="#0F3A6B" stroke-width="1"/>
    <text x="600" y="140" text-anchor="middle" fill="#3866A0">Audio Stream (NLP)</text>

    <!-- Branch paths to leaf nodes -->
    <path d="M 200 150 L 200 180 L 100 180 L 100 210"
          fill="none" stroke="#333333" stroke-width="1" marker-end="url(#arrow)"/>
    <path d="M 200 150 L 200 180 L 300 180 L 300 210"
          fill="none" stroke="#333333" stroke-width="1" marker-end="url(#arrow)"/>
    <path d="M 600 150 L 600 180 L 500 180 L 500 210"
          fill="none" stroke="#333333" stroke-width="1" marker-end="url(#arrow)"/>
    <path d="M 600 150 L 600 180 L 700 180 L 700 210"
          fill="none" stroke="#333333" stroke-width="1" marker-end="url(#arrow)"/>

    <!-- Leaf nodes (Level 3) -->
    <rect x="30" y="210" width="140" height="60" rx="2"
          fill="#030303" stroke="#222222"/>
    <text x="100" y="235" text-anchor="middle" font-size="10">Gaze/Face Tracking</text>
    <text x="100" y="255" text-anchor="middle" fill="#0F3A6B" font-size="9">A1, A2, A7</text>

    <rect x="230" y="210" width="140" height="60" rx="2"
          fill="#030303" stroke="#222222"/>
    <text x="300" y="235" text-anchor="middle" font-size="10">Pose Estimation</text>
    <text x="300" y="255" text-anchor="middle" fill="#0F3A6B" font-size="9">C1, D1, D4</text>

    <rect x="430" y="210" width="140" height="60" rx="2"
          fill="#030303" stroke="#222222"/>
    <text x="500" y="235" text-anchor="middle" font-size="10">Prosodic Extract</text>
    <text x="500" y="255" text-anchor="middle" fill="#0F3A6B" font-size="9">B1, A4</text>

    <rect x="630" y="210" width="140" height="60" rx="2"
          fill="#030303" stroke="#222222"/>
    <text x="700" y="235" text-anchor="middle" font-size="10">Speech to Text</text>
    <text x="700" y="255" text-anchor="middle" fill="#0F3A6B" font-size="9">B2</text>
  </g>
</svg>
```

## Key SVG Patterns

### The Arrow Marker Definition (Reusable)
```html
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3866A0" />
  </marker>
</defs>
```
Copy this `<defs>` block into any SVG diagram that needs directional arrows. Reference with `marker-end="url(#arrow)"`. Color is hardcoded `#3866A0` (--phthalo-lift). The `orient="auto-start-reverse"` flag makes the arrow point in the path's direction automatically.

### The Right-Angle Connector Pattern
```html
<!-- Elbow connector: vertical drop → horizontal → vertical drop to target -->
<path d="M [startX] [startY] L [startX] [midY] L [endX] [midY] L [endX] [endY]"
      fill="none" stroke="#3866A0" stroke-width="2" marker-end="url(#arrow)"/>
```
`midY` is the horizontal crossbar height. Calculate as `startY + (endY - startY) / 2` for centered elbows.

### The Three Node Color Tiers
| Tier | Fill | Stroke | Stroke-width | Text |
|------|------|--------|-------------|------|
| Root | `#161616` | `#333333` | `2` | `#F5F5F7` bold |
| Stream | `#030303` | `#0F3A6B` | `1` | `#3866A0` |
| Leaf | `#030303` | `#222222` | `1` | `#A1A1A6` (label) + `#0F3A6B` (sub-label) |

## Design Token Mapping
| SVG Value | CSS Token |
|-----------|-----------|
| `fill="#161616"` (root) | `--charcoal` |
| `fill="#030303"` (nodes) | `--obsidian` |
| `stroke="#333333"` (root) | `--brushed` |
| `stroke="#0F3A6B"` (stream) | `--phthalo` |
| `stroke="#222222"` (leaf) | `--graphite` |
| `fill="#3866A0"` (stream text) | `--phthalo-lift` |
| `fill="#F5F5F7"` (root text) | `--platinum` |
| `fill="#A1A1A6"` (leaf text) | `--tungsten` |

## How to Adapt
**What changes:** Node labels, path `d` attributes for connections, number of branches, viewBox dimensions.

**What stays constant:** The three-tier color system, the arrow marker definition, the JetBrains Mono font, the right-angle connector pattern, the `fill="none"` on connector paths.

**Scaling:** The viewBox is `0 0 800 300`. For more leaf nodes, expand width (e.g., `0 0 1200 300`). For more levels, expand height (`0 0 800 450`). Always use `style="width:100%; height:auto;"` on the SVG element.

## Source Reference
`multimodal-autism-ai.html` → Section 02 "Feature Extraction and ADOS-2 Mapping" → FIG.02 "Hierarchical extraction tree mapping multimodal data streams to specific ADOS-2 behavioral domains."
