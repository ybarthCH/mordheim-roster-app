import type { CompetenceSpeciale, Profile, SkillCategory, WarbandCatalog } from '../types/catalog';
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

  const resultat: Profile = membre.promu_heros
    ? {
        ...base,
        type: 'heros',
        acces_competences: membre.acces_competences_override ?? accesTribu ?? base.acces_competences,
        acces_competences_a_verifier: false,
      }
    : membre.squig_entraine
    ? { ...base, grille_xp: 'homme_de_main', table_avancement: 'homme_de_main', gagne_experience: true }
    : accesTribu
    ? { ...base, acces_competences: accesTribu }
    : base;

  // Marque des Dieux Sombres (Maraudeurs du Chaos) : certaines Marques
  // élargissent les catégories de compétences accessibles au lieu de
  // simplement changer le domaine de sorts (ex : Marque d'Arkhar — le Devin
  // devenu Père de Sang accède aux compétences de Force en plus de sa liste
  // normale). Voir Marque.competences_supplementaires dans types/catalog.ts.
  const competencesSupplementairesMarque = membre.marque
    ? catalogueComplet?.marques?.find((m) => m.id === membre.marque)?.competences_supplementaires
    : undefined;
  const resultatAvecMarque =
    competencesSupplementairesMarque && !resultat.acces_competences_a_verifier
      ? {
          ...resultat,
          acces_competences: [...new Set([...resultat.acces_competences, ...competencesSupplementairesMarque])],
        }
      : resultat;

  // Upgrade payant "Option Sorcier" pris par ce membre (voir
  // Profile.option_sorcier, Member.option_sorcier_pris) : superpose l'accès
  // à la Magie mineure sur le profil de base, une fois le prix payé — le
  // champ option_sorcier lui-même reste dans le profil retourné (pas
  // supprimé) pour que l'UI sache encore qu'un upgrade existe pour ce
  // profil, même après l'avoir pris.
  if (membre.option_sorcier_pris && resultatAvecMarque.option_sorcier) {
    return { ...resultatAvecMarque, peut_lancer_sorts: true, categorie_magie: 'magie_mineure' };
  }
  return resultatAvecMarque;
}

export function grilleXpDuProfil(profil: Profile): 'heros' | 'homme_de_main' {
  return profil.grille_xp ?? (profil.type === 'heros' ? 'heros' : 'homme_de_main');
}

export function tableAvancementDuProfil(profil: Profile): 'heros' | 'homme_de_main' {
  return profil.table_avancement ?? (profil.type === 'heros' ? 'heros' : 'homme_de_main');
}

// Voir Profile.transformation — le bouton de transformation n'apparaît sur
// la fiche du personnage qu'une fois toutes les conditions réunies : seuil
// d'XP (statut vivant implicite : la fiche personnage n'est de toute façon
// consultable que pour un membre existant du roster) et/ou présence d'un
// autre membre vivant d'un profil donné possédant un objet précis dans son
// inventaire (ex : le Prêcheur-Sorcier Pestilens équipé du Parchemin de rat
// familier, condition du Rat Familier).
export function transformationDisponible(profil: Profile, membre: Member, roster: RosterInstance): boolean {
  const transformation = profil.transformation;
  if (!transformation) return false;
  if (transformation.seuil_xp != null && membre.xp < transformation.seuil_xp) return false;
  const necessite = transformation.necessite_profil_vivant_avec_objet;
  if (necessite) {
    const present = roster.membres.some(
      (m) =>
        m.profil_id === necessite.profil &&
        m.statut !== 'mort' &&
        m.inventaire.some((e) => e.item_id === necessite.item_id)
    );
    if (!present) return false;
  }
  if (transformation.necessite_caracteristique_variable && Object.keys(membre.stats_variables ?? {}).length === 0) {
    return false;
  }
  return true;
}

// Voir Profile.transformation.bloque_si_profil_vivant — vrai si la cible de
// la transformation est un profil dont un exemplaire vivant existe déjà
// dans la bande (ex : la bande a déjà un Enfant du Chaos). Dans ce cas, le
// bouton de transformation devient un simple retrait de la bande plutôt
// qu'un swap de profil (voir TransformationModal/transformerProfil).
export function transformationEstDepart(profil: Profile, roster: RosterInstance): boolean {
  const cibleBloquante = profil.transformation?.bloque_si_profil_vivant;
  if (!cibleBloquante) return false;
  return roster.membres.some((m) => m.profil_id === cibleBloquante && m.statut !== 'mort');
}

