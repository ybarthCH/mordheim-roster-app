import type { RosterInstance } from '../types/roster';
import { getCatalogue } from '../data/warbands';
import { resolveProfil } from './profil';
import { estFrancTireur } from '../data/hiredSwords';
import { translateWarbandCatalog } from '../i18n/data/warbands';
import type { Language } from '../state/useLanguage';

/** Valeur de bande = coût de recrutement des membres encore actifs (hors morts), par figurine. */
export function valeurBande(roster: RosterInstance): number {
  let total = 0;
  for (const m of roster.membres) {
    if (m.statut === 'mort') continue;
    total += (resolveProfil(roster, m)?.cout ?? 0) * (m.taille_groupe || 1);
  }
  return total;
}

/** Nombre total de figurines (groupes comptés par leur taille) encore actives. */
export function effectifTotal(roster: RosterInstance): number {
  return roster.membres
    .filter((m) => m.statut !== 'mort' && !estFrancTireur(m))
    .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
}

export function nomCatalogue(bandeId: string, language: Language = 'fr'): string {
  const catalogue = getCatalogue(bandeId);
  if (!catalogue) return bandeId;
  return translateWarbandCatalog(catalogue, language).nom;
}

export function bilanBatailles(roster: RosterInstance) {
  let victoires = 0;
  let defaites = 0;
  let nuls = 0;
  for (const b of roster.historique_batailles) {
    if (b.resultat === 'victoire') victoires++;
    else if (b.resultat === 'defaite') defaites++;
    else nuls++;
  }
  return { victoires, defaites, nuls, total: roster.historique_batailles.length };
}
