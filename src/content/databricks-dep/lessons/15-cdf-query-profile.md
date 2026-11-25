## Change Data Feed

Il **Change Data Feed** (CDF) registra le modifiche a livello di riga di una tabella Delta. Permette ai processi a valle di elaborare **solo** le righe inserite, aggiornate o eliminate, invece di rileggere tutta la tabella.

~~~sql
ALTER TABLE prod.silver.clienti SET TBLPROPERTIES (delta.enableChangeDataFeed = true);

SELECT * FROM table_changes('prod.silver.clienti', 15);          -- dalla versione 15
SELECT * FROM table_changes('prod.silver.clienti', '2026-11-01'); -- da un timestamp
~~~

~~~python
modifiche = (spark.readStream
    .option("readChangeFeed", "true")
    .table("prod.silver.clienti"))
~~~

Colonne aggiunte dal CDF:

| Colonna | Valori |
|---|---|
| `_change_type` | `insert`, `update_preimage`, `update_postimage`, `delete` |
| `_commit_version` | Versione Delta della modifica |
| `_commit_timestamp` | Istante del commit |

- Le modifiche sono disponibili solo **da quando** il CDF è attivo.
- Per propagare gli aggiornamenti si usano di solito le righe `update_postimage` e `insert`, più le `delete`.
- Lo streaming normale da una tabella Delta fallisce se la sorgente riceve update/delete; con `readChangeFeed` invece le modifiche diventano eventi da elaborare.
- I file del CDF seguono la stessa conservazione dei dati: `VACUUM` li elimina.

## Query profile

Il **query profile** (in Databricks SQL e nei notebook serverless) mostra il piano eseguito con tempi e metriche per operatore. Si apre dalla cronologia delle query.

Cosa controllare:

| Metrica | Cosa indica | Intervento |
|---|---|---|
| **File letti / file potati** e byte letti | Efficacia del **data skipping** | Clustering sulle colonne filtrate, filtri sulle colonne di clustering, statistiche aggiornate |
| Tipo di **join** (broadcast hash, shuffle hash, sort-merge) | Se la tabella piccola viene inviata in broadcast | Hint `BROADCAST`, filtrare prima del join |
| Byte di **shuffle** | Quantità di dati ridistribuiti | Ridurre colonne e righe prima di join e aggregazioni |
| Tempo per operatore | Collo di bottiglia | Concentrarsi sul nodo più costoso |
| **Spill** su disco | Memoria insufficiente | Warehouse più grande, query più selettiva |
| Righe in uscita molto maggiori dell'input in un join | Join esplosivo (chiave duplicata) | Controllare le chiavi |

Esempio: una query filtra `WHERE data_evento = '2026-11-20'` ma il profile mostra *files pruned: 0 su 12.000*. La tabella non è organizzata per `data_evento`: aggiungere quella colonna al **Liquid Clustering** (o usare `AUTO`) permetterà di saltare quasi tutti i file.

> "Elaborare solo le righe cambiate in una tabella silver" → **CDF**; "capire perché una query legge tutti i file" → **query profile**, metrica dei file potati.
