import type { Certification } from '../../types';
import { modules } from './modules';
import { questions } from './questions';

export const databricksDep: Certification = {
  id: 'databricks-de-professional',
  code: 'DE Professional',
  title: 'Databricks Certified Data Engineer Professional',
  vendor: 'Databricks',
  level: 'Professional',
  description:
    'Progetta pipeline di produzione avanzate su Databricks: streaming con stato, AUTO CDC, test, monitoraggio con system tables, ottimizzazione di costi e prestazioni, sicurezza e conformità GDPR, deploy con i bundle e metric view.',
  accent: '#8a3b3f',
  accentDark: '#e0a0a4',
  exam: {
    durationMinutes: 120,
    passingScore: 700,
    maxScore: 1000,
    simulationQuestions: 60,
    notes: [
      "L'esame reale ha 60 domande valutate a risposta multipla in 120 minuti (possono esserci domande aggiuntive non valutate). Non sono ammessi materiali di consultazione.",
      'Il codice delle domande è in Python e SQL. È consigliato almeno un anno di esperienza pratica.',
      'I domini e i pesi seguono la guida ufficiale pubblicata il 9 ottobre 2026, con il nuovo elenco degli obiettivi.',
      'Databricks non indica una soglia ufficiale nella guida: la soglia di 700/1000 della simulazione è solo un riferimento per allenarsi.',
      "Controlla la pagina ufficiale circa due settimane prima dell'esame: Databricks aggiorna le guide con una certa frequenza.",
    ],
  },
  domains: [
    {
      id: 'sviluppo',
      title: 'Sviluppo di codice per l\'elaborazione dei dati in Python e SQL',
      weight: '23%',
      description: 'Progetti per i bundle, librerie, UDF, pipeline dichiarative, AUTO CDC, Structured Streaming, Lakeflow Jobs e test.',
      skills: [
        'Strutturare progetti Python per i Declarative Automation Bundles (sviluppo modulare, CI/CD)',
        'Risolvere conflitti di dipendenze e installazioni di librerie (PyPI, wheel locali, archivi sorgente) su serverless, pipeline e bundle',
        'Scrivere UDF con Pandas, Python e SQL, incluse le funzioni di Unity Catalog',
        'Costruire pipeline in streaming di produzione con Lakeflow Pipelines e Auto Loader',
        'Creare e automatizzare ETL con Lakeflow Jobs tramite interfaccia, API e CLI',
        'Scegliere tra streaming table e materialized view in base a latenza, costo e aggiornamento',
        'Implementare CDC con le API AUTO CDC (già APPLY CHANGES), incluse SCD tipo 1 e 2',
        'Scegliere tra Spark Structured Streaming e pipeline dichiarative in base ai vincoli operativi',
        'Usare i flussi di controllo di Lakeflow Jobs: condizioni If/Else e cicli For Each',
        'Configurare compute serverless (ambienti, dipendenze, modalità di prestazioni), task ad alta memoria e impostazioni come la disattivazione dei retry',
        'Scrivere unit test e test di integrazione con assertDataFrameEqual, assertSchemaEqual e DataFrame.transform',
        'Applicare la semantica stateful di Structured Streaming: watermark, modalità di output, foreachBatch, checkpoint per il recupero exactly-once',
      ],
    },
    {
      id: 'ingestione',
      title: 'Ingestione e acquisizione dei dati',
      weight: '12%',
      description: 'Formati e sorgenti di streaming, CDC, condivisione, Clean Rooms e federazione.',
      skills: [
        'Acquisire Delta, Parquet, JSON, Iceberg, CSV e file binari da Kafka, Kinesis, Pub/Sub e storage cloud',
        'Costruire pipeline CDC incrementali con Lakeflow Pipelines verso tabelle Delta o Iceberg',
        'Acquisire il CDC da SQL Server, MySQL e PostgreSQL con Lakeflow Connect',
        'Condividere dati con OpenSharing (Databricks-to-Databricks e Databricks-to-Open) e collaborare con le Clean Rooms',
        'Usare Lakehouse Federation con la governance di Unity Catalog e credenziali a livello di connessione',
      ],
    },
    {
      id: 'manipolazione',
      title: 'Manipolazione dei dati',
      weight: '12%',
      description: 'Trasformazioni avanzate, VARIANT, funzioni AI ed expectations.',
      skills: [
        'Applicare trasformazioni avanzate (funzioni finestra, join, aggregazioni) con Spark SQL e PySpark',
        'Gestire dati semi-strutturati con il tipo VARIANT (parse_json, variant_get)',
        'Usare le funzioni AI, incluso ai_query, per arricchimento e classificazione nelle pipeline',
        'Applicare expectations di qualità nelle pipeline: quarantena, scarto o blocco dei record non validi',
      ],
    },
    {
      id: 'monitoraggio',
      title: 'Monitoraggio e alert',
      weight: '10%',
      description: 'System tables, API, event log, alert e interfaccia di Lakeflow Jobs.',
      skills: [
        'Usare le system tables (billing, compute, access, lakeflow) per costi, audit e monitoraggio dei carichi',
        'Monitorare job e pipeline con REST API, CLI e SDK',
        'Usare l\'event log delle pipeline per salute e qualità dei dati',
        'Configurare alert su metriche governate, qualità e anomalie dei dati, costi, salute di warehouse e query, audit e sicurezza, qualità degli agenti AI e diramazioni dei job',
        'Usare l\'interfaccia e le API di Lakeflow Jobs per stato e metriche di prestazione',
      ],
    },
    {
      id: 'ottimizzazione',
      title: 'Ottimizzazione di costi e prestazioni',
      weight: '15%',
      description: 'Tabelle gestite, layout dei dati, deletion vectors, caching, CDF e query profile.',
      skills: [
        'Spiegare come tabelle gestite, Predictive Optimization e Liquid Clustering riducono il lavoro operativo',
        'Scegliere tra deletion vectors, Liquid Clustering e CLUSTER BY AUTO in base al pattern di accesso',
        'Usare la cache su disco (Delta cache) per letture ripetute',
        'Usare il Change Data Feed per elaborare in modo incrementale aggiornamenti ed eliminazioni',
        'Usare il query profile per individuare problemi di data skipping, strategia di join e shuffle',
        'Scegliere tra Liquid Clustering e partizionamento/ZORDER in base a dimensione della tabella e query',
      ],
    },
    {
      id: 'sicurezza',
      title: 'Sicurezza dei dati e conformità',
      weight: '8%',
      description: 'Minimo privilegio, ABAC, anonimizzazione, dati personali e cancellazione.',
      skills: [
        'Applicare il minimo privilegio con ACL sugli oggetti di Unity Catalog e sulle risorse del workspace',
        'Creare policy ABAC con tag governati per filtri di riga e maschere di colonna su larga scala',
        'Applicare anonimizzazione e pseudonimizzazione (hashing, tokenizzazione, soppressione, generalizzazione)',
        'Costruire pipeline conformi che individuano e mascherano i dati personali in batch e streaming',
        'Definire strategie di conservazione e cancellazione (diritto all\'oblio del GDPR) con Delta Lake e Unity Catalog',
      ],
    },
    {
      id: 'governance',
      title: 'Governance dei dati',
      weight: '5%',
      description: 'Metadati per la scoperta ed ereditarietà dei permessi.',
      skills: [
        'Usare tag e commenti di Unity Catalog come metadati per la ricerca e la comprensione dei dati',
        "Applicare l'ereditarietà dei permessi tra catalog, schemi e oggetti",
      ],
    },
    {
      id: 'debug',
      title: 'Debugging e deploy',
      weight: '10%',
      description: 'Diagnosi, riparazione dei job e distribuzione con bundle e Git.',
      skills: [
        'Diagnosticare problemi con Spark UI, log del cluster, system tables e query profile',
        'Analizzare i run falliti e rimediare con repair e override dei parametri',
        'Distribuire risorse con i Declarative Automation Bundles (già DAB)',
        'Implementare CI/CD basata su Git con le Git folders (già Repos)',
      ],
    },
    {
      id: 'modellazione',
      title: 'Modellazione dei dati',
      weight: '5%',
      description: 'Layout fisici scalabili, modelli dimensionali, materialized view e metric view.',
      skills: [
        'Progettare layout Delta/Iceberg scalabili: partizionamento sulla granularità, clustering sui pattern di accesso, file di dimensione equilibrata',
        'Costruire modelli dimensionali con materialized view (aggregazioni precalcolate) e metric view di Unity Catalog (metriche governate e riutilizzabili)',
      ],
    },
  ],
  modules,
  questions,
  resources: [
    {
      title: 'Pagina ufficiale della certificazione Data Engineer Professional',
      url: 'https://www.databricks.com/learn/certification/data-engineer-professional',
    },
    {
      title: "Guida d'esame ufficiale (versione del 9 ottobre 2026, PDF)",
      url: 'https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf',
    },
    {
      title: 'Documentazione di Databricks',
      url: 'https://docs.databricks.com/',
    },
  ],
};
