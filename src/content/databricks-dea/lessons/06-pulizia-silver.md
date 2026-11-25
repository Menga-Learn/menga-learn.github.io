Il passaggio da **bronze** a **silver** pulisce e uniforma i dati. Gli stessi risultati si ottengono in PySpark o in SQL: l'esame usa entrambi.

## Valori nulli e tipi

~~~python
from pyspark.sql import functions as F

silver = (spark.read.table("dev.bronze.ordini")
    .dropna(subset=["id_ordine"])                      # scarta righe senza chiave
    .fillna({"canale": "sconosciuto", "sconto": 0})     # valori predefiniti
    .withColumn("data_ordine", F.to_date("data_ordine", "dd/MM/yyyy"))
    .withColumn("importo", F.col("importo").cast("decimal(18,2)"))
    .withColumn("email", F.lower(F.trim("email"))))
silver.write.mode("overwrite").saveAsTable("dev.silver.ordini")
~~~

In SQL: `coalesce(canale, 'sconosciuto')`, `CAST(importo AS DECIMAL(18,2))`, `to_date(data_ordine, 'dd/MM/yyyy')`, `try_cast` restituisce `NULL` invece di un errore.

## Colonne, righe e tabelle

| Operazione | PySpark | SQL |
|---|---|---|
| Aggiungere | `withColumn("iva", F.col("importo") * 0.22)` | `SELECT *, importo * 0.22 AS iva` |
| Rinominare | `withColumnRenamed("cod", "codice")` | `cod AS codice` |
| Eliminare | `drop("colonna_tecnica")` | `SELECT * EXCEPT (colonna_tecnica)` |
| Dividere | `F.split("nome_completo", " ")[0]` | `split(nome_completo, ' ')[0]` |
| Filtrare | `filter(F.col("stato") == "OK")` | `WHERE stato = 'OK'` |
| Esplodere un array | `F.explode("righe")` | `explode(righe)` o `LATERAL VIEW` |

`explode` genera una riga per ogni elemento dell'array (le righe con array vuoto o nullo spariscono); `explode_outer` le conserva con `NULL`. Per accedere ai campi di una struct: `righe.prodotto` o `F.col("righe.prodotto")`.

## Join e unioni

- `inner`: solo le righe con corrispondenza; `left`: tutte quelle a sinistra.
- Join su **più chiavi**: `ordini.join(clienti, ["id_cliente", "paese"], "left")`.
- **Broadcast join**: `ordini.join(F.broadcast(paesi), "cod_paese")` invia la tabella piccola a ogni executor ed evita lo shuffle della tabella grande.
- `crossJoin`: prodotto cartesiano, da usare con cautela.
- `union` / `unionByName` in PySpark **non** eliminano i duplicati (equivalgono a `UNION ALL`); in SQL `UNION` li elimina, `UNION ALL` no. `unionByName` allinea per nome invece che per posizione.

## Duplicati e aggregazioni

- `dropDuplicates(["id_ordine"])` tiene una riga qualsiasi per chiave; per tenere la **più recente** si usa `row_number()` su una finestra ordinata per data di caricamento decrescente e si filtra `rn = 1` (in SQL con `QUALIFY`).
- `groupBy("paese").agg(F.count("*"), F.avg("importo"), F.approx_count_distinct("id_cliente"))`.
- `approx_count_distinct` è molto più veloce di `countDistinct` su grandi volumi, con un piccolo errore controllato.
- `df.describe()` e `df.summary()` restituiscono statistiche (conteggio, media, deviazione standard, minimo, massimo, percentili).

> Attenzione alla differenza `union` di PySpark e `UNION` di SQL: è un tranello classico.
