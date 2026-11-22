import { describe, expect, it } from 'vitest';
import { certifications } from '../content';
import { nextTheme } from './theme';

/** Rapporto di contrasto WCAG tra due colori #rrggbb. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('tema', () => {
  it('cicla auto → chiaro → scuro → auto', () => {
    expect(nextTheme('auto')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('auto');
  });

  it.each(certifications.map((c) => [c.code, c] as const))(
    "l'accento di %s è leggibile in entrambi i temi",
    (_, cert) => {
      // Fondi delle superfici in src/styles.css (--bg / --surface-2, il più sfavorevole)
      expect(contrast(cert.accent, '#ede8de')).toBeGreaterThanOrEqual(4.5);
      expect(contrast(cert.accentDark, '#2d2b27')).toBeGreaterThanOrEqual(4.5);
    },
  );
});
