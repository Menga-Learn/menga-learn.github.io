import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-narrativa-condizionali.md?raw';
import l2 from './lessons/02-reported-lessico.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exSaggio from './exercises/saggio-opinione.md?raw';
import exDiscorso from './exercises/discorso-lungo.md?raw';

const modules: Module[] = [
  {
    id: 'b2-core',
    domainId: CORE,
    title: 'Strutture e lessico B2',
    summary: 'Past perfect, terzo condizionale, wish, deduzioni, discorso indiretto, passivo avanzato, collocazioni e phrasal verb.',
    lessons: [
      {
        id: 'b2-narrativa',
        title: 'Tempi narrativi, terzo condizionale e deduzioni',
        minutes: 11,
        body: l1,
        keyPoints: [
          'Past perfect per l\'azione precedente a un\'altra passata.',
          'Terzo condizionale: If + past perfect, would have + participio.',
          'I wish + past (presente) / + past perfect (passato).',
          'must have / might have / can\'t have per dedurre il passato; should have per criticare.',
        ],
        quickCheck: [
          q('qc-b2-nar-1', CORE, 'Completa: *If she ___ the alarm, she wouldn\'t have been late.*', ['heard', 'would hear', 'had heard', 'has heard'], 2,
            'Terzo condizionale: **if + past perfect**.', 2),
          q('qc-b2-nar-2', CORE, 'Il collega non risponde da ore ed è sempre puntuale. Cosa dici?', ['He must have forgotten his phone.', 'He must forget his phone.', 'He can\'t forgot his phone.', 'He should forgotten his phone.'], 0,
            'Deduzione quasi certa sul passato: **must have + participio**.', 2),
        ],
      },
      {
        id: 'b2-reported',
        title: 'Discorso indiretto, passivo avanzato e lessico',
        minutes: 11,
        body: l2,
        keyPoints: [
          'Nel discorso indiretto i tempi arretrano; domande indirette con soggetto + verbo.',
          'say something / tell somebody; suggest + -ing.',
          'It is believed that… / have something done.',
          'make a decision, do research, take a risk; carry out, put off, turn down.',
        ],
        quickCheck: [
          q('qc-b2-rep-1', CORE, 'Discorso diretto: *"Where do you live?"* Quale versione indiretta è corretta?', ['He asked me where did I live.', 'He asked me where I lived.', 'He asked me where do I live.', 'He said me where I lived.'], 1,
            'Domanda indiretta: niente *do/did*, ordine **soggetto + verbo**, tempo che arretra.', 2),
          q('qc-b2-rep-2', CORE, 'Completa: *We need to ___ a decision by Friday.*', ['do', 'make', 'take on', 'have done'], 1,
            'Collocazione: **make** a decision.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b2-reading',
    domainId: READ,
    title: 'Coesione e inferenza',
    summary: 'Seguire i fili di un testo lungo, capire ciò che è implicito, abbinare titoli a paragrafi.',
    lessons: [
      {
        id: 'b2-reading-coesione',
        title: 'Coesione, inferenza e tono',
        minutes: 10,
        body: l3,
        keyPoints: [
          'this, such, the former/the latter rimandano a ciò che precede.',
          'L\'inferenza va dedotta da indizi: non è scritta.',
          'Titoli: scarta quelli troppo specifici o troppo generali; c\'è un titolo in più.',
        ],
        quickCheck: [
          q('qc-b2-read-1', READ, 'Un paragrafo inizia con *This approach, however, has serious drawbacks.* Cosa deve esserci nel paragrafo precedente?', ['Un elenco di svantaggi', 'La descrizione di un approccio, probabilmente positiva', 'La conclusione del testo', 'Un titolo'], 1,
            '*This approach* rimanda a un approccio appena descritto, e *however* indica che prima se ne parlava bene.', 2),
          q('qc-b2-read-2', READ, '> The director thanked us for the suggestion and said it would be "looked into in due course".\n\nCosa si può dedurre?', ['Il suggerimento sarà applicato subito', 'Probabilmente non ci sarà un\'azione rapida', 'Il direttore era arrabbiato', 'Il suggerimento è stato rifiutato per iscritto'], 1,
            '*In due course* è vago: lascia intendere che non succederà nulla a breve.', 3),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b2-listening',
    domainId: LIST,
    title: 'Atteggiamento e significati impliciti',
    summary: 'Interviste e discussioni a velocità naturale: litote, ironia, concessioni.',
    lessons: [
      {
        id: 'b2-listening-impliciti',
        title: 'Atteggiamento e significati impliciti',
        minutes: 9,
        body: l4,
        keyPoints: [
          'Not exactly cheap = caro: la litote è frequentissima.',
          'Dopo una concessione (Granted…, but) conta la parte dopo but.',
          'I segnali discorsivi aiutano a prevedere il contenuto.',
        ],
        quickCheck: [
          lq('qc-b2-list-1', LIST, 'A: How was the hotel?\nB: Well, let\'s just say it wasn\'t exactly what the website promised.', 'Com\'era l\'albergo per B?', ['Migliore del previsto', 'Peggiore di quanto promesso', 'Esattamente come sul sito', 'Non ci è andato'], 1,
            '*Wasn\'t exactly what… promised* = era peggiore delle aspettative.', 2),
          lq('qc-b2-list-2', LIST, 'Granted, the new software is expensive, but it\'ll save us hours every week, so I think it\'s worth it.', 'Cosa pensa chi parla?', ['Il software è troppo caro', 'Il software vale la spesa', 'Non serve un nuovo software', 'Non ha un\'opinione'], 1,
            'Concede il costo (*Granted*) ma conclude *it\'s worth it*.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b2-writing',
    domainId: WRITE,
    title: 'Argomentare per iscritto',
    summary: 'Saggi di opinione e articoli di 150–220 parole: struttura, connettivi, concessioni.',
    lessons: [
      {
        id: 'b2-writing-argomentare',
        title: 'Il testo argomentativo',
        minutes: 10,
        body: l5,
        keyPoints: [
          'Introduzione con posizione, due paragrafi di argomenti, conclusione.',
          'Concessione + risposta: Admittedly… Nevertheless…',
          'Hedging: It could be argued that…, tends to…',
        ],
        quickCheck: [
          q('qc-b2-wr-1', WRITE, 'Quale frase introduce meglio una concessione?', ['Admittedly, this solution is expensive.', 'Expensive this solution.', 'This solution is expensive, so.', 'Expensive, however this.'], 0,
            '**Admittedly** riconosce un punto dell\'opinione opposta.', 1),
          q('qc-b2-wr-2', WRITE, 'Quale frase è più adatta a un testo argomentativo B2?', ['Everybody knows that social media is bad.', 'It could be argued that social media has a negative effect on young people\'s self-esteem.', 'Social media is bad, end of story.', 'Social media bad.'], 1,
            'Opinione **sfumata** e precisa: *It could be argued that…*', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'b2-ex-saggio', title: 'Saggio di opinione sul lavoro da remoto', kind: 'scenario', difficulty: 2, minutes: 30, hints: [
        'Decidi la posizione prima di scrivere.',
        'Un paragrafo per idea, con un esempio concreto.',
        'Inserisci una concessione: Admittedly… Nevertheless…',
      ] }, exSaggio),
    ],
  },
  {
    id: 'b2-speaking',
    domainId: SPEAK,
    title: 'Il discorso lungo',
    summary: 'Un minuto di preparazione, due minuti di discorso organizzato su un tema astratto.',
    lessons: [
      {
        id: 'b2-speaking-discorso',
        title: 'Parlare per due minuti',
        minutes: 9,
        body: l6,
        keyPoints: [
          'Appunti a parole chiave: 2–3 idee e un esempio per domanda.',
          'Segnala i passaggi: As for…, Moving on to…, Overall…',
          'Se ti blocchi riformula: What I mean is…',
        ],
        quickCheck: [
          q('qc-b2-sp-1', SPEAK, 'Hai un minuto per prepararti. Cosa conviene scrivere?', ['Il testo completo da leggere', 'Parole chiave e un esempio per ogni domanda', 'Niente', 'Solo la prima frase'], 1,
            'In un minuto bastano **parole chiave**: leggere un testo scritto rende il discorso innaturale.', 1),
          q('qc-b2-sp-2', SPEAK, 'Come passi alla terza domanda in modo naturale?', ['Third question.', 'Moving on to whether this is a good thing,…', 'And now other.', 'Next.'], 1,
            '**Moving on to…** segnala il passaggio e riprende la domanda.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'b2-ex-discorso', title: 'Due minuti sulla tecnologia', kind: 'scenario', difficulty: 3, minutes: 15, hints: [
        'Cronometra davvero 1 minuto di appunti e 2 di discorso.',
        'Inserisci un condizionale (If I hadn\'t…).',
        'Chiudi con una frase di sintesi.',
      ] }, exDiscorso),
    ],
  },
];

export const ingleseB2 = englishLevel({
  level: 'B2',
  name: 'Progresso',
  description:
    'Argomenta con sicurezza: terzo condizionale, discorso indiretto, collocazioni, testi lunghi e impliciti, saggi di opinione e discorso di due minuti. Il livello B2 di Aptis General.',
  skills: {
    core: [
      'Usare past perfect, terzo condizionale e condizionali misti, wish e deduzioni al passato',
      'Usare discorso indiretto, passivo impersonale e have something done',
      'Usare collocazioni, phrasal verb e formazione delle parole del livello B2',
    ],
    reading: ['Ricostruire la coesione di testi lunghi', 'Fare inferenze e riconoscere scopo e tono dell\'autore'],
    listening: ['Capire interviste e discussioni a velocità naturale', 'Cogliere significati impliciti, ironia e atteggiamento'],
    writing: ['Scrivere testi argomentativi di 150–220 parole ben organizzati', 'Usare concessioni, hedging e connettivi tra paragrafi'],
    speaking: ['Parlare per due minuti su un tema astratto dopo un minuto di preparazione', 'Mantenere un discorso organizzato e fluente'],
  },
  modules,
  questions,
});
