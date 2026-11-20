La prima decisione nella progettazione di un modello semantico è la **modalità di archiviazione** di ogni tabella. Cambia prestazioni, freschezza dei dati e funzionalità disponibili.

## Le modalità

| Modalità | Dove sono i dati durante la query | Pro | Contro |
|---|---|---|---|
| **Import** | Copia compressa in memoria (VertiPaq) | Massime prestazioni, DAX completo, qualsiasi sorgente | Dati aggiornati solo al refresh; refresh lunghi su grandi volumi; limite di memoria |
| **DirectQuery** | Rimangono nella sorgente; ogni visual genera query SQL | Dati sempre attuali, nessun limite di volume | Prestazioni legate alla sorgente; alcune limitazioni DAX |
| **Direct Lake** | Letti direttamente dai file **Delta in OneLake** e caricati in memoria su richiesta | Prestazioni simili a Import, dati freschi senza refresh completo | Solo tabelle Delta in OneLake; regole e limiti (guardrail) per SKU |
| **Dual** | Importata **e** disponibile in DirectQuery | Usata per dimensioni nei modelli compositi | Va aggiornata come Import |

## Direct Lake in breve

In **Direct Lake** il modello non copia i dati con un refresh tradizionale. Il "refresh" è un'operazione leggera chiamata **framing**: il modello registra quale versione delle tabelle Delta usare. Alla prima query, le colonne necessarie vengono caricate in memoria (*transcoding*) e poi riutilizzate.

È la scelta naturale quando i dati gold sono già in un **lakehouse o warehouse di Fabric**: si evitano copie duplicate e refresh lunghi. Ne parleremo in dettaglio nel modulo sull'ottimizzazione.

## Modelli compositi

Un **modello composito** combina tabelle con modalità diverse, ad esempio:

- fatti in **DirectQuery** (miliardi di righe, sempre aggiornati) e dimensioni in **Dual**;
- un modello che estende un **modello semantico condiviso** (in DirectQuery verso il modello remoto) aggiungendo una tabella locale Import con gli obiettivi di budget;
- tabelle aggregate in Import davanti a una tabella dei fatti di dettaglio in DirectQuery (**aggregazioni definite dall'utente**).

> Perché le dimensioni in **Dual**? Se una dimensione fosse solo Import e il fatto solo DirectQuery, le relazioni tra loro sarebbero "limitate" e le query meno efficienti. In Dual, la dimensione si comporta come Import quando serve e come DirectQuery quando viene combinata con il fatto.

## Come scegliere

- Dati in Fabric come Delta, grandi volumi, servono prestazioni → **Direct Lake**.
- Sorgente esterna, volumi gestibili, aggiornamento giornaliero sufficiente → **Import**.
- Requisito di dati in tempo reale da una sorgente esterna che regge il carico → **DirectQuery**.
- Esigenze miste → **composito**.

## Formato di archiviazione dei modelli di grandi dimensioni

Per i modelli Import oltre i **10 GB** compressi va attivato il **formato di archiviazione dei modelli semantici di grandi dimensioni** (*large semantic model storage format*). Il limite diventa la memoria disponibile nella capacità, e migliorano le prestazioni delle operazioni di scrittura via XMLA. Nei nuovi modelli in capacità Fabric è spesso attivo per impostazione predefinita.
