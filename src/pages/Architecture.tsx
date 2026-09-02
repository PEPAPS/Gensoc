import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { AgentFlow } from '../components/diagrams/AgentFlow';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { agents } from '../data/agents';

export default function Architecture() {
  return (
    <div className="page">
      <p className="eyebrow">How GenSoC works</p>
      <h1>Architecture overview</h1>
      <p className="lede">
        Three agents, and — more importantly — the artifacts that move between them. The handoff is
        the architecture.
      </p>

      <AgentFlow />

      <h2>The three roles at a glance</h2>
      <div className="grid grid-3">
        {agents.map((a) => (
          <div className={`card agent-${a.id}`} key={a.id}>
            <span className="agent-badge">Agent {a.n}</span>
            <h4>{a.name}</h4>
            <p className="small">{a.oneLine}</p>
            <p className="small muted" style={{ marginBottom: '0.5rem' }}>
              {a.phase}
            </p>
            <Link className="small" to={`/agents/${a.id === 'manager' ? 'ip-library-manager' : a.id === 'integrator' ? 'soc-integrator' : 'soc-validator'}`}>
              Full page →
            </Link>
          </div>
        ))}
      </div>

      <h2>Hierarchical retrieval</h2>
      <p>
        A library of more than 90 IPs, each with descriptions at three levels of detail, does not fit
        into one prompt — and putting it there would be wasteful even if it did. The paper’s answer
        is to retrieve in stages.
      </p>

      <Figure caption="Narrow by type first, then by candidate, then load detail only for the shortlist. Each stage's output constrains the next stage's search.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 230" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Hierarchical retrieval-augmented generation">
            <Defs />
            <Box x={190} y={10} w={220} h={40} label="“Edge AI SoC, under 500 mW”" />
            <Arrow d="M 300 52 L 300 74" accent />

            <text x={20} y={72} className="svg-label--sm">
              Step 1 — identify IP types
            </text>
            <Box x={190} y={78} w={220} h={38} label="CPU · NPU · DSP" sub="which categories does this need?" />
            <Arrow d="M 300 118 L 300 138" accent />

            <text x={20} y={136} className="svg-label--sm">
              Step 2 — retrieve candidates
            </text>
            <Box x={140} y={142} w={320} h={38} label="CVA6 · Rocket · OpenC910 · NVDLA · VTA · Gemmini" sub="IP-level descriptions only" />
            <Arrow d="M 300 182 L 300 200" accent />

            <text x={20} y={198} className="svg-label--sm">
              Step 3 — load detail
            </text>
            <Box x={190} y={200} w={220} h={26} label="module + interface detail, shortlist only" />
          </svg>
        </div>
      </Figure>

      <Claim kind="paper" source="Section III">
        The paper states that a hierarchical RAG method helps agents access the OSH IP library by
        first identifying IP types and then retrieving details.
      </Claim>

      <Claim kind="inference">
        The three-level description scheme and the hierarchical retrieval are two halves of the same
        design. Retrieval by type only works if there is something type-shaped to retrieve — which is
        what the IP-level description provides. The library structure is not documentation for
        humans; it is an index built for the retrieval strategy.
      </Claim>

      <h2>Where the protocol knowledge comes from</h2>
      <p>
        One artifact deserves separate mention, because it crosses two agents. The integrator extracts
        the protocol’s <T k="FSM" /> transition tables and <T k="signal dependency">signal dependencies</T>{' '}
        while doing integration — and the validator then uses those same extracted rules as its
        reference when checking simulation behaviour.
      </p>

      <Figure caption="Extracted once by the integrator, used twice: to build the adapters, and to judge whether the result behaves.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 160" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Protocol rules extracted once and used twice">
            <Defs />
            <Box x={10} y={56} w={130} h={48} label="AMBA manual" />
            <Arrow d="M 144 80 L 174 80" />
            <Box x={178} y={56} w={150} h={48} label="SoC Integrator" sub="extracts structure" />
            <Arrow d="M 332 68 L 392 34" accent />
            <Arrow d="M 332 92 L 392 126" accent />
            <Box x={396} y={12} w={194} h={44} label="Adapter generation" sub="build it right" />
            <Box x={396} y={104} w={194} h={44} label="SoC Validator" sub="check it behaved right" />
            <text x={300} y={152} textAnchor="middle" className="svg-label--sm">
              signal tables · FSM transition tables · signal dependencies
            </text>
          </svg>
        </div>
      </Figure>

      <Claim kind="inference">
        This is what makes the verification method possible rather than merely aspirational. The
        validator is not asked to know AXI. It is handed a specification, in a form it can compare
        against, produced by the agent that just used that same specification to build the thing.
      </Claim>

      <h2>What the paper does not specify</h2>
      <Claim kind="unspecified">
        The <T k="MetaGPT" /> role definitions, the agent prompts and guidelines, the message formats
        between agents, the schema of the design plan and the debug file, the retriever’s embedding
        or indexing strategy, and how failures or disagreements between agents are handled. The paper
        describes the architecture; it does not publish the implementation.
      </Claim>
    </div>
  );
}
