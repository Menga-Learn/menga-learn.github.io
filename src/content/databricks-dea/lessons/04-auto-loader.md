**Auto Loader** elabora in modo incrementale ed efficiente i nuovi file che arrivano nello storage cloud. È una sorgente di Structured Streaming chiamata `cloudFiles`.

~~~python
(spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "json")
    .option("cloudFiles.schemaLocation", "/Volumes/dev/bronze/checkpoint/ordini_schema")
    .option("cloudFiles.inferColumnTypes", "true")
    .load("/Volumes/dev/landing/files/ordini/")
  .writeStream
    .option("checkpointLocation", "/Volumes/dev/bronze/checkpoint/ordini")
    .trigger(availableNow=True)
    .toTable("dev.bronze.ordini"))
~~~

## Come tiene traccia dei file

Lo stato dei file già elaborati è salvato nel **checkpoint** (un database RocksDB): in caso di errore lo stream riparte da dove si era fermato e garantisce l'elaborazione **exactly-once**.

Due modalità di rilevamento:

| Modalità | Funzionamento | Quando |
|---|---|---|
| **Directory listing** (predefinita) | Elenca la cartella, ottimizzato per file con nomi ordinati. | Configurazione minima, volumi moderati. |
| **File notification** | Usa eventi del cloud (code e notifiche) per sapere quali file sono arrivati, senza elencare la cartella. | Moltissimi file, cartelle enormi. Richiede permessi per creare le risorse di notifica (o gli *eventi file* gestiti dell'external location). |

## Schema: inferenza ed evoluzione

- `cloudFiles.schemaLocation` è dove Auto Loader salva lo schema dedotto e le sue versioni. È **obbligatorio** quando lo schema viene dedotto.
- Per JSON e CSV, senza `inferColumnTypes` tutte le colonne sono dedotte come `string`.
- `cloudFiles.schemaHints` fissa il tipo di alcune colonne: `"Importo DECIMAL(18,2), DataOrdine DATE"`.

`cloudFiles.schemaEvolutionMode`:

| Modalità | Comportamento quando compare una colonna nuova |
|---|---|
| `addNewColumns` (predefinita) | Lo stream si ferma con un errore, lo schema viene aggiornato; al riavvio la colonna è inclusa. |
| `rescue` | Lo schema non cambia; i dati nuovi finiscono nella colonna `_rescued_data`. |
| `failOnNewColumns` | Lo stream fallisce finché lo schema non viene aggiornato a mano. |
| `none` | Le colonne nuove vengono ignorate. |

La colonna **`_rescued_data`** raccoglie anche i valori che non rispettano il tipo previsto: invece di perdere il dato, lo si conserva in JSON per analizzarlo dopo.

## Trigger

- `trigger(availableNow=True)`: elabora tutti i file disponibili, anche in più micro-batch, e poi si ferma. Ideale da pianificare in un job.
- `trigger(processingTime="5 minutes")`: esecuzione continua a intervalli.

> Se in una domanda Auto Loader "rielabora tutti i file" dopo un riavvio, il problema è quasi sempre un **checkpoint** cambiato o cancellato.
