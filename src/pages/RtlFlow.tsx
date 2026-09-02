import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';

export default function RtlFlow() {
  return (
    <div className="page">
      <p className="eyebrow">Background</p>
      <h1>RTL, simulation and synthesis</h1>
      <p className="lede">
        How a hardware description becomes a chip, and why “it simulates correctly” is a much weaker
        statement than it sounds.
      </p>

      <h2>Hardware description languages</h2>
      <p>
        Hardware is described in an <T k="HDL" />, most often <T k="Verilog" /> or SystemVerilog. The
        syntax will look familiar. The semantics will not.
      </p>
      <pre>{`always @(posedge clk) begin
    if (reset)
        counter <= 0;
    else
        counter <= counter + 1;
end`}</pre>

      <Claim kind="background">
        This is not a loop. It describes a bank of flip-flops: on every rising edge of the clock, the
        counter register takes a new value. It does not run — it exists, permanently, and the
        described behaviour happens on every single clock edge for as long as the chip is powered.
        The <code>&lt;=</code> is a non-blocking assignment, meaning all such updates in this block
        happen simultaneously at the edge, not one after another.
      </Claim>

      <Claim kind="background">
        <T k="RTL">RTL (Register Transfer Level)</T> is the abstraction that describes this: which
        registers hold what, and what combinational logic sits between them. It is where most chip
        design work happens. Everything below it — gates, transistors, physical wires — is generated
        by tools.
      </Claim>

      <h2>The two things you can do with RTL</h2>
      <p>
        <strong>Simulate</strong> it, to ask whether it behaves correctly. Or <strong>synthesise</strong>{' '}
        it, to turn it into actual hardware. These are entirely different questions, run by different
        tools, answering different things.
      </p>

      <Figure caption="Simulation checks behaviour. Synthesis and P&R produce something buildable and tell you what it costs. Passing the first says nothing about the second.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 250" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Simulation and synthesis flows from RTL">
            <Defs />
            <Box x={210} y={14} w={180} h={44} label="RTL source" sub="Verilog / SystemVerilog" />

            <Arrow d="M 250 60 L 140 96" />
            <Arrow d="M 350 60 L 460 96" />

            <Box x={30} y={100} w={220} h={44} label="Simulator" sub="Synopsys VCS in the paper" />
            <Arrow d="M 140 146 L 140 176" />
            <Box x={30} y={180} w={220} h={52} label="Does it behave?" sub="functional verification" />

            <Box x={350} y={100} w={220} h={44} label="Logic synthesis" sub="Cadence Genus in the paper" />
            <Arrow d="M 460 146 L 460 176" />
            <Box x={350} y={180} w={220} h={52} label="Gate-level netlist" sub="then place &amp; route → layout" />
          </svg>
        </div>
      </Figure>

      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>
            <T k="simulation" />
          </h4>
          <p className="small">
            Runs the design as a model on a normal computer, cycle by cycle, driven by a{' '}
            <T k="testbench" />. Produces waveforms and pass/fail results. Cheap, fast, and the only
            practical way to find logic bugs early.
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Tells you nothing about area, power, or whether the design can hit its clock frequency.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>
            <T k="synthesis" />
          </h4>
          <p className="small">
            Maps the RTL onto real logic cells from a specific manufacturing technology’s library.
            Now the design has a gate count, an area, and a critical path.
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Needs a <T k="PDK" />, which for a commercial process means an NDA and a licence.
          </p>
        </div>
      </div>

      <h2>Place and route</h2>
      <p>
        <T k="place and route">P&amp;R</T> decides where each cell physically sits and routes the
        wires between them. It matters because wire length is delay: a design that meets timing on
        paper can fail once the wires are real.
      </p>
      <pre>{`gate-level netlist
      ↓  placement — where does each cell go?
      ↓  clock tree — the clock must arrive everywhere at once
      ↓  routing — connect everything without shorts
      ↓  timing closure — does it still meet the target frequency?
physical layout`}</pre>

      <Claim kind="paper" source="Section V-A, Table III">
        The paper carried both design cases through this flow with Cadence Innovus on TSMC 22 nm, and
        Table III reports post-P&amp;R numbers. That is meaningfully stronger evidence than an
        RTL-only estimate: the 332.4 mW and 4 mm² for Case A reflect a real physical implementation.
      </Claim>

      <h2>What none of this proves</h2>
      <Claim kind="inference">
        Passing simulation means the design behaved correctly on the stimuli the testbench applied.
        It is not a proof of correctness. It says nothing about the inputs nobody thought to try,
        about clock-domain crossings, about reset sequencing, about power intent, about timing across
        process corners, or about manufacturability. Between “simulates correctly” and “works in
        silicon” sit formal verification, gate-level simulation, static timing analysis, physical
        verification and a great deal of engineering judgement. The paper does not claim otherwise —
        but a reader coming from software should not read “verified” as “proven”.
      </Claim>

      <Claim kind="background">
        Nor was either design manufactured. <T k="tapeout" /> is the point at which a design is sent
        to a foundry, and it is expensive and irreversible. The paper cites ChatCPU as prior work
        that did fabricate an LLM-designed RISC-V CPU; GenSoC stops at post-P&amp;R evaluation.
      </Claim>
    </div>
  );
}
