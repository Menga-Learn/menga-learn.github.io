## Scenario

Il modello di vendite ha le misure esplicite `[Ricavo]`, `[Margine]` e `[Quantita]`, e una tabella `'Data'` marcata come tabella data. Il management vuole, per **ogni** misura, le colonne: *Corrente*, *Anno precedente*, *Da inizio anno* e *Variazione % su anno precedente*.

## Consegna

1. Progetta un **gruppo di calcolo** che soddisfi la richiesta scrivendo il DAX di ogni elemento.
2. Fai in modo che l'elemento *Variazione %* sia formattato come percentuale, mentre gli altri mantengano il formato della misura.
3. Spiega cosa succede alle **misure implicite** dopo la creazione del gruppo di calcolo.

<!-- SOLUZIONE -->

Gruppo di calcolo `Intelligenza temporale`, colonna `Periodo`:

~~~dax
// Corrente (ordinale 0)
SELECTEDMEASURE ()

// Anno precedente (ordinale 1)
CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( 'Data'[Data] ) )

// Da inizio anno (ordinale 2)
CALCULATE ( SELECTEDMEASURE (), DATESYTD ( 'Data'[Data] ) )

// Variazione % (ordinale 3)
VAR Corrente = SELECTEDMEASURE ()
VAR AP = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( 'Data'[Data] ) )
RETURN DIVIDE ( Corrente - AP, AP )
~~~

**Formato**: sull'elemento *Variazione %* imposta una **stringa di formato dinamica**:

~~~dax
"0.0%"
~~~

Gli altri elementi non definiscono una stringa di formato, quindi mantengono quella della misura selezionata. Se ti servisse mantenere il formato della misura in modo esplicito, puoi usare `SELECTEDMEASUREFORMATSTRING()`.

**Misure implicite**: alla creazione del gruppo di calcolo, la proprietà del modello *scoraggia misure implicite* viene attivata. Gli utenti non possono più trascinare una colonna numerica in un visual per ottenere una somma automatica: servono misure esplicite come `[Ricavo]`. È voluto, perché i gruppi di calcolo si applicano solo alle misure esplicite.

**Uso**: metti `Periodo` sulle colonne di una matrice e le misure sui valori.
