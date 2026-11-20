La governance non riguarda solo chi accede ai dati, ma anche **quanto sono affidabili** e **quanto sono sensibili**. Fabric integra due strumenti complementari: le **etichette di riservatezza** e l'**approvazione (endorsement)** degli item.

## Etichette di riservatezza

Le etichette provengono da **Microsoft Purview Information Protection** e classificano un item in base alla sensibilità, ad esempio *Pubblico*, *Generale*, *Riservato*, *Altamente riservato*.

Caratteristiche principali:

- Si applicano a lakehouse, warehouse, modelli semantici, report e altri item.
- **Ereditarietà a valle**: se un modello semantico è *Riservato*, i report creati sopra di esso possono ereditare automaticamente l'etichetta.
- **Protezione all'esportazione**: quando i dati vengono esportati in Excel, PowerPoint o PDF, l'etichetta (e l'eventuale crittografia) segue il file.
- Gli amministratori possono rendere l'etichetta **obbligatoria** e definire un'etichetta predefinita.

> Le etichette non limitano l'accesso dentro Fabric: quello lo fanno ruoli e permessi. Servono a **classificare** e a proteggere i dati quando escono dal servizio.

## Approvazione degli item (endorsement)

Quando in un'organizzazione esistono decine di modelli semantici simili, gli utenti hanno bisogno di sapere quale usare. L'approvazione segnala gli item affidabili:

| Livello | Chi lo assegna | Significato |
|---|---|---|
| **Promosso** | Chiunque abbia permessi di scrittura sull'item | "Questo contenuto è pronto per essere condiviso." |
| **Certificato** | Solo revisori autorizzati dall'amministratore del tenant | "Il contenuto rispetta gli standard di qualità dell'organizzazione." |
| **Dati master** | Revisori autorizzati | "Questa è la fonte di riferimento per questi dati" (ad esempio l'anagrafica clienti). |

Gli item approvati compaiono in evidenza nel **catalogo OneLake** e nelle finestre di selezione dei dati, così gli analisti trovano subito la fonte corretta.

## Altri strumenti di governance

- **Catalogo OneLake**: punto unico per scoprire item, vederne proprietario, etichetta e approvazione.
- **Vista di derivazione (lineage)**: mostra da dove arrivano i dati e chi li usa.
- **Microsoft Purview hub**: offre report su etichette e item approvati nel tenant.
- **Domini**: raggruppano i workspace per area di business (Vendite, Finanza...) e permettono di delegare alcune impostazioni.
