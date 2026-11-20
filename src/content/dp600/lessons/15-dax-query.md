DAX non serve solo per le misure: è anche un **linguaggio di interrogazione**. Ogni visual di Power BI, dietro le quinte, invia una query DAX al modello semantico. Saperle leggere e scrivere aiuta ad analizzare i dati e a ottimizzare i report.

## La vista query DAX

In Power BI Desktop e nel servizio, la **vista query DAX** permette di scrivere ed eseguire query sul modello:

- genera query rapide con il menu contestuale (ad esempio "Mostra prime 100 righe" o "Definisci tutte le misure");
- permette di **modificare una misura** in una query e poi **aggiornare il modello** con la nuova definizione;
- supporta l'assistenza di Copilot per scrivere o spiegare le query.

## Struttura di una query

```dax
DEFINE
    MEASURE Vendite[Margine %] =
        DIVIDE ( [Margine], [Ricavo] )
EVALUATE
    SUMMARIZECOLUMNS (
        'Data'[Anno],
        Prodotto[Categoria],
        "Ricavo", [Ricavo],
        "Margine %", [Margine %]
    )
ORDER BY 'Data'[Anno], [Ricavo] DESC
```

- `EVALUATE` è obbligatorio e deve restituire una **tabella**.
- `DEFINE` (facoltativo) dichiara misure, variabili, colonne o tabelle valide **solo per la query**.
- `ORDER BY` ordina il risultato; `START AT` indica da dove iniziare.

## Funzioni tabellari più usate

| Funzione | Uso |
|---|---|
| `SUMMARIZECOLUMNS` | Raggruppa per colonne e calcola misure: è la funzione che usano i visual. |
| `FILTER` | Restituisce le righe di una tabella che soddisfano una condizione. |
| `CALCULATETABLE` | Valuta una tabella in un contesto di filtro modificato. |
| `TOPN` | Restituisce le prime N righe secondo un'espressione. |
| `ADDCOLUMNS` / `SELECTCOLUMNS` | Aggiunge colonne calcolate / sceglie colonne. |
| `VALUES` / `DISTINCT` | Valori distinti di una colonna. |

Esempio: i 5 prodotti più venduti nel 2025.

```dax
EVALUATE
TOPN (
    5,
    CALCULATETABLE (
        ADDCOLUMNS ( VALUES ( Prodotto[NomeProdotto] ), "Ricavo", [Ricavo] ),
        'Data'[Anno] = 2025
    ),
    [Ricavo], DESC
)
```

## Usare le query per il debug

Quando un visual mostra un numero sospetto:

1. apri **Performance Analyzer**, registra e **copia la query** del visual;
2. incollala nella vista query DAX (o in DAX Studio);
3. modifica la query, ad esempio togliendo filtri o aggiungendo colonne, per capire da dove arriva il valore.

## Altri strumenti

- **DAX Studio**: esegue query, mostra piani di esecuzione e tempi di storage engine e formula engine.
- **Notebook con semantic link** (`sempy`): la funzione `evaluate_dax` esegue query DAX da Python e restituisce un DataFrame, utile per validare le misure o confrontarle con i dati del lakehouse.
