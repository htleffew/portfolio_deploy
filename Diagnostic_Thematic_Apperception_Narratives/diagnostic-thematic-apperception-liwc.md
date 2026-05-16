---
title: "LIWC and the TAT."
description: "A Fielding Graduate University paper makes the case that Linguistic Inquiry and Word Count belongs in Thematic Appercept..."
category: "Psycholinguistic Measurement"
subcategory: "Misc"
format: "CASE STUDY"
time: "5 min read"
scripts: ["interactive_0.js", "interactive_1.js"]
---
# LIWC and the TAT.

Dr. Heather Leffew
Obelus Institute
May 2026
---

## Abstract
A Fielding Graduate University paper makes the case that Linguistic Inquiry and Word Count belongs in Thematic Apperception Test interpretation. An accompanying pipeline scores 677 card responses from 69 participants across 31 TAT cards and tests whether specific cards reliably pull for the themes they were designed to elicit. Together they sketch a path toward continuous, item-level TAT scoring.

01 / The Case

## What words give away that stories cannot.

The Thematic Apperception Test asks a respondent to look at an ambiguous picture and tell a story about it1**Morgan & Murray (1935).** A method for investigating fantasies: The Thematic Apperception Test. *Archives of Neurology & Psychiatry, 34*, 289-306. The projective hypothesis: ambiguous stimuli are perceived and organized according to the respondent's needs, motives, and feelings (Teglasi, 2010).. Traditional interpretation treats those stories as content. A clinician reads the narrative for themes, conflicts, object relations, and the rest. Inter-rater variability has been the recurring weakness of the method since Murray first published it in 1935.

Tausczik and Pennebaker (2010) make a distinction worth bringing into projective assessment. Content words carry the "what" of a message. Function words2**Tausczik & Pennebaker (2010).** The psychological meaning of words: LIWC and computerized text analysis methods. *Journal of Language and Social Psychology, 29*(1), 24-54. Function words are pronouns, prepositions, articles, conjunctions, and auxiliary verbs - the structural scaffolding of a sentence. carry the "how." Pronouns, prepositions, articles, conjunctions, auxiliary verbs. These are largely outside conscious management. A respondent can suppress mention of family or money. They cannot easily suppress how often they reach for the word "I."

LIWC2015 is a deterministic dictionary parser. It scores a text against roughly ninety psychometrically anchored categories: pronoun families, affect categories, social processes, cognitive processes, drives, personal concerns. Pairing it with the TAT does not replace the clinician. It adds a second channel of evidence, one that responds to the parts of language the respondent is not watching.

02 / The Dataset

## Six hundred seventy-seven narratives, split four ways.

The corpus is built from a TAT administration to 69 participants covering 31 card types. Each narrative was cleaned to strip assessor prompts and behavioral observations, then split so the same dataset can be queried at four different grains: each individual response to each individual card, each individual's full protocol, all responses to a single card, and the whole corpus as a single document. LIWC-published base rates for blogs, expressive writing, novels, and other text genres sit alongside the TAT data so any finding can be sanity-checked against an external reference.

Card responses

677

Independent card-level narratives from 69 participants, after cleaning and exclusion of mislabeled records.

Cards represented

31

Frequencies range from 60 (Card 2) down to 2 (Card 13G); card-level analysis is limited to the higher-frequency cards.

LIWC2015 features

~90

Pronoun families, affect categories, social processes, cognitive processes, drives, personal concerns, temporal focus.

Card-level analysis privileges the cards that produced enough narratives to support inference. The dataset assigns five mutually exclusive types to each row (INDVNARR, INDVCARDALLRESP, INDVRESPALLCARDS, WHOLECORPORA, BASERATE), so the same LIWC variable can be examined at whichever grain the question requires.

03 / The Finding

## Cards pull for the themes they were designed to elicit.

A MANOVA across Cards 1, 2, 3BM, 4, and 8BM (the five highest-frequency cards) tests whether LIWC variables differ by card. They do, with significance on every emotion, social, drive, and personal concern category examined. The signature each card produces lines up with what the test's clinical literature claims it elicits.

