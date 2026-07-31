import type { UiDictionary } from './types';
import { common } from './common';

// Chaque écran ajoute son propre namespace ici au fur et à mesure de sa
// traduction (voir common.ts pour le format). Fusionné en un seul
// dictionnaire plat consommé par useLanguage().t(key).
export const uiDictionary: UiDictionary = {
  ...common,
};
