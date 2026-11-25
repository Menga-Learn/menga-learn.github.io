In Unity Catalog i permessi si concedono con SQL o dall'interfaccia (Catalog Explorer) a **utenti**, **gruppi** e **service principal**. La buona pratica è concedere ai **gruppi**, non alle singole persone.

## Privilegi principali

| Privilegio | Su | Permette |
|---|---|---|
| `USE CATALOG` / `USE SCHEMA` | Catalog, schema | "Attraversare" il contenitore: necessari per raggiungere gli oggetti al suo interno |
| `SELECT` | Tabella, vista (o schema/catalog per ereditarietà) | Leggere |
| `MODIFY` | Tabella | Inserire, aggiornare, eliminare righe |
| `CREATE TABLE`, `CREATE SCHEMA` | Schema, catalog | Creare oggetti |
| `BROWSE` | Catalog | Vedere i metadati senza leggere i dati |
| `ALL PRIVILEGES` | Qualsiasi | Tutti i privilegi applicabili |

Per leggere `prod.vendite.ordini` servono quindi **tre** permessi: `USE CATALOG` su `prod`, `USE SCHEMA` su `prod.vendite`, `SELECT` sulla tabella (o sullo schema).

~~~sql
GRANT USE CATALOG ON CATALOG prod TO `analisti`;
GRANT USE SCHEMA, SELECT ON SCHEMA prod.vendite TO `analisti`;   -- vale anche per le tabelle future
REVOKE SELECT ON SCHEMA prod.vendite FROM `stagisti`;
SHOW GRANTS ON SCHEMA prod.vendite;
~~~

I privilegi sono **ereditati**: un `SELECT` sullo schema vale per tutte le tabelle, presenti e future. Il **proprietario** di un oggetto ha tutti i privilegi e può concederli. Unity Catalog **non** prevede un `DENY`: per togliere un accesso si revoca il privilegio o si concede a un livello più basso (il `DENY` esiste solo nei vecchi controlli di accesso delle tabelle dell'Hive metastore).

## Row filter e column mask

Si basano su funzioni SQL che controllano l'appartenenza a un gruppo con `is_account_group_member()`:

~~~sql
CREATE FUNCTION prod.sicurezza.filtro_paese(paese STRING)
RETURN is_account_group_member('admin') OR paese = 'IT';

ALTER TABLE prod.vendite.ordini SET ROW FILTER prod.sicurezza.filtro_paese ON (paese);

CREATE FUNCTION prod.sicurezza.maschera_email(email STRING)
RETURN CASE WHEN is_account_group_member('hr') THEN email ELSE '***@***' END;

ALTER TABLE prod.vendite.clienti ALTER COLUMN email SET MASK prod.sicurezza.maschera_email;
~~~

Un'alternativa per i filtri è una **vista dinamica** che usa le stesse funzioni nella clausola `WHERE` o in un `CASE`.

## ABAC: policy basate su attributi

Quando le tabelle sono tante, definire filtri e maschere una per una non scala. Con l'**ABAC** di Unity Catalog si assegnano **tag governati** alle colonne (es. `pii = email`) e si crea una **policy** a livello di catalog o schema che applica una maschera o un filtro a **tutte** le colonne o tabelle con quel tag, per i gruppi indicati, con eventuali eccezioni.

~~~sql
CREATE POLICY maschera_pii ON SCHEMA prod.vendite
COLUMN MASK prod.sicurezza.maschera_email
TO `account users` EXCEPT `hr`
FOR TABLES
MATCH COLUMNS has_tag_value('pii', 'email') AS col
ON COLUMN col;
~~~

Le nuove tabelle con colonne taggate sono protette automaticamente.

> Ricorda: filtro o maschera su **una** tabella → `SET ROW FILTER` / `SET MASK`; su **molte** tabelle in base ai tag → **policy ABAC**.
