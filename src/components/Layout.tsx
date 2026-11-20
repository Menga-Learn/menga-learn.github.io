import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

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
