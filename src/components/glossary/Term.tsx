import { useCallback, useId, useRef, useState } from 'react';
import { lookupTerm } from '../../data/glossary';

/**
 * Hover/focus/tap glossary tooltip.
 *
 * Usage: <T k="NPU" /> renders "NPU"; <T k="NPU">neural accelerator</T> renders
 * the children but explains the term behind them. Definitions are never passed
 * in — they always come from src/data/glossary.ts.
 *
 * Rendered as a <button> so keyboard and touch users get the same affordance
 * mouse users do; positioned fixed off the trigger's own rect so it never gets
 * clipped by an overflow container.
 */
export function T({ k, children }: { k: string; children?: React.ReactNode }) {
  const entry = lookupTerm(k);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const id = useId();

  const show = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    // Prefer below; flip above when there is not enough room underneath.
    const below = window.innerHeight - r.bottom > 190;
    setPos({
      top: below ? r.bottom + 8 : Math.max(12, r.top - 8),
      left: Math.min(Math.max(12, r.left), window.innerWidth - width - 12),
    });
    setOpen(true);
  }, []);

  const hide = useCallback(() => setOpen(false), []);

  // An unknown key is a bug in the caller, not something to render silently.
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`<T>: no glossary entry for "${k}"`);
    return <>{children ?? k}</>;
  }

  const flipped = pos !== null && window.innerHeight - pos.top < 190;

  return (
    <>
      <button
        ref={ref}
        type="button"
        className="term"
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => (open ? hide() : show())}
        onKeyDown={(e) => e.key === 'Escape' && hide()}
      >
        {children ?? k}
      </button>
      {open && pos && (
        <span
          id={id}
          role="tooltip"
          className="tip"
          style={{
            top: pos.top,
            left: pos.left,
            transform: flipped ? 'translateY(-100%)' : undefined,
          }}
        >
          <span className="tip-term">{entry.term}</span>
          {entry.fullName && <span className="tip-full">{entry.fullName}</span>}
          {entry.beginnerDefinition}
          {entry.paperContext && (
            <span className="tip-paper">
              <b>In the paper:</b> {entry.paperContext}
            </span>
          )}
        </span>
      )}
    </>
  );
}
