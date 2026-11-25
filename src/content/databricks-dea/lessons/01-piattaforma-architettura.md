La **Databricks Data Intelligence Platform** è una piattaforma *lakehouse*: unisce la flessibilità e il basso costo di un data lake (file in formato aperto su storage cloud) con le garanzie tipiche di un data warehouse (transazioni, schema, governance, prestazioni SQL).

## Piano di controllo e piano di calcolo

| Componente | Cosa contiene |
|---|---|
| **Control plane** (gestito da Databricks) | Interfaccia web, notebook, definizioni di job e pipeline, metadati di Unity Catalog, servizi di gestione. |
| **Compute plane** | Le macchine che elaborano i dati. Per il *serverless* girano nell'account Databricks; per il compute *classico* girano nell'account cloud del cliente. |
| **Storage** | I dati veri e propri: file Delta/Parquet su ADLS, S3 o GCS. |

I dati **restano nello storage cloud**: il calcolo è separato e si può accendere, spegnere e ridimensionare in modo indipendente.

## Delta Lake

**Delta Lake** è il formato di tabella predefinito. Una tabella Delta è una cartella di file **Parquet** più un **transaction log** (`_delta_log/`) di file JSON e checkpoint. Il log porta:

- **transazioni ACID**: letture e scritture concorrenti senza vedere dati a metà;
- **schema enforcement**: una scrittura con colonne o tipi incompatibili viene rifiutata (si può abilitare l'evoluzione con `mergeSchema`);
- **time travel**: `SELECT * FROM vendite VERSION AS OF 12` o `TIMESTAMP AS OF '2026-01-01'`; `DESCRIBE HISTORY vendite` mostra le versioni, `RESTORE TABLE` torna indietro;
- operazioni DML: `UPDATE`, `DELETE`, `MERGE INTO`.

`VACUUM` elimina i file non più referenziati più vecchi della soglia di conservazione (7 giorni per impostazione predefinita): dopo un `VACUUM` non si può più fare time travel alle versioni che usavano quei file.

## Unity Catalog

**Unity Catalog** (UC) è il livello unificato di governance: permessi, lineage, audit, ricerca e condivisione per tabelle, viste, volumi, funzioni e modelli.

Gerarchia: **metastore** (uno per regione) → **catalog** → **schema** → oggetti (tabelle, viste, **volumi**, funzioni, modelli). Si fa riferimento a un oggetto con il nome a tre livelli `catalog.schema.oggetto`, ad esempio `prod.vendite.ordini`.

- I **volumi** governano file non tabellari (CSV grezzi, immagini, PDF): percorso `/Volumes/catalog/schema/volume/...`.
- Il **lineage** viene raccolto automaticamente fino al livello di colonna.
- I permessi si concedono a utenti, gruppi e *service principal* e si **ereditano** verso il basso.

## Architettura medallion

È il modo raccomandato di organizzare i dati in strati:

- **Bronze**: dati grezzi come arrivano, con metadati di caricamento;
- **Silver**: dati puliti, tipizzati, deduplicati e integrati;
- **Gold**: tabelle e viste aggregate pronte per BI, report e machine learning.

> Nell'esame, quando una domanda parla di "transazioni ACID su file nel lake", "time travel" o "schema enforcement" la risposta è quasi sempre Delta Lake; quando parla di "permessi centralizzati", "lineage" o "nome a tre livelli" è Unity Catalog.
