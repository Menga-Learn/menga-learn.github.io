## Funzioni finestra

Le funzioni finestra calcolano un valore per ogni riga guardando un insieme di righe correlate, **senza** raggrupparle.

~~~sql
SELECT id_cliente, data_ordine, importo,
       row_number() OVER (PARTITION BY id_cliente ORDER BY data_ordine DESC)          AS rn,
       sum(importo) OVER (PARTITION BY id_cliente ORDER BY data_ordine
                          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)          AS cumulato,
       avg(importo) OVER (PARTITION BY id_cliente ORDER BY data_ordine
                          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)                  AS media_mobile_7,
       lag(importo)  OVER (PARTITION BY id_cliente ORDER BY data_ordine)            AS precedente
FROM prod.silver.ordini
QUALIFY rn <= 3;           -- ultimi tre ordini per cliente
~~~

- `row_number`, `rank`, `dense_rank`: classifiche (con pari merito `rank` salta valori, `dense_rank` no).
- `lag`/`lead`: valore della riga precedente/successiva.
- La cornice `ROWS BETWEEN` definisce le righe considerate (cumulati, medie mobili).
- In PySpark: `Window.partitionBy(...).orderBy(...).rowsBetween(-6, 0)`.

Join avanzati da conoscere: **anti join** (`left_anti`, righe senza corrispondenza), **semi join** (`left_semi`, solo righe con corrispondenza, senza colonne di destra), join con condizioni di intervallo.

## Il tipo VARIANT

`VARIANT` memorizza dati semi-strutturati (JSON) in un formato binario efficiente, **senza** dover fissare lo schema e con prestazioni molto migliori del JSON come stringa.

~~~sql
CREATE TABLE prod.bronze.eventi (id BIGINT, payload VARIANT);
INSERT INTO prod.bronze.eventi SELECT id, parse_json(json_raw) FROM staging;

SELECT payload:utente.id::STRING                    AS id_utente,     -- notazione di percorso + cast
       variant_get(payload, '$.carrello.totale', 'DOUBLE') AS totale,
       try_variant_get(payload, '$.sconto', 'INT')  AS sconto,        -- NULL se il cast fallisce
       schema_of_variant(payload)                    AS schema
FROM prod.bronze.eventi;
~~~

- `parse_json(stringa)` → VARIANT (errore se il JSON non è valido; `try_parse_json` restituisce NULL).
- `variant_get(v, percorso, tipo)` estrae e converte; `try_variant_get` non genera errori.
- `variant_explode` trasforma array/oggetti in righe.
- Ideale nel bronze per payload che cambiano spesso; in silver si estraggono le colonne usate di frequente.

## Funzioni AI

Le **AI functions** richiamano modelli direttamente da SQL o PySpark, anche in una pipeline:

~~~sql
SELECT id_ticket,
       ai_classify(testo, ARRAY('fatturazione', 'consegna', 'reso', 'altro')) AS categoria,
       ai_analyze_sentiment(testo)                                          AS sentiment,
       ai_query('databricks-claude-sonnet-4',
                concat('Riassumi in una frase: ', testo))                   AS riassunto
FROM prod.silver.ticket;
~~~

- Funzioni specifiche: `ai_classify`, `ai_extract`, `ai_analyze_sentiment`, `ai_summarize`, `ai_translate`, `ai_mask`.
- **`ai_query`** è la più generale: interroga qualsiasi endpoint di Model Serving (modelli fondazionali o modelli propri) e può restituire output strutturato (`responseFormat`).
- Su grandi volumi in batch, le funzioni AI usano un'elaborazione ottimizzata per il throughput; conviene applicarle solo alle righe **nuove** (es. in una streaming table) per controllare i costi.

> "Estrarre campi da JSON con schema variabile in modo efficiente" → **VARIANT**; "classificare testi in una pipeline SQL" → **ai_classify** o **ai_query**.
