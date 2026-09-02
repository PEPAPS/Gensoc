import { useState } from 'react';
import { Figure } from '../diagrams/svg';

/**
 * The paper's Fig. 5 worked debugging example, stepped through.
 *
 * Every fact here — the master stuck in SEND, the valid reaching the bridge, the
 * ready failing to trigger, and s_axi_wready moving from WR_DATA to WR_ADDR —
 * comes from Section IV-C. The presentation is this review's; the fault is the
 * paper's.
 */

type Step = {
  n: number;
  title: string;
  body: string;
  highlight: 'master' | 'bridge' | 'slave' | 'debug' | 'fsm' | 'fix';
};

const STEPS: Step[] = [
  {
    n: 1,
    title: 'Simulation stalls',
    body:
      'The master, bridge and slave are interconnected. During simulation the master gets stuck in its SEND state and never leaves. Nothing crashes; the test simply never completes.',
    highlight: 'master',
  },
  {
    n: 2,
    title: "The master's valid does reach the bridge",
    body:
      'So the outbound path is fine. The master asserted valid, the bridge saw it. Whatever is wrong is not on the way out.',
    highlight: 'bridge',
  },
  {
    n: 3,
    title: "The bridge's ready is triggered and fed back",
    body:
      'The bridge responds correctly and drives ready back towards the master. Both blocks, looked at individually, are behaving.',
    highlight: 'slave',
  },
  {
    n: 4,
    title: "But the master's input ready never triggers",
    body:
      'The handshake never completes, so the master waits forever in SEND. This is the actual symptom — and from a waveform alone it tells you very little about the cause.',
    highlight: 'master',
  },
  {
    n: 5,
    title: 'The run is reduced to a structured debug file',
    body:
      'Rather than handing an LLM a waveform, the validator extracts key simulation data into a structured file: master–slave relationships, cycle count, state, and per-signal details including name, direction, state and transition.',
    highlight: 'debug',
  },
  {
    n: 6,
    title: 'Compare that file against the protocol FSM',
    body:
      'The validator checks the observed behaviour against the state-machine transition table and the timing rules the SoC Integrator extracted from the protocol manual earlier. This is the state-machine signal comparison method.',
    highlight: 'fsm',
  },
  {
    n: 7,
    title: 'The fault: a signal assigned in the wrong state',
    body:
      'The trigger for s_axi_wready was placed in the WR_DATA state. It has to be asserted in WR_ADDR. Moving it there fixes the stall. The paper calls erroneous association of state-triggered signals with incorrect states a typical issue.',
    highlight: 'fix',
  },
];

const DEBUG_RECORD = `-cycle: 10
-module: master
-name: m_awvalid
-direction: out
-state: write
-transition: high
-target: bridge
-module: bridge
-name: awvalid
-direction: input
-state: write
...`;

const BEFORE = `always @(posedge clk) begin
  ...
  case (wr_state)
    ...
    WR_ADDR:
      ...
    WR_DATA:
      s_axi_wready <= 1'b1;   // ← wrong state
      ...
  endcase
end`;

const AFTER = `always @(posedge clk) begin
  ...
  case (wr_state)
    ...
    WR_ADDR:
      ...
      s_axi_wready <= 1'b1;   // ← moved here
    WR_DATA:
      ...
  endcase
end`;

