import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { caseSpecs } from '../data/paperResults';

export default function Tldr() {
  return (
    <div className="page">
      <p className="eyebrow">Start here</p>
      <h1>The paper in two minutes</h1>
      <p className="lede">
        If you read nothing else on this site, read this page. Everything after it is elaboration.
      </p>

      <h2>The problem</h2>
      <p>
        A modern chip is an assembly job. You take a processor, an accelerator or two, a memory
        controller and some peripherals, and you connect them. Most of those blocks already exist as
        open-source hardware. The assembly is still slow and error-prone, because each project is
        written in a different style, documented to a different standard, and exposes a slightly
        different interface. Someone has to read all of it, make the interfaces line up, allocate
        addresses that do not collide, and then discover in simulation which connection is wrong.
      </p>

      <h2>The idea</h2>
      <p>Split that work across three <T k="LLM agent">LLM agents</T>, each with its own tools and guidelines:</p>
      <div className="grid grid-3">
        <div className="card agent-manager">
          <span className="agent-badge">Agent 1</span>
          <h4>IP Library Manager</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Reorganises open-source hardware into a structured, documented library, then reads the
            user’s natural-language request and picks the blocks that fit it.
          </p>
        </div>
        <div className="card agent-integrator">
          <span className="agent-badge">Agent 2</span>
          <h4>SoC Integrator</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Chooses a bus protocol per connection, extracts the protocol’s rules from its manual,
            builds adapters where interfaces do not match, allocates addresses, and writes the
            documentation verification will need.
          </p>
        </div>
        <div className="card agent-validator">
          <span className="agent-badge">Agent 3</span>
          <h4>SoC Validator</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Compiles a test program, simulates the design, reduces the run to a structured debug
            file, compares it against the protocol’s state machine, and revises the source. Loops
            until the tests pass.
          </p>
        </div>
      </div>

      <Claim kind="paper" source="Section III">
        The agents are not three independent chatbots. Each one’s output is the next one’s input, and
        the paper states that agents observe the actions of their predecessors, enabling smooth
        collaboration.
      </Claim>

      <h2>The one genuinely clever bit</h2>
      <p>
        Verification. The paper observes that <T k="LLM">LLMs</T> handle code logic well but struggle
        with state-machine signal triggers — timing, not logic. So instead of asking a model to read
        a waveform, the validator reduces the simulation to a structured record (cycle, module,
        signal, direction, state, transition) and compares that against the protocol’s state-machine
        transition table, which the integrator extracted earlier from the protocol manual.
      </p>
      <p>
        The model is comparing a table against a table. That is a task language models are actually
        good at. <Link to="/verification">The worked example, stepped through →</Link>
      </p>

      <h2>What they built with it</h2>
      <div className="grid grid-2">
        {caseSpecs.map((c) => (
          <div className="card" key={c.id}>
            <h4 style={{ marginTop: 0 }}>{c.name}</h4>
            <p className="small muted">{c.blocks.map((b) => b.name).join(' + ')}</p>
            <table style={{ fontSize: '0.82rem' }}>
              <tbody>
                <tr>
                  <td>Process</td>
                  <td className="num">{c.pdk}</td>
                </tr>
                <tr>
                  <td>Frequency</td>
                  <td className="num">{c.frequency}</td>
                </tr>
                <tr>
                  <td>Power</td>
                  <td className="num">{c.totalPower}</td>
                </tr>
                <tr>
                  <td>Area</td>
                  <td className="num">{c.totalArea}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p className="small muted">
        Table III. These are post-<T k="place and route">place-and-route</T> figures, so they reflect
        a real physical implementation rather than an RTL estimate. Neither chip was manufactured.
      </p>

      <h2>What they claim</h2>
      <ul>
        <li>
          Up to <strong>27.18×</strong> and <strong>29.67×</strong> lower energy cost than SoCs
          generated by LiteX, for Case A and Case B respectively. These are{' '}
          <T k="normalized energy cost">normalized ratios</T>, not joules.
        </li>
        <li>
          Up to <strong>2.27×</strong> and <strong>2.79×</strong> better energy efficiency than
          area-matched <T k="homogeneous" /> multi-core baselines.
        </li>
        <li>
          <strong>&gt;24×</strong> faster than three graduate students doing the same integration and
          verification by hand.
        </li>
      </ul>

      <h2>What to be sceptical about</h2>
      <Claim kind="inference">
        The energy comparison largely measures architecture, not the generator. The paper itself says
        LiteX loses because it has no accelerator module, so everything runs on the CPU — a human
        using LiteX who added a DSP would close much of that gap. Two SoCs and three students is a
        demonstration, not a statistical result. And the whole evaluation depends on commercial tools
        and a licensed 22 nm PDK, so the physical-design numbers cannot be independently checked
        without the same access. <Link to="/limitations">Full critique →</Link>
      </Claim>

      <Claim kind="unspecified">
        The refined 90+ IP library, the agent prompts and guidelines, the tool scripts and the
        generated RTL are not published in the paper. That is normal for a four-page conference
        paper, and it does mean the method cannot currently be reproduced as described.
      </Claim>
    </div>
  );
}