Card 1 (boy with violin) pulls 1.88x the corpus baseline for achievement language. Card 2 (farm scene) pulls 1.80x for family and 2.55x for work. Card 3BM (huddled figure) pulls 4.74x for sadness and 2.17x for anxiety. Card 4 (woman restraining a man) pulls 3.38x for anger. Card 8BM (surgical scene) pulls 4.57x for death language. Every contrast across cards reaches p < .05; most reach p < .001.

LIWC Means by Card, normalized to per-axis max

Card 1 / Achievement
Card 3BM / Sadness
Card 8BM / Death

![Figure 2](fig_2.svg)

FIG. 01   Six LIWC axes per card: anxiety, anger, sadness, achievement drive, power drive, death. Values are mean LIWC scores from the MANOVA, normalized to the per-axis maximum across the five compared cards.

04 / Style Words

## Pronouns and negation as clinical signal.

Function-word patterns map onto clinical states with surprising consistency. Depressed and suicidal individuals use more first-person singular pronouns, more death-related words, and more negatively valenced language (Bernard et al., 2016). Grief over a romantic loss raises first-person singular and lowers causal words (Boals & Klein, 2005). High rates of negation track with the self-aggression associated with suicidality and substance dependence (Hargitai et al., 2007). The interpretation has to be careful: high first-person singular can mark pain, pathological egocentrism, or simple self-awareness depending on what else is going on in the language.

Psychotic speech leaves a different signature. The open-narrative format of the TAT lets neologisms, tangentiality, and the kind of temporal-proximity word linkage central to the Cloze procedure (Salzinger et al., 1964) surface in a way structured tests cannot capture. Pairing LIWC with TAT narratives helps separate disordered thought form from disordered thought content - a distinction that drives both conceptualization and intervention (Langdon, Coltheart, Ward, & Catts, 2002).

Trait measurement also benefits. Linguistic analysis of narratives can differentiate person-oriented from thing-oriented respondents (McIntyre & Graziano, 2016), and latent semantic analysis recovers Big Five traits from natural speech (Kwantes et al., 2016). For cognitive functioning, the linguistic content of TAT narratives discriminates participants with agenesis of the corpus callosum from age- and intelligence-matched controls (Turk, Brown, Symington, & Paul, 2010), pointing to a use case beyond the affective domain.

05 / Future Direction

## Toward continuous item-level TAT scoring.

The card-level effects in section 03 suggest a way to put more structure on TAT interpretation. If each card pulls reliably for a known set of LIWC variables, then those variables can function as the card's measurement axes. A respondent's score on each axis can be compared against a card-specific norm metric rather than a global one. Is this person's response to Card 3BM unusually sad compared to other people's responses to Card 3BM? Does the same elevation show up across their full protocol? Does it line up with a current or historical diagnosis?

The framing is closer to continuous manifest-variable item response than to traditional projective scoring. Each card is treated as its own measure with its own threshold; the whole protocol is treated as a larger measure built from those item-level scores. The clinician stays in the loop, since LIWC cannot read irony, idiom, or the contextual oddness of a narrative that earns clinical attention through its strangeness rather than its frequency counts. But the diagnostic pathway gains a quantitative spine the TAT has not historically had.

06 / Bibliography

## References

