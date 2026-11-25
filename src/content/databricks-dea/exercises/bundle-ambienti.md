## Scenario

Il progetto `clienti` contiene un notebook `src/carica_clienti.ipynb` che riceve il parametro `catalog`. Deve essere eseguito ogni giorno alle 5:00 (fuso `Europe/Rome`).

Requisiti:

- in **dev** il catalog è `dev` e ogni sviluppatore deve poter distribuire una propria copia senza conflitti, con la pianificazione in pausa;
- in **prod** il catalog è `prod`, il workspace è diverso e la pianificazione è attiva;
- la CI deve controllare la configurazione su ogni pull request e distribuire in prod dopo il merge.

## Consegna

1. Scrivi il file `databricks.yml`.
2. Indica i comandi della CLI usati dalla CI/CD.

<!-- SOLUZIONE -->

~~~yaml
bundle:
  name: clienti

variables:
  catalog:
    default: dev

resources:
  jobs:
    carica_clienti:
      name: carica-clienti
      schedule:
        quartz_cron_expression: "0 0 5 * * ?"
        timezone_id: Europe/Rome
      tasks:
        - task_key: carica
          notebook_task:
            notebook_path: ./src/carica_clienti.ipynb
            base_parameters:
              catalog: ${var.catalog}

targets:
  dev:
    mode: development
    default: true
    workspace:
      host: https://adb-1111.azuredatabricks.net
  prod:
    mode: production
    variables:
      catalog: prod
    workspace:
      host: https://adb-2222.azuredatabricks.net
~~~

**Comandi**

~~~bash
# su ogni pull request
databricks bundle validate -t prod

# dopo il merge su main (autenticazione come service principal)
databricks bundle deploy -t prod
~~~

**Perché funziona**

- `mode: development` prefissa le risorse con il nome dell'utente (es. `[dev anna] carica-clienti`) e mette in **pausa** le pianificazioni: più sviluppatori possono distribuire senza pestarsi i piedi.
- La variabile `catalog` ha un default (`dev`) e un **override** nel target `prod`: lo stesso codice viene promosso cambiando solo `-t`.
- In produzione si distribuisce con un **service principal**, non con l'utenza personale.
