import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { certifications } from '../content';
import { areas } from '../content/areas';
import { countItems } from '../lib/catalog';
import type { Area, Certification } from '../types';
import { useProgress } from '../lib/progress';
import { ProgressBar } from '../components/ProgressBar';
import { accentProps } from '../lib/theme';

const PILLARS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Corsi',
    text: 'Lezioni brevi ed esercizi pratici',
    icon: (
      <path
        d="M2 5.5C5 4.5 8.5 4.7 11 6.5v13c-2.5-1.8-6-2-9-1zM22 5.5c-3-1-6.5-.8-9 1v13c2.5-1.8 6-2 9-1z"
        fill="currentColor"
      />
    ),
  },
  {
    title: 'Competenze',
    text: 'Avanzamento per dominio e ripasso degli errori',
    icon: (
      <>
        <rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="currentColor" />
        <rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="currentColor" />
        <rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    title: 'Certificazioni',
    text: 'Domande in stile esame e simulazioni a tempo',
    icon: (
      <>
        <path d="M7.5 14.5 5 22l3.5-1.5L11 23l1-6zM16.5 14.5 19 22l-3.5-1.5L13 23l-1-6z" fill="currentColor" />
        <circle cx="12" cy="9.5" r="7.5" fill="currentColor" />
        <path d="m8.8 9.6 2.2 2.2 4.2-4.3" fill="none" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

/** Gruppi del Quadro comune europeo di riferimento (QCER). */
const CEFR_GROUPS = [
  { letter: 'A', title: 'Utente base' },
  { letter: 'B', title: 'Utente autonomo' },
  { letter: 'C', title: 'Utente avanzato' },
];

function useCertStats(cert: Certification) {
  const state = useProgress();
  const n = countItems(cert);
  const p = state.certs[cert.id];
  const done = (p?.lessons.length ?? 0) + (p?.exercises.length ?? 0);
  return { n, done, total: n.lessons + n.exercises };
}

function CertCard({ cert }: { cert: Certification }) {
  const { n, done, total } = useCertStats(cert);
  return (
    <Link to={`/c/${cert.id}`} className="card cert-card" {...accentProps(cert)}>
      <div className="cert-code">{cert.code}</div>
      <h3>{cert.title}</h3>
      <p className="muted small">
        {cert.vendor} · {cert.level}
      </p>
      <p>{cert.description}</p>
      <div className="stats small muted">
        <span>{n.lessons} lezioni</span>
        <span>{n.exercises} esercizi</span>
        <span>{n.questions} domande</span>
      </div>
      <ProgressBar value={done} max={total} label={`Avanzamento ${cert.code}`} />
      <span className="small muted">
        {done} di {total} attività completate
      </span>
    </Link>
  );
}

function LevelCard({ cert }: { cert: Certification }) {
  const { n, done, total } = useCertStats(cert);
  return (
    <Link to={`/c/${cert.id}`} className="card level-card" {...accentProps(cert)}>
      <div className="level-head">
        <span className="level-badge">{cert.code}</span>
        <div>
          <h3>{cert.level}</h3>
          <span className="small muted">{cert.exam.label ?? cert.vendor}</span>
        </div>
      </div>
      <p className="small">{cert.description}</p>
      <div className="stats small muted">
        <span>{n.lessons} lezioni</span>
        <span>{n.exercises} esercizi</span>
        <span>{n.questions} domande</span>
      </div>
      <ProgressBar value={done} max={total} label={`Avanzamento ${cert.code}`} />
    </Link>
  );
}

function SoonLevelCard({ item }: { item: Area['upcoming'][number] }) {
  return (
    <div className="card level-card level-soon">
      <div className="level-head">
        <span className="level-badge">{item.code}</span>
        <div>
          <h3>{item.title}</h3>
          <span className="small muted">In preparazione</span>
        </div>
      </div>
      {item.note && <p className="small muted">{item.note}</p>}
    </div>
  );
}

function AreaSection({ area, certs }: { area: Area; certs: Certification[] }) {
  const count = certs.length;
  return (
    <section id={`area-${area.id}`} className="area" aria-labelledby={`area-title-${area.id}`} {...accentProps(area)}>
      <header className="area-head">
        <span className="area-mark" aria-hidden="true">
          {area.mark}
        </span>
        <div>
          <h2 id={`area-title-${area.id}`}>{area.name}</h2>
          <p className="muted small">{area.tagline}</p>
        </div>
        <span className="area-count small">
          {count} {count === 1 ? 'percorso' : 'percorsi'}
        </span>
      </header>
      {area.levels ? (
        <div className="cefr">
          {CEFR_GROUPS.map((g) => {
            const real = certs.filter((c) => c.code.startsWith(g.letter));
            const soon = area.upcoming.filter((u) => u.code.startsWith(g.letter) && !real.some((c) => c.code === u.code));
            return (
              <div key={g.letter} className="cefr-group">
                <div className="cefr-label small">
                  <strong>{g.letter}</strong> {g.title}
                </div>
                {real.map((c) => (
                  <LevelCard key={c.id} cert={c} />
                ))}
                {soon.map((u) => (
                  <SoonLevelCard key={u.code} item={u} />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid cards">
          {certs.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
          {area.upcoming.length > 0 && (
            <div className="card card-soon">
              <h3 className="small muted upper">In arrivo</h3>
              <ul className="soon-list">
                {area.upcoming.map((u) => (
                  <li key={u.code}>
                    <strong>{u.code}</strong> <span className="muted">{u.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function HomePage() {
  const byArea = areas.map((area) => ({ area, certs: certifications.filter((c) => c.area === area.id) }));
  return (
    <>
      <section className="hero">
        <div className="hero-brand">
          <img src="./logo.svg" width="88" height="88" alt="" className="hero-logo" />
          <div>
            <h1 className="wordmark hero-wordmark">
              Menga <span>Learn</span>
            </h1>
            <p className="tagline">Impara. Cresci. Certificati.</p>
          </div>
        </div>
        <p className="hero-claim">Prepara la tua certificazione, un passo alla volta.</p>
        <p className="lead">
          Ogni percorso unisce lezioni brevi, esercizi pratici e una sezione dedicata alle domande in stile esame, con
          simulazioni a tempo e ripasso degli errori. L'avanzamento resta salvato in questo browser.
        </p>
        <ul className="pillars">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                {p.icon}
              </svg>
              <div>
                <strong>{p.title}</strong>
                <span className="small muted">{p.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <nav className="area-nav" aria-label="Aree">
        <span className="small muted">Esplora per area</span>
        <div className="area-chips">
          {byArea.map(({ area, certs }) => (
            <button
              key={area.id}
              type="button"
              className="area-chip"
              {...accentProps(area)}
              onClick={() => document.getElementById(`area-${area.id}`)?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="area-mark sm" aria-hidden="true">
                {area.mark}
              </span>
              {area.name}
              <span className="muted small">{certs.length}</span>
            </button>
          ))}
        </div>
      </nav>
      {byArea.map(({ area, certs }) => (
        <AreaSection key={area.id} area={area} certs={certs} />
      ))}
    </>
  );
}
