import type { ReactNode } from 'react';

/**
 * Shared SVG primitives for the site's diagrams.
 *
 * Everything is drawn with currentColor or CSS custom properties so a single
 * diagram renders correctly in both themes without a second copy.
 */

export function Figure({
  title,
  caption,
  children,
  wide,
}: {
  title?: string;
  caption?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <figure className="figure">
      {title && <h4 style={{ margin: '0 0 0.75rem' }}>{title}</h4>}
      <div className={wide ? 'figure-scroll' : undefined}>{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Arrow marker definitions. Include once per <svg>. */
export function Defs() {
  return (
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" className="svg-arrowhead" />
      </marker>
      <marker
        id="arrow-accent"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  fill,
  stroke,
  onClick,
  selected,
  title,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  fill?: string;
  stroke?: string;
  onClick?: () => void;
  selected?: boolean;
  title?: string;
}) {
  const interactive = Boolean(onClick);
  return (
    <g
      className={interactive ? 'selectable' : undefined}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {title && <title>{title}</title>}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        className={`svg-box${selected ? ' svg-box--on' : ''}`}
        style={fill || stroke ? { fill, stroke } : undefined}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 5 : h / 2 + 4)}
        textAnchor="middle"
        className="svg-label--head svg-label"
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className="svg-label--sm">
          {sub}
        </text>
      )}
    </g>
  );
}

export function Arrow({
  d,
  accent,
  dashed,
  label,
  labelX,
  labelY,
}: {
  d: string;
  accent?: boolean;
  dashed?: boolean;
  label?: string;
  labelX?: number;
  labelY?: number;
}) {
  return (
    <>
      <path
        d={d}
        className="svg-line"
        markerEnd={accent ? 'url(#arrow-accent)' : 'url(#arrow)'}
        style={{
          stroke: accent ? 'var(--accent)' : undefined,
          strokeDasharray: dashed ? '4 4' : undefined,
        }}
      />
      {label && labelX !== undefined && labelY !== undefined && (
        <text x={labelX} y={labelY} textAnchor="middle" className="svg-label--sm">
          {label}
        </text>
      )}
    </>
  );
}
