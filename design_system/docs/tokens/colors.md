# Color Tokens
> Every color token in the system. Always use variable names — never raw hex.

---

## Complete Token Table

### Mineral Neutrals (Dark Mode Scale)

| Token Name | Hex | RGB | Used For | Never Use For |
|------------|-----|-----|----------|---------------|
| `--obsidian` | #030303 | 3, 3, 3 | Deepest page background (on `html`), footer background, code block backgrounds | Body text, borders, any foreground element |
| `--charcoal` | #1A1A1A | 26, 26, 26 | Card surfaces, panel backgrounds, `.r-card` dark background | Full-width backgrounds |
| `--graphite` | #222222 | 34, 34, 34 | Hairline borders, table row dividers, `border-bottom` on list items | Text, backgrounds |
| `--brushed` | #333333 | 51, 51, 51 | Slider tracks, secondary borders, `stroke` on inactive SVG elements | Active/emphasis states |
| `--tungsten` | #A1A1A6 | 161, 161, 166 | Muted body text, metadata, figure captions, secondary labels, `color` default on chart axes | Headlines, primary body text |
| `--platinum` | #F5F5F7 | 245, 245, 247 | Primary body text on dark bands, all prose in dark context | Headlines (use `--flare`), paper band text |
| `--flare` | #FFFFFF | 255, 255, 255 | Article H1 headings, maximum emphasis, node color in Three.js particles | Body copy, labels, anything that shouldn't be pure white |

### Paper Neutrals (Light Mode Scale)

| Token Name | Hex | RGB | Used For | Never Use For |
|------------|-----|-----|----------|---------------|
| `--paper` | #F5F5F7 | 245, 245, 247 | Primary background in paper bands (via rgba at 0.85 opacity) | Dark band elements |
| `--paper-2` | #E9E9E9 | 233, 233, 233 | Card surfaces in paper context, `.sim-controls` background | Dark band elements |
| `--paper-3` | #DDDDDD | 221, 221, 221 | Borders in paper context (table dividers, card borders) | Dark band elements |
| `--ink` | #030303 | 3, 3, 3 | H1/H2 headings in paper bands | Dark band text |
| `--ink-2` | #222222 | 34, 34, 34 | Primary body text in paper bands | Dark band text |
| `--ink-3` | #5E5E5A | 94, 94, 90 | Muted text, metadata, captions in paper bands | Dark band text |

### Brand Accents

| Token Name | Hex | RGB | Used For | Never Use For |
|------------|-----|-----|----------|---------------|
| `--phthalo` | #0F3A6B | 15, 58, 107 | Deep CTA, link rest state, connection filament base color in Three.js | Backgrounds (too dark), text on dark backgrounds |
| `--phthalo-lift` | #3866A0 | 56, 102, 160 | Link hover, inline accents, eyebrow text (dark bands), active spine ticks, chart line color | Paper band accents (use `--ink-blue`) |
| `--ink-blue` | #1A3A6B | 26, 58, 107 | All accent usage in paper bands (eyebrows, active states, highlights) | Dark band accents (use `--phthalo-lift`) |

### Case-Study Diagram Palette ("Oil Paint Quartet")

| Token Name | Hex | RGB | Semantic Name | Used For | 
|------------|-----|-----|---------------|----------|
| `--alizarin` | #7A1626 | 122, 22, 38 | Alizarin Crimson | Risk zones, thresholds, danger annotations, overfitting warnings. **Reserved exclusively for warnings.** |
| `--hookers` | #1A4A38 | 26, 74, 56 | Hooker's Green | Secondary diagram accent (available, rarely used) |
| `--hansa` | #DBA844 | 219, 184, 68 | Hansa Yellow Light | Temporal sequence responder/effect color. The only "warm" color in the system. Used in FIG.05 temporal sequence SVG. |
| `--dioxazine` | #3D1F4A | 61, 31, 74 | Dioxazine Purple | Reserved diagram accent (available, rarely used) |

### Semantic Role Aliases

| Token Name | Resolves To | Purpose |
|------------|-------------|---------|
| `--bg` | `var(--obsidian)` | Semantic background token |
| `--bg-raised` | `var(--charcoal)` | Raised surface background |
| `--fg-1` | `var(--flare)` | Primary foreground (headlines) |
| `--fg-2` | `var(--platinum)` | Secondary foreground (body) |
| `--fg-3` | `var(--tungsten)` | Tertiary foreground (meta) |
| `--rule` | rgba(51,51,51,0.5) | Divider lines |
| `--rule-soft` | rgba(255,255,255,0.05) | Subtle dividers |
| `--link` | `var(--phthalo)` | Link rest state |
| `--link-hover` | `var(--flare)` | Link hover state |
| `--accent` | `var(--phthalo-lift)` | Primary accent color |

