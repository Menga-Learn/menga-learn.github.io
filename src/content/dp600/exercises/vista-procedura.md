## Scenario

Nel warehouse `WH_Gold` esistono:

- `stg.Prodotti (CodiceProdotto, Nome, Sottocategoria, Categoria, Prezzo)`, caricata ogni notte;
- `gold.DimProdotto (ChiaveProdotto int, CodiceProdotto, Nome, Sottocategoria, Categoria, Prezzo)`.

## Consegna

1. Scrivi una **stored procedure** `etl.AggiornaDimProdotto` che aggiorna `gold.DimProdotto` come **SCD di tipo 1**: aggiorna i prodotti esistenti e inserisce quelli nuovi generando la chiave surrogata.
2. Scrivi una **vista** `gold.vw_Catalogo` che espone ai report solo `Nome`, `Categoria` e `Prezzo` dei prodotti con prezzo maggiore di zero.
3. Spiega come richiameresti la procedura ogni notte dopo il caricamento della tabella di staging.

<!-- SOLUZIONE -->

### 1. Stored procedure SCD tipo 1

~~~sql
CREATE PROCEDURE etl.AggiornaDimProdotto
AS
BEGIN
    -- aggiorna gli attributi dei prodotti esistenti (sovrascrittura)
    UPDATE d
    SET d.Nome = s.Nome,
        d.Sottocategoria = s.Sottocategoria,
        d.Categoria = s.Categoria,
        d.Prezzo = s.Prezzo
    FROM gold.DimProdotto AS d
    JOIN stg.Prodotti AS s ON s.CodiceProdotto = d.CodiceProdotto;

    -- inserisce i nuovi prodotti con una chiave surrogata progressiva
    DECLARE @MaxChiave int = (SELECT ISNULL(MAX(ChiaveProdotto), 0) FROM gold.DimProdotto);

    INSERT INTO gold.DimProdotto (ChiaveProdotto, CodiceProdotto, Nome, Sottocategoria, Categoria, Prezzo)
    SELECT @MaxChiave + ROW_NUMBER() OVER (ORDER BY s.CodiceProdotto),
           s.CodiceProdotto, s.Nome, s.Sottocategoria, s.Categoria, s.Prezzo
    FROM stg.Prodotti AS s
    WHERE NOT EXISTS (SELECT 1 FROM gold.DimProdotto AS d WHERE d.CodiceProdotto = s.CodiceProdotto);
END;
~~~

In alternativa si può usare un'unica istruzione `MERGE`, se disponibile nel tuo warehouse.

### 2. Vista

~~~sql
CREATE VIEW gold.vw_Catalogo AS
SELECT Nome, Categoria, Prezzo
FROM gold.DimProdotto
WHERE Prezzo > 0;
~~~

### 3. Orchestrazione

In una **pipeline di dati**: attività Copia (o Dataflow Gen2) che carica `stg.Prodotti`, seguita, con la condizione **"Al completamento riuscito"**, da un'attività **Stored procedure** che esegue `etl.AggiornaDimProdotto`. La pipeline viene pianificata ogni notte.

Nota che la dimensione è **denormalizzata**: sottocategoria e categoria sono colonne della stessa tabella, come previsto da uno schema a stella.
