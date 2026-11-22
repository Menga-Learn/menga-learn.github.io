import { Link, useParams } from 'react-router-dom';
import { countItems, getCert } from '../lib/catalog';
import { useCertProgress } from '../lib/progress';
import { ProgressBar } from '../components/ProgressBar';
import { Breadcrumbs } from '../components/Layout';
import { NotFoundPage } from './NotFoundPage';
import { accentProps } from '../lib/theme';

const KIND_LABEL = { lab: 'Laboratorio', codice: 'Codice', scenario: 'Scenario' } as const;

export function CertPage() {
  const { certId } = useParams();
  const cert = getCert(certId);
  const p = useCertProgress(certId ?? '');
  if (!cert) return <NotFoundPage />;
  const n = countItems(cert);
  const doneLessons = new Set(p.lessons);
  const doneExercises = new Set(p.exercises);
  const nextLesson = cert.modules.flatMap((m) => m.lessons).find((l) => !doneLessons.has(l.id));
  const lastAttempt = p.attempts.find((a) => a.mode === 'esame');

  return (
    <div {...accentProps(cert)}>
      <Breadcrumbs items={[{ label: 'Certificazioni', to: '/' }, { label: cert.code }]} />
      <section className="cert-hero">
        <div>
          <div className="cert-code">{cert.code}</div>
          <h1>{cert.title}</h1>
          <p className="lead">{cert.description}</p>
          <div className="row wrap">
            {nextLesson ? (
              <Link className="btn primary" to={`/c/${cert.id}/lezione/${nextLesson.id}`}>
                {p.lessons.length === 0 ? 'Inizia il percorso' : 'Riprendi da dove eri'}
              </Link>
            ) : (
              <span className="pill ok">Hai completato tutte le lezioni</span>
            )}
            <Link className="btn" to={`/c/${cert.id}/domande`}>
              Domande di certificazione
            </Link>
          </div>
        </div>
        <aside className="card exam-box">
          <h2 className="h3">L'esame in breve</h2>
          <dl className="facts">
            <div>
              <dt>Durata</dt>
              <dd>{cert.exam.durationMinutes} minuti</dd>
            </div>
            <div>
              <dt>Punteggio minimo</dt>
              <dd>
                {cert.exam.passingScore} su {cert.exam.maxScore}
              </dd>
            </div>
            <div>
              <dt>Il tuo avanzamento</dt>
              <dd>
                {p.lessons.length}/{n.lessons} lezioni · {p.exercises.length}/{n.exercises} esercizi
              </dd>
            </div>
            {lastAttempt && (
              <div>
                <dt>Ultima simulazione</dt>
                <dd>
                  {lastAttempt.scaled}/{cert.exam.maxScore} {lastAttempt.passed ? '(superata)' : '(non superata)'}
                </dd>
              </div>
            )}
          </dl>
          <ProgressBar value={p.lessons.length + p.exercises.length} max={n.lessons + n.exercises} />
        </aside>
      </section>

      <h2 className="section-title">Domini dell'esame</h2>
      <div className="grid domains">
        {cert.domains.map((d, i) => (
          <a key={d.id} href={`#/c/${cert.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`dom-${d.id}`)?.scrollIntoView({ behavior: 'smooth' }); }} className="card domain-card">
            <span className="small muted">Dominio {i + 1}</span>
            <h3>{d.title}</h3>
            <span className="weight">{d.weight}</span>
          </a>
        ))}
      </div>

      {cert.domains.map((d, di) => {
        const modules = cert.modules.filter((m) => m.domainId === d.id);
        return (
          <section key={d.id} id={`dom-${d.id}`} className="domain-section">
            <header className="domain-header">
              <div>
                <span className="small muted">
                  Dominio {di + 1} · peso {d.weight}
                </span>
                <h2>{d.title}</h2>
                <p className="muted">{d.description}</p>
              </div>
            </header>
            <details className="skills">
              <summary>Competenze misurate ({d.skills.length})</summary>
              <ul>
                {d.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
            {modules.map((m) => {
              const mDone = m.lessons.filter((l) => doneLessons.has(l.id)).length + m.exercises.filter((e) => doneExercises.has(e.id)).length;
              const mTotal = m.lessons.length + m.exercises.length;
              return (
                <div key={m.id} className="card module">
                  <div className="module-head">
                    <div>
                      <h3>{m.title}</h3>
                      <p className="muted">{m.summary}</p>
                    </div>
                    <span className="small muted nowrap">
                      {mDone}/{mTotal}
                    </span>
                  </div>
                  <ProgressBar value={mDone} max={mTotal} />
                  <ol className="items">
                    {m.lessons.map((l) => (
                      <li key={l.id}>
                        <Link to={`/c/${cert.id}/lezione/${l.id}`} className={`item ${doneLessons.has(l.id) ? 'done' : ''}`}>
                          <span className="check" aria-hidden="true">{doneLessons.has(l.id) ? '✓' : ''}</span>
                          <span className="item-kind">Lezione</span>
                          <span className="item-title">{l.title}</span>
                          <span className="small muted nowrap">{l.minutes} min</span>
                        </Link>
                      </li>
                    ))}
                    {m.exercises.map((e) => (
                      <li key={e.id}>
                        <Link to={`/c/${cert.id}/esercizio/${e.id}`} className={`item ${doneExercises.has(e.id) ? 'done' : ''}`}>
                          <span className="check" aria-hidden="true">{doneExercises.has(e.id) ? '✓' : ''}</span>
                          <span className="item-kind ex">{KIND_LABEL[e.kind]}</span>
                          <span className="item-title">{e.title}</span>
                          <span className="small muted nowrap">{e.minutes} min</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </section>
        );
      })}

      <section className="card resources">
        <h2 className="h3">Risorse ufficiali</h2>
        <ul>
          {cert.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
