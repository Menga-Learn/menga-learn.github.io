## Scenario

Il sistema CRM pubblica un feed di modifiche dei clienti che Auto Loader scrive nella streaming table `bronze_clienti_cdc`:

`id_cliente` (string), `nome`, `email`, `segmento`, `op` (`INSERT`, `UPDATE`, `DELETE`), `ts_modifica` (timestamp)

Problemi noti: gli eventi possono arrivare **fuori ordine** e la stessa chiave può comparire più volte nello stesso batch.

Requisiti:

1. `silver_clienti`: solo lo stato **attuale** di ogni cliente, senza i clienti eliminati;
2. `silver_clienti_storico`: lo **storico** dei cambi di `segmento` con le date di validità; i cambi di `email` non devono generare nuove versioni;
3. le colonne `op` e `ts_modifica` non devono comparire nelle destinazioni.

## Consegna

Scrivi il codice Python della pipeline dichiarativa.

<!-- SOLUZIONE -->

~~~python
from pyspark import pipelines as dp
from pyspark.sql.functions import col, expr

# 1. stato attuale (SCD tipo 1)
dp.create_streaming_table("silver_clienti")
dp.create_auto_cdc_flow(
    target="silver_clienti",
    source="bronze_clienti_cdc",
    keys=["id_cliente"],
    sequence_by=col("ts_modifica"),
    apply_as_deletes=expr("op = 'DELETE'"),
    except_column_list=["op", "ts_modifica"],
    stored_as_scd_type=1,
)

# 2. storico dei segmenti (SCD tipo 2)
dp.create_streaming_table("silver_clienti_storico")
dp.create_auto_cdc_flow(
    target="silver_clienti_storico",
    source="bronze_clienti_cdc",
    keys=["id_cliente"],
    sequence_by=col("ts_modifica"),
    apply_as_deletes=expr("op = 'DELETE'"),
    except_column_list=["op", "ts_modifica"],
    stored_as_scd_type=2,
    track_history_column_list=["segmento"],
)
~~~

**Perché funziona**

- `sequence_by` stabilisce l'ordine logico: gli eventi in ritardo vengono applicati nella posizione giusta e un evento più vecchio non sovrascrive uno più recente. Anche i duplicati della stessa chiave nel batch vengono risolti.
- Con `stored_as_scd_type=2` la tabella ottiene `__START_AT` e `__END_AT`; la versione corrente ha `__END_AT` nullo. In SCD2 un `DELETE` chiude la versione corrente invece di cancellare lo storico.
- `track_history_column_list=["segmento"]` crea una nuova versione solo quando cambia il segmento; un cambio di email aggiorna la versione corrente.
- Scrivere a mano un `MERGE` con le stesse garanzie (ordine, duplicati, chiusura dei periodi) sarebbe molto più complesso.
