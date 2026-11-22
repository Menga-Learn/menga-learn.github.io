import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { domainTitle, getCert } from '../lib/catalog';
import { useCertProgress, wrongQuestionIds } from '../lib/progress';
import { Breadcrumbs } from '../components/Layout';
import { ProgressBar } from '../components/ProgressBar';
import { NotFoundPage } from './NotFoundPage';
import { accentProps } from '../lib/theme';

export function QuestionsPage() {
  const { certId } = useParams();
  const cert = getCert(certId);
  const p = useCertProgress(certId ?? '');
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [count, setCount] = useState(10);
  if (!cert) return <NotFoundPage />;

  const wrong = wrongQuestionIds(p);
  const seen = Object.keys(p.questions).filter((id) => cert.questions.some((q) => q.id === id)).length;
  const base = `/c/${cert.id}/domande/sessione`;
  const available = domain ? cert.questions.filter((q) => q.domainId === domain).length : cert.questions.length;

  return (
    <div {...accentProps(cert)}>
      <Breadcrumbs items={[{ label: 'Certificazioni', to: '/' }, { label: cert.code, to: `/c/${cert.id}` }, { label: 'Domande' }]} />
      <h1>Domande di certificazione {cert.code}</h1>
      <p className="lead">
        {cert.questions.length} domande originali, scritte sulle competenze misurate dall'esame. Hai già affrontato {seen}{' '}
        domande.
      </p>
      <ProgressBar value={seen} max={cert.questions.length} label="Domande affrontate" />

      <div className="grid modes">
        <section className="card mode">
          <h2 className="h3">Allenamento</h2>
          <p className="muted">Correzione e spiegazione subito dopo ogni risposta.</p>
          <label className="field">
            <span>Dominio</span>
            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="">Tutti i domini</option>
              {cert.domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({cert.questions.filter((q) => q.domainId === d.id).length})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Numero di domande</span>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn primary"
            onClick={() => navigate(`${base}?mode=pratica&n=${Math.min(count, available)}${domain ? `&domain=${domain}` : ''}`)}
          >
            Inizia allenamento
          </button>
        </section>

        <section className="card mode">
          <h2 className="h3">Simulazione d'esame</h2>
          <p className="muted">
            {cert.exam.simulationQuestions} domande distribuite secondo il peso dei domini, {cert.exam.durationMinutes}{' '}
            minuti, correzione alla fine. Soglia: {cert.exam.passingScore}/{cert.exam.maxScore}.
          </p>
          <ul className="small muted">
            {cert.exam.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <Link className="btn primary" to={`${base}?mode=esame`}>
            Avvia simulazione
          </Link>
        </section>

        <section className="card mode">
          <h2 className="h3">Ripasso errori</h2>
          <p className="muted">
            {wrong.length === 0
              ? "Nessun errore da ripassare: le domande sbagliate compariranno qui."
              : `${wrong.length} domande a cui l'ultima volta hai risposto in modo errato.`}
          </p>
          <button className="btn primary" disabled={wrong.length === 0} onClick={() => navigate(`${base}?mode=ripasso`)}>
            Ripassa gli errori
          </button>
        </section>
      </div>

      {p.attempts.length > 0 && (
        <section>
          <h2 className="section-title">Storico</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Modalità</th>
                  <th>Risultato</th>
                  <th>Punteggio</th>
                  <th>Per dominio</th>
                </tr>
              </thead>
              <tbody>
                {p.attempts.map((a) => (
                  <tr key={a.date}>
                    <td>{new Date(a.date).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>{a.mode === 'esame' ? 'Simulazione' : 'Allenamento'}</td>
                    <td>
                      {a.correct}/{a.total}
                    </td>
                    <td>
                      {a.mode === 'esame' ? (
                        <span className={`pill ${a.passed ? 'ok' : 'ko'}`}>{a.scaled}</span>
                      ) : (
                        `${Math.round((a.correct / Math.max(1, a.total)) * 100)}%`
                      )}
                    </td>
                    <td className="small">
                      {a.byDomain.map((d) => (
                        <div key={d.domainId}>
                          {domainTitle(cert, d.domainId)}: {d.correct}/{d.total}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
