Le **Lakeflow Spark Declarative Pipelines** (SDP, prima *Delta Live Tables*) permettono di dichiarare *cosa* produrre; il motore gestisce dipendenze, ordine di esecuzione, checkpoint, retry, compute e qualità.

## Dataset di una pipeline

~~~python
from pyspark import pipelines as dp
from pyspark.sql import functions as F

@dp.table(comment="Ordini grezzi da Auto Loader")             # streaming table
def bronze_ordini():
    return (spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "json")
            .load("/Volumes/prod/landing/files/ordini"))

@dp.table
@dp.expect_or_drop("id_valido", "id_ordine IS NOT NULL")
def silver_ordini():
    return spark.readStream.table("bronze_ordini").withColumn("importo", F.col("importo").cast("decimal(18,2)"))

@dp.materialized_view
def gold_vendite_giornaliere():
    return spark.read.table("silver_ordini").groupBy("data_ordine").agg(F.sum("importo").alias("totale"))
~~~

In SQL: `CREATE OR REFRESH STREAMING TABLE ... AS SELECT * FROM STREAM(...)` e `CREATE OR REFRESH MATERIALIZED VIEW`.

## Streaming table o materialized view?

| | Streaming table | Materialized view |
|---|---|---|
| Elaborazione | Ogni riga in input **una sola volta**, append incrementale | Risultato **sempre corretto** rispetto alle sorgenti; aggiornamento incrementale quando possibile, altrimenti ricalcolo |
| Sorgenti ideali | Append-only: file, Kafka, tabelle bronze | Tabelle che cambiano (update, delete), join e aggregazioni |
| Latenza | Bassa, anche continua | Dipende dalla frequenza di refresh |
| Costo | Basso per dato elaborato | Più alto se serve ricalcolo completo |
| Esempio | Ingestione e pulizia riga per riga | Aggregati gold, join con dimensioni che cambiano |

Attenzione: una streaming table che legge una sorgente in cui le righe vengono **aggiornate o cancellate** fallisce (o richiede opzioni come `skipChangeCommits`), perché lo streaming presuppone sorgenti append-only.

## Modalità di esecuzione

- **Triggered**: la pipeline elabora i dati disponibili e si ferma; si pianifica da un job. Costo minore.
- **Continuous**: resta attiva e aggiorna con bassa latenza.
- **Development** vs **production**: in sviluppo il cluster resta acceso tra un'esecuzione e l'altra e non ci sono retry; in produzione si riavvia in caso di errori.
- **Full refresh**: ricalcola tutto da zero (attenzione: per le streaming table rielabora tutta la sorgente).

## Structured Streaming o pipeline dichiarative?

| Scegli **SDP** quando... | Scegli **Structured Streaming** diretto quando... |
|---|---|
| Vuoi dipendenze, qualità (expectations), retry e compute gestiti | Serve controllo fine su trigger, stato, sink personalizzati |
| Il team preferisce SQL dichiarativo | Scrivi verso sink non supportati (API esterne) con `foreachBatch` complessi |
| CDC con AUTO CDC e SCD | Logica stateful personalizzata (`transformWithState`) |
| Vuoi lineage e event log della pipeline pronti | Vuoi integrare lo stream in un'applicazione esistente |

> Parole chiave: "minimo codice operativo, qualità integrata, dipendenze automatiche" → **pipeline dichiarativa**; "sorgente con update e delete, aggregazione sempre corretta" → **materialized view**.
