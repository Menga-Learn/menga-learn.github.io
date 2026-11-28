import type { Question } from '../../../types';
import { lq, q } from '../../helpers';
import { CORE, LIST, READ, SPEAK, WRITE } from '../common';

/** Banca domande originale per il livello A2 (non sono domande reali del test Aptis). */

const core: Question[] = [
  q('a2-c-01', CORE, 'Completa: *I ___ my keys yesterday and I couldn\'t get into the house.*', ['lose', 'lost', 'have lost', 'losed'], 1, '*Lose* è irregolare: past simple **lost**. Con *yesterday* serve il past simple.', 1),
  q('a2-c-02', CORE, 'Completa: *We ___ at home last night; we were at the cinema.*', ['weren\'t', 'didn\'t', 'wasn\'t', 'aren\'t'], 0, 'Passato di *to be* con *we*: **were**, negativo **weren\'t**.', 1),
  q('a2-c-03', CORE, 'Completa: *Where ___ you buy that jacket?*', ['do', 'did', 'were', 'have'], 1, 'Domanda al passato: **did** + verbo base.', 1),
  q('a2-c-04', CORE, 'Completa: *My new flat is ___ than the old one.*', ['more big', 'biger', 'bigger', 'more bigger'], 2, '*Big* raddoppia la consonante: **bigger**. Mai *more* + -er insieme.', 1),
  q('a2-c-05', CORE, 'Completa: *It\'s the ___ restaurant in town.*', ['better', 'best', 'goodest', 'most good'], 1, 'Superlativo irregolare di *good*: **the best**.', 1),
  q('a2-c-06', CORE, 'Completa: *How ___ money do you need?*', ['many', 'much', 'lot', 'few'], 1, '*Money* è non numerabile: **how much**.', 1),
  q('a2-c-07', CORE, 'Completa: *Can you give me some ___ about the course?*', ['informations', 'information', 'an information', 'informations\'s'], 1, '*Information* è **non numerabile**: niente plurale né *an*.', 2),
  q('a2-c-08', CORE, 'Completa: *Look at those clouds! It ___ rain.*', ['is going to', 'will to', 'goes to', 'is raining to'], 0, 'Previsione basata su un\'evidenza presente: **is going to**.', 2),
  q('a2-c-09', CORE, 'Completa: *You ___ use your phone during the exam. It\'s not allowed.*', ['don\'t have to', 'mustn\'t', 'needn\'t', 'can'], 1, 'È **vietato**: *mustn\'t*. *Don\'t have to* vorrebbe dire "non è necessario".', 2),
  q('a2-c-10', CORE, 'Completa: *I moved to Milan three years ___.*', ['before', 'ago', 'last', 'since'], 1, '"Tre anni fa" = *three years **ago***.', 1),
  q('a2-c-11', CORE, 'Completa: *I\'m ___ my friends at 8 tonight. We booked a table.*', ['meet', 'meeting', 'will meeting', 'met'], 1, 'Appuntamento già fissato: **present continuous** con valore di futuro.', 2),
];

