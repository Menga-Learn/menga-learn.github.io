## Scenario

Il team dati di **Contoso Retail** usa Databricks su Azure. Per ogni esigenza scegli il tipo di compute più adatto e motiva la scelta pensando a costi, tempi di avvio e configurazione.

1. Un job notturno di 40 minuti che elabora gli ordini del giorno. Non richiede librerie particolari.
2. Venti analisti che interrogano le tabelle gold con SQL e una dashboard aziendale aperta tutto il giorno.
3. Tre data engineer che sviluppano insieme notebook PySpark sulle tabelle di Unity Catalog.
4. Un job che usa una libreria nativa installata con uno script di inizializzazione e un tipo di macchina con GPU.
5. Un job di produzione che oggi gira su un cluster all-purpose sempre acceso "per non aspettare l'avvio".
6. Una pipeline dichiarativa che aggiorna streaming table e materialized view ogni ora.

<!-- SOLUZIONE -->

| # | Compute | Motivo |
|---|---|---|
| 1 | **Serverless per job** (o jobs compute classico) | Nessuna gestione dei cluster, avvio rapido, si paga solo la durata del job. |
| 2 | **SQL warehouse serverless** | Ottimizzato per SQL e BI con Photon, scalabilità per molti utenti concorrenti, avvio in pochi secondi. |
| 3 | **Serverless per notebook** oppure **all-purpose** in modalità di accesso **standard** | Collaborazione di più utenti con la governance di Unity Catalog; impostare l'auto-termination se classico. |
| 4 | **Jobs compute classico** in modalità **dedicated** | Servono script di init, librerie native e GPU: configurazioni non disponibili sul serverless. |
| 5 | **Jobs compute** o **serverless** | Un all-purpose sempre acceso ha tariffa DBU più alta e costa anche quando è inattivo. Per ridurre i tempi di avvio del classico si può usare un **instance pool**. |
| 6 | **Pipeline serverless** | Il compute è gestito dalla pipeline con scalabilità automatica; nessun cluster da dimensionare. |

**Da ricordare**: all-purpose = sviluppo interattivo; jobs compute/serverless = produzione; SQL warehouse = BI.
