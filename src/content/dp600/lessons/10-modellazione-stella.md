Il livello "gold" di una soluzione analitica è quasi sempre un **modello dimensionale (schema a stella)**. Il DP-600 chiede di saperlo implementare sia nel lakehouse sia nel warehouse.

## Fatti e dimensioni

- **Tabella dei fatti**: contiene gli eventi misurabili (vendite, ordini, movimenti), con **chiavi esterne** verso le dimensioni e **colonne numeriche** da aggregare. È lunga e stretta.
- **Tabella delle dimensioni**: descrive il contesto (cliente, prodotto, data, negozio) con attributi testuali per filtrare e raggruppare. È corta e larga.

La **granularità** (grain) della tabella dei fatti va decisa per prima: "una riga per riga d'ordine" è diverso da "una riga per ordine" e cambia le analisi possibili.

## Chiavi surrogate

Nelle dimensioni si usa una **chiave surrogata** (un intero senza significato di business) al posto della chiave naturale del sistema sorgente. Vantaggi: join più veloci, indipendenza dai sistemi di origine, supporto alla storicizzazione.

Nel warehouse si può generare con `ROW_NUMBER()` sommato al massimo valore esistente, oppure con le colonne **IDENTITY** se supportate nel tuo ambiente; in Spark con `monotonically_increasing_id()` o `row_number()` su una finestra.

## Dimensioni a variazione lenta (SCD)

Quando un attributo cambia (il cliente si trasferisce in un'altra città):

- **Tipo 1**: si **sovrascrive** il valore. Nessuno storico; le vendite passate appaiono nella nuova città.
- **Tipo 2**: si **chiude la riga corrente** e se ne inserisce una nuova con una nuova chiave surrogata. Colonne tipiche: `DataInizioValidita`, `DataFineValidita`, `IsCorrente`. Le vendite passate restano associate alla vecchia città.

```sql
-- Tipo 2: chiusura delle righe cambiate
UPDATE d
SET d.DataFineValidita = CAST(GETDATE() AS date), d.IsCorrente = 0
FROM dbo.DimCliente AS d
JOIN stg.Clienti AS s ON s.CodiceCliente = d.CodiceCliente
WHERE d.IsCorrente = 1 AND s.Citta <> d.Citta;

-- inserimento delle nuove versioni (e dei clienti nuovi)
INSERT INTO dbo.DimCliente (ChiaveCliente, CodiceCliente, Nome, Citta,
                            DataInizioValidita, DataFineValidita, IsCorrente)
SELECT NEXT_KEY.base + ROW_NUMBER() OVER (ORDER BY s.CodiceCliente),
       s.CodiceCliente, s.Nome, s.Citta, CAST(GETDATE() AS date), '9999-12-31', 1
FROM stg.Clienti AS s
CROSS JOIN (SELECT ISNULL(MAX(ChiaveCliente), 0) AS base FROM dbo.DimCliente) AS NEXT_KEY
WHERE NOT EXISTS (SELECT 1 FROM dbo.DimCliente d
                  WHERE d.CodiceCliente = s.CodiceCliente AND d.IsCorrente = 1);
```

## Dimensione data

Una **tabella delle date** con una riga per giorno (anno, trimestre, mese, nome del mese, giorno della settimana, flag festivi) è indispensabile: permette le funzioni di time intelligence e filtri coerenti.

## Denormalizzare

Nei sistemi operativi i dati sono **normalizzati** (Prodotto → Sottocategoria → Categoria). In uno schema a stella conviene **denormalizzare** questa gerarchia in un'unica dimensione Prodotto con le colonne `Sottocategoria` e `Categoria`. Si evita uno schema a fiocco di neve (snowflake), che complica il modello e rallenta le query.

## Aggregare

Se gli utenti analizzano quasi sempre i dati per mese e categoria, si può creare una **tabella aggregata** (ad esempio `FattVenditeMensili`) per ridurre i volumi e migliorare le prestazioni, mantenendo la tabella di dettaglio per le analisi puntuali.
