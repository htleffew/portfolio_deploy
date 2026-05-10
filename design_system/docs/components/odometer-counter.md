---
component: Odometer Counter
id: CIN-06
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: odometer.html
adaptation-status: token-mapped
---

## What It Does
Numbers count up from zero (or a lower value) to their final value when the element enters the viewport — creating kinetic energy around quantitative highlights.

## When to Use In This Portfolio
**DIRECT APPLICATION.** The hero stat trio (`.byline`) in article front matter contains key metrics:
- AUC: 0.974
- 1B+ records processed
- 400K+ accounts ranked

These should count up when the `.byline` section becomes visible. High-impact for quantitative portfolio — it makes the reader feel the scale of the numbers.

## When NOT to Use
- Non-numeric content
- Numbers with complex formatting that a counter would obscure (e.g., "AUC: 0.974" counts from "0.000" — plan the format)
- Hero H1 — already animated by GSAP SplitType; don't stack effects

## Trigger: On `.byline` Visibility, Not Page Load
```js
// WRONG — triggers immediately on load
window.addEventListener('load', startCounters);

// CORRECT — triggers when byline enters view
ScrollTrigger.create({
  trigger: '.byline',
  start: 'top 80%',
  onEnter: startCounters,
  once: true
});
```

## Adapted Implementation

```js
function animateCounter(el) {
  const target     = parseFloat(el.dataset.target);
  const prefix     = el.dataset.prefix || '';
  const suffix     = el.dataset.suffix || '';
  const decimals   = parseInt(el.dataset.decimals || '0');
  const duration   = parseFloat(el.dataset.duration || '2');

  gsap.to({ val: 0 }, {
    val: target,
    duration: duration,
    ease: 'power2.out',
    onUpdate: function() {
      el.textContent = prefix + this.targets()[0].val.toFixed(decimals) + suffix;
    }
  });
}

function startCounters() {
  document.querySelectorAll('[data-counter]').forEach(animateCounter);
}

// Trigger on byline visibility
if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.create({
    trigger: '.byline',
    start: 'top 80%',
    onEnter: startCounters,
    once: true
  });
}
```

## HTML Usage

```html
<div class="byline">
  <div>
    <span>AUC Score</span>
    <strong data-counter data-target="0.974" data-decimals="3" data-duration="2">0.000</strong>
  </div>
  <div>
    <span>Records Processed</span>
    <strong data-counter data-target="1000000000" data-prefix="" data-suffix="B+" data-duration="2.5">0</strong>
  </div>
  <div>
    <span>Accounts Ranked</span>
    <strong data-counter data-target="400000" data-prefix="" data-suffix="K+" data-duration="2">0</strong>
  </div>
</div>
```

## Design Token Integration
Counter elements inherit `.byline strong` styling:
```css
.front .byline strong {
  color: var(--platinum);
  font-family: var(--body);
  font-style: italic;
  font-size: 14px;
}
```

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/odometer.html`
