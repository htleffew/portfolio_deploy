# MDX Migration Plan — portfolio_deploy → Astro + MDX

Status: ACTIVE — started 2026-06-12
Owner: Claude (lead)

## Goal

Move all deployed portfolio article pages from hand-authored HTML to MDX, so that:
- Each article is edited as a small `.mdx` file (frontmatter + prose + components), never a giant HTML blob.
- Editing an `.mdx` and pushing triggers an automated GitHub Actions `astro build` that deploys to GitHub Pages in ~60–90s ("push → live", no manual build).
- A shared Astro layout owns the frame (top nav, footer, reading progress, chapter spine, Related Works grid, next-article link). Articles never touch the frame.
- The library index (`projects-repository.html`) and Related Works/next-article (driven by `projects_index.json` + `global_chrome.js`) keep working.
- Images, charts, tables, graphs, and embeds are first-class via reusable MDX components.

User decisions (2026-06-12): Automated CI build model; full migration of all articles now.

## Current state (audited)

- Live host: `htleffew/portfolio_deploy` via GitHub Pages, custom domain `drheatherleffew.com` (CNAME, served at root `/`).
- 23 real article folders (excluding `design_system` template + `Test_Markdown_Article` test stub). Each has `<slug>.html` + a paired `<slug>.md` (frontmatter + prose) that mirrors the article text but does NOT capture figures/interactive widgets.
- Articles live one level deep: `/<Folder>/<slug>.html`, linking `../design_system/assets/css/institutional.css` and `../design_system/js/{cinematic_engine_v3,global_chrome,institutional}.js`.
- Frame is runtime-injected: `global_chrome.js` injects nav/footer/search/grain, computes `window.currentPathPrefix` by URL depth, and fetches `projects_index.json` to populate `#recommendation-grid` and `#next-chap-link`. `institutional.js` builds the spine, sidenotes, reveals.
- Design system is the split-file architecture (post 2026-06-05): `tokens.css` ← `global_chrome.css` + `institutional.css`; JS = `cinematic_engine_v3.js`, `global_chrome.js`, `institutional.js`.
- `projects_index.json` schema consumed by the runtime: `{id, title, desc, cat, subtype, tags, url, time, visual}`.
- `sync_index.js` referenced by README **does not exist** (drift). Index upkeep is currently manual.
- Existing `portfolio_astro/` scaffold: Astro 6 + `@astrojs/mdx`, `CinematicLayout.astro`, components `Band`/`Figure`/`ApaReferences`, one migrated article (`claude-lcr-analysis.mdx`). The layout references the OLD removed single-file `design_system/css/global.css` + `js/global.js` — STALE, must be updated to split files.

### Articles with custom interactive widgets / figures (high-risk, preserve markup)

interactive_*.js or extra inline scripts/SVG/images:
ADHD_Focus_Playlist, Autoresearch_Master (4 svg, tables), Claude_Character_Tic (svg+img+embed),
Diagnostic_Thematic_Apperception_Narratives (2 js, svg), Implicit_Power_Drives (4 js, svg),
Instrumental_and_Affective_Mass_Murder (3 js, svg, tables), Multimodal_Autism_AI (5 svg, js, tables),
Neurobiological_Differentiation_Violent_Offender_Types (4 js, svg), Platform_Survival_Analytics (js, svg, img),
Trajectory_Investigation (js, svg), User_Behaviors_Mass_Violence (3 js, svg), nla_anthropic (2 js, svg),
simplified_chinese_agentic_workflows (img, table).
Prose-only (lower risk): AI_Safety_Audit_Framework, Agentic_Experience_Evaluation, Bounded_Autonomous_Research,
Claude_LCR_Analysis, Constitutional_AI_Defense, Dead_Signal_AI_Evals, Multi_Signal_Safety_Detection,
Post_Asimovian_Alignment, Public_Discourse_Misalignment, Sleep_Nudge_Analysis.

## Target architecture

