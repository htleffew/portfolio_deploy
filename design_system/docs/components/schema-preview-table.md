---
component: Schema Preview Table
id: DAT-01
status: stable
category: data-display
interactivity: none
source: account-prioritization.html — Section 02 + multimodal-autism-ai.html — Section 02
---

## What It Does
A 4–6 row data table showing representative records from the dataset used in the article — grounding the reader in what the raw data actually looks like before explaining what happens to it.

## The Grounding Function

This component serves a specific narrative role: **it answers "what does the data look like?" before the article answers "what do we do with it?"**

A reader who can see the actual columns and sample rows will follow the preprocessing and modeling steps much more easily. Abstract descriptions of "our feature space includes firmographics and engagement signals" become concrete when the reader has seen `account_id | industry | revenue_tier | 30d_page_views`.

## When to Use
- Early in any article that uses a dataset (Section 02 or 03 at the latest)
- After the sentence "we will use a dataset of X records that..."
- When the data schema is non-obvious (clinical features, custom signals, unusual targets)

## When NOT to Use
- When the dataset is standard/public (MNIST, Iris, etc.) — readers know these
- When the schema is explained in a preceding code block (don't duplicate)
- More than 6 rows — the table's purpose is sampling, not exhaustiveness

## Anatomy
```
┌──────────┬──────────┬──────────────┬──────────────┬───────────┬──────────────┐
│account_id│ industry │ revenue_tier │30d_page_views│deal_size  │ converted    │ ← th (mono)
├──────────┼──────────┼──────────────┼──────────────┼───────────┼──────────────┤
│ A-1001   │ SaaS     │ Enterprise   │ 145          │ 125000.00 │ 1            │ ← 4-6 rows
│ A-1002   │ Mfg      │ Mid-Market   │ 12           │ 0.00      │ 0            │
│ A-1003   │ Retail   │ SMB          │ 4            │ 0.00      │ 0            │
│ A-1004   │ SaaS     │ Enterprise   │ 310          │ 450000.00 │ 1            │
│ A-1005   │ Finance  │ Mid-Market   │ 88           │ 0.00      │ 0            │
└──────────┴──────────┴──────────────┴──────────────┴───────────┴──────────────┘
```

## Implementation

```html
<table class="data-table">
  <thead>
    <tr>
      <th>account_id</th>
      <th>industry</th>
      <th>revenue_tier</th>
      <th>30d_page_views</th>
      <th>deal_size_usd</th>
      <th>converted_next_90d</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>A-1001</td><td>SaaS</td><td>Enterprise</td><td>145</td><td>125000.00</td><td>1</td></tr>
    <tr><td>A-1002</td><td>Mfg</td><td>Mid-Market</td><td>12</td><td>0.00</td><td>0</td></tr>
    <tr><td>A-1003</td><td>Retail</td><td>SMB</td><td>4</td><td>0.00</td><td>0</td></tr>
    <tr><td>A-1004</td><td>SaaS</td><td>Enterprise</td><td>310</td><td>450000.00</td><td>1</td></tr>
    <tr><td>A-1005</td><td>Finance</td><td>Mid-Market</td><td>88</td><td>0.00</td><td>0</td></tr>
  </tbody>
</table>
```

Wrap in `.table-container` for full-width treatment with overflow-x scroll:
```html
<div class="table-container">
  <table class="data-table">...</table>
</div>
```

## Row Selection Guidelines

Choose rows that show **variety**, not uniformity:
- At least 2 positive cases and 2 negative cases (for classification datasets)
- Rows that span the range of key features (small + large values)
- At least 1 row that looks "surprising" (e.g., high engagement but no conversion)
- Never cherry-pick only clean/perfect rows — show the messiness

## CSS (from global.css)
```css
.table-container { max-width: var(--col-wide); margin: 48px auto; padding: 0 32px; overflow-x: auto; }
table.data-table { font-family: var(--body); font-size: 15px; max-width: 100%; margin: 0; }
th { font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--phthalo-lift); }
td { padding: 12px 16px; border-bottom: 1px solid var(--graphite); }
table.data-table tr:last-child td { border-bottom: none; }
/* Paper band overrides */
.band--paper th { color: var(--ink-blue); }
.band--paper td { border-bottom-color: var(--paper-3); }
```

## Source Reference
`account-prioritization.html` → Section 02 "Data Architecture & Preprocessing" → first table (5 rows, 8 columns). `multimodal-autism-ai.html` → Section 02 "Feature Extraction" → feature modality table.
