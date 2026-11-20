Ricaricare ogni notte cinque anni di vendite per aggiungere un solo giorno è uno spreco. L'**aggiornamento incrementale** suddivide una tabella Import in **partizioni per periodo** e aggiorna solo le più recenti.

## Prerequisiti

1. Due parametri di Power Query con nomi esatti **`RangeStart`** e **`RangeEnd`**, di tipo **Data/ora**.
2. Un filtro sulla colonna data della tabella:

```powerquery
= Table.SelectRows(Origine, each [DataOrdine] >= RangeStart and [DataOrdine] < RangeEnd)
```

> Usa `>=` su un estremo e `<` sull'altro: con `<=` su entrambi, le righe esattamente al confine verrebbero caricate in due partizioni.

3. Una sorgente che supporti il **query folding** (database relazionali, lakehouse/warehouse tramite endpoint SQL), così il filtro viene eseguito alla sorgente. Senza folding, il servizio scaricherebbe tutti i dati per ogni partizione.

## La policy

Nella finestra *Aggiornamento incrementale* della tabella si definiscono:

- **Archivia i dati**: per quanto tempo conservare lo storico (ad esempio 5 anni). Queste partizioni non vengono aggiornate.
- **Aggiorna in modo incrementale**: quale periodo ricaricare a ogni refresh (ad esempio gli ultimi 10 giorni).
- **Rileva modifiche ai dati** (facoltativo): indica una colonna "ultima modifica"; il servizio aggiorna una partizione incrementale solo se il valore massimo di quella colonna è cambiato.
- **Aggiorna solo i periodi completi**: esclude il periodo in corso (ad esempio il giorno di oggi).
- **Ottieni i dati più recenti in tempo reale con DirectQuery**: aggiunge una partizione DirectQuery per i dati successivi all'ultimo refresh (**tabella ibrida**).

La policy viene applicata **dopo la pubblicazione** nel servizio: al primo refresh vengono create le partizioni. In Desktop si lavora solo con il sottoinsieme definito dai valori dei parametri.

## Esempio

Policy: archivia 3 anni, aggiorna gli ultimi 7 giorni.

- Le partizioni dei 3 anni precedenti vengono create una volta e poi **non toccate**.
- Ogni notte vengono ricaricati solo 7 giorni.
- Con il passare del tempo, le partizioni vengono **unite** (giorni → mesi → trimestri → anni) e quelle oltre i 3 anni vengono eliminate.

## Gestione avanzata

Tramite l'**endpoint XMLA** (SSMS, Tabular Editor) si possono aggiornare singole partizioni storiche, ad esempio per correggere un mese passato, senza ricaricare tutto. Dopo una modifica via XMLA il modello non è più scaricabile come `.pbix`.

## Incrementale e Direct Lake

L'aggiornamento incrementale riguarda i modelli **Import**. Con **Direct Lake** i dati non vengono importati: per caricare solo le novità si lavora a monte, scrivendo in modo incrementale le tabelle Delta (ad esempio con `MERGE`) e lasciando che il modello esegua il *framing* sulla nuova versione.
