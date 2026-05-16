---
title: "Testing the Markdown SSG"
description: "This is a test of the new automated SSG pipeline for portfolio deployment."
category: "Engineering"
subcategory: "Tooling"
subject: "Static Site Generation"
architecture: "Node.js"
output: "HTML Pipeline"
format: "TEST"
time: "1 min read"
tags:
  - "Test"
  - "Node"
---

This is the introductory text. It should appear in the first band and have a dropcap if I configured `build.js` correctly.

## First Core Section

Here is a standard section under an H2. The SSG compiler should wrap this in `band--dark` or `band--paper` automatically.

We can include code blocks:
```javascript
const x = 42;
console.log(x);
```

## Interactive Components

Here is a raw HTML element embedded directly in the markdown:

<div class="plotly-wrapper">
  <div style="background: red; width: 100%; height: 100px; color: white; display: flex; align-items: center; justify-content: center;">
    <strong>Mock Plotly Chart</strong>
  </div>
</div>

## References

- Leffew, H. (2026). *Building an SSG*. Journal of Agentic Engineering.
