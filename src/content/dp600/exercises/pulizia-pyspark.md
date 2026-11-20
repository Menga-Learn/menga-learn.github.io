## Scenario

In un notebook hai caricato il DataFrame `ordini_raw` dalla tabella bronze `bronze_ordini`, con le colonne:

`IdOrdine` (string), `IdCliente` (string), `DataOrdine` (string nel formato `dd/MM/yyyy`), `Importo` (string), `Canale` (string), `DataCaricamento` (timestamp)

Problemi noti:

- lo stesso ordine può comparire più volte: va tenuta solo la versione con `DataCaricamento` più recente;
- alcune righe non hanno `IdCliente`: vanno scartate;
- `Canale` a volte è nullo: va sostituito con `"Sconosciuto"`;
- `DataOrdine` e `Importo` vanno convertiti in `date` e `decimal(18,2)`.

## Consegna

Scrivi il codice PySpark che produce il DataFrame pulito e lo salva come tabella Delta `silver_ordini`, sovrascrivendola.

<!-- SOLUZIONE -->

~~~python
from pyspark.sql import functions as F
from pyspark.sql.window import Window

ordini_raw = spark.read.table("bronze_ordini")

# 1. tiene la versione più recente di ogni ordine
w = Window.partitionBy("IdOrdine").orderBy(F.col("DataCaricamento").desc())
ordini = (ordini_raw
          .withColumn("rn", F.row_number().over(w))
          .filter(F.col("rn") == 1)
          .drop("rn"))

# 2-4. pulizia e tipi
silver = (ordini
          .dropna(subset=["IdCliente"])
          .fillna({"Canale": "Sconosciuto"})
          .withColumn("DataOrdine", F.to_date("DataOrdine", "dd/MM/yyyy"))
          .withColumn("Importo", F.col("Importo").cast("decimal(18,2)")))

silver.write.mode("overwrite").format("delta").saveAsTable("silver_ordini")
~~~

**Perché non `dropDuplicates(["IdOrdine"])`?** Funziona, ma non garantisce **quale** riga viene tenuta. Con `row_number()` su una finestra ordinata scegli esplicitamente la più recente.

**Variante incrementale**: invece di sovrascrivere, con `DeltaTable.forName(spark, "silver_ordini").merge(...)` aggiorneresti solo gli ordini nuovi o modificati.
