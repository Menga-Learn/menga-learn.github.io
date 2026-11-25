Spark divide il lavoro in **job → stage → task**. Uno stage finisce dove serve uno **shuffle**, cioè una ridistribuzione dei dati tra i nodi (join, `groupBy`, `distinct`, `orderBy`). Lo shuffle è l'operazione più costosa: molti problemi di prestazioni nascono lì.

## Parametri di base

| Parametro | A cosa serve | Valore predefinito |
|---|---|---|
| `spark.sql.shuffle.partitions` | Numero di partizioni dopo uno shuffle in SQL/DataFrame | 200 (con AQE viene adattato automaticamente) |
| `spark.default.parallelism` | Parallelismo predefinito per le operazioni RDD | Numero totale di core |
| `spark.executor.memory` | Memoria di ogni executor | Dipende dal tipo di nodo |
| `spark.driver.memory` | Memoria del driver | Dipende dal tipo di nodo |
| `spark.sql.autoBroadcastJoinThreshold` | Dimensione massima di una tabella da inviare in broadcast nei join | 10 MB (`-1` disattiva) |

~~~python
spark.conf.set("spark.sql.shuffle.partitions", "64")
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 50 * 1024 * 1024)
~~~

I parametri di sessione come `shuffle.partitions` si impostano con `spark.conf.set`; quelli di memoria dell'executor e del driver si impostano nella **configurazione del cluster** (non a runtime). Su serverless la maggior parte di questi parametri è gestita automaticamente.

## Adaptive Query Execution

**AQE** (attivo per impostazione predefinita) ottimizza il piano durante l'esecuzione:

- unisce le partizioni troppo piccole dopo uno shuffle;
- trasforma un sort-merge join in broadcast join se una tabella risulta piccola;
- divide le partizioni sbilanciate (*skew join*).

## Metodo di lavoro

1. Misura il tempo di riferimento (*baseline*) del job o della query.
2. Individua lo stage lento nella **Spark UI** (durata dei task, byte di shuffle, *spill*).
3. Cambia **un parametro alla volta**: ad esempio riduci `shuffle.partitions` se hai migliaia di task da pochi KB, o aumentalo se i task elaborano GB e vanno in spill.
4. Riesegui e confronta con la baseline.

| Sintomo | Intervento tipico |
|---|---|
| Migliaia di task minuscoli dopo un `groupBy` | Ridurre `shuffle.partitions` |
| Task che scrivono molto su disco (*spill*) | Più partizioni o più memoria per executor |
| Join tra tabella enorme e tabella di 30 MB lento | Aumentare la soglia di broadcast o usare `F.broadcast()` |
| `OutOfMemoryError` sul driver dopo un `collect()` | Non portare i dati sul driver; se serve, più `driver.memory` |

> Nelle domande "cambia un parametro e rimisura" la risposta giusta parte sempre da una misura iniziale e modifica una cosa per volta.
