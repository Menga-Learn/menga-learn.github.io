import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-to-be.md?raw';
import l2 from './lessons/02-present-simple.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exModulo from './exercises/modulo-messaggio.md?raw';
import exPresentati from './exercises/presentati.md?raw';

const modules: Module[] = [
  {
    id: 'a1-core',
    domainId: CORE,
    title: 'Le basi: to be, present simple e parole di tutti i giorni',
    summary: 'Le strutture che reggono ogni frase A1 e il lessico di famiglia, casa, cibo e tempo.',
    lessons: [
      {
        id: 'a1-to-be',
        title: 'Il verbo to be, possessivi e articoli',
        minutes: 8,
        body: l1,
        keyPoints: [
          'am / is / are, con forme contratte e negazioni con not.',
          'Il soggetto in inglese non si omette mai (It\'s late).',
          'L\'età si dice con to be: I\'m 30.',
          'a davanti a suono consonantico, an davanti a suono vocalico; a/an con le professioni.',
        ],
        quickCheck: [
          q('qc-a1-be-1', CORE, 'Completa: *My sister ___ 25 years old.*', ['has', 'is', 'are', 'have'], 1,
            'L\'età si esprime con **to be**: *She is 25*. "Ha 25 anni" non si traduce con *have*.', 1),
          q('qc-a1-be-2', CORE, 'Quale frase è corretta?', ['He is engineer.', 'He is an engineer.', 'He is a engineer.', 'Is engineer.'], 1,
            'Con le professioni serve l\'articolo, e *engineer* inizia con suono vocalico: **an engineer**.', 1),
        ],
      },
      {
        id: 'a1-present-simple',
        title: 'Present simple, there is/are e lessico essenziale',
        minutes: 9,
        body: l2,
        keyPoints: [
          'Terza persona singolare con -s/-es: she works, he goes, it has.',
          'Negazioni e domande con do/does + verbo base: He doesn\'t work.',
          'Avverbi di frequenza prima del verbo, dopo to be.',
          'at + ora, on + giorno, in + mese/anno.',
        ],
        quickCheck: [
          q('qc-a1-ps-1', CORE, 'Completa: *She ___ in a bank.*', ['work', 'works', 'is work', 'working'], 1,
            'Present simple, terza persona singolare: **works**.', 1),
          q('qc-a1-ps-2', CORE, 'Completa: *The museum is closed ___ Monday.*', ['in', 'at', 'on', 'to'], 2,
            'Con i giorni della settimana si usa **on**.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a1-reading',
    domainId: READ,
    title: 'Leggere testi brevi',
    summary: 'Cartelli, messaggi e moduli: trovare l\'informazione giusta senza capire ogni parola.',
    lessons: [
      {
        id: 'a1-reading-brevi',
        title: 'Cartelli, moduli e messaggi brevi',
        minutes: 7,
        body: l3,
        keyPoints: [
          'Leggi prima la domanda, poi cerca parole chiave e numeri.',
          'Diffida delle opzioni che ripetono parole del testo ma ne cambiano il senso.',
          'Cartelli frequenti: OUT OF ORDER, NO PARKING, PUSH/PULL.',
        ],
        quickCheck: [
          q('qc-a1-read-1', READ, 'Su una macchinetta leggi **OUT OF ORDER**. Cosa significa?', ['È fuori servizio', 'È in ordine', 'È esaurita', 'Funziona solo con monete'], 0,
            '**Out of order** = guasto, non funzionante.', 1),
          q('qc-a1-read-2', READ,
            '> Hi Tom, the train is late. I\'m at the café at 6, not 5. Anna\n\nA che ora Anna incontra Tom?',
            ['Alle 5', 'Alle 6', 'Alle 5 e alle 6', 'Non si sa'], 1,
            'Anna dice *at 6, **not 5***: il 5 è citato ma negato, tipica distrazione.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a1-listening',
    domainId: LIST,
    title: 'Capire numeri, orari e dati personali',
    summary: 'Le informazioni concrete che contano all\'ascolto: -teen/-ty, orari, prezzi, spelling.',
    lessons: [
      {
        id: 'a1-listening-numeri',
        title: 'Numeri, orari, prezzi e spelling all\'ascolto',
        minutes: 8,
        body: l4,
        keyPoints: [
          '-teen ha l\'accento in fondo (thirTEEN), -ty all\'inizio (THIRty).',
          'quarter past = e un quarto, quarter to = meno un quarto, half past = e mezza.',
          'Nei numeri di telefono 0 = "oh", 55 = "double five".',
          'Ascolta prima senza trascrizione, poi controlla.',
        ],
        quickCheck: [
          lq('qc-a1-list-1', LIST, 'The bus leaves at quarter to nine.', 'A che ora parte l\'autobus?', ['8:15', '8:45', '9:15', '9:45'], 1,
            '*Quarter to nine* = le nove meno un quarto, cioè **8:45**.', 1),
          lq('qc-a1-list-2', LIST, 'The ticket is fifteen pounds.', 'Quanto costa il biglietto?', ['£15', '£50', '£5', '£16'], 0,
            '*Fifteen* (accento su *-TEEN*) = **15**; *fifty* sarebbe 50.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a1-writing',
    domainId: WRITE,
    title: 'Scrivere moduli e messaggi',
    summary: 'Dati personali, maiuscole, frasi complete e un messaggio di 20–30 parole.',
    lessons: [
      {
        id: 'a1-writing-moduli',
        title: 'Moduli e messaggi brevi',
        minutes: 7,
        body: l5,
        keyPoints: [
          'Maiuscole per I, giorni, mesi, nazionalità e lingue.',
          'Ogni frase ha soggetto e verbo e finisce con il punto.',
          'Messaggio: saluto → informazione → domanda/proposta → chiusura.',
        ],
        quickCheck: [
          q('qc-a1-wr-1', WRITE, 'Quale frase ha le maiuscole corrette?', ['i speak italian.', 'I speak Italian.', 'I Speak italian.', 'i Speak Italian.'], 1,
            'In inglese il pronome **I** e le lingue/nazionalità (**Italian**) vogliono sempre la maiuscola.', 1),
          q('qc-a1-wr-2', WRITE, 'Nel modulo leggi **Occupation**. Cosa scrivi?', ['Il tuo indirizzo', 'Il tuo lavoro', 'La tua nazionalità', 'Il tuo stato civile'], 1,
            '*Occupation* = professione, lavoro (es. *teacher*, *student*).', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'a1-ex-modulo', title: 'Modulo di iscrizione e messaggio all\'insegnante', kind: 'scenario', difficulty: 1, minutes: 10, hints: [
        'Controlla le maiuscole di nome, cognome e nazionalità.',
        'Nel messaggio usa la struttura saluto → presentazione → disponibilità → domanda.',
        'Per la domanda: Is the course…? oppure Does the course…?',
      ] }, exModulo),
    ],
  },
  {
    id: 'a1-speaking',
    domainId: SPEAK,
    title: 'Parlare di sé',
    summary: 'Presentarsi, parlare di famiglia, lavoro e tempo libero con risposte di almeno tre frasi.',
    lessons: [
      {
        id: 'a1-speaking-presentarsi',
        title: 'Presentarsi e rispondere a domande personali',
        minutes: 7,
        body: l6,
        keyPoints: [
          'Risposta + dettaglio + motivo: mai fermarsi a una frase.',
          'Se non capisci: Sorry, can you repeat, please?',
          'Fai sentire la -s della terza persona e la h aspirata.',
        ],
        quickCheck: [
          q('qc-a1-sp-1', SPEAK, 'L\'esaminatore chiede *What do you do?*. Cosa ti sta chiedendo?', ['Cosa stai facendo adesso', 'Che lavoro fai', 'Cosa fai nel fine settimana', 'Come stai'], 1,
            '*What do you do?* chiede la **professione**. Per "cosa stai facendo" si dice *What are you doing?*.', 1),
          q('qc-a1-sp-2', SPEAK, 'Quale risposta a *Tell me about your family* è più completa per lo Speaking?', [
            'Four.',
            'My family is four people.',
            'There are four people in my family: my parents, my brother and me. My brother is a student.',
            'Yes, I have a family.',
          ], 2, 'La risposta migliore usa una struttura corretta (*There are…*) e **aggiunge un dettaglio**.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'a1-ex-presentati', title: 'Presentati in 30 secondi', kind: 'scenario', difficulty: 1, minutes: 10, hints: [
        'Non leggere: prepara solo parole chiave.',
        'Per ogni domanda almeno tre frasi.',
        'Registrati e riascoltati con la checklist.',
      ] }, exPresentati),
    ],
  },
];

export const ingleseA1 = englishLevel({
  level: 'A1',
  name: 'Contatto',
  description:
    'Le basi per presentarti e capire frasi quotidiane: to be, present simple, numeri e orari, moduli e messaggi brevi. Allineato ai livelli più bassi di Aptis General.',
  skills: {
    core: [
      'Usare to be, have got, present simple, there is/are e i pronomi',
      'Usare articoli, plurali, possessivi e preposizioni di tempo e luogo di base',
      'Riconoscere il lessico di famiglia, casa, cibo, numeri, giorni e mesi',
    ],
    reading: ['Capire cartelli, avvisi e moduli', 'Trovare informazioni concrete in messaggi ed email brevi'],
    listening: ['Capire numeri, prezzi, orari e nomi sillabati', 'Capire brevi scambi su informazioni personali pronunciati lentamente'],
    writing: ['Compilare un modulo con i dati personali', 'Scrivere frasi semplici e un messaggio di 20–30 parole'],
    speaking: ['Presentarsi e rispondere a domande personali', 'Chiedere di ripetere o di parlare più lentamente'],
  },
  modules,
  questions,
});
