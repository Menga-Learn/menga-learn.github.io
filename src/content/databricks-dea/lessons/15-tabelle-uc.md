In Unity Catalog una tabella può essere **gestita** (*managed*) o **esterna** (*external*). La differenza sta in chi gestisce i file e cosa succede quando la tabella viene eliminata.

## Gestite ed esterne

| | Tabella gestita | Tabella esterna |
|---|---|---|
| Posizione dei file | Storage gestito del metastore, catalog o schema | Percorso indicato con `LOCATION` in una **external location** |
| `DROP TABLE` | Elimina metadati **e** dati (recuperabile con `UNDROP` per un periodo limitato) | Elimina **solo** i metadati; i file restano |
| Formato | Delta (o Iceberg gestito) | Delta, Parquet, CSV, JSON, ... |
| Ottimizzazioni automatiche | Predictive Optimization, statistiche, caching | Limitate |
| Quando | **Scelta predefinita e consigliata** | Dati già esistenti in un percorso usato anche da altri sistemi |

~~~sql
-- gestita
CREATE TABLE prod.silver.clienti (id BIGINT, nome STRING, paese STRING);

-- esterna
CREATE TABLE prod.bronze.log_legacy
LOCATION 'abfss://legacy@contoso.dfs.core.windows.net/log/';
~~~

## Oggetti per l'accesso allo storage

- **Storage credential**: rappresenta un'identità cloud (es. managed identity di Azure, ruolo IAM di AWS).
- **External location**: unisce un percorso cloud a una storage credential. Si concedono permessi come `READ FILES`, `WRITE FILES`, `CREATE EXTERNAL TABLE`.
- I **volumi** (gestiti o esterni) servono per i file non tabellari.

## Modificare, eliminare, convertire

~~~sql
ALTER TABLE prod.silver.clienti ADD COLUMN email STRING;
ALTER TABLE prod.silver.clienti RENAME COLUMN nome TO ragione_sociale; -- richiede column mapping
ALTER TABLE prod.silver.clienti SET TBLPROPERTIES ('delta.enableChangeDataFeed' = 'true');
COMMENT ON TABLE prod.silver.clienti IS 'Anagrafica clienti pulita';
DROP TABLE prod.silver.clienti_old;
UNDROP TABLE prod.silver.clienti_old;   -- solo tabelle gestite, entro il periodo di conservazione
~~~

Per **convertire** una tabella esterna in gestita si usa `ALTER TABLE ... SET MANAGED`, che sposta i dati nello storage gestito con un'interruzione minima; in alternativa si crea una nuova tabella gestita con `CREATE TABLE ... AS SELECT` o `DEEP CLONE`. Per portare file Parquet esistenti in formato Delta *sul posto* c'è `CONVERT TO DELTA`.

## Copie di tabelle

- **DEEP CLONE**: copia dati e metadati; indipendente dall'originale.
- **SHALLOW CLONE**: copia solo i metadati e punta ai file originali; veloce, utile per test.

> Se una domanda chiede "eliminare la tabella ma conservare i file per altri sistemi", la tabella deve essere **esterna**.
