## Scenario

Un team di quattro sviluppatori lavora su un progetto Fabric con lakehouse, notebook, un modello semantico e report. Oggi tutti modificano direttamente il workspace di produzione e capita che una modifica rompa i report del management.

I requisiti sono:

- ogni modifica deve essere **revisionata** da un collega prima del rilascio;
- deve esistere un ambiente di **test** dove gli utenti chiave validano i report;
- in **produzione** il modello semantico deve puntare al lakehouse di produzione, non a quello di sviluppo;
- le modifiche al modello devono essere leggibili riga per riga nelle revisioni.

## Consegna

Descrivi l'architettura dei workspace e il flusso di lavoro, indicando quali funzionalità di Fabric usi per ogni requisito.

<!-- SOLUZIONE -->

**Workspace**: `Progetto-DEV`, `Progetto-TEST`, `Progetto-PROD`, più un workspace personale (o Power BI Desktop) per ogni sviluppatore.

**Flusso**

1. `Progetto-DEV` è collegato con l'**integrazione Git** al branch `main` di un repository Azure DevOps o GitHub.
2. Ogni sviluppatore lavora su un **feature branch**, collegato al proprio workspace personale oppure in Power BI Desktop con un progetto **.pbip** (modello in **TMDL**).
3. Terminato il lavoro apre una **pull request** verso `main`: un collega la revisiona. Grazie a TMDL e PBIR le differenze sono leggibili riga per riga.
4. Dopo il merge, nel workspace DEV si esegue **Aggiorna** dal pannello di controllo del codice sorgente.
5. Una **pipeline di distribuzione** a tre fasi (DEV → TEST → PROD) promuove i contenuti. La funzione **Confronta** mostra cosa cambierà prima di ogni distribuzione.
6. Sulle fasi TEST e PROD si configurano **regole di distribuzione** (origine dati o parametri) e il lakehouse predefinito dei notebook, così ogni ambiente usa i propri dati.
7. Solo un gruppo ristretto ha i permessi per distribuire in PROD.

**Corrispondenza requisiti → funzionalità**

| Requisito | Funzionalità |
|---|---|
| Revisione | Git + pull request |
| Ambiente di test | Fase TEST della pipeline |
| Connessioni diverse per ambiente | Regole di distribuzione / parametri |
| Differenze leggibili | Formato .pbip con TMDL |
