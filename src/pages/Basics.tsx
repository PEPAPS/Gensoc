import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { SoCExplorer } from '../components/diagrams/SoCExplorer';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';

const ENGINES = [
  {
    term: 'CPU',
    title: 'CPU — the general-purpose one',
    what: 'Executes instructions one after another. Handles control-heavy work, branches, decisions, and can run an operating system.',
    goodAt: 'Anything. Branching logic, coordination, code you have not specialised for.',
    badAt: 'Doing one simple operation across a million data items. It will do it — just slowly, and at high energy cost per operation.',
    inPaper: '23 CPU options in the library. Case A: CVA6. Case B: dual-core Xiangshan.',
  },
  {
    term: 'GPU',
    title: 'GPU — the wide one',
    what: 'Hundreds or thousands of simple compute lanes running the same operation on different data at the same time.',
    goodAt: 'Graphics, rendering, and any workload where the same maths applies to a large array.',
    badAt: 'Branchy control code. If neighbouring lanes want to take different paths, most of them sit idle.',
    inPaper: '12 GPU entries. Case B integrates Ventus, which the paper credits for lower rendering energy.',
  },
  {
    term: 'NPU',
    title: 'NPU — the neural-network one',
    what: 'Hardware built around matrix multiplication and convolution, often as a grid of multiply-accumulate cells that data flows through.',
    goodAt: 'Neural-network inference, at a fraction of the energy a CPU would need for the same maths.',
    badAt: 'Everything else. And model shapes it was not designed for.',
    inPaper: '10 NPU entries. Case A: NVDLA. Case B: Gemmini. VTA was a Case A candidate.',
  },
  {
    term: 'DSP',
    title: 'DSP — the signal one',
    what: 'A processor whose instruction set is built around repeated multiply-accumulate work on streams of samples.',
    goodAt: 'Filtering, transforms, audio, radio, and preparing sensor data before it reaches an NPU.',
    badAt: 'General-purpose software. It is programmable, but not comfortably.',
    inPaper: 'Case A includes a DSP, and the paper attributes much of Case A’s energy advantage to it.',
  },
  {
    term: 'DSA',
    title: 'DSA — the fixed-purpose one',
    what: 'Hardware for one domain: a video encoder, an AES engine, a JPEG decoder. Often barely programmable at all.',
    goodAt: 'Its one job, at the best energy efficiency of anything on this page.',
    badAt: 'Changing. If the standard moves, the silicon does not.',
    inPaper: '16 DSA entries. Case B integrates an H.264/H.265 encoder and an encryption unit.',
  },
];

export default function Basics() {
  return (
    <div className="page">
      <p className="eyebrow">Background</p>
      <h1>Hardware basics</h1>
      <p className="lede">
        Everything on this page is standard domain knowledge rather than a claim about GenSoC. It is
        here so the rest of the site makes sense. If you already know what an SoC is, skip to{' '}
        <a href="#ip">what “IP” means</a>.
      </p>

      <h2>The compute engines</h2>
      <p>
        A modern chip contains several kinds of processor, not one. Each trades generality for
        efficiency at a different point.
      </p>

      {ENGINES.map((e) => (
        <div className="card" key={e.term}>
          <h3 style={{ marginTop: 0 }}>
            <T k={e.term}>{e.title}</T>
          </h3>
          <p>{e.what}</p>
          <div className="grid grid-2" style={{ marginBottom: '0.75rem' }}>
            <div>
              <p className="small" style={{ marginBottom: '0.2rem', color: 'var(--background-claim)' }}>
                <strong>Good at</strong>
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {e.goodAt}
              </p>
            </div>
            <div>
              <p className="small" style={{ marginBottom: '0.2rem', color: 'var(--c4)' }}>
                <strong>Bad at</strong>
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {e.badAt}
              </p>
            </div>
          </div>
          <p className="small" style={{ marginBottom: 0, color: 'var(--paper)' }}>
            <b>In the paper:</b> <span className="muted">{e.inPaper}</span>
          </p>
        </div>
      ))}

      <Claim kind="background">
        The categories overlap. A GPU, an NPU, a crypto engine and a video encoder can all reasonably
        be called domain-specific accelerators — the paper’s DSA category is the catch-all for
        specialised blocks that are not GPUs or NPUs. Do not read the boundaries as sharp.
      </Claim>

      <h2>I/O — talking to the outside world</h2>
      <p>
        None of the above is useful if the chip cannot reach anything. <T k="peripheral">Peripherals</T>{' '}
        handle that, and they are the low-bandwidth end of the design.
      </p>
      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>UART</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            A two-wire serial port. Slow, trivial to implement, and almost always the first thing you
            make work on a new chip — because printing text is how you find out whether anything else
            is working.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>GPIO</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Individually controllable pins. Software writes a register, a pin goes high. Buttons,
            LEDs, chip selects.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>SPI</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            A short-distance synchronous serial bus, used for flash memory, sensors and small
            displays.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>DDR controller</h4>
          <p className="small" style={{ marginBottom: 0 }}>
            Drives external DRAM. Substantially more complex than the others — DRAM has strict timing
            and needs periodic refresh — and it is what lets the chip use more memory than fits
            on-die.
          </p>
        </div>
      </div>

      <h2 id="ip">What “IP” means here</h2>
      <Claim kind="background">
        In chip design, <strong>IP does not mean Internet Protocol</strong>. It stands for
        Intellectual Property block, usually called an IP core: a reusable hardware module packaged
        so it can be dropped into a new design. The software analogue is a library — with the
        important difference that a library has an API, and an IP core has a set of physical wires
        whose timing behaviour is part of the contract.
      </Claim>

      <Figure caption="Reusable blocks combine into a system. The arrows are where the difficulty lives.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 170" width="100%" style={{ minWidth: 460 }} role="img" aria-label="IP blocks combining into an SoC">
            <Defs />
            {['CPU', 'GPU', 'NPU', 'UART', 'SPI', 'DDR'].map((n, i) => (
              <Box key={n} x={10 + i * 98} w={88} y={16} h={40} label={n} />
            ))}
            <text x={300} y={78} textAnchor="middle" className="svg-label--sm">
              reusable IP blocks
            </text>
            <Arrow d="M 300 86 L 300 112" accent />
            <Box x={170} y={116} w={260} h={44} label="System-on-Chip" sub="one die, one design, one set of rules" />
          </svg>
        </div>
      </Figure>

      <h2>What an SoC actually is</h2>
      <p>
        A <T k="SoC">System-on-Chip</T> puts all of it on one piece of silicon: the processors, the
        accelerators, the memory controllers, the peripherals, and the{' '}
        <T k="interconnect" /> that ties them together. Click through the diagram below.
      </p>

      <SoCExplorer />

      <Claim kind="background">
        The difficult part is not deciding which blocks to include. It is that every block must speak
        a compatible protocol, use matching signal widths, be assigned non-conflicting addresses,
        meet timing at the target clock frequency, and then survive functional verification. Any one
        of those going wrong produces a chip that looks correct in a block diagram and does not work.
      </Claim>

      <Claim kind="paper" source="Section III">
        This is precisely the labour GenSoC divides between its three agents: selection, integration
        and verification.
      </Claim>
    </div>
  );
}
