I dati grezzi non sono mai pronti all'uso. Questa lezione raccoglie le trasformazioni richieste dal DP-600 e mostra come farle in **T-SQL**, **PySpark** e **Power Query**.

## Duplicati

```sql
-- T-SQL: tiene la riga più recente per ogni ordine
WITH dedup AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY IdOrdine ORDER BY DataModifica DESC) AS rn
  FROM stg.Ordini
)
SELECT * FROM dedup WHERE rn = 1;
```

```python
# PySpark
df_pulito = df.dropDuplicates(["IdOrdine"])            # duplicati su una chiave
df_esatti = df.distinct()                               # righe identiche
```

In Power Query: *Rimuovi duplicati* sulla colonna selezionata.

## Valori mancanti e null

Prima di decidere come trattarli, capisci **perché** mancano. Le opzioni tipiche:

- **eliminare** le righe senza valori obbligatori (`df.dropna(subset=["IdCliente"])`);
- **sostituire** con un valore predefinito (`COALESCE(Regione, 'Non specificata')`, `df.fillna({"Sconto": 0})`);
- in una tabella dei fatti, associare le chiavi mancanti a un **membro "Sconosciuto"** della dimensione (ad esempio chiave `-1`), così le righe non spariscono dai totali.

## Tipi di dato

Conversioni sbagliate sono una fonte classica di errori:

```sql
SELECT TRY_CAST(Importo AS decimal(18,2)) AS Importo,
       TRY_CONVERT(date, DataTesto, 103)   AS DataOrdine   -- formato gg/mm/aaaa
FROM stg.Vendite;
```

`TRY_CAST` e `TRY_CONVERT` restituiscono `NULL` invece di un errore se la conversione fallisce. In PySpark: `df.withColumn("Importo", col("Importo").cast("decimal(18,2)"))`.

## Filtrare

Filtra **il prima possibile** per ridurre i volumi: `WHERE`, `df.filter(...)`, oppure in Power Query il filtro sulle righe, che con le sorgenti supportate viene "ripiegato" (*query folding*) e tradotto in una query sulla sorgente.

## Unire (merge / join)

| Tipo di join | Risultato |
|---|---|
| `INNER` | Solo le righe con corrispondenza in entrambe le tabelle |
| `LEFT OUTER` | Tutte le righe di sinistra, con null dove manca la corrispondenza |
| `FULL OUTER` | Tutte le righe di entrambe |
| *Left anti* | Righe di sinistra **senza** corrispondenza (utile per trovare chiavi orfane) |

In Power Query il join si chiama **Unisci query** (merge), mentre **Accoda query** (append) corrisponde a `UNION ALL`: impila righe di tabelle con la stessa struttura.

## Arricchire

Aggiungere colonne calcolate (margine, fascia d'età, flag) o tabelle di supporto (calendario, tassi di cambio) rende i dati pronti per l'analisi:

```python
from pyspark.sql.functions import col, when
df = df.withColumn("Margine", col("Ricavo") - col("Costo")) \
       .withColumn("Fascia", when(col("Ricavo") > 1000, "Alta").otherwise("Standard"))
```

## Scrivere il risultato

```python
df.write.mode("overwrite").format("delta").saveAsTable("silver_ordini")
```

Per caricamenti incrementali si usa `MERGE` (in T-SQL o con le API Delta in Spark) per aggiornare le righe esistenti e inserire le nuove.
