import type { Question } from '../../../types';
import { lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE } from '../common';

/** Banca domande originale per il livello A1 (non sono domande reali del test Aptis). */

const core: Question[] = [
  q('a1-c-01', CORE, 'Completa: *___ you from Spain?*', ['Is', 'Are', 'Am', 'Do'], 1, 'Con *you* il verbo to be è **are**; nella domanda si inverte: *Are you…?*', 1),
  q('a1-c-02', CORE, 'Completa: *They ___ at school today.*', ['isn\'t', 'aren\'t', 'don\'t', 'not'], 1, '*They* vuole **are**, al negativo **aren\'t**.', 1),
  q('a1-c-03', CORE, 'Completa: *This is Anna and that is ___ brother.*', ['his', 'her', 'she', 'their'], 1, 'Il fratello di Anna (femminile, singolare): **her** brother. *His* si riferisce a un uomo.', 1),
  q('a1-c-04', CORE, 'Completa: *I have ___ apple and ___ banana.*', ['a / a', 'an / a', 'an / an', 'a / an'], 1, '**an** apple (suono vocalico), **a** banana (suono consonantico).', 1),
  q('a1-c-05', CORE, 'Completa: *My father ___ TV in the evening.*', ['watch', 'watchs', 'watches', 'is watch'], 2, 'I verbi in **-ch** alla terza persona prendono **-es**: *watches*.', 1),
  q('a1-c-06', CORE, 'Completa: *___ your brother play football?*', ['Do', 'Does', 'Is', 'Are'], 1, 'Domanda al present simple con *your brother* (he): **Does** + verbo base.', 1),
  q('a1-c-07', CORE, 'Qual è la posizione corretta dell\'avverbio?', ['I go usually to work by bus.', 'I usually go to work by bus.', 'Usually I go usually to work.', 'I go to work usually by bus usually.'], 1, 'Gli avverbi di frequenza vanno **prima del verbo principale**: *I usually go*.', 1),
  q('a1-c-08', CORE, 'Completa: *There ___ two chairs in the kitchen.*', ['is', 'are', 'be', 'has'], 1, 'Plurale (*two chairs*): **There are**.', 1),
  q('a1-c-09', CORE, 'Quale parola NON appartiene alla famiglia?', ['daughter', 'uncle', 'kitchen', 'wife'], 2, '**Kitchen** è la cucina; le altre sono membri della famiglia (figlia, zio, moglie).', 1),
  q('a1-c-10', CORE, 'Completa: *My birthday is ___ July.*', ['on', 'at', 'in', 'to'], 2, 'Con i mesi si usa **in**: *in July*. *On* solo con una data precisa (*on 5 July*).', 1),
  q('a1-c-11', CORE, 'Il plurale di *child* è:', ['childs', 'childes', 'children', 'childrens'], 2, '*Child* ha il plurale irregolare **children**, come *man → men*, *woman → women*.', 1),
  q('a1-c-12', CORE, 'Completa: *She ___ got a new phone.*', ['have', 'has', 'is', 'does'], 1, '*Have got* alla terza persona diventa **has got**.', 1),
];

