## Scenario

La tabella `dev.bronze.ordini` contiene:

`id_ordine` (string), `id_cliente` (string), `data_ordine` (string `yyyy-MM-dd`), `righe` (array di struct `{prodotto: string, qta: int, prezzo: double}`), `paese` (string), `caricato_il` (timestamp)

Problemi:

- lo stesso ordine può essere arrivato più volte: va tenuta la versione con `caricato_il` più recente;
- alcuni ordini non hanno `id_cliente` e vanno scartati;
- `paese` a volte è nullo: va sostituito con `'ND'`.

## Consegna

1. Scrivi in **Spark SQL** la query che crea la tabella `dev.silver.righe_ordine` con **una riga per prodotto** (`id_ordine`, `id_cliente`, `data_ordine` di tipo `DATE`, `paese`, `prodotto`, `qta`, `importo_riga = qta * prezzo`).
2. Scrivi la query che calcola per paese il totale venduto e il numero **approssimato** di clienti distinti.

<!-- SOLUZIONE -->

~~~sql
CREATE OR REPLACE TABLE dev.silver.righe_ordine AS
WITH ultimi AS (
  SELECT *
  FROM dev.bronze.ordini
  WHERE id_cliente IS NOT NULL
  QUALIFY row_number() OVER (PARTITION BY id_ordine ORDER BY caricato_il DESC) = 1
)
SELECT
  id_ordine,
  id_cliente,
  to_date(data_ordine, 'yyyy-MM-dd') AS data_ordine,
  coalesce(paese, 'ND')              AS paese,
  r.prodotto,
  r.qta,
  r.qta * r.prezzo                   AS importo_riga
FROM ultimi
LATERAL VIEW explode(righe) t AS r;
~~~

~~~sql
SELECT paese,
       SUM(importo_riga)                  AS totale,
       approx_count_distinct(id_cliente)  AS clienti_stimati
FROM dev.silver.righe_ordine
GROUP BY paese
ORDER BY totale DESC;
~~~

**Note**

- `QUALIFY` filtra sul risultato della funzione finestra senza una sottoquery in più.
- `explode` produce una riga per ogni elemento dell'array; se ci fossero ordini con array vuoto da conservare servirebbe `explode_outer` (`LATERAL VIEW OUTER`).
- In PySpark la stessa logica si scrive con `Window.partitionBy("id_ordine").orderBy(F.desc("caricato_il"))`, `F.row_number()`, `F.explode("righe")` e `F.approx_count_distinct`.
