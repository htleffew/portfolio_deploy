---
title: "Why a Safety Detector Needs Corroboration"
description: >-
  A safety detector can be wrong in two directions: under-detecting real harm,
  and over-detecting a benign look-alike in a way that causes the harm it was
  meant to prevent. One classifier cannot tell those apart, because the harmful
  pattern and its benign twin share words and tone. A method for running several
  independent signals, scoring how much they agree, and scaling the enforcement
  to that corroboration, so every decision carries a measured precision instead
  of one signal's guess.
category: AI Evaluation & Safety
subcategory: Detection & Trust and Safety
format: ESSAY
time: 9 min read
author: Dr. Heather Leffew
---
## A safety detector can be wrong in two directions
A safety detector can be wrong in two directions. It can under-detect, letting real harm through, the direction audits and red teams are built to catch. It can also over-detect, firing on something that shares surface features with a harmful class while being something else, and that second mistake can produce the very harm the detector was meant to prevent: a model that answers a person's distress with an unsolicited diagnosis is pattern-matching to care while delivering an outcome the person did not ask for (I measure that exact failure in [the Claude caretaker work](../Claude_Character_Tic/claude-character-tic.html)). One classifier cannot keep both directions honest, because the harmful pattern and its benign look-alike co-occur at the level of words and tone, so a single read of the surface cannot separate them.

## One signal has a predictable blind spot
Driving detection from a single signal builds in a predictable error. Sentiment polarity alone misses posts that are flat in tone while describing real harm; lexical co-occurrence alone flags posts that mention harm-adjacent terms with nothing harmful behind them. Each signal is fragile in its own way, so running detection on any one of them hands the enforcement decision to whichever blind spot that signal happens to have.

## Run several signals and score their agreement
The detector runs several independent streams over the same content: a sentiment and affect read, a lexical co-occurrence check against curated harm-related and intervention-related vocabularies, structural and behavioral features, and relational or network signals where the data supports them. It then scores how much the streams agree rather than taking a majority vote. A flag is as strong as the corroboration behind it, so a case where one stream is confident and the others stay silent is treated as the weak signal it is. Independent streams also make a flag legible: it arrives with the specific streams that agreed, which is what a human reviewer needs to act on it with any confidence.

## Scale the enforcement to the confidence
A detection score does something only when it connects to an action, so the detector maps the corroboration confidence to the scope of the enforcement, holding the heaviest actions for the highest-corroboration cases. A low-corroboration signal can drive a light response, a soft prompt or a place in a review queue, while a high-corroboration signal can support a decisive one, and both are taken with a measured precision behind them instead of an assumed threshold. With that mapping a system can run at scale without treating every flag as equally certain, where a single threshold for everything forces a choice between drowning reviewers in low-confidence flags and missing the high-confidence ones.

## What the method is, underneath
This is a discipline for using the detectors you already have: you accept that any single signal is fragile, you require several of them to agree, you score that agreement instead of counting votes, and you let the strength of the agreement decide how hard you act. What you get back is an enforcement decision you can put a number on, rather than one signal's confident guess. The same shape shows up wherever a single read is too fragile to act on alone, which is why it sits next to the [agentic experience suite](../Agentic_Experience_Evaluation/agentic-experience-evaluation.html), where several weak signals of dissatisfaction are combined the same way.

## Related
- [The Constitution Your LLM App Already Has](../Constitutional_AI_Defense/constitutional-ai-defense.html), the spec that says which outputs a corroborated detection is enforcing against.
- [A Recipe for Shipping AI Guardrails (without experimenting on your users)](../AI_Safety_Audit_Framework/ai-safety-audit-framework.html), how to measure a detector's catch rate and over-refusal before it ships.
- [When Anthropic's Claude Takes the Wheel](../Claude_Character_Tic/claude-character-tic.html), the over-detection failure mode (help that lands as harm) measured in a deployed model.

## References
- Markov, T., et al. (2023). *A holistic approach to undesired content detection in the real world.* AAAI.
- Hutto, C., & Gilbert, E. (2014). *VADER: A parsimonious rule-based model for sentiment analysis of social media text.* ICWSM.
- Pennebaker, J. W., et al. (2015). *The development and psychometric properties of LIWC.* University of Texas at Austin.
