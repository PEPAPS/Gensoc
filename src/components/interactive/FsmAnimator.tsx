import { useEffect, useRef, useState } from 'react';
import { Arrow, Defs, Figure } from '../diagrams/svg';

/**
 * A write-channel state machine, animated.
 *
 * The shape (IDLE → WR_ADDR → WR_DATA → RESP) is the standard structure of an
 * AXI-style write, drawn here as teaching material. The paper does not publish
 * its extracted transition table, only that one exists.
 */

type StateId = 'IDLE' | 'WR_ADDR' | 'WR_DATA' | 'RESP';

const STATES: { id: StateId; x: number; y: number; meaning: string }[] = [
  { id: 'IDLE', x: 60, y: 60, meaning: 'Nothing in flight. Waiting for a request.' },
  { id: 'WR_ADDR', x: 220, y: 60, meaning: 'Address is on the bus. Waiting for the slave to accept it.' },
  { id: 'WR_DATA', x: 380, y: 60, meaning: 'Data is on the bus. Waiting for the slave to accept it.' },
  { id: 'RESP', x: 540, y: 60, meaning: 'Slave reports the outcome. Then back to idle.' },
];

const TRANSITIONS: { from: StateId; to: StateId; trigger: string }[] = [
  { from: 'IDLE', to: 'WR_ADDR', trigger: 'write request' },
  { from: 'WR_ADDR', to: 'WR_DATA', trigger: 'AWVALID && AWREADY' },
  { from: 'WR_DATA', to: 'RESP', trigger: 'WVALID && WREADY' },
  { from: 'RESP', to: 'IDLE', trigger: 'BVALID && BREADY' },
];

export function FsmAnimator() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => setI((v) => (v + 1) % STATES.length), 1400);
    return () => window.clearInterval(timer.current);
  }, [playing]);

  const current = STATES[i];
  const incoming = TRANSITIONS.find((t) => t.to === current.id)!;

  return (
    <Figure
      caption={
        <>
          A state machine is always in exactly one state, and only moves when its trigger condition
          holds on a clock edge. That is what makes protocols mechanically checkable — and it is
          exactly the table GenSoC’s integrator extracts from the protocol manual for the validator
          to compare against.
        </>
      }
    >
      <div className="controls">
        <button type="button" className="btn" onClick={() => setI((v) => (v + STATES.length - 1) % STATES.length)}>
          ← Step back
        </button>
        <button type="button" className={`btn ${playing ? 'btn--on' : ''}`} onClick={() => setPlaying((p) => !p)}>
          {playing ? '❙❙ Pause' : '▶ Play'}
        </button>
        <button type="button" className="btn" onClick={() => setI((v) => (v + 1) % STATES.length)}>
          Step forward →
        </button>
        <span className="stepper-count">
          State {i + 1} of {STATES.length}
        </span>
      </div>

      <div className="figure-scroll">
        <svg viewBox="0 0 660 150" width="100%" style={{ minWidth: 520 }} role="img" aria-label="Write-channel state machine">
          <Defs />
          {TRANSITIONS.slice(0, 3).map((t, n) => {
            const from = STATES.find((s) => s.id === t.from)!;
            return (
              <g key={t.from}>
                <Arrow
                  d={`M ${from.x + 46} 60 L ${STATES[n + 1].x - 46} 60`}
                  accent={current.id === t.to}
                  label={t.trigger}
                  labelX={(from.x + STATES[n + 1].x) / 2}
                  labelY={48}
                />
              </g>
            );
          })}
          {/* RESP wraps back round to IDLE underneath the row. */}
          <Arrow d="M 540 106 L 540 128 L 60 128 L 60 106" accent={current.id === 'IDLE'} />
          <text x={300} y={143} textAnchor="middle" className="svg-label--sm">
            BVALID &amp;&amp; BREADY — transaction complete, return to idle
          </text>

          {STATES.map((s) => {
            const on = s.id === current.id;
            return (
              <g key={s.id} className="selectable" onClick={() => setI(STATES.indexOf(s))}>
                <title>{s.meaning}</title>
                <circle
                  cx={s.x}
                  cy={60}
                  r={44}
                  fill={on ? 'var(--accent-soft)' : 'var(--bg-sunken)'}
                  stroke={on ? 'var(--accent)' : 'var(--border-strong)'}
                  strokeWidth={on ? 2.5 : 1.25}
                />
                <text
                  x={s.x}
                  y={65}
                  textAnchor="middle"
                  className="svg-label--head svg-label"
                  style={{ fill: on ? 'var(--accent)' : undefined, fontSize: 11.5 }}
                >
                  {s.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="card" style={{ marginBottom: 0 }} aria-live="polite">
        <h4 style={{ marginTop: 0 }}>
          <code>{current.id}</code>
        </h4>
        <p style={{ marginBottom: '0.5rem' }}>{current.meaning}</p>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Entered from <code>{incoming.from}</code> when <code>{incoming.trigger}</code> holds on a
          clock edge.
        </p>
      </div>
    </Figure>
  );
}
