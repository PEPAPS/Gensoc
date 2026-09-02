import { useState } from 'react';
import { Claim } from '../components/Claim';
import { miniArchitecture, reproLevels } from '../data/reproduction';

export default function Reproduce() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="page">
      <p className="eyebrow">Reading it critically</p>
      <h1>How would I reproduce this as a beginner?</h1>
      <p className="lede">
        You cannot reproduce the paper — the refined IP library and the agent prompts are not
        published, and the physical-design evaluation needs commercial tools you probably do not
        have. You <em>can</em> build something with the same shape, and learn considerably more doing
        it than reading about it.
      </p>

      <Claim kind="unspecified">
        To be explicit about the gap: the paper does not release the 90+ IP library, the agent
        prompts and guidelines, the MetaGPT configuration, the tool scripts, or any generated RTL.
        What follows is a learning path this review constructed. It is not the paper’s methodology.
      </Claim>

      <Claim kind="background">
        Do not start with a commercial ASIC flow. Start with a counter, an open-source simulator and
        a waveform viewer. Every level below produces something that works before the next one is
        attempted — which is also, not coincidentally, the discipline that makes the multi-agent
        version tractable at the end.
      </Claim>

      <h2>Ten levels</h2>
      {reproLevels.map((l) => {
        const isOpen = open === l.n;
        return (
          <div className="card" key={l.n} style={{ paddingBottom: isOpen ? undefined : '0.9rem' }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : l.n)}
              aria-expanded={isOpen}
              style={{
                background: 'none',
                border: 0,
                padding: 0,
                font: 'inherit',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <span className="chip" style={{ flex: 'none' }}>
                  Level {l.n}
                </span>
                {l.title}
                <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 400 }}>
                  {isOpen ? '−' : '+'}
                </span>
              </h3>
              <p className="small muted" style={{ margin: '0.4rem 0 0' }}>
                {l.goal}
              </p>
            </button>

            {isOpen && (
              <div style={{ marginTop: '0.9rem' }}>
                <ul>
                  {l.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {l.tools && (
                  <p className="small">
                    <strong>Tools:</strong>{' '}
                    {l.tools.map((t) => (
                      <code key={t} style={{ marginRight: '0.4rem' }}>
                        {t}
                      </code>
                    ))}
                  </p>
                )}
                {l.caution && (
                  <p className="small muted" style={{ marginBottom: 0, borderLeft: '3px solid var(--border-strong)', paddingLeft: '0.75rem' }}>
                    {l.caution}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Claim kind="background">
        The open-source tools named above — Icarus Verilog, Verilator, Yosys, GTKWave — are
        beginner-accessible alternatives, not the tools the paper used. The paper used Synopsys VCS
        for simulation and Cadence Genus and Innovus for synthesis and backend. You will not
        reproduce Table III’s numbers with the open tools; you will be able to reproduce the
        functional-verification loop, which is where the interesting method lives anyway.
      </Claim>

      <h2>A suggested mini architecture</h2>
      <p>Three agents, three artifacts, at a scale one person can hold in their head:</p>

      <div className="grid grid-2">
        <div>
          <h4>Repository layout</h4>
          <pre>{miniArchitecture.tree}</pre>
        </div>
        <div>
          <h4>IP metadata</h4>
          <pre>{miniArchitecture.metadataExample}</pre>
          <h4>Structured debug record</h4>
          <pre>{miniArchitecture.debugLogExample}</pre>
        </div>
      </div>

      <h2>Two pieces of advice the paper implies but does not state</h2>
      <Claim kind="inference">
        <strong>Put the deterministic checks in code, not in the model.</strong> Whether two
        interfaces have matching widths, whether two address ranges overlap, whether a required
        signal exists — these are comparisons, not judgements. Writing them as ordinary code makes
        them fast, free and always right, and it leaves the model for the parts that genuinely need
        reasoning: which IP suits this workload, and why did this handshake stall.
      </Claim>

      <Claim kind="inference">
        <strong>Bound the loop.</strong> “Iterate until all tests pass” has no termination guarantee.
        Cap the iterations, record what changed on each pass, and fail loudly with the diff rather
        than silently continuing. A loop that quietly runs forty times has usually stopped making
        progress around pass four.
      </Claim>
    </div>
  );
}
