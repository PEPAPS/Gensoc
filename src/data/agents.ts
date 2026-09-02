export type AgentId = 'manager' | 'integrator' | 'validator';

export type AgentProfile = {
  id: AgentId;
  n: 1 | 2 | 3;
  name: string;
  phase: string;
  paperSection: string;
  oneLine: string;
  responsibilities: string[];
  notSpecified: string[];
};

export const agents: AgentProfile[] = [
  {
    id: 'manager',
    n: 1,
    name: 'IP Library Manager',
    phase: 'Phase A — IP refinement and selection',
    paperSection: 'Section IV-A',
    oneLine:
      'Turns a scattered pile of open-source hardware into a searchable library, then picks the blocks that match what the user asked for.',
    responsibilities: [
      'Retrieve existing open-source hardware IPs from online resources',
      'Refine and reorganise the code and documentation into a unified style',
      'Write multi-level descriptions: IP level, module level, code level',
      'Classify the refined IPs and store them in the structured library',
      'Interpret user requirements given in natural language',
      'Reason over candidates in a tabular think-process using hard and soft constraints',
      'Produce the design plan the SoC integrator works from',
    ],
    notSpecified: [
      'The behavioural guidelines and detailed prompts that configure this agent',
      'Whether refinement is fully automated or partly human-supervised',
      'Whether the refined 90+ IP library is publicly released',
      'The file format of the design plan',
    ],
  },
  {
    id: 'integrator',
    n: 2,
    name: 'SoC Integrator',
    phase: 'Phase B — SoC integration',
    paperSection: 'Section IV-B',
    oneLine:
      'Takes the design plan and actually wires the blocks together — choosing protocols, building adapters, allocating addresses and writing the documents verification will need.',
    responsibilities: [
      'Select the target IP implementations named in the design plan',
      'Read the target module and the protocol manual',
      'Step 1 — Protocol selection: choose the protocol appropriate to each IP’s characteristics',
      'Step 2 — Information extraction: pull protocol overview, signal table, read/write FSM transition tables and signal dependencies out of the manual',
      'Step 3 — Adapter generation: reuse a configurable adapter if one fits, otherwise write a new one',
      'Integrate the selected modules into complete SoC code',
      'Scan all source IP code, modify address-allocation code and assign memory address spaces',
      'Generate the address mapping table, register functional documentation and testpoint documentation',
    ],
    notSpecified: [
      'The internal architecture of the generated adapters',
      'The full set of pre-defined adapter templates (the paper names axi adapter, axi fifo and axi axilite as examples)',
      'How conflicting address allocations are detected or resolved',
      'Any generated RTL — none is published in the paper',
    ],
  },
  {
    id: 'validator',
    n: 3,
    name: 'SoC Validator',
    phase: 'Phase C — SoC verification',
    paperSection: 'Section IV-C',
    oneLine:
      'Compiles a test program, simulates the generated SoC, converts the run into a structured debug file, compares it against the protocol’s state machine, and fixes what does not match.',
    responsibilities: [
      'Compile the testing code into a binary',
      'Load the binary into the RAM model',
      'Invoke the simulator to drive the peripherals',
      'Analyse the simulation report',
      'Extract key simulation data into a structured debug file: master–slave relationships, cycle count, state, signal details',
      'Compare that file against the protocol state machine and timing signals extracted by the integrator',
      'Locate the fault and correct the source code',
      'Iterate within the testbench until all tests complete successfully',
    ],
    notSpecified: [
      'How many revision iterations either case study required',
      'What happens when the loop fails to converge',
      'Coverage achieved by the generated tests',
      'The exact schema of the structured debug file (Fig. 5 shows representative fields only)',
    ],
  },
];

/** The three-level IP description method (Section IV-A, Fig. 3 left). */
export const ipDescriptionLevels = [
  {
    level: 1,
    name: 'IP level',
    scope: 'The whole block, described at its highest level of abstraction.',
    contents: [
      'Functional overview',
      'Technical parameters / specifications',
      'Benchmark performance metrics',
      'Typical application scenarios',
      'PPA analysis',
    ],
    whyItMatters:
      'This is what the manager agent reads during selection. It is enough to decide "is this the right kind of block at all?" without opening a single line of RTL.',
  },
  {
    level: 2,
    name: 'Module level',
    scope: 'Each functional submodule inside the IP core.',
    contents: [
      'Module overview',
      'Configurable parameter lists',
      'Interface signal specifications',
      'Data flow',
      'Control flow',
    ],
    whyItMatters:
      'This is what the integrator agent reads. Interface tables are precisely the information you need to decide whether two blocks can be connected directly or need an adapter.',
  },
  {
    level: 3,
    name: 'Code level',
    scope: 'The RTL source itself.',
    contents: ['Code structure reorganisation', 'Code refinement', 'Added critical annotations'],
    whyItMatters:
      'This is what gets read when something has to be modified or debugged. Consistent structure and annotations are what make an unfamiliar repository tractable for a model working in a bounded context.',
  },
];
