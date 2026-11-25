Quando un job è in produzione bisogna sapere se funziona, quanto dura e perché fallisce. La prima fonte è l'interfaccia di **Lakeflow Jobs**.

## La pagina del job

- **Elenco delle esecuzioni** (*runs*): stato (in coda, in esecuzione, riuscito, fallito, saltato, annullato, timeout), inizio, durata, trigger.
- **Vista a matrice** delle esecuzioni: ogni colonna è un run, ogni riga un task; i colori mostrano subito quali task falliscono spesso o durano di più.
- **Grafico della durata** dei run: confronta l'ultimo run con lo storico per accorgersi di un peggioramento (*regressione*).
- Per un singolo run, il **grafo dei task** (DAG) mostra quale task ha fallito e quali task a valle sono stati **saltati** (*upstream failed*).

## Trovare la causa

1. Apri il run fallito, poi il **task** in rosso.
2. Leggi l'errore e lo stack trace nell'output del task (o del notebook).
3. Se il task è stato saltato, risali al **task a monte** che lo blocca.
4. Usa i link alla **Spark UI**, ai log del driver e alle metriche del compute.

Dopo aver corretto la causa si usa **Repair run**: riesegue solo i task falliti e quelli che dipendono da loro, senza ripetere i task già riusciti.

## Problemi frequenti del compute

| Sintomo | Causa probabile | Rimedio |
|---|---|---|
| Il cluster non si avvia, errore di capacità o quota | Mancanza di istanze nella regione, quota cloud esaurita | Cambiare tipo di istanza, usare pool, serverless o chiedere aumento quota |
| Errore all'avvio dopo l'aggiunta di uno script di init | Script di inizializzazione che fallisce | Leggere i log dello script di init, correggerlo |
| `ModuleNotFoundError` o errori di import | Libreria non installata o versione sbagliata | Installarla a livello di cluster/ambiente del job, fissare la versione |
| Funzionava ieri, oggi errore di libreria | **Conflitto di versioni** tra librerie o con il runtime | Fissare le versioni (`pacchetto==1.2.3`), allineare al Databricks Runtime |
| `OutOfMemoryError` sul driver | `collect()`, `toPandas()` su grandi dati, broadcast troppo grandi | Evitare di portare dati sul driver, driver più grande |
| `OutOfMemoryError` o *executor lost* | Partizioni troppo grandi, skew | Più partizioni, nodi con più memoria, gestione dello skew |

## Confronto con una baseline

Per accorgersi dei problemi prima degli utenti:

- definisci una **durata attesa** e imposta una soglia con notifica (*duration warning*);
- confronta il volume di dati elaborato: un job che dura il doppio può semplicemente elaborare il doppio dei dati;
- per analisi più ampie si interrogano le **system tables** (`system.lakeflow.job_run_timeline`).

> **Repair run** è la risposta quando la domanda chiede di "rieseguire solo ciò che è fallito".
