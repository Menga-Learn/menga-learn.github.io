## Scenario

Organizza catalog, schemi e permessi per il dominio **Vendite** di Contoso:

- tre ambienti: sviluppo, test, produzione; i dati di produzione devono essere raggiungibili **solo** dal workspace di produzione;
- strati bronze, silver e gold;
- `data-engineers-vendite`: in sviluppo possono fare tutto; in produzione possono solo **leggere** i dati e vedere i job;
- `sp-vendite-prod` (service principal): esegue i job di produzione e scrive in tutti gli strati;
- `analisti-vendite`: leggono **tutto il gold**, anche le tabelle future, ma non bronze e silver;
- `catalogo-aziendale`: tutti i dipendenti devono poter **scoprire** le tabelle gold e capire cosa contengono, senza leggerne i dati;
- la proprietà degli oggetti di produzione non deve dipendere da una persona.

## Consegna

Descrivi la gerarchia e scrivi le principali istruzioni SQL di produzione, inclusi commenti e tag.

<!-- SOLUZIONE -->

**Gerarchia**: un catalog per ambiente: `vendite_dev`, `vendite_test`, `vendite_prod`, ognuno con gli schemi `bronze`, `silver`, `gold`. Il catalog `vendite_prod` è vincolato (**workspace binding**) al solo workspace di produzione.

~~~sql
-- proprietà a un gruppo, non a una persona
ALTER CATALOG vendite_prod OWNER TO `admin-piattaforma`;

-- service principal: scrive ovunque in produzione
GRANT USE CATALOG, USE SCHEMA, SELECT, MODIFY, CREATE TABLE, CREATE MATERIALIZED VIEW
  ON CATALOG vendite_prod TO `sp-vendite-prod`;

-- data engineer: sola lettura in produzione
GRANT USE CATALOG, USE SCHEMA, SELECT ON CATALOG vendite_prod TO `data-engineers-vendite`;

-- analisti: solo gold, incluse le tabelle future (ereditarietà dallo schema)
GRANT USE CATALOG ON CATALOG vendite_prod TO `analisti-vendite`;
GRANT USE SCHEMA, SELECT ON SCHEMA vendite_prod.gold TO `analisti-vendite`;

-- scoperta senza accesso ai dati
GRANT BROWSE ON CATALOG vendite_prod TO `catalogo-aziendale`;

-- metadati per la ricerca
COMMENT ON SCHEMA vendite_prod.gold IS 'Dati certificati del dominio Vendite per BI e analisi';
ALTER SCHEMA vendite_prod.gold SET TAGS ('dominio' = 'vendite', 'livello' = 'gold', 'certificato' = 'true');
COMMENT ON TABLE vendite_prod.gold.vendite_mensili IS 'Vendite nette mensili per paese e canale, aggiornate ogni ora';
~~~

**Permessi sul workspace**: sui job di produzione `data-engineers-vendite` ha `CAN VIEW`; i job girano con `run_as` = `sp-vendite-prod` (impostato nel bundle).

**Attenzione all'ereditarietà**: dare `SELECT` sul catalog agli analisti avrebbe concesso anche bronze e silver, senza possibilità di escluderli (non esiste `DENY`). Per questo il privilegio è concesso sullo **schema gold**. In `vendite_dev` i data engineer ricevono `ALL PRIVILEGES` sul catalog.
