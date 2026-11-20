import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { Certification, Question } from '../types';
import { domainTitle, getCert } from '../lib/catalog';
import { formatDuration, isCorrect, pickExamQuestions, pickQuestions, scoreQuiz, type QuizResult } from '../lib/quiz';
import { progress, wrongQuestionIds } from '../lib/progress';
import { QuestionCard } from '../components/QuestionCard';
import { Breadcrumbs, EmptyState } from '../components/Layout';
import { ProgressBar } from '../components/ProgressBar';
import { NotFoundPage } from './NotFoundPage';

type Mode = 'pratica' | 'esame' | 'ripasso';

export function QuizSessionPage() {
  const { certId } = useParams();
  const [params] = useSearchParams();
  const cert = getCert(certId);
  if (!cert) return <NotFoundPage />;
  const mode = (['pratica', 'esame', 'ripasso'].includes(params.get('mode') ?? '') ? params.get('mode') : 'pratica') as Mode;
  // la chiave forza una nuova sessione quando cambiano i parametri
  return <Session key={params.toString()} cert={cert} mode={mode} domain={params.get('domain') ?? undefined} count={Number(params.get('n')) || 10} />;
}

function buildQuestions(cert: Certification, mode: Mode, domain: string | undefined, count: number): Question[] {
  if (mode === 'esame') return pickExamQuestions(cert, cert.exam.simulationQuestions);
  if (mode === 'ripasso') {
    const ids = wrongQuestionIds(progress.get().certs[cert.id] ?? { lessons: [], exercises: [], questions: {}, attempts: [] });
    return pickQuestions(cert.questions, { count: ids.length, onlyIds: ids });
  }
  return pickQuestions(cert.questions, { count, domainId: domain });
}

