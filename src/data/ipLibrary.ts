/**
 * Table I - representative IPs in the paper's established OSH IP library, plus
 * background notes on what each project actually is.
 *
 * `count` is the number the paper reports for the whole category. The `items`
 * are only the representative examples Table I names - the paper does not list
 * all 90+ IPs, and none are invented here.
 *
 * Each item's `background` is external context (what the project is), kept
 * separate from `paperNote`, which is what the paper itself says about it.
 */

export type IpCategoryId = 'CPU' | 'GPU' | 'NPU' | 'DSA' | 'IO';

export type IpEntry = {
  name: string;
  category: IpCategoryId;
  background: string;
  paperNote?: string;
  usedIn?: ('A' | 'B')[];
};

export type IpCategory = {
  id: IpCategoryId;
  label: string;
  count: number;
  whatItIs: string;
  glossaryTerm: string;
};

export const ipCategories: IpCategory[] = [
  {
    id: 'CPU',
    label: 'CPU',
    count: 23,
    whatItIs:
      'General-purpose processors. Every SoC needs at least one to run control code and, usually, an operating system.',
    glossaryTerm: 'CPU',
  },
  {
    id: 'GPU',
    label: 'GPU',
    count: 12,
    whatItIs:
      'Massively parallel compute engines, originally for graphics, now also used for any data-parallel workload.',
    glossaryTerm: 'GPU',
  },
  {
    id: 'NPU',
    label: 'NPU',
    count: 10,
    whatItIs:
      'Neural-network accelerators, built around matrix multiplication and convolution.',
    glossaryTerm: 'NPU',
  },
  {
    id: 'DSA',
    label: 'DSA',
    count: 16,
    whatItIs:
      'Domain-specific accelerators: video encoders, crypto engines, signal processors and similar fixed-purpose blocks.',
    glossaryTerm: 'DSA',
  },
  {
    id: 'IO',
    label: 'I/O',
    count: 32,
    whatItIs:
      'Peripherals and interfaces that connect the chip to the outside world, or to external memory.',
    glossaryTerm: 'peripheral',
  },
];

export const ipEntries: IpEntry[] = [
  // CPU
  {
    name: 'Xiangshan',
    category: 'CPU',
    background:
      'An open-source high-performance out-of-order RISC-V processor developed with an agile methodology.',
    paperNote:
      'The paper describes Xiangshan as designed with performance comparable to Arm Neoverse N2, and uses a dual-core Xiangshan in Case B.',
    usedIn: ['B'],
  },
  {
    name: 'OpenC910',
    category: 'CPU',
    background: 'T-Head Semiconductor’s open-sourced RISC-V core, released under Apache-2.0.',
    paperNote:
      'Excluded from Case A in the paper’s worked example because its superscalar architecture consumes too much power for the <500 mW budget.',
  },
  {
    name: 'CVA6',
    category: 'CPU',
    background:
      'An application-class 64-bit RISC-V core, originally studied as a Linux-ready 1.7 GHz design in 22 nm FDSOI.',
    paperNote:
      'Selected for Case A: the paper reasons that CVA6’s out-of-order execution capability meets the real-time requirement where Rocket’s in-order execution might not.',
    usedIn: ['A'],
  },
  {
    name: 'Rocket',
    category: 'CPU',
    background:
      'The RISC-V core generator from UC Berkeley, and the CPU at the centre of the Chipyard ecosystem.',
    paperNote:
      'Retained as a Case A alternative alongside CVA6, then set aside: the paper notes in-order execution may lead to preprocessing delays affecting real-time performance.',
  },

  // GPU
  {
    name: 'Ventus',
    category: 'GPU',
    background:
      'A high-performance open-source GPGPU based on RISC-V and its vector extension.',
    paperNote: 'Integrated in Case B; the paper credits it for Case B’s reduced rendering energy.',
    usedIn: ['B'],
  },
  {
    name: 'MIAOW',
    category: 'GPU',
    background: 'An open-source GPU implementing a subset of AMD’s Southern Islands ISA.',
  },
  {
    name: 'Nyuzi',
    category: 'GPU',
    background:
      'An experimental GPGPU with a SystemVerilog implementation, LLVM toolchain and FPGA support.',
  },
  {
    name: 'Vortex',
    category: 'GPU',
    background: 'A RISC-V ISA extension for GPGPU and 3D graphics, with an open hardware implementation.',
  },

  // NPU
  {
    name: 'VTA',
    category: 'NPU',
    background:
      'Apache TVM’s Versatile Tensor Accelerator: an open deep-learning accelerator with compiler integration and FPGA deployment support.',
    paperNote:
      'A Case A candidate that lost to NVDLA: the paper cites VTA’s limited model compatibility and AXI-Lite interface constraints as possible preprocessing bottlenecks.',
  },
  {
    name: 'NVDLA',
    category: 'NPU',
    background: 'NVIDIA’s open Deep Learning Accelerator architecture, widely used in academic research.',
    paperNote:
      'Selected for Case A for its dedicated CNN acceleration architecture and native AXI interface, giving higher throughput within the power budget.',
    usedIn: ['A'],
  },
  {
    name: 'Gemmini',
    category: 'NPU',
    background:
      'A systolic-array deep-learning accelerator generator built for full-stack architecture evaluation.',
    paperNote:
      'Excluded from Case A for exceeding the power budget, but selected as the NPU in Case B.',
    usedIn: ['B'],
  },
  {
    name: 'systolic-array',
    category: 'NPU',
    background:
      'An open RTL implementation of a TPU-style systolic array — a grid of multiply-accumulate cells that data flows through.',
  },

  // DSA
  {
    name: 'xk265',
    category: 'DSA',
    background: 'An H.265 video encoder IP core from the VIP Lab at Fudan University.',
    paperNote: 'Case B integrates an H.264/H.265 video encoder.',
    usedIn: ['B'],
  },
  {
    name: 'DSP',
    category: 'DSA',
    background: 'An open RTL DSP library of signal-processing building blocks.',
    paperNote:
      'Case A includes a DSP; the paper attributes much of Case A’s efficiency to it offloading signal preprocessing from the CPU.',
    usedIn: ['A'],
  },
  {
    name: 'Crypto-Accelerator',
    category: 'DSA',
    background:
      'A cryptography accelerator ASIC with AES and SHA-256 cores, targeting the SKY130 open process node.',
    paperNote: 'Case B integrates an encryption unit.',
    usedIn: ['B'],
  },

  // I/O
  {
    name: 'GPIO',
    category: 'IO',
    background:
      'General-Purpose Input/Output: individually controllable pins that software can read or drive high and low.',
  },
  {
    name: 'UART',
    category: 'IO',
    background:
      'Universal Asynchronous Receiver/Transmitter — the simple two-wire serial port used for consoles and debug output.',
  },
  {
    name: 'SPI',
    category: 'IO',
    background:
      'Serial Peripheral Interface — a short-distance synchronous serial bus for flash memory, sensors and displays.',
  },
  {
    name: 'DDR-controller',
    category: 'IO',
    background:
      'The block that drives external DDR memory chips, handling their timing, refresh and command scheduling.',
    paperNote: 'Case B integrates a DDR4 controller.',
    usedIn: ['B'],
  },
];

