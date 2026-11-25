## Scenario

Nel progetto `ordini` (distribuito con un bundle) c'è questa funzione:

~~~python
# src/ordini/trasforma.py
from pyspark.sql import DataFrame, functions as F

def arricchisci(ordini: DataFrame, cambi: DataFrame) -> DataFrame:
    """Converte gli importi in EUR e scarta gli ordini annullati."""
    return (ordini
            .filter(F.col("stato") != "ANNULLATO")
            .join(cambi, "valuta", "left")
            .withColumn("importo_eur", F.round(F.col("importo") * F.coalesce("tasso", F.lit(1.0)), 2))
            .drop("tasso"))
~~~

## Consegna

1. Scrivi due **unit test** con pytest e le utilità di `pyspark.testing`: uno sul contenuto del risultato (ordine delle righe non rilevante) e uno sullo schema.
2. Indica in quale fase della CI/CD girano gli unit test e come si esegue un test di integrazione del job.

<!-- SOLUZIONE -->

~~~python
# tests/test_trasforma.py
from pyspark.testing import assertDataFrameEqual, assertSchemaEqual
from ordini.trasforma import arricchisci

SCHEMA_ORDINI = "id INT, valuta STRING, importo DOUBLE, stato STRING"

def test_arricchisci_converte_e_filtra(spark):
    ordini = spark.createDataFrame(
        [(1, "USD", 100.0, "OK"), (2, "EUR", 50.0, "OK"), (3, "USD", 10.0, "ANNULLATO"), (4, "CHF", 20.0, "OK")],
        SCHEMA_ORDINI)
    cambi = spark.createDataFrame([("USD", 0.9), ("EUR", 1.0)], "valuta STRING, tasso DOUBLE")

    atteso = spark.createDataFrame(
        [("USD", 1, 100.0, "OK", 90.0), ("EUR", 2, 50.0, "OK", 50.0), ("CHF", 4, 20.0, "OK", 20.0)],
        "valuta STRING, id INT, importo DOUBLE, stato STRING, importo_eur DOUBLE")

    assertDataFrameEqual(arricchisci(ordini, cambi), atteso)   # ignora l'ordine delle righe

def test_arricchisci_schema(spark):
    ordini = spark.createDataFrame([], SCHEMA_ORDINI)
    cambi = spark.createDataFrame([], "valuta STRING, tasso DOUBLE")
    risultato = arricchisci(ordini, cambi)
    atteso = spark.createDataFrame([], "valuta STRING, id INT, importo DOUBLE, stato STRING, importo_eur DOUBLE")
    assertSchemaEqual(risultato.schema, atteso.schema)
~~~

Il join su `"valuta"` porta la colonna di join in prima posizione: è il tipo di dettaglio che un test di schema intercetta.

**Nella CI/CD**

- Gli **unit test** girano a ogni **pull request** (`pytest`), con una sessione Spark locale o tramite Databricks Connect, insieme a `databricks bundle validate`.
- Il **test di integrazione** gira dopo il merge: `databricks bundle deploy -t test`, poi `databricks bundle run -t test job_ordini` su dati campione in un catalog di test, seguito da controlli sui risultati (conteggi, nessun annullato, importi non nulli). Solo se passa si distribuisce in `prod`.
