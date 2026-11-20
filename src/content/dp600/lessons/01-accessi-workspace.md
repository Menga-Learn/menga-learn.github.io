In Microsoft Fabric la sicurezza si costruisce a strati: prima si decide **chi entra nel workspace**, poi **cosa può fare su ogni singolo elemento** (item) e infine **quali dati può vedere** all'interno di tabelle e file. Questa lezione copre i primi due livelli.

## I ruoli del workspace

Un workspace è il contenitore di lakehouse, warehouse, notebook, pipeline, modelli semantici e report. A ogni utente o gruppo si assegna uno dei quattro ruoli:

| Ruolo | Cosa può fare |
|---|---|
| **Admin** | Tutto: gestisce impostazioni, aggiunge o rimuove qualsiasi ruolo (anche altri Admin), elimina il workspace. |
| **Member** | Crea e modifica contenuti, condivide item, aggiunge utenti con ruolo Member, Contributor o Viewer. |
| **Contributor** | Crea, modifica ed elimina contenuti, esegue notebook e pipeline. Non gestisce gli accessi al workspace. |
| **Viewer** | Visualizza i contenuti e legge i dati tramite gli endpoint SQL e i report, senza modificare nulla. |

> **Principio del privilegio minimo**: assegna il ruolo più basso che permette di svolgere il lavoro. Uno sviluppatore che deve creare notebook non ha bisogno di gestire gli accessi: basta Contributor.

Assegna i ruoli preferibilmente a **gruppi di Microsoft Entra ID** invece che a singoli utenti: la gestione diventa più semplice e verificabile.

## Permessi a livello di item

A volte un utente deve accedere a **un solo elemento** senza vedere il resto del workspace. In questo caso non si assegna un ruolo, ma si **condivide l'item**. Per lakehouse e warehouse i permessi principali sono:

- **Read**: permette di connettersi all'item e vederne i metadati.
- **ReadData**: permette di leggere i dati con T-SQL tramite l'endpoint SQL.
- **ReadAll**: permette di leggere i file sottostanti in OneLake (ad esempio da Spark o con API), non solo tramite SQL.
- **Build**: permette di creare contenuti (report, modelli) sul modello semantico predefinito o associato.

Per un **modello semantico** i permessi tipici sono *Read* (usare i report), *Build* (creare nuovi report o interrogare il modello da Excel e altri strumenti) e *Write* (modificare il modello).

## Quale strumento usare?

- Il gruppo deve lavorare su molti elementi dello stesso progetto → **ruolo di workspace**.
- Un utente esterno al team deve solo interrogare una tabella del warehouse → **condivisione dell'item** con *ReadData*.
- Un data scientist deve leggere i file Delta con Spark senza poter modificare nulla → condivisione con **ReadAll**.
- Un analista deve creare report su un modello semantico pubblicato da un altro team → permesso **Build** sul modello.

Ricorda infine che i ruoli del workspace si sommano ai permessi degli item: un utente con ruolo Viewer a cui viene condiviso un item con un permesso aggiuntivo ottiene l'unione dei permessi.
