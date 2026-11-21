import { describe, expect, it } from 'vitest';
import { createBackup, mergeProgress, parseBackup, type ProgressState } from './progress';

const a: ProgressState = {
  version: 1,
  certs: {
    'dp-600': {
      lessons: ['l1'],
      exercises: [],
      questions: { q1: { seen: 1, correct: 0, lastCorrect: false } },
      attempts: [{ date: '2026-01-01T00:00:00.000Z', mode: 'esame', correct: 1, total: 2, scaled: 500, passed: false, durationSeconds: 10, byDomain: [] }],
    },
  },
};
const b: ProgressState = {
  version: 1,
  certs: {
    'dp-600': {
      lessons: ['l1', 'l2'],
      exercises: ['e1'],
      questions: { q1: { seen: 3, correct: 2, lastCorrect: true } },
      attempts: [
        { date: '2026-01-01T00:00:00.000Z', mode: 'esame', correct: 1, total: 2, scaled: 500, passed: false, durationSeconds: 10, byDomain: [] },
        { date: '2026-02-01T00:00:00.000Z', mode: 'pratica', correct: 2, total: 2, scaled: 1000, passed: true, durationSeconds: 5, byDomain: [] },
      ],
    },
    'pl-300': { lessons: ['x'], exercises: [], questions: {}, attempts: [] },
  },
};

describe('backup dei progressi', () => {
  it('esporta e reimporta lo stesso stato', () => {
    const text = JSON.stringify(createBackup(b, new Date('2026-03-01')));
    expect(parseBackup(text)).toEqual(b);
  });

  it('rifiuta file non validi', () => {
    expect(() => parseBackup('non json')).toThrow('JSON');
    expect(() => parseBackup('{"app":"altro","version":1,"state":{"certs":{}}}')).toThrow('Menga Learn');
  });

  it('unisce senza perdere dati né duplicare i tentativi', () => {
    const m = mergeProgress(a, b);
    const c = m.certs['dp-600'];
    expect(c.lessons.sort()).toEqual(['l1', 'l2']);
    expect(c.exercises).toEqual(['e1']);
    expect(c.questions.q1.seen).toBe(3);
    expect(c.attempts.map((x) => x.date)).toEqual(['2026-02-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z']);
    expect(m.certs['pl-300'].lessons).toEqual(['x']);
  });
});
