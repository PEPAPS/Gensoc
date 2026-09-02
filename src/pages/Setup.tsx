import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';

const TOOLS = [
  {
    term: 'MetaGPT',
    name: 'MetaGPT',
    role: 'Multi-agent framework',
    what: 'The open-source framework GenSoC is developed on. It provides the agent roles, their actions, and the structured message passing between them.',
    licence: 'open' as const,
  },
  {
    term: 'DeepSeek-Reasoner',
    name: 'DeepSeek-Reasoner',
    role: 'The LLM behind each agent',
    what: 'Every agent is integrated with a DeepSeek-Reasoner model. The paper cites DeepSeek-R1.',
    licence: 'api' as const,
  },
  {
    term: 'Synopsys VCS',
    name: 'Synopsys VCS',
    role: 'Functional verification',
    what: 'Runs the RTL simulation for each design case. This is the tool inside the validator’s loop.',
    licence: 'commercial' as const,
  },
  {
    term: 'Cadence Genus',
    name: 'Cadence Genus',
    role: 'Logic synthesis',
    what: 'Maps the RTL onto gates from the technology library.',
    licence: 'commercial' as const,
  },
  {
    term: 'Cadence Innovus',
    name: 'Cadence Innovus',
    role: 'Backend / physical implementation',
    what: 'Place and route. Table III’s numbers come out of this stage.',
    licence: 'commercial' as const,
  },
  {
    term: 'PDK',
    name: 'TSMC 22 nm',
    role: 'Process technology',
    what: 'The commercial process node both cases were implemented in.',
    licence: 'nda' as const,
  },
  {
    term: 'SRAM',
    name: 'SRAM compiler',
    role: 'Memory generation',
    what: 'A commercial tool used to generate the SRAM blocks. The paper does not name the vendor.',
    licence: 'commercial' as const,
  },
];

const BADGE = {
  open: { label: 'Open source', colour: 'var(--background-claim)' },
  api: { label: 'Paid API', colour: 'var(--fg-muted)' },
  commercial: { label: 'Commercial licence', colour: 'var(--unspecified)' },
  nda: { label: 'Commercial + NDA', colour: 'var(--c4)' },
};

export default function Setup() {
  return (
    <div className="page">
      <p className="eyebrow">Evaluation</p>
      <h1>Experimental setup</h1>
      <p className="lede">
        What GenSoC was built on, what it was run with, and which parts of that a reader could
        realistically obtain.
      </p>

      <Claim kind="paper" source="Section V-A">
        The framework was developed on MetaGPT, with each agent integrated with a DeepSeek-Reasoner
        model. Functional verification for each design case used Synopsys VCS; synthesis and backend
        used Cadence Genus and Innovus; the technology node was the commercial TSMC 22 nm process; a
        commercial SRAM compiler generated the SRAM. Comparisons were made against Chipyard, LiteX
        and ESP, and an in-house simulator was used to evaluate chip performance.
      </Claim>

      <h2>The toolchain</h2>
      <div className="grid grid-2">
        {TOOLS.map((t) => (
          <div className="card" key={t.name} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h4 style={{ margin: 0 }}>
                <T k={t.term}>{t.name}</T>
              </h4>
              <span className="chip" style={{ color: BADGE[t.licence].colour, borderColor: 'currentColor' }}>
                {BADGE[t.licence].label}
              </span>
            </div>
            <p className="small muted" style={{ marginBottom: '0.3rem' }}>
              {t.role}
            </p>
            <p className="small" style={{ marginBottom: 0 }}>
              {t.what}
            </p>
          </div>
        ))}
      </div>

      <h2>Where each tool sits in the flow</h2>
      <Figure caption="Only the top half is the generation loop. The bottom half is the evaluation, and it is the part that depends most heavily on commercial licensing.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 220" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Where each tool sits in the flow">
            <Defs />
            <rect x={6} y={6} width={588} height={92} rx={9} fill="none" stroke="var(--border)" strokeDasharray="5 4" />
            <text x={18} y={24} className="svg-label--sm">
              generation loop
            </text>
            <Box x={20} y={34} w={150} h={48} label="MetaGPT" sub="3 agents" stroke="var(--c1)" />
            <Arrow d="M 174 58 L 202 58" />
            <Box x={206} y={34} w={170} h={48} label="DeepSeek-Reasoner" sub="reasoning per agent" stroke="var(--c1)" />
            <Arrow d="M 380 58 L 408 58" />
            <Box x={412} y={34} w={168} h={48} label="Synopsys VCS" sub="simulate + verify" stroke="var(--c3)" />

            <Arrow d="M 300 100 L 300 122" accent />

            <rect x={6} y={126} width={588} height={88} rx={9} fill="none" stroke="var(--border)" strokeDasharray="5 4" />
            <text x={18} y={144} className="svg-label--sm">
              evaluation only — not part of generation
            </text>
            <Box x={20} y={152} w={140} h={48} label="Cadence Genus" sub="synthesis" />
            <Arrow d="M 164 176 L 192 176" />
            <Box x={196} y={152} w={140} h={48} label="Cadence Innovus" sub="place &amp; route" />
            <Arrow d="M 340 176 L 368 176" />
            <Box x={372} y={152} w={208} h={48} label="TSMC 22 nm + SRAM compiler" sub="post-P&amp;R power / area / freq" />
          </svg>
        </div>
      </Figure>

      <h2>What this means for reproducibility</h2>
      <Claim kind="inference">
        The two halves are not equally reachable. A reader with a DeepSeek API key, MetaGPT and an
        open simulator such as Verilator could in principle attempt the generation-and-verification
        loop — modulo the missing IP library and prompts. The evaluation half is a different matter:
        Genus, Innovus, the SRAM compiler and the TSMC 22 nm PDK all require commercial licences, and
        the PDK requires an NDA. No amount of effort substitutes for that access, so Table III’s
        numbers cannot be independently checked outside an institution that already has the flow.
      </Claim>

      <Claim kind="unspecified">
        The paper does not report the in-house simulator used to evaluate chip performance, LLM API
        cost or token usage, wall-clock runtime for either generation, how many generation attempts
        were made, or the versions of any tool. All of these would matter for a reproduction attempt.
      </Claim>

      <h2>The comparison baselines</h2>
      <p>
        Three open-source SoC generation frameworks, plus one homogeneous baseline generator:
      </p>
      <ul>
        <li>
          <strong>Chipyard</strong> — Berkeley’s Chisel-based framework, integrating generators for
          RISC-V CPUs and accelerators.
        </li>
        <li>
          <strong>LiteX</strong> — a Python/Migen-based SoC builder with a wide CPU selection and rich
          peripherals such as Ethernet and PCIe.
        </li>
        <li>
          <strong>ESP</strong> — Columbia’s tile-based platform, integrating CPU tiles and
          accelerator tiles.
        </li>
        <li>
          <strong>PULP Snitch</strong> — used separately to generate two <T k="homogeneous" />{' '}
          multi-core baselines, area-matched to Case A and Case B.
        </li>
      </ul>

      <Claim kind="inference">
        Area-matching the Snitch baselines is a good methodological choice — it removes “the
        heterogeneous chip is just bigger” as an explanation for the efficiency gap. The framework
        comparison in Table II has no equivalent control, which is why the energy results there need
        more care to interpret.
      </Claim>
    </div>
  );
}
