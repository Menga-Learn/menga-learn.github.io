## Scenario

L'azienda **Fabrikam Logistica** avvia un progetto Fabric. Per ogni sorgente scegli **dove archiviare** i dati (lakehouse, warehouse, eventhouse) e **come portarli** in Fabric (shortcut, mirroring, pipeline, Dataflow Gen2, notebook, eventstream).

1. 4 TB di file Parquet storici già presenti in un account **Azure Data Lake Storage Gen2**. Non si vuole duplicarli.
2. Il database gestionale su **Azure SQL Database**: serve averne una copia aggiornata quasi in tempo reale, con il minimo sviluppo.
3. Un file Excel di budget aggiornato ogni mese da un controller che conosce **Power Query** ma non programma.
4. I GPS dei camion inviano una posizione ogni 5 secondi tramite **Azure Event Hubs**; serve una dashboard aggiornata in tempo reale.
5. File JSON annidati provenienti da un'API dei corrieri da appiattire con logica complessa, ogni notte.
6. Il team BI, esperto di T-SQL, vuole costruire il modello dimensionale con stored procedure e transazioni.

<!-- SOLUZIONE -->

| # | Archivio | Metodo | Motivo |
|---|---|---|---|
| 1 | Lakehouse | **Shortcut** ADLS Gen2 | Accesso ai dati senza copiarli; se sono in Delta appaiono come tabelle. |
| 2 | Database con mirroring (in OneLake) | **Mirroring** | Replica continua quasi in tempo reale, senza pipeline da scrivere. |
| 3 | Lakehouse o warehouse | **Dataflow Gen2** | Trasformazioni low-code con Power Query, adatte a un analista. |
| 4 | Eventhouse | **Eventstream** dal Real-Time hub | Ingestione in streaming, query KQL, dashboard in tempo reale. |
| 5 | Lakehouse | **Notebook** Spark, orchestrato da una **pipeline** pianificata | Logica complessa su JSON annidati; la pipeline gestisce la pianificazione notturna. |
| 6 | **Warehouse** | Stored procedure T-SQL (richiamate da una pipeline) | Supporta DML completo e transazioni multi-tabella. |

**Spunto**: abilitando la *disponibilità in OneLake* sull'eventhouse (punto 4), i dati GPS diventano leggibili anche dal lakehouse e dai modelli Direct Lake per analisi storiche.
