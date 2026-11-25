## Layout fisico scalabile

Un buon layout parte dalla **granularità** dei dati e dai **pattern di accesso**:

| Decisione | Linee guida |
|---|---|
| **Partizionamento** | Solo se la colonna corrisponde a una granularità naturale e grossolana (es. `data` su tabelle di molti TB) e ogni partizione contiene almeno ~1 GB. Mai su colonne ad alta cardinalità. |
| **Clustering** | Liquid Clustering sulle colonne più usate nei filtri e nei join (fino a 4), oppure `CLUSTER BY AUTO`. |
| **Dimensione dei file** | Evitare file troppo piccoli (overhead) o troppo grandi (poco parallelismo): compattazione con `OPTIMIZE`, scritture ottimizzate e auto compaction, o Predictive Optimization. |
| **Formato** | Delta di default; **Iceberg** (gestito da UC o tramite UniForm) quando altri motori devono leggere e scrivere la tabella. |

Esempio: una tabella di eventi da 50 TB, interrogata per giorno e per cliente. Una scelta ragionevole è il Liquid Clustering su `(data_evento, id_cliente)`; partizionare per `id_cliente` creerebbe milioni di cartelle.

## Modelli dimensionali

Lo schema a stella resta il modello di riferimento per lo strato gold: **fatti** (eventi misurabili, chiavi esterne, misure) e **dimensioni** (attributi descrittivi, chiavi surrogate, storicizzazione SCD).

~~~sql
CREATE TABLE prod.gold.dim_cliente (
  sk_cliente BIGINT GENERATED ALWAYS AS IDENTITY,
  id_cliente STRING NOT NULL,
  nome STRING, citta STRING,
  valido_dal TIMESTAMP, valido_al TIMESTAMP,
  CONSTRAINT pk_dim_cliente PRIMARY KEY (sk_cliente) RELY
);
~~~

- Le colonne `IDENTITY` generano chiavi surrogate.
- I vincoli `PRIMARY KEY` e `FOREIGN KEY` sono **informativi** (non applicati), ma con `RELY` l'ottimizzatore li usa per semplificare le query.

## Materialized view per aggregazioni precalcolate

~~~sql
CREATE OR REPLACE MATERIALIZED VIEW prod.gold.vendite_mese_paese AS
SELECT date_trunc('MONTH', f.data_ordine) AS mese, c.paese, SUM(f.importo) AS fatturato, COUNT(*) AS ordini
FROM prod.gold.fct_ordini f JOIN prod.gold.dim_cliente c ON f.sk_cliente = c.sk_cliente
GROUP BY ALL;
~~~

Le dashboard leggono il risultato già calcolato; l'aggiornamento è **incrementale** quando la query lo consente (vedi `planning_information` nell'event log).

## Metric view

Le **metric view** di Unity Catalog definiscono **una volta** misure e dimensioni governate e riutilizzabili da dashboard, Genie, SQL e strumenti BI:

~~~sql
CREATE VIEW prod.gold.metriche_vendite
WITH METRICS
LANGUAGE YAML
AS $$
version: 1.1
source: prod.gold.fct_ordini
joins:
  - name: cliente
    source: prod.gold.dim_cliente
    on: source.sk_cliente = cliente.sk_cliente
dimensions:
  - name: Mese
    expr: date_trunc('MONTH', data_ordine)
  - name: Paese
    expr: cliente.paese
measures:
  - name: Fatturato
    expr: SUM(importo)
  - name: Valore medio ordine
    expr: SUM(importo) / COUNT(DISTINCT id_ordine)
$$;

SELECT Paese, MEASURE(Fatturato), MEASURE(`Valore medio ordine`)
FROM prod.gold.metriche_vendite
GROUP BY Paese;
~~~

| Oggetto | Quando |
|---|---|
| **Materialized view** | Precalcolare un'aggregazione costosa letta spesso |
| **Metric view** | Definire una volta la logica delle metriche (anche non additive, come rapporti e medie) e riusarla con qualsiasi raggruppamento |

> Una misura come "valore medio ordine" non si può sommare tra paesi: la metric view la ricalcola correttamente a ogni livello di aggregazione.
