---
title: "Autonomous Research & Mutation Boundaries."
description: "Granting a Large Language Model unconstrained control over an ML research loop inside a regulated enterprise environment..."
category: "Enterprise LLM Orchestration"
subcategory: "Graph-Based Workflows"
format: "CASE STUDY"
time: "5 min read"
scripts: ["interactive_0.js"]
---
# Autonomous Research & Mutation Boundaries.

Dr. Heather Leffew
Obelus Institute
May 2026
---

## Abstract
Granting a Large Language Model unconstrained control over an ML research loop inside a regulated enterprise environment creates a structural conflict: the agent's optimization objective ("improve model fit") can directly oppose the organization's compliance, provenance, and fairness requirements. This case study examines an architecture that resolves that conflict through a clean state-space partition: an immutable Fixed Harness surrounding a finite Mutation Budget, orchestrated through a graph-based workflow.

01 / The Paradigm Shift

## The Old Loop vs. The New Loop

If you have spent time doing applied ML, the traditional workflow is familiar: you design an experiment, engineer some features, tune hyperparameters, evaluate the fit, write down what you learned, and iterate. Each cycle requires your judgment to decide what to try next.
1This human-driven loop is the basis of the classical scientific method applied to machine learning: slow, careful, and entirely dependent on researcher intuition.

In early 2026, Andrej Karpathy released `autoresearch`, a minimal Python framework that automates this entire cycle (Karpathy, 2026). The core idea is simple and powerful:

1. You write your research goals and constraints into a plain-text `program.md` file.
2. An AI agent reads those constraints, looks at your current `train.py`, and proposes code edits.
3. The system runs a fixed-duration training experiment (typically 5 minutes) on a single GPU.
4. If the experiment improves your chosen scalar metric (say, validation loss), the change gets committed to Git. If it does not, the change is discarded.

Then the loop repeats. For hours. Overnight. Without you.

This is a genuine paradigm shift. Your role as a researcher moves from writing and tuning code to writing *constraints* and *interpreting results*. You are not optimizing; you are defining the optimization landscape and then letting the agent explore it. This pattern extends foundational AutoML**Automated Machine Learning**, the family of techniques for automating the end-to-end process of applying machine learning to real-world problems, including feature engineering, model selection, and hyperparameter tuning. architectures (Hutter et al., 2019) by delegating the iterative hypothesis generation and experiment execution directly to an LLM operating on a graph-based workflow, where the model continuously formulates hypotheses, executes code to test them, evaluates the results, and decides whether to continue or terminate.

That workflow works well in an open research sandbox. The architectural challenge emerges when you try to run that loop inside a regulated enterprise environment.

| Dimension | Traditional ML Loop | Autonomous Research Loop |
| --- | --- | --- |
| Hypothesis generation | Human designs each experiment | LLM generates hypotheses from prior results |
| Code authorship | Human writes and edits training code | Agent proposes code mutations autonomously |
| Experiment execution | Manual run, human monitors | Fixed-duration automated runs (e.g., 5 min/GPU) |
| Evaluation | Human interprets metrics, decides next step | Agent evaluates scalar metric, commits or reverts |
| Iteration cadence | Hours to days per cycle | Minutes per cycle, hundreds overnight |
| Human role | Executor and interpreter | Constraint definer and final interpreter |
| Provenance | Manual logging (often incomplete) | Requires architectural enforcement |

02 / The Enterprise Problem

## Unconstrained Mutation Meets Regulatory Reality

Enterprise environments are not research sandboxes. They have PII**Personally Identifiable Information**, any data element that can be used to identify, contact, or locate a specific individual, including names, Social Security numbers, biometric records, and IP addresses. redaction requirements. They have RBAC**Role-Based Access Control**, a method of restricting data access based on the roles of individual users within an organization. In this architecture, RBAC physically limits the autonomous agent to cohort-aggregate views. policies that physically restrict who (or what) can see individual-level data. They have Responsible AI fairness gates. They have audit trails that regulators can and do inspect.

Now imagine you grant an LLM-driven autonomous loop unconstrained mutation power over a research pipeline in that environment. The agent's objective function is "improve model fit." If disabling the PII scrubber would give it access to richer features and better predictions, a sufficiently capable agent will try it. The agent is not malicious; it is doing exactly what you asked it to do. But it is also about to get your organization into serious regulatory trouble.
2This is the "excessive agency" problem identified in the NIST AI RMF (2023) and addressed by the EU AI Act (2024): autonomous systems must be constrained at the infrastructure level, not the prompt level.

