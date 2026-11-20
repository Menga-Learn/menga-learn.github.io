Un modello enterprise deve rispondere in fretta anche con centinaia di utenti. Ottimizzare significa **misurare** prima, poi intervenire su **modello**, **DAX** e **visual**.

## Misurare: gli strumenti

- **Performance Analyzer** (Power BI Desktop): registra ogni visual e mostra il tempo per **query DAX**, **visualizzazione** del visual e **altro** (attesa di altre operazioni). Se domina la query DAX, il problema è nel modello o nelle misure; se domina la visualizzazione, il visual è troppo complesso (troppi punti, troppe righe).
- **Vista query DAX** e **DAX Studio**: eseguono la query copiata da Performance Analyzer, mostrano i tempi di **storage engine** e **formula engine** e i piani di query.
- **VertiPaq Analyzer** (in DAX Studio o nei notebook con semantic link): mostra le dimensioni di tabelle e colonne e la loro **cardinalità**.
- **Best Practice Analyzer** (Tabular Editor o libreria semantic-link-labs): controlla automaticamente regole di buona progettazione.

## Ottimizzare il modello

Il motore VertiPaq comprime per **colonna**: il costo di una colonna dipende soprattutto dal numero di **valori distinti**.

- **Rimuovi colonne inutili**, soprattutto chiavi testuali, GUID e colonne di audit.
- **Riduci la cardinalità**: separa data e ora, arrotonda i decimali non necessari, evita timestamp al millisecondo.
- Preferisci **chiavi intere** per le relazioni.
- Evita colonne calcolate nelle tabelle grandi: calcola a monte.
- Usa lo **schema a stella**: evita tabelle "piatte" enormi e catene di dimensioni a fiocco di neve.
- Disattiva **data/ora automatica** e usa una tabella data dedicata.

## Ottimizzare il DAX

- Usa **variabili** per non ricalcolare la stessa espressione.
- Preferisci filtri su **colonne** a `FILTER` su intere tabelle.
- Usa `DIVIDE` invece di `IF` + divisione per gestire lo zero.
- Evita iteratori annidati su tabelle dei fatti grandi.
- Evita `FORMAT` nelle misure usate nei calcoli: converte in testo e rallenta.

## Ottimizzare i report

- Limita il numero di visual per pagina (ogni visual = almeno una query).
- Usa le **interazioni** e i filtri in modo mirato.
- Per tabelle con molte righe, valuta la paginazione o i report impaginati.

## Il caso delle sorgenti DirectQuery

Con DirectQuery ogni visual interroga la sorgente: ottimizza la sorgente (indici, tabelle aggregate), riduci i visual e valuta le **aggregazioni definite dall'utente** in Import, che rispondono dalla memoria alle query di alto livello lasciando il dettaglio in DirectQuery.

> In un'analisi di prestazioni, procedi sempre per ipotesi verificate: misura, cambia **una cosa sola**, misura di nuovo.
