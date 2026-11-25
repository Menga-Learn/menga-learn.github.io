import type { Module } from '../../types';
import { exercise, q } from '../helpers';

import l01 from './lessons/01-progetti-librerie.md?raw';
import l02 from './lessons/02-udf.md?raw';
import l03 from './lessons/03-pipeline-dichiarative.md?raw';
import l04 from './lessons/04-auto-cdc.md?raw';
import l05 from './lessons/05-structured-streaming.md?raw';
import l06 from './lessons/06-jobs-avanzati.md?raw';
import l07 from './lessons/07-test.md?raw';
import l08 from './lessons/08-ingestione-sorgenti.md?raw';
import l09 from './lessons/09-condivisione-federazione.md?raw';
import l10 from './lessons/10-trasformazioni-avanzate.md?raw';
import l11 from './lessons/11-qualita-expectations.md?raw';
import l12 from './lessons/12-system-tables-event-log.md?raw';
import l13 from './lessons/13-alert-api.md?raw';
import l14 from './lessons/14-layout-ottimizzazione.md?raw';
import l15 from './lessons/15-cdf-query-profile.md?raw';
import l16 from './lessons/16-sicurezza-privacy.md?raw';
import l17 from './lessons/17-cancellazione-gdpr.md?raw';
import l18 from './lessons/18-metadati-ereditarieta.md?raw';
import l19 from './lessons/19-debug-deploy.md?raw';
import l20 from './lessons/20-modellazione.md?raw';

import exTest from './exercises/test-pyspark.md?raw';
import exCdc from './exercises/auto-cdc-scd2.md?raw';
import exKafka from './exercises/kafka-bronze-silver.md?raw';
import exVariant from './exercises/variant-ai.md?raw';
import exCosti from './exercises/costi-system-tables.md?raw';
import exLayout from './exercises/layout-tabelle.md?raw';
import exGdpr from './exercises/gdpr-cancellazione.md?raw';
import exGerarchia from './exercises/gerarchia-permessi.md?raw';
import exFallito from './exercises/job-fallito.md?raw';
import exMetric from './exercises/metric-view.md?raw';

const V = 'sviluppo';
const I = 'ingestione';
const M = 'manipolazione';
const A = 'monitoraggio';
const O = 'ottimizzazione';
const S = 'sicurezza';
const G = 'governance';
const D = 'debug';
const DM = 'modellazione';

