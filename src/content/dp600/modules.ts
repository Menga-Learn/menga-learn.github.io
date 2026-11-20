import type { Module } from '../../types';
import { exercise, q } from '../helpers';

import l01 from './lessons/01-accessi-workspace.md?raw';
import l02 from './lessons/02-sicurezza-dati.md?raw';
import l03 from './lessons/03-etichette-certificazione.md?raw';
import l04 from './lessons/04-git-pbip.md?raw';
import l05 from './lessons/05-pipeline-distribuzione.md?raw';
import l06 from './lessons/06-asset-riutilizzabili.md?raw';
import l07 from './lessons/07-scegliere-archivio.md?raw';
import l08 from './lessons/08-ingestione.md?raw';
import l09 from './lessons/09-catalogo-realtime.md?raw';
import l10 from './lessons/10-modellazione-stella.md?raw';
import l11 from './lessons/11-pulizia-dati.md?raw';
import l12 from './lessons/12-viste-procedure.md?raw';
import l13 from './lessons/13-sql-visual-query.md?raw';
import l14 from './lessons/14-kql.md?raw';
import l15 from './lessons/15-dax-query.md?raw';
import l16 from './lessons/16-modalita-archiviazione.md?raw';
import l17 from './lessons/17-relazioni.md?raw';
import l18 from './lessons/18-dax-calcoli.md?raw';
import l19 from './lessons/19-gruppi-calcolo.md?raw';
import l20 from './lessons/20-ottimizzazione.md?raw';
import l21 from './lessons/21-aggiornamento-incrementale.md?raw';
import l22 from './lessons/22-direct-lake.md?raw';

import exAccessi from './exercises/accessi-team-vendite.md?raw';
import exRls from './exercises/rls-mascheramento.md?raw';
import exRilascio from './exercises/strategia-rilascio.md?raw';
import exIngestione from './exercises/scelta-ingestione.md?raw';
import exLab from './exercises/lab-lakehouse-shortcut.md?raw';
import exPyspark from './exercises/pulizia-pyspark.md?raw';
import exProcedura from './exercises/vista-procedura.md?raw';
import exKql from './exercises/telemetria-kql.md?raw';
import exDax from './exercises/query-dax.md?raw';
import exGruppo from './exercises/gruppo-calcolo.md?raw';
import exM2m from './exercises/molti-a-molti.md?raw';
import exLento from './exercises/report-lento.md?raw';
import exIncr from './exercises/lab-incrementale.md?raw';

const M = 'manutenzione';
const P = 'preparazione';
const S = 'modelli';

