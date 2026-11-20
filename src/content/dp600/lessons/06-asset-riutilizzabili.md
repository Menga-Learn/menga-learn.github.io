Ricostruire ogni volta da zero connessioni, modelli e layout è uno spreco. Il DP-600 chiede di saper creare e gestire **asset riutilizzabili** e di valutare l'**impatto delle modifiche** prima di farle.

## File modello e file di origine dati

- **Modello di Power BI (.pbit)**: contiene struttura del report, modello, query e parametri, **senza dati**. All'apertura chiede i valori dei parametri e carica i dati. Ideale per distribuire un report standard da adattare.
- **File di origine dati (.pbids)**: un piccolo file JSON che contiene solo la **connessione** (tipo di origine, server, database). Aprendolo, Power BI Desktop parte direttamente dalla finestra di navigazione su quella sorgente. Utile per aiutare gli analisti a collegarsi alla fonte giusta.

## Modelli semantici condivisi

Invece di creare un modello per ogni report, si pubblica **un modello semantico condiviso** e si collegano a esso più report (connessione *live*). Vantaggi:

- un'unica definizione delle misure (una sola "verità");
- un solo aggiornamento dei dati;
- sicurezza RLS definita una volta.

Per creare report su un modello altrui serve il permesso **Build**. Se un analista ha bisogno di aggiungere dati propri può creare un **modello composito** che estende il modello condiviso (vedi il modulo sui modelli semantici).

## L'endpoint XMLA

I modelli semantici in una capacità Fabric espongono un **endpoint XMLA**. In modalità **lettura/scrittura** (impostazione della capacità) consente a strumenti esterni di leggere e modificare il modello:

- **SQL Server Management Studio**: script, processi di aggiornamento delle partizioni, gestione dei ruoli.
- **Tabular Editor**: modifica avanzata (gruppi di calcolo, OLS, script C#, Best Practice Analyzer).
- **DAX Studio**: interrogazioni e analisi delle prestazioni.
- **ALM Toolkit**: confronto e distribuzione parziale delle differenze tra due modelli.

> Attenzione: dopo una modifica fatta via XMLA il modello **non può più essere scaricato come .pbix** dal servizio. Conviene tenere la sorgente in un progetto `.pbip` sotto controllo di versione.

## Analisi d'impatto

Prima di rinominare una colonna o eliminare una tabella bisogna sapere **chi ne dipende**:

- La **vista di derivazione** (lineage) del workspace mostra le catene sorgente → lakehouse → modello → report.
- L'**analisi d'impatto** di un item elenca workspace, item a valle e numero di visualizzazioni coinvolti, e permette di **inviare una notifica** ai proprietari dei contenuti interessati.
- Per i modelli, strumenti come Tabular Editor o le librerie di *semantic link* nei notebook aiutano a trovare misure e oggetti che fanno riferimento a una colonna.
