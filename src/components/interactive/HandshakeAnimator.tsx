import { useState } from 'react';
import { Figure } from '../diagrams/svg';

/**
 * VALID/READY, made concrete.
 *
 * Toggle each signal per cycle and watch which cycles actually transfer. The
 * point a beginner needs: correct values on the wrong cycle is still a bug, and
 * that class of bug is invisible in the logic alone.
 */

const CYCLES = 8;

const PRESETS: { name: string; valid: boolean[]; ready: boolean[]; note: string }[] = [
  {
    name: 'Clean transfer',
    valid: [false, false, true, true, false, false, false, false],
    ready: [false, false, false, true, false, false, false, false],
    note: 'The sender asserts VALID on cycle 3 and holds it. The receiver becomes READY on cycle 4, so exactly one beat transfers, on cycle 4.',
  },
  {
    name: 'Receiver waiting',
    valid: [false, true, true, true, true, true, false, false],
    ready: [false, false, false, false, false, true, false, false],
    note: 'The sender is ready from cycle 2 and stalls for four cycles. Nothing is wrong — this is backpressure, and the sender must hold VALID until it is taken.',
  },
  {
    name: 'Missed each other',
    valid: [false, true, true, false, false, false, false, false],
    ready: [false, false, false, false, true, true, false, false],
    note: 'Both sides asserted, and nothing transferred. This is the failure shape behind the bug in the paper’s Fig. 5 — the signals look correct in isolation and never overlap.',
  },
  {
    name: 'Burst',
    valid: [false, true, true, true, true, true, true, false],
    ready: [false, true, true, false, true, true, true, false],
    note: 'Six offered beats, five taken. Cycle 4 stalls one beat. Counting transfers, not assertions, is what tells you whether a burst completed.',
  },
];

export function HandshakeAnimator() {
  const [preset, setPreset] = useState(0);
  const [valid, setValid] = useState<boolean[]>(PRESETS[0].valid);
  const [ready, setReady] = useState<boolean[]>(PRESETS[0].ready);
  const [custom, setCustom] = useState(false);

  const applyPreset = (n: number) => {
    setPreset(n);
    setValid(PRESETS[n].valid);
    setReady(PRESETS[n].ready);
    setCustom(false);
  };

  const toggle = (row: 'valid' | 'ready', c: number) => {
    setCustom(true);
    const set = row === 'valid' ? setValid : setReady;
    const arr = row === 'valid' ? valid : ready;
    set(arr.map((v, i) => (i === c ? !v : v)));
  };

  const transfers = valid.map((v, i) => v && ready[i]);
  const count = transfers.filter(Boolean).length;

  return (
    <Figure
      caption={
        <>
          Transfer happens on the cycles where VALID and READY are both high — nowhere else. Click
          any cell to edit the waveform yourself.
        </>
      }
    >
      <div className="controls">
        {PRESETS.map((p, n) => (
          <button
            key={p.name}
            type="button"
            className={`btn ${!custom && preset === n ? 'btn--on' : ''}`}
            onClick={() => applyPreset(n)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="figure-scroll">
        <div className="wave" style={{ ['--cycles' as string]: CYCLES }}>
          <span className="wave-label">cycle</span>
          {Array.from({ length: CYCLES }, (_, i) => (
            <span key={i} className="wave-cell" style={{ background: 'transparent', border: 0 }}>
              {i + 1}
            </span>
          ))}

          <span className="wave-label">VALID</span>
          {valid.map((v, i) => (
            <button
              key={i}
              type="button"
              className={`wave-cell ${v ? 'hi' : ''}`}
              onClick={() => toggle('valid', i)}
              aria-label={`VALID at cycle ${i + 1} is ${v ? 1 : 0}. Click to toggle.`}
            >
              {v ? 1 : 0}
            </button>
          ))}

          <span className="wave-label">READY</span>
          {ready.map((v, i) => (
            <button
              key={i}
              type="button"
              className={`wave-cell ${v ? 'hi' : ''}`}
              onClick={() => toggle('ready', i)}
              aria-label={`READY at cycle ${i + 1} is ${v ? 1 : 0}. Click to toggle.`}
            >
              {v ? 1 : 0}
            </button>
          ))}

          <span className="wave-label">transfer</span>
          {transfers.map((v, i) => (
            <span key={i} className={`wave-cell ${v ? 'xfer' : ''}`}>
              {v ? '✓' : '·'}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '0.9rem', marginBottom: 0 }} aria-live="polite">
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>
            {count === 0 ? 'No transfer occurs.' : `${count} beat${count === 1 ? '' : 's'} transferred.`}
          </strong>{' '}
          {custom ? 'Custom waveform.' : PRESETS[preset].note}
        </p>
        <p className="small muted" style={{ marginBottom: 0 }}>
          The rule that makes this deadlock-free: a sender must not wait for READY before asserting
          VALID. A receiver may wait for VALID before asserting READY. If both sides wait, nothing
          ever happens — and each side looks locally correct.
        </p>
      </div>
    </Figure>
  );
}
