import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { heterogeneityGains, normalizedEnergy } from '../../data/paperResults';

/**
 * Charts for Fig. 7 and Fig. 8.
 *
 * Both are ratios. The axis is labelled as such, the GenSoC reference line at
 * 1 is drawn explicitly, and no unit is implied anywhere — the paper does not
 * report absolute joules for these scenarios.
 */

const AXIS = { fill: 'var(--fg-muted)', fontSize: 12 };
const GRID = 'var(--border)';

const SERIES = [
  { key: 'LiteX', colour: 'var(--c4)' },
  { key: 'Chipyard', colour: 'var(--c3)' },
  { key: 'ESP', colour: 'var(--c6)' },
  { key: 'GenSoC', colour: 'var(--c1)' },
] as const;

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong)',
        borderRadius: 8,
        padding: '0.55rem 0.7rem',
        fontSize: '0.82rem',
        boxShadow: 'var(--shadow)',
      }}
    >
      <strong>{label}</strong>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey}: <b>{p.value}×</b> the GenSoC case
        </div>
      ))}
    </div>
  );
}

export function NormalizedEnergyChart({ caseId }: { caseId?: 'A' | 'B' }) {
  const data = caseId ? normalizedEnergy.filter((d) => d.caseId === caseId) : normalizedEnergy;

  return (
    <div className="figure">
      <h4 style={{ marginTop: 0 }}>
        Normalized energy cost{caseId ? ` — Case ${caseId}` : ''}
      </h4>
      <p className="small muted">
        Lower is better. Every group is normalised to the GenSoC case, so the GenSoC bar is exactly 1
        by construction. These are ratios — the paper reports no absolute joules for these scenarios.
      </p>
      <div style={{ width: '100%', height: data.length > 2 ? 340 : 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 20, left: 8 }} barGap={2}>
            <CartesianGrid stroke={GRID} horizontal={false} />
            <XAxis
              type="number"
              tick={AXIS}
              stroke={GRID}
              domain={[0, 32]}
              label={{
                value: 'Energy cost, relative to the GenSoC case (×)',
                position: 'insideBottom',
                offset: -12,
                fill: 'var(--fg-muted)',
                fontSize: 12,
              }}
            />
            <YAxis type="category" dataKey="scenario" tick={AXIS} stroke={GRID} width={116} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--bg-sunken)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--fg-muted)' }} />
            {SERIES.map((s) => (
              <Bar key={s.key} dataKey={s.key} fill={s.colour} radius={[0, 3, 3, 0]}>
                <LabelList
                  dataKey={s.key}
                  position="right"
                  fontSize={11}
                  fill="var(--fg-muted)"
                  formatter={(v: number) => `${v}×`}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption>
        Recreation of the paper’s Fig. 7 from the values stated in Section V-C.
      </figcaption>
    </div>
  );
}

export function HeterogeneityChart() {
  const data = heterogeneityGains.map((d) => ({
    name: `${d.scenario}\n(Case ${d.caseId} vs ${d.baseline})`,
    scenario: d.scenario,
    gain: d.gain,
    caseId: d.caseId,
  }));

  return (
    <div className="figure">
      <h4 style={{ marginTop: 0 }}>Energy efficiency vs an area-matched homogeneous SoC</h4>
      <p className="small muted">
        Higher is better. Each heterogeneous case is compared against a homogeneous multi-core
        baseline generated with PULP Snitch and matched on area. A value of 1 would mean no
        advantage.
      </p>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 12, bottom: 40, left: 4 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="scenario" tick={AXIS} stroke={GRID} interval={0} angle={-12} textAnchor="end" height={56} />
            <YAxis
              tick={AXIS}
              stroke={GRID}
              domain={[0, 3]}
              label={{
                value: 'Efficiency gain (×)',
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--fg-muted)',
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ fill: 'var(--bg-sunken)' }}
              contentStyle={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-strong)',
                borderRadius: 8,
                fontSize: '0.82rem',
              }}
              formatter={(v: number) => [`${v}× better`, 'Efficiency']}
            />
            <Bar dataKey="gain" radius={[3, 3, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.scenario} fill={d.caseId === 'A' ? 'var(--c1)' : 'var(--c2)'} />
              ))}
              <LabelList dataKey="gain" position="top" fontSize={12} fill="var(--fg)" formatter={(v: number) => `${v}×`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption>
        Recreation of the paper’s Fig. 8. Blue is Case A against Snitch A; teal is Case B against
        Snitch B.
      </figcaption>
    </div>
  );
}
