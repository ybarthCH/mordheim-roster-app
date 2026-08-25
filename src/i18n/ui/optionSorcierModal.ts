import type { UiDictionary } from './types';

export const optionSorcierModal: UiDictionary = {
  'optionSorcier.buttonLabel': { fr: 'Option Sorcier ({cout} po)', en: 'Wizard option ({cout} gc)' },
  'optionSorcier.title': { fr: 'Devenir Sorcier', en: 'Become a Wizard' },
  'optionSorcier.body': {
    fr: "Contre {cout} po prélevés sur la trésorerie de la bande, ce héros gagne l'accès à la Magie mineure. Choisissez son premier sort ci-dessous.",
    en: "For {cout} gc taken from the warband's treasury, this hero gains access to Lesser Magic. Choose their first spell below.",
  },
  'optionSorcier.spellLabel': { fr: 'Premier sort', en: 'First spell' },
  'optionSorcier.insufficientTreasury': {
    fr: 'Trésorerie insuffisante ({disponible} po disponibles, {requis} po requis).',
    en: 'Not enough treasury ({disponible} gc available, {requis} gc required).',
  },
  'optionSorcier.cancel': { fr: 'Annuler', en: 'Cancel' },
  'optionSorcier.confirm': { fr: 'Confirmer ({cout} po)', en: 'Confirm ({cout} gc)' },
};
