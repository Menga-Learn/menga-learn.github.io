Il monitoraggio serve a poco se nessuno viene avvisato. Il Professional richiede di costruire **alert** sui segnali giusti e di automatizzare i controlli con **API**, **CLI** e **SDK**.

## Alert in Databricks SQL

Un **alert** esegue periodicamente una query e invia una notifica quando il risultato soddisfa una condizione.

~~~sql
-- percentuale di job falliti nelle ultime 24 ore
SELECT 100.0 * count_if(result_state = 'FAILED') / count(*) AS perc_falliti
FROM system.lakeflow.job_run_timeline
WHERE period_start_time >= now() - INTERVAL 24 HOURS;
~~~

Condizione: `perc_falliti > 5` → notifica via email, Slack, Teams, PagerDuty o webhook. Gli alert possono essere anche **task di un job**, e il loro risultato può guidare una diramazione **if/else**.

## Cosa monitorare

| Segnale | Fonte | Esempio di alert |
|---|---|---|
| **Metriche governate** | Metric view, tabelle gold | Fatturato giornaliero sotto la media del 30% |
| **Qualità e anomalie dei dati** | Data quality monitoring (freschezza e completezza), event log | Tabella non aggiornata da più di 6 ore; aumento dei record scartati |
| **Utilizzo e costi** | `system.billing.usage` | Consumo DBU di un progetto oltre il budget settimanale |
| **Salute di SQL warehouse e query** | `system.query.history`, `system.compute.warehouse_events` | Query con durata > 10 minuti, code prolungate |
| **Audit e sicurezza** | `system.access.audit` | Concessione di privilegi su schemi sensibili, accessi negati ripetuti |
| **Qualità degli agenti AI** | Tabelle di valutazione e monitoraggio degli agenti | Punteggio di correttezza sotto soglia |
| **Job** | Notifiche del job, `system.lakeflow` | Durata oltre la soglia, task falliti |

Il **monitoraggio della qualità dei dati** di Unity Catalog (detto anche *anomaly detection*) controlla automaticamente **freschezza** e **completezza** delle tabelle di uno schema, imparando i pattern storici; il *data profiling* calcola statistiche e drift nel tempo.

## Monitorare con API, CLI e SDK

~~~bash
databricks jobs list-runs --job-id 123 --limit 10
databricks jobs get-run 456789
databricks pipelines list-updates <pipeline-id>
~~~

~~~python
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()
for run in w.jobs.list_runs(job_id=123, limit=20):
    stato = run.state.result_state
    durata_min = (run.end_time - run.start_time) / 60000 if run.end_time else None
    print(run.run_id, stato, durata_min)
~~~

Le **Jobs API** (`/api/2.2/jobs/runs/list`, `/runs/get`) restituiscono stato, durata, task e motivi di errore: utili per integrare Databricks con strumenti esterni di osservabilità.

## Lakeflow Jobs UI

Per un singolo job l'interfaccia mostra: matrice dei run, grafico delle durate, metriche dei task (durata, tentativi), stato del compute e link a log e Spark UI. Si impostano **soglie di durata** e notifiche per errore, successo o superamento della durata attesa.

> Per un controllo centralizzato su **tutti** i job dell'account si interrogano le **system tables**; per automatizzare azioni (riavvio, ticket) si usano **SDK/API**.
