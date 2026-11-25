La governance non è solo sicurezza: i dati devono essere **trovabili**, **comprensibili** e gestiti con permessi coerenti. Unity Catalog fornisce metadati (tag e commenti) e un modello di permessi **ereditato**.

## Commenti e tag

~~~sql
COMMENT ON TABLE prod.gold.vendite_mensili IS 'Vendite nette per mese e paese, aggiornate ogni ora';
ALTER TABLE prod.gold.vendite_mensili ALTER COLUMN totale COMMENT 'Importo netto in EUR, IVA esclusa';

ALTER TABLE prod.gold.vendite_mensili SET TAGS ('dominio' = 'vendite', 'livello' = 'gold', 'owner_team' = 'bi');
ALTER TABLE prod.silver.clienti ALTER COLUMN email SET TAGS ('pii' = 'email');
ALTER SCHEMA prod.vendite SET TAGS ('certificato' = 'true');
~~~

- I **commenti** descrivono il significato: compaiono in Catalog Explorer, nella ricerca e sono usati dall'assistente AI e da Genie per capire i dati. Si possono generare con l'AI e poi rivedere.
- I **tag** sono coppie chiave/valore su catalog, schema, tabelle, colonne, volumi: servono per **ricerca**, classificazione, attribuzione dei costi e **policy ABAC** (tag governati).
- I metadati sono interrogabili in `information_schema`:

~~~sql
SELECT table_name, column_name, tag_value
FROM prod.information_schema.column_tags
WHERE tag_name = 'pii';
~~~

## Ereditarietà dei permessi

I privilegi concessi su un contenitore si propagano agli oggetti al suo interno, **presenti e futuri**:

~~~text
catalog prod            GRANT SELECT → vale per tutti gli schemi e le tabelle di prod
└── schema vendite      GRANT SELECT → vale per tutte le tabelle di vendite
    └── tabella ordini  GRANT SELECT → vale solo per ordini
~~~

Regole da ricordare:

- Per accedere a un oggetto servono **sempre** anche `USE CATALOG` e `USE SCHEMA` sui contenitori: un `SELECT` sul catalog senza `USE SCHEMA` non basta per leggere.
- Un privilegio ereditato **non si può togliere** a un livello inferiore: non esiste `DENY`. Se un gruppo ha `SELECT` sul catalog, vede tutte le tabelle; per escluderne una bisogna concedere a livello più basso (schemi o tabelle specifiche).
- Il **proprietario** di un oggetto ha tutti i privilegi su di esso; il proprietario di un catalog o schema può gestire i permessi degli oggetti contenuti.
- `MANAGE` permette di gestire i permessi di un oggetto senza esserne proprietario.
- `BROWSE` sul catalog consente di vedere i metadati (e richiedere l'accesso) senza leggere i dati.

## Progettare la gerarchia

| Scelta | Motivo |
|---|---|
| Catalog per **ambiente** (`dev`, `test`, `prod`) o per **dominio** (`vendite`, `finanza`) | I permessi ampi si danno al livello del catalog |
| Schema per **strato** o area (`bronze`, `silver`, `gold`) | Lettura del gold ai consumatori, bronze ristretto |
| Workspace binding del catalog `prod` | Accesso ai dati di produzione solo dal workspace di produzione |

> "Un gruppo deve leggere tutte le tabelle gold, comprese quelle future, ma non il bronze" → `USE CATALOG` sul catalog, `USE SCHEMA` + `SELECT` **sullo schema gold**, nulla sul bronze.
