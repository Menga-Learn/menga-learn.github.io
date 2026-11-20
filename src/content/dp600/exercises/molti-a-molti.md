## Scenario

Una banca vuole analizzare i **saldi** dei conti per **cliente**. Le tabelle sono:

- `Cliente (IdCliente, Nome, Segmento)`
- `Conto (IdConto, TipoConto)`
- `Saldi (IdConto, Data, Saldo)` – una riga per conto e giorno
- `Intestazioni (IdCliente, IdConto)` – un conto può avere più intestatari e un cliente più conti

## Consegna

1. Disegna le relazioni del modello indicando cardinalità e direzione del filtro.
2. Spiega perché il totale dei saldi per segmento può non coincidere con la somma delle righe.
3. Proponi un'alternativa al filtro bidirezionale permanente.

<!-- SOLUZIONE -->

### 1. Relazioni

~~~
Cliente (1) ──► (*) Intestazioni (*) ◄──► (1) Conto (1) ──► (*) Saldi
~~~

- `Cliente[IdCliente]` → `Intestazioni[IdCliente]`: uno-a-molti, direzione singola.
- `Conto[IdConto]` → `Intestazioni[IdConto]`: uno-a-molti, **direzione bidirezionale**, così il filtro su Cliente passa attraverso la tabella bridge fino a Conto.
- `Conto[IdConto]` → `Saldi[IdConto]`: uno-a-molti, direzione singola.

`Intestazioni` è la **tabella bridge** e va nascosta agli utenti.

### 2. Totali non additivi

Un conto cointestato da due clienti di segmenti diversi viene conteggiato una volta in ciascun segmento, ma **una sola volta** nel totale generale. Quindi la somma dei segmenti può essere maggiore del totale: è il comportamento corretto delle relazioni molti-a-molti. Inoltre il saldo è una misura **semi-additiva** sul tempo: va mostrato l'ultimo saldo del periodo, non la somma dei giorni (ad esempio con `LASTNONBLANKVALUE` o filtrando l'ultima data).

### 3. Alternativa

Lascia tutte le relazioni a direzione **singola** e attiva la propagazione solo nella misura:

~~~dax
Saldo clienti =
CALCULATE (
    [Saldo],
    CROSSFILTER ( Intestazioni[IdConto], Conto[IdConto], BOTH )
)
~~~

Così il filtro bidirezionale non influenza le altre misure e non crea ambiguità nel modello.
