---
title: Evaluating an Agentic Assistant as a User Experience
description: >-
  Offline accuracy does not tell you whether an agentic product is good for the
  person using it. This is a six-part evaluation suite that grades task success,
  grounding, tool-path efficiency, satisfaction and abandonment signals, latency
  as an experience budget, and per-segment regression, built from the system's
  own conversation logs.
category: AI Evaluation & Safety
subcategory: Agentic & Experience Evaluation
format: ESSAY
time: 11 min read
author: Dr. Heather Leffew
---
## Abstract
An agentic assistant can score well on an offline benchmark and still fail the people using it, because the benchmark measures answer correctness while the user experiences a trajectory of tool calls, latency, dead ends, and reformulations. This essay describes a six-part evaluation suite that treats agent quality as a measurable user experience, built entirely from the system's own conversation logs and bounded to aggregate behavioral signals. The suite establishes a task-success baseline, reviews grounding, scores tool-path efficiency and the cost of failed calls, extracts linguistic signals of dissatisfaction and abandonment, sets a latency experience budget, and regresses every result by user segment.

## Start with a task-success baseline you can defend.
Any claim that a new model version improved the product requires a prior number to improve on, so the first notebook establishes a historical task-success baseline inferred from the existing conversation corpus using bounded aggregate signals. The baseline avoids per-user content inspection and works from structural signals such as whether a session reached a resolved state, how many turns it took, and whether the user returned to reformulate, which keeps the measurement privacy-preserving while still capturing completion. The value of the baseline is comparative rather than absolute, since a task-success rate is only meaningful against the version that preceded it and the segment it was measured on.

## Grounding separates a real answer from a confident guess.
An agentic system that returns an answer can do so by reading the evidence its tools surfaced or by drifting into plausible inference that the available evidence does not support, and those two cases look identical at the surface. The grounding review scores how often a returned answer is anchored in the tool responses and evidence payloads present in the session rather than in weak inference, using the recorded tool-call metadata as the ground for the check. A grounding rate is the agentic analogue of a hallucination rate, and it is the metric that tells you whether the tools are doing the work or whether the model is improvising around them.

## Tool-path efficiency, and the cost of a wrong turn.
The path an agent takes to an answer is itself a quality signal, because a session that reaches the right result after redundant, circular, or failed tool calls spent more of the user's patience and more compute than it needed to. The efficiency notebook scores how often the tool path becomes unnecessarily long or redundant before the user reaches the likely answer, and it attaches a cost to failed calls so that a graceful path and a thrashing path are scored differently even when both eventually succeed. Tool-path efficiency is the metric that exposes long-horizon agent behavior, where the failure is not a wrong final answer but an expensive route to a right one.

## Dissatisfaction leaves linguistic fingerprints.
Users rarely file a complaint, so the signal that a session went badly lives in how they write, in the reformulations, the corrections, the rising terseness, and the abandonment that follow a bad turn. The satisfaction notebook extracts bounded behavioral signals of dissatisfaction, reformulation pressure, and abandonment, and a supplementary pass adds linguistic analysis with part-of-speech and sentiment tooling to detect confusion and interaction failure in the text itself. Reading dissatisfaction from language rather than from a survey is the same implicit-signal method that behavioral measurement has always used, applied to the transcript an agent leaves behind.

## Latency is an experience budget, not a backend stat.
Responsiveness shapes whether a correct answer feels usable, so latency belongs in the experience evaluation rather than only in the systems dashboard. The latency notebook sets a responsiveness budget and measures the session against it, which lets a slow-but-correct path and a fast-but-correct path be scored as the different experiences they are. Treating latency as a budget makes the tradeoff explicit when a more capable model costs more time, so the decision to ship it weighs the capability gain against the responsiveness it spends.

## Regress by segment, because the average hides the failures.
A single aggregate number averages away the segments where a system performs worst, so the final notebook regresses every preceding metric by user segment to surface where experience degrades. Segment regression is what turns the suite from a scorecard into a diagnostic, because it locates the population for which grounding dropped or the tool path lengthened, which is where the next iteration should be aimed. The throughline across all six parts is consistent: observe the behavioral outputs the agent leaves in its logs, extract the signals that reveal whether the experience succeeded, classify them into measurable outcomes, and build the release decision on what the measurement shows rather than on an offline score.

## References
- Es, S., et al. (2024). *RAGAS: Automated evaluation of retrieval augmented generation*. arXiv.
- Liu, N. F., et al. (2023). *Lost in the middle: How language models use long contexts*. arXiv.
- Yao, S., et al. (2023). *ReAct: Synergizing reasoning and acting in language models*. arXiv.
- Zheng, L., et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*. arXiv.
