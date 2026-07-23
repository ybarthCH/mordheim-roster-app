// Prix de vente du wyrdstone (Place du Marché de Mordheim) : le prix total
// obtenu dépend à la fois du nombre de fragments vendus en un lot et du
// nombre de guerriers de la bande (plus la bande est grande, moins elle
// négocie bien). Table canonique unique, transcrite depuis le livret.
export type ColonneGuerriers = { min: number; max: number | null; label: string };

export const COLONNES_GUERRIERS: ColonneGuerriers[] = [
  { min: 1, max: 3, label: '1-3' },
  { min: 4, max: 6, label: '4-6' },
  { min: 7, max: 9, label: '7-9' },
  { min: 10, max: 12, label: '10-12' },
  { min: 13, max: 15, label: '13-15' },
  { min: 16, max: null, label: '16+' },
];

// Une ligne par nombre de fragments vendus ensemble (1 à 7), la dernière
// ligne couvrant 8 fragments ou plus.
export const TABLE_VENTE_WYRDSTONE: number[][] = [
  [45, 40, 35, 30, 30, 25],
  [60, 55, 50, 45, 40, 35],
  [75, 70, 65, 60, 55, 50],
  [90, 80, 70, 65, 60, 55],
  [110, 100, 90, 80, 70, 65],
  [120, 110, 100, 90, 80, 70],
  [145, 130, 120, 110, 100, 90],
  [155, 140, 130, 120, 110, 100],
];

export function indexColonneGuerriers(nbGuerriers: number): number {
  const i = COLONNES_GUERRIERS.findIndex((c) => nbGuerriers >= c.min && (c.max === null || nbGuerriers <= c.max));
  return i === -1 ? COLONNES_GUERRIERS.length - 1 : i;
}

export function indexLigneFragments(fragmentsVendus: number): number {
  return Math.min(Math.max(fragmentsVendus, 1), TABLE_VENTE_WYRDSTONE.length) - 1;
}

export function prixVenteWyrdstone(fragmentsVendus: number, nbGuerriers: number): number {
  if (fragmentsVendus <= 0) return 0;
  return TABLE_VENTE_WYRDSTONE[indexLigneFragments(fragmentsVendus)][indexColonneGuerriers(nbGuerriers)];
}
