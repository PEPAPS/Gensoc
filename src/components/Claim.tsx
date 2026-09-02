import type { ReactNode } from 'react';

/**
 * The project's core academic-accuracy device.
 *
 * Every substantive statement on the site is wrapped in one of these four
 * labels so a reader can tell, at a glance, whether they are looking at
 * something the paper says or something this review added.
 *
 *   paper       - the paper states this
 *   background  - general domain knowledge, added for beginners
 *   inference   - a reading of the paper, clearly not stated by it
 *   unspecified - a question the paper does not answer
 *
 * `source` should cite a section, table or figure that genuinely exists.
 */
export type ClaimKind = 'paper' | 'background' | 'inference' | 'unspecified';

const LABELS: Record<ClaimKind, string> = {
  paper: 'From paper',
  background: 'Background',
  inference: 'Inference',
  unspecified: 'Not specified',
};

const TITLES: Record<ClaimKind, string> = {
  paper: 'Stated by the GenSoC paper.',
  background: 'General domain knowledge added by this review, not a claim about GenSoC.',
  inference: 'This review’s reading of the paper. The paper does not state it outright.',
  unspecified: 'The paper does not answer this.',
};

export function Claim({
  kind,
  source,
  children,
}: {
  kind: ClaimKind;
  source?: string;
  children: ReactNode;
}) {
  return (
    <div className={`claim claim--${kind}`}>
      <span className="claim-tag" title={TITLES[kind]}>
        {LABELS[kind]}
      </span>
      <div>{children}</div>
      {source && <span className="claim-source">Source: {source}</span>}
    </div>
  );
}

/** Inline variant for use inside tables and lists, where a block would break layout. */
export function ClaimTag({ kind }: { kind: ClaimKind }) {
  return (
    <span className={`claim claim--${kind}`} style={{ display: 'inline-block', padding: 0, border: 0, background: 'none', margin: 0 }}>
      <span className="claim-tag" title={TITLES[kind]} style={{ marginBottom: 0 }}>
        {LABELS[kind]}
      </span>
    </span>
  );
}

export const claimLegend: { kind: ClaimKind; label: string; meaning: string }[] = [
  { kind: 'paper', label: LABELS.paper, meaning: 'The GenSoC paper states this. A section, table or figure is cited where one applies.' },
  { kind: 'background', label: LABELS.background, meaning: 'Domain knowledge this review added so the paper makes sense to a beginner. Not a claim about GenSoC.' },
  { kind: 'inference', label: LABELS.inference, meaning: 'This review’s reading of the paper. Reasonable, but the paper does not say it outright.' },
  { kind: 'unspecified', label: LABELS.unspecified, meaning: 'A question the paper leaves open. Named rather than filled in with a guess.' },
];