export function DebugStepper() {
  const [i, setI] = useState(0);
  const s = STEPS[i];

  const boxStyle = (id: Step['highlight']) => ({
    fill: s.highlight === id ? 'var(--accent-soft)' : 'var(--bg-sunken)',
    stroke: s.highlight === id ? 'var(--accent)' : 'var(--border-strong)',
    strokeWidth: s.highlight === id ? 2 : 1.25,
  });

  return (
    <Figure
      caption={
        <>
          The paper’s own worked example, stepped through. The insight is in step 5: the model never
          reads a waveform. It reads a table, and compares it against another table.
        </>
      }
    >
      <div className="stepper-head">
        <button type="button" className="btn" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
          ← Previous
        </button>
        <span className="stepper-count">
          Step {s.n} of {STEPS.length}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
          disabled={i === STEPS.length - 1}
        >
          Next →
        </button>
      </div>

      <div className="figure-scroll">
        <svg viewBox="0 0 600 130" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Master, bridge and slave with a stalled handshake">
          <defs>
            <marker id="dbg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)" />
            </marker>
          </defs>

          <rect x={20} y={30} width={150} height={60} rx={7} style={boxStyle('master')} />
          <text x={95} y={55} textAnchor="middle" className="svg-label svg-label--head">
            master
          </text>
          <text x={95} y={72} textAnchor="middle" className="svg-label--sm">
            stuck in SEND
          </text>

          <rect x={225} y={30} width={150} height={60} rx={7} style={boxStyle('bridge')} />
          <text x={300} y={55} textAnchor="middle" className="svg-label svg-label--head">
            bridge
          </text>
          <text x={300} y={72} textAnchor="middle" className="svg-label--sm">
            IDLE → WRITE
          </text>

          <rect x={430} y={30} width={150} height={60} rx={7} style={boxStyle('slave')} />
          <text x={505} y={55} textAnchor="middle" className="svg-label svg-label--head">
            slave
          </text>
          <text x={505} y={72} textAnchor="middle" className="svg-label--sm">
            IDLE → WRITE
          </text>

          {/* valid travels right; ready is supposed to travel back left. */}
          <path d="M 172 48 L 222 48" className="svg-line" markerEnd="url(#dbg-arrow)" />
          <text x={197} y={40} textAnchor="middle" className="svg-label--sm">
            valid
          </text>
          <path d="M 377 48 L 427 48" className="svg-line" markerEnd="url(#dbg-arrow)" />

          <path
            d="M 222 76 L 172 76"
            className="svg-line"
            markerEnd="url(#dbg-arrow)"
            style={{ stroke: i >= 3 ? 'var(--c4)' : undefined, strokeDasharray: i >= 3 ? '4 3' : undefined }}
          />
          <text
            x={197}
            y={104}
            textAnchor="middle"
            className="svg-label--sm"
            style={{ fill: i >= 3 ? 'var(--c4)' : undefined }}
          >
            {i >= 3 ? 'ready — never triggers' : 'ready'}
          </text>
        </svg>
      </div>

      <div className="card" aria-live="polite">
        <h4 style={{ marginTop: 0 }}>
          Step {s.n} — {s.title}
        </h4>
        <p style={{ marginBottom: 0 }}>{s.body}</p>
      </div>

      {s.highlight === 'debug' && (
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Structured debug record</h4>
          <p className="small muted">
            The fields shown in the paper’s Fig. 5. This is a representation of those fields, not a
            published file format.
          </p>
          <pre style={{ marginBottom: 0 }}>{DEBUG_RECORD}</pre>
        </div>
      )}

      {s.highlight === 'fsm' && (
        <div className="table-wrap">
          <table>
            <caption className="small muted" style={{ captionSide: 'bottom', padding: '0.5rem 0.8rem', textAlign: 'left' }}>
              The shape of the extracted transition table. The paper states the table defines current
              state, trigger signals and next state; it does not publish the table itself.
            </caption>
            <thead>
              <tr>
                <th>State</th>
                <th>Trigger</th>
                <th>Next state</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>IDLE</code></td>
                <td><code>Valid</code></td>
                <td><code>WRITE</code></td>
              </tr>
              <tr>
                <td><code>WRITE</code></td>
                <td><code>Ready</code></td>
                <td><code>Read</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {s.highlight === 'fix' && (
        <div className="grid grid-2" style={{ marginBottom: 0 }}>
          <div>
            <p className="small" style={{ marginBottom: '0.4rem', color: 'var(--c4)' }}>
              <strong>Before — the bug</strong>
            </p>
            <pre style={{ marginBottom: 0 }}>{BEFORE}</pre>
          </div>
          <div>
            <p className="small" style={{ marginBottom: '0.4rem', color: 'var(--background-claim)' }}>
              <strong>After — the revision</strong>
            </p>
            <pre style={{ marginBottom: 0 }}>{AFTER}</pre>
          </div>
        </div>
      )}
    </Figure>
  );
}
