// Base de référence complète de l'équipement Mordheim (toutes bandes et suppléments
// confondus), extraite du compendium "Place du Marché" (La Grande Librairie de
// Mordheim). Indépendante des catalogues de bande (src/data/warbands/) : sert de
// Place du marché, accessible à l'achat depuis la fiche personnage (voir utils/shop.ts).
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
import artefactsMagiques from './artefacts_magiques.json';


// Un seul point d'entrée exporté : la liste agrégée + son index par id. Les
// douze constantes par catégorie (ITEMS_ARMURES, ITEMS_TIR...) qui vivaient
// ici n'étaient importées nulle part ; l'une d'elles, ITEMS_LEGEND, exposait
// même un legend.json volontairement absent de TOUS_LES_ITEMS, donc
// introuvable via getItem.
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
  ...artefactsMagiques,
];

export const ITEMS_PAR_ID: Record<string, (typeof TOUS_LES_ITEMS)[number]> = Object.fromEntries(
  TOUS_LES_ITEMS.map((item) => [item.id, item])
);

export function getItem(id: string) {
  return ITEMS_PAR_ID[id];
}
