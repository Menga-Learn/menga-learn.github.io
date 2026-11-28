import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-strutture.md?raw';
import l2 from './lessons/02-lessico-connotazione.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exRecensione from './exercises/recensione.md?raw';
import exPersuadere from './exercises/persuadere.md?raw';

const modules: Module[] = [
  {
    id: 'c2-core',
    domainId: CORE,
    title: 'Padronanza di strutture e lessico',
    summary: 'Congiuntivo, ellissi, fronting, connotazione, linguaggio figurato e idiomi avanzati.',
    lessons: [
      {
        id: 'c2-strutture',
        title: 'Congiuntivo, ellissi e fronting',
        minutes: 12,
        body: l1,
        keyPoints: [
          'Congiuntivo formale: insist that he resign, essential that it be…',
          'It\'s time we left; I\'d rather you didn\'t; Were it not for…',
          'Ellissi: I hope not / I\'m afraid so / she did.',
          'Fronting: Much as I…, Strange though it may seem, Such was… that…',
        ],
        quickCheck: [
          q('qc-c2-str-1', CORE, 'Completa: *It\'s high time the government ___ action.*', ['takes', 'took', 'will take', 'has taken'], 1,
            '*It\'s (high) time* + **past simple** con valore presente.', 2),
          q('qc-c2-str-2', CORE, 'Completa: *___ I respect his experience, I cannot agree with his conclusions.*', ['Much as', 'So much', 'As much', 'However much as'], 0,
            '**Much as** = per quanto (concessione enfatica).', 3),
        ],
      },
      {
        id: 'c2-lessico',
        title: 'Connotazione, linguaggio figurato e idiomi',
        minutes: 11,
        body: l2,
        keyPoints: [
          'Parole sinonime possono esprimere giudizi opposti (determined/stubborn).',
          'Metafore correnti: storm of criticism, shoot down an idea, food for thought.',
          'Verbi di dire precisi: concede, contend, retort, muse.',
          'Padronanza = appropriatezza, non parole rare.',
        ],
        quickCheck: [
          q('qc-c2-lex-1', CORE, 'Quale aggettivo esprime un giudizio negativo su chi spende poco?', ['thrifty', 'prudent', 'stingy', 'economical'], 2,
            '**Stingy** = tirchio (negativo); *thrifty* e *prudent* sono positivi.', 2),
          q('qc-c2-lex-2', CORE, '*The company pays lip service to sustainability.* Cosa significa?', ['La sostiene concretamente', 'La sostiene solo a parole', 'La rifiuta apertamente', 'Ne parla poco'], 1,
            '**Pay lip service to** = appoggiare a parole senza agire.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c2-reading',
    domainId: READ,
    title: 'Sfumature e intenzione',
    summary: 'Atteggiamento implicito, registri misti, ironia, sottotesto letterario.',
    lessons: [
      {
        id: 'c2-reading-sfumature',
        title: 'Sfumature, stile e intenzione',
        minutes: 10,
        body: l3,
        keyPoints: [
          'L\'opinione emerge da lessico, ordine e spazio dato alle posizioni.',
          'Virgolette e dettagli selezionati possono segnalare ironia.',
          'Scarta le opzioni troppo estreme quando il testo è sfumato.',
        ],
        quickCheck: [
          q('qc-c2-read-1', READ, '> The council\'s "consultation" — a single meeting at 2 pm on a weekday — attracted, unsurprisingly, few residents.\n\nCosa suggerisce l\'autore?', ['La consultazione è stata un successo', 'La consultazione era una formalità poco seria', 'I residenti non sono interessati', 'Il consiglio ha fatto il possibile'], 1,
            'Virgolette, dettaglio sull\'orario e *unsurprisingly* indicano **critica ironica**.', 2),
          q('qc-c2-read-2', READ, 'In un racconto: *She straightened the already straight cutlery for the third time.* Cosa rivela?', ['Che è ordinata per natura e serena', 'Che è nervosa o ansiosa', 'Che le posate erano storte', 'Che sta apparecchiando per tre'], 1,
            'Il gesto ripetuto e inutile rivela **tensione**: è sottotesto.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c2-listening',
    domainId: LIST,
    title: 'Parlato naturale',
    summary: 'Velocità naturale, colloquialismi britannici, understatement, umorismo e funzioni comunicative.',
    lessons: [
      {
        id: 'c2-listening-naturale',
        title: 'Parlato naturale, idiomatico e implicito',
        minutes: 9,
        body: l4,
        keyPoints: [
          'Elisione e forme deboli nel parlato veloce.',
          'Colloquialismi: knackered, gutted, chuffed, skint.',
          'Understatement: a bit chilly durante una bufera.',
          'Chiediti cosa sta facendo chi parla: criticare, rassicurare, alludere…',
        ],
        quickCheck: [
          lq('qc-c2-list-1', LIST, 'Well, that didn\'t go entirely to plan, did it? Half the guests got food poisoning.', 'Che figura retorica usa chi parla?', ['Esagerazione', 'Understatement (minimizzazione ironica)', 'Metafora', 'Domanda sincera'], 1,
            'Dire *didn\'t go entirely to plan* di un disastro è **understatement**.', 2),
          lq('qc-c2-list-2', LIST, 'A: How did the interview go?\nB: I\'m absolutely gutted. They gave it to someone internal.', 'Come si sente B?', ['Contentissimo', 'Molto deluso', 'Stanco', 'Indifferente'], 1,
            '**Gutted** = profondamente deluso.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c2-writing',
    domainId: WRITE,
    title: 'Scrittura con controllo dello stile',
    summary: 'Recensioni critiche, sintesi di fonti, ritmo, precisione ed economia.',
    lessons: [
      {
        id: 'c2-writing-stile',
        title: 'Recensioni, sintesi e stile',
        minutes: 11,
        body: l5,
        keyPoints: [
          'Recensione: aggancio → contesto essenziale → analisi con esempi → valutazione e pubblico.',
          'Sintesi: raggruppa per idea, riformula sempre.',
          'Stile: ritmo vario, verbi forti, niente ridondanze.',
        ],
        quickCheck: [
          q('qc-c2-wr-1', WRITE, 'Quale espressione contiene una ridondanza?', ['the outcome', 'the final outcome', 'the result', 'the consequence'], 1,
            '*Outcome* è già "finale": **final outcome** è ridondante.', 1),
          q('qc-c2-wr-2', WRITE, 'In una sintesi di due articoli, quale frase è migliore?', ['Article 1 says X. Article 2 says Y.', 'Both writers acknowledge the problem; however, while the first blames policy, the second points to market forces.', 'I copied the main sentences from both.', 'The articles are different.'], 1,
            'Raggruppa **per idea** e mette in relazione le fonti.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'c2-ex-recensione', title: 'Recensione critica per una rivista', kind: 'scenario', difficulty: 3, minutes: 40, hints: [
        'Scrivi prima la frase finale: sai dove stai andando.',
        'Un esempio concreto vale più di tre aggettivi.',
        'Rileggi solo per eliminare: ridondanze, avverbi deboli, ripetizioni.',
      ] }, exRecensione),
    ],
  },
  {
    id: 'c2-speaking',
    domainId: SPEAK,
    title: 'Persuadere con precisione',
    summary: 'Riformulare le obiezioni, concedere strategicamente, sfumature e naturalezza.',
    lessons: [
      {
        id: 'c2-speaking-persuadere',
        title: 'Persuasione, precisione e naturalezza',
        minutes: 10,
        body: l6,
        keyPoints: [
          'Ridefinisci la questione a tuo vantaggio, anticipa le obiezioni.',
          'Distinzioni precise: not wrong — premature.',
          'Marcatori naturali: mind you, as it happens, the bottom line.',
        ],
        quickCheck: [
          q('qc-c2-sp-1', SPEAK, 'Quale frase fa una distinzione precisa?', ['It\'s bad.', 'I\'m not saying the idea is wrong — I\'m saying it\'s premature.', 'The idea is not good, I think.', 'I don\'t like it.'], 1,
            'Distinzione fine tra **sbagliato** e **prematuro**.', 1),
          q('qc-c2-sp-2', SPEAK, 'Quale marcatore introduce una riserva colloquiale?', ['Mind you,', 'Furthermore,', 'In conclusion,', 'Firstly,'], 0,
            '**Mind you** = però, comunque (registro parlato).', 2),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'c2-ex-persuadere', title: 'Difendi la posizione opposta', kind: 'scenario', difficulty: 3, minutes: 15, hints: [
        'Ridefinisci la domanda nella prima frase.',
        'Prepara una concessione che puoi trasformare in argomento.',
        'Chiudi con una frase memorabile e breve.',
      ] }, exPersuadere),
    ],
  },
];

export const ingleseC2 = englishLevel({
  level: 'C2',
  name: 'Padronanza',
  description:
    'Precisione quasi nativa: congiuntivo e fronting, connotazione e idiomi, testi e ascolti ricchi di sottintesi, recensioni critiche e discorsi persuasivi. Preparazione ad Aptis Advanced.',
  skills: {
    core: [
      'Usare congiuntivo, ellissi, sostituzione e fronting',
      'Scegliere parole in base alla connotazione e usare linguaggio figurato',
      'Usare idiomi avanzati e verbi di dire precisi',
    ],
    reading: ['Cogliere atteggiamento implicito, ironia e sottotesto', 'Riconoscere l\'effetto di scelte stilistiche e registri misti'],
    listening: ['Capire parlato rapido, colloquiale e idiomatico', 'Riconoscere understatement, umorismo e funzioni comunicative'],
    writing: ['Scrivere recensioni critiche e sintesi di più fonti', 'Controllare ritmo, precisione ed economia dello stile'],
    speaking: ['Persuadere con concessioni strategiche e riformulazioni', 'Esprimere sfumature fini con naturalezza'],
  },
  modules,
  questions,
});
