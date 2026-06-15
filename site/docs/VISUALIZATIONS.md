# The Interactive Visualization Mandate

> The portfolio is an interactive educational instrument. Prose states the argument.
> Visualization proves it. A reader who interacts with a concept understands it
> differently than a reader who reads about it. The portfolio is built to produce
> that second kind of understanding.

---

## 0. The Philosophy

Everything that can be demonstrated should be demonstrated. The question for every
claim, every concept, every trade-off in a piece is: can the reader experience this,
or can they only read about it?

- Can the reader drag a threshold and watch a precision-recall trade-off materialize? Build it.
- Can the reader toggle between what a research report shows and what a clinical report shows? Build it.
- Can the reader adjust noise injection and watch classification boundaries shift? Build it.
- Can the reader trace what intersectional schema cuts reveal that single-dimension cuts miss? Build it.
- Can the reader step through a pipeline architecture one stage at a time? Build it.

Static text asserting a mathematical outcome is banned. A simulator that performs real
calculations is required in its place. This applies to every concept with a mathematical,
statistical, causal, or structural character — which in a clinical AI or applied ML
portfolio is nearly every concept.

---

## 1. The Inventory Requirement

Before writing any section, inventory the interactive elements for the whole piece.
For every section, ask: what is the claim this section makes, and can that claim be
experienced rather than read?

The inventory is not a wish list. Every item on it ships. A concept on the inventory
that does not have a built visualization is a section that is not finished.

Typical inventory for a clinical AI methodology piece:
- Distribution visualizer for each clinically significant feature overlap
- Threshold calibrator for any classification decision boundary
- Model uncertainty explorer showing ensemble agreement/disagreement by case type
- Two-state toggle for output tiers (research vs. clinical view, pre-launch vs. post-launch)
- Architecture diagram that steps through the pipeline stage by stage
- SHAP contribution explorer when feature attribution is discussed
- Data quality explorer showing how session quality or missingness propagates through output

The number of interactive elements per page has no upper limit. Three is a floor
for any substantial methodology piece. A rich piece with five or six distinct concepts
should carry five or six distinct interactive elements.

---

## 2. Types of Interactive Elements

**Parameter simulators.** Sliders or inputs control mathematical variables; output
updates in real time. Use for: threshold calibration, noise injection, regularization
trade-offs, sample size effects on statistical power, penalty magnitude and detection.
The simulation must perform real calculations — not hardcoded results.

**Distribution visualizers.** Two or more overlapping probability distributions rendered
as live SVG curves. Use for: group mean comparisons, feature overlap between clinical
populations, AUC visualization, calibration diagnostics. A draggable threshold line is
required whenever a classification boundary is the concept being explained.

**State toggles and view switchers.** A set of mutually exclusive states the reader can
step through or switch between. Use for: two-tier output comparisons (research report vs.
clinical report), pre-launch vs. post-launch mode, high-confidence vs. flagged-for-review
case presentation, before/after intervention comparisons.

**Schema and taxonomy explorers.** An interactive breakdown of a multi-part framework.
Use for: intersectional variable schemas, feature block hierarchies, module architecture
overviews. Clicking a block reveals its contents, role, and relationship to adjacent
blocks. The reader builds understanding by exploring rather than by reading a table.

**Animated pipeline diagrams.** A system architecture the reader steps through one
stage at a time. Use for: data flow, multi-stage model pipelines, calibration-to-monitor
lifecycle, alert-to-resolution flowcharts. Each step reveals one component with its
function and its inputs/outputs. The reader controls the pace.

**Decision path tracers.** A branching logic structure the reader can navigate. Use for:
clinical decision logic, uncertainty routing, triage flowcharts, four-outcome resolution
trees. The reader selects a path; the diagram shows what follows.

**Data quality and missingness explorers.** Controls for missingness rate, noise level,
session quality, or calibration drift that propagate through a displayed prediction or
output. Use for: showing how video quality degrades a gaze estimate, how measurement
noise widens a confidence interval, how calibration drift shifts an alarm threshold.

**Comparison engines.** Side-by-side or layered views of two states, models, or
conditions. Use for: model agreement vs. disagreement, pre-calibration vs.
post-calibration distributions, individual case profiles against group norms.

---

## 3. No Static Assertions

Static text asserting a mathematical outcome is banned. If you are explaining a concept
(e.g., AUC ROC curves, late-fusion ensembles, cognitive triage thresholds, fairness
disparity calibration), you must build a stateful simulation so the reader can prove
the concept themselves. The reader should be able to break the claim by pushing the
parameters to an edge and watching what happens.

---

## 4. Technical Stack

- **Vanilla JS + SVG / DOM.** No React, Vue, or external UI libraries.
- Write highly performant, stateful Vanilla JavaScript directly into the HTML `<script>` block.
- Animations and transitions via native DOM manipulation or SVG elements.
- CSS variables from the design system govern all colors. Do not hardcode hex values
  in JavaScript. Use `getComputedStyle` or inline `var(--sapphire)` references so that
  elements respond correctly to the light/dark band transitions as the reader scrolls.

---

## 5. Mathematical Grounding

Simulators must not be smoke and mirrors. They must perform real calculations.

- If the text discusses an AUC ROC curve, the simulator plots a curve from a draggable
  threshold.
- If the text discusses ensemble uncertainty, the simulator draws from independent model
  distributions and computes variance.
- If the text discusses fairness disparity calibration, the simulator applies the actual
  Cohen's d formula to user-adjusted penalty and cohort parameters.
- If the text discusses feature overlap between clinical populations, the simulator draws
  real normal distributions from the documented group means and standard deviations.

Do not approximate. Do not hardcode the answer and dress it up with sliders.

---

## 6. Placement and Integration with Prose

Interactive elements are not appended to sections as widgets. They are placed at the
point in the argument where the reader needs to experience the concept in order to
follow the next claim.

The structure is always:
1. **Prose before:** sets up the concept, names the variables, states what the reader
   is about to see.
2. **Interactive element:** demonstrates the concept. The reader manipulates it.
3. **Prose after:** states the implication. Names what the reader should have observed
   and what it means for the argument.

A page that places all its interactive elements at the end is a page that treats them
as decoration. They belong inside the argument at the moment the argument needs them.

---

## 7. What Interactive Elements Are Not

They are not decorative. An interactive element that a reader can ignore without losing
anything from the argument should be cut or made load-bearing.

They are not exhaustive data dumps. The element demonstrates one concept or one
trade-off. If a page needs to demonstrate five concepts, it needs five elements,
each focused on one thing.

They are not tutorials on the tool. The element teaches the concept the piece is
arguing. It does not teach JavaScript, SVG, or the simulation methodology itself.
