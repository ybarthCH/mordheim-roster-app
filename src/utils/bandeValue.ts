import type { RosterInstance } from '../types/roster';
import { getCatalogue, getProfil } from '../data/warbands';

export function coutProfil(bandeId: string, profilId: string): number {
  const profil = getProfil(bandeId, profilId);
  return profil?.cout ?? 0;
}

/** Valeur de bande = coût de recrutement des membres (encore actifs) + valeur de leur équipement. */
export function valeurBande(roster: RosterInstance): number {
  let total = 0;
  for (const m of roster.membres) {
    if (m.statut === 'mort') continue;
    total += coutProfil(roster.bande_id, m.profil_id);
    total += m.equipement_valeur || 0;
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
