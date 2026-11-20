## Scenario

Un report sul modello semantico `Vendite` (Import, 300 milioni di righe nella tabella dei fatti) impiega 25 secondi ad aprire la pagina principale. La pagina contiene 18 visual. Con Performance Analyzer osservi che:

- il visual *Tabella dettaglio ordini* impiega 14 secondi, quasi tutti in **query DAX**;
- un grafico con 40.000 punti impiega 4 secondi, quasi tutti in **visualizzazione**;
- gli altri visual impiegano meno di 1 secondo ciascuno, ma molti mostrano tempi elevati in **altro**.

Con VertiPaq Analyzer scopri che la colonna `Vendite[IdTransazioneGUID]` occupa il 45% del modello e che `Vendite[DataOraOrdine]` ha 280 milioni di valori distinti.

La misura usata nella tabella è:

~~~dax
Ricavo Clienti Fedeli =
SUMX (
    FILTER ( Vendite, RELATED ( Cliente[Fedelta] ) = "Gold" ),
    Vendite[Quantita] * Vendite[Prezzo]
)
~~~

## Consegna

Proponi almeno **cinque interventi**, indicando per ciascuno quale sintomo risolve.

<!-- SOLUZIONE -->

| Intervento | Sintomo risolto |
|---|---|
| **Rimuovere** `IdTransazioneGUID` dal modello (o spostarlo in una tabella di dettaglio separata, se serve davvero) | Dimensione del modello e memoria: colonne ad alta cardinalità comprimono male. |
| Dividere `DataOraOrdine` in **data** e **ora** (arrotondata al minuto o all'ora), collegando la data alla dimensione Data | Cardinalità altissima della colonna. |
| Riscrivere la misura filtrando la **colonna** invece dell'intera tabella dei fatti | Tempo di query DAX del visual tabella. |
| Ridurre i punti del grafico (aggregare per giorno/settimana o usare un filtro) | Tempo di **visualizzazione**. |
| Ridurre il numero di visual nella pagina (ad esempio raggruppare le card, spostare il dettaglio in una pagina di drill-through) | Tempi **altro**: i visual attendono in coda le query degli altri. |
| Valutare una **tabella aggregata** o Direct Lake se i dati sono già in Fabric | Prestazioni generali su grandi volumi. |

Misura ottimizzata:

~~~dax
Ricavo Clienti Fedeli =
CALCULATE (
    SUMX ( Vendite, Vendite[Quantita] * Vendite[Prezzo] ),
    Cliente[Fedelta] = "Gold"
)
~~~

Il filtro su `Cliente[Fedelta]` si propaga alla tabella dei fatti tramite la relazione, ed è risolto dallo storage engine in modo molto più efficiente di `FILTER` + `RELATED` riga per riga su 300 milioni di righe. Ancora meglio, se possibile, calcolare l'importo riga (`Quantita * Prezzo`) a monte nel lakehouse e usare un semplice `SUM`.

Dopo ogni intervento: **misura di nuovo** con Performance Analyzer.
