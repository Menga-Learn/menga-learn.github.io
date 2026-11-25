# Menga Learn

Web app per prepararsi alle certificazioni con **percorsi di apprendimento**, **lezioni**, **esercizi** e una sezione dedicata alle **domande di certificazione** (allenamento, simulazione d'esame a tempo, ripasso errori).

Percorsi disponibili:

- **Microsoft DP-600 – Associato Ingegnere di Analisi dei Dati in Fabric**
- **Databricks Certified Data Engineer Associate** (guida d'esame del 4 maggio 2026)
- **Databricks Certified Data Engineer Professional** (guida d'esame del 9 ottobre 2026)

> Contenuti originali a scopo di studio, allineati all'elenco ufficiale delle competenze. Le domande non provengono dagli esami reali. Progetto non affiliato a Microsoft né a Databricks.

## Funzionalità

- **Percorso per domini**: i domini dell'esame con il loro peso, divisi in moduli con lezioni ed esercizi.
- **Lezioni** in Markdown con punti chiave e una verifica rapida finale.
- **Esercizi** di tre tipi: laboratori guidati, esercizi di codice (T-SQL, Spark SQL, PySpark, Python, KQL, DAX, Power Query, YAML) e casi di studio, con suggerimenti progressivi e soluzione commentata.
- **Domande di certificazione**:
  - *Allenamento*: per dominio, con correzione e spiegazione immediata;
  - *Simulazione d'esame*: domande distribuite secondo il peso dei domini, timer, navigazione libera, domande da rivedere e risultato per dominio;
  - *Ripasso errori*: ripropone le domande sbagliate.
- **Avanzamento** salvato nel browser (`localStorage`), senza account né server.
- Tema chiaro/scuro automatico, layout utilizzabile da smartphone.

## Avvio

Requisiti: Node.js 20 o superiore.

```bash
npm install
npm run dev       # sviluppo su http://localhost:5173
npm test          # test di logica e coerenza dei contenuti
npm run build     # build statica in dist/
```

**Versione online**: https://mizral86.github.io/Menga-Learn/ (pubblicata automaticamente a ogni push su `main` dal workflow `.github/workflows/pages.yml`; in *Settings → Pages* la sorgente deve essere *GitHub Actions*).

Per spostare l'app in una nuova organizzazione GitHub (es. `https://<org>.github.io/`) segui [docs/nuova-organizzazione.md](docs/nuova-organizzazione.md); per un dominio personale (es. `learn.menga.app`) segui la guida [docs/dominio-personalizzato.md](docs/dominio-personalizzato.md): l'app funziona sia in una sottocartella sia alla radice di un dominio senza modifiche al codice. I progressi si trasferiscono con **Info → Esporta / Importa progressi**.

La build è un sito statico con routing basato su hash: si può pubblicare così com'è su GitHub Pages, Azure Static Web Apps, Netlify o qualsiasi hosting statico.

## Struttura

```
src/
  types.ts                 modello dati (Certification, Module, Lesson, Exercise, Question)
  content/
    index.ts               registro delle certificazioni
    helpers.ts             q() per scrivere domande compatte, exercise() per gli esercizi
    dp600/                 (anche databricks-dea/ e databricks-dep/ con la stessa struttura)
      index.ts             esame, domini, competenze, risorse
      modules.ts           moduli, lezioni, verifiche rapide, esercizi
      questions.ts         banca domande
      lessons/*.md         testo delle lezioni
      exercises/*.md       consegna + soluzione (separate da <!-- SOLUZIONE -->)
  lib/                     logica del quiz, avanzamento, catalogo
  pages/ components/       interfaccia React
```

## Aggiungere una nuova certificazione

1. Crea la cartella `src/content/<codice>/` seguendo l'esempio di `dp600` (domini con peso, moduli, lezioni in Markdown, esercizi, domande).
2. Esporta un oggetto `Certification` e aggiungilo all'array in `src/content/index.ts`.
3. Esegui `npm test`: i test di coerenza controllano id univoci, domini esistenti, risposte corrette valide e numero minimo di domande per la simulazione.

Non serve modificare l'interfaccia: pagine, quiz e simulazione si adattano automaticamente.
