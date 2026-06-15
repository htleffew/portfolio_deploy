# portfolio_deploy/site — MDX article engine

> Authoring specs (`VISUALIZATIONS.md`, `CITATIONS.md`), design rationale (`STYLE.md`), and
> prose voice live in the **private** `portfolio_studio` repo. This public repo holds the
> token *implementation* (`public/design_system/`) and the published content. See
> `../../AGENTS.md` → "Portfolio Architecture".

Astro + MDX rebuild of the portfolio article pages. Each article is a small
`.mdx` file (frontmatter + prose + components). A shared layout owns the frame
(nav, footer, reading progress, chapter spine, Related Works, next-article
link). Editing an `.mdx` and pushing rebuilds and deploys via GitHub Actions in
~60–90s — no manual build, no hand-editing giant HTML.

## How it works

- `src/layouts/CinematicLayout.astro` — the shared frame. Mirrors the live
  `portfolio_deploy` contract: one stylesheet (`institutional.css`) + three
  scripts (`cinematic_engine_v3.js`, `global_chrome.js`, `institutional.js`) and
  all DOM hooks the runtime needs. Reads article frontmatter for the front
  matter block and emits per-article interactive widgets from `frontmatter.scripts`.
- `src/components/` — `Band` (a themed section), `Figure` (styled figure),
  `ApaReferences` (reference list). Articles compose these.
- `src/pages/<slug>.mdx` — one article each. Frontmatter drives title, category,
  description, time, tags, `visual`, and `scripts`.
- `scripts/gen-index.mjs` — runs before every build; regenerates
  `public/projects_index.json` from article frontmatter, in the exact schema
  `global_chrome.js` consumes. This is what keeps the library index, Related
  Works grid, and next-article link in sync. (Replaces the missing `sync_index.js`.)
- `public/design_system/**` — copied from `portfolio_deploy`. The CSS `@import`
  chain (`institutional.css` → `tokens.css` + `global_chrome.css`) resolves here.
- `.github/workflows/deploy.yml` — build + deploy to GitHub Pages on push.

## Editing an article

1. Open `src/pages/<slug>.mdx`.
2. Edit the prose between the `<Band>` tags, or the frontmatter.
3. Commit + push. CI rebuilds and deploys. Done.

To add an article: create `src/pages/<new-slug>.mdx` with the same frontmatter
shape; the index, Related Works, and next-article link pick it up automatically.

## Authoring rules (MDX gotchas)

MDX parses `<` and `{` as JSX. In prose, write `&lt;` for a literal less-than
(e.g. `p &lt; .05`) and avoid bare `{ }`. Inside `` `inline code` `` and fenced
code blocks they are safe. The converter (below) handles this automatically.

## Interactive widgets

Widgets are self-contained Astro components in `src/components/widgets/`: markup +
a scoped `<script>` + a token-styled `<style>`. To add one, build the component and
drop `<WidgetName />` into the relevant `.mdx`. Current widgets:

- `MutationBudgetSim` — autonomous-loop mutation-budget simulator (autoresearch-master).
- `ProfileExplorer` — per-participant clinical card selector (multimodal-autism-ai).
- `OutputVsActivation` — output-vs-NLA-activation case explorer (nla_anthropic).

Keep widget logic inside the component. Do **not** add scripts that rebuild the
nav, spine, reveals, or scroll progress — the design system owns the frame, and
duplicating it fights `institutional.js`.

## Building locally

```bash
cd site
npm install
npm run build      # gen-index + gen-redirects + astro build
npm run verify     # frame contract + no broken asset refs
npm run preview    # serve the built dist for review
```

> The migration from the old hand-authored HTML was a one-time process; its
> tooling has been removed now that `src/pages/*.mdx` is the source of truth.
> History is in `internal/plans/active/mdx-migration-plan.md` and git.

## Deployment — LIVE

This project lives at `portfolio_deploy/site/` inside the **htleffew/portfolio_deploy**
repo and **is the live site at https://drheatherleffew.com**. The repo's
`.github/workflows/production-deploy.yml` builds `site/` and deploys `site/dist`
to GitHub Pages (already configured as `build_type=workflow` with the custom
domain; `site/public/CNAME` keeps `drheatherleffew.com` bound). No CNAME or DNS
changes were needed — the existing domain and Pages setup are reused.

**To publish an edit:** change a file under `site/src/pages/*.mdx`, commit, and
push to `master`. The workflow rebuilds and deploys in ~60-90s. After a deploy,
GitHub's edge cache may serve the previous version of already-cached paths
(the homepage, old URLs) for a few minutes; a hard refresh or `?v=` query bypasses it.

### Preview locally before pushing

```bash
npm run build && npm run preview
```

> Note: an earlier private repo `htleffew/portfolio_astro` was created as an
> interim staging spot and is now **superseded** by `portfolio_deploy/site`.
> It can be deleted; the canonical source is here.

## Status (2026-06-12) — COMPLETE + LIVE

- 23 articles migrated to MDX; homepage, library (`projects-repository.html`),
  about, and gallery ported; figures + interactive widgets + the inline-SVG card
  thumbnails carried over; `projects_index.json` auto-generated with tags + visuals;
  old-URL redirect stubs emitted.
- **Local build & verify:** 23 article pages + landing pages, 0 errors; frame
  contract + no broken asset refs + content parity ≥85% per article.
- **CI:** `production-deploy.yml` build + deploy jobs both green; live on
  `drheatherleffew.com` (verified: article pages, homepage with new `/slug/` links,
  figures, redirects).
- See `portfolio_deploy/internal/plans/active/mdx-migration-plan.md` for full detail.
