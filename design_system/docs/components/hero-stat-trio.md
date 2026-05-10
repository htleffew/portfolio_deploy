---
component: Hero Stat Trio
id: LAY-02
status: stable
category: layout
interactivity: none
source: account-prioritization.html — front matter (.byline)
---

## What It Does
Three labeled statistics in the front matter hero section that frame the article's problem, solution, and impact at a glance — before the reader has read a single word of prose.

## This Is a Required Template Element

Every article front matter should include the stat trio. It answers the three questions every technical reader has before investing time:
1. **What was broken?** (PROBLEM)
2. **How did you fix it?** (ARCHITECTURE)
3. **Did it actually work?** (IMPACT)

## Anatomy
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  PROBLEM                ARCHITECTURE           IMPACT        │
│  Treating all           Classification +       High-value    │
│  conversions as         Regression             account       │
│  equal                  Ensemble               ranking       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Implementation

```html
<div class="byline">
  <div>
    <span>PROBLEM</span>
    <strong>Treating all conversions as equal</strong>
  </div>
  <div>
    <span>ARCHITECTURE</span>
    <strong>Classification + Regression Ensemble</strong>
  </div>
  <div>
    <span>IMPACT</span>
    <strong>High-value account ranking</strong>
  </div>
</div>
```

Always place inside `.col-wide` within the `.front` section:
```html
<section class="band band--dark front" data-spine="Overview" data-section="Front matter">
  <div class="col-wide">
    <div class="meta-row">...</div>
    <h1>Article Title</h1>
    <p class="abstract">...</p>
    <div class="byline">
      <!-- three stat divs -->
    </div>
  </div>
</section>
```

## CSS (from global.css)
```css
.front .byline {
  display: flex;
  gap: 36px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--tungsten);
}
.front .byline strong {
  color: var(--platinum);
  font-weight: 500;
  display: block;
  margin-top: 6px;
  letter-spacing: 0.08em;
  font-family: var(--body);
  font-style: italic;
  font-size: 14px;
  text-transform: none;
}
```

The label (`<span>`) is mono uppercase tungsten. The value (`<strong>`) is body italic platinum. This contrast — clinical label vs. human-readable value — is intentional.

## Fill-in-the-blank Template

```
PROBLEM   → What assumption was wrong? What process was breaking? 
            Be specific: not "data challenges" but "treating all conversions as equal"
            
ARCHITECTURE → The technical approach in 3–5 words.
               Not a list of tools, but the architectural pattern:
               "Classification + Regression Ensemble"
               "Late Fusion Bayesian Pipeline"
               "Dual-Stage Priority Scoring"
               
IMPACT    → The outcome, as a user-facing result (not a metric).
            Not "AUC: 0.97" but "High-value account ranking"
            Not "Reduced latency 40%" but "Real-time clinical decision support"
```

## Generalization
Works for any article category:
- ML articles: Problem / Architecture / Performance
- Systems articles: Problem / Approach / Outcome  
- Research articles: Question / Method / Finding
- Framework articles: Challenge / Framework / Application

## Source Reference
`account-prioritization.html` → `.front .byline` in front matter section.
