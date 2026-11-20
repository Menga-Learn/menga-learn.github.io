Un progetto analitico serio va gestito come codice: con **controllo di versione**, revisioni e rilasci ripetibili. Fabric integra Git direttamente nel workspace.

## Integrazione Git del workspace

Un workspace può essere collegato a un repository **Azure DevOps** o **GitHub**, scegliendo un **branch** e, facoltativamente, una cartella.

- **Commit**: salva nel branch le modifiche fatte nel workspace.
- **Aggiorna (Update)**: porta nel workspace le modifiche arrivate dal branch.
- Il pannello *Controllo del codice sorgente* mostra lo stato di ogni item: sincronizzato, modificato, in conflitto.

Ogni item viene serializzato in una cartella con file di testo leggibili (definizioni JSON, notebook come file `.py`, modelli in formato TMDL). In questo modo le differenze sono revisionabili in una pull request.

**Strategia tipica**: ogni sviluppatore lavora in un **workspace personale** collegato a un *feature branch*; quando il lavoro è pronto apre una pull request verso il branch principale, che è collegato al workspace di sviluppo condiviso.

> Un workspace può essere collegato a **un solo branch alla volta**. Per lavorare su più branch servono più workspace (o client locali).

## Progetti di Power BI Desktop (.pbip)

Il classico file `.pbix` è binario e quindi poco adatto al controllo di versione. Il formato **Power BI Project (.pbip)** salva invece il lavoro in una cartella:

```
Vendite.pbip
Vendite.Report/          definizione del report (PBIR)
Vendite.SemanticModel/   definizione del modello (TMDL)
```

Il formato **TMDL** (Tabular Model Definition Language) descrive tabelle, colonne, misure e relazioni in file di testo, uno per tabella: due sviluppatori possono modificare tabelle diverse senza conflitti, e le modifiche a una misura DAX sono visibili riga per riga.

## Progetti di database

Per il **warehouse** (e per i database SQL in Fabric) si usano i **progetti di database SQL** (`.sqlproj`), gestibili da Visual Studio Code o Visual Studio. Il progetto contiene lo schema come script T-SQL e si compila in un pacchetto **DACPAC**, che può essere distribuito in modo ripetibile su ambienti diversi. È l'approccio adatto quando si vuole gestire lo schema del warehouse con pipeline CI/CD esterne.

## In sintesi

| Cosa versionare | Strumento |
|---|---|
| Item del workspace (notebook, pipeline, lakehouse, report) | Integrazione Git del workspace |
| Report e modelli sviluppati in Desktop | File `.pbip` con TMDL e PBIR |
| Schema del warehouse | Progetto di database SQL (DACPAC) |
