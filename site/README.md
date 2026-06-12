# portfolio_astro — MDX article engine

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

## Bulk migration from portfolio_deploy

`scripts/convert-articles.mjs` converts every article in `../portfolio_deploy`
from its paired Markdown source into `src/pages/<slug>.mdx`, copying figures to
`public/assets/<slug>/` and interactive widgets to `public/interactive/<slug>/`.
It skips articles already present unless `--force` is passed (so hand-authored
pages are preserved).

```bash
npm run convert              # convert all not-yet-migrated articles
npm run convert -- --force   # regenerate everything
```

## Building locally

The Cowork mounted filesystem disallows `unlink` in some temp dirs, which breaks
Vite's cache. To build locally, copy the project off-mount first:

```bash
rsync -a --exclude node_modules --exclude .astro --exclude dist \
  /path/to/Pm_html/portfolio_astro/ /tmp/pa/
cd /tmp/pa && npm install && npm run convert && npm run build
```

The converter reads `../portfolio_deploy`, so keep that folder one level up
(copy it next to `/tmp/pa` as `/tmp/portfolio_deploy` if building in /tmp).
GitHub Actions runners have no such restriction, so CI builds the repo unchanged.

## Cutover to the live domain (gated)

The site currently serves from `htleffew/portfolio_deploy` (static HTML) via
GitHub Pages, custom domain `drheatherleffew.com` (CNAME preserved in
`public/CNAME`).

The source is committed and pushed to **https://github.com/htleffew/portfolio_astro**
(private). On every push, the `build` job runs `npm install && npm run build` and
uploads the Pages artifact (verified green). The `deploy` job is intentionally not
active yet because GitHub Pages isn't enabled on the repo — enabling it with the
`CNAME` present would try to bind `drheatherleffew.com`, which still belongs to
`portfolio_deploy`. **Two Pages sites cannot claim the same custom domain**, so the
domain move is the one deliberate, gated step.

### Preview safely (no domain impact)

```bash
npm run build && npm run preview     # serves the built dist locally for review
```

### Cut over to the live domain (when ready)

1. In **htleffew/portfolio_deploy** → Settings → Pages, remove the custom domain
   `drheatherleffew.com` (frees the domain binding).
2. In **htleffew/portfolio_astro** → Settings → Pages, set **Source = GitHub Actions**.
3. Re-run the latest workflow (or push any commit). The `deploy` job now publishes;
   the committed `public/CNAME` re-binds `drheatherleffew.com` to this repo.
4. DNS already points at GitHub Pages, so propagation is immediate-to-minutes.
5. (Optional) Make the repo public if you want the source visible; Pages on a free
   private repo won't serve publicly.

Old `/<Folder>/<slug>.html` URLs are handled by redirect stubs the build emits, so
external links keep working after cutover.

## Status (2026-06-12) — article migration COMPLETE + verified

- 23 articles migrated to MDX; homepage, library (`projects-repository.html`),
  about, and gallery ported; figures + interactive widgets + the inline-SVG card
  thumbnails carried over; `projects_index.json` auto-generated with tags + visuals;
  old-URL redirects emitted.
- **Local build:** `npm run build` → 23 article pages + landing pages, 0 errors.
- **CI build:** green on a clean GitHub Actions runner (install + build + artifact).
- Committed (`ce0267d`) and pushed to the private repo above.
- Remaining (gated, needs your GitHub web access): enable Pages + move the custom
  domain per the steps above. See
  `portfolio_deploy/internal/plans/active/mdx-migration-plan.md` for full detail.
