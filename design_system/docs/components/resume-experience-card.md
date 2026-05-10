---
component: Resume Experience Card
id: LAY-04
status: stable
category: layout
interactivity: hover (3D tilt)
source: index.html — experience section (.r-card, .resume-stack)
---

## What It Does
A structured experience card with role title, company, dates, intro paragraph, and bullet points. Features a subtle grid-texture hover surface and 3D tilt effect applied automatically by global.js.

## When to Use
- Resume/CV experience entries on the homepage or about page
- Project case study "approach" cards listing methodology steps
- Any structured "here's what I did at X" content

## Anatomy
```
┌──────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← .r-bg (grid texture, absolute)
│                                                          │
│  Senior Data Scientist          [2022 – Present]         │  ← .r-title + .r-dates
│  Acme Corp                                               │  ← .r-company
│ ─────────────────────────────────────────────────────── │
│  Introduction paragraph describing the role context      │  ← .r-intro
│  and what made this position distinctive.               │
│                                                          │
│  ▸ Bullet point one describing a key achievement         │  ← .r-bullets li
│  ▸ Bullet point two with specific outcome or metric      │
│  ▸ Bullet point three                                    │
└──────────────────────────────────────────────────────────┘
```

## Implementation

```html
<div class="resume-stack">
  <div class="r-card">
    <div class="r-bg"></div>    <!-- grid texture hover surface — required -->
    <div class="r-content">
      <div class="r-header">
        <div>
          <div class="r-title">Senior Data Scientist</div>
          <div class="r-company">Acme Corporation</div>
        </div>
        <div class="r-dates">2022 – Present</div>
      </div>
      <p class="r-intro">
        Brief paragraph (2–3 sentences) describing the role, team context,
        and the primary problem space.
      </p>
      <ul class="r-bullets">
        <li>Specific achievement with a measurable outcome</li>
        <li>Technical contribution with named technology or approach</li>
        <li>Impact statement at organizational or customer level</li>
      </ul>
    </div>
  </div>
  <!-- Add more .r-card elements for additional roles -->
</div>
```

## The `.r-bg` Hover Surface Layer

```css
.r-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(245,245,247,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,245,247,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}
```

The `.r-bg` grid texture is invisible until hover — it's always present but only becomes perceptible when the card subtly brightens via the `border-color` transition and 3D tilt scale. It gives the card surface a "material" quality — like brushed metal — without adding visual noise.

## The 3D Tilt Interaction

global.js automatically applies 3D tilt to all `.r-card` elements (no manual wiring needed):

```js
// Applied by global.js — do not add manually
card.addEventListener('mousemove', (e) => {
  const rotateX = ((y - centerY) / centerY) * -3;
  const rotateY = ((x - centerX) / centerX) * 3;
  card.style.transform =
    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
});
```

The ±3° constraint is intentional — enough to feel physical, not enough to obscure content.

## CSS (from global.css — dark band variant)

```css
.r-card {
  position: relative;
  overflow: hidden;
  background: rgba(22,22,22,0.65);
  border: 1px solid var(--graphite);
  border-bottom: 0;          /* stack cards flush */
  transition: border-color 0.7s;
}
.r-card:last-child { border-bottom: 1px solid var(--graphite); }
.r-card:hover { border-color: var(--tungsten); }
.r-content { position: relative; z-index: 1; padding: 48px; }
.r-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--graphite);
}
.r-title { font-family: var(--display); font-size: 22px; font-weight: 600; color: var(--flare); }
.r-company { font-family: var(--body); font-size: 15px; font-style: italic; color: var(--phthalo-lift); }
.r-dates {
  font-family: var(--mono); font-size: 11px; text-transform: uppercase;
  letter-spacing: 0.10em; padding: 6px 16px;
  color: var(--tungsten); border: 1px solid var(--graphite);
}
.r-bullets li::before { content: '\25B8'; color: var(--phthalo-lift); }
```

## Design Tokens Applied
| Element | Dark Band | Paper Band |
|---------|-----------|------------|
| Card background | `rgba(22,22,22,0.65)` | `#fff` |
| Card border | `--graphite` | `--paper-3` |
| Title | `--flare` | `--ink` |
| Company | `--phthalo-lift` | `--ink-blue` |
| Dates border/text | `--graphite` / `--tungsten` | `--paper-3` / `--ink-3` |
| Bullet marker | `--phthalo-lift` | `--ink-blue` |
| Body text | `--platinum` | `--ink-2` |

## Source Reference
`index.html` → `.resume-stack` section. CSS in global.css → `.r-card`, `.r-bg`, `.r-content`, `.r-header`, `.r-bullets`.
