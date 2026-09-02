import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Floorplan } from '../components/diagrams/Floorplan';
import { NormalizedEnergyChart } from '../components/charts/ResultCharts';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { caseSpecs } from '../data/paperResults';

const spec = caseSpecs[1];

export default function CaseB() {
  return (
    <div className="page">
      <p className="eyebrow">Evaluation</p>
      <h1>Case B — General-purpose mobile computing</h1>
      <p className="lede">
        Six kinds of block on one die, at 1 GHz and 27 mm². Where Case A demonstrates the method on a
        focused design, Case B demonstrates it on a genuinely complicated one.
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
      <p className="small muted">Table III. Post-place-and-route results.</p>

      <h2>The architecture</h2>
      <Figure caption="Six block types, four of them accelerators. Every additional block type is another interface to match, another address range to allocate and another set of protocol interactions to verify.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 210" width="100%" style={{ minWidth: 500 }} role="img" aria-label="Case B architecture">
            <Defs />
            <Box x={10} y={16} w={140} h={54} label="Xiangshan ×2" sub="CPU — dual core" stroke="var(--c1)" />
            <Box x={160} y={16} w={130} h={54} label="Ventus" sub="GPU — rendering" stroke="var(--c5)" />
            <Box x={300} y={16} w={130} h={54} label="Gemmini" sub="NPU — inference" stroke="var(--c2)" />
            <Box x={440} y={16} w={150} h={54} label="H.264/H.265" sub="video encoder" stroke="var(--c3)" />

            {[80, 225, 365, 515].map((x) => (
              <Arrow key={x} d={`M ${x} 72 L ${x} 100`} />
            ))}

            <Box x={10} y={104} w={580} h={42} label="Interconnect" sub="AXI for the high-bandwidth paths" />

            <Arrow d="M 160 148 L 160 172" />
            <Arrow d="M 430 148 L 430 172" />
            <Box x={70} y={176} w={180} h={30} label="Encryption unit" stroke="var(--c4)" />
            <Box x={340} y={176} w={180} h={30} label="DDR4 controller" stroke="var(--c6)" />
          </svg>
        </div>
      </Figure>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Block</th>
              <th>Category</th>
              <th>Role</th>
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

      <h2>Heterogeneous workload assignment</h2>
      <p>
        The paper gives one concrete example of how a real task spreads across the blocks — the
        virtual AI assistant:
      </p>

      <Figure caption="One user-facing task, three different engines. This is what a heterogeneous chip is for.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 140" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Virtual AI assistant workload split across NPU, CPU and GPU">
            <Defs />
            <Box x={20} y={20} w={165} h={58} label="NPU (Gemmini)" sub="Llama3-8B text generation" stroke="var(--c2)" />
            <Arrow d="M 189 49 L 213 49" accent />
            <Box x={217} y={20} w={165} h={58} label="CPU (Xiangshan)" sub="TTS — text to speech" stroke="var(--c1)" />
            <Arrow d="M 386 49 L 410 49" accent />
            <Box x={414} y={20} w={165} h={58} label="GPU (Ventus)" sub="rendering the assistant" stroke="var(--c5)" />
            <text x={300} y={110} textAnchor="middle" className="svg-label--sm">
              workloads are dynamically allocated to the appropriate hardware module
            </text>
            <text x={300} y={128} textAnchor="middle" className="svg-label--sm">
              based on task requirements
            </text>
          </svg>
        </div>
      </Figure>

      <Claim kind="paper" source="Section V-C">
        The paper’s exact description of this workflow: the NPU executes the Llama3-8B model for text
        generation, the CPU processes the TTS model to convert text into speech, and the GPU handles
        the rendering task in the virtual assistant.
      </Claim>

      <Claim kind="background">
        Running an 8-billion-parameter model on an NPU inside a 22 nm mobile-class SoC is a
        substantial memory-bandwidth problem as much as a compute one — which is presumably part of
        why this design has a DDR4 controller. The paper reports no per-block power breakdown, memory
        bandwidth figures or achieved token rates, so treat the workflow as an architectural
        illustration rather than a measured deployment.
      </Claim>

      <h2>The physical result</h2>
      <Floorplan which="B" />

      <h2>Benchmarks and energy</h2>
      <p>
        Case B was evaluated on virtual AI assistant and augmented reality workloads.
      </p>

      <NormalizedEnergyChart caseId="B" />

      <Claim kind="paper" source="Section V-C">
        LiteX’s energy cost in these scenarios is 29.67× and 24.45× that of Case B; Chipyard records
        9.82× and 7.36×, and ESP 13.48× and 4.94×. The paper attributes Case B’s efficiency
        predominantly to its <T k="GPU" />, which significantly reduces the energy consumption of
        image rendering.
      </Claim>

      <Claim kind="inference">
        The same caveat as Case A, and more sharply. Both benchmark workloads here are
        rendering-heavy, and Case B is the only design in the comparison with a GPU. The result
        confirms something already well established — that dedicated rendering hardware beats
        software rendering by a large margin — and the interesting claim is not the ratio but that an
        agent pipeline assembled and verified a six-accelerator SoC at all.
      </Claim>

      <h2>Why this case is the more impressive demonstration</h2>
      <Claim kind="inference">
        Integration difficulty does not scale linearly with block count. Six block types means many
        more interface pairs to reconcile, a larger address space to partition without collision, and
        substantially more protocol interaction to verify — plus a DDR4 controller, which is among the
        harder blocks to integrate correctly in any design. That the pipeline produced a
        place-and-routed 27 mm² result at 1 GHz is a stronger signal about the method than the energy
        ratios are.
      </Claim>
    </div>
  );
}
