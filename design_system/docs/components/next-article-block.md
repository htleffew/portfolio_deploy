---
component: Next Article Block
id: CHR-05
status: stable
category: chrome
interactivity: injected
source: global.js section 6 + article HTML back matter
---

## What It Does
Two back-matter elements populated by global.js: a 3-card recommendation grid (random articles) and a single "Next Publication" link — both fetched from `projects_index.json` at runtime.

## Required HTML Skeleton

Every article must include both placeholders in the back matter section. Without them, global.js skips population silently:

```html
<section class="band band--dark back-matter" data-spine="Research Graph" data-section="Research Graph">
  <div class="back-matter" style="padding-top:0;">
    <h3 style="margin-bottom:22px;">Related Works</h3>
    <div class="related">
      <div class="related-grid" id="recommendation-grid">
        <!-- Populated by global.js — do not add content here -->
      </div>
    </div>
  </div>

  <a class="next-chap" id="next-chap-link" href="#">
    <div class="lf">
      <div class="eb">Next Publication</div>
      <div class="ti" id="next-chap-title">Loading...</div>
    </div>
    <div class="rt">→</div>
  </a>
</section>
```

## What Gets Injected

### Recommendation Grid (`#recommendation-grid`)
3 randomly selected articles from `projects_index.json`, excluding the current article. Randomized on every page load — intentional design decision (promotes discovery over algorithmic curation).

```html
<!-- Injected into #recommendation-grid for each of 3 articles -->
<a class="r-card" href="{pathPrefix}{p.url}">
  <div class="eb">{p.cat}</div>
  <div class="ti">{p.title}</div>
  <div class="ds">{p.desc.substring(0, 80)}...</div>
</a>
```

### Next Chapter Link (`#next-chap-link` / `#next-chap-title`)
First non-current article from `projects_index.json`:
```js
nextChapLink.href        = pathPrefix + nextP.url;
nextChapTitle.innerText  = nextP.title;
```

## Visual Design

### Recommendation Grid
```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ MACHINE LEARNING     │ RESEARCH & ARCH.      │ AI SAFETY            │
│                      │                       │                      │
│ Dual-Model Account   │ Multimodal AI for     │ Natural Language      │
│ Prioritization       │ Autism Assessment     │ Autoencoders...      │
│                      │                       │                      │
│ Moving beyond sin... │ A late-fusion Baye... │ The challenge of...  │
└──────────────────────┴──────────────────────┴──────────────────────┘
  3-column grid | border-top + border-bottom: --graphite
```

### Next Chapter Link
```
┌────────────────────────────────────────────────────────────────── →┐
│ NEXT PUBLICATION                                                    │
│ Multimodal AI for Autism Assessment: Bayesian Uncertainty in...    │
└────────────────────────────────────────────────────────────────────┘
  border-top + border-bottom | padding: 48px | hover: rgba(77,140,255,0.05) bg
```

## CSS (from global.css)
```css
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--graphite);
  border-bottom: 1px solid var(--graphite);
}
.r-card { padding: 28px 28px 32px; border-right: 1px solid var(--graphite); }
.r-card:last-child { border-right: 0; }
.r-card .eb { font-family: var(--mono); font-size: 9.5px; color: var(--phthalo-lift); }
.r-card .ti { font-family: var(--display); font-size: 22px; font-weight: 600; color: var(--flare); }
.r-card .ds { font-family: var(--body); font-size: 14px; color: var(--tungsten); }

.next-chap {
  max-width: var(--col-wide); margin: 80px auto 0; padding: 48px;
  border-top: 1px solid var(--graphite); border-bottom: 1px solid var(--graphite);
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
  text-decoration: none; color: inherit;
  transition: background 0.35s;
}
.next-chap:hover { background: rgba(77,140,255,0.05); }
.next-chap .lf .eb { font-family: var(--mono); font-size: 10px; color: var(--phthalo-lift); }
.next-chap .lf .ti { font-family: var(--display); font-size: 32px; font-weight: 600; color: var(--flare); }
.next-chap .rt { font-family: var(--mono); font-size: 14px; color: var(--phthalo-lift); }
```

## Why Recommendations Are Randomized

Intentional design decision: randomization prevents "filter bubbles" where the same popular articles always appear. Every page load surfaces different connections. The portfolio is small enough (8–15 articles) that randomization works — every article will eventually appear as a recommendation.

## Design Tokens Applied
| Element | Token |
|---------|-------|
| Grid borders | `--graphite` |
| Card category | `--phthalo-lift`, mono 9.5px |
| Card title | `--flare`, display 22px |
| Card description | `--tungsten`, body 14px |
| Next-chap title | `--flare`, display 32px |
| Next-chap arrow | `--phthalo-lift` |

## Source Reference
`global.js` → `initGlobalChrome()` → section 6 "Populate Related Works and Next Publication". HTML structure: both `account-prioritization.html` and `multimodal-autism-ai.html` back matter sections.
