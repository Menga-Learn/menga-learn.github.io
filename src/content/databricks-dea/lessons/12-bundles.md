I **Declarative Automation Bundles** (in precedenza *Databricks Asset Bundles*, DAB) descrivono come codice tutte le risorse di un progetto — job, pipeline, dashboard, permessi — in file YAML. Con un solo comando si distribuisce lo stesso progetto in ambienti diversi.

## Struttura

~~~yaml
# databricks.yml
bundle:
  name: vendite

variables:
  catalog:
    description: Catalog di destinazione
    default: dev

resources:
  jobs:
    carica_vendite:
      name: carica-vendite-${bundle.target}
      tasks:
        - task_key: bronze
          notebook_task:
            notebook_path: ./src/bronze.ipynb
            base_parameters:
              catalog: ${var.catalog}
  pipelines:
    vendite_silver:
      name: vendite-silver
      catalog: ${var.catalog}
      schema: silver
      libraries:
        - file:
            path: ./src/pipeline.sql

targets:
  dev:
    mode: development
    default: true
    workspace:
      host: https://adb-111.azuredatabricks.net
  prod:
    mode: production
    variables:
      catalog: prod
    workspace:
      host: https://adb-222.azuredatabricks.net
~~~

- **variables**: valori riutilizzabili, con un default e override per target (`${var.catalog}`).
- **targets**: ambienti (dev, test, prod). Ogni target può sovrascrivere variabili, host, permessi e impostazioni delle risorse.
- `mode: development`: prefissa i nomi delle risorse con l'utente, mette in pausa le pianificazioni, consente di distribuire in parallelo senza conflitti.
- `mode: production`: controlli più rigidi (es. le risorse sono distribuite con un'identità condivisa o un *service principal*).

Le variabili si possono passare anche da riga di comando o da variabili d'ambiente `BUNDLE_VAR_<nome>`.

## Databricks CLI

| Comando | Effetto |
|---|---|
| `databricks bundle init` | Crea un progetto da un modello |
| `databricks bundle validate -t prod` | Controlla la configurazione e risolve le variabili |
| `databricks bundle deploy -t prod` | Carica i file e crea o aggiorna le risorse nel workspace |
| `databricks bundle run -t prod carica_vendite` | Avvia un job o una pipeline del bundle |
| `databricks bundle destroy -t dev` | Elimina le risorse distribuite |

## In una pipeline CI/CD

1. Pull request → la CI esegue i test e `databricks bundle validate`.
2. Merge su `main` → la CD esegue `databricks bundle deploy -t prod`, autenticata come **service principal**.
3. Opzionalmente `databricks bundle run` per un test di integrazione.

Lo stesso codice viene promosso tra ambienti cambiando solo il **target**: niente copie manuali dei notebook.

> Nelle domande sul "promuovere lo stesso codice in dev, test e prod con valori diversi" la risposta è: **variabili** con override per **target** e `bundle deploy -t <target>`.
