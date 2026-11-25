import type { Certification } from '../types';
import { databricksDea } from './databricks-dea';
import { databricksDep } from './databricks-dep';
import { dp600 } from './dp600';

/** Registro delle certificazioni disponibili. Aggiungi qui i nuovi percorsi. */
export const certifications: Certification[] = [dp600, databricksDea, databricksDep];
