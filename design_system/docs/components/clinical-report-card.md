---
component: Clinical Report Card
id: DAT-03
status: stable
category: data-display
interactivity: none (static) / dropdown (via INT-02)
source: multimodal-autism-ai.html — Section 05 "Bridging the Gap to Clinical Practice"
---

## What It Does
A structured output card displaying labeled metric pairs in a two-column grid — translating raw model outputs into readable, scannable clinical (or analytical) summaries.

## When to Use
- ML model outputs translated for non-technical audiences
- Clinical risk stratification display
- API response visualization
- Any structured record where key-value pairs need to be readable, not tabular
- Patient profile, customer profile, model evaluation summary

## Anatomy
```
┌──────────────────────────────────────────────────────────────┐
│  PROFILE ID          │  AGE                                  │  ← 2-column grid
│  PART_0012           │  100 months                           │
├──────────────────────┴───────────────────────────────────────┤
│  KEY BEHAVIORS (full-width)                                   │  ← .full-width spans 2 cols
│  High gaze (74.7%), 100% functional play                      │
├──────────────────────┬───────────────────────────────────────┤
│  CONSENSUS PROB      │  ADOS-2 SCORE                         │
│  2.9%  ← blue        │  3 / 18  ← blue                      │  ← .highlight (neutral)
├──────────────────────┴───────────────────────────────────────┤
│  CLINICAL RECOMMENDATION (full-width)                         │
│  Routine screening. Bayesian uncertainty was extremely low.   │
└──────────────────────────────────────────────────────────────┘
```

## Implementation

```html
<div class="profile-card">

  <!-- Standard 2-column metric -->
  <div class="metric">
    <span class="mlab">Profile ID</span>
    <span class="mval">PART_0012</span>
  </div>

  <div class="metric">
    <span class="mlab">Age</span>
    <span class="mval">100 months</span>
  </div>

  <!-- Full-width metric (spans both columns) -->
  <div class="metric full-width">
    <span class="mlab">Key Behaviors</span>
    <span class="mval">High gaze (74.7%), 100% functional play</span>
  </div>

  <!-- Highlighted metric (risk-aware color) -->
  <div class="metric">
    <span class="mlab">Consensus Probability</span>
    <span class="mval highlight">2.9%</span>
    <!-- Add class "moderate" or "high" to .highlight for risk coloring -->
  </div>

  <div class="metric">
    <span class="mlab">ADOS-2 Score</span>
    <span class="mval highlight">3 / 18</span>
  </div>

  <!-- Full-width recommendation -->
  <div class="metric full-width">
    <span class="mlab">Clinical Recommendation</span>
    <span class="mval">Routine screening. Bayesian uncertainty was extremely low (0.003).</span>
  </div>

</div>
```

## The `.highlight` Risk Class System

```css
.mval.highlight        { color: var(--phthalo);   /* blue — neutral */  }
.mval.highlight.moderate { color: #DBA844;          /* gold — watch  */  }
.mval.highlight.high     { color: #7A1626;          /* red  — act    */  }
```

Apply the class to values that carry clinical/business significance. The three-tier color system maps to natural language:
- No modifier → "this is a data point"
- `.moderate` → "pay attention to this"
- `.high` → "this requires action"

## CSS (from global.css)
```css
.profile-card {
  background: #fff;
  border: 1px solid var(--paper-3);
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.profile-card .metric { display: flex; flex-direction: column; gap: 8px; }
.profile-card .full-width { grid-column: span 2; }
.mlab {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--ink-blue);
}
.mval {
  font-family: var(--body); font-size: 16px; color: var(--ink);
}
.mval.highlight {
  font-size: 24px; font-weight: 500;
  font-family: var(--display);
  color: var(--phthalo);
}
```

## Generalization

Works for any structured output card:

| Domain | Labels (mlab) | Values (mval) |
|--------|--------------|---------------|
| ML model output | Confidence, Class, Threshold | 0.78, "High Risk", 0.5 |
| API response | Status, Latency, Token Count | 200 OK, 142ms, 1,847 |
| Analytics summary | Sessions, Conversion Rate, Revenue | 12,847, 3.2%, $89,420 |
| Customer profile | Segment, LTV, Churn Risk | Enterprise, $24,000, Low |

## Source Reference
`multimodal-autism-ai.html` → Section 05 "Bridging the Gap to Clinical Practice" → `.profile-card` div. CSS in global.css → `.profile-card`, `.metric`, `.mlab`, `.mval`, `.highlight`.
