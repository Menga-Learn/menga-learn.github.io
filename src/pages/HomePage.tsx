import { Link } from 'react-router-dom';
import { certifications } from '../content';
import { countItems } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { ProgressBar } from '../components/ProgressBar';

export function HomePage() {
  const state = useProgress();
  return (
    <>
      <section className="hero">
        <h1>Prepara la tua certificazione, un passo alla volta.</h1>
        <p className="lead">
          Ogni percorso unisce lezioni brevi, esercizi pratici e una sezione dedicata alle domande in stile esame, con
          simulazioni a tempo e ripasso degli errori. L'avanzamento resta salvato in questo browser.
        </p>
      </section>
      <h2 className="section-title">Percorsi disponibili</h2>
      <div className="grid cards">
        {certifications.map((cert) => {
          const n = countItems(cert);
          const p = state.certs[cert.id];
          const done = (p?.lessons.length ?? 0) + (p?.exercises.length ?? 0);
          const totalItems = n.lessons + n.exercises;
          return (
            <Link key={cert.id} to={`/c/${cert.id}`} className="card cert-card" style={{ ['--accent' as string]: cert.accent }}>
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
