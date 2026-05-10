# Projects Index Schema
> Complete schema for projects_index.json. Every new article must add an entry or it won't appear in search, recommendations, or next-article links.

---

## File Location
`portfolio_deploy/projects_index.json` — at the portfolio root.

---

## Full Field Schema

| Field | Type | Required | Constraints | Purpose |
|-------|------|----------|-------------|---------|
| `id` | string | **required** | Must exactly match folder name | Used to filter current article from recommendations |
| `title` | string | **required** | No length limit | Full article title shown in search results and recommendation cards |
| `desc` | string | **required** | 2–3 sentences | First 80 chars → next-article `.ti` truncation. First 140 chars → search result preview |
| `cat` | string | **required** | Single category | Sidebar taxonomy filter in projects-repository.html; shown in search results |
| `subtype` | string | **required** | UPPERCASE | Displayed above title in project cards (.p-eyebrow); drives carousel label |
| `tags` | string[] | **required** | Array of strings | Drives tag chip generation; top 6 most-common across all articles become hot-button filters |
| `url` | string | **required** | Relative from portfolio root | Used in all links: `pathPrefix + p.url`. Must include folder + filename |
| `time` | string | **required** | e.g. "10 min read" | Displayed in article meta-row and search results |
| `visual` | string | optional | Inline SVG string | Thumbnail shown in carousel `.p-card` and repository `.db-thumb`. 600×600 viewBox. |

---

## Field Detail Notes

### `id`
```json
"id": "Account_Prioritization"
```
Must match the folder name exactly, including case and underscores. global.js uses `currentPath.includes(p.url.split('/').pop())` to detect the current page — if `id` doesn't match, the article filters itself from recommendations incorrectly.

### `desc`
Write the description so the first sentence stands alone as the next-article teaser (≤80 chars ideally), and the first two sentences work as the search preview (≤140 chars). The third sentence can elaborate freely.

### `url`
```json
"url": "Account_Prioritization/account-prioritization.html"
```
Always relative from the portfolio root. No leading `./` or `/`. global.js prepends `pathPrefix`.

### `visual`
The SVG visual field stores a complete inline SVG string. It must use escaped double-quotes (`\"`). The standard viewBox is `0 0 600 600`. All colors must be hardcoded hex (not CSS variables) because the SVG renders inside a JS-injected context without access to CSS custom properties.

---

## SVG Visual Vocabulary

Catalog of all patterns found in the actual JSON, with their semantic meaning:

### Concentric Circles
```svg
<circle cx="300" cy="300" r="80" stroke="url(#g1)" stroke-width="1" fill="none"/>
<circle cx="300" cy="300" r="140" .../>
<circle cx="300" cy="300" r="200" .../>
<circle cx="300" cy="300" r="260" .../>
```
**Meaning:** Bayesian uncertainty, probability distributions, nested confidence intervals, expanding uncertainty quantification. Use for: statistical modeling, Bayesian inference, uncertainty-aware systems.  
*Used by: Multimodal_Autism_AI*

### J-Curve Path (Quadratic Bezier)
```svg
<path d="M 100 200 Q 300 450 500 100" stroke="url(#g1)" stroke-width="2" fill="none"/>
```
**Meaning:** Adoption curves, learning curves, J-curve growth, recovery patterns. Control point positioned below the line creates the characteristic dip-then-rise. Use for: AI adoption, productivity frameworks, any temporal "it gets worse before better" narrative.  
*Used by: AI_Adoption*

### Dashed Orbit Circles
```svg
<circle cx="300" cy="300" r="200" stroke="url(#g1)" stroke-dasharray="4 12" stroke-width="1"/>
<circle cx="300" cy="300" r="140" stroke="url(#g1)" stroke-dasharray="2 6" stroke-width="1"/>
```
**Meaning:** Autonomous systems, feedback loops, agent orbits, cyclic processes. The dashed stroke suggests incomplete/probabilistic paths. Use for: agentic AI, entity resolution loops, autonomous heuristic discovery.  
*Used by: Autonomous_Heuristic_Discovery*

### Diagonal Scatter + ROC Line
```svg
<line stroke-dasharray="2 6" x1="60" x2="540" y1="540" y2="60" stroke="#3866A0"/>
<circle cx="120" cy="490" r="2.5" fill="#3866A0"/>
<circle cx="180" cy="430" r="2.5" .../>
```
**Meaning:** Classification performance, prediction accuracy, regression correlation, ROC curve. Diagonal line = baseline or decision boundary; scatter points = individual predictions. Use for: ML classification, prediction models, correlational analysis.  
*Used by: Multimodal_Autism_AI (combined with concentric circles)*