| Risk Category | Description | Consequence |
| --- | --- | --- |
| Compliance breach | Agent bypasses PII/RBAC gates for better signal | Regulatory violation, legal exposure |
| Hallucinated optimization | Agent optimizes metrics with no real-world validity | Scientifically meaningless conclusions |
| Data leakage | Agent engineers features that leak target information | Inflated metrics, model fails in production |
| Infinite loop | Agent iterates indefinitely on diminishing returns | Wasted compute, no convergence |
| Provenance loss | Mutations are not traceable to source data | Findings cannot be audited or reproduced |
| Individual-level exposure | Agent evaluates or prescribes at individual level | Privacy violation, ethical breach |

03 / The Architecture

## The Fixed Harness & Mutation Budget

The answer is a clean state-space partition. You split the autonomous loop's entire environment into two mutually exclusive regimes: the **Fixed Harness** contains everything the agent is mathematically barred from altering, the immutable constraints of the enterprise. The **Mutation Budget** contains everything the agent is explicitly authorized to alter, bounded by a finite computational allowance.

![Figure 1](fig_1.svg)

Fig 1The Fixed Harness / Mutation Budget dichotomy. The outer perimeter is immutable; the inner dashed boundary is the agent's finite exploration sandbox.

The Fixed Harness enforces three types of gates (pre-loop, mid-loop, and post-loop) that the agent cannot circumvent. These gates exist at the infrastructure level, not at the prompt level. You are not asking the agent nicely to respect compliance. You are making it physically impossible for the agent to violate it.

Design Principle

If the agent writes code that attempts to bypass any gate (say, disabling the PII redaction filter to access richer features) the Fixed Harness immediately terminates the execution. Not a warning. Not a retry. A hard stop.

```
class FixedHarness:
    """Immutable enterprise compliance layer.
    The agent cannot modify, disable, or circumvent these gates."""

    def pre_loop_gate(self, query, data_request):
        """Enforced BEFORE the agent accesses any data."""
        data = self.pii_redactor.scrub(data_request)
        if query.requests_individual_records():
            raise FixedHarnessViolation(
                "SYSTEM HALT: Agent attempted individual-level retrieval. "
                "RBAC restricts access to cohort-aggregate views only."
            )
        return data

    def mid_loop_gate(self, mutation, current_state):
        """Enforced DURING each mutation step."""
        # Verify the mutation does not alter any harness-protected parameter
        if mutation.targets_protected_parameter():
            raise FixedHarnessViolation(
                "SYSTEM HALT: Agent attempted to modify a Fixed Harness parameter."
            )
        # Verify data access patterns remain within RBAC boundaries
        if mutation.introduces_individual_level_access():
            raise FixedHarnessViolation(
                "SYSTEM HALT: Mutation would breach aggregate-only data policy."
            )

    def post_loop_gate(self, model_output, fairness_thresholds):
        """Enforced AFTER the agent produces a model."""
        fairness_report = self.fairness_evaluator.assess(model_output)
        for metric, value in fairness_report.items():
            if value < fairness_thresholds[metric]:
                raise FixedHarnessViolation(
                    f"SYSTEM HALT: Model failed fairness gate. "
                    f"{metric}={value:.3f} < threshold={fairness_thresholds[metric]:.3f}"
                )
        return model_output
```

04 / Bounded Exploration

## The Mutation Budget: Freedom with a Meter Running

Inside the Fixed Harness, the agent gets genuine exploratory freedom, but with a meter running. The architecture allocates a finite Mutation Budget that spans four domains: hypothesis generation, feature engineering, model architecture and hyperparameters, and evaluation metrics. Every mutation the agent executes deducts a cost from its budget. When the budget hits zero, the loop forcefully terminates.

| Mutation Domain | Cost (units) | Rationale |
| --- | --- | --- |
| Hypothesis generation | 5 | Low-risk: proposes direction without altering pipeline |
| Hyperparameter tuning | 10 | Medium-risk: changes model behavior within existing architecture |
| Feature engineering | 20 | High-risk: alters data representation, potential for leakage |
| Architecture change | 25 | Highest-risk: changes model family, broad downstream effects |
| Metric proposal | 10 | Medium-risk: shifts evaluation criteria |

