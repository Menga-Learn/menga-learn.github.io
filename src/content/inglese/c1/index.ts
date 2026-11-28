import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-enfasi.md?raw';
import l2 from './lessons/02-lessico-registro.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exReport from './exercises/report-proposta.md?raw';
import exArgomentare from './exercises/argomentare.md?raw';

const modules: Module[] = [
  {
    id: 'c1-core',
    domainId: CORE,
    title: 'Enfasi, precisione e registro',
    summary: 'Inversione, frasi scisse, participiali, nominalizzazione, sinonimi precisi, collocazioni e idiomi.',
    lessons: [
      {
        id: 'c1-enfasi',
        title: 'Inversione, frasi scisse e participiali',
        minutes: 12,
        body: l1,
        keyPoints: [
          'Never / Rarely / Not until / Only after a inizio frase → ausiliare + soggetto.',
          'Had I known… / Should you need… = condizionali formali senza if.',
          'Frasi scisse: It was… that…, What… is…',
          'Participiali compatte, attenzione al soggetto sospeso.',
        ],
        quickCheck: [
          q('qc-c1-enf-1', CORE, 'Completa: *Not until the end of the meeting ___ the real reason.*', ['we realised', 'did we realise', 'we did realise', 'realised we'], 1,
            'Dopo *Not until…* a inizio frase: inversione **did we realise**.', 2),
          q('qc-c1-enf-2', CORE, 'Quale frase è corretta?', ['Having finished the project, the champagne was opened.', 'Having finished the project, we opened the champagne.', 'Having finished the project, it was celebrated.', 'Finished the project, champagne opened.'], 1,
            'Il soggetto della participiale deve essere lo stesso della principale: **we** hanno finito e **we** aprono.', 3),
        ],
      },
      {
        id: 'c1-lessico',
        title: 'Lessico preciso, registro e idiomi',
        minutes: 11,
        body: l2,
        keyPoints: [
          'claim suggerisce dubbio; eventually = alla fine; economical = che fa risparmiare.',
          'Collocazioni: pose a threat, meet a deadline, a marked difference.',
          'Formale: verbi singoli (investigate) invece dei phrasal verb (look into).',
          'needn\'t have done = fatto ma non necessario.',
        ],
        quickCheck: [
          q('qc-c1-lex-1', CORE, 'Completa: *The new regulations could ___ a serious threat to small businesses.*', ['make', 'pose', 'do', 'set'], 1,
            'Collocazione: **pose a threat**.', 2),
          q('qc-c1-lex-2', CORE, '*I needn\'t have brought an umbrella.* Cosa significa?', ['Non ho portato l\'ombrello e non serviva', 'Ho portato l\'ombrello ma non serviva', 'Avrei dovuto portarlo', 'Non potevo portarlo'], 1,
            '*Needn\'t have + participio*: l\'azione **è stata fatta** ma era inutile.', 3),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c1-reading',
    domainId: READ,
    title: 'Testi complessi',
    summary: 'Distinguere le voci, capire la posizione dell\'autore e la funzione dei paragrafi.',
    lessons: [
      {
        id: 'c1-reading-complessi',
        title: 'Posizione dell\'autore e struttura',
        minutes: 10,
        body: l3,
        keyPoints: [
          'Le opinioni riportate (proponents argue…) non sono quelle dell\'autore.',
          'claim, allege, purportedly segnalano distanza.',
          'Etichetta ogni paragrafo con la sua funzione.',
        ],
        quickCheck: [
          q('qc-c1-read-1', READ, '> Critics allege that the report was rushed. Its authors, however, point to eighteen months of consultation.\n\nCosa segnala *allege*?', ['Che l\'accusa è dimostrata', 'Che si tratta di un\'accusa non provata', 'Che l\'autore è d\'accordo con i critici', 'Che il rapporto è stato ritirato'], 1,
            '*Allege* presenta un\'affermazione **non dimostrata**, prendendone le distanze.', 2),
          q('qc-c1-read-2', READ, 'Un paragrafo inizia con *This is not to say that the policy has failed entirely.* Qual è la sua funzione?', ['Introdurre un nuovo tema', 'Ridimensionare la critica del paragrafo precedente', 'Concludere il testo', 'Fornire dati statistici'], 1,
            '*This is not to say that…* **limita** quanto detto prima.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c1-listening',
    domainId: LIST,
    title: 'Conferenze e dibattiti',
    summary: 'Gradi di certezza, struttura di una conferenza, posizioni in un dibattito, accenti diversi.',
    lessons: [
      {
        id: 'c1-listening-conferenze',
        title: 'Conferenze, dibattiti e sfumature',
        minutes: 9,
        body: l4,
        keyPoints: [
          'Distingui beyond doubt / strongly suggests / conceivable.',
          'I segnali (This brings me to…, The crucial point is…) indicano le parti chiave.',
          'Up to a point = accordo parziale; That\'s all very well, but = obiezione.',
        ],
        quickCheck: [
          lq('qc-c1-list-1', LIST, 'It\'s conceivable that the drug has some effect on memory, but frankly, the evidence so far is thin.', 'Quanto è sicuro chi parla dell\'effetto del farmaco?', ['Molto sicuro', 'Poco sicuro', 'Del tutto certo che non funzioni', 'Non si esprime'], 1,
            '*Conceivable* + *the evidence is thin* = **certezza bassa**.', 2),
          lq('qc-c1-list-2', LIST, 'A: So remote learning is just as effective as the classroom.\nB: Up to a point. For motivated adults, perhaps. For young children, I\'m far less convinced.', 'Qual è la posizione di B?', ['Totalmente d\'accordo', 'Accordo parziale', 'Totalmente contrario', 'Non ha opinione'], 1,
            '*Up to a point* = accordo **parziale**, con una riserva sui bambini.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'c1-writing',
    domainId: WRITE,
    title: 'Saggi e relazioni',
    summary: 'Saggi discorsivi bilanciati, relazioni e proposte con raccomandazioni, coesione avanzata.',
    lessons: [
      {
        id: 'c1-writing-saggi',
        title: 'Saggi discorsivi e relazioni',
        minutes: 11,
        body: l5,
        keyPoints: [
          'Saggio: questione → pro → contro → valutazione motivata.',
          'Relazione: titoli, linguaggio impersonale, raccomandazioni collegate ai dati.',
          'Coesione con riferimenti e nominalizzazioni, non solo connettivi.',
        ],
        quickCheck: [
          q('qc-c1-wr-1', WRITE, 'Quale frase è adatta a una relazione formale?', ['Loads of people hate the canteen.', 'A significant proportion of respondents expressed dissatisfaction with the canteen.', 'Everyone hates the canteen.', 'The canteen is rubbish, people say.'], 1,
            'Linguaggio **impersonale** e quantificatore preciso.', 1),
          q('qc-c1-wr-2', WRITE, 'Completa: *It is recommended that the company ___ flexible hours.*', ['introduces', 'introduce', 'will introduce', 'introducing'], 1,
            'Dopo *recommend that* si usa il **congiuntivo** (forma base): *introduce* (o *should introduce*).', 3),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'c1-ex-report', title: 'Relazione sulla mensa aziendale', kind: 'scenario', difficulty: 3, minutes: 35, hints: [
        'Titoli: Introduction, Main findings, Recommendations, Conclusion.',
        'Riformula le percentuali con quantificatori (a clear majority, roughly a third).',
        'Ogni raccomandazione deve rispondere a un dato.',
      ] }, exReport),
    ],
  },
  {
    id: 'c1-speaking',
    domainId: SPEAK,
    title: 'Argomentare a voce',
    summary: 'Sviluppare una posizione, confrontare prospettive e rispondere alle obiezioni.',
    lessons: [
      {
        id: 'c1-speaking-argomentare',
        title: 'Argomentare e gestire una discussione',
        minutes: 10,
        body: l6,
        keyPoints: [
          'Inquadra → sviluppa → considera l\'obiezione → concludi.',
          'It\'s not so much… as…, On balance, I\'d come down on the side of…',
          'Riconosci l\'obiezione prima di ribattere.',
        ],
        quickCheck: [
          q('qc-c1-sp-1', SPEAK, 'Quale frase esprime una posizione finale ponderata?', ['I think yes.', 'On balance, I\'d come down on the side of stricter regulation.', 'Regulation good.', 'Maybe yes, maybe no.'], 1,
            '**On balance, I\'d come down on the side of…** conclude soppesando gli argomenti.', 1),
          q('qc-c1-sp-2', SPEAK, 'L\'interlocutore solleva un\'obiezione valida. Come inizi la risposta?', ['No, you\'re wrong.', 'That\'s a fair point, but I\'d say it highlights…', 'Whatever.', 'I don\'t agree with nothing.'], 1,
            'Riconoscere l\'obiezione (*That\'s a fair point*) prima di ribattere è tipico del C1.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'c1-ex-argomentare', title: 'Auto nei centri storici: argomenta e rispondi', kind: 'scenario', difficulty: 3, minutes: 15, hints: [
        'Inizia inquadrando la questione, non con "I think".',
        'Prepara un esempio concreto (una città, un dato).',
        'Nella risposta all\'obiezione: riconosci → ridimensiona → proponi.',
      ] }, exArgomentare),
    ],
  },
];

export const ingleseC1 = englishLevel({
  level: 'C1',
  name: 'Efficacia',
  description:
    'Usa l\'inglese con flessibilità per studio e lavoro: inversione e frasi scisse, registro e collocazioni, testi complessi, conferenze, relazioni e discussioni. Preparazione ad Aptis Advanced.',
  skills: {
    core: [
      'Usare inversione, frasi scisse, participiali e nominalizzazione',
      'Scegliere sinonimi precisi, collocazioni e registro adeguato',
      'Usare idiomi frequenti e modali con sfumature (needn\'t have, be bound to)',
    ],
    reading: ['Distinguere opinioni riportate e posizione dell\'autore', 'Riconoscere la funzione dei paragrafi e l\'ironia'],
    listening: ['Capire conferenze e dibattiti a velocità naturale', 'Cogliere gradi di certezza e posizioni sfumate'],
    writing: ['Scrivere saggi discorsivi bilanciati', 'Scrivere relazioni e proposte con raccomandazioni motivate'],
    speaking: ['Sviluppare e difendere un argomento complesso', 'Confrontare prospettive e rispondere alle obiezioni'],
  },
  modules,
  questions,
});
