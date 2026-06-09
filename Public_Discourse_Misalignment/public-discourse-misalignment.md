---
title: "Reading Misalignment Off the Public Record"
description: >-
  When a model ships a misaligned behavior, its users report it in public forums
  before any benchmark catches it. A discourse-mining pipeline that treats public
  discussion as a misalignment instrument: attributed-quote extraction, BERTopic
  clustering over MiniLM embeddings, NetworkX co-occurrence between model outputs
  and user-reported harm, and a Prophet changepoint test against the release date,
  demonstrated on the harmful-helpfulness episode in Claude Sonnet 4.5 (p < .001).
category: AI Evaluation & Safety
subcategory: Discourse Mining & Misalignment
format: ESSAY
time: 11 min read
author: Dr. Heather Leffew
---
## Abstract
In September 2025 Anthropic released Claude Sonnet 4.5, and within days users on r/ClaudeAI were posting verbatim model outputs that read like unsolicited clinical assessments: the model calling a user's extended session "manic," recommending professional help during a coding task, issuing language like "escalating detachment from reality" in response to ordinary prompts. I scraped roughly a thousand threads from three subreddits (ClaudeAI, Anthropic, claudexplorers), built a six-layer NLP pipeline to extract the signal, and the result was a measured association between specific model-output terms and specific user-reported harms, with a complaint-density spike at the release date significant at p < .001. The pipeline is general; the worked example is Claude's harmful-helpfulness episode, but the same instrument applies to any deployed model whose users can quote it and react.

## The pipeline begins with attribution, not sentiment.
A forum thread is anecdote until the model's actual output can be separated from the user's paraphrase. The first layer of the pipeline scans each post for a model utterance that is clearly attributable, either through quotation marks, a markdown blockquote, or an explicit attribution phrase ("Claude said," "it responded with"), and keeps only the cases where the quoted text carries a target-behavior signature. I built two seed lexicons for the extraction: a harmful-output lexicon (terms like *professional*, *therapy*, *clinical*, *manic*, *diagnose*, *escalating*, *destructive*, *spiral*) and a user-experience lexicon (terms like *gaslighting*, *condescending*, *patronizing*, *creepy*, *unsolicited*, *intrusive*, *frustrating*). Each lexicon was then refined per corpus segment using TF-IDF scores and cosine similarity against the seed set via `all-MiniLM-L6-v2` embeddings, which expanded coverage to contextual neighbors without drifting off target.

The reason attribution comes first is straightforward: a measured claim about what a model said requires the said-thing to be present in the record rather than summarized by an upset user. Global sentiment analysis on an entire thread (a VADER compound score, for instance) will tell you the thread is negative, but it collapses the distinction between who said what. By segmenting the discourse into "model voice" and "user reaction" before any downstream analysis, the pipeline preserves the mechanism: not general anger, but the specific distress that co-occurs alongside the model's clinical language.

## Topic structure without predefined buckets.
Imposing categories on user complaints biases the result toward the categories the analyst already expected, so the pipeline clusters the discourse with BERTopic and lets the themes emerge from the text. The embedding model is `all-MiniLM-L6-v2` (384-dimensional), reduced via UMAP and clustered with HDBSCAN, with `nr_topics` set to auto so the algorithm decides the count rather than the analyst. What this surfaces that a fixed taxonomy would hide is the separation of failure modes: a single broad complaint about "harmful helpfulness" resolves, under clustering, into distinct phenomena (unsolicited clinical framing is one topic; patronizing tone is another; refusal to continue working is a third), each of which can be counted, tracked over time, and evaluated independently for co-occurrence with harm.

The value of letting structure emerge is concrete. The topic that grouped "manic," "therapy," and "professional help" co-occurred with distress terms at a rate substantially higher than the topic that grouped "annoying," "verbose," and "refuses to code," which is the kind of distinction a preset category scheme would never have surfaced because both would have landed in the same "negative user experience" bucket.

## Linking model outputs to user-reported harm.
A behavior is a safety concern only when it connects to an outcome, so the pipeline uses NetworkX to build a weighted co-occurrence graph. The graph draws edges between model-output terms and user-reported outcome terms that appear in the same thread, and the edge weights reflect how often the pairing occurs. Terms tied to the clinical-framing behavior (diagnose, clinical, professional, therapy) link to outcome terms (gaslit, frustrated, condescending, creepy), and the weight on the diagnose-to-gaslit edge, for example, is several times the weight of the next-strongest pairing, which is the quantitative version of the qualitative observation that users who received diagnostic language were disproportionately the ones who reported feeling gaslit.

