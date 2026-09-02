import { Claim } from '../components/Claim';
import { PipelineStepper } from '../components/interactive/PipelineStepper';
import { pipelinePhases } from '../data/pipelineSteps';

export default function Pipeline() {
  return (
    <div className="page">
      <p className="eyebrow">How GenSoC works</p>
      <h1>From user prompt to verified SoC</h1>
      <p className="lede">
        Every phase, in order, from a sentence typed by a user to post-place-and-route numbers. Step
        through it, or read the whole table below.
      </p>

      <PipelineStepper />

      <Claim kind="inference">
        Notice where the loop is. Phases 0 through 12 run once. Phases 15 through 19 repeat until the
        tests pass, and the paper does not report how many times that typically is. If the loop needs
        many passes, the wall-clock cost is dominated by simulation time rather than by the model.
      </Claim>

      <h2>The whole pipeline at a glance</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="num">Phase</th>
              <th>Step</th>
              <th>Agent</th>
              <th>Artifact produced</th>
            </tr>
          </thead>
          <tbody>
            {pipelinePhases.map((p) => (
              <tr key={p.n}>
                <td className="num">{p.n}</td>
                <td>
                  <strong>{p.title}</strong>
                  <br />
                  <span className="small muted">{p.summary}</span>
                </td>
                <td className={`small agent-${p.agent}`}>
                  {p.agent === 'none' ? (
                    <span className="muted">evaluation</span>
                  ) : (
                    <span style={{ color: 'var(--agent)', fontWeight: 600 }}>
                      {p.agent === 'manager' ? 'Manager' : p.agent === 'integrator' ? 'Integrator' : 'Validator'}
                    </span>
                  )}
                </td>
                <td className="small">
                  {p.artifact ? <code>{p.artifact}</code> : <span className="muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Where the agents hand off</h2>
      <p>
        Three boundaries carry everything. If any of these artifacts is wrong, the following agent
        does careful work on a bad premise and the error only surfaces much later:
      </p>
      <ul>
        <li>
          <strong>Phase 5 → 6:</strong> the <code>design plan</code>. Wrong IP selection here means
          the integrator builds the wrong chip, correctly.
        </li>
        <li>
          <strong>Phase 12 → 13:</strong> the <code>SoC source</code> plus the three integration
          documents. If the address map and the RTL disagree, the tests will exercise the wrong
          addresses.
        </li>
        <li>
          <strong>Phase 8 → 17:</strong> the extracted <code>protocol FSM and timing rules</code>.
          This one skips two agents. If the extraction was wrong, the validator will confidently
          check the design against an incorrect specification — and both build and check would be
          wrong in the same direction.
        </li>
      </ul>

      <Claim kind="inference">
        That last risk is structural, not incidental. The same extraction is used to build the
        adapters and to judge them, so an extraction error is invisible to the check. An independent
        source of protocol truth — a formal AXI property set, say — would catch it; the paper does
        not describe one.
      </Claim>
    </div>
  );
}
