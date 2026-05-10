---
component: Sticky Stack Narrative
id: CIN-01
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: sticky-stack.html
adaptation-status: token-mapped
---

## What It Does
A section header sticks to the top of the viewport while prose content scrolls past it — creating a "pinned context" effect that keeps the reader oriented through long technical walkthroughs.

## When to Use In This Portfolio
- Multi-step technical sections where the section header should remain visible as explanatory content scrolls (e.g., a 4-step preprocessing pipeline where the reader needs to see "02 / Data Architecture" while reading each step)
- Walkthroughs with ≥3 sub-steps where context is easily lost

## When NOT to Use
- Short sections (< 400px of content) — the sticky never gets triggered
- Sections with interactive components that need full viewport height
- Front matter hero sections (they use their own scroll dynamic)

## Original Implementation Summary
The component uses `position: sticky; top: 0` on the section header element, with the parent container set to a fixed height. As the user scrolls, the header sticks while sibling content flows past it.

## Adapted Implementation

```html
<section class="band band--dark" data-spine="Architecture" data-section="Data Architecture">
  <div class="sticky-narrative-container" style="display: grid; grid-template-columns: 280px 1fr; gap: 80px; max-width: var(--col-wide); margin: 0 auto; padding: 0 48px;">

    <!-- Sticky header column -->
    <div class="sticky-header" style="position: sticky; top: 80px; height: fit-content; border-left: 4px solid var(--phthalo-lift); padding-left: 24px;">
      <div class="eyebrow" style="padding: 0; margin-bottom: 12px;">02 / Architecture</div>
      <h2 style="padding: 0; font-size: 28px;">Data Architecture & Preprocessing</h2>
      <p style="font-family: var(--mono); font-size: 11px; color: var(--tungsten); margin-top: 16px; letter-spacing: 0.1em; text-transform: uppercase;">
        Scroll to explore →
      </p>
    </div>

    <!-- Scrolling content column -->
    <div class="sticky-content">
      <p>Step 1 content...</p>
      <p>Step 2 content...</p>
      <p>Step 3 content...</p>
    </div>

  </div>
</section>
```

## Integration Notes
- `top: 80px` accounts for the 60px `#topnav` height + 20px breathing room — adjust if nav height changes
- The `border-left: 4px solid var(--phthalo-lift)` accent connects to the `.method` callout block pattern
- Works with the GSAP reveal system — add `.reveal` class to content paragraphs
- On mobile (< 768px): collapse to single column, remove sticky behavior

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/sticky-stack.html`
