Le **pipeline di distribuzione** (deployment pipelines) di Fabric spostano i contenuti tra ambienti, ad esempio **Sviluppo → Test → Produzione**, senza dover ricreare nulla a mano.

## Come funzionano

- Una pipeline ha da **2 a 10 fasi** (stage); ogni fase è associata a **un workspace**.
- La distribuzione copia i **metadati** degli item (definizioni, report, modelli) dalla fase di origine alla successiva. I **dati** non vengono copiati: ogni ambiente carica i propri.
- La funzione **Confronta** mostra quali item sono nuovi, diversi o identici tra due fasi.
- Si può distribuire **tutto** oppure **solo gli item selezionati**; Fabric suggerisce di includere anche gli item dipendenti.

## Regole di distribuzione

Il modello semantico in Test non deve puntare al database di sviluppo. Le **regole di distribuzione** risolvono il problema, sostituendo valori durante il passaggio di fase:

- **Regole dell'origine dati**: cambiano server e database di una connessione.
- **Regole dei parametri**: cambiano il valore di un parametro di Power Query (per esempio `Ambiente = "PROD"`).
- Per altri item (come i notebook) si possono impostare il **lakehouse predefinito** di ciascuna fase.

Le regole si configurano sulla fase **di destinazione** e vengono applicate a ogni distribuzione successiva.

## Pipeline di distribuzione o Git?

I due strumenti sono complementari:

| | Integrazione Git | Pipeline di distribuzione |
|---|---|---|
| Scopo | Versionare e collaborare sul codice | Promuovere i contenuti tra ambienti |
| Unità | Branch e commit | Fasi e workspace |
| Revisione | Pull request | Confronto tra fasi |

Uno schema molto diffuso: gli sviluppatori lavorano con **Git** sul workspace di sviluppo; il rilascio verso Test e Produzione avviene con la **pipeline di distribuzione**. In alternativa, si può collegare ogni ambiente a un branch diverso e automatizzare tutto con le **API REST di Fabric** o con Azure DevOps / GitHub Actions.

## Buone pratiche

- Usa **parametri** per tutto ciò che cambia tra ambienti (server, percorsi, soglie).
- Limita chi può distribuire in Produzione: serve essere Admin della pipeline e avere i permessi adeguati sui workspace.
- Dopo la distribuzione, ricorda di **aggiornare i dati** del modello semantico nella fase di destinazione.
