import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findExercise, getCert } from '../lib/catalog';
import { progress, useCertProgress } from '../lib/progress';
import { Markdown } from '../components/Markdown';
import { Breadcrumbs } from '../components/Layout';
import { NotFoundPage } from './NotFoundPage';
import { accentProps } from '../lib/theme';

const KIND_LABEL = { lab: 'Laboratorio guidato', codice: 'Esercizio di codice', scenario: 'Caso di studio' } as const;
const LANG_LABEL = { sql: 'T-SQL', dax: 'DAX', kql: 'KQL', pyspark: 'PySpark', powerquery: 'Power Query M' } as const;
const DIFF_LABEL = { 1: 'Base', 2: 'Intermedio', 3: 'Avanzato' } as const;

export function ExercisePage() {
  const { exerciseId } = useParams();
  // la chiave azzera suggerimenti e soluzione quando si passa a un altro esercizio
  return <ExerciseView key={exerciseId} />;
}

function ExerciseView() {
  const { certId, exerciseId } = useParams();
  const cert = getCert(certId);
  const p = useCertProgress(certId ?? '');
  const found = cert ? findExercise(cert, exerciseId) : undefined;
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [draft, setDraft] = useState('');
  if (!cert || !found) return <NotFoundPage />;
  const { exercise, module } = found;
  const done = p.exercises.includes(exercise.id);

  return (
    <div className="lesson-layout" {...accentProps(cert)}>
      <Breadcrumbs
        items={[
          { label: 'Certificazioni', to: '/' },
          { label: cert.code, to: `/c/${cert.id}` },
          { label: module.title },
        ]}
      />
      <article className="prose">
        <div className="row wrap small">
          <span className="pill">{KIND_LABEL[exercise.kind]}</span>
          {exercise.language && <span className="pill">{LANG_LABEL[exercise.language]}</span>}
          <span className="pill">{DIFF_LABEL[exercise.difficulty]}</span>
          <span className="muted">circa {exercise.minutes} minuti</span>
        </div>
        <h1>{exercise.title}</h1>
        <Markdown source={exercise.task} />
      </article>

      {exercise.kind === 'codice' && (
        <section className="card">
          <label htmlFor="draft" className="h3 block">
            La tua soluzione
          </label>
          <p className="small muted">
            Scrivi qui la tua risposta e confrontala con la soluzione. Il testo resta solo in questa pagina.
          </p>
          <textarea
            id="draft"
            className="code-input"
            spellCheck={false}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={exercise.language ? `Scrivi il codice ${LANG_LABEL[exercise.language]}…` : 'Scrivi la tua risposta…'}
            rows={10}
          />
        </section>
      )}

      {exercise.hints.length > 0 && (
        <section className="card">
          <h2 className="h3">Suggerimenti</h2>
          {hintsShown === 0 && <p className="small muted">Prova prima da solo, poi sblocca un suggerimento alla volta.</p>}
          <ol>
            {exercise.hints.slice(0, hintsShown).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
          {hintsShown < exercise.hints.length && (
            <button className="btn ghost" onClick={() => setHintsShown((n) => n + 1)}>
              Mostra suggerimento {hintsShown + 1} di {exercise.hints.length}
            </button>
          )}
        </section>
      )}

      <section className="card">
        <div className="row between">
          <h2 className="h3">Soluzione</h2>
          <button className="btn" onClick={() => setShowSolution((s) => !s)} aria-expanded={showSolution}>
            {showSolution ? 'Nascondi soluzione' : 'Mostra soluzione'}
          </button>
        </div>
        {showSolution && <Markdown source={exercise.solution} />}
      </section>

      <div className="lesson-footer">
        <button className={`btn ${done ? '' : 'primary'}`} onClick={() => progress.setExerciseDone(cert.id, exercise.id, !done)} aria-pressed={done}>
          {done ? '✓ Esercizio completato' : 'Segna come completato'}
        </button>
        <Link className="btn ghost" to={`/c/${cert.id}`}>
          Torna al percorso
        </Link>
      </div>
    </div>
  );
}