export const modules: Module[] = [
  {
    id: 'sicurezza-governance',
    domainId: M,
    title: 'Sicurezza e governance',
    summary: 'Ruoli del workspace, permessi sugli item, RLS/CLS/OLS, mascheramento, etichette e approvazione.',
    lessons: [
      {
        id: 'accessi-workspace',
        title: 'Ruoli del workspace e permessi sugli item',
        minutes: 8,
        body: l01,
        keyPoints: [
          'Ruoli: Admin > Member > Contributor > Viewer. Solo Admin e Member gestiscono gli accessi.',
          'Contributor crea e modifica contenuti ma non gestisce gli accessi.',
          "Per dare accesso a un solo item si condivide l'item, senza ruolo nel workspace.",
          'ReadData = lettura via SQL; ReadAll = lettura dei file in OneLake (Spark); Build = creare contenuti su un modello.',
        ],
        quickCheck: [
          q(
            'qc-accessi-1',
            M,
            'Uno sviluppatore deve creare e modificare notebook e pipeline in un workspace, ma **non** deve poter aggiungere altre persone. Quale ruolo assegni?',
            ['Admin', 'Member', 'Contributor', 'Viewer'],
            2,
            '**Contributor** può creare, modificare ed eseguire item ma non gestisce gli accessi. Member può aggiungere utenti, Viewer non può modificare.',
            1,
          ),
          q(
            'qc-accessi-2',
            M,
            'Un data scientist deve leggere con Spark i file Delta di **un solo** lakehouse, senza vedere gli altri item del workspace. Cosa fai?',
            [
              'Gli assegni il ruolo Viewer nel workspace',
              'Condividi il lakehouse con il permesso ReadAll',
              'Condividi il lakehouse con il solo permesso ReadData',
              'Gli assegni il ruolo Contributor',
            ],
            1,
            "La condivisione dell'item limita l'accesso al solo lakehouse; **ReadAll** consente di leggere i dati in OneLake con Spark. *ReadData* vale solo per le query SQL.",
          ),
        ],
      },
      {
        id: 'sicurezza-dati',
        title: 'Sicurezza di righe, colonne, oggetti e file',
        minutes: 10,
        body: l02,
        keyPoints: [
          'RLS nel warehouse: funzione inline + CREATE SECURITY POLICY. Nel modello: ruoli con filtri DAX.',
          'CLS: GRANT SELECT solo su alcune colonne. OLS: nasconde tabelle/colonne nel modello semantico.',
          'Il mascheramento dinamico offusca la visualizzazione, non è una vera protezione.',
          'I ruoli di accesso ai dati di OneLake proteggono cartelle e tabelle del lakehouse.',
        ],
        quickCheck: [
          q(
            'qc-sicurezza-1',
            M,
            'Nel warehouse gli addetti al supporto devono vedere gli indirizzi email dei clienti nel formato `aXXX@XXXX.com`, mentre gli amministratori devono vederli in chiaro. Cosa usi?',
            ['Sicurezza a livello di riga', 'Mascheramento dinamico dei dati', 'Sicurezza a livello di oggetto', "Un'etichetta di riservatezza"],
            1,
            'Il **mascheramento dinamico** con la funzione `email()` mostra il valore offuscato a chi non ha il permesso `UNMASK`.',
            1,
          ),
          q(
            'qc-sicurezza-2',
            M,
            'In un modello semantico vuoi che i membri del ruolo "Partner" **non sappiano nemmeno che esiste** la tabella Costi. Cosa configuri?',
            ['Sicurezza a livello di riga', 'Sicurezza a livello di oggetto (OLS)', 'Una colonna nascosta', 'Mascheramento dinamico'],
            1,
            "Con l'**OLS** la tabella non esiste per i membri del ruolo. Nascondere una colonna è solo un'impostazione di visualizzazione: i dati restano interrogabili.",
          ),
        ],
      },
      {
        id: 'etichette-approvazione',
        title: 'Etichette di riservatezza e approvazione',
        minutes: 6,
        body: l03,
        keyPoints: [
          'Le etichette di riservatezza (Purview) classificano gli item e seguono i dati esportati.',
          'Le etichette possono essere ereditate dagli item a valle.',
          'Promosso: chiunque abbia permessi di scrittura. Certificato e Dati master: solo revisori autorizzati.',
        ],
        quickCheck: [
          q(
            'qc-etichette-1',
            M,
            'Chi può contrassegnare un modello semantico come **Certificato**?',
            [
              "Qualsiasi utente con ruolo Contributor",
              "Il proprietario dell'item",
              "Solo gli utenti autorizzati dall'amministratore del tenant",
              'Qualsiasi utente con permesso Build',
            ],
            2,
            "La certificazione è riservata ai revisori indicati nelle impostazioni del tenant. La **promozione** invece è disponibile a chi può modificare l'item.",
            1,
          ),
          q(
            'qc-etichette-2',
            M,
            'Un utente esporta in Excel i dati di un report con etichetta "Riservato". Cosa succede?',
            [
              "L'esportazione viene sempre bloccata",
              "Il file Excel eredita l'etichetta e le eventuali protezioni",
              "L'etichetta viene rimossa",
              'Il file viene salvato in OneLake',
            ],
            1,
            'Le etichette di riservatezza **seguono i dati** nei file esportati (Excel, PowerPoint, PDF), con le eventuali protezioni di crittografia.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'accessi-team-vendite', title: 'Progetta gli accessi del team Vendite', kind: 'scenario', difficulty: 1, minutes: 15, hints: ['Parti dalla domanda: serve accedere a molti item o a uno solo?', 'Ricorda la differenza tra ReadData e ReadAll.', 'Per creare report su un modello altrui serve un permesso specifico del modello.'] }, exAccessi),
      exercise({ id: 'rls-mascheramento', title: 'RLS, mascheramento e CLS nel warehouse', kind: 'codice', language: 'sql', difficulty: 2, minutes: 25, hints: ['Il predicato RLS è una funzione con valori di tabella inline con SCHEMABINDING.', 'USER_NAME() restituisce l\'utente connesso.', 'Per le colonne usa GRANT SELECT ON tabella (colonne).'] }, exRls),
    ],
  },
  {
    id: 'ciclo-vita',
    domainId: M,
    title: 'Ciclo di vita dello sviluppo analitico',
    summary: 'Git, progetti .pbip, progetti di database, pipeline di distribuzione, asset riutilizzabili e analisi d\'impatto.',
    lessons: [
      {
        id: 'git-pbip',
        title: 'Controllo di versione con Git e progetti Power BI',
        minutes: 8,
        body: l04,
        keyPoints: [
          'Un workspace si collega a un branch di Azure DevOps o GitHub: Commit e Aggiorna.',
          'Il formato .pbip salva report (PBIR) e modello (TMDL) come file di testo.',
          'I progetti di database SQL producono un DACPAC per distribuire lo schema del warehouse.',
        ],
        quickCheck: [
          q(
            'qc-git-1',
            M,
            'Due sviluppatori modificano tabelle diverse dello stesso modello semantico e vogliono revisionare le modifiche in una pull request. Quale formato devono usare?',
            ['.pbix', '.pbit', '.pbip con definizione del modello in TMDL', '.pbids'],
            2,
            'Il progetto **.pbip** salva il modello in **TMDL**, file di testo per tabella: differenze leggibili e meno conflitti.',
            1,
          ),
          q(
            'qc-git-2',
            M,
            'Hai modificato un notebook nel workspace collegato a Git. Quale operazione salva la modifica nel repository?',
            ['Aggiorna (Update)', 'Commit', 'Distribuisci', 'Pubblica'],
            1,
            '**Commit** porta le modifiche dal workspace al branch. **Aggiorna** fa il contrario: porta nel workspace le modifiche del branch.',
            1,
          ),
        ],
      },
      {
        id: 'pipeline-distribuzione',
        title: 'Pipeline di distribuzione',
        minutes: 7,
        body: l05,
        keyPoints: [
          'Da 2 a 10 fasi, ognuna associata a un workspace.',
          'Si distribuiscono i metadati, non i dati.',
          "Le regole di distribuzione (origine dati, parametri) si configurano sulla fase di destinazione.",
        ],
        quickCheck: [
          q(
            'qc-pipeline-1',
            M,
            'Dopo la distribuzione da Test a Produzione, il modello semantico in Produzione punta ancora al database di test. Cosa avresti dovuto configurare?',
            [
              'Una regola di distribuzione sulla fase di Produzione',
              'Una regola di distribuzione sulla fase di Test',
              "L'integrazione Git nella fase di Produzione",
              'Un gateway dati locale',
            ],
            0,
            'Le **regole di distribuzione** (origine dati o parametri) si definiscono sulla fase **di destinazione** e vengono applicate a ogni distribuzione verso di essa.',
          ),
        ],
      },
      {
        id: 'asset-riutilizzabili',
        title: "Asset riutilizzabili e analisi d'impatto",
        minutes: 8,
        body: l06,
        keyPoints: [
          '.pbit = modello di report senza dati; .pbids = solo la connessione a una sorgente.',
          'Un modello semantico condiviso evita duplicazioni di misure e refresh.',
          "L'endpoint XMLA in lettura/scrittura abilita SSMS, Tabular Editor, ALM Toolkit.",
          "Vista di derivazione e analisi d'impatto mostrano chi dipende da un item.",
        ],
        quickCheck: [
          q(
            'qc-asset-1',
            M,
            'Vuoi distribuire agli analisti un file che, aperto in Power BI Desktop, li porti direttamente alla finestra di navigazione del warehouse aziendale, senza alcun report già pronto. Quale file crei?',
            ['.pbit', '.pbids', '.pbip', '.pbix'],
            1,
            'Il file **.pbids** contiene solo la definizione della connessione. Il **.pbit** contiene invece un intero report con modello e query, senza dati.',
          ),
          q(
            'qc-asset-2',
            M,
            "Prima di eliminare una colonna da un lakehouse vuoi sapere quali report verrebbero coinvolti e avvisarne i proprietari. Cosa usi?",
            ["L'analisi d'impatto", 'Il Real-Time hub', 'Performance Analyzer', 'Il Monitoraggio della capacità'],
            0,
            "L'**analisi d'impatto** elenca item e workspace a valle e consente di inviare una notifica ai proprietari.",
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'strategia-rilascio', title: 'Disegna una strategia di rilascio', kind: 'scenario', difficulty: 2, minutes: 20, hints: ['Separa la collaborazione sul codice dalla promozione tra ambienti.', 'Pensa a quale formato rende leggibili le modifiche del modello.', 'Le connessioni diverse per ambiente si gestiscono con regole o parametri.'] }, exRilascio),
    ],
  },
  {
    id: 'acquisire-dati',
    domainId: P,
    title: 'Acquisire e accedere ai dati',
    summary: 'Scegliere tra lakehouse, warehouse ed eventhouse; shortcut, mirroring, pipeline, Dataflow Gen2, catalogo OneLake e Real-Time hub.',
    lessons: [
      {
        id: 'scegliere-archivio',
        title: 'Lakehouse, warehouse o eventhouse?',
        minutes: 8,
        body: l07,
        keyPoints: [
          "Tutti i dati vivono in OneLake come Delta Parquet.",
          "L'endpoint SQL del lakehouse è in sola lettura; il warehouse supporta DML e transazioni.",
          'Eventhouse e KQL per streaming, log e serie temporali.',
        ],
        quickCheck: [
          q(
            'qc-archivio-1',
            P,
            "Il team deve eseguire `UPDATE` e `DELETE` in T-SQL all'interno di transazioni multi-tabella. Quale archivio scegli?",
            ['Lakehouse', 'Warehouse', 'Eventhouse', 'Modello semantico'],
            1,
            "Il **warehouse** supporta T-SQL completo, incluse le transazioni. L'endpoint SQL del lakehouse è in sola lettura.",
            1,
          ),
          q(
            'qc-archivio-2',
            P,
            'Quali dati sono più adatti a un **eventhouse**?',
            ['Anagrafica prodotti aggiornata una volta al mese', 'Telemetria di macchinari con migliaia di eventi al secondo', 'File PDF di contratti', 'Budget annuale in Excel'],
            1,
            "L'**eventhouse** è ottimizzato per dati in streaming e serie temporali, interrogabili con KQL.",
            1,
          ),
        ],
      },
      {
        id: 'ingestione',
        title: 'Shortcut, mirroring e strumenti di ingestione',
        minutes: 9,
        body: l08,
        keyPoints: [
          'Shortcut: accesso a dati esterni o di altri item senza copiarli.',
          'Mirroring: replica quasi in tempo reale di database operativi in OneLake.',
          'Pipeline per orchestrare e copiare; Dataflow Gen2 per trasformazioni low-code; notebook per logica complessa.',
        ],
        quickCheck: [
          q(
            'qc-ingestione-1',
            P,
            'I dati sono già in formato Delta in un account Amazon S3 e non vanno duplicati. Come li rendi disponibili nel lakehouse?',
            ['Attività Copia in una pipeline', 'Shortcut', 'Dataflow Gen2', 'Mirroring'],
            1,
            "Lo **shortcut** collega i dati senza copiarli. Amazon S3 è tra le destinazioni supportate.",
            1,
          ),
          q(
            'qc-ingestione-2',
            P,
            'Serve una copia sempre aggiornata di un database Azure SQL in OneLake, con il **minimo sforzo di sviluppo**. Cosa usi?',
            ['Un notebook pianificato ogni 5 minuti', 'Mirroring', 'Un file .pbids', 'Uno shortcut verso Azure SQL'],
            1,
            'Il **mirroring** replica in modo continuo le modifiche in formato Delta, senza pipeline da sviluppare.',
          ),
        ],
      },
      {
        id: 'catalogo-realtime',
        title: 'Catalogo OneLake, Real-Time hub e integrazione OneLake',
        minutes: 6,
        body: l09,
        keyPoints: [
          'Il catalogo OneLake aiuta a trovare item esistenti, filtrando per approvazione ed etichetta.',
          'Il Real-Time hub elenca stream, sorgenti ed eventi.',
          "La disponibilità in OneLake rende le tabelle KQL leggibili come Delta; l'integrazione OneLake fa lo stesso per i modelli Import.",
        ],
        quickCheck: [
          q(
            'qc-catalogo-1',
            P,
            'Un team vuole leggere con Spark le tabelle di un database KQL senza creare pipeline di copia. Cosa abiliti?',
            ['La disponibilità in OneLake per il database KQL', 'Il mirroring del database KQL', 'Un endpoint XMLA', 'Un eventstream verso il notebook'],
            0,
            'La **disponibilità in OneLake** scrive le tabelle KQL anche come Delta, leggibili da Spark, SQL e Direct Lake.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'scelta-ingestione', title: 'Scegli archivio e metodo di ingestione', kind: 'scenario', difficulty: 2, minutes: 20, hints: ['Cerca nelle richieste parole come "senza duplicare", "quasi in tempo reale", "low-code".', 'Lo streaming da Event Hubs passa dal Real-Time hub.'] }, exIngestione),
      exercise({ id: 'lab-lakehouse-shortcut', title: 'Lakehouse, tabella Delta e shortcut', kind: 'lab', language: 'sql', difficulty: 1, minutes: 30, hints: ['Il comando "Carica nelle tabelle" è nel menu contestuale del file.', "Lo shortcut si crea dal menu della cartella Tables del lakehouse di destinazione."] }, exLab),
    ],
  },
  {
    id: 'trasformare-dati',
    domainId: P,
    title: 'Trasformare i dati',
    summary: 'Schema a stella, chiavi surrogate e SCD, pulizia dei dati, viste, funzioni e stored procedure.',
    lessons: [
      {
        id: 'modellazione-stella',
        title: 'Schema a stella nel lakehouse e nel warehouse',
        minutes: 10,
        body: l10,
        keyPoints: [
          'Decidi prima la granularità della tabella dei fatti.',
          'Usa chiavi surrogate intere nelle dimensioni.',
          'SCD tipo 1 sovrascrive; tipo 2 storicizza con nuove righe e date di validità.',
          'Denormalizza le gerarchie nelle dimensioni ed evita lo schema a fiocco di neve.',
        ],
        quickCheck: [
          q(
            'qc-stella-1',
            P,
            'Quando un cliente cambia città, i report devono continuare ad attribuire le vendite passate alla città precedente. Quale tipo di dimensione a variazione lenta usi?',
            ['Tipo 0', 'Tipo 1', 'Tipo 2', 'Nessuna: basta una colonna calcolata'],
            2,
            "L'**SCD di tipo 2** crea una nuova riga (con nuova chiave surrogata) per ogni versione, conservando lo storico.",
            1,
          ),
          q(
            'qc-stella-2',
            P,
            'Le tabelle Prodotto, Sottocategoria e Categoria arrivano separate dal gestionale. Cosa fai per lo schema a stella?',
            [
              'Le carichi così come sono, collegate tra loro',
              'Le unisci in una sola dimensione Prodotto con colonne Sottocategoria e Categoria',
              'Unisci tutto nella tabella dei fatti',
              'Crei una relazione molti-a-molti',
            ],
            1,
            'Si **denormalizza** la gerarchia nella dimensione, evitando uno schema a fiocco di neve.',
            1,
          ),
        ],
      },
      {
        id: 'pulizia-dati',
        title: 'Pulire, unire e arricchire i dati',
        minutes: 10,
        body: l11,
        keyPoints: [
          'Duplicati: ROW_NUMBER per scegliere la riga da tenere; dropDuplicates in Spark.',
          'Null: elimina, sostituisci o associa al membro "Sconosciuto".',
          'TRY_CAST/TRY_CONVERT restituiscono NULL invece di errore.',
          'Merge = join; Append = UNION ALL. Left anti per trovare righe orfane.',
        ],
        quickCheck: [
          q(
            'qc-pulizia-1',
            P,
            'Vuoi trovare le righe della tabella Vendite il cui codice prodotto **non esiste** nella tabella Prodotti. Quale tipo di join usi?',
            ['Inner join', 'Left anti join', 'Full outer join', 'Cross join'],
            1,
            'Il **left anti join** restituisce le righe di sinistra senza corrispondenza a destra.',
          ),
          q(
            'qc-pulizia-2',
            P,
            "In Power Query devi impilare le vendite 2024 e 2025, che hanno le stesse colonne. Quale operazione usi?",
            ['Unisci query (merge)', 'Accoda query (append)', 'Raggruppa per', 'Trasponi'],
            1,
            "**Accoda** impila le righe (come `UNION ALL`). **Unisci** affianca colonne in base a una chiave (come un join).",
            1,
          ),
        ],
      },
      {
        id: 'viste-procedure',
        title: 'Viste, funzioni e stored procedure',
        minutes: 8,
        body: l12,
        keyPoints: [
          'Viste: query salvate, anche nell\'endpoint SQL del lakehouse.',
          'Funzioni inline: tabelle parametriche e predicati RLS.',
          'Stored procedure: ELT in più passaggi con transazioni, solo nel warehouse se modificano dati.',
          'CTAS crea e popola una tabella in un solo passaggio.',
        ],
        quickCheck: [
          q(
            'qc-viste-1',
            P,
            "Quale oggetto puoi creare nell'**endpoint di analisi SQL** di un lakehouse?",
            ['Una stored procedure che esegue INSERT su una tabella Delta', 'Una vista', 'Una tabella con CREATE TABLE', 'Un trigger'],
            1,
            "L'endpoint SQL del lakehouse è in sola lettura per i dati, ma consente di creare **viste** e funzioni.",
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'pulizia-pyspark', title: 'Pulisci gli ordini con PySpark', kind: 'codice', language: 'pyspark', difficulty: 2, minutes: 25, hints: ['Una finestra partizionata per IdOrdine e ordinata per DataCaricamento ti permette di scegliere la riga.', 'dropna(subset=...) e fillna({...}) gestiscono i null.', 'to_date accetta un formato come secondo argomento.'] }, exPyspark),
      exercise({ id: 'vista-procedura', title: 'Dimensione SCD 1 con stored procedure e vista', kind: 'codice', language: 'sql', difficulty: 3, minutes: 30, hints: ['Prima aggiorna i prodotti esistenti, poi inserisci quelli nuovi.', 'Per la chiave surrogata: massimo esistente + ROW_NUMBER().', 'NOT EXISTS individua i prodotti nuovi.'] }, exProcedura),
    ],
  },
  {
    id: 'interrogare-dati',
    domainId: P,
    title: 'Interrogare e analizzare i dati',
    summary: 'Editor di query visivo, T-SQL, KQL e query DAX.',
    lessons: [
      {
        id: 'sql-visual-query',
        title: "T-SQL e editor di query visivo",
        minutes: 8,
        body: l13,
        keyPoints: [
          "L'editor di query visivo costruisce query senza codice e può salvarle come viste.",
          'Ordine logico: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.',
          'Funzioni finestra: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM() OVER.',
        ],
        quickCheck: [
          q(
            'qc-sql-1',
            P,
            'Vuoi confrontare il ricavo di ogni mese con quello del mese precedente nella stessa riga. Quale funzione T-SQL usi?',
            ['LEAD', 'LAG', 'RANK', 'NTILE'],
            1,
            '`LAG` legge il valore della riga **precedente** secondo l\'ordinamento indicato. `LEAD` legge la successiva.',
            1,
          ),
          q(
            'qc-sql-2',
            P,
            'Tre categorie hanno lo stesso ricavo, il più alto. Quale funzione assegna 1, 1, 1 e poi **2** alla categoria successiva?',
            ['ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE'],
            2,
            '`DENSE_RANK` non lascia buchi. `RANK` assegnerebbe 4 alla categoria successiva; `ROW_NUMBER` assegna numeri tutti diversi.',
          ),
        ],
      },
      {
        id: 'kql',
        title: 'Analizzare i dati con KQL',
        minutes: 9,
        body: l14,
        keyPoints: [
          'Le query KQL concatenano operatori con |.',
          'where, project, extend, summarize ... by bin(), top, take, join, render.',
          'sort by è decrescente se non specifichi asc.',
          'arg_max(Timestamp, *) restituisce l\'ultima riga per gruppo.',
        ],
        quickCheck: [
          q(
            'qc-kql-1',
            P,
            'Quale query KQL conta gli eventi per intervalli di 5 minuti?',
            [
              '`Eventi | summarize count() by bin(Timestamp, 5m)`',
              '`Eventi | project count() by Timestamp`',
              '`Eventi | extend bin(Timestamp, 5m) | count`',
              '`Eventi | top 5 by Timestamp`',
            ],
            0,
            '`summarize` aggrega e `bin()` raggruppa i timestamp in intervalli di ampiezza fissa.',
            1,
          ),
          q(
            'qc-kql-2',
            P,
            'Quale operatore KQL aggiunge una colonna calcolata mantenendo tutte le altre?',
            ['project', 'extend', 'summarize', 'distinct'],
            1,
            '`extend` aggiunge colonne. `project` seleziona solo le colonne elencate.',
            1,
          ),
        ],
      },
      {
        id: 'dax-query',
        title: 'Interrogare i modelli con DAX',
        minutes: 8,
        body: l15,
        keyPoints: [
          'Una query DAX inizia con EVALUATE e restituisce una tabella.',
          'DEFINE MEASURE crea misure valide solo per la query.',
          'SUMMARIZECOLUMNS è la funzione usata dai visual.',
          'Performance Analyzer permette di copiare la query di un visual.',
        ],
        quickCheck: [
          q(
            'qc-daxq-1',
            P,
            'Quale parola chiave è **obbligatoria** in una query DAX?',
            ['DEFINE', 'EVALUATE', 'ORDER BY', 'MEASURE'],
            1,
            '`EVALUATE` è obbligatoria e deve restituire una tabella. `DEFINE` e `ORDER BY` sono facoltative.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'telemetria-kql', title: 'Analizza la telemetria degli impianti', kind: 'codice', language: 'kql', difficulty: 2, minutes: 25, hints: ['ago(2h) indica "due ore fa".', 'bin(Timestamp, 10m) crea intervalli di 10 minuti.', 'arg_max restituisce la riga con il valore massimo.'] }, exKql),
      exercise({ id: 'query-dax', title: 'Scrivi query nella vista query DAX', kind: 'codice', language: 'dax', difficulty: 2, minutes: 20, hints: ['SUMMARIZECOLUMNS accetta colonne di raggruppamento e coppie nome/espressione.', 'Usa CALCULATETABLE per applicare il filtro sul paese.'] }, exDax),
    ],
  },
  {
    id: 'progettare-modelli',
    domainId: S,
    title: 'Progettare e costruire modelli semantici',
    summary: 'Modalità di archiviazione, relazioni e tabelle bridge, DAX avanzato, gruppi di calcolo e parametri di campo.',
    lessons: [
      {
        id: 'modalita-archiviazione',
        title: 'Modalità di archiviazione e modelli compositi',
        minutes: 9,
        body: l16,
        keyPoints: [
          'Import: velocissimo ma dati aggiornati al refresh. DirectQuery: sempre aggiornato ma dipende dalla sorgente.',
          'Direct Lake legge le tabelle Delta di OneLake senza import tradizionale.',
          'Nei modelli compositi le dimensioni vanno spesso in Dual.',
          'Oltre 10 GB serve il formato di archiviazione per modelli di grandi dimensioni.',
        ],
        quickCheck: [
          q(
            'qc-archiviazione-1',
            S,
            'In un modello composito la tabella dei fatti è in DirectQuery. Quale modalità conviene per le dimensioni collegate, usate anche da tabelle Import?',
            ['Import', 'DirectQuery', 'Dual', 'Direct Lake'],
            2,
            'In **Dual** la dimensione può comportarsi come Import o come DirectQuery a seconda della query, evitando relazioni limitate.',
          ),
          q(
            'qc-archiviazione-2',
            S,
            'Un modello Import supera i 10 GB compressi in una capacità Fabric. Cosa devi abilitare?',
            ['Aggiornamento incrementale', 'Il formato di archiviazione dei modelli semantici di grandi dimensioni', "L'endpoint XMLA in sola lettura", 'Il fallback su DirectQuery'],
            1,
            'Il **formato per modelli di grandi dimensioni** permette di superare il limite di 10 GB, fino alla memoria disponibile nella capacità.',
          ),
        ],
      },
      {
        id: 'relazioni',
        title: 'Relazioni, tabelle bridge e molti-a-molti',
        minutes: 8,
        body: l17,
        keyPoints: [
          'Una sola relazione attiva tra due tabelle: le altre con USERELATIONSHIP.',
          'Le relazioni molti-a-molti si modellano con una tabella bridge.',
          'Preferisci il filtro singolo e usa CROSSFILTER nelle misure.',
        ],
        quickCheck: [
          q(
            'qc-relazioni-1',
            S,
            'La tabella Vendite ha DataOrdine (relazione attiva con Data) e DataSpedizione (relazione inattiva). Come calcoli il ricavo per data di spedizione?',
            [
              '`CALCULATE([Ricavo], USERELATIONSHIP(Vendite[DataSpedizione], \'Data\'[Data]))`',
              '`CALCULATE([Ricavo], CROSSFILTER(Vendite[DataSpedizione], \'Data\'[Data], BOTH))`',
              '`CALCULATE([Ricavo], ALL(\'Data\'))`',
              '`RELATED(\'Data\'[Data])`',
            ],
            0,
            '`USERELATIONSHIP` attiva una relazione inattiva per la durata del calcolo.',
            1,
          ),
        ],
      },
      {
        id: 'dax-calcoli',
        title: 'DAX: variabili, iteratori, finestre e funzioni informative',
        minutes: 12,
        body: l18,
        keyPoints: [
          'CALCULATE modifica il contesto di filtro.',
          'Le variabili migliorano leggibilità e prestazioni; sono valutate una volta, dove sono definite.',
          'Gli iteratori (SUMX...) calcolano riga per riga.',
          'OFFSET, INDEX e WINDOW lavorano su righe ordinate; ISINSCOPE e SELECTEDVALUE leggono il contesto.',
        ],
        quickCheck: [
          q(
            'qc-dax-1',
            S,
            'Quale funzione DAX restituisce il valore della riga **precedente** in un elenco ordinato di mesi?',
            ['INDEX', 'OFFSET', 'WINDOW', 'RANKX'],
            1,
            '`OFFSET(-1, ...)` restituisce la riga a distanza relativa -1. `INDEX` usa una posizione assoluta, `WINDOW` un intervallo.',
          ),
          q(
            'qc-dax-2',
            S,
            'In una matrice con Categoria e Prodotto, vuoi mostrare un valore solo a livello di prodotto e lasciare vuoti i subtotali. Quale funzione usi nella condizione?',
            ['ISBLANK', 'ISINSCOPE', 'HASONEFILTER', 'USERPRINCIPALNAME'],
            1,
            '`ISINSCOPE(Prodotto[NomeProdotto])` è vero solo quando quel livello della gerarchia è attivo nella riga del visual.',
          ),
        ],
      },
      {
        id: 'gruppi-calcolo',
        title: 'Gruppi di calcolo, formati dinamici e parametri di campo',
        minutes: 9,
        body: l19,
        keyPoints: [
          'Gli elementi di calcolo usano SELECTEDMEASURE() e si applicano a tutte le misure esplicite.',
          'Creare un gruppo di calcolo scoraggia le misure implicite.',
          'Le stringhe di formato dinamiche mantengono il valore numerico, a differenza di FORMAT().',
          "I parametri di campo permettono all'utente di scegliere misure o colonne.",
        ],
        quickCheck: [
          q(
            'qc-gruppi-1',
            S,
            "In un elemento di calcolo, quale funzione rappresenta la misura su cui l'elemento viene applicato?",
            ['SELECTEDVALUE()', 'SELECTEDMEASURE()', 'CURRENTGROUP()', 'NAMEOF()'],
            1,
            '`SELECTEDMEASURE()` restituisce la misura presente nel contesto del visual.',
            1,
          ),
          q(
            'qc-gruppi-2',
            S,
            'Gli utenti vogliono uno slicer per scegliere se il grafico mostra Ricavo, Margine o Quantità. Cosa crei?',
            ['Un gruppo di calcolo', 'Un parametro di campo', 'Una stringa di formato dinamica', 'Un segnalibro per ogni misura'],
            1,
            'Il **parametro di campo** consente di scegliere dinamicamente le misure (o le colonne) di un visual.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'gruppo-calcolo', title: 'Gruppo di calcolo per la time intelligence', kind: 'codice', language: 'dax', difficulty: 3, minutes: 25, hints: ['Ogni elemento parte da SELECTEDMEASURE().', 'SAMEPERIODLASTYEAR e DATESYTD lavorano sulla colonna data della tabella Data.', 'Il formato percentuale si imposta solo su un elemento.'] }, exGruppo),
      exercise({ id: 'molti-a-molti', title: 'Modella conti cointestati', kind: 'scenario', difficulty: 3, minutes: 20, hints: ['Serve una tabella che colleghi clienti e conti.', 'Il filtro deve attraversare la tabella bridge.', 'CROSSFILTER può attivare la direzione bidirezionale in una sola misura.'] }, exM2m),
    ],
  },
  {
    id: 'ottimizzare-modelli',
    domainId: S,
    title: 'Ottimizzare modelli enterprise',
    summary: 'Performance Analyzer, DAX query view, cardinalità, aggiornamento incrementale e Direct Lake.',
    lessons: [
      {
        id: 'ottimizzazione',
        title: 'Diagnosticare e migliorare le prestazioni',
        minutes: 9,
        body: l20,
        keyPoints: [
          'Performance Analyzer separa tempo di query DAX, visualizzazione e altro.',
          'Il costo di una colonna dipende soprattutto dalla sua cardinalità.',
          'Rimuovi colonne inutili, separa data e ora, usa chiavi intere.',
          'Variabili e filtri su colonne rendono il DAX più efficiente.',
        ],
        quickCheck: [
          q(
            'qc-ottimizzazione-1',
            S,
            'In Performance Analyzer un visual mostra 12 secondi di **query DAX** e 0,2 secondi di visualizzazione. Dove intervieni?',
            ['Sul tipo di visual', 'Sulle misure DAX e sul modello', 'Sul numero di pagine del report', 'Sul tema del report'],
            1,
            'Il tempo è speso nella **query DAX**: bisogna ottimizzare misure e modello. Il visual in sé è veloce.',
            1,
          ),
          q(
            'qc-ottimizzazione-2',
            S,
            'Quale modifica riduce di più la dimensione di un modello Import?',
            [
              'Rinominare le colonne con nomi più brevi',
              'Rimuovere una colonna GUID con un valore diverso per ogni riga',
              'Nascondere le colonne non usate',
              'Ordinare le tabelle per data',
            ],
            1,
            'Le colonne ad **alta cardinalità** comprimono male. Nascondere una colonna non la rimuove dalla memoria.',
          ),
        ],
      },
      {
        id: 'aggiornamento-incrementale',
        title: 'Aggiornamento incrementale',
        minutes: 8,
        body: l21,
        keyPoints: [
          'Servono i parametri RangeStart e RangeEnd di tipo Data/ora.',
          'Filtro con >= su un estremo e < sull\'altro.',
          'La sorgente deve supportare il query folding.',
          'Rileva modifiche ai dati, solo periodi completi, partizione DirectQuery in tempo reale (tabella ibrida).',
        ],
        quickCheck: [
          q(
            'qc-incr-1',
            S,
            "Quali parametri richiede l'aggiornamento incrementale?",
            ['DataInizio e DataFine di tipo Testo', 'RangeStart e RangeEnd di tipo Data/ora', 'StartDate e EndDate di tipo Data', 'Un solo parametro Periodo'],
            1,
            'I nomi devono essere esattamente **RangeStart** e **RangeEnd**, di tipo **Data/ora**.',
            1,
          ),
          q(
            'qc-incr-2',
            S,
            "Vuoi che le partizioni incrementali vengano rielaborate solo se i dati sono effettivamente cambiati. Quale opzione abiliti?",
            ['Aggiorna solo i giorni completi', 'Rileva modifiche ai dati', 'Ottieni i dati più recenti in tempo reale con DirectQuery', 'Archivia i dati'],
            1,
            "**Rileva modifiche ai dati** usa una colonna di ultima modifica per decidere se ricaricare una partizione.",
          ),
        ],
      },
      {
        id: 'direct-lake',
        title: 'Direct Lake: framing, fallback e varianti',
        minutes: 10,
        body: l22,
        keyPoints: [
          'Il refresh in Direct Lake è il framing: un\'operazione di soli metadati.',
          'Il fallback su DirectQuery avviene con viste, RLS SQL o superamento dei guardrail (solo su endpoint SQL).',
          'DirectLakeBehavior: Automatic, DirectLakeOnly, DirectQueryOnly.',
          'Direct Lake su OneLake: più item, sicurezza OneLake, nessun fallback.',
        ],
        quickCheck: [
          q(
            'qc-dl-1',
            S,
            'Vuoi che un modello Direct Lake restituisca un errore invece di passare silenziosamente a DirectQuery. Come imposti **DirectLakeBehavior**?',
            ['Automatic', 'DirectLakeOnly', 'DirectQueryOnly', 'Import'],
            1,
            '**DirectLakeOnly** disabilita il fallback: le query che non possono usare Direct Lake falliscono.',
          ),
          q(
            'qc-dl-2',
            S,
            'Quali situazioni possono causare il fallback a DirectQuery di un modello Direct Lake sull\'endpoint SQL? (Seleziona 2 risposte.)',
            [
              'Il modello usa una vista SQL',
              "L'endpoint SQL applica la sicurezza a livello di riga",
              'La tabella è scritta con V-Order',
              'Il modello usa misure con variabili',
            ],
            [0, 1],
            "Viste SQL e sicurezza definita nell'endpoint SQL richiedono il passaggio a DirectQuery. V-Order e variabili DAX non c'entrano.",
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'report-lento', title: 'Diagnostica un report lento', kind: 'scenario', difficulty: 3, minutes: 25, hints: ['Separa i problemi di modello, di DAX e di visual.', 'Guarda la cardinalità delle colonne più grandi.', 'FILTER sull\'intera tabella dei fatti con RELATED è costoso.'] }, exLento),
      exercise({ id: 'lab-incrementale', title: "Configura l'aggiornamento incrementale", kind: 'lab', language: 'powerquery', difficulty: 2, minutes: 30, hints: ['I parametri devono avere nomi e tipo precisi.', 'Verifica il query folding con "Visualizza query nativa".'] }, exIncr),
    ],
  },
];
