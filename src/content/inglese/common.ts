import type { Certification, Domain, ExamInfo, Module, Question } from '../../types';

/**
 * Elementi comuni ai percorsi di inglese per livello (QCER A1–C2).
 * I domini seguono le parti del test Aptis del British Council:
 * Core (grammatica e lessico), Reading, Listening, Writing e Speaking.
 */
export const CORE = 'core';
export const READ = 'reading';
export const LIST = 'listening';
export const WRITE = 'writing';
export const SPEAK = 'speaking';

export type SkillMap = Record<typeof CORE | typeof READ | typeof LIST | typeof WRITE | typeof SPEAK, string[]>;

const DOMAIN_INFO: { id: keyof SkillMap; title: string; description: string }[] = [
  { id: CORE, title: 'Grammatica e lessico (Core)', description: 'Strutture grammaticali e vocabolario del livello, come nella parte Core di Aptis.' },
  { id: READ, title: 'Reading', description: 'Comprensione di testi scritti: frasi, messaggi, testi brevi e lunghi.' },
  { id: LIST, title: 'Listening', description: 'Comprensione orale: ascolta il brano con la sintesi vocale, poi rispondi.' },
  { id: WRITE, title: 'Writing', description: 'Produzione scritta: forme, messaggi, email e testi argomentativi.' },
  { id: SPEAK, title: 'Speaking', description: 'Produzione orale: rispondere, descrivere, confrontare, argomentare.' },
];

export function englishDomains(skills: SkillMap): Domain[] {
  return DOMAIN_INFO.map((d) => ({ ...d, weight: '20%', skills: skills[d.id] }));
}

interface LevelInput {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  /** Nome italiano del livello QCER, es. "Soglia" */
  name: string;
  description: string;
  skills: SkillMap;
  modules: Module[];
  questions: Question[];
  extraNotes?: string[];
}

const GENERAL = 'https://www.britishcouncil.org/exam/aptis/prepare-general';
const ADVANCED = 'https://www.britishcouncil.org/exam/aptis/prepare-advanced';

export function englishLevel(input: LevelInput): Certification {
  const advanced = input.level.startsWith('C');
  const examName = advanced ? 'Aptis Advanced' : 'Aptis General';
  const exam: ExamInfo = {
    label: examName,
    durationMinutes: 30,
    passingScore: 70,
    maxScore: 100,
    simulationQuestions: 25,
    notes: [
      advanced
        ? "Aptis Advanced del British Council misura i livelli dal B1 al C2: il risultato non è promosso/bocciato ma il livello QCER raggiunto in ciascuna abilità."
        : "Aptis General del British Council misura i livelli dall'A1 al C: il risultato non è promosso/bocciato ma il livello QCER raggiunto in ciascuna abilità.",
      'Il test reale è al computer ed è modulare: Core (grammatica e lessico) più le abilità scelte dall\'ente (Reading, Listening, Writing, Speaking), ciascuna con un punteggio da 0 a 50.',
      'La simulazione qui è una verifica del livello: 25 domande a scelta multipla su tutte le abilità. La soglia di 70/100 indica che il livello è ben consolidato, non è una soglia ufficiale.',
      'Writing e Speaking nel test reale si fanno scrivendo e registrando la voce: allenali con gli esercizi del percorso e confronta la tua risposta con il modello.',
      ...(input.extraNotes ?? []),
      'Formato e durate possono cambiare: controlla la pagina ufficiale del British Council prima di prenotare.',
    ],
  };
  return {
    id: `inglese-${input.level.toLowerCase()}`,
    code: input.level,
    title: `Inglese ${input.level} · ${input.name}`,
    vendor: 'British Council',
    area: 'british-council',
    level: input.name,
    description: input.description,
    accent: '#6a4a85',
    accentDark: '#c7b0dd',
    exam,
    domains: englishDomains(input.skills),
    modules: input.modules,
    questions: input.questions,
    resources: [
      { title: `Preparazione ufficiale ${examName} (British Council)`, url: advanced ? ADVANCED : GENERAL },
      { title: 'LearnEnglish del British Council: grammatica, lessico e ascolti gratuiti', url: 'https://learnenglish.britishcouncil.org/' },
      {
        title: 'Quadro comune europeo di riferimento per le lingue (Consiglio d\'Europa)',
        url: 'https://www.coe.int/en/web/common-european-framework-reference-languages',
      },
    ],
  };
}
