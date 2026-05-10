---
component: Plotly PR Curve
id: VIZ-02
status: stable
category: charts
interactivity: plotly-hover
source: account-prioritization.html — Section 03 (plot-pr)
---

## What It Does
Plots Precision vs. Recall at all classification thresholds. Unlike ROC, PR curves are not distorted by class imbalance — making them the preferred evaluation metric for rare-event prediction.

## When to Use
- **Imbalanced datasets** (conversion rates < 15%, rare disease prevalence, fraud detection)
- When false positives are costly (e.g., sending sales team to low-quality leads)
- When you want to show that the model actually finds the rare positives well
- Always pair with ROC curve — show both to give a complete picture

## When NOT to Use
- Balanced datasets (50/50 split) — ROC is equally valid and more widely understood
- When your audience is unfamiliar with Precision-Recall tradeoffs — add an explanatory sentence
- As a standalone metric without ROC context

## Anatomy
```
┌─────────────────────────────────┐
│  Title: "PR-AUC Curve"          │
│                                 │
│  1.0 ┤*                         │
│      │ **                       │
│ Pre  │   ***                    │
│      │      ****                │
│  0.0 ┤______________*           │
│      0.0          1.0           │
│               Recall            │
│  (Curve starts top-left,        │
│   falls toward bottom-right)    │
└─────────────────────────────────┘
```

## Plotly Configuration

### Light Band Version (canonical — PR curves used in paper bands)
```js
const prTrace = {
  x: [0, 0.2, 0.4, 0.6, 0.8, 1],
  y: [1, 0.8, 0.65, 0.45, 0.2, 0.05],
  type: 'scatter',
  mode: 'lines',
  name: 'PR',
  line: { color: '#1A3A6B', width: 3 }  // --ink-blue (paper band context)
};
Plotly.newPlot('plot-pr', [prTrace], {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#5E5E5A', family: "'JetBrains Mono', monospace" },
  margin: { t: 40, b: 40, l: 50, r: 20 },
  title: { text: 'PR-AUC Curve', font: { color: '#030303' } },
  xaxis: { title: 'Recall' },
  yaxis: { title: 'Precision' },
  showlegend: false
}, { displayModeBar: false });
```

### Dark Band Version
Change `line.color` to `'#3866A0'` (--phthalo-lift), `font.color` to `'#A1A1A6'`, and `title.font.color` to `'#FFFFFF'`.

## Key Differences from ROC Curve

| Property | ROC | PR |
|---------|-----|-----|
| X axis | False Positive Rate | Recall |
| Y axis | True Positive Rate | Precision |
| Baseline | Diagonal (random) | Horizontal line at prevalence rate |
| Imbalance effect | Optimistic (misleading) | Honest (accurate) |
| Account Prioritization (9.47% positive rate) | AUC looks impressive | Shows true struggle |

**The article explains this explicitly:** "Research shows that ROC plots can be visually deceptive in highly imbalanced scenarios. PR-AUC specifically evaluates the fraction of true positives among positive predictions."

## Design Tokens Applied
| Plotly Config | CSS Token | Value |
|--------------|-----------|-------|
| `line.color` (paper) | `--ink-blue` | #1A3A6B |
| `line.color` (dark) | `--phthalo-lift` | #3866A0 |
| `font.color` (paper) | `--ink-3` | #5E5E5A |
| `font.color` (dark) | `--tungsten` | #A1A1A6 |

## Generalization
Replace x/y arrays with values from `sklearn.metrics.precision_recall_curve()`. Note the inverted shape — high precision at low recall (top-left), degrading toward high recall (bottom-right). For the prevalence baseline (no-skill classifier): add a horizontal line at `y = [prevalence, prevalence]` across `x = [0, 1]`.

## Source Reference
`account-prioritization.html` → `Plotly.newPlot('plot-pr', ...)` inside `DOMContentLoaded` handler.
