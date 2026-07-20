import type { Profile } from '../types/catalog';
import type { Member, RosterInstance } from '../types/roster';
import { getProfil } from '../data/warbands';

/**
 * Profil effectif d'un membre : celui du catalogue de la bande, ou le profil
 * "Franc-tireur" saisi à la main s'il en a un, avec la promotion "Ce gars
 * est doué" appliquée par-dessus le cas échéant (type héros, tables de
 * compétences choisies à la promotion).
 */
export function resolveProfil(roster: RosterInstance, membre: Member): Profile | undefined {
  const base: Profile | undefined = membre.profil_custom
    ? {
        id: membre.profil_id,
        nom: membre.profil_custom.nom,
        type: membre.profil_custom.type,
        cout: membre.profil_custom.cout,
        stats: membre.profil_custom.stats,
        acces_competences: membre.profil_custom.acces_competences,
      }
    : getProfil(roster.bande_id, membre.profil_id);

  if (!base) return undefined;

  if (membre.promu_heros) {
    return {
      ...base,
      type: 'heros',
      acces_competences: membre.acces_competences_override ?? base.acces_competences,
      acces_competences_a_verifier: false,
    };
  }

  return base;
}
