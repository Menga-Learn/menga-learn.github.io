## Scenario

Nel warehouse `WH_Vendite` hai queste tabelle:

- `dbo.Vendite (IdVendita, Data, Regione, IdCliente, Importo)`
- `dbo.Clienti (IdCliente, Nome, Email, Telefono, Regione)`
- `dbo.ResponsabiliRegione (Email, Regione)` che associa ogni responsabile alla propria regione

## Consegna

Scrivi il codice T-SQL per:

1. fare in modo che ogni responsabile veda in `dbo.Vendite` **solo le righe della propria regione** (sicurezza a livello di riga);
2. mascherare la colonna `Email` dei clienti con la funzione per gli indirizzi email e la colonna `Telefono` mostrando solo le ultime 3 cifre;
3. concedere al gruppo `supporto@contoso.com` la lettura di `dbo.Clienti` **senza** la colonna `Telefono`.

<!-- SOLUZIONE -->

### 1. Sicurezza a livello di riga

~~~sql
CREATE SCHEMA sicurezza;
GO

CREATE FUNCTION sicurezza.fn_regione(@Regione AS varchar(50))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS consentito
    FROM dbo.ResponsabiliRegione AS r
    WHERE r.Regione = @Regione
      AND r.Email = USER_NAME();
GO

CREATE SECURITY POLICY sicurezza.PolicyVendite
ADD FILTER PREDICATE sicurezza.fn_regione(Regione) ON dbo.Vendite
WITH (STATE = ON);
~~~

- La funzione è **inline** e con `SCHEMABINDING`, come richiesto per i predicati.
- `USER_NAME()` restituisce l'identità dell'utente connesso (il suo UPN in Fabric).

### 2. Mascheramento dinamico

~~~sql
ALTER TABLE dbo.Clienti
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');

ALTER TABLE dbo.Clienti
ALTER COLUMN Telefono ADD MASKED WITH (FUNCTION = 'partial(0, "XXXXXXX", 3)');
~~~

Gli utenti con permesso `UNMASK` (e gli amministratori del workspace) vedono i valori reali.

### 3. Sicurezza a livello di colonna

~~~sql
GRANT SELECT ON dbo.Clienti (IdCliente, Nome, Email, Regione) TO [supporto@contoso.com];
~~~

Il gruppo vedrà `Email` mascherata (punto 2) e riceverà un errore se prova a leggere `Telefono`.