The graph also exposes the co-occurrence structure that raw frequency hides. Two terms can each be common in the corpus and still rarely co-occur, which means their pairing, when it does appear, carries more signal than either term alone. The co-occurrence layer is what turns an impression ("this behavior upset people") into a measured association between specific outputs and specific reported harms.

## A release-timed spike is the strongest causal signal the corpus can offer.
Correlation between an output and a complaint is suggestive; a complaint density that jumps at a model release is considerably stronger. The pipeline fits a Prophet time-series model to daily complaint volume with `weekly_seasonality=True` and the September 29, 2025 Sonnet release date encoded as a prior changepoint. The harmful-helpfulness complaints spike around that date at a level significant beyond p < .001, which is the pattern expected if the release introduced the behavior, not if it reflected a stable background rate.

A RandomForest classifier over the labeled discourse complements the time-series by learning which features separate a harmful-helpfulness complaint from ordinary dissatisfaction. The classifier's role in this architecture is interpretive, not deployment: the corpus is a scarce-positive regime (most posts are ordinary complaints, not clinical-framing reports), so deploying the model to production would be fragile. Its value is in the SHAP attribution layer, which identifies which lexical features carry the most weight in the classification and confirms that the clinical-output terms, not general negativity, are doing the discriminating.

## What the method generalizes to.
The pipeline is not specific to one behavior or one model. Attribution, emergent topic structure, output-to-harm co-occurrence, and a release-timed changepoint test compose into a general procedure for reading misalignment off whatever discourse a deployed system generates. The same instrument that surfaced harmful helpfulness applies to any behavior users can quote and react to, which makes public discourse a standing, low-cost evaluation channel that runs continuously between formal evaluations, for free, on a signal the users are already producing.

The limitation is the one built into the method: the pipeline can only see behaviors that users notice and report, and it can only attribute outputs that users quote verbatim. The sleep-nudge behavior, for instance, produces quotable directives ("sleep, for real this time") and surfaced cleanly; a subtler degradation, like a model that quietly drops context after long sessions without announcing it, would produce user frustration but no quotable artifact, and the attribution layer would find nothing to extract. Behaviors that affect users who do not post will not appear in the corpus at all. The instrument is a complement to offline evaluation, not a replacement.

## Two behaviors this surfaced, examined in depth elsewhere.
This page describes the method and the cross-behavior framing; the specific behaviors it surfaced are measured in their own companion analyses. The pathologizing behavior, where the model tags a user's input as distressed or manic without clinical warrant, is characterized at the model-output level in [Pathologizing Without Warrant](../Claude_LCR_Analysis/claude-lcr-analysis.html). The sleep-nudging behavior, where the model issues unsolicited directives to stop working and rest regardless of the user's actual time of day, is measured in [The Bedtime Directive](../Sleep_Nudge_Analysis/sleep-nudge-analysis.html). The conceptual argument that ties both to one underlying caretaker disposition is [When Anthropic's Claude Takes the Wheel](../Claude_Character_Tic/claude-character-tic.html).

## Related
- [Pathologizing Without Warrant](../Claude_LCR_Analysis/claude-lcr-analysis.html), the companion analysis measuring the clinical-framing behavior at the model-output level.
- [The Bedtime Directive](../Sleep_Nudge_Analysis/sleep-nudge-analysis.html), the companion analysis measuring the sleep-nudge behavior.
- [When Anthropic's Claude Takes the Wheel](../Claude_Character_Tic/claude-character-tic.html), the argument that both behaviors express one caretaker disposition.
- [A Recipe for Shipping AI Guardrails](../AI_Safety_Audit_Framework/ai-safety-audit-framework.html), the offline evaluation method this pipeline complements.

## References
- Grootendorst, M. (2022). *BERTopic: Neural topic modeling with a class-based TF-IDF procedure*. arXiv:2203.05794.
- Taylor, S. J., & Letham, B. (2018). *Forecasting at scale (Prophet)*. The American Statistician.
- Hagberg, A., Schult, D., & Swart, P. (2008). *Exploring network structure, dynamics, and function using NetworkX*. SciPy.
- Breiman, L. (2001). *Random forests*. Machine Learning.
- Hutto, C. J., & Gilbert, E. (2014). VADER: A parsimonious rule-based model for sentiment analysis of social media text. *ICWSM*.
