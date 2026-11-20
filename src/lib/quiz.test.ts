import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import { averageWeight, formatDuration, isCorrect, pickExamQuestions, pickQuestions, scoreQuiz, shuffle } from './quiz';
import { dp600 } from '../content/dp600';

const single: Question = {
  id: 's',
  domainId: 'a',
  type: 'single',
  prompt: '',
  options: [
    { id: 'a', text: '1' },
    { id: 'b', text: '2' },
  ],
  correct: ['b'],
  explanation: '',
};
const multi: Question = { ...single, id: 'm', domainId: 'b', type: 'multiple', correct: ['a', 'b'] };

describe('isCorrect', () => {
  it('richiede la risposta esatta', () => {
    expect(isCorrect(single, ['b'])).toBe(true);
    expect(isCorrect(single, ['a'])).toBe(false);
    expect(isCorrect(single, [])).toBe(false);
  });
  it('a risposta multipla richiede tutte e sole le opzioni corrette, in qualunque ordine', () => {
    expect(isCorrect(multi, ['b', 'a'])).toBe(true);
    expect(isCorrect(multi, ['a'])).toBe(false);
  });
});

describe('scoreQuiz', () => {
  it('calcola punteggio, soglia e dettaglio per dominio', () => {
    const r = scoreQuiz([single, multi], { s: ['b'], m: ['a'] });
    expect(r.correct).toBe(1);
    expect(r.scaled).toBe(500);
    expect(r.passed).toBe(false);
    expect(r.byDomain).toEqual([
      { domainId: 'a', correct: 1, total: 1 },
      { domainId: 'b', correct: 0, total: 1 },
    ]);
  });
  it('supera la soglia a 700', () => {
    expect(scoreQuiz([single], { s: ['b'] }).passed).toBe(true);
  });
});

describe('utility', () => {
  it('shuffle non perde elementi', () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
  it('averageWeight legge intervalli percentuali', () => {
    expect(averageWeight('25–30%')).toBe(27.5);
    expect(averageWeight('45-50%')).toBe(47.5);
  });
  it('formatDuration', () => {
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(3725)).toBe('1:02:05');
    expect(formatDuration(-5)).toBe('00:00');
  });
});

describe('selezione delle domande', () => {
  it("la simulazione d'esame rispetta il numero richiesto, senza duplicati, e pesa i domini", () => {
    const qs = pickExamQuestions(dp600, dp600.exam.simulationQuestions);
    expect(qs).toHaveLength(dp600.exam.simulationQuestions);
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    const prep = qs.filter((q) => q.domainId === 'preparazione').length;
    const other = qs.filter((q) => q.domainId === 'manutenzione').length;
    expect(prep).toBeGreaterThan(other);
  });
  it('filtra per dominio e per id', () => {
    const qs = pickQuestions(dp600.questions, { count: 5, domainId: 'modelli' });
    expect(qs).toHaveLength(5);
    expect(qs.every((q) => q.domainId === 'modelli')).toBe(true);
    const only = pickQuestions(dp600.questions, { count: 10, onlyIds: ['q-m-01', 'q-s-01'] });
    expect(only.map((q) => q.id).sort()).toEqual(['q-m-01', 'q-s-01']);
  });
});
