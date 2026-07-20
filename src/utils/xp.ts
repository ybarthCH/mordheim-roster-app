// Grille de cases XP fidèle à la feuille de référence Mordheim.
// Héros : 90 cases (3 lignes de 30), paliers d'avancement aux seuils exacts
// de la table de référence (espacement croissant, pas des puissances de 2).
// Hommes de main : 14 cases, paliers aux positions 2, 5, 9, 14.

export const HERO_XP_MAX = 90;
export const HERO_XP_PALIERS = [
  2, 4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 41, 46, 51, 57, 63, 69, 76, 83, 90,
];

export const HENCHMAN_XP_MAX = 14;
export const HENCHMAN_XP_PALIERS = [2, 5, 9, 14];

export function isPalierHero(box: number): boolean {
  return HERO_XP_PALIERS.includes(box);
}

export function isPalierHenchman(box: number): boolean {
  return HENCHMAN_XP_PALIERS.includes(box);
}

/** Nombre d'avancées dues au total pour un type de profil donné et une XP donnée. */
export function avancesDues(type: 'heros' | 'homme_de_main', xp: number): number {
  const paliers = type === 'heros' ? HERO_XP_PALIERS : HENCHMAN_XP_PALIERS;
  return paliers.filter((p) => p <= xp).length;
}
