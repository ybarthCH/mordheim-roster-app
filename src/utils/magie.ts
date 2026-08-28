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
  marqueId?: string,
  // Domaine de Magie mineure à utiliser pour l'affichage — déjà traduit si
  // fourni par l'appelant (voir i18n/data/minorMagic.ts), sinon la donnée
  // française d'origine. N'affecte que nom/texte : les MagieSort.id restent
  // identiques dans les deux cas.
  magieMineureAffichee: Magie = MAGIE_MINEURE
): Magie | undefined {
  if (typeof profil !== 'string' && profil.categorie_magie === 'magie_mineure') return magieMineureAffichee;
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
 * (premier sort au recrutement, ou nouveau sort via une avancée).
 * `dejaConnus` contient des `MagieSort.id` (voir Member.sorts_connus). */
export function sortsDisponibles(
  catalogue: WarbandCatalog | undefined,
  dejaConnus: string[],
  profil?: Profile | string,
  marqueId?: string,
  magieMineureAffichee: Magie = MAGIE_MINEURE
): MagieSort[] {
  const magie = profil ? magieDuProfil(catalogue, profil, marqueId, magieMineureAffichee) : catalogue?.magie;
  return magie?.sorts.filter((s) => !dejaConnus.includes(s.id)) ?? [];
}

export function sortsMagieMineureDisponibles(
  dejaConnus: string[],
  magieMineureAffichee: Magie = MAGIE_MINEURE
): MagieSort[] {
  return magieMineureAffichee.sorts.filter((s) => !dejaConnus.includes(s.id));
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
  marqueId?: string,
  magieMineureAffichee: Magie = MAGIE_MINEURE
): MagieSort[] {
  const base = sortsDisponibles(catalogue, dejaConnus, profil, marqueId, magieMineureAffichee);
  const profilId = typeof profil === 'string' ? profil : profil?.id;
  // Un sort réservé à un autre profil (MagieSort.reserve_a_profil) ne doit
  // jamais apparaître ici pour ce profil-ci, même s'il matche par ailleurs
  // le filtre sorts_restreints_a_profil ci-dessous (voir vision_funeste/
  // horreur_vivante des Morts Tourmentés, qui partagent un même résultat de
  // dé avec des lanceurs mutuellement exclusifs).
  const sansSortsReserves = base.filter((s) => !s.reserve_a_profil || s.reserve_a_profil === profilId);
  const profilRestriction = typeof profil !== 'string' ? profil?.sorts_restreints_a_profil : undefined;
  if (!profilRestriction) return sansSortsReserves;
  const connus = sortsConnusParProfil(roster, profilRestriction);
  if (!connus) return sansSortsReserves;
  return sansSortsReserves.filter(
    (s) => connus.includes(s.id) || (s.exception_si_connu && connus.includes(s.exception_si_connu))
  );
}

/** Synopsis complet d'un sort connu (nom, difficulté, texte) à partir de son
 * id (voir MagieSort.id / Member.sorts_connus) — undefined si introuvable
 * dans le catalogue actuel (bande changée, ou entrée héritée de l'ancien
 * format texte libre). `catalogue` peut être français ou déjà traduit : la
 * résolution par id reste valide dans les deux cas, contrairement à une
 * résolution par nom. */
export function resolveSort(
  catalogue: WarbandCatalog | undefined,
  id: string,
  profil?: Profile | string,
  marqueId?: string,
  magieMineureAffichee: Magie = MAGIE_MINEURE
): MagieSort | undefined {
  const magie = profil ? magieDuProfil(catalogue, profil, marqueId, magieMineureAffichee) : catalogue?.magie;
  return magie?.sorts.find((s) => s.id === id) ?? magieMineureAffichee.sorts.find((s) => s.id === id);
}

/** Réécrit les anciennes entrées de `Member.sorts_connus` stockées comme nom
 * affiché (avant la migration vers `MagieSort.id`) en id stable, en cherchant
 * une correspondance parmi les domaines de sorts fournis par l'appelant (ex :
 * catalogue français + anglais de la bande, Magie mineure dans les deux
 * langues — voir l'appel dans PersonnageScreen, seul endroit où toutes ces
 * données sont déjà chargées). Une entrée déjà valide (id connu dans l'un des
 * domaines) ou sans correspondance trouvée est laissée inchangée (repli sur
 * l'ancien texte, cf resolveSort). Reste volontairement indépendant de la
 * langue affichée à l'écran : matche indifféremment sur n'importe quel
 * domaine fourni. */
export function migrerSortsConnus(sortsConnus: string[], domaines: Magie[]): string[] {
  if (sortsConnus.length === 0) return sortsConnus;
  const idsValides = new Set<string>();
  const idParNom = new Map<string, string>();
  domaines.forEach((magie) => {
    magie.sorts.forEach((s) => {
      idsValides.add(s.id);
      idParNom.set(s.nom.trim().toLowerCase(), s.id);
    });
  });
  return sortsConnus.map((entree) =>
    idsValides.has(entree) ? entree : (idParNom.get(entree.trim().toLowerCase()) ?? entree)
  );
}
