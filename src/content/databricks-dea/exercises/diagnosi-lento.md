## Scenario

Il job `aggrega-eventi` di solito dura 12 minuti. Da una settimana dura 55 minuti. Il volume dei dati è cresciuto solo del 5%.

Dalla Spark UI dello stage più lento (un `groupBy` per `id_cliente` dopo un join tra `eventi`, 800 GB, e `clienti`, 40 MB):

- 200 task; durata mediana 6 secondi, durata massima **41 minuti**;
- il task più lento legge 90 GB di shuffle, la mediana 300 MB;
- *Spill (Disk)* di 60 GB nel solo task più lento;
- il piano mostra un **sort-merge join** tra `eventi` e `clienti`.

Un controllo rivela che una nuova applicazione invia milioni di eventi con `id_cliente = NULL`.

## Consegna

1. Qual è il problema principale? Come lo riconosci?
2. Proponi almeno tre interventi.
3. Come verifichi che hanno funzionato?

<!-- SOLUZIONE -->

**1. Diagnosi**: è un caso di **data skew**. La durata massima (41 min) è enormemente superiore alla mediana (6 s) e un solo task legge 90 GB di shuffle: tutti gli eventi con `id_cliente = NULL` finiscono nella stessa partizione. Lo **spill** su disco è una conseguenza: il task non ha memoria sufficiente per quella partizione.

**2. Interventi**

- **Gestire la chiave anomala**: filtrare o elaborare a parte le righe con `id_cliente` nullo (spesso non servono nell'aggregazione per cliente).
- **Broadcast join**: `clienti` pesa 40 MB, sopra la soglia predefinita di 10 MB. Usare `F.broadcast(clienti)` o alzare `spark.sql.autoBroadcastJoinThreshold` elimina lo shuffle di `eventi` per il join.
- Verificare che **AQE** e la gestione dello skew (`spark.sql.adaptive.skewJoin.enabled`) siano attivi.
- Se lo skew resta su chiavi valide, tecnica del **salting** (aggiungere un suffisso casuale alla chiave, aggregare in due passaggi).

**3. Verifica**: rieseguire il job e confrontare con la **baseline** (12 minuti) nella cronologia dei run di Lakeflow Jobs; nella Spark UI la durata massima dei task deve avvicinarsi alla mediana e lo spill deve sparire. Cambiare **un intervento alla volta** aiuta a capire quale ha avuto effetto.
