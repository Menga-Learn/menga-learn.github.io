Per monitorare costi, utilizzo e salute dei carichi a livello di account si usano le **system tables** e, per le pipeline, l'**event log**.

## System tables

Sono tabelle in sola lettura nel catalog `system`, gestite da Databricks e interrogabili con SQL.

| Tabella | Contenuto | Esempio d'uso |
|---|---|---|
| `system.billing.usage` | Consumo in DBU per risorsa, SKU, tag, utente | Costo per job, team o progetto |
| `system.billing.list_prices` | Prezzi di listino per SKU | Trasformare DBU in valuta |
| `system.access.audit` | Eventi di audit: chi ha fatto cosa e quando | Chi ha modificato i permessi di una tabella |
| `system.access.table_lineage`, `column_lineage` | Lineage di tabelle e colonne | Impatto di una modifica |
| `system.compute.clusters`, `node_timeline` | Configurazione e utilizzo dei cluster | Cluster sovradimensionati |
| `system.compute.warehouse_events` | Eventi dei SQL warehouse | Scalabilità e avvii |
| `system.query.history` | Storico delle query su SQL warehouse e serverless | Query più lente o costose |
| `system.lakeflow.jobs`, `job_tasks`, `job_run_timeline`, `job_task_run_timeline` | Definizioni ed esecuzioni dei job | Tasso di errore e durata dei job |

~~~sql
-- costo per job negli ultimi 30 giorni
SELECT u.usage_metadata.job_id,
       SUM(u.usage_quantity * p.pricing.default) AS costo_stimato
FROM system.billing.usage u
JOIN system.billing.list_prices p
  ON u.sku_name = p.sku_name
 AND u.usage_start_time >= p.price_start_time
 AND (p.price_end_time IS NULL OR u.usage_start_time < p.price_end_time)
WHERE u.usage_date >= current_date() - INTERVAL 30 DAYS
  AND u.usage_metadata.job_id IS NOT NULL
GROUP BY ALL
ORDER BY costo_stimato DESC;
~~~

Le system tables si abilitano per schema da un amministratore dell'account; l'accesso si concede con i normali privilegi di Unity Catalog. I **tag** personalizzati su cluster, job e pipeline compaiono in `custom_tags` e permettono di attribuire i costi per centro di costo.

## Event log delle pipeline

Ogni pipeline dichiarativa scrive un **event log** con avanzamento, lineage, metriche di qualità, errori e informazioni sul compute.

~~~sql
SELECT timestamp, event_type, message
FROM event_log(TABLE(prod.silver.ordini))      -- oppure event_log('<pipeline-id>')
WHERE level IN ('WARN', 'ERROR')
ORDER BY timestamp DESC;
~~~

Tipi di evento utili: `flow_progress` (righe elaborate, qualità), `update_progress` (stato dell'aggiornamento), `cluster_resources` (autoscaling), `planning_information` (motivo per cui una materialized view è stata aggiornata in modo incrementale o completo), `user_action` (chi ha avviato o modificato la pipeline).

~~~sql
SELECT e.expectation.name, SUM(e.expectation.passed_records) AS ok, SUM(e.expectation.failed_records) AS ko
FROM (
  SELECT explode(from_json(details:flow_progress.data_quality.expectations,
         'ARRAY<STRUCT<name STRING, dataset STRING, passed_records INT, failed_records INT>>')) AS expectation
  FROM event_log(TABLE(prod.silver.ordini))
  WHERE event_type = 'flow_progress'
) e
GROUP BY ALL;
~~~

L'event log può anche essere **pubblicato** come tabella in Unity Catalog dalle impostazioni della pipeline, per interrogarlo come qualsiasi tabella.

> "Quanto costa ogni job?" → `system.billing.usage`; "chi ha cancellato la tabella?" → `system.access.audit`; "quante righe ha scartato l'expectation?" → **event log**.
