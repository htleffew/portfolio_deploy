---
component: Sticky Cards
id: CIN-04
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: sticky-cards.html
adaptation-status: token-mapped
---

## What It Does
Cards stack on top of each other as the user scrolls — each new card slides up and overlaps the previous one, creating a layered deck effect for multi-step content.

## When to Use In This Portfolio
- Multi-strategy methodology sections (e.g., the 4 modeling strategies in multimodal-autism-ai.html: Supervised, Semi-Supervised, Late Fusion, Bayesian Ensemble)
- Step-by-step pipeline explanations where order matters
- Any "here are N approaches" section currently using a bulleted `.method` block

## When NOT to Use
- Fewer than 3 cards (stacking effect doesn't register)
- Content where the reader needs to compare all cards simultaneously (use a grid instead)
- Mobile-primary contexts (stacking requires sufficient viewport height)

## Adapted Implementation

```html
<div class="sticky-cards-container" style="position: relative; height: 400vh;">
  <!-- Height = number of cards × ~100vh -->

  <div class="sticky-cards-stage" style="position: sticky; top: 80px; height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center;">

    <!-- Card stack — cards positioned absolutely, staggered -->
    <div style="position: relative; width: 100%; max-width: var(--col);">

      <div class="r-card sticky-card" data-index="0" style="position: absolute; width: 100%; transform-origin: top center;">
        <div class="r-bg"></div>
        <div class="r-content">
          <div class="eyebrow" style="padding:0; margin-bottom:8px;">Strategy 01</div>
          <div class="r-title">Supervised Learning</div>
          <p class="r-intro">Logistic Regression, XGBoost, Random Forest trained on labeled data...</p>
        </div>
      </div>

      <div class="r-card sticky-card" data-index="1" style="position: absolute; width: 100%; transform-origin: top center; transform: translateY(20px) scale(0.97);">
        <!-- Card 2 content -->
      </div>

      <div class="r-card sticky-card" data-index="2" style="position: absolute; width: 100%; transform-origin: top center; transform: translateY(40px) scale(0.94);">
        <!-- Card 3 content -->
      </div>

      <div class="r-card sticky-card" data-index="3" style="position: absolute; width: 100%; transform-origin: top center; transform: translateY(60px) scale(0.91);">
        <!-- Card 4 content -->
      </div>

    </div>
  </div>
</div>
```

```js
// Animate cards in as reader scrolls through container
const cards = document.querySelectorAll('.sticky-card');
cards.forEach((card, i) => {
  ScrollTrigger.create({
    trigger: '.sticky-cards-container',
    start: `${i * 25}% top`,
    end: `${(i + 1) * 25}% top`,
    onEnter: () => {
      gsap.to(card, { y: 0, scale: 1, zIndex: i + 1, duration: 0.6, ease: 'power2.out' });
    }
  });
});
```

## Design Token Integration
Cards use `.r-card` and `.r-bg` from the resume experience card system — same dark glass surface, same 3D tilt from global.js.

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/sticky-cards.html`