/**
 * Un membre peut être désigné manuellement avec le statut spécial porté par
 * `Profile.designation_entrainee` (voir ce champ) si : ce profil le prévoit,
 * ce membre n'est pas déjà désigné, il représente une figurine isolée
 * (taille_groupe === 1, pas un groupe simplifié), il est vivant, un membre
 * vivant du profil dresseur a acquis la compétence requise, et aucun autre
 * membre de la bande n'est déjà désigné (un seul à la fois).
 */
export function peutDesignerEntraine(roster: RosterInstance, profil: Profile, membre: Member): boolean {
  const designation = profil.designation_entrainee;
  if (!designation) return false;
  if (membre.squig_entraine) return false;
  if (membre.taille_groupe !== 1) return false;
  if (membre.statut === 'mort') return false;
  const dejaDesigneAilleurs = roster.membres.some(
    (m) => m.instance_id !== membre.instance_id && m.squig_entraine
  );
  if (dejaDesigneAilleurs) return false;
  return roster.membres.some(
    (m) =>
      m.profil_id === designation.profil_dresseur &&
      m.statut !== 'mort' &&
      m.competences_acquises.includes(designation.competence_requise)
  );
}

/**
 * Vrai si un membre désigné (`Member.squig_entraine`) devrait être retiré de
 * la bande car son dresseur n'est plus vivant ou n'a plus la compétence
 * requise (ex : « Si le Berger à Squig meurt, le Squig entraîné est retiré
 * de la bande »). Purement informatif ici — l'app ne supprime jamais un
 * membre automatiquement, voir le bouton de retrait manuel sur la fiche
 * personnage (StatutCard).
 */
export function doitEtreRetireEntraine(roster: RosterInstance, profil: Profile, membre: Member): boolean {
  const designation = profil.designation_entrainee;
  if (!designation || !membre.squig_entraine) return false;
  return !roster.membres.some(
    (m) =>
      m.profil_id === designation.profil_dresseur &&
      m.statut !== 'mort' &&
      m.competences_acquises.includes(designation.competence_requise)
  );
}

const GRANDE_CIBLE_RE = /^grande?\s*cible$/i;

// Autres intitulés officiels de la même règle "Grande Cible" (droit à être
// pris pour cible au Tir) selon la bande source — ex. l'Araignée Gigantesque
// des Gobelins des Forêts, dont la règle est nommée "Grosse bête"/"Large
// Monster" plutôt que "Grande Cible" ("Les Araignées Gigantesques sont des
// grandes cibles comme défini dans les règles de Tir.", Gobelins des Forêts
// [GLM].pdf p.6 ; "Gigantic Spiders are large targets...", Forest
// Goblins.pdf p.4). La comparaison porte sur le nom traduit affiché, donc
// les deux langues doivent être listées.
const AUTRES_NOMS_GRANDE_CIBLE = new Set(['grosse bête', 'large monster']);

/**
 * Détecte la règle spéciale "Grande Cible" directement sur le profil du
 * catalogue (nom de règle "Grande Cible"/"Grande cible", "Grand" pour les
 * Gladiateurs Ogres, ou un autre intitulé officiel équivalent — voir
 * AUTRES_NOMS_GRANDE_CIBLE), plutôt qu'une case à cocher manuelle. Reste
 * inopérant pour un profil Franc-tireur (profil_custom), qui n'a pas de
 * regles_speciales — d'où la case manuelle conservée uniquement pour ce
 * cas-là.
 */
export function estGrandeCible(profil: Profile | undefined): boolean {
  return (profil?.regles_speciales ?? []).some((r) => {
    const nom = r.nom.trim();
    return GRANDE_CIBLE_RE.test(nom) || nom.toLowerCase() === 'grand' || AUTRES_NOMS_GRANDE_CIBLE.has(nom.toLowerCase());
  });
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

/**
 * Compétences de catégorie Spéciale réellement proposées à un profil : par
 * défaut, `profil.competences_speciales` remplace entièrement la liste
 * Spéciale de la bande (ex : franc-tireur, Marchand) ; si
 * `competences_speciales_ajoutees` est vrai, elle s'y ajoute au lieu de la
 * remplacer (ex : Berger à Squig gobelin — voir Profile.competences_speciales
 * dans types/catalog.ts). Utilisé par AvanceeModal et CompetencesPanel, les
 * deux seuls endroits qui résolvent la liste Spéciale d'un profil.
 */
export function competencesSpecialesPourProfil(
  profil: Profile,
  catalogue: WarbandCatalog
): CompetenceSpeciale[] {
  if (!profil.competences_speciales) return catalogue.competences_speciales;
  if (profil.competences_speciales_ajoutees) {
    return [...catalogue.competences_speciales, ...profil.competences_speciales];
  }
  return profil.competences_speciales;
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
