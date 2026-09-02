import { Figure } from './svg';

/**
 * Schematic floorplans for the two generated SoCs.
 *
 * The die dimensions and the set of blocks are from the paper's Fig. 6. The
 * *sizes and positions of the blocks within the die are not* — Fig. 6 is a
 * layout screenshot, and the paper publishes no per-block areas. These
 * rectangles are drawn for legibility and are explicitly labelled as schematic.
 */

type Block = { name: string; sub?: string; x: number; y: number; w: number; h: number; colour: string };

const CASE_A: Block[] = [
  { name: 'NPU', sub: 'NVDLA', x: 8, y: 8, w: 52, h: 46, colour: 'var(--c2)' },
  { name: 'CPU', sub: 'CVA6', x: 8, y: 58, w: 40, h: 34, colour: 'var(--c1)' },
  { name: 'DSP', x: 52, y: 58, w: 40, h: 34, colour: 'var(--c3)' },
  { name: 'I/O + memory', x: 64, y: 8, w: 28, h: 46, colour: 'var(--c6)' },
];

const CASE_B: Block[] = [
  { name: 'GPU', sub: 'Ventus', x: 46, y: 6, w: 48, h: 44, colour: 'var(--c5)' },
  { name: 'CPU', sub: 'Xiangshan ×2', x: 46, y: 54, w: 30, h: 40, colour: 'var(--c1)' },
  { name: 'NPU', sub: 'Gemmini', x: 80, y: 54, w: 14, h: 40, colour: 'var(--c2)' },
  { name: 'DSA + I/O', sub: 'encoder, crypto, DDR4', x: 6, y: 6, w: 36, h: 88, colour: 'var(--c6)' },
];

function Die({ blocks, width, height, label }: { blocks: Block[]; width: string; height: string; label: string }) {
  return (
    <svg viewBox="0 0 130 120" width="100%" style={{ maxWidth: 320 }} role="img" aria-label={`Schematic floorplan of ${label}`}>
      <rect x={4} y={4} width={96} height={96} rx={3} fill="var(--bg-sunken)" stroke="var(--border-strong)" strokeWidth={1.2} />
      {blocks.map((b) => (
        <g key={b.name}>
          <title>{b.sub ? `${b.name} — ${b.sub}` : b.name}</title>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill={b.colour} opacity={0.16} stroke={b.colour} strokeWidth={1} />
          <text x={b.x + b.w / 2} y={b.y + b.h / 2 + (b.sub ? -1 : 2)} textAnchor="middle" style={{ fontSize: 5.5, fill: 'var(--fg)', fontWeight: 600 }}>
            {b.name}
          </text>
          {b.sub && (
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 6} textAnchor="middle" style={{ fontSize: 4.2, fill: 'var(--fg-muted)' }}>
              {b.sub}
            </text>
          )}
        </g>
      ))}
      <text x={52} y={112} textAnchor="middle" style={{ fontSize: 5.5, fill: 'var(--fg-muted)' }}>
        {width}
      </text>
      <text x={112} y={52} textAnchor="middle" style={{ fontSize: 5.5, fill: 'var(--fg-muted)' }} transform="rotate(90 112 52)">
        {height}
      </text>
    </svg>
  );
}

export function Floorplan({ which }: { which: 'A' | 'B' | 'both' }) {
  const a = <Die blocks={CASE_A} width="2000 µm" height="2000 µm" label="Case A" />;
  const b = <Die blocks={CASE_B} width="5300 µm" height="5100 µm" label="Case B" />;

  return (
    <Figure
      caption={
        <>
          <strong>Schematic, not a reproduction.</strong> The die dimensions and the set of blocks are
          from the paper’s Fig. 6, which is a layout screenshot. The paper publishes no per-block
          areas, so the rectangles here are sized for legibility only — do not read relative area off
          them. Case B’s die is roughly seven times the area of Case A’s.
        </>
      }
    >
      <div className="grid grid-2" style={{ marginBottom: 0 }}>
        {(which === 'A' || which === 'both') && (
          <div>
            <h4 style={{ marginTop: 0 }}>Case A — 4 mm²</h4>
            {a}
          </div>
        )}
        {(which === 'B' || which === 'both') && (
          <div>
            <h4 style={{ marginTop: 0 }}>Case B — 27.03 mm²</h4>
            {b}
          </div>
        )}
      </div>
    </Figure>
  );
}
