import type { Member, RosterInstance } from '../types/roster';

/**
 * Rating d'un personnage ou d'un groupe d'hommes de main :
 * - Héros : 5 + XP actuel (+20 si Grande Cible)
 * - Groupe d'hommes de main : 5 × nombre de membres du groupe + XP du groupe
 *   — ici chaque recrue est suivie individuellement (groupe de taille 1),
 *   la formule se réduit donc à 5 + XP, +20 si Grande Cible cochée.
 */
export function ratingMembre(m: Member): number {
  return 5 + m.xp + (m.grande_cible ? 20 : 0);
}

/** Somme des ratings des membres encore actifs (hors morts) de la bande. */
export function ratingTotal(roster: RosterInstance): number {
  return roster.membres.filter((m) => m.statut !== 'mort').reduce((acc, m) => acc + ratingMembre(m), 0);
}
