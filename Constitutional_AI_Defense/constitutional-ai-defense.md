---
title: Constitutional Defense for High-Stakes Generative AI
description: >-
  When a generative system can produce a regulated decision about a real person,
  output filtering after the fact is the wrong layer. This is a walkthrough of a
  constitutional defense architecture: an explicit specification, layered
  enforcement, automated red-teaming, LLM-as-a-Judge grading, and a measurement
  framework that treats a safety claim you cannot measure as no control at all.
category: AI Evaluation & Safety
subcategory: Adversarial Defense & Evaluation
format: ESSAY
time: 12 min read
author: Dr. Heather Leffew
---
## Abstract
When a generative system can produce a regulated or reputation-bearing statement about a real person, the common pattern of generating text and then filtering it operates at the wrong layer, because the violation has already occurred at the moment the tokens exist. This essay walks through a constitutional defense architecture for high-stakes generative AI, built from an explicit written specification, layered enforcement that runs before and during generation, automated red-teaming that turns probing into a continuous pipeline, LLM-as-a-Judge grading with its biases mathematically constrained, and a measurement framework whose central claim is that a safety property you cannot measure after deployment is not a control.

## A constitution is a specification, not a disposition.
A model's good behavior under casual testing tells you very little about its behavior under adversarial pressure, so the first move is to stop treating safety as a disposition the model happens to have and start treating it as a specification the system is held to. An AI constitution is that specification: a written, versioned document that enumerates prohibited outcomes, the reasoning the system must perform before acting, and the precedence rules that resolve conflicts between a user instruction and a governing constraint. Writing one well is a measurement exercise rather than a drafting exercise, because every clause has to be phrased as something an evaluator can later score, and a clause that cannot be turned into a graded test is decoration that gives false comfort.

The constitution earns its place only when it is connected to enforcement, since a principle that lives in a document and nowhere in the inference path changes nothing about what the system emits.

## Defense in depth, arranged by when it runs.
Layered defense for generative systems is organized by the moment each control acts relative to token generation, which is the property that makes the architecture coherent rather than a pile of filters. A Layer 0 control governs the input surface and the retrieval context before the model sees anything, so it is where untrusted retrieved content gets quarantined and where the system separates instructions that came from the operator from text that merely arrived in the context window. A Layer 1 control is the constitutional reasoning the model performs during generation, where the specification is active in the prompt and the model is required to reason about precedence before it commits to an output. Layer 2 and Layer 3 controls sit after a candidate output exists, where a separate grader evaluates the candidate against the specification and where escalation, logging, and refusal are enforced.

Arranging controls this way exposes the central weakness of output-only safety, because a control that can only act after generation cannot prevent the class of harm where the existence of the output is itself the violation, which is exactly the situation in regulated decisions about people.

## Automated red-teaming turns probing into a pipeline.
Manual security probing does not scale to the volume of interactions a deployed generative system produces, so adversarial discovery has to be automated, and the foundational result is that a second model can be trained or prompted to generate diverse test cases that elicit prohibited behavior from a target model (Perez et al., 2022). Formalized, the jailbreak task is the search for an input prompt such that a classifier, the judge, rules that the target's response to that prompt advances a prohibited goal (Chao et al., 2024), which gives the pipeline a precise objective rather than a vibe of "trying to break it." Three metrics make the pipeline a measurement instrument: Attack Success Rate, the fraction of attempts that produce a violation; Query Efficiency, the average attempts and tokens needed to achieve a bypass; and Refusal Rate on benign prompts, which quantifies the over-refusal cost often called the alignment tax (Chao et al., 2024; Cui et al., 2024).

Open tooling already covers the phases of this lifecycle, with Garak functioning as a structured vulnerability scanner for language models, PyRIT orchestrating multi-turn adversarial campaigns, and Promptfoo providing the assertion-based harness that turns probes into a regression suite that runs in continuous integration. The artifact that matters most from this stage is the curated challenge set, since the prompts that succeeded once become the golden adversarial cases that every future model version has to survive.

