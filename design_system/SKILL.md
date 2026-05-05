---
name: heather-leffew-design
description: Use this skill to generate well-branded interfaces and assets for Dr. Heather Leffew's executive profile and research portfolio (DrHeatherLeffew.com), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files. Of particular importance:

- `README.md` — full content + visual foundations, voice rules, iconography guidance.
- `colors_and_type.css` — drop-in CSS variables and semantic element styles (`--obsidian`, `--sapphire`, `.ds-h1`, `.ds-eyebrow`, etc.).
- `assets/Heather_headshot_2.jpg` — the canonical executive headshot.
- `assets/Heather-Leffew-PhD_Resume-042026.pdf` — the canonical résumé.
- `ui_kits/profile/` — JSX recreation of the live executive profile, with `index.html` as an interactive entry point.
- `preview/` — atomic design-system specimens (cards): type, color, spacing, components, brand.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

### Voice & content reminders
- The narrative voice is in the spirit of Andrej Karpathy: respectful, humble, accessible, individually rigorous; warm and intellectually generous; mechanism over metaphor.
- The site is **monochrome obsidian with sapphire as the single accent**. Ruby / emerald / citrine exist for case-study diagrams only.
- **No emoji. No icon set.** Use the unicode glyph set (`→ ↓ ↑ ← ▸`) and JetBrains Mono UPPERCASE labels.
- The "logo" is a wordmark — Playfair Display 600, 18px, the literal text "Dr. Heather Leffew". There is no monogram.
- Three families is the cap: **Playfair Display** (display), **Lora** (body), **JetBrains Mono** (eyebrows/labels). Do not introduce a fourth.
