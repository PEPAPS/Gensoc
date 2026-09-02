import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Box, Defs, Figure } from './svg';
import { agentHandoff } from '../../data/pipelineSteps';

/**
 * The framework's spine: three agents, and the artifacts that travel between
 * them. The artifacts are the point — this is a chain, not three chatbots.
 */

const ROUTES: Record<string, string> = {
  manager: '/agents/ip-library-manager',
  integrator: '/agents/soc-integrator',
  validator: '/agents/soc-validator',
};

const COLOURS: Record<string, string> = {
  manager: 'var(--c1)',
  integrator: 'var(--c2)',
  validator: 'var(--c3)',
};

export function AgentFlow() {
  const [sel, setSel] = useState<'manager' | 'integrator' | 'validator'>('manager');
  const active = agentHandoff.find((a) => a.id === sel)!;

  const cols = [
    { id: 'manager' as const, x: 20, label: 'IP Library Manager', sub: 'Agent 1' },
    { id: 'integrator' as const, x: 215, label: 'SoC Integrator', sub: 'Agent 2' },
    { id: 'validator' as const, x: 410, label: 'SoC Validator', sub: 'Agent 3' },
  ];

  return (
    <Figure
      caption={
        <>
          The agents are not independent. Each one’s output is the next one’s input, and the paper
          notes that agents observe the actions of their predecessors. Click an agent to see what it
          consumes and what it produces.
        </>
      }
    >
      <div className="figure-scroll">
        <svg viewBox="0 0 600 210" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Agent artifact handoff">
          <Defs />

          <text x={20} y={18} className="svg-label--sm">
            Phase A — IP refinement &amp; selection
          </text>
          <text x={215} y={18} className="svg-label--sm">
            Phase B — SoC integration
          </text>
          <text x={410} y={18} className="svg-label--sm">
            Phase C — SoC verification
          </text>

          {cols.map((c, i) => (
            <g key={c.id}>
              <Box
                x={c.x}
                y={30}
                w={170}
                h={58}
                label={c.label}
                sub={c.sub}
                selected={sel === c.id}
                onClick={() => setSel(c.id)}
                stroke={sel === c.id ? undefined : COLOURS[c.id]}
              />
              {i < cols.length - 1 && <Arrow d={`M ${c.x + 172} 59 L ${c.x + 193} 59`} accent />}
            </g>
          ))}

          {/* Artifact labels riding the handoff arrows. */}
          <text x={192} y={104} textAnchor="middle" className="svg-label--sm">
            design plan
          </text>
          <text x={387} y={104} textAnchor="middle" className="svg-label--sm">
            SoC + docs + FSM rules
          </text>

          {/* The validator's revision loop back onto the generated source. */}
          <Arrow d="M 580 88 L 580 150 L 300 150" dashed />
          <text x={440} y={166} textAnchor="middle" className="svg-label--sm">
            source revisions — loop until every test passes
          </text>

          <Arrow d="M 105 190 L 105 92" />
          <text x={105} y={204} textAnchor="middle" className="svg-label--sm">
            user requirement (natural language)
          </text>
        </svg>
      </div>

      <div className="grid grid-2" style={{ marginTop: '0.9rem', marginBottom: 0 }} aria-live="polite">
        <div className="card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginTop: 0 }}>{active.agent} — reads</h4>
          <ul style={{ marginBottom: 0 }}>
            {active.inputs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginTop: 0 }}>{active.agent} — produces</h4>
          <ul>
            {active.outputs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link to={ROUTES[active.id]} className="small">
            Full page on this agent →
          </Link>
        </div>
      </div>
    </Figure>
  );
}
