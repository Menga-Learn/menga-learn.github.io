import { useSyncExternalStore } from 'react';
import type { DomainScore } from './quiz';

/**
 * Avanzamento dell'utente, salvato nel browser (localStorage).
 * Nessun dato lascia il dispositivo.
 */

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
}

export interface ExamAttempt {
  date: string;
  mode: 'esame' | 'pratica';
  correct: number;
  total: number;
  scaled: number;
  passed: boolean;
  durationSeconds: number;
  byDomain: DomainScore[];
}

export interface CertProgress {
  lessons: string[];
  exercises: string[];
  questions: Record<string, QuestionStat>;
  attempts: ExamAttempt[];
}

export interface ProgressState {
  version: 1;
  certs: Record<string, CertProgress>;
}

const KEY = 'menga-learn:progress:v1';
const EMPTY: ProgressState = { version: 1, certs: {} };
const emptyCert = (): CertProgress => ({ lessons: [], exercises: [], questions: {}, attempts: [] });

function load(): ProgressState {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed && parsed.version === 1 && typeof parsed.certs === 'object') return parsed;
  } catch {
    /* storage non disponibile o dati corrotti: si riparte da zero */
  }
  return EMPTY;
}

let state: ProgressState = load();
const listeners = new Set<() => void>();

function save(next: ProgressState) {
  state = next;
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignora: l'avanzamento resta in memoria per la sessione */
  }
  listeners.forEach((l) => l());
}

function updateCert(certId: string, fn: (c: CertProgress) => CertProgress) {
  const current = state.certs[certId] ?? emptyCert();
  save({ ...state, certs: { ...state.certs, [certId]: fn(current) } });
}

function toggle(list: string[], id: string, on: boolean): string[] {
  const has = list.includes(id);
  if (on && !has) return [...list, id];
  if (!on && has) return list.filter((x) => x !== id);
  return list;
}

export const progress = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setLessonDone(certId: string, lessonId: string, done: boolean) {
    updateCert(certId, (c) => ({ ...c, lessons: toggle(c.lessons, lessonId, done) }));
  },
  setExerciseDone(certId: string, exerciseId: string, done: boolean) {
    updateCert(certId, (c) => ({ ...c, exercises: toggle(c.exercises, exerciseId, done) }));
  },
  recordAnswer(certId: string, questionId: string, correct: boolean) {
    updateCert(certId, (c) => {
      const prev = c.questions[questionId] ?? { seen: 0, correct: 0, lastCorrect: false };
      return {
        ...c,
        questions: {
          ...c.questions,
          [questionId]: { seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0), lastCorrect: correct },
        },
      };
    });
  },
  recordAttempt(certId: string, attempt: ExamAttempt) {
    updateCert(certId, (c) => ({ ...c, attempts: [attempt, ...c.attempts].slice(0, 30) }));
  },
  resetCert(certId: string) {
    const certs = { ...state.certs };
    delete certs[certId];
    save({ ...state, certs });
  },
};

export function useProgress(): ProgressState {
  return useSyncExternalStore(progress.subscribe, progress.get, progress.get);
}

export function useCertProgress(certId: string): CertProgress {
  const s = useProgress();
  return s.certs[certId] ?? EMPTY_CERT;
}

const EMPTY_CERT: CertProgress = emptyCert();

/** Domande la cui ultima risposta è stata sbagliata. */
export function wrongQuestionIds(p: CertProgress): string[] {
  return Object.entries(p.questions)
    .filter(([, s]) => !s.lastCorrect)
    .map(([id]) => id);
}
