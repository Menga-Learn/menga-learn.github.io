## Obiettivo

Configurare l'**aggiornamento incrementale** su una tabella dei fatti in Power BI Desktop e verificarne il comportamento nel servizio.

## Requisiti

- archiviare **3 anni** di dati;
- aggiornare ogni giorno solo gli **ultimi 5 giorni**;
- non caricare il giorno in corso, che è incompleto;
- aggiornare una partizione solo se i dati sono cambiati, usando la colonna `UltimaModifica`.

La tabella `Ordini` proviene dall'endpoint SQL di un lakehouse e ha le colonne `DataOrdine (datetime)`, `UltimaModifica (datetime)`, `Importo`.

## Passaggi da completare

1. Crea i parametri necessari in Power Query.
2. Applica il filtro alla tabella.
3. Configura la policy.
4. Pubblica e descrivi cosa succede al primo aggiornamento e a quelli successivi.

<!-- SOLUZIONE -->

**1. Parametri**: in *Gestisci parametri* crea `RangeStart` e `RangeEnd`, tipo **Data/ora**, con valori di esempio (ad esempio 01/01/2025 e 01/02/2025) per caricare in Desktop solo un mese.

**2. Filtro** sulla colonna `DataOrdine`:

~~~powerquery
= Table.SelectRows(Origine, each [DataOrdine] >= RangeStart and [DataOrdine] < RangeEnd)
~~~

Verifica il **query folding**: clic destro sull'ultimo passaggio → *Visualizza query nativa* deve essere disponibile.

**3. Policy** (clic destro sulla tabella → *Aggiornamento incrementale*):

- Archivia i dati a partire da **3 anni** prima della data di aggiornamento;
- Aggiorna in modo incrementale i dati a partire da **5 giorni** prima;
- ✔ **Rileva modifiche ai dati** → colonna `UltimaModifica`;
- ✔ **Aggiorna solo i giorni completi**.

**4. Nel servizio**

- **Primo aggiornamento**: vengono create tutte le partizioni (anni, trimestri, mesi, giorni) e caricati tutti i 3 anni: può richiedere tempo.
- **Aggiornamenti successivi**: vengono rielaborate solo le partizioni degli ultimi 5 giorni completi, e solo se il massimo di `UltimaModifica` è cambiato. Le partizioni storiche restano invariate; quelle oltre i 3 anni vengono eliminate e i giorni vengono progressivamente uniti in mesi e anni.

**Domanda di controllo**: perché non usare `<=` su entrambi i parametri? Perché una riga con `DataOrdine` esattamente uguale al confine verrebbe caricata in due partizioni adiacenti, duplicando i valori.
