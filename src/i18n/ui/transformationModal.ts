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
  'transformation.departButtonLabel': { fr: 'Quitte la bande', en: 'Leaves the warband' },
  'transformation.departTitle': { fr: 'Quitte la bande', en: 'Leaves the warband' },
  'transformation.departBody': {
    fr: "La bande compte déjà un {nom} : ce personnage ne peut pas le devenir à son tour. Il quitte donc la bande définitivement, sans contrepartie.",
    en: 'The warband already has a {nom}: this fighter cannot become one too. He therefore leaves the warband for good, with no compensation.',
  },
  'transformation.departConfirm': { fr: 'Confirmer le départ', en: 'Confirm departure' },
};