const reading: Question[] = [
  q('a1-r-01', READ, 'Sulla porta di un negozio leggi **PULL**. Cosa devi fare?', ['Spingere la porta', 'Tirare la porta', 'Suonare il campanello', 'Aspettare fuori'], 1, '**Pull** = tirare; **push** = spingere.', 1),
  q('a1-r-02', READ, '> **City Museum** — Open Tuesday to Sunday, 10 am – 5 pm. Closed on Mondays.\n\nPuoi visitare il museo lunedì alle 11?', ['Sì', 'No, è chiuso il lunedì', 'Sì, ma solo il pomeriggio', 'Non si sa'], 1, '*Closed on Mondays*: il lunedì il museo è chiuso.', 1),
  q('a1-r-03', READ, '> Dear Mr Brown, your appointment with Dr Patel is on Thursday at 3.15 pm. Please arrive ten minutes early.\n\nA che ora deve arrivare Mr Brown?', ['Alle 3.15', 'Alle 3.05', 'Alle 3.25', 'Alle 2.15'], 1, 'L\'appuntamento è alle 3.15 e deve arrivare **ten minutes early** → **3.05**.', 2),
  q('a1-r-04', READ, '> Mum, I\'m at Luca\'s house. We\'re doing our homework. I\'m home for dinner at 7. Sam\n\nDove è Sam?', ['A casa sua', 'A scuola', 'A casa di Luca', 'Al ristorante'], 2, '*I\'m at Luca\'s house*: è a casa di Luca.', 1),
  q('a1-r-05', READ, 'Scegli la parola giusta: *I\'m hungry. Can I have a ___, please?*', ['sandwich', 'chair', 'ticket', 'window'], 0, 'Se hai fame (*hungry*) chiedi qualcosa da mangiare: **sandwich**.', 1),
  q('a1-r-06', READ, 'Scegli la parola giusta: *It\'s very cold today. Wear your ___.*', ['sunglasses', 'coat', 'swimsuit', 'sandals'], 1, 'Fa freddo (*cold*): ti serve il **coat**, il cappotto.', 1),
  q('a1-r-07', READ, '> **SALE** — All shoes 50% off. This weekend only!\n\nCosa dice il cartello?', ['Le scarpe costano la metà questo fine settimana', 'Il negozio chiude questo fine settimana', 'Le scarpe sono esaurite', 'Si vendono solo 50 paia'], 0, '**50% off** = sconto del 50%, cioè metà prezzo, *this weekend only* = solo questo fine settimana.', 1),
  q('a1-r-08', READ, '> Hi Emma! Thanks for the party invitation. I can\'t come on Saturday because I work, but I\'m free on Sunday. Kate\n\nPerché Kate non va alla festa?', ['È malata', 'Lavora sabato', 'È in vacanza', 'Non le piacciono le feste'], 1, '*I can\'t come on Saturday **because I work***.', 1),
  q('a1-r-09', READ, 'Su un modulo leggi **Date of birth**. Cosa scrivi?', ['La data di oggi', 'La tua data di nascita', 'La data di scadenza del documento', 'La data di arrivo'], 1, '*Date of birth* = data di nascita.', 1),
  q('a1-r-10', READ, '> Platform 4: the 10.20 train to Leeds is cancelled. The next train is at 11.05 from platform 2.\n\nCosa deve fare chi va a Leeds?', ['Prendere il treno delle 10.20 al binario 4', 'Prendere il treno delle 11.05 al binario 2', 'Prendere il treno delle 11.05 al binario 4', 'Aspettare domani'], 1, 'Il treno delle 10.20 è **cancelled** (soppresso); il prossimo è alle **11.05** dal **binario 2**.', 2),
];

