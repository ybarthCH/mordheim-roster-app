import type { Member, RosterInstance } from '../types/roster';
import { estGrandeCible, resolveProfil } from './profil';
import { getItem } from '../data/items';

// Monture : 3 points si elle n'a aucune attaque dans son profil (A = 0 ou
// absent), 5 points si elle peut attaquer (A > 0) — règle imprimée (Valeur
// de bande, p.65). Le profil de la monture vient de la base d'objets
// (items/montures.json), référencé par item_id sur l'entrée d'inventaire.
function pointsMonture(itemId: string): number {
  const item = getItem(itemId);
  const stats = item && 'stats' in item ? (item.stats as { A?: number | string } | undefined) : undefined;
  const attaques = typeof stats?.A === 'number' ? stats.A : parseInt(String(stats?.A ?? '0'), 10) || 0;
  return attaques > 0 ? 5 : 3;
}

/**
 * Rating d'un personnage ou d'un groupe d'hommes de main :
 * - Héros : 5 + XP actuel (+20 si Grande Cible) — toujours taille_groupe = 1.
 * - Groupe d'hommes de main : 5 × nombre de membres du groupe + XP du groupe.
 * - + points de monture(s) portées dans l'inventaire (voir pointsMonture).
 * Grande Cible est détectée sur les regles_speciales du profil catalogue ;
 * pour un Franc-tireur (profil_custom, sans regles_speciales), on retombe
 * sur la case manuelle saisie à l'engagement.
 */
export function ratingMembre(m: Member, roster: RosterInstance): number {
  const grandeCible = m.profil_custom ? m.grande_cible : estGrandeCible(resolveProfil(roster, m));
  const pointsMontures = m.inventaire
    .filter((e) => e.categorie === 'montures')
    .reduce((acc, e) => acc + pointsMonture(e.item_id), 0);
  return 5 * (m.taille_groupe || 1) + m.xp + (grandeCible ? 20 : 0) + pointsMontures;
}

/**
 * Somme des ratings des membres encore dans la bande — une figurine qui ne
 * participe pas à une bataille (Blessé, Hors de combat...) compte malgré
 * tout dans la valeur de bande (règle imprimée, p.65) ; seul un membre Mort
 * en est exclu, ayant définitivement quitté la bande.
 */
export function ratingTotal(roster: RosterInstance): number {
  return roster.membres.filter((m) => m.statut !== 'mort').reduce((acc, m) => acc + ratingMembre(m, roster), 0);
}
