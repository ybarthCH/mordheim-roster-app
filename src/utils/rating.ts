import type { Member, RosterInstance } from '../types/roster';

/**
 * Rating d'un personnage ou d'un groupe d'hommes de main :
 * - Héros : 5 + XP actuel (+20 si Grande Cible) — toujours taille_groupe = 1.
 * - Groupe d'hommes de main : 5 × nombre de membres du groupe + XP du groupe.
 */
export function ratingMembre(m: Member): number {
  return 5 * (m.taille_groupe || 1) + m.xp + (m.grande_cible ? 20 : 0);
}

/**
 * Somme des ratings des membres encore actifs de la bande — un héros Blessé
 * ne compte plus dans le rating global tant qu'il l'est, tout comme un
 * membre Mort.
 */
export function ratingTotal(roster: RosterInstance): number {
  return roster.membres
    .filter((m) => m.statut !== 'mort' && m.statut !== 'blesse')
    .reduce((acc, m) => acc + ratingMembre(m), 0);
}
