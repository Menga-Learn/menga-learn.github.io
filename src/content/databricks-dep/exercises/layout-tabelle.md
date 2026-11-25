## Scenario

Il team piattaforma di **Fabrikam Energia** deve rivedere quattro tabelle Delta:

1. `misure_contatori` (80 TB, tabella esterna): partizionata per `id_contatore` (4 milioni di valori). Le query filtrano per intervallo di date e talvolta per contatore. Ci sono milioni di file da pochi KB.
2. `clienti` (40 GB, gestita): riceve ogni ora un `MERGE` dal CDC che modifica poche centinaia di righe sparse; ogni MERGE riscrive decine di GB.
3. `eventi_app` (6 TB, gestita): gli analisti cambiano spesso il modo in cui la interrogano; nessuno ha tempo di analizzare i pattern di query.
4. `fatture_silver` (2 TB, gestita): un job a valle rilegge **ogni notte tutta la tabella** per trovare le fatture modificate e aggiornare il gold.

Per tutte, oggi un job notturno esegue `OPTIMIZE` e `VACUUM` a mano.

## Consegna

Per ogni tabella proponi gli interventi e motiva la scelta. Indica cosa fare del job di manutenzione.

<!-- SOLUZIONE -->

| # | Interventi | Motivo |
|---|---|---|
| 1 | Convertire in **tabella gestita**; ricreare il layout con **Liquid Clustering** su `(data_misura, id_contatore)` al posto del partizionamento | Partizionare su una colonna ad altissima cardinalità genera milioni di file minuscoli. Il clustering supporta più colonne di filtro e la compattazione incrementale. |
| 2 | Abilitare i **deletion vectors** (`delta.enableDeletionVectors = true`) ed eventualmente clustering su `id_cliente` | Il MERGE marca le righe modificate invece di riscrivere interi file; il clustering per chiave riduce i file toccati. |
| 3 | `ALTER TABLE eventi_app CLUSTER BY AUTO` | Databricks sceglie e aggiorna le chiavi di clustering in base alle query reali, senza analisi manuale. |
| 4 | Abilitare il **Change Data Feed** su `fatture_silver`; il job a valle legge `table_changes` o `readChangeFeed` in streaming | Si elaborano solo le righe inserite, aggiornate o eliminate invece di rileggere 2 TB. |

**Job di manutenzione**: abilitare la **Predictive Optimization** sullo schema o sul catalog. Su tabelle gestite esegue `OPTIMIZE`, `VACUUM` e `ANALYZE` quando serve; il job manuale si può eliminare, riducendo il compute sprecato in ottimizzazioni inutili.

**Verifica**: nel **query profile** delle query tipiche controlla il numero di file potati (*files pruned*) e i byte letti prima e dopo; per il MERGE confronta i byte scritti nella cronologia della tabella (`DESCRIBE HISTORY`, metriche `operationMetrics`).