const reading: Question[] = [
  q('a2-r-01', READ, '> Dear customers, the swimming pool will be closed for cleaning from 1 to 7 March. The gym will stay open as usual.\n\nQuale affermazione è vera?', ['La palestra chiude a marzo', 'La piscina riapre l\'8 marzo', 'Tutto chiude per una settimana', 'La piscina chiude per sempre'], 1, 'La piscina chiude dal 1 al 7 marzo: riapre l\'**8**. La palestra resta aperta.', 2),
  q('a2-r-02', READ, '> Hi Ben, I\'m afraid I can\'t make it to football tonight — I\'ve got a terrible cold. Can you tell the coach? Thanks, Dan\n\nPerché Dan ha scritto?', ['Per invitare Ben a una partita', 'Per avvisare che non andrà all\'allenamento', 'Per chiedere il numero dell\'allenatore', 'Per lamentarsi dell\'allenatore'], 1, '*I can\'t make it* = non riesco a venire: avvisa della sua assenza perché ha il raffreddore.', 2),
  q('a2-r-03', READ, 'Scegli la parola giusta: *The film was so ___ that I fell asleep.*', ['exciting', 'boring', 'funny', 'scary'], 1, 'Ci si addormenta se il film è **boring** (noioso).', 1),
  q('a2-r-04', READ, 'Scegli la parola giusta: *I need to ___ a table for four at the restaurant.*', ['book', 'buy', 'take', 'make up'], 0, 'Prenotare = **book** (*book a table, book a room*).', 1),
  q('a2-r-05', READ, '> Our café is now open on Sundays too! From next week, Sunday opening hours are 9 am to 2 pm.\n\nCosa è cambiato?', ['Il bar chiude prima', 'Il bar apre anche la domenica', 'Il bar ha cambiato indirizzo', 'Il bar è chiuso la domenica'], 1, '*Now open on Sundays **too*** = ora apre anche la domenica.', 1),
  q('a2-r-06', READ, '> When I was a child, I lived in a small village. There wasn\'t a cinema, so every Saturday we took the bus to the nearest town.\n\nPerché andavano in città il sabato?', ['Per andare a scuola', 'Perché nel villaggio non c\'era un cinema', 'Per lavorare', 'Per prendere il treno'], 1, '*There wasn\'t a cinema, **so**…*: il motivo è la mancanza del cinema.', 2),
  q('a2-r-07', READ, 'Quale frase viene per prima in questa storia? (a) *After that, she found a job in a hotel.* (b) *Maria arrived in London in 2018.* (c) *Finally, she opened her own café.*', ['a', 'b', 'c', 'Non si può sapere'], 1, 'La (b) presenta personaggio e momento; *after that* e *finally* indicano passi successivi.', 2),
  q('a2-r-08', READ, '> Lost: small black cat with a white nose. Last seen near Park Road on Tuesday. Please call 07700 900123.\n\nChe tipo di testo è?', ['Una pubblicità di cibo per gatti', 'Un annuncio di un gatto smarrito', 'Un annuncio di un gatto in vendita', 'Un invito'], 1, '*Lost* + descrizione + *last seen*: è un annuncio di animale **smarrito**.', 1),
  q('a2-r-09', READ, '> The tour costs £25. This includes lunch but not entrance to the castle (£8).\n\nQuanto spendi in tutto se visiti anche il castello?', ['£25', '£33', '£17', '£8'], 1, 'Il tour (£25) **non include** l\'ingresso al castello (£8): totale **£33**.', 2),
  q('a2-r-10', READ, 'Scegli la parola giusta: *Turn ___ the lights when you leave the room.*', ['on', 'off', 'up', 'in'], 1, '*Turn off* = spegnere. Si spegne la luce quando si esce.', 1),
];

const listening: Question[] = [
  lq('a2-l-01', LIST, 'A: Can I help you?\nB: Yes, have you got this shirt in a medium?\nA: Sorry, only small and large. But we\'ve got medium in blue.\nB: OK, I\'ll take the blue one.', 'Cosa compra il cliente?', ['Una camicia small', 'Una camicia blu media', 'Una camicia large', 'Niente'], 1, 'La taglia media c\'è solo in blu e il cliente dice *I\'ll take the blue one*.', 2),
  lq('a2-l-02', LIST, 'A: The train to York leaves from platform three.\nB: Sorry, there\'s a change. The York train now leaves from platform seven.', 'Da quale binario parte il treno per York?', ['3', '7', '13', '17'], 1, 'C\'è un cambio: ora parte dal binario **7**.', 1),
  lq('a2-l-03', LIST, 'I usually cycle to work, but this week my bike is broken, so I\'m taking the bus.', 'Come va al lavoro questa settimana?', ['In bicicletta', 'In autobus', 'A piedi', 'In macchina'], 1, 'Di solito in bici, ma *this week* la bici è rotta: va in **autobus**.', 1),
  lq('a2-l-04', LIST, 'A: What did you do at the weekend?\nB: Well, I wanted to go to the beach, but it rained, so I stayed at home and watched films.', 'Cosa ha fatto nel weekend?', ['È andato al mare', 'È rimasto a casa a guardare film', 'È andato al cinema', 'Ha lavorato'], 1, 'Voleva andare al mare **ma** pioveva: è rimasto a casa a guardare film.', 1),
  lq('a2-l-05', LIST, 'A: How much are the tickets?\nB: Adults are twelve pounds and children are half price.', 'Quanto costa il biglietto per un bambino?', ['£12', '£6', '£2', '£24'], 1, '*Half price* = metà prezzo: 12 / 2 = **£6**.', 2),
  lq('a2-l-06', LIST, 'Hi, it\'s Sarah. I\'m calling about dinner on Thursday. I\'m really sorry, but I have to work late. Can we do Friday instead?', 'Cosa vuole Sarah?', ['Annullare la cena per sempre', 'Spostare la cena a venerdì', 'Cenare giovedì più tardi', 'Invitare un\'altra persona'], 1, '*Can we do Friday **instead***: propone di spostare a venerdì.', 1),
  lq('a2-l-07', LIST, 'The museum is between the bank and the library, opposite the bus station.', 'Dov\'è il museo?', ['Accanto alla stazione degli autobus', 'Tra la banca e la biblioteca', 'Dietro la banca', 'Dentro la biblioteca'], 1, '**Between** = tra la banca e la biblioteca; di fronte (*opposite*) alla stazione.', 1),
  lq('a2-l-08', LIST, 'A: Is the doctor available at ten?\nB: No, sorry, she\'s busy until eleven. How about half past eleven?\nA: Perfect.', 'A che ora è l\'appuntamento?', ['10:00', '11:00', '11:30', '10:30'], 2, '*Half past eleven* = **11:30**, accettato con *Perfect*.', 2),
  lq('a2-l-09', LIST, 'I didn\'t like the hotel very much. The room was clean, but it was very noisy and the breakfast was expensive.', 'Cosa NON le è piaciuto?', ['La pulizia', 'Il rumore e il prezzo della colazione', 'La posizione', 'Il personale'], 1, 'La camera era pulita (*clean*), ma rumorosa (*noisy*) e la colazione cara (*expensive*).', 2),
  lq('a2-l-10', LIST, 'A: Would you like tea or coffee?\nB: Coffee, please. Oh, actually, no — it\'s late. Can I have some water instead?', 'Cosa beve alla fine?', ['Tè', 'Caffè', 'Acqua', 'Niente'], 2, '*Actually, no… water instead*: alla fine sceglie l\'**acqua**.', 1),
];

