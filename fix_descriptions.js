/*
 * fix_descriptions.js
 * One-time cleanup: replaces the duplicated placeholder description
 * ("Interactive mathematical telemetry simulator and architectural case study.")
 * in master_index.json with real, source-grounded, company-free descriptions.
 *
 * Run natively from the repo:  node portfolio_deploy\fix_descriptions.js
 * Idempotent: only entries still carrying the placeholder are touched.
 */
const fs = require('fs');
const path = require('path');

const MASTER = path.join(__dirname, 'master_index.json');
const PLACEHOLDER = 'Interactive mathematical telemetry simulator and architectural case study.';

// Each rule: { id, t (title substring to disambiguate duplicate ids; "" = any), desc }
const RULES = [
  { id: 'Annotation_Workforce', t: '', desc: 'A comparative analysis of two strategies for standing up a data-annotation workforce, weighing a greenfield build against integration with an existing ecosystem platform.' },
  { id: 'Atlas', t: '', desc: 'A capability-organized inventory that maps a large portfolio of data-science deliverables to the business outcomes each one enables, used as the epistemic architecture for the function.' },
  { id: 'Autobiographical', t: '', desc: 'A structured account of trust-and-safety analytics work, organized around a modular text-analysis framework for moderation and operations.' },
  { id: 'Automated_Preemployment_Reports', t: '', desc: 'Automation of clinical-grade pre-employment psychological evaluation narratives, generating structured reports from standardized assessment inputs.' },
  { id: 'Building_Data_Products', t: '', desc: 'A case study in moving a data function from bespoke services to scalable, productized data offerings, and the revenue shift that followed.' },
  { id: 'Buyer_Intent', t: 'Imbalanced', desc: 'A study in imbalanced classification and confound detection for predicting B2B account conversion, where the positive class is rare and easily confounded.' },
  { id: 'Buyer_Intent', t: 'Case Study', desc: 'A worked case study predicting B2B buyer intent, framing account conversion as a supervised learning problem over behavioral signals.' },
  { id: 'Buyer_Intent', t: 'XGBoost', desc: 'A gradient-boosted model predicting B2B account conversion likelihood from large-scale behavioral data on a distributed query backend.' },
  { id: 'CASP', t: 'Domain Expertise', desc: 'A study quantifying how much domain expertise contributes to AI workflow quality, isolating the marginal value of specialist input.' },
  { id: 'CASP', t: 'AlphaFold', desc: 'An ablation study quantifying the marginal contribution of biology-focused work streams to protein-structure prediction performance.' },
  { id: 'Claude_Gaslighting', t: 'Claude Sonnet Analysis', desc: 'A discourse analysis of a frontier model’s shift toward unsolicited clinical framing across versions, measured from its own outputs.' },
  { id: 'Claude_Gaslighting', t: 'NLP Evaluation', desc: 'An NLP evaluation of AI safety guardrails, measuring how a model’s well-intended interventions can themselves produce user harm.' },
  { id: 'Credit_Fairness', t: '', desc: 'A fair-lending simulation that audits a credit-approval policy for disparate impact, with an explainability framework over each decision.' },
  { id: 'Dasher_Test_Simulation', t: 'Agent-Based', desc: 'An agent-based reinforcement-learning simulation of how gig workers adapt their behavior to different incentive structures and conditions.' },
  { id: 'Dasher_Test_Simulation', t: 'Worker Adaptation', desc: 'A simulation of gig-worker adaptation, modeling behavioral response to changing incentives and environmental factors.' },
  { id: 'Dimensionality_of_Psychopathy', t: '', desc: 'A clinical research argument for treating psychopathy as a dimensional construct, accounting for individual heterogeneity and prognostic variation.' },
  { id: 'Email_Personalization', t: '', desc: 'A pipeline for tailoring AI-generated outbound email to each recipient using behavioral and profile signals.' },
  { id: 'Evolutionary_Bases_of_Emotion', t: '', desc: 'Theoretical clinical research on the evolutionary foundations of emotional and cognitive processing.' },
  { id: 'False_Memories', t: '', desc: 'Clinical and theoretical research on false memories and the reconstructive nature of human recall.' },
  { id: 'Feature_Impact_Analysis', t: 'A/B', desc: 'An experimental-design walkthrough for measuring the impact of a product feature, covering A/B structure, metrics, and inference.' },
  { id: 'Feature_Impact_Analysis', t: 'Power', desc: 'A statistical power analysis for feature experiments, sizing tests to detect a meaningful effect with controlled error rates.' },
  { id: 'Financial_Data_Collection', t: '', desc: 'A data-collection protocol assembling question-answer pairs from SEC filings across graded complexity tiers for financial NLP.' },
  { id: 'Forevue', t: '', desc: 'A business and architecture plan for a behavioral-intelligence layer that surfaces risk patterns earlier in law-enforcement hiring.' },
  { id: 'Managing_Organizational_Transformation', t: '', desc: 'A case study in product-led organizational transformation, tracing how a data-product strategy drove outsized revenue growth.' },
  { id: 'MCA_Account_Analysis', t: '', desc: 'A multi-modal telemetry analysis of account behavior for early threat and risk detection.' },
  { id: 'Meta_Minor_Safety', t: '', desc: 'Multi-signal minor-safety detection that corroborates behavioral, network, and linguistic signals before enforcement, mapping detection confidence to the scope of action.' },
  { id: 'Payment_Retries', t: '', desc: 'A payment-retry optimization framework combining historical analysis, simulation, and production-ready fallback logic to recover failed transactions.' },
  { id: 'Phone_LTR', t: 'Ordinal', desc: 'An ordinal learning-to-rank approach to selecting the best contact phone number, treating reachability as a ranking rather than a binary label.' },
  { id: 'Phone_LTR', t: 'Reachability', desc: 'A psychometrics-informed framework for measuring contact reachability, ranking candidate phone numbers by likelihood of a successful connection.' },
  { id: 'Police_Hiring', t: '', desc: 'An adverse-impact audit of pre-employment psychological evaluation practices, testing for racially or ethnically disparate outcomes in hiring.' },
  { id: 'Post-Asimovian_Framework', t: '', desc: 'An alignment framework that decouples safety constraints from preference optimization and conditions constraint strength on a linguistic read of context, formalized as a constrained Markov decision process.' },
  { id: 'Proprietary_Talent_Intelligence', t: '', desc: 'A strategic recommendation to replace a third-party talent platform with a proprietary talent-intelligence system built on recommendation-system methods.' },
  { id: 'Social-Emotional_Islamist_Radicalization', t: '', desc: 'An analysis of the social-emotional and socialization dynamics that underlie radicalization, framed for policy application.' },
  { id: 'Spokeo_Agentic_Mesh', t: '', desc: 'An autonomous agentic-mesh architecture that replaces fixed multi-layer pipelines with cooperating agents for entity discovery and resolution.' },
  { id: 'Spokeo_Constitutional_AI', t: '', desc: 'A compliance architecture for high-stakes AI products that enforces constitutional constraints and measurement at the inference layer rather than through disclaimers.' },
  { id: 'Spokeo_ER_Persistence_vs_Retrieval_for_Resolution', t: '', desc: 'A technical and economic comparison of persistence-based and retrieval-based architectures for large-scale entity resolution.' },
  { id: 'Spokeo_Social_Identity_Layer', t: '', desc: 'An identity-attribute quality-scoring layer with exploratory analysis and batch constraints, built on a columnar compute environment over object storage.' },
  { id: 'Talent_Intelligence', t: 'Enterprise', desc: 'An enterprise talent-intelligence dashboard that synthesizes labor-market and skills signals into a single decision surface.' },
  { id: 'Talent_Intelligence', t: 'Synthetic', desc: 'A synthetic talent-pipeline case study, generating realistic candidate data to prototype talent-intelligence models without exposing real records.' },
  { id: 'Talent_Intelligence', t: 'Market', desc: 'A talent-market-intelligence analysis that turns external labor-market signals into hiring and workforce strategy.' },
  { id: 'Telecom_Chatbot', t: '', desc: 'An enterprise-scale design guide for a telecom support chatbot built on NLP and retrieval-augmented generation.' },
  { id: 'UX_Principles_LiveStreamed_Violence', t: '', desc: 'An analysis of UX and platform-design principles for preventing the livestreaming of mass-violence attacks.' },
];

