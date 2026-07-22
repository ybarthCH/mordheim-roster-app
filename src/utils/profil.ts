import type { Profile, SkillCategory } from '../types/catalog';
import { SKILL_CATEGORIES } from '../types/catalog';
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

const GRANDE_CIBLE_RE = /^grande?\s*cible$/i;

/**
 * Détecte la règle spéciale "Grande Cible" directement sur le profil du
 * catalogue (nom de règle "Grande Cible"/"Grande cible" ou "Grand" pour les
 * Gladiateurs Ogres), plutôt qu'une case à cocher manuelle. Reste inopérant
 * pour un profil Franc-tireur (profil_custom), qui n'a pas de regles_speciales
 * — d'où la case manuelle conservée uniquement pour ce cas-là.
 */
export function estGrandeCible(profil: Profile | undefined): boolean {
  return (profil?.regles_speciales ?? []).some(
    (r) => GRANDE_CIBLE_RE.test(r.nom.trim()) || r.nom.trim().toLowerCase() === 'grand'
  );
}

/**
 * Tables de compétences réellement accessibles à un profil : toutes les
 * tables si l'accès est à vérifier ou non renseigné, sinon celles du
 * catalogue — auxquelles s'ajoute toujours Équitation pour un héros, cette
 * table étant ouverte à tous les héros du jeu sans exception (règle
 * générique, non listée bande par bande dans les données source).
 */
export function categoriesAccessibles(profil: Profile): SkillCategory[] {
  const base: SkillCategory[] =
    profil.acces_competences_a_verifier || profil.acces_competences.length === 0
      ? SKILL_CATEGORIES.map((c) => c.id)
      : profil.acces_competences;
  if (profil.type !== 'heros' || base.includes('equitation')) return base;
  return [...base, 'equitation'];
}

// Règle Mordheim : une bande ne peut jamais compter plus de 6 héros.
export const LIMITE_HEROS = 6;

/**
 * Nombre de héros actuels dans la bande (profil résolu 'heros', figurines
 * mortes exclues). Sert à bloquer la promotion "Ce gars est doué" une fois
 * la limite atteinte.
 */
export function nombreHeros(roster: RosterInstance): number {
  return roster.membres.filter((m) => {
    if (m.statut === 'mort') return false;
    return resolveProfil(roster, m)?.type === 'heros';
  }).length;
}
