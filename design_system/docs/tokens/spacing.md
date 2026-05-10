# Spacing Tokens
> Every spacing value, column width, and layout dimension in the system.

---

## Base Spacing Scale

Defined as CSS custom properties in `:root`:

| Token | Value | Common Use |
|-------|-------|-----------|
| `--space-1` | 4px | Icon padding, micro gaps |
| `--space-2` | 8px | Tag internal padding, tight gaps |
| `--space-3` | 12px | Small component gaps |
| `--space-4` | 16px | Input padding, card internal gaps |
| `--space-5` | 24px | Standard component spacing |
| `--space-6` | 32px | Column padding, section internal gaps |
| `--space-7` | 40px | Figure margins, simulator margins |
| `--space-8` | 48px | Nav padding horizontal, footer padding |
| `--space-9` | 60px | Footer padding, between major components |
| `--space-section` | 120px | Between major page sections (band padding override) |

---

## Column Width System

| Token | Value | Used For |
|-------|-------|---------|
| `--col` | 860px | Default prose column — all article body text |
| `--col-wide` | 1200px / `var(--col-wide)` | Wide figures, tables, simulators, back matter |

Practical usage:
```css
.col      { max-width: var(--col);      margin: 0 auto; padding: 0 32px; }
.col-wide { max-width: var(--col-wide); margin: 0 auto; padding: 0 48px; }
```

In the master grid system (≥1240px viewport), elements in `section.band` are placed in a 680px reading column (column 2). Full-width elements (`.col-wide`, `.figure`, `.report-prose`) span columns 2–4 (680px + 400px sidenote column).

---

## Band Padding

| Context | Padding | Token |
|---------|---------|-------|
| Default `.band` | `80px 0` | — |
| `.front` hero | `120px 0 80px` | min-height: `clamp(400px, 80vh, 850px)` |
| `.back-matter` | `120px top, 160px bottom` | — |
| Mobile (≤768px) | `60px 0` (approximate) | Reduces with content padding |

**The 80px default** is generous — equivalent to roughly 5 body text lines. This padding creates the "cinematic breathing room" between sections and ensures the starfield is always partially visible between bands.

---

## Navigation Height

`#topnav` height: **60px**

This affects all article content:
- `.front` sections need `padding-top: 120px+` to clear the fixed nav
- Sticky elements (`#spine`, `.sticky-header`) use `top: 80px` (nav + 20px buffer)
- `#progress` bar is at `top: 0` (directly behind nav, visible above content)

---

## Card Internal Padding

| Component | Padding |
|-----------|---------|
| `.r-card .r-content` | `48px` all sides |
| `.edu-card` | `48px` all sides |
| `.tech-block` | `40px 48px` (less top/bottom) |
| `.bio-card` | `48px` all sides |
| `.r-card` recommendation (back matter) | `28px 28px 32px` |
| `.next-chap` | `48px` all sides |
| Search result `.search-result-item` | `24px` |

Mobile override for cards (`≤768px`): `.r-content { padding: 32px 24px; }` — reduces to comfortable reading width.

---

## Figure Caption Spacing

```css
.figure .cap {
  margin-top: 14px;    /* gap between frame and caption */
}
```

`.figure` itself has `margin: 48px auto` — matching the `--space-7` token. This gives figures the same visual weight as the `--space-7` paragraph spacing, so they feel like part of the reading flow rather than interruptions.

---

## Code Block Padding

```css
.code-block {
  padding: 1.5rem;         /* 24px all sides */
  margin: 2rem auto;       /* 32px top/bottom */
  max-width: var(--col);   /* constrained to reading column */
}
.code-container {
  max-width: var(--col-wide);
  margin: 32px auto;
  padding: 0 32px;
}
```

The difference between `.code-block` and `.code-container` + `.code-block`:
- `.code-block` alone: reading column width, centered by `.col` parent
- `.code-container > .code-block`: full-wide container for code that benefits from extra width (pipeline code with long lines)

---

## The 48px Base Page Margin Convention

Horizontal padding on all major layout containers is **48px** on desktop, **24px** on mobile:
```css
/* Desktop */
.col-wide { padding: 0 48px; }
#topnav   { padding: 0 48px; }
.back-matter .related { padding: 0 48px; }
.next-chap { padding: 48px; }

/* Mobile (≤768px) */
.col-wide { padding: 0 24px; }
#topnav   { padding: 0 24px; }
```

The 48px margin creates a consistent "safe zone" — no content ever touches the viewport edge at desktop widths.

---

## Radii

All corners are sharp (`border-radius: 0 !important` globally). The radius tokens exist in the design system for component library use but are not applied in the portfolio:

| Token | Value | Status in Portfolio |
|-------|-------|-------------------|
| `--radius-sm` | 4px | Available but overridden |
| `--radius-md` | 8px | Available but overridden |
| `--radius-lg` | 12px | Available but overridden |
| `--radius-pill` | 20px | Available but overridden |

Note: SVG elements use `rx="2"` or `rx="4"` in the hierarchy tree and card diagrams — this is SVG attribute syntax, not CSS, and is not affected by the global `border-radius: 0` reset.

---

## Shadows

| Token | Value | Applied To |
|-------|-------|-----------|
| `--shadow-card` | `0 8px 32px rgba(0,0,0,0.30)` | Available for cards |
| `--shadow-glow` | `0 0 20px 0 rgba(77,140,255,0.06)` | Available for glow accents |

Shadows are rarely used in the portfolio — the design relies on border, backdrop-filter, and z-index layering for depth rather than drop shadows. The Three.js starfield provides all the depth the design needs.
