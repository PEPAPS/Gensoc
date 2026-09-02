import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';

export default function Problem() {
  return (
    <div className="page">
      <p className="eyebrow">The problem</p>
      <h1>Why is this hard in the first place?</h1>
      <p className="lede">
        Two pressures meet in this paper: chips are becoming more heterogeneous, and the open-source
        hardware that could supply that heterogeneity is difficult to reuse.
      </p>

      <h2>Pressure one — chips are becoming heterogeneous</h2>
      <p>
        For decades the answer to “make it faster” was “make the CPU better”. That has become
        expensive. The alternative is specialisation: instead of one processor that does everything
        adequately, several engines that each do one thing very well.
      </p>

      <Figure
        caption="Different workloads, different hardware. A CPU can do all of this — just not efficiently."
      >
        <div className="figure-scroll">
          <svg viewBox="0 0 600 130" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Workload to hardware mapping">
            <Defs />
            {[
              { l: 'CPU', s: 'general control', x: 10 },
              { l: 'GPU', s: 'parallel compute', x: 128 },
              { l: 'NPU', s: 'neural networks', x: 246 },
              { l: 'DSP', s: 'signal processing', x: 364 },
              { l: 'I/O', s: 'outside world', x: 482 },
            ].map((b) => (
              <Box key={b.l} x={b.x} y={20} w={108} h={54} label={b.l} sub={b.s} />
            ))}
            <text x={300} y={106} textAnchor="middle" className="svg-label--sm">
              one chip, several kinds of engine — each workload routed to the one that suits it
            </text>
          </svg>
        </div>
      </Figure>

      <Claim kind="background">
        The reason specialisation saves energy is that a general-purpose CPU spends most of its power
        on being general: fetching and decoding instructions, predicting branches, reordering, moving
        data through caches. A <T k="DSA">fixed-function accelerator</T> skips nearly all of that
        overhead — but only for the one job it was built for.
      </Claim>

      <Claim kind="paper" source="Section I">
        The paper’s framing: the SoC architecture integrates more and more heterogeneous dedicated
        accelerators targeting diverse workloads for better energy efficiency and performance, while
        conventional SoC design involves multiple design phases that are quite time-consuming and
        labour-intensive.
      </Claim>

      <h2>Pressure two — open-source hardware is hard to reuse</h2>
      <p>
        Reuse is the obvious answer to labour-intensive design, and the raw material exists: a great
        deal of usable open-source hardware sits on GitHub, from CPUs to GPUs to NPUs. The paper’s
        argument is that having the material is not the same as being able to use it.
      </p>

      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>What the paper says goes wrong</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>Existing IPs are organised in different documentation formats and language styles</li>
            <li>
              Some are written in <T k="HDL" />, others via <T k="HLS" /> — a difference in kind, not
              just in style
            </li>
            <li>Integrating new IPs into existing SoC platforms is inherently error-prone</li>
            <li>It requires substantial time and effort</li>
            <li>Existing platforms have limitations of IP scarcity and insufficient scalability</li>
          </ul>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>What that means concretely</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>You cannot tell from the README whether two blocks will connect</li>
            <li>
              Interfaces differ: one block speaks <T k="AXI" />, another <T k="AXI-Lite" />, a third
              something bespoke
            </li>
            <li>Bit widths differ, so data has to be packed or split</li>
            <li>
              Address ranges have to be assigned by hand, and overlaps are silent until something
              corrupts
            </li>
            <li>Every mismatch is only discovered in simulation, cycle by cycle</li>
          </ul>
        </div>
      </div>

      <Figure
        title="The gap the paper is trying to close"
        caption="Fig. 1 of the paper makes this same argument visually: unstructured IP on one side, labour-intensive integration on the other, and the three agents in between."
      >
        <div className="figure-scroll">
          <svg viewBox="0 0 600 210" width="100%" style={{ minWidth: 480 }} role="img" aria-label="From fragmented open-source IP to a verified SoC">
            <Defs />
            <rect x={10} y={20} width={170} height={120} rx={9} fill="none" stroke="var(--border-strong)" strokeDasharray="5 4" />
            <text x={95} y={40} textAnchor="middle" className="svg-label--head svg-label">
              Open-source IP
            </text>
            <text x={95} y={58} textAnchor="middle" className="svg-label--sm">
              plentiful, but:
            </text>
            <text x={95} y={78} textAnchor="middle" className="svg-label--sm">
              no structured organisation
            </text>
            <text x={95} y={95} textAnchor="middle" className="svg-label--sm">
              missing documents
            </text>
            <text x={95} y={112} textAnchor="middle" className="svg-label--sm">
              missing annotations
            </text>
            <text x={95} y={129} textAnchor="middle" className="svg-label--sm">
              inconsistent interfaces
            </text>

            <Arrow d="M 184 80 L 214 80" />

            <Box x={218} y={40} w={164} h={80} label="Manual integration" sub="read · wire · debug" />
            <text x={300} y={140} textAnchor="middle" className="svg-label--sm" style={{ fill: 'var(--c4)' }}>
              labour-intensive · error-prone
            </text>
            <text x={300} y={156} textAnchor="middle" className="svg-label--sm" style={{ fill: 'var(--c4)' }}>
              time-consuming · hard to debug
            </text>

            <Arrow d="M 386 80 L 416 80" />

            <Box x={420} y={40} w={170} h={80} label="Verified SoC" sub="the thing you wanted" />

            <rect x={218} y={172} width={164} height={30} rx={7} fill="var(--accent-soft)" stroke="var(--accent)" />
            <text x={300} y={192} textAnchor="middle" className="svg-label" style={{ fill: 'var(--accent)', fontWeight: 650 }}>
              GenSoC: 3 LLM agents here
            </text>
            <Arrow d="M 300 170 L 300 124" accent />
          </svg>
        </div>
      </Figure>

      <h2>Existing SoC frameworks — and why the paper is not satisfied</h2>
      <p>
        This is not virgin territory. Chipyard, LiteX and ESP all generate SoCs today, and the paper
        acknowledges them directly. Its objection is about breadth and effort: the number of
        available IPs within these frameworks is often limited, and integrating new ones is
        cumbersome.
      </p>

      <Claim kind="paper" source="Section II-A, Table II">
        Chipyard integrates generators for RISC-V CPUs and accelerators written in Chisel. LiteX is a
        Python-based SoC builder with a wide CPU selection and rich peripherals. ESP takes a
        tile-based approach, integrating CPU tiles and accelerator tiles. The paper counts 4, 19 and 3
        CPU options respectively against GenSoC’s 23, and 3, 0 and 1 accelerator options against
        GenSoC’s 26.
      </Claim>

      <Claim kind="inference">
        There is a category difference worth noticing. Chipyard and LiteX are generator frameworks:
        the blocks they support are ones somebody has written a generator for, and that integration
        work is what makes them reliable. GenSoC’s claim is that an agent can do that integration
        work per design instead — trading guaranteed correctness for reach. Whether that trade is
        worth it depends entirely on how often the verification loop actually converges, which is a
        number the paper does not report.
      </Claim>
    </div>
  );
}
