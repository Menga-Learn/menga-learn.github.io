## Scenario

Il job notturno `vendite-prod` (distribuito con un bundle, parametro `data_rif`) ha 8 task. Stanotte:

- `carica_ordini` e `carica_clienti`: riusciti;
- `silver_ordini`: **fallito** dopo 3 retry con `AnalysisException: [DELTA_FAILED_TO_MERGE_FIELDS] Failed to merge fields 'sconto' and 'sconto'` (la sorgente ha cambiato il tipo da INT a DECIMAL);
- 4 task a valle: *upstream failed*;
- `notifica`: riuscito (Run if = All done).

Inoltre il run del giorno 19 aveva elaborato per errore la data sbagliata e va ripetuto solo per il silver e il gold.

## Consegna

1. Analizza la causa e indica dove trovare le informazioni.
2. Come correggi e come completi il run di stanotte senza ripetere i caricamenti?
3. Come rielabori il giorno 19?
4. Che cosa cambieresti per evitare che succeda di nuovo?

<!-- SOLUZIONE -->

**1. Causa**: il messaggio indica un conflitto di **schema** nella scrittura Delta: la colonna `sconto` arriva come DECIMAL mentre la tabella la ha come INT. È un errore di **dati**, non transitorio: i 3 retry erano inutili. Le informazioni si trovano nell'output del task fallito (stack trace), nella cronologia della tabella e, per tendenze, in `system.lakeflow.job_task_run_timeline`.

**2. Correzione e completamento**

- Correggere la trasformazione: cast esplicito `F.col("sconto").cast("decimal(10,2)")` e modifica della tabella (`ALTER TABLE ... ALTER COLUMN sconto TYPE DECIMAL(10,2)` se il *type widening* è abilitato, oppure riscrittura della tabella). Aggiungere un unit test.
- Distribuire la correzione con `databricks bundle deploy -t prod` (via CI/CD).
- Usare **Repair run** sul run di stanotte: riesegue `silver_ordini` e i 4 task a valle, senza ripetere `carica_ordini` e `carica_clienti`.

**3. Giorno 19**: Repair run del run del 19 (o un nuovo run) con **override del parametro** `data_rif = 2026-11-19`, selezionando solo i task silver e gold (`rerun_tasks`). I task devono essere **idempotenti** (MERGE o overwrite della partizione/data) per non creare duplicati.

**4. Prevenzione**

- Retry solo per errori transitori; su questo task disattivarli o limitarli.
- Schema esplicito o `schemaHints` in ingestione e un'expectation o un controllo che faccia fallire presto con un messaggio chiaro.
- Alert sul fallimento e test di integrazione nel target `test` con dati recenti prima del deploy.
