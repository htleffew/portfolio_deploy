# Heather Leffew Design System

> **Editorial dark-mode design system for the executive profile of Dr. Heather Leffew, PhD** — Director of Data Science (Spokeo), former Principal Data Scientist at TikTok USDS, and computational linguist whose doctoral research established a predictive typology for instrumental and affective mass violence using computer-mediated linguistic analysis.

This is the design system that powers `DrHeatherLeffew.com` — a single-author research portfolio whose visual language is closer to a thoughtful long-form publication (think *The Atlantic* meets a working-paper preprint) than to a typical technologist's marketing site. It is dark, serif-led, monochrome with a single sapphire accent, and quietly cinematic: thin hairlines, JetBrains Mono eyebrows, Playfair Display headlines, ambient WebGL backdrops that never announce themselves, and a default reading rhythm that respects long technical prose.

---

## The person and the surface

Dr. Heather Leffew is an executive AI leader, applied research psychologist, and computational linguist with 20+ years across regulated and high-stakes environments. Her professional surface area is unusual: clinical neurotherapy → forensic and threat assessment → public-safety analytics → enterprise ML at TikTok USDS → founding the data-science function at Spokeo. The site exists to compress that range into something coherent — a single executive profile where each case study reads like a serious technical write-up rather than a deck slide.

The design system serves **one product, one surface**: the executive profile portfolio. There is no app, no marketing site, no docs. There is one site with a small set of view types, and the design system is engineered to make those view types feel like chapters in the same book.

### View types in the existing site
- **Executive profile** (`index.html`) — hero with headshot, expandable biography, project carousel, full résumé stack, education cards, capability tag clusters.
- **Research index** (`projects-repository.html`) — searchable, filterable feed of ~30+ case studies with category chips and editorial article cards.
- **Case study pages** (`entity-resolution-pipeline.html`, `agentic-routing.html`, `clinical-validation.html`, etc.) — long-form technical narratives with diagrams, code, methodology callouts, and inline figures.

---

## Sources used to extract this system

All extracted from real, shipped code — not screenshots, not invention.

- **Codebase:** `htleffew/Pm_html` (private GitHub repo), branch `main`. ~30 standalone HTML files plus a partial `design-system-output/` folder authored earlier.
  - Anchor pages read in detail: `index.html`, `projects-repository.html`.
  - Token files mined: `design-system-output/brand-tokens.css`, `design-system-output/brand-design-system.json`, `design-system-output/README.md`.
  - Companion assets: `Heather_headshot_2.jpg` (executive headshot), `Heather-Leffew-PhD_Resume-042026.pdf`.
- **Uploaded files** (also in `assets/`):
  - `assets/Heather_headshot_2.jpg`
  - `assets/Heather-Leffew-PhD_Resume-042026.pdf`

The site also uses three CDN libraries that this design system inherits as *optional* runtime dependencies, not foundational requirements: GSAP + ScrollTrigger (reveal animation), Lenis (smooth-scroll), and Three.js (a near-invisible wireframe icosahedron drifting in the background as ambient signal).

---

## CONTENT FUNDAMENTALS

The narrative voice across the site — and by request, every piece of prose this design system generates — is in the spirit of **Andrej Karpathy**: respectful, humble, accessible, but individually rigorous. Technical details are preserved and explained with academic, intellectual, warm, generous patience. The reader is treated as smart but not assumed to share the author's specialty.

### Voice rules
- **First person used sparingly, third person used often.** The biography speaks of "Dr. Leffew" in third person ("She led…", "Her team…"); only inside personal asides does the voice shift to first.
- **No marketing register.** Never "we're excited to," "transformative," "game-changing." Outcomes are stated and then explained — "reduced core processing time from 150+ hours to 24–36 hours" — and the *why* and *how* are the interesting part.
- **Quantify, then contextualize.** Numbers always come with their unit and their stake: "an analytics product suite processing **1B+ records**", "**400K+ violative accounts** identified, enabling enforcement on **15K+** accounts without increasing appeals."
- **Mechanism over metaphor.** Prefer "a 15-step distributed graph-ML pipeline combining knowledge graphs, graph ML, and weak supervision for entity resolution and data fusion" to "AI magic that connects the dots."
- **Acknowledge what was unusual or uncomfortable.** From the bio: *"Her trajectory from clinical neurotherapy into enterprise data architecture is uncommon but entirely deliberate."* The voice doesn't paper over the seam — it explains it.
- **Closing claims are quiet, not triumphant.** *"Having psychologists design the systems that govern human beings makes perfect sense."* The site never says "I'm the best at this." It says "this is why I work this way."

