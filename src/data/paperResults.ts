/**
 * Every quantitative claim on the site comes from this file.
 *
 * Each value is traceable to a specific table or figure in:
 *   P. Yan, Q. Zhi, L. Liu, T. Jia, "GenSoC: A Multi-Agent-Assisted SoC
 *   Generation Methodology Leveraging Open-Source Hardware", ISLPED 2025.
 *
 * Nothing here is estimated, interpolated or rounded from a chart by eye - if a
 * number is not printed in the paper, it is not in this file.
 */

export const paperMeta = {
  title:
    'GenSoC: A Multi-Agent-Assisted SoC Generation Methodology Leveraging Open-Source Hardware',
  authors: ['Peiran Yan', 'Qinzhe Zhi', 'Lifeng Liu', 'Tianyu Jia'],
  affiliations: [
    'School of Integrated Circuits, Peking University, Beijing, China',
    'School of Software & Microelectronics, Peking University, Beijing, China',
  ],
  venue:
    '2025 IEEE/ACM International Symposium on Low Power Electronics and Design (ISLPED)',
  doi: '10.1109/ISLPED65674.2025.11261756',
  indexTerms: ['SoC', 'LLM Multi-Agent', 'Design Methodology'],
  funding: 'Supported in part by NSFC No. U23A6007.',
};

/** Table III - SoC specifications of the two generated cases (post-P&R). */
export type CaseSpec = {
  id: 'A' | 'B';
  name: string;
  target: string;
  pdk: string;
  frequency: string;
  totalPower: string;
  totalArea: string;
  blocks: { name: string; role: string; category: string }[];
  benchmarks: string[];
  energyDriver: string;
};

export const caseSpecs: CaseSpec[] = [
  {
    id: 'A',
    name: 'Case A — Edge AI inference',
    target: 'Edge AI',
    pdk: 'TSMC 22 nm',
    frequency: '500 MHz',
    totalPower: '332.4 mW',
    totalArea: '4 mm²',
    blocks: [
      { name: 'CVA6', role: 'Control and general-purpose computation', category: 'CPU' },
      { name: 'NVDLA', role: 'Neural-network inference (CNN acceleration)', category: 'NPU' },
      { name: 'DSP', role: 'Signal preprocessing', category: 'DSA' },
    ],
    benchmarks: ['Object tracking / object detection', 'Voice detection / speech recognition'],
    energyDriver:
      'The paper attributes Case A’s efficiency largely to its DSP, which relieves the CPU of signal-preprocessing load.',
  },
  {
    id: 'B',
    name: 'Case B — General-purpose mobile computing',
    target: 'General Mobile',
    pdk: 'TSMC 22 nm',
    frequency: '1 GHz',
    totalPower: '16.23 W',
    totalArea: '27.03 mm²',
    blocks: [
      { name: 'Xiangshan (dual-core)', role: 'High-performance general computation', category: 'CPU' },
      { name: 'Ventus', role: 'Rendering and parallel compute', category: 'GPU' },
      { name: 'Gemmini', role: 'Neural-network acceleration', category: 'NPU' },
      { name: 'H.264/H.265 encoder', role: 'Video encoding', category: 'DSA' },
      { name: 'Encryption unit', role: 'Cryptographic operations', category: 'DSA' },
      { name: 'DDR4 controller', role: 'External memory interface', category: 'I/O' },
    ],
    benchmarks: ['Virtual AI assistant', 'Augmented reality'],
    energyDriver:
      'The paper attributes Case B’s efficiency predominantly to its GPU, which substantially reduces the energy spent on image rendering.',
  },
];

/**
 * Fig. 7 - normalized energy cost. Every group is normalised to the GenSoC
 * case, so the GenSoC bar is 1 by construction. These are ratios, not joules.
 */
export type EnergyScenario = {
  scenario: string;
  caseId: 'A' | 'B';
  LiteX: number;
  Chipyard: number;
  ESP: number;
  GenSoC: number;
};

