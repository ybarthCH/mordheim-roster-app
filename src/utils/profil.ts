import type { Profile, SkillCategory, WarbandCatalog } from '../types/catalog';
import { SKILL_CATEGORIES } from '../types/catalog';
import type { Member, RosterInstance } from '../types/roster';
import type { Language } from '../state/useLanguage';
import { getCatalogue, getProfil } from '../data/warbands';
import { estFrancTireur, getFrancTireur, profilDeFrancTireur } from '../data/hiredSwords';
import { translateHiredSword } from '../i18n/data/hiredSwords';
import { accesCompetencesPourTribu } from './tribu';

/**
 * Profil effectif d'un membre : celui du catalogue de la bande, ou le profil
 * "Franc-tireur" saisi à la main s'il en a un, avec la promotion "Ce gars
 * est doué" appliquée par-dessus le cas échéant (type héros, tables de
 * compétences choisies à la promotion).
 *
 * `catalogue`, s'il est fourni, remplace le catalogue résolu automatiquement
 * (utile pour passer une version déjà traduite depuis un composant d'affichage
 * — voir translateWarbandCatalog). La logique métier (recherche par id,
 * comparaisons de type...) reste indifférente à la langue du profil retourné.
 *
 * `language`, s'il est fourni, traduit également le profil d'un franc-tireur
 * (voir translateHiredSword) avant sa conversion en Profile — même principe
 * que `catalogue` pour les profils de bande classiques. Omis par les appels
 * purement métier (calculs, filtres...), qui restent indifférents à la langue.
 */
export function resolveProfil(
  roster: RosterInstance,
  membre: Member,
  catalogue?: WarbandCatalog,
  language?: Language
): Profile | undefined {
  const francTireurBrut = getFrancTireur(membre.franc_tireur_id);
  const francTireur = francTireurBrut && language ? translateHiredSword(francTireurBrut, language) : francTireurBrut;
  const base: Profile | undefined = francTireur
    ? profilDeFrancTireur(francTireur)
    : membre.profil_custom
    ? {
        id: membre.profil_id,
        nom: membre.profil_custom.nom,
        type: membre.profil_custom.type,
        cout: membre.profil_custom.cout,
        stats: membre.profil_custom.stats,
        acces_competences: membre.profil_custom.acces_competences,
        grille_xp: 'homme_de_main',
        table_avancement: 'heros',
      }
    : catalogue
    ? catalogue.profils.find((p) => p.id === membre.profil_id)
    : getProfil(roster.bande_id, membre.profil_id);

  if (!base) return undefined;

  // Surcharge d'accès aux compétences par tribu (ex : les trois cités-états
  // tiléennes n'ont pas le même tableau de compétences pour un même profil)
  // — cherchée sur le catalogue complet même si `catalogue` n'a pas été
  // fourni, car `tribuChoisie` a besoin de `WarbandCatalog.tribus`, absent
  // du seul `Profile` résolu ci-dessus.
  const catalogueComplet = catalogue ?? getCatalogue(roster.bande_id);
  const accesTribu = accesCompetencesPourTribu(catalogueComplet, roster, membre.profil_id);

  if (membre.promu_heros) {
    return {
      ...base,
      type: 'heros',
      acces_competences: membre.acces_competences_override ?? accesTribu ?? base.acces_competences,
      acces_competences_a_verifier: false,
    };
  }

  return accesTribu ? { ...base, acces_competences: accesTribu } : base;
}

export function grilleXpDuProfil(profil: Profile): 'heros' | 'homme_de_main' {
  return profil.grille_xp ?? (profil.type === 'heros' ? 'heros' : 'homme_de_main');
}

export function tableAvancementDuProfil(profil: Profile): 'heros' | 'homme_de_main' {
  return profil.table_avancement ?? (profil.type === 'heros' ? 'heros' : 'homme_de_main');
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
  if (
    profil.type !== 'heros' ||
    profil.acces_equitation_automatique === false ||
    base.includes('equitation')
  ) {
    return base;
  }
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
    if (m.statut === 'mort' || estFrancTireur(m)) return false;
    return resolveProfil(roster, m)?.type === 'heros';
  }).length;
}

/** Nom affiché d'un membre, avec sa taille de groupe si figurines multiples. */
export function nomAffiche(m: Member): string {
  return `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;
}
