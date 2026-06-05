# Animation Correctness Plan

Captured: 2026-06-05. Owner: Dr. Leffew. Lead agent: Claude.

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