```
portfolio_astro/
  astro.config.mjs            # site: https://drheatherleffew.com, base: '/', output static, trailingSlash
  src/
    layouts/CinematicLayout.astro   # frame: split design-system contract + DOM hooks
    components/{Band,Figure,ApaReferences,Embed,DataTable,Interactive}.astro
    content/                  # OR pages/ — content collection of article MDX + schema
    pages/<slug>.mdx          # one per article
  public/
    design_system/**          # copied from portfolio_deploy (css/js/tokens)
    images/**, *.svg          # article figures/assets
  scripts/gen-index.mjs       # generates projects_index.json from frontmatter at build
  .github/workflows/deploy.yml
```

Cutover: Astro `dist/` becomes the GitHub Pages publish source (via Actions artifact), preserving CNAME. Old `/<Folder>/<slug>.html` URLs change to `/<slug>/` routes → add redirect stubs for the existing paths to avoid 404s.

## Work chunks + validation

1. Foundation: rewrite `CinematicLayout.astro` to split-file contract + correct DOM hooks; config; copy design_system + assets into `public/`. Validate: `astro build` passes; built page `<head>`/`<body>` matches live contract (grep for the 1 css + 3 js + DOM hook ids).
2. Index generator `scripts/gen-index.mjs`: emit `projects_index.json` (exact schema) from MDX frontmatter; run in build. Validate: generated JSON validates against schema; entry count == article count.
3. Convert all 23 articles to MDX, preserving figures/SVGs/tables/interactive widgets (carry interactive_*.js + inline widget scripts into components or `public/`). Validate per article: rendered text parity vs current `.md`; every figure/svg/widget present; no broken asset paths.
4. CI: `.github/workflows/deploy.yml` builds + deploys to Pages, keeps CNAME. Validate: workflow lints; dry-run build artifact produced.
5. Verify + stage cutover: full `astro build`; render/spot-check pages (frame, spine, Related Works, next, index, widgets); content parity vs live; redirects for old URLs; handoff doc; cleanup temp scripts. Cutover to live domain GATED on explicit approval + working git push auth.

## Blockers / boundaries

- Final `git push` to `github.com/htleffew/portfolio_deploy` and switching the Pages publish source require the user's GitHub auth / repo settings access. Pipeline + commits will be prepared and verified locally; the live-domain cutover is gated, not silent.

## Progress log

### 2026-06-12 — Foundation built; build-verify interrupted by VM outage

DONE (authored + on disk in `portfolio_astro/`):
- `src/layouts/CinematicLayout.astro` rewritten to the live split-file contract:
  `/design_system/assets/css/institutional.css` + the 3 split JS files
  (`cinematic_engine_v3.js`, `global_chrome.js`, `institutional.js`), plus all DOM
  hooks (`#progress`, `#global-nav-container`, `#spine`, `.atmosphere`, `#glCanvas`,
  front-matter `.meta-row/.bracket/.abstract/.byline`, back-matter `#recommendation-grid`,
  `#next-chap-link/#next-chap-title`). Front-matter fields driven by article frontmatter.
- `astro.config.mjs`: site `https://drheatherleffew.com`, base `/`, `trailingSlash: 'always'`,
  static output, mdx integration. (Production form — no /tmp redirects.)
- `scripts/gen-index.mjs`: build-time generator → `public/projects_index.json` in the exact
  runtime schema `{id,title,desc,cat,subtype,tags,url,time,visual}`. Wired into `npm run build`
  and `npm run dev` (runs before astro). Replaces missing `sync_index.js`.
- `package.json`: build/dev run gen-index first; added `gray-matter` dep; deps installed.
- `public/design_system/**` copied from portfolio_deploy (assets/css/institutional.css,
  css/global_chrome.css, js/{cinematic_engine_v3,global_chrome,institutional}.js, tokens.css).
  Verified `@import` chain in institutional.css resolves (`../../tokens.css`, `../../css/global_chrome.css`).
