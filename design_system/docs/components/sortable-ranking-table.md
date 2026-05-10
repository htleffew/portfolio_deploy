---
component: Sortable Ranking Table
id: INT-03
status: stable
category: interactive
interactivity: click
source: account-prioritization.html — Section 05 "Synthesizing the Priority Score"
---

## What It Does
A data table whose rows re-sort on column header click — making the ranking order itself part of the narrative. Each column click reveals a different "truth" about the data.

## When to Use
- When the same data produces different rankings by different metrics (this IS the insight)
- Comparing ML models across multiple evaluation criteria
- Any situation where "which is best depends on what you optimize for"
- After presenting a formula — let the reader see it applied to example data

## When NOT to Use
- Static reference tables (just use a plain `<table class="data-table">`)
- More than 6 columns (table becomes unreadable on mobile)
- When you want to prevent the reader from changing the sort order

## WHY This Component Exists

The dual-model account prioritization article uses this table to make its core argument interactive. The reader clicks "P(convert)" and sees Target D rank first (90% probability). Then clicks "Priority Score" and sees Target B jump to first ($37,500 vs Target D's $900). The reader doesn't need to be told "high probability ≠ best account" — they discover it by sorting.

**The lesson is in the interaction.** A static sorted table communicates one ranking. A sortable table communicates that rankings are contextual.

## Anatomy
```
┌──────────┬─────────────┬──────────────┬──────────────────┐
│ Account ▼│ P(convert) ▼│ E[deal_size]▼│ Priority Score ▼ │  ← clickable headers
├──────────┼─────────────┼──────────────┼──────────────────┤
│ Target B │    0.15     │   $250,000   │   $37,500 ◀      │  ← highest score
│ Target A │    0.85     │    $10,000   │    $8,500         │
│ Target C │    0.02     │   $500,000   │   $10,000         │
│ Target D │    0.90     │     $1,000   │      $900         │
└──────────┴─────────────┴──────────────┴──────────────────┘
```

## Implementation

See `source-snippets/sortable-ranking-table.html` for complete drop-in HTML + JS.

### The `data-sort` Attribute Convention
```html
<th data-sort="key">Column Label ▼</th>
```
Each sortable header carries `data-sort="[key]"` where key matches a property name in the data objects. Special keys:
- `"score"` — triggers a computed sort: `b.p * b.d - a.p * a.d`
- String keys use `localeCompare()` for alphabetical sort
- All other keys use numeric descending sort

### The `renderTable()` Pattern
```js
function renderTable() {
  const sorted = tData.slice().sort(function(a, b) {
    if (sortKey === 'score') return (b.p * b.d) - (a.p * a.d);
    if (sortKey === 'acc')   return a.acc.localeCompare(b.acc);
    return b[sortKey] - a[sortKey];  // numeric descending
  });
  tbody.innerHTML = sorted.map(row => `<tr>...</tr>`).join('');
}
```
`.slice()` before `.sort()` avoids mutating the original array. `innerHTML` rebuild is fast enough for ≤50 rows.

## Design Tokens Applied
| Element | Token |
|---------|-------|
| `th` color | `--phthalo-lift` (dark) / `--ink-blue` (paper) |
| `th:hover` | `--flare` (dark) / `--phthalo` (paper) |
| `td` border | `--graphite` (dark) / `--paper-3` (paper) |
| Highlighted score column | `--ink-blue` + `font-weight: bold` |

## Source Reference
`account-prioritization.html` → `#dynamic-rank-table` in Section 05. JS in inline `<script>` → `tData`, `renderTable()`, `theads.forEach(...)`.
