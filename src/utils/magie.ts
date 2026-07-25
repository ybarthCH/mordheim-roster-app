// Résolution du système de magie propre à une bande (catalogue.magie) :
// qui peut lancer des sorts, quels sorts restent à apprendre, et synopsis
// d'un sort déjà connu — utilisé au recrutement (premier sort obligatoire),
// à l'avancée d'expérience ("nouvelle compétence" → sort à la place), et à
// l'affichage sur la fiche personnage.
import type { Magie, MagieSort, Profile, WarbandCatalog } from '../types/catalog';
import { MAGIE_MINEURE } from '../data/minorMagic';

/** Domaine utilisé par un profil. Les profils du catalogue de bande gardent
 * leur domaine propre ; les profils externes (notamment le Mage
 * franc-tireur) peuvent déclarer explicitement la Magie mineure. */
export function magieDuProfil(
  catalogue: WarbandCatalog | undefined,
  profil: Profile | string
): Magie | undefined {
  if (typeof profil !== 'string' && profil.categorie_magie === 'magie_mineure') return MAGIE_MINEURE;
  const profilId = typeof profil === 'string' ? profil : profil.id;
  return catalogue?.magie?.utilisateurs.includes(profilId) ? catalogue.magie : undefined;
}

/** Vrai si ce profil dispose d'un domaine de sorts. */
export function estSorcier(catalogue: WarbandCatalog | undefined, profil: Profile | string): boolean {
  if (typeof profil !== 'string' && profil.peut_lancer_sorts) return true;
  return !!magieDuProfil(catalogue, profil);
}

/** Sorts du catalogue pas encore connus par le membre — proposés au choix
 * (premier sort au recrutement, ou nouveau sort via une avancée). */
export function sortsDisponibles(
  catalogue: WarbandCatalog | undefined,
  dejaConnus: string[],
  profil?: Profile | string
): MagieSort[] {
  const magie = profil ? magieDuProfil(catalogue, profil) : catalogue?.magie;
  return magie?.sorts.filter((s) => !dejaConnus.includes(s.nom)) ?? [];
}

export function sortsMagieMineureDisponibles(dejaConnus: string[]): MagieSort[] {
  return MAGIE_MINEURE.sorts.filter((s) => !dejaConnus.includes(s.nom));
}

/** Synopsis complet d'un sort connu (nom, difficulté, texte) à partir de son
 * nom — undefined si introuvable dans le catalogue actuel (bande changée,
 * ou entrée héritée de l'ancien champ texte libre). */
export function resolveSort(
  catalogue: WarbandCatalog | undefined,
  nom: string,
  profil?: Profile | string
): MagieSort | undefined {
  const magie = profil ? magieDuProfil(catalogue, profil) : catalogue?.magie;
  return magie?.sorts.find((s) => s.nom === nom) ?? MAGIE_MINEURE.sorts.find((s) => s.nom === nom);
}
