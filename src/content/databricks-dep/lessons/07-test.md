Un codice di produzione va **testato**. In Databricks i test si scrivono con `pytest` e con le utilità di PySpark, e si eseguono nella CI prima del deploy.

## Codice testabile

Il primo passo è separare la logica in **funzioni pure** che ricevono un DataFrame e restituiscono un DataFrame:

~~~python
# src/vendite/pulizia.py
from pyspark.sql import DataFrame, functions as F

def normalizza_email(df: DataFrame) -> DataFrame:
    return df.withColumn("email", F.lower(F.trim("email")))

def solo_validi(df: DataFrame) -> DataFrame:
    return df.filter(F.col("id").isNotNull() & (F.col("importo") >= 0))
~~~

Con `DataFrame.transform` le funzioni si concatenano in modo leggibile:

~~~python
silver = bronze.transform(normalizza_email).transform(solo_validi)
~~~

## Unit test

~~~python
# tests/test_pulizia.py
from pyspark.testing import assertDataFrameEqual, assertSchemaEqual
from vendite.pulizia import normalizza_email, solo_validi

def test_normalizza_email(spark):
    df = spark.createDataFrame([(1, "  Anna@Contoso.COM ")], "id INT, email STRING")
    atteso = spark.createDataFrame([(1, "anna@contoso.com")], "id INT, email STRING")
    assertDataFrameEqual(normalizza_email(df), atteso)

def test_solo_validi_scarta_negativi(spark):
    df = spark.createDataFrame([(1, 10.0), (2, -5.0), (None, 3.0)], "id INT, importo DOUBLE")
    assertDataFrameEqual(solo_validi(df), spark.createDataFrame([(1, 10.0)], "id INT, importo DOUBLE"))

def test_schema(spark):
    df = spark.createDataFrame([(1, " a ")], "id INT, email STRING")
    assertSchemaEqual(normalizza_email(df).schema, df.schema)
~~~

- **`assertDataFrameEqual`** confronta contenuto (per default ignorando l'ordine delle righe) e schema, con tolleranza per i numeri decimali (`rtol`, `atol`) e un messaggio che mostra le differenze.
- **`assertSchemaEqual`** confronta solo gli schemi.
- La sessione `spark` arriva da una *fixture* di pytest (`conftest.py`), locale o tramite **Databricks Connect**.

## Test di integrazione

Verificano il flusso completo su dati e risorse reali, in un ambiente di test:

1. `databricks bundle deploy -t test`;
2. `databricks bundle run -t test job_vendite` su un catalog di test con dati campione;
3. controlli sul risultato (conteggi, vincoli, assenza di duplicati);
4. eventuale pulizia delle risorse.

## Nella CI/CD

| Fase | Cosa gira |
|---|---|
| Pull request | Lint, **unit test** con pytest, `bundle validate` |
| Merge su main | Deploy nel target **test**, **test di integrazione** |
| Approvazione | Deploy nel target **prod** |

> Domanda tipica: "verificare che una trasformazione produca il DataFrame atteso, ignorando l'ordine delle righe" → **`assertDataFrameEqual`**.
