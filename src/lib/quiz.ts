import type { Certification, Question } from '../types';

/** Mescola un array (Fisher–Yates) senza modificare l'originale. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Una risposta è corretta solo se coincide esattamente con l'insieme delle opzioni corrette. */
export function isCorrect(question: Question, selected: readonly string[]): boolean {
  if (selected.length !== question.correct.length) return false;
  const set = new Set(selected);
  return question.correct.every((id) => set.has(id));
}

/** Prepara una domanda per la sessione mescolando l'ordine delle opzioni. */
export function withShuffledOptions(question: Question, random: () => number = Math.random): Question {
  return { ...question, options: shuffle(question.options, random) };
}

export interface PickOptions {
  count: number;
  domainId?: string;
  /** Se presente, limita la selezione a questi id (es. ripasso errori) */
  onlyIds?: readonly string[];
  random?: () => number;
}

export function pickQuestions(pool: readonly Question[], opts: PickOptions): Question[] {
  const random = opts.random ?? Math.random;
  let filtered = pool;
  if (opts.domainId) filtered = filtered.filter((q) => q.domainId === opts.domainId);
  if (opts.onlyIds) {
    const ids = new Set(opts.onlyIds);
    filtered = filtered.filter((q) => ids.has(q.id));
  }
  return shuffle(filtered, random)
    .slice(0, Math.max(0, opts.count))
    .map((q) => withShuffledOptions(q, random));
}

/**
 * Selezione per la simulazione d'esame: distribuisce le domande tra i domini
 * in proporzione al peso medio dichiarato (es. "25–30%" → 27,5).
 */
export function pickExamQuestions(cert: Certification, count: number, random: () => number = Math.random): Question[] {
  const weights = cert.domains.map((d) => ({ id: d.id, w: averageWeight(d.weight) }));
  const totalW = weights.reduce((s, d) => s + d.w, 0) || 1;
  const quotas = weights.map((d) => ({ id: d.id, n: Math.round((d.w / totalW) * count) }));
  // corregge eventuali arrotondamenti
  let diff = count - quotas.reduce((s, q) => s + q.n, 0);
  for (let i = 0; diff !== 0 && quotas.length > 0; i = (i + 1) % quotas.length) {
    const step = diff > 0 ? 1 : -1;
    if (quotas[i].n + step >= 0) {
      quotas[i].n += step;
      diff -= step;
    }
  }
  const chosen: Question[] = [];
  const used = new Set<string>();
  for (const q of quotas) {
    const picked = shuffle(cert.questions.filter((x) => x.domainId === q.id), random).slice(0, q.n);
    picked.forEach((p) => used.add(p.id));
    chosen.push(...picked);
  }
  // se un dominio ha meno domande della quota, completa con le altre
  if (chosen.length < count) {
    const rest = shuffle(cert.questions.filter((x) => !used.has(x.id)), random);
    chosen.push(...rest.slice(0, count - chosen.length));
  }
  return shuffle(chosen, random).map((q) => withShuffledOptions(q, random));
}

export function averageWeight(weight: string): number {
  const nums = (weight.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(',', '.')));
  if (nums.length === 0) return 1;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

export interface DomainScore {
  domainId: string;
  correct: number;
  total: number;
}

export interface QuizResult {
  correct: number;
  total: number;
  /** Punteggio in scala (es. 0–1000) */
  scaled: number;
  passed: boolean;
  byDomain: DomainScore[];
}

/**
 * Calcola il risultato. Il punteggio in scala è una semplice proporzione:
 * l'esame reale usa una scala non lineare, quindi va inteso come indicativo.
 */
export function scoreQuiz(
  questions: readonly Question[],
  answers: Readonly<Record<string, readonly string[]>>,
  maxScore = 1000,
  passingScore = 700,
): QuizResult {
  const byDomainMap = new Map<string, DomainScore>();
  let correct = 0;
  for (const q of questions) {
    const ok = isCorrect(q, answers[q.id] ?? []);
    if (ok) correct++;
    const d = byDomainMap.get(q.domainId) ?? { domainId: q.domainId, correct: 0, total: 0 };
    d.total++;
    if (ok) d.correct++;
    byDomainMap.set(q.domainId, d);
  }
  const total = questions.length;
  const scaled = total === 0 ? 0 : Math.round((correct / total) * maxScore);
  return { correct, total, scaled, passed: scaled >= passingScore, byDomain: [...byDomainMap.values()] };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
