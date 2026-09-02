import { Claim, ClaimTag } from '../components/Claim';
import { limitations, openQuestions } from '../data/critique';

const KIND = {
  paper: 'paper',
  inference: 'inference',
  'not-specified': 'unspecified',
} as const;

export default function Limitations() {
  return (
    <div className="page">
      <p className="eyebrow">Reading it critically</p>
      <h1>Limitations and open questions</h1>
      <p className="lede">
        None of what follows means the paper is bad. It is a four-page conference paper describing a
        substantial systems result, and four pages cannot carry a full reproducibility package. But a
        review that only praised it would be useless, so here is what a careful reader should hold
        back on.
      </p>

      {limitations.map((l) => (
        <div className="card" key={l.id}>
          <div style={{ marginBottom: '0.5rem' }}>
            <ClaimTag kind={KIND[l.verdict]} />
          </div>
          <h3 style={{ marginTop: 0 }}>{l.title}</h3>
          <p className="q">{l.question}</p>
          <p style={{ marginBottom: 0 }}>{l.finding}</p>
        </div>
      ))}

      <h2>What a follow-up paper would need to show</h2>
      <ul className="checklist">
        {openQuestions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <h2>Where scepticism is not warranted</h2>
      <Claim kind="inference">
        It is worth being clear about what is <em>not</em> in doubt. The two design cases were
        carried through synthesis and place and route in a commercial 22 nm process and reported with
        post-P&amp;R power, area and frequency. That is not a result one gets by accident, or by an
        LLM producing plausible-looking output — a design that does not elaborate does not route, and
        a design that does not meet timing does not report a frequency. Whatever share of the work
        involved human intervention, two complete heterogeneous SoCs exist at the end of it.
      </Claim>

      <Claim kind="inference">
        The state-machine signal comparison method also stands on its own merits, independent of the
        energy numbers. Reducing a simulation to a structured record and diffing it against a
        machine-readable protocol specification is a sound technique that would improve
        LLM-assisted verification whether or not the rest of GenSoC’s claims hold up. It is the part
        of the paper most worth borrowing.
      </Claim>

      <h2>How to read the paper responsibly</h2>
      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Take from it</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>The multi-agent decomposition, and the artifacts that connect the agents</li>
            <li>The three-level IP description as an index built for retrieval</li>
            <li>The separation of hard-constraint elimination from soft-constraint ranking</li>
            <li>Extracting protocol rules into machine-checkable form before generating anything</li>
            <li>State-machine signal comparison as a verification technique</li>
          </ul>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Hold back on</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>The 27.18× / 29.67× figures as evidence about the generator specifically</li>
            <li>The &gt;24× speedup as a measured constant</li>
            <li>The 598 combinations as validated designs</li>
            <li>Any assumption that the method is reproducible today</li>
            <li>Reading “verified” as anything stronger than “passed the tests that were written”</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