---

## The Primary Palette in Plain Language

**The two phthalo blues are your entire visualization palette.**  
`--phthalo` (#0F3A6B) and `--phthalo-lift` (#3866A0) handle everything from chart lines to node colors to eyebrow text. All Plotly charts use these two colors for trace lines. The Three.js particle network uses them for filaments and nodes. They are cool, authoritative, and technical without being flashy.

**Tungsten is your secondary text and muted labels.**  
`--tungsten` (#A1A1A6) handles all metadata, figure captions, secondary information, and chart axis labels. It reads as "supporting information" rather than primary content. Never use it for anything that needs to be read first.

**Warn red (alizarin) is reserved exclusively for risk zones, thresholds, and danger annotations.**  
`--alizarin` (#7A1626) appears only when the content is flagging a problem or warning. In the autism article, it marks the "overfitting risk zone" on the ROC curve (AUC > 0.95). Never use it decoratively or for general emphasis.

**Flare white is for maximum emphasis only.**  
`--flare` (#FFFFFF) is saved for H1 headings and the highest-contrast moments. Using it for body text defeats its purpose — everything becomes equally important, which means nothing is.

**Hansa yellow is the only warm color.**  
`--hansa` (#DBA844) appears in exactly one place: the temporal sequence diagram (FIG.05) to mark "responder/effect" events against the phthalo-blue "initiator/cause" events. If you reach for a warm color outside of temporal sequence diagrams, question whether it belongs.

---

## The Additive Blending Rule

The Three.js particle network uses `THREE.AdditiveBlending`. This means colors appear **brighter** against dark backgrounds than their hex values suggest — especially in the particle core. The `--phthalo-lift` (#3866A0) blue becomes a glowing electric blue when particles overlap. Account for this:

- **Chart lines at #3866A0** appear as a medium blue — correct for readability
- **Particles at #3866A0 with AdditiveBlending** appear as bright cyan-blue — intentional glow
- Never try to "correct" the glow by darkening particle colors. The brightness is the effect.

---

## Dark Band vs. Paper Band Color Behavior

Same token, different perceived value against different backgrounds:

| Token | On Dark Band | On Paper Band |
|-------|-------------|---------------|
| `--phthalo-lift` (#3866A0) | Medium blue, good contrast | Too light, low contrast — use `--ink-blue` instead |
| `--ink-blue` (#1A3A6B) | Too dark, disappears — use `--phthalo-lift` instead | Good contrast, authoritative |
| `--tungsten` (#A1A1A6) | Good muted gray | Too light on cream — use `--ink-3` instead |
| `--ink-3` (#5E5E5A) | Too dark on obsidian | Good muted brown-gray on cream |
| `--platinum` (#F5F5F7) | Good body text | Invisible on cream — use `--ink-2` |
| `--ink-2` (#222222) | Invisible on obsidian | Good body text on cream |

**Pattern:** Dark band → use `--phthalo-lift`, `--platinum`, `--flare`, `--tungsten`  
**Pattern:** Paper band → use `--ink-blue`, `--ink`, `--ink-2`, `--ink-3`

---

## The "No New Colors" Rule

If emphasis can't be achieved with existing tokens, use **opacity and scale**, not new hues.

Good emphasis techniques without new colors:
- Increase font-weight: `font-weight: 600`
- Use `--flare` instead of `--platinum` for headings
- Use font-size scale jump (e.g., `48px` display number in stat trios)
- Use `letter-spacing` increase for eyebrow-level metadata
- Add `border-left: 4px solid var(--phthalo-lift)` for method callouts
- Reduce opacity on surrounding elements to make one element "pop"

If you genuinely need a new hue, consult the oil paint quartet (`--alizarin`, `--hookers`, `--hansa`, `--dioxazine`) before inventing anything. These exist for diagram use cases.

---

## Usage in Plotly Charts

Plotly color mapping by context:

```js
// Dark band chart (band--dark)
const layoutDark = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#A1A1A6', family: "'JetBrains Mono', monospace" }  // --tungsten
};

// Light band chart (band--paper)
const layoutLight = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#5E5E5A', family: "'JetBrains Mono', monospace" }  // --ink-3
};

// Trace line color — always phthalo-lift
line: { color: '#3866A0', width: 3 }  // --phthalo-lift

// Secondary/baseline trace
line: { color: '#5E5E5A', dash: 'dash' }  // --ink-3 / --tungsten

// Risk annotation
{ color: '#7A1626' }  // --alizarin
```
