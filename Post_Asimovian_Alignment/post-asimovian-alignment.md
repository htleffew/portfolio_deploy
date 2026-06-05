---
title: A Post-Asimovian Framework for Adaptive Alignment
description: >-
  Static safety thresholds treat a crisis-intervention request and an
  adversarial attack as the same input. This framework decouples safety
  constraints from preference optimization and conditions the constraint on a
  linguistic read of the context, proposing psycholinguistic typology discovery
  as the observable state variable for an alignment control system.
category: AI Evaluation & Safety
subcategory: Alignment & Safety Governance
format: ESSAY
time: 13 min read
author: Dr. Heather Leffew
---
## Abstract
Contemporary alignment swings between two failure modes it cannot escape at the same time, producing models that exacerbate a person's distress on one end and models that refuse benign requests and contradict a user's reality on the other. This framework argues the swing is architectural, traces it to three specific mechanisms, and proposes a hierarchical design that decouples safety constraints from preference optimization and conditions the active constraint on a linguistic read of the context. The central proposal is to use psycholinguistic typology discovery as the observable state variable for an adaptive alignment control system, formalizing the implicit-signal measurement methods of forensic linguistics as feedback control rather than as a fixed threshold.

## The alignment pendulum is a symptom, not the problem.
The observable pattern is a pendulum, where tightening a model against false-negative harms such as enabling exploitation increases false-positive harms such as refusing a legitimate request, and loosening it reverses the trade. Treating the pendulum as the problem leads teams to hunt for a single threshold that balances the two, which is the move this framework rejects, because the balance point that is correct for a crisis conversation is wrong for an adversarial probe and no constant can be right for both. The pendulum is what a static architecture produces when it meets a world whose safe response depends on context it does not measure.

## Three mechanisms generate the failure.
The first mechanism is linear reward scalarization on non-convex Pareto fronts, where collapsing plural values into a single weighted reward cannot reach the points on the front that represent genuine value pluralism, so the optimizer settles into compromises that satisfy neither value. The second is the brittleness of monolithic safety constraints, where a single constraint structure cannot accommodate requirements that legitimately differ by context, so it fails at the edges it was never shaped to hold. The third is the operational rigidity of static thresholds, where a fixed cutoff cannot adapt to an evolving adversarial landscape and cannot tell a crisis-intervention context apart from an attack context, which is the distinction that matters most.

## Decouple safety from preference, then condition it on language.
The framework's structural move is to separate the safety constraint from the preference optimization rather than folding both into one reward, which lets the constraint be specified and enforced as a constrained Markov decision process instead of as a term that the optimizer can trade away. With the constraint decoupled, its strength becomes a function the system can modulate, and the framework conditions that strength on a linguistic risk reading of the current context, so the constraint tightens for the signals that indicate genuine danger and relaxes for the signals that indicate a benign request wearing alarming words. The adaptive threshold is written as a time-varying function of linguistic risk, which is the formal statement that the right boundary is set by context rather than by a constant.

## Psycholinguistic typology as the observable state variable.
A control system needs a state variable it can observe, and the framework proposes psycholinguistic typology discovery for that role, because the same implicit signals that let forensic linguistics infer a hidden human state from language can be extracted from the language a model is processing and producing. Classifying the context into typologies, crisis against adversarial against ordinary, gives the controller a measurable read of which regime it is in, which is what the adaptive threshold consumes to decide how hard the safety constraint should bind. Using typology as the state variable is the same method applied throughout this body of work, where the move is to observe behavioral and linguistic outputs, extract the implicit signals, classify them into predictive types, and build the governance on what the classification reveals.

## Why this is a measurement proposal, not a philosophy.
The framework deliberately replaces rule-based alignment, the Asimovian instinct to write down the right principles, with an empirical control architecture whose components are all measurable, because a principle that cannot be observed and scored cannot be enforced or audited. The Pareto front is plottable, the constrained policy is trainable, the linguistic risk score is computable, and the typology is a classifier with precision and recall, so the entire proposal is stated in quantities a team can test rather than in maxims it must trust. The contribution is the reframing of the alignment pendulum as a control problem with an observable state, which turns an apparently irreducible trade-off into a system that can be measured, tuned, and held to account.

## References
- Bai, Y., et al. (2022). *Constitutional AI: Harmlessness from AI feedback*. arXiv.
- Dai, J., et al. (2024). *Safe RLHF: Safe reinforcement learning from human feedback*. arXiv.
- Altman, E. (1999). *Constrained Markov Decision Processes*. Chapman and Hall.
- Rame, A., et al. (2023). *Rewarded soups: Pareto-optimal alignment by interpolating weights*. arXiv.
