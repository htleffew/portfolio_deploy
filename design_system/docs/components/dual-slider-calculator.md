---
component: Dual Slider Calculator
id: INT-01
status: stable
category: interactive
interactivity: live-js
source: account-prioritization.html — Section 01 "The Single Metric Flaw"
---

## What It Does
A two-slider input panel that computes and displays a real-time output score — letting readers feel how changing one variable affects the combined metric. No page reload; pure vanilla JS event listeners.

## When to Use
- Any A × B expected-value formula that benefits from reader experimentation
- When the insight depends on the reader discovering the interaction themselves (e.g., "high probability + low deal = low score")
- As a pedagogical tool before presenting the full model architecture

## When NOT to Use
- More than 2 input variables (becomes overwhelming — use a dedicated form instead)
- When the formula is too complex to display as a simple output number
- When exact inputs don't matter (use a static formula display block instead, LAY-06)

## Anatomy
```
┌──────────────────────────────────────────────┐
│  Probability to Convert          10%         │  ← label + live value
│  ───────────────────●────────────────────    │  ← range input
│                                              │
│  Expected Deal Size         $1,000,000       │
│  ──────────────────────────────────────●    │
│         ────────────────────────────────    │
│                   PRIORITY SCORE            │  ← output label (mono, small)
│                    $100,000                 │  ← output value (display, large)
└──────────────────────────────────────────────┘
```

## Implementation

See `source-snippets/dual-slider-calculator.html` for the complete drop-in HTML + JS.

### CSS Class Requirements
```css
.priority-sim         /* grid container: 1fr 1fr, gap 40px */
.controls             /* flex column, gap 24px */
.output               /* centered, border-left */
.sim-val              /* mono, float right, --phthalo-lift */
.priority-score-label /* mono 12px, --phthalo-lift, uppercase */
.priority-score-display /* display font, 48px, --flare */
```

### The Formula Abstraction
Any `A × B = Score` pattern works:
```js
function updateSim() {
  const a = parseFloat(sliderA.value) / normA;  // normalize to 0–1 if needed
  const b = parseFloat(sliderB.value);
  output.textContent = formatScore(a * b);
}
```

### 5 Generalization Examples
| A | B | Score | Article Context |
|---|---|-------|----------------|
| P(convert) % | Deal Size $ | Priority Score $ | Sales prioritization |
| P(breach) % | Financial Impact $ | Risk Exposure $ | Security risk |
| Win Rate % | Contract Value $ | Expected Revenue $ | Sales forecasting |
| Urgency (1-10) | Strategic Value (1-10) | Composite Score | Project prioritization |
| Symptom Severity (0-1) | Assessment Frequency | Risk Index | Clinical monitoring |

## Design Tokens Applied
| Element | Token |
|---------|-------|
| `.sim-val` color | `--phthalo-lift` (dark) / `--ink-blue` (paper) |
| `.priority-score-display` color | `--flare` (dark) / `--ink` (paper) |
| `.priority-score-label` color | `--phthalo-lift` / `--ink-blue` |
| Slider track | `--brushed` (dark) / `--paper-3` (paper) |
| Slider thumb | `--flare` (dark) / `--ink` (paper) |
| Container border | `--graphite` (dark) / `--paper-3` (paper) |
| Container background | `--charcoal` (dark) / `--paper-2` (paper) |

## Source Reference
`account-prioritization.html` → `.priority-sim` div in Section 01.
