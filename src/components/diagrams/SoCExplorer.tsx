import { useState } from 'react';
import { Arrow, Box, Defs, Figure } from './svg';

/**
 * Clickable SoC block diagram. Selecting a block explains what it is for and,
 * where relevant, how the paper's two cases use it.
 *
 * The topology drawn here — compute masters on a wide bus, peripherals behind a
 * narrower one — is the standard AMBA arrangement, not a reproduction of any
 * GenSoC figure.
 */

type BlockId = 'cpu' | 'gpu' | 'npu' | 'dsp' | 'bus' | 'uart' | 'gpio' | 'ddr';

const INFO: Record<BlockId, { name: string; what: string; paper?: string }> = {
  cpu: {
    name: 'CPU — general-purpose processor',
    what:
      'Runs the control code and anything that has no dedicated hardware. It decides what the other blocks should do and when, and it is the block that boots and runs an operating system.',
    paper: 'Case A uses CVA6. Case B uses a dual-core Xiangshan.',
  },
  gpu: {
    name: 'GPU — parallel compute engine',
    what:
      'Thousands of small operations at once, all doing the same thing to different data. Graphics is the original use; anything data-parallel benefits.',
    paper: 'Case B integrates the Ventus GPU, which the paper credits for its lower rendering energy.',
  },
  npu: {
    name: 'NPU — neural-network accelerator',
    what:
      'Matrix multiplication and convolution in hardware. Far less energy per operation than a CPU doing the same maths, and useless for anything else.',
    paper: 'Case A uses NVDLA. Case B uses Gemmini.',
  },
  dsp: {
    name: 'DSP — digital signal processor',
    what:
      'Tuned for streams of samples: filters, transforms, multiply-accumulate loops. It sits between "general-purpose" and "fixed-function".',
    paper:
      'Case A includes a DSP, and the paper attributes much of Case A’s energy advantage to it taking signal preprocessing off the CPU.',
  },
  bus: {
    name: 'Interconnect — the on-chip bus',
    what:
      'Carries every transaction between blocks and arbitrates who transmits when. This is where protocol mismatches show up, and where GenSoC’s adapters live.',
    paper:
      'The paper’s worked example is AMBA-based: AXI for high-bandwidth paths such as CPU-to-accelerator, APB for low-bandwidth peripherals.',
  },
  uart: {
    name: 'UART — serial port',
    what:
      'The simplest way to get text off a chip. Two wires, a handful of registers, and the first thing you make work when bringing up a new design.',
  },
  gpio: {
    name: 'GPIO — general-purpose pins',
    what: 'Individually controllable pins software can read or drive. Buttons, LEDs, chip-select lines.',
  },
  ddr: {
    name: 'DDR controller — external memory',
    what:
      'Drives the DRAM chips outside the die, handling their timing, refresh and command scheduling. Anything that does not fit in on-chip SRAM lives out here.',
    paper: 'Case B integrates a DDR4 controller.',
  },
};

export function SoCExplorer() {
  const [sel, setSel] = useState<BlockId>('bus');
  const info = INFO[sel];

  const compute: { id: BlockId; label: string; sub: string; x: number }[] = [
    { id: 'cpu', label: 'CPU', sub: 'control', x: 30 },
    { id: 'gpu', label: 'GPU', sub: 'parallel', x: 175 },
    { id: 'npu', label: 'NPU', sub: 'neural nets', x: 320 },
    { id: 'dsp', label: 'DSP', sub: 'signals', x: 465 },
  ];
  const io: { id: BlockId; label: string; sub: string; x: number }[] = [
    { id: 'uart', label: 'UART', sub: 'serial', x: 65 },
    { id: 'gpio', label: 'GPIO', sub: 'pins', x: 245 },
    { id: 'ddr', label: 'DDR', sub: 'ext. memory', x: 425 },
  ];

  return (
    <Figure
      caption={
        <>
          Click any block. The hard part of building this is not drawing it — it is making every
          block agree on protocol, widths, addresses and timing, then proving in simulation that
          they do.
        </>
      }
    >
      <div className="figure-scroll">
        <svg viewBox="0 0 600 300" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Interactive System-on-Chip block diagram">
          <Defs />
          <rect x={8} y={8} width={584} height={284} rx={12} fill="none" stroke="var(--border)" strokeDasharray="6 4" />
          <text x={20} y={26} className="svg-label--sm">
            System-on-Chip
          </text>

          {compute.map((b) => (
            <g key={b.id}>
              <Box
                x={b.x}
                y={40}
                w={105}
                h={54}
                label={b.label}
                sub={b.sub}
                selected={sel === b.id}
                onClick={() => setSel(b.id)}
                title={INFO[b.id].name}
              />
              <Arrow d={`M ${b.x + 52} 94 L ${b.x + 52} 128`} accent={sel === b.id} />
            </g>
          ))}

          <text x={578} y={70} textAnchor="end" className="svg-label--sm">
            high bandwidth (AXI)
          </text>

          <Box
            x={30}
            y={130}
            w={540}
            h={44}
            label="Interconnect / bus"
            sub="arbitration, routing, protocol adaptation"
            selected={sel === 'bus'}
            onClick={() => setSel('bus')}
            title={INFO.bus.name}
          />

          <text x={578} y={202} textAnchor="end" className="svg-label--sm">
            low bandwidth (APB)
          </text>

          {io.map((b) => (
            <g key={b.id}>
              <Arrow d={`M ${b.x + 45} 174 L ${b.x + 45} 210`} accent={sel === b.id} />
              <Box
                x={b.x}
                y={212}
                w={90}
                h={50}
                label={b.label}
                sub={b.sub}
                selected={sel === b.id}
                onClick={() => setSel(b.id)}
                title={INFO[b.id].name}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="card" style={{ marginTop: '0.75rem', marginBottom: 0 }} aria-live="polite">
        <h4>{info.name}</h4>
        <p style={{ marginBottom: info.paper ? '0.65rem' : 0 }}>{info.what}</p>
        {info.paper && (
          <p className="small" style={{ marginBottom: 0, color: 'var(--paper)' }}>
            <b>In the paper:</b> <span className="muted">{info.paper}</span>
          </p>
        )}
      </div>
    </Figure>
  );
}
