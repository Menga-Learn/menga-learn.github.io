import { certifications } from '../content';
import type { Certification, Exercise, Lesson, Module } from '../types';

export function getCert(id: string | undefined): Certification | undefined {
  return certifications.find((c) => c.id === id);
}

export interface LessonRef {
  lesson: Lesson;
  module: Module;
}

export function flatLessons(cert: Certification): LessonRef[] {
  return cert.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module })));
}

export function findLesson(cert: Certification, lessonId: string | undefined) {
  const all = flatLessons(cert);
  const index = all.findIndex((r) => r.lesson.id === lessonId);
  if (index < 0) return undefined;
  return { ...all[index], prev: all[index - 1], next: all[index + 1], index, total: all.length };
}

export function findExercise(cert: Certification, exerciseId: string | undefined): { exercise: Exercise; module: Module } | undefined {
  for (const module of cert.modules) {
    const exercise = module.exercises.find((e) => e.id === exerciseId);
    if (exercise) return { exercise, module };
  }
  return undefined;
}

export function countItems(cert: Certification) {
  const lessons = cert.modules.reduce((s, m) => s + m.lessons.length, 0);
  const exercises = cert.modules.reduce((s, m) => s + m.exercises.length, 0);
  return { lessons, exercises, questions: cert.questions.length };
}

export function domainTitle(cert: Certification, domainId: string): string {
  return cert.domains.find((d) => d.id === domainId)?.title ?? domainId;
}
