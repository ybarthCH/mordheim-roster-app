import type { RosterInstance } from '../types/roster';
import { getCatalogue } from '../data/warbands';
import { resolveProfil } from './profil';

/** Valeur de bande = coût de recrutement des membres encore actifs (hors morts). */
export function valeurBande(roster: RosterInstance): number {
  let total = 0;
  for (const m of roster.membres) {
    if (m.statut === 'mort') continue;
    total += resolveProfil(roster, m)?.cout ?? 0;
  }
  return total;
}

export function effectifTotal(roster: RosterInstance): number {
  return roster.membres.filter((m) => m.statut !== 'mort').length;
}

export function nomCatalogue(bandeId: string): string {
  return getCatalogue(bandeId)?.nom ?? bandeId;
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
