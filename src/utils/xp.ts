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

/**
 * Un profil 'animal' ne gagne jamais d'expérience, quel que soit
 * `gagne_experience`. Un profil 'heros'/'homme_de_main' peut aussi en être
 * explicitement exclu par ses propres règles (ex : Zombie, Squelette,
 * Enfant du Chaos) via `gagne_experience: false` dans les données de bande —
 * distinct de l'exclusion équivalente portée par les francs-tireurs
 * (voir `HiredSword.gagne_experience` dans data/hiredSwords.ts, vérifié
 * séparément par les appelants).
 */
export function peutGagnerExperience(
  profil: { type: 'heros' | 'homme_de_main' | 'animal'; gagne_experience?: boolean } | null | undefined
): boolean {
  if (!profil) return true;
  if (profil.type === 'animal') return false;
  return profil.gagne_experience !== false;
}

export function isPalierHero(box: number): boolean {
  return HERO_XP_PALIERS.includes(box);
}

export function isPalierHenchman(box: number): boolean {
  return HENCHMAN_XP_PALIERS.includes(box);
}

/**
 * Nombre d'avancées dues entre l'XP de départ (non déclencheur, acquise à la
 * recrue) et l'XP actuelle. Seuls les paliers strictement au-delà de l'XP de
 * départ comptent. Les animaux ne gagnent jamais d'expérience.
 *
 * `demiXp` : bande à progression ralentie (ex : Mangeurs d'Hommes) — chaque
 * case de la grille vaut 2 points d'XP réels, donc chaque palier (exprimé en
 * numéro de case) doit être atteint à 2x sa valeur en XP réelle.
 */
export function avancesDues(
  type: 'heros' | 'homme_de_main' | 'animal',
  xpDepart: number,
  xpActuel: number,
  demiXp = false
): number {
  if (type === 'animal') return 0;
  const paliers = type === 'heros' ? HERO_XP_PALIERS : HENCHMAN_XP_PALIERS;
  const facteur = demiXp ? 2 : 1;
  return paliers.filter((p) => p * facteur > xpDepart && p * facteur <= xpActuel).length;
}

/**
 * Nombre d'avancées déjà résolues à comparer à `avancesDues()`. Exclut les
 * jets "bonus" (Ce gars est doué, hors grille XP normale) et "promotion"
 * eux-mêmes — mais surtout, ne compte que les entrées POSTÉRIEURES à la
 * dernière promotion (voir AvanceeModal.confirmerPromotion, qui reset
 * `xp_depart` à l'XP courante lors d'une promotion Homme de main → Héros).
 * Les avancées gagnées avant la promotion l'ont été sur l'ancienne grille
 * (hommes de main) avec un ancien point de départ ; les compter ici
 * masquerait à tort une avancée pourtant due sur la nouvelle grille héros.
 */
export function avancesObtenues(historique: { type: string; bonus?: boolean }[]): number {
  const indexPromotion = historique.findLastIndex((a) => a.type === 'promotion');
  const pertinentes = indexPromotion === -1 ? historique : historique.slice(indexPromotion + 1);
  return pertinentes.filter((a) => !a.bonus && a.type !== 'promotion').length;
}