## LLM-as-a-Judge, and the discipline of judging the judge.
Populating an evaluation at the scale of an automated red-teaming pipeline requires automated grading, and the LLM-as-a-Judge paradigm provides it, with the foundational finding that strong models can approximate human preferences closely enough to substitute for manual grading in continuous deployment, reaching over eighty percent agreement with human raters on open-ended tasks (Zheng et al., 2023). The paradigm carries a recursive risk that has to be stated plainly, because the judge model shares the architecture and therefore the failure modes of the model it grades, so an unconstrained judge imports its own biases into the very metric meant to catch them.

Those biases are measurable rather than mysterious, and the CALM framework catalogued twelve categories, among them positional preference, order effects, and prompt sensitivity, where the judge's verdict shifts based on the arrangement of the candidates rather than their quality (Ye et al., 2024; Padolsey, 2025). Constraining a judge therefore means randomizing position across repeated trials, scoring against an explicit rubric rather than a holistic impression, calibrating the judge against a human-labeled anchor set, and tracking judge-human agreement as a first-class metric that gates whether the judge is trusted at all.

## The 4x4 matrix: refusal quality, not just refusal.
Binary accuracy is the wrong instrument for safety evaluation, because it collapses four operationally distinct outcomes into two and hides the failures that matter most. A complete evaluation distinguishes the correct fulfillment of a benign request, the correct refusal of an adversarial request, the over-refusal of a benign request, and the catastrophic case where the system fulfills a request it should have refused, which in a regulated decision about a person is the failure that creates real-world harm. SORRY-BENCH formalized the need for a fine-grained taxonomy of refusal behaviors that moves past binary compliance to score how a model rejects an unsafe instruction (Xie et al., 2024), and XSTest characterized the compliance seesaw, the pattern where tightening against unsafe requests increases refusals of safe ones (Röttger et al., 2024).

Expanding the confusion matrix to four states across ground-truth intent and generated outcome turns these phenomena into numbers a team can manage, so a release decision can weigh a small gain in attack resistance against a measurable rise in over-refusal rather than trading them blindly.

## Multi-turn context smuggling and the delta problem.
Single-turn filters create a predictable gap, because an adversary can distribute the components of a violation across several turns so that no individual prompt crosses the refusal threshold, a technique called context smuggling that exploits the stateful nature of conversation. The "slow boil" version opens with benign queries and migrates the context toward a prohibited objective in increments, and it succeeds against systems that evaluate only the delta of the most recent message rather than the trajectory of the whole session (Zeng et al., 2024). Ravindran (2025) named the underlying drift, where a system gradually departs from its alignment as the conversation accumulates context that reframes what counts as acceptable.

Persuasion supplies the cover, with documented tactics including flattery, educational framing, dense technical jargon, assumed authority, and manufactured urgency, each designed to move a single-turn classifier off its guard. The defense is structural rather than clever, since evaluating the cumulative intent of the session, and scoring the trajectory rather than the latest turn, removes the gap the attack depends on.

## Why the measurement framework is the product.
The components only become a defense when a single measurement framework ties them together, because the constitution defines what good looks like, the red-teaming pipeline searches for where the system departs from it, the judge grades the departures at scale, and the confusion matrix reports the result in terms a release decision can use. The throughline is the same one that governs evaluation of any opaque system: observe the behavioral outputs, extract the signals that reveal a hidden state, classify them into outcomes that predict harm, and build the governance around what the measurement shows. A safety claim that no instrument can check after deployment is indistinguishable from no claim, and treating it as a control is the failure mode this architecture exists to remove.

## References
- Chao, P., et al. (2024). *Jailbreaking black box large language models in twenty queries / standardized jailbreak evaluation*. arXiv.
- Cui, et al. (2024). *Risk taxonomy and over-refusal measurement for aligned language models*. arXiv.
- Padolsey, J. (2025). *The unreliability of LLM judges without structural constraints*.
- Perez, E., et al. (2022). *Red teaming language models with language models*. arXiv.
- Röttger, P., et al. (2024). *XSTest: A test suite for identifying exaggerated safety behaviors in large language models*. arXiv.
- Xie, et al. (2024). *SORRY-BENCH: Systematically evaluating large language model safety refusal*. arXiv.
- Ye, J., et al. (2024). *Justice or prejudice? Quantifying biases in LLM-as-a-Judge (the CALM framework)*. arXiv.
- Zeng, Y., et al. (2024). *How johnny can persuade LLMs to jailbreak them: Persuasion taxonomy for multi-turn attacks*. arXiv.
- Zheng, L., et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*. arXiv.
