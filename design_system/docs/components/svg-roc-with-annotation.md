---
component: SVG ROC with Annotation
id: DIA-03
status: stable
category: diagrams
interactivity: none
source: multimodal-autism-ai.html — FIG.03
---

## What It Does
A hand-drawn SVG ROC curve with a prominent risk zone annotation — a filled rectangle, dashed threshold line, and bold warning label marking where model performance becomes suspicious.

## When to Use
- When the annotation IS the message (e.g., "this AUC is suspiciously high")
- Single-model evaluation where the curve shape matters less than the threshold
- Print-ready or static context where Plotly hover isn't needed
- When you need a risk zone rect that Plotly can't easily render inline

## When NOT to Use
- Multiple model comparison (use Plotly VIZ-01 with multiple traces)
- When readers need to hover for exact FPR/TPR values (use Plotly)
- Precision-Recall context (use VIZ-02 instead)

## Anatomy
```
┌────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  ← Risk zone rect (--alizarin, opacity 0.1)
│ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌   │  ← Dashed threshold line (--alizarin)
│ OVERFITTING RISK ZONE (AUC > 0.95)         │  ← Bold label (--alizarin)
│                                            │
│   *                                        │
│    **   ● AUC: 0.974                       │
│      ***                                   │
│         ****                               │
│            *****                           │  ← ROC curve (--phthalo-lift)
│ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌   │  ← Random baseline (--graphite)
└────────────────────────────────────────────┘
     FPR →
```

## SVG Implementation

Complete markup from `multimodal-autism-ai.html` FIG.03:

```html
<svg viewBox="0 0 600 300" style="width:100%; height:auto;">
  <g font-family="JetBrains Mono" font-size="10" fill="#A1A1A6">

    <!-- Axes -->
    <line x1="50" y1="250" x2="550" y2="250" stroke="#333" stroke-width="2"/>
    <line x1="50" y1="250" x2="50" y2="20"  stroke="#333" stroke-width="2"/>

    <!-- Axis labels -->
    <text x="300" y="280" text-anchor="middle">False Positive Rate</text>
    <text x="20" y="135" text-anchor="middle"
          transform="rotate(-90 20,135)">True Positive Rate</text>

    <!-- Random classifier baseline (diagonal dashed) -->
    <line x1="50" y1="250" x2="550" y2="20"
          stroke="#444" stroke-width="1" stroke-dasharray="4 4"/>

    <!-- ═══════════════════════════════════════════════════════
         THE THRESHOLD ANNOTATION PATTERN — Reusable Primitive
         ═══════════════════════════════════════════════════════ -->

    <!-- 1. Risk zone rect — translucent fill -->
    <rect x="50" y="20" width="500" height="35"
          fill="#7A1626" opacity="0.1"/>

    <!-- 2. Dashed threshold line -->
    <line x1="50" y1="55" x2="550" y2="55"
          stroke="#7A1626" stroke-width="1" stroke-dasharray="2 4"/>

    <!-- 3. Bold label -->
    <text x="300" y="42" text-anchor="middle"
          fill="#7A1626" font-weight="bold">
      OVERFITTING RISK ZONE (AUC > 0.95)
    </text>

    <!-- ═══════════════════════════════════════════════════════ -->

    <!-- ROC Curve -->
    <path d="M 50 250 Q 80 40 550 20"
          fill="none" stroke="#3866A0" stroke-width="3"/>

    <!-- AUC annotation point -->
    <circle cx="160" cy="50" r="4" fill="#F5F5F7"/>
    <text x="175" y="55" fill="#F5F5F7">AUC: 0.974</text>

  </g>
</svg>
```

---

## The Threshold Annotation Pattern — Reusable Primitive

This three-element pattern is the most generalizable component in the entire diagram system. It communicates "here is a threshold you should care about" in any SVG chart:

```html
<!-- 1. Zone rect: translucent background fill -->
<rect x="[left]" y="[top]" width="[chartWidth]" height="[zoneHeight]"
      fill="#7A1626" opacity="0.1"/>

<!-- 2. Dashed line at threshold boundary -->
<line x1="[left]" y1="[threshold_y]" x2="[right]" y2="[threshold_y]"
      stroke="#7A1626" stroke-width="1" stroke-dasharray="2 4"/>

<!-- 3. Bold label inside zone -->
<text x="[centerX]" y="[label_y]" text-anchor="middle"
      fill="#7A1626" font-weight="bold">[ZONE LABEL]</text>
```

**The three-part recipe:**
1. **Rect** — low-opacity fill (`opacity: 0.1`) shows "this region is different" without obscuring chart data
2. **Dashed line** — marks the exact boundary; `stroke-dasharray: "2 4"` (short dash, long gap) signals permeability rather than a hard wall
3. **Bold label** — ALL CAPS, inside the zone, `font-weight: bold`, `fill="#7A1626"` (--alizarin)

### 3 Other Contexts for This Pattern

| Context | Zone Label | Threshold Meaning |
|---------|-----------|-------------------|
| Clinical decision threshold | `REFER FOR EVALUATION (SCORE > 7)` | Score above which clinical action is required |
| Statistical significance | `SIGNIFICANT REGION (p < 0.05)` | Effect size boundary in hypothesis testing |
| Business performance floor | `TARGET FLOOR (SCORE < 0.3)` | Minimum acceptable KPI threshold |
| Model drift detection | `HIGH DRIFT (PSI > 0.2)` | Retraining trigger zone |

The pattern works for horizontal thresholds (like this example) or vertical thresholds — simply rotate the rect and line to vertical orientation.

## Design Token Mapping
| SVG Value | CSS Token |
|-----------|-----------|
| `fill="#7A1626"` | `--alizarin` |
| `stroke="#3866A0"` (ROC curve) | `--phthalo-lift` |
| `stroke="#444"` (baseline) | `--brushed` |
| `fill="#F5F5F7"` (AUC label) | `--platinum` |
| `fill="#A1A1A6"` (axis text) | `--tungsten` |
| `stroke="#333"` (axes) | `--brushed` |

## How to Adapt

**What changes:** The risk zone position (y, height), the threshold label text, the ROC curve path, the AUC annotation text and position.

**What stays constant:** The three-element annotation pattern. The alizarin color for all threshold markers. The dashed line style. The JetBrains Mono font.

**For a lower threshold:** Move the rect lower in the viewBox (larger y value = lower on screen). Adjust the dashed line y1/y2 to match the rect's bottom edge.

**For a target floor (minimum acceptable):** Flip — risk zone goes at the bottom, threshold line goes above it with label "BELOW TARGET."

## Source Reference
`multimodal-autism-ai.html` → Section 04 "Interpreting the Results and Overfitting Warnings" → FIG.03 "Receiver Operating Characteristic curve. The highly steep arch indicates potential overfitting to the synthetic constraints."