### Casing & punctuation
- **Title Case for headlines** (`Machine Learning Leadership & Strategy`, `Interactive Simulators & Projects`).
- **UPPER CASE WITH WIDE TRACKING** for eyebrows and meta labels (`DATA SCIENCE & SYSTEMS ARCHITECTURE`, `5 MIN READ`, `READ CASE STUDY →`).
- **Sentence case for buttons that look like sentences** ("Read Full Biography ↓") — use Title Case if the button is a verb-noun directive, sentence case if it's read like prose.
- **The em dash and the en dash earn their keep.** En dash for ranges (`Sep 2025 – Present`, `150+ hours to 24–36 hours`), em dash for parenthetical thought (`Her trajectory — uncommon but entirely deliberate — moves through clinical work into…`).
- **Ampersand allowed in titles and chips** when it tightens a compound (`Graph ML & Identity`, `Leadership & AI Strategy`).
- **No oxford-comma exceptions.** Use them.

### Pronouns & address
- The site refers to the author as **"Dr. Heather Leffew"** on first reference and **"Dr. Leffew"** thereafter. Never just "Heather" in published surfaces.
- Use **"you"** only when literally addressing the reader — and that is rare. A case study explains a system; it does not coach the reader.

### Emoji
**Never.** Not in chips, not in eyebrows, not in callouts. The accent is the sapphire glyph and the JetBrains Mono `▸` arrow used in résumé bullet markers. If a glyph is needed, use a unicode arrow (`→`, `↓`, `↑`, `←`) or the typographic em-dash. Emoji break the editorial register on first appearance.

### Concrete examples (copy from the live site)
- *Eyebrow:* `DATA SCIENCE & SYSTEMS ARCHITECTURE`
- *Hero title:* `Machine Learning Leadership & Strategy`
- *Subtitle:* `Modeling Human Complexity Through Applied AI`
- *Section eyebrow:* `FEATURED WORK`
- *Section heading:* `Interactive Simulators & Projects`
- *Card eyebrow:* `PRODUCTION PIPELINE`
- *Card title:* `Entity Resolution Pipeline`
- *Card body:* "A 15-step distributed graph-ML pipeline for semantic identity fusion across 49TB of streaming vendor records."
- *Bio opening:* "**Dr. Heather Leffew** is an executive data science leader and behavioral systems modeler with over twenty years of experience in AI strategy, digital transformation, and quantitative research."

---

## VISUAL FOUNDATIONS

### Mood
**"Mineral & gemstone."** A near-black mineral ground (obsidian / charcoal / brushed steel) into which a single faceted color is set. Most pages are 95% neutral; the sapphire accent functions like a polished stone in a museum vitrine — there is exactly one in view at a time, and you notice it.

### Color
- **Neutrals form the entire reading experience.** `--obsidian #030303` is the page; `--charcoal #1A1A1A` is the only raised surface; `--brushed #333` is the hairline; `--platinum #F5F5F7` is body text; `--tungsten #A1A1A6` is muted/meta; `--flare #FFFFFF` is reserved for headlines and the rare hover-emphasized link.
- **Sapphire is the working accent.** `--sapphire-deep #0F52BA` for resting links and CTA borders, `--sapphire #4D8CFF` for hover states, eyebrow highlights on section headers, and the 64-px hero rule under the headline.
- **Case-study diagrams use the oil paint quartet.** A working representational painter's palette: `--phthalo #0F3A6B` (Phthalo Blue, primary categorical), `--alizarin #7A1626` (Alizarin Crimson), `--hookers #1A4A38` (Hooker's Green), `--hansa #DBA844` (Hansa Yellow Light, always carried at the lifted value). `--dioxazine #3D1F4A` (Dioxazine Purple) is held in reserve for the rare case where a chart genuinely has five categories. Monochrome / sequential scales restrict to Phthalo Blue only (`--phthalo` → `--phthalo-lift #3866A0` → mid `#6F8AAE` → pale `#A8BACE`); the other pigments do not have coherent tint stages. These pigments **never** appear in chrome, navigation, or body text — bringing them out of figures is a system violation.
- **Transparency over alpha-mixing.** Backgrounds and overlays use `rgba(3,3,3,0.92)` style stacks to compose with the WebGL backdrop rather than swapping the palette.

