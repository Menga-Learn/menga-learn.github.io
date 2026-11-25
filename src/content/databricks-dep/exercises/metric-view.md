## Scenario

Nel gold ci sono:

- `prod.gold.fct_vendite(id_ordine, sk_cliente, sk_prodotto, data_ordine, quantita, importo_netto, costo)`
- `prod.gold.dim_cliente(sk_cliente, paese, segmento)`
- `prod.gold.dim_prodotto(sk_prodotto, categoria)`

Ogni team calcola il **margine %** in modo diverso nelle proprie dashboard, e i numeri non tornano. Inoltre la dashboard principale aggrega ogni volta 3 miliardi di righe per mese e categoria ed è lenta.

## Consegna

1. Definisci una **metric view** con le dimensioni Mese, Paese, Segmento, Categoria e le misure Fatturato, Margine e Margine % (margine diviso fatturato).
2. Scrivi la query che mostra il Margine % per Categoria.
3. Risolvi il problema di lentezza della dashboard principale.

<!-- SOLUZIONE -->

~~~sql
CREATE OR REPLACE VIEW prod.gold.metriche_vendite
WITH METRICS
LANGUAGE YAML
AS $$
version: 1.1
source: prod.gold.fct_vendite
joins:
  - name: cliente
    source: prod.gold.dim_cliente
    on: source.sk_cliente = cliente.sk_cliente
  - name: prodotto
    source: prod.gold.dim_prodotto
    on: source.sk_prodotto = prodotto.sk_prodotto
dimensions:
  - name: Mese
    expr: date_trunc('MONTH', data_ordine)
  - name: Paese
    expr: cliente.paese
  - name: Segmento
    expr: cliente.segmento
  - name: Categoria
    expr: prodotto.categoria
measures:
  - name: Fatturato
    expr: SUM(importo_netto)
  - name: Margine
    expr: SUM(importo_netto - costo)
  - name: Margine %
    expr: SUM(importo_netto - costo) / SUM(importo_netto)
$$;
~~~

~~~sql
SELECT Categoria, MEASURE(`Margine %`) AS margine_perc
FROM prod.gold.metriche_vendite
GROUP BY Categoria
ORDER BY margine_perc DESC;
~~~

**Perché una metric view**: il Margine % è una misura **non additiva**: non si può sommare o mediare tra categorie. Definita nella metric view, viene ricalcolata correttamente a qualsiasi livello (categoria, paese, mese) e tutti i team usano la **stessa definizione governata**.

**Lentezza**: creare una **materialized view** aggregata per mese e categoria, letta dalla dashboard:

~~~sql
CREATE OR REPLACE MATERIALIZED VIEW prod.gold.mv_vendite_mese_categoria AS
SELECT date_trunc('MONTH', f.data_ordine) AS mese, p.categoria,
       SUM(f.importo_netto) AS fatturato, SUM(f.importo_netto - f.costo) AS margine
FROM prod.gold.fct_vendite f JOIN prod.gold.dim_prodotto p ON f.sk_prodotto = p.sk_prodotto
GROUP BY ALL;
~~~

La dashboard legge poche migliaia di righe precalcolate (il Margine % si ricava come `margine / fatturato`), e la materialized view si aggiorna in modo incrementale quando possibile. A livello fisico, il Liquid Clustering della tabella dei fatti su `data_ordine` aiuta le query filtrate per periodo.
