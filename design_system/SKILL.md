---
name: heather-leffew-design
description: Use this skill to generate well-branded interfaces and assets for Dr. Heather Leffew's executive profile and research portfolio (DrHeatherLeffew.com), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files. Of particular importance:

- `README.md` — full content + visual foundations, voice rules, iconography guidance.
- `tokens.css` — the SINGLE SOURCE OF TRUTH for all CSS variables. Every other CSS file `@import`s from here. Contains: colors (`--obsidian`, `--sapphire`), type families (`--font-display`, `--font-body`, `--font-mono`), type scale, spacing, borders, shadows, motion curves, and backward-compatible aliases (`--display`, `--body`, `--mono`).
- `assets/css/institutional.css` — component styles for case study pages. `@import url('../../tokens.css')`.
- `css/global_chrome.css` — app shell styles (nav, footer, search modal, grain). `@import url('../tokens.css')`.
- `ui_kits/case-study/template.html` — canonical HTML skeleton for new case studies. The `/html_translation` workflow copies this file as the starting scaffold for every new project.
- `assets/Heather_headshot_2.jpg` — the canonical executive headshot.
- `assets/Heather-Leffew-PhD_Resume-042026.pdf` — the canonical résumé.
- `ui_kits/profile/` — JSX recreation of the live executive profile, with `index.html` as an interactive entry point.
- `preview/` — atomic design-system specimens (cards): type, color, spacing, components, brand.

### Adding a new case study
1. Run `/content_synthesis` on source files → `[ProjectName]_enriched_article.txt`
2. Run `/html_translation` → copies `template.html`, builds HTML, registers in `projects_index.json`
3. Paste the audit prompt from `deployment-prompt.txt` → 4-phase conformity check
4. `node sync_index.js` → regenerates Related Works footers
5. `git push` → live on GitHub Pages

### CSS Architecture
```
tokens.css (single source of truth)
  ↑ @import                  ↑ @import
  institutional.css           global_chrome.css
  (case study components)     (app shell chrome)
```

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

### Voice & content reminders
- The narrative voice is in the spirit of Andrej Karpathy: respectful, humble, accessible, individually rigorous; warm and intellectually generous; mechanism over metaphor.
- The site is **monochrome obsidian with sapphire as the single accent**. Ruby / emerald / citrine exist for case-study diagrams only.
- **No emoji. No icon set.** Use the unicode glyph set (`→ ↓ ↑ ← ▸`) and JetBrains Mono UPPERCASE labels.
- The "logo" is a wordmark — Playfair Display 600, 18px, the literal text "Dr. Heather Leffew". There is no monogram.
- Three families is the cap: **Playfair Display** (display), **Lora** (body), **JetBrains Mono** (eyebrows/labels). Do not introduce a fourth.
