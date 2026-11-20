Prima di creare una nuova connessione conviene chiedersi se il dato **esiste già** in Fabric. Il DP-600 include la capacità di **scoprire** dati esistenti e di renderli disponibili ad altri motori tramite OneLake.

## Catalogo OneLake

Il **catalogo OneLake** è il punto di partenza per trovare i dati nell'organizzazione:

- elenca lakehouse, warehouse, modelli semantici e altri item a cui l'utente ha accesso;
- permette di filtrare per workspace, dominio, tipo, **approvazione** (promosso, certificato) ed **etichetta**;
- mostra dettagli come proprietario, ultimo aggiornamento, tabelle contenute e derivazione;
- da qui si può aprire un item, creare uno shortcut o collegarsi da Power BI Desktop ed Excel.

## Real-Time hub

Il **Real-Time hub** è l'equivalente del catalogo per i **dati in movimento**. Mostra:

- gli **stream di dati** (eventstream) e le tabelle KQL disponibili nel tenant;
- le **sorgenti** collegabili, come Azure Event Hubs, IoT Hub, change data capture da database, servizi di altri cloud;
- gli **eventi di Fabric e di Azure** (ad esempio "file creato in OneLake" o eventi di Azure Blob Storage), utili per attivare automazioni con Activator.

Da qui si crea un eventstream che porta i dati in un eventhouse o in un lakehouse.

## Integrazione con OneLake di eventhouse e modelli semantici

Due funzionalità rendono i dati di motori specializzati leggibili da tutti gli altri:

### Disponibilità in OneLake per eventhouse
Attivando la **disponibilità in OneLake** su un database o su una tabella KQL, i dati vengono scritti anche come **tabelle Delta** in OneLake. Così un notebook Spark, un warehouse o un modello Direct Lake possono leggerli senza conoscere KQL e senza pipeline di copia.

### Integrazione OneLake per modelli semantici
Per un modello semantico in modalità **Import**, l'**integrazione con OneLake** esporta le tabelle importate come file Delta in OneLake dopo ogni aggiornamento. I dati, spesso arricchiti con logica Power Query, diventano accessibili da lakehouse (tramite shortcut), notebook e query SQL.

## Collegare i dati con il giusto strumento

| Esigenza | Funzionalità |
|---|---|
| Trovare un modello certificato sulle vendite | Catalogo OneLake |
| Vedere quali stream IoT sono già disponibili | Real-Time hub |
| Analizzare con Spark i dati di un database KQL | Disponibilità in OneLake dell'eventhouse |
| Riutilizzare in un notebook le tabelle di un modello Import | Integrazione OneLake del modello semantico |
