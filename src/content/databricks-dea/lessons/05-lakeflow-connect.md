**Lakeflow Connect** è la famiglia di connettori di Databricks per acquisire dati da applicazioni, database e servizi direttamente in tabelle di Unity Catalog.

## Connettori standard e gestiti

| Tipo | Esempi | Caratteristiche |
|---|---|---|
| **Standard** | Storage cloud (Auto Loader), Kafka, Kinesis, Pub/Sub, SFTP | Si usano dal codice o dalle pipeline dichiarative; più controllo, più codice. |
| **Gestiti** (*managed*) | Salesforce, Workday, ServiceNow, Google Analytics, SharePoint, SQL Server, database relazionali | Configurazione guidata dall'interfaccia o via API, ingestione incrementale e gestione dello schema già pronte, pipeline serverless. |

I connettori gestiti creano una **pipeline di ingestione** che scrive in **streaming table** di Unity Catalog. Per i database (es. SQL Server) si usa anche un **gateway di ingestione** che legge le modifiche (CDC o change tracking) dalla sorgente.

## Dati semi-strutturati e non strutturati

- **JSON annidato**: si acquisisce in bronze così com'è (anche come tipo `VARIANT` o `STRING`) e si appiattisce in silver con `from_json`, notazione `colonna:campo` ed `explode`.
- **File binari** (PDF, immagini): formato `binaryFile` con Auto Loader, oppure si conservano in un **volume** e si salvano in una tabella i metadati e il percorso.
- I connettori gestiti di applicazioni restituiscono già tabelle tipizzate.

## JDBC, ODBC e API REST dai notebook

Quando non esiste un connettore, si scrive codice in un notebook e lo si orchestra con **Lakeflow Jobs**:

~~~python
jdbc_url = "jdbc:postgresql://pg.contoso.local:5432/crm"
clienti = (spark.read.format("jdbc")
    .option("url", jdbc_url)
    .option("dbtable", "public.clienti")
    .option("user", dbutils.secrets.get("crm", "user"))
    .option("password", dbutils.secrets.get("crm", "password"))
    .load())
clienti.write.mode("overwrite").saveAsTable("dev.bronze.clienti")
~~~

Per un'API REST si usa ad esempio `requests` per scaricare il JSON, lo si salva in un **volume** e poi lo si carica con Auto Loader. Le credenziali vanno sempre in un **secret scope**, mai nel codice. Se la sorgente è un database supportato e serve solo interrogarlo senza copiarlo, c'è anche **Lakehouse Federation**.

## Come scegliere

| Situazione | Scelta |
|---|---|
| File che arrivano in uno storage cloud | **Auto Loader** (o `COPY INTO` per pochi file) |
| SaaS o database per cui esiste un connettore gestito | **Lakeflow Connect gestito**: minimo codice, incrementale, governato |
| Sorgente di streaming (Kafka, Kinesis) | Connettore standard in Structured Streaming o pipeline dichiarativa |
| Sorgente senza connettore | Notebook con JDBC/REST orchestrato da un job |
| Sistemi supportati da partner (Fivetran, ecc.) | **Partner Connect**, se l'azienda li usa già |

> Nelle domande "con il minimo sforzo di sviluppo" e "da Salesforce/Workday/SQL Server" indicano quasi sempre un **connettore gestito** di Lakeflow Connect.
