Nel warehouse (e, in parte, nell'endpoint SQL del lakehouse) si possono creare oggetti T-SQL riutilizzabili. Sapere **quale oggetto usare** è parte delle competenze di trasformazione.

## Viste

Una **vista** è una query salvata con un nome. Non memorizza dati: ogni volta che la interroghi, esegue la query sottostante.

```sql
CREATE VIEW gold.vw_VenditePerCategoria AS
SELECT p.Categoria, d.Anno, SUM(f.Importo) AS Importo
FROM gold.FattVendite f
JOIN gold.DimProdotto p ON p.ChiaveProdotto = f.ChiaveProdotto
JOIN gold.DimData d ON d.ChiaveData = f.ChiaveData
GROUP BY p.Categoria, d.Anno;
```

Usi tipici: nascondere la complessità dei join, esporre solo alcune colonne a determinati utenti, rinominare campi in modo comprensibile.

> Le viste **si possono creare anche nell'endpoint di analisi SQL** del lakehouse, perché non modificano i dati. Nota però che un modello semantico in **Direct Lake** che legge una vista va in *fallback* su DirectQuery (vedi il modulo sui modelli semantici).

## Funzioni

- **Funzioni scalari**: restituiscono un singolo valore (ad esempio la fascia di un cliente).
- **Funzioni con valori di tabella inline (iTVF)**: restituiscono una tabella e accettano parametri; sono la base dei predicati di **sicurezza a livello di riga**.

```sql
CREATE FUNCTION dbo.fn_VenditeDelPeriodo (@Inizio date, @Fine date)
RETURNS TABLE
AS RETURN
  SELECT * FROM gold.FattVendite
  WHERE DataOrdine BETWEEN @Inizio AND @Fine;
```

## Stored procedure

Una **stored procedure** contiene più istruzioni, parametri, logica condizionale e gestione delle transazioni. Nel **warehouse** è lo strumento ideale per i caricamenti ELT:

```sql
CREATE PROCEDURE etl.CaricaFattVendite @Data date
AS
BEGIN
  BEGIN TRANSACTION;
    DELETE FROM gold.FattVendite WHERE DataOrdine = @Data;
    INSERT INTO gold.FattVendite (ChiaveData, ChiaveProdotto, Importo, DataOrdine)
    SELECT d.ChiaveData, p.ChiaveProdotto, s.Importo, s.DataOrdine
    FROM stg.Vendite s
    JOIN gold.DimData d ON d.Data = s.DataOrdine
    JOIN gold.DimProdotto p ON p.CodiceProdotto = s.CodiceProdotto
    WHERE s.DataOrdine = @Data;
  COMMIT TRANSACTION;
END;
```

Le procedure si richiamano da una **pipeline** con l'attività *Stored procedure* oppure con l'attività *Script*.

> Le stored procedure che **modificano** dati richiedono il **warehouse**: l'endpoint SQL del lakehouse è in sola lettura per le tabelle.

## Altre tecniche utili

- `CREATE TABLE AS SELECT` (**CTAS**): crea e popola una tabella in un solo passaggio, molto efficiente.
- `COPY INTO`: carica file (CSV, Parquet) da uno storage in una tabella del warehouse.
- **Query tra database**: un warehouse può leggere tabelle di lakehouse e altri warehouse dello stesso workspace con nomi in tre parti.

## Cosa scegliere

| Esigenza | Oggetto |
|---|---|
| Semplificare una query ricorrente per gli analisti | Vista |
| Riutilizzare un filtro parametrico come tabella | Funzione inline |
| Caricamento in più passaggi con transazione | Stored procedure |
| Materializzare velocemente il risultato di una query | CTAS |
