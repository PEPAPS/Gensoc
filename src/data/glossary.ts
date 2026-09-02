/**
 * Single source of truth for every term the site explains.
 *
 * Definitions live here and here only. Pages surface them through <T> (see
 * src/components/glossary/Term.tsx), never by hand-writing a definition inline.
 *
 * `beginnerDefinition` is written for a programmer with zero chip-design
 * background. `paperContext` - when present - says how GenSoC actually uses the
 * term, and is drawn from the paper itself.
 */
export type GlossaryTerm = {
  term: string;
  fullName?: string;
  beginnerDefinition: string;
  paperContext?: string;
  category: 'hardware' | 'protocol' | 'design-flow' | 'ai' | 'tooling' | 'metrics';
};

export const glossary: GlossaryTerm[] = [
  // ---------------------------------------------------------------- hardware
  {
    term: 'CPU',
    fullName: 'Central Processing Unit',
    beginnerDefinition:
      'The general-purpose processor. It fetches instructions one after another and can run any kind of program, including an operating system. Flexible, but not the most energy-efficient way to do one specialised job over and over.',
    paperContext:
      'GenSoC’s IP library holds 23 CPU options. Case A uses CVA6; Case B uses a dual-core Xiangshan.',
    category: 'hardware',
  },
  {
    term: 'GPU',
    fullName: 'Graphics Processing Unit',
    beginnerDefinition:
      'A processor with a very large number of simple compute units that run the same operation across many data items at once. Built for graphics, and useful for any workload that is naturally parallel.',
    paperContext:
      'The library lists Ventus, MIAOW, Nyuzi and Vortex as GPU options. Case B integrates Ventus, and the paper credits the GPU for Case B’s reduced rendering energy.',
    category: 'hardware',
  },
  {
    term: 'NPU',
    fullName: 'Neural Processing Unit',
    beginnerDefinition:
      'A processor built specifically for neural-network maths - mostly matrix multiplication and convolution. It gives up generality to do those operations with far less energy per operation than a CPU.',
    paperContext:
      'The library lists VTA, NVDLA, Gemmini and a systolic-array design. Case A selects NVDLA; Case B selects Gemmini.',
    category: 'hardware',
  },
  {
    term: 'DSP',
    fullName: 'Digital Signal Processor',
    beginnerDefinition:
      'A processor tuned for repetitive numerical work on streams of samples - filtering, transforms, audio and radio processing. Its instruction set is shaped around multiply-accumulate loops.',
    paperContext:
      'Case A includes a DSP. The paper attributes part of Case A’s energy advantage to the DSP taking signal-preprocessing work off the CPU.',
    category: 'hardware',
  },
  {
    term: 'DSA',
    fullName: 'Domain-Specific Accelerator',
    beginnerDefinition:
      'Hardware designed for one problem domain rather than for general computing. GPUs, NPUs, video encoders and crypto engines are all domain-specific accelerators in the broad sense.',
    paperContext:
      'DSA is one of the five categories in the paper’s IP library (16 representative entries). Table II counts 26 accelerator options for GenSoC against 3 for Chipyard, 1 for ESP and 0 for LiteX.',
    category: 'hardware',
  },
  {
    term: 'SoC',
    fullName: 'System-on-Chip',
    beginnerDefinition:
      'A single chip holding an entire computing system: processors, accelerators, memory controllers, peripherals, and the interconnect that wires them together. The phone in your pocket runs on one.',
    paperContext:
      'Generating a complete, verified SoC from a natural-language request is the whole point of GenSoC.',
    category: 'hardware',
  },
  {
    term: 'IP',
    fullName: 'Intellectual Property block (IP core)',
    beginnerDefinition:
      'In chip design, IP does not mean Internet Protocol. It means a reusable hardware module - a CPU core, a UART, a DDR controller - packaged so it can be dropped into a new design, roughly the way a software library is reused.',
    paperContext:
      'The IP library manager retrieved and reorganised more than 90 open-source IPs into a structured library that the other agents draw on.',
    category: 'hardware',
  },
  {
    term: 'OSH',
    fullName: 'Open-Source Hardware',
    beginnerDefinition:
      'Hardware designs published under an open licence, so anyone can read, modify and build on the source. The equivalent of open-source software, but for circuits.',
    paperContext:
      'GenSoC’s premise is that a great deal of usable OSH already exists on GitHub, but that it is too inconsistently structured and documented to reuse easily.',
    category: 'hardware',
  },
  {
    term: 'peripheral',
    beginnerDefinition:
      'A block that connects the chip to the outside world or provides a supporting service - a serial port, a set of general-purpose pins, a timer. Usually low-bandwidth compared with a CPU or accelerator.',
    category: 'hardware',
  },
  {
    term: 'interconnect',
    beginnerDefinition:
      'The on-chip wiring plus arbitration logic that carries transactions between blocks. It decides who gets to talk when, and routes each request to the right destination.',
    category: 'hardware',
  },
  {
    term: 'bus',
    beginnerDefinition:
      'A shared set of wires and rules that several blocks use to exchange data. A bus protocol defines what each wire means and when each block is allowed to drive it.',
    category: 'protocol',
  },
  {
    term: 'register',
    beginnerDefinition:
      'A small storage location inside a hardware block. Some registers hold data in flight; others are control and status registers that software reads and writes to operate the block.',
    paperContext:
      'The SoC integrator emits a register functional document listing each register’s function and its corresponding address.',
    category: 'hardware',
  },
  {
    term: 'SRAM',
    fullName: 'Static Random-Access Memory',
    beginnerDefinition:
      'Fast on-chip memory built from transistors rather than capacitors. It is what caches and on-chip buffers are made of, and it typically dominates the area of a memory-heavy block.',
    paperContext:
      'The authors used a commercial SRAM compiler to generate the SRAM blocks in both design cases.',
    category: 'hardware',
  },
  {
    term: 'RISC-V',
    beginnerDefinition:
      'An open instruction-set architecture - a freely usable specification of what instructions a processor understands. Because nobody has to licence it, it underpins most open-source CPU projects.',
    paperContext: 'Xiangshan, CVA6, Rocket, OpenC910 and the Ventus GPU are all RISC-V-based.',
    category: 'hardware',
  },
  {
    term: 'accelerator',
    beginnerDefinition:
      'A hardware block that performs one class of computation much faster or more efficiently than a general-purpose CPU could, at the cost of only being good at that class.',
    category: 'hardware',
  },
  {
    term: 'heterogeneous',
    beginnerDefinition:
      'A chip built from several different kinds of compute engine - CPU plus GPU plus NPU plus DSP - rather than many copies of one kind. Each workload runs on the engine best suited to it.',
    paperContext:
      'Against area-matched homogeneous PULP Snitch baselines, the paper reports 2.13× and 2.27× better energy efficiency for Case A, and 2.46× and 2.79× for Case B.',
    category: 'hardware',
  },
  {
    term: 'homogeneous',
    beginnerDefinition:
      'A design built from many copies of the same core. Simpler to program and scale, but every workload has to run on the same kind of hardware whether or not it suits it.',
    paperContext:
      'The homogeneous baselines were generated with PULP Snitch and area-matched to Case A and Case B.',
    category: 'hardware',
  },

  // ---------------------------------------------------------------- protocol
  {
    term: 'AMBA',
    fullName: 'Advanced Microcontroller Bus Architecture',
    beginnerDefinition:
      'Arm’s family of on-chip communication standards. If two blocks both speak an AMBA protocol correctly, they can be wired together without inventing a private convention.',
    paperContext:
      'The paper uses AMBA-based integration as its worked example. The integrator extracts protocol overviews, signal tables, read/write state-machine transition tables and signal dependencies from the AMBA manual.',
    category: 'protocol',
  },
  {
    term: 'AXI',
    fullName: 'Advanced eXtensible Interface',
    beginnerDefinition:
      'The high-performance member of the AMBA family. Separate address, data and response channels, support for bursts and outstanding transactions - what you use when bandwidth matters.',
    paperContext:
      'The paper states AXI is preferred for high-bandwidth scenarios such as CPU-accelerator interaction.',
    category: 'protocol',
  },
  {
    term: 'AXI-Lite',
    beginnerDefinition:
      'A cut-down AXI: no bursts, one transaction at a time, much less logic. The usual choice for a block’s control and status registers.',
    paperContext:
      'The paper mentions axi_axilite among the configurable adapters, and notes VTA’s AXI-Lite interface constraints as one reason it lost out to NVDLA in the Case A selection.',
    category: 'protocol',
  },
  {
    term: 'APB',
    fullName: 'Advanced Peripheral Bus',
    beginnerDefinition:
      'The simplest AMBA protocol. Low bandwidth, few signals, easy to implement - intended for peripherals such as UARTs, timers and GPIO.',
    paperContext: 'The paper states APB is suitable for low-bandwidth peripherals.',
    category: 'protocol',
  },
  {
    term: 'master',
    beginnerDefinition:
      'The side of a bus transaction that initiates it - it issues the address and says whether it is reading or writing. A CPU is typically a master.',
    paperContext:
      'The validator’s structured debug file records master-slave relationships alongside cycle count, state and signal details.',
    category: 'protocol',
  },
  {
    term: 'slave',
    beginnerDefinition:
      'The side of a bus transaction that responds - it accepts the address and returns data or an acknowledgement. A memory or a peripheral is typically a slave.',
    category: 'protocol',
  },
  {
    term: 'VALID/READY',
    beginnerDefinition:
      'The two-wire handshake AXI uses. The sender raises VALID when it has data; the receiver raises READY when it can accept. Transfer happens on the clock edge where both are high - and neither side may wait for the other first.',
    paperContext:
      'The bug walked through in Fig. 5 is exactly a handshake failure: the master’s valid reaches the bridge, but the ready that should come back never triggers.',
    category: 'protocol',
  },
  {
    term: 'signal',
    beginnerDefinition:
      'One wire (or bundle of wires) in a hardware design, carrying a value that can change every clock cycle. Where software has variables, hardware has signals - but every signal has a value at every instant.',
    category: 'protocol',
  },
  {
    term: 'clock cycle',
    beginnerDefinition:
      'One tick of the chip’s clock. Synchronous digital logic updates its state on clock edges, so "when" something happens in hardware is measured in cycles, not milliseconds.',
    category: 'protocol',
  },
  {
    term: 'address map',
    beginnerDefinition:
      'The table that says which range of addresses belongs to which block. Writing to 0x1000_0000 might reach the UART; writing to 0x2000_0000 might reach the NPU. Overlapping ranges are a real and common bug.',
    paperContext:
      'The SoC integrator modifies address-allocation code across the integrated sources and emits a hierarchical address mapping table as one of its three documents.',
    category: 'protocol',
  },
  {
    term: 'memory-mapped I/O',
    beginnerDefinition:
      'The trick that makes hardware programmable: each control register is given an address, so ordinary load and store instructions are all software needs to drive the hardware.',
    category: 'protocol',
  },
  {
    term: 'adapter',
    beginnerDefinition:
      'Glue logic between two blocks that do not speak the same interface - converting one protocol to another, or narrowing a 64-bit port to 32 bits. Unglamorous, and a classic source of integration bugs.',
    paperContext:
      'The integrator first looks for a configurable adapter (the paper names axi adapter, axi fifo and axi axilite). If no suitable interface adapter exists for an IP, the integrator writes a new one.',
    category: 'protocol',
  },
  {
    term: 'FSM',
    fullName: 'Finite State Machine',
    beginnerDefinition:
      'A design that is always in exactly one of a fixed set of states and moves between them on defined triggers. Bus protocols are specified as state machines, which is why they can be checked mechanically.',
    paperContext:
      'The integrator extracts read and write state-machine transition tables from the protocol manual; the validator compares simulation behaviour against them.',
    category: 'protocol',
  },
  {
    term: 'signal dependency',
    beginnerDefinition:
      'A timing rule saying that one signal must - or need not - precede another. It is what turns a pile of wires into a protocol you can be wrong about.',
    paperContext:
      'The paper gives two examples: ARVALID must precede RVALID, while ARREADY is related to ARVALID but is not strictly required to follow it.',
    category: 'protocol',
  },

  // ------------------------------------------------------------- design-flow
  {
    term: 'HDL',
    fullName: 'Hardware Description Language',
    beginnerDefinition:
      'A language for describing digital hardware. It looks like code but does not execute like code: everything you write exists simultaneously, all the time.',
    paperContext:
      'The paper cites inconsistent HDL and HLS styles across open-source projects as one reason reusing them is hard.',
    category: 'design-flow',
  },
  {
    term: 'HLS',
    fullName: 'High-Level Synthesis',
    beginnerDefinition:
      'Generating hardware from a higher-level language such as C or C++ instead of writing RTL by hand. Faster to author; the generated structure can be harder to reason about.',
    category: 'design-flow',
  },
  {
    term: 'Verilog',
    beginnerDefinition:
      'The most widely used HDL, along with its superset SystemVerilog. An always @(posedge clk) block describes what registers do on every clock edge - it is not a loop.',
    category: 'design-flow',
  },
  {
    term: 'RTL',
    fullName: 'Register Transfer Level',
    beginnerDefinition:
      'The abstraction level most chip design happens at: you describe which registers hold what, and what combinational logic sits between them. Everything below - gates, transistors - is generated from it.',
    paperContext: 'The validator revises RTL sources in a loop until the simulation tests pass.',
    category: 'design-flow',
  },
  {
    term: 'testbench',
    beginnerDefinition:
      'Simulation-only code that wraps the design, drives its inputs and checks its outputs. It is never manufactured - it exists purely to exercise the design.',
    paperContext:
      'The paper describes iterating within the testbench until all tests are successfully completed.',
    category: 'design-flow',
  },
  {
    term: 'simulation',
    beginnerDefinition:
      'Running the RTL as a model, cycle by cycle, on a normal computer, to check that it behaves correctly. It answers "is this logically right?" and nothing else.',
    paperContext: 'Functional verification for each design case was performed with Synopsys VCS.',
    category: 'design-flow',
  },
  {
    term: 'synthesis',
    beginnerDefinition:
      'Translating RTL into an actual network of logic gates drawn from a specific manufacturing technology’s cell library. This is where timing and area first become concrete.',
    paperContext: 'Synthesis was implemented with Cadence Genus.',
    category: 'design-flow',
  },
  {
    term: 'place and route',
    fullName: 'P&R',
    beginnerDefinition:
      'Deciding where each gate physically sits on the die and routing the wires between them. Wire length becomes delay, so this stage determines whether the design actually meets its target clock frequency.',
    paperContext: 'Backend implementation used Cadence Innovus; Table III reports post-P&R results.',
    category: 'design-flow',
  },
  {
    term: 'PDK',
    fullName: 'Process Design Kit',
    beginnerDefinition:
      'The files a foundry supplies describing what its manufacturing process can build - cell libraries, timing models, design rules. Commercial PDKs are under NDA, which is a large part of why chip work is hard to reproduce.',
    paperContext: 'Both cases used the commercial TSMC 22 nm process.',
    category: 'design-flow',
  },
  {
    term: 'process node',
    beginnerDefinition:
      'A generation of manufacturing technology, named with a number such as 22 nm. Treat the number as a marketing-influenced label for a technology generation rather than a literal measurement.',
    category: 'design-flow',
  },
  {
    term: 'tapeout',
    beginnerDefinition:
      'Sending the finished layout to the foundry for manufacture. It is the point of no return - masks cost a great deal, and a bug found afterwards means another spin.',
    paperContext:
      'GenSoC was not taped out. The paper reports post-P&R results; it cites ChatCPU as prior work that did fabricate a chip.',
    category: 'design-flow',
  },
  {
    term: 'EDA',
    fullName: 'Electronic Design Automation',
    beginnerDefinition:
      'The software used to design chips - simulators, synthesis tools, place-and-route tools. The industry-standard ones come from Synopsys, Cadence and Siemens, and are expensive.',
    paperContext:
      'Because these tools lack suitable APIs, GenSoC encapsulates their commands in scripts that the agents adapt and execute.',
    category: 'design-flow',
  },

  // --------------------------------------------------------------------- ai
  {
    term: 'LLM',
    fullName: 'Large Language Model',
    beginnerDefinition:
      'A model trained on very large amounts of text that generates text in response to a prompt. Useful here for reading documentation, reasoning about interfaces and writing code - with no guarantee of correctness.',
    paperContext: 'Each of GenSoC’s three agents is integrated with a DeepSeek-Reasoner model.',
    category: 'ai',
  },
  {
    term: 'LLM agent',
    beginnerDefinition:
      'An LLM wrapped with a goal, a memory, and tools it can invoke. Instead of only answering, it plans, acts on its environment, observes what happened, and continues.',
    paperContext:
      'The paper describes agents that decompose tasks, use tools such as APIs and code interpreters, and learn continuously through iterative interaction with the environment.',
    category: 'ai',
  },
  {
    term: 'multi-agent system',
    beginnerDefinition:
      'Several agents with distinct roles working on one problem and passing results between them, rather than one agent doing everything in a single context.',
    paperContext:
      'GenSoC deploys three: IP library manager, SoC integrator, SoC validator. Agents observe the actions of their predecessors, which is what makes the handoff work.',
    category: 'ai',
  },
  {
    term: 'RAG',
    fullName: 'Retrieval-Augmented Generation',
    beginnerDefinition:
      'Fetching the relevant documents first and putting only those into the prompt, instead of hoping the model memorised them. Keeps prompts small and answers grounded in real sources.',
    paperContext:
      'GenSoC uses a hierarchical RAG method: agents first identify the IP type, then retrieve details - rather than loading the whole library at once.',
    category: 'ai',
  },
  {
    term: 'hard constraint',
    beginnerDefinition:
      'A requirement that must hold. Anything violating it is eliminated outright, with no trade-off considered.',
    paperContext:
      'In the paper’s Example 1, OpenC910 is excluded on power grounds before any ranking happens, and Gemmini is excluded for exceeding the power budget.',
    category: 'ai',
  },
  {
    term: 'soft constraint',
    beginnerDefinition:
      'A preference that is graded rather than pass/fail. Candidates that survive the hard filter are ranked on these.',
    paperContext:
      'The paper describes a tiered evaluation - for power consumption, IP 2 is rated Grade A while IP 1 and IP 3 are Grade B and Grade C.',
    category: 'ai',
  },
  {
    term: 'hallucination',
    beginnerDefinition:
      'An LLM producing fluent, confident output that is simply wrong. In hardware this shows up as RTL that looks plausible, compiles, and does not implement the protocol.',
    category: 'ai',
  },

  // ----------------------------------------------------------------- tooling
  {
    term: 'MetaGPT',
    beginnerDefinition:
      'An open-source framework for building multi-agent LLM systems, where each agent has a defined role and agents pass structured outputs to one another.',
    paperContext:
      'GenSoC is developed on MetaGPT. The paper does not publish its specific agent configurations or prompts.',
    category: 'tooling',
  },
  {
    term: 'DeepSeek-Reasoner',
    beginnerDefinition:
      'DeepSeek’s reasoning-oriented model, which produces an explicit chain of reasoning before its final answer.',
    paperContext:
      'Every GenSoC agent is integrated with a DeepSeek-Reasoner model; the paper cites DeepSeek-R1 for it.',
    category: 'tooling',
  },
  {
    term: 'Synopsys VCS',
    beginnerDefinition:
      'A commercial RTL simulator, one of the industry-standard tools for functional verification.',
    paperContext: 'Used for functional verification of both design cases.',
    category: 'tooling',
  },
  {
    term: 'Cadence Genus',
    beginnerDefinition: 'A commercial logic-synthesis tool: RTL in, gate-level netlist out.',
    paperContext: 'Used for synthesis in the paper’s evaluation.',
    category: 'tooling',
  },
  {
    term: 'Cadence Innovus',
    beginnerDefinition: 'A commercial place-and-route tool that turns a netlist into a physical layout.',
    paperContext: 'Used for the backend process; Table III’s numbers are post-P&R.',
    category: 'tooling',
  },

  // ----------------------------------------------------------------- metrics
  {
    term: 'PPA',
    fullName: 'Power, Performance, Area',
    beginnerDefinition:
      'The three numbers every chip design is judged on. They trade off against each other constantly - improving one usually costs you another.',
    paperContext:
      'PPA analysis sits at the IP level of the library’s description hierarchy, so the manager agent can reason about trade-offs during selection.',
    category: 'metrics',
  },
  {
    term: 'normalized energy cost',
    beginnerDefinition:
      'Energy expressed as a ratio against a chosen reference rather than in joules. A value of 3.48 means "3.48 times the reference’s energy" and says nothing about the absolute figure.',
    paperContext:
      'Fig. 7 normalises everything to the GenSoC case, which is why Case A and Case B sit at exactly 1. The paper does not report absolute joules for these scenarios.',
    category: 'metrics',
  },
  {
    term: 'energy efficiency',
    beginnerDefinition:
      'Work done per unit of energy. Higher is better, and it is the inverse of energy cost per task - so a 2× efficiency gain means the same job for half the energy.',
    category: 'metrics',
  },
  {
    term: 'benchmark',
    beginnerDefinition:
      'A standard workload used so different systems can be compared on the same task. Which benchmarks you pick shapes what conclusion you reach.',
    paperContext:
      'Case A was evaluated on voice detection and object tracking; Case B on virtual AI assistant and augmented reality.',
    category: 'metrics',
  },
];

const index = new Map(glossary.map((t) => [t.term.toLowerCase(), t]));

export function lookupTerm(term: string): GlossaryTerm | undefined {
  return index.get(term.toLowerCase());
}

export const glossaryCategories: { id: GlossaryTerm['category']; label: string }[] = [
  { id: 'hardware', label: 'Hardware blocks' },
  { id: 'protocol', label: 'Buses & protocols' },
  { id: 'design-flow', label: 'Design flow' },
  { id: 'ai', label: 'LLMs & agents' },
  { id: 'tooling', label: 'Tools used by the paper' },
  { id: 'metrics', label: 'Metrics' },
];
