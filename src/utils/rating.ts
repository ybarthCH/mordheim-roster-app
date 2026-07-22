import type { Member, RosterInstance } from '../types/roster';
import { estGrandeCible, resolveProfil } from './profil';

/**
 * Rating d'un personnage ou d'un groupe d'hommes de main :
 * - Héros : 5 + XP actuel (+20 si Grande Cible) — toujours taille_groupe = 1.
 * - Groupe d'hommes de main : 5 × nombre de membres du groupe + XP du groupe.
 * Grande Cible est détectée sur les regles_speciales du profil catalogue ;
 * pour un Franc-tireur (profil_custom, sans regles_speciales), on retombe
 * sur la case manuelle saisie à l'engagement.
 */
export function ratingMembre(m: Member, roster: RosterInstance): number {
  const grandeCible = m.profil_custom ? m.grande_cible : estGrandeCible(resolveProfil(roster, m));
  return 5 * (m.taille_groupe || 1) + m.xp + (grandeCible ? 20 : 0);
}

/**
 * Somme des ratings des membres encore actifs de la bande — un héros Blessé
 * ne compte plus dans le rating global tant qu'il l'est, tout comme un
 * membre Mort.
 */
export function ratingTotal(roster: RosterInstance): number {
  return roster.membres
    .filter((m) => m.statut !== 'mort' && m.statut !== 'blesse')
    .reduce((acc, m) => acc + ratingMembre(m, roster), 0);
}
