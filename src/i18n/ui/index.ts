import type { UiDictionary } from './types';
import { common } from './common';
import { listeBandesScreen } from './listeBandesScreen';
import { reglagesScreen } from './reglagesScreen';
import { creationBandeScreen } from './creationBandeScreen';

// Chaque écran ajoute son propre namespace ici au fur et à mesure de sa
// traduction (voir common.ts pour le format). Fusionné en un seul
// dictionnaire plat consommé par useLanguage().t(key).
export const uiDictionary: UiDictionary = {
  ...common,
  ...listeBandesScreen,
  ...reglagesScreen,
  ...creationBandeScreen,
};
