I **Git folders** (prima chiamati *Repos*) collegano una cartella del workspace a un repository Git remoto (GitHub, Azure DevOps, GitLab, Bitbucket). Permettono di lavorare con branch, commit e pull request direttamente dall'interfaccia di Databricks.

## Flusso di lavoro tipico

1. **Clona** il repository in un Git folder personale (es. `/Workspace/Users/anna@contoso.com/progetto-vendite`).
2. Crea un **branch** di funzionalità dal menu Git (`feature/nuovo-kpi`).
3. Modifica notebook, file `.py` o `.sql`.
4. Apri la finestra Git: vedi le differenze, scrivi un messaggio, **commit & push**.
5. Apri una **pull request** sul provider Git: revisione del codice, controlli automatici (CI).
6. Dopo il merge, aggiorna il branch principale con **pull**.

Dalla finestra Git si possono anche fare *merge*, *rebase*, risolvere conflitti e scartare modifiche.

## Buone pratiche

- Ogni sviluppatore lavora nel **proprio** Git folder e nel proprio branch: due persone sullo stesso Git folder si sovrascrivono le modifiche non ancora committate.
- I notebook vengono salvati in Git come **file sorgente** (`.py`, `.sql`) o in formato `.ipynb`: gli output delle celle non vengono versionati per impostazione predefinita.
- La cartella di **produzione** non si modifica a mano: si aggiorna automaticamente (pull del branch `main`, oppure deploy con un bundle) da una pipeline CI/CD.
- Le credenziali Git sono personali (token o app del provider) e si configurano nelle impostazioni utente.

## Cosa fa Databricks e cosa fa il provider Git

| Attività | Dove |
|---|---|
| Clone, branch, commit, push, pull, merge locali | Databricks Git folder |
| Pull request, revisione, approvazioni, regole di protezione dei branch | Provider Git (GitHub, Azure DevOps...) |
| Test automatici e deploy | Pipeline CI/CD (GitHub Actions, Azure Pipelines) che usa la **Databricks CLI** |

## File nel workspace

Un Git folder può contenere qualsiasi file: moduli Python importabili dai notebook (`from utils.pulizia import normalizza`), file di configurazione, test e il file `databricks.yml` dei bundle. Questo consente di scrivere codice **modulare e testabile** invece di logica duplicata nei notebook.

> Se una domanda chiede "dove si crea la pull request", la risposta è il **provider Git**, non Databricks.
