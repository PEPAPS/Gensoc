import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { HeterogeneityChart, NormalizedEnergyChart } from '../components/charts/ResultCharts';
import { Box, Defs, Figure } from '../components/diagrams/svg';
import { caseSpecs, developmentTime, frameworkComparison } from '../data/paperResults';

export default function Results() {
  return (
    <div className="page">
      <p className="eyebrow">Evaluation</p>
      <h1>Results</h1>
      <p className="lede">
        Every number the paper reports, presented as reported. What they mean is a separate question,
        taken up on <Link to="/interpretation">the next page</Link>.
      </p>

      <h2>The two generated SoCs — Table III</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Case A</th>
              <th>Case B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PDK</td>
              <td>{caseSpecs[0].pdk}</td>
              <td>{caseSpecs[1].pdk}</td>
            </tr>
            <tr>
              <td>Target</td>
              <td>{caseSpecs[0].target}</td>
              <td>{caseSpecs[1].target}</td>
            </tr>
            <tr>
              <td>Frequency</td>
              <td className="num">{caseSpecs[0].frequency}</td>
              <td className="num">{caseSpecs[1].frequency}</td>
            </tr>
            <tr>
              <td>Total power</td>
              <td className="num">{caseSpecs[0].totalPower}</td>
              <td className="num">{caseSpecs[1].totalPower}</td>
            </tr>
            <tr>
              <td>Total area</td>
              <td className="num">{caseSpecs[0].totalArea}</td>
              <td className="num">{caseSpecs[1].totalArea}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small muted">Post-place-and-route results.</p>

      <h2>Framework comparison — Table II</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th className="num">CPUs</th>
              <th className="num">DSA</th>
              <th>I/O</th>
              <th className="num">SoC combinations</th>
              <th>Interaction</th>
              <th>Extensibility</th>
            </tr>
          </thead>
          <tbody>
            {frameworkComparison.map((f) => (
              <tr key={f.framework} className={f.isThisPaper ? 'highlight' : undefined}>
                <td>
                  <strong>{f.framework}</strong>
                </td>
                <td className="num">{f.cpus}</td>
                <td className="num">{f.dsa}</td>
                <td>{f.io}</td>
                <td className="num">{f.socCombinations}</td>
                <td>{f.interaction}</td>
                <td>{f.extensibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Claim kind="inference">
        Two of these columns are counts and the rest are the authors’ own labels. “Extensibility:
        Hard / Middle / Easy” and “I/O: Few / Many / Numerous” are judgements by the authors of the
        framework being favourably compared, with no stated rubric. The CPU and accelerator counts
        are checkable in principle; the qualitative columns are not, and should not be read as a
        neutral benchmark of framework quality.
      </Claim>

      <Claim kind="unspecified">
        The paper reports approximately 598 configuration schemes for GenSoC but does not give the
        formula behind that count, nor how many of those combinations have actually been generated
        and verified. Reachable combinations and validated combinations are different claims.
      </Claim>

      <h2>Normalized energy cost — Fig. 7</h2>
      <p>
        Four scenarios, four frameworks. Each group is normalised to its GenSoC case, which is why
        the GenSoC bar is exactly 1 everywhere.
      </p>

      <NormalizedEnergyChart />

      <Claim kind="background">
        <T k="normalized energy cost">Normalized</T> means expressed as a ratio to a chosen reference
        rather than in joules. A bar at 5.12 means “5.12 times the energy the GenSoC case used for
        this task”. It carries no information about absolute consumption, and the paper reports no
        absolute joules for these scenarios — so it would be wrong to read anything about battery
        life off this chart.
      </Claim>

      <h2>Heterogeneous vs homogeneous — Fig. 8</h2>
      <p>
        A separate comparison, with a different question: not “versus other frameworks”, but “versus
        the same silicon area spent on many identical cores”.
      </p>

      <HeterogeneityChart />

      <Figure caption="Same area budget, two ways to spend it. The paper's argument is that real workloads are a mixture, and a mixture of engines serves a mixture of work better.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 140" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Homogeneous versus heterogeneous chip">
            <Defs />
            <text x={20} y={20} className="svg-label--sm">
              Homogeneous — PULP Snitch baseline
            </text>
            {[0, 1, 2, 3].map((i) => (
              <Box key={i} x={20 + i * 140} y={28} w={130} h={38} label="CPU" />
            ))}

            <text x={20} y={92} className="svg-label--sm">
              Heterogeneous — the generated case
            </text>
            {['CPU', 'GPU', 'NPU', 'DSP'].map((n, i) => (
              <Box key={n} x={20 + i * 140} y={100} w={130} h={38} label={n} stroke={`var(--c${i + 1})`} />
            ))}
          </svg>
        </div>
      </Figure>

      <Claim kind="paper" source="Section V-C, Fig. 8">
        The baselines were generated with PULP Snitch and area-matched to Case A and Case B. Case A
        achieved 2.13× and 2.27× higher energy efficiency than Snitch A on object detection and
        speech recognition; Case B achieved 2.46× and 2.79× over Snitch B on AI assistant and
        augmented reality. The paper’s conclusion: while homogeneous multi-core can achieve high
        efficiency in specific operations such as matrix multiplication, heterogeneous architectures
        remain the superior choice for practical scenarios composed of diverse workloads.
      </Claim>

      <Claim kind="inference">
        This is the more defensible of the two energy comparisons, because area is controlled. The
        confound that dominates Fig. 7 — that the baselines simply lack accelerators — is exactly what
        is being measured here, deliberately and with a matched budget. A 2–2.8× advantage from
        specialisation is also a modest, credible number rather than a spectacular one.
      </Claim>

      <h2>Development time</h2>
      <div className="card">
        <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
          <div className="stat" style={{ marginBottom: 0 }}>
            <div className="stat-label">Manual, by hand</div>
            <div className="stat-value">≈ {developmentTime.humanAverageHours} hours</div>
            <div className="stat-note">
              Average across {developmentTime.humanParticipants} {developmentTime.humanRole}, who
              manually completed the IP integration and verification.
            </div>
          </div>
          <div className="stat" style={{ marginBottom: 0 }}>
            <div className="stat-label">GenSoC</div>
            <div className="stat-value">{developmentTime.gensocDuration}</div>
            <div className="stat-note">Reported speedup: {developmentTime.reportedSpeedup}.</div>
          </div>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          <strong>Where the students’ time went:</strong> {developmentTime.bottleneck}
        </p>
      </div>

      <Claim kind="inference">
        The detail about where the time went is the most informative part of this experiment. The
        bottleneck was verification, because hand-written code contained bugs — which is precisely
        the loop GenSoC automates. That makes the direction of the result unsurprising. The specific
        multiplier, drawn from three participants on one task, is not a measured constant, and the
        paper does not report GenSoC’s own runtime distribution to compare against.
      </Claim>
    </div>
  );
}
