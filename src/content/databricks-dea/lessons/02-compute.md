Scegliere il **compute** giusto è una domanda frequente: bisogna bilanciare tempo di avvio, controllo della configurazione, isolamento e costo. In Databricks il costo si misura in **DBU** (Databricks Unit) per ora, a cui si somma, per il compute classico, il costo delle macchine del provider cloud.

## Tipi di compute

| Tipo | Uso tipico | Note |
|---|---|---|
| **Serverless per notebook e job** | Sviluppo interattivo e job senza gestione di cluster | Avvio in pochi secondi, scalabilità automatica, nessuna VM da configurare; si paga solo il consumo DBU. Meno parametri personalizzabili. |
| **All-purpose compute** (classico) | Sviluppo interattivo e collaborativo | Resta acceso finché non va in *auto-termination*; tariffa DBU più alta dei job compute. |
| **Jobs compute** (classico) | Job pianificati in produzione | Creato all'avvio del job e distrutto alla fine; tariffa più bassa. |
| **SQL warehouse** (serverless, pro, classic) | Query SQL, dashboard, strumenti BI | Ottimizzato con Photon; il serverless si avvia in pochi secondi. |
| **Pipeline** (Lakeflow Spark Declarative Pipelines) | ETL dichiarativo | Il compute è gestito dalla pipeline, serverless consigliato. |

**Instance pool**: insieme di VM inattive pronte all'uso che riduce i tempi di avvio dei cluster classici.

## Modalità di accesso

- **Standard** (prima chiamata *shared*): più utenti condividono il cluster con isolamento; compatibile con Unity Catalog. Alcune funzionalità a basso livello (ad esempio RDD) sono limitate.
- **Dedicated** (prima *single user*): assegnato a un utente o gruppo, supporta tutte le API, incluse quelle di machine learning.

## Configurazione del cluster classico

- **Autoscaling** tra un minimo e un massimo di worker: utile per carichi variabili.
- **Auto-termination** dopo N minuti di inattività: evita costi inutili.
- **Photon**: motore vettorizzato in C++ che accelera SQL e DataFrame, con un costo DBU maggiore.
- **Databricks Runtime**: versione di Spark e librerie; la variante *ML* include le librerie per il machine learning.

## Come scegliere

1. Job di produzione pianificato con classico → **jobs compute**, mai all-purpose (costa di più).
2. Nessuna esigenza di configurazione particolare e avvio rapido → **serverless**.
3. Analisti che lanciano query SQL e dashboard → **SQL warehouse** serverless.
4. Sviluppo condiviso da più persone con governance UC → all-purpose in modalità **standard**.
5. Librerie native o accesso a basso livello → modalità **dedicated**.

> Parole chiave: "ridurre i costi di un job notturno" → jobs compute o serverless; "avvio istantaneo senza gestire cluster" → serverless; "BI e SQL" → SQL warehouse.
