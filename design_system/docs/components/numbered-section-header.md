---
component: Numbered Section Header
id: LAY-01
status: stable
category: layout
interactivity: none
source: account-prioritization.html + multimodal-autism-ai.html — every content section
---

## What It Does
The eyebrow + H2 pattern that opens every article section. The eyebrow provides navigation context ("01 / Section Name") and the H2 delivers the editorial insight. GSAP reads `data-spine` and `data-section` attributes to build the chapter navigation.

## This Is The Single Most Important Layout Pattern

Every content section uses it. It is the visual DNA of all articles. It:
- Provides hierarchical navigation via `data-spine`
- Creates consistent reading rhythm across all articles
- Enables GSAP scroll-triggered entrance animations
- Drives the `#spine` sidebar navigation

## Required Attributes

**Both attributes are mandatory.** Missing either one breaks the spine navigation or GSAP orchestration.

```html
<section class="band band--dark"
         data-spine="Short Label"
         data-section="Full Section Name">
```

| Attribute | Format | Max Length | Example |
|-----------|--------|-----------|---------|
| `data-spine` | Short label | ~20 chars | `"The Flaw"` |
| `data-section` | Full name | no limit | `"The Single Metric Flaw"` |

## Eyebrow Format

```
[two-digit number] / [Section Name]
```

The slash convention is mandatory. Always zero-padded: `01`, `02`, `03`… not `1`, `2`, `3`.

Examples from live articles:
- `01 / The Single Metric Flaw`
- `02 / Architecture`
- `03 / Stage 1`
- `06 / Interpretability`

## Implementation

```html
<section class="band band--dark" data-spine="The Flaw" data-section="The Single Metric Flaw">
  <div class="eyebrow">01 / The Single Metric Flaw</div>
  <h2>The Blind Spot in Conversion Probability</h2>
  <!-- section content follows -->
</section>
```

## CSS (from global.css)

```css
/* Dark band eyebrow */
.band--dark .eyebrow {
  font-family: var(--mono);        /* JetBrains Mono */
  font-size: 10.5px;
  letter-spacing: 0.30em;          /* heavy tracking — reads like a label */
  text-transform: uppercase;
  color: var(--phthalo-lift);       /* #3866A0 */
  margin: 0 auto 18px;
  max-width: var(--col);           /* 860px */
  padding: 0 32px;
}

/* Paper band eyebrow */
.band--paper .eyebrow { color: var(--ink-blue); }  /* #1A3A6B */

/* H2 — dark */
.band--dark h2 {
  font-family: var(--display);     /* Playfair Display */
  font-weight: 600;
  font-size: clamp(22px, 2.5vw, 30px);
  letter-spacing: -0.012em;
  line-height: 1.12;
  color: var(--flare);
  margin: 0 auto 28px;
  max-width: var(--col);
  padding: 0 32px;
}

/* H2 — paper */
.band--paper h2 { color: var(--ink); }
```

## GSAP Entrance Animation

GSAP reads `.eyebrow` and `.section-heading` (or `h2`) within each `.band` and animates:
1. Eyebrow: `opacity: 0, x: -30` → `opacity: 1, x: 0` over 1.2s (power3.out)
2. H2: `opacity: 0, y: 25` → `opacity: 1, y: 0` over 1.4s (power3.out), delayed -0.6s

Trigger: `top 75%` of viewport (element enters view from below).

## Writing the H2

The H2 should communicate the **insight**, not describe the content:

| ❌ Descriptive (avoid) | ✓ Insight-driven |
|-----------------------|-----------------|
| "Problem Overview" | "The Blind Spot in Conversion Probability" |
| "Data Preprocessing" | "Data Architecture & Preprocessing" |
| "Results" | "Interpreting the Results and Overfitting Warnings" |

## Source Reference
Both articles, every `<section class="band">` except `.front` and `.back-matter`.
