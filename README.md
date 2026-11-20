# Menga Learn

Web app per prepararsi alle certificazioni con **percorsi di apprendimento**, **lezioni**, **esercizi** e una sezione dedicata alle **domande di certificazione** (allenamento, simulazione d'esame a tempo, ripasso errori).

Primo percorso disponibile: **Microsoft DP-600 – Associato Ingegnere di Analisi dei Dati in Fabric**.

> Contenuti originali a scopo di studio, allineati all'elenco ufficiale delle competenze. Le domande non provengono dagli esami reali. Progetto non affiliato a Microsoft.

## Funzionalità

- **Percorso per domini**: i domini dell'esame con il loro peso, divisi in moduli con lezioni ed esercizi.
- **Lezioni** in Markdown con punti chiave e una verifica rapida finale.
- **Esercizi** di tre tipi: laboratori guidati, esercizi di codice (T-SQL, PySpark, KQL, DAX, Power Query) e casi di studio, con suggerimenti progressivi e soluzione commentata.
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

La build è un sito statico con routing basato su hash: si può pubblicare così com'è su GitHub Pages, Azure Static Web Apps, Netlify o qualsiasi hosting statico.

## Struttura

```
src/
  types.ts                 modello dati (Certification, Module, Lesson, Exercise, Question)
  content/
    index.ts               registro delle certificazioni
    helpers.ts             q() per scrivere domande compatte, exercise() per gli esercizi
    dp600/
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
