import type { Question } from '../types';
import { isCorrect } from '../lib/quiz';
import { InlineMarkdown, Markdown } from './Markdown';
import { ListenBox } from './ListenBox';

interface Props {
  question: Question;
  selected: readonly string[];
  onChange: (selected: string[]) => void;
  /** Mostra correzione e spiegazione */
  revealed: boolean;
  number?: number;
  total?: number;
  domainLabel?: string;
}

export function QuestionCard({ question, selected, onChange, revealed, number, total, domainLabel }: Props) {
  const multiple = question.type === 'multiple';
  const correct = revealed && isCorrect(question, selected);

  function toggle(id: string) {
    if (revealed) return;
    if (multiple) {
      onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    } else {
      onChange([id]);
    }
  }

  return (
    <article className="question">
      <header className="question-meta">
        {number !== undefined && (
          <span className="pill">
            Domanda {number}
            {total ? ` di ${total}` : ''}
          </span>
        )}
        {domainLabel && <span className="muted small">{domainLabel}</span>}
      </header>
      {question.listen && <ListenBox script={question.listen} revealed={revealed} />}
      <Markdown source={question.prompt} className="question-prompt" />
      <p className="question-hint">
        {multiple ? `Seleziona ${question.correct.length} risposte.` : 'Seleziona una risposta.'}
      </p>
      <ul className="options" role={multiple ? 'group' : 'radiogroup'}>
        {question.options.map((opt, i) => {
          const isSel = selected.includes(opt.id);
          const isRight = question.correct.includes(opt.id);
          const state = revealed ? (isRight ? 'right' : isSel ? 'wrong' : '') : isSel ? 'selected' : '';
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`option ${state}`}
                role={multiple ? 'checkbox' : 'radio'}
                aria-checked={isSel}
                disabled={revealed}
                onClick={() => toggle(opt.id)}
              >
                <span className="option-key" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="option-text">
                  <InlineMarkdown source={opt.text} />
                </span>
                {revealed && isRight && <span className="option-badge">Corretta</span>}
                {revealed && isSel && !isRight && <span className="option-badge">La tua scelta</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className={`feedback ${correct ? 'ok' : 'ko'}`} role="status">
          <strong>{correct ? 'Risposta corretta.' : selected.length === 0 ? 'Nessuna risposta.' : 'Risposta non corretta.'}</strong>
          <Markdown source={question.explanation} />
        </div>
      )}
    </article>
  );
}
