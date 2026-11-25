/**
 * Modello dati di una certificazione.
 * Per aggiungere una nuova certificazione basta creare una cartella in
 * `src/content/<id>/` che esporta un oggetto `Certification` e registrarlo
 * in `src/content/index.ts`.
 */

export interface Certification {
  /** Identificativo usato negli URL, es. "dp-600" */
  id: string;
  /** Codice ufficiale dell'esame, es. "DP-600" */
  code: string;
  title: string;
  vendor: string;
  level: string;
  description: string;
  /**
   * Colore d'accento della certificazione (CSS) per il tema chiaro.
   * Scegli un tono medio-scuro e poco saturo: deve avere contrasto ≥ 4.5:1 sul fondo #f5f2eb.
   */
  accent: string;
  /** Variante per il tema scuro: tono chiaro e desaturato (contrasto ≥ 4.5:1 su #1b1a18). */
  accentDark: string;
  exam: ExamInfo;
  domains: Domain[];
  modules: Module[];
  /** Banca domande per la sezione "Domande di certificazione" */
  questions: Question[];
  /** Link utili (documentazione ufficiale, skills outline, ...) */
  resources: Resource[];
}

export interface ExamInfo {
  durationMinutes: number;
  passingScore: number;
  maxScore: number;
  /** Numero di domande della simulazione d'esame */
  simulationQuestions: number;
  notes: string[];
}

export interface Domain {
  id: string;
  title: string;
  /** Peso nell'esame, es. "25–30%" */
  weight: string;
  description: string;
  skills: string[];
}

export interface Module {
  id: string;
  domainId: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  exercises: Exercise[];
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  /** Contenuto in Markdown */
  body: string;
  keyPoints: string[];
  /** Mini-verifica a fine lezione */
  quickCheck: Question[];
}

export type ExerciseKind = 'lab' | 'codice' | 'scenario';
export type CodeLanguage = 'sql' | 'sparksql' | 'dax' | 'kql' | 'pyspark' | 'python' | 'powerquery' | 'yaml';

export interface Exercise {
  id: string;
  title: string;
  kind: ExerciseKind;
  language?: CodeLanguage;
  difficulty: 1 | 2 | 3;
  minutes: number;
  /** Markdown: contesto e consegna */
  task: string;
  hints: string[];
  /** Markdown: soluzione commentata */
  solution: string;
}

export type QuestionType = 'single' | 'multiple';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  domainId: string;
  type: QuestionType;
  /** Markdown */
  prompt: string;
  options: Option[];
  /** id delle opzioni corrette */
  correct: string[];
  /** Markdown: spiegazione mostrata dopo la risposta */
  explanation: string;
  difficulty?: 1 | 2 | 3;
  tags?: string[];
}

export interface Resource {
  title: string;
  url: string;
}
