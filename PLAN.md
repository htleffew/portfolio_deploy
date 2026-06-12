# Animation Correctness Plan

Captured: 2026-06-05. Owner: Dr. Leffew. Lead agent: Claude.

## 2026-06-12 follow-up: Research Library repair (mobile header, dead/slow links, animation races)

Symptoms reported: header items overlapping on mobile; library index links broken
or very slow; competing misordered stuttering load animations.

Root causes and fixes (all in `site/public/`, which Astro copies verbatim into `dist/`):

1. **SPA shader router removed** (`design_system/js/global_chrome.js`, former section 10).
   It intercepted every internal link into fetch + 1.2s HyperShader transition, and
   its manual script re-execution never fired `DOMContentLoaded`-bound page scripts —
   the library arrived with dead accordions/filters/search after any SPA navigation.
   Navigation is native MPA again; cross-document View Transitions in
   `global_chrome.css` provide the polish. Dead helpers (`updateChromeHrefs`,
   `executeScriptsQueue`) deleted. `resetScrollToTop` now no-ops when a `#fragment`
   is present so anchor deep links land correctly.
2. **Preloader curtain plays once per browser session** (`institutional.js`,
   sessionStorage key `hl_preloader_played`). With MPA navigation it would otherwise
   replay ~1.9s on every page.
3. **Library row reveal race removed** (`library_dashboard.js`): per-row GSAP
   ScrollTrigger reveals with compounding `i*0.05` delays competed with the
   preloader/hero cascade running on a different clock. Rows now render
   immediately; init is run-now-or-on-ready instead of DOMContentLoaded-only.
4. **Mobile header** (`institutional.css`, final override block): `#topnav` was a
   fixed 60px no-wrap bar declared 4x across the cascade with conflicting
   z-indexes (150 vs 9999). Final authoritative block sets z-index 9999 and lets
   the bar wrap to brand-row + links-row under 720px. Verified at 390px: two rows,
   zero overlapping rects, no horizontal overflow.
5. **Reduced-motion / no-GSAP completeness** (`institutional.js`
   `revealEverythingImmediately()` + CSS `prefers-reduced-motion` block): previous
   fallbacks never revealed `#topnav` or `.contact-row a` — those users got no
   header and no hero CTAs.
6. **Pre-existing bug found during verification**: the hero cascade never revealed
   `.contact-row a` (CSS pre-hides it; no tween existed) — homepage Resume /
   LinkedIn / Research Library hero links were permanently invisible for everyone.
   Tween added at `heroIn+=1.00`.

### 2026-06-12 second pass: full-site audit (all 23 articles + index + about)

Checks run against a fresh dist build: link/asset crawl over 26 pages (every
internal href/src HEAD-checked — zero 404s), runtime-error sweep of all pages
in instrumented iframes (zero exceptions), and reveal end-state probes.

Found and fixed:

1. **Article figures invisible site-wide.** `initScrollTriggers` skips
   markdown-body / front / library / back-matter bands, and the standalone
   `.reveal` loop skipped anything inside *any* `.band` — so every
   `div.figure.reveal` in every article body stayed at the CSS pre-hide
   `opacity:0` forever. The standalone loop now skips only elements whose band
   actually owns a reveal timeline.
2. **Related Works cards invisible on every article.** `.r-card` was pre-hidden
   in two separate CSS blocks but is injected asynchronously into the
   back-matter band, which no timeline reveals. Removed `.r-card` from both
   pre-hide lists (band timelines use `fromTo`, so homepage/about animation is
   unaffected).
3. **Dead script weight removed**: HyperShader (shader-transitions) dropped from
   institutional.js's lazy dep list (only the deleted SPA router used it); six
   unused Three.js postprocessing scripts + simplex-noise removed from
   CinematicLayout.astro (~150KB/article); unused simplex-noise removed from
   index.html.
4. **svg-gallery.html deleted**: orphaned dev inspection page (nothing linked
   it) whose ~30 image refs were all broken.

Legacy `<Old_Name>/<slug>.html` paths confirmed to be gen-redirects stubs (OK).

Validation: `npm run build` + `npm run verify` pass (23 pages, frame contract
intact). Chrome checks on dist build: zero console errors on index, about,
projects-repository, dead-signal-ai-evals; library filter/sort/search and global
search overlay verified working (category filter → 3 rows, URL `?filter=` param,
overlay returns results); sidebar link navigates natively and instantly; 390px
iframe probe: header wraps with no overlap/overflow. Note for future verification:
GSAP/rAF and CSS transitions freeze in backgrounded Chrome windows — force
timeline progress or foreground the tab before reading computed styles.

## /goal

Hero and section reveal animations on every page (index, about, projects-repository, all case studies) must:

1. Cascade in declared order (preloader, then topnav, then meta, then title chars, then rule, then abstract, then scroll-cue).
2. Never flash visible-then-invisible at script handoff.
3. Hold 60fps under typical scroll while the Three.js cinematic engine renders.
4. Replay correctly after SPA navigation between articles.
5. Be bypassable when user has `prefers-reduced-motion: reduce`.

