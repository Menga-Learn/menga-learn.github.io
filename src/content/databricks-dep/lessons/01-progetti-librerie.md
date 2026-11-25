A livello Professional il codice non vive più solo nei notebook: si organizza in **progetti Python** modulari, testabili e distribuiti con i **Declarative Automation Bundles**.

## Struttura di un progetto

~~~text
vendite/
├── databricks.yml            # bundle: risorse e target
├── resources/
│   ├── vendite_job.yml        # definizione del job
│   └── vendite_pipeline.yml   # definizione della pipeline
├── src/
│   └── vendite/
│       ├── __init__.py
│       ├── pulizia.py         # funzioni pure di trasformazione
│       └── main.py            # punto di ingresso del job
├── tests/
│   └── test_pulizia.py        # unit test con pytest
└── pyproject.toml             # metadati e dipendenze, build della wheel
~~~

- La logica sta in **funzioni** che ricevono e restituiscono DataFrame: si possono testare senza eseguire il job.
- Il bundle può costruire una **wheel** (`artifacts`) e usarla nei task (`python_wheel_task`) o come dipendenza.
- `databricks.yml` può includere altri file YAML con `include: [resources/*.yml]`.

## Dipendenze esterne

Le librerie possono arrivare da **PyPI**, da **wheel locali** (file `.whl` nel progetto o in un volume) o da archivi sorgente. Dove si dichiarano dipende dal compute:

| Compute | Dove si dichiarano |
|---|---|
| **Serverless** (notebook e job) | **Ambiente** del notebook o del task (`environments` nel job: versione dell'ambiente e lista `dependencies`) |
| **Job cluster classico** | `libraries` del task (`pypi`, `whl`, `requirements`) |
| **Pipeline dichiarativa** | Impostazioni della pipeline (`environment.dependencies`) |
| **Notebook interattivo** | `%pip install` a inizio notebook (riavvia Python) |

~~~yaml
resources:
  jobs:
    vendite:
      environments:
        - environment_key: default
          spec:
            environment_version: "4"
            dependencies:
              - requests==2.32.3
              - ../dist/*.whl
      tasks:
        - task_key: main
          environment_key: default
          python_wheel_task:
            package_name: vendite
            entry_point: main
~~~

## Diagnosticare i problemi di installazione

| Sintomo | Causa tipica | Rimedio |
|---|---|---|
| `ResolutionImpossible`, conflitti di pip | Versioni incompatibili tra due librerie o con quelle del runtime | Fissare versioni compatibili, rimuovere vincoli troppo stretti |
| `ModuleNotFoundError` solo nel job | Libreria installata nel notebook con `%pip` ma non dichiarata nell'ambiente del task | Dichiararla nell'ambiente/`libraries` del job |
| Errore su serverless con una libreria che richiede binari di sistema | Il serverless non permette script di init né pacchetti di sistema | Usare compute classico o un'alternativa pure-Python |
| Wheel non trovata dopo il deploy | Percorso relativo errato o artifact non costruito | Controllare la sezione `artifacts` e il percorso nel bundle |
| Installazione che fallisce per rete | Repository PyPI non raggiungibile | Mirror privato o wheel caricate in un volume |

> Tranello frequente: una libreria installata a mano in un notebook interattivo **non** è disponibile nel job. Le dipendenze vanno dichiarate nella definizione del task o dell'ambiente.
