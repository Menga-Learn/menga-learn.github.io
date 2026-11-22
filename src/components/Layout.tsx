import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { applyTheme, nextTheme, readTheme, type ThemeChoice } from '../lib/theme';

const THEME_LABEL: Record<ThemeChoice, string> = { auto: 'Auto', light: 'Chiaro', dark: 'Scuro' };
const THEME_ICON: Record<ThemeChoice, ReactNode> = {
  auto: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" />,
};

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>(readTheme);
  const next = nextTheme(theme);
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      title={`Tema: ${THEME_LABEL[theme]} (passa a ${THEME_LABEL[next]})`}
      aria-label={`Tema: ${THEME_LABEL[theme]}. Passa a ${THEME_LABEL[next]}`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {THEME_ICON[theme]}
      </svg>
      <span className="theme-label">{THEME_LABEL[theme]}</span>
    </button>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand" aria-label="Menga Learn, home">
            <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="currentColor" />
              <path d="M14 44V20l18 14 18-14v24" fill="none" stroke="var(--bg)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Menga Learn</span>
          </Link>
          <nav className="topnav">
            <NavLink to="/" end>
              Certificazioni
            </NavLink>
            <NavLink to="/info">Info</NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container small muted">
          Contenuti originali a scopo di studio. Non affiliato a Microsoft né ad altri enti certificatori; le domande
          non provengono dagli esami reali.
        </div>
      </footer>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Percorso di navigazione">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="sep">/</span>}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
