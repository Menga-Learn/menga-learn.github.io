Il **Kusto Query Language (KQL)** è il linguaggio degli eventhouse e dei database KQL. È pensato per esplorare rapidamente grandi volumi di dati temporali come log e telemetria.

## La logica a pipe

Una query KQL parte da una tabella e passa il risultato da un operatore all'altro con il simbolo `|`:

```kusto
Telemetria
| where Timestamp > ago(1h)
| where Temperatura > 80
| project Timestamp, IdSensore, Temperatura
| take 100
```

## Operatori essenziali

| Operatore | A cosa serve | Equivalente SQL |
|---|---|---|
| `where` | Filtra le righe | `WHERE` |
| `project` | Sceglie/rinomina colonne | `SELECT` |
| `extend` | Aggiunge colonne calcolate | colonna calcolata in `SELECT` |
| `summarize` | Aggrega | `GROUP BY` |
| `sort by` / `order by` | Ordina (default **decrescente**) | `ORDER BY` |
| `top N by` | Primi N per una colonna | `TOP ... ORDER BY` |
| `take` / `limit` | N righe qualsiasi | `TOP` senza ordine |
| `join` | Unisce tabelle | `JOIN` |
| `distinct` | Valori distinti | `SELECT DISTINCT` |
| `count` | Conta le righe | `COUNT(*)` |

> Attenzione: in KQL `sort by` ordina in modo **decrescente** se non specifichi `asc`.

## Aggregare nel tempo

```kusto
Telemetria
| where Timestamp between (datetime(2025-06-01) .. datetime(2025-06-02))
| summarize TempMedia = avg(Temperatura), Letture = count()
    by IdSensore, bin(Timestamp, 15m)
| render timechart
```

`bin()` raggruppa i valori temporali in intervalli (qui 15 minuti). `render` produce direttamente un grafico nel queryset.

Funzioni di aggregazione utili: `count()`, `dcount()` (conteggio distinto approssimato), `avg()`, `sum()`, `min()`, `max()`, `percentile()`, `arg_max()` (riga con il valore massimo: utile per "l'ultima lettura di ogni sensore").

```kusto
Telemetria
| summarize arg_max(Timestamp, *) by IdSensore   // ultima lettura per sensore
```

## Join

```kusto
Telemetria
| join kind=inner (Sensori | project IdSensore, Reparto) on IdSensore
| summarize Allarmi = countif(Temperatura > 80) by Reparto
```

Il tipo di join predefinito in KQL è `innerunique`, che deduplica la tabella di sinistra: specifica sempre `kind=` quando il comportamento conta.

## Funzioni su stringhe e date

`contains`, `has` (più veloce: cerca termini interi), `startswith`, `parse`, `extract()`; `ago()`, `now()`, `startofday()`, `datetime_diff()`.

## Dove si scrivono le query

- **Queryset KQL**: editor di query collegato a un database KQL, con risultati in tabella o grafico.
- **Dashboard in tempo reale**: riquadri basati su query KQL che si aggiornano automaticamente.
- Le query possono essere salvate come **funzioni** riutilizzabili nel database.
