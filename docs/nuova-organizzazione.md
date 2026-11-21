# Spostare Menga Learn in una nuova organizzazione GitHub

Obiettivo: pubblicare l'app alla radice di **`https://<organizzazione>.github.io/`**, su un sito separato da Menga Deck e dalle altre app. Così memoria locale, permessi e installazione restano isolati.

Nella guida `<org>` indica il nome dell'organizzazione che crei (ad esempio `menga-learn`).

L'app è già pronta: usa percorsi relativi, e manifest e service worker funzionano sia in una sottocartella sia alla radice. Non serve modificare il codice.

---

## 0. Esporta i progressi (prima di tutto)

Dopo il trasferimento, il vecchio indirizzo `mizral86.github.io/Menga-Learn/` **smette di funzionare** e non reindirizza al nuovo.

1. Apri l'app al vecchio indirizzo → **Info → Esporta progressi** e salva il file `.json`.
2. Ripeti su ogni dispositivo dove usi l'app.

## 1. Crea l'organizzazione

1. Su GitHub: avatar in alto a destra → **Your organizations → New organization**.
2. Scegli il piano **Free** e dai il nome `<org>`.

## 2. Trasferisci il repository

1. Apri `mizral86/Menga-Learn` → **Settings → General**, in fondo alla pagina **Transfer ownership → Transfer**.
2. Come nuovo proprietario scegli `<org>` e conferma.

GitHub reindirizza automaticamente i vecchi link del repository (clone, pull request, issue).

## 3. Rinomina il repository

Per avere l'app alla radice di `https://<org>.github.io/`, il repository deve chiamarsi esattamente **`<org>.github.io`**.

**Settings → General → Repository name** → scrivi `<org>.github.io` → **Rename**.

Se preferisci tenere il nome `Menga-Learn`, salta questo passo: l'app sarà su `https://<org>.github.io/Menga-Learn/`, funziona lo stesso.

## 4. Attiva GitHub Pages

1. **Settings → Pages → Build and deployment → Source**: scegli **GitHub Actions**.
2. **Actions** → workflow **"Pubblica su GitHub Pages"** → **Run workflow** (oppure fai una qualsiasi modifica su `main`).
3. Dopo circa un minuto l'app è online su `https://<org>.github.io/`.

Se GitHub chiede di abilitare le Actions nella nuova organizzazione, accetta.

## 5. Importa i progressi e reinstalla

1. Apri il nuovo indirizzo → **Info → Importa progressi…** e scegli il file del passo 0.
2. Se usavi l'app installata, disinstalla la vecchia e installa quella nuova dal menu del browser.

## 6. Accesso di Claude al repository

Per continuare a lavorare sull'app con Claude, l'app GitHub di Claude deve avere accesso alla nuova organizzazione:
<https://github.com/apps/claude/installations/select_target> → scegli `<org>` → seleziona il repository.

---

## In seguito: dominio personale

Se in futuro compri un dominio, la guida [dominio-personalizzato.md](dominio-personalizzato.md) funziona anche dalla nuova organizzazione: il record CNAME punterà a `<org>.github.io`.
