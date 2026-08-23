// Plafonds de caractéristiques (p.121) et règle "+1 max par caractéristique
// pour les hommes de main" — voir CARACTERISTIQUES_MAX pour la table.
import { CARACTERISTIQUES_MAX } from '../data/caracteristiquesMax';
import type { PlafondCaracteristiques } from '../data/caracteristiquesMax';
import type { Profile, Stats } from '../types/catalog';
import type { AdvanceRecord, Member } from '../types/roster';

// Manuel d'entraînement (événement d'exploration Arène, sextuples) : tant que
// le porteur le possède dans son inventaire, sa CC peut progresser un point
// au-delà du maximum racial normal — voir tableExplorationEvenements.ts et
// items/objets_divers.json (manuel_entrainement). Un plafond, pas un bonus
// direct : si le manuel est revendu/perdu plus tard, une CC déjà montée
// grâce à lui ne redescend pas automatiquement (même logique que l'unique
// autre mécanisme de plafond variable de l'app, plafond_competence_override).
export function bonusPlafondCC(membre: Pick<Member, 'inventaire'>): number {
  return membre.inventaire.some((e) => e.item_id === 'manuel_entrainement') ? 1 : 0;
}

export function plafondPour(
  profil: Profile | undefined,
  competencesAcquises: string[] = [],
  bonusCC = 0
): PlafondCaracteristiques | undefined {
  if (!profil?.groupe_caracteristiques || profil.plafond_ignore) return undefined;
  const override = profil.plafond_competence_override;
  const groupe =
    override && competencesAcquises.includes(override.competence_id) ? override.groupe : profil.groupe_caracteristiques;
  const base = CARACTERISTIQUES_MAX[groupe];
  if (!base || !bonusCC) return base;
  return { ...base, CC: base.CC + bonusCC };
}

export function estStatAuPlafond(
  profil: Profile | undefined,
  statsActuels: Stats,
  stat: keyof Stats,
  competencesAcquises: string[] = [],
  bonusCC = 0
): boolean {
  const plafond = plafondPour(profil, competencesAcquises, bonusCC);
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
  stat: keyof Stats,
  competencesAcquises: string[] = [],
  bonusCC = 0
): VerdictAugmentation {
  if (estStatAuPlafond(profil, statsActuels, stat, competencesAcquises, bonusCC)) {
    return { ok: false, raison: 'Déjà au plafond racial pour ce profil.' };
  }
  if (estStatDejaAugmenteeUneFois(profil, historique, stat)) {
    return { ok: false, raison: 'Un homme de main ne peut pas augmenter deux fois la même caractéristique.' };
  }
  return { ok: true };
}