const writing: Question[] = [
  q('a2-w-01', WRITE, 'Quale frase collega meglio le due idee? *The hotel was expensive. It was very comfortable.*', ['The hotel was expensive, so it was very comfortable.', 'The hotel was expensive, but it was very comfortable.', 'The hotel was expensive because it was comfortable.', 'The hotel was expensive and but comfortable.'], 1, 'Le due idee sono in contrasto: **but**.', 1),
  q('a2-w-02', WRITE, 'Quale saluto iniziale è adatto a un\'email a un amico?', ['Dear Sir or Madam,', 'Hi Marco,', 'To whom it may concern,', 'Yours sincerely,'], 1, 'Con un amico: **Hi Marco,** (o *Dear Marco,*). Le altre sono formule formali o di chiusura.', 1),
  q('a2-w-03', WRITE, 'Quale frase contiene un errore di tempo verbale?', ['Last summer I went to Spain.', 'Yesterday I visit my grandmother.', 'I saw a great film on Friday.', 'We had pizza last night.'], 1, 'Con *yesterday* serve il past simple: **I visited** my grandmother.', 1),
  q('a2-w-04', WRITE, 'Come proponi un\'alternativa in modo naturale?', ['You must come on Sunday.', 'What about Sunday instead?', 'Sunday is obligatory.', 'I want Sunday.'], 1, '**What about…?** è il modo naturale di proporre.', 1),
  q('a2-w-05', WRITE, 'Compito: *scrivi a un amico per ringraziarlo del regalo e dire come lo usi*. Quale testo è completo?', [
    'Hi Tom, how are you? The weather is nice here.',
    'Hi Tom, thank you so much for the book! I\'m reading it on the train every morning and I love it. Love, Anna',
    'Hi Tom, I love books. Anna',
    'Dear Sir, thank you for the book.',
  ], 1, 'Il secondo ringrazia e dice **come usa** il regalo, con registro informale corretto.', 2),
  q('a2-w-06', WRITE, 'Quale sequenza di connettivi è corretta per raccontare una giornata?', ['First… then… after that… finally', 'Finally… first… then', 'Then… finally… first', 'After that… first… finally'], 0, 'L\'ordine naturale è **first → then → after that → finally**.', 1),
  q('a2-w-07', WRITE, 'Quale frase è corretta?', ['I am agree with you.', 'I agree with you.', 'I am agree you.', 'I agreeing with you.'], 1, 'In inglese *agree* è un verbo: **I agree** (mai ~~I am agree~~).', 2),
  q('a2-w-08', WRITE, 'Compito: 30–50 parole. Il tuo testo ne ha 12. Cosa rischi?', ['Niente', 'Di non rispondere a tutti i punti e perdere punti', 'Di essere troppo formale', 'Di usare troppe maiuscole'], 1, 'Un testo troppo corto difficilmente copre tutti i punti e mostra poche strutture.', 1),
  q('a2-w-09', WRITE, 'Quale chiusura è adatta a un\'email informale?', ['Yours faithfully,', 'Best wishes,', 'Dear Sir,', 'I look forward to your reply, Sir.'], 1, '**Best wishes,** va bene con amici e colleghi; *Yours faithfully* è per lettere formali.', 1),
  q('a2-w-10', WRITE, 'Quale frase è corretta?', ['I\'m going to visit my parents next weekend.', 'I go to visit my parents next weekend tomorrow.', 'I will going to visit my parents.', 'I visiting my parents next weekend.'], 0, 'Piano deciso: **be going to + verbo base**.', 1),
];