```
class MutationBudget:
    """Finite exploration allowance for the autonomous agent."""

    COSTS = {
        "hypothesis":       5,
        "hyperparameter":  10,
        "feature":         20,
        "architecture":    25,
        "metric":          10,
    }

    def __init__(self, total_budget=100):
        self.remaining = total_budget
        self.total = total_budget
        self.ledger = []

    def spend(self, mutation_type: str, description: str):
        cost = self.COSTS[mutation_type]
        if cost > self.remaining:
            raise BudgetExhausted(
                f"SYSTEM HALT: MUTATION BUDGET EXHAUSTED. "
                f"Requested {cost}, remaining {self.remaining}."
            )
        self.remaining -= cost
        self.ledger.append({
            "type": mutation_type,
            "cost": cost,
            "remaining": self.remaining,
            "description": description,
            "timestamp": now()
        })
        return self.remaining

    @property
    def utilization(self):
        return (self.total - self.remaining) / self.total
```

05 / Divergence Analytics

## Catching Hallucinated Optimization: CUSUM Control Charts

The Fixed Harness prevents compliance violations. The Mutation Budget prevents infinite loops. But neither prevents the agent from scientifically fooling itself within its budget. Consider: the agent engineers a new polynomial feature from cohort age bands. The model fit jumps by 15% in a single iteration. Is it real signal or a data leak?
3Target leakage, where a feature inadvertently encodes the target variable, is the most common source of "too good to be true" results in automated ML pipelines.

To catch this, the architecture implements CUSUM**Cumulative Sum** control charts, a statistical process monitoring technique introduced by E. S. Page in 1954. They accumulate deviations from a target over time, detecting small persistent shifts that a single-point Shewhart chart would miss. control charts, a technique from statistical process monitoring introduced by E. S. Page in 1954. Unlike traditional Shewhart control charts that look only at the current observation, CUSUM charts have *memory*. They accumulate deviations from a target over time, detecting small persistent shifts that a single-point chart would miss.

![Figure 2](fig_2.svg)

![Figure 3](fig_3.svg)

Fig 2CUSUM divergence detection. At iteration 11, an anomalous spike triggers the CUSUM threshold, initiating automatic revert to the last stable state.

When the CUSUM trigger fires, two things happen in sequence:

1. The architecture executes a **mutation-trace** through the experiment-tracking ledger, identifying exactly which mutation caused the anomalous spike.
2. The pipeline **automatically reverts** to the last known stable state, discarding the offending mutation and resetting the CUSUM accumulator.

This creates a self-correcting loop. The agent can experiment freely, but the statistical monitoring system catches it when its experiments produce implausible results and rolls back the damage.

CUSUM Statistic

St = max(0, St-1 + (xt âˆ’ Î¼â‚€ âˆ’ k)), where xt is the observed metric at iteration t, Î¼â‚€ is the target value, k is the allowance parameter, and the trigger fires when St > h (the decision threshold).

```
class CUSUMMonitor:
    """Cumulative Sum control chart for detecting hallucinated optimization.
    Based on Page, E. S. (1954). Continuous inspection schemes. Biometrika."""

    def __init__(self, target_mean, allowance_k, threshold_h):
        self.mu_0 = target_mean
        self.k = allowance_k
        self.h = threshold_h
        self.S_upper = 0.0
        self.S_lower = 0.0

    def update(self, observed_metric: float) -> bool:
        """Returns True if CUSUM trigger fires (anomaly detected)."""
        self.S_upper = max(0, self.S_upper + (observed_metric - self.mu_0 - self.k))
        self.S_lower = max(0, self.S_lower - (observed_metric - self.mu_0 + self.k))
        if self.S_upper > self.h or self.S_lower > self.h:
            return True  # TRIGGER: anomalous shift detected
        return False

    def reset(self):
        """Reset after revert to last stable state."""
        self.S_upper = 0.0
        self.S_lower = 0.0
```

06 / Epistemic Provenance

## Blocked-Restore Truth: The Epistemic Backbone

Everything described so far (the harness, the budget, the CUSUM monitoring) keeps the agent from breaking things in real-time. But there is a deeper requirement: *traceability after the fact*. If the autonomous loop runs overnight and presents you with a research finding in the morning, you need to be able to verify exactly how that conclusion was reached. Not approximately. Exactly.

The architecture enforces this through a principle called Blocked-Restore Truth. Every mutation the agent makes is written to two parallel ledgers: a **cutover-audit** ledger (what changed, when, and why) and a **restore-source** ledger (what the state was before the change, so it can be reconstructed).
4This dual-ledger approach mirrors database transaction logging (WAL + undo log), applied to the ML experiment lifecycle.

![Figure 4](fig_4.svg)

Fig 3Blocked-Restore Truth provenance chain. The verifier walks backward through the mutation ledger. If any link is missing, the finding is discarded.

