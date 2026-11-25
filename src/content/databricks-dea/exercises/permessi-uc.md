## Scenario

Nel catalog `prod` lo schema `vendite` contiene le tabelle `ordini` (con la colonna `paese`) e `clienti` (con la colonna `email`).

Requisiti:

1. il gruppo `analisti` deve leggere **tutte** le tabelle dello schema, anche quelle che verranno create in futuro, senza poterle modificare;
2. il gruppo `ingestione` (un service principal ne fa parte) deve poter inserire e aggiornare righe in `ordini`;
3. il gruppo `agenti_it` deve vedere solo gli ordini con `paese = 'IT'`; il gruppo `direzione` vede tutto;
4. l'email dei clienti deve essere visibile in chiaro solo al gruppo `crm`, mascherata per tutti gli altri;
5. lo stagista `luca@contoso.com`, che ha ricevuto per errore `SELECT` sulla tabella `clienti`, non deve più leggerla.

## Consegna

Scrivi le istruzioni SQL. Le funzioni di sicurezza vanno nello schema `prod.sicurezza`.

<!-- SOLUZIONE -->

~~~sql
-- 1. lettura su tutto lo schema (ereditata anche dalle tabelle future)
GRANT USE CATALOG ON CATALOG prod TO `analisti`;
GRANT USE SCHEMA, SELECT ON SCHEMA prod.vendite TO `analisti`;

-- 2. scrittura su una sola tabella
GRANT USE CATALOG ON CATALOG prod TO `ingestione`;
GRANT USE SCHEMA ON SCHEMA prod.vendite TO `ingestione`;
GRANT SELECT, MODIFY ON TABLE prod.vendite.ordini TO `ingestione`;

-- 3. row filter
CREATE OR REPLACE FUNCTION prod.sicurezza.filtro_paese(paese STRING)
RETURN is_account_group_member('direzione')
    OR (is_account_group_member('agenti_it') AND paese = 'IT');
ALTER TABLE prod.vendite.ordini SET ROW FILTER prod.sicurezza.filtro_paese ON (paese);

-- 4. column mask
CREATE OR REPLACE FUNCTION prod.sicurezza.maschera_email(email STRING)
RETURN CASE WHEN is_account_group_member('crm') THEN email
            ELSE concat('***@', split(email, '@')[1]) END;
ALTER TABLE prod.vendite.clienti ALTER COLUMN email SET MASK prod.sicurezza.maschera_email;

-- 5. revoca
REVOKE SELECT ON TABLE prod.vendite.clienti FROM `luca@contoso.com`;
~~~

**Attenzione**

- Il filtro del punto 3 nasconde **tutte** le righe a chi non è in `direzione` o `agenti_it`: se gli `analisti` devono vedere tutto, vanno aggiunti alla condizione.
- Unity Catalog non ha `DENY`. Se Luca leggesse la tabella grazie a un gruppo (es. `analisti`), revocare il permesso personale non basterebbe: bisognerebbe toglierlo dal gruppo.
- Con molte tabelle con colonne email, una **policy ABAC** basata su un tag governato (`pii = email`) eviterebbe di ripetere il punto 4 su ogni tabella.
