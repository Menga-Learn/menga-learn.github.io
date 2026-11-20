import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * Rende il Markdown dei contenuti. I contenuti sono scritti nel repository
 * (non da utenti), quindi l'HTML generato è considerato affidabile.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = useMemo(() => marked.parse(source, { async: false }) as string, [source]);
  return <div className={['md', className].filter(Boolean).join(' ')} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Variante in linea (senza paragrafo esterno), utile per le opzioni delle domande. */
export function InlineMarkdown({ source }: { source: string }) {
  const html = useMemo(() => marked.parseInline(source, { async: false }) as string, [source]);
  return <span className="md-inline" dangerouslySetInnerHTML={{ __html: html }} />;
}
