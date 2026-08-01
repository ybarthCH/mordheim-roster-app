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
import { blessureGraveWizard } from './blessureGraveWizard';
import { postBatailleShared } from './postBatailleShared';
import { etapeEntretien } from './etapeEntretien';
import { etapeResultat } from './etapeResultat';
import { etapeResume } from './etapeResume';
import { rechercheDramatisPersonaeModal } from './rechercheDramatisPersonaeModal';
import { rechercheObjetRareModal } from './rechercheObjetRareModal';
import { etapeGainXp } from './etapeGainXp';
import { etapeExploration } from './etapeExploration';
import { evenementExploration } from './evenementExploration';
import { etapeCommerce } from './etapeCommerce';
import { postBatailleScreen } from './postBatailleScreen';
import { catalogueReference } from './catalogueReference';
import { skillCategories } from './skillCategories';
import { statFullNames } from './statFullNames';

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
  ...blessureGraveWizard,
  ...postBatailleShared,
  ...etapeEntretien,
  ...etapeResultat,
  ...etapeResume,
  ...rechercheDramatisPersonaeModal,
  ...rechercheObjetRareModal,
  ...etapeGainXp,
  ...etapeExploration,
  ...evenementExploration,
  ...etapeCommerce,
  ...postBatailleScreen,
  ...catalogueReference,
  ...skillCategories,
  ...statFullNames,
};