### Type
- **Display: Playfair Display (600).** Editorial serif with a real italic; used for h1–h4 and brand wordmark. `letter-spacing: -0.015em` at large sizes to compensate for serif looseness.
- **Body: Lora (400/500, italic 400).** A working serif designed to read at 15–18px on dark; `line-height: 1.85` for long-form, `1.7` for cards, `1.1` for headlines.
- **Monospace: JetBrains Mono (300/400/500/700).** Used for *every* eyebrow, meta label, button, chip, and section pre-title. UPPERCASE with `0.10em` tracking (chips, links) or `0.35em` (hero eyebrows). The mono treatment is the most distinctive single move in the system.
- **Three families is the cap.** Do not introduce a fourth. If you need a sans-serif, use mono.

### Backgrounds
- **Solid obsidian everywhere except the case-study reading column.** No gradient backgrounds on body sections.
- **Cards use a 135° vignette inside the card itself**, not the page: `linear-gradient(135deg, rgba(26,26,26,0.65) 0%, rgba(3,3,3,0.4) 100%)` — readable, slightly luminous on the upper-left, fading toward the lower-right.
- **Ambient WebGL.** A single Three.js wireframe icosahedron at 4% opacity sapphire, drifting at ~0.0005 rad/frame. Off-axis (positioned at `(10, 0, -15)`). Fixed `z-index: -30`, `pointer-events: none`. It must be barely perceptible — if it draws attention, it has failed.
- **No full-bleed photography.** The headshot is *the only* photo asset; it lives inside a `aspect-ratio: 3/4` rounded container with grayscale-on-rest, color-on-hover treatment.
- **No repeating textures, no patterns, no illustration system.** Optional grid-paper background on `.r-bg` (résumé cards) at `background-size: 40px 40px` and 2.5% white — only on cards, never on the page.

### Animation
- **Two timing curves:** `power2.out` for entry reveals; `power2.inOut` for the boot overlay fade. Default 0.6–0.8s for staggered reveals, 1.2s for the boot fade, 90s linear infinite for the project carousel marquee.
- **Smooth-scroll via Lenis** with `duration: 1.6` and a custom ease `(t) => 1.001 - 2^(-10t)` — long-tail momentum that mimics weighted scroll wheels.
- **Stagger constants:** `delay: count * 0.05` for feed cards (rendered in batches), `delay: 0.5` for the nav slide-in.
- **No bounces, no spring overshoot, no scale-pop.** The motion vocabulary is exclusively translate + opacity. A bounce would feel like the wrong material.
- **Hover halo.** A 200–250px radial-gradient halo follows the cursor at `mix-blend-mode: screen`, `opacity ~6%`. Easing is `0.08` lerp per frame. Disabled on touch.

### Hover states
- **Links:** `--sapphire-deep` → `--flare`, with a `border-bottom` that fades from transparent to flare. Never an underline-by-default.
- **Cards:** lift 4px (`translateY(-4px)`), border shifts from `rgba(51,51,51,0.5)` to `rgba(77,140,255,0.25)`, plus a sapphire glow `box-shadow: 0 0 20px 0 rgba(77,140,255,0.06)` and `backdrop-filter: blur(12px) brightness(1.15)`. Carousel marquee `animation-play-state: paused` on hover.
- **Buttons:** border color → sapphire, background → `rgba(77,140,255,0.10)`. `btn-back` inverts to flare-on-obsidian.
- **Headshot image:** `filter: grayscale(100%) contrast(1.1)` at rest → `grayscale(0%) contrast(1.05)` on hover, 0.6s ease.
- **Filter chips:** dashed border at rest, solid sapphire fill when `.active` (with obsidian text — the only place sapphire becomes a fill).

### Press / focus states
- **Press is not separately styled** — the hover state is also the active state. Designers should not invent shrink-on-press; it conflicts with the editorial register.
- **Focus visible** uses sapphire border on inputs and a 2px sapphire outline on `:focus-visible` for buttons. Default browser outlines are removed only when a visible alternative exists.

