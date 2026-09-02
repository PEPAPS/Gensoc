import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { caseABaselineArchitectures } from '../data/paperResults';

export default function Interpretation() {
  return (
    <div className="page">
      <p className="eyebrow">Evaluation</p>
      <h1>What the results actually mean</h1>
      <p className="lede">
        The numbers on the previous page are accurate. This page is about what they do and do not
        support — which is a different question, and the one that matters when deciding what to take
        away from the paper.
      </p>

      <h2>“27.18× energy efficiency improvement”</h2>
      <p>
        The headline figure. Here is what it is, precisely: on the object-detection workload, the SoC
        that LiteX generated consumed 27.18 times the energy that Case A consumed.
      </p>

      <Claim kind="background">
        First, the units. This is a <T k="normalized energy cost">normalized ratio</T>, not joules.
        The paper does not report absolute energy for these scenarios, so the figure supports
        statements of the form “A used N times less than B” and no statement at all about battery
        life, watt-hours, or how either design would compare against a commercial chip.
      </Claim>

      <Claim kind="paper" source="Section V-C">
        Second, the mechanism — and the paper states it plainly. LiteX’s disparity primarily stems
        from its lack of a DSA module, necessitating that all workloads run on the CPU. Case A’s
        superior efficiency is largely attributed to its DSP component.
      </Claim>

      <p>Put those together with what each framework actually generated for Case A:</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>Architecture generated</th>
              <th className="num">Object detection</th>
              <th className="num">Speech recognition</th>
            </tr>
          </thead>
          <tbody>
            {caseABaselineArchitectures.map((b) => {
              const energy: Record<string, [number, number]> = {
                LiteX: [27.18, 24.45],
                Chipyard: [5.12, 2.82],
                ESP: [3.48, 3.73],
                GenSoC: [1, 1],
              };
              return (
                <tr key={b.framework} className={b.framework === 'GenSoC' ? 'highlight' : undefined}>
                  <td>
                    <strong>{b.framework}</strong>
                  </td>
                  <td className="small">{b.architecture}</td>
                  <td className="num">{energy[b.framework][0]}×</td>
                  <td className="num">{energy[b.framework][1]}×</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Claim kind="inference">
        The table tells the story better than the headline does. LiteX is at 27× because it has no
        accelerator at all — a CPU running a CNN. ESP generated <em>CVA6 + NVDLA</em>: the same CPU
        and the same NPU as Case A. It is at 3.48×, and essentially all of that remaining gap is the
        DSP. So the comparison is measuring the value of adding a DSP to an edge-AI chip, which is a
        real and useful finding, and is not the same as measuring the quality of the generator.
      </Claim>

      <h2>So what does the comparison support?</h2>
      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0, color: 'var(--background-claim)' }}>Supported by the evidence</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>Heterogeneous designs beat CPU-only designs on these workloads, by a lot</li>
            <li>GenSoC made those architectural options reachable, and integrated them automatically</li>
            <li>Both designs reached place-and-route at their target frequencies</li>
            <li>
              Against area-matched homogeneous baselines, specialisation gave 2.13–2.79× — a
              controlled comparison
            </li>
            <li>Automating the integrate-and-verify loop saves substantial human time</li>
          </ul>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0, color: 'var(--c4)' }}>Not supported by the evidence</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>That GenSoC produces better RTL than Chipyard, LiteX or ESP would</li>
            <li>That an equally-configured baseline would still lose by 27×</li>
            <li>That the method works reliably across designs — n = 2</li>
            <li>That the generated designs are correct beyond the tests that were run</li>
            <li>That any of this would work in silicon; nothing was manufactured</li>
          </ul>
        </div>
      </div>

      <h2>The comparison the paper does not run</h2>
      <Claim kind="inference">
        The most informative missing experiment is the obvious one: take the same three baseline
        frameworks, have an experienced human configure each with the best architecture it can
        express for the workload, and compare against GenSoC’s output. That would separate “GenSoC
        chose a good architecture” from “GenSoC integrates faster than a person can”. Both are
        worthwhile claims; the current evaluation blends them.
      </Claim>

      <h2>“&gt;24× faster than graduate students”</h2>
      <Claim kind="inference">
        Directionally believable, quantitatively soft. Three participants, one task, no reported
        experience level, no reported variance, and no reported GenSoC runtime distribution to
        compare against. The paper also does not say whether the students’ four hours included
        debugging to full passing tests, or how many GenSoC attempts preceded the successful run. The
        useful takeaway is the qualitative one the paper itself supplies: verification dominated the
        manual effort, because hand-written integration code contained bugs.
      </Claim>

      <h2>What the strongest result actually is</h2>
      <Claim kind="inference">
        Not any of the ratios. It is Case B. A dual-core out-of-order CPU, a GPU, an NPU, a video
        encoder, a crypto unit and a DDR4 controller, integrated, verified in simulation, and carried
        through place and route to 27.03 mm² at 1 GHz. Whatever share of that involved human
        intervention the paper does not describe, assembling that design at all is a substantial
        systems result — and it is the part that would be hardest to fake.
      </Claim>

      <p>
        <Link to="/limitations">Next: the full list of limitations and open questions →</Link>
      </p>
    </div>
  );
}
