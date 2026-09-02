import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { agents } from '../data/agents';

const agent = agents[2];

export default function AgentValidator() {
  return (
    <div className="page agent-validator">
      <span className="agent-badge">Agent 3</span>
      <h1 style={{ marginTop: '0.5rem' }}>SoC Validator</h1>
      <p className="lede">{agent.oneLine}</p>

      <Claim kind="paper" source={agent.paperSection}>
        The paper employs a conventional SoC validation methodology, in which testing code is
        compiled into binary and loaded into the RAM model. The simulator is then invoked to drive the
        peripherals, and the simulation report is analysed to modify the source code. This process is
        iterated within the testbench until all tests are successfully completed.
      </Claim>

      <h2>The verification loop</h2>
      <Figure caption="A loop, not a pipeline. Each pass produces a report, the report produces a revision, and the revision produces another pass.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 260" width="100%" style={{ minWidth: 480 }} role="img" aria-label="The SoC validator's verification loop">
            <Defs />
            <Box x={210} y={10} w={180} h={40} label="Source code" />
            <Arrow d="M 300 52 L 300 72" />
            <Box x={210} y={76} w={180} h={40} label="Compiler" sub="test program → binary" />
            <Arrow d="M 300 118 L 300 138" />
            <Box x={190} y={142} w={220} h={40} label="Load into RAM model" />
            <Arrow d="M 414 162 L 452 162" />
            <Box x={456} y={142} w={134} h={40} label="Simulator" sub="VCS" stroke="var(--c3)" />
            <Arrow d="M 523 184 L 523 208" />
            <Box x={396} y={212} w={194} h={40} label="Structured debug file" stroke="var(--c3)" />

            <Arrow d="M 392 232 L 214 232" accent />
            <Box x={10} y={212} w={200} h={40} label="Compare vs protocol FSM" stroke="var(--c3)" />
            <Arrow d="M 110 210 L 110 32 L 206 32" accent />
            <text x={120} y={122} className="svg-label--sm">
              revise
            </text>
            <text x={120} y={136} className="svg-label--sm">
              and repeat
            </text>
          </svg>
        </div>
      </Figure>

      <h2>Why hardware debugging is different</h2>
      <p>
        In software, a bug usually means the wrong thing happened. In hardware, the most common bug
        is that the right thing happened at the wrong time — and the code, read line by line, looks
        entirely correct.
      </p>

      <Claim kind="background">
        A <T k="testbench" /> is simulation-only code that wraps the design: reset it, write a
        register, wait some cycles, check what came out. It is never manufactured. Everything it
        observes is measured in <T k="clock cycle">clock cycles</T>, and “correct value, one cycle
        late” is a failure.
      </Claim>

      <Claim kind="paper" source="Section IV-C">
        The paper’s own motivation for its verification method: while LLMs excel in handling code
        logic, they still have limitations in managing state machine signal triggers. The method
        exists specifically to address that weakness rather than to work around it.
      </Claim>

      <h2>State-machine signal comparison</h2>
      <p>
        This is the paper’s core verification contribution, and it is worth stating precisely. The
        validator does not read waveforms. It extracts key simulation data into a{' '}
        <strong>structured debug file</strong> containing:
      </p>
      <ul>
        <li>
          <T k="master" />–<T k="slave" /> relationships
        </li>
        <li>Cycle count</li>
        <li>State</li>
        <li>Signal details — name, direction, state, transition</li>
      </ul>
      <p>
        It then compares that file against the protocol state machine and timing signals that the SoC
        Integrator extracted earlier. A mismatch between what the protocol says should happen and
        what the simulation recorded is the fault location.
      </p>

      <Claim kind="inference">
        The reason this works is a reframing rather than a modelling advance. Reading a waveform is a
        perception task on continuous, high-volume, weakly-structured data. Comparing a table of
        observed transitions against a table of specified transitions is a symbolic task on small,
        structured data — and language models are markedly more reliable at the second. The paper
        does not frame it in these terms, but that is what the technique buys.
      </Claim>

      <p>
        <Link to="/verification">
          The paper’s worked debugging example, stepped through in full →
        </Link>
      </p>

      <h2>Tool execution</h2>
      <Claim kind="paper" source="Section III">
        Because current compilation and simulation tools lack suitable APIs, their commands are
        encapsulated in scripts. Agents adapt and execute these scripts, storing output files in
        specific locations for other agents.
      </Claim>
      <Claim kind="inference">
        Unglamorous, and load-bearing. An agent that cannot actually run the simulator can only
        speculate about what would happen. Everything the validator does depends on being able to
        execute a real tool and read a real result — which is also why the loop is bounded by
        wall-clock tool runtime rather than by model latency.
      </Claim>

      <h2>What the paper does not specify</h2>
      <Claim kind="unspecified">
        <ul style={{ marginBottom: 0 }}>
          {agent.notSpecified.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Claim>

      <Claim kind="inference">
        The missing iteration counts matter more than they might appear. “Iterate until all tests
        pass” describes a loop with no stated termination guarantee. Whether that loop typically
        closes in three passes or thirty — and how often it does not close at all — is the single
        most useful number a practitioner would want, and it is not in the paper.
      </Claim>
    </div>
  );
}
