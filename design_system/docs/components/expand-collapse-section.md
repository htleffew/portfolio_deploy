---
component: Expand/Collapse Section
id: LAY-03
status: stable
category: layout
interactivity: click
source: index.html — biography section (.bio-card, .bio-expand-btn)
---

## What It Does
A content block with a preview state (first paragraph visible) and a full state (all content visible), toggled by a button with swapping label text. Uses GSAP for smooth opacity + y animation on expand.

## When to Use
- Biography or "about" sections longer than 400 words
- Methodology details that context-seekers want but casual readers can skip
- Any content where a preview creates narrative tension ("what's the rest of the story?")

## When NOT to Use
- Content shorter than 3 paragraphs (just show it all)
- When the hidden content is critical to understanding the visible content
- Article body sections — use full prose; article readers have committed to reading

**The rule:** Use expand/collapse when the preview stands alone as useful content AND the full version rewards curiosity. Don't use it to hide content that should just be shorter.

## Anatomy
```
┌──────────────────────────────────────────────────────────┐
│  Preview paragraph (always visible)                      │
│  Lorem ipsum dolor sit amet, consectetur adipiscing      │
│  elit. Sed do eiusmod tempor incididunt.                 │
│                                                          │
│  [Read Full Biography +]                                 │  ← button, visible in preview
└──────────────────────────────────────────────────────────┘
↓ on click:
┌──────────────────────────────────────────────────────────┐
│  Preview paragraph (always visible)                      │
│  ...                                                     │
│                                                          │
│  Full content paragraph 2 (was hidden)                   │
│  Full content paragraph 3 (was hidden)                   │
│                                                          │
│  [Show Less -]                                           │  ← button text swapped
└──────────────────────────────────────────────────────────┘
```

## Implementation

```html
<div class="bio-card">
  <!-- PREVIEW: always visible -->
  <p>First paragraph. This should stand alone as a complete thought.</p>

  <!-- FULL CONTENT: hidden until expanded -->
  <div class="bio-full" tabindex="-1" style="outline:none;">
    <p>Second paragraph...</p>
    <p>Third paragraph...</p>
  </div>

  <!-- TOGGLE BUTTON -->
  <button class="bio-expand-btn" aria-expanded="false">
    Read Full Biography +
  </button>
</div>
```

## JS Logic

```js
const btn  = document.querySelector('.bio-expand-btn');
const full = document.querySelector('.bio-full');

// Initial state: hidden
gsap.set(full, { opacity: 0, y: 20, display: 'none' });

btn.addEventListener('click', () => {
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  if (!isExpanded) {
    // Expand
    gsap.set(full, { display: 'block' });
    gsap.to(full, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    btn.textContent = 'Show Less -';
    btn.setAttribute('aria-expanded', 'true');
  } else {
    // Collapse
    gsap.to(full, {
      opacity: 0, y: 20, duration: 0.4, ease: 'power2.in',
      onComplete: () => gsap.set(full, { display: 'none' })
    });
    btn.textContent = 'Read Full Biography +';
    btn.setAttribute('aria-expanded', 'false');
  }
});
```

## The `tabindex="-1"` + `outline:none` Pattern

The hidden `.bio-full` div carries `tabindex="-1"` and `style="outline:none;"`. This is an **accessibility pattern** — it prevents the hidden div from being tab-navigable in its hidden state, and suppresses the focus ring that would flash briefly during GSAP's display toggle. Without it, keyboard users would see a confusing focus indicator appear and disappear on expand.

## Button Text Swap Pattern

```
Collapsed: "Read Full Biography +"   (verb + object + affirmative signal)
Expanded:  "Show Less -"             (verb + less + negative signal)
```

The `+` and `-` suffix is a visual affordance — it signals "this is expandable" at a glance, without iconography. Always use `+` for collapsed and `-` for expanded.

## CSS (from global.css)
```css
.bio-expand-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.2);
  color: var(--ink-blue);
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  padding: 12px 24px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  margin-top: 16px;
  outline: none;
}
.bio-expand-btn:hover {
  border-color: var(--ink-blue);
  background: rgba(26,58,107,0.06);
}
```

## Source Reference
`index.html` → biography section. CSS in global.css → `.bio-card`, `.bio-expand-btn`.
