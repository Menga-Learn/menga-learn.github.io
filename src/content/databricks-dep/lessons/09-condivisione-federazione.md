Non tutti i dati devono essere copiati. Databricks offre tre modi per lavorare con dati di altri: **condividerli**, **collaborare** senza vederli e **interrogarli** dove sono.

## OpenSharing (Delta Sharing)

Protocollo aperto per condividere dati in sola lettura **senza copiarli**, governato da Unity Catalog.

| Modalità | Destinatario | Autenticazione |
|---|---|---|
| **Databricks-to-Databricks** (D2D) | Un altro workspace Databricks con Unity Catalog (anche altro cloud o regione) | Identificativo del metastore del destinatario, nessun token da gestire |
| **Databricks-to-Open** (aperta) | Qualsiasi client: pandas, Spark, Power BI, altri motori | Token o federazione OIDC |

~~~sql
CREATE SHARE vendite_partner COMMENT 'Dati per il partner logistico';
ALTER SHARE vendite_partner ADD TABLE prod.gold.spedizioni
  WITH HISTORY;                                    -- consente time travel e CDF al destinatario
ALTER SHARE vendite_partner ADD TABLE prod.gold.ordini
  PARTITION (paese = 'IT');                        -- condivide solo una parte
CREATE RECIPIENT logistica_spa USING ID 'azure:westeurope:<metastore-id>';
GRANT SELECT ON SHARE vendite_partner TO RECIPIENT logistica_spa;
~~~

Il destinatario crea un **catalog dalla share** e legge i dati sempre aggiornati. Si possono condividere tabelle, viste, volumi, modelli e notebook. Con `WITH HISTORY` il destinatario può leggere il **Change Data Feed** in streaming.

## Clean Rooms

Una **clean room** è un ambiente in cui più organizzazioni collaborano su dati combinati **senza accedere ai dati grezzi** dell'altra parte. Ogni partecipante aggiunge le proprie tabelle; si eseguono solo **notebook approvati** e i risultati (es. aggregati di sovrapposizione clienti) finiscono in tabelle di output. Caso tipico: un retailer e un inserzionista misurano una campagna senza scambiarsi le anagrafiche.

## Lakehouse Federation

Permette di interrogare database esterni (PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery, Redshift, Oracle...) **senza ingestione**, con la governance di Unity Catalog.

~~~sql
CREATE CONNECTION crm_pg TYPE postgresql
OPTIONS (host 'pg.contoso.local', port '5432',
         user secret('crm', 'user'), password secret('crm', 'password'));

CREATE FOREIGN CATALOG crm USING CONNECTION crm_pg OPTIONS (database 'crm');

GRANT USE CATALOG, USE SCHEMA, SELECT ON CATALOG crm TO `analisti`;
SELECT * FROM crm.public.clienti WHERE paese = 'IT';
~~~

- La **connessione** contiene le credenziali (da secret): gli utenti non le vedono. Il privilegio `USE CONNECTION` / `CREATE FOREIGN CATALOG` è controllato da UC.
- Il **foreign catalog** rispecchia lo schema remoto; i permessi si concedono come su qualsiasi catalog.
- Filtri e aggregazioni vengono **spinti** (*pushdown*) quando possibile verso il database di origine.
- Esiste anche la federazione **di catalogo** (es. Hive metastore o AWS Glue) che legge direttamente dallo storage.

## Come scegliere

| Esigenza | Soluzione |
|---|---|
| Dare dati aggiornati a un partner senza copie | **OpenSharing** |
| Analisi congiunta senza che nessuno veda i dati dell'altro | **Clean Room** |
| Interrogare un database operativo occasionalmente, senza pipeline | **Lakehouse Federation** |
| Analisi pesanti e frequenti su quei dati | Ingestione (Lakeflow Connect) |

> La federazione è ideale per esplorazione e query occasionali; per carichi pesanti e ripetuti conviene acquisire i dati.
