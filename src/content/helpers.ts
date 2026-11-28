import type { Exercise, Question } from '../types';

const LETTERS = 'abcdefgh';

/**
 * Crea una domanda in forma compatta.
 * `correct` è l'indice (o gli indici) delle opzioni corrette, partendo da 0.
 * Con più indici la domanda diventa a risposta multipla.
 */
export function q(
  id: string,
  domainId: string,
  prompt: string,
  options: string[],
  correct: number | number[],
  explanation: string,
  difficulty: 1 | 2 | 3 = 2,
): Question {
  const idx = Array.isArray(correct) ? correct : [correct];
  return {
    id,
    domainId,
    type: idx.length > 1 ? 'multiple' : 'single',
    prompt,
    options: options.map((text, i) => ({ id: LETTERS[i], text })),
    correct: idx.map((i) => LETTERS[i]),
    explanation,
    difficulty,
  };
}

/** Come `q()`, ma con un brano di ascolto in inglese letto dalla sintesi vocale. */
export function lq(
  id: string,
  domainId: string,
  listen: string,
  prompt: string,
  options: string[],
  correct: number | number[],
  explanation: string,
  difficulty: 1 | 2 | 3 = 2,
): Question {
  return { ...q(id, domainId, prompt, options, correct, explanation, difficulty), listen };
}

export const SOLUTION_MARKER = '<!-- SOLUZIONE -->';

/** Un esercizio è scritto in un unico file Markdown: consegna, marcatore, soluzione. */
export function exercise(meta: Omit<Exercise, 'task' | 'solution'>, raw: string): Exercise {
  const [task, solution = ''] = raw.split(SOLUTION_MARKER);
  return { ...meta, task: task.trim(), solution: solution.trim() };
}
