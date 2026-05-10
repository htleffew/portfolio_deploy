---
component: Formula Display Block
id: LAY-06
status: stable
category: layout
interactivity: none
source: account-prioritization.html — Section 05 "Synthesizing the Priority Score"
---

## What It Does
A centered, monospace-formatted formula that gives a mathematical expression its own visual moment — signaling to the reader "this equation is the insight, not supporting detail."

## When to Use
- When a formula with ≤4 terms IS the central claim of a section
- After building up to a synthesis: "now here's the formula that brings it together"
- Simple A × B = C expressions, ratios, scoring functions, weighted sums
- When you want the reader to pause, read, and internalize before continuing

## When NOT to Use
- Complex LaTeX formulas with superscripts, subscripts, integrals → use MathJax
- Formulas with more than 4 terms → break into annotated steps
- Inline within a paragraph → use `<code>` instead
- When the formula is secondary to the prose around it

## Anatomy
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│         Priority Score = P(convert) × E[deal_size]      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Implementation

From the live source:
```html
<p style="font-family:var(--mono); text-align:center; margin: 32px 0;">
  Priority Score = P(convert) * E[deal_size]
</p>
```

For a more styled version with consistent design system classes:
```html
<div class="formula-block">
  Priority Score = P(convert) × E[deal_size]
</div>
```

With CSS:
```css
.formula-block {
  font-family: var(--mono);
  font-size: var(--fs-lede);    /* 18px — larger than body for emphasis */
  text-align: center;
  margin: 40px auto;
  max-width: var(--col);
  padding: 0 32px;
  color: var(--platinum);       /* --ink on paper bands */
  letter-spacing: 0.04em;
}
.band--paper .formula-block { color: var(--ink); }
```

## When to Use This vs. Full MathJax

| Use Formula Block | Use MathJax |
|-----------------|-------------|
| ≤4 terms | Complex expressions |
| No superscripts | Exponents, integrals, summations |
| Simple operators (×, +, =) | Greek letters, special notation |
| Conceptual summary | Precise mathematical derivation |
| `Priority = P × E` | `AUC = ∫₀¹ TPR(FPR) d(FPR)` |

## Why It Gets Its Own Visual Moment

The formula display block creates intentional whitespace before and after the equation. This whitespace signals: **stop**. Read this. The formula is not decoration — it IS the architecture. In the account prioritization article, `Priority Score = P(convert) * E[deal_size]` is the thesis of the entire piece expressed in one line.

Prose around it should lead into and out of the formula:
```
"...our final ranking metric is calculated with a simple expected value formula:"

[formula block]

"You might notice an interesting dynamic here..."
```

## Source Reference
`account-prioritization.html` → Section 05 "Synthesizing the Priority Score" → inline `<p style="font-family:var(--mono);">` element.
