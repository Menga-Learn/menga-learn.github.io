Nelle pipeline dichiarative la qualità si gestisce con le **expectations**. Il Professional richiede di scegliere la strategia giusta: avvisare, scartare, bloccare o **mettere in quarantena**.

## Le tre azioni

| Python | SQL | Effetto |
|---|---|---|
| `@dp.expect("nome", "condizione")` | `EXPECT (condizione)` | Mantiene la riga, registra la violazione |
| `@dp.expect_or_drop(...)` | `ON VIOLATION DROP ROW` | Scarta la riga |
| `@dp.expect_or_fail(...)` | `ON VIOLATION FAIL UPDATE` | Interrompe l'aggiornamento del flusso |

Più regole insieme: `@dp.expect_all({...})`, `@dp.expect_all_or_drop({...})`, `@dp.expect_all_or_fail({...})`.

## Quarantena

Scartare le righe le fa sparire; spesso invece si vuole **conservarle** per analizzarle o correggerle. Lo schema più comune usa due tabelle con condizioni complementari:

~~~python
from pyspark import pipelines as dp

regole = {
    "id_valido": "id_ordine IS NOT NULL",
    "importo_valido": "importo >= 0",
}
condizione_valida = " AND ".join(f"({r})" for r in regole.values())

@dp.table
@dp.expect_all_or_drop(regole)
def silver_ordini():
    return spark.readStream.table("bronze_ordini")

@dp.table
def quarantena_ordini():
    return spark.readStream.table("bronze_ordini").filter(f"NOT ({condizione_valida})")
~~~

Un'alternativa è aggiungere una colonna `is_quarantined` calcolata con le stesse regole e creare due viste o tabelle filtrate. L'importante è che le righe non valide finiscano in un posto dove si possono controllare e, se serve, rielaborare.

## Scegliere la strategia

| Situazione | Azione |
|---|---|
| Dato imperfetto ma utilizzabile (es. telefono mancante) | **warn**: mantieni e monitora |
| Record inutilizzabile e non recuperabile | **drop** |
| Record da correggere e rielaborare | **quarantena** |
| Violazione che indica un problema grave a monte (schema rotto, chiave primaria duplicata in massa) | **fail**: meglio fermarsi che propagare dati sbagliati |

## Dove vedere i risultati

Le metriche delle expectations (righe passate e fallite per regola) sono:

- nella **pagina della pipeline** (scheda *Data quality*);
- nell'**event log** della pipeline, negli eventi `flow_progress` nel campo `details:flow_progress.data_quality.expectations`.

Si possono così creare **alert** quando la percentuale di righe scartate supera una soglia.

> Le expectations si definiscono su streaming table e materialized view delle pipeline. Fuori dalle pipeline restano i vincoli `CHECK` e `NOT NULL` delle tabelle Delta.
