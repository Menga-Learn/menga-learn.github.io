import type { Certification } from '../../types';
import { modules } from './modules';
import { questions } from './questions';

export const dp600: Certification = {
  id: 'dp-600',
  code: 'DP-600',
  title: 'Associato Ingegnere di Analisi dei Dati in Fabric',
  vendor: 'Microsoft',
  level: 'Associate',
  description:
    "Progetta, crea e distribuisci soluzioni di analisi dei dati su scala enterprise con Microsoft Fabric: lakehouse, warehouse, trasformazioni, modelli semantici e governance.",
  accent: '#0f766e',
  exam: {
    durationMinutes: 100,
    passingScore: 700,
    maxScore: 1000,
    simulationQuestions: 40,
    notes: [
      "L'esame reale dura circa 100 minuti e può includere casi di studio e domande a risposta multipla o di ordinamento.",
      'Il punteggio minimo per superarlo è 700 su 1000.',
      "Controlla sempre la pagina ufficiale: l'elenco delle competenze viene aggiornato periodicamente.",
    ],
  },
  domains: [
    {
      id: 'manutenzione',
      title: 'Gestire una soluzione di analisi dei dati',
      weight: '25–30%',
      description: 'Sicurezza, governance e ciclo di vita dello sviluppo degli item di analisi.',
      skills: [
        'Implementare i controlli di accesso a livello di workspace e di item',
        'Implementare la sicurezza a livello di riga, colonna, oggetto e file',
        'Implementare il mascheramento dinamico dei dati',
        'Applicare etichette di riservatezza agli item',
        'Approvare (promuovere e certificare) gli item',
        'Configurare il controllo di versione di un workspace',
        'Creare e gestire un progetto di Power BI Desktop (.pbip)',
        'Creare e configurare le pipeline di distribuzione',
        "Eseguire l'analisi d'impatto degli item a valle",
        "Distribuire e gestire modelli semantici tramite l'endpoint XMLA",
        'Creare e aggiornare asset riutilizzabili: file .pbit, .pbids e modelli semantici condivisi',
        'Creare e gestire progetti di database',
      ],
    },
    {
      id: 'preparazione',
      title: 'Preparare i dati',
      weight: '45–50%',
      description: 'Acquisire, trasformare, interrogare e analizzare i dati con lakehouse, warehouse ed eventhouse.',
      skills: [
        'Creare una connessione ai dati',
        'Individuare i dati con il catalogo OneLake e il Real-Time hub',
        'Acquisire o accedere ai dati: shortcut, mirroring, pipeline, Dataflow Gen2, notebook',
        "Scegliere tra lakehouse, warehouse ed eventhouse",
        "Implementare l'integrazione con OneLake per eventhouse e modelli semantici",
        'Creare viste, funzioni e stored procedure',
        'Arricchire i dati aggiungendo nuove colonne o tabelle',
        'Implementare uno schema a stella per lakehouse o warehouse',
        'Denormalizzare e aggregare i dati',
        'Unire i dati (merge e join)',
        'Gestire duplicati, dati mancanti e valori null',
        'Convertire i tipi di dati e filtrare i dati',
        "Selezionare, filtrare e aggregare i dati con l'editor di query visivo, SQL, KQL e DAX",
      ],
    },
    {
      id: 'modelli',
      title: 'Implementare e gestire modelli semantici',
      weight: '25–30%',
      description: 'Progettare, costruire e ottimizzare modelli semantici di livello enterprise.',
      skills: [
        'Scegliere una modalità di archiviazione, incluso Direct Lake',
        'Implementare uno schema a stella in un modello semantico',
        'Implementare relazioni, tabelle bridge e relazioni molti-a-molti',
        'Scrivere calcoli DAX con variabili, iteratori, filtri di tabella, funzioni finestra e funzioni informative',
        'Implementare gruppi di calcolo, stringhe di formato dinamiche e parametri di campo',
        'Configurare il formato di archiviazione per modelli di grandi dimensioni',
        'Progettare e costruire modelli compositi',
        'Migliorare le prestazioni di query e visual con Performance Analyzer e la vista query DAX',
        "Configurare l'aggiornamento incrementale",
        'Gestire il comportamento predefinito e di aggiornamento di Direct Lake',
        "Scegliere tra Direct Lake su OneLake e Direct Lake sull'endpoint SQL",
      ],
    },
  ],
  modules,
  questions,
  resources: [
    {
      title: 'Pagina ufficiale della certificazione Fabric Analytics Engineer Associate',
      url: 'https://learn.microsoft.com/credentials/certifications/fabric-analytics-engineer-associate/',
    },
    {
      title: "Guida di studio per l'esame DP-600 (elenco delle competenze)",
      url: 'https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-600',
    },
    {
      title: 'Documentazione di Microsoft Fabric',
      url: 'https://learn.microsoft.com/fabric/',
    },
  ],
};
