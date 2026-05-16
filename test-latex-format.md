---
title: "Testing LaTeX Markdown Compatibility"
description: "A test article to verify the dual-header structure."
category: "Engineering"
subcategory: "Tests"
subject: "Markdown"
architecture: "N/A"
output: "Test"
format: "REPORT"
time: "1 min read"
tags:
  - "LaTeX"
  - "Markdown"
visual: "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\"/></svg>"
scripts: ["test-vis.js"]
---
# Testing LaTeX Markdown Compatibility

Dr. Heather Leffew
Obelus Institute
May 2026
---
## Abstract
This is a test abstract to verify that the `md_to_latex.py` script correctly parses the dual-header structure, successfully dropping the YAML frontmatter and capturing the formal title block.

## Introduction
Here is the first section of the document. We are testing whether standard markdown features like **bolding**, *italics*, and `inline code` work as expected.

## Methods
We enforce a strict prohibition on raw HTML tags. Instead of an HTML table, we use a pure markdown table:

| Metric | Value | Status |
|--------|-------|--------|
| Test 1 | 95%   | Pass   |
| Test 2 | 88%   | Pass   |

There is also no raw HTML for visualizations. Any JS scripts are loaded via the frontmatter.

## Conclusion
If the script parses this successfully, it means the new workflow guidelines are fully compatible with formal LaTeX preprint submissions.
