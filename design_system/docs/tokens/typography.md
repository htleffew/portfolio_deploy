# Typography Tokens
> Every font family, size, weight, spacing, and leading value in the system.

---

## Font Families

### Loading (Google Fonts)
All three families loaded via a single `<link>` tag in article `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
```
Also declared in `global.css` at the top via `@import url(...)`. Both load the same families — the `<link>` tag in articles ensures fonts are available before CSS parses, preventing FOUT.

### The Three Families

| Token | Family | Fallbacks | Role | Character |
|-------|--------|-----------|------|-----------|
| `--display` / `--font-display` | Playfair Display | 'Times New Roman', serif | Headlines only | Editorial, authoritative, typographic |
| `--body` / `--font-body` | Lora | Georgia, 'Times New Roman', serif | All prose | Legible, patient, literary |
| `--mono` / `--font-mono` | JetBrains Mono | 'SF Mono', Menlo, monospace | All data/labels/code | Technical, precise, systematic |

**The display + body serif pairing** (Playfair + Lora) signals "this is longform writing worth reading" — both are editorial typefaces with strong literary associations. The mono contrast makes data feel categorically different from prose.

**Never use sans-serif fonts.** The system has no sans-serif family and doesn't want one. The serif/mono pairing is the entire typographic identity.

---

## Type Scale

All sizes defined as CSS custom properties in `:root`:

| Token | Value | Applied To |
|-------|-------|-----------|
| `--fs-caption` | 10px | Captions, metadata, grain-level labels |
| `--fs-label` | 11px | Eyebrows, mono labels, spine navigation |
| `--fs-body-sm` | 13px | Code blocks, secondary notes |
| `--fs-body` | 15px | Table cell text, secondary body |
| `--fs-body-lg` | 16px | Standard `.ds-p` body text |
| `--fs-lede` | 18px | Lede paragraphs, article body prose |
| `--fs-h4` | 20px | Sub-headings, card titles |
| `--fs-h3` | 28px | Section sub-headings |
| `--fs-h2` | 40px | Section headings (design system context) |
| `--fs-h1` | `clamp(40px, 5.5vw, 72px)` | Page titles (design system context) |

**Article-specific sizes** (from global.css component styles):
- Article H1: `clamp(28px, 3.5vw, 46px)` — slightly smaller than design system H1
- Article H2: `clamp(22px, 2.5vw, 30px)` — section headings
- Article body: `17px` or `18px` line-height `1.78`
- Abstract: `20px` italic, line-height `1.62`

---

## Weight Usage

| Weight | Loaded For | Used For |
|--------|-----------|---------|
| 300 | JetBrains Mono | Light mono (rarely used) |
| 400 | All three families | Body text, regular prose |
| 500 | Playfair Display, Lora, JetBrains Mono | Semi-emphasis, `.r-dates`, data values |
| 600 | Playfair Display, Lora | H1, H2, H3 headings — the primary display weight |
| 700 | JetBrains Mono, Playfair Display | Strong emphasis, rarely used |

**The workhorse weight is 600.** All article headings (H1, H2, H3) use `font-weight: 600`. Weight 400 handles all prose. Weight 500 is the tertiary — for values that need emphasis without being a heading.

---

## Letter-Spacing Conventions

| Token | Value | Applied To |
|-------|-------|-----------|
| `--tracking-display` | -0.015em | All display/headline text (tight = editorial) |
| `--tracking-caps` | 0.10em | Capitalized labels with moderate tracking |
| `--tracking-caps-x` | 0.35em | Heavily tracked eyebrow labels |

**Practical values by context:**
```css
/* Article eyebrows (.eyebrow) */
letter-spacing: 0.30em;   /* very open — reads from distance */

/* Spine labels (.label) */
letter-spacing: 0.18em;

/* Footer / utility text */
letter-spacing: 0.16em;

/* Nav links */
letter-spacing: 0.18em;

/* Table headers (th) */
letter-spacing: 0.10em;   /* reduced for legibility at small size */

/* Display headlines (h1, h2) */
letter-spacing: -0.012em to -0.018em;  /* negative — tight editorial feel */

/* Body text */
letter-spacing: default (0) — never track body copy */
```

**The mono-everywhere-data rule:** Any text representing data, labels, metadata, or system output uses `--mono`. This includes: eyebrows, figure captions, table headers, slider labels, nav links, footer text, spine labels, card metadata, code blocks, stat labels. Rationale: mono signals "this is information, not narrative."

---

## Line-Height Conventions

| Token | Value | Applied To |
|-------|-------|-----------|
| `--leading-tight` | 1.10 | Display headlines — packed, editorial |
| `--leading-snug` | 1.25 | H3/H4 subheadings |
| `--leading-comfort` | 1.70 | Abstract lede paragraphs |
| `--leading-reading` | 1.85 | Standard body prose — generous for long reads |

Article body paragraphs consistently use `line-height: 1.78` or `1.85`. The generosity is intentional — data science articles are read slowly and carefully.

---

## Italic Usage

Lora italic is used for:
- Abstract lede paragraphs (`.abstract { font-style: italic }`)
- Company names in experience cards (`.r-company`)
- University names in education cards (`.edu-school`)
- `.byline strong` values — the key stats in front matter

The italic signals "this is the human voice / narrative layer" vs. the roman weight which handles "this is the technical content."

---

## Font Loading: Link vs. CSS Import

| Method | When | Why |
|--------|------|-----|
| `<link>` in article `<head>` | All article HTML files | Parallel loading; prevents FOUT |
| `@import url()` in global.css | Design system / components | Ensures fonts available when CSS parses |

Both load the same families. The `<link>` tag wins on performance (browser starts fetching earlier). The `@import` in global.css is a safety net for pages that load CSS before HTML `<link>` tags.
