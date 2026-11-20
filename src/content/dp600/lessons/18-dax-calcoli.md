Il DP-600 si aspetta che tu sappia scrivere misure DAX leggibili ed efficienti, usando **variabili**, **iteratori**, il **filtro delle tabelle**, le **funzioni finestra** e le **funzioni informative**.

## Contesto di filtro e CALCULATE

Ogni misura viene valutata in un **contesto di filtro** (gli anni, le categorie e gli slicer selezionati). `CALCULATE` modifica quel contesto:

```dax
Ricavo Italia = CALCULATE ( [Ricavo], Cliente[Paese] = "Italia" )
Ricavo tutte le categorie = CALCULATE ( [Ricavo], REMOVEFILTERS ( Prodotto[Categoria] ) )
Quota categoria = DIVIDE ( [Ricavo], [Ricavo tutte le categorie] )
```

## Variabili

Le variabili (`VAR ... RETURN`) rendono il codice più leggibile e **più veloce**, perché un'espressione viene calcolata una sola volta:

```dax
Crescita % =
VAR Corrente = [Ricavo]
VAR Precedente = CALCULATE ( [Ricavo], SAMEPERIODLASTYEAR ( 'Data'[Data] ) )
RETURN
    DIVIDE ( Corrente - Precedente, Precedente )
```

> Una variabile viene valutata nel contesto **in cui è definita**: se la usi dentro un `CALCULATE` successivo, il suo valore non cambia.

## Iteratori

Le funzioni che terminano con **X** (`SUMX`, `AVERAGEX`, `MAXX`, `COUNTX`, `RANKX`...) valutano un'espressione **riga per riga** e poi aggregano:

```dax
Ricavo = SUMX ( Vendite, Vendite[Quantita] * Vendite[PrezzoUnitario] )
```

Servono quando il calcolo va fatto prima dell'aggregazione. Attenzione agli iteratori su tabelle molto grandi con espressioni complesse: possono essere costosi.

## Filtrare le tabelle

`FILTER` restituisce una tabella filtrata e si usa come argomento di `CALCULATE` o degli iteratori:

```dax
Ricavo clienti top =
CALCULATE ( [Ricavo], FILTER ( VALUES ( Cliente[IdCliente] ), [Ricavo] > 10000 ) )
```

Regola pratica: per filtri semplici su una colonna usa la forma booleana (`Prodotto[Colore] = "Rosso"`); usa `FILTER` quando la condizione dipende da una misura. Evita `FILTER ( Vendite, ... )` sull'intera tabella dei fatti quando basta filtrare una colonna.

## Funzioni finestra

`OFFSET`, `INDEX` e `WINDOW` lavorano su righe ordinate, in modo simile alle funzioni finestra di SQL:

```dax
Ricavo mese precedente =
CALCULATE (
    [Ricavo],
    OFFSET ( -1, ALLSELECTED ( 'Data'[AnnoMese] ), ORDERBY ( 'Data'[AnnoMese], ASC ) )
)

Media mobile 3 mesi =
AVERAGEX (
    WINDOW ( -2, REL, 0, REL, ALLSELECTED ( 'Data'[AnnoMese] ), ORDERBY ( 'Data'[AnnoMese], ASC ) ),
    [Ricavo]
)
```

- `OFFSET` → la riga a distanza relativa (precedente, successiva).
- `INDEX` → la riga in una posizione assoluta (la prima, l'ultima).
- `WINDOW` → un intervallo di righe (media mobile, totali progressivi).
- `PARTITIONBY` → ricomincia il calcolo per ogni gruppo (ad esempio per categoria).

## Funzioni informative

Restituiscono informazioni sul contesto o sui valori:

| Funzione | Uso tipico |
|---|---|
| `ISBLANK` | Gestire valori vuoti |
| `HASONEVALUE` | Verificare che sia selezionato un solo valore |
| `SELECTEDVALUE` | Leggere il valore selezionato (con un valore alternativo) |
| `ISFILTERED` / `ISCROSSFILTERED` | Sapere se una colonna è filtrata direttamente o indirettamente |
| `ISINSCOPE` | Capire a quale livello di una gerarchia ci si trova (utile per i totali di una matrice) |
| `USERPRINCIPALNAME` | Identificare l'utente (RLS dinamica) |

```dax
Ricavo (solo dettaglio) =
IF ( ISINSCOPE ( Prodotto[NomeProdotto] ), [Ricavo], BLANK () )
```
