import type { UiDictionary } from './types';
import { common } from './common';
import { listeBandesScreen } from './listeBandesScreen';
import { reglagesScreen } from './reglagesScreen';
import { creationBandeScreen } from './creationBandeScreen';
import { rosterScreen } from './rosterScreen';
import { recruterFrancTireurScreen } from './recruterFrancTireurScreen';
import { personnageScreen } from './personnageScreen';
import { personnageCards } from './personnageCards';
import { personnageModalsSmall } from './personnageModalsSmall';
import { recompenseSeigneurDesOmbres } from './recompenseSeigneurDesOmbres';
import { achatEquipementModal } from './achatEquipementModal';
import { avanceeModal } from './avanceeModal';

// Chaque écran ajoute son propre namespace ici au fur et à mesure de sa
// traduction (voir common.ts pour le format). Fusionné en un seul
// dictionnaire plat consommé par useLanguage().t(key).
export const uiDictionary: UiDictionary = {
  ...common,
  ...listeBandesScreen,
  ...reglagesScreen,
  ...creationBandeScreen,
  ...rosterScreen,
  ...recruterFrancTireurScreen,
  ...personnageScreen,
  ...personnageCards,
  ...personnageModalsSmall,
  ...recompenseSeigneurDesOmbres,
  ...achatEquipementModal,
  ...avanceeModal,
};
