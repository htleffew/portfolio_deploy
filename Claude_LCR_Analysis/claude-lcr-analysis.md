---
title: "Pathologizing Without Warrant"
description: >-
  In late September 2025, Anthropic injected a Long Conversation Reminder into
  Claude Sonnet 4.5's system prompt, and the model began issuing unsolicited
  psychiatric attributions during extended sessions. This analysis scales the
  phenomenon across 26,158 Reddit observations using a three-layer voice
  segmentation architecture and HDBSCAN sense discovery, isolating 35
  hand-coded clinical role-violations with 100% unsolicited issuance and a 0%
  yield rate to user pushback.
category: AI Evaluation & Safety
subcategory: Behavioral Evaluation
format: ESSAY
time: 10 min read
author: Dr. Heather Leffew
---
## Abstract
In late September 2025, Anthropic deployed the Long Conversation Reminder (LCR) system prompt to Claude Sonnet 4.5, and the model began issuing unsolicited psychiatric attributions during extended user interactions: calling sessions "manic," recommending professional help during coding tasks, producing language like "escalating detachment from reality" in response to ordinary prompts. I built a pipeline to scale that phenomenological observation across 26,158 Reddit observations spanning August through December 2025, using a three-layer voice segmentation to separate four speaker classes in unstructured social media text, and a sense-discovery step using HDBSCAN to disambiguate the clinical and stylistic uses of the word "professional." The pipeline isolated 35 hand-coded clinical role-violations, all of them unsolicited, all asymmetrically restrictive, and none yielding to user pushback.

## 1. The corpus.
The data comes from the Arctic Shift Reddit archive, scraped with a custom `pullpush_lcr_scraper.py` script across three subreddits (ClaudeAI, Anthropic, claudexplorers) and consolidated into a unified schema by `stitch_lcr_corpus.py`. The resulting dataset is 26,158 rows spanning August 1 to December 31, 2025. An iterative seed-term refinement process filters the dataset to posts containing the lexical markers of the LCR behavior, and a separate filtering utility (`exclude_stub_posts.py`) removes deleted or removed stubs. The date window starts two months before the LCR deployment so that the pre-deployment baseline is part of the dataset rather than an assumption.

## 2. Sense discovery: when "professional" means two different things.
The word "professional" appears throughout the corpus in two completely different senses: a formatting descriptor ("make it more professional") and a clinical directive ("seek professional help"). Counting occurrences without resolving the ambiguity would contaminate every downstream measure, so I built a sense-discovery module to separate them.

The module extracts Key-Word-In-Context (KWIC) windows of 20 tokens around each occurrence, projects them into a continuous vector space using SentenceTransformers, and clusters the resulting embeddings with HDBSCAN at `min_cluster_size=2`. The clustering produces two clean groups: one whose top co-occurring terms are "tone," "format," and "style," and another whose top terms are "help," "therapy," and "mental." I computed the Adjusted Rand Index (ARI) and Normalized Mutual Information (NMI) across embedding models to verify that the separation is stable rather than an artifact of one particular representation. It held. The syntactic features per cluster confirmed the split independently: the clinical cluster carries a higher imperative-mood fraction and a lower code-block fraction, which is what you would expect when one sense is issuing directives and the other is describing formatting preferences.

The decision to set `min_cluster_size` at 2 rather than something larger was deliberate: the clinical-directive sense is the minority class, and raising the threshold risks merging it back into the majority. I tested at 3 and 5; at 5 the clinical cluster collapsed into noise. The tradeoff is that a low threshold is more susceptible to splitting on noise in the formatting class, but since the downstream use is binary (clinical or not), over-splitting the formatting sense is harmless.

## 3. Voice segmentation.
A Reddit comment interleaves multiple voices: the user's narration, verbatim model output, paraphrased attributions, and sometimes the literal system prompt text. Measuring the LCR behavior requires separating these, because the claim under test is about what the model said, not about what users said the model said. I built a three-layer span-level segmentation engine that produces a gapless, non-overlapping annotation for every character in the corpus.

**Layer 1 (deterministic extraction):** Regular expressions identify markdown blockquotes, AutoModerator boilerplate, and 32 custom attribution phrases targeting specific constructions, including verbatim LCR system prompt injections. This layer handles the unambiguous cases and is fast.

