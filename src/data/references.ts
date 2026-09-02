/**
 * Two separate lists, deliberately.
 *
 * `paperReferences` are entries from the paper's own bibliography, with their
 * original numbering. `backgroundSources` are external material used to explain
 * concepts to a beginner - they are NOT claims about GenSoC, and the site keeps
 * them visually distinct.
 */

export type PaperReference = {
  n: number;
  text: string;
  usedFor?: string;
};

/** Selected entries from the paper's reference list, keeping the paper's numbering. */
export const paperReferences: PaperReference[] = [
  { n: 1, text: 'F. Zaruba and L. Benini, "The cost of application-class processing: Energy and performance analysis of a Linux-ready 1.7-GHz 64-bit RISC-V core in 22-nm FDSOI technology," IEEE TVLSI, vol. 27, pp. 2629–2640, Nov 2019.', usedFor: 'CVA6' },
  { n: 3, text: 'NVIDIA Corporation, "NVDLA: NVIDIA Deep Learning Accelerator," http://nvdla.org/, 2017.', usedFor: 'NVDLA (Case A NPU)' },
  { n: 4, text: 'A. Pullini et al., "Mr. Wolf: An energy-precision scalable parallel ultra low power SoC for IoT edge processing," IEEE JSSC, vol. 54, no. 7, pp. 1970–1981, 2019.', usedFor: 'PULP — the homogeneous Snitch baselines' },
  { n: 5, text: 'A. Amid et al., "Chipyard: Integrated design, simulation, and implementation framework for custom SoCs," IEEE Micro, vol. 40, no. 4, pp. 10–21, 2020.', usedFor: 'Chipyard baseline' },
  { n: 6, text: 'F. Kermarrec, S. Bourdeauducq, J.-C. Le Lann and H. Badier, "LiteX: an open-source SoC builder and library based on Migen Python DSL," arXiv:2005.02506, 2020.', usedFor: 'LiteX baseline' },
  { n: 7, text: 'M. C. dos Santos et al., "A scalable methodology for agile chip development with open-source hardware components," ICCAD, 2022.', usedFor: 'ESP baseline' },
  { n: 11, text: 'X. Wang et al., "ChatCPU: An agile CPU design & verification platform with LLM," DAC, 2024.', usedFor: 'Prior LLM chip-design work that reached tapeout' },
  { n: 12, text: 'Y. Xu et al., "Towards developing high performance RISC-V processors using agile methodology," MICRO, pp. 1178–1199, 2022.', usedFor: 'Xiangshan (Case B CPU)' },
  { n: 13, text: 'J. Li et al., "Ventus: A high-performance open-source GPGPU based on RISC-V and its vector extension," ICCD, pp. 276–279, 2024.', usedFor: 'Ventus (Case B GPU)' },
  { n: 31, text: 'Apache Software Foundation, "VTA: Versatile Tensor Accelerator," https://github.com/apache/tvm-vta, 2022.', usedFor: 'VTA (Case A NPU candidate)' },
  { n: 32, text: 'H. Genc et al., "Gemmini: Enabling systematic deep-learning architecture evaluation via full-stack integration," DAC, 2021.', usedFor: 'Gemmini (Case B NPU)' },
  { n: 41, text: 'S. Hong et al., "MetaGPT: Meta programming for multi-agent collaborative framework," arXiv:2308.00352, 2023.', usedFor: 'The agent framework GenSoC is built on' },
  { n: 42, text: 'D. Guo et al., "DeepSeek-R1: Incentivizing reasoning capability in LLMs via reinforcement learning," arXiv:2501.12948, 2025.', usedFor: 'The model behind each agent' },
  { n: 43, text: 'C.-Y. Wang, I.-H. Yeh and H.-Y. Mark Liao, "YOLOv9: Learning what you want to learn using programmable gradient information," ECCV, pp. 1–21, 2024.', usedFor: 'Object-detection benchmark' },
  { n: 44, text: 'S. Gandhi, P. von Platen and A. M. Rush, "Distil-Whisper: Robust knowledge distillation via large-scale pseudo labelling," arXiv:2311.00430, 2023.', usedFor: 'Speech benchmark' },
  { n: 45, text: 'B. Kerbl, G. Kopanas, T. Leimkühler and G. Drettakis, "3D Gaussian splatting for real-time radiance field rendering," ACM TOG, vol. 42, no. 4, 2023.', usedFor: 'Augmented-reality benchmark' },
];

export type BackgroundSource = {
  topic: string;
  what: string;
  where: string;
};

