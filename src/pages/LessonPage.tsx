import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findLesson, getCert } from '../lib/catalog';
import { isCorrect } from '../lib/quiz';
import { progress, useCertProgress } from '../lib/progress';
import { Markdown } from '../components/Markdown';
import { QuestionCard } from '../components/QuestionCard';
import { Breadcrumbs } from '../components/Layout';
import { NotFoundPage } from './NotFoundPage';
import type { Question } from '../types';
import { accentProps } from '../lib/theme';

export function LessonPage() {
  const { certId, lessonId } = useParams();
  const cert = getCert(certId);
  const p = useCertProgress(certId ?? '');
  const found = cert ? findLesson(cert, lessonId) : undefined;
  if (!cert || !found) return <NotFoundPage />;
  const { lesson, module, prev, next, index, total } = found;
  const done = p.lessons.includes(lesson.id);

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
        <p className="small muted">
          Lezione {index + 1} di {total} · {lesson.minutes} minuti di lettura
        </p>
        <h1>{lesson.title}</h1>
        <Markdown source={lesson.body} />
        <aside className="keypoints">
          <h2 className="h3">Da ricordare</h2>
          <ul>
            {lesson.keyPoints.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </aside>
      </article>

      {lesson.quickCheck.length > 0 && (
        <section className="quickcheck">
          <h2>Verifica rapida</h2>
          <QuickCheck key={lesson.id} questions={lesson.quickCheck} />
        </section>
      )}

      <div className="lesson-footer">
        <button
          className={`btn ${done ? '' : 'primary'}`}
          onClick={() => progress.setLessonDone(cert.id, lesson.id, !done)}
          aria-pressed={done}
        >
          {done ? '✓ Lezione completata' : 'Segna come completata'}
        </button>
        <div className="row">
          {prev && (
            <Link className="btn ghost" to={`/c/${cert.id}/lezione/${prev.lesson.id}`}>
              ← Precedente
            </Link>
          )}
          {next ? (
            <Link
              className="btn"
              to={`/c/${cert.id}/lezione/${next.lesson.id}`}
              onClick={() => !done && progress.setLessonDone(cert.id, lesson.id, true)}
            >
              Successiva →
            </Link>
          ) : (
            <Link className="btn" to={`/c/${cert.id}/domande`}>
              Vai alle domande →
            </Link>
          )}
        </div>
      </div>
      {module.exercises.length > 0 && (
        <p className="small muted center">
          Esercizi di questo modulo:{' '}
          {module.exercises.map((e, i) => (
            <span key={e.id}>
              {i > 0 && ' · '}
              <Link to={`/c/${cert.id}/esercizio/${e.id}`}>{e.title}</Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function QuickCheck({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="stack">
      {questions.map((q, i) => (
        <div key={q.id} className="card">
          <QuestionCard
            question={q}
            number={i + 1}
            total={questions.length}
            selected={answers[q.id] ?? []}
            onChange={(sel) => setAnswers((a) => ({ ...a, [q.id]: sel }))}
            revealed={!!revealed[q.id]}
          />
          {!revealed[q.id] && (
            <button
              className="btn primary"
              disabled={(answers[q.id] ?? []).length === 0}
              onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}
            >
              Verifica
            </button>
          )}
        </div>
      ))}
      {questions.every((q) => revealed[q.id]) && (
        <p className="small muted">
          Hai risposto correttamente a {questions.filter((q) => isCorrect(q, answers[q.id] ?? [])).length} domande su{' '}
          {questions.length}.
        </p>
      )}
    </div>
  );
}
