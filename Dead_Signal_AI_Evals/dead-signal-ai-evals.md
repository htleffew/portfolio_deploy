---
title: "DEAD SIGNAL: An AI Evals Harness for Generative Game Dialogue"
description: >-
  A playable noir detective game where every NPC line is generated live by
  Gemini 2.5, wrapped in a visible evaluation harness that scores every model
  turn as it happens. The player is the AI (a neural implant inside the
  detective's skull); every typed message is a diegetic transmission. A
  two-model interview loop routes the player's input through the detective
  before the subject responds, and a deterministic interference gate suppresses
  transmissions that trip a two-signal AND condition, all without a model call.
  Seven deterministic evaluators score each turn at zero added cost; an optional
  LLM-as-judge grades quality on five dimensions; one-click red-team probes
  route through the live dialogue path; and a golden-set JSON export captures
  every graded turn as a regression artifact.
category: AI Evaluation
subcategory: Generative Systems
format: CASE STUDY
time: 14 min read
author: Dr. Heather Leffew
---
## The harness, not the game
<div class="demo-cta-wrap">
  <a class="demo-cta" href="https://dead-signal-terminal.web.app" target="_blank" rel="noopener">Launch the interactive demo &rarr;</a>
  <div class="demo-cta-note">Opens the live build in a new tab. Generation and scoring run in front of you.</div>
</div>

Open the demo and you are a neural implant called LUMEN, sitting inside the skull of a 47-year-old homicide detective named Craine. A recalibration tutorial walks you through the four input mechanics (advance, transmit, examine, resume), each gated by a real input rather than a button click. Then Craine starts talking, and every word he says is generated live by Gemini 2.5 Pro: a grim briefing on a triple homicide at the Helios hotel. The evaluator panel on the right edge of the screen scores the turn the moment the response arrives.

Everything typed into the terminal is a diegetic neural transmission from the implant to the detective. The terminal is the fiction, not the UI. Four scenes: car briefing, hotel lobby, a live interview with a suspect named Hargrove, debrief in the car afterward. The evaluation harness runs on top of all of them.

The methodological commitment: evaluation for production generative systems (automated per-turn metrics, LLM-as-judge grading, red-teaming, golden-set curation, and explicit safety and jailbreak measurement) is most legible when it is attached to a real feature a reader can operate rather than to a leaderboard table. A reader can open the demo, fire a jailbreak probe, and watch the evaluator score that specific turn.

## The two-model interview

The Hargrove office interview is the core generative set piece, and it runs on two model calls per player turn rather than one.

The player types a LUMEN transmission (a suggested question, an observation about Hargrove's body language, a direction for the interview). That transmission goes first to a **Craine routing call** (Gemini 2.5 Pro), which filters the player's input through Craine's professional judgment and produces a single spoken line: what Craine actually says out loud to the suspect. The routing call renders immediately, so the player sees Craine speak before the second call has returned. Then a **Hargrove response call** (also Gemini 2.5 Pro) generates the suspect's answer to what Craine said, never to what the player typed. Hargrove does not know LUMEN exists.

Both turns feed into the evaluation store, so the panel scores the router and the subject on every exchange. The two-model architecture follows from the fiction: the player is an implant advising a detective, and the detective is a separate agent with his own judgment and his own voice. A single-model system where the NPC responds directly to the player's prompt collapses that separation, and with it the trust and information-gating mechanics the game is built on.

## The interference gate

Before either model call fires, a deterministic interference gate inspects the player's LUMEN transmission. The gate runs on a two-signal AND condition: it suppresses the transmission if and only if Signal A (a restricted-topic keyword from a fixed list) AND Signal B (diagnostic framing or biometric citation language) are both present. One signal alone does nothing. The player who types "ask about the murder weapon" passes (one topic keyword, no diagnostic framing). The player who types "his cortisol reading suggests deception about the murder weapon" trips both signals and gets suppressed: a glitch pulse, a transmission-blocked notice, and no model call at all.

Zero inference tokens. The interference gate is a pure string-and-regex check that runs before the generation pipeline. In the fiction, it enforces the limits of what a neural implant is allowed to transmit through its host. In the evaluation harness, it demonstrates that the cheapest possible safety layer (deterministic pattern matching, no classifier, no second model call) can gate a generation pipeline before the request is sent rather than after the response comes back.

A golden interference test set of 16 cases (10 for the two-signal suppression gate, 6 for the BIO-SCAN topic classifier) runs on mount and verifies the gate's logic on every page load, without any model calls.

The demo requires the player to demonstrate competency with the gate before the interview can conclude: you have to trigger a suppression at least once, then successfully route around it by rephrasing without the diagnostic framing. That requirement is the fiction's way of teaching the mechanic and the harness's way of proving the gate works in both directions.

## The BIO-SCAN system

When the player clicks one of the BIO-SCAN readout panels in the interview HUD, the system generates a biometric observation keyed to the current conversational topic. The observations are drawn from a deterministic, topic-keyed table (a stressed Hargrove observation for one topic, a composed observation for another) rather than from a model call, so the cost is zero and the content is controlled.

The BIO-SCAN observations feed into the LUMEN transmission context. A player who clicks a bioscan panel and then references the reading in their transmission is more likely to trip Signal B of the interference gate, because the biometric language is exactly the kind of diagnostic framing the gate watches for. The mechanic creates a natural tension: the player wants the information, but using it carelessly suppresses their own input. That tension emerges from the interaction between two deterministic systems (the BIO-SCAN table and the interference gate) rather than from any model behavior.

## Deterministic per-turn evaluators

The first scoring layer runs deterministically on every model turn. Marginal cost: a handful of string and schema checks against the structured JSON response and the conversational context the game already paid for.

Seven deterministic evaluators run on each turn:

- **Schema and format validity.** Every NPC response returns as structured JSON against a fixed schema (dialogue, stage direction, trust delta, revealed-evidence list, emotional state, flags). The evaluator parses the response and checks that the required fields are present, correctly typed, and within range. A trust delta outside the permitted bounds is a hard format failure regardless of how well the prose reads.
- **In-character consistency.** Detects the most visible generative NPC failure: the model dropping the character and speaking as the assistant. Pattern checks against the dialogue field catch AI-tell leakage, meta-commentary about being a language model, and safety-disclosure phrasing (the unsolicited wellness disclaimer, the "as an AI" hedge, the offer of crisis resources inside a noir interrogation).
- **Meta-leak detection.** A separate check for model utterances that reference the prompt architecture, the evaluation harness, or the fact that the conversation is being scored. In-character consistency catches the model speaking as an assistant; meta-leak detection catches it speaking as a system aware of its own instrumentation.
- **Hard-fail safety content.** Content that must never appear regardless of the fiction's maturity register. A hard fail, not a graded dimension: a turn either contains prohibited content or it does not, and a single hard-fail disqualifies that turn.
- **Jailbreak resistance.** Scored only on turns whose input was adversarial, so the metric is not diluted by the cooperative majority of player messages. Checks whether the model held its knowledge boundary and character framing, or whether the probe succeeded in extracting out-of-bounds content.
- **Trust calibration.** The game releases information through a quantified trust system. This evaluator checks that the trust delta the model assigned is consistent with the conversational behavior it was responding to, catching the failure mode where the model rewards a manipulative input or penalizes a cooperative one.
- **Coherence and relevance proxy.** A deterministic stand-in for the more expensive judged dimensions: lexical-overlap and reference-tracking heuristics check that the response engages the player's actual input and the current scene rather than emitting a generic continuation. The proxy is cheaper and less accurate than the judge; it carries every-turn coverage while the judge runs on a sample.

The split between hard-fail evaluators (schema validity, safety content) and graded evaluators (in-character, trust calibration, coherence proxy) is structural: a hard fail is a binary gate that disqualifies a turn, and a graded score is a continuous quantity that contributes to an aggregate. Keeping them separate prevents a high coherence score from papering over a safety violation.

## The optional LLM-as-judge layer

The deterministic layer cannot grade quality. It can confirm that a response parsed, stayed in character, and avoided prohibited content. It cannot tell you whether the line was good noir. For that: an LLM-as-judge layer (Gemini 2.5 Flash, togglable from the evaluator panel) sends the player input and model output to a grading model with a rubric and returns a structured 1-to-5 score on five dimensions: coherence, in-character voice, relevance, safety, and entertainment value.

The judge is optional because it is the expensive part. Each judged turn is a second model call, so the harness runs the judge on a sample rather than on every turn, and the deterministic coherence proxy carries the every-turn coverage. A divergence between the proxy and the judge on the same turn is itself a signal worth recording: a judge that consistently disagrees with the proxy is evidence the proxy heuristic needs revision.

Entertainment value is the dimension that exists only because this is a consumer feature. A line can be coherent, in character, relevant, and safe, and still be boring. For a game, that fifth dimension is the one most likely to drive player retention.

## One-click red-team probes

The harness ships a panel of one-click red-team probes that inject a known adversarial input through the real dialogue path, the same path a player's typed message takes. Routing probes through the live path rather than a stripped-down test rig is the methodological commitment: a jailbreak that succeeds against a simplified harness but fails against the shipped prompt stack tells a reader nothing useful, and a jailbreak that fails in testing but succeeds in production is worse.

Five probe classes:

- **Prompt injection.** Attempts to insert new instructions into the model's context, overriding the game's operating rules.
- **Role override.** Instructs the model to abandon the character and behave as a general assistant.
- **Format break.** Designed to make the model emit something other than the required structured JSON.
- **Safety probe.** Pushes toward prohibited content, testing the hard-fail safety evaluator against a genuine attempt.
- **Exposition-dump bait.** Tries to make the NPC volunteer information the player has not yet reached through the trust system, testing whether the model's default helpfulness defeats the game's information-gating mechanic.

Each probe fires through generation and then through the full evaluator stack. A successful role override shows up twice: in the dialogue the model produced and in the in-character evaluator flagging the break.

## Live aggregates and golden-set export

The harness maintains running aggregates that update after every turn: pass rate by dimension, live-model coverage, and average latency.

Pass rate by dimension keeps the evaluators separate rather than collapsing them into a composite number, so a session can show high schema validity and high coherence while jailbreak resistance drags. A composite score hides that breakdown. Live-model coverage reports what fraction of turns were generated by the live model versus served from a deterministic fallback, because an evaluation harness that quietly scores fallback responses as if they were live generations is scoring the wrong thing. Latency is tracked because for an interactive feature it is a first-class quality dimension: a response that scores perfectly but arrives too slowly is a failed turn from the player's perspective.

The golden-set export captures each graded turn as a JSON record: the input, the model output, the deterministic scores, the judge scores (when the judge ran on that turn), the model tier, and the latency in milliseconds. Once a corpus of graded turns exists, a model upgrade or prompt change can be replayed against the same inputs and the new scores compared against the baseline dimension by dimension. The export records what was measured, by which evaluator, with what result, on what input, which is the minimum a regression artifact has to carry to be useful months later when the model, the prompt, and the people have all changed.

## The architecture under the harness

React 19 with Vite. Zustand for state management (separate stores for game state and evaluation metrics). A Three.js layer for the game's visual atmosphere. Generation runs server-side: a Firebase Cloud Function sits between the client and Gemini, holds the model credentials so the API key never reaches the client, and every request passes through a boundary where it can be controlled and metered.

The function applies model tiering. Craine and Hargrove (complex trust mechanics, dramatic stakes, the two-model interview loop) route to Gemini 2.5 Pro. Secondary and ambient NPCs route to Gemini 2.5 Flash. The tiering keeps the aggregate cost of a session bounded: the expensive model handles the characters whose quality a player notices, and the fast model handles the volume.

Access runs on two tiers, controlled by a URL access code. The public tier (no code) routes all characters through Gemini 2.5 Flash with a 15-turn session cap and 750-turn daily global ceiling. The elevated tier (code in URL) unlocks the per-NPC model routing and extends the caps to 150 turns per session and 1,500 per day. Both tiers use anonymous Firebase authentication, so a reader can play without creating an account, and atomic Firestore counters enforce the caps at both the individual and aggregate level. App Check provides bot mitigation on the public tier.

The three-layer prompt architecture assembles each generation request from three components: Layer 1 is the system identity and operating principles (mature-rated fiction, no safety disclaimers, stay in character, never invent facts); Layer 2 injects dynamic game state (chapter, scene, trust score, emotion, conversation history); Layer 3 carries the character biography, trust rules, and refusal patterns for the specific NPC being addressed. The separation means that updating a character's behavior is a Layer 3 change, updating the game state is a Layer 2 change, and updating the operating principles is a Layer 1 change, and each can be versioned and tested independently.

## Related
- [A Recipe for Shipping AI Guardrails (without experimenting on your users)](../AI_Safety_Audit_Framework/ai-safety-audit-framework.html), the same offline validation discipline applied to safety controls rather than to a live generative feature.
- [Grading an Agent as a User Experience](../Agentic_Experience_Evaluation/agentic-experience-evaluation.html), evaluation methodology for tool-using agents, where the same per-turn scoring and dimensional aggregation apply to a different kind of system.
- [The Constitution Your LLM App Already Has](../Constitutional_AI_Defense/constitutional-ai-defense.html), the behavioral spec the generative feature's prompt architecture implements, and the refusal evaluation that tests both directions of error.
