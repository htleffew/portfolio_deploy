---
component: Search Overlay
id: CHR-03
status: stable
category: chrome
interactivity: injected
source: global.js — initGlobalChrome() section 5
---

## What It Does
A full-screen search takeover injected by global.js. Lazy-loads `projects_index.json` on first open, searches across title/desc/cat/tags, and renders linked results. Closed by ESC or the close button.

## CRITICAL: Do Not Add Manually
Never include `#search-overlay` in article HTML. Injected by global.js. Guard: `if (!document.getElementById('search-overlay'))`.

## What Gets Injected
```html
<div id="search-overlay">
  <button id="search-close">Close [X]</button>
  <div id="search-input-container">
    <input type="text" id="search-input"
           placeholder="Search architecture, case studies, frameworks..."
           autocomplete="off">
  </div>
  <div id="search-results"></div>
</div>
```

## Visual Design
```
┌─────────────────────────────────────────────────────┐
│                                          Close [X]  │  ← top-right, mono 11px
│                                                     │
│                                                     │
│         Search architecture, case studies...        │  ← 48px display font, bottom-border
│         ─────────────────────────────────           │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ MACHINE LEARNING                             │  │  ← result cat, mono 10px phthalo-lift
│  │ Dual-Model Account Prioritization            │  │  ← title, display 20px
│  │ Moving beyond single-metric classification...│  │  ← desc truncated 140 chars
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ ...                                          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
  position: fixed | background: rgba(3,3,3,0.95) | backdrop-filter: blur(10px)
  z-index: 10000 (above topnav at 9999)
```

## CSS
```css
#search-overlay {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(3,3,3,0.95);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex; flex-direction: column; align-items: center;
  padding-top: 120px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1);
}
#search-overlay.is-active { opacity: 1; pointer-events: auto; }
#search-input {
  width: 100%; max-width: 800px;
  background: transparent; border: none;
  border-bottom: 2px solid var(--graphite);
  font-family: var(--display); font-size: 48px;
  color: var(--flare); outline: none;
  padding: 16px 0;
  transition: border-color 0.3s;
}
#search-input:focus { border-bottom-color: var(--phthalo-lift); }
```

## Search Logic
```js
const results = projectsData.filter(p => {
  const q = query.toLowerCase();
  return (p.title  || '').toLowerCase().includes(q) ||
         (p.desc   || '').toLowerCase().includes(q) ||
         (p.cat    || '').toLowerCase().includes(q) ||
         (p.tags   || []).some(t => t.toLowerCase().includes(q));
});
```
Searches across all four fields simultaneously. No ranking — returns all matches. `desc` is truncated to 140 chars in result display.

## Open/Close Behavior
- **Open:** `#trigger-search` button click in nav → `searchOverlay.classList.add('is-active')` + focus input + lazy-load JSON
- **Close:** `#search-close` click OR `Escape` keydown → `classList.remove('is-active')` + clear input + clear results
- Result links: `href = pathPrefix + p.url`

## Design Tokens Applied
| Element | Token |
|---------|-------|
| Background | `rgba(3,3,3,0.95)` |
| Input font | `--display`, 48px |
| Input color | `--flare` |
| Input border (focus) | `--phthalo-lift` |
| Result category | `--phthalo-lift`, mono 10px |
| Result title | `--flare`, display 20px |
| Result desc | `--tungsten`, body 14.5px |
| Result hover bg | `rgba(15,82,186,0.15)` |

## Source Reference
`global.js` → `initGlobalChrome()` → section 5 "Construct and Inject Search Modal".
