Per portare i dati in Fabric esistono molti strumenti. La domanda chiave è: **devo copiare i dati o mi basta accedervi dove sono?**

## Accedere senza copiare

### Shortcut di OneLake
Uno **shortcut** è un collegamento che fa apparire in un lakehouse (o in un database KQL) dati che risiedono altrove, **senza copiarli**. Le destinazioni supportate includono altri percorsi OneLake, **Azure Data Lake Storage Gen2**, **Amazon S3** e storage compatibili S3, **Google Cloud Storage** e **Dataverse**.

- Uno shortcut nella cartella `Tables` che punta a dati in formato Delta appare come tabella interrogabile.
- Eliminare uno shortcut non elimina i dati di origine.
- È la scelta giusta quando i dati sono già in un lake e si vogliono evitare duplicazioni e costi di copia.

### Mirroring
Il **mirroring** replica in OneLake, in formato Delta e **quasi in tempo reale**, un database operativo: ad esempio Azure SQL Database, Azure SQL Managed Instance, Azure Cosmos DB, Snowflake, PostgreSQL, oltre a cataloghi come Azure Databricks. Non richiede di scrivere pipeline: Fabric gestisce la replica continua delle modifiche, e il risultato è interrogabile tramite un endpoint SQL.

## Copiare e trasformare

| Strumento | Quando usarlo |
|---|---|
| **Pipeline di dati** (attività Copia, *Copy job*) | Spostare grandi volumi da molte sorgenti, orchestrare passaggi, pianificazioni, logica condizionale. Poca o nessuna trasformazione. |
| **Dataflow Gen2** | Trasformazioni **low-code** con Power Query (centinaia di connettori), adatte ad analisti; scrive su lakehouse, warehouse e altre destinazioni. |
| **Notebook** (Spark) | Trasformazioni complesse o su grandi volumi, logica in Python/Scala, data science, gestione di file semistrutturati. |
| **T-SQL** nel warehouse | ELT dentro il warehouse con `INSERT...SELECT`, `CTAS`, `COPY INTO` da file. |
| **Eventstream** | Dati in streaming verso eventhouse, lakehouse o altre destinazioni. |

Le pipeline spesso **orchestrano** gli altri strumenti: un'attività Copia porta i file nel lakehouse, poi un'attività Notebook li pulisce e infine un'attività stored procedure aggiorna il warehouse.

## Domande guida

1. I dati sono già in un data lake in formato aperto? → **Shortcut**.
2. Serve una replica continua di un database operativo supportato? → **Mirroring**.
3. Gli utenti sono analisti che conoscono Power Query? → **Dataflow Gen2**.
4. Servono orchestrazione, pianificazione e copie massive? → **Pipeline**.
5. Logica complessa, grandi volumi, librerie Python? → **Notebook**.

> Attenzione alle parole chiave nelle domande: "senza duplicare i dati" punta agli shortcut, "minimo sforzo di sviluppo" e "near real time da Azure SQL" puntano al mirroring, "low-code" a Dataflow Gen2.
