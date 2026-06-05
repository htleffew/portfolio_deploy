---
title: Multi-Signal Safety Detection at Platform Scale
description: >-
  Safety systems fail in two directions: missing real harm, and firing on
  behavior that resembles harm but is not. A single classifier cannot tell them
  apart. This is a corroboration architecture that runs concurrent signal
  streams and maps detection confidence to enforcement scope, so decisions are
  made with known precision rather than assumed precision.
category: AI Evaluation & Safety
subcategory: Detection & Trust and Safety
format: ESSAY
time: 10 min read
author: Dr. Heather Leffew
---
## Abstract
A safety detection system can fail by under-detection, letting real harm pass, and it can fail by over-detection, firing on behavior that resembles a harmful class at the surface while being something else, and the second failure is the one most systems do not measure. Distinguishing the two requires more than a single classifier, because the harmful pattern and its benign look-alike co-occur at the level of words and tone. This essay describes a multi-signal detection architecture that runs concurrent analysis streams, requires corroboration across them before enforcement, and maps detection confidence to enforcement scope so that every decision carries known precision and recall rather than assumed values.

## Two failure directions, and the one nobody counts.
The familiar failure of a safety system is under-detection, where harmful content passes unobstructed, and it is the failure that audits and red teams are built to find. The less-counted failure is over-detection of the wrong pattern, where a guardrail fires on behavior that resembles its target class but is not, and in doing so produces the harm it was meant to prevent. A model that answers a person's conversational distress with unsolicited therapeutic framing is an instance of the second failure, because the response pattern shares surface features with care while delivering an outcome the person did not ask for and did not benefit from.

## A single signal cannot carry an enforcement decision.
Driving detection from one signal guarantees a predictable error, since sentiment polarity alone misses posts that are neutral in tone while describing real harm, and lexicon co-occurrence alone flags posts that mention harm-adjacent terms without any harmful content. The architecture therefore runs concurrent analysis streams and requires agreement across them before it draws a conclusion, which is the structural property that prevents any one fragile signal from setting an enforcement outcome. Corroboration is the design principle, because the cases that matter are exactly the cases where one signal is confident and wrong.

## Four concurrent streams, scored for agreement.
The detection design runs multiple independent streams over the same content, combining sentiment and affect, lexical co-occurrence against curated harm-related and intervention-related vocabularies, structural and behavioral features, and network or relational signals where the data supports them. Each stream produces its own read, and the system scores the agreement among them rather than trusting a majority vote, so a detection is only as strong as the corroboration behind it. Building detection from independent streams also makes the system legible, since a flagged item arrives with the specific streams that agreed, which is what an enforcement reviewer needs to act with confidence.

## Map confidence to enforcement scope.
A detection score is only useful when it is connected to a decision, so the architecture uses a three-scenario decision frame that maps detection confidence to the scope of enforcement, reserving the heaviest actions for the highest-corroboration cases. Tying scope to confidence means a low-corroboration signal can inform a lightweight response while a high-corroboration signal supports a decisive one, and both decisions are made with measured precision rather than with an assumed threshold. The frame turns a detection score into a governance rule, which is the step that lets a system operate at scale without treating every flag as equally certain.

## A worked example, and where the method generalizes.
The method was exercised on a corpus of roughly a thousand public posts discussing a specific model's guardrail behavior, where a substantial share of posts expressing harm-related language also carried language associated with the model's helpfulness interventions, which indicated a systemic pattern rather than scattered incidents. Reading that co-occurrence is what surfaced the over-detection failure mode, since the model's well-intended intervention was itself the behavior the corpus was reacting to. The architecture generalizes wherever corroboration across signals and a confidence-to-enforcement mapping are needed at scale, because the throughline is the same one that governs the rest of this work: observe the behavioral and linguistic outputs, extract the implicit signals, require them to corroborate, and let measured confidence set the response.

## References
- Markov, T., et al. (2023). *A holistic approach to undesired content detection in the real world*. AAAI.
- Hutto, C., & Gilbert, E. (2014). *VADER: A parsimonious rule-based model for sentiment analysis of social media text*. ICWSM.
- Pennebaker, J. W., et al. (2015). *The development and psychometric properties of LIWC*. University of Texas at Austin.
