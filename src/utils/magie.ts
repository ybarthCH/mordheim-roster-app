// Résolution du système de magie propre à une bande (catalogue.magie) :
// qui peut lancer des sorts, quels sorts restent à apprendre, et synopsis
// d'un sort déjà connu — utilisé au recrutement (premier sort obligatoire),
// à l'avancée d'expérience ("nouvelle compétence" → sort à la place), et à
// l'affichage sur la fiche personnage.
import type { Magie, MagieSort, Profile, WarbandCatalog } from '../types/catalog';
import type { RosterInstance } from '../types/roster';
import { MAGIE_MINEURE } from '../data/minorMagic';

/** Domaine utilisé par un profil. Les profils du catalogue de bande gardent
 * leur domaine propre ; les profils externes (notamment le Mage
 * franc-tireur) peuvent déclarer explicitement la Magie mineure.
 *
 * `marqueId` (ex : Marque des Dieux Sombres des Devins Maraudeurs) résout un
 * domaine alternatif propre à cette Marque (WarbandCatalog.magie_variantes)
 * quand le catalogue en propose — absent ou sans correspondance, retombe sur
 * le domaine par défaut du profil. Une Marque à `pas_de_sorts` (ex : Arkhar,
 * dont le Devin devient un Père de Sang qui ne jette plus de sorts) retourne
 * undefined sans se rabattre sur le domaine par défaut. */
export function magieDuProfil(
  catalogue: WarbandCatalog | undefined,
  profil: Profile | string,
  marqueId?: string
): Magie | undefined {
  if (typeof profil !== 'string' && profil.categorie_magie === 'magie_mineure') return MAGIE_MINEURE;
  if (marqueId) {
    const marque = catalogue?.marques?.find((m) => m.id === marqueId);
    if (marque?.pas_de_sorts) return undefined;
    if (marque?.magie_variante) return catalogue?.magie_variantes?.[marque.magie_variante];
  }
  const profilId = typeof profil === 'string' ? profil : profil.id;
  if (catalogue?.magie?.utilisateurs.includes(profilId)) return catalogue.magie;
  // Profil externe (Dramatis Personae, ex : Bertha Bestraufrung) déclarant
  // explicitement l'accès au domaine propre de la bande sans figurer dans sa
  // liste d'utilisateurs (laquelle ne référence que les profils du catalogue).
  if (typeof profil !== 'string' && profil.peut_lancer_sorts && !profil.categorie_magie) return catalogue?.magie;
  return undefined;
}

/** Vrai si ce profil (avec cette Marque le cas échéant) dispose d'un domaine
 * de sorts. */
export function estSorcier(
  catalogue: WarbandCatalog | undefined,
  profil: Profile | string,
  marqueId?: string
): boolean {
  if (marqueId && catalogue?.marques?.find((m) => m.id === marqueId)?.pas_de_sorts) return false;
  if (typeof profil !== 'string' && profil.peut_lancer_sorts) return true;
  return !!magieDuProfil(catalogue, profil, marqueId);
}

/** Sorts du catalogue pas encore connus par le membre — proposés au choix
 * (premier sort au recrutement, ou nouveau sort via une avancée). */
export function sortsDisponibles(
  catalogue: WarbandCatalog | undefined,
  dejaConnus: string[],
  profil?: Profile | string,
  marqueId?: string
): MagieSort[] {
  const magie = profil ? magieDuProfil(catalogue, profil, marqueId) : catalogue?.magie;
  return magie?.sorts.filter((s) => !dejaConnus.includes(s.nom)) ?? [];
}

export function sortsMagieMineureDisponibles(dejaConnus: string[]): MagieSort[] {
  return MAGIE_MINEURE.sorts.filter((s) => !dejaConnus.includes(s.nom));
}

/** Sorts connus par un membre vivant du profil `profilId` dans cette bande —
 * undefined si aucun n'existe (aucune restriction à appliquer dans ce cas).
 * Ex : les sorts de la Liche, pour restreindre ceux du Nécromancien tant
 * qu'elle est vivante (voir Profile.sorts_restreints_a_profil). */
export function sortsConnusParProfil(roster: RosterInstance, profilId: string): string[] | undefined {
  const source = roster.membres.find((m) => m.statut !== 'mort' && m.profil_id === profilId);
  return source?.sorts_connus;
}

/** Variante de sortsDisponibles tenant compte de Profile.sorts_restreints_a_profil
 * (voir sortsConnusParProfil) — à utiliser partout où un choix de sort est
 * proposé au joueur (recrutement, avancée) pour une bande susceptible
 * d'avoir ce genre de restriction croisée entre profils. */
export function sortsDisponiblesPourRoster(
  catalogue: WarbandCatalog | undefined,
  roster: RosterInstance,
  dejaConnus: string[],
  profil?: Profile | string,
  marqueId?: string
): MagieSort[] {
  const base = sortsDisponibles(catalogue, dejaConnus, profil, marqueId);
  const profilRestriction = typeof profil !== 'string' ? profil?.sorts_restreints_a_profil : undefined;
  if (!profilRestriction) return base;
  const connus = sortsConnusParProfil(roster, profilRestriction);
  if (!connus) return base;
  return base.filter((s) => connus.includes(s.nom));
}

/** Synopsis complet d'un sort connu (nom, difficulté, texte) à partir de son
 * nom — undefined si introuvable dans le catalogue actuel (bande changée,
 * ou entrée héritée de l'ancien champ texte libre). */
export function resolveSort(
  catalogue: WarbandCatalog | undefined,
  nom: string,
  profil?: Profile | string,
  marqueId?: string
): MagieSort | undefined {
  const magie = profil ? magieDuProfil(catalogue, profil, marqueId) : catalogue?.magie;
  return magie?.sorts.find((s) => s.nom === nom) ?? MAGIE_MINEURE.sorts.find((s) => s.nom === nom);
}