export const backgroundSources: BackgroundSource[] = [
  { topic: 'AMBA / AXI / APB', what: 'Arm’s AMBA specifications define the AXI, AXI-Lite and APB protocols, including the channel structure and the VALID/READY handshake rules.', where: 'developer.arm.com — AMBA specifications' },
  { topic: 'RISC-V', what: 'The open instruction-set architecture underlying CVA6, Rocket, Xiangshan, OpenC910 and Ventus.', where: 'riscv.org — RISC-V specifications' },
  { topic: 'MetaGPT', what: 'The open-source multi-agent framework GenSoC is built on. Roles, actions and structured message passing between agents.', where: 'github.com/FoundationAgents/MetaGPT' },
  { topic: 'NVDLA', what: 'NVIDIA’s open deep-learning accelerator architecture, with configurable pipelines for convolution, activation and pooling.', where: 'nvdla.org' },
  { topic: 'Gemmini', what: 'A systolic-array accelerator generator from Berkeley, integrated with the Chipyard ecosystem.', where: 'github.com/ucb-bar/gemmini' },
  { topic: 'CVA6', what: 'A 6-stage, single-issue, in-order 64-bit application-class RISC-V core from the OpenHW Group.', where: 'github.com/openhwgroup/cva6' },
  { topic: 'Xiangshan', what: 'A high-performance open-source out-of-order RISC-V processor from ICT/BOSC.', where: 'github.com/OpenXiangShan/XiangShan' },
  { topic: 'Ventus', what: 'A RISC-V vector-extension GPGPU.', where: 'github.com/THU-DSP-LAB/ventus-gpgpu' },
  { topic: 'Chipyard', what: 'Berkeley’s Chisel-based SoC design, simulation and implementation framework.', where: 'chipyard.readthedocs.io' },
  { topic: 'LiteX', what: 'A Python/Migen-based open SoC builder with a large peripheral and CPU selection.', where: 'github.com/enjoy-digital/litex' },
  { topic: 'ESP', what: 'Columbia’s tile-based open-source SoC platform.', where: 'esp.cs.columbia.edu' },
  { topic: 'PULP Snitch', what: 'A lightweight RISC-V core and multi-core cluster from the PULP platform, used here to build the homogeneous baselines.', where: 'github.com/pulp-platform/snitch' },
  { topic: 'Open-source RTL tooling', what: 'Icarus Verilog and Verilator for simulation, Yosys for synthesis, GTKWave for waveform viewing — the beginner-accessible alternatives to the paper’s commercial flow.', where: 'Project sites for each tool' },
];

/**
 * Figures redrawn on the Figures page. `whatItShows` describes the paper's
 * figure; the site's own diagrams are original recreations, not reproductions.
 */
export const figureNotes = [
  { n: 1, caption: 'OSH IPs and the multi-agent design methodology in our framework.', whatItShows: 'The motivation. On one side, open-source IP that lacks structured organisation and documentation. On the other, SoC integration and verification that is labour-intensive, error-prone and hard to debug. Between them, the three agents.', site: '/problem' },
  { n: 2, caption: 'Overview of our multi-agent-assisted SoC generation framework GenSoC and its key steps in the workflow.', whatItShows: 'The whole framework in three panels: (A) IP refinement and selection, (B) SoC integration, (C) SoC verification — with the agent responsible for each.', site: '/architecture' },
  { n: 3, caption: 'IP library construction for existing OSH and IP selection.', whatItShows: 'Left: the tree-structured, three-level IP description — IP level, module level, code level. Right: the manager agent’s tabular think-process, grading candidate IPs on performance, power and area.', site: '/agents/ip-library-manager' },
  { n: 4, caption: 'Protocol-driven SoC integration flow and the generated files.', whatItShows: 'Left: protocol selection, information extraction and adapter generation, with the extracted protocol overview, signal table, FSM table and signal dependencies. Right: the hierarchical address regions and the three generated documents.', site: '/agents/soc-integrator' },
  { n: 5, caption: 'Agent SoC verification with state machine signal comparison method.', whatItShows: 'The master–bridge–slave scenario where the master is stuck in SEND, the structured debug record listing cycle/module/signal/direction/state, and the code revision that moves the s_axi_wready assignment from WR_DATA to WR_ADDR.', site: '/verification' },
  { n: 6, caption: 'Layout views of two generated SoCs.', whatItShows: 'Post-place-and-route floorplans. Case A is 2000 µm × 2000 µm with CVA6, NVDLA and DSP; Case B is 5300 µm × 5100 µm with Xiangshan, Ventus, Gemmini and I/O.', site: '/cases/edge-ai' },
  { n: 7, caption: 'Comparison of energy cost across different SoC frameworks.', whatItShows: 'Normalized energy cost for four scenarios, with each GenSoC case normalised to 1 and LiteX, Chipyard and ESP shown as multiples of it.', site: '/results' },
  { n: 8, caption: 'Efficiency improvement compared to homogeneous multi-core SoC.', whatItShows: 'Energy-efficiency gain of each heterogeneous case over an area-matched homogeneous PULP Snitch baseline.', site: '/results' },
];
