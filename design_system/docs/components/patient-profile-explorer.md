---
component: Patient Profile Explorer
id: INT-02
status: stable
category: interactive
interactivity: dropdown
source: multimodal-autism-ai.html — Section 05 "Bridging the Gap to Clinical Practice"
---

## What It Does
A `<select>` dropdown that swaps a structured profile card's content on change — letting readers inspect individual records, scenarios, or model outputs without navigating away.

## When to Use
- Showing 3–6 distinct records/personas where comparison is the point
- Clinical or analytical outputs that vary meaningfully across cases
- When the reader needs to explore individual examples, not aggregate statistics
- As a "personalization" metaphor — "what would this system tell YOUR clinician?"

## When NOT to Use
- More than 8 options (dropdown becomes unwieldy — use a filterable table instead)
- When all records are similar (no contrast = no insight — just show one example)
- When the data should be compared side-by-side (use a table, not a card)

## Anatomy
```
┌─────────────────────────────────────────┐
│ [Patient ID: PART_0012 (Low Risk)    ▼] │  ← <select> dropdown
└─────────────────────────────────────────┘
┌──────────────────┬──────────────────────┐
│ PROFILE ID       │ AGE                  │
│ PART_0012        │ 100 months           │
├──────────────────┴──────────────────────┤
│ KEY BEHAVIORS (full width)              │
│ High gaze (74.7%), 100% functional play │
├──────────────────┬──────────────────────┤
│ CONSENSUS PROB   │ ADOS-2 SCORE         │
│ 2.9%             │ 3 / 18               │  ← .highlight class
├──────────────────┴──────────────────────┤
│ CLINICAL RECOMMENDATION (full width)    │
│ Routine screening. Bayesian...          │
└─────────────────────────────────────────┘
```

## JS Data Schema

```js
const patientData = {
  "PART_0012": {
    age: 100,
    behaviors: "High gaze (74.7%), 100% functional play",
    prob: "2.9%",
    ados: "3 / 18",
    rec: "Routine screening. Bayesian uncertainty was extremely low (0.003).",
    riskLevel: ""          // "" | "moderate" | "high"
  },
  "PART_0013": { ... riskLevel: "moderate" },
  "PART_0032": { ... riskLevel: "high" }
};
```

## The Risk Stratification Color System

The `.highlight` class + modifier drives value color:

| CSS Class | Color | Token | Use When |
|-----------|-------|-------|----------|
| `.highlight` | Phthalo blue | `--phthalo` / `--ink-blue` | Neutral, expected, low risk |
| `.highlight.moderate` | Gold | `--hansa` #DBA844 | Borderline, watch closely |
| `.highlight.high` | Alizarin red | `--alizarin` #7A1626 | Requires action, high risk |

```css
.mval.highlight        { color: var(--phthalo); }
.mval.highlight.moderate { color: #DBA844; }   /* --hansa */
.mval.highlight.high     { color: #7A1626; }   /* --alizarin */
```

## Generalization Contexts

| Domain | Dropdown Options | Card Fields |
|--------|-----------------|-------------|
| ML model comparison | Model A / Model B / Ensemble | AUC, Precision, Recall, Recommendation |
| Persona profiles | Persona 1 / Persona 2 / Persona 3 | Demographics, Behaviors, Needs, Channels |
| Scenario analysis | Baseline / Optimistic / Pessimistic | Key metrics, Risk level, Action |
| API response demo | Request 1 / Request 2 / Request 3 | Response fields, latency, confidence |

## Design Tokens Applied
| Element | Token |
|---------|-------|
| `.mlab` color | `--ink-blue` (paper) / `--phthalo-lift` (dark) |
| `.mval` default color | `--ink` (paper) |
| `.highlight` color | `--phthalo` |
| `.highlight.moderate` | `--hansa` (#DBA844) |
| `.highlight.high` | `--alizarin` (#7A1626) |
| `.profile-card` background | `#fff` (paper) |
| `.profile-selector` border | `--paper-3` |

## Source Reference
`multimodal-autism-ai.html` → `.explorer` div in Section 05. JS in inline `<script>` → `patientData` object + `updateProfileCard()` function.
