## Minimo privilegio

Il principio del **minimo privilegio** concede a ogni identità solo ciò che serve:

- permessi a **gruppi**, non a utenti singoli; i job di produzione girano come **service principal**;
- privilegi al livello più basso possibile (tabella o schema invece del catalog);
- separare i ruoli: chi scrive i dati (`MODIFY`) non è necessariamente chi li legge;
- **ownership** degli oggetti di produzione a un gruppo, non a una persona che potrebbe lasciare l'azienda;
- oltre agli oggetti UC, proteggere le risorse del workspace: permessi su job (`CAN VIEW`, `CAN MANAGE RUN`, `CAN MANAGE`, `IS OWNER`), cluster, SQL warehouse, notebook, secret scope;
- i **workspace binding** limitano un catalog a specifici workspace (es. il catalog `prod` accessibile solo dal workspace di produzione).

## ABAC con tag governati

I **tag governati** sono tag con valori ammessi controllati a livello di account (chi può assegnarli è a sua volta un permesso). Le **policy ABAC** usano i tag per applicare row filter e column mask a molti oggetti:

~~~sql
-- funzione di maschera riutilizzabile (in produzione il sale va custodito in modo protetto)
CREATE FUNCTION prod.sicurezza.pseudonimizza(valore STRING)
RETURN sha2(concat(valore, 'sale-riservato'), 256);

ALTER TABLE prod.silver.clienti ALTER COLUMN codice_fiscale SET TAGS ('pii' = 'identificativo');

CREATE POLICY pii_pseudonimi ON CATALOG prod
COLUMN MASK prod.sicurezza.pseudonimizza
TO `account users` EXCEPT `privacy_officer`
FOR TABLES
MATCH COLUMNS has_tag_value('pii', 'identificativo') AS c
ON COLUMN c;
~~~

La sintassi esatta delle policy può evolvere: verifica sempre la documentazione corrente. Vantaggi: una sola policy protegge centinaia di tabelle; le nuove colonne taggate sono protette subito; la classificazione automatica dei dati può proporre o applicare i tag.

## Anonimizzazione e pseudonimizzazione

| Tecnica | Esempio | Reversibile? |
|---|---|---|
| **Hashing** con sale | `sha2(concat(email, sale), 256)` | No, ma consente join coerenti |
| **Tokenizzazione** | Sostituire il valore con un token; la tabella token↔valore è protetta a parte | Sì, per chi accede alla tabella dei token |
| **Soppressione** | Eliminare o mascherare del tutto (`'***'`, `NULL`) | No |
| **Generalizzazione** | Età → fascia (30–39), CAP → provincia, data → mese | No |

Lo **pseudonimizzato** resta dato personale secondo il GDPR (si può risalire alla persona con informazioni aggiuntive); l'**anonimizzato** no.

## Pipeline conforme per i dati personali

1. **Classificare**: individuare le colonne PII (classificazione automatica di UC, `ai_mask` o regole) e assegnare i **tag**.
2. **Proteggere all'ingresso**: in silver pseudonimizzare o tokenizzare i campi sensibili, sia nei flussi **batch** sia **streaming** (la stessa funzione UC usata in entrambi).
3. **Controllare l'accesso**: policy ABAC su tag, bronze con accesso ristretto.
4. **Verificare**: expectations o query che controllano che nessun valore in chiaro arrivi in gold (es. regex email).
5. **Monitorare**: audit log degli accessi alle colonne sensibili.

> "Proteggere tutte le colonne PII di un catalog, anche future" → **tag governati + policy ABAC**; "join tra dataset senza esporre l'email" → **hashing con sale**.