- `public/CNAME` = drheatherleffew.com (preserves custom domain).
- `.github/workflows/deploy.yml`: Node 22, `npm install`, `npm run build`, upload-pages-artifact,
  deploy-pages. Push to main/master → live in ~60-90s.

BUILD STATUS: `npm run build` ran gen-index (wrote 1 entry OK) and Astro compiled types +
the layout/article, then failed ONLY on `EPERM: unlink` of Vite cache files
(`node_modules/.vite`, `dist/.prerender/.vite`, `.astro/.prerender/.vite`). This is a Cowork
**mount filesystem limitation** (no unlink on the mounted folder), NOT a code defect. Fix in
progress when the sandbox VM crashed: copy project off-mount to `/tmp` and build there. CI
runners (GitHub Actions) have no such restriction, so `deploy.yml` builds unchanged.

TEMPORARY LIMITATION (not a true blocker): sandbox VM is down → cannot run the off-mount build
to produce/inspect `dist` locally right now. Re-run when VM returns:
`rsync -a --exclude node_modules --exclude .astro --exclude dist <repo>/portfolio_astro/ /tmp/pa/ && cd /tmp/pa && npm install && npm run build` then copy `/tmp/pa/dist` back.

CONVERTER AUTHORED (the bulk-conversion engine, runs from the .md sources):
- KEY FINDING: each article's paired `.md` IS the clean, complete source the live HTML was
  generated from. Frontmatter declares `scripts:` (interactive_*.js); figures are
  `![alt](fig_N.svg)`; tables are native Markdown; a few use raw `<figure>` blocks. So a
  converter can work entirely from `.md` — no fragile HTML parsing.
- `portfolio_astro/scripts/convert-articles.mjs` (authored): for every article folder in
  `../portfolio_deploy`, parses frontmatter+body, splits on `## `, drops `## Related`
  (frame auto-generates it), wraps `## References` in <ApaReferences>, wraps each other
  section in alternating <Band> with derived spine/section labels, rewrites figure paths to
  `/assets/<slug>/`, MDX-escapes stray `<`/`{`/`}` outside code spans (handles "p < .05"),
  copies figures → `public/assets/<slug>/` and interactive_*.js → `public/interactive/<slug>/`.
  Skips already-authored slugs unless `--force`. Wired as `npm run convert`.
- Layout updated to emit per-article widgets from `frontmatter.scripts`.
- Hand-authored so far: `claude-lcr-analysis.mdx` (pre-existing), `ai-safety-audit-framework.mdx`.

ONE-COMMAND COMPLETION (when sandbox returns; CI also does this on first push):
  cd portfolio_astro && npm install && npm run convert && npm run build
Then inspect dist, fix any per-article MDX-escape edge cases the build surfaces, commit, push.

STILL REMAINING after that:
- Homepage `index.astro` (currently default stub) + library/repository landing parity.
- Redirect stubs for old `/<Folder>/<slug>.html` URLs → new `/<slug>/` routes.
- Rendered spot-checks (frame, spine, Related Works, next, index, widgets) + content parity.
- Commit + push + switch GitHub Pages publish source (needs user GitHub auth — gated).

### 2026-06-12 (cont.) — Article migration COMPLETE + build-verified (via Desktop Commander on host Windows)

Sandbox VM stayed down; ran the pipeline on the host machine instead (Node 24, npm 11).

- `npm install && npm run convert --force && npm run build` → **24 pages built, 0 errors.**
- All 23 articles converted to MDX from their `.md` sources + 1 index page.
- Converter fix applied: self-close void HTML elements (`<img>` → `<img />`) inside raw
  `<figure>` blocks (the one build error, in dead-signal; fixed and re-verified).
