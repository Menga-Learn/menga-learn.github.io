import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-present-perfect.md?raw';
import l2 from './lessons/02-condizionali-passivo.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exEmail from './exercises/due-email.md?raw';
import exFoto from './exercises/confronta-foto.md?raw';

const modules: Module[] = [
  {
    id: 'b1-core',
    domainId: CORE,
    title: 'Tempi verbali, condizionali e passivo',
    summary: 'Present perfect contro past simple, past continuous, primo e secondo condizionale, relative e passivo.',
    lessons: [
      {
        id: 'b1-present-perfect',
        title: 'Present perfect, past simple e past continuous',
        minutes: 10,
        body: l1,
        keyPoints: [
          'Present perfect per esperienze, risultati presenti e situazioni ancora vere (for/since).',
          'Con un momento passato preciso: past simple.',
          'for + durata, since + punto di partenza.',
          'Past continuous per lo sfondo, interrotto dal past simple.',
        ],
        quickCheck: [
          q('qc-b1-pp-1', CORE, 'Completa: *I ___ in this company since 2020.*', ['work', 'worked', 'have worked', 'am working'], 2,
            'Situazione iniziata nel passato e ancora vera, con *since*: **have worked**.', 2),
          q('qc-b1-pp-2', CORE, 'Completa: *I ___ a shower when the doorbell rang.*', ['had', 'was having', 'have had', 'am having'], 1,
            'Azione in corso interrotta da un\'altra: **was having** (past continuous).', 2),
        ],
      },
      {
        id: 'b1-condizionali',
        title: 'Condizionali, relative e passivo',
        minutes: 10,
        body: l2,
        keyPoints: [
          'Primo condizionale: if + present, will + verbo (niente will dopo if).',
          'Secondo condizionale: if + past, would + verbo; If I were you…',
          'who per persone, which per cose, where per luoghi, whose per possesso.',
          'Passivo: be + participio passato, agente con by.',
        ],
        quickCheck: [
          q('qc-b1-cond-1', CORE, 'Completa: *If I ___ more money, I would travel around the world.*', ['have', 'had', 'will have', 'would have'], 1,
            'Secondo condizionale (ipotesi irreale): **if + past simple**.', 2),
          q('qc-b1-cond-2', CORE, 'Completa: *This church ___ in the 12th century.*', ['built', 'was built', 'has built', 'is building'], 1,
            'Passivo al passato: **was built**.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b1-reading',
    domainId: READ,
    title: 'Testi lunghi e opinioni',
    summary: 'Abbinare opinioni e persone, titoli e paragrafi, capire l\'atteggiamento dell\'autore.',
    lessons: [
      {
        id: 'b1-reading-opinioni',
        title: 'Testi più lunghi e opinioni',
        minutes: 9,
        body: l3,
        keyPoints: [
          'Cerca la stessa idea con parole diverse, non le stesse parole.',
          'L\'opinione finale conta più di quella iniziale.',
          'Titoli: idea principale del paragrafo, non un dettaglio.',
          'Skimming per il senso generale, scanning per i dettagli.',
        ],
        quickCheck: [
          q('qc-b1-read-1', READ, '> At first I thought working from home would be lonely, but now I can\'t imagine going back to the office.\n\nCosa pensa ora chi scrive del lavoro da casa?', ['Che è solitario', 'Che è positivo', 'Che vuole tornare in ufficio', 'Non ha un\'opinione'], 1,
            '*At first… but now*: l\'opinione **attuale** è positiva.', 2),
          q('qc-b1-read-2', READ, 'Un autore scrive *I\'m not convinced that the new law will help.* Qual è il suo atteggiamento?', ['Entusiasta', 'Scettico', 'Indifferente', 'Arrabbiato'], 1,
            '*I\'m not convinced* esprime **dubbio/scetticismo**.', 1),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b1-listening',
    domainId: LIST,
    title: 'Opinioni, scopi e intenzioni',
    summary: 'Messaggi, annunci e discussioni: capire perché qualcuno parla e cosa pensa.',
    lessons: [
      {
        id: 'b1-listening-opinioni',
        title: 'Idee principali, opinioni e intenzioni',
        minutes: 8,
        body: l4,
        keyPoints: [
          'Domande su scopo, opinione, intenzione e punto di accordo.',
          'Accordo: Exactly / I couldn\'t agree more; disaccordo: I see what you mean, but…',
          'Lo scopo di un messaggio si capisce spesso all\'inizio (I\'m calling to…).',
        ],
        quickCheck: [
          lq('qc-b1-list-1', LIST, 'Hi Tom, it\'s Jane. I\'m calling to let you know that the meeting tomorrow has been moved to Thursday. Can you tell the others?', 'Perché Jane chiama?', ['Per annullare la riunione', 'Per comunicare lo spostamento della riunione', 'Per invitare Tom a cena', 'Per chiedere un documento'], 1,
            '*I\'m calling to let you know… has been moved to Thursday*: comunica uno **spostamento**.', 1),
          lq('qc-b1-list-2', LIST, 'A: I think we should take the car, it\'s quicker.\nB: I see what you mean, but parking in the centre is a nightmare.', 'Cosa pensa B?', ['È d\'accordo', 'Non è convinto di prendere la macchina', 'Vuole guidare lui', 'Non ha capito'], 1,
            '*I see what you mean, **but**…* è un disaccordo cortese.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'b1-writing',
    domainId: WRITE,
    title: 'Due registri: informale e formale',
    summary: 'La stessa situazione raccontata a un amico e a un\'organizzazione.',
    lessons: [
      {
        id: 'b1-writing-registri',
        title: 'Email informale ed email formale',
        minutes: 10,
        body: l5,
        keyPoints: [
          'Formale: niente contrazioni, lessico più neutro, richieste indirette.',
          'Yours faithfully se non conosci il nome, Yours sincerely se lo conosci.',
          'Struttura formale: motivo → fatti → conseguenze → richiesta → chiusura.',
        ],
        quickCheck: [
          q('qc-b1-wr-1', WRITE, 'Scrivi a *Dear Sir or Madam*. Come chiudi?', ['Yours sincerely,', 'Yours faithfully,', 'Love,', 'Cheers,'], 1,
            'Se non conosci il nome del destinatario: **Yours faithfully**.', 2),
          q('qc-b1-wr-2', WRITE, 'Quale richiesta è adatta a un\'email formale?', ['Send me the money now.', 'I would be grateful if you could refund the cost.', 'Can you give me my money back?', 'Money back, please!'], 1,
            '**I would be grateful if you could…** è la formula formale e cortese.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'b1-ex-email', title: 'Due email sul cambio del corso', kind: 'scenario', difficulty: 2, minutes: 25, hints: [
        'Prima elenca i fatti: nuovo giorno, nuovo prezzo, data.',
        'Nell\'email formale: Firstly… Secondly… per i problemi.',
        'Chiudi con una proposta concreta e I look forward to hearing from you.',
      ] }, exEmail),
    ],
  },
  {
    id: 'b1-speaking',
    domainId: SPEAK,
    title: 'Confrontare e speculare',
    summary: 'Confrontare due immagini, fare ipotesi e dare opinioni motivate.',
    lessons: [
      {
        id: 'b1-speaking-confronto',
        title: 'Confrontare due immagini',
        minutes: 9,
        body: l6,
        keyPoints: [
          'Tema comune (both) → differenze (whereas) → opinione.',
          'might / must / can\'t per fare ipotesi.',
          'Domande astratte: opinione → motivo → esempio.',
        ],
        quickCheck: [
          q('qc-b1-sp-1', SPEAK, 'Quale frase confronta correttamente due foto?', ['The first picture is in a city, whereas the second one is in the countryside.', 'The first picture is city and second countryside.', 'The pictures is different.', 'First city, second country.'], 0,
            '**Whereas** collega due situazioni in contrasto in una frase corretta.', 1),
          q('qc-b1-sp-2', SPEAK, 'Nella foto le persone indossano costumi da bagno. Quale ipotesi è logica?', ['They can\'t be at the beach.', 'They must be at the beach or a pool.', 'They might be in an office.', 'They must be skiing.'], 1,
            'Indizio forte → **must** (quasi certezza).', 2),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'b1-ex-foto', title: 'Confronta due foto', kind: 'scenario', difficulty: 2, minutes: 15, hints: [
        'Inizia con Both pictures show…',
        'Usa almeno una volta whereas o while.',
        'Fai un\'ipotesi con might o must.',
      ] }, exFoto),
    ],
  },
];

export const ingleseB1 = englishLevel({
  level: 'B1',
  name: 'Soglia',
  description:
    'Diventa autonomo: present perfect, condizionali e passivo, testi lunghi e opinioni, email formali e confronto tra immagini. Il livello B1 di Aptis General.',
  skills: {
    core: [
      'Scegliere tra present perfect, past simple e past continuous',
      'Usare primo e secondo condizionale, frasi relative e passivo',
      'Usare should, had better, be allowed to e il lessico di lavoro, studio, ambiente e tecnologia',
    ],
    reading: ['Capire idee principali e opinioni in testi di 200–400 parole', 'Abbinare titoli a paragrafi e opinioni a persone'],
    listening: ['Capire lo scopo di messaggi e annunci', 'Riconoscere opinioni, accordo e disaccordo in conversazioni'],
    writing: ['Scrivere un\'email informale e una formale sulla stessa situazione', 'Organizzare un testo con connettivi (however, as a result, firstly)'],
    speaking: ['Descrivere e confrontare due immagini', 'Fare ipotesi e motivare un\'opinione con esempi'],
  },
  modules,
  questions,
});
