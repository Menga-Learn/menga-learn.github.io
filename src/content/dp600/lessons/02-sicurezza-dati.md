Dopo aver deciso chi accede agli item, bisogna limitare **quali dati** ogni persona vede. Fabric offre controlli granulari sia nel **warehouse / endpoint SQL** sia nel **modello semantico**, oltre alla sicurezza su cartelle e file in OneLake.

## Sicurezza a livello di riga (RLS)

L'RLS filtra le righe restituite in base all'utente. Nel **warehouse** si implementa in T-SQL con una funzione predicato e una *security policy*:

```sql
CREATE SCHEMA sicurezza;
GO
CREATE FUNCTION sicurezza.fn_filtro_area(@Area AS varchar(50))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS consentito
       WHERE @Area = (SELECT Area FROM dbo.ResponsabiliArea
                      WHERE Email = USER_NAME());
GO
CREATE SECURITY POLICY sicurezza.FiltroVendite
ADD FILTER PREDICATE sicurezza.fn_filtro_area(Area) ON dbo.Vendite
WITH (STATE = ON);
```

Nel **modello semantico** l'RLS si definisce con ruoli e filtri DAX, ad esempio `[Email] = USERPRINCIPALNAME()` sulla tabella dei venditori. Il filtro si propaga alle tabelle collegate tramite le relazioni.

## Sicurezza a livello di colonna (CLS)

Per nascondere colonne sensibili nel warehouse si concede `SELECT` solo sulle colonne consentite:

```sql
GRANT SELECT ON dbo.Clienti (IdCliente, Nome, Citta) TO [analisti@contoso.com];
```

Chi interroga una colonna non autorizzata riceve un errore: la colonna non viene semplicemente svuotata.

## Sicurezza a livello di oggetto (OLS)

Nel modello semantico l'**OLS** nasconde intere tabelle o colonne ai membri di un ruolo: per loro l'oggetto *non esiste*, quindi anche le misure che lo referenziano smettono di funzionare. Si configura con strumenti esterni come Tabular Editor tramite l'**endpoint XMLA**, oppure nell'editor dei ruoli disponibile nel servizio.

## Mascheramento dinamico dei dati (DDM)

Il DDM non protegge il dato, ma ne **offusca la visualizzazione** per gli utenti senza il permesso `UNMASK`:

```sql
ALTER TABLE dbo.Clienti
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');
```

Funzioni disponibili: `default()`, `email()`, `random(inizio, fine)` per i numeri e `partial(prefisso, riempimento, suffisso)` per le stringhe. Il DDM è utile per supporto e test, ma **non sostituisce** CLS o RLS: un utente con accesso alla colonna può comunque dedurre i valori con query mirate.

## Sicurezza su cartelle e file

Con la **sicurezza di OneLake** (ruoli di accesso ai dati) si può concedere la lettura solo ad alcune cartelle o tabelle di un lakehouse: utile quando gli utenti accedono ai file direttamente con Spark o tramite shortcut.

## Come scegliere

| Esigenza | Soluzione |
|---|---|
| Ogni venditore vede solo la propria area | RLS |
| Gli analisti non devono vedere lo stipendio | CLS (warehouse) o OLS (modello) |
| Il supporto vede solo `aXXX@XXXX.com` | DDM |
| Un team legge solo la cartella `Files/marketing` | Ruoli di accesso ai dati di OneLake |
