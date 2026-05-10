---
component: Site Footer
id: CHR-02
status: stable
category: chrome
interactivity: injected
source: global.js — initGlobalChrome() section 4
---

## What It Does
A minimal footer injected at the bottom of every page by global.js. Contains copyright, Research Library link, and LinkedIn link. Obsidian background, monospace uppercase, deliberately minimal.

## CRITICAL: Do Not Add Manually

**Never include `<footer>` in article HTML.** global.js appends `footer.site-foot` to `document.body`. Guard: `if (!document.querySelector('footer.site-foot'))`.

## What Gets Injected

```html
<footer class="site-foot">
  <div class="lf">Dr. Heather Leffew © 2026</div>
  <div class="rt" style="display:flex; gap:24px;">
    <a href="{pathPrefix}projects-repository.html">Research Library</a>
    <a href="https://linkedin.com/in/heathertleffew" target="_blank">LinkedIn</a>
  </div>
</footer>
```

## CSS
```css
footer.site-foot {
  background: var(--obsidian);       /* solid — not translucent */
  color: var(--tungsten);
  padding: 60px 48px;
  border-top: 1px solid var(--graphite);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}
footer.site-foot a { color: inherit; text-decoration: none; opacity: 0.8; }
footer.site-foot a:hover { opacity: 1; color: var(--platinum); }
```

Note: The footer uses **solid** `--obsidian` (not translucent) — it sits below the scrollable content where the starfield is no longer relevant. Translucency here would add visual noise without benefit.

## Design Tokens Applied
| Element | Token |
|---------|-------|
| Background | `--obsidian` (#030303) — solid |
| Text | `--tungsten` (#A1A1A6) |
| Link hover | `--platinum` (#F5F5F7) |
| Border top | `--graphite` (#222222) |
| Font | `--mono` (JetBrains Mono) |

## Source Reference
`global.js` → `initGlobalChrome()` → section 4 "Construct and Inject Footer".
