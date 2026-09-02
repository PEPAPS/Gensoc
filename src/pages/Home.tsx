import { Link } from 'react-router-dom';
import { Claim, claimLegend } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { AgentFlow } from '../components/diagrams/AgentFlow';
import { headlineClaims, paperMeta } from '../data/paperResults';
import { openQuestions } from '../data/critique';

export default function Home() {
  return (
    <div className="page">
      <div className="hero">
        <p className="eyebrow">Interactive paper review</p>
        <h1>GenSoC, explained from first principles</h1>
        <p className="lede" style={{ marginBottom: '1rem' }}>
          A research framework that uses three cooperating <T k="LLM agent">LLM agents</T> to select,
          connect and verify the building blocks of a chip. This site explains the whole paper for a
          programmer who has never designed hardware — starting at “what is a CPU?” and ending at how
          state-machine signal comparison finds a bug in generated <T k="RTL" />.
        </p>

        <p className="small muted" style={{ marginBottom: '1rem' }}>
          <strong>{paperMeta.title}</strong>
          <br />
          {paperMeta.authors.join(', ')} — {paperMeta.venue}
          <br />
          DOI {paperMeta.doi}
        </p>

        <div className="controls" style={{ marginBottom: 0 }}>
          <Link className="btn btn--primary" to="/tldr">
            Read the 2-minute version →
          </Link>
          <Link className="btn" to="/basics">
            I need the hardware basics first
          </Link>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem' }}>What the paper is about</h2>
      <p>
        Building a modern <T k="SoC" /> means assembling many pre-existing hardware blocks —{' '}
        <T k="IP">IP blocks</T> — into one chip. Plenty of good blocks already exist as{' '}
        <T k="OSH">open-source hardware</T>. Reusing them is still slow, because every project is
        structured differently, documented differently, and speaks a slightly different interface.
        Someone has to read all of it, wire it together, and then find out in simulation which of the
        connections is subtly wrong.
      </p>
      <p>
        GenSoC assigns those jobs to three specialised agents. One curates the block library and
        picks what fits the request. One wires the blocks together, generating adapters and address
        maps. One compiles a test program, simulates the result, and fixes what it finds — in a loop,
        until the tests pass.
      </p>

      <AgentFlow />

      <h2>What it reports</h2>
      <div className="grid grid-2">
        {headlineClaims.map((c) => (
          <div className="stat" key={c.claim}>
            <div className="stat-value">{c.claim}</div>
            <div className="stat-note">{c.detail}</div>
            <div className="stat-label" style={{ marginTop: '0.5rem' }}>
              {c.source}
            </div>
          </div>
        ))}
      </div>

      <Claim kind="inference">
        The energy figures deserve care. The paper is explicit that LiteX’s cost is high because it
        lacks an accelerator module, so all workloads land on the CPU. Much of the gap therefore
        measures the value of heterogeneous architecture, not the quality of the generation
        framework itself. That is still a real result — GenSoC is what made those architectural
        options reachable — but it is a narrower claim than the headline number suggests.{' '}
        <Link to="/interpretation">Unpacked in full here</Link>.
      </Claim>

      <h2>How to read this site</h2>
      <p>
        Every substantive statement carries one of four labels, so you can always tell what the paper
        said from what this review added:
      </p>
      <div className="grid grid-2">
        {claimLegend.map((l) => (
          <Claim kind={l.kind} key={l.kind}>
            {l.meaning}
          </Claim>
        ))}
      </div>
      <p>
        Terms with a dotted underline — <T k="AXI" />, <T k="FSM" />, <T k="PPA" /> — open a
        definition on hover, focus or tap. Every definition lives in the{' '}
        <Link to="/glossary">glossary</Link> and is written exactly once.
      </p>

      <h2>Questions this review leaves open</h2>
      <p>
        The paper is four pages in a conference proceedings, and a great deal is necessarily left
        out. Rather than filling those gaps with plausible-sounding invention, the site names them:
      </p>
      <ul>
        {openQuestions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <p>
        <Link to="/limitations">Read the critical review →</Link>
      </p>
    </div>
  );
}