function Session({ cert, mode, domain, count }: { cert: Certification; mode: Mode; domain?: string; count: number }) {
  const [questions] = useState(() => buildQuestions(cert, mode, domain, count));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const startedAt = useRef(Date.now());
  const isExam = mode === 'esame';
  const limit = cert.exam.durationMinutes * 60;
  const [elapsed, setElapsed] = useState(0);

  const finishedRef = useRef(false);
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scored = scoreQuiz(questions, answers, cert.exam.maxScore, cert.exam.passingScore);
    const order = cert.domains.map((d) => d.id);
    const r = { ...scored, byDomain: [...scored.byDomain].sort((a, b) => order.indexOf(a.domainId) - order.indexOf(b.domainId)) };
    // in allenamento le risposte sono già registrate al momento della verifica
    // le domande lasciate senza risposta non entrano nelle statistiche (né nel ripasso errori)
    if (isExam)
      questions
        .filter((q) => (answers[q.id] ?? []).length > 0)
        .forEach((q) => progress.recordAnswer(cert.id, q.id, isCorrect(q, answers[q.id])));
    progress.recordAttempt(cert.id, {
      date: new Date().toISOString(),
      mode: isExam ? 'esame' : 'pratica',
      correct: r.correct,
      total: r.total,
      scaled: r.scaled,
      passed: r.passed,
      durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      byDomain: r.byDomain,
    });
    setResult(r);
    window.scrollTo(0, 0);
  }, [answers, cert, isExam, questions]);

  useEffect(() => {
    if (!isExam || result) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [isExam, result]);

  useEffect(() => {
    if (isExam && !result && elapsed >= limit) finish();
  }, [elapsed, finish, isExam, limit, result]);

  const title = mode === 'esame' ? "Simulazione d'esame" : mode === 'ripasso' ? 'Ripasso errori' : 'Allenamento';
  const crumbs = (
    <Breadcrumbs
      items={[
        { label: 'Certificazioni', to: '/' },
        { label: cert.code, to: `/c/${cert.id}` },
        { label: 'Domande', to: `/c/${cert.id}/domande` },
        { label: title },
      ]}
    />
  );

  if (questions.length === 0) {
    return (
      <>
        {crumbs}
        <EmptyState title="Nessuna domanda disponibile">
          <p>
            Non ci sono domande per questa selezione. <Link to={`/c/${cert.id}/domande`}>Torna alle domande</Link>.
          </p>
        </EmptyState>
      </>
    );
  }

  if (result) {
    return (
      <div style={{ ['--accent' as string]: cert.accent }}>
        {crumbs}
        <Results cert={cert} result={result} questions={questions} answers={answers} isExam={isExam} mode={mode} />
      </div>
    );
  }

  const q = questions[index];
  const selected = answers[q.id] ?? [];
  const answeredCount = questions.filter((x) => (answers[x.id] ?? []).length > 0).length;
  const revealed = !isExam && !!checked[q.id];
  const last = index === questions.length - 1;

  function check() {
    setChecked((c) => ({ ...c, [q.id]: true }));
    progress.recordAnswer(cert.id, q.id, isCorrect(q, selected));
  }

  return (
    <div className="session" style={{ ['--accent' as string]: cert.accent }}>
      {crumbs}
      <div className="session-bar">
        <div>
          <h1 className="h2">{title}</h1>
          <span className="small muted">
            {isExam ? `${answeredCount} di ${questions.length} risposte date` : `Domanda ${index + 1} di ${questions.length}`}
          </span>
        </div>
        {isExam && (
          <div className={`timer ${limit - elapsed < 300 ? 'warn' : ''}`} aria-live="off" title="Tempo rimanente">
            ⏱ {formatDuration(limit - elapsed)}
          </div>
        )}
      </div>
      <ProgressBar value={isExam ? answeredCount : index + (revealed ? 1 : 0)} max={questions.length} />

      <div className={isExam ? 'session-grid' : ''}>
        <div className="card">
          <QuestionCard
            question={q}
            number={index + 1}
            total={questions.length}
            domainLabel={domainTitle(cert, q.domainId)}
            selected={selected}
            onChange={(sel) => setAnswers((a) => ({ ...a, [q.id]: sel }))}
            revealed={revealed}
          />
          <div className="row between wrap actions">
            <div className="row">
              {isExam && (
                <>
                  <button className="btn ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
                    ← Precedente
                  </button>
                  <button
                    className={`btn ghost ${flagged[q.id] ? 'flagged' : ''}`}
                    aria-pressed={!!flagged[q.id]}
                    onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
                  >
                    {flagged[q.id] ? '⚑ Da rivedere' : '⚐ Segna da rivedere'}
                  </button>
                </>
              )}
            </div>
            <div className="row">
              {!isExam && !revealed && (
                <button className="btn primary" disabled={selected.length === 0} onClick={check}>
                  Verifica
                </button>
              )}
              {(isExam || revealed) && !last && (
                <button className="btn primary" onClick={() => setIndex((i) => i + 1)}>
                  Avanti →
                </button>
              )}
              {!isExam && revealed && last && (
                <button className="btn primary" onClick={finish}>
                  Vedi risultato
                </button>
              )}
            </div>
          </div>
        </div>

        {isExam && (
          <aside className="card navigator">
            <h2 className="h3">Domande</h2>
            <div className="nav-grid">
              {questions.map((x, i) => (
                <button
                  key={x.id}
                  className={`nav-cell ${i === index ? 'current' : ''} ${(answers[x.id] ?? []).length ? 'answered' : ''} ${flagged[x.id] ? 'flagged' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Domanda ${i + 1}${flagged[x.id] ? ', da rivedere' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="small muted legend">
              <span className="dot answered" /> risposta data <span className="dot flagged" /> da rivedere
            </p>
            {confirmEnd ? (
              <div className="confirm">
                <p className="small">
                  {answeredCount < questions.length
                    ? `Hai ancora ${questions.length - answeredCount} domande senza risposta. `
                    : ''}
                  Vuoi consegnare?
                </p>
                <div className="row">
                  <button className="btn primary" onClick={finish}>
                    Consegna
                  </button>
                  <button className="btn ghost" onClick={() => setConfirmEnd(false)}>
                    Continua
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn primary full" onClick={() => setConfirmEnd(true)}>
                Termina esame
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

function Results({
  cert,
  result,
  questions,
  answers,
  isExam,
  mode,
}: {
  cert: Certification;
  result: QuizResult;
  questions: Question[];
  answers: Record<string, string[]>;
  isExam: boolean;
  mode: Mode;
}) {
  const [filter, setFilter] = useState<'tutte' | 'errate'>('errate');
  const pct = Math.round((result.correct / Math.max(1, result.total)) * 100);
  const shown = questions.filter((q) => filter === 'tutte' || !isCorrect(q, answers[q.id] ?? []));
  return (
    <div className="results">
      <section className={`card result-head ${isExam ? (result.passed ? 'ok' : 'ko') : ''}`}>
        <div>
          <h1 className="h2">{isExam ? (result.passed ? 'Simulazione superata' : 'Simulazione non superata') : 'Sessione completata'}</h1>
          <p className="lead">
            Hai risposto correttamente a {result.correct} domande su {result.total} ({pct}%).
          </p>
          {isExam && (
            <p className="small muted">
              Punteggio indicativo {result.scaled}/{cert.exam.maxScore}, soglia {cert.exam.passingScore}. L'esame reale usa
              una scala diversa: considera questo valore come un orientamento.
            </p>
          )}
        </div>
        {isExam && <div className="score">{result.scaled}</div>}
      </section>

      <section className="card">
        <h2 className="h3">Risultato per dominio</h2>
        <ul className="plain domain-scores">
          {result.byDomain.map((d) => {
            const dp = Math.round((d.correct / Math.max(1, d.total)) * 100);
            return (
              <li key={d.domainId}>
                <div className="row between">
                  <span>{domainTitle(cert, d.domainId)}</span>
                  <span className="small">
                    {d.correct}/{d.total} · {dp}%
                  </span>
                </div>
                <ProgressBar value={d.correct} max={d.total} />
              </li>
            );
          })}
        </ul>
      </section>

      <div className="row wrap">
        <Link className="btn primary" to={`/c/${cert.id}/domande`}>
          Torna alle domande
        </Link>
        <Link className="btn" to={`/c/${cert.id}`}>
          Torna al percorso
        </Link>
        {mode !== 'esame' && <span className="small muted">Le risposte errate sono disponibili in "Ripasso errori".</span>}
      </div>

      <section>
        <div className="row between wrap">
          <h2 className="section-title">Revisione</h2>
          <div className="segmented" role="tablist">
            <button role="tab" aria-selected={filter === 'errate'} className={filter === 'errate' ? 'active' : ''} onClick={() => setFilter('errate')}>
              Solo errate
            </button>
            <button role="tab" aria-selected={filter === 'tutte'} className={filter === 'tutte' ? 'active' : ''} onClick={() => setFilter('tutte')}>
              Tutte
            </button>
          </div>
        </div>
        {shown.length === 0 && <p className="muted">Nessuna risposta errata. Ottimo lavoro!</p>}
        <div className="stack">
          {shown.map((q) => (
            <div key={q.id} className="card">
              <QuestionCard
                question={q}
                number={questions.indexOf(q) + 1}
                total={questions.length}
                domainLabel={domainTitle(cert, q.domainId)}
                selected={answers[q.id] ?? []}
                onChange={() => {}}
                revealed
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
