Tutti i dati di Fabric vivono in **OneLake**, un unico data lake logico per tutta l'organizzazione, basato su file **Delta Parquet**. Sopra OneLake ci sono però archivi diversi, pensati per esigenze diverse. Saper scegliere è una delle competenze più verificate nel DP-600.

## Lakehouse

- Archivia **tabelle Delta** (cartella `Tables`) e **file di qualsiasi formato** (cartella `Files`: CSV, JSON, immagini...).
- Si lavora con **Spark** (notebook PySpark, Spark SQL, Scala, R) e con Dataflow Gen2 e pipeline.
- Include automaticamente un **endpoint di analisi SQL** in **sola lettura**: si possono creare viste e funzioni, ma non modificare i dati con T-SQL.
- Ideale per dati semistrutturati, data engineering e data science, architettura a medaglione (bronze / silver / gold).

## Warehouse

- Data warehouse relazionale con supporto **T-SQL completo**: `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `CREATE TABLE AS SELECT`, stored procedure, **transazioni multi-tabella**.
- Anche qui i dati sono salvati come Delta in OneLake.
- Ideale per team con competenze SQL e per modelli dimensionali gestiti con ELT in T-SQL.

## Eventhouse (database KQL)

- Ottimizzato per **dati in streaming e serie temporali**: telemetria, log, eventi IoT, clickstream.
- Si interroga con **KQL** (Kusto Query Language) e supporta ingestione ad alto volume con latenza di secondi.
- Con la **disponibilità in OneLake** le tabelle possono essere esposte anche come Delta, leggibili dagli altri motori.

## Altri item utili

- **Database SQL in Fabric**: database operativo (OLTP) per applicazioni, replicato automaticamente in OneLake per l'analisi.
- **Database con mirroring**: copia quasi in tempo reale di un database esterno (vedi lezione successiva).

## Tabella decisionale

| Scenario | Scelta consigliata |
|---|---|
| Team di sviluppatori Python/Spark, dati JSON e CSV grezzi | Lakehouse |
| Team SQL, ELT con stored procedure e aggiornamenti transazionali | Warehouse |
| Milioni di eventi al minuto da sensori, query su finestre temporali | Eventhouse |
| Si deve modificare i dati con `UPDATE` da T-SQL | Warehouse (l'endpoint SQL del lakehouse è in sola lettura) |
| File non strutturati (immagini, PDF) da conservare accanto alle tabelle | Lakehouse (cartella `Files`) |

> Non esiste una scelta esclusiva: molte soluzioni usano un **lakehouse** per bronze e silver e un **warehouse** (o un lakehouse) per il livello gold, che alimenta i modelli semantici in **Direct Lake**.

Grazie a OneLake, un warehouse può leggere tabelle di un lakehouse dello stesso workspace con **query tra database** usando nomi in tre parti, ad esempio `SELECT * FROM Lakehouse_Vendite.dbo.Ordini`.
