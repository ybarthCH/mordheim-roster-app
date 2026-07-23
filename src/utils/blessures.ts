import type { SeriousInjuryRecord } from '../types/roster';

const LONGUEUR_NOM_COURT = 30;

// Titre court d'une blessure grave pour l'affichage condensé (roster global).
// Les enregistrements créés avant l'introduction du champ `nom` (ou saisis à
// la main sous l'ancien format libre resultat/effet) retombent sur un extrait
// tronqué de la description.
export function nomCourtBlessure(b: SeriousInjuryRecord): string {
  if (b.nom) return b.nom;
  const legacy = b as unknown as { resultat?: string };
  if (legacy.resultat) return legacy.resultat;
  const texte = b.description || '(sans description)';
  return texte.length > LONGUEUR_NOM_COURT ? `${texte.slice(0, LONGUEUR_NOM_COURT).trimEnd()}…` : texte;
}
