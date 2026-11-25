Costi e prestazioni dipendono molto da **come** i dati sono organizzati sui file. Il Professional chiede di scegliere tra partizionamento, ZORDER, Liquid Clustering, deletion vectors e caching.

## Tabelle gestite e Predictive Optimization

Le **tabelle gestite** di Unity Catalog riducono il lavoro operativo:

- **Predictive Optimization** esegue `OPTIMIZE` (compattazione e clustering), `VACUUM` e `ANALYZE` quando servono, in base all'uso reale;
- statistiche e metadati gestiti migliorano il data skipping e i piani di query;
- funzionalità come `CLUSTER BY AUTO` e il caching dei metadati sono disponibili solo sulle gestite.

Il risultato è meno lavoro di manutenzione pianificato a mano e meno compute sprecato in ottimizzazioni inutili.

## Partizionamento, ZORDER o Liquid Clustering?

| Tecnica | Come funziona | Limiti |
|---|---|---|
| **Partizionamento** (`PARTITIONED BY`) | Una cartella per valore della colonna | Solo per colonne a **bassa** cardinalità e tabelle grandi (> 1 TB); rischio di file piccoli; schema rigido |
| **ZORDER** (`OPTIMIZE ... ZORDER BY`) | Riordina i dati per più colonne dentro i file | Va rieseguito, riscrive molti file, non incrementale |
| **Liquid Clustering** (`CLUSTER BY`) | Clustering incrementale, chiavi modificabili | Non combinabile con partizionamento o ZORDER |
| **`CLUSTER BY AUTO`** | Databricks sceglie le chiavi dai pattern di query | Richiede tabelle gestite e Predictive Optimization |

Regole pratiche:

- tabelle nuove → **Liquid Clustering** (o `AUTO`), anche quando le colonne filtrate cambiano nel tempo;
- tabelle piccole (pochi GB) → spesso nessun layout particolare: basta la compattazione;
- partizionare per una colonna come `id_cliente` (milioni di valori) è un errore classico: genera milioni di cartelle e file minuscoli.

## Deletion vectors

Con i **deletion vectors** un `DELETE`, `UPDATE` o `MERGE` non riscrive il file Parquet: segna le righe eliminate in un piccolo file a parte (*merge-on-read*). Le scritture diventano molto più veloci; i file vengono riscritti in seguito da `OPTIMIZE` o da `REORG TABLE ... APPLY (PURGE)`.

| Pattern | Scelta |
|---|---|
| Molti update/delete sparsi (es. GDPR, CDC) | **Deletion vectors** attivi |
| Query filtrate per colonne diverse | **Liquid Clustering** |
| Layout scelto in base all'uso reale, senza analisi manuale | **CLUSTER BY AUTO** |

## Disk cache

La **disk cache** (in passato *Delta cache*) copia i file letti dallo storage sui **dischi SSD locali** dei worker, in un formato ottimizzato. Le letture ripetute degli stessi dati diventano molto più veloci. È attiva automaticamente sui tipi di istanza con SSD e sui SQL warehouse; non va confusa con `df.cache()` di Spark, che salva un DataFrame in memoria e va gestito manualmente.

> "Tabella con migliaia di file piccoli e filtri che cambiano" → Liquid Clustering + Predictive Optimization; "MERGE lenti con poche righe modificate" → **deletion vectors**.
