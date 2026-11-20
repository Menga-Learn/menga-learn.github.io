**Direct Lake** è la modalità di archiviazione nativa di Fabric: unisce le prestazioni di Import alla freschezza di DirectQuery, leggendo le tabelle **Delta Parquet** direttamente da OneLake. Il DP-600 ne verifica a fondo il comportamento.

## Come funziona il caricamento

1. **Framing** (il "refresh" di Direct Lake): il modello registra quale versione delle tabelle Delta usare. È un'operazione di soli metadati, veloce ed economica.
2. **Transcoding**: alla prima query su una colonna, i dati di quella colonna vengono letti dai file Parquet e caricati in memoria nel formato VertiPaq.
3. Le colonne restano in memoria finché servono; quelle poco usate possono essere rimosse (*paging out*) in caso di pressione sulla memoria.

Con l'opzione **"Mantieni aggiornati i dati Direct Lake"** (aggiornamenti automatici), il modello esegue il framing automaticamente quando le tabelle Delta cambiano. Se la disattivi, il framing avviene solo quando avvii o pianifichi un refresh: utile quando vuoi che i report mostrino i dati solo dopo che l'intero ETL è terminato in modo coerente.

## Fallback su DirectQuery

Un modello **Direct Lake sulle tabelle dell'endpoint SQL** può passare (*fallback*) a **DirectQuery** verso l'endpoint SQL quando non riesce a lavorare in Direct Lake, ad esempio quando:

- il modello usa una **vista** SQL invece di una tabella;
- l'endpoint SQL applica **sicurezza a livello di riga o di oggetto** (RLS/OLS definita in SQL);
- una tabella supera i **guardrail** della capacità (numero di righe, file Parquet, gruppi di righe, dimensioni in memoria).

La proprietà **DirectLakeBehavior** del modello controlla questo comportamento:

| Valore | Effetto |
|---|---|
| `Automatic` (predefinito) | Fallback consentito quando necessario |
| `DirectLakeOnly` | Nessun fallback: se non può usare Direct Lake, la query restituisce un errore |
| `DirectQueryOnly` | Tutte le query in DirectQuery (utile per test) |

Impostare `DirectLakeOnly` è utile per **garantire prestazioni prevedibili** e scoprire subito i problemi, invece di subire rallentamenti silenziosi.

## Direct Lake su OneLake o sull'endpoint SQL?

Esistono due varianti:

| | **Direct Lake su endpoint SQL** | **Direct Lake su OneLake** |
|---|---|---|
| Sorgente | Tabelle di un singolo lakehouse o warehouse, tramite il suo endpoint SQL | Tabelle Delta direttamente in OneLake, anche da **più item** |
| Fallback a DirectQuery | Possibile | **Non disponibile** |
| Viste SQL | Supportate (con fallback) | Non supportate: servono tabelle Delta |
| Sicurezza applicata | Permessi e sicurezza dell'endpoint SQL | **Sicurezza di OneLake** |
| Combinazione con tabelle Import | No | Sì, in modelli compositi |

Scegli **Direct Lake su OneLake** quando vuoi combinare tabelle di più lakehouse o warehouse, applicare la sicurezza definita in OneLake o aggiungere tabelle Import. Scegli **su endpoint SQL** quando ti servono viste SQL o la sicurezza definita nell'endpoint, accettando il possibile fallback.

## Buone pratiche per tabelle Delta veloci

- Scrivi le tabelle con **V-Order** (ottimizzazione di Fabric per la lettura VertiPaq).
- Esegui periodicamente `OPTIMIZE` per compattare i file piccoli e `VACUUM` per rimuovere i file non più referenziati.
- Riduci la cardinalità delle colonne e rimuovi quelle inutili già nel lakehouse: in Direct Lake non c'è Power Query per farlo nel modello.
- Partiziona solo tabelle molto grandi e su colonne a bassa cardinalità.
