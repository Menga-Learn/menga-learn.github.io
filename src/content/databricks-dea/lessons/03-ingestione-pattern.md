L'ingestione porta i dati dalle sorgenti allo strato **bronze**. Prima di scegliere lo strumento bisogna capire il **pattern**.

## Batch, incrementale e streaming

| Pattern | Descrizione | Esempio |
|---|---|---|
| **Batch completo** | Rilegge tutta la sorgente a ogni esecuzione e sovrascrive. | Tabella di configurazione di poche righe. |
| **Batch incrementale** | Elabora solo i dati **nuovi** dall'ultima esecuzione. | File che arrivano ogni ora in una cartella. |
| **Streaming** | Elabora i dati in modo continuo man mano che arrivano. | Eventi IoT da Kafka. |

Strumenti come **Auto Loader** e le **streaming table** usano lo stesso motore (Structured Streaming) sia in continuo sia in modalità *trigger available now*, cioè "elabora tutto quello che è nuovo e poi fermati": è il modo più comune di fare ingestione incrementale a batch.

## File locali

Dall'interfaccia **Aggiungi dati / Carica file** si può caricare un CSV, JSON o Parquet locale e crearne una tabella Delta in Unity Catalog, oppure caricarlo in un **volume** per usarlo dal codice. È pensato per file piccoli e caricamenti occasionali.

## COPY INTO

`COPY INTO` è un comando SQL che carica file da un percorso cloud in una tabella Delta. È **idempotente**: tiene traccia dei file già caricati e, se rieseguito, li salta.

~~~sql
CREATE TABLE IF NOT EXISTS bronze.ordini_raw;

COPY INTO bronze.ordini_raw
FROM 'abfss://landing@contoso.dfs.core.windows.net/ordini/'
FILEFORMAT = CSV
FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true')
COPY_OPTIONS ('mergeSchema' = 'true');
~~~

- `FILEFORMAT`: CSV, JSON, PARQUET, AVRO, ORC, TEXT, BINARYFILE.
- `PATTERN = '*.csv'` filtra i file; `FILES = (...)` li elenca.
- `COPY_OPTIONS ('force' = 'true')` ricarica anche i file già visti.
- Creando la tabella senza colonne, con `mergeSchema` lo schema viene dedotto dal primo caricamento.

L'accesso al percorso è governato da Unity Catalog tramite **external location** (o volumi).

## COPY INTO o Auto Loader?

| Criterio | COPY INTO | Auto Loader |
|---|---|---|
| Volume di file | Da migliaia a qualche milione | Fino a miliardi di file |
| Interfaccia | SQL, esecuzione a comando | Structured Streaming (`cloudFiles`) |
| Evoluzione dello schema | Con `mergeSchema` | Ricca: modalità dedicate, colonna `_rescued_data` |
| Esecuzione continua | No | Sì, oppure `availableNow` |

> Regola pratica dell'esame: pochi file e un approccio SQL semplice → `COPY INTO`; grandi volumi, arrivi continui o schema che cambia → **Auto Loader**.
