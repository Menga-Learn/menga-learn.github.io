Il **diritto alla cancellazione** (art. 17 del GDPR) richiede di eliminare i dati personali di una persona su richiesta, entro tempi definiti. In un lakehouse con Delta Lake questo richiede attenzione: un `DELETE` da solo **non** basta.

## Perché il DELETE non basta

- Delta conserva le **versioni precedenti** per il time travel: i file con i dati della persona restano finché `VACUUM` non li elimina.
- Con i **deletion vectors** le righe sono solo *marcate* come eliminate: i dati sono ancora nei file Parquet.
- Il **Change Data Feed** conserva le immagini precedenti delle righe.
- Le stesse informazioni possono essere in bronze, silver, gold, copie, share ed export.

## Procedura completa

~~~sql
-- 1. eliminare logicamente in tutti gli strati (bronze, silver, gold)
DELETE FROM prod.silver.clienti WHERE id_cliente IN (SELECT id_cliente FROM prod.privacy.richieste_cancellazione);

-- 2. se ci sono deletion vectors, riscrivere i file per rimuovere fisicamente le righe
REORG TABLE prod.silver.clienti APPLY (PURGE);

-- 3. rimuovere i file non più referenziati (dopo la soglia di conservazione)
VACUUM prod.silver.clienti;            -- predefinito: 7 giorni
~~~

- La soglia di `VACUUM` (proprietà `delta.deletedFileRetentionDuration`) deve essere compatibile con le scadenze legali: una conservazione di 7 giorni significa che i dati spariscono fisicamente al massimo 7 giorni dopo il purge.
- Abbassare la soglia sotto i 7 giorni richiede di disattivare un controllo di sicurezza ed elimina la possibilità di time travel e di leggere versioni da parte di stream in corso: va fatto con cautela.
- Le tabelle con **Predictive Optimization** eseguono `VACUUM` automaticamente.

## Progettare per la cancellazione

| Pratica | Beneficio |
|---|---|
| Tabella delle **richieste di cancellazione** e job pianificato che le applica a tutte le tabelle | Processo ripetibile e verificabile |
| **Tag** sulle colonne PII e lineage di UC | Sapere dove si trovano i dati della persona |
| **Pseudonimizzazione** con tabella di mappatura separata | Basta cancellare la riga di mappatura per rendere anonimi i dati a valle (*crypto-shredding* se si usa una chiave per persona) |
| Liquid Clustering per `id_cliente` sulle tabelle grandi | I `DELETE` toccano meno file |
| Deletion vectors | `DELETE` rapidi, seguiti da purge pianificato |
| Policy di **conservazione** (es. eliminare ordini più vecchi di 10 anni) | Rispetto dei tempi di conservazione |

Nelle pipeline dichiarative le streaming table non accettano cancellazioni a valle dalla sorgente in streaming: per i casi GDPR si usano le opzioni `skipChangeCommits` sui consumatori o si applicano le cancellazioni direttamente sulle tabelle, seguendo le indicazioni della documentazione.

> Tranello: "dopo il DELETE i dati sono ancora visibili con `VERSION AS OF`". Corretto: per eliminarli fisicamente servono **purge** (se deletion vectors) e **VACUUM**.
