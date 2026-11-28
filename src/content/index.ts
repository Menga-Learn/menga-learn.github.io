import type { Certification } from '../types';
import { databricksDea } from './databricks-dea';
import { databricksDep } from './databricks-dep';
import { dp600 } from './dp600';
import { ingleseA1 } from './inglese/a1';
import { ingleseA2 } from './inglese/a2';
import { ingleseB1 } from './inglese/b1';
import { ingleseB2 } from './inglese/b2';
import { ingleseC1 } from './inglese/c1';
import { ingleseC2 } from './inglese/c2';

/** Registro delle certificazioni disponibili. Aggiungi qui i nuovi percorsi. */
export const certifications: Certification[] = [dp600, databricksDea, databricksDep, ingleseA1, ingleseA2, ingleseB1, ingleseB2, ingleseC1, ingleseC2];
