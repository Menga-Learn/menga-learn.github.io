Interrogare e analizzare i dati è una competenza trasversale del DP-600. Si parte da **T-SQL** e dall'**editor di query visivo**, disponibili sia nel warehouse sia nell'endpoint SQL del lakehouse.

## Editor di query visivo

L'**editor di query visivo** permette di costruire query senza scrivere codice, trascinando tabelle sulla tela e applicando passaggi in stile Power Query: scegliere colonne, filtrare, raggruppare, unire (merge) e accodare tabelle.

- È pensato per utenti che non conoscono SQL.
- Mostra un'anteprima del risultato e permette di **vedere l'SQL generato**.
- Il risultato può essere salvato come **vista** o aperto in Excel.

## Le basi di T-SQL per l'analisi

```sql
SELECT TOP (10)
       p.Categoria,
       SUM(f.Importo)            AS Ricavo,
       COUNT(DISTINCT f.IdOrdine) AS NumeroOrdini
FROM gold.FattVendite AS f
JOIN gold.DimProdotto AS p ON p.ChiaveProdotto = f.ChiaveProdotto
WHERE f.DataOrdine >= '2025-01-01'
GROUP BY p.Categoria
HAVING SUM(f.Importo) > 10000
ORDER BY Ricavo DESC;
```

Ricorda l'ordine logico di esecuzione: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`. Per questo un alias definito in `SELECT` si può usare in `ORDER BY` ma non in `WHERE`.

## Funzioni finestra

Le funzioni finestra calcolano valori su un gruppo di righe **senza comprimerle**:

```sql
SELECT Categoria, Mese, Ricavo,
       SUM(Ricavo) OVER (PARTITION BY Categoria ORDER BY Mese
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RicavoProgressivo,
       LAG(Ricavo) OVER (PARTITION BY Categoria ORDER BY Mese)             AS RicavoMesePrecedente,
       RANK()      OVER (PARTITION BY Mese ORDER BY Ricavo DESC)           AS Posizione
FROM gold.VenditeMensili;
```

- `ROW_NUMBER()` numera in modo univoco; `RANK()` lascia buchi in caso di pari merito; `DENSE_RANK()` no.
- `LAG` / `LEAD` leggono la riga precedente o successiva: perfetti per variazioni mese su mese.

## CTE e subquery

Le **CTE** (`WITH nome AS (...)`) rendono leggibili le query in più passaggi, ad esempio "prima calcola il ricavo per cliente, poi tieni i primi 10 per regione".

## Monitorare le query

Nel warehouse le viste `queryinsights.exec_requests_history` e `queryinsights.long_running_queries` aiutano a trovare le query lente e frequenti, utile per decidere dove creare tabelle aggregate.

## Quale motore uso?

| Dove sono i dati | Linguaggio |
|---|---|
| Warehouse / endpoint SQL del lakehouse | T-SQL (o editor visivo) |
| Eventhouse / database KQL | KQL (anche T-SQL di base è supportato) |
| Modello semantico | DAX |
| File e tabelle del lakehouse da notebook | Spark SQL / PySpark |
