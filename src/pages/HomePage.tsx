import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { certifications } from '../content';
import { countItems } from '../lib/catalog';
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

export function HomePage() {
  const state = useProgress();
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
      <h2 className="section-title">Percorsi disponibili</h2>
      <div className="grid cards">
        {certifications.map((cert) => {
          const n = countItems(cert);
          const p = state.certs[cert.id];
          const done = (p?.lessons.length ?? 0) + (p?.exercises.length ?? 0);
          const totalItems = n.lessons + n.exercises;
          return (
            <Link key={cert.id} to={`/c/${cert.id}`} className="card cert-card" {...accentProps(cert)}>
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
              <ProgressBar value={done} max={totalItems} label={`Avanzamento ${cert.code}`} />
              <span className="small muted">
                {done} di {totalItems} attività completate
              </span>
            </Link>
          );
        })}
        <div className="card card-soon">
          <h3>Prossime certificazioni</h3>
          <p className="muted">
            La piattaforma è pensata per accogliere altri percorsi (ad esempio DP-700, PL-300, AZ-900) aggiungendo solo
            nuovi contenuti.
          </p>
        </div>
      </div>
    </>
  );
}