const data = JSON.parse(fs.readFileSync(MASTER, 'utf8'));
const usedRule = new Array(RULES.length).fill(false);
let updated = 0;
const unmatched = [];

data.forEach(entry => {
  if ((entry.desc || '').trim() !== PLACEHOLDER) return;
  const title = entry.title || '';
  let ruleIdx = RULES.findIndex((r, i) =>
    !usedRule[i] && r.id === entry.id && (r.t === '' || title.includes(r.t)));
  if (ruleIdx === -1) {
    ruleIdx = RULES.findIndex((r, i) => !usedRule[i] && r.id === entry.id);
  }
  if (ruleIdx === -1) {
    unmatched.push(`${entry.id} | ${title}`);
    return;
  }
  entry.desc = RULES[ruleIdx].desc;
  usedRule[ruleIdx] = true;
  updated++;
});

fs.writeFileSync(MASTER, JSON.stringify(data, null, 4) + '\n', 'utf8');
console.log(`[FIX] Updated ${updated} placeholder descriptions in master_index.json.`);
if (unmatched.length) {
  console.log(`[FIX] ${unmatched.length} placeholder entries had no rule:`);
  unmatched.forEach(u => console.log('   - ' + u));
} else {
  console.log('[FIX] All placeholder descriptions were replaced.');
}