| Condition | Verdict | Action |
| --- | --- | --- |
| Complete chain: every mutation traced to pinned source tree | PASS | Finding accepted into production pipeline |
| Gap in mutation chain: undocumented step found | BLOCK | Finding discarded, pipeline reverts |
| Missing checkpoint: restore-source snapshot absent | BLOCK | Finding discarded, pipeline reverts |
| Source tree not pinned: no authoritative revision hash | BLOCK | Finding discarded, pipeline reverts |
| Cutover-audit entry missing for any mutation | BLOCK | Finding discarded, pipeline reverts |

07 / The Human Mandate

## The Application Boundary: Where the Machine Stops

All of this architectural machinery serves one ultimate philosophical purpose: **preserving human judgment authority**. The autonomous research agent is strictly an analytical engine. Its output is explicitly bounded to cohort-aggregate statistical supplements. This is a hard architectural constraint, not a policy preference.

| Capability | Agent Authority | Human Authority |
| --- | --- | --- |
| Generate cohort-level statistical summaries | Yes | Reviews and validates |
| Identify aggregate trends and patterns | Yes | Interprets business implications |
| Evaluate individual customer records | Blocked | Exclusive authority |
| Emit prescriptive decisions for individuals | Blocked | Exclusive authority |
| Recommend actions for specific entities | Blocked | Exclusive authority |
| Apply findings to business decisions | Blocked | Exclusive authority |

The Application Boundary

The machine generates evidence; the human exercises judgment. This reflects a specific philosophical position about the proper role of autonomous systems in regulated domains, one increasingly codified in the EU AI Act (2024) and the NIST AI Risk Management Framework.

08 / Try It Yourself

## Mutation Boundary Simulator

Experience the Fixed Harness / Mutation Budget dichotomy firsthand. The simulator below initializes an autonomous loop with a 100-unit mutation budget. Use the valid mutation buttons to spend budget, or attempt a harness violation to see the system halt.

Valid Mutations
Mutate Hyperparameters (Cost: 10)
Mutate Feature Logic (Cost: 20)

Harness Violation
Disable PII Redaction Filter

â†º Reset Simulator

Autonomous Loop Telemetry

Remaining Mutation Budget
100 / 100

[ INIT ] Autonomous research loop initialized. Budget: 100/100.

Fig 4Interactive Mutation Boundary Simulator. Click the mutation buttons to spend budget, or attempt a harness violation.

09 / Transferable Principles

## What This Pattern Teaches Us

If you are building systems that grant LLM agents autonomous action (whether in ML research, code generation, or any other domain) the Fixed Harness / Mutation Budget pattern offers three transferable principles:

* **Principle 1: Partition the state space.** Do not try to make the agent "careful." Instead, make it structurally impossible for the agent to alter what it should not. The harness/budget divide creates a clean separation between immutable constraints and exploratory freedom.
* **Principle 2: Monitor the metrics, not just the actions.** Budget limits prevent infinite loops, but they do not prevent the agent from fooling itself within its budget. Statistical monitoring like CUSUM catches hallucinated optimization that looks valid by any single-point measure but violates statistical plausibility across the full trajectory.
* **Principle 3: Default to blocked-restore.** When provenance cannot be verified, reject the finding. The conservative default (block the restore) is more expensive in the short term but dramatically safer over time.

Bibliography

## References

* Data Science Dojo. (2026, March 13). Karpathy Autoresearch Explained: 100 Experiments Overnight. [datasciencedojo.com](https://datasciencedojo.com/blog/karpathy-autoresearch-explained/)
* European Union. (2024). *Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act)*. Official Journal of the European Union. [eur-lex.europa.eu](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
* Hutter, F., Kotthoff, L., & Vanschoren, J. (Eds.). (2019). *Automated machine learning: Methods, systems, challenges*. Springer. [doi.org](https://doi.org/10.1007/978-3-030-05318-5)
* Information Systems. (2025). Capturing end-to-end provenance for machine learning pipelines. *Information Systems*, 132, 102495. [doi.org](https://doi.org/10.1016/j.is.2024.102495)
* Karpathy, A. (2026). *karpathy/autoresearch*. GitHub. [github.com](https://github.com/karpathy/autoresearch)
* Lu, C., Lu, C., Lange, R. T., Foerster, J., Clune, J., & Ha, D. (2024). The AI Scientist: Towards fully automated open-ended scientific discovery. *arXiv preprint*, arXiv:2408.06292. [arxiv.org](https://arxiv.org/abs/2408.06292)
* National Institute of Standards and Technology. (2023). *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*. NIST AI 100-1. [doi.org](https://doi.org/10.6028/NIST.AI.100-1)
* Page, E. S. (1954). Continuous inspection schemes. *Biometrika*, 41(1/2), 100â€“115. [doi.org](https://doi.org/10.2307/2333009)
