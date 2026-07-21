// Base de référence complète de l'équipement Mordheim (toutes bandes et suppléments
// confondus), extraite du compendium "Place du Marché" (La Grande Librairie de
// Mordheim). Indépendante des catalogues de bande (src/data/warbands/) : sert de
// shop commun / référence croisée, pas encore branchée sur le roster.
import armesCorpsACorps from './armes_corps_a_corps.json';
import armesTir from './armes_tir.json';
import armesPoudreNoire from './armes_poudre_noire.json';
import munitions from './munitions.json';
import armures from './armures.json';
import objetsDivers from './objets_divers.json';
import consommables from './consommables.json';
import poisonsDrogues from './poisons_drogues.json';
import montures from './montures.json';
import vehicules from './vehicules.json';
import legend from './legend.json';

export const ITEMS_CORPS_A_CORPS = armesCorpsACorps;
export const ITEMS_TIR = armesTir;
export const ITEMS_POUDRE_NOIRE = armesPoudreNoire;
export const ITEMS_MUNITIONS = munitions;
export const ITEMS_ARMURES = armures;
export const ITEMS_DIVERS = objetsDivers;
export const ITEMS_CONSOMMABLES = consommables;
export const ITEMS_POISONS_DROGUES = poisonsDrogues;
export const ITEMS_MONTURES = montures;
export const ITEMS_VEHICULES = vehicules;
export const ITEMS_LEGEND = legend;

export const TOUS_LES_ITEMS = [
  ...armesCorpsACorps,
  ...armesTir,
  ...armesPoudreNoire,
  ...munitions,
  ...armures,
  ...objetsDivers,
  ...consommables,
  ...poisonsDrogues,
  ...montures,
  ...vehicules,
];

export const ITEMS_PAR_ID: Record<string, (typeof TOUS_LES_ITEMS)[number]> = Object.fromEntries(
  TOUS_LES_ITEMS.map((item) => [item.id, item])
);

export function getItem(id: string) {
  return ITEMS_PAR_ID[id];
}
