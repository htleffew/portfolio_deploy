---
component: Simulation Parameter Table
id: DAT-02
status: stable
category: data-display
interactivity: none
source: multimodal-autism-ai.html — Section 01 "The Philosophy of Ultra-Realistic Data Simulation"
---

## What It Does
A three-column table (Parameter | Value/Range | Rationale) that transforms a dry specification list into a readable argument — the third column explains WHY each parameter was chosen, not just what it is.

## The Key Insight: The Rationale Column

A standard two-column spec table communicates configuration. A three-column table with a Rationale column communicates **reasoning**. The difference matters enormously for a portfolio article:

| ❌ Two-column (spec) | ✓ Three-column (argument) |
|--------------------|--------------------------|
| Group Overlap: 60–80% | Group Overlap: 60–80% → "Simulates borderline and ambiguous behavioral presentations" |
| Reader sees: "ok, they set overlap to 60–80%" | Reader sees: "they thought about why clinical data is hard, and built that in" |

**The rationale column is never optional.** If you can't explain why a parameter was set, reconsider whether it belongs in the table.

## When to Use
- Experiment parameters for simulation studies
- ML model hyperparameters (with justification, not just tuning)
- A/B test configurations
- Clinical study design parameters
- Simulation settings with domain rationale

## When NOT to Use
- Simple data dictionaries (use schema preview table DAT-01)
- More than 8 rows (becomes a spec sheet, not an argument)
- When the rationale is obvious ("Random seed: 42 → reproducibility" adds no value)

## Anatomy
```
┌──────────────────────┬──────────────────┬────────────────────────────────────┐
│ Simulation Parameter │ Target Value /   │ Clinical Rationale                 │ ← th (mono)
│                      │ Range            │                                    │
├──────────────────────┼──────────────────┼────────────────────────────────────┤
│ Total Profiles       │ 1,200            │ Ensures statistical significance.  │
│ ASD Prevalence       │ 22%              │ Reflects specialist referral rates.│
│ Group Overlap        │ 60% – 80%        │ Simulates borderline presentations.│
│ Measurement Noise    │ 25% – 35%        │ Sensor errors, poor lighting.      │
│ Missing Data         │ 8% – 15%         │ Occluded camera angles.            │
│ Challenging Subtypes │ 35%              │ Prevents overfitting to textbook   │
│                      │                  │ cases.                             │
└──────────────────────┴──────────────────┴────────────────────────────────────┘
```

## Implementation

```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>Simulation Parameter</th>
        <th>Target Value / Range</th>
        <th>Clinical Rationale</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Total Profiles</td>
        <td>1,200</td>
        <td>Ensures statistical significance for model training.</td>
      </tr>
      <tr>
        <td>ASD Prevalence</td>
        <td>22%</td>
        <td>Reflects specialized clinical referral rates.</td>
      </tr>
      <tr>
        <td>Group Overlap</td>
        <td>60% – 80%</td>
        <td>Simulates borderline and ambiguous behavioral presentations.</td>
      </tr>
      <tr>
        <td>Measurement Noise</td>
        <td>25% – 35%</td>
        <td>Accounts for sensor errors, poor lighting, and background audio.</td>
      </tr>
      <tr>
        <td>Missing Data</td>
        <td>8% – 15%</td>
        <td>Mimics occluded camera angles or dropped audio frames.</td>
      </tr>
      <tr>
        <td>Challenging Subtypes</td>
        <td>35%</td>
        <td>Prevents overfitting to textbook, easily separable cases.</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Column Naming for Non-Clinical Articles

The third column should always answer "Why" — rename it to fit the context:

| Article Type | Column 3 Name |
|-------------|---------------|
| Clinical simulation | "Clinical Rationale" |
| ML experiment | "Justification" |
| A/B test | "Hypothesis" |
| System design | "Engineering Rationale" |
| Business model | "Business Logic" |

The word "Rationale" or "Justification" signals to the reader: this column explains decisions, not just records them.

## Source Reference
`multimodal-autism-ai.html` → Section 01 "The Philosophy of Ultra-Realistic Data Simulation" → simulation parameters table (6 rows, 3 columns).
