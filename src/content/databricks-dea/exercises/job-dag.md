## Scenario

Devi progettare il job **vendite-giornaliere** in Lakeflow Jobs:

1. `ingestione_ordini` e `ingestione_clienti` caricano i dati bronze e possono girare **in parallelo**;
2. la pipeline dichiarativa `silver` deve partire solo quando **entrambe** le ingestioni sono riuscite;
3. un controllo `verifica_volumi` conta le righe caricate: se sono **zero** non si deve aggiornare il gold, ma inviare un avviso;
4. altrimenti si aggiornano la materialized view gold e la dashboard dei manager;
5. un task `pulizia_temporanei` deve girare **sempre**, anche se qualcosa è fallito;
6. la sorgente degli ordini ogni tanto risponde con un errore di rete temporaneo.

I file degli ordini arrivano tra l'1 e le 4 di notte, in un orario non prevedibile.

## Consegna

Descrivi task, tipi di task, dipendenze, condizioni, retry e trigger del job.

<!-- SOLUZIONE -->

| Task | Tipo | Dipende da | Impostazioni |
|---|---|---|---|
| `ingestione_ordini` | Notebook | — | **Retry** 3 volte con intervallo di qualche minuto (errori transitori) |
| `ingestione_clienti` | Notebook | — | — |
| `silver` | Pipeline | entrambe le ingestioni | Run if: *All succeeded* |
| `verifica_volumi` | Notebook | `silver` | Imposta il task value `righe` con `dbutils.jobs.taskValues.set` |
| `ci_sono_dati` | **If/else condition** | `verifica_volumi` | `{{tasks.verifica_volumi.values.righe}} > 0` |
| `aggiorna_gold` | SQL (o pipeline) | `ci_sono_dati` = **true** | Aggiorna la materialized view |
| `aggiorna_dashboard` | SQL – dashboard | `aggiorna_gold` | Aggiorna la dashboard dei manager |
| `avviso_vuoto` | Notebook o SQL alert | `ci_sono_dati` = **false** | Invia la notifica |
| `pulizia_temporanei` | Notebook | tutti i task finali | Run if: **All done** |

**Trigger**: dato che i file arrivano in un momento imprevedibile, si usa un trigger **file arrival** sul percorso degli ordini invece di una pianificazione fissa: il job parte appena i dati sono disponibili ed evita di elaborare dati incompleti.

**Compute**: serverless per i task notebook (o un job cluster condiviso), la pipeline usa il proprio compute.

**Notifiche**: email o Slack in caso di errore del job e soglia di durata.
