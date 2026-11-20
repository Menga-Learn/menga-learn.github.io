Quando un modello ha 20 misure base e serve per ognuna la versione "anno precedente", "da inizio anno" e "variazione %", si rischia di scriverne 80. Il DP-600 verifica gli strumenti che evitano questa esplosione: **gruppi di calcolo**, **stringhe di formato dinamiche** e **parametri di campo**.

## Gruppi di calcolo

Un **gruppo di calcolo** è una tabella speciale i cui **elementi di calcolo** applicano una trasformazione a **qualsiasi misura** presente nel visual, tramite `SELECTEDMEASURE()`:

```dax
-- Gruppo di calcolo "Intelligenza temporale", colonna "Periodo"
Corrente = SELECTEDMEASURE ()
AP       = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( 'Data'[Data] ) )
YTD      = CALCULATE ( SELECTEDMEASURE (), DATESYTD ( 'Data'[Data] ) )
Var % AP =
    VAR AP = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( 'Data'[Data] ) )
    RETURN DIVIDE ( SELECTEDMEASURE () - AP, AP )
```

Mettendo la colonna *Periodo* sulle colonne di una matrice, ogni misura viene mostrata nelle quattro varianti. Concetti da conoscere:

- **Precedenza**: se più gruppi di calcolo si applicano alla stessa misura, l'ordine è determinato dalla proprietà *precedenza* del gruppo.
- `ISSELECTEDMEASURE()` e `SELECTEDMEASURENAME()` permettono di applicare la logica solo ad alcune misure.
- Creando un gruppo di calcolo, il modello imposta **"scoraggia misure implicite"**: gli utenti non possono più trascinare una colonna numerica e ottenere una somma automatica; servono **misure esplicite**.
- Si creano in Power BI Desktop (vista modello), nell'editor web dei modelli o con Tabular Editor.

## Stringhe di formato dinamiche

L'elemento *Var % AP* restituisce una percentuale, mentre gli altri restituiscono valuta. La **stringa di formato dinamica** risolve il problema con un'espressione DAX che restituisce il formato:

```dax
-- stringa di formato dell'elemento "Var % AP"
"0.0%"
```

Le stringhe di formato dinamiche si possono usare anche sulle **misure normali**, ad esempio per mostrare "1,2 Mln" o "850 K" a seconda del valore, o per cambiare il simbolo di valuta in base alla valuta selezionata:

```dax
SWITCH ( TRUE (),
    SELECTEDMEASURE () >= 1e6, "#,0.0,,\" Mln\"",
    SELECTEDMEASURE () >= 1e3, "#,0,\" K\"",
    "#,0" )
```

A differenza di `FORMAT()`, che trasforma il numero in **testo**, la stringa di formato dinamica mantiene il valore **numerico**: ordinamenti e grafici continuano a funzionare.

## Parametri di campo

I **parametri di campo** permettono all'utente di scegliere **quale misura o quale colonna** mostrare in un visual tramite uno slicer:

```dax
Parametro misura = {
    ( "Ricavo", NAMEOF ( [Ricavo] ), 0 ),
    ( "Margine", NAMEOF ( [Margine] ), 1 ),
    ( "Quantità", NAMEOF ( [Quantita] ), 2 )
}
```

Si creano dal menu *Modellazione > Nuovo parametro > Campi*. Sono ideali per report flessibili ("analizza per Regione / Categoria / Canale") senza duplicare i visual.

## Quale strumento?

| Esigenza | Soluzione |
|---|---|
| Stessa trasformazione temporale su molte misure | Gruppo di calcolo |
| Formato diverso secondo il valore o il contesto, mantenendo un numero | Stringa di formato dinamica |
| L'utente sceglie la misura o la dimensione del grafico | Parametro di campo |
