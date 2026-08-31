import type { UiDictionary } from './types';

export const transformationModal: UiDictionary = {
  'transformation.buttonLabel': { fr: 'Devenir {nom} ({cout} po)', en: 'Become {nom} ({cout} gc)' },
  'transformation.title': { fr: 'Devenir {nom}', en: 'Become {nom}' },
  'transformation.body': {
    fr: "Contre {cout} po prélevés sur la trésorerie de la bande, ce personnage devient définitivement {nom} : accès équipement et compétences de son nouveau profil, expérience et caractéristiques déjà acquises conservées. Action irréversible.",
    en: 'For {cout} gc taken from the warband treasury, this fighter permanently becomes {nom}: equipment and skill access of the new profile, experience and characteristics already earned are kept. This cannot be undone.',
  },
  'transformation.insufficientTreasury': {
    fr: 'Trésorerie insuffisante ({disponible} po disponibles, {requis} po requis).',
    en: 'Not enough treasury ({disponible} gc available, {requis} gc required).',
  },
  'transformation.cancel': { fr: 'Annuler', en: 'Cancel' },
  'transformation.confirm': { fr: 'Confirmer ({cout} po)', en: 'Confirm ({cout} gc)' },
};
