## Scenario

L'azienda **Contoso Retail** ha creato il workspace `Vendite-Analytics` che contiene un lakehouse `LH_Vendite`, un warehouse `WH_Vendite`, alcuni notebook, una pipeline e un modello semantico con i report.

Devi configurare gli accessi per queste persone:

1. **Data engineering** (gruppo Entra `GR-DataEng`): sviluppa notebook e pipeline, crea nuovi item. Non deve gestire gli accessi.
2. **Responsabile della piattaforma** (Giulia): deve poter aggiungere nuovi membri al team e condividere item, ma non eliminare il workspace.
3. **Data scientist del team Marketing** (gruppo `GR-DS-Mkt`): devono leggere con Spark i file Delta di `LH_Vendite`, ma **non** vedere gli altri item del workspace.
4. **Analisti finanziari** (gruppo `GR-Finanza`): devono creare i propri report sul modello semantico, senza accedere al workspace.
5. **Direzione** (gruppo `GR-Direzione`): consulta i report pubblicati nel workspace.

## Consegna

Per ogni punto indica **ruolo di workspace** oppure **condivisione dell'item con quali permessi**. Motiva brevemente ogni scelta applicando il principio del privilegio minimo.

<!-- SOLUZIONE -->

| # | Chi | Soluzione | Perché |
|---|---|---|---|
| 1 | `GR-DataEng` | Ruolo **Contributor** | Crea, modifica ed esegue item, senza gestire gli accessi. |
| 2 | Giulia | Ruolo **Member** | Può condividere item e aggiungere Member, Contributor e Viewer. Solo l'Admin può eliminare il workspace o aggiungere altri Admin. |
| 3 | `GR-DS-Mkt` | Condivisione di `LH_Vendite` con **Read + ReadAll** | Accedono solo al lakehouse; *ReadAll* consente di leggere i file in OneLake con Spark. Nessun ruolo di workspace, così non vedono gli altri item. |
| 4 | `GR-Finanza` | Permesso **Build** sul modello semantico (più *Read*) | Possono creare report con connessione live al modello, anche da Excel, senza entrare nel workspace. |
| 5 | `GR-Direzione` | Ruolo **Viewer** (oppure un'**app** del workspace) | Devono solo consultare. Un'app permette anche di scegliere quali report mostrare. |

**Nota**: assegnare i ruoli a gruppi Entra, invece che a singoli utenti, rende la gestione più semplice: quando una persona cambia team basta modificare il gruppo.
