import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Floorplan } from '../components/diagrams/Floorplan';
import { NormalizedEnergyChart } from '../components/charts/ResultCharts';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { caseABaselineArchitectures, caseSpecs } from '../data/paperResults';

const spec = caseSpecs[0];

export default function CaseA() {
  return (
    <div className="page">
      <p className="eyebrow">Evaluation</p>
      <h1>Case A — Edge AI inference</h1>
      <p className="lede">
        The smaller of the two generated designs, and the one the paper uses for its worked selection
        example: a <T k="CPU" />, an <T k="NPU" /> and a <T k="DSP" /> under a 500 mW budget.
      </p>

      <div className="grid grid-2">
        <div className="stat">
          <div className="stat-label">Process</div>
          <div className="stat-value">{spec.pdk}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Frequency</div>
          <div className="stat-value">{spec.frequency}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total power</div>
          <div className="stat-value">{spec.totalPower}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total area</div>
          <div className="stat-value">{spec.totalArea}</div>
        </div>
      </div>
      <p className="small muted">
        Table III. Post-<T k="place and route">place-and-route</T> results, not RTL estimates.
      </p>

      <h2>The architecture</h2>
      <Figure caption="Three compute engines with clearly separated roles. The DSP is the piece the baselines lack, and the piece the paper credits for the energy result.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 180" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Case A architecture">
            <Defs />
            <Box x={20} y={20} w={165} h={56} label="CVA6" sub="CPU — control" stroke="var(--c1)" />
            <Box x={215} y={20} w={165} h={56} label="NVDLA" sub="NPU — CNN inference" stroke="var(--c2)" />
            <Box x={410} y={20} w={165} h={56} label="DSP" sub="signal preprocessing" stroke="var(--c3)" />
            <Arrow d="M 102 78 L 102 106" />
            <Arrow d="M 297 78 L 297 106" />
            <Arrow d="M 492 78 L 492 106" />
            <Box x={20} y={110} w={555} h={44} label="Interconnect" sub="AXI for the accelerator paths" />
            <text x={297} y={172} textAnchor="middle" className="svg-label--sm">
              target: edge AI inference, total power 332.4 mW
            </text>
          </svg>
        </div>
      </Figure>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Block</th>
              <th>Category</th>
              <th>Role in the workload</th>
            </tr>
          </thead>
          <tbody>
            {spec.blocks.map((b) => (
              <tr key={b.name}>
                <td>
                  <strong>{b.name}</strong>
                </td>
                <td>{b.category}</td>
                <td className="small">{b.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How the design was arrived at</h2>
      <Claim kind="paper" source="Section V-C, Example 1">
        The paper reproduces part of the manager agent’s reasoning. OpenC910 was ruled out first for
        excessive power, narrowing the CPU choice to CVA6 and Rocket; CVA6 was chosen because object
        detection needs real-time processing and Rocket’s in-order execution may introduce
        preprocessing delays. For the NPU, Gemmini was excluded for exceeding the power budget,
        leaving NVDLA and VTA; NVDLA won on its dedicated CNN architecture and native AXI interface.
      </Claim>
      <p>
        <Link to="/agents/ip-library-manager">
          Work through that selection interactively on the Agent 1 page →
        </Link>
      </p>

      <Claim kind="inference">
        Two things stand out in that reasoning. First, the eliminations are on power and the
        selections are on architecture fit — the constraint filters, then judgement decides. Second,
        the NVDLA-over-VTA argument is partly an <em>integration</em> argument: NVDLA’s native AXI
        interface versus VTA’s AXI-Lite constraints. The selection agent is already reasoning about
        the integration work it is about to hand off.
      </Claim>

      <h2>The physical result</h2>
      <Floorplan which="A" />

      <h2>Benchmarks and energy</h2>
      <p>
        The paper evaluated Case A on two scenarios: object tracking / detection, and voice detection
        / speech recognition. Workloads are allocated to whichever block suits them — the CPU handles
        control, the NPU runs the network, the DSP handles preprocessing.
      </p>

      <NormalizedEnergyChart caseId="A" />

      <h3>What the baselines actually were</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>Architecture it generated</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {caseABaselineArchitectures.map((b) => (
              <tr key={b.framework} className={b.framework === 'GenSoC' ? 'highlight' : undefined}>
                <td>
                  <strong>{b.framework}</strong>
                </td>
                <td>{b.architecture}</td>
                <td className="small">{b.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Claim kind="paper" source="Section V-C">
        The paper is explicit about the mechanism: LiteX’s much higher energy cost stems primarily
        from its lack of a DSA module, which forces all workloads onto the CPU. Case A’s superior
        efficiency is largely attributed to its DSP component, which alleviates the signal
        preprocessing load traditionally borne by the CPU.
      </Claim>

      <Claim kind="inference">
        Read the baseline table alongside that quote and the result becomes much more specific than
        the headline suggests. ESP generated CVA6 + NVDLA — the same CPU and the same NPU as Case A.
        The entire remaining gap of 3.48× and 3.73× is essentially the DSP. That is a genuine and
        useful finding about heterogeneous design. It is a different claim from “GenSoC generates
        better SoCs than ESP”.
      </Claim>
    </div>
  );
}
