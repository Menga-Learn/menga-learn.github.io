## Scenario

Nel database KQL `DB_Impianti` la tabella `Letture` riceve i dati dei sensori:

`Timestamp (datetime), IdSensore (string), Linea (string), Temperatura (real), Vibrazione (real)`

E la tabella `Sensori` contiene: `IdSensore (string), Reparto (string), Modello (string)`.

## Consegna

Scrivi le query KQL per:

1. le letture delle ultime 2 ore con temperatura superiore a 90, mostrando solo `Timestamp`, `IdSensore` e `Temperatura`, dalla più recente;
2. la temperatura media e massima per linea, a intervalli di 10 minuti, nelle ultime 24 ore, visualizzata come grafico temporale;
3. l'**ultima lettura** di ogni sensore;
4. il numero di letture con vibrazione superiore a 5 per reparto nell'ultima settimana.

<!-- SOLUZIONE -->

~~~kusto
// 1
Letture
| where Timestamp > ago(2h) and Temperatura > 90
| project Timestamp, IdSensore, Temperatura
| sort by Timestamp desc

// 2
Letture
| where Timestamp > ago(24h)
| summarize TempMedia = avg(Temperatura), TempMax = max(Temperatura)
    by Linea, bin(Timestamp, 10m)
| render timechart

// 3
Letture
| summarize arg_max(Timestamp, *) by IdSensore

// 4
Letture
| where Timestamp > ago(7d) and Vibrazione > 5
| join kind=inner (Sensori | project IdSensore, Reparto) on IdSensore
| summarize Allarmi = count() by Reparto
| sort by Allarmi desc
~~~

**Note**

- Filtra sempre per tempo **per primo**: le tabelle KQL sono ottimizzate per filtri sulla colonna temporale.
- `arg_max(Timestamp, *)` restituisce l'intera riga con il timestamp massimo per ogni sensore.
- Nel punto 4 si poteva anche usare `countif(Vibrazione > 5)` senza il filtro nel `where`.
