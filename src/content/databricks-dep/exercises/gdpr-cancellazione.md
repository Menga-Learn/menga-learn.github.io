## Scenario

Un cliente esercita il **diritto alla cancellazione**. I suoi dati si trovano in:

- `prod.bronze.ordini_raw` (JSON grezzo, colonna `payload`, contiene l'email);
- `prod.silver.clienti` (deletion vectors attivi, Change Data Feed attivo);
- `prod.gold.vendite_cliente` (materialized view aggregata per `id_cliente`).

La normativa interna richiede l'eliminazione **fisica** entro 30 giorni. La conservazione dei file eliminati è quella predefinita.

## Consegna

1. Progetta il processo, in SQL, per gestire le richieste in modo ripetibile.
2. Spiega perché un semplice `DELETE` non basta e come dimostrare di aver completato la cancellazione.
3. Proponi una modifica di progetto che renda più semplici le cancellazioni future.

<!-- SOLUZIONE -->

**1. Processo** (job pianificato ogni settimana)

~~~sql
-- richieste in una tabella dedicata, con stato
-- prod.privacy.richieste(id_cliente, email, ricevuta_il, completata_il)

DELETE FROM prod.bronze.ordini_raw
WHERE payload:cliente.email::STRING IN
      (SELECT email FROM prod.privacy.richieste WHERE completata_il IS NULL);

DELETE FROM prod.silver.clienti
WHERE id_cliente IN (SELECT id_cliente FROM prod.privacy.richieste WHERE completata_il IS NULL);

-- rimozione fisica delle righe marcate dai deletion vectors
REORG TABLE prod.silver.clienti APPLY (PURGE);

-- aggiornamento della materialized view, che ricalcola senza i dati eliminati
REFRESH MATERIALIZED VIEW prod.gold.vendite_cliente;

-- eliminazione dei file non più referenziati (anche dei file del CDF)
VACUUM prod.bronze.ordini_raw;
VACUUM prod.silver.clienti;

UPDATE prod.privacy.richieste SET completata_il = current_timestamp() WHERE completata_il IS NULL;
~~~

**2. Perché il DELETE non basta**

- Il time travel conserva le versioni precedenti finché `VACUUM` non elimina i file (7 giorni dopo, con la conservazione predefinita).
- Con i deletion vectors i dati restano nei file Parquet finché non vengono riscritti (`REORG ... PURGE` o `OPTIMIZE`).
- Il **Change Data Feed** conserva le immagini delle righe eliminate fino al `VACUUM`.

Con conservazione di 7 giorni e job settimanale, l'eliminazione fisica avviene entro circa 14 giorni: dentro i 30 richiesti. Come prova si conservano la tabella delle richieste con le date, la cronologia delle tabelle (`DESCRIBE HISTORY` con le operazioni DELETE, REORG e VACUUM) e gli audit log.

**3. Miglioramento**: **pseudonimizzare** i dati personali già nel silver, con una tabella di mappatura `id_cliente ↔ dati personali` separata e protetta. Per cancellare basta eliminare la riga di mappatura (e i dati grezzi in bronze, conservati per poco tempo): i dati a valle diventano anonimi. Taggare le colonne PII aiuta a trovarle tutte con `information_schema.column_tags`.
