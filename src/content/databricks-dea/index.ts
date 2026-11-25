import type { Certification } from '../../types';
import { modules } from './modules';
import { questions } from './questions';

export const databricksDea: Certification = {
  id: 'databricks-de-associate',
  code: 'DE Associate',
  title: 'Databricks Certified Data Engineer Associate',
  vendor: 'Databricks',
  level: 'Associate',
  description:
    'Costruisci pipeline ETL sulla Data Intelligence Platform: ingestione con Auto Loader e Lakeflow Connect, trasformazioni in PySpark e SQL, Lakeflow Jobs, CI/CD con i bundle e governance con Unity Catalog.',
  accent: '#a2462c',
  accentDark: '#e8a58c',
  exam: {
    durationMinutes: 90,
    passingScore: 700,
    maxScore: 1000,
    simulationQuestions: 45,
    notes: [
      "L'esame reale ha 45 domande valutate a risposta multipla in 90 minuti (possono esserci domande aggiuntive non valutate). Non sono ammessi materiali di consultazione.",
      'Il codice delle domande è in PySpark e SQL.',
      'La guida ufficiale (versione del 4 maggio 2026) non pubblica il peso dei domini: i pesi indicati qui sono stimati in base al numero di obiettivi di ciascuna sezione.',
      'Databricks non indica una soglia ufficiale nella guida: la soglia di 700/1000 della simulazione è solo un riferimento per allenarsi.',
      "Controlla la pagina ufficiale prima di prenotare: Databricks aggiorna le guide d'esame con una certa frequenza.",
    ],
  },
  domains: [
    {
      id: 'piattaforma',
      title: 'Databricks Intelligence Platform',
      weight: '≈ 6%',
      description: 'Componenti principali della piattaforma e scelta del compute.',
      skills: [
        "Descrivere i componenti principali: architettura, Delta Lake e Unity Catalog",
        'Conoscere caratteristiche, limiti e modelli di costo dei servizi di compute e scegliere il più adatto a ogni carico',
      ],
    },
    {
      id: 'ingestione',
      title: 'Ingestione e caricamento dei dati',
      weight: '≈ 21%',
      description: 'Pattern batch, streaming e incrementali con COPY INTO, Auto Loader, Lakeflow Connect, JDBC e API.',
      skills: [
        'Applicare pattern di ingestione batch, streaming e incrementali, da file locali e con i connettori di Lakeflow Connect',
        'Caricare file in modo incrementale dallo storage cloud con COPY INTO',
        "Usare Auto Loader con schema enforcement ed evoluzione, in modalità directory listing o file notification",
        'Configurare Lakeflow Connect per acquisire dati da sorgenti aziendali in tabelle di Unity Catalog',
        'Usare client JDBC/ODBC o REST nei notebook, orchestrati con Lakeflow Jobs',
        'Scegliere il metodo di ingestione in base a volume, frequenza, tipi di dati e governance',
        'Acquisire dati semi-strutturati e non strutturati (JSON annidato e simili) in tabelle Delta di Unity Catalog',
      ],
    },
    {
      id: 'trasformazione',
      title: 'Trasformazione e modellazione dei dati',
      weight: '≈ 21%',
      description: 'Pulizia e combinazione dei dati in PySpark e SQL, tuning di base, oggetti gold e qualità.',
      skills: [
        'Pulire i dati bronze (valori nulli, tipi) e scrivere tabelle silver con PySpark o SQL',
        'Combinare DataFrame: inner, left, broadcast, chiavi multiple, cross join, union e union all',
        'Manipolare colonne, righe e tabelle: aggiungere, eliminare, dividere, rinominare, filtrare, esplodere array',
        'Deduplicare e aggregare (conteggi, conteggio distinto approssimato, medie, statistiche di sintesi)',
        'Usare i parametri di tuning di base di Spark e misurare di nuovo le prestazioni',
        'Creare oggetti gold in Unity Catalog: materialized view, viste, streaming table e tabelle per la BI',
        'Implementare controlli di qualità e regole di validazione per i dati silver e gold',
      ],
    },
    {
      id: 'jobs',
      title: 'Lavorare con Lakeflow Jobs',
      weight: '≈ 12%',
      description: 'Task, dipendenze, flussi di controllo e trigger dei job.',
      skills: [
        'Configurare flussi di controllo: retry, task condizionali, diramazioni e cicli',
        'Configurare i task più comuni (notebook, query SQL, dashboard, pipeline) e le dipendenze nel DAG',
        'Pianificare i job con trigger temporali, di arrivo file e di aggiornamento tabella',
        'Scegliere tra trigger basati sul tempo e sui dati in base a disponibilità dei dati e dipendenze',
      ],
    },
    {
      id: 'cicd',
      title: 'Implementare la CI/CD',
      weight: '≈ 12%',
      description: 'Git folders, Declarative Automation Bundles e Databricks CLI.',
      skills: [
        'Lavorare con branch, commit, push e pull request nei Git folders (già Repos)',
        'Usare variabili e override dei bundle per promuovere lo stesso codice tra dev, test e prod',
        'Distribuire Declarative Automation Bundles (già Databricks Asset Bundles) con job, pipeline e altri asset',
        'Usare la Databricks CLI per validare, distribuire e gestire i bundle nella CI/CD',
      ],
    },
    {
      id: 'monitoraggio',
      title: 'Troubleshooting, monitoraggio e ottimizzazione',
      weight: '≈ 15%',
      description: 'Run dei job, Spark UI, layout dei dati e problemi del compute.',
      skills: [
        'Analizzare le tendenze delle prestazioni dei job rispetto a una baseline',
        "Usare l'interfaccia di Lakeflow Jobs: stati, grafo dei task, durate e tassi di errore",
        'Individuare colli di bottiglia (skew, shuffle, spill) con le metriche degli stage nella Spark UI',
        'Usare Liquid Clustering e Predictive Optimization',
        'Diagnosticare errori di avvio del cluster, conflitti di librerie e problemi di memoria',
      ],
    },
    {
      id: 'governance',
      title: 'Governance e sicurezza',
      weight: '≈ 13%',
      description: 'Tabelle gestite ed esterne, permessi, filtri di riga, maschere di colonna e ABAC.',
      skills: [
        'Creare, modificare, eliminare e convertire tabelle gestite ed esterne in Unity Catalog',
        'Gestire i controlli di accesso con interfaccia e SQL (GRANT, REVOKE) per utenti, gruppi e service principal',
        'Applicare maschere di colonna e sicurezza a livello di riga per gruppo',
        'Usare le policy ABAC di Unity Catalog per filtri di riga e maschere di colonna',
      ],
    },
  ],
  modules,
  questions,
  resources: [
    {
      title: 'Pagina ufficiale della certificazione Data Engineer Associate',
      url: 'https://www.databricks.com/learn/certification/data-engineer-associate',
    },
    {
      title: "Guida d'esame ufficiale (versione del 4 maggio 2026, PDF)",
      url: 'https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide.pdf',
    },
    {
      title: 'Documentazione di Databricks',
      url: 'https://docs.databricks.com/',
    },
  ],
};
