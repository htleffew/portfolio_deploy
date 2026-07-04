# portfolio-site handoff

- Project: portfolio-site
- Path: C:/Users/drhea/estate/apps/portfolio-site
- Verified state: 6d29fb6 2026-06-24 Sync working changes (branch master, working tree clean as of 2026-07-04)
- In progress / uncommitted: none, all committed

## Tech

Astro + MDX website for drheatherleffew.com (Netflix AI-Evals). Articles are .mdx files under site/src/pages/; shared frame is CinematicLayout.astro. Deploy: push to master branch, GitHub Actions builds and deploys to Pages in 60-90s via production-deploy.yml. No manual build, no hand-edited HTML.

## Open decisions

- Voice audit (avg reading score 4.2): articles should re-ground in real specifics from projects/, not de-tic generics. Fix spec in memory at portfolio-voice-audit.md.
- Resume export: portfolio_deploy/resume.pdf is Heather's exported PDF, not generated (brand fonts absent). Copy over any local version.

## Next actions

1. Read site/README.md for authoring rules (MDX gotchas, figures, widgets).
2. To edit an article: open site/src/pages/<slug>.mdx, commit and push to master.
3. To add an article: create site/src/pages/<new-slug>.mdx with same frontmatter shape (title, description, category, tags, time).
4. Index, Related Works grid, and next-article link auto-regenerate from frontmatter at build via scripts/gen-index.mjs.

## Run

Dev: cd site && npm run dev (Astro dev server at localhost:3000)
Verify live: https://drheatherleffew.com

## Orient with

/orient portfolio-site