### Borders
- Hairlines come in three weights:
  - `--border-subtle` `1px solid rgba(255,255,255,0.05)` — global nav bottom, footer top.
  - `--border-card` `1px solid rgba(51,51,51,0.5)` — every card, every input.
  - `--border-interactive` `1px solid rgba(255,255,255,0.20)` — buttons.
  - `--border-dashed` `1px dashed rgba(255,255,255,0.20)` — chip tags, résumé date pills, intra-card dividers.
- Borders **never** take a brand color at rest. Only on hover or `.active`.

### Shadows
- **Single elevation token:** `0 8px 32px rgba(0,0,0,0.30)` on cards and panels. Do not invent a stack — the design uses border + faint inner light, not depth.
- **Glow only on hover** (`0 0 20px 0 rgba(77,140,255,0.06)`).
- **No inner shadows. No layered shadows.** If you find yourself reaching for a second shadow, you are probably trying to compensate for a missing border.

### Capsules vs. protection gradients
- **Cards always carry a "protection gradient"** (`::before` pseudo, `linear-gradient(to right, rgba(3,3,3,0.92) → rgba(3,3,3,0))`, opacity `0.5`) so foreground text remains readable when a card overlaps the WebGL backdrop. This is not decorative; it is functional.
- **Pills (`.f-tag`, `.r-dates`, `.ts-tag`) use `border-radius: 20px`** — the universal "capsule" radius. They never carry a fill at rest.

### Layout rules
- **Single content max-width: `1400px`.** Almost everything centers in a `1400px` container with `padding: 0 48px` on desktop and `0 24px` below 768px.
- **Section vertical rhythm: `padding: 120px 48px;`** with a 1px hairline `border-top: 1px solid rgba(51,51,51,0.3)` between sections.
- **Card grid: `gap: 24px`.** Carousel cards: `width: 440px; height: 320px;`. Article cards span the column at 800px max for reading.
- **Hero grid: `grid-template-columns: 1fr 400px; gap: 80px;`** — text left, headshot right, collapses to single column under 1024px with the headshot moved above the text (`order: -1`).
- **Fixed nav height: 72px.** Sticky filter bar offsets `top: 72px`. Mobile breakpoints at 1024 / 900 / 768.

### Transparency & blur
- **Backdrop-filter: blur is only used on chrome and cards** — `blur(8px)` on the global nav, `blur(12px)` on cards and the sticky filter bar, `blur(12px) brightness(1.15)` on card hover. Never on body content. Never on text behind blur.
- **Why blur exists:** to keep the WebGL backdrop legible behind chrome without dimming it. Without blur the sapphire icosahedron rasterizes through the nav unattractively.

### Corner radii
- `4px` — buttons, inputs, small controls
- `8px` — search input, callouts
- `12px` — cards, the headshot frame
- `20px` — pills / chips / date capsules
- The system never uses `0`, `2px`, or `999px`. Each radius reads as deliberate at the chosen size.

### Imagery vibe
- **The single approved image is the headshot.** Color, warm bokeh, café/window light — but it lives behind a `grayscale(100%) contrast(1.1)` filter and only restores color on hover. The site is monochrome at rest.
- **No stock photography. No generated imagery. No illustrative SVG figures.** Case studies use SVG/Canvas diagrams, not decorative illustration. If a future surface needs imagery, prefer photograph-of-a-real-thing in cool/desaturated tones over rendered/illustrated.

### Cards (canonical anatomy)
- Background: `linear-gradient(135deg, rgba(26,26,26,0.65) → rgba(3,3,3,0.4))`
- Border: `1px solid rgba(51,51,51,0.5)`
- Radius: `12px`
- Shadow: `0 8px 32px rgba(0,0,0,0.30)`
- Backdrop-filter: `blur(12px)`
- Pseudo `::before` "protection gradient" left-to-right
- Pseudo `::after` 1px top highlight `linear-gradient(rgba(255,255,255,0.04) → transparent)`
- Padding: 40–48px
- Internal eyebrow → title → body → link arrow (always in that order on a project card)

---

## ICONOGRAPHY

The site has **no icon font and almost no icons** — and that is the deliberate choice the design system has to defend.

