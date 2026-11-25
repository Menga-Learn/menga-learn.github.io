In produzione i job si creano e si gestiscono come codice: dall'interfaccia per prototipare, poi con **API REST**, **Databricks CLI**, **SDK** o bundle.

## Tre modi di creare e automatizzare un job

| Strumento | Esempio |
|---|---|
| **Interfaccia** | Jobs & Pipelines → Crea job; utile per prototipi, poi "View as code" restituisce lo YAML |
| **REST API** | `POST /api/2.2/jobs/create`, `POST /api/2.2/jobs/run-now`, `GET /api/2.2/jobs/runs/get` |
| **CLI** | `databricks jobs create --json @job.json`, `databricks jobs run-now 123`, `databricks jobs list` |
| **SDK Python** | `WorkspaceClient().jobs.run_now(job_id=123).result()` |
| **Bundle** | `resources.jobs` in YAML, `databricks bundle deploy` — la scelta consigliata per la CI/CD |

## Flusso di controllo

- **If/else condition**: confronta valori (parametri, task values, `{{job.trigger.type}}`...) e sceglie il ramo `true`/`false`.
- **For each**: ripete un task annidato su una lista (statica o prodotta da un task precedente come task value), con **concorrenza** massima configurabile. Ogni iterazione riceve `{{input}}`.
- **Run if**: condizioni sulle dipendenze (`All succeeded`, `All done`, `At least one failed`...).
- **Run job**: richiama un altro job, per riusare flussi comuni.

~~~yaml
tasks:
  - task_key: elenco_paesi
    notebook_task: { notebook_path: ./src/elenco_paesi.py }
  - task_key: per_paese
    depends_on: [{ task_key: elenco_paesi }]
    for_each_task:
      inputs: "{{tasks.elenco_paesi.values.paesi}}"
      concurrency: 5
      task:
        task_key: elabora_paese
        notebook_task:
          notebook_path: ./src/elabora.py
          base_parameters: { paese: "{{input}}" }
~~~

## Compute e configurazione

- **Serverless per job**: ambienti con versione e dipendenze dichiarate; **modalità di prestazioni**: *performance optimized* (avvio e esecuzione più rapidi) o *standard* (costo minore, avvio più lento, adatta a job batch non urgenti).
- **Job cluster classico**: tipo di nodi, autoscaling, runtime, librerie, script di init. Per task che richiedono molta memoria (es. notebook che usano pandas su dati grandi) si sceglie un tipo di nodo con più memoria, o sul serverless un ambiente con memoria maggiore.
- **Retry**: per errori transitori. Attenzione ai task **non idempotenti** (es. che inviano email o scrivono in append senza controlli): un retry può duplicare gli effetti. In questi casi si disattivano i retry automatici.
- **Timeout** e **soglie di durata**: evitano job bloccati che consumano risorse.
- **Code** (*queueing*) e **max concurrent runs** per gestire esecuzioni sovrapposte.

## Parametri

I **parametri del job** sono passati a tutti i task e si possono **sovrascrivere** all'avvio (`run-now` con `job_parameters`) o durante una riparazione. Riferimenti dinamici utili: `{{job.id}}`, `{{job.run_id}}`, `{{job.start_time.iso_date}}`, `{{tasks.<task>.values.<chiave>}}`.

> Se un job deve "girare per ogni elemento di una lista prodotta a runtime", la risposta è **For each** con `inputs` da un task value; se deve "scegliere un ramo in base a un valore", **If/else condition**.
