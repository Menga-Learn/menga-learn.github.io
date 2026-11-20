import { describe, expect, it } from 'vitest';
import { certifications } from '.';
import type { Question } from '../types';

// Controlli di coerenza sui contenuti: aiutano chi aggiunge nuove certificazioni.
describe.each(certifications.map((c) => [c.code, c] as const))('contenuti %s', (_code, cert) => {
  const domainIds = new Set(cert.domains.map((d) => d.id));
  const lessons = cert.modules.flatMap((m) => m.lessons);
  const exercises = cert.modules.flatMap((m) => m.exercises);
  const allQuestions: Question[] = [...cert.questions, ...lessons.flatMap((l) => l.quickCheck)];

  it('ha id univoci', () => {
    const ids = [...cert.modules.map((m) => m.id), ...lessons.map((l) => l.id), ...exercises.map((e) => e.id)];
    expect(new Set(ids).size).toBe(ids.length);
    const qids = allQuestions.map((q) => q.id);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it('ogni modulo e domanda appartiene a un dominio esistente', () => {
    cert.modules.forEach((m) => expect(domainIds.has(m.domainId), m.id).toBe(true));
    allQuestions.forEach((q) => expect(domainIds.has(q.domainId), q.id).toBe(true));
  });

  it('ogni dominio ha moduli e domande', () => {
    cert.domains.forEach((d) => {
      expect(cert.modules.some((m) => m.domainId === d.id), d.id).toBe(true);
      expect(cert.questions.filter((q) => q.domainId === d.id).length, d.id).toBeGreaterThanOrEqual(10);
    });
  });

  it('le domande sono ben formate', () => {
    allQuestions.forEach((q) => {
      const optIds = q.options.map((o) => o.id);
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(new Set(optIds).size, q.id).toBe(optIds.length);
      expect(q.correct.length, q.id).toBeGreaterThan(0);
      q.correct.forEach((c) => expect(optIds, q.id).toContain(c));
      expect(q.type === 'multiple' ? q.correct.length > 1 : q.correct.length === 1, q.id).toBe(true);
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
      if (q.type === 'multiple') expect(q.prompt, q.id).toMatch(new RegExp(`Seleziona ${q.correct.length} risposte`));
    });
  });

  it('lezioni ed esercizi hanno contenuto', () => {
    lessons.forEach((l) => {
      expect(l.body.length, l.id).toBeGreaterThan(500);
      expect(l.keyPoints.length, l.id).toBeGreaterThan(0);
    });
    exercises.forEach((e) => {
      expect(e.task.length, e.id).toBeGreaterThan(100);
      expect(e.solution.length, e.id).toBeGreaterThan(100);
    });
  });

  it('ha abbastanza domande per la simulazione', () => {
    expect(cert.questions.length).toBeGreaterThanOrEqual(cert.exam.simulationQuestions);
  });
});
