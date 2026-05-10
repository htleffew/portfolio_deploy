---
component: Plotly ROC Curve
id: VIZ-01
status: stable
category: charts
interactivity: plotly-hover
source: account-prioritization.html — Section 03 (plot-roc) + multimodal-autism-ai.html — Section 04 (FIG.03)
---

## What It Does
Plots the tradeoff between True Positive Rate and False Positive Rate at all classification thresholds, with an optional dashed random-classifier baseline; the area under the curve (AUC) summarizes overall discriminative power.

## When to Use
- Evaluating binary classification models (conversion prediction, ASD diagnosis, fraud detection)
- Comparing multiple models on the same dataset
- When the dataset is not severely imbalanced (if it is, use PR curve instead — see VIZ-02)
- When you need to show a single headline metric (AUC score) alongside the full curve

## When NOT to Use
- Highly imbalanced datasets (9% positive rate or lower) — ROC AUC is misleadingly optimistic. Use PR-AUC instead.
- When the analytical message IS the annotation (use SVG ROC with annotation, DIA-03, instead)
- When mobile rendering matters heavily — Plotly hover is poor on touch

## Anatomy
```
┌─────────────────────────────────┐
│  Title: "ROC-AUC Curve"         │
│                                 │
│  1.0 ┤ *                        │
│      │  **                      │
│ TPR  │    ***                   │
│      │       ****               │
│  0.0 ┤_________________         │
│      0.0          1.0           │
│           FPR                   │
│  ╌╌╌ Random Baseline (diagonal) │
└─────────────────────────────────┘
     .cap: FIG.XX — caption text
```

## Plotly Configuration

### Dark Band Version (band--dark)
```js
const rocTrace = {
  x: [0, 0.1, 0.3, 0.5, 0.8, 1],
  y: [0, 0.7, 0.85, 0.92, 0.98, 1],
  type: 'scatter',
  mode: 'lines',
  name: 'ROC',
  line: { color: '#3866A0', width: 3 }  // --phthalo-lift
};
const rocBaseline = {
  x: [0, 1], y: [0, 1],
  type: 'scatter',
  mode: 'lines',
  name: 'Random',
  line: { dash: 'dash', color: '#5E5E5A' }  // --tungsten
};
Plotly.newPlot('plot-roc', [rocTrace, rocBaseline], {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#A1A1A6', family: "'JetBrains Mono', monospace" },
  margin: { t: 40, b: 40, l: 50, r: 20 },
  title: { text: 'ROC-AUC Curve', font: { color: '#FFFFFF' } },
  xaxis: { title: 'False Positive Rate' },
  yaxis: { title: 'True Positive Rate' },
  showlegend: false
}, { displayModeBar: false });
```

### Light Band Version (band--paper)
```js
Plotly.newPlot('plot-roc', [rocTrace, rocBaseline], {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#5E5E5A', family: "'JetBrains Mono', monospace" },
  margin: { t: 40, b: 40, l: 50, r: 20 },
  title: { text: 'ROC-AUC Curve', font: { color: '#030303' } },
  xaxis: { title: 'False Positive Rate' },
  yaxis: { title: 'True Positive Rate' },
  showlegend: false
}, { displayModeBar: false });
```

## When to Use Plotly vs SVG for ROC

| Use Plotly (VIZ-01) | Use SVG (DIA-03) |
|---------------------|------------------|
| Reader needs to hover for exact values | Annotation IS the message |
| Multiple model curves to compare | Single curve with threshold marker |
| AUC score shown via annotation/text | Risk zone rect needed |
| Mobile not critical | Clean static print output needed |

The multimodal-autism-ai.html uses the SVG version (FIG.03) because the overfitting risk zone annotation is the point — the reader needs to see the rect + dashed line + bold label, not hover for values.

## Design Tokens Applied
| Plotly Config | CSS Token | Value |
|--------------|-----------|-------|
| `line.color` (ROC trace) | `--phthalo-lift` | #3866A0 |
| `line.color` (baseline) | `--tungsten` / `--ink-3` | #A1A1A6 / #5E5E5A |
| `font.color` (dark) | `--tungsten` | #A1A1A6 |
| `font.color` (light) | `--ink-3` | #5E5E5A |
| `title.font.color` (dark) | `--flare` | #FFFFFF |
| `title.font.color` (light) | `--ink` | #030303 |
| `paper_bgcolor` | transparent | rgba(0,0,0,0) |

## Generalization
Replace `x`/`y` arrays with your actual FPR/TPR values from `sklearn.metrics.roc_curve()`. The curve shape will vary; everything else stays constant. For multiple models, add additional traces with different shades of phthalo (use opacity variants: `rgba(56,102,160,0.6)`, `rgba(56,102,160,0.3)`). Always include the diagonal baseline.

## Source Reference
- Plotly version: `account-prioritization.html` → `Plotly.newPlot('plot-roc', ...)`
- SVG annotated version: `multimodal-autism-ai.html` → FIG.03 "Receiver Operating Characteristic curve"
