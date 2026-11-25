La **Spark UI** mostra job, stage e task di un'esecuzione. Per l'esame bisogna riconoscere tre problemi classici: **skew**, **shuffle** eccessivo e **spill** su disco.

## Leggere le metriche di uno stage

Nella pagina di uno stage, la tabella *Summary Metrics* mostra minimo, percentili e massimo dei task per durata, input, byte di shuffle letti/scritti e spill.

| Problema | Come si riconosce | Rimedi |
|---|---|---|
| **Data skew** | Il task massimo dura molto più della mediana (es. mediana 5 s, massimo 8 min); pochi task elaborano gran parte dei dati | AQE skew join (attivo di default), salting della chiave, filtrare le chiavi anomale (es. `NULL`), broadcast della tabella piccola |
| **Shuffle eccessivo** | GB di *shuffle read/write*, molti stage | Broadcast join, filtrare e selezionare colonne **prima** del join, evitare `distinct`/`orderBy` inutili |
| **Spill** | Colonne *Spill (Memory)* e *Spill (Disk)* diverse da zero | Più partizioni (task più piccoli), più memoria per core, ridurre lo skew |

## Layout dei dati: Liquid Clustering

Il modo in cui i dati sono organizzati sui file influisce sulle prestazioni: Delta salva per ogni file le statistiche min/max delle colonne e salta i file che non possono contenere i valori cercati (**data skipping**).

**Liquid Clustering** organizza i dati in base alle colonne di clustering e sostituisce partizionamento e `ZORDER`:

~~~sql
CREATE TABLE prod.silver.eventi (id BIGINT, cliente STRING, data_evento DATE, tipo STRING)
CLUSTER BY (cliente, data_evento);

ALTER TABLE prod.silver.eventi CLUSTER BY (tipo, data_evento); -- si cambia senza riscrivere i dati
ALTER TABLE prod.silver.eventi CLUSTER BY AUTO;                -- sceglie Databricks in base alle query
OPTIMIZE prod.silver.eventi;                                   -- applica il clustering
~~~

- Si scelgono le colonne usate più spesso nei **filtri** (fino a 4).
- Le chiavi si possono **cambiare** in qualsiasi momento: i dati nuovi useranno le nuove chiavi.
- Funziona bene anche con colonne ad alta cardinalità, dove il partizionamento creerebbe troppi file piccoli.
- Non si può combinare con `PARTITIONED BY` o `ZORDER` sulla stessa tabella.

## Predictive Optimization

Per le **tabelle gestite** di Unity Catalog, la **Predictive Optimization** esegue automaticamente le operazioni di manutenzione quando servono:

- `OPTIMIZE` (compattazione dei file piccoli e clustering),
- `VACUUM` (rimozione dei file non più usati),
- `ANALYZE` (statistiche per l'ottimizzatore).

Si abilita a livello di account, catalog o schema; elimina la necessità di pianificare a mano job di manutenzione.

> Domanda tipica: "la tabella è filtrata per colonne diverse nel tempo e ha molti file piccoli, senza voler gestire la manutenzione" → **Liquid Clustering** (anche `AUTO`) + **tabelle gestite con Predictive Optimization**.
