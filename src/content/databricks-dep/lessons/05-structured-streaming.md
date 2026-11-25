**Structured Streaming** tratta uno stream come una tabella illimitata elaborata in **micro-batch**. Per il livello Professional bisogna padroneggiare stato, watermark, modalità di output, `foreachBatch` e checkpoint.

## Checkpoint ed exactly-once

Il **checkpoint** salva gli offset della sorgente già elaborati e lo stato delle operazioni stateful. Con una sorgente riproducibile (file, Kafka, Delta) e un sink idempotente o transazionale (Delta) si ottiene la semantica **exactly-once**.

- Ogni query di streaming deve avere il **proprio** checkpoint.
- Cambiare la logica in modo incompatibile (es. chiavi di aggregazione) richiede un checkpoint nuovo.
- Cancellare il checkpoint significa rielaborare tutto dalla sorgente.

## Watermark

Le aggregazioni su finestre temporali e i join tra stream mantengono **stato**. Il **watermark** indica quanto ritardo accettare: lo stato più vecchio della soglia viene eliminato.

~~~python
from pyspark.sql import functions as F

conteggi = (eventi
    .withWatermark("ts_evento", "10 minutes")
    .groupBy(F.window("ts_evento", "5 minutes"), "dispositivo")
    .count())
~~~

Un evento che arriva con `ts_evento` più vecchio di *massimo ts visto − 10 minuti* può essere scartato. Senza watermark lo stato cresce all'infinito.

## Modalità di output

| Modalità | Cosa scrive | Uso |
|---|---|---|
| **append** (default) | Solo righe nuove e definitive | Ingestione; aggregazioni con watermark (la finestra viene scritta quando si chiude) |
| **update** | Solo le righe cambiate nel micro-batch | Aggregazioni con aggiornamenti verso sink che supportano upsert |
| **complete** | Tutto il risultato a ogni micro-batch | Aggregazioni piccole, senza watermark |

## foreachBatch

`foreachBatch` passa ogni micro-batch come DataFrame normale: si può usare qualsiasi operazione batch, ad esempio un **MERGE** in Delta o la scrittura su più tabelle.

~~~python
from delta.tables import DeltaTable

def upsert(batch_df, batch_id):
    ultimi = batch_df.dropDuplicates(["id"])            # una riga per chiave nel batch
    (DeltaTable.forName(spark, "prod.silver.clienti").alias("t")
        .merge(ultimi.alias("s"), "t.id = s.id")
        .whenMatchedUpdateAll()
        .whenNotMatchedInsertAll()
        .execute())

(spark.readStream.table("prod.bronze.clienti")
    .writeStream
    .foreachBatch(upsert)
    .option("checkpointLocation", "/Volumes/prod/silver/chk/clienti")
    .trigger(availableNow=True)
    .start())
~~~

`foreachBatch` garantisce *at-least-once*: un batch può essere rieseguito dopo un errore. Per essere idempotenti si usa un MERGE, oppure le opzioni di scrittura Delta `txnAppId` e `txnVersion` (con `batch_id`).

## Trigger

- `processingTime="1 minute"`: micro-batch a intervalli regolari.
- `availableNow=True`: elabora il disponibile e termina (batch incrementale).
- *Real-time mode* / continuo: latenza minima, per casi particolari.

> Nelle domande: "lo stato cresce senza limiti" → manca il **watermark**; "upsert da uno stream" → **foreachBatch + MERGE**; "dopo il riavvio riparte da zero" → **checkpoint** perso o cambiato.
