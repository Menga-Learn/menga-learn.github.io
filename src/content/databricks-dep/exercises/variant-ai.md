## Scenario

La tabella `prod.bronze.recensioni` contiene la colonna `payload` di tipo **VARIANT** con JSON di questo tipo (lo schema varia tra le versioni dell'app):

~~~json
{"id": 8812, "prodotto": {"sku": "TV-55", "categoria": "TV"}, "voto": "4", "testo": "Ottima immagine ma consegna in ritardo", "app": {"versione": "3.2"}}
~~~

Requisiti per `prod.silver.recensioni`:

1. estrarre `id` (BIGINT), `sku`, `categoria`, `voto` come INT (alcune versioni lo inviano come testo non numerico: in quel caso NULL) e `testo`;
2. aggiungere il **sentiment** del testo e una **categoria del problema** tra `prodotto`, `consegna`, `assistenza`, `prezzo`, `nessuno`;
3. elaborare con le funzioni AI solo le recensioni **nuove**, per contenere i costi.

## Consegna

Scrivi in SQL la definizione della tabella silver come streaming table di una pipeline dichiarativa.

<!-- SOLUZIONE -->

~~~sql
CREATE OR REFRESH STREAMING TABLE prod.silver.recensioni (
  CONSTRAINT id_valido EXPECT (id IS NOT NULL) ON VIOLATION DROP ROW
) AS
SELECT
  payload:id::BIGINT                                   AS id,
  payload:prodotto.sku::STRING                         AS sku,
  payload:prodotto.categoria::STRING                   AS categoria,
  try_variant_get(payload, '$.voto', 'INT')            AS voto,
  payload:testo::STRING                                AS testo,
  ai_analyze_sentiment(payload:testo::STRING)          AS sentiment,
  ai_classify(payload:testo::STRING,
              ARRAY('prodotto', 'consegna', 'assistenza', 'prezzo', 'nessuno')) AS area_problema
FROM STREAM(prod.bronze.recensioni);
~~~

**Perché queste scelte**

- La notazione `payload:campo.sottocampo::TIPO` estrae e converte valori dal VARIANT senza dover dichiarare lo schema completo.
- `try_variant_get` restituisce **NULL** se la conversione fallisce (voto `"quattro"`), dove un cast normale genererebbe un errore.
- Una **streaming table** elabora ogni riga in input **una sola volta**: le funzioni AI vengono chiamate solo per le recensioni nuove. Una materialized view potrebbe ricalcolarle in caso di refresh completo.
- Per esigenze più complesse (es. risposta in JSON strutturato o un modello specifico) si usa `ai_query('<endpoint>', prompt, responseFormat => ...)`.
