import { useMemo, useState } from 'react';
import { glossary, glossaryCategories, type GlossaryTerm } from '../data/glossary';

export default function Glossary() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<GlossaryTerm['category'] | 'all'>('all');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return glossary
      .filter((t) => cat === 'all' || t.category === cat)
      .filter(
        (t) =>
          !needle ||
          t.term.toLowerCase().includes(needle) ||
          t.fullName?.toLowerCase().includes(needle) ||
          t.beginnerDefinition.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
  }, [q, cat]);

  return (
    <div className="page">
      <p className="eyebrow">Reference</p>
      <h1>Glossary</h1>
      <p className="lede">
        Every term the site explains, defined once. These same definitions are what appear in the
        hover tooltips — there is no second copy anywhere.
      </p>

      <div className="controls">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms and definitions…"
          aria-label="Search the glossary"
          className="btn"
          style={{ minWidth: 240, flex: 1, cursor: 'text' }}
        />
      </div>

      <div className="controls">
        <button type="button" className={`btn ${cat === 'all' ? 'btn--on' : ''}`} onClick={() => setCat('all')}>
          All ({glossary.length})
        </button>
        {glossaryCategories.map((c) => (
          <button key={c.id} type="button" className={`btn ${cat === c.id ? 'btn--on' : ''}`} onClick={() => setCat(c.id)}>
            {c.label} ({glossary.filter((t) => t.category === c.id).length})
          </button>
        ))}
      </div>

      <p className="small muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'term' : 'terms'}
        {q ? ` matching “${q}”` : ''}.
      </p>

      {shown.map((t) => (
        <div className="card" key={t.term} id={`term-${t.term.replace(/[^a-zA-Z0-9]/g, '-')}`}>
          <h3 style={{ marginTop: 0, marginBottom: t.fullName ? '0.1rem' : '0.5rem' }}>{t.term}</h3>
          {t.fullName && (
            <p className="small muted" style={{ marginBottom: '0.5rem' }}>
              {t.fullName}
            </p>
          )}
          <p style={{ marginBottom: t.paperContext ? '0.75rem' : 0 }}>{t.beginnerDefinition}</p>
          {t.paperContext && (
            <p
              className="small"
              style={{
                marginBottom: 0,
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <b style={{ color: 'var(--paper)' }}>In the paper:</b>{' '}
              <span className="muted">{t.paperContext}</span>
            </p>
          )}
        </div>
      ))}

      {shown.length === 0 && (
        <div className="card">
          <p style={{ marginBottom: 0 }}>
            No matches. Try clearing the category filter, or searching for a broader word.
          </p>
        </div>
      )}
    </div>
  );
}
