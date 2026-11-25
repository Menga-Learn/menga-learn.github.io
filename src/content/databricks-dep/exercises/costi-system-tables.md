## Scenario

La direzione chiede un controllo settimanale dei costi della piattaforma. Tutti i job hanno il tag personalizzato `team`.

## Consegna

Scrivi le query SQL sulle system tables per:

1. il **costo stimato** a prezzo di listino per `team` negli ultimi 30 giorni;
2. i 10 **job** con più esecuzioni fallite negli ultimi 7 giorni, con il numero di fallimenti;
3. un **alert**: quale query e quale condizione useresti per essere avvisato se il consumo DBU di ieri supera del 50% la media giornaliera dei 30 giorni precedenti?

<!-- SOLUZIONE -->

~~~sql
-- 1. costo per team
SELECT u.custom_tags['team'] AS team,
       ROUND(SUM(u.usage_quantity * p.pricing.default), 2) AS costo_listino
FROM system.billing.usage u
JOIN system.billing.list_prices p
  ON u.sku_name = p.sku_name
 AND u.usage_start_time >= p.price_start_time
 AND (p.price_end_time IS NULL OR u.usage_start_time < p.price_end_time)
WHERE u.usage_date >= current_date() - INTERVAL 30 DAYS
GROUP BY ALL
ORDER BY costo_listino DESC;
~~~

~~~sql
-- 2. job con più fallimenti
SELECT r.job_id,
       any_value(j.name)                  AS nome_job,
       count_if(r.result_state = 'FAILED') AS fallimenti
FROM system.lakeflow.job_run_timeline r
LEFT JOIN system.lakeflow.jobs j
  ON r.workspace_id = j.workspace_id AND r.job_id = j.job_id
WHERE r.period_start_time >= current_date() - INTERVAL 7 DAYS
GROUP BY r.job_id
HAVING fallimenti > 0
ORDER BY fallimenti DESC
LIMIT 10;
~~~

~~~sql
-- 3. query dell'alert
WITH giornaliero AS (
  SELECT usage_date, SUM(usage_quantity) AS dbu
  FROM system.billing.usage
  WHERE usage_date >= current_date() - INTERVAL 31 DAYS
  GROUP BY usage_date
)
SELECT
  MAX(CASE WHEN usage_date = current_date() - INTERVAL 1 DAY THEN dbu END) /
  AVG(CASE WHEN usage_date < current_date() - INTERVAL 1 DAY THEN dbu END) AS rapporto
FROM giornaliero;
~~~

Condizione dell'alert: **`rapporto > 1.5`**, pianificato ogni mattina, con notifica al canale del team piattaforma.

**Note**

- I prezzi di listino non includono sconti contrattuali: il valore è una **stima**. La tabella `list_prices` ha periodi di validità, per questo il join usa `price_start_time` e `price_end_time`.
- La tabella `jobs` è di tipo SCD (una riga per modifica): nella query 2 `any_value` evita duplicati; per il nome più recente si filtrerebbe l'ultima versione.
- I tag personalizzati dei job e del compute finiscono in `custom_tags` e sono la base per attribuire i costi.
