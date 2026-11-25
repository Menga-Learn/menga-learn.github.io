## Scenario

Un fornitore deposita file **JSON** di ordini nel volume `/Volumes/dev/landing/files/ordini/`, in momenti imprevedibili e con qualche migliaio di file al giorno. Ogni tanto il fornitore aggiunge un campo nuovo.

Requisiti per la tabella `dev.bronze.ordini`:

- caricare solo i file nuovi a ogni esecuzione e poi fermarsi (il job viene avviato dal trigger *file arrival*);
- dedurre i tipi delle colonne, forzando `importo` a `DECIMAL(18,2)`;
- quando compare una colonna nuova, **non** fermare lo stream: i dati imprevisti devono essere conservati per analisi;
- aggiungere il percorso del file di origine e l'istante di caricamento.

## Consegna

Scrivi il codice PySpark con Auto Loader.

<!-- SOLUZIONE -->

~~~python
from pyspark.sql import functions as F

base = "/Volumes/dev/bronze/checkpoint/ordini"

(spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "json")
    .option("cloudFiles.schemaLocation", f"{base}/schema")
    .option("cloudFiles.inferColumnTypes", "true")
    .option("cloudFiles.schemaHints", "importo DECIMAL(18,2)")
    .option("cloudFiles.schemaEvolutionMode", "rescue")
    .load("/Volumes/dev/landing/files/ordini/")
  .withColumn("file_origine", F.col("_metadata.file_path"))
  .withColumn("caricato_il", F.current_timestamp())
  .writeStream
    .option("checkpointLocation", f"{base}/stream")
    .trigger(availableNow=True)
    .toTable("dev.bronze.ordini"))
~~~

**Perché queste scelte**

- `schemaLocation` è obbligatorio quando lo schema viene dedotto: lì Auto Loader salva le versioni dello schema.
- `rescue` mantiene lo schema stabile e mette i campi nuovi o con tipo errato nella colonna `_rescued_data`. Con il valore predefinito `addNewColumns` lo stream si fermerebbe per aggiornare lo schema.
- `_metadata.file_path` è la colonna nascosta con i metadati del file.
- `availableNow=True` elabora tutto ciò che è nuovo e termina: perfetto con un trigger di job.
- Il **checkpoint** garantisce che ogni file venga elaborato una sola volta, anche dopo un errore.
