# The "Obsidian & Chrome" Design System
> **Target Standard**: Sharp, high-fidelity, dual-mode (Dark/Light), zero-radii typography and layout.

The visual identity of the portfolio must reflect the gravity and precision of the interdisciplinary engineering work. It rejects generic "SaaS-y" designs (rounded corners, soft drop shadows, pastel gradients) in favor of a metallurgical, institutional aesthetic.

## 1. Zero Radii
- All corners must be perfectly sharp.
- `border-radius: 0 !important;` is applied globally to all elements, including buttons, inputs, panels, and graph containers.

## 2. The Color Palette
The portfolio operates on a dual-mode system (`band--dark` and `band--paper`) defined by strict CSS variables.

### Mineral Neutrals (Dark Mode)
- `--obsidian: #030303;` (Deepest background)
- `--charcoal: #161616;` (Secondary panels)
- `--graphite: #222222;` (Borders and separators)
- `--brushed: #333333;`
- `--tungsten: #A1A1A6;` (Muted text)
- `--platinum: #F5F5F7;` (Primary reading text)
- `--flare: #FFFFFF;` (Headings and emphasis)

### Paper Neutrals (Light Mode)
- `--paper: #F5F5F7;` (Primary background)
- `--paper-2: #E9E9E9;`
- `--paper-3: #DDDDDD;` (Borders and separators)
- `--ink: #030303;` (Headings)
- `--ink-2: #222222;` (Primary reading text)
- `--ink-3: #5E5E5A;` (Muted text)

### Brand Accents
- `--phthalo-lift: #3866A0;` (Primary interaction color, Dark mode focus)
- `--ink-blue: #1A3A6B;` (Primary interaction color, Light mode focus)

## 3. Typographic Hierarchy
- **Display (`--display`):** Playfair Display. Used exclusively for massive page titles (H1) and section headers (H2).
- **Body (`--body`):** Lora. Used for all long-form prose and abstracts. Must be legible, patient, and set at `18px` with a `1.78` line-height.
- **Mono (`--mono`):** JetBrains Mono. Used for all utility text, eyebrows, metadata, and data visualizer labels. Always heavily tracked (`letter-spacing: 0.18em` to `0.30em`) and uppercase when used as labels.

# The "Obsidian & Chrome" Design System
> **Target Standard**: Sharp, high-fidelity, dual-mode (Dark/Light), zero-radii typography and layout.

The visual identity of the portfolio must reflect the gravity and precision of the interdisciplinary engineering work. It rejects generic "SaaS-y" designs (rounded corners, soft drop shadows, pastel gradients) in favor of a metallurgical, institutional aesthetic.

## 1. Zero Radii
- All corners must be perfectly sharp.
- `border-radius: 0 !important;` is applied globally to all elements, including buttons, inputs, panels, and graph containers.

## 2. The Color Palette
The portfolio operates on a dual-mode system (`band--dark` and `band--paper`) defined by strict CSS variables.

### Mineral Neutrals (Dark Mode)
- `--obsidian: #030303;` (Deepest background)
- `--charcoal: #161616;` (Secondary panels)
- `--graphite: #222222;` (Borders and separators)
- `--brushed: #333333;`
- `--tungsten: #A1A1A6;` (Muted text)
- `--platinum: #F5F5F7;` (Primary reading text)
- `--flare: #FFFFFF;` (Headings and emphasis)

### Paper Neutrals (Light Mode)
- `--paper: #F5F5F7;` (Primary background)
- `--paper-2: #E9E9E9;`
- `--paper-3: #DDDDDD;` (Borders and separators)
- `--ink: #030303;` (Headings)
- `--ink-2: #222222;` (Primary reading text)
- `--ink-3: #5E5E5A;` (Muted text)

### Brand Accents
- `--phthalo-lift: #3866A0;` (Primary interaction color, Dark mode focus)
- `--ink-blue: #1A3A6B;` (Primary interaction color, Light mode focus)

## 3. Typographic Hierarchy
- **Display (`--display`):** Playfair Display. Used exclusively for massive page titles (H1) and section headers (H2).
- **Body (`--body`):** Lora. Used for all long-form prose and abstracts. Must be legible, patient, and set at `18px` with a `1.78` line-height.
- **Mono (`--mono`):** JetBrains Mono. Used for all utility text, eyebrows, metadata, and data visualizer labels. Always heavily tracked (`letter-spacing: 0.18em` to `0.30em`) and uppercase when used as labels.

## 4. The Mode Bands
Pages are constructed using alternating horizontal bands to segment information:
- `.band--dark`
- `.band--paper`
When building interactive simulators or tables, you must ensure the CSS scopes correctly for both environments (e.g., `.band--paper .sim-panel { background: #fff; border-color: var(--paper-3); }`).

## 4. The Master CSS Grid & Portrait Mode Polish (Global Layout Mandate)
**CRITICAL:** Never use arbitrary pixel offsets, `margin: 0 auto` centering for desktop text columns, or `display: flex; align-items: center;` to override the band structure. 
The portfolio typography is powered by a native **Master CSS Grid** on breakpoints >= 1240px. 
Every `<section class="band">` acts as a grid container that mathematically balances the 680px reading column, the 400px right-gutter Sidenotes, and the full-width components.

```css
/* MASTER GRID & PORTRAIT MODE POLISH */
:root { --grid-left: max(32px, calc(50vw - 540px)); }
@media (min-width: 1360px) { :root { --grid-left: max(260px, calc(50vw - 540px)); } }

section.band:not(.front) {
  display: block; /* Fallback for small screens, do NOT use flex here */
}

@media (min-width: 1240px) {
  section.band:not(.front) {
    display: grid;
    grid-template-columns: var(--grid-left) 680px 400px minmax(16px, 1fr);
    align-items: start;
  }
  section.band:not(.front) > * {
    grid-column: 2 / 3;
    margin-left: 0 !important; margin-right: 0 !important;
  }
  section.band:not(.front) > .col-wide, 
  section.band:not(.front) > .stat-grid, 
  section.band:not(.front) > .figure, 
  section.band:not(.front) > .report-prose {
    grid-column: 2 / 4;
    width: 100%; max-width: none;
  }
}
/* Ensure paragraphs wrap properly on all viewports */
p, li, .abstract, .r-intro, .p-desc, .db-desc {
  overflow-wrap: normal;
  hyphens: none;
}
/* Portrait Mode Space Fix */
.front { min-height: clamp(400px, 80vh, 850px) !important; justify-content: center !important; }
```

## 5. Performance Mandates (The "Stutter" Fixes)
**CRITICAL:** 
1. **Single WebGL Context**: Never instantiate more than one WebGL canvas (e.g. `Three.js` or raw `gl`) across the viewport. If multiple layers (like stars and networks) are required, they must be composited within the *same* Three.js scene.
2. **No Backdrop Filter Thrashing**: Refrain from using `backdrop-filter: blur()` over moving WebGL elements. It forces the browser to recalculate the blur every frame, causing severe GPU stutter. Solid or semi-opaque colors are required.
3. **ScrollTrigger Refresh Caution**: Do not aggressively fire `ScrollTrigger.refresh()` on every expanding element without a delay, as this causes massive layout thrashing.
