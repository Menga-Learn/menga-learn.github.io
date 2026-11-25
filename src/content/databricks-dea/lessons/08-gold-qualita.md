Lo strato **gold** espone dati pronti per BI e analisi. In Unity Catalog si può scegliere tra diversi oggetti.

## Oggetti per lo strato gold

| Oggetto | Cosa è | Quando usarlo |
|---|---|---|
| **Tabella** Delta | Dati materializzati scritti dal tuo codice | Controllo totale sulla logica di caricamento. |
| **Vista** | Query salvata, ricalcolata a ogni lettura | Logica leggera, dati sempre aggiornati, nessuno spazio occupato. |
| **Materialized view** | Risultato di una query **precalcolato** e aggiornato da Databricks, anche in modo incrementale | Aggregazioni costose lette spesso dalle dashboard. |
| **Streaming table** | Tabella alimentata in modo incrementale da una sorgente in streaming (ogni riga elaborata una volta) | Ingestione e trasformazioni append-only. |

~~~sql
CREATE OR REPLACE VIEW prod.gold.v_clienti_attivi AS
SELECT * FROM prod.silver.clienti WHERE attivo = true;

CREATE OR REPLACE MATERIALIZED VIEW prod.gold.vendite_mensili
SCHEDULE EVERY 1 HOUR
AS SELECT date_trunc('MONTH', data_ordine) AS mese, paese, SUM(importo) AS totale
   FROM prod.silver.ordini GROUP BY ALL;

CREATE OR REFRESH STREAMING TABLE prod.bronze.eventi
AS SELECT * FROM STREAM read_files('/Volumes/prod/landing/eventi', format => 'json');
~~~

Materialized view e streaming table si possono creare in Databricks SQL oppure dentro una **pipeline dichiarativa** (Lakeflow Spark Declarative Pipelines, già Delta Live Tables), che ne gestisce l'aggiornamento e le dipendenze.

## Controlli di qualità

In una pipeline dichiarativa la qualità si esprime con le **expectations**:

~~~sql
CREATE OR REFRESH STREAMING TABLE prod.silver.ordini (
  CONSTRAINT id_valido   EXPECT (id_ordine IS NOT NULL)  ON VIOLATION DROP ROW,
  CONSTRAINT importo_pos EXPECT (importo >= 0),
  CONSTRAINT data_valida EXPECT (data_ordine <= current_date()) ON VIOLATION FAIL UPDATE
) AS SELECT * FROM STREAM prod.bronze.ordini;
~~~

| Azione | Effetto sulla riga non valida |
|---|---|
| *(nessuna)* — warn | La riga viene **mantenuta**, la violazione è registrata nelle metriche |
| `DROP ROW` | La riga viene **scartata** e conteggiata |
| `FAIL UPDATE` | L'aggiornamento **si ferma** con errore |

Fuori dalle pipeline si possono usare i **vincoli** delle tabelle Delta: `ALTER TABLE t ADD CONSTRAINT importo_pos CHECK (importo >= 0)` (una scrittura che viola il vincolo fallisce) e `NOT NULL`. Per controlli più ricchi si scrivono query di validazione (conteggio di nulli, duplicati, valori fuori dominio) eseguite come task di un job, oppure si usa il monitoraggio della qualità dei dati.

> Per le domande: "mantenere le righe e solo registrarle" → expectation senza azione; "scartarle" → `DROP ROW`; "bloccare la pipeline" → `FAIL UPDATE`.
