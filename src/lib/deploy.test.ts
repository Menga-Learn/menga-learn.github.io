import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import viteConfig from '../../vite.config';

// L'app deve funzionare sia in una sottocartella (GitHub Pages) sia alla radice di un dominio personale.
describe('indipendenza dal percorso di pubblicazione', () => {
  const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

  it('Vite usa percorsi relativi', () => {
    expect((viteConfig as { base?: string }).base).toBe('./');
  });

  it('il manifest usa id, start_url e scope relativi', () => {
    const m = JSON.parse(read('public/manifest.webmanifest'));
    for (const key of ['id', 'start_url', 'scope']) expect(m[key], key).toBe('./');
    for (const icon of m.icons) expect(icon.src.startsWith('/')).toBe(false);
  });

  it('index.html e il service worker non contengono percorsi assoluti', () => {
    const html = read('index.html');
    expect(html).not.toMatch(/(href|src)="\/(?!src\/main\.tsx)/);
    expect(read('public/sw.js')).not.toMatch(/['"]\/Menga-Learn/);
    expect(read('src/main.tsx')).toContain("register('./sw.js'");
  });
});
