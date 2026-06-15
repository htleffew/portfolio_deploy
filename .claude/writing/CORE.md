# CORE — universal prose rules

These rules apply to **every** surface: portfolio pages, Medium essays, and formal
research writing. A profile may add rules; it may never relax a CORE rule. The
mechanical rules below are the ones `tools/style_gate.py` and `tools/writing-lint.sh`
enforce from `tools/banned_terms.txt`.

> Revised 2026-06 from a ground-truth voice study of the author's own academic and
> Medium writing (see the writing-standards repo `voice-analysis/00-SYNTHESIS.md`).
> This is a minimal correctness pass that aligns the rules with what is actually
> enforced and shipped; the full soul-first rewrite is a separate, planned task.

## 1. Punctuation

- **No em-dashes (—) or en-dashes (–) anywhere.** Use commas, semicolons, or
  parentheticals. Hyphens are allowed only in compound modifiers and numeric ranges.
- **Colons only before a list.** A colon may only introduce a true bulleted or
  numbered list. Recast every other prose colon (period, semicolon, comma, or
  parentheses). The semicolon is the house clause-joiner.
- No exclamation points in professional copy.
- Trust standard sentence punctuation; do not stack parentheticals to dodge the
  em-dash rule.

## 2. Banned vocabulary

Do not use the ornamental/hype cluster (enforced, case-insensitive, see
`tools/banned_terms.txt`):

tapestry, resonate, resonates, commendably, testament, intricate, symphony,
mosaic, cornerstone, bedrock, seamless, seamlessly, gamify, gamified, gamification,
synergy, synergize, synergistic, next-gen, nextgen, revolutionary, disruptive,
disruption.

Released (the author uses these literally; do not flag): delve, underscore,
paradigm, multifaceted, transformative, pivotal, leverage, navigate, unlock,
robust, crucial.

## 3. Sentence construction

- **Antithesis is allowed and characteristic.** "Not X but Y" and "not only X but
  also Y" carry real contrast and are a signature move. Avoid only the hollow,
  contentless version used as filler emphasis.
- **Do not open sentences with** And, But, or a bare This. Connective openers
  (However, Further, Additionally, Though, Despite, Conversely) are allowed.
- No canned significance markers: "this demonstrates", "this proves", "this shows",
  "this is significant because", "clearly", "it is worth noting that". An earned
  verdict stated flat after the evidence is fine; a marker standing in for evidence
  is not.
- Avoid "rather than" as filler contrast.

## 4. Posture

- **Trust the reader.** Subtle delivery, no rhetorical hammers, no manufactured
  drama, no puffery ("comprehensive analysis demonstrates").
- **Concrete over abstract.** A claim earns its place with a specific number,
  mechanism, or named instance, not with intensity. If a sentence could sit in any
  document on the topic, it is too abstract.
- **Functional analogy only.** An image must explain a mechanism; no ornamental
  metaphor reaches. Name the mechanism precisely.
- **Asymmetric modality.** Hedge others' claims; state your own verdict flat.

## 5. The one principle

Authenticity tracks concrete evidence and an owned verdict, expressible in any
person. Prose reads as Heather when it reports what she found and decided; it reads
as a model when it describes the idea of the work in the abstract. Every profile
rule below CORE is downstream of this.

## Provenance

CORE consolidates the rules previously duplicated in: portfolio `VOICE.md` §6–§7,
`_voice_audit/voice-spec.md`, LaTeX `outline_lcr_preprint.md` §2, and the
`dead-signal` `style_gate.py` banned-token regex. Those files are being converted to
pointers to this one (see `ROLLOUT.md`).
