// Quantité de pierre magique trouvée (Procédure d'exploration) : la somme
// des D6 lancés (1 par héros ayant survécu, +1 en cas de victoire, plus les
// dés dûs aux compétences/équipement, 6 dés maximum) donne le nombre de
// fragments de wyrdstone trouvés. Table canonique, transcrite depuis le
// livret.
export type PalierFragmentsTrouves = { min: number; max: number | null; fragments: number };

export const TABLE_FRAGMENTS_TROUVES: PalierFragmentsTrouves[] = [
  { min: 1, max: 5, fragments: 1 },
  { min: 6, max: 11, fragments: 2 },
  { min: 12, max: 17, fragments: 3 },
  { min: 18, max: 24, fragments: 4 },
  { min: 25, max: 30, fragments: 5 },
  { min: 31, max: 35, fragments: 6 },
  { min: 36, max: null, fragments: 7 },
];

export function fragmentsTrouves(sommeDes: number): number {
  if (sommeDes <= 0) return 0;
  const palier = TABLE_FRAGMENTS_TROUVES.find((p) => sommeDes >= p.min && (p.max === null || sommeDes <= p.max));
  return palier ? palier.fragments : TABLE_FRAGMENTS_TROUVES[TABLE_FRAGMENTS_TROUVES.length - 1].fragments;
}
