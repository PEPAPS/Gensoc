import { useState } from 'react';
import { pipelinePhases } from '../../data/pipelineSteps';
import { ClaimTag } from '../Claim';

const AGENT_NAME = {
  manager: 'IP Library Manager',
  integrator: 'SoC Integrator',
  validator: 'SoC Validator',
  none: 'Evaluation (not part of the generation loop)',
} as const;

const PROVENANCE_KIND = {
  paper: 'paper',
  inference: 'inference',
  context: 'background',
} as const;

/** Previous / next walkthrough of all 21 phases, phase 0 through phase 20. */
export function PipelineStepper() {
  const [i, setI] = useState(0);
  const p = pipelinePhases[i];
  const last = pipelinePhases.length - 1;

  return (
    <div className={`agent-${p.agent}`}>
      <div className="stepper-head">
        <button type="button" className="btn" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
          ← Previous
        </button>
        <span className="stepper-count">
          Phase {p.n} of {pipelinePhases[last].n}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setI((v) => Math.min(last, v + 1))}
          disabled={i === last}
        >
          Next →
        </button>
        <button type="button" className="btn" onClick={() => setI(0)} disabled={i === 0}>
          Restart
        </button>
      </div>

      <div className="stepper-track" role="tablist" aria-label="Pipeline phases">
        {pipelinePhases.map((ph, n) => (
          <button
            key={ph.n}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`Phase ${ph.n}: ${ph.title}`}
            title={`Phase ${ph.n} — ${ph.title}`}
            className={`stepper-dot ${n === i ? 'current' : n < i ? 'done' : ''}`}
            onClick={() => setI(n)}
          />
        ))}
      </div>

      <div className="card" aria-live="polite">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span className="agent-badge">{AGENT_NAME[p.agent]}</span>
          <ClaimTag kind={PROVENANCE_KIND[p.provenance]} />
        </div>

        <h3 style={{ marginTop: 0 }}>
          Phase {p.n} — {p.title}
        </h3>
        <p className="lede" style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
          {p.summary}
        </p>
        <p style={{ marginBottom: p.artifact ? '0.85rem' : 0 }}>{p.detail}</p>

        {p.artifact && (
          <p className="small" style={{ marginBottom: 0 }}>
            <strong>Artifact produced:</strong> <code>{p.artifact}</code>
          </p>
        )}
      </div>
    </div>
  );
}
