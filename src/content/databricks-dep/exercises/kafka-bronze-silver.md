## Scenario

Un topic Kafka `pagamenti` riceve messaggi JSON:

~~~json
{"id_pagamento": "P-991", "id_ordine": "O-12", "importo": 49.90, "valuta": "EUR", "ts": "2026-11-20T10:15:00Z"}
~~~

Requisiti:

1. **bronze**: conservare il messaggio grezzo (chiave, valore come stringa, topic, partizione, offset, timestamp Kafka), elaborando solo i nuovi messaggi a ogni esecuzione;
2. **silver**: estrarre i campi con i tipi corretti, scartare i messaggi con `id_pagamento` nullo, deduplicare su `id_pagamento` tollerando duplicati che arrivano fino a 30 minuti dopo;
3. entrambi i passaggi devono poter ripartire dopo un errore senza perdere né duplicare dati.

## Consegna

Scrivi il codice PySpark con Structured Streaming.

<!-- SOLUZIONE -->

~~~python
from pyspark.sql import functions as F

chk = "/Volumes/prod/pagamenti/checkpoint"

# 1. bronze: messaggi grezzi
(spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", dbutils.secrets.get("kafka", "bootstrap"))
    .option("subscribe", "pagamenti")
    .option("startingOffsets", "earliest")
    .load()
    .select(F.col("key").cast("string").alias("chiave"),
            F.col("value").cast("string").alias("valore"),
            "topic", "partition", "offset",
            F.col("timestamp").alias("ts_kafka"))
  .writeStream
    .option("checkpointLocation", f"{chk}/bronze")
    .trigger(availableNow=True)
    .toTable("prod.pagamenti.bronze_pagamenti"))

# 2. silver: parsing, validazione, deduplicazione
schema = "id_pagamento STRING, id_ordine STRING, importo DECIMAL(18,2), valuta STRING, ts TIMESTAMP"

(spark.readStream.table("prod.pagamenti.bronze_pagamenti")
    .withColumn("p", F.from_json("valore", schema))
    .select("p.*", "ts_kafka")
    .filter(F.col("id_pagamento").isNotNull())
    .withWatermark("ts", "30 minutes")
    .dropDuplicatesWithinWatermark(["id_pagamento"])
  .writeStream
    .option("checkpointLocation", f"{chk}/silver")
    .trigger(availableNow=True)
    .toTable("prod.pagamenti.silver_pagamenti"))
~~~

**Punti chiave**

- `key` e `value` di Kafka sono binari: si convertono in stringa e si conserva il grezzo in bronze per poter rielaborare se lo schema cambia.
- Ogni stream ha il **proprio checkpoint**: con sorgenti riproducibili (Kafka, Delta) e sink Delta si ottiene exactly-once.
- `withWatermark` + `dropDuplicatesWithinWatermark` limita lo stato di deduplicazione a 30 minuti; un semplice `dropDuplicates` senza watermark farebbe crescere lo stato senza limiti.
- In alternativa, la stessa logica si può scrivere come pipeline dichiarativa con streaming table ed expectations.
