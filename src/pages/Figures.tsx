import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { figureNotes } from '../data/references';

export default function Figures() {
  return (
    <div className="page">
      <p className="eyebrow">Reference</p>
      <h1>The paper’s figures, explained</h1>
      <p className="lede">
        Eight figures carry most of the paper’s argument. This page says what each one shows and
        where on this site the same idea is redrawn.
      </p>

      <Claim kind="background">
        None of the paper’s figures are reproduced here. Each diagram on this site is an original
        drawing built to explain the same concept, which is why several of them look nothing like the
        originals — the paper’s figures are dense one-column research figures, and this site has room
        to spread out. Read the paper for the originals; the DOI is on the{' '}
        <Link to="/references">references page</Link>.
      </Claim>

      {figureNotes.map((f) => (
        <div className="card" key={f.n}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="chip" style={{ flex: 'none' }}>
              Fig. {f.n}
            </span>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{f.caption}</h3>
          </div>
          <p style={{ margin: '0.75rem 0' }}>{f.whatItShows}</p>
          <Link to={f.site} className="small">
            Where this site covers it →
          </Link>
        </div>
      ))}

      <h2>Tables</h2>
      <div className="grid grid-3">
        <div className="card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginTop: 0 }}>Table I</h4>
          <p className="small">
            Representative IPs in the established OSH IP library, with per-category counts: CPU 23,
            GPU 12, NPU 10, DSA 16, I/O 32.
          </p>
          <Link to="/agents/ip-library-manager" className="small">
            Browse it →
          </Link>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginTop: 0 }}>Table II</h4>
          <p className="small">
            Comparison between SoC generation frameworks — CPU count, accelerator count, I/O,
            combinations, interaction mode and extensibility.
          </p>
          <Link to="/results" className="small">
            See it, with caveats →
          </Link>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginTop: 0 }}>Table III</h4>
          <p className="small">
            SoC specifications of the two generated cases: PDK, target, frequency, total power, total
            area — all post-P&amp;R.
          </p>
          <Link to="/results" className="small">
            See it →
          </Link>
        </div>
      </div>

      <h2>Example 1</h2>
      <p>
        Not a figure, but the paper’s most revealing exhibit: a transcript excerpt of the IP library
        manager’s reasoning for Case A, showing the prompt, the think process, and the resulting
        grade table.
      </p>
      <Claim kind="inference">
        It is worth reading in the original. The reasoning is coherent and specific — it names
        OpenC910’s superscalar power draw, Rocket’s in-order execution, VTA’s AXI-Lite constraints —
        and it is also a single curated excerpt chosen by the authors. One good trace is evidence
        that the approach can work, not evidence about how often it does.
      </Claim>
      <Link to="/agents/ip-library-manager" className="small">
        Work through the selection interactively →
      </Link>
    </div>
  );
}
