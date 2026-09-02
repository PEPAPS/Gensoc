import { useMemo, useState } from 'react';
import { example1Candidates, example1Prompt } from '../../data/ipLibrary';
import { Claim } from '../Claim';

/**
 * An educational recreation of the paper's Example 1 selection reasoning.
 *
 * This is NOT the GenSoC implementation. The candidates, exclusions, grades and
 * stated reasons are the paper's; the filtering interface is this review's, so a
 * reader can see hard-constraint elimination and soft-constraint ranking happen
 * separately.
 */

const GRADE_ORDER = { A: 0, B: 1, C: 2 } as const;

function Grade({ g }: { g: 'A' | 'B' | 'C' | null }) {
  if (!g) return <span className="muted small">not given</span>;
  const colour = g === 'A' ? 'var(--background-claim)' : g === 'B' ? 'var(--fg-muted)' : 'var(--unspecified)';
  return (
    <span className="chip" style={{ color: colour, borderColor: 'currentColor' }}>
      Grade {g}
    </span>
  );
}

export function IpSelectorDemo() {
  const [enforcePower, setEnforcePower] = useState(true);
  const [priority, setPriority] = useState<'perf' | 'power' | 'area'>('perf');

  const rows = useMemo(() => {
    const key = priority === 'perf' ? 'perf' : priority === 'power' ? 'power' : 'area';
    return (['CPU', 'NPU'] as const).map((kind) => {
      const all = example1Candidates.filter((c) => c.kind === kind);
      const surviving = enforcePower ? all.filter((c) => c.outcome !== 'excluded') : all;
      const ranked = [...surviving].sort((a, b) => {
        const ga = a[key];
        const gb = b[key];
        if (ga === gb) return 0;
        if (ga === null) return 1;
        if (gb === null) return -1;
        return GRADE_ORDER[ga] - GRADE_ORDER[gb];
      });
      return { kind, all, ranked };
    });
  }, [enforcePower, priority]);

  return (
    <div>
      <Claim kind="paper" source="Section V-C, Example 1">
        The user prompt the paper shows: <em>“{example1Prompt}”</em>
      </Claim>

      <div className="controls">
        <button
          type="button"
          className={`btn ${enforcePower ? 'btn--on' : ''}`}
          onClick={() => setEnforcePower((v) => !v)}
        >
          {enforcePower ? '✓ ' : ''}Hard constraint: power &lt; 500 mW
        </button>
        <span className="small muted">Rank survivors by:</span>
        {(
          [
            ['perf', 'performance'],
            ['power', 'power'],
            ['area', 'area'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn ${priority === id ? 'btn--on' : ''}`}
            onClick={() => setPriority(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.map(({ kind, all, ranked }) => (
        <div key={kind} className="card">
          <h4 style={{ marginTop: 0 }}>{kind} candidates</h4>

          {enforcePower && (
            <p className="small" style={{ color: 'var(--c4)' }}>
              Eliminated on the hard constraint:{' '}
              {all
                .filter((c) => c.outcome === 'excluded')
                .map((c) => c.name)
                .join(', ')}
            </p>
          )}

          <div className="table-wrap" style={{ marginBottom: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>IP</th>
                  <th>Perf</th>
                  <th>Power</th>
                  <th>Area</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c, n) => (
                  <tr key={c.name} className={c.outcome === 'selected' ? 'highlight' : undefined}>
                    <td className="num">{n + 1}</td>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <Grade g={c.perf} />
                    </td>
                    <td>
                      <Grade g={c.power} />
                    </td>
                    <td>
                      <Grade g={c.area} />
                    </td>
                    <td className="small">
                      {c.outcome === 'selected'
                        ? '✓ selected by the paper'
                        : c.outcome === 'excluded'
                          ? '✗ excluded on power'
                          : 'considered'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="small muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
            {all.map((c) => (
              <li key={c.name}>
                <strong style={{ color: 'var(--fg)' }}>{c.name}:</strong> {c.reasoning}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Claim kind="inference">
        Ranking by anything other than performance changes the order but not the paper’s outcome —
        the paper’s stated reason for both selections is a real-time throughput argument, not a grade
        comparison. The grades come from the paper’s result table; several cells in it are blank, and
        are shown here as “not given” rather than filled in.
      </Claim>

      <p className="small muted">
        This filtering interface is an educational recreation. It is not the GenSoC implementation,
        and the paper does not publish the selector’s prompts, scoring function or tie-breaking rules.
      </p>
    </div>
  );
}
