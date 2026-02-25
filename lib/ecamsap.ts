/**
 * Compatibilité : les pages qui importent ECAMSAP utilisent maintenant la config Kafé Stockholm.
 * Nouveau code : importer SITE depuis @/lib/site-config
 */

import { SITE } from './site-config';

export const ECAMSAP = {
  name: SITE.name,
  slogan: SITE.tagline,
  tagline: SITE.tagline,
  pickup: SITE.clickCollect,
  newProducts: 'Nouveautés régulières sur la carte',
  contactEmail: SITE.contactEmail,
  legalPages: SITE.legalPages,
} as const;
