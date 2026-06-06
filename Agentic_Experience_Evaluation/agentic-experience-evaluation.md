---
title: "Grading an Agent as a User Experience"
description: >-
  An agent can ace an offline benchmark and still frustrate the people using it,
  because the user lives the whole trajectory: the tool calls, the dead ends,
  the waiting, and the reformulations behind the final answer. Six measurements
  read from the agent's own conversation logs, a task-success baseline, a
  grounding check, tool-path efficiency, the linguistic signals of
  dissatisfaction and abandonment, latency as an experience budget, and a
  per-segment regression that finds the group the average is hiding.
category: AI Evaluation & Safety
subcategory: Agentic & Experience Evaluation
format: ESSAY
time: 9 min read
author: Dr. Heather Leffew
---
## The agent's logs already hold its experience
An agent leaves a complete record of everything it did to answer a request: the tools it called, the order it called them in, how long each step took, and how the user reacted to the result. That record is where the user's actual experience lives, because the person who asked lives the whole trajectory that produced the answer: the dead ends, the waiting, and the moments where they had to rephrase because the agent misread them. Six measurements, all drawn from those logs and all kept at the level of aggregate behavioral signals rather than individual transcripts, turn that record into a read on whether the agent served the person who asked, and they borrow the same offline discipline as [A Recipe for Shipping AI Guardrails](../AI_Safety_Audit_Framework/ai-safety-audit-framework.html): the agent already produced the evidence, so you score what it did instead of running a live experiment to find out.

## Start with a task-success baseline
A claim that a new version improved the product needs an earlier number to improve on, so the first measurement is a task-success baseline read from the conversations the agent already had. You infer success from structural signals, whether the session reached a resolved state, how many turns it took, whether the user came back to rephrase, so the baseline stays aggregate and never reads individual content. The number is comparative: a task-success rate tells you something only against the version before it and the segment it came from, so it comes first, and every later measurement is read against it.

## Grounding: is the answer anchored in the evidence
Grounding measures how often a returned answer is actually anchored in the tool responses recorded in the session, using the tool-call metadata as the thing you check against, because an answer built from the evidence and an answer improvised past it can read the same on the surface. It is the agentic version of a hallucination rate: when grounding drops, the tools are still in the loop but the model is talking past what they returned.

## Tool-path efficiency: the cost of a wrong turn
The route an agent takes to an answer is its own quality signal, because a session that lands on the right result after redundant or failed tool calls spent more of the user's patience and more compute than it needed. This measurement scores how long and how circuitous the path got before the agent reached the answer, and it puts a cost on failed calls so a session that goes straight to the answer and one that wanders to it score differently even when both eventually succeed. Long-horizon behavior shows up here: a session can end on a correct answer and still have reached it through an expensive, circuitous path that cost the user time and the system compute.

## Dissatisfaction leaves fingerprints in the text
Users rarely file a complaint, so the sign that a session went badly lives in how they write: the reformulations, the corrections, the sentences getting shorter and sharper, the quiet abandonment after a bad turn. This measurement reads those behavioral signals of reformulation pressure and abandonment, and a second pass adds part-of-speech and sentiment analysis to catch confusion in the language itself. It is the same implicit-signal approach behavioral measurement has always used, a reading of what people do and how they phrase it rather than what they report on a survey, applied here to the transcript an agent leaves behind (the [LIWC narrative work](../Diagnostic_Thematic_Apperception_Narratives/diagnostic-thematic-apperception-liwc.html) is the same method on clinical text).

## Latency is an experience budget
Responsiveness decides whether a correct answer feels usable, so latency belongs inside the experience evaluation and not only on the systems dashboard. This measurement sets a responsiveness budget and scores each session against it, which lets a slow-but-correct path and a fast-but-correct path register as the different experiences they are. Holding latency as a budget makes the tradeoff visible when a more capable model costs more time, so the decision to ship it weighs the capability you gain against the responsiveness you spend.

## Break every metric down by user segment
The last measurement breaks every preceding metric down by user segment, so grounding, tool-path efficiency, latency, and the rest are read per population instead of as one blended number. A per-segment view points you at the group whose grounding dropped or whose tool path ballooned, which is where the next iteration should aim, because an average reports one result for a set of users the agent may be serving very unevenly.

None of these six is exotic. You read the agent's own logs, you set a baseline before you change anything, you check that answers come from evidence, you watch the path and the latency and the language, and you break every number down by who was on the other end. Do that, and you can answer the question an agent's benchmark score leaves open, which is whether the person who asked got what they came for.

## Related
- [A Recipe for Shipping AI Guardrails (without experimenting on your users)](../AI_Safety_Audit_Framework/ai-safety-audit-framework.html), the same offline, log-based discipline aimed at safety instead of experience.
- [The Constitution Your LLM App Already Has](../Constitutional_AI_Defense/constitutional-ai-defense.html), the spec an agent's tool use is supposed to stay inside.
- [Multi-Signal Safety Detection](../Multi_Signal_Safety_Detection/multi-signal-safety-detection.html), how to combine these signals when no single one is enough to call a session good or bad.

## References
- Es, S., et al. (2024). *RAGAS: Automated evaluation of retrieval augmented generation.* arXiv:2309.15217.
- Liu, N. F., et al. (2023). *Lost in the middle: How language models use long contexts.* arXiv:2307.03172.
- Yao, S., et al. (2023). *ReAct: Synergizing reasoning and acting in language models.* arXiv:2210.03629.
- Zheng, L., et al. (2024). *Judging LLM-as-a-judge with MT-Bench and Chatbot Arena.* arXiv:2306.05685.
