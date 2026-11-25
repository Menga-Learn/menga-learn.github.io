La **Change Data Capture** (CDC) propaga inserimenti, aggiornamenti ed eliminazioni di una sorgente verso una destinazione. Nelle pipeline dichiarative si usano le **AUTO CDC API** (prima `APPLY CHANGES`), che gestiscono da sole ordinamento, duplicati e record fuori sequenza.

## Feed di modifiche in input

Ogni record del feed contiene la chiave, i valori, un campo di **sequenza** (timestamp o numero crescente) e il tipo di operazione:

| id_cliente | nome | citta | op | ts |
|---|---|---|---|---|
| 7 | Anna | Torino | INSERT | 10:00 |
| 7 | Anna | Milano | UPDATE | 11:00 |
| 9 | Marco | Bari | DELETE | 11:30 |

## SCD tipo 1 e tipo 2

- **SCD tipo 1**: la destinazione contiene solo il valore **attuale** (sovrascrive).
- **SCD tipo 2**: conserva lo **storico**: ogni versione è una riga con le colonne `__START_AT` e `__END_AT` (la versione corrente ha `__END_AT` nullo).

## Python

~~~python
from pyspark import pipelines as dp
from pyspark.sql.functions import col, expr

dp.create_streaming_table("clienti_scd2")

dp.create_auto_cdc_flow(
    target="clienti_scd2",
    source="bronze_clienti_cdc",
    keys=["id_cliente"],
    sequence_by=col("ts"),
    apply_as_deletes=expr("op = 'DELETE'"),
    except_column_list=["op", "ts"],
    stored_as_scd_type=2,                 # 1 per mantenere solo l'ultimo valore
    track_history_column_list=["citta"],  # storicizza solo i cambi di citta
)
~~~

## SQL

~~~sql
CREATE OR REFRESH STREAMING TABLE clienti_scd2;

CREATE FLOW clienti_cdc AS AUTO CDC INTO clienti_scd2
FROM STREAM(bronze_clienti_cdc)
KEYS (id_cliente)
APPLY AS DELETE WHEN op = 'DELETE'
SEQUENCE BY ts
COLUMNS * EXCEPT (op, ts)
STORED AS SCD TYPE 2;
~~~

## Perché non un semplice MERGE?

Un `MERGE INTO` scritto a mano deve gestire: più modifiche della stessa chiave nello stesso batch, eventi arrivati **fuori ordine**, eliminazioni e chiusura dei periodi SCD2. AUTO CDC fa tutto in base a `sequence_by`: se arriva un evento più vecchio di quello già applicato, viene ignorato correttamente.

Altre opzioni utili:

- `apply_as_truncates`: gestisce operazioni di truncate (solo SCD tipo 1);
- `ignore_null_updates`: un aggiornamento con colonne nulle non sovrascrive i valori esistenti;
- `create_auto_cdc_from_snapshot_flow`: ricava le modifiche confrontando **snapshot** completi successivi, quando la sorgente non fornisce un feed di modifiche.

> Nell'esame: "storico delle modifiche con validità" → `stored_as_scd_type=2`; "solo il valore attuale" → tipo 1; "eventi fuori ordine" → `sequence_by`.
