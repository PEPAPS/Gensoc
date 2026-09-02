/**
 * A ten-level ladder from "I have never written Verilog" to "I have a small
 * multi-agent SoC generator".
 *
 * None of this is the paper's methodology. It is a learning path that ends
 * somewhere structurally similar, using tools a reader can actually obtain.
 */
export type ReproLevel = {
  n: number;
  title: string;
  goal: string;
  steps: string[];
  tools?: string[];
  caution?: string;
};

export const reproLevels: ReproLevel[] = [
  {
    n: 1,
    title: 'Learn the concepts',
    goal: 'Be able to read a simple Verilog module and say what hardware it describes.',
    steps: [
      'Digital logic: gates, flip-flops, clocking, reset',
      'Verilog or SystemVerilog syntax, and why an always block is not a loop',
      'Finite state machines — how to write one and how to read one',
      'RISC-V basics: registers, load/store, memory-mapped I/O',
      'AXI and APB basics, especially the VALID/READY handshake',
      'RTL simulation and waveform reading',
    ],
    tools: ['Icarus Verilog', 'Verilator', 'GTKWave'],
  },
  {
    n: 2,
    title: 'Build a tiny SoC by hand',
    goal: 'Feel the problem GenSoC automates before automating any of it.',
    steps: [
      'Take an existing small RISC-V core',
      'Add a UART, a GPIO block and a RAM model',
      'Wire them to a simple bus and give each a non-overlapping address range',
      'Write a C program that prints over the UART and toggles a pin',
      'Simulate it until it works',
    ],
    tools: ['Icarus Verilog or Verilator', 'GTKWave', 'A RISC-V GCC toolchain'],
    caution:
      'These are beginner-accessible open-source alternatives. They are not the tools the paper used — the paper used Synopsys VCS for simulation.',
  },
  {
    n: 3,
    title: 'Create a small IP catalog',
    goal: 'Reproduce the shape of the library idea at 3–5 IPs instead of 90+.',
    steps: [
      'For each module write a metadata file: name, category, protocol, data width, description',
      'Add a README describing what it does and when you would use it',
      'Add an interfaces file listing every port, its direction and its width',
      'Add a parameters file listing what is configurable',
      'Keep the RTL under a consistent directory layout across all IPs',
    ],
    caution:
      'This mirrors the paper’s three description levels in miniature. The paper does not publish its own schema.',
  },
  {
    n: 4,
    title: 'Add an LLM IP selector',
    goal: 'Turn a sentence into a design plan.',
    steps: [
      'Feed the model only the top-level metadata for every IP — not the RTL',
      'Ask it to produce a design plan as structured output',
      'Make it state hard-constraint eliminations separately from soft-constraint ranking',
      'Validate the plan against the catalog: every named IP must actually exist',
    ],
  },
  {
    n: 5,
    title: 'Add interface validation',
    goal: 'Catch mismatches with code, not with a model.',
    steps: [
      'Compare protocol, data width, address width, clock and reset between every pair to be connected',
      'Report each mismatch as a typed record rather than prose',
      'Treat this output as the input to adapter selection',
    ],
    caution:
      'Deterministic checks belong in code. Save the model for the parts that genuinely need judgement.',
  },
  {
    n: 6,
    title: 'Add adapter templates',
    goal: 'Let the model configure known-good glue rather than invent glue.',
    steps: [
      'Write a small set of parameterised adapters by hand — an AXI-Lite to APB bridge, a width converter',
      'Have the model choose a template and fill in parameters, not emit free-form RTL',
      'Only allow free-form generation once the template path demonstrably works',
    ],
  },
  {
    n: 7,
    title: 'Automate simulation',
    goal: 'Give the agent a hand it can actually pull.',
    steps: [
      'Write build, simulate and test scripts with stable interfaces',
      'Have the agent invoke the scripts rather than assembling tool command lines',
      'Return exit codes and log paths in a predictable format',
    ],
    caution:
      'This is the one place where the paper is explicit about mechanism: because the tools lack suitable APIs, commands are encapsulated in scripts that agents adapt and execute.',
  },
  {
    n: 8,
    title: 'Add structured debug logs',
    goal: 'Stop asking a language model to read waveforms.',
    steps: [
      'Instrument the testbench to emit one record per interesting event',
      'Include cycle, module, state, and the handshake signal values',
      'Emit machine-readable records, not human prose',
    ],
  },
  {
    n: 9,
    title: 'Add a validator agent',
    goal: 'Reproduce the core idea of state-machine signal comparison.',
    steps: [
      'Encode the protocol FSM as data: current state, trigger, next state',
      'Encode the timing rules: which signal must precede which',
      'Give the agent the FSM, the rules and the debug log, and ask where observed behaviour diverges',
      'Have it propose a specific edit at a specific line, not a general suggestion',
    ],
  },
  {
    n: 10,
    title: 'Split into multiple agents',
    goal: 'Only now is there anything worth orchestrating.',
    steps: [
      'Separate the selector, integrator and validator into distinct agents',
      'Define the artifacts that pass between them and validate each at the boundary',
      'Let each agent see its predecessor’s output',
      'Keep the loop bounded — cap iterations and fail loudly',
    ],
    caution:
      'The multi-agent structure is the last step, not the first. Splitting roles before the single-agent path works just distributes the failure.',
  },
];

export const miniArchitecture = {
  tree: `mini-gensoc/
├── agents/
│   ├── ip_manager/
│   ├── integrator/
│   └── validator/
├── ip_library/
│   ├── cpu/
│   ├── uart/
│   └── gpio/
├── protocol_specs/
│   ├── apb.json
│   └── axi_lite.json
├── adapters/
├── generated_soc/
├── testbenches/
├── scripts/
│   ├── build.sh
│   ├── simulate.sh
│   └── parse_waveform.py
└── docs/`,
  metadataExample: `{
  "name": "uart",
  "category": "io",
  "protocol": "apb",
  "data_width": 32,
  "description": "UART peripheral"
}`,
  debugLogExample: `{
  "cycle": 42,
  "module": "uart_bridge",
  "state": "WRITE",
  "valid": 1,
  "ready": 0
}`,
};
