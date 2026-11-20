import { progress, useProgress } from '../lib/progress';
import { certifications } from '../content';
import { useState } from 'react';

export function InfoPage() {
  const state = useProgress();
  const [confirm, setConfirm] = useState<string | null>(null);
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
      <p>L'avanzamento è salvato solo in questo browser. Puoi azzerarlo per ogni percorso.</p>
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