export const totalIpsRetrieved = 90; // "more than 90" per Section IV-A

/**
 * The paper's Example 1 selection reasoning, reproduced faithfully.
 * The grades are the ones printed in the paper's result table; blank cells in
 * the paper are represented as null and must be rendered as "not given".
 */
export type SelectionCandidate = {
  name: string;
  kind: 'CPU' | 'NPU';
  perf: 'A' | 'B' | 'C' | null;
  power: 'A' | 'B' | 'C' | null;
  area: 'A' | 'B' | 'C' | null;
  outcome: 'selected' | 'excluded' | 'considered';
  reasoning: string;
};

export const example1Candidates: SelectionCandidate[] = [
  {
    name: 'OpenC910',
    kind: 'CPU',
    perf: 'A',
    power: 'C',
    area: null,
    outcome: 'excluded',
    reasoning:
      'Excluded first: the superscalar architecture consumes too much power for a <500 mW budget. This is a hard-constraint elimination, not a ranking.',
  },
  {
    name: 'Rocket',
    kind: 'CPU',
    perf: 'B',
    power: 'A',
    area: null,
    outcome: 'considered',
    reasoning:
      'Retained as an alternative on power grounds, but in-order execution may lead to preprocessing delays that affect overall real-time performance.',
  },
  {
    name: 'CVA6',
    kind: 'CPU',
    perf: null,
    power: 'B',
    area: null,
    outcome: 'selected',
    reasoning:
      'Selected. Object detection needs real-time image processing, so the CPU must balance computational throughput and energy efficiency; CVA6’s out-of-order execution capability meets the real-time requirement.',
  },
  {
    name: 'Gemmini',
    kind: 'NPU',
    perf: 'A',
    power: null,
    area: null,
    outcome: 'excluded',
    reasoning: 'Excluded: its high power consumption exceeds the budget.',
  },
  {
    name: 'VTA',
    kind: 'NPU',
    perf: 'C',
    power: null,
    area: 'B',
    outcome: 'considered',
    reasoning:
      'Retained as an alternative, but limited model compatibility and AXI-Lite interface constraints may introduce preprocessing bottlenecks affecting end-to-end latency.',
  },
  {
    name: 'NVDLA',
    kind: 'NPU',
    perf: 'B',
    power: null,
    area: 'C',
    outcome: 'selected',
    reasoning:
      'Selected: a dedicated CNN acceleration architecture and a native AXI interface provide higher throughput while maintaining power consumption, ensuring real-time processing.',
  },
];

export const example1Prompt =
  'Please design an SoC for edge AI inference with the following specifications: low power consumption (<500mW)';
