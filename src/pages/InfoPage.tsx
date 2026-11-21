import { createBackup, parseBackup, progress, useProgress } from '../lib/progress';
import { certifications } from '../content';
import { useRef, useState, type ChangeEvent } from 'react';

export function InfoPage() {
  const state = useProgress();
  const [confirm, setConfirm] = useState<string | null>(null);
  const [mode, setMode] = useState<'unisci' | 'sostituisci'>('unisci');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportProgress() {
    const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menga-learn-progressi-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ ok: true, text: 'Backup scaricato.' });
  }

  async function importProgress(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      progress.importState(parseBackup(await file.text()), mode);
      setMessage({ ok: true, text: mode === 'unisci' ? 'Progressi importati e uniti a quelli presenti.' : 'Progressi importati: quelli precedenti sono stati sostituiti.' });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Importazione non riuscita.' });
    }
  }
  return (
    <article className="prose">
      <h1>Come funziona</h1>
      <p>
        Menga Learn organizza ogni certificazione in <strong>domini</strong> (le aree dell'esame, con il loro peso),
        <strong> moduli</strong>, <strong>lezioni</strong> ed <strong>esercizi</strong>. La sezione{' '}
        <strong>Domande di certificazione</strong> offre tre modalità:
      </p>
      <ul>
        <li>
          <strong>Allenamento</strong>: scegli dominio e numero di domande, ricevi subito correzione e spiegazione.
        </li>
        <li>
          <strong>Simulazione d'esame</strong>: domande distribuite secondo il peso dei domini, timer e risultato finale
          con il dettaglio per dominio.
        </li>
        <li>
          <strong>Ripasso errori</strong>: ripropone le domande a cui hai risposto in modo errato l'ultima volta.
        </li>
      </ul>
      <h2>Contenuti</h2>
      <p>
        I contenuti sono originali e seguono l'elenco ufficiale delle competenze misurate. Le domande non sono domande
        reali d'esame: servono a verificare la comprensione dei concetti. Il punteggio della simulazione è una
        proporzione semplice e va considerato indicativo.
      </p>
      <h2>I tuoi dati</h2>
      <p>
        L'avanzamento è salvato solo in questo browser e a questo indirizzo. Per portarlo su un altro dispositivo, su un
        altro browser o su un nuovo indirizzo dell'app, esporta un backup e importalo dall'altra parte.
      </p>
      <div className="card stack backup">
        <div className="row wrap">
          <button className="btn primary" onClick={exportProgress}>
            Esporta progressi
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Importa progressi…
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importProgress} />
        </div>
        <fieldset className="row wrap small plain-fieldset">
          <legend className="muted">All'importazione:</legend>
          <label className="row">
            <input type="radio" name="mode" checked={mode === 'unisci'} onChange={() => setMode('unisci')} /> unisci ai progressi presenti
          </label>
          <label className="row">
            <input type="radio" name="mode" checked={mode === 'sostituisci'} onChange={() => setMode('sostituisci')} /> sostituisci i progressi presenti
          </label>
        </fieldset>
        {message && (
          <p className={`small ${message.ok ? 'ok-text' : 'ko-text'}`} role="status">
            {message.text}
          </p>
        )}
      </div>
      <p>Puoi anche azzerare l'avanzamento di un singolo percorso.</p>
      <ul className="plain">
        {certifications.map((c) => (
          <li key={c.id} className="row">
            <span>
              {c.code}: {state.certs[c.id] ? 'avanzamento presente' : 'nessun avanzamento'}
            </span>
            {state.certs[c.id] &&
              (confirm === c.id ? (
                <span className="row">
                  <button
                    className="btn danger small"
                    onClick={() => {
                      progress.resetCert(c.id);
                      setConfirm(null);
                    }}
                  >
                    Conferma azzeramento
                  </button>
                  <button className="btn ghost small" onClick={() => setConfirm(null)}>
                    Annulla
                  </button>
                </span>
              ) : (
                <button className="btn ghost small" onClick={() => setConfirm(c.id)}>
                  Azzera
                </button>
              ))}
          </li>
        ))}
      </ul>
    </article>
  );
}
