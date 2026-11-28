import type { Area } from '../types';

/**
 * Macro aree mostrate in home, nell'ordine in cui compaiono.
 * Ogni certificazione indica la sua area con il campo `area`.
 * `upcoming` elenca i percorsi annunciati ma non ancora disponibili.
 */
export const areas: Area[] = [
  {
    id: 'microsoft',
    name: 'Microsoft',
    mark: 'MS',
    tagline: 'Dati e analisi con Microsoft Fabric e Power BI',
    accent: '#35628f',
    accentDark: '#a3c2e3',
    upcoming: [
      { code: 'DP-700', title: 'Fabric Data Engineer Associate' },
      { code: 'PL-300', title: 'Power BI Data Analyst Associate' },
    ],
  },
  {
    id: 'databricks',
    name: 'Databricks',
    mark: 'DB',
    tagline: 'Data engineering sulla Data Intelligence Platform',
    accent: '#a2462c',
    accentDark: '#e8a58c',
    upcoming: [{ code: 'DA Associate', title: 'Data Analyst Associate' }],
  },
  {
    id: 'british-council',
    name: 'British Council',
    mark: 'BC',
    tagline: 'Inglese per livelli del Quadro europeo (QCER), con preparazione al test Aptis',
    accent: '#6a4a85',
    accentDark: '#c7b0dd',
    levels: true,
    upcoming: [],
  },
];