export const modules: Module[] = [
  {
    id: 'dep-codice',
    domainId: V,
    title: 'Codice di produzione in Python e SQL',
    summary: 'Progetti modulari per i bundle, dipendenze e librerie, UDF e funzioni Unity Catalog, unit test e test di integrazione.',
    lessons: [
      {
        id: 'dep-progetti-librerie',
        title: 'Progetti Python e dipendenze',
        minutes: 9,
        body: l01,
        keyPoints: [
          'Logica in funzioni testabili, progetto con databricks.yml, src/, tests/ e pyproject.toml.',
          'Serverless: dipendenze nell\'ambiente del task; classico: libraries del task.',
          'Una libreria installata con %pip nel notebook non è disponibile nel job.',
          'Serverless non supporta script di init né pacchetti di sistema.',
        ],
        quickCheck: [
          q(
            'qc-dep-lib-1',
            V,
            'Un task serverless fallisce con `ModuleNotFoundError: requests`, anche se lo sviluppatore aveva eseguito `%pip install requests` nel notebook durante i test. Qual è la correzione?',
            ['Aggiungere `%pip install` in un altro notebook', 'Dichiarare `requests` nelle dipendenze dell\'ambiente del task', 'Usare uno script di init', 'Aumentare la memoria del driver'],
            1,
            'Su serverless le librerie dei job si dichiarano nell\'**ambiente** del task (`environments` → `dependencies`). L\'installazione interattiva non si trasferisce al job.',
          ),
          q(
            'qc-dep-lib-2',
            V,
            'Una libreria richiede pacchetti di sistema installati con uno script di init. Quale compute devi usare?',
            ['Serverless per job', 'Compute classico (job cluster)', 'SQL warehouse serverless', 'Qualsiasi, è indifferente'],
            1,
            'Il **serverless** non supporta script di init né pacchetti di sistema: serve un **job cluster classico**.',
          ),
        ],
      },
      {
        id: 'dep-udf',
        title: 'UDF e funzioni Unity Catalog',
        minutes: 9,
        body: l02,
        keyPoints: [
          'Prima le funzioni native, poi SQL UDF, Pandas UDF e infine Python UDF.',
          'Pandas UDF: lotti con Apache Arrow, molto più veloci delle Python UDF riga per riga.',
          'Funzioni in UC (SQL o Python): condivise, governate con EXECUTE, con lineage.',
          'Le funzioni UC si usano anche come row filter e column mask.',
        ],
        quickCheck: [
          q(
            'qc-dep-udf-1',
            V,
            'Una Python UDF che applica un calcolo numerico vettorizzabile rallenta un job su 2 miliardi di righe. Quale alternativa migliora di più le prestazioni mantenendo Python?',
            ['Una Pandas UDF', 'Un ciclo `for` su `collect()`', 'Più retry', 'Una vista temporanea'],
            0,
            'Una **Pandas UDF** elabora lotti di righe trasferiti con Arrow e usa operazioni vettoriali, riducendo drasticamente l\'overhead per riga.',
          ),
          q(
            'qc-dep-udf-2',
            V,
            'Gli analisti SQL devono riusare una funzione Python di normalizzazione degli indirizzi, con permessi controllati. Cosa crei?',
            ['Una Python UDF registrata nella sessione Spark', 'Una funzione `LANGUAGE PYTHON` in Unity Catalog con `GRANT EXECUTE`', 'Un notebook condiviso', 'Una wheel installata sul cluster'],
            1,
            'Una **funzione Python in Unity Catalog** è richiamabile da SQL su warehouse e notebook, con il privilegio **EXECUTE** e il lineage.',
          ),
        ],
      },
      {
        id: 'dep-test',
        title: 'Unit test e test di integrazione',
        minutes: 8,
        body: l07,
        keyPoints: [
          'Funzioni pure DataFrame → DataFrame, concatenate con DataFrame.transform.',
          'assertDataFrameEqual (contenuto e schema, ordine ignorato) e assertSchemaEqual.',
          'Unit test a ogni pull request; test di integrazione nel target test dopo il merge.',
        ],
        quickCheck: [
          q(
            'qc-dep-test-1',
            V,
            'Quale funzione confronta due DataFrame, per contenuto e schema, ignorando di default l\'ordine delle righe?',
            ['`assertSchemaEqual`', '`assertDataFrameEqual`', '`df.equals()`', '`df.exceptAll()`'],
            1,
            '`pyspark.testing.assertDataFrameEqual` confronta righe e schema e mostra un messaggio leggibile con le differenze.',
            1,
          ),
          q(
            'qc-dep-test-2',
            V,
            'In quale fase conviene eseguire i test di integrazione di un job distribuito con un bundle?',
            ['Prima di scrivere il codice', 'Dopo il deploy nel target di test, prima della produzione', 'Solo in produzione', 'Mai: bastano gli unit test'],
            1,
            'I test di integrazione richiedono risorse reali: si eseguono dopo `bundle deploy -t test`, come controllo prima di distribuire in **prod**.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-test-pyspark', title: 'Unit test di una trasformazione', kind: 'codice', language: 'python', difficulty: 2, minutes: 25, hints: ['Le utilità sono nel modulo pyspark.testing.', 'In che posizione finisce la colonna usata nel join?', 'Una valuta senza tasso usa il valore 1.0.'] }, exTest),
    ],
  },
  {
    id: 'dep-pipeline-streaming',
    domainId: V,
    title: 'Pipeline, streaming e orchestrazione',
    summary: 'Pipeline dichiarative, streaming table o materialized view, AUTO CDC con SCD, Structured Streaming con stato e Lakeflow Jobs avanzati.',
    lessons: [
      {
        id: 'dep-pipeline-dichiarative',
        title: 'Pipeline dichiarative',
        minutes: 10,
        body: l03,
        keyPoints: [
          'Streaming table: ogni riga una volta, sorgenti append-only.',
          'Materialized view: risultato sempre corretto, adatta a sorgenti con update/delete.',
          'Triggered vs continuous; development vs production.',
          'SDP per dipendenze e qualità gestite; Structured Streaming per controllo fine.',
        ],
        quickCheck: [
          q(
            'qc-dep-sdp-1',
            V,
            'Una tabella gold aggrega una tabella silver che riceve UPDATE e DELETE. Quale tipo di dataset usi nella pipeline?',
            ['Streaming table', 'Materialized view', 'Vista temporanea', 'Tabella esterna'],
            1,
            'La **materialized view** riflette correttamente aggiornamenti ed eliminazioni della sorgente; una streaming table presuppone sorgenti append-only.',
          ),
          q(
            'qc-dep-sdp-2',
            V,
            'Il team vuole dipendenze automatiche, expectations di qualità, retry e compute gestiti con il minimo codice operativo. Cosa scegli?',
            ['Structured Streaming con foreachBatch', 'Lakeflow Spark Declarative Pipelines', 'Notebook pianificati in sequenza', 'COPY INTO'],
            1,
            'Le **pipeline dichiarative** gestiscono dipendenze, qualità, checkpoint, retry e compute: si dichiara solo il risultato.',
            1,
          ),
        ],
      },
      {
        id: 'dep-auto-cdc',
        title: 'CDC con AUTO CDC e SCD',
        minutes: 9,
        body: l04,
        keyPoints: [
          'AUTO CDC (già APPLY CHANGES): keys, sequence_by, apply_as_deletes.',
          'SCD tipo 1 = valore attuale; tipo 2 = storico con __START_AT/__END_AT.',
          'sequence_by gestisce eventi fuori ordine e duplicati.',
          'track_history_column_list limita le colonne storicizzate.',
        ],
        quickCheck: [
          q(
            'qc-dep-cdc-1',
            V,
            'Nelle AUTO CDC API, quale parametro determina come vengono gestiti gli eventi arrivati fuori ordine?',
            ['`keys`', '`sequence_by`', '`stored_as_scd_type`', '`except_column_list`'],
            1,
            '`sequence_by` indica la colonna che ordina logicamente gli eventi: un evento più vecchio non sovrascrive uno più recente.',
          ),
          q(
            'qc-dep-cdc-2',
            V,
            'Vuoi conservare lo storico delle modifiche di ogni cliente con il periodo di validità. Quale impostazione usi?',
            ['`stored_as_scd_type=1`', '`stored_as_scd_type=2`', '`apply_as_truncates`', '`ignore_null_updates=True`'],
            1,
            'Con **SCD tipo 2** ogni versione è una riga con `__START_AT` e `__END_AT`.',
            1,
          ),
        ],
      },
      {
        id: 'dep-structured-streaming',
        title: 'Structured Streaming con stato',
        minutes: 10,
        body: l05,
        keyPoints: [
          'Checkpoint: offset e stato; un checkpoint per query; exactly-once con sorgenti riproducibili e sink Delta.',
          'Watermark: limita lo stato e il ritardo accettato.',
          'Output mode append, update, complete.',
          'foreachBatch + MERGE per upsert; rendere idempotente il batch.',
        ],
        quickCheck: [
          q(
            'qc-dep-ss-1',
            V,
            'Un\'aggregazione in streaming per finestre di 5 minuti consuma sempre più memoria nel tempo. Cosa manca?',
            ['Un trigger availableNow', 'Un watermark sulla colonna temporale', 'La modalità complete', 'Un secondo checkpoint'],
            1,
            'Senza **watermark** lo stato delle finestre non viene mai eliminato e cresce senza limiti.',
          ),
          q(
            'qc-dep-ss-2',
            V,
            'Devi aggiornare una tabella Delta con un MERGE per ogni micro-batch di uno stream. Cosa usi?',
            ['`outputMode("update")` con `toTable`', '`foreachBatch` con una funzione che esegue il MERGE', '`trigger(continuous=...)`', '`dropDuplicates` senza watermark'],
            1,
            '`foreachBatch` passa ogni micro-batch come DataFrame batch, su cui si può eseguire `MERGE` con DeltaTable.',
          ),
        ],
      },
      {
        id: 'dep-jobs-avanzati',
        title: 'Lakeflow Jobs avanzati',
        minutes: 9,
        body: l06,
        keyPoints: [
          'Job da interfaccia, REST API, CLI, SDK o bundle (consigliato per la CI/CD).',
          'If/else e For each (con concorrenza e inputs da task value).',
          'Serverless: ambienti e modalità di prestazioni (performance optimized o standard).',
          'Disattivare i retry su task non idempotenti.',
        ],
        quickCheck: [
          q(
            'qc-dep-jobs-1',
            V,
            'Un task invia email ai clienti e un retry automatico ha inviato messaggi doppi. Cosa fai?',
            ['Aumenti i retry', 'Disattivi i retry automatici su quel task o lo rendi idempotente', 'Usi un trigger continuous', 'Aumenti la concorrenza'],
            1,
            'I retry sono sicuri solo per task **idempotenti**; per azioni con effetti esterni si disattivano o si aggiunge un controllo.',
          ),
          q(
            'qc-dep-jobs-2',
            V,
            'Un job batch notturno su serverless non è urgente e deve costare il meno possibile. Quale modalità di prestazioni scegli?',
            ['Performance optimized', 'Standard', 'Continuous', 'Development'],
            1,
            'La modalità **standard** del serverless riduce il costo a fronte di tempi di avvio più lunghi: adatta a job non sensibili alla latenza.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-auto-cdc-scd2', title: 'CDC dei clienti con SCD tipo 1 e 2', kind: 'codice', language: 'python', difficulty: 3, minutes: 30, hints: ['Prima si crea la streaming table di destinazione.', 'Quale parametro gestisce l\'ordine degli eventi?', 'Si può limitare lo storico a una sola colonna.'] }, exCdc),
    ],
  },
  {
    id: 'dep-ingestione',
    domainId: I,
    title: 'Ingestione e acquisizione',
    summary: 'Formati e code di messaggi, CDC con Lakeflow Connect, OpenSharing, Clean Rooms e Lakehouse Federation.',
    lessons: [
      {
        id: 'dep-ingestione-sorgenti',
        title: 'Sorgenti, formati e CDC',
        minutes: 9,
        body: l08,
        keyPoints: [
          'Kafka: key e value binari, cast a stringa e from_json o parse_json.',
          'Conservare il grezzo in bronze, fare il parsing in silver.',
          'Lakeflow Connect: gateway + pipeline di ingestione per SQL Server, MySQL, PostgreSQL.',
          'AUTO CDC applica feed di modifiche verso Delta o Iceberg.',
        ],
        quickCheck: [
          q(
            'qc-dep-ing-1',
            I,
            'Leggendo da Kafka con Structured Streaming, in che formato arriva la colonna `value`?',
            ['Stringa JSON', 'Binario', 'Struct già tipizzata', 'VARIANT'],
            1,
            'Kafka restituisce `key` e `value` come **binario**: vanno convertiti con `cast("string")` e interpretati con `from_json` o `parse_json`.',
            1,
          ),
          q(
            'qc-dep-ing-2',
            I,
            'Devi replicare in Unity Catalog le modifiche di un database PostgreSQL con il minimo codice. Cosa usi?',
            ['Lakehouse Federation', 'Il connettore gestito PostgreSQL di Lakeflow Connect', 'COPY INTO', 'OpenSharing'],
            1,
            'Il connettore **Lakeflow Connect** per PostgreSQL acquisisce le modifiche (replica logica) e le applica a streaming table. La federazione interroga i dati senza copiarli.',
          ),
        ],
      },
      {
        id: 'dep-condivisione',
        title: 'OpenSharing, Clean Rooms e Federation',
        minutes: 9,
        body: l09,
        keyPoints: [
          'OpenSharing (Delta Sharing): share e recipient, D2D o aperta, senza copie.',
          'WITH HISTORY consente al destinatario time travel e CDF.',
          'Clean Room: collaborazione senza accesso ai dati grezzi altrui.',
          'Federation: connection + foreign catalog, credenziali nella connessione, governance UC.',
        ],
        quickCheck: [
          q(
            'qc-dep-share-1',
            I,
            'Un partner che usa Databricks con Unity Catalog in un altro cloud deve leggere alcune tabelle sempre aggiornate senza copie. Cosa usi?',
            ['Export giornaliero in CSV', 'OpenSharing Databricks-to-Databricks', 'Lakehouse Federation', 'Una Clean Room'],
            1,
            'La condivisione **Databricks-to-Databricks** fornisce accesso in sola lettura ai dati aggiornati, anche tra cloud e regioni.',
            1,
          ),
          q(
            'qc-dep-share-2',
            I,
            'Gli analisti devono interrogare occasionalmente un database MySQL operativo, senza creare pipeline e con i permessi di Unity Catalog. Cosa configuri?',
            ['Una share', 'Una connection e un foreign catalog (Lakehouse Federation)', 'Una Clean Room', 'Un volume esterno'],
            1,
            '**Lakehouse Federation** espone il database come foreign catalog governato da UC; le credenziali restano nella connessione.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-kafka-bronze-silver', title: 'Pagamenti da Kafka a silver', kind: 'codice', language: 'pyspark', difficulty: 3, minutes: 30, hints: ['Il valore del messaggio è binario.', 'Ogni stream ha il suo checkpoint.', 'Per deduplicare con stato limitato serve un watermark.'] }, exKafka),
    ],
  },
  {
    id: 'dep-manipolazione',
    domainId: M,
    title: 'Manipolazione dei dati',
    summary: 'Funzioni finestra e join avanzati, tipo VARIANT, funzioni AI e qualità con expectations e quarantena.',
    lessons: [
      {
        id: 'dep-trasformazioni-avanzate',
        title: 'Finestre, VARIANT e funzioni AI',
        minutes: 10,
        body: l10,
        keyPoints: [
          'row_number/rank/dense_rank, lag/lead, cornici ROWS BETWEEN; QUALIFY.',
          'VARIANT: parse_json, notazione col:campo::tipo, variant_get, try_variant_get.',
          'AI functions: ai_classify, ai_extract, ai_analyze_sentiment, ai_query per qualsiasi endpoint.',
          'Applicare le funzioni AI solo alle righe nuove per controllare i costi.',
        ],
        quickCheck: [
          q(
            'qc-dep-var-1',
            M,
            'Quale funzione estrae un campo da un VARIANT restituendo NULL invece di un errore se la conversione di tipo fallisce?',
            ['`variant_get`', '`try_variant_get`', '`parse_json`', '`from_json`'],
            1,
            '`try_variant_get` restituisce **NULL** se il cast non riesce; `variant_get` genera un errore.',
          ),
          q(
            'qc-dep-var-2',
            M,
            'Vuoi i tre ordini più recenti di ogni cliente in una sola query. Quale combinazione usi?',
            ['`GROUP BY` e `MAX`', '`row_number()` su una finestra per cliente ordinata per data decrescente, con `QUALIFY rn <= 3`', '`LIMIT 3`', '`DISTINCT`'],
            1,
            'La funzione finestra numera gli ordini per cliente e `QUALIFY` filtra il risultato.',
            1,
          ),
        ],
      },
      {
        id: 'dep-qualita',
        title: 'Expectations e quarantena',
        minutes: 8,
        body: l11,
        keyPoints: [
          'expect (warn), expect_or_drop, expect_or_fail; versioni expect_all_*.',
          'Quarantena: tabella con la condizione negata per conservare i record non validi.',
          'Fail per problemi gravi a monte; drop per record inutilizzabili.',
          'Metriche nella pagina della pipeline e nell\'event log (flow_progress).',
        ],
        quickCheck: [
          q(
            'qc-dep-qual-1',
            M,
            'I record non validi devono essere esclusi dal silver ma conservati per correggerli. Cosa implementi?',
            ['`expect_or_fail`', 'Una quarantena: `expect_all_or_drop` sul silver e una tabella con la condizione negata', '`expect` senza azione', 'Un VACUUM'],
            1,
            'Lo schema di **quarantena** usa regole complementari: le righe valide vanno nel silver, quelle non valide in una tabella dedicata.',
          ),
          q(
            'qc-dep-qual-2',
            M,
            'Una chiave primaria arriva improvvisamente duplicata in massa, segno di un problema grave a monte. Quale azione è più appropriata?',
            ['Warn', 'Drop', 'Fail', 'Nessuna'],
            2,
            '**Fail** ferma l\'aggiornamento ed evita di propagare dati sbagliati a valle quando l\'anomalia indica un problema serio.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-variant-ai', title: 'Recensioni: VARIANT e funzioni AI', kind: 'codice', language: 'sparksql', difficulty: 2, minutes: 25, hints: ['Per i percorsi nel VARIANT si usa il carattere due punti.', 'Una funzione restituisce NULL se il cast fallisce.', 'Quale tipo di dataset elabora ogni riga una sola volta?'] }, exVariant),
    ],
  },
  {
    id: 'dep-monitoraggio',
    domainId: A,
    title: 'Monitoraggio e alert',
    summary: 'System tables, event log delle pipeline, alert su costi, qualità, query e sicurezza, API, CLI e SDK.',
    lessons: [
      {
        id: 'dep-system-tables',
        title: 'System tables ed event log',
        minutes: 9,
        body: l12,
        keyPoints: [
          'billing.usage + list_prices per i costi; access.audit per l\'audit; lakeflow.* per i job.',
          'custom_tags per attribuire i costi a team e progetti.',
          'event_log() per avanzamento, qualità e piano di aggiornamento delle pipeline.',
        ],
        quickCheck: [
          q(
            'qc-dep-sys-1',
            A,
            'Quale system table usi per sapere chi ha modificato i permessi di uno schema la settimana scorsa?',
            ['`system.billing.usage`', '`system.access.audit`', '`system.lakeflow.jobs`', '`system.compute.clusters`'],
            1,
            '`system.access.audit` registra le azioni degli utenti, comprese le modifiche ai permessi.',
            1,
          ),
          q(
            'qc-dep-sys-2',
            A,
            'Dove trovi il numero di righe scartate da ogni expectation di una pipeline dichiarativa?',
            ['In `system.billing.usage`', 'Nell\'event log della pipeline, eventi `flow_progress`', 'Nella Spark UI', 'In `DESCRIBE HISTORY`'],
            1,
            'L\'**event log** contiene negli eventi `flow_progress` le metriche di qualità per expectation.',
          ),
        ],
      },
      {
        id: 'dep-alert-api',
        title: 'Alert, API, CLI e SDK',
        minutes: 8,
        body: l13,
        keyPoints: [
          'Alert SQL: query pianificata + condizione + destinazioni di notifica.',
          'Segnali: metriche, qualità e anomalie, costi, query, audit, agenti AI, job.',
          'Jobs API, CLI e SDK per monitoraggio automatizzato e integrazioni.',
        ],
        quickCheck: [
          q(
            'qc-dep-alert-1',
            A,
            'Vuoi essere avvisato quando una tabella gold non viene aggiornata da più di 6 ore, senza scrivere regole per ogni tabella. Cosa usi?',
            ['Un alert per ogni tabella su DESCRIBE HISTORY', 'Il monitoraggio della qualità dei dati (freschezza e completezza) di Unity Catalog', 'La Spark UI', 'Un retry sul job'],
            1,
            'Il **monitoraggio della qualità dei dati** controlla automaticamente freschezza e completezza delle tabelle di uno schema.',
          ),
          q(
            'qc-dep-alert-2',
            A,
            'Uno strumento esterno di osservabilità deve leggere stato e durata degli ultimi run di un job. Cosa usa?',
            ['Le Jobs API (`runs/list`, `runs/get`) o l\'SDK', 'Catalog Explorer', 'Il query profile', 'Un volume'],
            0,
            'Le **Jobs API** (anche tramite CLI e SDK) espongono stato, durate e dettagli di run e task.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-costi-system-tables', title: 'Costi e fallimenti con le system tables', kind: 'codice', language: 'sparksql', difficulty: 2, minutes: 25, hints: ['I prezzi hanno un periodo di validità.', 'I tag personalizzati sono in una mappa.', 'Lo stato finale dei run è in result_state.'] }, exCosti),
    ],
  },
  {
    id: 'dep-ottimizzazione',
    domainId: O,
    title: 'Ottimizzazione di costi e prestazioni',
    summary: 'Tabelle gestite e Predictive Optimization, Liquid Clustering, deletion vectors, disk cache, Change Data Feed e query profile.',
    lessons: [
      {
        id: 'dep-layout',
        title: 'Layout dei dati e caching',
        minutes: 10,
        body: l14,
        keyPoints: [
          'Tabelle gestite + Predictive Optimization: meno manutenzione manuale.',
          'Liquid Clustering per le tabelle nuove; partizionamento solo per bassa cardinalità e tabelle enormi.',
          'Deletion vectors: DELETE/UPDATE/MERGE senza riscrivere i file.',
          'Disk cache su SSD locali per letture ripetute.',
        ],
        quickCheck: [
          q(
            'qc-dep-layout-1',
            O,
            'Un MERGE orario modifica poche righe sparse ma riscrive decine di GB di file. Cosa abiliti?',
            ['Il partizionamento per data', 'I deletion vectors', 'Il CDF', 'La disk cache'],
            1,
            'Con i **deletion vectors** le righe modificate vengono marcate invece di riscrivere interi file Parquet.',
          ),
          q(
            'qc-dep-layout-2',
            O,
            'Quale affermazione sul Liquid Clustering è corretta?',
            ['Si può combinare con ZORDER sulla stessa tabella', 'Le chiavi di clustering si possono cambiare senza riscrivere subito tutti i dati', 'Richiede colonne a bassa cardinalità', 'Crea una cartella per ogni valore'],
            1,
            'Con il **Liquid Clustering** le chiavi si cambiano con `ALTER TABLE ... CLUSTER BY`; non si combina con partizionamento o ZORDER.',
          ),
        ],
      },
      {
        id: 'dep-cdf-profile',
        title: 'Change Data Feed e query profile',
        minutes: 9,
        body: l15,
        keyPoints: [
          'CDF: delta.enableChangeDataFeed; table_changes() o readChangeFeed.',
          '_change_type: insert, update_preimage, update_postimage, delete.',
          'Query profile: file potati, tipo di join, shuffle, spill, operatore più costoso.',
        ],
        quickCheck: [
          q(
            'qc-dep-cdf-1',
            O,
            'Un job rilegge ogni notte una tabella di 3 TB per trovare le righe modificate. Quale funzionalità riduce il lavoro?',
            ['Time travel', 'Change Data Feed', 'VACUUM', 'Disk cache'],
            1,
            'Il **CDF** espone solo le righe inserite, aggiornate o eliminate tra versioni.',
            1,
          ),
          q(
            'qc-dep-cdf-2',
            O,
            'Nel query profile vedi che una query filtrata per data legge tutti i 15.000 file della tabella. Cosa indica?',
            ['Il join è broadcast', 'Il data skipping non funziona per quel filtro: il layout non è organizzato sulla data', 'La cache è piena', 'Il warehouse è troppo grande'],
            1,
            'Zero file potati significa che le statistiche min/max non permettono di saltare file: serve **clustering** sulla colonna filtrata.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-layout-tabelle', title: 'Rivedi il layout di quattro tabelle', kind: 'scenario', difficulty: 3, minutes: 25, hints: ['Quanti valori distinti ha la colonna di partizione?', 'Cosa evita di riscrivere file interi per poche modifiche?', 'Come si leggono solo le righe cambiate?', 'Chi può fare la manutenzione al posto tuo?'] }, exLayout),
    ],
  },
  {
    id: 'dep-sicurezza',
    domainId: S,
    title: 'Sicurezza dei dati e conformità',
    summary: 'Minimo privilegio, tag governati e ABAC, anonimizzazione e pseudonimizzazione, pipeline per i dati personali e cancellazione GDPR.',
    lessons: [
      {
        id: 'dep-sicurezza-privacy',
        title: 'Minimo privilegio, ABAC e protezione dei dati personali',
        minutes: 10,
        body: l16,
        keyPoints: [
          'Gruppi, service principal, ownership a gruppi, permessi su risorse del workspace.',
          'Tag governati + policy ABAC per filtri e maschere su larga scala.',
          'Hashing, tokenizzazione, soppressione, generalizzazione.',
          'Pseudonimizzato = ancora dato personale; anonimizzato no.',
        ],
        quickCheck: [
          q(
            'qc-dep-sec-1',
            S,
            'Due dataset devono poter essere uniti per cliente senza esporre l\'email in chiaro. Quale tecnica usi?',
            ['Soppressione', 'Hashing con sale della colonna email', 'Generalizzazione', 'Row filter'],
            1,
            'L\'**hashing con sale** produce lo stesso valore per la stessa email, consentendo join coerenti senza esporre il dato.',
          ),
          q(
            'qc-dep-sec-2',
            S,
            'Quale affermazione sui dati pseudonimizzati è corretta secondo il GDPR?',
            ['Non sono più dati personali', 'Restano dati personali, perché con informazioni aggiuntive si può risalire alla persona', 'Possono essere conservati senza limiti', 'Non richiedono controlli di accesso'],
            1,
            'I dati **pseudonimizzati** restano dati personali; solo i dati realmente **anonimizzati** escono dall\'ambito del GDPR.',
          ),
        ],
      },
      {
        id: 'dep-cancellazione-gdpr',
        title: 'Conservazione e diritto alla cancellazione',
        minutes: 9,
        body: l17,
        keyPoints: [
          'DELETE da solo non basta: time travel, deletion vectors e CDF conservano i dati.',
          'Procedura: DELETE in tutti gli strati, REORG ... APPLY (PURGE), VACUUM.',
          'Conservazione predefinita 7 giorni: compatibile con le scadenze legali?',
          'Pseudonimizzazione con mappatura separata semplifica le cancellazioni.',
        ],
        quickCheck: [
          q(
            'qc-dep-gdpr-1',
            S,
            'Dopo un `DELETE` su una tabella con deletion vectors, quale comando rimuove fisicamente le righe dai file prima del `VACUUM`?',
            ['`OPTIMIZE ... ZORDER BY`', '`REORG TABLE ... APPLY (PURGE)`', '`RESTORE TABLE`', '`ANALYZE TABLE`'],
            1,
            '`REORG TABLE ... APPLY (PURGE)` riscrive i file eliminando le righe marcate; poi `VACUUM` elimina i vecchi file.',
          ),
          q(
            'qc-dep-gdpr-2',
            S,
            'Dopo un `DELETE` i dati di un cliente sono ancora leggibili con `VERSION AS OF`. Perché?',
            ['Il DELETE è fallito', 'Le versioni precedenti restano finché VACUUM non elimina i file', 'Il CDF è disattivato', 'La tabella è esterna'],
            1,
            'Il **time travel** legge i file delle versioni precedenti, che restano fino al `VACUUM` dopo la soglia di conservazione.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-gdpr-cancellazione', title: 'Gestisci una richiesta di cancellazione', kind: 'codice', language: 'sparksql', difficulty: 3, minutes: 25, hints: ['Dove restano i dati dopo un DELETE?', 'Le materialized view vanno aggiornate.', 'Calcola i tempi con la conservazione predefinita.'] }, exGdpr),
    ],
  },
  {
    id: 'dep-governance',
    domainId: G,
    title: 'Governance dei dati',
    summary: 'Commenti e tag per la ricerca, information_schema, ereditarietà dei permessi e progettazione della gerarchia.',
    lessons: [
      {
        id: 'dep-metadati',
        title: 'Metadati ed ereditarietà dei permessi',
        minutes: 8,
        body: l18,
        keyPoints: [
          'COMMENT e SET TAGS su catalog, schema, tabelle e colonne; interrogabili in information_schema.',
          'I privilegi si ereditano sugli oggetti presenti e futuri.',
          'Senza DENY, un privilegio ereditato non si toglie a un livello inferiore.',
          'BROWSE per scoprire, MANAGE per gestire i permessi.',
        ],
        quickCheck: [
          q(
            'qc-dep-gov-1',
            G,
            'Un gruppo ha `SELECT` sul catalog `prod` ma non deve leggere lo schema `prod.hr`. Cosa fai?',
            ['`DENY SELECT ON SCHEMA prod.hr`', 'Revochi il privilegio sul catalog e lo concedi solo sugli schemi necessari', 'Nascondi lo schema', 'Aggiungi un commento'],
            1,
            'Unity Catalog non ha **DENY**: un privilegio ereditato dal catalog vale per tutti gli schemi, quindi va concesso a livello più basso.',
          ),
          q(
            'qc-dep-gov-2',
            G,
            'Quale privilegio permette ai dipendenti di vedere i metadati di un catalog in Catalog Explorer senza leggere i dati?',
            ['`SELECT`', '`BROWSE`', '`USE SCHEMA`', '`MODIFY`'],
            1,
            '`BROWSE` consente di scoprire gli oggetti e i loro metadati, e di richiedere l\'accesso, senza leggerne il contenuto.',
            1,
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-gerarchia-permessi', title: 'Gerarchia e permessi del dominio Vendite', kind: 'scenario', difficulty: 2, minutes: 25, hints: ['A che livello dare SELECT agli analisti per escludere bronze e silver?', 'Come limiti un catalog a un solo workspace?', 'Chi deve essere proprietario degli oggetti di produzione?'] }, exGerarchia),
    ],
  },
  {
    id: 'dep-debug',
    domainId: D,
    title: 'Debugging e deploy',
    summary: 'Spark UI, log, system tables e query profile; repair run con override dei parametri; bundle e Git folders nella CI/CD.',
    lessons: [
      {
        id: 'dep-debug-deploy',
        title: 'Diagnosi, riparazione e distribuzione',
        minutes: 10,
        body: l19,
        keyPoints: [
          'Primo task fallito, stack trace, classificazione: dati, codice, ambiente, transitorio.',
          'Repair run con override dei parametri e rerun di task specifici.',
          'Bundle: run_as service principal, permissions, deploy idempotente.',
          'CI/CD con Git folders, test e autenticazione OAuth di un service principal.',
        ],
        quickCheck: [
          q(
            'qc-dep-debug-1',
            D,
            'I log di un job cluster non sono più disponibili dopo la fine del job. Come li conservi per le analisi future?',
            ['Usando un all-purpose cluster', 'Configurando la consegna dei log del cluster in un volume o percorso di storage', 'Aumentando i retry', 'Abilitando Photon'],
            1,
            'La **cluster log delivery** copia i log di driver, executor e script di init in una destinazione persistente.',
          ),
          q(
            'qc-dep-debug-2',
            D,
            'Nel bundle, come fai in modo che i job di produzione girino con un\'identità non personale?',
            ['Con `mode: development`', 'Con `run_as` e un `service_principal_name` nel target prod', 'Con un parametro del job', 'Con un tag'],
            1,
            '`run_as` definisce l\'identità di esecuzione; in produzione si usa un **service principal**.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-job-fallito', title: 'Ripara un job di produzione', kind: 'scenario', difficulty: 2, minutes: 20, hints: ['Il messaggio di errore riguarda lo schema: è un errore transitorio?', 'Come si evita di ripetere i caricamenti riusciti?', 'Durante la riparazione si possono cambiare i parametri.'] }, exFallito),
    ],
  },
  {
    id: 'dep-modellazione',
    domainId: DM,
    title: 'Modellazione dei dati',
    summary: 'Layout Delta e Iceberg scalabili, modelli dimensionali, materialized view e metric view di Unity Catalog.',
    lessons: [
      {
        id: 'dep-modellazione-lezione',
        title: 'Layout, modelli dimensionali e metric view',
        minutes: 10,
        body: l20,
        keyPoints: [
          'Partizionare solo per granularità grossolana; clustering sui filtri; file di dimensione equilibrata.',
          'Schema a stella con IDENTITY e vincoli informativi (RELY).',
          'Materialized view per aggregazioni precalcolate.',
          'Metric view: misure governate e riutilizzabili, anche non additive, interrogate con MEASURE().',
        ],
        quickCheck: [
          q(
            'qc-dep-mod-1',
            DM,
            'Più team calcolano il "valore medio ordine" in modo diverso. Quale oggetto di Unity Catalog centralizza la definizione?',
            ['Una materialized view', 'Una metric view', 'Una tabella temporanea', 'Un volume'],
            1,
            'La **metric view** definisce una volta misure e dimensioni governate, riusate da dashboard, Genie e SQL con `MEASURE()`.',
            1,
          ),
          q(
            'qc-dep-mod-2',
            DM,
            'Una tabella di 60 TB viene filtrata per giorno e per cliente (2 milioni di clienti). Quale layout scegli?',
            ['Partizionamento per cliente', 'Liquid Clustering su data e cliente', 'Nessun layout', 'ZORDER per cliente e partizionamento per cliente'],
            1,
            'Partizionare per una colonna ad alta cardinalità genera file minuscoli; il **Liquid Clustering** gestisce bene più colonne di filtro.',
          ),
        ],
      },
    ],
    exercises: [
      exercise({ id: 'dep-metric-view', title: 'Metriche governate e dashboard veloci', kind: 'codice', language: 'sparksql', difficulty: 3, minutes: 30, hints: ['Il margine percentuale non è additivo.', 'Le misure si interrogano con MEASURE().', 'Per la lentezza serve un risultato precalcolato.'] }, exMetric),
    ],
  },
];
