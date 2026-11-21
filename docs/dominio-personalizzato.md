# Usare un dominio personale per le app Menga

Questa guida vale per tutte le app pubblicate con GitHub Pages (Menga Learn, Menga Deck, Menga Dress…). L'idea è avere **un dominio** e **un sottodominio per ogni app**:

| App | Indirizzo di esempio | Repository |
|---|---|---|
| Menga Learn | `learn.menga.app` | `mizral86/Menga-Learn` |
| Menga Deck | `deck.menga.app` | repository di Menga Deck |
| Menga Dress | `dress.menga.app` | repository di Menga Dress |

Ogni sottodominio è un **sito separato** per il browser: memoria locale, permessi, cookie e installazione restano isolati tra le app.

> `menga.app` è solo un esempio: usa il dominio che acquisti.

---

## 0. Prima di tutto: salva i progressi

Quando imposti il dominio personale, il vecchio indirizzo `mizral86.github.io/Menga-Learn/` **reindirizza** automaticamente a quello nuovo. Il browser però considera il nuovo indirizzo un sito diverso, quindi i progressi salvati non vengono visti.

1. Apri l'app al vecchio indirizzo, vai in **Info → Esporta progressi** e salva il file `.json`.
2. Dopo il passaggio al nuovo dominio, apri **Info → Importa progressi…** e scegli il file.

Fallo **prima** del passo 4: dopo, il vecchio indirizzo reindirizza e non è più possibile aprirlo per esportare. Fai lo stesso per ogni dispositivo su cui usi l'app.

Se un'app è installata (PWA), dopo il passaggio disinstalla la vecchia versione e reinstalla quella al nuovo indirizzo.

## 1. Acquista il dominio

Qualsiasi registrar va bene, ad esempio Cloudflare Registrar, Namecheap, Aruba o Register.it. Un dominio `.it`, `.com` o `.app` costa di solito tra 10 e 20 € l'anno. Nota: i domini `.app` e `.dev` funzionano **solo in HTTPS**, che GitHub Pages fornisce gratuitamente.

## 2. Verifica il dominio su GitHub (consigliato)

La verifica impedisce ad altri di usare un tuo sottodominio su GitHub Pages.

1. Su GitHub apri **Settings (del tuo profilo) → Pages → Add a domain** e inserisci `menga.app`.
2. GitHub ti mostra un record **TXT** (nome simile a `_github-pages-challenge-mizral86`). Aggiungilo nel pannello DNS del registrar.
3. Torna su GitHub e premi **Verify**.

Per un'app che sta in un'**organizzazione** (come Menga Dress), ripeti la verifica nelle impostazioni dell'organizzazione: **Organization settings → Pages**.

## 3. Crea il record DNS del sottodominio

Nel pannello DNS del registrar aggiungi un record **CNAME** per ogni app:

| Tipo | Nome | Valore |
|---|---|---|
| CNAME | `learn` | `mizral86.github.io` |
| CNAME | `deck` | `mizral86.github.io` (o l'account/organizzazione che ospita il repository) |
| CNAME | `dress` | `<nome-organizzazione>.github.io` |

Il valore è sempre **`<account-o-organizzazione>.github.io`**, senza il nome del repository e senza `https://`.

Se usi Cloudflare, imposta il record come **"Solo DNS"** (nuvola grigia), almeno finché GitHub non ha emesso il certificato HTTPS.

La propagazione richiede da pochi minuti a qualche ora.

## 4. Imposta il dominio nel repository

1. Apri il repository dell'app → **Settings → Pages**.
2. In **Custom domain** scrivi `learn.menga.app` e premi **Save**.
3. Attendi che il controllo DNS diventi verde ("DNS check successful").

Con la pubblicazione tramite **GitHub Actions** (come Menga Learn) non serve aggiungere un file `CNAME` al repository: l'impostazione resta salvata in GitHub. Se un'app pubblica invece da un branch (`gh-pages` o `main`), GitHub crea un file `CNAME` in quel branch: non cancellarlo.

## 5. Attiva HTTPS

Nella stessa pagina spunta **Enforce HTTPS**. Se l'opzione è grigia, il certificato è ancora in preparazione: di solito servono da pochi minuti a qualche ora dopo il controllo DNS.

## 6. Controlla l'app

- Apri `https://learn.menga.app/` e verifica che l'app si carichi.
- Importa i progressi (passo 0).
- Installa di nuovo l'app dal menu del browser, se la usi come app installata.

---

## Note per gli sviluppatori

Un'app funziona sia in una sottocartella (`/Menga-Learn/`) sia alla radice di un sottodominio se:

- usa **percorsi relativi** per script, stili e immagini (in Vite: `base: './'`);
- usa un routing che non dipende dal percorso del server (ad esempio `HashRouter`), oppure un fallback `404.html`;
- nel `manifest.webmanifest` usa `"id": "./"`, `"start_url": "./"` e `"scope": "./"`;
- registra il service worker con un percorso relativo (`./sw.js`, scope `./`).

Menga Learn rispetta già tutti questi punti: per spostarla basta seguire i passi 0–6.

## Tornare indietro

Per annullare, cancella il dominio in **Settings → Pages → Custom domain**: l'app torna disponibile su `mizral86.github.io/Menga-Learn/`. Ricordati di esportare i progressi anche in questa direzione.
