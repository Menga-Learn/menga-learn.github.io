**Lakeflow Jobs** (prima chiamato *Workflows*) è l'orchestratore nativo di Databricks. Un **job** è composto da uno o più **task** collegati da dipendenze che formano un grafo aciclico (**DAG**).

## Tipi di task comuni

| Task | Esegue |
|---|---|
| **Notebook** | Un notebook Python, SQL o Scala |
| **Python script / wheel** | Codice Python impacchettato |
| **SQL** | Una query, un file SQL, un alert o l'aggiornamento di una **dashboard** su un SQL warehouse |
| **Pipeline** | L'aggiornamento di una pipeline dichiarativa |
| **dbt** | Un progetto dbt |
| **Run job** | Un altro job |
| **If/else condition** | Una diramazione in base a una condizione |
| **For each** | Un task ripetuto per ogni elemento di una lista |

## Dipendenze

Ogni task può dipendere da uno o più task. Con l'opzione **Run if** si decide quando eseguirlo:

- `All succeeded` (predefinito), `At least one succeeded`, `None failed`, `All done`, `At least one failed`, `All failed`.

Ad esempio un task di notifica o di pulizia può usare `All done` per partire comunque.

## Flussi di controllo

- **Retry**: per ogni task si imposta il numero di tentativi, l'intervallo tra i tentativi e se riprovare in caso di timeout. Utile per errori transitori (rete, sorgente occupata).
- **Timeout** e **soglie di durata** con notifica.
- **If/else**: confronta un valore (parametro del job, *task value* di un task precedente) con un operatore (`==`, `!=`, `>`, ...) e prosegue sul ramo `true` o `false`.
- **For each**: ripete un task annidato per ogni elemento (es. elenco di paesi), anche in parallelo con una concorrenza massima.

Un task può passare valori ai successivi con i *task values*:

~~~python
righe = spark.table("dev.bronze.ordini").count()
dbutils.jobs.taskValues.set(key="righe_caricate", value=righe)
~~~

e la condizione può leggere `{{tasks.carica.values.righe_caricate}}`.

## Parametri

I **parametri del job** (`{{job.parameters.data_rif}}`) sono disponibili a tutti i task; nei notebook si leggono con `dbutils.widgets.get("data_rif")`. Esistono anche riferimenti dinamici come `{{job.start_time.iso_date}}`.

## Compute del job

Ogni task può usare **serverless** o un **job cluster** condiviso tra i task dello stesso job (per evitare tempi di avvio multipli). Evita di far girare job di produzione su cluster all-purpose.

> Se un task di pulizia deve girare "anche quando i task precedenti falliscono", la risposta è la condizione **Run if = All done**.
