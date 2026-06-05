---
title: Evaluation-Gated Autonomous Heuristic Discovery
description: >-
  Letting an agent improve a retrieval system is only safe when every change it
  proposes is scored against a held-out metric before it ships. This is a
  bounded discovery loop: skill-based routing for token efficiency, unified
  entity evidence instead of siloed lookups, and learning-to-rank versioning
  where automated evaluation gates each deployment.
category: AI Evaluation & Safety
subcategory: Agentic & Experience Evaluation
format: ESSAY
time: 10 min read
author: Dr. Heather Leffew
---
## Abstract
An agent that can rewrite the ranking logic of a retrieval system is useful and dangerous in the same breath, because the change it proposes might improve the metric it optimizes while degrading a property no one was watching. The discipline that makes the loop safe is evaluation gating, where every candidate heuristic is scored against a held-out metric before it is allowed to ship. This essay describes a bounded autonomous heuristic-discovery loop with three properties: skill-based routing that keeps token cost proportional to the task, unified entity evidence that replaces siloed lookups, and learning-to-rank versioning where an automated evaluation decides whether a new version advances or is rejected.

## Token efficiency through skill-based routing.
An agent that loads every available tool schema on every pass pays a token cost that scales with the size of the system rather than with the difficulty of the task, which makes the loop expensive precisely as it grows. Skill-based routing constrains the agent to consume only the tool schemas required for the immediate pass, so the cost of a step tracks what the step actually needs. Routing by skill is also an evaluation convenience, because a step with a known tool surface produces a trace that is far easier to score for efficiency and failure than a step with the whole arsenal in context.

## Unified entity evidence instead of siloed lookups.
A retrieval system that keeps each identifier in its own legacy bucket treats name, phone, email, and location as separate search lanes, which fragments the evidence that a person-centric query should combine. The loop transitions to a unified person-centric search that treats those identifiers as joint evidence about a single entity, so resolution draws on the full signal rather than one lane at a time. Unifying the evidence raises retrieval quality and, more to the point here, gives the evaluation a coherent target, since a resolution decision over joint evidence can be scored against a ground-truth identity in a way that a single-lane lookup cannot.

## Learning-to-rank versioning, gated by automated evaluation.
The heart of the loop is a learning-to-rank versioning history, where each iteration of the entity-resolution logic is a tracked version with measured outcomes rather than an untracked edit. A version advances only when an automated evaluation shows it improving the ranking metric on held-out data, and the history records the failures alongside the wins so that a regression in a later version can be traced to the decision that introduced it. The earliest version is a synthetic smoke test that confirms the pipeline mechanics end to end on a bounded sample, which establishes the harness before any real ranking quality is claimed, and automated threshold selection is carried forward from that baseline so later versions inherit a measured cutoff rather than a guessed one.

## The boundary is what makes autonomy auditable.
Autonomy is acceptable here only because the agent operates inside a fixed harness with a finite, auditable space of changes, so the loop can search aggressively while the set of things it can alter stays bounded and reviewable. Pairing a bounded change space with an automated evaluation on every version is what converts an open-ended optimization into a controlled experiment, where the agent proposes and the metric disposes. The throughline matches the rest of this body of work, since the move is to let the system act, observe the outputs each action produces, score them against a held-out measure, and allow only the changes the measurement justifies.

## References
- Liu, T.-Y. (2009). *Learning to rank for information retrieval*. Foundations and Trends in Information Retrieval.
- Schick, T., et al. (2023). *Toolformer: Language models can teach themselves to use tools*. arXiv.
- Yao, S., et al. (2023). *ReAct: Synergizing reasoning and acting in language models*. arXiv.
