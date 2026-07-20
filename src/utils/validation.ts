import type { RosterInstance } from '../types/roster';
import { getCatalogue } from '../data/warbands';

export type ViolationComposition = {
  profilId: string;
  nomProfil: string;
  limite: number;
  actuel: number;
};

/** Vérifie les limites de composition (max par profil, unique) parmi les membres actifs/capturés (hors morts). */
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
    const limite = profil.unique ? 1 : profil.max ?? undefined;
    if (limite == null) continue;
    const actuel = comptes.get(profil.id) ?? 0;
    if (actuel > limite) {
      violations.push({ profilId: profil.id, nomProfil: profil.nom, limite, actuel });
    }
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
