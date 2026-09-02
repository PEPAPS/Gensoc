/**
 * The 20-phase end-to-end walkthrough, from "user types a sentence" to
 * "post-P&R numbers".
 *
 * `provenance` records how much of each phase the paper actually pins down:
 *  - 'paper'     : the paper describes this step explicitly
 *  - 'inference' : a reasonable reading of the paper, not stated outright
 *  - 'context'   : standard chip-design background, included so a beginner can
 *                  follow the chain; not a claim about GenSoC specifically
 */
export type PipelinePhase = {
  n: number;
  title: string;
  agent: 'manager' | 'integrator' | 'validator' | 'none';
  summary: string;
  detail: string;
  provenance: 'paper' | 'inference' | 'context';
  artifact?: string;
};

export const pipelinePhases: PipelinePhase[] = [
  {
    n: 0,
    title: 'Build the IP library',
    agent: 'manager',
    summary: 'Retrieve open-source hardware, reorganise it into one style, document it, classify it, store it.',
    detail:
      'This happens once, before any user request. The IP library manager refines existing OSH code and documentation using online resources and its own expertise, then stores the refined material in the structured library. The paper reports more than 90 OSH IPs retrieved and reorganised this way.',
    provenance: 'paper',
    artifact: 'Structured OSH IP library',
  },
  {
    n: 1,
    title: 'Receive user requirements',
    agent: 'manager',
    summary: 'The user states what they want in plain language.',
    detail:
      'The paper’s own worked example: "Please design an SoC for edge AI inference with the following specifications: low power consumption (<500mW)". Natural language is the interaction mode Table II contrasts against Chipyard’s Chisel, LiteX’s Python and ESP’s GUI.',
    provenance: 'paper',
    artifact: 'Natural-language requirement',
  },
  {
    n: 2,
    title: 'Analyse the requirement',
    agent: 'manager',
    summary: 'Decompose the request into a workload, a power budget and the accelerator types implied.',
    detail:
      'In the paper’s example the agent reasons: the user wants edge-side AI inference at low power, so a CPU must be chosen first, and object detection implies real-time image processing. The paper shows this as a think-process leading into a table; it does not publish the prompt that produces it.',
    provenance: 'paper',
  },
  {
    n: 3,
    title: 'Retrieve IP candidates',
    agent: 'manager',
    summary: 'Search the structured library — first by IP type, then for details.',
    detail:
      'The paper describes a hierarchical RAG method: agents first identify IP types, then retrieve details. That ordering is what keeps a 90+ IP library usable inside a bounded prompt.',
    provenance: 'paper',
  },
  {
    n: 4,
    title: 'Rank against hard and soft constraints',
    agent: 'manager',
    summary: 'Eliminate anything that violates a hard limit; grade the survivors.',
    detail:
      'Hard constraints eliminate outright — OpenC910 and Gemmini both go on power grounds. Soft constraints use a tiered evaluation, with candidates graded A/B/C on performance, power and area in a reasoning table.',
    provenance: 'paper',
  },
  {
    n: 5,
    title: 'Generate the design plan',
    agent: 'manager',
    summary: 'Emit the chosen set of IPs as a plan for the next agent.',
    detail:
      'For Case A this resolves to CVA6 + NVDLA + DSP. The design plan is the manager’s output artifact and the integrator’s input. The paper does not publish the plan’s file format.',
    provenance: 'paper',
    artifact: 'Design plan',
  },
  {
    n: 6,
    title: 'Analyse interfaces',
    agent: 'integrator',
    summary: 'Read each selected IP’s interface: protocol, widths, control registers, data path.',
    detail:
      'The module level of the library’s description hierarchy exists for exactly this: interface signal specifications, configurable parameter lists, data flow and control flow are already written down, so the agent is not re-deriving them from raw RTL.',
    provenance: 'paper',
  },
  {
    n: 7,
    title: 'Select the protocol',
    agent: 'integrator',
    summary: 'Choose a bus protocol per connection, based on the IP’s characteristics.',
    detail:
      'Step 1 of the paper’s three-step protocol-driven integration. The stated rule: APB suits low-bandwidth peripherals, AXI is preferred for high-bandwidth scenarios such as CPU–accelerator interaction.',
    provenance: 'paper',
  },
  {
    n: 8,
    title: 'Extract protocol information',
    agent: 'integrator',
    summary: 'Pull structured facts out of the protocol manual.',
    detail:
      'Step 2. From the AMBA manual the integrator extracts protocol overviews, signal tables, read and write state-machine transition tables, and signal dependencies. The transition table gives current state, trigger signal and next state; the dependencies give timing rules such as "ARVALID must precede RVALID".',
    provenance: 'paper',
    artifact: 'Protocol FSM + timing rules',
  },
  {
    n: 9,
    title: 'Find or generate an adapter',
    agent: 'integrator',
    summary: 'Reuse a configurable adapter if one fits; otherwise write a new one.',
    detail:
      'Step 3. The paper names configurable adapters for bit-width adaptation (axi adapter) and protocol conversion (axi fifo, axi axilite). If there is no suitable interface adapter for an IP, the integrator writes a new adapter for it, based on the information extracted in phase 8.',
    provenance: 'paper',
    artifact: 'Adapter RTL',
  },
  {
    n: 10,
    title: 'Assemble the SoC',
    agent: 'integrator',
    summary: 'Wire CPU, accelerators, interconnect, peripherals and memory into one design.',
    detail:
      'The integrator produces the complete SoC code. The paper does not publish the generated RTL or describe a specific top-level template.',
    provenance: 'paper',
    artifact: 'Complete SoC source',
  },
  {
    n: 11,
    title: 'Allocate addresses',
    agent: 'integrator',
    summary: 'Scan all sources, modify address-allocation code, assign memory address spaces.',
    detail:
      'The paper states the integrator scans all source IP codes after integration, modifies address-allocation-related code, and assigns memory address spaces. Fig. 4 shows a hierarchical main-region / sub-region structure.',
    provenance: 'paper',
  },
  {
    n: 12,
    title: 'Generate integration documentation',
    agent: 'integrator',
    summary: 'Emit three documents: address map, register functions, testpoints.',
    detail:
      'The address mapping table is hierarchical and details each IP’s address information. The register documentation gives register functions and their corresponding addresses. The testpoint documentation outlines the IP features to be tested, focused primarily on integration connectivity.',
    provenance: 'paper',
    artifact: 'Address map + register doc + testpoints',
  },
  {
    n: 13,
    title: 'Compile the test software',
    agent: 'validator',
    summary: 'Turn the test program into a binary.',
    detail:
      'The paper describes a conventional SoC validation methodology in which testing code is compiled into binary. Because the tools lack suitable APIs, the commands are encapsulated in scripts that the agents adapt and execute.',
    provenance: 'paper',
  },
  {
    n: 14,
    title: 'Load the binary into the RAM model',
    agent: 'validator',
    summary: 'Place the program where the simulated CPU will fetch it from.',
    detail:
      'In simulation there is no flash chip and no bootloader by default: the memory model is initialised directly with the program image so the CPU finds instructions at reset.',
    provenance: 'paper',
  },
  {
    n: 15,
    title: 'Simulate',
    agent: 'validator',
    summary: 'Invoke the simulator to drive the peripherals and run the testbench.',
    detail:
      'Functional verification for each design case used Synopsys VCS. The process iterates within the testbench until all tests are successfully completed.',
    provenance: 'paper',
  },
  {
    n: 16,
    title: 'Capture structured debug data',
    agent: 'validator',
    summary: 'Extract master/slave relationships, cycle count, state and signal details into a debug file.',
    detail:
      'This is the step that makes the paper’s verification method work. Rather than handing an LLM a waveform, the validator extracts key simulation data into a structured debug file — the yellow box in Fig. 5 shows fields including cycle, module, signal name, direction, state and transition.',
    provenance: 'paper',
    artifact: 'Structured debug file',
  },
  {
    n: 17,
    title: 'Compare against the protocol rules',
    agent: 'validator',
    summary: 'Check observed behaviour against the FSM and timing rules extracted in phase 8.',
    detail:
      'The validator compares the debug file with the protocol state machine and timing signals to pinpoint issues. The paper motivates this by observing that LLMs excel at code logic but have limitations in managing state-machine signal triggers.',
    provenance: 'paper',
  },
  {
    n: 18,
    title: 'Revise the RTL',
    agent: 'validator',
    summary: 'Correct the code at the located fault.',
    detail:
      'The paper’s worked fault: the trigger for s_axi_wready was mistakenly placed in the WR_DATA state and is repositioned to WR_ADDR. The paper calls erroneous association of state-triggered signals with incorrect states a typical issue.',
    provenance: 'paper',
  },
  {
    n: 19,
    title: 'Repeat until the tests pass',
    agent: 'validator',
    summary: 'Loop back to simulation.',
    detail:
      'The simulation report is analysed to modify the source code, and the process iterates within the testbench until all tests complete successfully. The paper does not report how many iterations either case required, nor what happens if the loop fails to converge.',
    provenance: 'paper',
  },
  {
    n: 20,
    title: 'Physical design and evaluation',
    agent: 'none',
    summary: 'Synthesis, place and route, then measure power, area and frequency.',
    detail:
      'This is the research evaluation rather than part of the generation loop. Cadence Genus for synthesis, Cadence Innovus for backend, TSMC 22 nm, a commercial SRAM compiler, and an in-house simulator for chip performance. Table III’s numbers are post-P&R.',
    provenance: 'paper',
    artifact: 'Post-P&R power / area / frequency',
  },
];

/** Artifact handoff between the three agents (Section III, Fig. 2). */
export const agentHandoff = [
  {
    agent: 'IP Library Manager',
    id: 'manager' as const,
    inputs: ['Online OSH repositories', 'Its own expertise', 'User requirements in natural language'],
    outputs: ['Structured IP library', 'Design plan'],
  },
  {
    agent: 'SoC Integrator',
    id: 'integrator' as const,
    inputs: ['Design plan', 'IP library', 'Protocol specification (e.g. the AMBA manual)'],
    outputs: [
      'Complete SoC source',
      'Adapters',
      'Address mapping table',
      'Register functional documentation',
      'Testpoint documentation',
      'Extracted protocol FSM + timing information',
    ],
  },
  {
    agent: 'SoC Validator',
    id: 'validator' as const,
    inputs: ['Generated SoC', 'Integration documents', 'Protocol FSM + timing information'],
    outputs: ['Simulation report', 'Structured debug file', 'Source-code revisions'],
  },
];
