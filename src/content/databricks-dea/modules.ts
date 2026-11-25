import type { Module } from '../../types';
import { exercise, q } from '../helpers';

import l01 from './lessons/01-piattaforma-architettura.md?raw';
import l02 from './lessons/02-compute.md?raw';
import l03 from './lessons/03-ingestione-pattern.md?raw';
import l04 from './lessons/04-auto-loader.md?raw';
import l05 from './lessons/05-lakeflow-connect.md?raw';
import l06 from './lessons/06-pulizia-silver.md?raw';
import l07 from './lessons/07-tuning-spark.md?raw';
import l08 from './lessons/08-gold-qualita.md?raw';
import l09 from './lessons/09-lakeflow-jobs.md?raw';
import l10 from './lessons/10-trigger-job.md?raw';
import l11 from './lessons/11-git-folders.md?raw';
import l12 from './lessons/12-bundles.md?raw';
import l13 from './lessons/13-monitoraggio-job.md?raw';
import l14 from './lessons/14-spark-ui-ottimizzazione.md?raw';
import l15 from './lessons/15-tabelle-uc.md?raw';
import l16 from './lessons/16-permessi-mascheramento.md?raw';

import exCompute from './exercises/scelta-compute.md?raw';
import exAutoLoader from './exercises/auto-loader-bronze.md?raw';
import exSilver from './exercises/silver-pulizia.md?raw';
import exJob from './exercises/job-dag.md?raw';
import exBundle from './exercises/bundle-ambienti.md?raw';
import exLento from './exercises/diagnosi-lento.md?raw';
import exPermessi from './exercises/permessi-uc.md?raw';

const P = 'piattaforma';
const I = 'ingestione';
const T = 'trasformazione';
const J = 'jobs';
const C = 'cicd';
const O = 'monitoraggio';
const G = 'governance';