const listening: Question[] = [
  lq('a1-l-01', LIST, 'A: What\'s your phone number?\nB: It\'s oh seven nine double four, three one two.', 'Qual è il numero?', ['079 443 12', '079 44 312', '07 944 312', '079 413 12'], 1, '*oh seven nine* = 079, *double four* = 44, *three one two* = 312 → **079 44 312**.', 2),
  lq('a1-l-02', LIST, 'A: How much is the coffee?\nB: It\'s two pounds forty.', 'Quanto costa il caffè?', ['£2.14', '£2.40', '£4.20', '£2.04'], 1, '*Two pounds forty* = **£2.40**.', 1),
  lq('a1-l-03', LIST, 'The shop opens at half past nine and closes at six.', 'A che ora apre il negozio?', ['9:00', '9:30', '6:00', '6:30'], 1, '*Half past nine* = nove e mezza, **9:30**.', 1),
  lq('a1-l-04', LIST, 'A: How do you spell your surname?\nB: It\'s G, I, R, A, R, D, I.', 'Qual è il cognome?', ['Ghirardi', 'Girardi', 'Jirardi', 'Gerardi'], 1, 'Le lettere sono G-I-R-A-R-D-I → **Girardi**. Attenzione: la G si pronuncia /dʒiː/ e la I /aɪ/.', 2),
  lq('a1-l-05', LIST, 'Hi, I\'m Ben. I\'m a doctor and I work in a hospital in Leeds.', 'Che lavoro fa Ben?', ['Insegnante', 'Medico', 'Infermiere', 'Cuoco'], 1, '*I\'m a doctor* = medico.', 1),
  lq('a1-l-06', LIST, 'A: Where is the bank?\nB: It\'s next to the post office, opposite the park.', 'Dov\'è la banca?', ['Dentro il parco', 'Accanto all\'ufficio postale', 'Dietro l\'ufficio postale', 'Accanto al parco'], 1, '*Next to the post office* = accanto all\'ufficio postale; *opposite the park* = di fronte al parco.', 2),
  lq('a1-l-07', LIST, 'My sister is forty and my brother is fourteen.', 'Quanti anni ha il fratello?', ['40', '14', '4', '41'], 1, '*Fourteen* (accento su *-TEEN*) = **14**; la sorella ha *forty* = 40.', 2),
  lq('a1-l-08', LIST, 'A: What do you usually have for breakfast?\nB: Just tea and toast. I never eat eggs in the morning.', 'Cosa mangia di solito a colazione?', ['Uova e tè', 'Tè e pane tostato', 'Caffè e pane tostato', 'Niente'], 1, '*Tea and toast*; le uova non le mangia mai (*never*).', 1),
  lq('a1-l-09', LIST, 'The English class is on Wednesday, not Tuesday, at seven in the evening.', 'Quando è la lezione?', ['Martedì alle 7', 'Mercoledì alle 7 di sera', 'Mercoledì alle 7 di mattina', 'Martedì alle 11'], 1, '*On Wednesday, not Tuesday* e *in the evening* → mercoledì alle 19.', 2),
  lq('a1-l-10', LIST, 'A: Is it sunny today?\nB: No, it\'s raining. Take an umbrella.', 'Che tempo fa?', ['C\'è il sole', 'Piove', 'Nevica', 'C\'è vento'], 1, '*It\'s raining* = piove; per questo *take an umbrella*.', 1),
];

const writing: Question[] = [
  q('a1-w-01', WRITE, 'Quale frase è scritta correttamente?', ['my name is paolo.', 'My name is Paolo.', 'My Name Is paolo', 'my Name is Paolo.'], 1, 'Maiuscola a inizio frase e nei nomi propri, punto finale: **My name is Paolo.**', 1),
  q('a1-w-02', WRITE, 'Quale frase ha le maiuscole corrette?', ['I go to the gym on monday.', 'I go to the gym on Monday.', 'i go to the gym on Monday.', 'I Go to the Gym on Monday.'], 1, 'In inglese i **giorni della settimana** si scrivono con la maiuscola.', 1),
  q('a1-w-03', WRITE, 'Nel modulo leggi **Nationality**. Cosa scrivi?', ['Italy', 'Italian', 'italian', 'Rome'], 1, 'Serve l\'aggettivo di nazionalità con la maiuscola: **Italian**. *Italy* è il paese.', 1),
  q('a1-w-04', WRITE, 'Domanda del modulo: *What do you like doing in your free time?* Quale risposta è adeguata?', ['Yes, I do.', 'I like cooking and swimming.', 'In my free time.', 'I am 25.'], 1, 'Risponde davvero alla domanda con una frase completa: **I like cooking and swimming.**', 1),
  q('a1-w-05', WRITE, 'Quale connettivo completa meglio? *I like tea, ___ I don\'t like coffee.*', ['and', 'but', 'because', 'or'], 1, 'Contrasto tra due idee: **but**.', 1),
  q('a1-w-06', WRITE, 'Quale connettivo completa meglio? *I\'m tired ___ I work a lot.*', ['but', 'because', 'or', 'so'], 1, 'Si dà il motivo: **because** (perché).', 1),
  q('a1-w-07', WRITE, 'Quale è la chiusura più adatta per un messaggio a un amico?', ['Yours faithfully, Marco', 'See you soon! Marco', 'Dear Sir, Marco', 'To whom it may concern'], 1, 'Con un amico la chiusura è informale: **See you soon!** Le altre sono formule formali o di apertura.', 1),
  q('a1-w-08', WRITE, 'Quale frase contiene un errore?', ['She lives in Rome.', 'They are students.', 'He have two cats.', 'I am a nurse.'], 2, 'Terza persona: **He has** two cats, non *have*.', 1),
  q('a1-w-09', WRITE, 'Devi scrivere un messaggio di 20–30 parole a un amico. Quale testo rispetta meglio il compito *invita il tuo amico a cena sabato*?', [
    'Hi! Dinner.',
    'Hi Tom! Are you free on Saturday? Come to my house for dinner at 8. I\'m making pasta. Let me know! Sara',
    'Dear Sir, I am writing to complain about the dinner.',
    'I like dinner very much and I like pasta and pizza and fish and I like Saturday.',
  ], 1, 'Il secondo ha saluto, invito chiaro con giorno e ora, un dettaglio e chiusura: rispetta compito e lunghezza.', 2),
  q('a1-w-10', WRITE, 'Quale frase è corretta?', ['I have 30 years.', 'I am 30 years.', 'I am 30 years old.', 'I have 30 years old.'], 2, 'L\'età: **I am 30 years old** (oppure semplicemente *I\'m 30*).', 1),
];

