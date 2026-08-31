import type { RosterInstance } from '../types/roster';
import { getCatalogue } from '../data/warbands';
import { resolveProfil } from './profil';
import { estFrancTireur } from '../data/hiredSwords';
import { estDramatisPersonae } from '../data/dramatisPersonae';
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
  const catalogue = getCatalogue(roster.bande_id);
  const exclus = new Set(
    catalogue?.profils.filter((p) => p.exclu_effectif_max).map((p) => p.id) ?? []
  );
  const compteCommeUn = new Set(
    catalogue?.profils.filter((p) => p.groupe_compte_comme_un).map((p) => p.id) ?? []
  );
  const membresActifs = roster.membres.filter(
    (m) => m.statut !== 'mort' && !estFrancTireur(m) && !exclus.has(m.profil_id)
  );
  const total = membresActifs
    .filter((m) => !compteCommeUn.has(m.profil_id))
    .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
  const profilsGroupesSpeciaux = new Set(
    membresActifs.filter((m) => compteCommeUn.has(m.profil_id)).map((m) => m.profil_id)
  );
  return total + profilsGroupesSpeciaux.size;
}

/**
 * Nombre de francs-tireurs encore actifs (non-morts) — volontairement
 * exclus d'effectifTotal (règle imprimée : ne comptent pas dans l'effectif
 * maximum autorisé de la bande), mais bien présents sur la table de jeu.
 * Affiché à part pour éviter de laisser croire que la bande n'aligne que
 * `effectifTotal` figurines au combat. Exclut les Dramatis Personae (voir
 * nombreDramatisPersonaeActifs) : même séparation que dans RosterScreen
 * (groupe "Hired Swords" vs groupe "Dramatis Personae").
 */
export function nombreFrancsTireursActifs(roster: RosterInstance): number {
  return roster.membres.filter((m) => m.statut !== 'mort' && estFrancTireur(m) && !estDramatisPersonae(m)).length;
}

/** Nombre de Dramatis Personae encore actifs (non-morts) — voir nombreFrancsTireursActifs. */
export function nombreDramatisPersonaeActifs(roster: RosterInstance): number {
  return roster.membres.filter((m) => m.statut !== 'mort' && estDramatisPersonae(m)).length;
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
