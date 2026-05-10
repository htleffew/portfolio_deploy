---
component: Typewriter
id: CIN-07
status: stable
category: cinematic
source-library: robonuggets/cinematic-site-components
source-file: typewriter.html
adaptation-status: token-mapped
---

## What It Does
Text appears character by character as if being typed in real time — creating the impression that code or text is being generated live.

## When to Use In This Portfolio
- **Code block reveals** — showing ML pipeline code appearing as if being written (sections 02–04 in account-prioritization.html)
- Terminal-style output displays
- When the article narrative involves "running" a process and showing the output

## When NOT to Use
- Hero H1 (already uses GSAP SplitType — do not stack)
- Body prose paragraphs (typewriter on prose feels gimmicky; save it for code)
- More than 40 lines of code (typewriter on large blocks is too slow to be engaging)

## Conflict Note: global.js SplitType
global.js applies `new SplitType(heroTitle, { types: 'words, chars' })` to `.hero h1`. Never apply typewriter to any H1. SplitType and typewriter on the same element will conflict.

## Adapted Implementation

```js
function typewriterReveal(el, options = {}) {
  const {
    speed    = 18,        // ms per character
    delay    = 0,         // ms before starting
    cursor   = false      // show blinking cursor during type
  } = options;

  const text = el.textContent;
  el.textContent = '';
  if (cursor) el.style.borderRight = '2px solid var(--phthalo-lift)';

  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (cursor) {
        // Blink then remove cursor after typing completes
        setTimeout(() => { el.style.borderRight = 'none'; }, 1200);
      }
    }
  }, speed);
}

// Trigger on scroll, not page load
document.querySelectorAll('.code-block code[data-typewriter]').forEach(el => {
  ScrollTrigger.create({
    trigger: el.closest('.code-block'),
    start: 'top 80%',
    onEnter: () => typewriterReveal(el, { speed: 12, cursor: true }),
    once: true
  });
});
```

## HTML Usage

```html
<div class="code-block">
  <pre><code data-typewriter>
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# Drop leaky feature
df = df.drop(columns=['historical_win'])
  </code></pre>
</div>
```

## Design Token Integration
```css
/* Cursor uses phthalo-lift for brand consistency */
code[data-typewriter] {
  border-right: 2px solid var(--phthalo-lift);
  animation: cursor-blink 0.7s step-end infinite;
}
@keyframes cursor-blink {
  0%, 100% { border-color: var(--phthalo-lift); }
  50%       { border-color: transparent; }
}
```

## Source Reference
`https://raw.githubusercontent.com/robonuggets/cinematic-site-components/master/typewriter.html`
