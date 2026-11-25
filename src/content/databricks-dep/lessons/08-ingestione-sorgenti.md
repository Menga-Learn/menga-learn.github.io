Il livello Professional richiede di acquisire dati da sorgenti eterogenee — file, code di messaggi, database — in formati diversi, spesso con CDC.

## Formati e sorgenti

| Formato | Note |
|---|---|
| **Delta** | Formato nativo; leggibile in streaming come sorgente (`readStream.table`) |
| **Iceberg** | Supportato tramite tabelle Iceberg gestite in UC e lettura/scrittura compatibile (UniForm) |
| **Parquet** | Colonnare, con schema; adatto al bronze |
| **JSON / CSV** | Schema da dedurre o dichiarare; attenzione a tipi e righe malformate |
| **Binary** (`binaryFile`) | PDF, immagini: contenuto in byte e metadati |

## Code di messaggi

~~~python
from pyspark.sql import functions as F

raw = (spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "broker1:9092")
    .option("subscribe", "ordini")
    .option("startingOffsets", "earliest")
    .load())

ordini = (raw
    .select(F.col("key").cast("string"), F.col("value").cast("string").alias("json"), "timestamp")
    .withColumn("dati", F.from_json("json", "id STRING, importo DOUBLE, ts TIMESTAMP")))
~~~

- Kafka restituisce `key` e `value` in **binario**: vanno convertiti (`cast("string")`) e interpretati (`from_json`, oppure `parse_json` per il tipo `VARIANT`).
- Kinesis (`format("kinesis")`) e Google Pub/Sub (`format("pubsub")`) funzionano in modo analogo.
- Con le pipeline dichiarative la stessa lettura diventa una **streaming table**.
- Spesso conviene salvare in bronze il messaggio **grezzo** e fare il parsing in silver: se lo schema cambia si può rielaborare.

## CDC da database relazionali

Per SQL Server, MySQL e PostgreSQL, **Lakeflow Connect** offre connettori gestiti:

1. un **gateway di ingestione** legge le modifiche dal database (CDC o change tracking per SQL Server, binlog per MySQL, replica logica per PostgreSQL);
2. una **pipeline di ingestione** applica le modifiche alle **streaming table** di destinazione in Unity Catalog, con snapshot iniziale e poi incrementale;
3. è possibile scegliere SCD tipo 1 o tipo 2 per le tabelle di destinazione.

## Pipeline CDC incrementali verso Delta o Iceberg

Quando le modifiche arrivano come feed (es. da Kafka con Debezium, o file di CDC):

- bronze: streaming table con i record di modifica grezzi;
- silver: **AUTO CDC** con `keys`, `sequence_by`, `apply_as_deletes`, SCD tipo 1 o 2;
- la destinazione può essere una tabella Delta o una tabella **Iceberg** gestita da Unity Catalog, leggibile da motori esterni.

> Distinzione chiave: **Lakeflow Connect** acquisisce il CDC direttamente dal database; **AUTO CDC** applica un feed di modifiche già disponibile.
