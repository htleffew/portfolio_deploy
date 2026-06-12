# AGENTS.md

This repository hosts **https://drheatherleffew.com**, an Astro + MDX site in
[`site/`](site/). For full agent guidance see [`CLAUDE.md`](CLAUDE.md); for
authoring and build details see [`site/README.md`](site/README.md).

Quick reference:

- **Edit articles:** `site/src/pages/<slug>.mdx` (one file per article; the source of truth).
- **Build:** `cd site && npm install && npm run build && npm run verify`.
- **Deploy:** push to `master` → `.github/workflows/production-deploy.yml` builds
  `site/` and deploys `site/dist` to GitHub Pages (custom domain via `site/public/CNAME`).
- **Don't:** hand-edit `site/dist` or generated `site/public/*.html` redirect stubs;
  add page scripts that rebuild the nav/spine/reveals (the design system owns the
  frame); hardcode colors (use `tokens.css` variables).
- **Widgets:** self-contained Astro components in `site/src/components/widgets/`.
