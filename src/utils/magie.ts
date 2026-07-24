// Résolution du système de magie propre à une bande (catalogue.magie) :
// qui peut lancer des sorts, quels sorts restent à apprendre, et synopsis
// d'un sort déjà connu — utilisé au recrutement (premier sort obligatoire),
// à l'avancée d'expérience ("nouvelle compétence" → sort à la place), et à
// l'affichage sur la fiche personnage.
import type { MagieSort, WarbandCatalog } from '../types/catalog';

/** Vrai si ce profil est un sorcier de cette bande (figure dans
 * catalogue.magie.utilisateurs). */
export function estSorcier(catalogue: WarbandCatalog | undefined, profilId: string): boolean {
  return !!catalogue?.magie?.utilisateurs.includes(profilId);
}

/** Sorts du catalogue pas encore connus par le membre — proposés au choix
 * (premier sort au recrutement, ou nouveau sort via une avancée). */
export function sortsDisponibles(catalogue: WarbandCatalog | undefined, dejaConnus: string[]): MagieSort[] {
  if (!catalogue?.magie) return [];
  return catalogue.magie.sorts.filter((s) => !dejaConnus.includes(s.nom));
}

/** Synopsis complet d'un sort connu (nom, difficulté, texte) à partir de son
 * nom — undefined si introuvable dans le catalogue actuel (bande changée,
 * ou entrée héritée de l'ancien champ texte libre). */
export function resolveSort(catalogue: WarbandCatalog | undefined, nom: string): MagieSort | undefined {
  return catalogue?.magie?.sorts.find((s) => s.nom === nom);
}
