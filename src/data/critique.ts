/** Novelty claims, open questions and limitations. */

export const noveltyClaims = [
  {
    n: 1,
    claim: 'A multi-agent division of labour for whole-SoC generation',
    plain:
      'Most prior LLM-for-hardware work generates a module. GenSoC assigns three agents to three different jobs — library curation, integration, verification — and has them pass artifacts along a chain.',
    context:
      'The paper positions this against ChipGPT, ChipNemo, VerilogCoder and RTLSquad, and states that validation of LLMs’ capacity for SoC generation is notably lacking in current research.',
  },
  {
    n: 2,
    claim: 'A multi-level description method for open-source IP',
    plain:
      'Each IP is abstracted into a tree — IP level, module level, code level — so an agent can reason at whichever altitude the current question needs.',
    context: 'Listed as an explicit contribution in Section I.',
  },
  {
    n: 3,
    claim: 'Natural-language-driven IP selection with explicit constraint reasoning',
    plain:
      'The user writes a sentence; the agent produces a reasoning table that eliminates candidates on hard constraints and grades the rest on soft ones.',
    context:
      'Table II contrasts this interaction mode with Chisel (Chipyard), Python (LiteX) and a GUI (ESP).',
  },
  {
    n: 4,
    claim: 'Protocol-driven integration',
    plain:
      'Rather than asking a model to "connect these blocks", the integrator first extracts structured protocol knowledge — signal tables, FSM transition tables, signal dependencies — and integrates against that.',
    context: 'Listed as an explicit contribution in Section I; detailed in Section IV-B.',
  },
  {
    n: 5,
    claim: 'Adapter generation as a fallback, not a default',
    plain:
      'Configurable adapters are reused where one fits. New adapter code is written only when no suitable adapter exists.',
    context: 'Section III and Section IV-B.',
  },
  {
    n: 6,
    claim: 'State-machine signal comparison for verification',
    plain:
      'The novel bit of the verification story. Simulation is reduced to a structured debug file, which is then compared against the protocol FSM and timing rules — so the model is checking a table against a table, not reading a waveform.',
    context:
      'Motivated by the observation that LLMs excel at code logic but have limitations in managing state-machine signal triggers. Section IV-C, Fig. 5.',
  },
  {
    n: 7,
    claim: 'Demonstration on two full heterogeneous SoCs through place and route',
    plain:
      'Both cases were carried through to physical layout in a commercial 22 nm process, giving real post-P&R power, area and frequency rather than RTL-only estimates.',
    context: 'Section V, Table III, Fig. 6.',
  },
];

export type Limitation = {
  id: string;
  title: string;
  question: string;
  finding: string;
  verdict: 'not-specified' | 'inference' | 'paper';
};

export const limitations: Limitation[] = [
  {
    id: 'commercial-tools',
    title: 'The evaluation depends on commercial tools',
    question: 'Could a reader outside a well-funded institution reproduce these numbers?',
    finding:
      'Synopsys VCS, Cadence Genus, Cadence Innovus, a commercial SRAM compiler and the TSMC 22 nm PDK are all licensed products under NDA. The functional-verification loop could in principle be re-created with open simulators, but the post-P&R power, area and frequency figures in Table III cannot be reproduced without the same commercial flow and the same PDK.',
    verdict: 'paper',
  },
  {
    id: 'library-release',
    title: 'Availability of the refined IP library',
    question: 'Is the complete, refined 90+ IP library publicly released?',
    finding:
      'Not specified in the paper. The paper describes how the library was constructed and shows representative entries in Table I, but states no release, licence or repository for the refined collection. Since the refined library is the foundation resource the whole method depends on, this materially limits reproducibility.',
    verdict: 'not-specified',
  },
  {
    id: 'prompts',
    title: 'Agent configuration and prompts',
    question: 'Are the guidelines, prompts, tool scripts and MetaGPT configuration published?',
    finding:
      'Not specified in the paper. Section III states that pre-defined behavioural guidelines and detailed prompts are set to prevent deviation during reasoning, and gives one example of a guideline in prose ("the IP library manager must finish processing all IP information before moving on"), but no prompt text, tool script, or MetaGPT role definition appears in the paper.',
    verdict: 'not-specified',
  },
  {
    id: 'reliability',
    title: 'Reliability of LLM-generated hardware',
    question: 'What guarantees does any of this give about correctness?',
    finding:
      'None that simulation cannot give. Passing a testbench means the design behaved correctly on the stimuli that testbench applied — it is not a proof, and it says nothing about coverage, corner cases, clock-domain crossings, power intent, timing closure across corners, or manufacturability. The paper reports no coverage metrics, no iteration counts, and no failure or non-convergence cases.',
    verdict: 'inference',
  },
  {
    id: 'scale',
    title: 'Evaluation scale',
    question: 'How much evidence supports the generality of the method?',
    finding:
      'Two generated SoCs, four benchmark scenarios, three human participants. That is enough to demonstrate the method end to end, and not enough to establish how it behaves across many designs, or how often it succeeds without human intervention. The paper reports no success rate over repeated runs.',
    verdict: 'inference',
  },
  {
    id: 'fairness',
    title: 'What the energy comparison actually compares',
    question: 'Do the 27.18× and 29.67× figures measure the generation framework, or the architecture?',
    finding:
      'Largely the architecture. The paper is explicit about the mechanism: LiteX’s cost is high because it lacks a DSA module, so all workloads run on the CPU. Case A wins mainly because it has a DSP; Case B mainly because it has a GPU. That is a real result about heterogeneous design, and it is a weaker claim than "GenSoC generates better SoCs" — a human using LiteX who added an accelerator would close much of the gap. What the comparison does support is that GenSoC made those architectural choices available and integrated them automatically.',
    verdict: 'inference',
  },
  {
    id: 'time-study',
    title: 'The >24× development-time result',
    question: 'How much weight should the speed claim carry?',
    finding:
      'It is an illustrative comparison, not a controlled study. Three graduate students, one task, an average of about four hours against "minutes". The paper does not report the students’ experience level, the exact task given, GenSoC’s own runtime distribution, LLM API time and cost, or how many GenSoC attempts were needed. The direction of the result is unsurprising; the specific multiplier should not be treated as a measured constant.',
    verdict: 'inference',
  },
  {
    id: 'combinations',
    title: 'The 598 SoC combinations figure',
    question: 'What does "598 configuration schemes" mean?',
    finding:
      'The paper reports approximately 598 configuration schemes, e.g. CPUs with different accelerators, but does not give the formula behind the count or state how many of those combinations have been generated and verified. Counting reachable combinations is a different claim from having validated them.',
    verdict: 'not-specified',
  },
];

/** Questions the site should let a reader answer, used on the Home page. */
export const openQuestions = [
  'Is the refined IP library released, and under what licence?',
  'Are the agent prompts, guidelines and tool scripts released?',
  'What is the success rate over repeated generation runs?',
  'How many validator iterations does a typical case need, and what happens when it does not converge?',
  'What verification coverage do the generated testbenches achieve?',
  'How much of the energy advantage survives if the baselines are given equivalent accelerators?',
];