const speaking: Question[] = [
  q('a1-s-01', SPEAK, 'L\'esaminatore chiede *Where are you from?* Quale risposta è corretta?', ['I\'m from Italy, from Turin.', 'I\'m Italy.', 'From is Turin.', 'Yes, I am.'], 0, '*Where are you from?* → **I\'m from + paese/città**.', 1),
  q('a1-s-02', SPEAK, 'Non hai capito la domanda. Cosa dici?', ['What?', 'Sorry, can you repeat, please?', 'Again!', 'No.'], 1, 'Formula cortese e corretta: **Sorry, can you repeat, please?**', 1),
  q('a1-s-03', SPEAK, 'Domanda: *What do you like doing at the weekend?* Quale risposta è migliore?', ['Weekend.', 'I like.', 'I like going to the cinema with my friends. On Sunday I usually visit my parents.', 'Yes, I like.'], 2, 'Risponde con *like + -ing* e aggiunge un dettaglio sulla routine.', 1),
  q('a1-s-04', SPEAK, 'Domanda: *Can you describe your house?* Quale frase usi per iniziare?', ['There is my house.', 'My house is small. There are two bedrooms and a big kitchen.', 'I have house.', 'House small.'], 1, '**There are** + plurale e un aggettivo semplice: risposta chiara e corretta.', 1),
  q('a1-s-05', SPEAK, 'Quale parola ha il suono *th* come in *three*?', ['tree', 'think', 'tea', 'free'], 1, '**Think** inizia con il *th* sordo /θ/, lingua tra i denti, come *three*.', 2),
  q('a1-s-06', SPEAK, 'Domanda: *How old are you?* Quale risposta è corretta?', ['I have 25.', 'I\'m 25.', 'Is 25.', 'I\'m 25 years.'], 1, 'Risposta naturale: **I\'m 25** (oppure *I\'m 25 years old*).', 1),
  q('a1-s-07', SPEAK, 'Domanda: *Do you like your job?* Quale risposta è più completa?', ['Yes.', 'Yes, I do. My colleagues are nice and I like helping people.', 'Yes, I like.', 'Job.'], 1, 'Risposta breve corretta (*Yes, I do*) + motivo: è ciò che si valuta nello Speaking.', 1),
  q('a1-s-08', SPEAK, 'Come presenti un amico a qualcuno?', ['He is my friend Luca.', 'This is my friend Luca.', 'There is my friend Luca.', 'It is my friend Luca.'], 1, 'Per presentare qualcuno si usa **This is…**.', 1),
  q('a1-s-09', SPEAK, 'Domanda: *What\'s your favourite day of the week? Why?* Quale risposta risponde a entrambe le parti?', ['Friday.', 'I like Friday.', 'Friday, because I finish work early and I go out with friends.', 'Because I like it.'], 2, 'Risponde al *what* (Friday) e al *why* (because…). Nello Speaking rispondi sempre a tutte le parti.', 1),
  q('a1-s-10', SPEAK, 'In quale frase si deve pronunciare la *h*?', ['an hour', 'my house', 'an honest man', 'the heir'], 1, 'In **house** la *h* è aspirata. In *hour*, *honest* e *heir* è muta (per questo si dice *an hour*).', 2),
];

export const questions: Question[] = [...core, ...reading, ...listening, ...writing, ...speaking];
