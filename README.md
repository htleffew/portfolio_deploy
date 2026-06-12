# portfolio_deploy — drheatherleffew.com

Production repository and GitHub Pages host for **https://drheatherleffew.com**
(Dr. Heather Leffew's research portfolio).

As of June 2026 the site is an **Astro + MDX** application living in [`site/`](site/).
Each article is a small `.mdx` file; a shared layout supplies the cinematic
frame (nav, footer, reading progress, chapter spine, Related Works, next-article
link). Editing an `.mdx` and pushing to `master` rebuilds and redeploys the live
site in ~60–90 seconds via GitHub Actions — no manual build, no hand-edited HTML.

## Repository layout

```
portfolio_deploy/
├── site/                     ← the entire website (Astro/MDX app). START HERE.
│   ├── src/pages/*.mdx       ← one file per article (the editable source of truth)
│   ├── src/layouts/          ← CinematicLayout.astro (the shared frame)
│   ├── src/components/        ← Band, Figure, ApaReferences + widgets/
│   ├── src/data/live-index.json  ← prior index, merged for tags + card thumbnails
│   ├── public/design_system/  ← tokens.css + the split CSS/JS design system
│   ├── public/assets/<slug>/  ← per-article figures (SVG/PNG)
│   ├── scripts/               ← build helpers (gen-index, gen-redirects, verify-build)
│   └── README.md              ← detailed authoring + build guide
├── .github/workflows/production-deploy.yml  ← builds site/ → deploys to Pages
├── internal/plans/           ← planning + migration history
├── CLAUDE.md / AGENTS.md      ← guidance for AI agents working in this repo
└── CNAME                      ← drheatherleffew.com
```

The full design-system reference (tokens, the `.band` layout system, the
runtime chrome contract) lives in `site/public/design_system/`. Older paper
templates (`ICLR_LaTex_Template/`, `Nature_LaTex_Template/`) and unrelated
reference files remain at root and are not part of the website build.

## Edit or add an article

1. Edit `site/src/pages/<slug>.mdx` — change prose between the `<Band>` tags, or
   the frontmatter (title, description, category, tags, time).
2. To add an article, create a new `site/src/pages/<new-slug>.mdx` with the same
   frontmatter shape. The library index, Related Works grid, and next-article
   link pick it up automatically (regenerated from frontmatter at build).
3. Commit and push to `master`. CI rebuilds and deploys. Done.

See [`site/README.md`](site/README.md) for the authoring rules (MDX gotchas,
figures, interactive widgets) and how to build/preview locally.

## How it deploys

`.github/workflows/production-deploy.yml` runs on every push to `master`:
`cd site && npm install && npm run build && npm run verify`, then uploads
`site/dist` as the Pages artifact and deploys it. GitHub Pages is configured as
`build_type: workflow` with the custom domain `drheatherleffew.com`
(`site/public/CNAME`). No CNAME or DNS changes are needed to ship.

After a deploy, GitHub's edge cache may serve the previous version of an
already-cached path (the homepage, an old URL) for a few minutes; a hard refresh
or a `?v=` query parameter bypasses it.

## History

This repo previously served hand-authored static HTML (one big `.html` per
article plus a root design-system tree). In June 2026 all 23 articles were
migrated to MDX under `site/`, the old HTML/CSS/JS was removed (preserved in git
history), and the existing Pages workflow was repointed to build the Astro app.
Old `/<Folder>/<slug>.html` URLs are preserved via redirect stubs the build
emits. See `internal/plans/active/mdx-migration-plan.md` for the full record.
