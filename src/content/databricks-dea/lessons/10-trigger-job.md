Un job può partire in modi diversi. Scegliere il trigger giusto significa rispondere alla domanda: **i dati arrivano a orari noti o in momenti imprevedibili?**

## Tipi di trigger

| Trigger | Funzionamento | Quando usarlo |
|---|---|---|
| **Scheduled** | Espressione cron o pianificazione semplice (ogni giorno alle 6:00, con fuso orario) | La sorgente è pronta a orari prevedibili. |
| **File arrival** | Il job parte quando arrivano **nuovi file** in un percorso di una external location o di un volume | I file arrivano in momenti imprevedibili. |
| **Table update** | Il job parte quando una o più **tabelle** di Unity Catalog vengono aggiornate | Il job a valle dipende da tabelle prodotte da altri team o processi. |
| **Continuous** | Il job viene riavviato appena termina, in modo continuo | Streaming sempre attivo. |
| **Manuale / API** | Avvio dall'interfaccia, dalla CLI o dalle API REST | Test o orchestrazione esterna. |

Per i trigger *file arrival* e *table update* si possono impostare un tempo minimo tra due esecuzioni e un'attesa dopo l'ultimo cambiamento, per raggruppare più arrivi in un'unica esecuzione.

## Time-based o data-driven?

- **Basato sul tempo**: semplice da capire, ma se i dati arrivano in ritardo il job elabora dati incompleti; se arrivano in anticipo si spreca tempo.
- **Basato sui dati** (file arrival, table update): il job parte quando i dati sono davvero disponibili, riduce la latenza ed evita esecuzioni a vuoto.

Esempi:

1. Il fornitore deposita un file "di solito tra le 2 e le 5 di notte" → **file arrival**.
2. Il report del lunedì alle 8 deve sempre partire alle 8 → **scheduled**.
3. Il job gold deve partire appena il team finanza aggiorna `fin.silver.fatture` → **table update**.
4. Due job dello stesso team in sequenza → meglio un solo job con dipendenze tra task, o un task **Run job**, invece di due pianificazioni sfasate.

## Notifiche e controllo delle esecuzioni

- Notifiche per inizio, successo, errore, superamento della durata: email, Slack, Teams, webhook.
- **Max concurrent runs**: quante esecuzioni dello stesso job possono sovrapporsi (predefinito 1; le esecuzioni in eccesso vengono saltate o messe in coda).
- **Pausa** della pianificazione senza eliminare il job.

> Un errore comune è "pianificare un job ogni 5 minuti per controllare se è arrivato un file": il trigger **file arrival** fa la stessa cosa senza esecuzioni inutili.
