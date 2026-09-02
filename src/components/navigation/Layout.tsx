import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { flatNav, navGroups, neighbours } from '../../data/nav';

function ThemeToggle() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('gensoc-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* private mode, blocked site data — fall through to system */
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    try {
      if (theme === 'system') localStorage.removeItem('gensoc-theme');
      else localStorage.setItem('gensoc-theme', theme);
    } catch {
      /* nothing to do — the choice just will not persist */
    }
  }, [theme]);

  const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  const icon = theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐';

  return (
    <button
      type="button"
      className="btn"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme} — click for ${next}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="small">{theme}</span>
    </button>
  );
}

function PageNav({ path }: { path: string }) {
  const { prev, next } = neighbours(path);
  if (!prev && !next) return null;
  return (
    <nav className="pagenav" aria-label="Previous and next page">
      {prev ? (
        <Link to={prev.path}>
          <span>← Previous</span>
          <strong>{prev.short ?? prev.label}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.path} className="next">
          <span>Next →</span>
          <strong>{next.short ?? next.label}</strong>
        </Link>
      )}
    </nav>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Route change: close the mobile drawer and start the new page at the top.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  const current = flatNav.find((n) => n.path === pathname);
  const position = flatNav.findIndex((n) => n.path === pathname);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="topbar">
        <button
          type="button"
          className="btn"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true">☰</span> Contents
        </button>
        <strong style={{ fontSize: '0.9rem', flex: 1, minWidth: 0 }}>
          {current?.short ?? current?.label ?? 'GenSoC, explained'}
        </strong>
        <ThemeToggle />
      </div>

      <div className="shell">
        <div
          className={`overlay ${menuOpen ? 'show' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <aside className={`sidebar ${menuOpen ? 'open' : ''}`} aria-label="Site sections">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              SoC
            </span>
            <span className="brand-text">
              <strong>GenSoC, explained</strong>
              <span>An interactive paper review</span>
            </span>
          </Link>

          <div style={{ padding: '0 0.5rem 1rem' }} className="hide-on-mobile-topbar">
            <ThemeToggle />
          </div>

          {navGroups.map((g) => (
            <div className="nav-group" key={g.group}>
              <h4>{g.group}</h4>
              {g.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.short ?? item.label}
                </NavLink>
              ))}
            </div>
          ))}

          <p className="small muted" style={{ padding: '0 0.6rem' }}>
            {position >= 0 ? `Page ${position + 1} of ${flatNav.length}` : ''}
          </p>
        </aside>

        <main className="main" id="main">
          <Outlet />
          <PageNav path={pathname} />
        </main>
      </div>
    </>
  );
}