- Verified in `dist/`:
  - Frame contract intact: 1 stylesheet (`institutional.css`) + 3 scripts
    (`cinematic_engine_v3.js`, `global_chrome.js`, `institutional.js`) + all DOM hooks
    (`#progress`, `#global-nav-container`, `#spine`, `.atmosphere`, `#glCanvas`,
    `#recommendation-grid`, `#next-chap-link`).
  - Front matter rendered from frontmatter; bands alternate paper/dark with data-spine/data-section.
  - Figures: paths rewritten to `/assets/<slug>/...`, self-closed, captions preserved.
  - Embedded HTML (Dead Signal demo CTA link), inline `<code>`, tables, lists all faithful.
  - Interactive widgets: wired from `frontmatter.scripts` (verified
    `/interactive/autoresearch-master/interactive_0.js` emitted + asset present). Articles with
    `scripts: []` correctly emit none — confirmed the live HTML doesn't load those leftover files.
  - `projects_index.json`: 23 entries, correct schema (id,title,desc,cat,subtype,tags,url,time,visual),
    0 malformed, trailing-slash URLs. design_system CSS+JS copied into dist. CNAME = drheatherleffew.com.

REMAINING (tracked as task #7, NOT blockers to the article-migration goal):
- Homepage `index.astro` + `projects-repository` library page parity (live entry points).
- Enrich `tags` + `short_title` (converted articles have empty tags / full-length short_title;
  the live projects_index.json has richer tags to merge for the library filter + nav).
- Remove orphan interactive_*.js copied for `scripts: []` articles (harmless but tidy).
- Redirect stubs old `/<Folder>/<slug>.html` → new `/<slug>/`.
- Commit + push + set Pages Source = GitHub Actions (needs user GitHub auth — gated cutover).

### 2026-06-12 (final) — Full landing parity + CI-verified + pushed

- Tags + concise short_title backfilled into all 23 MDX frontmatters from the live index
  (`scripts/enrich-frontmatter.mjs`); gen-index merges subtype + inline-SVG `visual` thumbnail
  by slug from `src/data/live-index.json`. Verified: projects_index.json → 23 entries, ALL with
  tags and ALL with visual SVG.
- Landing pages ported (`scripts/port-landing.mjs`): homepage `index.html`, library
  `projects-repository.html`, `about.html`, `svg-gallery.html` + `library_dashboard.js` +
  `resume.pdf` into public/, with old `Folder/slug.html` links rewritten to `/slug/` (0 old
  links remain) and design-system paths made absolute. Stub `index.astro` removed.
- Redirect stubs for all 23 old URLs (`scripts/gen-redirects.mjs`, runs in build). Verified
  meta-refresh → new route.
- Converter orphan fix: only interactive widgets listed in frontmatter.scripts are copied;
  re-ran clean (orphan interactive dirs gone, 9 referenced remain).
- Build pipeline: `npm run build` = gen-index + gen-redirects + astro build (committed files
  only, CI-safe). One-time migration = `npm run migrate` (convert+enrich+port, reads portfolio_deploy).
- **Local build green** (23 articles + landings, 0 errors). **CI build job GREEN** on clean
  GitHub runner (install+build+artifact). Committed `ce0267d`, pushed to private repo
  https://github.com/htleffew/portfolio_astro.

BLOCKER (owner: user; needs GitHub web access; must not conflict with live domain):
  Enable Pages (Source = GitHub Actions) on portfolio_astro AND remove the custom domain from
  portfolio_deploy first (two Pages sites can't share drheatherleffew.com). Steps in
  portfolio_astro/README.md → "Cut over to the live domain". Re-entry: push or re-run workflow;
  deploy job then publishes and CNAME re-binds the domain. Safe preview meanwhile:
  `npm run build && npm run preview`.

STATUS: Article migration goal = DONE and verified (local + CI). Live-domain cutover = the
single gated step remaining, documented and owner-assigned.

## Pass/fail for completion

All 23 articles render from MDX via `astro build` with frame + index + Related Works + next-article + all figures/widgets intact and content-parity with current live pages; CI workflow present; index auto-generated; old URLs redirected; handoff + plan updated; temp artifacts removed. Cutover step documented and gated.