Pass criteria: visual inspection in Chrome confirms (1), (2), (4); DevTools Performance trace shows median frame under 16ms during scroll for (3); macOS System Settings → Accessibility → Reduce Motion confirms (5).

## Diagnosis (root causes, file-level)

1. `design_system/js/global.js` lines 1099-1123: the GSAP intro timeline uses position offsets (`-=2.8`, `-=2.2`, `-=1.6`, `-=2.0`, `-=0.5`, `-=0.9`, `-=0.3`) that exceed the preceding tween chain's total duration. GSAP clamps to t=0, collapsing the cascade into a single simultaneous reveal. Source of "loading in wrong order".
2. `design_system/js/global.js` line 1095: `heroTitle.style.opacity = 1` overrides the CSS pre-hide at `global.css:1820`, exposes the full title for one frame, then `gsap.from(split.chars, { opacity: 0 })` snaps the chars invisible and animates them back in. Source of "restart" on the hero title.
3. `design_system/css/global.css` 40+ instances of `backdrop-filter: blur(...)` on `.band--dark`, `.band--paper`, `.band--ink`, and `#topnav`; all of these sit above the fixed `#glCanvas` Three.js render surface; the GPU recomputes the blur every frame. STYLE.md §5.2 explicitly bans this pattern. Source of stutter.
4. `design_system/js/global.js` lines 659-684: `MutationObserver(attachTilt).observe(document.body, { childList: true, subtree: true })` re-runs `querySelectorAll` across the entire body on every mutation. During SPA scene swaps and reveal animations the observer fires constantly. Source of compounding stutter.
5. `design_system/js/global.js` lines 1064-1067: `ScrollTrigger.refresh()` runs once before any triggers are created, then again inside `onComplete` after `initScrollTriggers()`. The eager refresh is a no-op that triggers layout work; STYLE.md §5.3 warns against repeated refresh.
6. `design_system/js/global.js` lines 1051-1062 lacks a `prefers-reduced-motion` short-circuit at the outer scope; the reduced-motion fallback only triggers when GSAP fails to load.
7. `README.md` documents an `institutional.css` / `institutional.js` architecture that does not exist on disk; `design_system/assets/css/` is empty; every page links `design_system/css/global.css` and `design_system/js/global.js`. Doc and reality disagree.

## Plan (edits, in order)

| # | File | Edit | Fixes |
|---|------|------|-------|
| 1 | `design_system/js/global.js` | Replace tilt MutationObserver with delegated mousemove/mouseleave listener on `document.body`. | Diagnosis 4 |
| 2 | `design_system/js/global.js` | Add `prefers-reduced-motion` short-circuit at top of `initPageAnimations`. | Diagnosis 6 |
| 3 | `design_system/js/global.js` | Remove redundant `ScrollTrigger.refresh()` at line 1066. | Diagnosis 5 |
| 4 | `design_system/js/global.js` | Replace hero/intro timeline negative offsets with `tl.addLabel('heroIn')` + `'heroIn+=N'` positions. Remove `heroTitle.style.opacity = 1`. Add `tl.set(heroTitle, { opacity: 1 })` at the chars position so parent reveals at the moment chars start their from-state animation. | Diagnosis 1, 2 |
| 5 | `design_system/css/global.css` | Remove every `backdrop-filter: blur(...)` and matching `-webkit-backdrop-filter: blur(...)` declaration. Bands and topnav remain semi-opaque via existing `rgba()` backgrounds. | Diagnosis 3 |
| 6 | `README.md` | Reconcile to deployed reality: actual canonical stylesheet is `design_system/css/global.css`; actual canonical engine is `design_system/js/global.js`; `institutional.css` / `institutional.js` are documented as planned-but-not-deployed. | Diagnosis 7 |

## Out of scope (called out for transparency)

- Deduplicating the 3x redundant `.band--*` and `#topnav` rule blocks inside global.css (file has been concatenated repeatedly).
- The `EventTarget.prototype.addEventListener` override at global.js lines 294-332 (high-risk to remove; documents its own purpose; not directly implicated in the four symptoms).
- Migrating every page to load `institutional.css` / `institutional.js` per the original README architecture (separate refactor; out of scope per user direction to "reconcile" docs to reality rather than rebuild code to docs).

## Verification

1. Cold-read code audit by a fresh general-purpose subagent against this PLAN; the agent must confirm each edit is implemented and that no unrelated edits were made.
2. Chrome MCP visual verification: open `index.html` and one case study (`User_Behaviors_Mass_Violence/assessing-mass-violence-risk.html`), screenshot top-of-page and mid-scroll, confirm cascade order and no flash.

## Out-of-tree artifacts

This file (`PLAN.md`) and the diagnosis section above are durable workspace knowledge per Continuous Improvement (Rule 6). Update them if any decision changes during execution.
