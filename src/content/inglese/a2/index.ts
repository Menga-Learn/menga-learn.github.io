import type { Module } from '../../../types';
import { exercise, lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE, englishLevel } from '../common';
import { questions } from './questions';

import l1 from './lessons/01-past-simple.md?raw';
import l2 from './lessons/02-confronti-futuro.md?raw';
import l3 from './lessons/03-reading.md?raw';
import l4 from './lessons/04-listening.md?raw';
import l5 from './lessons/05-writing.md?raw';
import l6 from './lessons/06-speaking.md?raw';
import exEmail from './exercises/email-invito.md?raw';
import exFoto from './exercises/descrivi-foto.md?raw';

const modules: Module[] = [
  {
    id: 'a2-core',
    domainId: CORE,
    title: 'Passato, confronti e futuro',
    summary: 'Past simple, comparativi, quantità, going to e i verbi modali di obbligo e possibilità.',
    lessons: [
      {
        id: 'a2-past-simple',
        title: 'Past simple: regolari, irregolari, domande',
        minutes: 9,
        body: l1,
        keyPoints: [
          'Regolari in -ed (lived, studied, stopped); irregolari da memorizzare (went, saw, bought).',
          'Negazioni e domande con did + verbo base: Did you go?',
          'ago va dopo il periodo: two days ago.',
          'Con un tempo passato preciso usa il past simple, non il present perfect.',
        ],
        quickCheck: [
          q('qc-a2-past-1', CORE, 'Completa: *We ___ to Paris last summer.*', ['go', 'went', 'have gone', 'did go'], 1,
            '*Last summer* è un tempo passato concluso: past simple di *go* → **went**.', 1),
          q('qc-a2-past-2', CORE, 'Completa: *Did she ___ the email?*', ['sent', 'sends', 'send', 'sending'], 2,
            'Dopo **did** il verbo torna alla forma base: *Did she **send**…?*', 1),
        ],
      },
      {
        id: 'a2-confronti-futuro',
        title: 'Comparativi, quantità e futuro',
        minutes: 10,
        body: l2,
        keyPoints: [
          'Comparativo + than: bigger than, more expensive than; good → better → the best.',
          'much con i non numerabili, many con i numerabili; information e advice non hanno plurale.',
          'going to per i piani, present continuous per gli appuntamenti, will per decisioni immediate.',
          'mustn\'t = è vietato; don\'t have to = non è necessario.',
        ],
        quickCheck: [
          q('qc-a2-cmp-1', CORE, 'Completa: *This hotel is ___ than the other one.*', ['more cheap', 'cheaper', 'cheapest', 'the cheaper'], 1,
            '*Cheap* è di una sillaba: comparativo **cheaper** + *than*.', 1),
          q('qc-a2-cmp-2', CORE, 'Quale frase significa "non è necessario che tu venga"?', ['You mustn\'t come.', 'You don\'t have to come.', 'You can\'t come.', 'You have to come.'], 1,
            '**Don\'t have to** = non c\'è obbligo. *Mustn\'t* invece significa che è vietato.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a2-reading',
    domainId: READ,
    title: 'Capire email, avvisi e brevi storie',
    summary: 'Parafrasi, scopo del testo, completamento e ordine delle frasi.',
    lessons: [
      {
        id: 'a2-reading-testi',
        title: 'Email, avvisi e brevi articoli',
        minutes: 8,
        body: l3,
        keyPoints: [
          'La risposta giusta riformula il testo; quella sbagliata spesso lo copia.',
          'Chiediti sempre lo scopo del testo: invitare, scusarsi, chiedere, avvisare.',
          'Per ordinare frasi segui pronomi, connettivi e l\'articolo the.',
        ],
        quickCheck: [
          q('qc-a2-read-1', READ, '> Tickets are free for children under 12.\n\nQuale affermazione è vera?', ['Un bambino di 10 anni non paga', 'Un bambino di 14 anni non paga', 'Gli adulti non pagano', 'I biglietti sono finiti'], 0,
            '*Under 12* = sotto i 12 anni: un bambino di **10 anni** entra gratis.', 1),
          q('qc-a2-read-2', READ, 'In una storia trovi la frase *Then he put it in his bag.* Quale frase deve venire prima?', ['He went home.', 'He found an old key on the street.', 'Finally he went to bed.', 'It was a sunny morning.'], 1,
            '*It* rimanda a un oggetto già nominato (*an old key*) e *then* indica che segue un\'azione precedente.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a2-listening',
    domainId: LIST,
    title: 'Conversazioni quotidiane',
    summary: 'Indicazioni, negozi, programmi che cambiano: cogliere la correzione finale.',
    lessons: [
      {
        id: 'a2-listening-conversazioni',
        title: 'Indicazioni, acquisti e cambi di programma',
        minutes: 8,
        body: l4,
        keyPoints: [
          'actually, instead, but segnalano che l\'informazione sta cambiando.',
          'Lessico delle indicazioni: straight on, turn left, opposite, between.',
          'Primo ascolto per il senso, secondo per il dettaglio.',
        ],
        quickCheck: [
          lq('qc-a2-list-1', LIST, 'A: Shall we meet at the cinema at seven?\nB: Actually, let\'s meet at the café opposite. It\'s warmer.', 'Dove si incontrano?', ['Al cinema', 'Al bar di fronte al cinema', 'A casa', 'Alla stazione'], 1,
            '*Actually* introduce il cambio di programma: si vedono al **café opposite**.', 2),
          lq('qc-a2-list-2', LIST, 'Go straight on, then take the second street on the left. The pharmacy is at the end of the road.', 'Dove si trova la farmacia?', ['Prima strada a destra', 'In fondo alla seconda strada a sinistra', 'All\'angolo', 'Di fronte alla stazione'], 1,
            '*Second street on the left* e *at the end of the road* = in fondo alla seconda strada a sinistra.', 2),
        ],
      },
    ],
    exercises: [],
  },
  {
    id: 'a2-writing',
    domainId: WRITE,
    title: 'Email informali',
    summary: 'Connettivi, struttura dell\'email e risposta a tutti i punti del compito.',
    lessons: [
      {
        id: 'a2-writing-email',
        title: 'Frasi collegate ed email informali',
        minutes: 8,
        body: l5,
        keyPoints: [
          'Connettivi base: and, but, because, so, then.',
          'Email: saluto, apertura, corpo con tutti i punti, chiusura.',
          'Mantieni coerenti i tempi verbali.',
        ],
        quickCheck: [
          q('qc-a2-wr-1', WRITE, 'Completa: *It was raining, ___ we stayed at home.*', ['because', 'so', 'but', 'although'], 1,
            'Si esprime la **conseguenza**: *so*.', 1),
          q('qc-a2-wr-2', WRITE, 'Il compito chiede di ringraziare, accettare l\'invito e chiedere cosa portare. Cosa succede se non chiedi cosa portare?', ['Niente, conta solo la grammatica', 'Perdi punti perché il compito è incompleto', 'Va bene se il testo è lungo', 'Va bene se usi parole difficili'], 1,
            'La valutazione considera anche il **completamento del compito**: ogni punto mancante pesa.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'a2-ex-email', title: 'Rispondi all\'invito di una collega', kind: 'scenario', difficulty: 1, minutes: 12, hints: [
        'Fai una lista dei tre punti prima di scrivere.',
        'Usa but e so per collegare le frasi.',
        'Per proporre: What about…? / We could…',
      ] }, exEmail),
    ],
  },
  {
    id: 'a2-speaking',
    domainId: SPEAK,
    title: 'Descrivere e raccontare',
    summary: 'Descrivere una foto con il present continuous e raccontare esperienze al past simple.',
    lessons: [
      {
        id: 'a2-speaking-foto',
        title: 'Descrivere una foto e raccontare esperienze',
        minutes: 8,
        body: l6,
        keyPoints: [
          'Schema: generale → dove → chi/cosa (present continuous) → ipotesi.',
          'in the foreground / in the background / on the left.',
          'Esperienze al past simple con first, then, after that.',
        ],
        quickCheck: [
          q('qc-a2-sp-1', SPEAK, 'Stai descrivendo una foto. Quale frase è corretta?', ['A woman reads a book now.', 'A woman is reading a book.', 'A woman read a book.', 'A woman reading a book is.'], 1,
            'Per ciò che accade nella foto usa il **present continuous**: *is reading*.', 1),
          q('qc-a2-sp-2', SPEAK, 'Come dici "sullo sfondo"?', ['in the back', 'in the background', 'at the bottom', 'behind of'], 1,
            '**In the background** = sullo sfondo; *in the foreground* = in primo piano.', 1),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'a2-ex-foto', title: 'Descrivi una foto in 45 secondi', kind: 'scenario', difficulty: 2, minutes: 12, hints: [
        'Inizia dal generale: In this picture I can see…',
        'Usa il present continuous per le persone.',
        'Nella seconda domanda resta al past simple.',
      ] }, exFoto),
    ],
  },
];

export const ingleseA2 = englishLevel({
  level: 'A2',
  name: 'Sopravvivenza',
  description:
    'Racconta il passato, fai confronti e programmi: past simple, comparativi, futuro, email informali e descrizione di foto. Il livello A2 di Aptis General.',
  skills: {
    core: [
      'Usare past simple, comparativi e superlativi, going to, present continuous per il futuro',
      'Usare can, have to, must e some/any, much/many',
      'Riconoscere il lessico di viaggi, acquisti, lavoro, salute e tempo libero',
    ],
    reading: ['Capire il senso di frasi in email, avvisi e brevi articoli', 'Ricostruire l\'ordine di una breve storia'],
    listening: ['Capire conversazioni quotidiane su acquisti, indicazioni e programmi', 'Cogliere correzioni e cambi di programma'],
    writing: ['Rispondere con frasi collegate a domande quotidiane', 'Scrivere un\'email informale di 30–50 parole rispondendo a tutti i punti'],
    speaking: ['Descrivere una foto', 'Raccontare un\'esperienza recente ed esprimere una preferenza con il motivo'],
  },
  modules,
  questions,
});
