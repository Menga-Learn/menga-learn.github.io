Le **UDF** (user-defined function) estendono SQL e DataFrame con logica personalizzata. Hanno costi molto diversi: la regola è usare **prima le funzioni native**, poi SQL UDF, poi Pandas UDF e solo alla fine le UDF Python riga per riga.

## Tipi di UDF

| Tipo | Come funziona | Prestazioni |
|---|---|---|
| **Funzione SQL** (`CREATE FUNCTION ... RETURN`) | Espressione SQL espansa nel piano | Ottime: l'ottimizzatore la "vede" |
| **Python UDF** (`@udf`) | Una chiamata Python **per riga**, serializzazione tra JVM e Python | Le più lente |
| **Pandas UDF** (`@pandas_udf`) | Lavora su **lotti** (Series di pandas) trasferiti con Apache Arrow | Molto più veloci delle Python UDF |
| **Funzione Python in Unity Catalog** (`LANGUAGE PYTHON`) | Funzione governata da UC, richiamabile da SQL | Riutilizzabile e con permessi |

~~~python
import pandas as pd
from pyspark.sql.functions import pandas_udf, udf

@udf("string")
def normalizza_cap(cap):           # una chiamata per riga
    return cap.zfill(5) if cap else None

@pandas_udf("double")
def lordo(netto: pd.Series, iva: pd.Series) -> pd.Series:   # un lotto alla volta
    return netto * (1 + iva)

df = df.withColumn("cap", normalizza_cap("cap")).withColumn("lordo", lordo("netto", "iva"))
~~~

## Funzioni in Unity Catalog

~~~sql
-- funzione SQL
CREATE OR REPLACE FUNCTION prod.util.giorni_lavorativi(inizio DATE, fine DATE)
RETURNS INT
RETURN datediff(fine, inizio) - 2 * floor(datediff(fine, inizio) / 7);

-- funzione Python governata
CREATE OR REPLACE FUNCTION prod.util.dominio_email(email STRING)
RETURNS STRING
LANGUAGE PYTHON
AS $$
  return email.split("@")[-1].lower() if email else None
$$;

SELECT prod.util.dominio_email(email) FROM prod.silver.clienti;
GRANT EXECUTE ON FUNCTION prod.util.dominio_email TO `analisti`;
~~~

Vantaggi delle funzioni UC: sono **condivise** tra notebook, job, SQL warehouse e dashboard, hanno **permessi** (`EXECUTE`), lineage e si usano anche come row filter e column mask.

## Quando scegliere cosa

1. Esiste una funzione nativa (`regexp_replace`, `transform`, `date_add`...)? → usala.
2. La logica si esprime in SQL e va condivisa? → **funzione SQL in UC**.
3. Serve Python (librerie, calcoli vettoriali) su grandi volumi? → **Pandas UDF**.
4. Serve Python riutilizzabile da analisti SQL con permessi? → **funzione Python in UC**.
5. Python UDF classica solo per logica non vettorizzabile e volumi contenuti.

> Se una domanda dice "una UDF Python rallenta un job su miliardi di righe", la risposta migliore è sostituirla con funzioni native o con una **Pandas UDF**.
