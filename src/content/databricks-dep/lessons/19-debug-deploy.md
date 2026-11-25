## Strumenti di diagnosi

| Strumento | Cosa mostra | Quando |
|---|---|---|
| **Spark UI** | Job, stage, task, shuffle, spill, piano fisico (scheda SQL/DataFrame) | Prestazioni di notebook e job su compute classico |
| **Query profile** | Piano con metriche per operatore | Query su SQL warehouse e compute serverless |
| **Log del cluster** | Log del driver (stdout, stderr, log4j), log degli executor, eventi del cluster, log degli script di init | Errori di avvio, librerie, eccezioni |
| **System tables** | Storico di job, query, compute e costi | Analisi su molti run o tendenze |
| **Event log** | Avanzamento e errori delle pipeline dichiarative | Pipeline fallite o lente |

I log del cluster si possono inviare in modo permanente a un volume o a un percorso (*cluster log delivery*), utile perché i log di un job cluster spariscono con il cluster.

## Analizzare un job fallito

1. Dalla pagina del run, individua il **primo task fallito** nel grafo (i successivi saranno *upstream failed*).
2. Leggi il messaggio di errore e lo **stack trace**: spesso la causa vera è l'ultima eccezione *Caused by*.
3. Classifica l'errore:
   - **dati** (schema cambiato, valori nulli inattesi, file corrotti),
   - **codice** (bug, libreria),
   - **ambiente** (permessi, compute, rete, quota),
   - **transitorio** (timeout).
4. Correggi la causa e usa **Repair run**.

## Repair run e override dei parametri

**Repair run** riesegue solo i task falliti, annullati o saltati e quelli che ne dipendono. Durante la riparazione si possono **sovrascrivere i parametri** del job, per esempio per rielaborare una data specifica:

~~~bash
databricks jobs repair-run 987654 --rerun-all-failed-tasks \
  --json '{"job_parameters": {"data_rif": "2026-11-20"}}'
~~~

Si possono anche indicare task specifici da rieseguire (`rerun_tasks`). Un nuovo **run now** con parametri diversi è invece un'esecuzione completa e separata.

## Deploy con i bundle

I **Declarative Automation Bundles** sono il modo consigliato per distribuire job, pipeline, dashboard, modelli e permessi:

~~~yaml
targets:
  prod:
    mode: production
    workspace:
      host: https://adb-222.azuredatabricks.net
      root_path: /Workspace/Shared/.bundle/${bundle.name}/${bundle.target}
    run_as:
      service_principal_name: 8f2a-...-sp-produzione
    permissions:
      - group_name: data-engineers
        level: CAN_VIEW
~~~

- `run_as` definisce l'identità con cui girano i job: in produzione un **service principal**.
- `permissions` assegna i permessi sulle risorse distribuite.
- `databricks bundle deploy` è idempotente: aggiorna ciò che è cambiato; `bundle summary` mostra le risorse distribuite.

## Git folders e CI/CD

- Gli sviluppatori lavorano in **Git folders** personali su branch di funzionalità.
- La CI (GitHub Actions, Azure Pipelines...) esegue test e `bundle validate`; dopo il merge esegue `bundle deploy` nei target successivi.
- In alternativa ai bundle, una pipeline può aggiornare una **Git folder di produzione** con la CLI/API (`databricks repos update ... --branch main`) prima di eseguire i job. È più semplice ma non gestisce le definizioni dei job come codice.
- L'autenticazione della CI avviene con un **service principal** (OAuth, idealmente con federazione dei token del provider CI, senza segreti di lunga durata).

> "Rieseguire solo il task fallito con una data diversa" → **Repair run** con override dei parametri; "il job di produzione deve girare con un'identità non personale" → `run_as` **service principal**.
