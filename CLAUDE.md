# CLAUDE.md — agent guide for portfolio_deploy

This repo is the production host for **https://drheatherleffew.com**. The website
is an **Astro + MDX** app in [`site/`](site/). Work there, not at the repo root.

## Orientation (read first)

- `README.md` — repo overview + deploy mechanism.
- `site/README.md` — authoring + build guide (the detailed one).
- `internal/plans/active/mdx-migration-plan.md` — how the current system came to be.

## Golden rules

1. **The source of truth is `site/src/pages/<slug>.mdx`.** One file per article.
   Edit prose between `<Band>` tags or the frontmatter. Never hand-edit `site/dist`
   (build output) or `site/public/*.html` redirect stubs (generated).
2. **Build from `site/`:** `cd site && npm install && npm run build && npm run verify`.
   `build` runs `gen-index` (regenerates `public/projects_index.json` from frontmatter)
   and `gen-redirects` (old-URL stubs) before `astro build`. `verify` checks the
   frame contract and that no asset reference is broken — run it before pushing.
3. **Deploy = push to `master`.** `.github/workflows/production-deploy.yml` builds
   `site/` and deploys `site/dist` to Pages (custom domain via `site/public/CNAME`).
   Do not change Pages source or the CNAME.
4. **MDX gotchas:** MDX parses `<` and `{` as JSX. In prose write `&lt;` for a
   literal less-than (e.g. `p &lt; .05`) and avoid bare `{ }`. They're safe inside
   `` `inline code` `` and fenced code blocks.
5. **Figures:** reference SVGs with `<Figure src="/assets/<slug>/fig.svg" .../>`.
   The `Figure` component inlines SVGs at build time so diagrams inherit the live
   design tokens (`var(--phthalo)`, etc.). Raster images fall back to `<img>`.
6. **The frame is owned by the design system,** not by articles. `global_chrome.js`
   + `institutional.js` + `cinematic_engine_v3.js` (in `site/public/design_system/js/`)
   provide nav, footer, spine, reveals, scroll progress, Related Works, and the
   next-article link. **Do not add page scripts that rebuild the spine/nav/reveals** —
   that double-builds the chrome. (The legacy `interactive_*.js` files were exactly
   this dead chrome and were removed.)
7. **Interactive widgets** are self-contained Astro components in
   `site/src/components/widgets/` (e.g. `MutationBudgetSim`, `ProfileExplorer`,
   `OutputVsActivation`): markup + scoped `<script>` + token-styled `<style>`.
   To add one, build a component and drop `<WidgetName />` into the relevant `.mdx`.

## Design system

`site/public/design_system/` holds `tokens.css` (single source of truth for colors,
fonts, spacing — `var(--phthalo)`, `var(--alizarin)`, `var(--font-mono)`, etc.),
`assets/css/institutional.css` (the one stylesheet every page links; `@import`s
tokens + global_chrome), and the three runtime JS files. Never hardcode hex colors
in components or SVGs — use the tokens.

## Verifying changes

- `npm run build` must succeed (0 errors).
- `npm run verify` must pass (frame contract intact, no broken asset refs).
- For interactive/visual changes, check the built page in `site/dist/<slug>/index.html`
  for the expected markup, or load the deployed page and exercise it.