const speaking: Question[] = [
  q('a2-s-01', SPEAK, 'Descrivi una foto. Quale frase usi per iniziare?', ['In this picture I can see two people in a kitchen.', 'This picture are two people.', 'I see in picture people.', 'There is people.'], 0, '**In this picture I can see…** è l\'apertura chiara e corretta.', 1),
  q('a2-s-02', SPEAK, 'Quale frase descrive correttamente un\'azione nella foto?', ['The children play football now.', 'The children are playing football.', 'The children played football.', 'The children is playing football.'], 1, 'Present continuous al plurale: **are playing**.', 1),
  q('a2-s-03', SPEAK, 'Vuoi fare un\'ipotesi sulla foto. Cosa dici?', ['It is sure a wedding.', 'It looks like a wedding.', 'It wedding.', 'It is look a wedding.'], 1, '**It looks like + nome** esprime un\'ipotesi basata su ciò che vedi.', 2),
  q('a2-s-04', SPEAK, 'Domanda: *Tell me about the last time you went on holiday.* Quale risposta è migliore?', ['I go to the sea every year.', 'Last August I went to Sardinia with my friends. We stayed in a small hotel and swam every day.', 'Holidays are nice.', 'I will go to Sardinia.'], 1, 'Risponde con il **past simple** e aggiunge dettagli concreti.', 1),
  q('a2-s-05', SPEAK, 'Domanda: *Do you prefer cooking at home or eating out?* Quale risposta è migliore?', ['Yes.', 'I prefer cooking at home because it\'s cheaper and healthier.', 'Cooking.', 'I prefer.'], 1, 'Preferenza + **motivo**: esattamente quello che si valuta.', 1),
  q('a2-s-06', SPEAK, 'Ti serve un momento per pensare. Cosa dici?', ['Wait.', 'Let me think…', 'Stop.', 'I don\'t know nothing.'], 1, '**Let me think…** è naturale e cortese.', 1),
  q('a2-s-07', SPEAK, 'Come dici "in primo piano"?', ['in the foreground', 'in the first plan', 'in front plan', 'at first'], 0, '**In the foreground**. Il calco *first plan* non esiste in inglese.', 1),
  q('a2-s-08', SPEAK, 'Quale pronuncia del passato di *worked* è corretta?', ['/wɜːkɪd/ (worke-id)', '/wɜːkt/ (workt)', '/wɜːkd/ con la d forte', '/wɜːked/ (wor-ked)'], 1, 'Dopo un suono sordo come /k/, *-ed* si pronuncia **/t/**: *workt*. Si dice /ɪd/ solo dopo /t/ e /d/ (*wanted*).', 3),
  q('a2-s-09', SPEAK, 'Domanda: *What did you do last weekend?* Quale risposta contiene un errore?', ['I visited my aunt.', 'I go to the gym on Saturday.', 'I watched a film with my brother.', 'I didn\'t do much.'], 1, 'Si parla del weekend scorso: serve **went**, non *go*.', 1),
  q('a2-s-10', SPEAK, 'Come confronti due città?', ['Rome is more big than Milan.', 'Rome is bigger than Milan.', 'Rome is big of Milan.', 'Rome is biggest than Milan.'], 1, 'Comparativo corretto: **bigger than**.', 1),
];

export const questions: Question[] = [...core, ...reading, ...listening, ...writing, ...speaking];
