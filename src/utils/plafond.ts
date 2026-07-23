// Plafonds de caractéristiques (p.121) et règle "+1 max par caractéristique
// pour les hommes de main" — voir CARACTERISTIQUES_MAX pour la table.
import { CARACTERISTIQUES_MAX } from '../data/caracteristiquesMax';
import type { PlafondCaracteristiques } from '../data/caracteristiquesMax';
import type { Profile, Stats } from '../types/catalog';
import type { AdvanceRecord } from '../types/roster';

export function plafondPour(profil: Profile | undefined): PlafondCaracteristiques | undefined {
  if (!profil?.groupe_caracteristiques) return undefined;
  return CARACTERISTIQUES_MAX[profil.groupe_caracteristiques];
}

export function estStatAuPlafond(profil: Profile | undefined, statsActuels: Stats, stat: keyof Stats): boolean {
  const plafond = plafondPour(profil);
  if (!plafond) return false;
  return statsActuels[stat] >= plafond[stat];
}

// Un homme de main ne peut jamais augmenter une caractéristique de plus de
// +1 au cours de sa carrière (rappel explicite du livre de règles, distinct
// du plafond racial ci-dessus). Ne s'applique pas aux héros.
export function estStatDejaAugmenteeUneFois(
  profil: Profile | undefined,
  historique: AdvanceRecord[],
  stat: keyof Stats
): boolean {
  if (profil?.type !== 'homme_de_main') return false;
  return historique.some((a) => a.type === 'caracteristique' && a.stat === stat);
}

export type VerdictAugmentation = { ok: boolean; raison?: string };

// Vérifie si `stat` peut être augmentée de +1 pour ce membre : ni au plafond
// racial, ni (pour un homme de main) déjà augmentée une première fois.
export function peutAugmenterStat(
  profil: Profile | undefined,
  statsActuels: Stats,
  historique: AdvanceRecord[],
  stat: keyof Stats
): VerdictAugmentation {
  if (estStatAuPlafond(profil, statsActuels, stat)) {
    return { ok: false, raison: 'Déjà au plafond racial pour ce profil.' };
  }
  if (estStatDejaAugmenteeUneFois(profil, historique, stat)) {
    return { ok: false, raison: 'Un homme de main ne peut pas augmenter deux fois la même caractéristique.' };
  }
  return { ok: true };
}