### Cross / Grid Mesh
```svg
<rect height="200" stroke="url(#g1)" stroke-dasharray="4 8" width="200" x="200" y="200"/>
<path d="M 250 250 L 350 350 M 350 250 L 250 350" stroke="url(#g1)"/>
```
**Meaning:** Grid structures, research boundaries, mutation space, combinatorial spaces. Use for: autoresearch, parameter grids, hyperparameter search.  
*Used by: Autoresearch_Master*

### Ascending Path with Terminal Node
```svg
<path d="M100 500 L200 400 L300 450 L500 100" stroke="url(#g2)" stroke-width="4"/>
<circle cx="500" cy="100" r="8" fill="#3866A0"/>
```
**Meaning:** Ranked scoring, prioritization, ascending value curves, optimization convergence. The large terminal circle emphasizes the "top ranked" endpoint. Use for: ranking systems, predictive scoring, account prioritization.  
*Used by: Account_Prioritization*

### Lens / Vesica Shape (Dual Arc)
```svg
<path d="M100 300 C 200 100, 400 100, 500 300" stroke="url(#g)" stroke-width="4" fill="none"/>
<path d="M100 300 C 200 500, 400 500, 500 300" stroke="url(#g)" stroke-dasharray="10 5"/>
```
**Meaning:** Interpretability, latent space, encoder-decoder architecture, duality. Solid arc = explicit/observed; dashed arc = latent/hidden. Use for: NLP autoencoders, interpretability research, representation learning.  
*Used by: Natural_Language_Autoencoders*

---

## Gradient Definition Pattern

All SVG thumbnails use this standard gradient:
```svg
<defs>
  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0%" stop-color="#3866A0" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#0F3A6B" stop-opacity="0.0"/>
  </linearGradient>
</defs>
```
Diagonal direction (top-left to bottom-right), phthalo-lift fading to transparent. Some articles use `id="g2"` for a reversed gradient (bottom-left to top-right: `x1="0" x2="1" y1="1" y2="0"`).

---

## Complete Example Entry

```json
{
  "id": "Account_Prioritization",
  "title": "Dual-Model Account Prioritization",
  "desc": "Moving beyond single-metric classification by combining probability-to-convert with expected deal size. This dual-model approach uses XGBoost classification and regression to generate a priority score that aligns ML outputs directly with business revenue goals.",
  "cat": "Machine Learning",
  "subtype": "PREDICTIVE RANKING",
  "tags": ["Classification", "Regression", "MLOps"],
  "url": "Account_Prioritization/account-prioritization.html",
  "time": "7 min read",
  "visual": "<svg fill=\"none\" viewbox=\"0 0 600 600\"><defs><linearGradient id=\"g2\" x1=\"0\" x2=\"1\" y1=\"1\" y2=\"0\"><stop offset=\"0%\" stop-color=\"#1A3A6B\" stop-opacity=\"0.6\"/><stop offset=\"100%\" stop-color=\"#3866A0\" stop-opacity=\"0.2\"/></linearGradient></defs><path d=\"M100 500 L200 400 L300 450 L500 100\" stroke=\"url(#g2)\" stroke-width=\"4\"/><circle cx=\"500\" cy=\"100\" r=\"8\" fill=\"#3866A0\"/></svg>"
}
```

---

## Choosing an SVG Visual for a New Article

| Article Category | SVG Pattern |
|-----------------|-------------|
| Bayesian / Uncertainty | Concentric circles |
| Temporal / Adoption curves | J-curve quadratic bezier |
| Autonomous systems / Agents | Dashed orbit circles |
| Classification / Prediction | Diagonal scatter + ROC line |
| Ranking / Optimization | Ascending path + terminal node |
| Interpretability / Latent space | Dual arc (solid + dashed) |
| Graph ML / Networks | Node-edge network dots |
| Research / Exploration | Cross/grid mesh |

---

## Common Mistakes

### Wrong `url` Path
```json
// WRONG — leading slash makes it absolute
"url": "/Account_Prioritization/account-prioritization.html"

// WRONG — relative to article not root  
"url": "./account-prioritization.html"

// CORRECT
"url": "Account_Prioritization/account-prioritization.html"
```

### Missing Required Fields
The minimum viable entry requires all 8 non-optional fields. `visual` can be an empty string `""` but the card will render without a thumbnail.

### SVG with Unescaped Quotes
The `visual` field is a JSON string. Any `"` inside the SVG must be escaped as `\"`. The `viewbox` attribute (lowercase) is used in the actual JSON (not `viewBox`) — this is a quirk of how the SVG was serialized into JSON.

### Gradient ID Collisions
All articles use `id="g1"` or `id="g2"` in their SVG visuals. When multiple SVGs render on the same page (carousel, repository), these IDs collide. This is an existing quirk in the system — do not "fix" it by using unique IDs, as it would break existing visuals. The browser uses the first definition found.
