import type { RosterInstance } from '../types/roster';
import { getCatalogue } from '../data/warbands';
import { effectifTotal } from './bandeValue';

export type ViolationComposition = {
  profilId: string;
  nomProfil: string;
  type: 'max' | 'min';
  limite: number;
  actuel: number;
};

/**
 * Vérifie les limites de composition (max/min par profil, unique) parmi les
 * membres actifs/capturés (hors morts). Purement informatif — n'empêche rien.
 */
export function validerComposition(roster: RosterInstance): ViolationComposition[] {
  const catalogue = getCatalogue(roster.bande_id);
  if (!catalogue) return [];
  const violations: ViolationComposition[] = [];
  const comptes = new Map<string, number>();
  for (const m of roster.membres) {
    if (m.statut === 'mort') continue;
    comptes.set(m.profil_id, (comptes.get(m.profil_id) ?? 0) + (m.taille_groupe || 1));
  }
  for (const profil of catalogue.profils) {
    const actuel = comptes.get(profil.id) ?? 0;
    const limiteMax = profil.unique ? 1 : profil.max ?? undefined;
    if (limiteMax != null && actuel > limiteMax) {
      violations.push({ profilId: profil.id, nomProfil: profil.nom, type: 'max', limite: limiteMax, actuel });
    }
    if (profil.min != null && profil.min > 0 && actuel < profil.min) {
      violations.push({ profilId: profil.id, nomProfil: profil.nom, type: 'min', limite: profil.min, actuel });
    }
  }
  return violations;
}

export type ViolationEffectif = {
  type: 'min' | 'max';
  limite: number;
  actuel: number;
};

/**
 * Vérifie l'effectif total de la bande par rapport aux bornes du catalogue
 * (composition.effectif_min/effectif_max), quand elles sont renseignées.
 * Purement informatif — n'empêche pas de recruter/jouer.
 */
export function validerEffectif(roster: RosterInstance): ViolationEffectif[] {
  const catalogue = getCatalogue(roster.bande_id);
  const composition = catalogue?.composition;
  if (!composition) return [];
  const actuel = effectifTotal(roster);
  const violations: ViolationEffectif[] = [];
  if (composition.effectif_min != null && actuel < composition.effectif_min) {
    violations.push({ type: 'min', limite: composition.effectif_min, actuel });
  }
  if (composition.effectif_max != null && actuel > composition.effectif_max) {
    violations.push({ type: 'max', limite: composition.effectif_max, actuel });
  }
  return violations;
}

export function peutAjouterMembre(
  roster: RosterInstance,
  profilId: string,
  quantite = 1
): { ok: boolean; raison?: string } {
  const catalogue = getCatalogue(roster.bande_id);
  const profil = catalogue?.profils.find((p) => p.id === profilId);
  if (!profil) return { ok: false, raison: 'Profil introuvable dans le catalogue.' };
  const limite = profil.unique ? 1 : profil.max ?? undefined;
  if (limite != null) {
    const actuel = roster.membres
      .filter((m) => m.profil_id === profilId && m.statut !== 'mort')
      .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
    if (actuel + quantite > limite) {
      return {
        ok: false,
        raison: `Limite atteinte pour ${profil.nom} (max ${limite}, ${actuel} déjà présent(s)).`,
      };
    }
  }
  return { ok: true };
}