- **Glyphs as icons.** The entire iconographic vocabulary of the live site is unicode characters used inside `<span>` tags: `→` (project link arrow), `↓` (download / expand), `↑` (collapse), `←` (back nav), `▸` (résumé bullet marker, set in JetBrains Mono and colored sapphire). That is the whole set.
- **No Material / Heroicons / Lucide / Feather imports.** A real icon set would over-furnish the editorial surface and immediately make the site look like a product dashboard.
- **No emoji.** Ever, anywhere. See CONTENT FUNDAMENTALS.
- **No SVG illustration assets.** The only SVG in the codebase is procedurally generated by Three.js (the icosahedron) and by case-study diagrams (chart axes, network nodes — content, not chrome).
- **No PNG icons.** None in the codebase, none added here.

### When you need an icon for a new surface
1. **First**, ask: does this need a glyph at all? A JetBrains Mono UPPERCASE label with `0.10em` tracking communicates more than 90% of UI metaphors (`READ CASE STUDY`, `DOWNLOAD PDF`). Use the label.
2. If you genuinely need a glyph, **use the unicode set above first** (`→ ↓ ↑ ← ▸`).
3. If the unicode set isn't enough — for example, a future settings UI — **substitute the closest CDN match and flag it**: `Lucide` (https://unpkg.com/lucide-static) at stroke-width 1.25, sized 16–20px, colored `--tungsten` at rest and `--flare` on hover. **Flag this substitution to the user** because the live site has nothing like it and the choice should be ratified.

### Logo / wordmark
- The site does not have a separate logo asset. The "logo" is the wordmark **"Dr. Heather Leffew"** set in Playfair Display 600, 18px, `letter-spacing: 0.05em`, color `--flare`. It appears as `.nav-brand` in the global nav and is repeated as the text in the hero `<h1>`. There is no monogram, no mark, no glyph — and the system codifies this absence.

### Assets in `assets/`
- `Heather_headshot_2.jpg` — primary executive headshot. Use only inside the `.headshot-wrap` pattern with the prescribed grayscale-on-rest filter.
- `Heather-Leffew-PhD_Resume-042026.pdf` — the canonical résumé file linked from the hero "Resume PDF ↓" CTA.

---

## Index — what's in this folder

```
.
├─ README.md                    ← you are here
├─ SKILL.md                     ← cross-compatible Agent Skills definition
├─ colors_and_type.css          ← all CSS vars: tokens + semantic styles
├─ assets/
│   ├─ Heather_headshot_2.jpg
│   └─ Heather-Leffew-PhD_Resume-042026.pdf
├─ preview/                     ← design-system tab cards (Type, Colors, Spacing, Components, Brand)
│   ├─ type-display.html
│   ├─ type-body-mono.html
│   ├─ type-scale.html
│   ├─ colors-neutrals.html
│   ├─ colors-accents.html
│   ├─ colors-semantic.html
│   ├─ radii.html
│   ├─ shadows-elevation.html
│   ├─ spacing-scale.html
│   ├─ borders.html
│   ├─ buttons.html
│   ├─ chips-pills.html
│   ├─ inputs.html
│   ├─ project-card.html
│   ├─ resume-card.html
│   ├─ article-card.html
│   ├─ eyebrows.html
│   ├─ headshot-frame.html
│   ├─ wordmark.html
│   └─ icon-glyphs.html
└─ ui_kits/
    └─ profile/
        ├─ README.md
        ├─ index.html               ← interactive recreation of the executive profile
        ├─ GlobalNav.jsx
        ├─ Hero.jsx
        ├─ BioCard.jsx
        ├─ ProjectCarousel.jsx
        ├─ ResumeCard.jsx
        ├─ EducationCard.jsx
        ├─ TechStack.jsx
        ├─ ResearchFeed.jsx
        └─ AmbientBackdrop.jsx
```

### Caveats / known substitutions
- **Fonts** are loaded from Google Fonts (Playfair Display, Lora, JetBrains Mono) — same as the live site. **No font files are bundled** because the live site itself relies on Google Fonts. If an offline build is ever needed, host the WOFF2 files locally and update `colors_and_type.css`.
- **No icon set is bundled.** This is deliberate (see ICONOGRAPHY). If a future surface needs icons, Lucide is the recommended substitution and should be flagged.
- **The WebGL ambient backdrop is implemented but optional.** Pages that don't include Three.js will fall back to a flat obsidian background, which the system explicitly supports.
