## Scenario

Il modello semantico contiene le tabelle `Vendite`, `Prodotto` (con `Categoria`, `NomeProdotto`), `'Data'` (con `Anno`, `AnnoMese`) e `Cliente` (con `Paese`). Esiste la misura `[Ricavo]`.

## Consegna

Scrivi nella **vista query DAX**:

1. una query che restituisca il ricavo per anno e categoria, ordinato per anno e poi per ricavo decrescente;
2. una query che definisca, **solo per la query**, la misura `[Ricavo AP]` (anno precedente) e la mostri accanto a `[Ricavo]` per anno;
3. una query che restituisca i 3 prodotti con il ricavo più alto in **Italia**.

<!-- SOLUZIONE -->

~~~dax
// 1
EVALUATE
SUMMARIZECOLUMNS (
    'Data'[Anno],
    Prodotto[Categoria],
    "Ricavo", [Ricavo]
)
ORDER BY 'Data'[Anno] ASC, [Ricavo] DESC
~~~

~~~dax
// 2
DEFINE
    MEASURE Vendite[Ricavo AP] =
        CALCULATE ( [Ricavo], SAMEPERIODLASTYEAR ( 'Data'[Data] ) )
EVALUATE
SUMMARIZECOLUMNS (
    'Data'[Anno],
    "Ricavo", [Ricavo],
    "Ricavo AP", [Ricavo AP]
)
ORDER BY 'Data'[Anno]
~~~

~~~dax
// 3
EVALUATE
TOPN (
    3,
    CALCULATETABLE (
        ADDCOLUMNS ( VALUES ( Prodotto[NomeProdotto] ), "Ricavo", [Ricavo] ),
        Cliente[Paese] = "Italia"
    ),
    [Ricavo], DESC
)
~~~

**Note**

- La misura definita con `DEFINE MEASURE` esiste solo durante la query. Nella vista query DAX puoi poi scegliere **"Aggiorna il modello"** per salvarla nel modello.
- `TOPN` non garantisce l'ordinamento del risultato: aggiungi `ORDER BY [Ricavo] DESC` se ti serve ordinato.