* Aronow, E., Weiss, K. A., & Reznikoff, M. (2001). *A practical guide to the Thematic Apperception Test: The TAT in clinical practice*. Routledge.
* Bernard, J. D., Baddeley, J. L., Rodriguez, B. F., & Burke, P. A. (2016). Depression, language, and affect: An examination of the influence of baseline depression and affect induction on language. *Journal of Language and Social Psychology, 35*(3), 317-326.
* Boals, A., & Klein, K. (2005). Word use in emotional narratives about failed romantic relationships and subsequent mental health. *Journal of Language and Social Psychology, 24*(3), 252-268.
* Cohen, A. S., Minor, K. S., Baillie, L. E., & Dahir, A. M. (2007). Clarifying the linguistic signature: Measuring personality from natural speech. *Journal of Personality Assessment, 90*(6), 559-563.
* Gruber, N., & Kreuzpointner, L. (2013). Measuring the reliability of picture story exercises like the TAT. *PLoS One, 8*(11), e79450.
* Hargitai, R., Naszódi, M., Kis, B., Nagy, L., Bóna, A., & László, J. (2007). Linguistic markers of depressive dynamics in self-narratives: Negation and self-reference. *Empirical Text and Culture Research, 3*, 26-38.
* He, Q., Veldkamp, B. P., Glas, C. A., & de Vries, T. (2015). Automated assessment of patients' self-narratives for posttraumatic stress disorder screening using natural language processing and text mining. *Assessment*, 1-16.
* Kuperberg, G. R. (2010). Language in schizophrenia part 1: An introduction. *Language and Linguistics Compass, 4*(8), 576-589.
* Kwantes, P. J., Derbentseva, N., Lam, Q., Vartanian, O., & Marmurek, H. H. (2016). Assessing the Big Five personality traits with latent semantic analysis. *Personality and Individual Differences, 102*, 229-233.
* Langdon, R., Coltheart, M., Ward, P. B., & Catts, S. V. (2002). Disturbed communication in schizophrenia: The role of poor pragmatics and poor mind-reading. *Psychological Medicine, 32*, 1273-1284.
* Leffew, H. (2017). *Interpretation of the Thematic Apperception Test: A case for the inclusion of linguistic analysis*. Fielding Graduate University.
* Marini, A., Spoletini, I., Rubino, I. A., Ciuffa, M., Bria, P., Martinotti, G., ... Spalletta, G. (2008). The language of schizophrenia: An analysis of micro and macrolinguistic abilities and their neuropsychological correlates. *Schizophrenia Research, 105*(1-3), 144-155.
* McIntyre, M. M., & Graziano, W. G. (2016). Seeing people, seeing things: Individual differences in selective attention. *Personality and Social Psychology Bulletin, 42*(9), 1258-1271.
* Morgan, C. D., & Murray, H. A. (1935). A method for investigating fantasies: The Thematic Apperception Test. *Archives of Neurology & Psychiatry, 34*, 289-306.
* Pennebaker, J. W., Booth, R. J., Boyd, R. L., & Francis, M. E. (2015). *Linguistic Inquiry and Word Count: LIWC2015*. Pennebaker Conglomerates.
* Pennebaker, J. W., & King, L. A. (1999). Linguistic styles: Language use as an individual difference. *Journal of Personality and Social Psychology, 77*(6), 1296-1312.
* Salzinger, K., Portnoy, S., & Feldman, R. S. (1964). Verbal behavior of schizophrenic and normal subjects. *Annals of the New York Academy of Sciences, 105*, 845-860.
* Seih, Y. T., Beier, S., & Pennebaker, J. W. (2016). Development and examination of the linguistic category model in a computerized text analysis method. *Journal of Language and Social Psychology*, 1-13.
* Semin, G. R., & Fiedler, K. (1988). The cognitive functions of linguistic categories in describing persons: Social cognition and language. *Journal of Personality and Social Psychology, 54*, 558-568.
* Tausczik, Y. R., & Pennebaker, J. W. (2010). The psychological meaning of words: LIWC and computerized text analysis methods. *Journal of Language and Social Psychology, 29*(1), 24-54.
* Teglasi, H. (2010). *Essentials of TAT and other storytelling assessments* (2nd ed.). John Wiley & Sons.
* Turk, A. A., Brown, W. S., Symington, M., & Paul, L. K. (2010). Social narratives in agenesis of the corpus callosum: Linguistic analysis of the Thematic Apperception Test. *Neuropsychologia, 48*(1), 43-50.
* Winter, D. G. (1998). "Toward a science of personality psychology": David McClelland's development of empirically derived TAT measures. *History of Psychology, 1*(2), 130-153.
