import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { agents } from '../data/agents';

const agent = agents[1];

export default function AgentIntegrator() {
  return (
    <div className="page agent-integrator">
      <span className="agent-badge">Agent 2</span>
      <h1 style={{ marginTop: '0.5rem' }}>SoC Integrator</h1>
      <p className="lede">{agent.oneLine}</p>

      <Claim kind="paper" source={agent.paperSection}>
        For SoC integration the paper defines a protocol-driven integration method. Using an
        AMBA-based integration as its example, the integrator reads the target IO module and the AMBA
        protocol, then follows a three-step process: protocol selection, information extraction, and
        adapter generation.
      </Claim>

      <h2>What “integration” means</h2>
      <p>
        Connecting two hardware blocks is not like calling a function. There is no type checker. Two
        blocks connect correctly when their protocols match, their signal widths match, their clock
        and reset arrangements are compatible, their addresses do not collide, and their timing
        obeys the protocol’s ordering rules. Any one of those being wrong produces a design that
        elaborates cleanly and hangs in simulation.
      </p>

      <h2>The three steps</h2>

      <Figure caption="Protocol selection decides the target. Information extraction produces the rules. Adapter generation produces the glue — and the extracted rules are reused later by the validator.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 200" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Three-step protocol-driven integration">
            <Defs />
            <Box x={10} y={20} w={170} h={50} label="1 — Protocol selection" sub="AXI? AXI-Lite? APB?" stroke="var(--c2)" />
            <Arrow d="M 184 45 L 210 45" />
            <Box x={214} y={20} w={170} h={50} label="2 — Information extraction" sub="from the protocol manual" stroke="var(--c2)" />
            <Arrow d="M 388 45 L 414 45" />
            <Box x={418} y={20} w={172} h={50} label="3 — Adapter generation" sub="reuse, or write new" stroke="var(--c2)" />

            <Arrow d="M 300 72 L 300 96" />
            <rect x={150} y={100} width={300} height={76} rx={8} fill="var(--bg-sunken)" stroke="var(--border-strong)" />
            <text x={300} y={120} textAnchor="middle" className="svg-label--head svg-label">
              extracted from step 2
            </text>
            <text x={300} y={138} textAnchor="middle" className="svg-label--sm">
              protocol overview · signal table
            </text>
            <text x={300} y={154} textAnchor="middle" className="svg-label--sm">
              read/write FSM transition tables
            </text>
            <text x={300} y={170} textAnchor="middle" className="svg-label--sm">
              signal dependencies (timing rules)
            </text>
            <Arrow d="M 454 138 L 590 138" accent />
            <text x={520} y={192} textAnchor="middle" className="svg-label--sm">
              → to the validator
            </text>
          </svg>
        </div>
      </Figure>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Step 1 — Protocol selection</h3>
        <p>
          Choose the protocol appropriate to each IP’s characteristics. The paper states the rule
          plainly: <T k="APB" /> suits low-bandwidth peripherals; <T k="AXI" /> is preferred for
          high-bandwidth scenarios such as CPU–accelerator interactions.
        </p>
        <pre style={{ marginBottom: 0 }}>{`UART, GPIO, timers        → APB is sufficient
CPU ↔ NPU, CPU ↔ memory   → AXI is appropriate
control registers only    → AXI-Lite is enough`}</pre>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Step 2 — Information extraction</h3>
        <p>
          The integrator extracts key information from the AMBA manual. This is the step that turns a
          human-readable specification into something a program can check against:
        </p>
        <ul>
          <li>
            <strong>Protocol overview</strong> — what the protocol is for and how it is structured
          </li>
          <li>
            <strong>Signal table</strong> — every signal, its direction and its meaning
          </li>
          <li>
            <strong>Read and write state-machine transition tables</strong> — current state, trigger
            signal, next state
          </li>
          <li>
            <strong>Signal dependencies</strong> — the timing rules
          </li>
        </ul>

        <div className="table-wrap" style={{ marginBottom: '0.75rem' }}>
          <table>
            <thead>
              <tr>
                <th>Dependency</th>
                <th>Strictness</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>ARVALID</code> must precede <code>RVALID</code>
                </td>
                <td>Mandatory ordering</td>
              </tr>
              <tr>
                <td>
                  <code>ARREADY</code> is related to <code>ARVALID</code>
                </td>
                <td>Related, but not strictly required to follow it</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Both examples are the paper’s own. The distinction between them matters: a checker that
          treated every observed ordering as mandatory would flag correct designs constantly.
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Step 3 — Adapter generation</h3>
        <p>
          Reuse comes first. The paper names configurable adapters for bit-width adaptation (
          <code>axi adapter</code>) and protocol conversion (<code>axi fifo</code>,{' '}
          <code>axi axilite</code>). Only when there is no suitable interface adapter for an IP does
          the integrator write a new one — using the information extracted in step 2.
        </p>

        <Figure caption="An adapter sits between an IP's native interface and the bus the rest of the design speaks.">
          <div className="figure-scroll">
            <svg viewBox="0 0 600 110" width="100%" style={{ minWidth: 420 }} role="img" aria-label="Adapter between an IP and the SoC bus">
              <Defs />
              <Box x={20} y={30} w={150} h={50} label="IP interface" sub="whatever it happens to be" />
              <Arrow d="M 174 55 L 210 55" />
              <Box x={214} y={30} w={170} h={50} label="Adapter" sub="width + protocol conversion" stroke="var(--c2)" />
              <Arrow d="M 388 55 L 424 55" />
              <Box x={428} y={30} w={152} h={50} label="SoC bus" sub="the chosen protocol" />
            </svg>
          </div>
        </Figure>

        <Claim kind="unspecified">
          The paper does not describe the internal architecture of the generated adapters, does not
          list the full set of pre-defined adapter templates, and does not publish any generated
          adapter code. Do not read a specific implementation into the three names it does give.
        </Claim>
      </div>

      <h2>After integration — addresses and documents</h2>
      <Claim kind="paper" source="Section IV-B, Fig. 4">
        The SoC integrator scans all source IP codes after integration, modifies
        address-allocation-related code, and assigns memory address spaces. It then generates three
        key documents: the address mapping table, the register functional documentation, and the
        testpoint documentation.
      </Claim>

      <div className="grid grid-3">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Address mapping table</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Hierarchical, detailing each IP’s address information. Fig. 4 shows main regions
            containing sub-regions — a ROM region and an I/O region containing UART and GPIO.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Register functional documentation</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Register functions and their corresponding addresses. Without this, nobody — human or
            agent — knows what to write where.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Testpoint documentation</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            The IP features to be tested, focused primarily on integration connectivity. This is what
            the validator’s tests are written against.
          </p>
        </div>
      </div>

      <Claim kind="inference">
        The testpoint document is the quiet load-bearing piece. It scopes verification to integration
        connectivity — does everything talk to everything else correctly — rather than to whether each
        IP’s internal function is correct. That is a defensible scope for an integration tool, and it
        is narrower than “the SoC is verified”. The paper does not report coverage figures for it.
      </Claim>

      <h2>What the paper does not specify</h2>
      <Claim kind="unspecified">
        <ul style={{ marginBottom: 0 }}>
          {agent.notSpecified.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Claim>
    </div>
  );
}
