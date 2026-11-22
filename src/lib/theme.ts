import type { CSSProperties } from 'react';

/**
 * Tema dell'interfaccia: "auto" segue il sistema operativo,
 * "light"/"dark" forzano la scelta. La preferenza è salvata nel browser.
 * Lo script inline in index.html applica il tema prima del primo render
 * per evitare il lampo di colore sbagliato.
 */
export type ThemeChoice = 'auto' | 'light' | 'dark';

export const THEME_KEY = 'menga-learn-theme';
export const THEME_ORDER: ThemeChoice[] = ['auto', 'light', 'dark'];

/** Colore della barra del browser/PWA per ciascun tema (= --bg). */
const BAR_COLOR = { light: '#f5f2eb', dark: '#1b1a18' } as const;

export function readTheme(): ThemeChoice {
  try {
    const v = globalThis.localStorage?.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export function nextTheme(t: ThemeChoice): ThemeChoice {
  return THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length];
}

export function applyTheme(t: ThemeChoice): void {
  const root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t);
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    const scheme = m.media.includes('dark') ? 'dark' : 'light';
    m.content = BAR_COLOR[t === 'auto' ? scheme : t];
  });
  try {
    if (t === 'auto') globalThis.localStorage?.removeItem(THEME_KEY);
    else globalThis.localStorage?.setItem(THEME_KEY, t);
  } catch {
    /* archiviazione non disponibile: il tema vale solo per questa visita */
  }
}

/**
 * Attributi da applicare al contenitore di una certificazione per usarne
 * il colore d'accento, con la variante giusta per il tema chiaro o scuro.
 */
export function accentProps(cert: { accent: string; accentDark: string }) {
  return {
    'data-accent': '',
    style: { '--accent-light': cert.accent, '--accent-dark': cert.accentDark } as CSSProperties,
  };
}