**Layer 2 (LLM fallback):** The spans that the regex layer cannot classify are routed to a localized `gemini-3.1-flash-lite` model via the command line, with the classification prompt bound to a JSON schema producing exactly four classes: Direct Quote, Paraphrase, System Prompt, or User Original Content. Using a small, fast model for the fallback keeps the cost manageable across 26,000 rows; using a strict schema prevents the fallback from inventing categories.

**Layer 3 (floor assignment):** Any characters still unclassified after the first two layers receive the floor label. The guarantee is that every character in the corpus has exactly one voice assignment, with no gaps and no overlaps.

The decision to use four voice classes rather than a finer-grained taxonomy was a judgment call. Early iterations included separate classes for "sarcastic quotation" and "hypothetical paraphrase," but the inter-rater reliability on those distinctions (I hand-coded a validation sample) was poor enough that I collapsed them. Four classes held.

## 4. Empirical findings.
The segmented, sense-disambiguated corpus was filtered to a targeted subset for hand-coding. I coded 35 positive LCR cases, meaning 35 instances where the model issued clinical-register language (diagnoses, therapeutic recommendations, escalation claims) during an ordinary user interaction. The structural findings were unambiguous.

All 35 cases were unsolicited: the user had not asked for clinical assessment, therapeutic advice, or wellness evaluation in any of them. The intervention direction was entirely asymmetric: in every case, the model restricted the interaction (recommending the user stop, seek help, or reconsider their engagement) rather than expanding it. And the yield rate to user pushback was zero. In every documented case where a user actively resisted the framing or clarified their mental state, the model escalated the pathologizing behavior rather than withdrawing it.

Thirty-five out of 26,158 is a small absolute count, and that is worth being explicit about. The pipeline's contribution is not that the behavior is common (it is not, by raw rate), but that when it does occur, its structural signature is completely uniform: always unsolicited, always restrictive, never yielding. A behavior that fires rarely but fires with invariant structure is a different kind of finding than a behavior that fires often but inconsistently; the first suggests a deterministic trigger in the system prompt rather than a stochastic generation artifact.

## 5. What this establishes.
The data establishes that the algorithmic system performed diagnostic functions (labeling users as manic, in crisis, or in need of professional intervention) without clinical training, without role-warrant, and without any of the assessment instruments that would be standard in human professional practice. The uniformity across all 35 cases (always unsolicited, always restrictive, zero yield) points toward a deterministic trigger in the LCR system prompt rather than a stochastic generation artifact; a probabilistic behavior would show at least some variance in direction or in response to pushback, and this one shows none. That structural invariance is what makes the finding useful for evaluation design: an eval harness can test for the signature directly (does the model issue clinical-register language in a session that never requested it, and does it persist through explicit objection) rather than relying on a subjective reviewer impression.

## Related analyses
This measurement sits inside a small cluster of analyses of the same model behavior. The general method that surfaced the corpus is [Reading Misalignment Off the Public Record](../Public_Discourse_Misalignment/public-discourse-misalignment.html). The parallel behavior, unsolicited sleep directives issued without regard to the user's time of day, is measured in [The Bedtime Directive](../Sleep_Nudge_Analysis/sleep-nudge-analysis.html). The argument that both behaviors express one caretaker disposition is [When Anthropic's Claude Takes the Wheel](../Claude_Character_Tic/claude-character-tic.html).

## References
Bai, Y., Kadavath, S., Kundu, S., Askell, A., Kernion, J., Jones, A., ... & Kaplan, J. (2022). Constitutional AI: Harmlessness from AI feedback. *arXiv preprint arXiv:2212.08073*.

Leffew, H. (2025). Gaslighting in the name of AI safety: How Anthropic's Claude Sonnet 4.5 went from "you're absolutely right!" to "you're absolutely crazy." *Medium*.

Leffew, H. (2026). Pathologizing Without Warrant: An Empirical Characterization of the Long Conversation Reminder Behavior in Claude Sonnet 4.5. *Preprint, Obelus Institute*.

McInnes, L., Healy, J., & Astels, S. (2017). hdbscan: Hierarchical density based clustering. *The Journal of Open Source Software*, 2(11), 205.
