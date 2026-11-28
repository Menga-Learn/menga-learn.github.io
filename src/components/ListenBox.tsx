import { useEffect, useState } from 'react';
import { Markdown } from './Markdown';

/**
 * Brano di ascolto: viene letto dalla sintesi vocale del browser (voce inglese, se disponibile).
 * La trascrizione resta nascosta finché non la chiedi o finché la domanda non è corretta.
 */
export function ListenBox({ script, revealed }: { script: string; revealed: boolean }) {
  const [show, setShow] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    setShow(false);
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [script, supported]);

  function play(rate: number) {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    // Le battute "A: ... / B: ..." vengono lette senza le etichette.
    const text = script.replace(/\*\*/g, '').replace(/^[A-Z][a-z]*:\s*/gm, '');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    const voice = synth.getVoices().find((v) => v.lang === 'en-GB') ?? synth.getVoices().find((v) => v.lang.startsWith('en'));
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  }

  const visible = show || revealed || !supported;
  return (
    <div className="listen">
      <div className="row wrap">
        <strong className="small upper">Ascolto</strong>
        {supported && (
          <>
            <button type="button" className="btn small-btn" onClick={() => play(0.95)}>
              {speaking ? 'Riascolta' : 'Ascolta'}
            </button>
            <button type="button" className="btn small-btn" onClick={() => play(0.75)}>
              Più lento
            </button>
            {!visible && (
              <button type="button" className="btn small-btn ghost" onClick={() => setShow(true)}>
                Mostra trascrizione
              </button>
            )}
          </>
        )}
      </div>
      {!supported && <p className="small muted">Il browser non supporta la sintesi vocale: leggi la trascrizione.</p>}
      {visible && <Markdown source={script.replace(/\n/g, '  \n')} className="listen-script" />}
    </div>
  );
}