export const modules: Module[] = [
  {
    id: 'dea-piattaforma',
    domainId: P,
    title: 'La Data Intelligence Platform',
    summary: 'Architettura lakehouse, Delta Lake, Unity Catalog e scelta del compute giusto per ogni carico.',
    lessons: [
      {
        id: 'dea-architettura',
        title: 'Lakehouse, Delta Lake e Unity Catalog',
        minutes: 9,
        body: l01,
        keyPoints: [
          'Control plane gestito da Databricks, compute plane separato, dati nello storage cloud.',
          'Delta Lake = Parquet + transaction log: ACID, schema enforcement, time travel, MERGE.',
          'Unity Catalog: metastore → catalog → schema → oggetto, nome a tre livelli.',
          'Medallion: bronze grezzo, silver pulito, gold pronto per il consumo.',
        ],
        quickCheck: [
          q(
            'qc-dea-arch-1',
            P,
            'Un analista ha cancellato per errore alcune righe di una tabella Delta ieri. Come le recuperi più rapidamente?',
            [
              'Ricaricando i file sorgente',
              'Con `RESTORE TABLE` a una versione precedente, trovata con `DESCRIBE HISTORY`',
              'Con `VACUUM` sulla tabella',
              'Non è possibile: le DELETE in Delta sono definitive',
            ],
            1,
            'Il **transaction log** conserva le versioni: `DESCRIBE HISTORY` mostra la versione prima della DELETE e `RESTORE TABLE ... TO VERSION AS OF n` la ripristina. `VACUUM` farebbe il contrario, eliminando i vecchi file.',
            1,
          ),
          q(
            'qc-dea-arch-2',
            P,
            'Quale componente fornisce permessi centralizzati, lineage e audit per tabelle, volumi e modelli?',
            ['Delta Lake', 'Unity Catalog', 'Photon', 'Il transaction log'],
            1,
            '**Unity Catalog** è il livello di governance unificato. Delta Lake è il formato di tabella, Photon è il motore di esecuzione vettorizzato.',
            1,
          ),
        ],
      },
      {
        id: 'dea-compute',
        title: 'Scegliere il compute',
        minutes: 8,
        body: l02,
        keyPoints: [
          'Serverless: avvio in secondi, nessuna configurazione, paghi il consumo.',
          'All-purpose per lo sviluppo interattivo; jobs compute (più economico) per la produzione.',
          'SQL warehouse per SQL, dashboard e strumenti BI.',
          'Modalità standard per la condivisione con UC; dedicated per API complete e librerie native.',
        ],
        quickCheck: [
          q(
            'qc-dea-compute-1',
            P,
            'Un job pianificato gira ogni notte su un cluster all-purpose acceso tutto il giorno. Qual è il cambiamento che riduce di più i costi?',
            [
              'Aumentare il numero di worker',
              'Eseguire il job su jobs compute o serverless',
              'Abilitare Photon sul cluster all-purpose',
              'Disattivare l\'autoscaling',
            ],
            1,
            "Il **jobs compute** ha tariffa DBU inferiore ed esiste solo per la durata del job; il **serverless** non richiede di tenere nulla acceso. L'all-purpose acceso tutto il giorno paga anche l'inattività.",
          ),
          q(
            'qc-dea-compute-2',
            P,
            'Un team di analisti esegue solo query SQL e dashboard. Quale compute è più indicato?',
            ['Un all-purpose in modalità dedicated', 'Un SQL warehouse serverless', 'Un jobs compute', 'Un instance pool'],
            1,
            'Il **SQL warehouse** è ottimizzato per SQL e BI; nella versione serverless si avvia in pochi secondi e scala con la concorrenza.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-scelta-compute', title: 'Scegli il compute per ogni carico', kind: 'scenario', difficulty: 1, minutes: 15, hints: ['Distingui sviluppo interattivo, produzione e BI.', 'Chiediti se servono configurazioni particolari (script di init, GPU).', 'Un cluster acceso inutilmente costa anche quando non lavora.'] }, exCompute),
    ],
  },
  {
    id: 'dea-ingestione',
    domainId: I,
    title: 'Ingestione e caricamento dei dati',
    summary: 'Pattern batch, incrementali e streaming; COPY INTO, Auto Loader, Lakeflow Connect, JDBC e API REST.',
    lessons: [
      {
        id: 'dea-pattern-ingestione',
        title: 'Pattern di ingestione e COPY INTO',
        minutes: 8,
        body: l03,
        keyPoints: [
          'Batch completo, batch incrementale, streaming: scegli in base a frequenza e volume.',
          'COPY INTO è idempotente: salta i file già caricati.',
          'COPY INTO per migliaia di file; Auto Loader per milioni e arrivi continui.',
          'Il caricamento di file locali dall\'interfaccia è per file piccoli e occasionali.',
        ],
        quickCheck: [
          q(
            'qc-dea-copy-1',
            I,
            'Un job esegue lo stesso `COPY INTO` ogni ora sulla stessa cartella. Cosa succede ai file già caricati nelle esecuzioni precedenti?',
            ['Vengono ricaricati, creando duplicati', 'Vengono saltati', 'Vengono eliminati dalla cartella', 'Il comando fallisce'],
            1,
            '`COPY INTO` è **idempotente**: ricorda i file già caricati e li salta. Per ricaricarli servirebbe `COPY_OPTIONS (\'force\' = \'true\')`.',
            1,
          ),
          q(
            'qc-dea-copy-2',
            I,
            'Arrivano decine di milioni di file al giorno in una cartella e lo schema cambia spesso. Cosa usi?',
            ['COPY INTO', 'Auto Loader', 'Caricamento di file dall\'interfaccia', 'Un CREATE TABLE AS SELECT pianificato'],
            1,
            '**Auto Loader** scala fino a miliardi di file e ha un supporto ricco all\'evoluzione dello schema; `COPY INTO` è adatto a volumi più contenuti.',
          ),
        ],
      },
      {
        id: 'dea-auto-loader',
        title: 'Auto Loader',
        minutes: 9,
        body: l04,
        keyPoints: [
          'Sorgente `cloudFiles` di Structured Streaming; stato nel checkpoint, exactly-once.',
          'Directory listing (predefinito) o file notification per cartelle enormi.',
          '`cloudFiles.schemaLocation` obbligatorio per dedurre lo schema.',
          'Evoluzione: addNewColumns (default), rescue, failOnNewColumns, none; `_rescued_data`.',
        ],
        quickCheck: [
          q(
            'qc-dea-al-1',
            I,
            'Vuoi che le colonne nuove non fermino mai lo stream e che i loro valori vengano comunque conservati. Quale `schemaEvolutionMode` scegli?',
            ['addNewColumns', 'rescue', 'failOnNewColumns', 'none'],
            1,
            'Con **rescue** lo schema resta fisso e i dati non previsti finiscono nella colonna `_rescued_data`. `addNewColumns` ferma lo stream per aggiornare lo schema; `none` ignora le colonne nuove.',
          ),
          q(
            'qc-dea-al-2',
            I,
            'Quale opzione di scrittura fa elaborare ad Auto Loader tutti i file nuovi disponibili e poi terminare?',
            ['`trigger(processingTime="1 minute")`', '`trigger(availableNow=True)`', '`outputMode("complete")`', '`option("cloudFiles.useNotifications", "true")`'],
            1,
            '`availableNow=True` elabora tutto ciò che è disponibile (anche in più micro-batch) e si ferma: ideale in un job pianificato o con trigger file arrival.',
            1,
          ),
        ],
      },
      {
        id: 'dea-lakeflow-connect',
        title: 'Lakeflow Connect, JDBC e API',
        minutes: 8,
        body: l05,
        keyPoints: [
          'Connettori standard (storage, Kafka) e gestiti (Salesforce, Workday, SQL Server...).',
          'I connettori gestiti creano pipeline di ingestione verso streaming table di UC.',
          'Senza connettore: notebook con JDBC o REST orchestrato da Lakeflow Jobs.',
          'Credenziali sempre nei secret scope.',
        ],
        quickCheck: [
          q(
            'qc-dea-lc-1',
            I,
            'Devi acquisire ogni giorno gli oggetti di Salesforce in Unity Catalog con il minimo sviluppo e caricamenti incrementali. Cosa scegli?',
            ['Un notebook con chiamate REST scritte a mano', 'Il connettore gestito Salesforce di Lakeflow Connect', 'COPY INTO', 'Un export CSV manuale caricato dall\'interfaccia'],
            1,
            'I **connettori gestiti** di Lakeflow Connect offrono configurazione guidata, ingestione incrementale e gestione dello schema già pronte.',
            1,
          ),
          q(
            'qc-dea-lc-2',
            I,
            'In un notebook che legge un database via JDBC, dove vanno utente e password?',
            ['In una cella del notebook', 'In un parametro del job', 'In un secret scope, letti con `dbutils.secrets.get`', 'In un file CSV nel volume'],
            2,
            'I **secret** non compaiono in chiaro negli output e sono governati da permessi. Mai scrivere credenziali nel codice o nei parametri.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-auto-loader-bronze', title: 'Ingestione bronze con Auto Loader', kind: 'codice', language: 'pyspark', difficulty: 2, minutes: 25, hints: ['La sorgente si chiama cloudFiles.', 'Lo schema dedotto va salvato in una posizione dedicata.', 'Quale modalità di evoluzione non ferma lo stream?', 'I metadati del file sono nella colonna nascosta _metadata.'] }, exAutoLoader),
    ],
  },
  {
    id: 'dea-trasformazione',
    domainId: T,
    title: 'Trasformazione e modellazione',
    summary: 'Pulizia silver in PySpark e SQL, join, deduplicazione, aggregazioni, tuning di base e oggetti gold con controlli di qualità.',
    lessons: [
      {
        id: 'dea-pulizia-silver',
        title: 'Pulire e combinare i dati',
        minutes: 10,
        body: l06,
        keyPoints: [
          'dropna/fillna/cast in PySpark; coalesce/try_cast in SQL.',
          '`union` di PySpark non elimina i duplicati; `UNION` di SQL sì.',
          'Broadcast join per tabelle piccole; explode per gli array.',
          'Per tenere la riga più recente: row_number() su una finestra, o QUALIFY.',
        ],
        quickCheck: [
          q(
            'qc-dea-pulizia-1',
            T,
            'In PySpark unisci due DataFrame con le stesse colonne ma in ordine diverso. Cosa usi per allinearle correttamente?',
            ['`union`', '`unionByName`', '`crossJoin`', '`join` con tipo `outer`'],
            1,
            '`unionByName` allinea le colonne per **nome**; `union` le allinea per posizione e unirebbe colonne diverse.',
          ),
          q(
            'qc-dea-pulizia-2',
            T,
            'Una colonna `tag` è un array di stringhe. Vuoi una riga per ogni tag, **senza perdere** le righe con array vuoto. Cosa usi?',
            ['`explode`', '`explode_outer`', '`split`', '`flatten`'],
            1,
            '`explode_outer` produce una riga con valore `NULL` quando l\'array è vuoto o nullo; `explode` invece elimina quelle righe.',
          ),
        ],
      },
      {
        id: 'dea-tuning',
        title: 'Parametri di tuning di Spark',
        minutes: 8,
        body: l07,
        keyPoints: [
          'Lo shuffle è l\'operazione più costosa: separa gli stage.',
          '`spark.sql.shuffle.partitions` (200) e `autoBroadcastJoinThreshold` (10 MB).',
          'La memoria di executor e driver si imposta nella configurazione del cluster.',
          'Misura, cambia un parametro alla volta, rimisura.',
        ],
        quickCheck: [
          q(
            'qc-dea-tuning-1',
            T,
            'Dopo un `groupBy` su pochi MB di dati vedi 200 task che durano pochi millisecondi ciascuno. Cosa modifichi?',
            ['Aumenti `spark.executor.memory`', 'Riduci `spark.sql.shuffle.partitions`', 'Disattivi il broadcast join', 'Aumenti `spark.driver.memory`'],
            1,
            'Troppe partizioni per pochi dati creano overhead: ridurre **`spark.sql.shuffle.partitions`** (o lasciar fare ad AQE) diminuisce il numero di task inutili.',
          ),
          q(
            'qc-dea-tuning-2',
            T,
            'Un join con una tabella di 25 MB non viene eseguito in broadcast. Quale parametro lo spiega?',
            ['`spark.default.parallelism`', '`spark.sql.autoBroadcastJoinThreshold`', '`spark.sql.shuffle.partitions`', '`spark.executor.memory`'],
            1,
            'La soglia predefinita di **`autoBroadcastJoinThreshold`** è 10 MB: una tabella più grande non viene inviata in broadcast automaticamente, salvo un hint `broadcast()` o una soglia più alta.',
          ),
        ],
      },
      {
        id: 'dea-gold-qualita',
        title: 'Oggetti gold e qualità dei dati',
        minutes: 9,
        body: l08,
        keyPoints: [
          'Vista = calcolata a ogni lettura; materialized view = precalcolata e aggiornata.',
          'Streaming table = alimentata in modo incrementale, append-only.',
          'Expectations: warn (mantiene), DROP ROW (scarta), FAIL UPDATE (blocca).',
          'Fuori dalle pipeline: vincoli CHECK e NOT NULL sulle tabelle Delta.',
        ],
        quickCheck: [
          q(
            'qc-dea-gold-1',
            T,
            'Una dashboard molto usata calcola ogni volta un\'aggregazione costosa su miliardi di righe che cambiano ogni ora. Quale oggetto gold riduce il costo delle letture?',
            ['Una vista', 'Una materialized view', 'Una tabella temporanea', 'Una vista temporanea di sessione'],
            1,
            'La **materialized view** salva il risultato e lo aggiorna (anche in modo incrementale): le letture non ricalcolano l\'aggregazione.',
            1,
          ),
          q(
            'qc-dea-gold-2',
            T,
            'In una pipeline dichiarativa vuoi scartare le righe senza `id_ordine` ma continuare l\'aggiornamento. Quale clausola usi?',
            ['`EXPECT (id_ordine IS NOT NULL)`', '`EXPECT (id_ordine IS NOT NULL) ON VIOLATION DROP ROW`', '`EXPECT (id_ordine IS NOT NULL) ON VIOLATION FAIL UPDATE`', '`CHECK (id_ordine IS NOT NULL)`'],
            1,
            '`ON VIOLATION DROP ROW` scarta la riga e la conteggia nelle metriche. Senza azione la riga resta (warn); `FAIL UPDATE` ferma l\'aggiornamento.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-silver-pulizia', title: 'Dal bronze al silver con Spark SQL', kind: 'codice', language: 'sparksql', difficulty: 2, minutes: 25, hints: ['Per tenere la versione più recente serve una funzione finestra.', 'QUALIFY evita una sottoquery.', 'Per trasformare un array in righe: explode con LATERAL VIEW.', 'Esiste una funzione di conteggio distinto approssimato.'] }, exSilver),
    ],
  },
  {
    id: 'dea-jobs',
    domainId: J,
    title: 'Orchestrare con Lakeflow Jobs',
    summary: 'Task, dipendenze e DAG, retry, condizioni if/else e for each, trigger basati su tempo o sui dati.',
    lessons: [
      {
        id: 'dea-lakeflow-jobs',
        title: 'Task, dipendenze e flussi di controllo',
        minutes: 9,
        body: l09,
        keyPoints: [
          'Un job è un DAG di task: notebook, SQL, pipeline, dashboard, dbt, run job.',
          'Run if: All succeeded (default), All done, At least one failed...',
          'Retry per errori transitori; if/else e for each per il controllo del flusso.',
          'I task values passano dati tra task.',
        ],
        quickCheck: [
          q(
            'qc-dea-jobs-1',
            J,
            'Un task di pulizia deve girare sempre, anche se i task da cui dipende falliscono. Quale impostazione usi?',
            ['Retry illimitati', 'Run if = All done', 'Run if = All succeeded', 'Max concurrent runs = 2'],
            1,
            '**All done** esegue il task quando tutte le dipendenze sono terminate, qualunque sia l\'esito.',
            1,
          ),
          q(
            'qc-dea-jobs-2',
            J,
            'Devi eseguire lo stesso notebook per 30 paesi diversi, alcuni in parallelo. Quale tipo di task usi?',
            ['If/else condition', 'For each', 'Run job', 'Trenta task notebook copiati a mano'],
            1,
            'Il task **For each** ripete un task annidato per ogni elemento di una lista, con una concorrenza configurabile.',
            1,
          ),
        ],
      },
      {
        id: 'dea-trigger',
        title: 'Pianificazioni e trigger',
        minutes: 7,
        body: l10,
        keyPoints: [
          'Scheduled (cron), file arrival, table update, continuous, manuale/API.',
          'Dati a orari prevedibili → pianificazione; arrivi imprevedibili → trigger sui dati.',
          'Table update per dipendere da tabelle prodotte da altri.',
          'Max concurrent runs e notifiche controllano le esecuzioni.',
        ],
        quickCheck: [
          q(
            'qc-dea-trigger-1',
            J,
            'Un job gold deve partire appena il team finanza aggiorna la tabella `fin.silver.fatture`, in orari variabili. Quale trigger usi?',
            ['Scheduled ogni 10 minuti', 'File arrival', 'Table update', 'Continuous'],
            2,
            'Il trigger **table update** avvia il job quando la tabella di Unity Catalog viene modificata, senza esecuzioni a vuoto.',
            1,
          ),
          q(
            'qc-dea-trigger-2',
            J,
            'Qual è lo svantaggio principale di un trigger basato sul tempo quando i dati arrivano in ritardo?',
            ['Costa più DBU', 'Il job può elaborare dati incompleti', 'Non supporta notifiche', 'Non si può mettere in pausa'],
            1,
            'Se la pianificazione scatta prima dell\'arrivo dei dati, il job elabora un insieme **incompleto**: i trigger basati sui dati evitano il problema.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-job-dag', title: 'Progetta il DAG di un job', kind: 'scenario', difficulty: 2, minutes: 20, hints: ['Due task senza dipendenze tra loro girano in parallelo.', 'Per decidere se aggiornare il gold serve un task condizione.', 'Un valore calcolato in un task si passa con i task values.', 'Quale trigger usare quando l\'orario di arrivo non è prevedibile?'] }, exJob),
    ],
  },
  {
    id: 'dea-cicd',
    domainId: C,
    title: 'CI/CD',
    summary: 'Git folders, branch e pull request; Declarative Automation Bundles con variabili e target; Databricks CLI.',
    lessons: [
      {
        id: 'dea-git-folders',
        title: 'Git folders',
        minutes: 7,
        body: l11,
        keyPoints: [
          'Clone, branch, commit & push, pull dalla finestra Git di Databricks.',
          'Pull request e revisioni sul provider Git.',
          'Ogni sviluppatore nel proprio Git folder e branch.',
          'La produzione si aggiorna da CI/CD, non a mano.',
        ],
        quickCheck: [
          q(
            'qc-dea-git-1',
            C,
            'Dove si crea e si approva una pull request quando si lavora con un Git folder di Databricks?',
            ['Nella finestra Git del notebook', 'Sul provider Git (GitHub, Azure DevOps...)', 'Nella pagina del job', 'In Catalog Explorer'],
            1,
            'Databricks gestisce branch, commit, push e pull; **pull request** e revisioni avvengono sul **provider Git**.',
            1,
          ),
          q(
            'qc-dea-git-2',
            C,
            'Due sviluppatori modificano lo stesso Git folder condiviso e si sovrascrivono le modifiche. Qual è la pratica corretta?',
            ['Usare un solo branch per tutti', 'Ogni sviluppatore clona il repo nel proprio Git folder e lavora su un proprio branch', 'Disattivare Git e salvare copie dei notebook', 'Lavorare a turni'],
            1,
            'Ogni persona deve avere il **proprio** Git folder e un **branch** di funzionalità; le modifiche si integrano tramite pull request.',
            1,
          ),
        ],
      },
      {
        id: 'dea-bundles',
        title: 'Declarative Automation Bundles e CLI',
        minutes: 9,
        body: l12,
        keyPoints: [
          '`databricks.yml`: bundle, variables, resources, targets.',
          'Override delle variabili per target per promuovere lo stesso codice.',
          'mode: development prefissa le risorse e mette in pausa le pianificazioni.',
          'CLI: bundle validate, deploy, run, destroy.',
        ],
        quickCheck: [
          q(
            'qc-dea-bundle-1',
            C,
            'Quale comando controlla la configurazione di un bundle senza distribuire nulla?',
            ['`databricks bundle deploy`', '`databricks bundle validate`', '`databricks bundle run`', '`databricks bundle init`'],
            1,
            '`bundle validate` verifica la sintassi e risolve variabili e target; `deploy` crea o aggiorna le risorse.',
            1,
          ),
          q(
            'qc-dea-bundle-2',
            C,
            'Lo stesso job deve scrivere nel catalog `dev` in sviluppo e `prod` in produzione. Come lo configuri nel bundle?',
            ['Due file `databricks.yml` diversi', 'Una variabile `catalog` con default `dev` e override nel target `prod`', 'Un parametro modificato a mano dopo il deploy', 'Due cartelle con notebook duplicati'],
            1,
            'Le **variabili** con **override per target** permettono di promuovere lo stesso codice cambiando solo `-t`.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-bundle-ambienti', title: 'Un bundle per dev e prod', kind: 'codice', language: 'yaml', difficulty: 2, minutes: 25, hints: ['La pianificazione usa una espressione cron Quartz e un fuso orario.', 'Una variabile con default e override per target.', 'Quale modalità del target mette in pausa le pianificazioni?'] }, exBundle),
    ],
  },
  {
    id: 'dea-monitoraggio',
    domainId: O,
    title: 'Monitoraggio, troubleshooting e ottimizzazione',
    summary: 'Cronologia e grafo dei run, repair, errori del compute, Spark UI (skew, shuffle, spill), Liquid Clustering e Predictive Optimization.',
    lessons: [
      {
        id: 'dea-monitoraggio-job',
        title: 'Monitorare e riparare i job',
        minutes: 8,
        body: l13,
        keyPoints: [
          'Vista a matrice e grafico delle durate per confrontare i run con la baseline.',
          'Il grafo del run mostra il task fallito e quelli saltati a valle.',
          'Repair run riesegue solo i task falliti e i dipendenti.',
          'Errori di avvio: capacità, script di init; errori di librerie: versioni da fissare.',
        ],
        quickCheck: [
          q(
            'qc-dea-mon-1',
            O,
            'In un job di 12 task fallisce solo il nono. Dopo aver corretto il codice, come lo riesegui senza ripetere i task già riusciti?',
            ['Avvii un nuovo run completo', 'Usi Repair run', 'Cloni il job', 'Aumenti i retry'],
            1,
            '**Repair run** riesegue solo i task falliti o saltati e quelli che ne dipendono, riutilizzando i risultati degli altri.',
            1,
          ),
          q(
            'qc-dea-mon-2',
            O,
            'Un job fallisce con `ModuleNotFoundError` subito dopo un aggiornamento del runtime. Qual è la causa più probabile?',
            ['Skew dei dati', 'Una libreria non installata o incompatibile con il nuovo runtime', 'Una quota cloud esaurita', 'Un trigger sbagliato'],
            1,
            'Gli errori di import indicano **librerie** mancanti o in conflitto: vanno installate nell\'ambiente del job con versioni fissate e compatibili.',
          ),
        ],
      },
      {
        id: 'dea-spark-ui',
        title: 'Spark UI, Liquid Clustering e Predictive Optimization',
        minutes: 10,
        body: l14,
        keyPoints: [
          'Skew: task massimo molto più lento della mediana.',
          'Shuffle: GB di shuffle read/write; spill: dati scritti su disco per mancanza di memoria.',
          'Liquid Clustering sostituisce partizionamento e ZORDER; chiavi modificabili; CLUSTER BY AUTO.',
          'Predictive Optimization esegue OPTIMIZE, VACUUM e ANALYZE sulle tabelle gestite.',
        ],
        quickCheck: [
          q(
            'qc-dea-ui-1',
            O,
            'Nella Spark UI la durata mediana dei task è 4 secondi, quella massima 20 minuti. Di quale problema si tratta?',
            ['Spill', 'Data skew', 'Troppe poche partizioni', 'Driver sottodimensionato'],
            1,
            'Una differenza enorme tra mediana e massimo indica che pochi task elaborano gran parte dei dati: **data skew**.',
            1,
          ),
          q(
            'qc-dea-ui-2',
            O,
            'Quali operazioni esegue automaticamente la Predictive Optimization sulle tabelle gestite? (Seleziona 2 risposte.)',
            ['OPTIMIZE', 'VACUUM', 'RESTORE', 'DEEP CLONE'],
            [0, 1],
            'La Predictive Optimization esegue **OPTIMIZE**, **VACUUM** e **ANALYZE** quando servono. `RESTORE` e `CLONE` sono operazioni richieste dall\'utente.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-diagnosi-lento', title: 'Perché il job è diventato lento?', kind: 'scenario', difficulty: 3, minutes: 20, hints: ['Confronta durata mediana e massima dei task.', 'Che cosa hanno in comune tutte le righe finite nella stessa partizione?', 'Quanto pesa la tabella clienti rispetto alla soglia di broadcast?'] }, exLento),
    ],
  },
  {
    id: 'dea-governance',
    domainId: G,
    title: 'Governance e sicurezza',
    summary: 'Tabelle gestite ed esterne, external location, GRANT e REVOKE, row filter, column mask e policy ABAC.',
    lessons: [
      {
        id: 'dea-tabelle-uc',
        title: 'Tabelle gestite ed esterne',
        minutes: 8,
        body: l15,
        keyPoints: [
          'Gestita: DROP elimina anche i dati; scelta consigliata.',
          'Esterna: LOCATION in una external location; DROP elimina solo i metadati.',
          'Storage credential + external location governano l\'accesso allo storage.',
          'Conversione: ALTER TABLE ... SET MANAGED, CTAS o DEEP CLONE.',
        ],
        quickCheck: [
          q(
            'qc-dea-tab-1',
            G,
            'Elimini con `DROP TABLE` una tabella **esterna**. Cosa succede ai file?',
            ['Vengono eliminati subito', 'Restano nello storage; vengono eliminati solo i metadati', 'Vengono spostati nello storage gestito', 'Vengono eliminati dopo 7 giorni'],
            1,
            'Per una tabella **esterna** Unity Catalog elimina solo la definizione: i file nel percorso `LOCATION` restano.',
            1,
          ),
          q(
            'qc-dea-tab-2',
            G,
            'Quale oggetto unisce un percorso cloud a una storage credential per controllare chi può leggere e scrivere file in quel percorso?',
            ['Volume gestito', 'External location', 'Secret scope', 'Metastore'],
            1,
            'L\'**external location** associa percorso e credenziale; su di essa si concedono `READ FILES`, `WRITE FILES`, `CREATE EXTERNAL TABLE`.',
          ),
        ],
      },
      {
        id: 'dea-permessi',
        title: 'Permessi, filtri di riga e maschere',
        minutes: 10,
        body: l16,
        keyPoints: [
          'Per leggere servono USE CATALOG + USE SCHEMA + SELECT.',
          'I privilegi si ereditano verso il basso, anche sugli oggetti futuri.',
          'Unity Catalog non ha DENY: si revoca.',
          'Row filter e column mask con funzioni e is_account_group_member(); ABAC con tag governati per scalare.',
        ],
        quickCheck: [
          q(
            'qc-dea-perm-1',
            G,
            'Un gruppo ha `SELECT` sulla tabella `prod.vendite.ordini` ma riceve un errore di permessi. Cosa manca probabilmente?',
            ['`MODIFY` sulla tabella', '`USE CATALOG` su `prod` e `USE SCHEMA` su `prod.vendite`', '`ALL PRIVILEGES` sul metastore', 'La proprietà della tabella'],
            1,
            'Oltre a `SELECT` servono i privilegi di attraversamento **USE CATALOG** e **USE SCHEMA** sui contenitori.',
            1,
          ),
          q(
            'qc-dea-perm-2',
            G,
            'Devi mascherare tutte le colonne etichettate come email in centinaia di tabelle, incluse quelle future. Qual è l\'approccio più scalabile?',
            ['Una column mask su ogni tabella', 'Una vista dinamica per tabella', 'Una policy ABAC basata su un tag governato', 'Revocare SELECT su tutte le tabelle'],
            2,
            'Una **policy ABAC** applica la maschera a tutte le colonne con il tag indicato, nel catalog o schema, anche sulle tabelle create in futuro.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dea-permessi-uc', title: 'Permessi, filtri e maschere in Unity Catalog', kind: 'codice', language: 'sparksql', difficulty: 2, minutes: 25, hints: ['Servono privilegi anche su catalog e schema.', 'Un SELECT sullo schema vale anche per le tabelle future.', 'Per i gruppi nelle funzioni: is_account_group_member().'] }, exPermessi),
    ],
  },
];