export const normalizedEnergy: EnergyScenario[] = [
  { scenario: 'Object detection', caseId: 'A', LiteX: 27.18, Chipyard: 5.12, ESP: 3.48, GenSoC: 1 },
  { scenario: 'Speech recognition', caseId: 'A', LiteX: 24.45, Chipyard: 2.82, ESP: 3.73, GenSoC: 1 },
  { scenario: 'AI assistant', caseId: 'B', LiteX: 29.67, Chipyard: 9.82, ESP: 13.48, GenSoC: 1 },
  { scenario: 'Augmented reality', caseId: 'B', LiteX: 24.45, Chipyard: 7.36, ESP: 4.94, GenSoC: 1 },
];

/**
 * Baseline architectures the comparison frameworks produced for Case A, per
 * the paper's Section V-C.
 */
export const caseABaselineArchitectures = [
  { framework: 'LiteX', architecture: 'CVA6', note: 'No DSA module, so all workloads run on the CPU.' },
  { framework: 'ESP', architecture: 'CVA6 + NVDLA', note: 'Has an NPU but no DSP.' },
  { framework: 'Chipyard', architecture: 'Rocket + Gemmini', note: 'Different CPU and NPU choice.' },
  { framework: 'GenSoC', architecture: 'CVA6 + NVDLA + DSP', note: 'The Case A configuration.' },
];

/** Fig. 8 - energy-efficiency gain over area-matched homogeneous PULP Snitch SoCs. */
export const heterogeneityGains = [
  { scenario: 'Object detection', caseId: 'A' as const, baseline: 'Snitch A', gain: 2.13 },
  { scenario: 'Speech recognition', caseId: 'A' as const, baseline: 'Snitch A', gain: 2.27 },
  { scenario: 'AI assistant', caseId: 'B' as const, baseline: 'Snitch B', gain: 2.46 },
  { scenario: 'Augmented reality', caseId: 'B' as const, baseline: 'Snitch B', gain: 2.79 },
];

/** Table II - comparison between SoC generation frameworks. */
export type FrameworkRow = {
  framework: string;
  cpus: number;
  dsa: number;
  io: string;
  socCombinations: number;
  interaction: string;
  extensibility: 'Hard' | 'Middle' | 'Easy';
  isThisPaper?: boolean;
};

export const frameworkComparison: FrameworkRow[] = [
  { framework: 'Chipyard', cpus: 4, dsa: 3, io: 'Few', socCombinations: 16, interaction: 'Chisel', extensibility: 'Hard' },
  { framework: 'LiteX', cpus: 19, dsa: 0, io: 'Many', socCombinations: 19, interaction: 'Python', extensibility: 'Hard' },
  { framework: 'ESP', cpus: 3, dsa: 1, io: 'Few', socCombinations: 6, interaction: 'GUI', extensibility: 'Middle' },
  { framework: 'GenSoC', cpus: 23, dsa: 26, io: 'Numerous', socCombinations: 598, interaction: 'Natural language', extensibility: 'Easy', isThisPaper: true },
];

/** The >24× development-time claim (Section V-C). */
export const developmentTime = {
  humanParticipants: 3,
  humanRole: 'graduate students',
  humanTask: 'manually complete the IP integration and verification',
  humanAverageHours: 4,
  gensocDuration: 'minutes',
  reportedSpeedup: '>24×',
  bottleneck:
    'The paper names verification as the most time-consuming phase for the students, because manually written code often contained bugs. Their time also included reading and locating the specific interfaces, then writing the interface adapter.',
};

export const headlineClaims = [
  {
    claim: 'Up to 27.18× and 29.67× lower energy cost',
    detail:
      'Versus SoCs generated by LiteX for Case A (object detection) and Case B (AI assistant) respectively. These are normalized ratios, not absolute joules.',
    source: 'Abstract; Fig. 7',
  },
  {
    claim: 'Up to 2.27× and 2.79× better energy efficiency',
    detail:
      'Versus area-matched homogeneous multi-core SoCs generated with PULP Snitch, for Case A and Case B respectively.',
    source: 'Fig. 8',
  },
  {
    claim: '>24× faster than manual integration and verification',
    detail:
      'Compared with three graduate students who averaged about four hours on the same task.',
    source: 'Section V-C',
  },
  {
    claim: 'More than 90 open-source IPs retrieved and reorganised',
    detail:
      'Across CPU, GPU, NPU, DSA and I/O categories, forming the framework’s foundation design resource.',
    source: 'Section IV-A; Table I',
  },
];
