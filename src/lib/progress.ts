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
  /** Sostituisce o unisce lo stato importato da un backup. */
  importState(incoming: ProgressState, mode: 'unisci' | 'sostituisci') {
    save(mode === 'sostituisci' ? incoming : mergeProgress(state, incoming));
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

/* ------------------------------------------------------------------ */
/* Esportazione e importazione: servono a portare i progressi su un    */
/* altro browser o su un nuovo indirizzo (es. un dominio personale),   */
/* perché localStorage è legato al singolo sito.                       */
/* ------------------------------------------------------------------ */

const EXPORT_APP = 'menga-learn';

export interface ProgressBackup {
  app: typeof EXPORT_APP;
  version: 1;
  exportedAt: string;
  state: ProgressState;
}

export function createBackup(s: ProgressState = state, now = new Date()): ProgressBackup {
  return { app: EXPORT_APP, version: 1, exportedAt: now.toISOString(), state: s };
}

const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Legge e valida un backup. Lancia un errore con un messaggio in italiano se il file non è valido. */
export function parseBackup(text: string): ProgressState {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Il file non è un JSON valido.');
  }
  const b = data as Partial<ProgressBackup>;
  if (!b || b.app !== EXPORT_APP || b.version !== 1 || !b.state || typeof b.state.certs !== 'object' || b.state.certs === null) {
    throw new Error('Il file non è un backup di Menga Learn.');
  }
  const certs: Record<string, CertProgress> = {};
  for (const [id, raw] of Object.entries(b.state.certs as Record<string, Partial<CertProgress>>)) {
    if (!raw || typeof raw !== 'object') continue;
    const questions: Record<string, QuestionStat> = {};
    for (const [qid, st] of Object.entries(raw.questions ?? {})) {
      if (st && typeof st.seen === 'number' && typeof st.correct === 'number' && typeof st.lastCorrect === 'boolean') questions[qid] = st;
    }
    certs[id] = {
      lessons: isStringArray(raw.lessons) ? raw.lessons : [],
      exercises: isStringArray(raw.exercises) ? raw.exercises : [],
      questions,
      attempts: Array.isArray(raw.attempts) ? raw.attempts.filter((a) => a && typeof a.date === 'string') : [],
    };
  }
  return { version: 1, certs };
}

/** Unisce due stati senza perdere nulla: unione di lezioni ed esercizi, statistiche più ricche, tentativi senza duplicati. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const certs: Record<string, CertProgress> = { ...a.certs };
  for (const [id, inc] of Object.entries(b.certs)) {
    const cur = certs[id];
    if (!cur) {
      certs[id] = inc;
      continue;
    }
    const questions = { ...cur.questions };
    for (const [qid, st] of Object.entries(inc.questions)) {
      const prev = questions[qid];
      if (!prev || st.seen > prev.seen) questions[qid] = st;
    }
    const attempts = [...cur.attempts];
    const dates = new Set(attempts.map((x) => x.date));
    inc.attempts.forEach((x) => !dates.has(x.date) && attempts.push(x));
    attempts.sort((x, y) => y.date.localeCompare(x.date));
    certs[id] = {
      lessons: [...new Set([...cur.lessons, ...inc.lessons])],
      exercises: [...new Set([...cur.exercises, ...inc.exercises])],
      questions,
      attempts: attempts.slice(0, 30),
    };
  }
  return { version: 1, certs };
}
