// Grille de cases XP fidèle à la feuille de référence Mordheim.
// Héros : grille continue, paliers marqués en puissances de 2 (1, 2, 4, 8, 16, 32...).
// Hommes de main : 6 cases fixes, une par échelon (1 à 6 XP).

export const HENCHMAN_XP_BOXES = [1, 2, 3, 4, 5, 6];

const HERO_MIN_GRID = 32;

export function heroPaliers(upTo: number): number[] {
  const paliers: number[] = [];
  let v = 1;
  while (v <= upTo) {
    paliers.push(v);
    v *= 2;
  }
  return paliers;
}

/** Nombre total de cases à afficher pour un héros, incluant au moins un palier au-delà de l'XP actuelle. */
export function heroGridSize(xp: number): number {
  let size = HERO_MIN_GRID;
  while (size <= xp) {
    size *= 2;
  }
  return size;
}

export function isPalier(box: number): boolean {
  return (box & (box - 1)) === 0; // puissance de 2
}

/** Les seuils de palier franchis strictement entre oldXp (exclu) et newXp (inclus). */
export function paliersFranchis(oldXp: number, newXp: number): number[] {
  const out: number[] = [];
  let v = 1;
  while (v <= newXp) {
    if (v > oldXp) out.push(v);
    v *= 2;
  }
  return out;
}

/** Cases d'homme de main franchies entre oldXp (exclu) et newXp (inclus), plafonné à 6. */
export function casesHommeDeMainFranchies(oldXp: number, newXp: number): number[] {
  return HENCHMAN_XP_BOXES.filter((b) => b > oldXp && b <= newXp);
}

/** Nombre d'avancées dues au total pour un type de profil donné et une XP donnée. */
export function avancesDues(type: 'heros' | 'homme_de_main', xp: number): number {
  return type === 'heros' ? heroPaliers(xp).length : Math.min(xp, HENCHMAN_XP_BOXES.length);
}
